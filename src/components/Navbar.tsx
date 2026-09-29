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
  viewMode: 'friendly' | 'technical';
  setViewMode: (mode: 'friendly' | 'technical') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomModal,
  onRunCoreStory,
  isAnalyzing,
  hindsightStats,
  viewMode,
  setViewMode
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

      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-4 md:px-10 py-3 bg-white/90 backdrop-blur-xl border-b border-[rgba(13,12,11,0.08)] shadow-sm">
        {/* Brand Mark with Cast & Render Star */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center gap-2.5 text-left group cursor-pointer text-[#0d0c0b]"
          >
            <span className="text-base text-[#0d0c0b] opacity-80 group-hover:rotate-45 transition-transform duration-300" aria-hidden="true">
              &#10037;
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[#0d0c0b]">
              REACTOR
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[rgba(13,12,11,0.5)] font-mono pl-2 border-l border-[rgba(13,12,11,0.15)]">
              Safety Guard
            </span>
          </button>
        </div>

        {/* Navigation Tabs - Friendly + Tech */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`text-xs tracking-tight transition-all cursor-pointer flex items-center gap-1.5 py-1 ${
              activeTab === 'pipeline'
                ? 'text-[#0d0c0b] font-semibold border-b-2 border-[#0d0c0b]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            <span>Pre-Flight Check</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`text-xs tracking-tight transition-all cursor-pointer flex items-center gap-1.5 py-1 ${
              activeTab === 'memory'
                ? 'text-[#0d0c0b] font-semibold border-b-2 border-[#0d0c0b]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            <span>Memory Vault</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[rgba(13,12,11,0.08)] text-[rgba(13,12,11,0.7)]">
              {hindsightStats.memoryCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`text-xs tracking-tight transition-all cursor-pointer flex items-center gap-1.5 py-1 ${
              activeTab === 'history'
                ? 'text-[#0d0c0b] font-semibold border-b-2 border-[#0d0c0b]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            <span>Past Incidents</span>
          </button>

          <button
            onClick={() => setActiveTab('agent')}
            className={`text-xs tracking-tight transition-all cursor-pointer flex items-center gap-1.5 py-1 ${
              activeTab === 'agent'
                ? 'text-[#0d0c0b] font-semibold border-b-2 border-[#0d0c0b]'
                : 'text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b]'
            }`}
          >
            <span>DevOps AI Chat</span>
          </button>
        </nav>

        {/* Action Controls & Lens Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Plain English vs Tech Lens Toggle */}
          <div className="flex items-center bg-[#f0eee9] p-0.5 rounded-full border border-[rgba(13,12,11,0.12)] text-[11px] font-sans">
            <button
              onClick={() => setViewMode('friendly')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'friendly'
                  ? 'bg-white text-[#0d0c0b] font-medium shadow-sm'
                  : 'text-[rgba(13,12,11,0.55)] hover:text-[#0d0c0b]'
              }`}
              title="Show simple plain-English explanations and business impact"
            >
              <span>Plain English</span>
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'technical'
                  ? 'bg-[#0d0c0b] text-white font-medium shadow-sm'
                  : 'text-[rgba(13,12,11,0.55)] hover:text-[#0d0c0b]'
              }`}
              title="Show deep technical specifications, commands, and architecture"
            >
              <span>Tech Specs</span>
            </button>
          </div>

          <button
            onClick={onOpenCustomModal}
            className="hidden xl:inline-flex pill-outline !h-8 !px-3 text-xs gap-1"
            title="Ingest a custom PR / deployment payload"
          >
            <Plus className="w-3 h-3" />
            <span>Test PR</span>
          </button>

          <button
            onClick={onRunCoreStory}
            disabled={isAnalyzing}
            className="pill !h-8.5 !px-3.5 text-xs gap-1.5"
          >
            {isAnalyzing ? (
              <>
                <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white" />
                <span>Demo Outage #27</span>
              </>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
