import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { riskService } from '../services/riskService';

export const RiskAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const defaultApp = { individualRisk: 31, ecosystemRisk: 84, applicantName: 'Sunita Verma', topDrivers: [] };
  const heroApp = riskService.getApplicationById('APP-78287') || riskService.getApplications()[0] || defaultApp;
  const divergence = (heroApp.ecosystemRisk ?? 84) - (heroApp.individualRisk ?? 31);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
          <span>EXPLAINABLE AI</span>
          <span>•</span>
          <span className="text-blue-600 font-bold">RISK INTELLIGENCE ANALYSIS</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Risk Analysis &amp; SHAP Attribution</h1>
          <button
          onClick={() => navigate('/app/applications/APP-78287')}
            className="bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            View Case APP-78287 →
          </button>
        </div>
      </div>

      {/* Divergence Anomaly Hero Card */}
      <div className="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2 className="font-bold text-slate-900 text-base">
              Divergence Anomaly Analysis — Case APP-78287 ({heroApp?.applicantName || 'Sunita Verma'})
            </h2>
          </div>
          <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
            Divergence: +{divergence}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
              <span>TRADITIONAL INDIVIDUAL SCORE</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{heroApp?.individualRisk || 31} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
            <p className="text-xs text-slate-600">Clean bureau history, thin-file profile with no prior defaults.</p>
          </div>

          <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-red-700 uppercase">
              <span>EERIS ECOSYSTEM NETWORK SCORE</span>
              <Network className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-3xl font-black text-red-600">{heroApp?.ecosystemRisk || 84} <span className="text-xs font-normal text-red-400">/ 100</span></div>
            <p className="text-xs text-red-800 font-medium">Shared hardware IMEI signature &amp; dealer velocity spike across ECO-1024.</p>
          </div>
        </div>
      </div>

      {/* SHAP Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">SHAP EXPLAINABILITY BREAKDOWN</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Feature Attribution</span>
        </div>

        <div className="space-y-3">
          {(heroApp?.topDrivers || []).map((driver) => (
            <div key={driver.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900 text-sm">{driver.title}</span>
                <span className="text-red-600 text-sm font-black">+{driver.contributionPercent}% Risk Contribution</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{driver.details}</p>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${driver.contributionPercent * 3.5}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
