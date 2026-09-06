import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, FileText, Smartphone, Store, Shield, CreditCard } from 'lucide-react';

export const BorrowerNode = memo(({ data }: any) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-3 shadow-sm min-w-[130px] text-center relative group hover:border-blue-500 transition-all">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-2 !h-2" />
      
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
        <User className="w-5 h-5" />
      </div>
      <div className="font-bold text-xs text-slate-900">{data.label}</div>
      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{data.subtitle || 'Borrower'}</div>
      {data.badge && (
        <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-semibold">
          {data.badge}
        </span>
      )}
    </div>
  );
});

export const ApplicationNode = memo(({ data }: any) => {
  return (
    <div className="bg-white border-2 border-sky-200 rounded-2xl p-3 shadow-sm min-w-[140px] text-center relative group hover:border-sky-500 transition-all">
      <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} className="!bg-sky-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-sky-500 !w-2 !h-2" />

      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2 border border-sky-100">
        <FileText className="w-5 h-5" />
      </div>
      <div className="font-bold text-xs text-sky-900">{data.label}</div>
      {data.risk && (
        <div className="text-[10px] font-semibold text-red-600 mt-0.5">
          Risk: {data.risk}
        </div>
      )}
      {data.subtitle && (
        <div className="text-[10px] text-slate-400 mt-0.5">{data.subtitle}</div>
      )}
    </div>
  );
});

export const DeviceNexusNode = memo(({ data }: any) => {
  return (
    <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-3.5 shadow-md min-w-[160px] text-center relative animate-pulse-subtle">
      <Handle type="target" position={Position.Top} className="!bg-red-500 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-red-500 !w-2.5 !h-2.5" />
      <Handle type="target" position={Position.Left} className="!bg-red-500 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-red-500 !w-2.5 !h-2.5" />

      <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-1.5 border border-red-200">
        <Smartphone className="w-6 h-6" />
      </div>
      <div className="font-bold text-xs text-red-950">{data.label}</div>
      <div className="text-[10px] text-red-700 font-bold uppercase tracking-wider mt-0.5">{data.tagline || 'SHARED NEXUS'}</div>
      
      <div className="mt-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs inline-block">
        {data.badge || '4 Concurrently Active Loans'}
      </div>
    </div>
  );
});

export const DealerNode = memo(({ data }: any) => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-3 shadow-sm min-w-[130px] text-center relative hover:border-slate-500 transition-all">
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />

      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2 border border-slate-200">
        <Store className="w-5 h-5" />
      </div>
      <div className="font-bold text-xs text-slate-900">{data.label}</div>
      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{data.subtitle || 'Dealer'}</div>
    </div>
  );
});

export const GuarantorNode = memo(({ data }: any) => {
  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-3 shadow-sm min-w-[130px] text-center relative hover:border-indigo-400 transition-all">
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-2 !h-2" />

      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 border border-indigo-100">
        <Shield className="w-5 h-5" />
      </div>
      <div className="font-bold text-xs text-slate-900">{data.label}</div>
      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{data.subtitle || 'Guarantor'}</div>
    </div>
  );
});

export const AccountNode = memo(({ data }: any) => {
  return (
    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 shadow-sm min-w-[140px] text-center relative hover:border-emerald-500 transition-all">
      <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-2 !h-2" />

      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
        <CreditCard className="w-5 h-5" />
      </div>
      <div className="font-bold text-xs text-emerald-950">{data.label}</div>
      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{data.subtitle || 'UPI Destination'}</div>
    </div>
  );
});
