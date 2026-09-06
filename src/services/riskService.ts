import type {
  Application,
  EcosystemCluster,
  VerificationTask,
  SimulationScenario,
  DashboardMetrics,
  ApplicationFilterOptions,
  ActionEngineOutput,
  LiveEcosystemEvent,
  FeedbackEventRecord,
  DealerRecord
} from '../types/eeris';
import {
  INITIAL_APPLICATIONS,
  MAIN_CLUSTER,
  INITIAL_VERIFICATION_TASKS,
  INITIAL_SIMULATION
} from '../data/mockData';

const LIVE_EVENTS_INITIAL: LiveEcosystemEvent[] = [
  { id: 'evt-1', timestamp: '10:01:41', eventType: 'INVESTIGATION_OPENED', description: 'Investigation INV-78287 opened for Sunita Verma (APP-78287)', appId: 'APP-78287' },
  { id: 'evt-2', timestamp: '10:01:36', eventType: 'RECOMMENDED_ACTION_GENERATED', description: 'Action Engine generated TARGETED_VERIFICATION for Dealer Apex Auto + Device DEV-9810', appId: 'APP-78287' },
  { id: 'evt-3', timestamp: '10:01:35', eventType: 'ALERT_CREATED', description: 'Emerging ecosystem alert created for ECO-1024 (Risk 84)', ecosystemId: 'ECO-1024' },
  { id: 'evt-4', timestamp: '10:01:34', eventType: 'RISK_SPIKE', description: 'Risk increased: 61 → 84 after payment anomaly detection', appId: 'APP-78287' },
  { id: 'evt-5', timestamp: '10:01:33', eventType: 'PAYMENT_ANOMALY', description: 'Payment anomaly signature matched across shared UPI destination', appId: 'APP-78287' },
  { id: 'evt-6', timestamp: '10:01:25', eventType: 'RISK_INCREASE', description: 'Risk increased: 42 → 61 after Borrower B31 linked', appId: 'APP-78287' },
  { id: 'evt-7', timestamp: '10:01:24', eventType: 'BORROWER_LINKED', description: 'Borrower B31 (K. Rao) linked to shared device DEV-9810' },
  { id: 'evt-8', timestamp: '10:01:18', eventType: 'RISK_INITIAL', description: 'Ecosystem risk updated: 31 → 42' },
  { id: 'evt-9', timestamp: '10:01:17', eventType: 'ECOSYSTEM_UPDATED', description: 'Ecosystem topology ECO-1024 updated with dealer POS link' },
  { id: 'evt-10', timestamp: '10:01:13', eventType: 'DEALER_LINKED', description: 'Dealer Apex Auto (DL-4021) linked to application APP-78287' },
  { id: 'evt-11', timestamp: '10:01:12', eventType: 'DEVICE_LINKED', description: 'Device DEV-9810 linked to applicant handset' },
  { id: 'evt-12', timestamp: '10:01:11', eventType: 'APPLICATION_CREATED', description: 'Application APP-78287 created for Sunita Verma' }
];

const INITIAL_DEALERS: DealerRecord[] = [
  { id: 'dlr-1', name: 'Apex Auto', pos_id: 'POS-44021', velocity_spike: '4.2x Spike', risk_level: 'High', connected_apps: 18 },
  { id: 'dlr-2', name: 'Zenith Motors', pos_id: 'POS-33091', velocity_spike: '2.1x Spike', risk_level: 'Medium', connected_apps: 9 },
  { id: 'dlr-3', name: 'Royal Wheels', pos_id: 'POS-12004', velocity_spike: 'Normal', risk_level: 'Low', connected_apps: 4 },
  { id: 'dlr-4', name: 'Velocity Auto', pos_id: 'POS-88910', velocity_spike: '3.0x Spike', risk_level: 'High', connected_apps: 12 },
  { id: 'dlr-5', name: 'Village Agro Motors', pos_id: 'POS-00173', velocity_spike: 'Normal', risk_level: 'Low', connected_apps: 6 }
];

class RiskService {
  private applications: Application[] = [...INITIAL_APPLICATIONS];
  private cluster: EcosystemCluster = { ...MAIN_CLUSTER };
  private tasks: VerificationTask[] = [...INITIAL_VERIFICATION_TASKS];
  private simulation: SimulationScenario = { ...INITIAL_SIMULATION };
  private liveEvents: LiveEcosystemEvent[] = [...LIVE_EVENTS_INITIAL];
  private feedbackEvents: FeedbackEventRecord[] = [
    {
      id: 'fb-101',
      event_type: 'FALSE_POSITIVE_CONFIRMED',
      ecosystem_id: 'ECO-00173',
      application_id: 'APP-90112',
      outcome_state: 'Legitimate Rural Community',
      model_weight_adjustment: 'Reduced connection-density risk weight by -35% for rural cluster topologies',
      timestamp: '2026-09-05 10:15:00'
    },
    {
      id: 'fb-102',
      event_type: 'CONFIRMED_FRAUD',
      ecosystem_id: 'ECO-1024',
      application_id: 'APP-78287',
      outcome_state: 'Confirmed Fraud Ring',
      model_weight_adjustment: 'Increased shared-device burst weight by +25% across regional dealers',
      timestamp: '2026-09-05 09:40:00'
    }
  ];

  public getApplications(): Application[] {
    return this.applications;
  }

  public getApplicationById(id: string): Application | undefined {
    if (!id) return this.applications[0];
    const app = this.applications.find(a => a.id.toLowerCase() === id.toLowerCase());
    if (app && !app.decisionRouting) {
      app.decisionRouting = this.getDecisionRouting(app);
    }
    return app || this.applications[0];
  }

  public getDecisionRouting(app: Application): ActionEngineOutput {
    if (app.ecosystemRisk >= 70) {
      return {
        decision_path: 'PATH_C_INVESTIGATION_REQUIRED',
        action_type: 'INVESTIGATION_REQUIRED',
        priority: 'HIGH',
        target_entities: [`Dealer ${app.dealer}`, `Device ${app.deviceId}`, `Guarantor ${app.guarantor}`],
        reason: `High ecosystem risk (${app.ecosystemRisk}) with coordinated relationship pattern (+${app.ecosystemRisk - app.individualRisk} divergence)`,
        customer_impact: 'Application placed in risk investigation queue before further credit exposure',
        status: 'Hold / Investigation Required'
      };
    } else if (app.ecosystemRisk >= 45) {
      return {
        decision_path: 'PATH_B_TARGETED_VERIFICATION',
        action_type: 'TARGETED_VERIFICATION',
        priority: 'MEDIUM',
        target_entities: [`Dealer ${app.dealer}`, `Device ${app.deviceId}`],
        reason: `Ecosystem risk (${app.ecosystemRisk}) elevated due to merchant velocity & device signatures`,
        customer_impact: 'Targeted verification requested for high-value entities only',
        status: 'Verification Required'
      };
    } else {
      return {
        decision_path: 'PATH_A_FAST_TRACK',
        action_type: 'FAST_TRACK',
        priority: 'LOW',
        target_entities: [],
        reason: 'Low risk + stable ecosystem network',
        customer_impact: 'Reduced verification friction, fast approval rail',
        status: 'Proceed'
      };
    }
  }

  public getFilteredApplications(options: ApplicationFilterOptions = {}): {
    applications: Application[];
    total: number;
    totalPages: number;
  } {
    const { searchQuery = '', riskFilter = 'All Profiles', statusFilter = 'All Stages', page = 1, pageSize = 20 } = options;
    const query = searchQuery.trim().toLowerCase();

    let result = this.applications.filter(app => {
      const matchesSearch =
        !query ||
        app.applicantName.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.pan.toLowerCase().includes(query) ||
        app.phone.toLowerCase().includes(query) ||
        app.deviceId.toLowerCase().includes(query) ||
        app.dealer.toLowerCase().includes(query) ||
        app.guarantor.toLowerCase().includes(query) ||
        app.ecosystem.toLowerCase().includes(query);

      let matchesRisk = true;
      if (riskFilter === 'High Risk Divergence' || riskFilter === 'High Risk') {
        matchesRisk = app.ecosystemRisk >= 70;
      } else if (riskFilter === 'Medium Risk') {
        matchesRisk = app.ecosystemRisk >= 45 && app.ecosystemRisk < 70;
      } else if (riskFilter === 'Low Risk Base' || riskFilter === 'Low Risk') {
        matchesRisk = app.ecosystemRisk < 45;
      }

      let matchesStatus = true;
      if (statusFilter === 'Targeted Verification Required') {
        matchesStatus = app.status === 'Targeted Verification Required' || app.ecosystemRisk >= 70;
      } else if (statusFilter === 'Under Review') {
        matchesStatus = app.status === 'Under Review' || (app.ecosystemRisk >= 45 && app.ecosystemRisk < 70);
      } else if (statusFilter === 'Standard Approval') {
        matchesStatus = app.status === 'Standard Approval' || app.ecosystemRisk < 45;
      }

      return matchesSearch && matchesRisk && matchesStatus;
    });

    const total = result.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const currentPage = Math.min(Math.max(1, page), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedApps = result.slice(startIndex, startIndex + pageSize);

    return {
      applications: paginatedApps,
      total,
      totalPages
    };
  }

  public getEcosystemCluster(clusterId: string = 'ECO-1024'): EcosystemCluster {
    if (clusterId === 'ECO-00173') {
      return {
        id: 'ECO-00173',
        name: 'Legitimate Rural Community Cluster',
        status: 'Verified Stable',
        riskScore: 28,
        novelty: 0.22,
        maturity: 'Stage 1',
        growth: '0%',
        nodesCount: 12,
        edgesCount: 16,
        detectedPattern: 'Dense village cluster: Shared household tablet & family guarantors with clean repayment',
        isLegitimate: true
      };
    }
    return this.cluster;
  }

  public getVerificationTasks(): VerificationTask[] {
    return this.tasks;
  }

  public toggleVerificationTask(taskId: string): VerificationTask[] {
    this.tasks = this.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    return [...this.tasks];
  }

  public getSimulationScenario(): SimulationScenario {
    return this.simulation;
  }

  public getLiveEvents(): LiveEcosystemEvent[] {
    return this.liveEvents;
  }

  public addLiveEvent(event: LiveEcosystemEvent) {
    this.liveEvents.unshift(event);
  }

  public getFeedbackEvents(): FeedbackEventRecord[] {
    return this.feedbackEvents;
  }

  public markFalsePositive(ecosystemId: string, notes: string = ''): FeedbackEventRecord {
    const newEvent: FeedbackEventRecord = {
      id: `fb-${Date.now()}`,
      event_type: 'FALSE_POSITIVE_CONFIRMED',
      ecosystem_id: ecosystemId,
      application_id: 'APP-90112',
      outcome_state: 'Legitimate Dense Community',
      model_weight_adjustment: notes || 'Reduced connection-density risk weight by -35% for rural cluster topologies',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.feedbackEvents.unshift(newEvent);

    if (ecosystemId === 'ECO-1024') {
      this.cluster.riskScore = 32;
      this.cluster.status = 'Verified Legitimate';
      this.cluster.isLegitimate = true;
    }
    return newEvent;
  }

  public getDealers(): DealerRecord[] {
    return INITIAL_DEALERS;
  }

  public getDashboardMetrics(): DashboardMetrics {
    const totalApplications = this.applications.length;
    const highEcosystemRiskApps = this.applications.filter(app => app.ecosystemRisk >= 70).length;
    const emergingEcosystemsCount = this.applications.filter(app => app.ecosystemPattern === 'Emerging Ecosystem').length;
    const underInvestigationCount = this.applications.filter(
      app => app.status === 'Targeted Verification Required' || app.status === 'Under Review' || app.ecosystemRisk >= 70
    ).length;
    const fastTrackedCount = this.applications.filter(app => app.ecosystemRisk < 45).length;

    const low = this.applications.filter(app => app.ecosystemRisk < 45).length;
    const medium = this.applications.filter(app => app.ecosystemRisk >= 45 && app.ecosystemRisk < 70).length;
    const high = this.applications.filter(app => app.ecosystemRisk >= 70).length;

    return {
      totalApplications,
      highEcosystemRiskApps,
      emergingEcosystemsCount,
      underInvestigationCount,
      fastTrackedCount,
      riskDistribution: { low, medium, high }
    };
  }
}

export const riskService = new RiskService();
