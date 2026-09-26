"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { 
  ShieldCheck, 
  GitBranch, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers
} from "lucide-react";

export function PolicyDriftViewer() {
  const [driftData, setDriftData] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPolicyDrift(), api.getPolicies()])
      .then(([drift, pols]) => {
        setDriftData(drift);
        setPolicies(pols || []);
      })
      .catch((err) => console.error("Policy drift fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading policy drift analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Overview */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Policy Drift & SOP Versioning Engine</h3>
              <p className="text-xs text-slate-500">
                Correlates policy changes, warranty term updates, and SOP revisions with subsequent complaint volume trends.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
            {policies.length} Active Policies Monitored
          </span>
        </div>

        {/* Statistical Correlation Disclaimer */}
        <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900">Statistical Correlation vs. Causal Proof</span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {driftData?.disclaimer || "Observed shifts in complaint distribution around policy effective dates indicate statistical correlation. Formal causality requires root-cause engineering review."}
            </p>
          </div>
        </div>
      </div>

      {/* Active Drift Correlation Cards */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <span>Detected Policy Drift Events ({driftData?.active_drift_alerts?.length || 0})</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {driftData?.active_drift_alerts?.map((alert: any) => {
            const diffPct = Math.round(((alert.post_change_complaint_rate - alert.pre_change_complaint_rate) / Math.max(1, alert.pre_change_complaint_rate)) * 100);
            return (
              <div key={alert.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                      {alert.previous_version} → {alert.new_version}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 mt-1.5">{alert.detected_drift_type}</h5>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${alert.correlation_confidence === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                    {alert.correlation_confidence} Correlation
                  </span>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {alert.change_summary}
                </p>

                {/* Pre vs Post Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Pre-Change Baseline</span>
                    <span className="font-bold text-slate-800">{alert.pre_change_complaint_rate} cases/mo</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Post-Change Inflow</span>
                    <span className="font-bold text-rose-600">{alert.post_change_complaint_rate} cases/mo (+{diffPct}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policies Inventory */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Managed Organization Policies & SOP Standards</span>
        </h4>

        <div className="divide-y divide-slate-100">
          {policies.map((pol) => (
            <div key={pol.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{pol.title}</span>
                  <span className="font-mono text-[10px] text-teal-700 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 font-semibold">
                    {pol.version}
                  </span>
                  <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {pol.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-2xl line-clamp-1">{pol.content}</p>
              </div>

              <div className="text-right text-[10px] text-slate-500">
                <span>Effective: {new Date(pol.effective_date).toLocaleDateString()}</span>
                <span className="block text-teal-700 font-semibold">Active Enforcement</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
