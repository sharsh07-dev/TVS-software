import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, DollarSign, Activity } from 'lucide-react';
import { backendClient } from '../services/backendClient';
import { ResponsibleAiFooter } from '../components/common/ResponsibleAiFooter';

export const InterventionCenterPage: React.FC = () => {
  const [selectedApp] = useState('APP-78287');
  const [simulatedRisk, setSimulatedRisk] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSimulate = async () => {
    const res = await backendClient.simulateIntervention(selectedApp, 'Verify Dealer + Device');
    const modeled = res?.modeled_risk || 62;
    setSimulatedRisk(modeled);
    setToastMsg(`Modeled intervention impact calculated: Risk reduced from 84 → ${modeled} (-22 pts).`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMsg}</div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
          <span>TARGETED INTERVENTION</span>
          <span>•</span>
          <span className="text-blue-600 font-bold">ACTION ENGINE CENTER</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intervention Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute targeted interventions and model risk impact across active applications
            </p>
          </div>

          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200">
            Action Engine Online
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">PORTFOLIO EXPOSURE IMPACT</h2>
          </div>
          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
            DEMO MODEL OUTPUT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Potential Exposure</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">₹25 Lakh</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Estimated Preventable</span>
            <span className="text-xl font-black text-amber-600 mt-1 block">₹8 Lakh</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Interventions</span>
            <span className="text-xl font-black text-blue-600 mt-1 block">12 Cases</span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-700 font-bold block uppercase">Protected Exposure</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">₹3.2 Lakh</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic text-right">* Simulated demo figures. Modeled estimation only.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">MODELED INTERVENTION IMPACT SIMULATOR</h2>
          </div>
          <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-blue-200">
            Modelled Impact Simulation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-slate-500 uppercase text-[10px]">BASELINE ECOSYSTEM RISK</span>
            <div className="text-3xl font-black text-red-600">84 <span className="text-xs font-normal text-slate-400">/ 100</span></div>
            <p className="text-slate-500 text-[11px]">Before targeted intervention</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-emerald-700 uppercase text-[10px]">MODELED POST-INTERVENTION RISK</span>
            <div className="text-3xl font-black text-emerald-600">
              {simulatedRisk !== null ? simulatedRisk : 62} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-emerald-700 text-[11px]">After verifying Dealer Apex Auto &amp; Device DEV-9810</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-bold text-blue-900 uppercase text-[10px]">RISK EXPOSURE REDUCTION</span>
              <div className="text-2xl font-black text-blue-700 mt-1">-22 PTS (Elevated → Moderate)</div>
            </div>

            <button
              onClick={handleSimulate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Simulate Intervention Impact</span>
            </button>
          </div>
        </div>
      </div>

      <ResponsibleAiFooter />
    </div>
  );
};
