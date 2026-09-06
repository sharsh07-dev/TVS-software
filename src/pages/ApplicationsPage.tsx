import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  UserCheck,
  Network,
  Target,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { MiniEcosystemGraph } from '../components/graph/MiniEcosystemGraph';
import { riskService } from '../services/riskService';
import type { Application } from '../types/eeris';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // State
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [riskFilter, setRiskFilter] = useState('All Profiles');
  const [statusFilter, setStatusFilter] = useState('All Stages');
  const [dateFilter, setDateFilter] = useState('Today');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL search param if present
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, riskFilter, statusFilter, dateFilter]);

  // Fetch filtered apps from riskService
  const { applications: filteredApps, total, totalPages } = riskService.getFilteredApplications({
    searchQuery,
    riskFilter,
    statusFilter,
    dateFilter,
    page: currentPage,
    pageSize: 20
  });

  const [selectedApp, setSelectedApp] = useState<Application>(
    filteredApps[0] || riskService.getApplications()[0]
  );

  // Update selectedApp when filteredApps changes if selected is not in current list
  useEffect(() => {
    if (filteredApps.length > 0 && !filteredApps.some(a => a.id === selectedApp.id)) {
      setSelectedApp(filteredApps[0]);
    }
  }, [filteredApps, selectedApp.id]);

  const startItemIndex = total === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const endItemIndex = Math.min(currentPage * 20, total);
  const divergence = selectedApp.ecosystemRisk - selectedApp.individualRisk;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Applications</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Showing {total} applications · {filteredApps.filter(a => a.ecosystemRisk >= 70).length} high-risk ecosystem</p>
        </div>
      </div>

      {/* Filter Container */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Applicant, App ID, PAN, Phone, Device, Dealer, or Ecosystem..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">RISK:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All Profiles">All Profiles</option>
              <option value="High Risk Divergence">High Risk Divergence (Score &ge; 70)</option>
              <option value="Medium Risk">Medium Risk (45-69)</option>
              <option value="Low Risk Base">Low Risk Base (&lt; 45)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All Stages">All Stages</option>
              <option value="Targeted Verification Required">Targeted Verification Required</option>
              <option value="Under Review">Under Review</option>
              <option value="Standard Approval">Standard Approval</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">DATE:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Past 7 Days">Past 7 Days</option>
              <option value="Past 30 Days">Past 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Stream Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Application Ingestion Stream</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-blue-200">
                  Showing {startItemIndex}–{endItemIndex} of {total}
                </span>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="py-3 px-4">APPLICANT</th>
                    <th className="py-3 px-3">APPLICATION</th>
                    <th className="py-3 px-3">INDIVIDUAL RISK</th>
                    <th className="py-3 px-3">ECOSYSTEM RISK</th>
                    <th className="py-3 px-3">NOVELTY</th>
                    <th className="py-3 px-4">ECOSYSTEM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => {
                      const isSelected = selectedApp.id === app.id;
                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/90 font-medium'
                              : 'hover:bg-slate-50/60 text-slate-700'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {app.applicantName}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500 font-semibold">
                            {app.id}
                          </td>
                          <td className="py-3 px-3">
                            <RiskBadge score={app.individualRisk} level={app.individualRiskLevel} />
                          </td>
                          <td className="py-3 px-3">
                            <RiskBadge score={app.ecosystemRisk} level={app.ecosystemRiskLevel} />
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                            {app.novelty.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                              {app.ecosystem}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs italic">
                        No loan applications match the active filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination Footer */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-600">
            <span>Showing {startItemIndex}–{endItemIndex} of {total}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-800 text-xs px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Application Detail Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-lg tracking-tight">
                  {selectedApp.id}
                </h2>
                <div className="font-bold text-sm text-slate-700">{selectedApp.applicantName}</div>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  PAN: {selectedApp.pan} • Phone: {selectedApp.phone}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Focus
              </span>
            </div>

            {/* CLEAR RISK COMPARISON & DIVERGENCE (Core Narrative Requirement) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>RISK PROFILE COMPARISON</span>
                <span className="text-blue-600 font-bold">Divergence: +{divergence}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Individual Risk */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-left space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>INDIVIDUAL</span>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {selectedApp.individualRisk} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    {selectedApp.individualRiskLevel} RISK
                  </div>
                </div>

                {/* Ecosystem Risk */}
                <div className="bg-red-50/70 p-3 rounded-xl border border-red-200 text-left space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-red-700">
                    <span>ECOSYSTEM</span>
                    <Network className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <div className="text-2xl font-black text-red-600">
                    {selectedApp.ecosystemRisk} <span className="text-xs text-red-400 font-normal">/ 100</span>
                  </div>
                  <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    {selectedApp.ecosystemRiskLevel} RISK
                  </div>
                </div>
              </div>

              {/* Visual Bar Comparison */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Individual</span>
                  <span>Ecosystem (EERIS)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${selectedApp.individualRisk}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${divergence}%` }}></div>
                </div>
              </div>
            </div>

            {/* Secondary Metrics (Novelty & Maturity) */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Novelty Score</span>
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">{selectedApp.novelty.toFixed(2)}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Maturity State</span>
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">{selectedApp.maturityState}</div>
              </div>
            </div>

            {/* TOP SIGNALS */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">TOP SIGNALS</h4>
                <span className="text-[10px] text-slate-400 font-semibold">Attribution</span>
              </div>

              <div className="space-y-2">
                {selectedApp.topDrivers.length > 0 ? (
                  selectedApp.topDrivers.map((driver) => (
                    <div key={driver.id} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{driver.title}</span>
                        <span className="font-black text-red-600 text-xs">+{driver.contributionPercent}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{driver.details}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No elevated risk drivers identified.</p>
                )}
              </div>
            </div>

            {/* Connected Ecosystem Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>CONNECTED ECOSYSTEM</span>
                <span className="font-mono text-blue-600 font-semibold">{selectedApp.ecosystem}</span>
              </div>
              <MiniEcosystemGraph variant="preview" />
            </div>

            {/* ACTION CARD */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ACTION</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {selectedApp.recommendedAction.badge}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                "{selectedApp.recommendedAction.text}"
              </p>

              <button
                onClick={() => navigate(`/app/investigations/${selectedApp.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Open Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
