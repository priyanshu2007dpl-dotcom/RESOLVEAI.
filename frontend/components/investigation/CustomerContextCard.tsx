"use client";

import React from "react";
import { 
  User, 
  Building2, 
  Package, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  RotateCcw
} from "lucide-react";

interface CustomerContextProps {
  context: {
    customer_name: string;
    customer_email?: string;
    customer_code?: string;
    company_name?: string;
    products_owned: string[];
    total_complaints_history: number;
    past_cases?: Array<{
      tracking_code: string;
      title: string;
      status: string;
      primary_domain?: string;
      resolved_at?: string;
    }>;
    attempted_solutions: string[];
    avoidance_directives: string[];
    account_sla_tier: string;
  };
}

export function CustomerContextCard({ context }: CustomerContextProps) {
  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Retained Customer Context</h3>
            <p className="text-[11px] text-slate-500">Contextual history retained across all touchpoints</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {context.account_sla_tier}
        </span>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Customer & Organization</span>
          <span className="font-bold text-slate-900 block">{context.customer_name}</span>
          <span className="text-[11px] text-slate-600 flex items-center space-x-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>{context.company_name}</span>
          </span>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Registered Products</span>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {context.products_owned.map((prod, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                {prod}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Attempted Solutions with DO NOT REPEAT rules */}
      <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200 space-y-2">
        <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-[11px] uppercase tracking-wide">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Troubleshooting Directives (DO NOT REPEAT)</span>
        </div>
        <div className="space-y-1.5">
          {context.avoidance_directives.map((dir, i) => (
            <div key={i} className="flex items-start space-x-2 text-[11px] text-amber-900 leading-tight">
              <span className="text-red-500 font-bold">✕</span>
              <span>{dir}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Past Complaint History */}
      {context.past_cases && context.past_cases.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
            <History className="w-3 h-3 text-slate-400" />
            <span>Previous Complaint History ({context.total_complaints_history} Total)</span>
          </span>
          <div className="space-y-1.5">
            {context.past_cases.map((cs, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                <div className="truncate pr-2">
                  <span className="font-mono text-teal-700 font-semibold mr-2">{cs.tracking_code}</span>
                  <span className="text-slate-800">{cs.title}</span>
                </div>
                <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {cs.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
