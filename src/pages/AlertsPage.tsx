import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, ChevronDown, Filter } from 'lucide-react';

const API = 'http://localhost:8000';

const SEVERITY_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const s = severity?.toUpperCase();
  const map: Record<string, { bg: string; color: string; border: string }> = {
    HIGH: { bg: '#fef2f2', color: '#c41e3a', border: '#fca5a5' },
    MEDIUM: { bg: '#fffbeb', color: '#b45309', border: '#fcd34d' },
    LOW: { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  };
  const style = map[s] || { bg: '#f1f5f9', color: '#64748b', border: '#e1e5eb' };
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: style.bg, color: style.color, border: `1px solid ${style.border}`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {severity}
    </span>
  );
};

const AckBadge: React.FC<{ acked: boolean }> = ({ acked }) => (
  <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: acked ? '#f0fdf4' : '#fef2f2', color: acked ? '#15803d' : '#c41e3a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
    {acked ? 'Acknowledged' : 'Open'}
  </span>
);

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then(r => r.json())
      .then(data => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([
        { id: 'ALT-901', ecosystem_id: 'ECO-1024', app_id: 'APP-78287', severity: 'HIGH', title: 'EMERGING ECOSYSTEM DETECTED', description: 'Multi-applicant device collision with synchronized UPI sweep on IMEI 863920194827.', recommended_action: 'Verify Dealer Apex Auto + Device DEV-9810', time: '10:01:35' },
        { id: 'ALT-902', ecosystem_id: 'ECO-1033', app_id: 'APP-78325', severity: 'HIGH', title: 'DEALER CONCENTRATION SPIKE', description: 'Apex Auto velocity surge exceeding 4.2x baseline in first-time buyer applications.', recommended_action: 'Audit POS terminal logs for Apex Auto', time: '09:45:12' },
        { id: 'ALT-903', ecosystem_id: 'ECO-1045', app_id: 'APP-78304', severity: 'MEDIUM', title: 'SHARED GUARANTOR REUSE', description: 'Guarantor GNT-8890 co-signed 5 pending loans without declared familial affinity.', recommended_action: 'Request independent guarantor affidavit', time: '08:12:00' },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const handleAck = (id: string) => setAcknowledged(prev => ({ ...prev, [id]: true }));

  const filtered = alerts
    .filter(a => filterSeverity === 'ALL' || a.severity?.toUpperCase() === filterSeverity)
    .sort((a, b) => (SEVERITY_ORDER[a.severity?.toUpperCase()] ?? 9) - (SEVERITY_ORDER[b.severity?.toUpperCase()] ?? 9));

  const openCount = alerts.filter(a => !acknowledged[a.id]).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2137', margin: 0, letterSpacing: '-0.01em' }}>Alerts</h1>
          <p style={{ fontSize: '0.8125rem', color: '#8896a7', margin: '2px 0 0' }}>
            {openCount} open · {alerts.length} total
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={14} color="#8896a7" />
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            style={{ background: '#f5f6f8', border: '1px solid #e1e5eb', borderRadius: 6, padding: '6px 28px 6px 10px', fontSize: '0.8125rem', color: '#0d2137', cursor: 'pointer', fontFamily: 'inherit', outline: 'none', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238896a7' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fc' }}>
              {['Alert ID', 'Severity', 'Type', 'Description', 'App / Ecosystem', 'Recommended Action', 'Time', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8896a7', borderBottom: '1px solid #f0f2f5', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#8896a7', fontSize: '0.875rem' }}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#8896a7', fontSize: '0.875rem' }}>No alerts matching filter.</td></tr>
            ) : (
              filtered.map(alert => {
                const isAck = acknowledged[alert.id];
                return (
                  <tr key={alert.id} style={{ borderBottom: '1px solid #f0f2f5', opacity: isAck ? 0.7 : 1, transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#0d2137', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Bell size={12} color="#8896a7" />
                        {alert.id}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}><SeverityBadge severity={alert.severity || 'MEDIUM'} /></td>
                    <td style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>{alert.title?.split(' ').slice(0, 3).join(' ') || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#4a5568', maxWidth: 240 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{alert.description}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.6875rem', fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      <div>{alert.app_id || '—'}</div>
                      <div style={{ color: '#8896a7', fontWeight: 400 }}>{alert.ecosystem_id || '—'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#4a5568', maxWidth: 200 }}>
                      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{alert.recommended_action || '—'}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#8896a7', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{alert.time || '—'}</td>
                    <td style={{ padding: '12px 14px' }}><AckBadge acked={isAck} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {!isAck && (
                          <button
                            onClick={() => handleAck(alert.id)}
                            style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '4px 8px', borderRadius: 4, background: '#f5f6f8', border: '1px solid #e1e5eb', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/app/applications/${alert.app_id}`)}
                          style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '4px 8px', borderRadius: 4, background: '#1a7a4a', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                        >
                          Investigate <ArrowRight size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
