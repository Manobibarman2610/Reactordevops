import React, { useState } from 'react';
import { RotateCcw, Plus, Play, Info, ShieldAlert, Cpu, Database, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface ScenarioHeaderProps {
  onRunCoreStory: () => void;
  onRunScenario: (scenario: string) => void;
  onReset: () => void;
  onOpenCustomModal: () => void;
  isAnalyzing: boolean;
  viewMode: 'friendly' | 'technical';
}

export const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  onRunCoreStory,
  onRunScenario,
  onReset,
  onOpenCustomModal,
  isAnalyzing,
  viewMode
}) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="studio-card p-6 md:p-8 space-y-6">
      {/* Eyebrow & Plain-English Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[rgba(13,12,11,0.5)] font-mono">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Continuous Memory Pipeline</span>
          <span>&middot;</span>
          <span>Deployment Safety Guard</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-[-0.03em] text-[#0d0c0b] leading-[1.1] max-w-3xl">
          {viewMode === 'friendly' 
            ? 'Never make the same production mistake twice.'
            : 'Pre-flight deployment verification via Hindsight organizational memory.'}
        </h1>

        <p className="text-sm md:text-base text-[rgba(13,12,11,0.7)] max-w-2xl leading-relaxed">
          {viewMode === 'friendly' ? (
            <>
              Every time an engineer prepares to ship code, <strong>REACTOR</strong> checks if that exact update caused a website crash, payment failure, or database freeze in the past—stopping outages <em>before</em> they reach customers.
            </>
          ) : (
            <>
              Automated pre-flight gate evaluating pull requests against past post-mortems, AST diffs, schema migrations, and infrastructure drift using semantic vector recall.
            </>
          )}
        </p>

        {/* Friendly "How it works in 30 seconds" accordion */}
        <div className="pt-1">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="text-xs text-[rgba(13,12,11,0.65)] hover:text-[#0d0c0b] inline-flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
          >
            <Info className="h-3.5 w-3.5 text-amber-600" />
            <span>How does this protect my team in 3 simple steps?</span>
            {showHowItWorks ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {showHowItWorks && (
            <div className="mt-3 p-4 rounded-xl bg-[#fafaf8] border border-[rgba(13,12,11,0.1)] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
              <div className="space-y-1 p-2">
                <div className="font-semibold text-[#0d0c0b] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0d0c0b] text-white text-[10px]">1</span>
                  <span>Code is Submitted</span>
                </div>
                <p className="text-[rgba(13,12,11,0.65)] leading-relaxed">
                  A developer updates a library, edits a database table, or tunes server settings in a Pull Request.
                </p>
              </div>

              <div className="space-y-1 p-2">
                <div className="font-semibold text-[#0d0c0b] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white text-[10px]">2</span>
                  <span>Memory Vault Scans</span>
                </div>
                <p className="text-[rgba(13,12,11,0.65)] leading-relaxed">
                  Hindsight searches every past post-mortem to see if this exact change crashed the site months ago.
                </p>
              </div>

              <div className="space-y-1 p-2">
                <div className="font-semibold text-[#0d0c0b] flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">3</span>
                  <span>Pre-Flight Warning</span>
                </div>
                <p className="text-[rgba(13,12,11,0.65)] leading-relaxed">
                  Before code goes live, the engineer receives an early warning with the exact copy-paste fix to deploy safely.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Scenario Launchpad */}
      <div className="space-y-2 pt-2 border-t border-[rgba(13,12,11,0.08)]">
        <div className="flex items-center justify-between text-[11px] font-mono text-[rgba(13,12,11,0.5)] uppercase tracking-wider">
          <span>Choose a Simulation to Test:</span>
          <span>Click to run pre-flight check</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Scenario 1: Core Story #27 */}
          <button
            onClick={onRunCoreStory}
            disabled={isAnalyzing}
            className="p-3.5 rounded-xl border text-left transition-all cursor-pointer bg-[#0d0c0b] text-white hover:bg-black shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-amber-300 flex items-center gap-1">
                <Play className="w-3 h-3 fill-amber-300" />
                <span>Core Demo</span>
              </span>
              <span className="font-mono text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800">
                92% Outage Match
              </span>
            </div>
            <div className="font-semibold text-xs leading-snug">
              Prevent Repeat Crash (PR #27)
            </div>
            <div className="text-[11px] text-white/70 mt-1 line-clamp-2">
              Engineer bumps database driver. Memory catches 92% match to a 45-min checkout outage.
            </div>
          </button>

          {/* Scenario 2: DB Column Drift */}
          <button
            onClick={() => onRunScenario('prisma_drift')}
            disabled={isAnalyzing}
            className="p-3.5 rounded-xl border border-[rgba(13,12,11,0.12)] text-left transition-all cursor-pointer bg-white/90 hover:bg-white hover:border-[#0d0c0b] shadow-xs group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#0d0c0b] flex items-center gap-1">
                <Database className="w-3 h-3 text-[rgba(13,12,11,0.5)]" />
                <span>Database Risk</span>
              </span>
              <span className="font-mono text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                Table Lock
              </span>
            </div>
            <div className="font-semibold text-xs text-[#0d0c0b] leading-snug">
              Frozen Database Column
            </div>
            <div className="text-[11px] text-[rgba(13,12,11,0.65)] mt-1 line-clamp-2">
              Adding a mandatory column risks locking the database and freezing user requests for 47s.
            </div>
          </button>

          {/* Scenario 3: Memory Reduction */}
          <button
            onClick={() => onRunScenario('k8s_memory_reduction')}
            disabled={isAnalyzing}
            className="p-3.5 rounded-xl border border-[rgba(13,12,11,0.12)] text-left transition-all cursor-pointer bg-white/90 hover:bg-white hover:border-[#0d0c0b] shadow-xs group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#0d0c0b] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[rgba(13,12,11,0.5)]" />
                <span>Performance Risk</span>
              </span>
              <span className="font-mono text-[10px] bg-red-50 text-red-800 px-1.5 py-0.5 rounded border border-red-200">
                Server Crash Loop
              </span>
            </div>
            <div className="font-semibold text-xs text-[#0d0c0b] leading-snug">
              Cut Server RAM by 50%
            </div>
            <div className="text-[11px] text-[rgba(13,12,11,0.65)] mt-1 line-clamp-2">
              Tight memory limits risk crash-looping servers during heavy morning shopping traffic.
            </div>
          </button>

          {/* Scenario 4: Ingest Custom PR */}
          <button
            onClick={onOpenCustomModal}
            className="p-3.5 rounded-xl border border-dashed border-[rgba(13,12,11,0.2)] text-left transition-all cursor-pointer bg-[#fafaf8] hover:bg-white hover:border-[#0d0c0b] shadow-xs group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#0d0c0b] flex items-center gap-1">
                  <Plus className="w-3 h-3 text-[rgba(13,12,11,0.6)]" />
                  <span>Custom Test</span>
                </span>
                <span className="font-mono text-[10px] text-[rgba(13,12,11,0.5)]">
                  Simulate
                </span>
              </div>
              <div className="font-semibold text-xs text-[#0d0c0b] leading-snug">
                Test Your Own Changes
              </div>
              <div className="text-[11px] text-[rgba(13,12,11,0.65)] mt-1 line-clamp-2">
                Type any library name, version bump, or database migration to test the AI.
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-[rgba(13,12,11,0.45)] flex items-center justify-between">
              <span>Open modal &rarr;</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                disabled={isAnalyzing}
                className="text-[rgba(13,12,11,0.5)] hover:text-[#0d0c0b] underline"
                title="Reset simulation to seeds"
              >
                Reset
              </button>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
