"use client";

import React, { useEffect, useState } from "react";
import { api, Complaint } from "@/lib/api";
import { useAuth } from "@/lib/context";
import { ComplaintWizard } from "@/components/complaint/ComplaintWizard";
import { formatTimeAgo, getDomainColor, getStatusBadge } from "@/lib/utils";
import { 
  FileText, 
  Clock, 
  Send, 
  CheckCircle, 
  Star, 
  AlertCircle, 
  RotateCcw, 
  Upload, 
  MessageSquare, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ShieldAlert
} from "lucide-react";
import { CustomerContextCard } from "@/components/investigation/CustomerContextCard";
import { AIScoreFeedbackCard } from "@/components/investigation/AIScoreFeedbackCard";

export default function CustomerPortal() {
  const { user, role, switchPersona } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [activeTab, setActiveTab] = useState<"submit" | "track">("track");
  const [loading, setLoading] = useState(true);

  // Chat message state
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  // Reopen state
  const [reopenReason, setReopenReason] = useState("");
  const [isReopening, setIsReopening] = useState(false);

  // Customer Context & Escalation state
  const [customerContext, setCustomerContext] = useState<any>(null);
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalateSuccess, setEscalateSuccess] = useState(false);

  const loadCustomerContext = async (complaintId: string) => {
    try {
      const ctx = await api.getCustomerContext(complaintId);
      setCustomerContext(ctx);
    } catch (e) {
      console.error("Error loading customer context:", e);
      setCustomerContext(null);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const list = await api.getComplaints();
      setComplaints(list);
      if (list.length > 0 && !selectedComplaint) {
        const detail = await api.getComplaint(list[0].id);
        setSelectedComplaint(detail);
        loadCustomerContext(detail.id);
      }
    } catch (e) {
      console.error("Error fetching complaints:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [role]);

  const selectCase = async (c: Complaint) => {
    try {
      const full = await api.getComplaint(c.id);
      setSelectedComplaint(full);
      loadCustomerContext(full.id);
    } catch (e) {
      console.error("Error loading complaint detail:", e);
    }
  };

  const handleEscalateToHuman = async () => {
    if (!selectedComplaint) return;
    setIsEscalating(true);
    try {
      await api.escalateComplaint(selectedComplaint.id, "Customer requested immediate human expert review via portal.");
      setEscalateSuccess(true);
      const updated = await api.getComplaint(selectedComplaint.id);
      setSelectedComplaint(updated);
      loadCustomerContext(selectedComplaint.id);
      fetchComplaints();
    } catch (e) {
      console.error("Escalation error:", e);
    } finally {
      setIsEscalating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedComplaint) return;
    setSendingMsg(true);
    try {
      await api.sendMessage(selectedComplaint.id, newMessage, false);
      setNewMessage("");
      const updated = await api.getComplaint(selectedComplaint.id);
      setSelectedComplaint(updated);
    } catch (e) {
      console.error("Send message error:", e);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleConfirmResolution = async () => {
    if (!selectedComplaint) return;
    setSubmittingFeedback(true);
    try {
      await api.submitFeedback(selectedComplaint.id, feedbackRating, feedbackComment, true);
      setFeedbackDone(true);
      const updated = await api.getComplaint(selectedComplaint.id);
      setSelectedComplaint(updated);
      fetchComplaints();
    } catch (e) {
      console.error("Feedback error:", e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReopen = async () => {
    if (!selectedComplaint || !reopenReason.trim()) return;
    setIsReopening(true);
    try {
      await api.reopenComplaint(selectedComplaint.id, reopenReason);
      setReopenReason("");
      const updated = await api.getComplaint(selectedComplaint.id);
      setSelectedComplaint(updated);
      fetchComplaints();
    } catch (e) {
      console.error("Reopen error:", e);
    } finally {
      setIsReopening(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Resolution Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit issues across any equipment, software, or process. Track investigation milestones and verify your fix.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("track")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === "track"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            My Active Complaints ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === "submit"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            + New Complaint
          </button>
        </div>
      </div>

      {activeTab === "submit" ? (
        <ComplaintWizard
          onSuccess={(c) => {
            fetchComplaints();
            selectCase(c);
            setActiveTab("track");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Complaints List Column */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider px-1">
              Your Complaints
            </h3>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                Loading complaints...
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 space-y-2">
                <p>No active complaints recorded.</p>
                <button
                  onClick={() => setActiveTab("submit")}
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold"
                >
                  Submit your first issue
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {complaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => selectCase(c)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-teal-50/70 border-teal-500 text-slate-900 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-teal-200 hover:bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs text-teal-700 font-semibold">{c.tracking_code}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(c.status)}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{c.product_service}</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className={`px-1.5 py-0.2 rounded border ${getDomainColor(c.primary_domain)}`}>
                          {c.primary_domain || "Triage Pending"}
                        </span>
                        <span>{formatTimeAgo(c.created_at)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Complaint Deep Detail View Column */}
          <div className="lg:col-span-8">
            {selectedComplaint ? (
              <div className="bg-white rounded-2xl border border-teal-100 p-6 space-y-6 shadow-sm">
                {/* Header Info */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono font-bold text-teal-700">{selectedComplaint.tracking_code}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace("_", " ")}
                      </span>
                      {selectedComplaint.status !== "escalated" && selectedComplaint.status !== "resolved" && selectedComplaint.status !== "confirmed" && (
                        <button
                          onClick={handleEscalateToHuman}
                          disabled={isEscalating}
                          className="ml-2 px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-[10px] font-semibold flex items-center space-x-1"
                        >
                          <ShieldAlert className="w-3 h-3 text-red-600" />
                          <span>{isEscalating ? "Escalating..." : "Escalate to Human"}</span>
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-slate-500">
                      Assigned Solver: <span className="text-teal-700 font-semibold">{selectedComplaint.assigned_solver_name || "AI Multi-Domain Routing..."}</span>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedComplaint.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Product: <strong className="text-slate-800">{selectedComplaint.product_service}</strong></span>
                    <span>•</span>
                    <span>Primary Domain: <strong className="text-teal-700">{selectedComplaint.primary_domain}</strong></span>
                    {selectedComplaint.location && (
                      <>
                        <span>•</span>
                        <span>Location: <strong className="text-slate-800">{selectedComplaint.location}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                {/* Escalated Alert Banner if Escalated */}
                {selectedComplaint.status === "escalated" && (
                  <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl flex items-center space-x-3 text-xs text-red-800">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    <div className="space-y-0.5">
                      <div className="font-bold text-red-900">Escalated to Senior Human Specialist</div>
                      <p className="text-[11px] text-red-700">
                        Your full historical context, problem narrative, and diagnostic dossier have been handed off to our engineering specialists with zero context loss.
                      </p>
                    </div>
                  </div>
                )}

                {/* Retained Customer Context Card */}
                {customerContext && (
                  <CustomerContextCard context={customerContext} />
                )}

                {/* Problem Description */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <span className="text-teal-800 font-semibold block uppercase text-[10px] tracking-wider">Problem Narrative</span>
                  <p className="text-slate-800 leading-relaxed">{selectedComplaint.description}</p>
                </div>

                {/* Uploaded Evidence Gallery */}
                {selectedComplaint.evidence_items && selectedComplaint.evidence_items.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-800 block">Uploaded Evidence Files:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedComplaint.evidence_items.map((ev: any) => (
                        <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="uppercase font-bold text-teal-700">{ev.file_type}</span>
                            <span className="font-mono">{ev.sha256_hash.slice(0, 8)}...</span>
                          </div>
                          <div className="font-medium text-slate-900 line-clamp-1">{ev.file_name}</div>
                          {ev.visual_observation && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">{ev.visual_observation}</p>
                          )}
                          {ev.audio_transcript && (
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">{ev.audio_transcript}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Events Stepper */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-800 block">Investigation Timeline:</span>
                  <div className="space-y-2">
                    {(selectedComplaint.events || []).map((ev: any, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span className="font-semibold text-slate-800 capitalize">{ev.actor_role}: {ev.actor_name}</span>
                            <span>{formatTimeAgo(ev.created_at)}</span>
                          </div>
                          <p className="text-slate-700">{ev.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Resolution Score & Multi-Persona Self-Assessment */}
                <AIScoreFeedbackCard
                  evaluation={selectedComplaint.ai_evaluation}
                  defaultRole="customer"
                />

                {/* Resolution Confirmation Card (If Resolved or Confirmed) */}
                {(selectedComplaint.status === "resolved" || selectedComplaint.status === "confirmed") && (
                  <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
                        <CheckCircle className="w-5 h-5 text-teal-600" />
                        <span>Resolution Provided by Expert Solver</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {selectedComplaint.resolved_at ? formatTimeAgo(selectedComplaint.resolved_at) : "Recently"}
                      </span>
                    </div>

                    {selectedComplaint.feedback ? (
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          {Array.from({ length: selectedComplaint.feedback.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="text-slate-900 font-bold ml-1">{selectedComplaint.feedback.rating}/5 Stars</span>
                        </div>
                        <p className="text-slate-700 italic">&ldquo;{selectedComplaint.feedback.comment || "Resolution confirmed."}&rdquo;</p>
                      </div>
                    ) : (
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                        <span className="font-semibold text-slate-900 block">Confirm Resolution & Rate Service:</span>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${star <= feedbackRating ? "fill-current text-yellow-500" : "text-slate-300"}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          rows={2}
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="Add comments on whether the issue was resolved satisfactorily..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleConfirmResolution}
                            disabled={submittingFeedback}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                          >
                            {submittingFeedback ? "Submitting..." : "Confirm Fix & Close"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reopen Action */}
                    <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                      <span className="text-slate-600 font-semibold">Still experiencing issues?</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          placeholder="Reason for reopening (e.g. vibration returned)..."
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          onClick={handleReopen}
                          disabled={isReopening || !reopenReason.trim()}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold whitespace-nowrap"
                        >
                          Reopen Complaint
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer-Solver Messaging Thread */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Communication with Assigned Solver</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 max-h-60 overflow-y-auto">
                    {(selectedComplaint.messages || []).map((msg: any, mIdx: number) => {
                      const isMe = msg.sender_role === "customer";
                      return (
                        <div
                          key={mIdx}
                          className={`p-3 rounded-xl text-xs space-y-1 ${
                            isMe
                              ? "bg-teal-600 text-white ml-8 shadow-xs"
                              : "bg-white border border-slate-200 mr-8 text-slate-800 shadow-xs"
                          }`}
                        >
                          <div className={`flex justify-between items-center text-[10px] ${isMe ? "text-teal-100" : "text-slate-500"} font-semibold`}>
                            <span>{msg.sender_name} ({msg.sender_role})</span>
                            <span>{formatTimeAgo(msg.created_at)}</span>
                          </div>
                          <p>{msg.message_text}</p>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Message your assigned solver..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={sendingMsg || !newMessage.trim()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                Select a complaint from the left to inspect status and communication.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
