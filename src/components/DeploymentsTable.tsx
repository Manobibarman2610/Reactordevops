import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Deployment } from '../types/reactor.js';
import { 
  GitCommit, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  ArrowUpRight,
  Database,
  Filter
} from 'lucide-react';

interface DeploymentsTableProps {
  deployments: Deployment[];
  selectedDeploymentId: string | null;
  onSelectDeployment: (id: string) => void;
}

export const DeploymentsTable: React.FC<DeploymentsTableProps> = ({
  deployments,
  selectedDeploymentId,
  onSelectDeployment
}) => {
  const [filterService, setFilterService] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const services = ['ALL', ...Array.from(new Set(deployments.map(d => d.service)))];

  const filtered = deployments.filter(d => {
    if (filterService !== 'ALL' && d.service !== filterService) return false;
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'FAILED' && d.status !== 'failed_in_production' && d.status !== 'rolled_back') return false;
      if (filterStatus === 'SUCCESS' && d.status !== 'deployed_success') return false;
      if (filterStatus === 'FLAGGED' && d.status !== 'risk_flagged') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMsg = d.commitMessage.toLowerCase().includes(q);
      const matchCommit = d.commitHash.toLowerCase().includes(q);
      const matchAuthor = d.author.name.toLowerCase().includes(q);
      const matchService = d.service.toLowerCase().includes(q);
      const matchNum = `#${d.number}`.includes(q);
      if (!matchMsg && !matchCommit && !matchAuthor && !matchService && !matchNum) return false;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deployments by commit, message, author, or #..."
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Service:</span>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none"
            >
              {services.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="FAILED">Failures & Rollbacks</option>
              <option value="FLAGGED">Risk Flagged</option>
              <option value="SUCCESS">Deployed Success</option>
            </select>
          </div>
        </div>
      </div>

      {/* High Density Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-4">Commit Message & Diffs</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Hindsight</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((dep) => {
                const isSelected = dep.id === selectedDeploymentId;
                const riskLevel = dep.riskAssessment?.riskLevel;

                return (
                  <motion.tr
                    key={dep.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    onClick={() => onSelectDeployment(dep.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-amber-950/20' : ''
                    }`}
                  >
                    {/* Deployment Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200 tabular-nums">
                      #{dep.number}
                    </td>

                    {/* Service & Env */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-slate-200 font-medium block">
                        {dep.service}
                      </span>
                      <span className="text-[10px] uppercase text-slate-500 font-mono">
                        {dep.environment}
                      </span>
                    </td>

                    {/* Commit Message */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-medium text-slate-200 truncate flex items-center gap-1.5">
                        <GitCommit className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{dep.commitMessage}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{dep.commitHash}</span>
                        {dep.dependencyChanges.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-400">
                              deps: {dep.dependencyChanges.map(d => `${d.name} (${d.fromVersion}→${d.toVersion})`).join(', ')}
                            </span>
                          </>
                        )}
                        {dep.databaseChanges.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-red-400">db migration</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {dep.status === 'failed_in_production' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-red-400 bg-red-950/80 border border-red-800/60 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="h-3 w-3" /> FAILED
                        </span>
                      ) : dep.status === 'rolled_back' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full">
                          ROLLED BACK
                        </span>
                      ) : dep.status === 'risk_flagged' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-300 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="h-3 w-3" /> FLAGGED
                        </span>
                      ) : dep.status === 'deployed_success' ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                          <CheckCircle className="h-3 w-3" /> SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          PENDING
                        </span>
                      )}
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-3">
                      {riskLevel ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${
                            riskLevel === 'CRITICAL' ? 'bg-red-500' :
                            riskLevel === 'HIGH' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span className="font-mono text-[11px] font-semibold text-slate-300">
                            {riskLevel}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-3 text-slate-300 text-[11px]">
                      {dep.author.name}
                    </td>

                    {/* Hindsight Retained Link */}
                    <td className="py-3.5 px-3">
                      {dep.outcome?.retainedInHindsight ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <Database className="h-3 w-3" /> Retained
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px] font-mono">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDeployment(dep.id);
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        Inspect <ArrowUpRight className="h-3 w-3" />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
