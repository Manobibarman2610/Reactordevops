import React, { useState } from 'react';
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
  Activity,
  Check,
  X
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
    <div className="space-y-8">
      {/* 1. Memory Banks Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[rgba(13,12,11,0.5)] uppercase tracking-wider">
            Active Memory Banks ({banks.length})
          </span>
          <button
            onClick={() => setShowRetainModal(true)}
            className="pill-outline text-xs !h-8 !px-3 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Retain Post-Mortem</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {banks.map((bank) => (
            <div
              key={bank.id}
              onClick={() => setSelectedBank(bank.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedBank === bank.id
                  ? 'bg-white border-[#0d0c0b] shadow-md ring-1 ring-[#0d0c0b]'
                  : 'bg-white/80 border-[rgba(13,12,11,0.12)] hover:border-[rgba(13,12,11,0.25)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-[#0d0c0b]">{bank.id}</span>
                <span className="text-[rgba(13,12,11,0.5)] font-mono text-[11px] tabular-nums">
                  {bank.memoryCount} memories
                </span>
              </div>

              <h3 className="text-base font-medium text-[#0d0c0b] mt-2">
                {bank.name}
              </h3>

              <p className="text-xs text-[rgba(13,12,11,0.65)] mt-1.5 line-clamp-2 leading-relaxed">
                {bank.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[rgba(13,12,11,0.06)] flex items-center justify-between text-[11px] text-[rgba(13,12,11,0.45)] font-mono">
                <span>Updated {new Date(bank.lastRetentionAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Semantic Recall Engine */}
      <section className="studio-card p-6 md:p-8 space-y-5 bg-white border border-[rgba(13,12,11,0.12)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(13,12,11,0.08)]">
          <div>
            <h3 className="text-base font-medium text-[#0d0c0b] tracking-tight flex items-center gap-2">
              <Search className="h-4 w-4 text-[rgba(13,12,11,0.6)]" />
              <span>Semantic Recall Tester</span>
            </h3>
            <p className="text-xs text-[rgba(13,12,11,0.6)] mt-0.5">
              Query organizational memory using error logs, package names, or configuration symptoms.
            </p>
          </div>

          {latencyMs !== null && (
            <span className="font-mono text-xs text-[#0d0c0b] bg-[rgba(13,12,11,0.05)] border border-[rgba(13,12,11,0.1)] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
              <Activity className="h-3 w-3 text-emerald-600" />
              <span>Recall Latency: {latencyMs}ms</span>
            </span>
          )}
        </div>

        <form onSubmit={handleRunRecall} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[rgba(13,12,11,0.4)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'pg upgrade TLS RDS pool starvation' or 'prisma migration lock'"
              className="w-full rounded-xl bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] pl-10 pr-4 py-2.5 text-xs text-[#0d0c0b] font-mono focus:outline-none focus:border-[#0d0c0b]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingRecall}
            className="pill text-xs !h-10 !px-5 shrink-0"
          >
            {isLoadingRecall ? 'Querying...' : 'Query Memory'}
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[rgba(13,12,11,0.6)] pt-1">
          <span className="text-[11px] text-[rgba(13,12,11,0.45)] font-mono">Suggested:</span>
          {[
            'pg postgres driver RDS TLS pool exhaustion',
            'Redis connection timeout circuit breaker',
            'Prisma migration lock table',
            'Kubernetes OOMKilled Node 20 heap limit',
            'Stripe webhook signature raw body'
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSearchQuery(preset)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#f4f2ee] hover:bg-[#eae7e0] text-[#0d0c0b] transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Recall Query Results */}
        {recallResults && (
          <div className="mt-5 pt-5 border-t border-[rgba(13,12,11,0.08)] space-y-4">
            <div className="text-xs font-semibold text-[#0d0c0b] uppercase tracking-wider font-mono">
              Recalled Matches ({recallResults.length})
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recallResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedMemory(item.memory)}
                  className="p-4 rounded-xl bg-[#fafaf8] border border-[rgba(13,12,11,0.1)] hover:border-[#0d0c0b] transition-all cursor-pointer space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-[#0d0c0b] truncate">{item.memory.title}</span>
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0d0c0b] text-white shrink-0">
                      {Math.round(item.score * 100)}% match
                    </span>
                  </div>

                  <p className="text-[rgba(13,12,11,0.7)] text-xs line-clamp-2 leading-relaxed">
                    {item.memory.summary}
                  </p>

                  <div className="space-y-0.5 pt-2 border-t border-[rgba(13,12,11,0.06)] text-[11px] text-[rgba(13,12,11,0.5)]">
                    {item.matchReasons?.slice(0, 2).map((reason: string, rIdx: number) => (
                      <div key={rIdx} className="truncate">&middot; {reason}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Memory Graph & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Retained Memory Entries */}
        <div className="lg:col-span-2 studio-card p-6 md:p-8 space-y-5 bg-white border border-[rgba(13,12,11,0.12)]">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(13,12,11,0.08)]">
            <h3 className="text-base font-medium text-[#0d0c0b] tracking-tight flex items-center gap-2">
              <Network className="h-4 w-4 text-[rgba(13,12,11,0.5)]" />
              <span>Retained Memories ({memories.length})</span>
            </h3>
            <span className="text-xs text-[rgba(13,12,11,0.5)] font-mono">
              Bank: {selectedBank}
            </span>
          </div>

          <div className="space-y-3">
            {memories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => setSelectedMemory(mem)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMemory?.id === mem.id
                    ? 'bg-[#fafaf8] border-[#0d0c0b] shadow-sm'
                    : 'bg-white border-[rgba(13,12,11,0.08)] hover:border-[rgba(13,12,11,0.2)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[rgba(13,12,11,0.5)]">
                      <span className="font-semibold text-[#0d0c0b]">{mem.id}</span>
                      <span>&middot;</span>
                      <span>{mem.metadata?.service || 'platform'}</span>
                    </div>
                    <h4 className="text-sm font-medium text-[#0d0c0b]">
                      {mem.title}
                    </h4>
                  </div>

                  <span className="text-[11px] font-mono text-[rgba(13,12,11,0.45)] shrink-0">
                    {new Date(mem.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-[rgba(13,12,11,0.7)] mt-2 line-clamp-2 leading-relaxed">
                  {mem.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-[rgba(13,12,11,0.06)]">
                  {mem.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4f2ee] text-[rgba(13,12,11,0.7)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Memory Inspector */}
        <div className="studio-card p-6 space-y-4 bg-white border border-[rgba(13,12,11,0.12)]">
          <div className="pb-3 border-b border-[rgba(13,12,11,0.08)]">
            <h4 className="text-sm font-medium text-[#0d0c0b] tracking-tight">
              Memory Detail Inspector
            </h4>
            <span className="text-xs text-[rgba(13,12,11,0.45)] font-mono">
              {selectedMemory ? selectedMemory.id : 'None selected'}
            </span>
          </div>

          {selectedMemory ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-mono text-[rgba(13,12,11,0.45)] block">Title</span>
                <span className="text-sm font-medium text-[#0d0c0b] block mt-0.5">{selectedMemory.title}</span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[rgba(13,12,11,0.45)] block">Executive Summary</span>
                <p className="text-[rgba(13,12,11,0.8)] mt-1 leading-relaxed">{selectedMemory.summary}</p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[rgba(13,12,11,0.45)] block">Full Retained Lesson</span>
                <p className="text-[rgba(13,12,11,0.75)] mt-1 leading-relaxed bg-[#fafaf8] p-3 rounded-lg border border-[rgba(13,12,11,0.08)]">
                  {selectedMemory.content}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[rgba(13,12,11,0.45)] block mb-1">Semantic Tags</span>
                <div className="flex flex-wrap gap-1">
                  {selectedMemory.tags.map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f4f2ee] text-[#0d0c0b]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[rgba(13,12,11,0.4)] italic">Select a memory from the left to inspect details</p>
          )}
        </div>
      </div>

      {/* Retain Post-Mortem Modal */}
      {showRetainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="studio-card w-full max-w-lg p-6 md:p-8 bg-white border border-[rgba(13,12,11,0.15)] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(13,12,11,0.08)]">
              <div>
                <h3 className="text-lg font-medium text-[#0d0c0b]">Retain Post-Mortem Lesson</h3>
                <p className="text-xs text-[rgba(13,12,11,0.5)]">Store an organizational safeguard into Hindsight</p>
              </div>
              <button 
                onClick={() => setShowRetainModal(false)}
                className="text-[rgba(13,12,11,0.5)] hover:text-[#0d0c0b] p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRetainSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS RDS TLS 1.3 CA Bundle Incompatibility"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] px-3 py-2 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                />
              </div>

              <div>
                <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1">Service &amp; Subsystem</label>
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] px-3 py-2 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                />
              </div>

              <div>
                <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1">Incident Content &amp; Verified Remedy</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what broke, the root cause, and how to verify it in pre-flight checks..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] p-3 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                />
              </div>

              <div>
                <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="postgres, ssl, rds, cert-bundle, pg8"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] px-3 py-2 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(13,12,11,0.08)]">
                <button
                  type="button"
                  onClick={() => setShowRetainModal(false)}
                  className="pill-outline text-xs !h-9 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill text-xs !h-9 !px-5"
                >
                  Save to Hindsight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
