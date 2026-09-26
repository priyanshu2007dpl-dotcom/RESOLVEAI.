"use client";

import React, { useEffect, useState } from "react";
import { api, Complaint } from "@/lib/api";
import { useAuth } from "@/lib/context";
import { RootCauseGraph } from "@/components/investigation/RootCauseGraph";
import { SolverCopilotDrawer } from "@/components/investigation/SolverCopilotDrawer";
import { HumanHandoffSummary } from "@/components/investigation/HumanHandoffSummary";
import { CustomerContextCard } from "@/components/investigation/CustomerContextCard";
import { AIScoreFeedbackCard } from "@/components/investigation/AIScoreFeedbackCard";
import { formatTimeAgo, getDomainColor, getStatusBadge } from "@/lib/utils";
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Network, 
  FileText, 
  ShieldAlert, 
  Send, 
  Lock, 
  Sparkles, 
  Layers, 
  ArrowRight,
  User,
  Plus
} from "lucide-react";

export default function SolverWorkspace() {
  const { user, role } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [customerContext, setCustomerContext] = useState<any>(null);
  const [handoffPackage, setHandoffPackage] = useState<any>(null);
  const [showHandoff, setShowHandoff] = useState(true);
  const [loading, setLoading] = useState(true);

  // AI Evaluation & Multi-Persona Feedback State
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [aiEvalLoading, setAiEvalLoading] = useState(false);

  // Resolution Form
  const [resolutionNotes, setResolutionNotes] = useState("Flushed drive spindle and replaced with ISO VG 220 synthetic lubricant. Recalibrated K1 thermal protection relay.");
  const [isResolving, setIsResolving] = useState(false);

  // Corrective Action Form
  const [actionTitle, setActionTitle] = useState("");
  const [actionType, setActionType] = useState("Immediate Fix");
  const [isAddingAction, setIsAddingAction] = useState(false);

  // Internal Note / Message
  const [noteText, setNoteText] = useState("");
  const [isInternal, setIsInternal] = useState(true);
  const [sendingNote, setSendingNote] = useState(false);

  const fetchSolverCases = async () => {
    try {
      setLoading(true);
      const list = await api.getComplaints();
      setComplaints(list);
      if (list.length > 0) {
        loadDetail(list[0].id);
      }
    } catch (e) {
      console.error("Solver cases error:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: string) => {
    try {
      setAiEvalLoading(true);
      const full = await api.getComplaint(id);
      setSelectedComplaint(full);

      // Immediately fetch full AI feedback and quality score for this particular case
      try {
        const evalData = await api.getAIEvaluation(id);
        setAiEvaluation(evalData);
      } catch (e) {
        setAiEvaluation(full.ai_evaluation || null);
      }

      if (full.investigation_summary?.id) {
        const g = await api.getRootCauseGraph(full.investigation_summary.id);
        setGraphData(g);
      }
      try {
        const [ctx, handoff] = await Promise.all([
          api.getCustomerContext(id),
          api.getHandoffPackage(id),
        ]);
        setCustomerContext(ctx);
        setHandoffPackage(handoff);
      } catch (err) {
        console.error("Error loading context/handoff:", err);
      }
    } catch (e) {
      console.error("Detail error:", e);
    } finally {
      setAiEvalLoading(false);
    }
  };

  const handleRegenerateAIEval = async () => {
    if (!selectedComplaint) return;
    setAiEvalLoading(true);
    try {
      const updated = await api.generateAIEvaluation(selectedComplaint.id);
      setAiEvaluation(updated);
    } catch (err) {
      console.error("Error regenerating AI evaluation:", err);
    } finally {
      setAiEvalLoading(false);
    }
  };

  useEffect(() => {
    fetchSolverCases();
  }, [role]);

  const handleResolve = async () => {
    if (!selectedComplaint) return;
    setIsResolving(true);
    try {
      await api.resolveComplaint(selectedComplaint.id, resolutionNotes);
      await loadDetail(selectedComplaint.id);
      fetchSolverCases();
    } catch (e) {
      console.error("Resolve error:", e);
    } finally {
      setIsResolving(false);
    }
  };

  const handleAddCorrectiveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint?.investigation_summary?.id || !actionTitle.trim()) return;
    setIsAddingAction(true);
    try {
      await api.addCorrectiveAction(selectedComplaint.investigation_summary.id, {
        title: actionTitle,
        action_type: actionType,
        assigned_to: user?.full_name || "Assigned Solver",
      });
      setActionTitle("");
      await loadDetail(selectedComplaint.id);
    } catch (e) {
      console.error("Action error:", e);
    } finally {
      setIsAddingAction(false);
    }
  };

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !noteText.trim()) return;
    setSendingNote(true);
    try {
      await api.sendMessage(selectedComplaint.id, noteText, isInternal);
      setNoteText("");
      await loadDetail(selectedComplaint.id);
    } catch (e) {
      console.error("Send note error:", e);
    } finally {
      setSendingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Banner */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expert Solver Investigation Workspace</h1>
            <p className="text-xs text-slate-500">
              Assigned: <strong className="text-slate-800">{user?.full_name || "Dr. Marcus Vance (PE)"}</strong> • Domain: <strong className="text-teal-700">Mechanical &amp; Electrical</strong> • Active Cases: <strong className="text-emerald-700">{complaints.length}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center space-x-1 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Ready for Investigation</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Queue Left Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Your Assigned Queue</h3>
            <span className="text-[11px] text-slate-500 font-mono">{complaints.length} cases</span>
          </div>

          <div className="space-y-2">
            {complaints.map((c) => {
              const isSelected = selectedComplaint?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => loadDetail(c.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-teal-50/70 border-teal-500 text-slate-900 shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-teal-200 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs text-teal-700 font-semibold">{c.tracking_code}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-teal-600" />
                        <span>AI Feedback</span>
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(c.status)}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{c.product_service}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className={`px-1.5 py-0.2 rounded border ${getDomainColor(c.primary_domain)}`}>
                      {c.primary_domain}
                    </span>
                    <span className="flex items-center space-x-1 text-teal-700 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>SLA: ~4h remaining</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep Investigation Center Column */}
        <div className="lg:col-span-8 space-y-6">
          {selectedComplaint ? (
            <div className="space-y-6">
              {/* 9-Point Human Escalation Handoff Package */}
              {handoffPackage && (selectedComplaint.status === "escalated" || selectedComplaint.severity_score >= 80 || showHandoff) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <span>Zero-Context-Loss Escalation Package</span>
                    </span>
                    <button
                      onClick={() => setShowHandoff(!showHandoff)}
                      className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      {showHandoff ? "Minimize Package" : "Expand 9-Point Handoff Dossier"}
                    </button>
                  </div>
                  {showHandoff && <HumanHandoffSummary handoffData={handoffPackage} />}
                </div>
              )}

              {/* Case Overview Card */}
              <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-700">{selectedComplaint.tracking_code}</span>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedComplaint.title}</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded border ${getStatusBadge(selectedComplaint.status)}`}>
                      {selectedComplaint.status.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold text-rose-700 px-2.5 py-1 rounded bg-rose-50 border border-rose-200">
                      Severity: {selectedComplaint.severity_score}/100
                    </span>
                  </div>
                </div>

                {/* AI Investigation Findings Banner */}
                {selectedComplaint.investigation_summary && (
                  <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-teal-800 font-bold">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span>AI Root-Cause Investigation Hypothesis</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        Confidence {Math.round((selectedComplaint.investigation_summary.confidence_score || 0.9) * 100)}%
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium leading-relaxed">
                      {selectedComplaint.investigation_summary.probable_root_cause}
                    </p>

                    {selectedComplaint.investigation_summary.safety_verification_required && (
                      <div className="flex items-center space-x-1.5 text-amber-800 text-[11px] font-semibold pt-1">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Safety-Critical Mechanical Flag: Physical inspection of bearing flange mandatory before system re-energization.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Multimodal Evidence Previews */}
                {selectedComplaint.evidence_items && selectedComplaint.evidence_items.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-800 block">Multimodal Cryptographic Evidence:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedComplaint.evidence_items.map((ev: any) => (
                        <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs shadow-xs">
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                            <span className="text-teal-700 font-bold uppercase">{ev.file_type}</span>
                            <span>{ev.sha256_hash.slice(0, 8)}...</span>
                          </div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{ev.file_name}</div>
                          {ev.visual_observation && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">{ev.visual_observation}</p>
                          )}
                          {ev.audio_transcript && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">{ev.audio_transcript}</p>
                          )}
                          {ev.extracted_text && !ev.audio_transcript && (
                            <p className="text-[10px] text-slate-500 line-clamp-2">{ev.extracted_text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Complaints Genealogy */}
                {selectedComplaint.related_complaints && selectedComplaint.related_complaints.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Complaint Genealogy (Related Past Cases):</span>
                      <span className="text-[10px] text-slate-500">Vector &amp; Token Similarity</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedComplaint.related_complaints.map((rc: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded bg-white border border-slate-200 text-xs shadow-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-teal-700 font-semibold">{rc.tracking_code}</span>
                            <span className="text-slate-800 line-clamp-1">{rc.title}</span>
                          </div>
                          <span className="font-mono text-emerald-700 font-bold ml-2">
                            {Math.round(rc.similarity_score * 100)}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FULL AI INVESTIGATION FEEDBACK & QUALITY AUDIT (Immediate Primary Showcase on Click) */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                      Full AI Investigation Feedback &amp; Quality Audit for Case {selectedComplaint.tracking_code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {aiEvalLoading ? (
                      <span className="text-xs text-teal-600 animate-pulse flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Loading AI Feedback...
                      </span>
                    ) : (
                      <button
                        onClick={handleRegenerateAIEval}
                        className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        <span>Refresh AI Feedback</span>
                      </button>
                    )}
                  </div>
                </div>

                <AIScoreFeedbackCard
                  evaluation={aiEvaluation || selectedComplaint.ai_evaluation}
                  defaultRole="solver"
                />
              </div>

              {/* Customer Retained Context & Troubleshooting Avoidance Directives */}
              {customerContext && (
                <CustomerContextCard context={customerContext} />
              )}

              {/* Interactive Root-Cause Graph */}
              {graphData && <RootCauseGraph graphData={graphData} />}

              {/* Solver Copilot & Grounded RAG Assistant */}
              <SolverCopilotDrawer complaintId={selectedComplaint.id} />

              {/* Communication & Internal Notes */}
              <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-teal-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Communication &amp; Internal Engineering Notes
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500">Internal notes are strictly isolated from customers</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 max-h-56 overflow-y-auto text-xs">
                  {(selectedComplaint.messages || []).map((m: any, mIdx: number) => (
                    <div
                      key={mIdx}
                      className={`p-3 rounded-xl space-y-1 ${
                        m.is_internal_note
                          ? "bg-amber-50/80 border border-amber-200 text-amber-900 shadow-xs"
                          : "bg-white border border-slate-200 text-slate-800 shadow-xs"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold flex items-center space-x-1">
                          {m.is_internal_note && <Lock className="w-3 h-3 text-amber-600" />}
                          <span>{m.sender_name} ({m.sender_role})</span>
                          {m.is_internal_note && <span className="text-amber-800 font-semibold">[INTERNAL NOTE]</span>}
                        </span>
                        <span className="text-slate-400">{formatTimeAgo(m.created_at)}</span>
                      </div>
                      <p>{m.message_text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter message or internal engineering note..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-0"
                      />
                      <span>Internal Note Only (Hidden from Customer)</span>
                    </label>

                    <button
                      type="submit"
                      disabled={sendingNote || !noteText.trim()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      {sendingNote ? "Posting..." : "Post Note"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Resolution & Corrective Action Panel */}
              <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">Execute Corrective Action &amp; Complete Resolution</h3>
                  </div>
                  <span className="text-[10px] text-slate-500">Triggers customer verification flow</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Final Resolution Notes &amp; Field Verification:
                    </label>
                    <textarea
                      rows={3}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Detail the applied fix, part numbers replaced, and tests performed..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleResolve}
                      disabled={isResolving || selectedComplaint.status === "resolved"}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isResolving ? "Recording Fix..." : selectedComplaint.status === "resolved" ? "Resolved (Awaiting Confirmation)" : "Mark Complaint as Resolved"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Select an assigned case from the queue to start investigation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
