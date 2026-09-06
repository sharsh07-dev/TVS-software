import React from 'react';
import { BarChart2, Download, FileText, Network, ShieldAlert } from 'lucide-react';

const REPORTS = [
  { id: 'rpt-risk-summary', name: 'Risk Summary Report', description: 'Portfolio-level risk distribution, high-risk applications, and ecosystem concentration metrics.', type: 'Risk', frequency: 'On-demand', format: 'PDF / CSV', icon: ShieldAlert, color: '#c41e3a' },
  { id: 'rpt-ecosystem', name: 'Ecosystem Intelligence Report', description: 'All active ecosystem clusters with maturity scores, node counts, and investigation status.', type: 'Ecosystem', frequency: 'On-demand', format: 'PDF / CSV', icon: Network, color: '#1d4ed8' },
  { id: 'rpt-investigation', name: 'Investigation Activity Report', description: 'Open, escalated, and resolved investigations with analyst notes and resolution times.', type: 'Operations', frequency: 'On-demand', format: 'PDF', icon: FileText, color: '#b45309' },
  { id: 'rpt-dealer', name: 'Dealer Concentration Report', description: 'Dealer velocity metrics, ecosystem contribution scores, and verification recommendations.', type: 'Dealer', frequency: 'On-demand', format: 'PDF / CSV', icon: BarChart2, color: '#1a7a4a' },
  { id: 'rpt-monthly', name: 'Monthly Risk Digest', description: 'Aggregated monthly risk trend analysis with ecosystem growth and model performance metrics.', type: 'Periodic', frequency: 'Monthly', format: 'PDF', icon: BarChart2, color: '#6d28d9' },
];

export const ReportsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2137', margin: 0, letterSpacing: '-0.01em' }}>Reports</h1>
          <p style={{ fontSize: '0.8125rem', color: '#8896a7', margin: '2px 0 0' }}>Generate and export risk intelligence reports</p>
        </div>
      </div>

      {/* Reports grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {REPORTS.map(report => (
          <div key={report.id} style={{
            background: '#fff',
            border: '1px solid #e1e5eb',
            borderRadius: 10,
            padding: '20px 22px',
            boxShadow: '0 1px 3px rgba(13,33,55,0.06)',
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: `${report.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <report.icon size={18} color={report.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>{report.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: `${report.color}12`, color: report.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {report.type}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: '#8896a7', fontWeight: 500 }}>{report.frequency}</span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{report.description}</p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f0f2f5' }}>
              <span style={{ fontSize: '0.75rem', color: '#8896a7', fontWeight: 500 }}>Format: {report.format}</span>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: '#f5f6f8', border: '1px solid #e1e5eb',
                borderRadius: 6, padding: '6px 12px',
                fontSize: '0.75rem', fontWeight: 600, color: '#4a5568',
                cursor: 'not-allowed', fontFamily: 'inherit', opacity: 0.7
              }} disabled title="Report generation available in production mode">
                <Download size={12} /> Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon notice */}
      <div style={{ background: '#f5f6f8', border: '1px solid #e1e5eb', borderRadius: 8, padding: '14px 18px', fontSize: '0.8125rem', color: '#64748b', textAlign: 'center' }}>
        Report generation is available in production mode with live data connections.
      </div>
    </div>
  );
};
