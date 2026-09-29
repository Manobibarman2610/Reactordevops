import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, History, Terminal, Plus, Play, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'pipeline' | 'memory' | 'history' | 'agent';
  setActiveTab: (tab: 'pipeline' | 'memory' | 'history' | 'agent') => void;
  onOpenCustomModal: () => void;
  onRunCoreStory: () => void;
  isAnalyzing: boolean;
  hindsightStats: {
    memoryCount: number;
    bankCount: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomModal,
  onRunCoreStory,
  isAnalyzing,
  hindsightStats
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll meter hairline at the very top */}
      <div 
        className="top-meter" 
        style={{ transform: `scaleX(${scrollProgress})` }} 
      />

      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-6 md:px-12 py-3.5 bg-[#f2f0ec]/90 backdrop-blur-md border-b border-[rgba(13,12,11,0.08)]">
        {/* Brand Mark with Cast & Render Star */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center gap-2.5 text-left group cursor-pointer text-[#0d0c0b]"
          >
            <span className="text-base text-[#0d0c0b] opacity-80 group-hover:rotate-45 transition-transform duration-300" aria-hidden="true">
              &#10037;
            </span>
            <span className="text-[15px] font-medium tracking-tight text-[#0d0c0b]">
              REACTOR
            </span>
            <span className="hidden sm:inline-block text-xs text-[rgba(13,12,11,0.45)] tracking-normal pl-1 border-l border-[rgba(13,12,11,0.15)]">
              DevOps Memory
            </span>
          </button>
        </div>

        {/* Navigation Tabs - Clean, airy, unattached */}
        <nav className="flex items-center gap-6 md:gap-8">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`text-[14px] tracking-[-0.008em] transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'text-[#0d0c0b] font-medium underline underline-offset-8 decoration-[1.5px]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            Pre-Flight Inspector
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`text-[14px] tracking-[-0.008em] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'text-[#0d0c0b] font-medium underline underline-offset-8 decoration-[1.5px]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            <span>Hindsight Memory</span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-[rgba(13,12,11,0.06)] text-[rgba(13,12,11,0.7)]">
              {hindsightStats.memoryCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`text-[14px] tracking-[-0.008em] transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'text-[#0d0c0b] font-medium underline underline-offset-8 decoration-[1.5px]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            Audit Ledger
          </button>

          <button
            onClick={() => setActiveTab('agent')}
            className={`text-[14px] tracking-[-0.008em] transition-all cursor-pointer ${
              activeTab === 'agent'
                ? 'text-[#0d0c0b] font-medium underline underline-offset-8 decoration-[1.5px]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            Agent Chat
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCustomModal}
            className="hidden lg:inline-flex pill-outline !h-9 !px-3.5 text-xs gap-1.5"
            title="Ingest a custom PR / deployment payload"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest PR</span>
          </button>

          <button
            onClick={onRunCoreStory}
            disabled={isAnalyzing}
            className="pill !h-9 !px-4 text-xs gap-2"
          >
            {isAnalyzing ? (
              <>
                <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Recalling...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white" />
                <span>Test Deployment #27</span>
              </>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
