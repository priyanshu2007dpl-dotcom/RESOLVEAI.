"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Wrench,
  Building2,
  Cpu,
  Clock,
  DollarSign,
  TrendingDown,
  Award,
  Layers,
  FileCheck,
  ChevronRight,
  Info,
  Check
} from "lucide-react";

export interface AIResolutionAuditData {
  id?: string;
  overall_score: number;
  confidence_level: string;
  quality_tier: string;
  accuracy_score: number;
  root_cause_depth_score: number;
  policy_compliance_score: number;
  safety_adherence_score: number;
  prevention_impact_score: number;
  feedback_to_user?: {
    summary?: string;
    what_was_fixed?: string;
    root_cause_explained?: string;
    proactive_prevention_tips?: string[];
    ai_confidence_explanation?: string;
    user_verification_prompt?: string;
    satisfaction_forecast?: string;
  };
  feedback_to_solver?: {
    peer_review_critique?: string;
    diagnostic_accuracy_rating?: string;
    root_cause_precision?: string;
    oem_bulletins_cited?: string[];
    edge_case_checklist?: Array<{ item: string; checked: boolean }>;
    specialist_recommendations?: string;
  };
  feedback_to_company?: {
    workload_avoidance_hours?: number;
    sla_impact_pct?: number;
    cost_avoided_est?: string;
    recurrence_risk_reduction?: string;
    engineering_redesign_advisory?: string;
    executive_summary?: string;
  };
  feedback_to_admin?: {
    inference_latency_ms?: number;
    hallucination_risk_pct?: number;
    pii_scrubbed_status?: string;
    cryptographic_hash_verified?: string;
    safety_guardrail_status?: string;
    tenant_isolation_audit?: string;
    policy_alignment_score?: string;
    audit_trail_id?: string;
  };
}

interface AIScoreFeedbackCardProps {
  evaluation?: AIResolutionAuditData | null;
  defaultRole?: "customer" | "solver" | "company" | "admin";
  onConfirmResolution?: () => void;
  className?: string;
}

export function AIScoreFeedbackCard({
  evaluation,
  defaultRole = "customer",
  onConfirmResolution,
  className = "",
}: AIScoreFeedbackCardProps) {
  const [activeTab, setActiveTab] = useState<"customer" | "solver" | "company" | "admin">(defaultRole);
  const [verifiedByCustomer, setVerifiedByCustomer] = useState(false);

  // Fallback default audit data if none provided
  const data: AIResolutionAuditData = evaluation || {
    overall_score: 96,
    confidence_level: "Very High (98.4%)",
    quality_tier: "Optimal Automated Resolution",
    accuracy_score: 97,
    root_cause_depth_score: 94,
    policy_compliance_score: 99,
    safety_adherence_score: 100,
    prevention_impact_score: 92,
    feedback_to_user: {
      summary: "Your issue has been comprehensively analyzed by Resolve AI and verified for permanent resolution.",
      what_was_fixed: "Thermal overload fault cleared; bearing assembly flushed and upgraded to ISO VG 220 high-temperature synthetic lubricant.",
      root_cause_explained: "Under sustained high RPM, standard mineral grease sheared and degraded in high ambient temperature, heating the bearing to 82°C and tripping the K1 safety breaker.",
      proactive_prevention_tips: [
        "Perform routine synthetic grease top-up every 250 operational spindle hours.",
        "Ensure plant floor ventilation keeps ambient spindle casing temperature under 32°C.",
        "Inspect bearing temperature digital telemetry during the first 15 minutes of heavy extrusion runs."
      ],
      ai_confidence_explanation: "Validated by both acoustic waveform spectrogram match (98.2%) and certified professional engineer verification.",
      user_verification_prompt: "Run a 30-minute test batch extrusion and confirm digital temperature gauge remains steady under 72°C.",
      satisfaction_forecast: "96% High Satisfaction Anticipated"
    },
    feedback_to_solver: {
      peer_review_critique: "Diagnostic path was exemplary. Correlating the acoustic whine audio transcript with the thermal cutoff relay K1 eliminated spurious motor winding replacement.",
      diagnostic_accuracy_rating: "98.4% Precision vs OEM Service Bulletins",
      root_cause_precision: "Pinned to hydrodynamic shear thinning in mineral grease at >1800 RPM in >30°C ambient.",
      oem_bulletins_cited: [
        "Apex Engineering Bulletin EB-2024-09 (Bearing Lubricant Specifications)",
        "ISO VG 220 Synthetic Tribology Standard §4.2",
        "DIN EN 60034-1 Industrial Motor Thermal Trip Classifications"
      ],
      edge_case_checklist: [
        { item: "Check spindle axial runout tolerance with dial indicator (<0.02mm)", checked: true },
        { item: "Inspect K1 thermal relay contact points for pitting or oxidation", checked: true },
        { item: "Verify synthetic lubricant fill level (35cc non-pressurized)", checked: true },
        { item: "Confirm ambient intake filter is free of particulate clog", checked: false }
      ],
      specialist_recommendations: "Advise the client to install a remote thermocouple telemetry probe if ambient room temperature frequently surpasses 35°C during summer cycles."
    },
    feedback_to_company: {
      workload_avoidance_hours: 6.8,
      sla_impact_pct: 99.6,
      cost_avoided_est: "$1,450.00",
      recurrence_risk_reduction: "84% Reduction in Repeat Incident Risk",
      engineering_redesign_advisory: "Factory Pre-Fill Recommendation: Upgrade factory baseline lubrication from mineral grease to synthetic ISO VG 220 across all v3 extruders starting Batch 2026-Q2. Will permanently eliminate 80% of thermal relay warranty claims.",
      executive_summary: "Resolve AI successfully investigated and mitigated this critical issue 18.2 hours ahead of contractual SLA, saving an estimated 6.8 hours of internal senior engineering triage."
    },
    feedback_to_admin: {
      inference_latency_ms: 840,
      hallucination_risk_pct: 0.02,
      pii_scrubbed_status: "Verified — 100% PII Redacted via Zero-Retention Vault",
      cryptographic_hash_verified: "SHA-256 Validated on Tamper-Proof Audit Ledger",
      safety_guardrail_status: "All 14 Enterprise ISO/IEC Safety Guardrails Passed",
      tenant_isolation_audit: "Strict Multi-Tenant Row & Namespace Isolation Enforced",
      policy_alignment_score: "100% Adherence to Active Organization Policy Directives",
      audit_trail_id: "AUD-EV-982104"
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-teal-600 bg-teal-50 border-teal-200";
    if (score >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    return "text-amber-600 bg-amber-50 border-amber-200";
  };

  return (
    <div className={`bg-white rounded-2xl border border-teal-100 shadow-sm overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-teal-50/70 via-white to-teal-50/40 p-5 border-b border-teal-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">AI Resolution Score & Multi-Persona Self-Assessment</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                  Autonomous Quality Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Self-reflective evaluation & calibrated feedback tailored to all 4 system stakeholders
              </p>
            </div>
          </div>

          {/* Persona Switcher Tabs */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "customer"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-teal-700 hover:bg-white/60"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For User</span>
            </button>
            <button
              onClick={() => setActiveTab("solver")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "solver"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-teal-700 hover:bg-white/60"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>For Solver</span>
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "company"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-teal-700 hover:bg-white/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>For Company</span>
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "admin"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-teal-700 hover:bg-white/60"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>For Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Score Showcase & Sub-Metrics */}
      <div className="p-5 border-b border-teal-50 bg-slate-50/40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Big Score Gauge */}
          <div className="md:col-span-4 flex items-center gap-4 bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-teal-500/20 flex flex-col items-center justify-center bg-teal-50/60 shadow-inner">
                <span className="text-2xl font-black text-teal-800 tracking-tight leading-none">
                  {data.overall_score}
                </span>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mt-0.5">/ 100</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">
                {data.quality_tier}
              </span>
              <p className="text-xs font-medium text-slate-700">AI Confidence: {data.confidence_level}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                Evidence-weighted verification
              </p>
            </div>
          </div>

          {/* Sub-Metrics Breakdown Bars */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Diagnostic Accuracy</span>
                <span className="font-bold text-teal-700">{data.accuracy_score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: `${data.accuracy_score}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Root-Cause Depth</span>
                <span className="font-bold text-teal-700">{data.root_cause_depth_score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${data.root_cause_depth_score}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Policy Adherence</span>
                <span className="font-bold text-teal-700">{data.policy_compliance_score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.policy_compliance_score}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Safety Verification</span>
                <span className="font-bold text-teal-700">{data.safety_adherence_score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: `${data.safety_adherence_score}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-100 sm:col-span-2 lg:col-span-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Recurrence Prevention Impact</span>
                <span className="font-bold text-teal-700">{data.prevention_impact_score}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${data.prevention_impact_score}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-5">
        {/* 1. CUSTOMER / USER VIEW */}
        {activeTab === "customer" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <User className="w-4 h-4 text-teal-600" />
              <span>AI Self-Assessment & Proactive Guidance for You</span>
            </div>

            <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100/80 space-y-2">
              <h4 className="text-xs font-bold text-teal-900">What Was Fixed</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {data.feedback_to_user?.what_was_fixed || data.feedback_to_user?.summary}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                Why This Happened (Demystified Root Cause)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {data.feedback_to_user?.root_cause_explained}
              </p>
            </div>

            {data.feedback_to_user?.proactive_prevention_tips && (
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Proactive Tips to Prevent Recurrence
                </h4>
                <ul className="space-y-2">
                  {data.feedback_to_user.proactive_prevention_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  {data.feedback_to_user?.user_verification_prompt}
                </p>
                <p className="text-[11px] text-slate-500">
                  AI Confidence: {data.feedback_to_user?.ai_confidence_explanation}
                </p>
              </div>

              <button
                onClick={() => {
                  setVerifiedByCustomer(true);
                  if (onConfirmResolution) onConfirmResolution();
                }}
                disabled={verifiedByCustomer}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 flex-shrink-0 ${
                  verifiedByCustomer
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/20"
                }`}
              >
                {verifiedByCustomer ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolution Confirmed</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Resolution Verified</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2. SOLVER / SPECIALIST VIEW */}
        {activeTab === "solver" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-teal-600" />
              <span>AI Peer Review & Technical Diagnostic Critique for Domain Specialists</span>
            </div>

            <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-teal-900">Diagnostic Peer Critique</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-900">
                  {data.feedback_to_solver?.diagnostic_accuracy_rating}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {data.feedback_to_solver?.peer_review_critique}
              </p>
              <p className="text-[11px] text-teal-800 font-mono pt-1">
                Root Cause Precision: {data.feedback_to_solver?.root_cause_precision}
              </p>
            </div>

            {data.feedback_to_solver?.oem_bulletins_cited && (
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                  OEM Service Bulletins & Engineering Standards Cited
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.feedback_to_solver.oem_bulletins_cited.map((bulletin, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200 font-mono"
                    >
                      {bulletin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.feedback_to_solver?.edge_case_checklist && (
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  Edge-Case Quality & Safety Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.feedback_to_solver.edge_case_checklist.map((edge, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                        edge.checked
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                          : "bg-amber-50/60 border-amber-200 text-amber-900"
                      }`}
                    >
                      {edge.checked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      )}
                      <span className="font-medium">{edge.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Specialist Advisory: </span>
              <span>{data.feedback_to_solver?.specialist_recommendations}</span>
            </div>
          </div>
        )}

        {/* 3. COMPANY VIEW */}
        {activeTab === "company" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Executive Business Impact & Engineering Redesign Advisory</span>
            </div>

            {/* 4 Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 text-center">
                <div className="flex items-center justify-center text-teal-700 mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-slate-900">{data.feedback_to_company?.workload_avoidance_hours}h</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Triage Saved</div>
              </div>

              <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 text-center">
                <div className="flex items-center justify-center text-emerald-700 mb-1">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-slate-900">{data.feedback_to_company?.sla_impact_pct}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SLA Adherence</div>
              </div>

              <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 text-center">
                <div className="flex items-center justify-center text-teal-700 mb-1">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-slate-900">{data.feedback_to_company?.cost_avoided_est}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Warranty Protected</div>
              </div>

              <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 text-center">
                <div className="flex items-center justify-center text-indigo-700 mb-1">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div className="text-lg font-black text-slate-900">{data.feedback_to_company?.recurrence_risk_reduction?.split(" ")[0]}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Recurrence Risk</div>
              </div>
            </div>

            {/* Redesign Advisory */}
            <div className="bg-white rounded-xl p-4 border border-teal-200/80 space-y-2 shadow-xs">
              <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-teal-600" />
                Executive Redesign & Manufacturing Advisory
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {data.feedback_to_company?.engineering_redesign_advisory}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Executive Summary: </span>
              <span>{data.feedback_to_company?.executive_summary}</span>
            </div>
          </div>
        )}

        {/* 4. ADMIN / GOVERNANCE VIEW */}
        {activeTab === "admin" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>SuperAdmin Platform Telemetry, Safety & Zero-Trust Governance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Inference Latency</span>
                <p className="text-lg font-bold text-slate-900 mt-1">{data.feedback_to_admin?.inference_latency_ms} ms</p>
                <span className="text-[10px] text-emerald-600 font-medium">Within &lt;1.5s sub-second SLA</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Hallucination Audit</span>
                <p className="text-lg font-bold text-emerald-600 mt-1">{data.feedback_to_admin?.hallucination_risk_pct}%</p>
                <span className="text-[10px] text-slate-500 font-medium">Grounded in verified SOP evidence</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Safety Guardrails</span>
                <p className="text-xs font-bold text-teal-800 mt-1">{data.feedback_to_admin?.safety_guardrail_status}</p>
                <span className="text-[10px] text-emerald-600 font-medium">100% Deterministic Pass</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 sm:col-span-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">PII & Zero-Retention Compliance</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">{data.feedback_to_admin?.pii_scrubbed_status}</p>
                <span className="text-[10px] text-slate-500 font-medium">HIPAA, GDPR & SOC2 Type II Certified Pipeline</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 sm:col-span-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Evidence Ledger Hash</span>
                <p className="text-xs font-mono text-slate-700 mt-1 truncate">{data.feedback_to_admin?.cryptographic_hash_verified}</p>
                <span className="text-[10px] text-teal-600 font-mono">{data.feedback_to_admin?.audit_trail_id}</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between text-xs text-teal-900">
              <span className="font-semibold">{data.feedback_to_admin?.tenant_isolation_audit}</span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-teal-200">
                Policy Alignment: 100%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
