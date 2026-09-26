"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { 
  GitBranch, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles,
  Zap
} from "lucide-react";

export function ProcessMiningViewer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProcessMining()
      .then(setData)
      .catch((e) => console.error("Process mining fetch error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
        Reconstructing operational process mining event logs...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{data.process_name}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Process event log reconstruction identifying operational bottlenecks and circular rework loops.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {data.total_traces} Traces Mined • Rework Rate: {data.rework_rate}%
          </span>
        </div>
      </div>

      {/* Process Flow Stage Diagram */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Reconstructed Trace Pipeline</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.nodes.map((node: any, idx: number) => {
            const isBottleneck = node.is_bottleneck;

            return (
              <div
                key={node.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBottleneck
                    ? "bg-rose-50/50 border-rose-200 text-rose-900 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-800 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">Stage {idx + 1}</span>
                  {isBottleneck ? (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                      Bottleneck
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-500">{node.cases_handled} cases</span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 mb-2 leading-snug">{node.name}</div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Avg Duration:</span>
                    <span className={`font-mono font-semibold ${isBottleneck ? "text-rose-600 font-bold" : "text-slate-800"}`}>
                      {node.avg_duration_min > 60
                        ? `${(node.avg_duration_min / 60).toFixed(1)} hrs`
                        : `${node.avg_duration_min} mins`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Error / Loop:</span>
                    <span className="font-mono text-slate-700 font-medium">{node.error_rate_pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottlenecks & Optimization Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-600">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Operational Bottlenecks:</span>
          </div>
          <div className="space-y-2 text-xs">
            {data.bottleneck_steps.map((b: any, bIdx: number) => (
              <div key={bIdx} className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{b.step}</span>
                  <span className="text-rose-600 font-mono font-bold">{b.avg_duration}</span>
                </div>
                <p className="text-[11px] text-slate-600">{b.impact}</p>
                <p className="text-[11px] text-teal-700 font-semibold">Fix: {b.recommended_action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-900">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Automated Process Optimization Strategy:</span>
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              {data.recommended_optimization}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-teal-100 text-[11px] text-slate-600 flex items-center justify-between shadow-2xs">
            <span>Rework Loops Detected:</span>
            <span className="font-bold text-teal-700">11.4% of cases</span>
          </div>
        </div>
      </div>
    </div>
  );
}
