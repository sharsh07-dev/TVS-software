import React, { useEffect, useState } from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';

export const ModelInsightsPage: React.FC = () => {
  const [feedbackEvents, setFeedbackEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/feedback/events')
      .then(res => res.json())
      .then(data => setFeedbackEvents(data))
      .catch(() => {
        setFeedbackEvents([
          {
            id: 'FBE-001',
            event_type: 'OUTCOME_RECORDED',
            ecosystem_id: 'ECO-1024',
            outcome_state: 'Confirmed Fraud',
            model_weight_adjustment: 'Strengthened shared hardware IMEI risk weight (+25%)',
            timestamp: '10:01:45'
          },
          {
            id: 'FBE-002',
            event_type: 'FALSE_POSITIVE_CONFIRMED',
            ecosystem_id: 'ECO-00173',
            outcome_state: 'Legitimate Rural Community',
            model_weight_adjustment: 'Reduced connection-density risk weight by -35% for rural cluster topologies',
            timestamp: '09:45:10'
          }
        ]);
      });
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Model Insights</h1>
          <p className="text-sm text-slate-500 mt-1">
            Risk model performance metrics, feedback loop, and portfolio impact analysis.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <span>Feedback Loop Active</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg text-white">Portfolio Impact &amp; Prevented Loss Demonstration</h2>
          </div>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            DEMO MODEL OUTPUT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Potential Portfolio Exposure</p>
            <p className="text-2xl font-extrabold text-white mt-1">₹25.0 Lakh</p>
            <p className="text-[11px] text-slate-400 mt-0.5">High-risk ecosystem cluster loans</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Estimated Preventable Exposure</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹8.0 Lakh</p>
            <p className="text-[11px] text-emerald-300/80 mt-0.5">Caught prior to disbursal</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Targeted Interventions</p>
            <p className="text-2xl font-extrabold text-blue-400 mt-1">12 Actions</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Merchant &amp; device verifications</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Protected Exposure Ratio</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">32.0%</p>
            <p className="text-[11px] text-indigo-300/80 mt-0.5">Loss avoidance efficiency</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">Customer Experience vs Risk Protection Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">CASE A — Low Risk Customer</span>
            <h3 className="font-bold text-slate-900 text-base">Fast Track Rail</h3>
            <p className="text-xs text-slate-600">
              Customer with low individual &amp; low ecosystem risk proceeds with zero friction.
            </p>
            <div className="text-xs font-semibold text-emerald-700 pt-2 border-t border-emerald-200">
              Result: Instant approval, friction-free onboarding
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">CASE B — Emerging Risk</span>
            <h3 className="font-bold text-slate-900 text-base">Targeted Verification</h3>
            <p className="text-xs text-slate-600">
              Only high-value suspicious links (e.g. Dealer Apex Auto or Device IMEIs) are verified.
            </p>
            <div className="text-xs font-semibold text-amber-700 pt-2 border-t border-amber-200">
              Result: 90% of loan application fields remain un-frictioned
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">CASE C — High Risk Coordinated Ring</span>
            <h3 className="font-bold text-slate-900 text-base">Investigation Workbench</h3>
            <p className="text-xs text-slate-600">
              Application routed to human risk analyst before TVS Credit commits financial exposure.
            </p>
            <div className="text-xs font-semibold text-rose-700 pt-2 border-t border-rose-200">
              Result: Complete risk protection against synthetic fraud rings
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Feedback &amp; Outcome Store</h2>
            <p className="text-xs text-slate-500">Live feed of outcomes updating EERIS prototype weights</p>
          </div>
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-3">
          {feedbackEvents.map((evt) => (
            <div key={evt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{evt.event_type}</span>
                  <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {evt.ecosystem_id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    evt.outcome_state === 'Confirmed Fraud' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {evt.outcome_state}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{evt.model_weight_adjustment}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
