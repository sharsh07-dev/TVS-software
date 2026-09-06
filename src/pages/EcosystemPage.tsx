import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { EcosystemGraph } from '../components/graph/EcosystemGraph';
import { riskService } from '../services/riskService';
import type { TimelinePhase } from '../types/eeris';

export const EcosystemPage: React.FC = () => {
  const navigate = useNavigate();
  const cluster = riskService.getEcosystemCluster('ECO-1024');
  const [selectedTimeline, setSelectedTimeline] = useState<TimelinePhase>('Current (Active)');
  const [searchEntity, setSearchEntity] = useState('');

  // Selected node or edge detail inspect drawer state
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<{ id: string; label: string; details: string } | null>(null);
  const [selectedEdgeInfo, setSelectedEdgeInfo] = useState<{ id: string; label: string } | null>(null);

  const handleNodeClick = (nodeId: string, nodeData?: any) => {
    setSelectedEdgeInfo(null);
    if (nodeId.includes('app') || nodeId.includes('78287')) {
      navigate('/app/investigations/APP-78287');
      return;
    }
    setSelectedNodeInfo({
      id: nodeId,
      label: nodeData?.label || nodeId,
      details: nodeData?.subtitle || nodeData?.badge || 'Connected entity in ECO-1024 topology.'
    });
  };

  const handleEdgeClick = (edgeId: string, edgeLabel?: string) => {
    setSelectedNodeInfo(null);
    setSelectedEdgeInfo({
      id: edgeId,
      label: edgeLabel || 'Shared Relationship Link'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
          <span>RELATIONAL INTELLIGENCE</span>
          <span>•</span>
          <span className="text-blue-600">NETWORK TOPOLOGY</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ecosystem Explorer</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive entity relationship mapping and network propagation analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Active Cluster: {cluster.id} ({cluster.riskScore} Risk)</span>
            </div>
            <button
              onClick={() => navigate('/app/investigations/APP-78287')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <span>Investigate APP-78287</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Interactive Timeline Control Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Entity Search */}
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchEntity}
              onChange={(e) => setSearchEntity(e.target.value)}
              placeholder="Search entity by PAN, Application ID, Device ID (DEV-9810), or Dealer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Timeline Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            ECOSYSTEM TIMELINE:
          </span>
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            {(['Before Alert', 'Alert (Day 0)', 'Current (Active)'] as TimelinePhase[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTimeline(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedTimeline === tab
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node or Edge Inspector Toast Banner */}
      {(selectedNodeInfo || selectedEdgeInfo) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-blue-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              {selectedNodeInfo && (
                <span>
                  <strong>Selected Entity: {selectedNodeInfo.label}</strong> — {selectedNodeInfo.details}
                </span>
              )}
              {selectedEdgeInfo && (
                <span>
                  <strong>Selected Relationship Link: {selectedEdgeInfo.label}</strong> — Telemetry collision evidence verified.
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedNodeInfo(null);
              setSelectedEdgeInfo(null);
            }}
            className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* React Flow Canvas */}
      <EcosystemGraph
        timelinePhase={selectedTimeline}
        searchEntity={searchEntity}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
      />

      {/* Cluster Telemetry & Timeline Progression Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Cluster Telemetry · {cluster.id}
                </h3>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  HIGH ECOSYSTEM RISK
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{cluster.detectedPattern}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/investigations/APP-78287')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>Open Investigation for APP-78287</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Compact Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left">
            <div className="text-xs text-slate-500 font-medium">Ecosystem Risk Score</div>
            <div className="text-2xl font-black text-red-600 mt-1">
              {cluster.riskScore} <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="text-[10px] font-bold text-red-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Elevated Divergence</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left">
            <div className="text-xs text-slate-500 font-medium">Novelty</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{cluster.novelty.toFixed(2)}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Unusual Topology</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left">
            <div className="text-xs text-slate-500 font-medium">Maturity</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{cluster.maturity}</div>
            <div className="text-[10px] font-bold text-amber-600 mt-1">Active Ring Expansion</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left">
            <div className="text-xs text-slate-500 font-medium">Growth</div>
            <div className="text-2xl font-black text-red-600 mt-1">{cluster.growth}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Multi-App Velocity</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left">
            <div className="text-xs text-slate-500 font-medium">Entities Connected</div>
            <div className="text-2xl font-black text-blue-600 mt-1">14 Nodes</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">19 Telemetry Edges</div>
          </div>
        </div>

        {/* ECOSYSTEM TIMELINE EVOLUTION (Required Section) */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>ECOSYSTEM EVOLUTION OVER TIME</span>
            <span className="text-slate-400 font-normal">Click timeline tabs above to update graph canvas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phase 1 */}
            <div
              onClick={() => setSelectedTimeline('Before Alert')}
              className={`border rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                selectedTimeline === 'Before Alert'
                  ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">BEFORE ALERT</h4>
                <p className="text-xs text-slate-500 mt-0.5">3 nodes • Low concern</p>
              </div>
            </div>

            {/* Phase 2 */}
            <div
              onClick={() => setSelectedTimeline('Alert (Day 0)')}
              className={`border rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                selectedTimeline === 'Alert (Day 0)'
                  ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">ALERT (DAY 0)</h4>
                <p className="text-xs text-amber-700 font-bold mt-0.5">8 nodes • Collision detected</p>
              </div>
            </div>

            {/* Phase 3 */}
            <div
              onClick={() => setSelectedTimeline('Current (Active)')}
              className={`border rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                selectedTimeline === 'Current (Active)'
                  ? 'bg-red-50 border-red-300 ring-2 ring-red-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-xs text-red-950">CURRENT (ACTIVE)</h4>
                <p className="text-xs text-red-700 font-bold mt-0.5">14 nodes • Elevated ecosystem risk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsible Lending Notice */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-slate-900">Responsible Lending &amp; Procedural Fairness</h5>
          <p className="mt-0.5 leading-relaxed text-slate-600">
            Association ≠ causation. Entity linkage indicates shared telemetry vectors for targeted verification, not automated disapproval. Underwriters must conduct mandatory manual validation before any adverse credit action.
          </p>
        </div>
      </div>

    </div>
  );
};
