"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  RotateCcw, 
  ShieldAlert, 
  HelpCircle,
  ArrowRight
} from "lucide-react";

export function WhatIfSimulator() {
  const [responseSlaHours, setResponseSlaHours] = useState(2.0);
  const [automateVerification, setAutomateVerification] = useState(true);
  const [preventiveMaintenance, setPreventiveMaintenance] = useState(true);
  const [horizonDays, setHorizonDays] = useState(30);

  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runWhatIf({
        response_sla_hours: responseSlaHours,
        automate_verification: automateVerification,
        preventive_maintenance_enabled: preventiveMaintenance,
        simulation_horizon_days: horizonDays,
      });
      setSimulation(res);
    } catch (e) {
      console.error("Simulation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [responseSlaHours, automateVerification, preventiveMaintenance, horizonDays]);

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Counterfactual "What If?" Scenario Simulator</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate operational policy shifts, automated verification, and hardware maintenance to project resolution velocity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            Structural Causal Model
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Intervention Parameters</h4>

          {/* Slider: Target SLA */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Target Response SLA Window:</span>
              <span className="text-slate-900 font-bold">{responseSlaHours} hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={responseSlaHours}
              onChange={(e) => setResponseSlaHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 hr (Aggressive)</span>
              <span>6 hrs (Standard)</span>
              <span>12 hrs (Extended)</span>
            </div>
          </div>

          {/* Toggle: Automate Verification */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-900">Automate Low-Risk Verification</div>
              <p className="text-[11px] text-slate-500">Bypasses the 184-min internal queue for standard cases.</p>
            </div>
            <button
              onClick={() => setAutomateVerification(!automateVerification)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                automateVerification ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Toggle: Preventive Maintenance */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-900">Permanent Lubricant / Component Fix</div>
              <p className="text-[11px] text-slate-500">Addresses recurring root cause RC-MECH-409.</p>
            </div>
            <button
              onClick={() => setPreventiveMaintenance(!preventiveMaintenance)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                preventiveMaintenance ? "bg-teal-600 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          {/* Horizon Selection */}
          <div className="space-y-2">
            <span className="text-xs text-slate-600">Projection Horizon:</span>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setHorizonDays(d)}
                  className={`py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                    horizonDays === d
                      ? "bg-teal-600 border-teal-600 text-white font-semibold shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projections Column */}
        <div className="lg:col-span-6 space-y-4">
          {simulation ? (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Model-Based Projections</h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Projected Resolution Time</span>
                  <div className="text-xl font-bold text-slate-900 flex items-baseline space-x-1">
                    <span>{simulation.projected_resolution_time_hours}</span>
                    <span className="text-xs text-slate-500 font-normal">hours</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Projected SLA Adherence</span>
                  <div className="text-xl font-bold text-teal-600 flex items-baseline space-x-1">
                    <span>{simulation.projected_sla_compliance_rate}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Repeat Rate Reduction</span>
                  <div className="text-xl font-bold text-teal-700 flex items-baseline space-x-1">
                    <span>-{simulation.projected_repeat_complaint_reduction_pct}%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Workload Hours Saved</span>
                  <div className="text-xl font-bold text-amber-600 flex items-baseline space-x-1">
                    <span>~{simulation.projected_workload_hours_saved}h</span>
                  </div>
                </div>
              </div>

              {/* Causal Factors Evaluated */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600">Causal Factors in Simulation:</span>
                <div className="space-y-1.5">
                  {(simulation.causal_factors_analyzed || []).map((f: any, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-white border border-slate-200 text-xs flex justify-between items-center shadow-2xs">
                      <div>
                        <span className="font-semibold text-slate-800">{f.variable}: </span>
                        <span className="text-slate-500 text-[11px]">{f.rationale}</span>
                      </div>
                      <span className="text-teal-700 font-bold ml-2 whitespace-nowrap">{f.effect}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200/80 text-[10px] text-slate-600 space-y-1">
                <div className="font-semibold text-teal-900">Confidence Interval: {simulation.confidence_interval}</div>
                <p className="italic text-slate-500">{simulation.assumptions_statement}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
              Running simulation model...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
