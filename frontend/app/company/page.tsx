"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/context";
import { OperationalEfficiencyCard } from "@/components/analytics/OperationalEfficiencyCard";
import { WhatIfSimulator } from "@/components/analytics/WhatIfSimulator";
import { ProcessMiningViewer } from "@/components/analytics/ProcessMiningViewer";
import { PolicyDriftViewer } from "@/components/analytics/PolicyDriftViewer";
import { getDomainColor } from "@/lib/utils";
import { AIScoreFeedbackCard } from "@/components/investigation/AIScoreFeedbackCard";
import { 
  Building2, 
  BarChart3, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Key, 
  Webhook, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Sliders, 
  GitBranch, 
  Plus,
  Copy,
  ExternalLink,
  Scale,
  Award
} from "lucide-react";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "ai_quality" | "efficiency" | "whatif" | "process" | "incidents" | "drift" | "api" | "import">("overview");

  const [analytics, setAnalytics] = useState<any>(null);
  const [efficiency, setEfficiency] = useState<any>(null);
  const [aiScores, setAiScores] = useState<any>(null);
  const [rootCauses, setRootCauses] = useState<any[]>([]);
  const [preventionRecs, setPreventionRecs] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [silentAlerts, setSilentAlerts] = useState<any[]>([]);
  const [solvers, setSolvers] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New API Key Modal State
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKeySecret, setCreatedKeySecret] = useState("");

  // CSV Import State
  const [csvRawText, setCsvRawText] = useState("");
  const [importResult, setImportResult] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        analyticsData,
        efficiencyData,
        rcData,
        prevData,
        incData,
        alertData,
        solverList,
        keys,
        hooks,
        qualityScores
      ] = await Promise.all([
        api.getCompanyAnalytics(),
        api.getOperationalEfficiency(),
        api.getRootCauses(),
        api.getPreventionRecommendations(),
        api.getIncidents(),
        api.getSilentFailureAlerts(),
        api.getSolvers(),
        api.getApiKeys(),
        api.getWebhooks(),
        api.getCompanyAIScores().catch(() => null)
      ]);

      setAnalytics(analyticsData);
      setEfficiency(efficiencyData);
      setRootCauses(rcData);
      setPreventionRecs(prevData);
      setIncidents(incData);
      setSilentAlerts(alertData);
      setSolvers(solverList);
      setApiKeys(keys);
      setWebhooks(hooks);
      if (qualityScores) setAiScores(qualityScores);
    } catch (e) {
      console.error("Company fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const res = await api.createApiKey(newKeyName);
      setCreatedKeySecret(res.raw_api_key || "omni_live_created");
      setNewKeyName("");
      const updatedKeys = await api.getApiKeys();
      setApiKeys(updatedKeys);
    } catch (e) {
      console.error("API Key create error:", e);
    }
  };

  const handleCsvImport = async () => {
    try {
      // Mock CSV ingestion parse
      const records = [
        { title: "Heated extruder casing warning", description: "Casing thermal indicator tripped after long extrusion run", product_service: "Apex Industrial Extruder v3", urgency: "high" },
        { title: "Display panel flicker on cold boot", description: "Display panel backlight flickers for 30s before stabilizing", product_service: "OmniBook Pro 16", urgency: "medium" },
        { title: "Invoice tax charge mismatch", description: "Invoice calculated 8.5% instead of 6% regional exemption", product_service: "Enterprise Billing", urgency: "low" }
      ];
      const mapping = { title: "title", description: "description", product_service: "product_service", urgency: "urgency" };
      const res = await api.request("/company/import-csv", {
        method: "POST",
        body: JSON.stringify({ records, column_mapping: mapping }),
      });
      setImportResult(res);
      fetchData();
    } catch (e) {
      console.error("CSV import error:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Organization Operations & Analytics</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Apex Dynamics Corp
              </span>
            </div>
            <p className="text-xs text-slate-500">
              SaaS Plan: <strong className="text-slate-800">Enterprise SLA (2h Critical)</strong> • API Integration: <strong className="text-teal-600">Active</strong>
            </p>
          </div>
        </div>

        {/* Tab navigation pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          {[
            { id: "overview", label: "Executive Intel", icon: BarChart3 },
            { id: "ai_quality", label: "AI Quality & Self-Audit", icon: Sparkles },
            { id: "efficiency", label: "Workload Avoidance", icon: TrendingDown },
            { id: "whatif", label: "What-If Simulator", icon: Sliders },
            { id: "process", label: "Process Mining", icon: GitBranch },
            { id: "incidents", label: "Incidents & Signals", icon: AlertTriangle },
            { id: "drift", label: "Policy Drift", icon: Scale },
            { id: "api", label: "API & Webhooks", icon: Key },
            { id: "import", label: "Data Import", icon: FileSpreadsheet }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                  isActive
                    ? "bg-teal-600 border-teal-600 text-white font-semibold shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && analytics && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Complaints</span>
              <div className="text-2xl font-bold text-slate-900">{analytics.total_complaints}</div>
              <span className="text-[10px] text-teal-600 font-medium">Outsourced to platform</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active In Triage</span>
              <div className="text-2xl font-bold text-amber-600">{analytics.open_complaints}</div>
              <span className="text-[10px] text-slate-500">Under investigation</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Resolved Cases</span>
              <div className="text-2xl font-bold text-teal-600">{analytics.resolved_complaints}</div>
              <span className="text-[10px] text-teal-700 font-medium">Verified by customer</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SLA Adherence</span>
              <div className="text-2xl font-bold text-slate-900">{analytics.sla_compliance_rate}%</div>
              <span className="text-[10px] text-teal-700 font-semibold">+24.4% vs in-house</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Incidents</span>
              <div className="text-2xl font-bold text-rose-600">{analytics.active_incidents}</div>
              <span className="text-[10px] text-rose-600 font-medium">Clustered automatically</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avg Resolution</span>
              <div className="text-2xl font-bold text-teal-700">{analytics.avg_resolution_hours}h</div>
              <span className="text-[10px] text-slate-500">From intake to fix</span>
            </div>
          </div>

          {/* Domain Breakdown & Monthly Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Universal Domain Distribution */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Universal Domain Distribution
                </h3>
                <span className="text-[10px] text-slate-400">Multi-domain classification</span>
              </div>

              <div className="space-y-3">
                {analytics.domain_distribution.map((d: any) => (
                  <div key={d.domain} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium">{d.domain}</span>
                      <span className="font-mono text-slate-500">{d.count} cases ({d.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, d.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Performance by Tier */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Contractual SLA Performance
                </h3>
                <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">96.4% Overall On-Time</span>
              </div>

              <div className="space-y-3">
                {Object.entries(analytics.sla_performance || {}).map(([tier, rate]: any) => (
                  <div key={tier} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 capitalize font-medium">{tier.replace("_", " ")}:</span>
                      <span className="font-mono text-teal-700 font-bold">{rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 mt-4">
                <div className="font-semibold text-slate-800">Automatic Escalation Trigger:</div>
                <p>When any critical case reaches 75% of SLA threshold without assigned solver action, it auto-escalates to the Senior Specialist Tier.</p>
              </div>
            </div>
          </div>

          {/* Recurring Root Causes & Prevention Recommendations */}
          <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recurring Root Causes & Permanent Prevention Intelligence
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  AI flags patterns appearing across multiple incidents to propose engineering redesigns and maintenance updates.
                </p>
              </div>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                {preventionRecs.length} Actionable Recommendations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preventionRecs.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-200 text-slate-500">
                    <span>Owner: <strong className="text-slate-800">{rec.owner}</strong></span>
                    <span className="text-teal-700 font-semibold">{rec.estimated_impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: AI QUALITY & SELF-AUDIT */}
      {activeTab === "ai_quality" && (
        <div className="space-y-6">
          {/* Top Score & Telemetry Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Average Resolution Score</span>
                <div className="text-3xl font-black text-teal-800 mt-1">
                  {aiScores?.average_score || 96.4} <span className="text-sm font-normal text-slate-400">/ 100</span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Quality Tier
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black text-lg">
                ★
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">High-Confidence Pass</span>
                <div className="text-3xl font-black text-slate-900 mt-1">{aiScores?.high_confidence_pct || 98.2}%</div>
                <span className="text-xs text-slate-500 mt-1 block">Deterministic policy match</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Optimal Auto Resolution</span>
                <div className="text-3xl font-black text-teal-600 mt-1">{aiScores?.optimal_resolution_rate || 91.4}%</div>
                <span className="text-xs text-teal-700 font-semibold mt-1 block">Zero manual touch needed</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Human-in-Loop Safeguard</span>
                <div className="text-3xl font-black text-indigo-700 mt-1">{aiScores?.human_in_loop_ratio || 8.6}%</div>
                <span className="text-xs text-slate-500 mt-1 block">Safety protocol escalation</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Domain AI Resolution Benchmarks */}
          <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Domain AI Resolution Quality Benchmarks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Resolution accuracy &amp; root-cause precision scores evaluated across all outsourced business departments
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Continuous AI Self-Audit
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(aiScores?.domain_benchmarks || [
                { domain: "Billing & Payment", avg_score: 99.2, resolution_count: 820, tier: "Optimal Autonomous" },
                { domain: "Mechanical / Industrial", avg_score: 96.5, resolution_count: 48, tier: "Human-Verified Engineering" },
                { domain: "Hardware & Electrical", avg_score: 94.8, resolution_count: 31, tier: "Multi-Domain Diagnostic" },
                { domain: "Software & Firmware", avg_score: 97.1, resolution_count: 112, tier: "Automated Validation" }
              ]).map((b: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-slate-900">{b.domain}</span>
                    <span className="text-xs font-black text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-100">
                      {b.avg_score}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${b.avg_score}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>{b.resolution_count} resolved cases</span>
                    <span className="font-semibold text-teal-700">{b.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role-Adaptive Feedback Inspector */}
          <AIScoreFeedbackCard defaultRole="company" />
        </div>
      )}

      {/* TAB 2: OPERATIONAL EFFICIENCY DASHBOARD */}
      {activeTab === "efficiency" && efficiency && (
        <OperationalEfficiencyCard data={efficiency} />
      )}

      {/* TAB 3: WHAT-IF SIMULATOR */}
      {activeTab === "whatif" && (
        <WhatIfSimulator />
      )}

      {/* TAB 4: PROCESS MINING */}
      {activeTab === "process" && (
        <ProcessMiningViewer />
      )}

      {/* TAB 5: INCIDENTS & SILENT FAILURE SIGNALS */}
      {activeTab === "incidents" && (
        <div className="space-y-6">
          {/* Silent Failure Signals */}
          <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Silent Failure Detection & Predictive Signals</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Correlates complaint frequency spikes, API latency anomalies, and service logs before full outages develop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {silentAlerts.map((al) => (
                <div key={al.alert_id} className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{al.title}</span>
                    <span className="font-mono text-rose-600 font-bold">{al.complaint_spike_ratio}x Spike Ratio</span>
                  </div>
                  <p className="text-xs text-slate-600">{al.detected_pattern}</p>
                  <div className="p-2.5 rounded bg-white border border-amber-200 text-[11px] text-amber-800">
                    <strong>Recommended Containment:</strong> {al.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Incident Clusters */}
          <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Active Incident Clusters (Incident Genealogy)
            </h3>
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-rose-600">{inc.incident_code}</span>
                      <span className="font-bold text-slate-900 text-sm">{inc.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase font-bold text-[10px]">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-slate-700">{inc.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                    <span>Affected Customers: <strong className="text-slate-900">{inc.affected_user_count}</strong></span>
                    <span>•</span>
                    <span>Products: <strong className="text-slate-900">{inc.affected_products.join(", ")}</strong></span>
                    <span>•</span>
                    <span>Regions: <strong className="text-slate-900">{inc.affected_regions.join(", ")}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: POLICY DRIFT & SOP VERSIONING */}
      {activeTab === "drift" && (
        <PolicyDriftViewer />
      )}

      {/* TAB 6: API KEYS & WEBHOOK INTEGRATIONS */}
      {activeTab === "api" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* API Keys */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-teal-600" />
                <span>B2B Inbound API Keys</span>
              </h3>
            </div>

            {createdKeySecret && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1 text-xs">
                <span className="text-teal-800 font-bold block">New API Key Created! Copy now:</span>
                <div className="font-mono bg-white border border-teal-100 p-2 rounded text-teal-700 select-all break-all font-semibold">
                  {createdKeySecret}
                </div>
              </div>
            )}

            <form onSubmit={handleCreateApiKey} className="flex gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name (e.g. Zendesk Sync Key)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Create Key
              </button>
            </form>

            <div className="space-y-2">
              {apiKeys.map((k) => (
                <div key={k.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-slate-900">{k.name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{k.key_prefix}...</div>
                  </div>
                  <span className="text-[10px] text-teal-700 font-mono font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Active</span>
                </div>
              ))}
            </div>

            {/* B2B Ingestion Endpoint Code Block */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">External Inbound Endpoint:</span>
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-teal-300 overflow-x-auto">
{`POST /api/v1/external/complaints
Headers: { "X-API-Key": "omni_live_..." }
Body:
{
  "external_ticket_id": "ABC-1029",
  "customer_reference": "C1023",
  "product": "Laptop",
  "description": "Screen is flickering",
  "priority": "high"
}`}
              </pre>
            </div>
          </div>

          {/* Webhooks */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Webhook className="w-4 h-4 text-teal-600" />
                <span>Outbound Webhooks</span>
              </h3>
            </div>

            <div className="space-y-2">
              {webhooks.map((w) => (
                <div key={w.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-mono text-[11px] text-teal-700">
                    <span className="truncate max-w-[80%] font-semibold">{w.url}</span>
                    <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Active</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(w.subscribed_events || []).map((ev: string) => (
                      <span key={ev} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-medium">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              When a complaint is classified, assigned to a solver, or verified as resolved, Resolve AI delivers HMAC-signed webhooks to your internal ERP or event bus.
            </p>
          </div>
        </div>
      )}

      {/* TAB 7: CSV IMPORT STUDIO */}
      {activeTab === "import" && (
        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span>Bulk Historical Data Ingestion Studio</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Import past complaint records via CSV or JSON with automatic column mapping, deduplication, and retroactive AI investigation.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <p className="text-xs text-slate-700">
              Click below to simulate batch ingestion of 3 historical cases (Extruder, Laptop, Billing) into the Resolve AI engine:
            </p>

            <button
              onClick={handleCsvImport}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Execute Batch CSV Ingestion & Mapping</span>
            </button>

            {importResult && (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 space-y-1">
                <span className="font-bold text-teal-800">Import Batch Finished!</span>
                <div>Total: {importResult.total_records} | Ingested: {importResult.imported_count} | Duplicates Skipped: {importResult.duplicate_count}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
