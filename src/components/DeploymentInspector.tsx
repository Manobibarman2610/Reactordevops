import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Deployment, 
  VerificationCheckItem 
} from '../types/reactor.js';
import { 
  AlertTriangle, 
  CheckCircle2, 
  GitCommit, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  ShieldAlert, 
  Database, 
  BrainCircuit, 
  Share2, 
  Clock, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface DeploymentInspectorProps {
  deployment: Deployment;
  onRecordOutcome: (data: {
    outcomeStatus: 'SUCCESS' | 'FAILURE' | 'DEGRADED';
    engineerName: string;
    wasPredictionAccurate: boolean;
    actualOutcomeNotes: string;
    lessonsLearned: string;
    resolutionApplied?: string;
  }) => Promise<void>;
  isSubmittingOutcome: boolean;
  onViewHistoricalDeployment?: (depNumber: number) => void;
}

export const DeploymentInspector: React.FC<DeploymentInspectorProps> = ({
  deployment,
  onRecordOutcome,
  isSubmittingOutcome,
  onViewHistoricalDeployment
}) => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<VerificationCheckItem[]>(
    deployment.riskAssessment?.verificationChecklist || []
  );

  // Outcome submission state
  const [outcomeStatus, setOutcomeStatus] = useState<'SUCCESS' | 'FAILURE' | 'DEGRADED'>('SUCCESS');
  const [engineerName, setEngineerName] = useState('Sarah Chen (Staff DevOps)');
  const [wasPredictionAccurate, setWasPredictionAccurate] = useState(true);
  const [actualOutcomeNotes, setActualOutcomeNotes] = useState(
    'Applied verification checks: verified AWS global-bundle.pem certificate path in Dockerfile and tuned connection pool max to 12. Canary deployment at 5% traffic ran with 0 pool dropouts.'
  );
  const [lessonsLearned, setLessonsLearned] = useState(
    'Always package AWS RDS global CA bundle when updating pg driver past 8.8. Verified fix prevented repeat of Deployment #1 outage.'
  );

  const risk = deployment.riskAssessment;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const toggleCheckItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRecordOutcome({
      outcomeStatus,
      engineerName,
      wasPredictionAccurate,
      actualOutcomeNotes,
      lessonsLearned,
      resolutionApplied: outcomeStatus === 'SUCCESS' ? 'Verified with pre-flight checklist and canary rollout' : 'Deployment encountered issues'
    });
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPct = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* 1. Deployment Ingestion Header */}
      <motion.div
        layout
        className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1.5">
              <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50">
                DEPLOYMENT #{deployment.number}
              </span>
              <span>·</span>
              <span className="text-slate-200 font-semibold">{deployment.service}</span>
              <span>·</span>
              <span className="uppercase text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
                {deployment.environment}
              </span>
              <span>·</span>
              <span>{new Date(deployment.timestamp).toLocaleTimeString()}</span>
            </div>

            <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
              <GitCommit className="h-5 w-5 text-amber-500 shrink-0" />
              <span>{deployment.commitMessage}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right text-xs">
              <div className="text-slate-400">Author</div>
              <div className="font-medium text-slate-200">{deployment.author.name}</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right text-xs">
              <div className="text-slate-400">Commit Hash</div>
              <div className="font-mono text-amber-300">{deployment.commitHash}</div>
            </div>
          </div>
        </div>

        {/* Normalized Change Delta Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70">
            <div className="text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Dependencies Modified</span>
            </div>
            {deployment.dependencyChanges.length > 0 ? (
              <div className="space-y-1">
                {deployment.dependencyChanges.map((dep, i) => (
                  <div key={i} className="font-mono text-amber-300 flex items-center justify-between bg-slate-950/40 px-2 py-1 rounded">
                    <span className="font-semibold">{dep.name}</span>
                    <span className="text-slate-400 text-[11px]">{dep.fromVersion} → {dep.toVersion}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 font-mono py-1">No dependency changes</div>
            )}
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70">
            <div className="text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-cyan-400" />
              <span>Infrastructure & Env</span>
            </div>
            {deployment.infraChanges.length > 0 || deployment.envVarChanges.length > 0 ? (
              <div className="space-y-1">
                {deployment.infraChanges.map((infra, i) => (
                  <div key={i} className="text-slate-300 font-mono text-[11px] truncate bg-slate-950/40 px-2 py-1 rounded">
                    {infra.component}: {infra.description}
                  </div>
                ))}
                {deployment.envVarChanges.map((env, i) => (
                  <div key={i} className="text-slate-300 font-mono text-[11px] truncate bg-slate-950/40 px-2 py-1 rounded">
                    Env: {env.key} ({env.action})
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 font-mono py-1">Standard container config</div>
            )}
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70">
            <div className="text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
              <Database className="h-3 w-3 text-indigo-400" />
              <span>Database Migrations</span>
            </div>
            {deployment.databaseChanges.length > 0 ? (
              <div className="space-y-1">
                {deployment.databaseChanges.map((db, i) => (
                  <div key={i} className="text-red-300 font-mono text-[11px] truncate bg-slate-950/40 px-2 py-1 rounded">
                    {db.migrationName}: {db.hasDestructiveOperations ? 'Locking operation' : 'Safe operation'}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 font-mono py-1">No schema migrations</div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* 2. RISK ASSESSMENT & HINDSIGHT HISTORICAL RECALL */}
      {risk && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            {/* Risk Level Banner */}
            <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md ${
              risk.riskLevel === 'CRITICAL' 
                ? 'bg-red-950/25 border-red-800/60 text-red-200' 
                : risk.riskLevel === 'HIGH'
                ? 'bg-amber-950/25 border-amber-800/60 text-amber-200'
                : 'bg-emerald-950/25 border-emerald-800/60 text-emerald-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    risk.riskLevel === 'CRITICAL' ? 'bg-red-900/40 text-red-400' : 'bg-amber-900/40 text-amber-400'
                  }`}>
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10 font-mono">
                        {risk.riskLevel} RISK PRE-FLIGHT ALERT
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-amber-300">
                        {risk.confidence}% Pattern Confidence
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {risk.headline}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {risk.summary}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">Recommended Rollout</span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-800/60 inline-block mt-1">
                    {risk.recommendedStrategy}
                  </span>
                </div>
              </div>
            </div>

            {/* Historical Memory Comparison (The Core Story Experience) */}
            {risk.historicalComparison && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-amber-800/50 bg-[#121927]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30"
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Hindsight Long-Term Memory Recall: Deployment #{risk.historicalComparison.similarDeploymentNumber}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Organizational incident memory recalled based on dependency and connection parameters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                      {risk.historicalComparison.similarityScore}% Match
                    </span>
                    {onViewHistoricalDeployment && (
                      <button
                        onClick={() => onViewHistoricalDeployment(risk.historicalComparison!.similarDeploymentNumber)}
                        className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
                      >
                        Inspect Deployment #1 <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* What Happened Then */}
                  <motion.div whileHover={{ y: -2 }} className="space-y-2.5 p-4 rounded-xl bg-slate-900/80 border border-red-900/40">
                    <div className="font-bold text-red-300 flex items-center gap-1.5 pb-1 border-b border-red-900/30">
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                      <span>What Happened in Deployment #{risk.historicalComparison.similarDeploymentNumber}</span>
                    </div>

                    <div className="space-y-2 leading-relaxed">
                      <div>
                        <span className="text-slate-400 font-medium">What Changed: </span>
                        <span className="text-slate-200 font-mono">{risk.historicalComparison.whatChangedThen}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">What Failed: </span>
                        <span className="text-red-200">{risk.historicalComparison.whatFailedThen}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Root Cause: </span>
                        <span className="text-slate-300 font-mono">{risk.historicalComparison.rootCauseThen}</span>
                      </div>
                      <div className="pt-1">
                        <span className="text-slate-400 font-medium">Verified Resolution: </span>
                        <span className="text-emerald-300 font-medium">{risk.historicalComparison.resolutionThen}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* What Is Different Now */}
                  <motion.div whileHover={{ y: -2 }} className="space-y-2.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800/90">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                      <Database className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Key Differences in Current Deployment #{deployment.number}</span>
                    </div>

                    <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed">
                      {risk.historicalComparison.keyDifferences.map((diff, idx) => (
                        <li key={idx}>
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span className="text-amber-400 font-semibold">Prevention Advice: </span>
                      {risk.preventionAdvice}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Blast Radius & Downstream Topology */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-slate-400" />
                  <span>Downstream Blast Radius (Cascading Failure Analysis)</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {risk.blastRadius.length} Services Evaluated
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {risk.blastRadius.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-200">{item.service}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.severity === 'HIGH' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mb-1 font-mono">Path: {item.dependencyPath}</div>
                    <div className="text-slate-300 text-[11px] leading-snug">{item.potentialImpact}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 3. PRE-FLIGHT VERIFICATION CHECKLIST (Actionable, executable commands) */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-amber-400" />
                    <span>Pre-Flight Verification Checklist</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Execute and verify these items to prevent repeating the historical incident.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-amber-500 h-full rounded-full"
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-300 tabular-nums">
                    {completedCount}/{checklist.length} Done
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.completed 
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCheckItem(item.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className={`text-xs font-medium leading-relaxed ${item.completed ? 'line-through text-slate-400' : ''}`}>
                          {item.task}
                        </span>
                      </label>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase shrink-0">
                        {item.category}
                      </span>
                    </div>

                    {item.command && (
                      <div className="mt-2.5 ml-7 flex items-center justify-between gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs text-amber-300">
                        <code className="truncate">{item.command}</code>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(item.command!)}
                          className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedCommand === item.command ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 4. CONTINUOUS LEARNING LOOP: Outcome & Retain Form */}
            <div className="rounded-2xl border border-amber-900/50 bg-[#111827]/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/30">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Continuous Learning Loop: Confirm Outcome & Retain Memory
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Record production result. REACTOR will retain the experience and verified fix into Hindsight.
                  </p>
                </div>
              </div>

              {deployment.outcome?.retainedInHindsight ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-200 text-xs space-y-2"
                >
                  <div className="font-bold flex items-center gap-2 text-sm text-emerald-300">
                    <Check className="h-4 w-4" />
                    <span>Successfully Retained into Hindsight Memory Bank!</span>
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    Memory ID: {deployment.outcome.hindsightMemoryId || 'mem-latest'} · Status: {deployment.outcome.status}
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Lessons Learned: {deployment.feedback?.lessonsLearned}
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleOutcomeSubmit} className="mt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Deployment Outcome</label>
                      <select
                        value={outcomeStatus}
                        onChange={(e) => setOutcomeStatus(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="SUCCESS">SUCCESS (Nominal / Verified)</option>
                        <option value="DEGRADED">DEGRADED (Minor Latency / Retries)</option>
                        <option value="FAILURE">FAILURE (Rolled Back)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Verifying Engineer</label>
                      <input
                        type="text"
                        value={engineerName}
                        onChange={(e) => setEngineerName(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Prediction Accuracy</label>
                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                          <input
                            type="radio"
                            name="accurate"
                            checked={wasPredictionAccurate}
                            onChange={() => setWasPredictionAccurate(true)}
                            className="text-amber-500"
                          />
                          Accurate Warning
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                          <input
                            type="radio"
                            name="accurate"
                            checked={!wasPredictionAccurate}
                            onChange={() => setWasPredictionAccurate(false)}
                            className="text-amber-500"
                          />
                          False Positive
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Actual Outcome Notes</label>
                    <textarea
                      rows={2}
                      value={actualOutcomeNotes}
                      onChange={(e) => setActualOutcomeNotes(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Lessons Learned (Retained for Future Deployments)</label>
                    <textarea
                      rows={2}
                      value={lessonsLearned}
                      onChange={(e) => setLessonsLearned(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Writes to Hindsight Memory Bank: </span>
                      <span className="font-mono text-amber-300">reactor-production-memory</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmittingOutcome}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      <span>{isSubmittingOutcome ? 'Retaining in Hindsight...' : 'Confirm Outcome & Retain Memory'}</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};
