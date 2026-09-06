import React from 'react';
import { User, Smartphone, Store, FileText } from 'lucide-react';

interface MiniGraphProps {
  variant?: 'preview' | 'investigation';
}

export const MiniEcosystemGraph: React.FC<MiniGraphProps> = ({ variant = 'preview' }) => {
  if (variant === 'preview') {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
        {/* Connection Line Behind Nodes */}
        <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t-2 border-dashed border-slate-300 -translate-y-1/2 z-0" />

        {/* Node 1: Borrower */}
        <div className="relative z-10 bg-white border border-blue-200 rounded-xl p-2 text-center shadow-2xs w-24">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
            <User className="w-4 h-4" />
          </div>
          <div className="font-bold text-[11px] text-slate-800 leading-tight">Borrower</div>
          <div className="text-[9px] text-slate-400">Sunita Verma</div>
        </div>

        {/* Node 2: Shared Device */}
        <div className="relative z-10 bg-red-50 border border-red-300 rounded-xl p-2 text-center shadow-2xs w-28 animate-pulse-subtle">
          <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-1 border border-red-200">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="font-bold text-[11px] text-red-900 leading-tight">Shared Device</div>
          <div className="text-[9px] text-red-600 font-semibold">DEV-9810 (7 apps)</div>
        </div>

        {/* Node 3: Dealer */}
        <div className="relative z-10 bg-white border border-slate-200 rounded-xl p-2 text-center shadow-2xs w-24">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-1">
            <Store className="w-4 h-4" />
          </div>
          <div className="font-bold text-[11px] text-slate-800 leading-tight">Dealer</div>
          <div className="text-[9px] text-slate-400">Apex Auto</div>
        </div>
      </div>
    );
  }

  // Investigation Sub-graph matching Screenshot 3
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 h-64 relative flex items-center justify-center overflow-hidden">
      {/* SVG Canvas for edge lines and labels */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Line Center (APP-78287) to Top Left (DEV-9810) */}
        <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
        <text x="35%" y="36%" fill="#ef4444" fontSize="9" fontWeight="bold">WT: 0.88</text>

        {/* Line Center to Top Right (Apex Auto) */}
        <line x1="50%" y1="50%" x2="75%" y2="30%" stroke="#ef4444" strokeWidth="2.5" />
        <text x="60%" y="36%" fill="#ef4444" fontSize="9" fontWeight="bold">WT: 0.72 (4.2x Velocity Spike)</text>

        {/* Line Center to Bottom (S. Verma / GNT) */}
        <line x1="50%" y1="50%" x2="50%" y2="78%" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="52%" y="68%" fill="#64748b" fontSize="9">WT: 0.52 (Co-signing tie)</text>
      </svg>

      {/* Nodes Positioned */}
      {/* Center Node: Target Application */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-blue-500 rounded-xl p-2.5 shadow-md text-center z-10 w-28">
        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1">
          <FileText className="w-3.5 h-3.5" />
        </div>
        <div className="font-bold text-xs text-blue-900">APP-78287</div>
        <div className="text-[9px] text-slate-500 font-semibold">S. Verma</div>
      </div>

      {/* Top-Left Node: DEV-9810 */}
      <div className="absolute top-4 left-6 bg-red-50 border border-red-300 rounded-lg p-2 text-center shadow-xs z-10 w-24">
        <div className="font-bold text-[10px] text-red-900">DEV-9810</div>
        <div className="text-[8px] text-red-600">Shared Hardware</div>
      </div>

      {/* Top-Right Node: Apex Auto */}
      <div className="absolute top-4 right-6 bg-white border border-slate-300 rounded-lg p-2 text-center shadow-xs z-10 w-24">
        <div className="font-bold text-[10px] text-slate-800">Apex Auto</div>
        <div className="text-[8px] text-slate-500">POS-44021</div>
      </div>

      {/* Bottom Node: Guarantor R. Sharma */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white border border-indigo-200 rounded-lg p-2 text-center shadow-xs z-10 w-28">
        <div className="font-bold text-[10px] text-indigo-900">R. Sharma</div>
        <div className="text-[8px] text-slate-500">Guarantor Link</div>
      </div>

      {/* Sub-Graph Legend at Bottom */}
      <div className="absolute bottom-2 left-3 flex items-center gap-3 text-[10px] text-slate-500 font-medium z-10 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          High Weight Tie
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          Indirect Tie
        </span>
      </div>
    </div>
  );
};
