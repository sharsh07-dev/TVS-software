import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Network,
  TrendingUp,
  Bell,
  ShieldAlert,
  Store,
  
  Database,
  
  
  BarChart2
} from 'lucide-react';
import eerisLogo from '../../assets/eeris-logo.svg';

const NAV_MAIN = [
  { label: 'Overview', path: '/app/overview', icon: LayoutDashboard },
  { label: 'Applications', path: '/app/applications', icon: FileText },
  { label: 'Ecosystems', path: '/app/ecosystems', icon: Network },
  { label: 'Risk Analysis', path: '/app/risk-analysis', icon: TrendingUp },
  { label: 'Investigations', path: '/app/investigations', icon: ShieldAlert },
  { label: 'Alerts', path: '/app/alerts', icon: Bell },
  { label: 'Dealers', path: '/app/dealers', icon: Store },
  { label: 'Reports', path: '/app/reports', icon: BarChart2 },
];

const NAV_ADMIN = [
  { label: 'Data Status', path: '/app/data-status', icon: Database },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 224,
      background: '#0d2137',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 30,
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer'
      }} onClick={() => navigate('/')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={eerisLogo} alt="EERIS Logo" style={{ width: 36, height: 36, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.0625rem', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1 }}>
              EERIS
            </div>
            <div style={{ fontSize: '0.5625rem', color: '#94a3b8', marginTop: 3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              TVS Credit
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '12px 8px' }}>
        <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', padding: '0 8px', marginBottom: 4, marginTop: 8 }}>
          Risk Intelligence
        </div>
        <nav>
          {NAV_MAIN.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 10px',
                borderRadius: 6,
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : '#64748b',
                background: isActive ? '#1a7a4a' : 'transparent',
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'all 0.12s ease',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!el.style.background.includes('1a7a4a')) {
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!el.style.background.includes('1a7a4a')) {
                  el.style.background = 'transparent';
                  el.style.color = '#64748b';
                }
              }}
            >
              <item.icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', padding: '0 8px', marginBottom: 4, marginTop: 20 }}>
          Administration
        </div>
        <nav>
          {NAV_ADMIN.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 10px',
                borderRadius: 6,
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : '#64748b',
                background: isActive ? '#1a7a4a' : 'transparent',
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'all 0.12s ease',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                if (!el.style.background.includes('1a7a4a')) {
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                if (!el.style.background.includes('1a7a4a')) {
                  el.style.background = 'transparent';
                  el.style.color = '#64748b';
                }
              }}
            >
              <item.icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom status */}
      <div style={{
        padding: '12px 8px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* System status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 10px', marginBottom: 8,
          background: 'rgba(26,122,74,0.12)',
          borderRadius: 6, border: '1px solid rgba(26,122,74,0.2)'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} className="pulse-dot" />
          <span style={{ fontSize: '0.6875rem', color: '#4ade80', fontWeight: 600 }}>System Operational</span>
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}>
          <div style={{
            width: 28, height: 28,
            background: '#1d4ed8',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.625rem', fontWeight: 800, color: '#fff', flexShrink: 0
          }}>RA</div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1 }}>Risk Analyst</div>
            <div style={{ fontSize: '0.5625rem', color: '#475569', marginTop: 2 }}>Demo Mode</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
