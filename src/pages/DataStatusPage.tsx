import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

type Status = 'Operational' | 'Delayed' | 'Error' | 'Simulated';

interface DataSource {
  id: string;
  name: string;
  category: string;
  last_updated: string;
  records_processed: number;
  status: Status;
  latency_ms: number;
  connector: string;
}

const SOURCES: DataSource[] = [
  { id: 'src-app', name: 'Applications', category: 'Core Lending', last_updated: '2 min ago', records_processed: 100, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-kyc', name: 'KYC / Identity', category: 'Compliance', last_updated: '2 min ago', records_processed: 98, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-bureau', name: 'Credit Bureau', category: 'Risk Data', last_updated: '2 min ago', records_processed: 95, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-dealer', name: 'Dealer & POS', category: 'Distribution', last_updated: '2 min ago', records_processed: 3, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-device', name: 'Device / IMEI', category: 'Telemetry', last_updated: '2 min ago', records_processed: 42, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-account', name: 'Bank Accounts', category: 'Financial', last_updated: '2 min ago', records_processed: 87, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-guarantor', name: 'Guarantors', category: 'Core Lending', last_updated: '2 min ago', records_processed: 34, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-location', name: 'Geo / Location', category: 'Telemetry', last_updated: '2 min ago', records_processed: 100, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-payment', name: 'Payments / UPI', category: 'Financial', last_updated: '2 min ago', records_processed: 212, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
  { id: 'src-mobile', name: 'Mobile Numbers', category: 'Telemetry', last_updated: '2 min ago', records_processed: 100, status: 'Simulated', latency_ms: 0, connector: 'Simulated Connector' },
];

const StatusChip: React.FC<{ status: Status }> = ({ status }) => {
  const map: Record<Status, { bg: string; color: string }> = {
    'Operational': { bg: '#f0fdf4', color: '#15803d' },
    'Delayed': { bg: '#fffbeb', color: '#b45309' },
    'Error': { bg: '#fef2f2', color: '#c41e3a' },
    'Simulated': { bg: '#f5f3ff', color: '#6d28d9' },
  };
  const { bg, color } = map[status] || { bg: '#f1f5f9', color: '#64748b' };
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: bg, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {status}
    </span>
  );
};

export const DataStatusPage: React.FC = () => {
  const [lastChecked, setLastChecked] = useState(new Date());

  const refresh = () => setLastChecked(new Date());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2137', margin: 0, letterSpacing: '-0.01em' }}>Data Status</h1>
          <p style={{ fontSize: '0.8125rem', color: '#8896a7', margin: '2px 0 0' }}>Connected data sources and ingestion pipeline status</p>
        </div>
        <button onClick={refresh} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f6f8', border: '1px solid #e1e5eb', borderRadius: 6, padding: '7px 12px', fontSize: '0.8125rem', fontWeight: 600, color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <AlertCircle size={16} color="#6d28d9" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: '0.8125rem', color: '#4c1d95', lineHeight: 1.6 }}>
          <strong>Demo Mode:</strong> All data sources are connected via a Simulated Connector. No live production systems are accessed. Records counts reflect synthetic dataset size.
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Sources', value: SOURCES.length, color: '#1a7a4a', icon: <Database size={16} /> },
          { label: 'Operational', value: 0, color: '#15803d', icon: <CheckCircle size={16} /> },
          { label: 'Simulated', value: SOURCES.length, color: '#6d28d9', icon: <AlertCircle size={16} /> },
          { label: 'Last Checked', value: lastChecked.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), color: '#0d2137', icon: <Clock size={16} /> },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8896a7' }}>{stat.label}</span>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Data sources table */}
      <div style={{ background: '#fff', border: '1px solid #e1e5eb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(13,33,55,0.06)' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #f0f2f5' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137' }}>Data Source Registry</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fc' }}>
              {['Source', 'Category', 'Connector', 'Records Processed', 'Last Updated', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8896a7', borderBottom: '1px solid #f0f2f5', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(src => (
              <tr key={src.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: '0.8125rem', color: '#0d2137', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Database size={14} color="#8896a7" />
                  {src.name}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: '#64748b' }}>{src.category}</td>
                <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#6d28d9', fontWeight: 600 }}>{src.connector}</td>
                <td style={{ padding: '12px 14px', fontSize: '0.8125rem', fontWeight: 700, color: '#0d2137' }}>{src.records_processed.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: '#8896a7' }}>{src.last_updated}</td>
                <td style={{ padding: '12px 14px' }}><StatusChip status={src.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
