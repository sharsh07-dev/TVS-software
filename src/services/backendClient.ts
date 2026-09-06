import type {
  DashboardMetrics,
  LiveEcosystemEvent
} from '../types/eeris';

const API_BASE = 'http://localhost:8000';

class BackendClient {
  private ws: WebSocket | null = null;
  private eventListeners: Array<(event: LiveEcosystemEvent) => void> = [];

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    try {
      this.ws = new WebSocket('ws://localhost:8000/ws/events');
      this.ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          this.eventListeners.forEach(listener => listener(data));
        } catch {
          // ignore
        }
      };
    } catch {
      // WS unavailable fallback
    }
  }

  public subscribeEvents(callback: (event: LiveEcosystemEvent) => void) {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== callback);
    };
  }

  public async fetchApplications(search = '', riskFilter = 'All Profiles', page = 1, pageSize = 20) {
    try {
      const res = await fetch(`${API_BASE}/applications?search=${encodeURIComponent(search)}&risk_filter=${encodeURIComponent(riskFilter)}&page=${page}&page_size=${pageSize}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null;
    }
  }

  public async fetchApplication(id: string) {
    try {
      const res = await fetch(`${API_BASE}/applications/${id}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null;
    }
  }

  public async fetchMetrics(): Promise<DashboardMetrics | null> {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return {
        totalApplications: data.total_applications,
        highEcosystemRiskApps: data.high_ecosystem_risk,
        emergingEcosystemsCount: data.emerging_ecosystems,
        underInvestigationCount: data.under_investigation,
        fastTrackedCount: data.fast_tracked,
        riskDistribution: data.risk_distribution
      };
    } catch {
      return null;
    }
  }

  public async fetchGraph(ecosystemId = 'ECO-1024', stage = 'Current') {
    try {
      const res = await fetch(`${API_BASE}/ecosystems/${ecosystemId}/graph?stage=${encodeURIComponent(stage)}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null;
    }
  }

  public async simulateIntervention(appId: string, actionType = 'Verify Dealer + Device') {
    try {
      const res = await fetch(`${API_BASE}/interventions/${appId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: actionType })
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  public async markFalsePositive(investigationId: string, ecosystemId = 'ECO-00173') {
    try {
      const res = await fetch(`${API_BASE}/investigations/${investigationId}/false-positive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ecosystem_id: ecosystemId })
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  public async stepSimulation(stage: string) {
    try {
      const res = await fetch(`${API_BASE}/simulation/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const backendClient = new BackendClient();
