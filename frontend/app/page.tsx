"use client";

import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Layers, 
  TrendingDown, 
  Network, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  Sliders, 
  GitBranch, 
  Wrench, 
  Building2, 
  UserCheck,
  Zap,
  Globe2,
  Clock,
  ShieldAlert,
  Flame,
  BarChart3,
  FileCheck2,
  Search
} from "lucide-react";

export default function LandingPage() {
  const domains = [
    { name: "Mechanical", desc: "Vibration, bearing wear, friction, thermal shutdowns", color: "bg-amber-50/70 border-amber-200 text-amber-800" },
    { name: "Electrical", desc: "Voltage surges, breaker trips, capacitor degradation, shorts", color: "bg-yellow-50/70 border-yellow-200 text-yellow-800" },
    { name: "Hardware", desc: "Displays, ribbon harnesses, batteries, enclosures, ports", color: "bg-teal-50/70 border-teal-200 text-teal-800" },
    { name: "Software & IT", desc: "API timeouts, buffer memory leaks, crashes, sync bugs", color: "bg-cyan-50/70 border-cyan-200 text-cyan-800" },
    { name: "Networking", desc: "Packet loss, gateway timeouts, VPN tunnels, DNS errors", color: "bg-sky-50/70 border-sky-200 text-sky-800" },
    { name: "Industrial & Auto", desc: "Extruders, pumps, transmissions, PLC controllers", color: "bg-rose-50/70 border-rose-200 text-rose-800" },
    { name: "Electronics & IoT", desc: "Sensor drift, PCB soldering fractures, relay burnout", color: "bg-emerald-50/70 border-emerald-200 text-emerald-800" },
    { name: "Billing & Operations", desc: "Gateway retries, duplicate charges, delivery logs, refunds", color: "bg-purple-50/70 border-purple-200 text-purple-800" }
  ];

  return (
    <div className="space-y-20 py-4">
      {/* ============================================================== */}
      {/* HERO SECTION                                                  */}
      {/* ============================================================== */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>B2B Outsourced Complaint Investigation &amp; Resolution Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]">
          Every Complaint. Any Domain. <br />
          <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 bg-clip-text text-transparent">
            Intelligent Investigation. Human-Verified Resolution.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-slate-800">Companies focus on their business. We handle the complaint-investigation workload.</strong>
        </p>

        {/* Core Product Statement Card */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 max-w-2xl mx-auto shadow-sm space-y-2">
          <p className="text-sm font-bold text-slate-900 tracking-wide">
            &ldquo;From complaint → understanding → investigation → evidence → root cause → expert resolution → human escalation → prevention.&rdquo;
          </p>
          <p className="text-xs text-slate-500">
            Organizations outsource complaint investigation and resolution operations instead of maintaining separate support infrastructure for every problem type.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/customer"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all hover:scale-105"
          >
            <span>Submit a Complaint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/company"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs shadow-xs transition-all hover:scale-105"
          >
            <span>Register Your Organization</span>
          </Link>
          <Link
            href="/solver"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-all hover:scale-105"
          >
            <span>Join as a Solver</span>
          </Link>
        </div>

        {/* Live WOW Demo Link */}
        <div className="pt-2">
          <Link
            href="/demo"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-4"
          >
            <span>Experience the 4 Interactive WOW Demo Scenarios (Autonomous, Root Cause, Extruder, Safety)</span>
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 1: HOW IT WORKS                                       */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl border border-teal-100 p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">End-to-End Autonomous Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How Resolve AI Operates</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A continuous loop from complaint intake to permanent organizational prevention.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          {[
            { step: "1. Intake & Understand", desc: "Multimodal ingestion, intent detection, domain & entity extraction" },
            { step: "2. Context & Reason", desc: "Customer context retrieval, policy check, complaint genealogy cluster" },
            { step: "3. Investigate & Graph", desc: "Evidence chain, root-cause causal DAG, blast radius mapping" },
            { step: "4. Resolve or Escalate", desc: "Autonomous action or certified expert routing with complete context" },
            { step: "5. Learn & Prevent", desc: "Incident consolidation, prevention recommendations, policy drift tracking" }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs inline-flex items-center justify-center">
                {idx + 1}
              </span>
              <h4 className="font-bold text-slate-900 text-xs">{item.step}</h4>
              <p className="text-[11px] text-slate-600 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: TRADITIONAL VS OUTSOURCED PLATFORM MODEL             */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Business Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Traditional In-House Teams vs. Outsourced Platform Model
          </h2>
          <p className="text-xs text-slate-500">
            Why forward-thinking enterprises outsource complaint investigation operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional In-House Model */}
          <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Traditional In-House Support Overhead</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Separate customer care, technical, electrical, mechanical, and escalation teams</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>High staffing, continuous onboarding, idle capacity, and operational fixed costs</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Manual cross-department email handoffs with context lost at every step</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-600 font-bold">✕</span>
                <span>Same recurring problems repeat indefinitely without root-cause prevention</span>
              </li>
            </ul>
          </div>

          {/* Resolve AI Platform Model */}
          <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <span>Resolve AI Outsourced Infrastructure</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>One platform connects CRM/APIs, AI investigation, and certified multi-domain solver network</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Autonomous support handles routine permitted actions in seconds</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Zero context loss human handoff with full 9-point context packages</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Organizational prevention intelligence stops recurring incidents before they multiply</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTIONS 2, 3, 4: THREE PRIMARY PERSONA PORTALS               */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Three-Sided Ecosystem</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dedicated, Role-Isolated Portals</h2>
          <p className="text-xs text-slate-500">
            Strict multi-tenant security ensures customers never see private notes, and companies see only their own data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Portal */}
          <div className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 p-6 space-y-4 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For Customers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit problems effortlessly with photos, videos, acoustic recordings, and PDFs. Track live status, answer investigator questions, and confirm resolution with 5★ feedback.
            </p>
            <Link href="/customer" className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center space-x-1">
              <span>Explore Customer Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Solver Workspace */}
          <div className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 p-6 space-y-4 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For Solvers &amp; Experts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect interactive root-cause causal graphs, query the AI Copilot for torque specs and manuals, document findings, communicate with customers, and execute corrective fixes.
            </p>
            <Link href="/solver" className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1">
              <span>Explore Solver Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Company Intelligence */}
          <div className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-6 space-y-4 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">For Organizations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Outsource the investigation workload, monitor active incidents, view process mining event traces, simulate counterfactual What-If policies, and integrate B2B APIs.
            </p>
            <Link href="/company" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1">
              <span>Explore Company Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: UNIVERSAL MULTI-DOMAIN SUPPORT                     */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Universal Taxonomy</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Cross-Domain Investigation Coverage</h2>
          <p className="text-xs text-slate-500">
            Customers describe their problem naturally. Our AI automatically classifies primary and contributing cross-domain factors.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {domains.map((d, i) => (
            <div key={i} className={`p-4 rounded-xl border ${d.color} space-y-1.5 shadow-xs`}>
              <h4 className="text-xs font-bold">{d.name}</h4>
              <p className="text-[11px] opacity-80 leading-tight">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTIONS 7 & 8: AUTONOMOUS ACTIONS & RESPONSIBLE HANDOFF      */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-teal-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
            <Bot className="w-5 h-5 text-teal-600" />
            <span>Autonomous Support Agent</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Solves permitted low-risk complaints automatically using an action-permission system (e.g. ₹2,000 payment reconciliation credit, credentials resend, diagnostic guide generation).
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
            <div className="text-teal-700">✓ Checked ledger: Session timeout confirmed</div>
            <div className="text-teal-700">✓ Policy §3.1: Automated refund permitted &lt; ₹5,000</div>
            <div className="text-teal-700">✓ Reversal ref REV-2000-AUTO-991 dispatched in 1.2s</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200/80 p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
            <Flame className="w-5 h-5 text-rose-600" />
            <span>Responsible Human Escalation</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When smoke, fire, or catastrophic safety risks appear, the AI immediately stops autonomous troubleshooting and compiles a complete 9-point Context Package so human engineers never start from zero.
          </p>
          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="text-rose-700">⚠️ Safety hazard: Heavy smoke &amp; electrical odor</div>
            <div className="text-rose-700">⚠️ Autonomous troubleshooting halted immediately</div>
            <div className="text-teal-800">✓ 9-point context dossier transferred to on-call PE</div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION: PRICING ARCHITECTURE                                 */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Configurable SaaS Model</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Flexible Outsourced Pricing Architecture</h2>
          <p className="text-xs text-slate-500">
            Transparent operational tiers based on complaint intake volume, AI investigation depth, and certified solver access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Starter</h4>
              <p className="text-xs text-slate-500">For fast-growing companies outsourcing initial tier-1 &amp; software complaints.</p>
              <div className="text-2xl font-bold text-slate-900 pt-2">Volume-Based</div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li>• Up to 250 outsourced complaints/mo</li>
                <li>• Universal AI multi-domain triage</li>
                <li>• Automated low-risk resolutions</li>
                <li>• Standard 24h SLA response</li>
              </ul>
            </div>
            <Link href="/company" className="mt-4 block w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-center font-bold text-xs text-slate-800 transition">
              Select Starter
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-2xl border-2 border-teal-600 p-6 space-y-4 flex flex-col justify-between relative shadow-lg shadow-teal-600/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-600 text-white font-bold text-[10px] uppercase tracking-wider">
              Most Popular
            </span>
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Business</h4>
              <p className="text-xs text-slate-500">For mid-market enterprises with hardware, electrical, and operational workflows.</p>
              <div className="text-2xl font-bold text-teal-700 pt-2">Growth Tier</div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li>• Up to 1,500 outsourced complaints/mo</li>
                <li>• Interactive Root-Cause Causal Graph</li>
                <li>• Dedicated Solver Network dispatch</li>
                <li>• Process Mining &amp; 8h SLA response</li>
                <li>• CRM / Zendesk API webhooks</li>
              </ul>
            </div>
            <Link href="/company" className="mt-4 block w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-center font-bold text-xs text-white shadow-md shadow-teal-600/20 transition">
              Start Business Plan
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Enterprise</h4>
              <p className="text-xs text-slate-500">For global industrial, manufacturing, and mission-critical engineering organizations.</p>
              <div className="text-2xl font-bold text-purple-700 pt-2">Custom Scale</div>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li>• Unlimited complaint volume &amp; RAG Copilot</li>
                <li>• 2-Hour Critical SLA Guarantee</li>
                <li>• Counterfactual What-If Simulator</li>
                <li>• Policy Drift Detection &amp; Custom SOPs</li>
                <li>• Full REST API &amp; ERP integrations</li>
              </ul>
            </div>
            <Link href="/company" className="mt-4 block w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-center font-bold text-xs text-slate-800 transition">
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
