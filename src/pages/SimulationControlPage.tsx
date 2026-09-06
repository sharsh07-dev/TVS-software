import React, { useState, useEffect } from 'react';
import { PlayCircle, RotateCcw, Activity, Zap } from 'lucide-react';

export const SimulationControlPage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<string>('Day 21');
  const [eventLog, setEventLog] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/ecosystems/ECO-1024/timeline')
      .then(res => res.json())
      .then(data => setEventLog(data))
      .catch(() => {
        setEventLog([
          { timestamp: '10:01:11', event_type: 'APPLICATION_CREATED', description: 'Application APP-78287 created', risk_after: 18 },
          { timestamp: '10:01:12', event_type: 'DEVICE_LINKED', description: 'Device DEV-9810 linked', risk_after: 18 },
          { timestamp: '10:01:13', event_type: 'DEALER_LINKED', description: 'Dealer Apex Auto linked', risk_after: 24 },
          { timestamp: '10:01:17', event_type: 'ECOSYSTEM_UPDATED', description: 'Ecosystem ECO-1024 updated', risk_after: 37 },
          { timestamp: '10:01:24', event_type: 'BORROWER_LINKED', description: 'Borrower K. Rao linked via shared device', risk_after: 64 },
          { timestamp: '10:01:33', event_type: 'PAYMENT_ANOMALY', description: 'Synchronized payment anomaly detected', risk_after: 84 },
          { timestamp: '10:01:35', event_type: 'ALERT_GENERATED', description: 'Emerging Ecosystem alert created', risk_after: 84 },
          { timestamp: '10:01:41', event_type: 'INVESTIGATION_OPENED', description: 'Investigation INV-78287 opened', risk_after: 84 }
        ]);
      });

    const ws = new WebSocket('ws://localhost:8000/ws/events');
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'SIMULATION_STEP') {
          setCurrentStage(data.stage);
        }
      } catch (err) {}
    };
    return () => ws.close();
  }, []);

  const handleStep = async (stage: string) => {
    setCurrentStage(stage);
    try {
      await fetch('http://localhost:8000/simulation/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
    } catch (err) {}
  };

  const handleReset = async () => {
    setCurrentStage('Day 1');
    try {
      await fetch('http://localhost:8000/simulation/reset', { method: 'POST' });
    } catch (err) {}
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Golden Demo Simulation Controller</h1>
          <p className="text-sm text-slate-500 mt-1">
            Drive live EERIS timeline scenarios, trigger real-time backend updates, and observe WebSocket events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={() => handleStep('Day 21')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
          >
            <PlayCircle className="w-4.5 h-4.5" />
            <span>Run Live EERIS Demo</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-lg text-white">Timeline Scenario Controller</h2>
              <p className="text-xs text-slate-400">Current Simulation Stage: <span className="text-amber-400 font-bold font-mono">{currentStage}</span></p>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            WebSocket Event Push Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { stage: 'Day 1', label: 'Day 1: Genesis', desc: '1 App, Low Risk (18), Fast Track', color: 'border-slate-700 hover:border-blue-500' },
            { stage: 'Day 7', label: 'Day 7: Hardware Collision', desc: '2 Apps, Shared Device (37), Monitor', color: 'border-slate-700 hover:border-amber-500' },
            { stage: 'Day 14', label: 'Day 14: Velocity Spike', desc: '4 Apps, Repeated Guarantor (64), Targeted Verif', color: 'border-slate-700 hover:border-orange-500' },
            { stage: 'Day 21', label: 'Day 21: Coordinated Ring', desc: 'Payment Anomaly, Risk 84, Investigation', color: 'border-slate-700 hover:border-rose-500' }
          ].map((item) => (
            <button
              key={item.stage}
              onClick={() => handleStep(item.stage)}
              className={`p-4 rounded-xl text-left border transition-all ${
                currentStage === item.stage
                  ? 'bg-blue-600/30 border-blue-500 ring-2 ring-blue-500/50'
                  : `bg-slate-800/80 ${item.color}`
              }`}
            >
              <p className="font-bold text-white text-sm">{item.label}</p>
              <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              {currentStage === item.stage && (
                <span className="inline-block mt-2 text-[10px] font-extrabold bg-blue-500 text-white px-2 py-0.5 rounded">
                  Active Stage
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900">Golden Demo 1 — Fraud Ring ECO-1024</span>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">High Ecosystem Risk (84)</span>
          </div>
          <p className="text-xs text-slate-600">
            Demonstrates detection of rapid multi-applicant device collisions, merchant velocity spikes, targeted verification recommendations, and intervention simulation.
          </p>
          <button
            onClick={() => handleStep('Day 21')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl transition-all"
          >
            Trigger Fraud Ring Storyline
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900">Golden Demo 2 — Legitimate Rural Community ECO-00173</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">Legitimate Stable (28)</span>
          </div>
          <p className="text-xs text-slate-600">
            Demonstrates dense village cluster (shared household tablet &amp; family guarantors) marked as legitimate, proving that connection alone does not determine risk.
          </p>
          <button
            onClick={() => handleStep('Day 1')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all"
          >
            Trigger Legitimate Rural Community Storyline
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-lg">Live Ecosystem Events Stream</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Backend WebSockets Feed</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs max-h-72 overflow-y-auto">
          {eventLog.map((evt, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px]">{evt.timestamp}</span>
                <span className="font-bold text-slate-800">{evt.event_type}</span>
                <span className="text-slate-600">{evt.description}</span>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                evt.risk_after >= 70 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                Risk: {evt.risk_after}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
