import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, ShieldAlert, Network, Search, Bell,
  ArrowRight, ChevronRight, Radio
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { backendClient } from '../services/backendClient';

const API = 'http://localhost:8000';

/* ─── Metric card ──────────────────────────────────────────── */
const MetricCard: React.FC<{
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
  onClick?: () => void;
}> = ({ label, value, sub, icon, accent = '#1a7a4a', onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff',
      border: '1px solid #e1e5eb',
      borderRadius: 10,
      padding: '16px 18px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s',
      boxShadow: '0 1px 3px rgba(13,33,55,0.06)'
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,33,55,0.1)'; }}
    onMouseLeave={e => { if (onClick) e.currentTarget.style.boxShadow = '0 1px 3px rgba(13,33,55,0.06)'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8896a7' }}>
        {label}
      </span>
      <span style={{ color: accent, opacity: 0.8 }}>{icon}</span>
    </div>
    <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0d2137', lineHeight: 1, marginBottom: 4 }}>
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: '0.6875rem', color: '#8896a7', fontWeight: 500 }}>{sub}</div>
    )}
  </div>
);

/* ─── Risk badge ───────────────────────────────────────────── */
const RiskScore: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? '#c41e3a' : score >= 45 ? '#b45309' : '#15803d';
  const bg = score >= 70 ? '#fef2f2' : score >= 45 ? '#fffbeb' : '#f0fdf4';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: bg, color,
      fontWeight: 800, fontSize: '0.75rem',
      padding: '2px 8px', borderRadius: 4,
      minWidth: 36, justifyContent: 'center'
    }}>{score}</span>
  );
};

/* ─── Status chip ──────────────────────────────────────────── */
const EcoStatus: React.FC<{ status: string }> = ({ status }) => {
  const s = status?.toLowerCase() || '';
  let color = '#64748b', bg = '#f1f5f9';
  if (s.includes('open') || s.includes('risk')) { color = '#c41e3a'; bg = '#fef2f2'; }
  else if (s.includes('monitor')) { color = '#b45309'; bg = '#fffbeb'; }
  else if (s.includes('stable') || s.includes('verify')) { color = '#15803d'; bg = '#f0fdf4'; }
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: bg, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {status}
    </span>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [ecosystems, setEcosystems] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/metrics`).then(r => r.json()).catch(() => null),
      fetch(`${API}/applications?page_size=8`).then(r => r.json()).catch(() => ({ applications: [] })),
      fetch(`${API}/ecosystems`).then(r => r.json()).catch(() => []),
      fetch(`${API}/alerts`).then(r => r.json()).catch(() => []),
    ]).then(([m, apps, eco, alts]) => {
      setMetrics(m || {
        total_applications: 100, high_ecosystem_risk: 23,
        emerging_ecosystems: 12, under_investigation: 7,
        fast_tracked: 54, risk_distribution: { low: 54, medium: 23, high: 23 }
      });
      setApplications((apps?.applications || []).filter((a: any) => a.ecosystem_risk >= 70).slice(0, 5));
      setEcosystems((Array.isArray(eco) ? eco : []).slice(0, 5));
      setAlerts((Array.isArray(alts) ? alts : []).slice(0, 3));
    }).finally(() => setLoading(false));

    // Simulated live event feed initial state
    setEvents([
      { id: 'e1', time: '10:01:41', type: 'INVESTIGATION', text: 'INV-78287 opened for Sunita Verma', appId: 'APP-78287' },
      { id: 'e2', time: '10:01:35', type: 'ALERT', text: 'ECO-1024 risk elevated to 84', ecosystemId: 'ECO-1024' },
      { id: 'e3', time: '10:01:34', type: 'RISK SPIKE', text: 'Risk increased: 61 → 84 after payment anomaly', appId: 'APP-78287' },
      { id: 'e4', time: '10:01:25', type: 'LINK', text: 'Borrower B31 linked to shared device DEV-9810', appId: 'APP-78287' },
      { id: 'e5', time: '10:01:13', type: 'LINK', text: 'Dealer Apex Auto linked to APP-78287', appId: 'APP-78287' },
    ]);
    
    // Subscribe to real-time events
    const unsubscribe = backendClient.subscribeEvents((event: any) => {
      setEvents(prev => {
        const newEvent = {
          id: `ev-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: event.type === 'INVESTIGATION_STARTED' ? 'INVESTIGATION' : event.type,
          text: event.message || event.type,
          appId: event.case_id || event.application_id,
          ecosystemId: event.ecosystem_id
        };
        return [newEvent, ...prev].slice(0, 20); // Keep last 20
      });
    });
    
    return () => unsubscribe();
  }, []);

  const riskDist = metrics?.risk_distribution || { low: 0, medium: 0, high: 0 };
  const chartData = [
    { name: 'Low', value: riskDist.low, color: '#15803d' },
    { name: 'Medium', value: riskDist.medium, color: '#b45309' },
    { name: 'High', value: riskDist.high, color: '#c41e3a' },
  ];

  // Fallback demo ecosystems
  const demoEcosystems = [
    { id: 'ECO-1024', risk_score: 84, maturity: 'Stage 3', growth: 'High', node_count: 11, updated_at: '2 min ago', status: 'Open' },
    { id: 'ECO-1033', risk_score: 71, maturity: 'Stage 2', growth: 'Medium', node_count: 8, updated_at: '6 min ago', status: 'Monitoring' },
    { id: 'ECO-1045', risk_score: 58, maturity: 'Stage 2', growth: 'Medium', node_count: 6, updated_at: '14 min ago', status: 'Monitoring' },
    { id: 'ECO-1061', risk_score: 32, maturity: 'Stage 1', growth: 'Low', node_count: 4, updated_at: '1 hr ago', status: 'Stable' },
    { id: 'ECO-0173', risk_score: 28, maturity: 'Stage 1', growth: 'Low', node_count: 12, updated_at: '2 hr ago', status: 'Verified' },
  ];
  const ecoRows = ecosystems.length > 0 ? ecosystems : demoEcosystems;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <span style={{ color: '#8896a7', fontSize: '0.875rem' }}>Loading…</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2137', margin: 0, letterSpacing: '-0.01em' }}>
            Risk Overview
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#8896a7', margin: '2px 0 0', fontWeight: 400 }}>
            Portfolio intelligence · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/app/applications')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#1a7a4a', color: '#fff',
            border: 'none', borderRadius: 6, padding: '8px 14px',
            fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          <FileText size={14} /> View All Applications
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <MetricCard
          label="Applications"
          value={metrics?.total_applications ?? '—'}
          sub="Total evaluated"
          icon={<FileText size={16} />}
          accent="#1a7a4a"
          onClick={() => navigate('/app/applications')}
        />
        <MetricCard
          label="High-Risk"
          value={metrics?.high_ecosystem_risk ?? '—'}
          sub="Ecosystem risk ≥ 70"
          icon={<ShieldAlert size={16} />}
          accent="#c41e3a"
          onClick={() => navigate('/app/applications')}
        />
        <MetricCard
          label="Emerging Ecosystems"
          value={metrics?.emerging_ecosystems ?? '—'}
          sub="Active clusters"
          icon={<Network size={16} />}
          accent="#b45309"
          onClick={() => navigate('/app/ecosystems')}
        />
        <MetricCard
          label="Open Investigations"
          value={metrics?.under_investigation ?? '—'}
          sub="Requiring action"
          icon={<Search size={16} />}
          accent="#1d4ed8"
          onClick={() => navigate('/app/investigations')}
        />
        <MetricCard
          label="Active Alerts"
          value={alerts.length || 3}
          sub="Unacknowledged"
          icon={<Bell size={16} />}
          accent="#c41e3a"
          onClick={() => navigate('/app/alerts')}
        />
      </div>

      {/* Mid row — chart + event feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Risk distribution chart */}
        <div style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, padding: '20px', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f2f5' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>Risk Distribution</div>
              <div style={{ fontSize: '0.75rem', color: '#8896a7', marginTop: 2 }}>{metrics?.total_applications || 0} applications</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {[{ c: '#15803d', l: 'Low' }, { c: '#b45309', l: 'Medium' }, { c: '#c41e3a', l: 'High' }].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: x.c, display: 'inline-block' }} />
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500 }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#8896a7', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8896a7' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d2137', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12 }}
                cursor={{ fill: 'rgba(13,33,55,0.04)' }}
                formatter={(val: any) => [val, 'Applications']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Progress bars */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {chartData.map(bar => (
              <div key={bar.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 44, fontSize: '0.6875rem', fontWeight: 600, color: '#4a5568' }}>{bar.name}</span>
                <div style={{ flex: 1, height: 6, background: '#f0f2f5', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: bar.color, borderRadius: 3,
                    width: `${(bar.value / (metrics?.total_applications || 100)) * 100}%`,
                    transition: 'width 0.6s ease'
                  }} />
                </div>
                <span style={{ width: 28, fontSize: '0.6875rem', fontWeight: 700, color: '#0d2137', textAlign: 'right' }}>{bar.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live event feed */}
        <div style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, padding: '20px', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f2f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={14} color="#c41e3a" style={{ animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>Event Stream</span>
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, background: '#fef2f2', color: '#c41e3a', border: '1px solid #fca5a5', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {events.map(ev => {
              const typeColors: Record<string, string> = {
                'ALERT': '#c41e3a', 'RISK SPIKE': '#b45309', 'INVESTIGATION': '#1d4ed8', 'LINK': '#1a7a4a'
              };
              const tc = typeColors[ev.type] || '#64748b';
              return (
                <div key={ev.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 6, cursor: ev.appId ? 'pointer' : 'default',
                  transition: 'background 0.1s'
                }}
                  onClick={() => ev.appId && navigate(`/app/applications/${ev.appId}`)}
                  onMouseEnter={e => { if (ev.appId) e.currentTarget.style.background = '#f5f6f8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '0.625rem', color: '#8896a7', fontWeight: 600, width: 40, flexShrink: 0, fontFamily: 'monospace' }}>{ev.time}</span>
                  <span style={{
                    fontSize: '0.5625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                    background: `${tc}15`, color: tc, textTransform: 'uppercase', letterSpacing: '0.05em',
                    flexShrink: 0, whiteSpace: 'nowrap'
                  }}>{ev.type}</span>
                  <span style={{ fontSize: '0.75rem', color: '#4a5568', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.text}</span>
                  {ev.appId && <ChevronRight size={12} color="#8896a7" style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row — high-risk apps + ecosystems */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* High-risk applications */}
        <div style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #f0f2f5' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>High-Risk Applications</span>
              <div style={{ fontSize: '0.75rem', color: '#8896a7', marginTop: 1 }}>Ecosystem risk ≥ 70</div>
            </div>
            <button
              onClick={() => navigate('/app/applications')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: '#1a7a4a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fc' }}>
                {['Application', 'Customer', 'Ind.', 'Eco.', ''].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8896a7', borderBottom: '1px solid #f0f2f5', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(applications.length > 0 ? applications : [
                { id: 'APP-78287', applicant_name: 'Sunita Verma', individual_risk: 31, ecosystem_risk: 84 },
                { id: 'APP-78294', applicant_name: 'K. Rao', individual_risk: 38, ecosystem_risk: 82 },
                { id: 'APP-78308', applicant_name: 'M. Patel', individual_risk: 42, ecosystem_risk: 89 },
                { id: 'APP-78315', applicant_name: 'A. Singh', individual_risk: 35, ecosystem_risk: 75 },
              ]).map((app: any) => (
                <tr key={app.id}
                  onClick={() => navigate(`/app/applications/${app.id}`)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #f0f2f5', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#0d2137', fontFamily: 'monospace' }}>{app.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: '0.8125rem', color: '#4a5568' }}>{app.applicant_name || app.applicantName}</td>
                  <td style={{ padding: '10px 14px' }}><RiskScore score={app.individual_risk || app.individualRisk || 0} /></td>
                  <td style={{ padding: '10px 14px' }}><RiskScore score={app.ecosystem_risk || app.ecosystemRisk || 0} /></td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <ChevronRight size={14} color="#8896a7" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Emerging ecosystems */}
        <div style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #f0f2f5' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>Emerging Ecosystems</span>
              <div style={{ fontSize: '0.75rem', color: '#8896a7', marginTop: 1 }}>Active risk clusters</div>
            </div>
            <button
              onClick={() => navigate('/app/ecosystems')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: '#1a7a4a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Explore Graph <ArrowRight size={12} />
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fc' }}>
                {['Ecosystem', 'Risk', 'Maturity', 'Entities', 'Updated', 'Status'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8896a7', borderBottom: '1px solid #f0f2f5', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ecoRows.map((eco: any) => (
                <tr key={eco.id}
                  onClick={() => navigate('/app/ecosystems')}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #f0f2f5', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#0d2137', fontFamily: 'monospace' }}>{eco.id}</td>
                  <td style={{ padding: '10px 12px' }}><RiskScore score={eco.risk_score || eco.riskScore || 0} /></td>
                  <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#4a5568' }}>{eco.maturity || 'Stage 1'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#4a5568', fontWeight: 600 }}>{eco.node_count || eco.nodesCount || '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: '0.6875rem', color: '#8896a7', whiteSpace: 'nowrap' }}>{eco.updated_at || '—'}</td>
                  <td style={{ padding: '10px 12px' }}><EcoStatus status={eco.status || 'Unknown'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
