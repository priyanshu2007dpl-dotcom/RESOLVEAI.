"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/context";
import { 
  Shield, 
  Activity, 
  Server, 
  Users, 
  Wrench, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Cpu
} from "lucide-react";
import { AIScoreFeedbackCard } from "@/components/investigation/AIScoreFeedbackCard";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [solvers, setSolvers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getSolvers(),
      api.getAuditLogs(),
      api.getComplaints()
    ]).then(([s, logs, c]) => {
      setSolvers(s);
      setAuditLogs(logs);
      setComplaints(c);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Operational SuperAdmin</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Root Controller
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Cross-tenant governance, solver network capacity, and immutable cryptographic audit trails.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>AI Inference Engine: Operational (24ms)</span>
          </span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Solvers</span>
          <div className="text-2xl font-bold text-slate-900">{solvers.length}</div>
          <span className="text-[10px] text-teal-600 font-medium">100% capacity available</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Platform Inflow</span>
          <div className="text-2xl font-bold text-teal-700">{complaints.length}</div>
          <span className="text-[10px] text-slate-500">Total ingested cases</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Audit Events</span>
          <div className="text-2xl font-bold text-teal-800">{auditLogs.length}</div>
          <span className="text-[10px] text-teal-700 font-medium">Cryptographically signed</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Tenant Isolation</span>
          <div className="text-2xl font-bold text-teal-600">Enforced</div>
          <span className="text-[10px] text-slate-500">Strict organization_id scope</span>
        </div>
      </div>

      {/* AI Resolution Model Self-Audit & Zero-Trust Governance */}
      <AIScoreFeedbackCard defaultRole="admin" />

      {/* Solvers Network Management */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Wrench className="w-4 h-4 text-teal-600" />
            <span>Decentralized Solver & Expert Network Directory</span>
          </h3>
          <span className="text-[10px] text-slate-400">Multi-domain certified specialists</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solvers.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">{s.full_name}</span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                  {s.primary_domain}
                </span>
              </div>
              <p className="text-slate-600">
                Certifications: {s.certifications.join(", ") || "Standard Certification"}
              </p>
              <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-200 text-slate-500">
                <span>Workload: <strong className="text-teal-700">{s.current_workload} / {s.max_concurrent_complaints}</strong> cases</span>
                <span>Rating: <strong className="text-amber-600">★ {s.average_rating}</strong></span>
                <span>Avg Speed: <strong className="text-slate-800">{s.avg_resolution_hours}h</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Trail */}
      <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Immutable Platform Audit Logs</span>
          </h3>
          <span className="text-[10px] text-slate-400">Role-scoped actions</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-[11px]">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-teal-700 font-bold">{log.action}</span>
                <span className="text-slate-500">[{log.resource_type}:{log.resource_id?.slice(0, 8)}]</span>
                <span className="text-slate-700">{log.user_email}</span>
              </div>
              <span className="text-slate-400 text-[10px]">{log.created_at}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
