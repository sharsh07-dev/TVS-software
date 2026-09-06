import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckSquare,
  Square,
  PlayCircle,
  UserCheck,
  Network,
  UserPlus,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { MiniEcosystemGraph } from '../components/graph/MiniEcosystemGraph';
import { riskService } from '../services/riskService';
import { backendClient } from '../services/backendClient';

export const InvestigationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const appId = id || 'APP-78287';
  
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState(riskService.getVerificationTasks());
  const [isSimulated, setIsSimulated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assigned, setAssigned] = useState(false);
  const [isLegitimate, setIsLegitimate] = useState(false);

  const toggleTask = (taskId: string) => {
    setTasks(riskService.toggleVerificationTask(taskId));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  React.useEffect(() => {
    backendClient.fetchApplication(appId).then(data => {
      setApplication(data);
      setLoading(false);
    });
  }, [appId]);

  if (loading || !application) {
    return <div className="p-8 text-center text-slate-500">Loading investigation data...</div>;
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const runSimulation = () => {
    setIsSimulated(prev => !prev);
    if (!isSimulated) {
      triggerToast('Pipeline Simulation Complete: Ecosystem risk score reduced by 22 pts (84 → 62).');
    } else {
      triggerToast('Simulation Reset: Ecosystem risk restored to baseline (84).');
    }
  };

  const handleAssign = async () => {
    await backendClient.startInvestigation(`CASE-${application.id}`, 'Senior Risk Analyst');
    setAssigned(true);
    triggerToast(`Case ${application.id} assigned to you.`);
  };

  const handleMarkFalsePositive = async () => {
    setIsLegitimate(true);
    try {
      await backendClient.markFalsePositive('INV-78287', 'ECO-00173');
      triggerToast('FALSE_POSITIVE_CONFIRMED: Ecosystem marked as Legitimate Rural Community. Risk recalibrated to 28.');
    } catch (err) {
      triggerToast('Ecosystem marked as Legitimate Rural Community (Local recalibration: 28).');
    }
  };

  const currentEcosystemRisk = isLegitimate ? 28 : (isSimulated ? 62 : (application.current_ecosystem_risk || application.ecosystem_risk));
  const divergence = currentEcosystemRisk - application.individual_risk;

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Link to="/app/applications" className="hover:text-blue-600">
            Applications
          </Link>
          <span>/</span>
          <Link to="/app/ecosystems" className="hover:text-blue-600 font-semibold font-mono">
            {application.ecosystem_id || application.ecosystem}
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-900">Investigation {application.id}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Priority: High
          </span>
          <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-blue-200">
            {assigned ? 'Assigned to you' : 'Open Investigation'}
          </span>
        </div>
      </div>

      {/* SECTION 8 INVESTIGATION WORKBENCH LAYOUT */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Investigation Workbench: {application.id}
            </h1>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-xs font-mono font-semibold">
              PAN: {application.pan}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Borrower: <strong className="text-slate-900">{application.applicant_name || application.applicantName}</strong> • Submitted {application.submitted_time || application.submittedTime} • Dealer: <strong className="text-slate-900">{application.dealer}</strong>
          </p>
        </div>

        {/* Individual vs Ecosystem Risk Visual Header */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 min-w-[160px] text-left">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>INDIVIDUAL RISK</span>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {application.individual_risk || application.individualRisk} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
              {application.individual_risk_level || application.individualRiskLevel} RISK
            </div>
          </div>

          <div className={`${isLegitimate ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50/70 border-red-200'} border rounded-xl p-3.5 min-w-[170px] text-left`}>
            <div className={`flex items-center justify-between text-[10px] font-bold ${isLegitimate ? 'text-emerald-800' : 'text-red-700'} uppercase tracking-wider`}>
              <span>ECOSYSTEM RISK</span>
              <Network className={`w-3.5 h-3.5 ${isLegitimate ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
            <div className={`text-2xl font-black ${isLegitimate ? 'text-emerald-600' : 'text-red-600'} mt-1`}>
              {currentEcosystemRisk} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className={`text-[10px] font-bold ${isLegitimate ? 'text-emerald-700' : 'text-red-600'} uppercase tracking-wider mt-0.5`}>
              {isLegitimate ? 'RECALIBRATED STABLE' : `DIVERGENCE +${divergence}`}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Case Details & Risk Intelligence (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm tracking-tight">RISK INTELLIGENCE DRIVERS</h2>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Top Drivers</span>
            </div>

            <div className="space-y-3">
              {(application.risk_drivers || application.topDrivers || []).map((driver: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{driver.feature || driver.title}</span>
                    <span className="font-black text-red-600">+{Math.round(driver.contribution || driver.contributionPercent)}%</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{driver.evidence || driver.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Connected Ecosystem & Interactive Graph (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-sm">ECOSYSTEM TOPOLOGY GRAPH</h2>
              </div>
              <span className="font-mono text-xs text-blue-600 font-semibold">{application.ecosystem_id || application.ecosystem}</span>
            </div>

            <MiniEcosystemGraph 
              variant="investigation" 
              appId={application.id} 
              applicantName={application.applicant_name || application.applicantName} 
              deviceId={application.device_id || 'DEV-Unknown'} 
              dealerName={application.dealer || 'Unknown Dealer'} 
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-slate-900 text-sm">VERIFICATION AUDIT CHECKLIST</h2>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-200">
                {completedCount} / {tasks.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600 shrink-0 cursor-pointer">
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <span className={`font-bold text-xs ${task.completed ? 'line-through text-emerald-800' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {task.completed ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Actions & SECTION 9 FALSE POSITIVE FLOW (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-slate-900 text-sm">Action Controls</h2>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleAssign}
                className={`w-full font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  assigned
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{assigned ? 'Assigned to you' : 'Assign Investigator'}</span>
              </button>

              <button
                onClick={handleMarkFalsePositive}
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Mark Legitimate Rural Community</span>
              </button>

              <button
                onClick={runSimulation}
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Intervention Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
