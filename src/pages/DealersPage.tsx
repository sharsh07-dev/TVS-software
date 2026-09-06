import React, { useEffect, useState } from 'react';
import { Store, ShieldAlert, TrendingUp } from 'lucide-react';

export const DealersPage: React.FC = () => {
  const [dealers, setDealers] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/dealers')
      .then(res => res.json())
      .then(data => setDealers(data))
      .catch(() => {
        setDealers([
          { id: 'DLR-APEX_AUTO', name: 'Apex Auto', pos_id: 'POS-4021', velocity_spike_multiplier: 4.2, risk_level: 'High', connected_applications_count: 18 },
          { id: 'DLR-ZENITH_MOTORS', name: 'Zenith Motors', pos_id: 'POS-1092', velocity_spike_multiplier: 1.1, risk_level: 'Low', connected_applications_count: 8 },
          { id: 'DLR-VILLAGE_AGRO', name: 'Village Agro Motors', pos_id: 'POS-0017', velocity_spike_multiplier: 1.0, risk_level: 'Low', connected_applications_count: 12 }
        ]);
      });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Merchant &amp; Dealer Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor merchant velocity spikes, ecosystem concentrations, and targeted verification targets.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>1 Merchant High Velocity Alert</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Tracked Dealers</span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{dealers.length || 3}</p>
          <p className="text-xs text-slate-500">Across Delhi NCR, UP &amp; Rajasthan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Apex Auto Velocity Spike</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600">4.2x</p>
          <p className="text-xs text-rose-600 font-medium">Elevated risk concentration in thin-file loans</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Verification Status</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">Targeted</p>
          <p className="text-xs text-slate-500">Recommended for targeted merchant audit</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Dealer Ecosystem Concentration Table</h2>
          <span className="text-xs text-slate-500">Updated in real-time from backend graph</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Dealer Name</th>
                <th className="px-6 py-3">POS ID</th>
                <th className="px-6 py-3">Velocity Spike</th>
                <th className="px-6 py-3">Connected Apps</th>
                <th className="px-6 py-3">Risk Level</th>
                <th className="px-6 py-3">EERIS Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dealers.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-slate-400" />
                    {dealer.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{dealer.pos_id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{dealer.velocity_spike_multiplier}x baseline</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{dealer.connected_applications_count} apps</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      dealer.risk_level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {dealer.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {dealer.risk_level === 'High' ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        Targeted Verification Required
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Fast Track Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
