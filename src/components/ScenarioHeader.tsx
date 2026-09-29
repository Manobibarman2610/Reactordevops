import React from 'react';
import { ArrowRight, RotateCcw, Plus, Play, Sparkles } from 'lucide-react';

interface ScenarioHeaderProps {
  onRunCoreStory: () => void;
  onRunScenario: (scenario: string) => void;
  onReset: () => void;
  onOpenCustomModal: () => void;
  isAnalyzing: boolean;
}

export const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  onRunCoreStory,
  onRunScenario,
  onReset,
  onOpenCustomModal,
  isAnalyzing
}) => {
  return (
    <div className="pt-4 pb-2 space-y-6">
      {/* Studio Eyebrow & Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[rgba(13,12,11,0.5)] font-mono">
          <span>Hindsight Architecture</span>
          <span>&middot;</span>
          <span>No. 112 Deployment Pipeline</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-[#0d0c0b] leading-[1.05] max-w-3xl">
          Turning every deployment into organizational memory.
        </h1>

        <p className="text-base text-[rgba(13,12,11,0.64)] max-w-2xl leading-relaxed">
          Evaluating incoming pull requests against past production outages, schema migrations, and infrastructure drift before code touches production.
        </p>
      </div>

      {/* Spacious, unattached scenario controls */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <button
          onClick={onRunCoreStory}
          disabled={isAnalyzing}
          className="pill text-xs !h-9 !px-4 gap-2"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>Core Story: Deployment #27 (92% Outage Match)</span>
        </button>

        <button
          onClick={() => onRunScenario('prisma_drift')}
          disabled={isAnalyzing}
          className="pill-outline text-xs !h-9 !px-3.5 gap-1.5"
        >
          <span>Scenario: DB Column Drift</span>
        </button>

        <button
          onClick={() => onRunScenario('k8s_memory_reduction')}
          disabled={isAnalyzing}
          className="pill-outline text-xs !h-9 !px-3.5 gap-1.5"
        >
          <span>Scenario: K8s Memory Reduction</span>
        </button>

        <button
          onClick={onOpenCustomModal}
          className="pill-outline text-xs !h-9 !px-3.5 gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Custom PR</span>
        </button>

        <button
          onClick={onReset}
          disabled={isAnalyzing}
          className="pill-outline text-xs !h-9 !px-3 text-[rgba(13,12,11,0.5)] hover:text-[#0d0c0b] gap-1"
          title="Reset to seed deployments"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
