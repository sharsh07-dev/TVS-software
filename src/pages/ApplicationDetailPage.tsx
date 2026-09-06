import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UserCheck,
  Network,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Info,
  Layers,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { riskService } from '../services/riskService';
import { MiniEcosystemGraph } from '../components/graph/MiniEcosystemGraph';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const appId = id || 'APP-78287';
  const application = riskService.getApplicationById(appId) || riskService.getApplications()[0];
  const routing = riskService.getDecisionRouting(application);

  const [statusState, setStatusState] = useState(application.status);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeVerificationModal, setActiveVerificationModal] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleStartVerification = () => {
    setActiveVerificationModal(true);
  };

  const handleCompleteVerification = (outcome: string) => {
    setActiveVerificationModal(false);
    setStatusState(`VERIFIED: ${outcome}`);
    triggerToast(`Verification recorded: ${outcome}. Ecosystem audit log updated.`);
  };

  const handlePlaceOnHold = () => {
    setStatusState('ON HOLD');
    triggerToast(`Application ${application.id} placed ON HOLD in risk investigation queue.`);
  };

  const handleAssignInvestigator = () => {
    triggerToast(`Case ${application.id} assigned to Senior Risk Analyst Arjun Mehta.`);
  };

  const divergence = application.ecosystemRisk - application.individualRisk;

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMsg}</div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Link to="/app/applications" className="hover:text-blue-600">Applications</Link>
          <span>/</span>
          <span className="font-bold text-slate-900">{application.id} ({application.applicantName})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded text-[11px] font-semibold">
            Demo Mode
          </span>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application: {application.id}
            </h1>
            <span className="bg-blue-50 text-blue-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-blue-200">
              PAN: {application.pan}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Applicant: <strong className="text-slate-900">{application.applicantName}</strong> • Phone: {application.phone} • Applied Amount: <strong className="text-slate-900">{application.appliedAmount}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">CURRENT STATUS</span>
            <span className="font-bold text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
              {statusState}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 24: APPLICATION VS ECOSYSTEM RISK HIGHLIGHT CALLOUT */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-400/40 rounded-2xl p-4 flex items-start gap-4">
        <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-amber-900 text-sm">
            CORE EERIS INSIGHT: Individual Risk ({application.individualRisk}) vs Ecosystem Risk ({application.ecosystemRisk})
          </h3>
          <p className="text-xs text-amber-800 font-medium">
            “Low individual risk does not always mean low ecosystem risk.” While Sunita Verma has a clean individual credit profile (31/100), the ecosystem topological risk (84/100) indicates shared device collision and merchant velocity concentration.
          </p>
        </div>
      </div>

      {/* LIVE APPLICATION DECISION PANEL (Requirement #5) */}
      <div className="bg-white rounded-2xl border-2 border-blue-500/30 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">ACTION ENGINE DECISION ROUTING</span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Recommended Route: {routing.action_type.replace(/_/g, ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
              routing.decision_path === 'PATH_C_INVESTIGATION_REQUIRED'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : routing.decision_path === 'PATH_B_TARGETED_VERIFICATION'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {routing.decision_path.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* 4 Decision Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Individual Risk</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {application.individualRisk} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">LOW BASE RISK</div>
          </div>

          <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 text-left">
            <div className="flex items-center justify-between text-xs text-red-700 font-bold uppercase">
              <span>Ecosystem Risk</span>
              <Network className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-black text-red-600 mt-1">
              {application.ecosystemRisk} <span className="text-xs text-red-400 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] font-bold text-red-600 uppercase mt-0.5">DIVERGENCE +{divergence}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Novelty</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{application.novelty.toFixed(2)}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">UNUSUAL TOPOLOGY</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Maturity State</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">{application.maturityState}</div>
            <div className="text-[10px] font-bold text-amber-600 uppercase mt-0.5">{application.coordinatedPattern}</div>
          </div>
        </div>

        {/* Primary Targets & Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-xs text-blue-950 uppercase tracking-wider">PRIMARY TARGET ENTITIES</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {routing.target_entities.map((target, idx) => (
                <span key={idx} className="bg-white border border-blue-300 text-blue-900 px-3 py-1 rounded-lg text-xs font-bold shadow-2xs">
                  {target}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">DECISION REASONING</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {routing.reason}
            </p>
          </div>
        </div>

        {/* 4 Interactive Decision Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => navigate('/ecosystem')}
            className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Network className="w-4 h-4 text-blue-600" />
            <span>[Open Ecosystem]</span>
          </button>

          <button
            onClick={handleStartVerification}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>[Start Verification]</span>
          </button>

          <button
            onClick={handlePlaceOnHold}
            className="bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>[Place on Hold]</span>
          </button>

          <button
            onClick={handleAssignInvestigator}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>[Assign Investigator]</span>
          </button>
        </div>
      </div>

      {/* SECTION 17: THIN-FILE CUSTOMER WORKFLOW ENRICHED CONTEXT */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">THIN-FILE CUSTOMER ENRICHED CONTEXT DEMONSTRATION</h3>
          </div>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
            Underwriting Support
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 block uppercase text-[10px]">Bureau Signal</span>
            <p className="text-slate-600">Limited bureau credit history (Thin-File, 6 months account age).</p>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 block uppercase text-[10px]">EERIS Enriched Ecosystem Context</span>
            <p className="text-emerald-900 font-medium">
              Stable merchant POS location, consistent device hardware signature, verified mobile history.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between text-xs">
          <span className="text-indigo-900 font-semibold">Recommendation for Underwriter:</span>
          <span className="bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg">
            Proceed to underwriting with enriched context (Do NOT reject thin-file)
          </span>
        </div>
      </div>

      {/* TRACEABILITY "WHY THIS ACTION?" (Requirement #30) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-sm tracking-tight">TRACEABILITY: WHY THIS ACTION?</h2>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Explainable Lineage</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 flex-wrap gap-2">
            <span className="bg-white px-2.5 py-1 rounded border">Device {application.deviceId}</span>
            <span>→</span>
            <span className="bg-white px-2.5 py-1 rounded border">Used by 4 borrowers</span>
            <span>→</span>
            <span className="bg-white px-2.5 py-1 rounded border">Rapid 48h timing</span>
            <span>→</span>
            <span className="bg-white px-2.5 py-1 rounded border">Dealer {application.dealer} concentration</span>
            <span>→</span>
            <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded border border-red-200">+53 Risk Contribution</span>
            <span>→</span>
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded">Targeted Verification</span>
          </div>
        </div>
      </div>

      {/* Sub-Graph Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">CONNECTED ECOSYSTEM NETWORK SUB-GRAPH</h3>
          <Link to="/ecosystem" className="text-blue-600 font-semibold text-xs flex items-center gap-1 hover:underline">
            <span>Explore Full Graph Canvas</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <MiniEcosystemGraph variant="investigation" />
      </div>

      {/* SECTION 6: VERIFICATION WORKFLOW MODAL */}
      {activeVerificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Targeted Verification Workflow</h3>
              </div>
              <button onClick={() => setActiveVerificationModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">Select target entity evidence to audit for Application <strong>{application.id}</strong>:</p>
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">Target Entity: Dealer Apex Auto (DL-4021) &amp; Device DEV-9810</span>
                <p className="text-slate-500">Applications handled: 18 • Merchant Velocity: 4.2x • Shared IMEIs: 4 Borrowers</p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-900 block">Select Verification Outcome:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCompleteVerification('Verified Legitimate')}
                    className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs text-left cursor-pointer"
                  >
                    ✓ Verified Legitimate
                  </button>
                  <button
                    onClick={() => handleCompleteVerification('Needs More Information')}
                    className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs text-left cursor-pointer"
                  >
                    ℹ Needs More Info
                  </button>
                  <button
                    onClick={() => handleCompleteVerification('Suspicious Anomaly')}
                    className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs text-left cursor-pointer"
                  >
                    ⚠ Suspicious Anomaly
                  </button>
                  <button
                    onClick={() => handleCompleteVerification('Confirmed Fraud Risk')}
                    className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs text-left cursor-pointer"
                  >
                    ⛔ Confirmed Fraud Risk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
