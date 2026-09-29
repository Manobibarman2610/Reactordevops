import React from 'react';
import { motion } from 'motion/react';
import { Database, ShieldAlert, Cpu, Terminal, FileText, RefreshCw, Zap, Plus, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'pipeline' | 'memory' | 'history' | 'agent' | 'deliverables';
  setActiveTab: (tab: 'pipeline' | 'memory' | 'history' | 'agent' | 'deliverables') => void;
  onOpenCustomModal: () => void;
  onRunCoreStory: () => void;
  isAnalyzing: boolean;
  hindsightStats: { memoryCount: number; bankCount: number };
}

interface TabItem {
  id: 'pipeline' | 'memory' | 'history' | 'agent' | 'deliverables';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomModal,
  onRunCoreStory,
  isAnalyzing,
  hindsightStats
}) => {
  const tabs: TabItem[] = [
    { id: 'pipeline', label: 'Pipeline', icon: ShieldAlert },
    { id: 'memory', label: 'Memory Bank', icon: Database, badge: hindsightStats.memoryCount },
    { id: 'history', label: 'Ledger', icon: RefreshCw },
    { id: 'agent', label: 'DevOps Agent', icon: Terminal },
    { id: 'deliverables', label: 'Docs & Deliverables', icon: FileText }
  ];

  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-3 z-50 w-full px-3 sm:px-6 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 p-2 pl-3 sm:pl-4 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/60 pointer-events-auto transition-all">
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('pipeline')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Cpu className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              REACTOR
            </span>
            <span className="hidden md:inline text-[10px] text-slate-400 font-mono tracking-wider">
              · HINDSIGHT
            </span>
          </div>
        </div>

        {/* Floating Minimalist Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/15 shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`h-3.5 w-3.5 relative z-10 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="relative z-10 font-mono text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full border border-slate-700/60">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRunCoreStory}
            disabled={isAnalyzing}
            className="relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap hover:shadow-amber-500/40"
            title="Execute Core Story: Deployment #1 vs Deployment #27"
          >
            {isAnalyzing && (
              <motion.span
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="absolute inset-0 bg-white/30 -skew-x-12"
              />
            )}
            <Zap className={`h-3 w-3 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Recalling...' : 'Run #27'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCustomModal}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-3 w-3 text-slate-400" />
            <span>Diff</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Tab Scroller */}
      <div className="flex md:hidden mt-2 justify-center pointer-events-auto">
        <div className="flex overflow-x-auto px-2 py-1 gap-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-lg no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white font-medium border border-white/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
};
