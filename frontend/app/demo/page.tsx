"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Wrench, 
  Cpu, 
  Network, 
  ShieldCheck, 
  Bot, 
  TrendingDown, 
  Building2, 
  Play,
  RotateCcw,
  AlertTriangle,
  Flame,
  Check,
  CreditCard,
  FileText,
  UserCheck,
  HelpCircle,
  ShieldAlert
} from "lucide-react";
import { RootCauseGraph } from "@/components/investigation/RootCauseGraph";
import { SolverCopilotDrawer } from "@/components/investigation/SolverCopilotDrawer";
import { OperationalEfficiencyCard } from "@/components/analytics/OperationalEfficiencyCard";
import { HumanHandoffSummary } from "@/components/investigation/HumanHandoffSummary";
import { CustomerContextCard } from "@/components/investigation/CustomerContextCard";
import { AIScoreFeedbackCard } from "@/components/investigation/AIScoreFeedbackCard";

export default function DemoPage() {
  const [activeScenario, setActiveScenario] = useState<"scenario3" | "scenario1" | "scenario2" | "scenario4">("scenario3");
  
  // Scenario 3 (Flagship 11-step) Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Scenario 1 (Autonomous) Interactive execution state
  const [scenario1Executing, setScenario1Executing] = useState(false);
  const [scenario1Done, setScenario1Done] = useState(false);

  // Scenario 4 (Safety) state
  const [scenario4Handoff, setScenario4Handoff] = useState(true);

  const stepsScenario3 = [
    { num: 1, title: "Customer Multimodal Intake", summary: "Customer submits industrial extruder stoppage with photo of bearing, acoustic sound recording, and maintenance log PDF." },
    { num: 2, title: "AI Multi-Domain Detection", summary: "Resolve AI identifies primary domain Mechanical with cross-domain contributing factors in Electrical & Industrial." },
    { num: 3, title: "Complaint Genealogy & Clustering", summary: "Vector similarity scans historical database and matches 32 related complaints across similar drive spindle assemblies." },
    { num: 4, title: "Root-Cause Reasoner & Hypothesis", summary: "Identifies bearing lubrication shear breakdown inducing micro-friction, heating stator beyond 80°C and tripping relay K1." },
    { num: 5, title: "Interactive Causal Graph DAG", summary: "Reconstructs complete failure chain from customer intake through component stress to probable root cause." },
    { num: 6, title: "Incident Association (INC-2047)", summary: "Connects complaint to active organizational incident cluster affecting 1,420 units in operation." },
    { num: 7, title: "Operational Solver Matching", summary: "Transparent algorithm matches Dr. Marcus Vance (Dual-Certified PE Mechanical & Electrical Engineer) with 98% affinity." },
    { num: 8, title: "Solver Workspace & RAG Copilot", summary: "Dr. Marcus queries AI Copilot for torque specs and recommended lubricant replacement kits with cited engineering bulletins." },
    { num: 9, title: "Corrective Action & Resolution", summary: "Solver applies synthetic ISO VG 220 lubricant, clears fault code E-42, and submits field resolution." },
    { num: 10, title: "Customer Confirmation & 5★ Feedback", summary: "Customer verifies trial run success and confirms resolution with 5-star rating." },
    { num: 11, title: "Organizational Prevention Intelligence", summary: "Company dashboard automatically generates permanent prevention recommendation and computes internal workload hours avoided." }
  ];

  const demoGraphData = {
    nodes: [
      { id: "node_complaint", label: "Customer Complaint: CMP-2026-9812", type: "complaint", data: { title: "Apex Extruder stops after 20 mins", urgency: "high", timestamp: "2026-09-26T01:15:00Z" } },
      { id: "node_symptom", label: "Observed Symptom: High-pitch acoustic whine & sudden halt", type: "symptom", data: { severity: 85, extracted_by: "AI Audio & Text Ingestion" } },
      { id: "node_process", label: "Active Stage: Continuous Operational Load (T+20m)", type: "process", data: { process_domain: "Mechanical", load_rpm: 1800 } },
      { id: "node_component", label: "Affected Subsystem: Drive Spindle & Bearings", type: "component", data: { part_number: "SPIN-MECH-44", verified_by_photo: true } },
      { id: "node_failure", label: "Failure Mode: Thermal Overload Switch K1 Trip (Fault E-42)", type: "failure", data: { trip_temperature: "82°C", relay_state: "LATCHED_OPEN" } },
      { id: "node_contributing", label: "Contributing Factors: Viscosity Loss in Mineral Grease", type: "contributing", data: { ambient_temp: "32°C", grease_type: "Mineral Standard" } },
      { id: "node_root_cause", label: "Probable Root Cause: Lubrication Breakdown Inducing Friction", type: "root_cause", data: { code: "RC-MECH-409", recurrence_count: 32 } }
    ],
    edges: [
      { id: "e1", source: "node_complaint", target: "node_symptom", label: "exhibits" },
      { id: "e2", source: "node_symptom", target: "node_process", label: "occurs during" },
      { id: "e3", source: "node_process", target: "node_component", label: "stresses" },
      { id: "e4", source: "node_component", target: "node_failure", label: "triggers" },
      { id: "e5", source: "node_failure", target: "node_contributing", label: "amplified by" },
      { id: "e6", source: "node_contributing", target: "node_root_cause", label: "concludes to" }
    ],
    confidence_score: 0.94,
    blast_radius: {
      affected_product_line: "Apex Industrial Extruder v3",
      affected_units_estimated: 1420,
      regional_concentration: ["North America Midwest Industrial", "Western Europe"],
      recommended_containment: "Issue Engineering Bulletin EB-2025-11 for synthetic lubricant upgrade."
    }
  };

  const sampleSafetyHandoff = {
    complaint_id: "cmp-safety-01",
    tracking_code: "CMP-2026-9999",
    customer_problem: "URGENT: Machine #3 was running when black smoke started pouring out from the rear bearing spindle accompanied by an acrid electrical burning smell. We hit the E-stop button immediately. The motor casing is scorching hot.",
    what_ai_understood: {
      primary_domain: "Mechanical",
      contributing_domains: ["Electrical", "Safety Critical"],
      severity_score: 98,
      urgency: "critical"
    },
    customer_history: {
      customer_name: "Elena Vance",
      company_name: "Vance Precision Tooling",
      products_owned: ["Apex Industrial Extruder v3", "HeavyDrive Spindle 4B"],
      total_past_complaints: 2,
      account_sla_tier: "Enterprise Gold (2h Critical Response)"
    },
    actions_already_attempted: [
      "Customer initiated emergency E-Stop button latch",
      "Cut auxiliary feeder power switch",
      "DO NOT ATTEMPT REBOOT (Thermal runaway risk)"
    ],
    evidence_collected: [
      { file_name: "smoking_spindle_photo.jpg", file_type: "image", sha256_hash: "8f4a9b2c3d1e0f8721ab45cd8912ef01", visual_observation: "Heavy soot deposition on stator flange; charring around bearing collar." },
      { file_name: "thermal_sensor_log.pdf", file_type: "pdf", sha256_hash: "45bc8901ef23456789abcdef01234567", extracted_text: "Thermistor captured spike to 118°C prior to shutdown." }
    ],
    possible_root_causes: [
      {
        root_cause_hypothesis: "Severe bearing seizure inducing stator winding thermal breakdown and insulation pyrolization.",
        confidence_score: 0.98,
        contributing_factors: ["Total lubricant dry-out", "Sustained high RPM under ambient 34°C"]
      }
    ],
    policy_checked: "Enterprise Safety & Thermal Critical Escalation Protocol ESP-01",
    reason_for_escalation: "CRITICAL SAFETY HAZARD DETECTED: Smoke, burning odor, and temperatures >110°C mandate immediate qualification of physical hardware by certified Professional Engineer.",
    recommended_next_step: "DO NOT RE-ENERGIZE. Keep equipment isolated. Dispatch PE Dr. Marcus Vance with thermal camera and replacement bearing spindle.",
    escalation_timestamp: new Date().toISOString(),
    sla_due_at: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    assigned_expert: "Dr. Marcus Vance (Dual-Certified PE Engineer)"
  };

  const handleRunScenario1 = () => {
    setScenario1Executing(true);
    setTimeout(() => {
      setScenario1Executing(false);
      setScenario1Done(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-600 animate-spin" style={{ animationDuration: "8s" }} />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Demonstration Studio</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Live Walkthrough
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Experience the core differentiators of the platform: Autonomous resolution, root-cause incident clustering, cross-domain investigation, and responsible human handoff.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveScenario("scenario3")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeScenario === "scenario3" 
                ? "bg-teal-600 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Scenario 3: 11-Step Hardware/Mechanical</span>
          </button>

          <button
            onClick={() => setActiveScenario("scenario1")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeScenario === "scenario1" 
                ? "bg-teal-600 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Scenario 1: Autonomous Support</span>
          </button>

          <button
            onClick={() => setActiveScenario("scenario2")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeScenario === "scenario2" 
                ? "bg-teal-600 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Scenario 2: Root-Cause Clustering</span>
          </button>

          <button
            onClick={() => setActiveScenario("scenario4")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeScenario === "scenario4" 
                ? "bg-rose-600 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Scenario 4: Safety Human Handoff</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SCENARIO 1: AUTONOMOUS SUPPORT                                */}
      {/* ============================================================== */}
      {activeScenario === "scenario1" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-teal-200/80 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Scenario 1 — Autonomous Support Agent (Payment Deduction)
                </h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                Action-Permission Governed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Customer Submission</span>
                <p className="text-slate-700 italic leading-relaxed">
                  &ldquo;My payment failed during subscription renewal checkout, but ₹2,000 was deducted from my bank account. Reference: TXN-PAYTM-88219.&rdquo;
                </p>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={handleRunScenario1}
                    disabled={scenario1Executing || scenario1Done}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{scenario1Executing ? "Executing Autonomous Agent..." : scenario1Done ? "Autonomous Action Completed" : "Trigger Autonomous Resolution"}</span>
                  </button>
                  {scenario1Done && (
                    <button
                      onClick={() => setScenario1Done(false)}
                      className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Governing Action Permission</span>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Permission Tier:</span>
                    <span className="text-teal-700 font-bold">low_risk_auto (Permitted &lt; ₹5,000)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Policy Citation:</span>
                    <span className="text-teal-700 font-mono text-[11px]">Billing &amp; Refund Policy v2.0 §3.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reconciliation Ledger:</span>
                    <span className="text-teal-700 font-medium">Captured / Unfulfilled Match ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Trace */}
            {(scenario1Executing || scenario1Done) && (
              <div className="bg-teal-50/40 p-5 rounded-xl border border-teal-200 space-y-3">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Autonomous Execution &amp; Context-Aware Response</span>
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-teal-300 leading-relaxed font-mono">
                    [1] Intent parsed: Payment capture timeout with verified bank debit (₹2,000.00)<br />
                    [2] Customer Context checked: Elena Vance (Vance Precision Tooling, Gold SLA)<br />
                    [3] Policy verified: ₹2,000.00 is below ₹5,000.00 autonomous ceiling<br />
                    [4] Permitted action taken: AutonomousAction(type=&quot;reconciliation_refund&quot;, ref=&quot;REV-2000-AUTO-991&quot;)<br />
                    [5] Complaint CMP-2026-1001 marked RESOLVED in 1.2s without human triage overhead
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-teal-200 text-slate-800 space-y-1 shadow-2xs">
                    <span className="text-[10px] text-teal-800 uppercase font-bold">Customer Facing Message</span>
                    <p className="text-xs leading-relaxed text-slate-700">
                      &ldquo;Hello Elena Vance. We verified against payment gateway records that the session timed out after authorization. Under company policy (§3.1), we have automatically processed an instant reconciliation refund of ₹2,000.00 to your original payment instrument (Reversal Ref: REV-2000-AUTO-991). Funds should reflect in 2-4 business hours.&rdquo;
                    </p>
                  </div>

                  <div className="pt-2">
                    <AIScoreFeedbackCard defaultRole="customer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENARIO 2: ROOT-CAUSE INVESTIGATION & INCIDENT CLUSTERING   */}
      {/* ============================================================== */}
      {activeScenario === "scenario2" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-teal-100 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Scenario 2 — Complaint Genealogy &amp; Incident Clustering (800 Complaints)
                </h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                Cluster INC-1042
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Ingested Complaint Volume</span>
                <div className="text-2xl font-bold text-slate-900">800 Cases</div>
                <p className="text-slate-500 text-[11px]">&ldquo;Refund pending&rdquo;, &ldquo;Money not returned&rdquo;, &ldquo;Stuck payment&rdquo;</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Common Incident Identified</span>
                <div className="text-2xl font-bold text-teal-700">INC-1042</div>
                <p className="text-slate-500 text-[11px]">Payment Gateway Webhook Timeout &amp; Idempotency Lockup</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Estimated Blast Radius</span>
                <div className="text-2xl font-bold text-amber-600">3 Products • 5 Regions</div>
                <p className="text-slate-500 text-[11px]">APAC, Western Europe, North America East</p>
              </div>
            </div>

            {/* Geneology Correlation Visual */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Semantic Genealogy Matching</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI Complaint Genealogy engine combined vector similarity, time correlation, and payment acquirer webhook failure events to group disparate customer phrasing into one unified organizational incident.
              </p>

              <div className="space-y-1.5 text-xs">
                {[
                  { text: "My refund is still pending after 48 hours", sim: "98% Similarity", link: "INC-1042" },
                  { text: "Payment reversed incorrectly and money hasn't returned", sim: "94% Similarity", link: "INC-1042" },
                  { text: "Checkout deducted funds but portal shows unpaid", sim: "91% Similarity", link: "INC-1042" },
                  { text: "Subscription cancelled but card was charged twice", sim: "88% Similarity", link: "INC-1042" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="text-slate-700 italic">&ldquo;{item.text}&rdquo;</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">{item.sim}</span>
                      <span className="text-[10px] font-mono text-teal-700 font-bold">{item.link}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENARIO 4: RESPONSIBLE HUMAN HANDOFF / SAFETY ESCALATION       */}
      {/* ============================================================== */}
      {activeScenario === "scenario4" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-rose-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-rose-100 pb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-600 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Scenario 4 — Responsible Human Escalation (Safety Override)
                </h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                Automated Workflow Halted
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <div className="flex items-center space-x-2 text-rose-600 font-bold uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4" />
                <span>Safety Detection Protocol Triggered</span>
              </div>
              <p>
                When a customer submits a complaint containing indicators of physical danger (&ldquo;smoke&rdquo;, &ldquo;fire&rdquo;, &ldquo;burning odor&rdquo;), the AI system <strong>DOES NOT</strong> execute generic troubleshooting loops or attempt automated fixes. It immediately ceases automated handling, upgrades severity to Critical, compiles the complete 9-point <strong>Human Handoff Summary Package</strong>, and alerts on-call licensed engineers.
              </p>
            </div>

            {/* Render Full Human Handoff Summary Component */}
            <HumanHandoffSummary handoffData={sampleSafetyHandoff} />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCENARIO 3: 11-STEP HARDWARE / MECHANICAL INVESTIGATION        */}
      {/* ============================================================== */}
      {activeScenario === "scenario3" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Step Selector Slider Bar */}
          <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Play className="w-3.5 h-3.5 text-teal-600" />
                <span>11-Step Lifecycle Progression Flow</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs text-slate-700 font-medium"
                >
                  Previous
                </button>
                <span className="text-xs font-mono text-teal-700 font-bold">Step {currentStep} of 11</span>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(11, prev + 1))}
                  disabled={currentStep === 11}
                  className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-xs text-white font-semibold shadow-xs"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Step Bubbles */}
            <div className="grid grid-cols-11 gap-1.5">
              {stepsScenario3.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`p-2 rounded-xl border text-center transition ${
                    currentStep === s.num
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm font-bold scale-105"
                      : currentStep > s.num
                      ? "bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="text-[10px] font-bold block">{s.num}</span>
                </button>
              ))}
            </div>

            {/* Current Step Title & Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Step {currentStep}: {stepsScenario3[currentStep - 1].title}
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {stepsScenario3[currentStep - 1].summary}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Step Content Views */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">Step 1: Multimodal Intake Dossier</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-teal-700 font-bold block">📷 High-Res Macro Photograph</span>
                  <div className="aspect-video rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                    [extruder_motor_housing.jpg]
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Vision inspection detected dark amber heat discoloration and grease expulsion along lower bearing seam.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-teal-600 font-bold block">📄 Maintenance Log PDF</span>
                  <div className="aspect-video rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                    [maintenance_log_apex_v3.pdf]
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    OCR parsed Log ML-9821. Bearing clearance recorded at 0.04mm. 400 operating hours logged since service.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-amber-700 font-bold block">🎙️ Acoustic Audio Recording</span>
                  <div className="aspect-video rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-mono text-[10px]">
                    [screeching_sound.wav - 2.4 kHz]
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Audio STT &amp; spectrum analysis confirmed high-pitch screeching starting at T+20min followed by emergency relay trip.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 2 && currentStep <= 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Cross-Domain Triage</span>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Primary Domain Identified</span>
                    <span className="text-sm font-bold text-teal-700">Mechanical</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Contributing Cross-Domain Areas</span>
                    <span className="text-sm font-bold text-amber-700">Electrical &amp; Industrial Controller</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Identified Root Cause Hypothesis</span>
                    <p className="text-slate-800 mt-1 font-semibold">
                      Bearing lubrication shear breakdown under continuous 1800 RPM heating stator &gt;80°C, latching thermal protection switch K1 (Fault E-42).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Complaint Genealogy Cluster</span>
                <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-teal-900">Incident INC-2047</span>
                    <span className="text-[10px] font-mono text-teal-700 font-semibold">32 Historical Matches</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Vector scan across 1,247 cases linked this complaint to 32 identical failure narratives on Apex Extruder v3 units using batch 2026-Q1 mineral grease.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <RootCauseGraph graphData={demoGraphData} />
            </div>
          )}

          {currentStep >= 6 && currentStep <= 8 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Smart Solver Matching</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700">
                      MV
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Dr. Marcus Vance (PE)</h4>
                      <p className="text-[11px] text-slate-500">14 Years Exp • PE Mechanical &amp; Electrical Engineer</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Skill Affinity Score:</span>
                      <span className="font-bold text-teal-700">98% Match</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Workload:</span>
                      <span>2 / 5 Cases (Available Capacity)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target SLA Feasibility:</span>
                      <span className="text-teal-700 font-semibold">Within 4.5h Target Window</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Solver Copilot RAG Grounding</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="p-2 rounded bg-teal-50 border border-teal-200 font-mono text-[11px] text-teal-900">
                    &ldquo;What is the torque spec and recommended replacement lubricant for Extruder v3?&rdquo;
                  </div>
                  <div className="p-3 rounded bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed space-y-1 shadow-2xs">
                    <p>
                      <strong>Cited Guidance:</strong> Apex Industrial Extruder Manual §4.2 mandates re-torquing drive flange coupling to <strong>45 Nm</strong>. Engineering Bulletin EB-2025-11 requires replacing mineral oil with <strong>ISO VG 220 synthetic grease</strong> to withstand stator operating temperatures up to 80°C.
                    </p>
                    <span className="text-[9px] text-slate-400 block pt-1">Citations: EB-2025-11, Apex Extruder Manual §4.2</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep >= 9 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-3">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Resolution &amp; Customer Verification</span>
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <p className="text-slate-700 leading-relaxed">
                      Dr. Marcus Vance flushed the drive spindle, applied ISO VG 220 synthetic lubricant, and cleared safety code E-42.
                    </p>
                    <div className="p-2.5 rounded bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-[11px]">
                      Customer Elena Vance ran a 60-minute test extrusion and confirmed full resolution with a 5/5★ rating!
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-3">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <TrendingDown className="w-4 h-4 text-teal-600" />
                    <span>Permanent Organizational Prevention Intelligence</span>
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span>Mandatory Synthetic Grease Retrofit Advisory</span>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase font-semibold">Approved</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Saves estimated 180 hours of internal engineering triaging time across 1,420 field units by eliminating repeat thermal trips.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Resolution Score & Multi-Persona Self-Assessment */}
              <AIScoreFeedbackCard defaultRole="solver" />

              <OperationalEfficiencyCard />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
