import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar.js';
import { MotionHero } from './components/MotionHero.js';
import { DeploymentInspector } from './components/DeploymentInspector.js';
import { HindsightExplorer } from './components/HindsightExplorer.js';
import { DeploymentsTable } from './components/DeploymentsTable.js';
import { DevOpsAgentChat } from './components/DevOpsAgentChat.js';
import { CustomDeploymentModal } from './components/CustomDeploymentModal.js';
import { ContentDeliverablesModal } from './components/ContentDeliverablesModal.js';
import { Deployment, HindsightMemory, HindsightBank, MemoryGraph } from './types/reactor.js';
import { ShieldCheck, Activity, Database, CheckCircle, AlertTriangle, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'memory' | 'history' | 'agent' | 'deliverables'>('pipeline');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [activeDeployment, setActiveDeployment] = useState<Deployment | null>(null);
  
  const [hindsightMemories, setHindsightMemories] = useState<HindsightMemory[]>([]);
  const [hindsightBanks, setHindsightBanks] = useState<HindsightBank[]>([]);
  const [hindsightGraph, setHindsightGraph] = useState<MemoryGraph>({ nodes: [], edges: [] });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);
  const [isLoadingRecall, setIsLoadingRecall] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      const [depRes, memRes, bankRes, graphRes] = await Promise.all([
        fetch('/api/deployments'),
        fetch('/api/hindsight/memories'),
        fetch('/api/hindsight/banks'),
        fetch('/api/hindsight/graph')
      ]);

      const depData: Deployment[] = await depRes.json();
      const memData: HindsightMemory[] = await memRes.json();
      const bankData: HindsightBank[] = await bankRes.json();
      const graphData: MemoryGraph = await graphRes.json();

      setDeployments(depData);
      setHindsightMemories(memData);
      setHindsightBanks(bankData);
      setHindsightGraph(graphData);

      // Default to Deployment #27 or latest
      if (!activeDeployment && depData.length > 0) {
        const dep27 = depData.find(d => d.number === 27);
        setActiveDeployment(dep27 || depData[0]);
      }
    } catch (err) {
      console.error('Failed to load reactor data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Run the Core Product Story: Deployment #1 vs Deployment #27
  const handleRunCoreStory = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/deployments/trigger-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'deployment_27_core_story' })
      });
      const data = await res.json();
      await loadData();
      setActiveDeployment(data.deployment);
      setActiveTab('pipeline');
      showNotification('Deployment #27 triggered! Hindsight recalled Deployment #1 with 92% similarity.');
      
      // Smooth scroll to inspector
      const el = document.getElementById('workspace-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunScenario = async (scenario: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/deployments/trigger-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      const data = await res.json();
      await loadData();
      setActiveDeployment(data.deployment);
      setActiveTab('pipeline');
      showNotification(`Scenario triggered: ${data.deployment.commitMessage}`);

      const el = document.getElementById('workspace-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      showNotification(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/deployments/reset', { method: 'POST' });
      await loadData();
      setActiveDeployment(null);
      showNotification('State reset to baseline seed deployments and memories.');
    } catch (err: any) {
      showNotification(`Error resetting state: ${err.message}`);
    }
  };

  const handleSelectDeployment = (id: string) => {
    const dep = deployments.find(d => d.id === id);
    if (dep) {
      setActiveDeployment(dep);
      setActiveTab('pipeline');
      const el = document.getElementById('workspace-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewHistoricalDeployment = (depNumber: number) => {
    const dep = deployments.find(d => d.number === depNumber);
    if (dep) {
      setActiveDeployment(dep);
      showNotification(`Inspecting historical Deployment #${depNumber} incident record.`);
      const el = document.getElementById('workspace-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRecordOutcome = async (data: any) => {
    if (!activeDeployment) return;
    setIsSubmittingOutcome(true);
    try {
      const res = await fetch(`/api/deployments/${activeDeployment.id}/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      await loadData();
      setActiveDeployment(result.deployment);
      showNotification(`Continuous learning loop complete: Memory retained into Hindsight!`);
    } catch (err: any) {
      showNotification(`Error retaining outcome: ${err.message}`);
    } finally {
      setIsSubmittingOutcome(false);
    }
  };

  const handleRecallQuery = async (query: string, bankId?: string) => {
    setIsLoadingRecall(true);
    try {
      const res = await fetch('/api/hindsight/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, bankId, threshold: 0.20, topK: 5 })
      });
      return await res.json();
    } catch (err: any) {
      showNotification(`Recall error: ${err.message}`);
      return null;
    } finally {
      setIsLoadingRecall(false);
    }
  };

  const handleRetainMemory = async (memoryData: Partial<HindsightMemory>) => {
    try {
      await fetch('/api/hindsight/retain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryData)
      });
      await loadData();
      showNotification('Post-mortem retained into Hindsight memory bank.');
    } catch (err: any) {
      showNotification(`Retain error: ${err.message}`);
    }
  };

  const handleCustomDeployment = async (customData: any) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/deployments/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customData)
      });
      const data = await res.json();
      await loadData();
      setActiveDeployment(data.deployment);
      setActiveTab('pipeline');
      showNotification(`Custom deployment #${data.deployment.number} ingested and evaluated!`);
      const el = document.getElementById('workspace-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      showNotification(`Analysis error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200 antialiased">
      {/* 1. Floating Pill Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onRunCoreStory={handleRunCoreStory}
        isAnalyzing={isAnalyzing}
        hindsightStats={{
          memoryCount: hindsightMemories.length,
          bankCount: hindsightBanks.length
        }}
      />

      {/* Floating Animated Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-950 text-slate-100 px-5 py-3 text-xs font-semibold shadow-2xl border border-amber-500/40 flex items-center gap-2.5 backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-8">
        {/* Motionsites-Inspired Atmospheric Hero */}
        <MotionHero
          onRunCoreStory={handleRunCoreStory}
          onRunScenario={handleRunScenario}
          onReset={handleReset}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onSelectTab={setActiveTab}
          isAnalyzing={isAnalyzing}
          hindsightStats={{
            memoryCount: hindsightMemories.length,
            bankCount: hindsightBanks.length
          }}
        />

        {/* Section Anchor */}
        <div id="workspace-section" className="pt-2">
          {/* Workspace Sub-Header with Active Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {activeTab === 'pipeline' && 'Pre-Flight Pipeline & Inspector'}
                {activeTab === 'memory' && 'Hindsight Agent Memory Explorer'}
                {activeTab === 'history' && 'Deployment History & Incident Audit'}
                {activeTab === 'agent' && 'DevOps Knowledge Agent Terminal'}
                {activeTab === 'deliverables' && 'Official Submission Deliverables'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTab === 'pipeline' && 'Active deployment risk evaluation, similarity comparison with historical outages, and verification checklist.'}
                {activeTab === 'memory' && 'Interactive semantic memory queries, vector similarity banks, and knowledge graph visualization.'}
                {activeTab === 'history' && 'Immutable historical deployment ledger with root causes and downstream blast radius.'}
                {activeTab === 'agent' && 'Ask questions regarding historical outages, dependency incompatibilities, and preventative remediations.'}
                {activeTab === 'deliverables' && 'Technical deep-dive article, viral LinkedIn post, and video walkthrough script.'}
              </p>
            </div>

            {/* Quick Filter Pill Controls */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/60 border border-white/5 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${activeTab === 'pipeline' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Pipeline
              </button>
              <button
                onClick={() => setActiveTab('memory')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${activeTab === 'memory' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Memory ({hindsightMemories.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${activeTab === 'history' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Ledger ({deployments.length})
              </button>
              <button
                onClick={() => setActiveTab('agent')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${activeTab === 'agent' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Agent Chat
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher with Animated Transition */}
        <AnimatePresence mode="wait">
          {/* Tab 1: Pre-Flight Pipeline & Inspector */}
          {activeTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {activeDeployment ? (
                <DeploymentInspector
                  deployment={activeDeployment}
                  onRecordOutcome={handleRecordOutcome}
                  isSubmittingOutcome={isSubmittingOutcome}
                  onViewHistoricalDeployment={handleViewHistoricalDeployment}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0d131f]/90 p-12 text-center space-y-3 shadow-xl">
                  <ShieldCheck className="h-10 w-10 text-amber-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Active Deployment Selected</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Click 'Run Deployment #27 (Core Story)' above to trigger pre-flight analysis with Hindsight recall.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunCoreStory}
                    className="px-5 py-2.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    Run Deployment #27 Now
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 2: Hindsight Agent Memory Explorer */}
          {activeTab === 'memory' && (
            <motion.div
              key="memory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <HindsightExplorer
                memories={hindsightMemories}
                banks={hindsightBanks}
                graph={hindsightGraph}
                onRecallQuery={handleRecallQuery}
                onRetainMemory={handleRetainMemory}
                isLoadingRecall={isLoadingRecall}
              />
            </motion.div>
          )}

          {/* Tab 3: Historical Deployment Ledger */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <DeploymentsTable
                deployments={deployments}
                selectedDeploymentId={activeDeployment?.id || null}
                onSelectDeployment={handleSelectDeployment}
              />
            </motion.div>
          )}

          {/* Tab 4: DevOps Knowledge Agent Chat Terminal */}
          {activeTab === 'agent' && (
            <motion.div
              key="agent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <DevOpsAgentChat />
            </motion.div>
          )}

          {/* Tab 5: Hackathon Deliverables Viewer */}
          {activeTab === 'deliverables' && (
            <motion.div
              key="deliverables"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ContentDeliverablesModal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Ingest Custom Deployment Modal */}
      <CustomDeploymentModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomDeployment}
        isAnalyzing={isAnalyzing}
      />

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-white/5 bg-[#05080e] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">REACTOR</span>
            <span>·</span>
            <span>The AI DevOps Engineer That Remembers Every Deployment</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Hindsight Agent Memory · Continuous Learning Loop · Zero-Amnesia CI/CD
          </div>
        </div>
      </footer>
    </div>
  );
}
