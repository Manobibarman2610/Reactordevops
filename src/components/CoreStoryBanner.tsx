import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, History, Database, Layers, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

interface CoreStoryBannerProps {
  onRunCoreStory: () => void;
  onRunScenario: (scenario: string) => void;
  onReset: () => void;
  isAnalyzing: boolean;
}

export const CoreStoryBanner: React.FC<CoreStoryBannerProps> = ({
  onRunCoreStory,
  onRunScenario,
  onReset,
  isAnalyzing
}) => {
  const steps = [
    {
      num: '1',
      title: 'Deployment #1 (Outage)',
      desc: "pg upgraded 8.7→8.11; AWS RDS TLS handshake failed, draining pool in 4m. Verified fix retained in Hindsight.",
      accent: 'border-red-800/50 bg-red-950/20 text-red-400',
      badge: 'bg-red-950 text-red-300 border-red-800/40'
    },
    {
      num: '2',
      title: 'Deployment #27 (Triggered)',
      desc: 'Weeks later, engineer upgrades pg to 8.11.3 in checkout-api. Normal CI tests pass with mock DB.',
      accent: 'border-amber-800/50 bg-amber-950/20 text-amber-400',
      badge: 'bg-amber-950 text-amber-300 border-amber-800/40'
    },
    {
      num: '3',
      title: 'Hindsight Semantic Recall',
      desc: 'REACTOR queries memory bank, matches #1 at 92% similarity, and extracts prevention checklist in 280ms.',
      accent: 'border-cyan-800/50 bg-cyan-950/20 text-cyan-400',
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-800/40'
    },
    {
      num: '4',
      title: 'Continuous Learning Loop',
      desc: 'Canary verification succeeds. Outcome and verified CA bundle config retained permanently into memory.',
      accent: 'border-emerald-800/50 bg-emerald-950/20 text-emerald-400',
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-800/40'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#111827]/90 via-[#0d131f]/95 to-[#090d15] p-5 sm:p-6 shadow-xl shadow-black/40 backdrop-blur-xl"
    >
      {/* Subtle decorative glowing blur */}
      <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-amber-400 font-mono shadow-sm">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="font-semibold">ORGANIZATIONAL MEMORY POWERED BY HINDSIGHT</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Zero-Amnesia Pipeline</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            The AI DevOps Engineer That Remembers Every Deployment
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Standard CI/CD systems only ask: <span className="text-slate-400 font-mono bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">"Did this build pass?"</span>{' '}
            REACTOR additionally asks: <span className="text-amber-300 font-medium bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">"Have we seen this type of change before, what failed last time, and what must we verify before shipping?"</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRunCoreStory}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <History className="h-4 w-4" />
            <span>Run Deployment #27 (Core Story)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRunScenario('prisma_drift')}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span>Prisma Lock Drift</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRunScenario('k8s_memory_reduction')}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>K8s OOM Quota</span>
          </motion.button>

          <button
            onClick={onReset}
            disabled={isAnalyzing}
            className="px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Reset to clean baseline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Animated Step Pipeline Progression */}
      <div className="mt-5 pt-4 border-t border-slate-800/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {steps.map((s, idx) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.35 }}
            whileHover={{ y: -2 }}
            className={`flex items-start gap-2.5 p-3 rounded-xl border backdrop-blur-sm transition-all ${s.accent}`}
          >
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 font-mono text-[10px] font-bold ${s.badge}`}>
              {s.num}
            </div>
            <div>
              <div className="font-semibold text-slate-100 flex items-center justify-between">
                <span>{s.title}</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-snug">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
