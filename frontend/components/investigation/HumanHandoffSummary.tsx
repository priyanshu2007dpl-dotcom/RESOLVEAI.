"use client";

import React from "react";
import { 
  ShieldAlert, 
  User, 
  Clock, 
  FileCheck2, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ArrowRight,
  Flame,
  FileText
} from "lucide-react";

interface HandoffSummaryProps {
  handoffData: {
    complaint_id: string;
    tracking_code: string;
    customer_problem: string;
    what_ai_understood: {
      primary_domain: string;
      contributing_domains: string[];
      severity_score: number;
      urgency: string;
    };
    customer_history: {
      customer_name: string;
      company_name: string;
      products_owned: string[];
      total_past_complaints: number;
      account_sla_tier: string;
    };
    actions_already_attempted: string[];
    evidence_collected: Array<{
      file_name: string;
      file_type: string;
      sha256_hash: string;
      visual_observation?: string;
      extracted_text?: string;
    }>;
    possible_root_causes: Array<{
      root_cause_hypothesis: string;
      confidence_score: number;
      contributing_factors: string[];
    }>;
    policy_checked: string;
    reason_for_escalation: string;
    recommended_next_step: string;
    escalation_timestamp: string;
    sla_due_at?: string;
    assigned_expert?: string;
  };
}

export function HumanHandoffSummary({ handoffData }: HandoffSummaryProps) {
  const isSafety = handoffData.reason_for_escalation.toLowerCase().includes("safety") ||
                   handoffData.reason_for_escalation.toLowerCase().includes("smoke") ||
                   handoffData.what_ai_understood.severity_score >= 85;

  return (
    <div className="bg-white rounded-2xl border-2 border-red-300 p-6 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            {isSafety ? <Flame className="w-6 h-6 animate-pulse" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Human Escalation Context Package</h2>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-50 text-red-700 border border-red-200">
                Zero Context Loss Handoff
              </span>
            </div>
            <p className="text-xs text-slate-500">
              The assigned expert receives full historical, diagnostic, and evidentiary context. No need to start from zero.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 block">Case Tracking Code</span>
          <span className="text-sm font-mono font-bold text-red-600">{handoffData.tracking_code}</span>
        </div>
      </div>

      {/* 9-Point Structured Handoff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Customer Problem */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Customer Problem Narrative</span>
          </div>
          <p className="text-slate-800 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200">
            &ldquo;{handoffData.customer_problem}&rdquo;
          </p>
        </div>

        {/* 2. What AI Understood */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>What AI Understood</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Primary Domain</span>
              <span className="font-bold text-amber-700">{handoffData.what_ai_understood.primary_domain}</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Contributing Domains</span>
              <span className="font-semibold text-slate-800">{handoffData.what_ai_understood.contributing_domains.join(", ") || "None"}</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Severity Score</span>
              <span className="font-bold text-red-600">{handoffData.what_ai_understood.severity_score}/100</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Urgency Flag</span>
              <span className="font-bold uppercase text-red-700">{handoffData.what_ai_understood.urgency}</span>
            </div>
          </div>
        </div>

        {/* 3. Customer History */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Customer History &amp; Products Owned</span>
          </div>
          <div className="space-y-1 text-slate-700 text-[11px]">
            <div><span className="text-slate-500">Customer:</span> <strong className="text-slate-900">{handoffData.customer_history.customer_name}</strong> ({handoffData.customer_history.company_name})</div>
            <div><span className="text-slate-500">Products:</span> {handoffData.customer_history.products_owned.join(", ")}</div>
            <div><span className="text-slate-500">SLA Tier:</span> <span className="text-emerald-700 font-semibold">{handoffData.customer_history.account_sla_tier}</span></div>
          </div>
        </div>

        {/* 4. Actions Already Attempted */}
        <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-amber-800 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 text-[10px] flex items-center justify-center font-bold">4</span>
            <span>Actions Already Attempted (DO NOT REPEAT)</span>
          </div>
          <ul className="space-y-1 text-[11px]">
            {handoffData.actions_already_attempted.map((act, i) => (
              <li key={i} className="flex items-center space-x-1.5 text-amber-900">
                <span className="text-red-500 font-bold">✕</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Evidence Collected */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">5</span>
            <span>Evidence Collected &amp; Cryptographically Hashed</span>
          </div>
          <div className="space-y-1.5">
            {handoffData.evidence_collected.map((ev, i) => (
              <div key={i} className="p-2 rounded bg-white border border-slate-200 text-[10px] space-y-0.5 shadow-xs">
                <div className="flex justify-between items-center font-semibold text-slate-800">
                  <span>{ev.file_name} ({ev.file_type.toUpperCase()})</span>
                  <span className="font-mono text-teal-700 text-[9px] font-bold">SHA-256 ✓</span>
                </div>
                <div className="text-slate-500 truncate">{ev.visual_observation || ev.extracted_text || "Analyzed"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Possible Root Causes */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">6</span>
            <span>Root-Cause Hypotheses &amp; Confidence</span>
          </div>
          <div className="space-y-1.5">
            {handoffData.possible_root_causes.map((rc, i) => (
              <div key={i} className="p-2 rounded bg-white border border-slate-200 text-[11px] space-y-1 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{rc.root_cause_hypothesis}</span>
                  <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] border border-teal-200">
                    {Math.round(rc.confidence_score * 100)}% Conf
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Factors: {rc.contributing_factors.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Policy Checked */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">7</span>
            <span>Policy Consulted</span>
          </div>
          <p className="text-slate-800 text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
            {handoffData.policy_checked}
          </p>
        </div>

        {/* 8. Why AI is Escalating */}
        <div className="bg-red-50/70 rounded-xl p-4 border border-red-200 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-red-700 font-bold text-[11px]">
            <span className="w-4 h-4 rounded-full bg-red-200 text-red-800 text-[10px] flex items-center justify-center font-bold">8</span>
            <span>Why AI is Escalating (Trigger)</span>
          </div>
          <p className="text-red-900 text-[11px] leading-relaxed font-semibold">
            {handoffData.reason_for_escalation}
          </p>
        </div>
      </div>

      {/* 9. Recommended Immediate Action for the Human Specialist */}
      <div className="bg-teal-50/70 rounded-xl p-4 border border-teal-200 space-y-2">
        <div className="flex items-center space-x-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
          <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 text-xs flex items-center justify-center font-bold">9</span>
          <span>Recommended Immediate Action for Assigned Expert ({handoffData.assigned_expert || "Specialist"})</span>
        </div>
        <p className="text-sm text-teal-950 font-bold pl-7">
          {handoffData.recommended_next_step}
        </p>
      </div>
    </div>
  );
}
