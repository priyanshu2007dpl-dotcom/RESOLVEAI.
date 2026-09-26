"use client";

import React from "react";
import { useAuth } from "@/lib/context";
import { UserCheck, Shield, Wrench, Building2, Sparkles } from "lucide-react";

export function DemoPersonaBanner() {
  const { user, role, switchPersona, isLoading } = useAuth();

  const personas = [
    {
      role: "customer" as const,
      label: "Customer",
      name: "Elena Vance",
      company: "Vance Precision",
      icon: UserCheck,
      color: "hover:bg-teal-50 hover:border-teal-300 text-teal-800 bg-white border-slate-200",
      activeColor: "bg-teal-600 text-white border-teal-600 font-semibold shadow-xs"
    },
    {
      role: "solver" as const,
      label: "Solver / Expert",
      name: "Dr. Marcus Vance (PE)",
      company: "OmniSolver Network",
      icon: Wrench,
      color: "hover:bg-amber-50 hover:border-amber-300 text-amber-800 bg-white border-slate-200",
      activeColor: "bg-amber-600 text-white border-amber-600 font-semibold shadow-xs"
    },
    {
      role: "company_user" as const,
      label: "Company Client",
      name: "Apex Dynamics Corp",
      company: "Apex Operations",
      icon: Building2,
      color: "hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800 bg-white border-slate-200",
      activeColor: "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs"
    },
    {
      role: "platform_admin" as const,
      label: "Platform Admin",
      name: "SuperAdmin",
      company: "Resolve AI Core",
      icon: Shield,
      color: "hover:bg-purple-50 hover:border-purple-300 text-purple-800 bg-white border-slate-200",
      activeColor: "bg-purple-600 text-white border-purple-600 font-semibold shadow-xs"
    }
  ];

  return (
    <div className="bg-white/95 border-b border-teal-100 text-xs py-1.5 px-4 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-slate-700">
          <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="font-semibold text-slate-800">DEMO PERSONA QUICK-SWITCH:</span>
          <span className="hidden sm:inline text-slate-500">
            Active: <span className="text-teal-700 font-bold">{user?.full_name || "Elena Vance"}</span> ({role})
          </span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive = role === p.role;
            return (
              <button
                key={p.role}
                onClick={() => switchPersona(p.role)}
                disabled={isLoading}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md border transition-all duration-150 text-[11px] ${
                  isActive
                    ? p.activeColor
                    : `${p.color}`
                }`}
                title={`Switch to ${p.label} (${p.name})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
                <span className="hidden md:inline opacity-80 text-[10px]">({p.name.split(" ")[0]})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
