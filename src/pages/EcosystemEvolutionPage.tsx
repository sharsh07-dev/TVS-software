import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { EcosystemGraph } from '../components/graph/EcosystemGraph';
import { ResponsibleAiFooter } from '../components/common/ResponsibleAiFooter';
import type { TimelinePhase } from '../types/eeris';

export const EcosystemEvolutionPage: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'Day 1' | 'Day 7' | 'Day 14' | 'Day 21'>('Day 21');

  const stageToTimelineMap: Record<string, TimelinePhase> = {
    'Day 1': 'Before Alert',
    'Day 7': 'Alert (Day 0)',
    'Day 14': 'Current (Active)',
    'Day 21': 'Current (Active)'
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
          <span>DYNAMIC TOPOLOGY</span>
          <span>•</span>
          <span className="text-blue-600 font-bold">ECOSYSTEM EVOLUTION</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ecosystem Evolution Timeline</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Observe entity relationship propagation from Day 1 inception to Day 21 critical topology
            </p>
          </div>

          <button
            onClick={() => navigate('/simulation-control')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Launch Demo Controller →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase">SELECT STAGE:</span>
          <span className="text-xs text-slate-400 font-semibold">T-minus 21 Day Window</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setStage('Day 1')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              stage === 'Day 1' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
              <span>DAY 1</span>
              <span className="text-emerald-600 font-mono">Risk: 18</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">1 borrower, 1 device, 1 dealer</p>
            <div className="mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
              Stage 0 • Fast Track
            </div>
          </button>

          <button
            onClick={() => setStage('Day 7')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              stage === 'Day 7' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
              <span>DAY 7</span>
              <span className="text-amber-600 font-mono">Risk: 37</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">2 borrowers, shared device</p>
            <div className="mt-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
              Stage 1 • Monitor
            </div>
          </button>

          <button
            onClick={() => setStage('Day 14')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              stage === 'Day 14' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
              <span>DAY 14</span>
              <span className="text-amber-600 font-mono">Risk: 64</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">4 borrowers, repeated guarantor</p>
            <div className="mt-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
              Stage 2 • Targeted Check
            </div>
          </button>

          <button
            onClick={() => setStage('Day 21')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              stage === 'Day 21' ? 'bg-red-50 border-red-400 ring-2 ring-red-500/20' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-slate-900">
              <span>DAY 21</span>
              <span className="text-red-600 font-mono">Risk: 84</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Payment anomaly signature</p>
            <div className="mt-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded inline-block">
              Stage 3 • Investigation
            </div>
          </button>
        </div>
      </div>

      <EcosystemGraph timelinePhase={stageToTimelineMap[stage]} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">ECOSYSTEM RISK TRAJECTORY</h2>
          </div>
          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-amber-200">
            PROTOTYPE PROJECTION
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Historical &amp; Projected Risk Band</span>
            <span>Day 21 Risk: 84 / 100</span>
          </div>

          <div className="w-full h-32 flex items-end justify-between gap-4 pt-4 border-b border-slate-300 pb-1 text-xs">
            <div className="flex-1 bg-emerald-500/20 border-t-2 border-emerald-500 h-[18%] rounded-t text-center font-bold text-[10px] text-emerald-800 pt-1">
              Day 1 (18)
            </div>
            <div className="flex-1 bg-amber-500/20 border-t-2 border-amber-500 h-[37%] rounded-t text-center font-bold text-[10px] text-amber-800 pt-1">
              Day 7 (37)
            </div>
            <div className="flex-1 bg-amber-500/30 border-t-2 border-amber-600 h-[64%] rounded-t text-center font-bold text-[10px] text-amber-900 pt-1">
              Day 14 (64)
            </div>
            <div className="flex-1 bg-red-500/30 border-t-2 border-red-600 h-[84%] rounded-t text-center font-bold text-[10px] text-red-900 pt-1">
              Day 21 (84)
            </div>
            <div className="flex-1 bg-slate-200 border-t-2 border-dashed border-red-500 h-[92%] rounded-t text-center font-bold text-[10px] text-slate-600 pt-1">
              Proj Day 28 (92)*
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic">
            * Prototype Projection modeled based on network density growth velocity. Heuristic prototype forecast band only.
          </p>
        </div>
      </div>

      <ResponsibleAiFooter />
    </div>
  );
};
