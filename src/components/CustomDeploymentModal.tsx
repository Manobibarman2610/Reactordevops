import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitCommit, Plus, Trash2, Cpu, ShieldAlert } from 'lucide-react';
import { DependencyChange, DatabaseChange, InfraChange, EnvVarChange } from '../types/reactor.js';

interface CustomDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isAnalyzing: boolean;
}

export const CustomDeploymentModal: React.FC<CustomDeploymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isAnalyzing
}) => {
  const [service, setService] = useState('checkout-api');
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'canary'>('production');
  const [commitMessage, setCommitMessage] = useState('feat(db): update postgres client configuration and connection pool');
  const [authorName, setAuthorName] = useState('Alex Rivera');
  
  // Dynamic changes
  const [depName, setDepName] = useState('pg');
  const [fromVer, setFromVer] = useState('8.7.3');
  const [toVer, setToVer] = useState('8.11.3');

  const [hasDbMigration, setHasDbMigration] = useState(false);
  const [migrationName, setMigrationName] = useState('20260928_optimize_indexes');
  const [migrationDetails, setMigrationDetails] = useState('ALTER TABLE orders ADD COLUMN idempotency_key VARCHAR');

  const [hasInfraChange, setHasInfraChange] = useState(false);
  const [infraComponent, setInfraComponent] = useState('kubernetes');
  const [infraDesc, setInfraDesc] = useState('Adjust pod memory limit to 512Mi');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d131f] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Simulate CI/CD Deployment Event
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Trigger REACTOR Event Ingestion and Hindsight Recall
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const dependencyChanges: DependencyChange[] = depName ? [
                  {
                    name: depName,
                    fromVersion: fromVer,
                    toVersion: toVer,
                    isMajor: false,
                    type: 'production'
                  }
                ] : [];

                const databaseChanges: DatabaseChange[] = hasDbMigration ? [
                  {
                    migrationName,
                    type: 'schema',
                    hasDestructiveOperations: false,
                    details: migrationDetails
                  }
                ] : [];

                const infraChanges: InfraChange[] = hasInfraChange ? [
                  {
                    component: infraComponent,
                    changeType: 'helm',
                    description: infraDesc
                  }
                ] : [];

                await onSubmit({
                  service,
                  environment,
                  commitMessage,
                  author: {
                    name: authorName,
                    email: `${authorName.toLowerCase().replace(' ', '.')}@reactor.io`
                  },
                  dependencyChanges,
                  databaseChanges,
                  infraChanges,
                  fileChanges: [
                    { path: `services/${service}/package.json`, type: 'modified' }
                  ]
                });

                onClose();
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Service</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="checkout-api">checkout-api</option>
                    <option value="billing-worker">billing-worker</option>
                    <option value="auth-gateway">auth-gateway</option>
                    <option value="user-service">user-service</option>
                    <option value="recommendation-engine">recommendation-engine</option>
                    <option value="notification-service">notification-service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Environment</label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="production">production</option>
                    <option value="canary">canary (5% traffic)</option>
                    <option value="staging">staging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Commit Message</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Dependency Config */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 block text-[11px]">
                  Dependency Change (e.g. pg, redis, stripe)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Package name"
                    value={depName}
                    onChange={(e) => setDepName(e.target.value)}
                    className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-200 font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="From"
                    value={fromVer}
                    onChange={(e) => setFromVer(e.target.value)}
                    className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-200 font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={toVer}
                    onChange={(e) => setToVer(e.target.value)}
                    className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1.5 text-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Database Migration Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasDbMigration}
                    onChange={(e) => setHasDbMigration(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="font-semibold text-[11px]">Include Database Migration</span>
                </label>

                {hasDbMigration && (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Migration file name"
                      value={migrationName}
                      onChange={(e) => setMigrationName(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="SQL / details"
                      value={migrationDetails}
                      onChange={(e) => setMigrationDetails(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Infra Changes Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasInfraChange}
                    onChange={(e) => setHasInfraChange(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="font-semibold text-[11px]">Include Infrastructure Modification</span>
                </label>

                {hasInfraChange && (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Component (e.g. kubernetes, terraform, docker)"
                      value={infraComponent}
                      onChange={(e) => setInfraComponent(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-slate-200 font-mono text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Description of infra change"
                      value={infraDesc}
                      onChange={(e) => setInfraDesc(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-slate-200 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>{isAnalyzing ? 'Analyzing with Hindsight...' : 'Trigger Analysis'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
