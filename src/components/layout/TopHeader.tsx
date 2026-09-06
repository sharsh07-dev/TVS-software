import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, RefreshCw, ChevronDown, Calendar } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/app/applications?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <header style={{
      height: 56,
      background: '#fff',
      borderBottom: '1px solid #e1e5eb',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxShadow: '0 1px 3px rgba(13,33,55,0.04)'
    }}>
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 440 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#8896a7" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search application, customer, dealer, device or ecosystem..."
            style={{
              width: '100%',
              background: '#f5f6f8',
              border: '1px solid #e1e5eb',
              borderRadius: 6,
              padding: '7px 12px 7px 32px',
              fontSize: '0.8125rem',
              color: '#0d2137',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.15s'
            }}
            onFocus={e => { e.target.style.borderColor = '#1a7a4a'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(26,122,74,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#e1e5eb'; e.target.style.background = '#f5f6f8'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Date range */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#f5f6f8', border: '1px solid #e1e5eb',
          borderRadius: 6, padding: '6px 12px',
          fontSize: '0.75rem', fontWeight: 500, color: '#4a5568',
          cursor: 'pointer', fontFamily: 'inherit'
        }}>
          <Calendar size={13} color="#8896a7" />
          <span>Last 30 days</span>
          <ChevronDown size={12} color="#8896a7" />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          title="Refresh data"
          style={{
            width: 32, height: 32,
            background: '#f5f6f8',
            border: '1px solid #e1e5eb',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.1s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e8edf2')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f5f6f8')}
        >
          <RefreshCw size={14} color="#4a5568" style={{ transition: 'transform 0.6s', transform: refreshing ? 'rotate(360deg)' : 'none' }} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/app/alerts')}
          title="3 active alerts"
          style={{
            width: 32, height: 32,
            background: '#f5f6f8',
            border: '1px solid #e1e5eb',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
            transition: 'background 0.1s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e8edf2')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f5f6f8')}
        >
          <Bell size={14} color="#4a5568" />
          <span style={{
            position: 'absolute', top: 5, right: 5,
            width: 7, height: 7, borderRadius: '50%',
            background: '#c41e3a',
            border: '1.5px solid #fff'
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#e1e5eb' }} />

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
          <div style={{
            width: 30, height: 30,
            background: '#1d4ed8',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.625rem', fontWeight: 800, color: '#fff'
          }}>AM</div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0d2137' }}>Arjun Mehta</div>
            <div style={{ fontSize: '0.6875rem', color: '#8896a7', marginTop: 2 }}>Senior Risk Analyst</div>
          </div>
          <ChevronDown size={13} color="#8896a7" />
        </div>
      </div>
    </header>
  );
};
