import React from "react";
import { Cpu, ShieldCheck, Layers, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-teal-100 text-slate-600 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Resolve AI Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className="text-slate-600 mb-3 text-xs leading-relaxed">
              Every Complaint. Any Domain. One Intelligent Resolution Platform.
            </p>
            <p className="text-slate-500 text-[11px]">
              Companies manage less. We investigate, route and resolve more — at lower operational cost.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider">Universal Domains</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>Mechanical & Electrical Systems</li>
              <li>Software, IT & Cloud Networks</li>
              <li>Hardware, Electronics & Displays</li>
              <li>Appliances & Industrial Equipment</li>
              <li>Automotive, Fleet & Logistics</li>
              <li>Billing, Payments & Operational Process</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider">Platform Modules</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>Multi-Domain Semantic Classifier</li>
              <li>Root-Cause Interactive Graph DAG</li>
              <li>Operational Solver Matching Engine</li>
              <li>Counterfactual What-If Simulator</li>
              <li>Process Mining & Bottleneck Detection</li>
              <li>Cryptographic Evidence Hashing (SHA-256)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider">Commercial Transparency</h4>
            <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200/80 text-[11px] space-y-1.5">
              <div className="flex items-center space-x-1.5 text-teal-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Model-Based Estimates</span>
              </div>
              <p className="text-slate-600 leading-snug">
                Operational workload savings are projected based on standard cross-functional internal overhead vs AI triaging. Actual savings may vary.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Resolve AI Platform Inc. Enterprise B2B Complaint Resolution Infrastructure.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>SOC2 Type II Ready</span>
            <span>•</span>
            <span>Argon2 / SHA-256 Validated</span>
            <span>•</span>
            <span>Tenant-Isolated Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
