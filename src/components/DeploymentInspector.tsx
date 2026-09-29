import React, { useState } from 'react';
import { 
  Deployment, 
  VerificationCheckItem 
} from '../types/reactor.js';
import { 
  GitCommit, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  Share2, 
  Clock, 
  AlertTriangle,
  ShieldCheck,
  ArrowRight
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
    <div className="space-y-8">
      {/* 1. Deployment Ingestion Card */}
      <section className="studio-card p-6 md:p-8 bg-white border border-[rgba(13,12,11,0.12)]">
        {/* Header Details */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[rgba(13,12,11,0.08)]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[rgba(13,12,11,0.5)] font-mono">
              <span className="font-semibold text-[#0d0c0b]">Deployment #{deployment.number}</span>
              <span>&middot;</span>
              <span>{deployment.service}</span>
              <span>&middot;</span>
              <span className="uppercase">{deployment.environment}</span>
              <span>&middot;</span>
              <span>{new Date(deployment.timestamp).toLocaleString()}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-[#0d0c0b] flex items-center gap-2.5">
              <GitCommit className="h-5 w-5 text-[rgba(13,12,11,0.5)] shrink-0" />
              <span>{deployment.commitMessage}</span>
            </h2>
          </div>

          <div className="flex items-center gap-5 text-xs text-[rgba(13,12,11,0.6)] font-mono shrink-0 pt-1">
            <div>
              <span className="text-[rgba(13,12,11,0.4)] block text-[11px]">Author</span>
              <span className="text-[#0d0c0b] font-sans font-medium">{deployment.author.name}</span>
            </div>
            <div className="h-7 w-px bg-[rgba(13,12,11,0.12)]" />
            <div>
              <span className="text-[rgba(13,12,11,0.4)] block text-[11px]">Commit</span>
              <span className="text-[#0d0c0b] font-mono">{deployment.commitHash}</span>
            </div>
          </div>
        </div>

        {/* Normalized Changes Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          {/* Dependencies */}
          <div className="space-y-2.5">
            <div className="text-[rgba(13,12,11,0.45)] font-semibold text-[11px] uppercase tracking-wider font-mono">
              Dependencies Modified
            </div>
            {deployment.dependencyChanges.length > 0 ? (
              <div className="space-y-2 font-mono">
                {deployment.dependencyChanges.map((dep, i) => (
                  <div key={i} className="flex items-center justify-between text-[#0d0c0b] py-1.5 border-b border-[rgba(13,12,11,0.06)]">
                    <span className="font-semibold">{dep.name}</span>
                    <span className="text-[rgba(13,12,11,0.6)]">{dep.fromVersion} &rarr; {dep.toVersion}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[rgba(13,12,11,0.4)] italic py-1">No dependency changes</p>
            )}
          </div>

          {/* Infrastructure */}
          <div className="space-y-2.5">
            <div className="text-[rgba(13,12,11,0.45)] font-semibold text-[11px] uppercase tracking-wider font-mono">
              Infrastructure &amp; Config
            </div>
            {deployment.infraChanges.length > 0 || deployment.envVarChanges.length > 0 ? (
              <div className="space-y-2 font-mono">
                {deployment.infraChanges.map((infra, i) => (
                  <div key={i} className="text-[#0d0c0b] py-1.5 border-b border-[rgba(13,12,11,0.06)]">
                    <span className="font-semibold">{infra.component}:</span> {infra.description}
                  </div>
                ))}
                {deployment.envVarChanges.map((env, i) => (
                  <div key={i} className="text-[#0d0c0b] py-1.5 border-b border-[rgba(13,12,11,0.06)]">
                    <span className="font-semibold">Env {env.key}:</span> {env.action}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[rgba(13,12,11,0.4)] italic py-1">Standard container configuration</p>
            )}
          </div>

          {/* Database */}
          <div className="space-y-2.5">
            <div className="text-[rgba(13,12,11,0.45)] font-semibold text-[11px] uppercase tracking-wider font-mono">
              Database Migrations
            </div>
            {deployment.databaseChanges.length > 0 ? (
              <div className="space-y-2 font-mono">
                {deployment.databaseChanges.map((db, i) => (
                  <div key={i} className="text-[#0d0c0b] py-1.5 border-b border-[rgba(13,12,11,0.06)]">
                    <span className="font-semibold">{db.migrationName}:</span> {db.hasDestructiveOperations ? 'Locking operation' : 'Additive change'}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[rgba(13,12,11,0.4)] italic py-1">No schema migrations</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Risk Assessment & Historical Memory Comparison */}
      {risk && (
        <section className="space-y-8">
          {/* Risk Evaluation Banner */}
          <div className={`studio-card p-6 md:p-8 ${
            risk.riskLevel === 'CRITICAL' 
              ? 'bg-[#fff5f5] border-[#fed7d7]' 
              : 'bg-[#fafaf8] border-[rgba(13,12,11,0.12)]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className={`font-semibold tracking-wider uppercase ${
                    risk.riskLevel === 'CRITICAL' ? 'text-red-700' : 'text-[#0d0c0b]'
                  }`}>
                    {risk.riskLevel} Risk Evaluation
                  </span>
                  <span className="text-[rgba(13,12,11,0.3)]">&middot;</span>
                  <span className="text-[rgba(13,12,11,0.6)]">{risk.confidence}% pattern confidence</span>
                </div>

                <h3 className="text-xl font-medium text-[#0d0c0b] tracking-tight">
                  {risk.headline}
                </h3>

                <p className="text-sm text-[rgba(13,12,11,0.7)] leading-relaxed">
                  {risk.summary}
                </p>
              </div>

              <div className="sm:text-right shrink-0 pt-1">
                <span className="text-xs text-[rgba(13,12,11,0.5)] font-mono block">Recommended Rollout</span>
                <span className="inline-block mt-1 text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#0d0c0b] text-white">
                  {risk.recommendedStrategy}
                </span>
              </div>
            </div>
          </div>

          {/* Historical Memory Recall Comparison */}
          {risk.historicalComparison && (
            <div className="studio-card p-6 md:p-8 space-y-6 bg-white border border-[rgba(13,12,11,0.12)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[rgba(13,12,11,0.08)]">
                <div>
                  <h4 className="text-base font-medium text-[#0d0c0b] tracking-tight flex items-center gap-2">
                    <span>Historical Incident Match: Outage #{risk.historicalComparison.similarDeploymentNumber}</span>
                  </h4>
                  <p className="text-xs text-[rgba(13,12,11,0.6)] mt-0.5">
                    Hindsight recalled this incident based on PostgreSQL driver TLS 1.3 certificate rejection.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold border border-red-200">
                    {risk.historicalComparison.similarityScore}% Vector Match
                  </span>
                  {onViewHistoricalDeployment && (
                    <button
                      onClick={() => onViewHistoricalDeployment(risk.historicalComparison!.similarDeploymentNumber)}
                      className="text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Outage Record</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Past Outage */}
                <div className="space-y-3.5 p-5 rounded-xl bg-[#fff8f8] border border-red-200/80">
                  <div className="text-red-700 font-semibold text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Past Outage (Deployment #{risk.historicalComparison.similarDeploymentNumber})</span>
                  </div>

                  <div className="space-y-2 text-[#0d0c0b] leading-relaxed">
                    <div>
                      <span className="text-[rgba(13,12,11,0.5)] font-mono">What Changed: </span>
                      <span>{risk.historicalComparison.whatChangedThen}</span>
                    </div>
                    <div>
                      <span className="text-[rgba(13,12,11,0.5)] font-mono">Outage Impact: </span>
                      <span className="text-red-800 font-medium">{risk.historicalComparison.whatFailedThen}</span>
                    </div>
                    <div>
                      <span className="text-[rgba(13,12,11,0.5)] font-mono">Root Cause: </span>
                      <span className="text-[rgba(13,12,11,0.7)]">{risk.historicalComparison.rootCauseThen}</span>
                    </div>
                    <div className="pt-2.5 border-t border-red-200/60">
                      <span className="text-emerald-700 font-mono font-medium">Verified Fix: </span>
                      <span className="text-[#0d0c0b]">{risk.historicalComparison.resolutionThen}</span>
                    </div>
                  </div>
                </div>

                {/* Current Deployment & Differences */}
                <div className="space-y-3.5 p-5 rounded-xl bg-[#fafaf8] border border-[rgba(13,12,11,0.12)]">
                  <div className="text-[#0d0c0b] font-semibold text-[11px] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5" />
                    <span>Current Deployment #{deployment.number} Analysis</span>
                  </div>

                  <ul className="space-y-2 text-[rgba(13,12,11,0.8)] list-disc list-inside leading-relaxed">
                    {risk.historicalComparison.keyDifferences.map((diff, idx) => (
                      <li key={idx}>{diff}</li>
                    ))}
                  </ul>

                  <div className="pt-2.5 border-t border-[rgba(13,12,11,0.08)] text-[rgba(13,12,11,0.7)] leading-relaxed">
                    <span className="text-[#0d0c0b] font-medium">Preventative Advice: </span>
                    {risk.preventionAdvice}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blast Radius Analysis */}
          <div className="studio-card p-6 md:p-8 space-y-5 bg-white border border-[rgba(13,12,11,0.12)]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(13,12,11,0.08)]">
              <h4 className="text-base font-medium text-[#0d0c0b] tracking-tight flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[rgba(13,12,11,0.5)]" />
                <span>Downstream Blast Radius</span>
              </h4>
              <span className="text-xs text-[rgba(13,12,11,0.5)] font-mono">
                {risk.blastRadius.length} downstream services evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              {risk.blastRadius.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#fafaf8] border border-[rgba(13,12,11,0.1)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0d0c0b]">{item.service}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      item.severity === 'HIGH' ? 'text-red-800 bg-red-100' : 'text-amber-800 bg-amber-100'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="text-[rgba(13,12,11,0.5)] font-mono text-[11px]">{item.dependencyPath}</div>
                  <div className="text-[rgba(13,12,11,0.8)] leading-snug">{item.potentialImpact}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Pre-Flight Verification Checklist */}
          <div className="studio-card p-6 md:p-8 space-y-5 bg-white border border-[rgba(13,12,11,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(13,12,11,0.08)]">
              <div>
                <h4 className="text-base font-medium text-[#0d0c0b] tracking-tight flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[rgba(13,12,11,0.5)]" />
                  <span>Pre-Flight Verification Checklist</span>
                </h4>
                <p className="text-xs text-[rgba(13,12,11,0.6)] mt-0.5">
                  Execute these checks before rollout to prevent repeating the historical incident.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 bg-[rgba(13,12,11,0.1)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0a0908] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-[rgba(13,12,11,0.6)] tabular-nums">
                  {completedCount}/{checklist.length} verified
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    item.completed 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : 'bg-[#fafaf8] border-[rgba(13,12,11,0.1)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleCheckItem(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-[rgba(13,12,11,0.2)] text-[#0a0908] focus:ring-0 cursor-pointer accent-[#0a0908]"
                      />
                      <span className={`text-xs ${item.completed ? 'line-through text-[rgba(13,12,11,0.4)]' : 'text-[#0d0c0b] font-medium'}`}>
                        {item.task}
                      </span>
                    </label>

                    <span className="text-[10px] font-mono text-[rgba(13,12,11,0.45)] uppercase shrink-0">
                      {item.category}
                    </span>
                  </div>

                  {item.command && (
                    <div className="mt-2.5 ml-7 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#f4f2ee] border border-[rgba(13,12,11,0.08)] font-mono text-xs text-[#0d0c0b]">
                      <code className="truncate">{item.command}</code>
                      <button
                        onClick={() => copyToClipboard(item.command!)}
                        className="text-[rgba(13,12,11,0.6)] hover:text-[#0d0c0b] px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedCommand === item.command ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Record Outcome & Retain into Hindsight */}
          <div className="studio-card p-6 md:p-8 space-y-5 bg-white border border-[rgba(13,12,11,0.12)]">
            <div className="pb-4 border-b border-[rgba(13,12,11,0.08)]">
              <h4 className="text-base font-medium text-[#0d0c0b] tracking-tight">
                Record Deployment Outcome &amp; Retain Knowledge
              </h4>
              <p className="text-xs text-[rgba(13,12,11,0.6)] mt-0.5">
                When deployment completes, retain the outcome and verified fix into Hindsight organizational memory.
              </p>
            </div>

            {deployment.outcome?.retainedInHindsight ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>Retained in Hindsight Memory Bank</span>
                </div>
                <div className="text-[rgba(13,12,11,0.5)] font-mono text-[11px]">
                  Memory ID: {deployment.outcome.hindsightMemoryId || 'mem-latest'} &middot; Outcome: {deployment.outcome.status}
                </div>
                <p className="text-[#0d0c0b] text-xs leading-relaxed">
                  Lessons learned: {deployment.feedback?.lessonsLearned}
                </p>
              </div>
            ) : (
              <form onSubmit={handleOutcomeSubmit} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1.5">Outcome Status</label>
                    <select
                      value={outcomeStatus}
                      onChange={(e) => setOutcomeStatus(e.target.value as any)}
                      className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] px-3 py-2 text-[#0d0c0b] font-mono text-xs focus:outline-none focus:border-[#0d0c0b]"
                    >
                      <option value="SUCCESS">SUCCESS (Verified nominal)</option>
                      <option value="DEGRADED">DEGRADED (Issues observed)</option>
                      <option value="FAILURE">FAILURE (Rolled back)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1.5">Verifying Engineer</label>
                    <input
                      type="text"
                      value={engineerName}
                      onChange={(e) => setEngineerName(e.target.value)}
                      className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] px-3 py-2 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                    />
                  </div>

                  <div>
                    <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1.5">Prediction Accuracy</label>
                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[#0d0c0b]">
                        <input
                          type="radio"
                          name="accurate"
                          checked={wasPredictionAccurate}
                          onChange={() => setWasPredictionAccurate(true)}
                          className="accent-[#0a0908]"
                        />
                        Accurate Warning
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[rgba(13,12,11,0.6)]">
                        <input
                          type="radio"
                          name="accurate"
                          checked={!wasPredictionAccurate}
                          onChange={() => setWasPredictionAccurate(false)}
                          className="accent-[#0a0908]"
                        />
                        False Positive
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1.5">Actual Outcome Notes</label>
                  <textarea
                    rows={2}
                    value={actualOutcomeNotes}
                    onChange={(e) => setActualOutcomeNotes(e.target.value)}
                    className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] p-3 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                  />
                </div>

                <div>
                  <label className="block text-[rgba(13,12,11,0.7)] font-medium mb-1.5">Lessons Learned for Future Deployments</label>
                  <textarea
                    rows={2}
                    value={lessonsLearned}
                    onChange={(e) => setLessonsLearned(e.target.value)}
                    className="w-full rounded-lg bg-[#fafaf8] border border-[rgba(13,12,11,0.14)] p-3 text-[#0d0c0b] text-xs focus:outline-none focus:border-[#0d0c0b]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="text-[rgba(13,12,11,0.5)] text-[11px] font-mono flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[rgba(13,12,11,0.4)]" />
                    <span>Target memory bank: reactor-core</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingOutcome}
                    className="pill text-xs !h-9 !px-5"
                  >
                    {isSubmittingOutcome ? 'Retaining...' : 'Confirm Outcome & Retain into Hindsight'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
