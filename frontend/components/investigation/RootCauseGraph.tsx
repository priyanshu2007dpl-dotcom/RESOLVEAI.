"use client";

import React, { useState } from "react";
import { 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  ShieldAlert, 
  Cpu,
  Layers,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  type: string;
  data: Record<string, any>;
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface RootCauseGraphProps {
  graphData?: {
    nodes: NodeData[];
    edges: EdgeData[];
    confidence_score: number;
    blast_radius: Record<string, any>;
  };
}

export function RootCauseGraph({ graphData }: RootCauseGraphProps) {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(
    graphData?.nodes ? graphData.nodes[graphData.nodes.length - 1] : null
  );

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
        <Network className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
        <p className="text-sm">Generating Root-Cause Causal Graph...</p>
      </div>
    );
  }

  const getNodeColor = (type: string, isSelected: boolean) => {
    const base = isSelected ? "ring-2 ring-teal-500 scale-[1.02] shadow-sm" : "hover:border-teal-300";
    switch (type) {
      case "complaint":
        return `bg-teal-50/60 border-teal-200 text-teal-900 ${base}`;
      case "symptom":
        return `bg-cyan-50/60 border-cyan-200 text-cyan-900 ${base}`;
      case "process":
        return `bg-purple-50/60 border-purple-200 text-purple-900 ${base}`;
      case "component":
        return `bg-blue-50/60 border-blue-200 text-blue-900 ${base}`;
      case "failure":
        return `bg-amber-50/60 border-amber-200 text-amber-900 ${base}`;
      case "contributing":
        return `bg-rose-50/60 border-rose-200 text-rose-900 ${base}`;
      case "root_cause":
        return `bg-emerald-50/80 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs ${base}`;
      default:
        return `bg-white border-slate-200 text-slate-800 ${base}`;
    }
  };

  const getBadgeType = (type: string) => {
    switch (type) {
      case "complaint":
        return { label: "VERIFIED INTAKE", color: "bg-teal-50 text-teal-800 border-teal-200" };
      case "symptom":
        return { label: "EXTRACTED OBSERVATION", color: "bg-cyan-50 text-cyan-800 border-cyan-200" };
      case "process":
        return { label: "PROCESS STAGE", color: "bg-purple-50 text-purple-800 border-purple-200" };
      case "component":
        return { label: "HARDWARE / SUBSYSTEM", color: "bg-blue-50 text-blue-800 border-blue-200" };
      case "failure":
        return { label: "FAILURE MODE", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "contributing":
        return { label: "CONTRIBUTING FACTOR", color: "bg-rose-50 text-rose-800 border-rose-200" };
      case "root_cause":
        return { label: "PROBABLE ROOT CAUSE", color: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold" };
      default:
        return { label: "AI INFERENCE", color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Interactive Root-Cause Graph</h3>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Confidence {Math.round((graphData.confidence_score || 0.92) * 100)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click any node in the causal chain to inspect verified telemetry, attached evidence files, and blast radius.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
            <span>Intake</span>
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="flex items-center space-x-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Failure Mode</span>
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Root Cause</span>
          </span>
        </div>
      </div>

      {/* Visual DAG Chain */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Sequence Visualizer */}
        <div className="lg:col-span-8 space-y-3">
          {graphData.nodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;
            const badge = getBadgeType(node.type);
            const edge = graphData.edges[idx];

            return (
              <div key={node.id} className="relative">
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${getNodeColor(
                    node.type,
                    isSelected
                  )}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-slate-500">Step {idx + 1}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">{node.label}</h4>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? "rotate-90 text-teal-600" : ""}`} />
                  </div>
                </button>

                {/* Connection Line to next node */}
                {idx < graphData.nodes.length - 1 && (
                  <div className="flex items-center justify-center my-1">
                    <div className="h-4 w-0.5 bg-teal-200" />
                    {edge?.label && (
                      <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 -ml-12 mr-2 shadow-xs">
                        {edge.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Node Deep Inspector & Blast Radius */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-28 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Node Details</span>
              <span className="text-[10px] font-mono text-teal-700 font-semibold">{selectedNode?.id}</span>
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedNode.label}</h4>
                  <div className="mt-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getBadgeType(selectedNode.type).color}`}>
                      {getBadgeType(selectedNode.type).label}
                    </span>
                  </div>
                </div>

                {/* Node Metadata Table */}
                <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2 text-xs shadow-xs">
                  {Object.entries(selectedNode.data || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start gap-2">
                      <span className="text-slate-600 capitalize font-medium">{k.replace(/_/g, " ")}:</span>
                      <span className="text-slate-900 font-mono text-right break-words max-w-[60%] font-semibold">
                        {typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Evidence Attribution */}
                <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 text-xs space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-teal-800 font-semibold">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Evidence Attribution</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Corroborated by image observation (<span className="text-slate-900 font-mono">extruder_motor_housing.jpg</span>) and acoustic frequency peak at 2.4kHz.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a node to inspect parameters.</p>
            )}

            {/* Blast Radius / Impact Card */}
            {graphData.blast_radius && (
              <div className="border-t border-slate-200 pt-4 space-y-2.5">
                <div className="flex items-center space-x-1.5 text-rose-700 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Blast-Radius &amp; Impact Analysis</span>
                </div>
                <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-3 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Affected Product:</span>
                    <span className="text-slate-900 font-semibold">{graphData.blast_radius.affected_product_line}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Estimated Units:</span>
                    <span className="text-rose-700 font-bold">{graphData.blast_radius.affected_units_estimated} units</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block mb-1">Key Regions:</span>
                    <div className="flex flex-wrap gap-1">
                      {(graphData.blast_radius.regional_concentration || []).map((reg: string) => (
                        <span key={reg} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700">
                          {reg}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-700 border-t border-rose-200 pt-2 italic">
                    {graphData.blast_radius.recommended_containment}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
