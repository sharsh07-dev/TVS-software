import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Network,
  TrendingUp,
  Search,
  AlertCircle,
  CheckCircle,
  GitBranch,
  Cpu,
  Database,
  ChevronRight,
  Activity,
  Users,
  FileText
} from 'lucide-react';
import eerisLogo from '../assets/eeris-logo.svg';

/* ── Animated counter ─────────────────────────────────────── */
const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end, suffix = '', duration = 2000
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count.toLocaleString()}{suffix}</>;
};

/* ── Flow step component ──────────────────────────────────── */
const FlowStep: React.FC<{ number: number; label: string; sub: string; last?: boolean }> = ({
  number, label, sub, last
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(74, 222, 128, 0.15)',
        border: '2px solid rgba(74, 222, 128, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', fontWeight: 800, color: '#4ade80', marginBottom: 12
      }}>{number}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sub}</div>
      </div>
    </div>
    {!last && (
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 40, color: '#334155', paddingLeft: 4, paddingRight: 4 }}>
        <ChevronRight size={20} />
      </div>
    )}
  </div>
);

/* ── Capability card ──────────────────────────────────────── */
const CapCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string }> = ({
  icon, title, desc, color
}) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e1e5eb',
    borderRadius: 12,
    padding: '28px 24px',
    borderTop: `3px solid ${color}`,
    transition: 'box-shadow 0.2s ease',
    cursor: 'default'
  }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,33,55,0.1)')}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 16, color
    }}>
      {icon}
    </div>
    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0d2137', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: '0.8125rem', color: '#4a5568', lineHeight: 1.6 }}>{desc}</div>
  </div>
);

/* ── Tech pill ─────────────────────────────────────────────── */
const TechPill: React.FC<{ name: string; role: string }> = ({ name, role }) => (
  <div style={{
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }}>
    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#e2e8f0' }}>{name}</span>
    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{role}</span>
  </div>
);

/* ── Main landing page ─────────────────────────────────────── */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#fff', fontFamily: "'Inter', sans-serif", margin: 0, padding: 0 }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(13, 33, 55, 0.98)' : '#0d2137',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.2s ease'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={eerisLogo} alt="EERIS Logo" style={{ width: 36, height: 36 }} />
            <div>
              <span style={{ fontWeight: 900, fontSize: '1.0625rem', color: '#fff', letterSpacing: '-0.01em' }}>EERIS</span>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block', lineHeight: 1, marginTop: 1, fontWeight: 600, textTransform: 'uppercase' }}>TVS Credit</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="#how-it-works" style={{
              color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500,
              textDecoration: 'none', padding: '6px 12px', borderRadius: 6,
              transition: 'color 0.15s'
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >How It Works</a>
            <a href="#capabilities" style={{
              color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500,
              textDecoration: 'none', padding: '6px 12px', borderRadius: 6,
              transition: 'color 0.15s'
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >Capabilities</a>
            <button
              onClick={() => navigate('/app')}
              style={{
                background: '#1a7a4a', color: '#fff',
                border: 'none', borderRadius: 6,
                padding: '8px 18px', fontWeight: 700, fontSize: '0.8125rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#145f39')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1a7a4a')}
            >
              Open EERIS <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(140deg, #0d2137 0%, #1a3550 50%, #0d3320 100%)',
        minHeight: '92vh',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />
        {/* Green glow */}
        <div style={{
          position: 'absolute', right: -200, top: '20%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(26,122,74,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(26,122,74,0.15)', border: '1px solid rgba(26,122,74,0.3)',
                borderRadius: 20, padding: '6px 14px', marginBottom: 28
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} className="pulse-dot" />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Internal Risk Platform · TVS Credit
                </span>
              </div>

              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', margin: 0, marginBottom: 8 }}>
                EERIS
              </h1>
              <div style={{ fontSize: '1.125rem', fontWeight: 500, color: '#94a3b8', marginBottom: 20, letterSpacing: '0.02em' }}>
                Evolving Ecosystem Risk Intelligence System
              </div>
              <p style={{ fontSize: '1.125rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
                Connected risk intelligence for modern lending. Detect coordinated fraud rings, 
                emerging ecosystems, and hidden borrower networks before financial exposure occurs.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/app')}
                  style={{
                    background: '#1a7a4a', color: '#fff',
                    border: 'none', borderRadius: 8,
                    padding: '14px 28px', fontWeight: 700, fontSize: '0.9375rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 24px rgba(26,122,74,0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#145f39'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1a7a4a'; e.currentTarget.style.transform = 'none'; }}
                >
                  Open EERIS Dashboard <ArrowRight size={16} />
                </button>
                <a href="#how-it-works"
                  style={{
                    background: 'rgba(255,255,255,0.08)', color: '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                    padding: '14px 28px', fontWeight: 600, fontSize: '0.9375rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    textDecoration: 'none', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                >
                  View How It Works
                </a>
              </div>
            </div>

            {/* Right — Live stats card */}
            <div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: 32,
                backdropFilter: 'blur(12px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <Activity size={16} color="#4ade80" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Live Portfolio Intelligence
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {[
                    { label: 'Applications Evaluated', value: 100, suffix: '', color: '#60a5fa' },
                    { label: 'Ecosystems Detected', value: 12, suffix: '', color: '#4ade80' },
                    { label: 'High-Risk Flagged', value: 23, suffix: '', color: '#f87171' },
                    { label: 'Open Investigations', value: 7, suffix: '', color: '#fbbf24' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 10, padding: '16px 14px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div style={{ fontSize: '1.875rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                        <Counter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: 6, fontWeight: 500 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini event feed */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                  <div style={{ fontSize: '0.6875rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    Recent Activity
                  </div>
                  {[
                    { time: '10:01', type: 'ALERT', text: 'ECO-1024 risk elevated to 84', color: '#f87171' },
                    { time: '09:58', type: 'INV', text: 'Case opened for APP-78287', color: '#fbbf24' },
                    { time: '09:45', type: 'DETECT', text: 'Device DEV-9810 shared across 4 apps', color: '#60a5fa' },
                  ].map((ev, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: '0.6875rem', color: '#475569', fontWeight: 600, width: 36, flexShrink: 0 }}>{ev.time}</span>
                      <span style={{
                        fontSize: '0.5625rem', fontWeight: 800, padding: '2px 6px', borderRadius: 3,
                        background: `${ev.color}20`, color: ev.color, letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0
                      }}>{ev.type}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{ev.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — PROBLEM ──────────────────────────────── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a7a4a', marginBottom: 12 }}>
              The Challenge
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0d2137', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              The Lending Ecosystem<br />
              <span style={{ color: '#1a7a4a' }}>Is Connected</span>
            </h2>
            <p style={{ fontSize: '1rem', color: '#4a5568', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Fraud rings share devices, guarantors, dealers, and accounts across 
              multiple applications. Individual credit scores miss these ecosystem-level signals.
            </p>
          </div>

          {/* Network visual */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fc, #e8f5ee)',
            border: '1px solid #e1e5eb',
            borderRadius: 16, padding: 48, textAlign: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Entity nodes */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
              {[
                { label: 'Borrowers', icon: <Users size={18} />, color: '#1d4ed8', bg: '#eff6ff' },
                { label: 'Applications', icon: <FileText size={18} />, color: '#1a7a4a', bg: '#e8f5ee' },
                { label: 'Dealers', icon: <Activity size={18} />, color: '#b45309', bg: '#fffbeb' },
                { label: 'Devices', icon: <Cpu size={18} />, color: '#6d28d9', bg: '#f5f3ff' },
                { label: 'Accounts', icon: <Database size={18} />, color: '#0e7490', bg: '#ecfeff' },
                { label: 'Guarantors', icon: <Shield size={18} />, color: '#be185d', bg: '#fdf2f8' },
                { label: 'Locations', icon: <Search size={18} />, color: '#374151', bg: '#f9fafb' },
                { label: 'Payments', icon: <TrendingUp size={18} />, color: '#047857', bg: '#ecfdf5' },
                { label: 'Mobile Nos.', icon: <Activity size={18} />, color: '#b45309', bg: '#fffbeb' },
              ].map(entity => (
                <div key={entity.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
                }}>
                  <div style={{
                    width: 52, height: 52,
                    background: entity.bg,
                    border: `2px solid ${entity.color}30`,
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: entity.color
                  }}>
                    {entity.icon}
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#4a5568' }}>{entity.label}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#0d2137', borderRadius: 8, padding: '12px 20px',
              color: '#fff', fontSize: '0.875rem', fontWeight: 600
            }}>
              <Network size={16} color="#4ade80" />
              EERIS maps every connection across all entities in real time
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — HOW IT WORKS ─────────────────────────── */}
      <section id="how-it-works" style={{
        padding: '80px 0',
        background: 'linear-gradient(140deg, #0d2137 0%, #1a3550 100%)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', marginBottom: 12 }}>
              Methodology
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
              How EERIS Works
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#94a3b8', maxWidth: 480, margin: '0 auto' }}>
              Six-stage pipeline from raw lending data to actionable risk decisions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            <FlowStep number={1} label="Data Ingestion" sub="Applications, KYC, Bureau, Devices, Accounts" />
            <FlowStep number={2} label="Entity Resolution" sub="De-duplicate & resolve shared identities" />
            <FlowStep number={3} label="Graph Construction" sub="Dynamic lending relationship graph" />
            <FlowStep number={4} label="Graph Intelligence" sub="GNN + XGBoost ecosystem scoring" />
            <FlowStep number={5} label="Risk Analysis" sub="Individual vs ecosystem risk divergence" />
            <FlowStep number={6} label="Decision Action" sub="Route to investigation or fast-track" last />
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — CAPABILITIES ─────────────────────────── */}
      <section id="capabilities" style={{ padding: '80px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a7a4a', marginBottom: 12 }}>
              Core Capabilities
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0d2137', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Built for <span style={{ color: '#1a7a4a' }}>Operational Risk</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <CapCard
              icon={<Network size={22} />}
              title="Dynamic Lending Graph"
              desc="Real-time entity relationship mapping across borrowers, devices, dealers, accounts, and guarantors."
              color="#1a7a4a"
            />
            <CapCard
              icon={<AlertCircle size={22} />}
              title="Emerging Risk Detection"
              desc="Detect coordinated application bursts, device reuse rings, and dealer concentration anomalies before disbursal."
              color="#c41e3a"
            />
            <CapCard
              icon={<GitBranch size={22} />}
              title="Ecosystem Evolution"
              desc="Track how risk networks grow over time. Identify maturity stages and predict escalation trajectories."
              color="#1d4ed8"
            />
            <CapCard
              icon={<CheckCircle size={22} />}
              title="Explainable Intervention"
              desc="Every risk flag includes ranked drivers and counterfactual analysis. Human-in-the-loop decisions only."
              color="#b45309"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — REAL-TIME EXAMPLE ─────────────────────── */}
      <section style={{ padding: '80px 0', background: '#f5f6f8' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1a7a4a', marginBottom: 12 }}>
              Demo Scenario
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0d2137', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              ECO-1024 · Fraud Ring Timeline
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { day: 'Day 1', event: 'Application', sub: 'APP-78287 submitted by Sunita Verma via Apex Auto', risk: 31, color: '#15803d', badge: 'Low Risk' },
              { day: 'Day 7', event: 'Device Shared', sub: 'Borrower B31 submits APP-78294 on same device DEV-9810', risk: 42, color: '#b45309', badge: 'Growing' },
              { day: 'Day 14', event: 'Ecosystem Forming', sub: 'Guarantor GNT-8890 reused. 3rd borrower appears. Stage 2.', risk: 61, color: '#b45309', badge: 'Medium' },
              { day: 'Day 21', event: 'Payment Anomaly', sub: 'UPI sweep pattern detected across shared accounts', risk: 84, color: '#c41e3a', badge: 'High Risk' },
              { day: 'Now', event: 'Investigation', sub: 'Case opened. Analyst assigned. Ecosystem mapped.', risk: 84, color: '#6d28d9', badge: 'Active' },
            ].map((step, i) => (
              <div key={i} style={{
                background: '#fff',
                border: `1px solid ${step.color}40`,
                borderTop: `3px solid ${step.color}`,
                borderRadius: 12,
                padding: '20px 16px',
                position: 'relative'
              }}>
                {i < 4 && (
                  <div style={{
                    position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)',
                    zIndex: 1, color: '#cbd5e1'
                  }}>
                    <ChevronRight size={14} />
                  </div>
                )}
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#8896a7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  {step.day}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d2137', marginBottom: 8 }}>
                  {step.event}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>
                  {step.sub}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: step.color }}>{step.risk}</span>
                  <span style={{
                    fontSize: '0.5625rem', fontWeight: 700, padding: '2px 7px',
                    borderRadius: 4, background: `${step.color}15`, color: step.color,
                    textTransform: 'uppercase', letterSpacing: '0.06em', border: `1px solid ${step.color}30`
                  }}>{step.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — TECHNOLOGY ─────────────────────────────── */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(140deg, #0d2137 0%, #1a3550 100%)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4ade80', marginBottom: 12 }}>
              Technology Stack
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Production-Grade Infrastructure
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <TechPill name="Python 3.11" role="Core engine & data pipeline" />
            <TechPill name="PyTorch" role="Neural network training" />
            <TechPill name="PyTorch Geometric" role="Graph neural networks" />
            <TechPill name="Neo4j" role="Graph database" />
            <TechPill name="FastAPI" role="REST API layer" />
            <TechPill name="XGBoost" role="Gradient boosting risk model" />
            <TechPill name="React + Vite" role="Frontend application" />
            <TechPill name="MLflow" role="Model registry & tracking" />
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — ENTER CTA ─────────────────────────────── */}
      <section style={{ padding: '100px 0', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 40px' }}>
          <img src={eerisLogo} alt="EERIS Logo" style={{ width: 64, height: 64, margin: '0 auto 24px', display: 'block' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0d2137', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.15 }}>
            Ready to investigate<br />your ecosystem?
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.7, marginBottom: 40 }}>
            Open the EERIS dashboard to view live risk intelligence, 
            investigate emerging ecosystems, and manage your investigation queue.
          </p>
          <button
            onClick={() => navigate('/app')}
            style={{
              background: '#1a7a4a', color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '16px 40px', fontWeight: 800, fontSize: '1rem',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 24px rgba(26,122,74,0.35)',
              transition: 'all 0.2s', letterSpacing: '-0.01em'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#145f39'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,122,74,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1a7a4a'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,122,74,0.35)'; }}
          >
            Open EERIS Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{
        background: '#0d2137',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={eerisLogo} alt="EERIS Logo" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 500 }}>
            EERIS · TVS Credit · Internal Risk Intelligence Platform
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
            Demo Mode · Simulated Data · Not connected to production systems
          </span>
          <span style={{
            background: 'rgba(26,122,74,0.15)', border: '1px solid rgba(26,122,74,0.3)',
            color: '#4ade80', fontSize: '0.6875rem', fontWeight: 700,
            padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.06em'
          }}>Human-in-the-Loop</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
