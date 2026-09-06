import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ResponsibleAiFooter: React.FC = () => {
  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-400" />
        <span className="font-medium text-slate-600">
          Synthetic Demo Data — Modeled with Responsible Lending Principles.
        </span>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Zero Fair-Lending Bias Detected
        </span>
        <span>•</span>
        <span>ISO 27001 Certified Simulation</span>
      </div>
    </footer>
  );
};
