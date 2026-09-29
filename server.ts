import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { storageEngine } from './src/server/storage.js';
import { hindsightEngine } from './src/server/hindsight.js';
import { reactorAgent } from './src/server/agent.js';
import { Deployment } from './src/types/reactor.js';

dotenv.config();

export const app = express();
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'REACTOR',
    version: '1.0.0',
    hindsightConnected: true,
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Deployments
app.get('/api/deployments', (req, res) => {
  try {
    const list = storageEngine.getAllDeployments();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/deployments/:id', (req, res) => {
  try {
    const dep = storageEngine.getDeploymentById(req.params.id);
    if (!dep) return res.status(404).json({ error: 'Deployment not found' });
    res.json(dep);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze deployment (normalizes, queries Hindsight, evaluates risk)
app.post('/api/deployments/analyze', async (req, res) => {
  try {
    const body = req.body;
    let dep: Deployment;

    if (body.id && storageEngine.getDeploymentById(body.id)) {
      dep = storageEngine.getDeploymentById(body.id)!;
    } else {
      const nextNum = storageEngine.getNextDeploymentNumber();
      dep = {
        id: `dep-${Date.now()}`,
        number: body.number || nextNum,
        commitHash: body.commitHash || Math.random().toString(16).substring(2, 9),
        commitMessage: body.commitMessage || 'feat: automated pipeline deployment',
        author: body.author || { name: 'DevOps Engineer', email: 'engineer@reactor.io' },
        branch: body.branch || 'main',
        environment: body.environment || 'production',
        service: body.service || 'checkout-api',
        timestamp: new Date().toISOString(),
        status: 'pending_analysis',
        fileChanges: body.fileChanges || [],
        dependencyChanges: body.dependencyChanges || [],
        envVarChanges: body.envVarChanges || [],
        infraChanges: body.infraChanges || [],
        databaseChanges: body.databaseChanges || []
      };
      storageEngine.upsertDeployment(dep);
    }

    const assessment = await reactorAgent.analyzeDeployment(dep);
    res.json({ deployment: dep, assessment });
  } catch (err: any) {
    console.error('Error analyzing deployment:', err);
    res.status(500).json({ error: err.message });
  }
});

// Record deployment outcome & retain in Hindsight (Continuous learning loop)
app.post('/api/deployments/:id/outcome', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      outcomeStatus,
      engineerName,
      wasPredictionAccurate,
      actualOutcomeNotes,
      lessonsLearned,
      resolutionApplied,
      errorLogs
    } = req.body;

    const result = await reactorAgent.recordOutcomeAndFeedback({
      deploymentId: id,
      outcomeStatus: outcomeStatus || 'SUCCESS',
      engineerName: engineerName || 'Senior Platform Engineer',
      wasPredictionAccurate: wasPredictionAccurate ?? true,
      actualOutcomeNotes: actualOutcomeNotes || 'Deployment concluded according to risk mitigation checks.',
      lessonsLearned: lessonsLearned || 'Verified configuration against Hindsight historical memory before rollout.',
      resolutionApplied,
      errorLogs
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error recording outcome:', err);
    res.status(500).json({ error: err.message });
  }
});

// Quick Trigger Scenarios (e.g. Core Story: Deployment #27)
app.post('/api/deployments/trigger-scenario', async (req, res) => {
  try {
    const { scenario } = req.body;
    let dep: Deployment;

    if (scenario === 'deployment_27_core_story') {
      // The Core Product Story: Deployment #27 resembling Deployment #1
      dep = {
        id: 'dep-27',
        number: 27,
        commitHash: '9e3d82f',
        commitMessage: 'perf(checkout): upgrade pg postgres driver from 8.7.3 to 8.11.3 and tune connection pool',
        author: {
          name: 'Alex Rivera',
          email: 'arivera@reactor.io'
        },
        branch: 'main',
        environment: 'production',
        service: 'checkout-api',
        timestamp: new Date().toISOString(),
        status: 'pending_analysis',
        fileChanges: [
          { path: 'services/checkout/package.json', type: 'modified' },
          { path: 'services/checkout/src/db/connection.ts', type: 'modified' },
          { path: 'services/checkout/Dockerfile', type: 'modified' }
        ],
        dependencyChanges: [
          { name: 'pg', fromVersion: '8.7.3', toVersion: '8.11.3', isMajor: false, type: 'production' }
        ],
        envVarChanges: [
          { key: 'PG_MAX_POOL_CLIENTS', action: 'modified' }
        ],
        infraChanges: [
          { component: 'dockerfile', changeType: 'dockerfile', description: 'Updated base image node:20-alpine' }
        ],
        databaseChanges: []
      };
    } else if (scenario === 'prisma_drift') {
      dep = {
        id: `dep-${Date.now()}`,
        number: storageEngine.getNextDeploymentNumber(),
        commitHash: '4b7a11c',
        commitMessage: 'db(users): add organization_uuid NOT NULL column to enterprise profiles table',
        author: {
          name: 'Devon Lee',
          email: 'dlee@reactor.io'
        },
        branch: 'feat/org-multitenancy',
        environment: 'production',
        service: 'user-service',
        timestamp: new Date().toISOString(),
        status: 'pending_analysis',
        fileChanges: [
          { path: 'prisma/schema.prisma', type: 'modified' },
          { path: 'prisma/migrations/20260928_org_uuid/migration.sql', type: 'added' }
        ],
        dependencyChanges: [],
        envVarChanges: [],
        infraChanges: [],
        databaseChanges: [
          {
            migrationName: '20260928_org_uuid',
            type: 'schema',
            hasDestructiveOperations: true,
            details: 'ALTER TABLE enterprise_users ADD COLUMN org_uuid UUID NOT NULL'
          }
        ]
      };
    } else if (scenario === 'k8s_memory_reduction') {
      dep = {
        id: `dep-${Date.now()}`,
        number: storageEngine.getNextDeploymentNumber(),
        commitHash: '2e9c18a',
        commitMessage: 'infra(helm): scale down search-service memory request to 300Mi to reduce node group footprint',
        author: {
          name: 'Elena Rostova',
          email: 'erostova@reactor.io'
        },
        branch: 'infra/cost-optimization',
        environment: 'production',
        service: 'recommendation-engine',
        timestamp: new Date().toISOString(),
        status: 'pending_analysis',
        fileChanges: [
          { path: 'deploy/helm/search/values.yaml', type: 'modified' }
        ],
        dependencyChanges: [],
        envVarChanges: [],
        infraChanges: [
          { component: 'kubernetes', changeType: 'helm', description: 'Reduced memory limit from 1Gi to 300Mi' }
        ],
        databaseChanges: []
      };
    } else {
      // Default nominal feature deployment
      dep = {
        id: `dep-${Date.now()}`,
        number: storageEngine.getNextDeploymentNumber(),
        commitHash: 'f8120ab',
        commitMessage: 'feat(search): implement fuzzy product title matching with local cache',
        author: {
          name: 'Marcus Brody',
          email: 'mbrody@reactor.io'
        },
        branch: 'main',
        environment: 'production',
        service: 'search-service',
        timestamp: new Date().toISOString(),
        status: 'pending_analysis',
        fileChanges: [
          { path: 'services/search/src/fuzzy.ts', type: 'added' }
        ],
        dependencyChanges: [],
        envVarChanges: [],
        infraChanges: [],
        databaseChanges: []
      };
    }

    storageEngine.upsertDeployment(dep);
    const assessment = await reactorAgent.analyzeDeployment(dep);

    res.json({ deployment: dep, assessment });
  } catch (err: any) {
    console.error('Error triggering scenario:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reset all storage to seed state
app.post('/api/deployments/reset', (req, res) => {
  try {
    storageEngine.resetToSeed();
    res.json({ status: 'reset_success' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Hindsight Endpoints
app.get('/api/hindsight/memories', (req, res) => {
  try {
    const list = hindsightEngine.getAllMemories();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hindsight/banks', (req, res) => {
  try {
    const banks = hindsightEngine.listBanks();
    res.json(banks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hindsight/graph', (req, res) => {
  try {
    const graph = hindsightEngine.getMemoryGraph();
    res.json(graph);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hindsight/recall', async (req, res) => {
  try {
    const { query, threshold, topK, bankId, tags } = req.body;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });

    const result = await hindsightEngine.recall({
      query,
      threshold: threshold ? parseFloat(threshold) : undefined,
      topK: topK ? parseInt(topK) : undefined,
      bankId,
      tags
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hindsight/retain', async (req, res) => {
  try {
    const { title, content, summary, tags, metadata, bankId } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    const memory = await hindsightEngine.retain({
      bankId,
      title,
      content,
      summary,
      tags,
      metadata
    });

    res.json(memory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DevOps Knowledge Agent Chat
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const reply = await reactorAgent.askDevOpsAgent(message);
    res.json(reply);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize Vite in dev mode or static files in production
async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    // Indirect specifier so bundlers (Vercel serverless build) never pull Vite
    // into the function bundle — this dev-only branch never runs on Vercel.
    const viteSpecifier = 'vite';
    const { createServer: createViteServer } = await import(viteSpecifier);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[REACTOR] Server running on http://0.0.0.0:${PORT}`);
  });
}

// On Vercel the app is exported from api/[...slug].ts and served as a
// serverless function (static assets come from dist/), so don't bind a port.
if (!process.env.VERCEL) {
  startServer();
}
