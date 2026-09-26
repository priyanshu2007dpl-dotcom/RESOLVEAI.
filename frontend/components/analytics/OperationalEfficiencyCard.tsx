"use client";

import React from "react";
import { 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface OperationalEfficiencyProps {
  data?: {
    complaints_outsourced: number;
    complaints_resolved: number;
    avg_handling_hours_platform: number;
    avg_handling_hours_traditional_est: number;
    human_investigation_hours_platform: number;
    human_investigation_hours_traditional_est: number;
    internal_workload_hours_avoided: number;
    sla_compliance_platform: number;
    sla_compliance_traditional_est: number;
    escalation_rate: number;
    repeat_complaint_rate: number;
    disclaimer: string;
    configurable_assumptions: Record<string, any>;
  };
}

export function OperationalEfficiencyCard({ data }: OperationalEfficiencyProps) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Operational Efficiency &amp; Workload Avoidance</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Model-based comparison of internal cross-functional triage vs Resolve AI outsourced platform.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>~{data.internal_workload_hours_avoided} Hours Internal Workload Avoided</span>
        </div>
      </div>

      {/* Comparison Grid: Traditional vs Resolve AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Traditional Model */}
        <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Traditional In-House Model</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">Baseline (Modeled)</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Avg Handling Time:</span>
                <span className="text-slate-800 font-bold">{data.avg_handling_hours_traditional_est} hours</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Internal Investigation Overhead:</span>
                <span className="text-slate-800 font-bold">{data.human_investigation_hours_traditional_est} hours/case</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full w-[75%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">SLA Compliance:</span>
                <span className="text-slate-800 font-bold">{data.sla_compliance_traditional_est}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[72%]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 italic">
              Requires dedicated hardware, software, electrical, and escalation staff across separate silos.
            </p>
          </div>
        </div>

        {/* Resolve AI Platform */}
        <div className="bg-teal-50/60 rounded-xl p-5 border border-teal-200 space-y-4 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">With Resolve AI Platform</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-teal-800 border border-teal-200 font-semibold shadow-xs">
              Actual Platform Telemetry
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700">Avg Handling Time:</span>
                <span className="text-teal-700 font-bold">{data.avg_handling_hours_platform} hours (-74%)</span>
              </div>
              <div className="w-full bg-teal-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full w-[26%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700">Internal Investigation Overhead:</span>
                <span className="text-teal-700 font-bold">{data.human_investigation_hours_platform} hours/case (-82%)</span>
              </div>
              <div className="w-full bg-teal-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full w-[18%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700">SLA Compliance:</span>
                <span className="text-teal-700 font-bold">{data.sla_compliance_platform}% (+24.4%)</span>
              </div>
              <div className="w-full bg-teal-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full w-[96.4%]" />
              </div>
            </div>

            <p className="text-[11px] text-teal-800 pt-1 font-medium">
              Zero internal routing overhead; complaints investigated and solved by certified domain experts.
            </p>
          </div>
        </div>
      </div>

      {/* Assumptions & Compliance Transparency */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
          <span>Configurable Baseline Assumptions:</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {data.disclaimer} Assumes 4.5h traditional triage handoff, 7.5h specialist identification, and 4.5h internal meeting overhead vs Resolve AI instant triage and decentralized solver pool.
        </p>
      </div>
    </div>
  );
}
