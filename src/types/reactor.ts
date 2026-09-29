export type DeploymentStatus = 
  | 'pending_analysis'
  | 'risk_flagged'
  | 'approved'
  | 'deploying'
  | 'deployed_success'
  | 'failed_in_production'
  | 'rolled_back';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  diffSnippet?: string;
}

export interface DependencyChange {
  name: string;
  fromVersion: string;
  toVersion: string;
  isMajor: boolean;
  type: 'production' | 'development';
}

export interface EnvVarChange {
  key: string;
  action: 'added' | 'modified' | 'removed';
  isSensitive?: boolean;
}

export interface InfraChange {
  component: string;
  changeType: 'k8s_manifest' | 'terraform' | 'dockerfile' | 'helm' | 'env_config';
  description: string;
}

export interface DatabaseChange {
  migrationName: string;
  type: 'schema' | 'data' | 'index';
  hasDestructiveOperations: boolean;
  details: string;
}

export interface HistoricalComparison {
  similarDeploymentId: string;
  similarDeploymentNumber: number;
  similarityScore: number; // 0 to 100
  matchedTags: string[];
  whatChangedThen: string;
  whatFailedThen: string;
  rootCauseThen: string;
  resolutionThen: string;
  outcomeThen: string;
  keyDifferences: string[];
}

export interface BlastRadiusItem {
  service: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  dependencyPath: string;
  potentialImpact: string;
  userFacingImpact?: string;
}

export interface VerificationCheckItem {
  id: string;
  task: string;
  plainEnglishTask?: string;
  command?: string;
  completed: boolean;
  category: 'runtime_config' | 'database' | 'compatibility' | 'downstream';
}

export interface RiskAssessment {
  riskLevel: RiskLevel;
  confidence: number; // 0 to 100
  headline: string;
  summary: string;
  plainEnglishHeadline?: string;
  plainEnglishSummary?: string;
  customerImpact?: string;
  businessRisk?: string;
  simpleFix?: string;
  historicalComparison?: HistoricalComparison;
  blastRadius: BlastRadiusItem[];
  verificationChecklist: VerificationCheckItem[];
  recommendedStrategy: 'STANDARD_ROLLOUT' | 'CANARY_5_PERCENT' | 'STAGED_WITH_SHADOW' | 'BLOCK_AND_HOTFIX';
  preventionAdvice: string;
  hindsightMemoriesConsulted: {
    id: string;
    score: number;
    title: string;
    summary: string;
  }[];
  analyzedAt: string;
}

export interface DeploymentOutcome {
  status: 'SUCCESS' | 'FAILURE' | 'DEGRADED';
  completedAt: string;
  errorLogSnippet?: string;
  downstreamIncidents?: string[];
  engineerResolution?: string;
  retainedInHindsight: boolean;
  hindsightMemoryId?: string;
}

export interface EngineerFeedback {
  engineerName: string;
  wasPredictionAccurate: boolean;
  checklistFollowed: boolean;
  actualOutcomeNotes: string;
  lessonsLearned: string;
  submittedAt: string;
}

export interface Deployment {
  id: string;
  number: number;
  commitHash: string;
  commitMessage: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  branch: string;
  environment: 'production' | 'staging' | 'canary';
  service: string;
  timestamp: string;
  status: DeploymentStatus;
  
  // Normalized changes
  fileChanges: FileChange[];
  dependencyChanges: DependencyChange[];
  envVarChanges: EnvVarChange[];
  infraChanges: InfraChange[];
  databaseChanges: DatabaseChange[];
  
  riskAssessment?: RiskAssessment;
  outcome?: DeploymentOutcome;
  feedback?: EngineerFeedback;
}

export interface HindsightMemory {
  id: string;
  bankId: string;
  title: string;
  content: string;
  summary: string;
  timestamp: string;
  tags: string[];
  metadata: {
    deploymentId?: string;
    deploymentNumber?: number;
    service?: string;
    environment?: string;
    rootCause?: string;
    resolution?: string;
    verifiedFix?: boolean;
    downstreamEffects?: string[];
    riskScore?: number;
    category: 'dependency_breakage' | 'infra_misconfig' | 'db_drift' | 'runtime_crash' | 'safe_pattern';
  };
  associations: string[]; // Linked memory IDs
  recallCount: number;
  importance: number; // 0 to 1
}

export interface HindsightBank {
  id: string;
  name: string;
  description: string;
  memoryCount: number;
  lastRetentionAt: string;
}

export interface MemoryGraphNode {
  id: string;
  label: string;
  category: string;
  size: number;
  service: string;
  deploymentNumber?: number;
}

export interface MemoryGraphEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface MemoryGraph {
  nodes: MemoryGraphNode[];
  edges: MemoryGraphEdge[];
}
