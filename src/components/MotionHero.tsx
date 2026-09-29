import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, History, Database, Layers, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Terminal, GitBranch } from 'lucide-react';
import skyImage from '../assets/images/ethereal_sky_clouds_1790623321135.jpg';

interface MotionHeroProps {
  onRunCoreStory: () => void;
  onRunScenario: (scenario: string) => void;
  onReset: () => void;
  onOpenCustomModal: () => void;
  onSelectTab: (tab: 'pipeline' | 'memory' | 'history' | 'agent' | 'deliverables') => void;
  isAnalyzing: boolean;
  hindsightStats: { memoryCount: number; bankCount: number };
}

export const MotionHero: React.FC<MotionHeroProps> = ({
  onRunCoreStory,
  onRunScenario,
  onReset,
  onOpenCustomModal,
  onSelectTab,
  isAnalyzing,
  hindsightStats
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/80 my-2">
      {/* 1. Atmospheric Ethereal Sky Horizon Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={skyImage}
          alt="Ethereal Atmospheric Sky"
          className="w-full h-full object-cover object-top opacity-55 scale-105 filter blur-[0.5px] transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Soft Vignette and Smooth Gradient Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-[#080c14]/80 to-[#080c14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      {/* 2. Hero Content Container */}
      <div className="relative z-10 px-6 sm:px-10 pt-10 sm:pt-14 pb-10 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 border border-white/15 text-slate-300 text-xs font-mono backdrop-blur-xl shadow-lg mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-semibold text-amber-300">ORGANIZATIONAL MEMORY</span>
          <span className="text-slate-600">·</span>
          <span>Zero-Amnesia DevOps Pipeline</span>
        </motion.div>

        {/* Main Headline with Instrument Serif Italic Accent */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          The AI DevOps{' '}
          <span className="font-serif italic font-normal text-amber-200 drop-shadow-sm px-1">
            Engineer
          </span>{' '}
          That Remembers Every Deployment.
        </motion.h1>

        {/* Subtitle / Core Promise */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed"
          style={{ textWrap: 'balance' }}
        >
          Standard CI/CD systems only ask <em className="text-slate-400 not-italic font-mono text-xs sm:text-sm bg-black/40 px-1.5 py-0.5 rounded border border-white/10">"Did this build pass?"</em>{' '}
          REACTOR additionally asks{' '}
          <span className="text-amber-200 font-medium">
            "Have we seen this type of change before, what broke last time, and how do we prevent the next outage?"
          </span>
        </motion.p>

        {/* Action Button Controls (Motion Pill Style) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRunCoreStory}
            disabled={isAnalyzing}
            className="group relative flex items-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-semibold rounded-full bg-slate-950 text-white border border-amber-500/40 shadow-xl shadow-amber-500/20 hover:border-amber-400 hover:shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950">
              <Zap className={`h-3 w-3 fill-current ${isAnalyzing ? 'animate-spin' : ''}`} />
            </div>
            <span>{isAnalyzing ? 'Recalling Past Failure...' : 'Run Deployment #27 (Core Story)'}</span>
            <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRunScenario('prisma_drift')}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 backdrop-blur-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Prisma Lock Drift</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRunScenario('k8s_memory_reduction')}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 backdrop-blur-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>K8s OOM Quota</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenCustomModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
          >
            <GitBranch className="h-3.5 w-3.5 text-slate-400" />
            <span>Custom Ingest</span>
          </motion.button>

          <button
            onClick={onReset}
            disabled={isAnalyzing}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 underline-offset-4 hover:underline transition-all cursor-pointer"
          >
            Reset Seed Data
          </button>
        </motion.div>

        {/* 3. Floating Interactive Preview Cards (Motionsites signature) */}
        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Card 1: Historical Incident (#1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('history')}
            className="group relative rounded-2xl border border-red-900/40 bg-[#0d1320]/80 backdrop-blur-xl p-4 sm:p-5 shadow-xl hover:border-red-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Deployment #1 Outage
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800/40">
                  HISTORICAL FAIL
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors">
                  checkout-api · pg 8.7 → 8.11
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  PostgreSQL TLS handshake dropped connections in AWS RDS. Pool drained within 4 mins.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/60 border border-red-900/30 p-2.5 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-slate-400">Root Cause: AWS RDS CA bundle missing</div>
                <div className="text-emerald-400">Resolution: Injected global-bundle.pem + max=12</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Retained into Hindsight</span>
              <span className="text-red-400 font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Audit record →
              </span>
            </div>
          </motion.div>

          {/* Card 2: Current Safeguard (#27) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={onRunCoreStory}
            className="group relative rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 via-[#0d1320]/90 to-[#0d1320] backdrop-blur-xl p-4 sm:p-5 shadow-2xl hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Deployment #27 Recall
                </span>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/50 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  92% Match
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                  checkout-api · pg 8.11.3 Bump
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  CI passed mock tests, but REACTOR recalled Deployment #1 and flagged the impending TLS pool exhaustion.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/70 border border-amber-500/30 p-2.5 text-[11px] font-mono text-amber-200 space-y-1">
                <div className="text-amber-400 font-medium">Pre-Flight Safeguard Triggered:</div>
                <div className="text-slate-300">Run: pg_isready -h $RDS_HOST --tls</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-amber-300">Actionable Checklist Ready</span>
              <span className="text-amber-400 font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Run inspection →
              </span>
            </div>
          </motion.div>

          {/* Card 3: Hindsight Memory Bank & Vector Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onSelectTab('memory')}
            className="group relative rounded-2xl border border-cyan-900/40 bg-[#0d1320]/80 backdrop-blur-xl p-4 sm:p-5 shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" />
                  Hindsight Long-Term Memory
                </span>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                  {hindsightStats.memoryCount} MEMORIES
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Continuous Learning Loop
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every outcome, fix verification, and engineer feedback is retained as a permanent node in the organizational memory graph.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950/60 border border-cyan-900/30 p-2.5 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-cyan-300">Banks: core · db · k8s · canary</div>
                <div className="text-slate-400">Recall Latency: &lt;280ms · Top-K: 5</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Inspect Memory Explorer</span>
              <span className="text-cyan-400 font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Open graph →
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
