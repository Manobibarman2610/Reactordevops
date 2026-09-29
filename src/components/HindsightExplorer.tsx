import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HindsightMemory, 
  HindsightBank, 
  MemoryGraph 
} from '../types/reactor.js';
import { 
  Database, 
  Search, 
  Network, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Tag, 
  Share2, 
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

interface HindsightExplorerProps {
  memories: HindsightMemory[];
  banks: HindsightBank[];
  graph: MemoryGraph;
  onRecallQuery: (query: string, bankId?: string) => Promise<any>;
  onRetainMemory: (memory: Partial<HindsightMemory>) => Promise<void>;
  isLoadingRecall: boolean;
}

export const HindsightExplorer: React.FC<HindsightExplorerProps> = ({
  memories,
  banks,
  graph,
  onRecallQuery,
  onRetainMemory,
  isLoadingRecall
}) => {
  const [searchQuery, setSearchQuery] = useState('pg postgres driver connection pool AWS RDS TLS');
  const [selectedBank, setSelectedBank] = useState<string>('reactor-production-memory');
  const [recallResults, setRecallResults] = useState<any[] | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<HindsightMemory | null>(memories[0] || null);

  // Manual retain modal state
  const [showRetainModal, setShowRetainModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newService, setNewService] = useState('checkout-api');

  const handleRunRecall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const res = await onRecallQuery(searchQuery, selectedBank);
    if (res && res.memories) {
      setRecallResults(res.memories);
      setLatencyMs(res.latencyMs);
    }
  };

  const handleRetainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    await onRetainMemory({
      bankId: selectedBank,
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      metadata: {
        service: newService,
        category: 'dependency_breakage',
        verifiedFix: true
      }
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowRetainModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* 1. Header & Memory Banks Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Database className="h-5 w-5" />
            </div>
            <span>Hindsight Agent Memory Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Durable organizational memory layer preserving deployment history, failure root causes, and verified fixes.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRetainModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer w-fit shadow-md shadow-black/30"
        >
          <Plus className="h-3.5 w-3.5 text-amber-400" />
          <span>Retain New Post-Mortem</span>
        </motion.button>
      </div>

      {/* Memory Banks Cards with Motion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {banks.map((bank) => (
          <motion.div
            key={bank.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedBank(bank.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
              selectedBank === bank.id
                ? 'bg-[#152033]/90 border-amber-500/70 shadow-lg shadow-amber-500/10'
                : 'bg-[#0d131f]/80 border-slate-800/80 hover:border-slate-700/80'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wide">
                Memory Bank
              </span>
              <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700/70 tabular-nums">
                {bank.memoryCount} memories
              </span>
            </div>

            <h3 className="text-sm font-bold text-white mt-1.5">
              {bank.name}
            </h3>

            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {bank.description}
            </p>

            <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="text-slate-400">{bank.id}</span>
              <span>Updated {new Date(bank.lastRetentionAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Interactive Semantic Recall Tester */}
      <motion.div
        layout
        className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-amber-400" />
              <span>Live Semantic Recall Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Query organizational memory using natural language, dependency names, or incident symptoms.
            </p>
          </div>

          {latencyMs !== null && (
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
            >
              <Activity className="h-3 w-3" />
              <span>Recall Latency: {latencyMs}ms</span>
            </motion.span>
          )}
        </div>

        <form onSubmit={handleRunRecall} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'pg upgrade TLS RDS pool starvation' or 'prisma migration ACCESS EXCLUSIVE'"
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/80 pl-10 pr-4 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoadingRecall}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoadingRecall ? 'Querying...' : 'Execute Recall'}
          </motion.button>
        </form>

        {/* Quick query presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
          <span className="text-[11px] font-medium text-slate-500">Suggested queries:</span>
          {[
            'pg postgres driver RDS TLS pool exhaustion',
            'Redis connection timeout circuit breaker',
            'Prisma migration lock table',
            'Kubernetes OOMKilled Node 20 heap limit',
            'Stripe webhook signature raw body'
          ].map((preset, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                setSearchQuery(preset);
              }}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border border-slate-800"
            >
              {preset}
            </motion.button>
          ))}
        </div>

        {/* Recall Query Results */}
        <AnimatePresence>
          {recallResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-3 border-t border-slate-800 space-y-3"
            >
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Recalled Memories ({recallResults.length} matches found above threshold)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recallResults.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedMemory(item.memory)}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white truncate">{item.memory.title}</span>
                      <span className="font-mono text-[11px] font-bold text-amber-400 shrink-0 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                        {Math.round(item.score * 100)}% Match
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                      {item.memory.summary}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-slate-800 text-[11px]">
                      {item.matchReasons?.slice(0, 2).map((reason: string, rIdx: number) => (
                        <div key={rIdx} className="text-slate-400 flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                          <span className="truncate">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. Memory Graph & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Organizational Memory Ledger */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Network className="h-4 w-4 text-amber-400" />
              <span>Retained Memories ({memories.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Bank: {selectedBank}
            </span>
          </div>

          <div className="space-y-2.5">
            {memories.map((mem) => (
              <motion.div
                key={mem.id}
                whileHover={{ y: -1 }}
                onClick={() => setSelectedMemory(mem)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMemory?.id === mem.id
                    ? 'bg-[#152033]/90 border-amber-500/70 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1">
                      <span className="text-amber-400 font-medium">{mem.metadata.service || 'platform'}</span>
                      <span>·</span>
                      <span>{new Date(mem.timestamp).toLocaleDateString()}</span>
                      {mem.metadata.deploymentNumber && (
                        <>
                          <span>·</span>
                          <span className="text-slate-300">Deployment #{mem.metadata.deploymentNumber}</span>
                        </>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-100">
                      {mem.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {mem.summary}
                    </p>
                  </div>

                  <div className="shrink-0 text-right space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 block border border-slate-700/60">
                      Recalled {mem.recallCount}x
                    </span>
                    {mem.metadata.verifiedFix && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Fix Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1">
                  {mem.tags.slice(0, 5).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                  {mem.tags.length > 5 && (
                    <span className="text-[10px] text-slate-500 font-mono">+{mem.tags.length - 5}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Col: Deep Memory Inspector */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Share2 className="h-4 w-4 text-amber-400" />
              <span>Memory Node Details</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Detailed retrospective retained in Hindsight.
            </p>
          </div>

          {selectedMemory ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Title</span>
                <div className="font-bold text-slate-100 mt-0.5 leading-snug">{selectedMemory.title}</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Memory Bank</span>
                <div className="font-mono text-amber-300 text-[11px] bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 inline-block mt-0.5">
                  {selectedMemory.bankId}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Full Content</span>
                <div className="mt-1 p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {selectedMemory.content}
                </div>
              </div>

              {selectedMemory.metadata.rootCause && (
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40">
                  <span className="text-red-300 font-bold block text-[11px]">Root Cause Then</span>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{selectedMemory.metadata.rootCause}</p>
                </div>
              )}

              {selectedMemory.metadata.resolution && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-emerald-300 font-bold block text-[11px]">Verified Resolution</span>
                  <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{selectedMemory.metadata.resolution}</p>
                </div>
              )}

              {selectedMemory.metadata.downstreamEffects && selectedMemory.metadata.downstreamEffects.length > 0 && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1 font-medium">Downstream Microservices</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedMemory.metadata.downstreamEffects.map((svc, i) => (
                      <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                <span>ID: {selectedMemory.id}</span>
                <span>Recalled: {selectedMemory.recallCount} times</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a memory to inspect details
            </div>
          )}
        </div>
      </div>

      {/* Manual Retain Modal */}
      <AnimatePresence>
        {showRetainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d131f] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-amber-500" />
                  <span>Retain Post-Mortem into Hindsight</span>
                </h3>
                <button
                  onClick={() => setShowRetainModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRetainSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Service</label>
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Memory Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 'Deployment #33: Kafka batch partition rebalance starvation'"
                    className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Detailed Incident Knowledge & Resolution</label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Describe what changed, what failed, root cause, verified fix, and downstream effects..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-700/80 p-3 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="kafka, partitions, rebalance, timeout, checkout-api"
                    className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowRetainModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    Retain to Memory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
