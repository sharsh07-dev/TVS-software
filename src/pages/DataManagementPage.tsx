import React from 'react';
import { Server, Lock, FileCode } from 'lucide-react';

export const DataManagementPage: React.FC = () => {
  const dataProviders = [
    {
      name: 'SyntheticProvider',
      status: 'ACTIVE',
      type: 'Demo / Synthetic Dataset',
      records: '100 Applications, 4 Ecosystems',
      description: 'Used for Golden Demo storyline and real-time interactive simulation.',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    },
    {
      name: 'BenchmarkProvider',
      status: 'AVAILABLE',
      type: 'Benchmarking Suite',
      records: 'Static Validation Datasets',
      description: 'Provides standardized risk scoring accuracy benchmarks.',
      color: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    {
      name: 'ProductionProvider',
      status: 'READY FOR TVS DATA',
      type: 'Canonical Production API',
      records: '0 Connected Real Loans',
      description: 'Production interface ready for live TVS Credit LOS database integration.',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-300'
    }
  ];

  const roles = [
    { name: 'Risk Analyst', access: 'View Risk Scores, Run Intervention Simulations' },
    { name: 'Underwriter', access: 'Approve Thin-File Loans, Review Ecosystem Context' },
    { name: 'Fraud Investigator', access: 'Open Case, Hold Loan, Mark False Positive / Fraud' },
    { name: 'Operations Manager', access: 'Portfolio Metrics, Dealer Velocity Monitoring' },
    { name: 'Admin', access: 'System Configuration, Audit Logs, Simulation Controls' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Management & Production Readiness</h1>
          <p className="text-sm text-slate-500 mt-1">
            Canonical data schemas, data provider abstractions, security roles, and audit trails.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>Canonical Schema Active</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">Provider Abstraction Layer (Real-Data Readiness)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dataProviders.map((provider) => (
            <div key={provider.name} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{provider.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${provider.color}`}>
                  {provider.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{provider.type}</p>
              <p className="text-xs text-slate-500">{provider.description}</p>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 font-mono">
                {provider.records}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900 text-lg">Security & Role-Based Access Control (RBAC)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {roles.map((r) => (
            <div key={r.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">{r.name}</span>
              <p className="text-xs text-slate-500">{r.access}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-lg">Canonical Database Schema (28 Tables)</h2>
          </div>
          <span className="text-xs text-blue-400 font-mono">SQLite / EERIS Backend Data Layer</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-slate-300">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ applications</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ borrowers</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ dealers</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ devices</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ mobiles</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ accounts</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ guarantors</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ locations</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ payments</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ ecosystems</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ ecosystem_members</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ ecosystem_events</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ risk_assessments</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ risk_drivers</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ alerts</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ interventions</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ investigations</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ investigation_notes</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ outcomes</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ feedback_events</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ model_runs</div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">✓ audit_logs</div>
        </div>
      </div>
    </div>
  );
};
