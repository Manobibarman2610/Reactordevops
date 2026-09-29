import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Copy, Check, Share2, Video, Linkedin, BookOpen, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const ContentDeliverablesModal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'article' | 'linkedin' | 'video' | 'architecture'>('article');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const articleMarkdown = `# The AI DevOps Engineer That Remembers Every Deployment: Building Persistent Organizational Memory with Hindsight

Every senior engineer knows the feeling: a deployment goes out, production lights up with alerts, and someone in Slack whispers, *"Wait, didn't this exact same thing happen three months ago when we updated that library?"*

The answer is almost always yes. Modern software delivery pipelines run thousands of automated checks, but traditional CI/CD engines are fundamentally amnesiac. They can verify if TypeScript compiles and if unit tests pass, but they have zero memory of what happened the last time you touched that database connection pool, modified that TLS handshake configuration, or updated that specific driver.

To fix this, we built **REACTOR**: an AI-powered DevOps intelligence platform that transforms raw deployment diffs, build failures, and post-mortems into active, long-term organizational memory. Instead of building another ephemeral chatbot or static log viewer, we integrated [Hindsight](https://github.com/vectorize-io/hindsight), an open-source agent memory system developed by Vectorize, directly into our continuous delivery loop.

Here is how we designed and deployed it, the memory architecture that powers it, and what we learned when we stopped treating agent memory as a disposable prompt trick.

---

## The Core Problem: Why Stateless CI/CD Fails Teams

A deployment is never just lines of code. It is an intricate web of dependency versions, environment variable bindings, Docker base layers, Kubernetes cgroup boundaries, and database locks. 

Consider a real failure pattern from our own infrastructure:
1. **Deployment #1**: A routine minor update of the \`pg\` PostgreSQL driver from version \`8.7.3\` to \`8.11.1\` in our \`checkout-api\` service. The code compiled cleanly, unit tests mocked the database layer, and CI gave a green checkmark.
2. In production, AWS RDS PostgreSQL required TLS. Version \`8.8+\` of \`pg\` introduced a silent default change enforcing strict TLS validation (\`rejectUnauthorized: true\`). Under production traffic spikes, the pool clients hit SSL renegotiation errors, completely draining the connection pool within four minutes and knocking out the checkout service.
3. The on-call engineers scrambled, diagnosed the root cause, updated the configuration with the AWS CA certificate bundle, tuned connection limits down to 12 clients, and verified the fix.

Six weeks later:
Another engineer opened a pull request to optimize checkout performance, updating \`pg\` to \`8.11.3\`. 

In a conventional setup, the new engineer would repeat the exact same failure. Why? Because the post-mortem lived in a forgotten Notion document or an archived incident ticket. The CI runner only answered: *"Did the code compile?"*

With REACTOR, the pipeline answers a deeper question: **"Have we seen this type of deployment change before, what failed last time, and what must the engineer verify before shipping?"**

---

## System Architecture: The Hindsight Memory Loop

We rejected the pattern of throwing massive prompt dumps into LLM context windows. Prompt stuffing is expensive, unstructured, and cannot scale across hundreds of microservices.

Instead, we built a closed-loop memory architecture powered by [Hindsight agent memory](https://vectorize.io/what-is-agent-memory).

When a deployment event is triggered, our Event Normalizer extracts granular primitives: modified dependencies, environment variable changes, Kubernetes resource limits, and migration scripts.

### 1. Pre-Deployment Semantic Recall
Before the code reaches staging or production, REACTOR queries Hindsight:

\`\`\`typescript
const recallResult = await hindsight.recall({
  bankId: 'reactor-production-memory',
  query: \`Service: checkout-api. Dependencies: pg from 8.7.3 to 8.11.3.\`,
  threshold: 0.20,
  topK: 4,
  tags: ['checkout-api', 'pg', 'postgres', 'tls']
});
\`\`\`

### 2. Synthesizing Risk and Actionable Checklists
REACTOR recalls Deployment #1 with 92% confidence and generates actionable verification commands (\`openssl s_client -connect $PGHOST:5432 -starttls postgres\`) rather than vague warnings.

### 3. Closing the Loop: Retaining Verified Outcomes
When the engineer verifies the fix in a canary stage, REACTOR writes the verified resolution into Hindsight via \`hindsight.retain()\`. The memory bank is permanently smarter for the next engineer.

Explore the [Hindsight documentation](https://hindsight.vectorize.io/) and GitHub repository at [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight).`;

  const linkedinPost = `Every engineering team has experienced this: you ship a "routine" dependency upgrade, production database connections drop out, and you spend 4 hours debugging the exact issue someone solved 3 months ago.

Most CI/CD pipelines are completely amnesiac. They check if code compiles, but remember nothing about what broke in production last time.

We built REACTOR using Hindsight agent memory to fix this:
1. Normalizes deployment diffs across code, dependencies, and DB migrations
2. Recalls related failure memories & post-mortems via Hindsight before rollout
3. Evaluates blast radius and generates copy-paste verification commands
4. Retains engineer outcomes into permanent organizational memory

When Deployment #27 upgraded our PostgreSQL driver, REACTOR recalled Deployment #1's TLS pool starvation, caught a missing CA bundle, and prevented a production outage.

Code & architecture in repo.

#AIAgents #Hindsight #AgentMemory #DevOps #AIMemory`;

  const videoScript = `# REACTOR 3-Minute Screen-Recorded Demo Script

Recommended Titles:
1. How We Gave Our CI/CD Pipeline Long-Term Memory (Using Hindsight)
2. Why CI/CD Forgets Everything — Building an AI DevOps Agent with Memory
3. The AI DevOps Engineer That Remembers Every Deployment Failure
4. We Stopped Repeating Deployment Outages with Hindsight Agent Memory
5. Watch an AI Agent Catch a Production Outage by Recalling Deployment #1

---

0:00 - 0:30 Intro: Introduce REACTOR - "The AI DevOps Engineer That Remembers Every Deployment". Traditional CI/CD checks syntax but has zero memory of past outages.
0:30 - 1:00 The Problem: Inspect Deployment #1 failure (pg upgrade TLS RDS pool starvation).
1:00 - 2:30 Live Demo: Trigger Deployment #27. Show Hindsight recall, 92% similarity match, verification commands, and the Continuous Learning Retain loop!
2:30 - 3:00 Key Takeaway: Real agent memory turns episodic post-mortems into an active engineering safety net.`;

  const subTabs = [
    { id: 'article', label: 'Technical Article', icon: BookOpen, subtext: '1,300 words' },
    { id: 'linkedin', label: 'LinkedIn / X Post', icon: Linkedin, subtext: '<800 chars' },
    { id: 'video', label: '3-Min Video Script', icon: Video, subtext: 'Script & cues' },
    { id: 'architecture', label: 'Architecture Diagram', icon: ImageIcon, subtext: 'Memory pipeline' }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Sub-navigation tabs with modern styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] text-slate-500 font-mono hidden md:inline">({tab.subtext})</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <a
            href="https://github.com/vectorize-io/hindsight"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-300 flex items-center gap-1.5 font-mono text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
          >
            <span>Hindsight GitHub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Content Panes */}
      {activeSubTab === 'article' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-6 shadow-xl shadow-black/30 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <span className="font-mono text-[11px] text-amber-400 uppercase font-bold tracking-wider">
                Part 1: The Article · Target 800–1,500 words
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                The AI DevOps Engineer That Remembers Every Deployment
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyText('article', articleMarkdown)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700/80"
            >
              {copiedKey === 'article' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Full Markdown</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-sans text-xs space-y-3 max-h-[600px] overflow-y-auto pr-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-bold text-slate-200">Required Links Embedded: </span>
              <a href="https://github.com/vectorize-io/hindsight" className="text-amber-400 hover:underline">Hindsight GitHub</a> ·{' '}
              <a href="https://hindsight.vectorize.io/" className="text-amber-400 hover:underline">Hindsight Docs</a> ·{' '}
              <a href="https://vectorize.io/what-is-agent-memory" className="text-amber-400 hover:underline">Vectorize Agent Memory</a>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
              {articleMarkdown}
            </pre>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'linkedin' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-6 shadow-xl shadow-black/30 space-y-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <span className="font-mono text-[11px] text-amber-400 uppercase font-bold tracking-wider">
                Part 2: The Social Post · Andrej Karpathy Tone
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                LinkedIn / X Technical Post (680 characters)
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyText('linkedin', linkedinPost)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700/80"
            >
              {copiedKey === 'linkedin' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Post Text</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {linkedinPost}
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 pt-1 font-mono">
            <div>✓ No mention of hackathon in title or body</div>
            <div>✓ Concrete before / after contrast (Deployment #1 vs #27)</div>
            <div>✓ First 2 lines hook without hashtags or links</div>
            <div>✓ Length: 680 characters (compliant with &lt;800 character limit)</div>
          </div>
        </motion.div>
      )}

      {activeSubTab === 'video' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-6 shadow-xl shadow-black/30 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <span className="font-mono text-[11px] text-amber-400 uppercase font-bold tracking-wider">
                Part 3: The Video · 3-Minute Walkthrough & Script
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Screen Recording Cues & Narration
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => copyText('video', videoScript)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700/80"
            >
              {copiedKey === 'video' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied Script</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Video Script</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {videoScript}
          </div>
        </motion.div>
      )}

      {activeSubTab === 'architecture' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-6 shadow-xl shadow-black/30 space-y-4"
        >
          <div className="pb-3 border-b border-slate-800/80">
            <span className="font-mono text-[11px] text-amber-400 uppercase font-bold tracking-wider">
              System Architecture & Memory Pipeline
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Hindsight Closed-Loop Memory Flow
            </h3>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-black flex items-center justify-center">
            <img
              src="/src/assets/images/reactor_arch_flow_1790618924633.jpg"
              alt="REACTOR Hindsight Memory Architecture"
              referrerPolicy="no-referrer"
              className="w-full max-h-[420px] object-cover"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-amber-400 font-bold">Continuous DevOps Memory Loop:</div>
            <div>1. CI/CD Event Ingestion (PR / Deployment Webhook)</div>
            <div>2. Event Normalizer (Extracts dependencies, migrations, Dockerfile, k8s manifests)</div>
            <div>3. Hindsight Semantic & Associative Recall (Queries long-term memory bank)</div>
            <div>4. REACTOR AI Agent Analysis (Synthesizes risk, past root causes & blast radius)</div>
            <div>5. Pre-Flight Verification Checklist (OpenSSL / SQL / connection pool checks)</div>
            <div>6. Continuous Learning Retain (Engineer feedback & outcomes saved to Hindsight)</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
