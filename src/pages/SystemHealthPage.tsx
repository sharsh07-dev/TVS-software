import React, { useState } from 'react';
import { Activity, CheckCircle, AlertCircle, XCircle, RefreshCw, Clock } from 'lucide-react';

type ServiceStatus = 'Operational' | 'Warning' | 'Unavailable';

interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  latency?: string;
  uptime: string;
  lastChecked: string;
}

const SERVICES: Service[] = [
  { id: 'svc-api', name: 'API Server', description: 'FastAPI risk intelligence REST API', status: 'Operational', latency: '12ms', uptime: '100%', lastChecked: 'Just now' },
  { id: 'svc-db', name: 'Database', description: 'SQLite application & entity store', status: 'Operational', latency: '3ms', uptime: '100%', lastChecked: 'Just now' },
  { id: 'svc-graph', name: 'Graph Engine', description: 'Entity relationship graph construction', status: 'Operational', latency: '28ms', uptime: '100%', lastChecked: 'Just now' },
  { id: 'svc-model', name: 'Risk Model', description: 'XGBoost + GNN ecosystem scoring', status: 'Operational', latency: '45ms', uptime: '100%', lastChecked: 'Just now' },
  { id: 'svc-pipeline', name: 'Data Pipeline', description: 'Synthetic data ingestion & normalization', status: 'Operational', latency: '—', uptime: '100%', lastChecked: 'Just now' },
  { id: 'svc-neo4j', name: 'Graph Database', description: 'Neo4j entity graph store (Demo: SQLite fallback)', status: 'Warning', latency: '—', uptime: '—', lastChecked: 'Just now' },
];

const StatusIcon: React.FC<{ status: ServiceStatus; size?: number }> = ({ status, size = 16 }) => {
  if (status === 'Operational') return <CheckCircle size={size} color="#15803d" />;
  if (status === 'Warning') return <AlertCircle size={size} color="#b45309" />;
  return <XCircle size={size} color="#c41e3a" />;
};

const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const map: Record<ServiceStatus, { bg: string; color: string }> = {
    'Operational': { bg: '#f0fdf4', color: '#15803d' },
    'Warning': { bg: '#fffbeb', color: '#b45309' },
    'Unavailable': { bg: '#fef2f2', color: '#c41e3a' },
  };
  const { bg, color } = map[status];
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: bg, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {status}
    </span>
  );
};

export const SystemHealthPage: React.FC = () => {
  const [lastChecked, setLastChecked] = useState(new Date());

  const operational = SERVICES.filter(s => s.status === 'Operational').length;
  const warning = SERVICES.filter(s => s.status === 'Warning').length;
  const down = SERVICES.filter(s => s.status === 'Unavailable').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2137', margin: 0, letterSpacing: '-0.01em' }}>System Health</h1>
          <p style={{ fontSize: '0.8125rem', color: '#8896a7', margin: '2px 0 0' }}>Service availability and performance metrics</p>
        </div>
        <button
          onClick={() => setLastChecked(new Date())}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f6f8', border: '1px solid #e1e5eb', borderRadius: 6, padding: '7px 12px', fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Overall status banner */}
      <div style={{
        background: down > 0 ? '#fef2f2' : warning > 0 ? '#fffbeb' : '#f0fdf4',
        border: `1px solid ${down > 0 ? '#fca5a5' : warning > 0 ? '#fcd34d' : '#86efac'}`,
        borderRadius: 10, padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusIcon status={down > 0 ? 'Unavailable' : warning > 0 ? 'Warning' : 'Operational'} size={20} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0d2137' }}>
              {down > 0 ? 'System Degraded' : warning > 0 ? 'Partial Degradation' : 'All Systems Operational'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
              {operational} operational · {warning} warning · {down} unavailable
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#8896a7' }}>
          <Clock size={13} />
          <span>Checked at {lastChecked.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Operational', value: operational, color: '#15803d', bg: '#f0fdf4', border: '#86efac', icon: <CheckCircle size={16} color="#15803d" /> },
          { label: 'Warning', value: warning, color: '#b45309', bg: '#fffbeb', border: '#fcd34d', icon: <AlertCircle size={16} color="#b45309" /> },
          { label: 'Unavailable', value: down, color: '#c41e3a', bg: '#fef2f2', border: '#fca5a5', icon: <XCircle size={16} color="#c41e3a" /> },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {stat.icon}
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Service grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {SERVICES.map(svc => (
          <div key={svc.id} style={{
            background: '#fff',
            border: `1px solid ${svc.status === 'Operational' ? '#e1e5eb' : svc.status === 'Warning' ? '#fcd34d' : '#fca5a5'}`,
            borderRadius: 10,
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(13,33,55,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={16} color="#8896a7" />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>{svc.name}</span>
              </div>
              <StatusBadge status={svc.status} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 14px', lineHeight: 1.5 }}>{svc.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8896a7', marginBottom: 3 }}>Latency</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0d2137' }}>{svc.latency || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8896a7', marginBottom: 3 }}>Uptime</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: svc.status === 'Operational' ? '#15803d' : '#b45309' }}>{svc.uptime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
