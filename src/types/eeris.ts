export type RiskLevel = 'Low' | 'Medium' | 'High';

export type EcosystemPatternType =
  | 'Low Risk'
  | 'Medium Risk'
  | 'High Ecosystem Risk'
  | 'Emerging Ecosystem'
  | 'Benign Dense Ecosystem';

export type DecisionPathType =
  | 'PATH_A_FAST_TRACK'
  | 'PATH_B_TARGETED_VERIFICATION'
  | 'PATH_C_INVESTIGATION_REQUIRED';

export interface ActionEngineOutput {
  decision_path: DecisionPathType;
  action_type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  target_entities: string[];
  reason: string;
  customer_impact: string;
  status: string;
}

export interface RiskDriver {
  id: string;
  title: string;
  contributionPercent: number;
  riskLevel: RiskLevel;
  details: string;
  tags: string[];
  metaKey?: string;
  metaValue?: string;
}

export interface RecommendedAction {
  badge: string;
  title: string;
  text: string;
  targetAppId: string;
}

export interface Application {
  id: string;
  applicantName: string;
  pan: string;
  phone: string;
  deviceId: string;
  dealer: string;
  guarantor: string;
  location: string;
  status: string;
  ecosystemPattern: EcosystemPatternType;
  individualRisk: number;
  individualRiskLevel: RiskLevel;
  ecosystemRisk: number;
  ecosystemRiskLevel: RiskLevel;
  novelty: number;
  ecosystem: string;
  appliedAmount: string;
  submittedTime: string;
  caseId: string;
  rail: string;
  maturityState: string;
  coordinatedPattern: string;
  topDrivers: RiskDriver[];
  recommendedAction: RecommendedAction;
  decisionRouting?: ActionEngineOutput;
}

export interface EcosystemCluster {
  id: string;
  name: string;
  status: string;
  riskScore: number;
  novelty: number;
  maturity: string;
  growth: string;
  nodesCount: number;
  edgesCount: number;
  detectedPattern: string;
  isLegitimate?: boolean;
}

export interface VerificationTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface SimulationScenario {
  id: string;
  name: string;
  currentRisk: number;
  simulatedRisk: number;
  reductionPts: number;
  statusBefore: string;
  statusAfter: string;
}

export type TimelinePhase = 'Before Alert' | 'Alert (Day 0)' | 'Current (Active)';

export interface DashboardMetrics {
  totalApplications: number;
  highEcosystemRiskApps: number;
  emergingEcosystemsCount: number;
  underInvestigationCount: number;
  fastTrackedCount?: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface ApplicationFilterOptions {
  searchQuery?: string;
  riskFilter?: string;
  statusFilter?: string;
  dateFilter?: string;
  page?: number;
  pageSize?: number;
}

export interface LiveEcosystemEvent {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  ecosystemId?: string;
  appId?: string;
}

export interface InterventionRecord {
  id: string;
  application_id: string;
  ecosystem_id: string;
  action_type: string;
  priority: string;
  target_entities: string | string[];
  reason: string;
  baseline_risk: number;
  modeled_risk: number;
  status: string;
  owner: string;
}

export interface FeedbackEventRecord {
  id: string;
  event_type: string;
  ecosystem_id: string;
  application_id: string;
  outcome_state: string;
  model_weight_adjustment: string;
  timestamp: string;
}

export interface DealerRecord {
  id: string;
  name: string;
  pos_id: string;
  velocity_spike: string;
  risk_level: RiskLevel;
  connected_apps: number;
}
