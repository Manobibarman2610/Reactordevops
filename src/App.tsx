import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { ScenarioHeader } from './components/ScenarioHeader.js';
import { DeploymentInspector } from './components/DeploymentInspector.js';
import { HindsightExplorer } from './components/HindsightExplorer.js';
import { DeploymentsTable } from './components/DeploymentsTable.js';
import { DevOpsAgentChat } from './components/DevOpsAgentChat.js';
import { CustomDeploymentModal } from './components/CustomDeploymentModal.js';
import { Deployment, HindsightMemory, HindsightBank, MemoryGraph } from './types/reactor.js';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'memory' | 'history' | 'agent'>('pipeline');
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
      showNotification('Deployment #27 analyzed: Recalled Deployment #1 with 92% similarity');
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
      showNotification(`Scenario loaded: ${data.deployment.commitMessage}`);
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
      showNotification('Reset to baseline seed deployments and memories');
    } catch (err: any) {
      showNotification(`Error resetting state: ${err.message}`);
    }
  };

  const handleSelectDeployment = (id: string) => {
    const dep = deployments.find(d => d.id === id);
    if (dep) {
      setActiveDeployment(dep);
      setActiveTab('pipeline');
    }
  };

  const handleViewHistoricalDeployment = (depNumber: number) => {
    const dep = deployments.find(d => d.number === depNumber);
    if (dep) {
      setActiveDeployment(dep);
      showNotification(`Viewing historical Deployment #${depNumber} incident record`);
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
      showNotification('Deployment outcome recorded and retained into Hindsight');
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
      showNotification('Memory entry retained into Hindsight bank');
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
      showNotification(`Custom deployment #${data.deployment.number} ingested`);
    } catch (err: any) {
      showNotification(`Analysis error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ec] text-[#0d0c0b] flex flex-col font-sans selection:bg-[#0a0908] selection:text-white antialiased">
      {/* 1. Fixed Chrome Navigation Bar */}
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

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#0a0908] text-white px-5 py-3 text-xs shadow-xl flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Viewport Content with Spacious, Unattached Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-16 space-y-10">
        {/* Tab 1: Pre-Flight Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-10">
            <ScenarioHeader
              onRunCoreStory={handleRunCoreStory}
              onRunScenario={handleRunScenario}
              onReset={handleReset}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
              isAnalyzing={isAnalyzing}
            />

            {activeDeployment ? (
              <DeploymentInspector
                deployment={activeDeployment}
                onRecordOutcome={handleRecordOutcome}
                isSubmittingOutcome={isSubmittingOutcome}
                onViewHistoricalDeployment={handleViewHistoricalDeployment}
              />
            ) : (
              <div className="studio-card p-12 text-center space-y-4 bg-white border border-[rgba(13,12,11,0.12)]">
                <ShieldCheck className="h-10 w-10 text-[rgba(13,12,11,0.4)] mx-auto" />
                <h3 className="text-base font-medium text-[#0d0c0b]">No Deployment Selected</h3>
                <p className="text-xs text-[rgba(13,12,11,0.6)] max-w-sm mx-auto">
                  Select a simulation above or trigger Deployment #27 to inspect pre-flight risk.
                </p>
                <button
                  onClick={handleRunCoreStory}
                  className="pill text-xs !h-9 !px-4"
                >
                  Run Deployment #27
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Hindsight Agent Memory Explorer */}
        {activeTab === 'memory' && (
          <div className="space-y-8">
            <div className="space-y-2 pb-2">
              <div className="text-xs font-mono text-[rgba(13,12,11,0.5)] uppercase tracking-wider">
                Organizational Knowledge Layer
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-[#0d0c0b]">
                Hindsight Memory Banks
              </h1>
              <p className="text-sm text-[rgba(13,12,11,0.65)] max-w-2xl leading-relaxed">
                Query the long-term semantic memory layer to view recalled incident graphs, dependency histories, and verified remediation patterns.
              </p>
            </div>

            <HindsightExplorer
              memories={hindsightMemories}
              banks={hindsightBanks}
              graph={hindsightGraph}
              onRecallQuery={handleRecallQuery}
              onRetainMemory={handleRetainMemory}
              isLoadingRecall={isLoadingRecall}
            />
          </div>
        )}

        {/* Tab 3: Historical Deployment Ledger */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[rgba(13,12,11,0.5)] uppercase tracking-wider">
                  Audit Trail
                </div>
                <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-[#0d0c0b]">
                  Deployment Ledger
                </h1>
                <p className="text-sm text-[rgba(13,12,11,0.65)] max-w-2xl leading-relaxed">
                  Historical log of deployments, downstream blast radiuses, and post-incident retentions.
                </p>
              </div>

              <div className="text-xs font-mono text-[rgba(13,12,11,0.5)]">
                {deployments.length} deployments indexed
              </div>
            </div>

            <DeploymentsTable
              deployments={deployments}
              selectedDeploymentId={activeDeployment?.id || null}
              onSelectDeployment={handleSelectDeployment}
            />
          </div>
        )}

        {/* Tab 4: DevOps Agent Q&A */}
        {activeTab === 'agent' && (
          <div className="space-y-8">
            <div className="space-y-2 pb-2">
              <div className="text-xs font-mono text-[rgba(13,12,11,0.5)] uppercase tracking-wider">
                Engineering Assistant
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-[#0d0c0b]">
                DevOps Knowledge Agent
              </h1>
              <p className="text-sm text-[rgba(13,12,11,0.65)] max-w-2xl leading-relaxed">
                Ask questions regarding historical outages, dependency incompatibilities, and preventative remediations.
              </p>
            </div>

            <DevOpsAgentChat />
          </div>
        )}
      </main>

      {/* Ingest Custom Deployment Modal */}
      <CustomDeploymentModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomDeployment}
        isAnalyzing={isAnalyzing}
      />

      {/* Studio Footer from Cast & Render spec */}
      <footer className="w-full border-t border-[rgba(13,12,11,0.08)] bg-[#eae7e0]/60 py-8 px-6 text-xs text-[rgba(13,12,11,0.5)] font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 font-mono">
            <span className="font-semibold text-[#0d0c0b]">REACTOR</span>
            <span>&middot;</span>
            <span>112 Deployment Lane</span>
            <span>&middot;</span>
            <span>Continuous Memory Loop</span>
          </div>
          <div>
            Powered by Hindsight long-term agent memory
          </div>
        </div>
      </footer>
    </div>
  );
}
