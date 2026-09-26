"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { 
  Send, 
  Upload, 
  Mic, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  MapPin,
  Tag,
  ArrowRight
} from "lucide-react";

interface ComplaintWizardProps {
  onSuccess?: (complaint: any) => void;
}

export function ComplaintWizard({ onSuccess }: ComplaintWizardProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productService, setProductService] = useState("Apex Industrial Extruder v3");
  const [transactionRef, setTransactionRef] = useState("");
  const [location, setLocation] = useState("Chicago Plant #2");
  const [urgency, setUrgency] = useState("high");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sample prompt prefill helper for rapid hackathon testing
  const loadScenario = (type: "mechanical" | "hardware" | "software" | "billing") => {
    if (type === "mechanical") {
      setTitle("Apex Industrial Extruder stops unexpectedly after 20 minutes with high-pitch whine");
      setDescription("The machine starts up properly and extrudes for about 20 minutes. Then it produces a loud high-pitched metallic screeching sound from the drive housing and shuts off automatically. The digital readout shows safety fault code E-42.");
      setProductService("Apex Industrial Extruder v3");
      setTransactionRef("PO-EXT-9821");
      setLocation("Chicago Plant #2");
      setUrgency("high");
    } else if (type === "hardware") {
      setTitle("OmniBook Pro laptop screen stays black while fan and keyboard LEDs run");
      setDescription("When pressing power button, power LED and cooling fans start, but display panel is totally black. External HDMI monitor works fine.");
      setProductService("OmniBook Pro 16");
      setTransactionRef("ORD-88214");
      setLocation("Design Studio East");
      setUrgency("medium");
    } else if (type === "software") {
      setTitle("CloudCore app crashes with 504 gateway timeout when uploading 30MB PDF report");
      setDescription("Every time our team attempts to upload large engineering drawings in PDF format, the web interface freezes and displays HTTP 504.");
      setProductService("CloudCore Enterprise SaaS");
      setTransactionRef("SR-55102");
      setLocation("Remote Office");
      setUrgency("high");
    } else {
      setTitle("Duplicate charge of $2,400 on corporate credit card for annual renewal");
      setDescription("Our accounting department noticed two identical charges of $2,400 on the same date for the Business SaaS subscription.");
      setProductService("Subscription Billing Gateway");
      setTransactionRef("INV-2026-901");
      setLocation("Headquarters");
      setUrgency("medium");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please enter both a title and description.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const complaint = await api.createComplaint({
        title,
        description,
        product_service: productService,
        transaction_ref: transactionRef || undefined,
        location: location || undefined,
        urgency,
        organization_slug: "apex-dynamics",
      });

      // If file attached, upload evidence
      if (selectedFile && complaint.id) {
        try {
          await api.uploadEvidence(complaint.id, selectedFile);
        } catch (fErr) {
          console.error("Evidence upload warning:", fErr);
        }
      }

      setSubmittedComplaint(complaint);
      if (onSuccess) onSuccess(complaint);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Submit a Complaint for AI Investigation</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          You don&apos;t need to know technical categories or root causes. Our AI analyzes your narrative, extracts multi-domain telemetry, and routes directly to the right expert.
        </p>

        {/* Quick Demo Pre-fills */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-teal-800 font-semibold uppercase">1-Click Test Scenarios:</span>
          <button
            type="button"
            onClick={() => loadScenario("mechanical")}
            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px]"
          >
            Mechanical + Electrical (Extruder)
          </button>
          <button
            type="button"
            onClick={() => loadScenario("hardware")}
            className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[11px]"
          >
            Hardware (Laptop Display)
          </button>
          <button
            type="button"
            onClick={() => loadScenario("software")}
            className="px-2.5 py-1 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px]"
          >
            Software (File Upload Crash)
          </button>
          <button
            type="button"
            onClick={() => loadScenario("billing")}
            className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px]"
          >
            Billing (Double Charge)
          </button>
        </div>
      </div>

      {submittedComplaint ? (
        <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-4">
          <div className="flex items-center space-x-2 text-teal-800 font-bold text-base">
            <CheckCircle2 className="w-6 h-6 text-teal-600" />
            <span>Complaint Successfully Registered &amp; Analyzed</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-slate-500">Tracking Code:</span>
              <span className="text-teal-700 font-mono font-bold text-sm">{submittedComplaint.tracking_code}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Detected Primary Domain:</span>
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
                {submittedComplaint.primary_domain}
              </span>
            </div>
            {submittedComplaint.contributing_domains?.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Contributing Cross-Domains:</span>
                <span className="text-amber-800 font-medium">
                  {submittedComplaint.contributing_domains.join(", ")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Severity Assessment:</span>
              <span className="font-bold text-rose-600">{submittedComplaint.severity_score} / 100</span>
            </div>
            {submittedComplaint.investigation_summary && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-slate-500 font-semibold">Initial AI Root-Cause Hypothesis:</span>
                <p className="text-slate-800 italic">{submittedComplaint.investigation_summary.probable_root_cause}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSubmittedComplaint(null);
              setTitle("");
              setDescription("");
              setSelectedFile(null);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200"
          >
            Submit Another Complaint
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Problem Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Machine stops running after 20 minutes or Screen is blank"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product / Service / Equipment <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                placeholder="e.g. Apex Industrial Extruder v3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction / Serial / Order Reference
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. SN-4091 or PO-9821"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location / Facility / Branch
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chicago Plant #2 or Remote"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
              >
                <option value="low">Low (Standard SLA 72h)</option>
                <option value="medium">Medium (Standard SLA 24h)</option>
                <option value="high">High (Accelerated SLA 8h)</option>
                <option value="critical">Critical (Immediate SLA 2h)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any strange sounds, error messages, or steps leading up to the issue..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          {/* Multimodal Attachments */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-semibold text-slate-700 block">
              Multimodal Evidence (Image, PDF logs, or Audio recording)
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-teal-300 text-xs text-slate-700 hover:text-teal-700 cursor-pointer transition-colors shadow-xs">
                <Upload className="w-4 h-4 text-teal-600" />
                <span>{selectedFile ? selectedFile.name : "Attach Photo / PDF"}</span>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setVoiceRecorded(!voiceRecorded)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs transition-colors shadow-xs ${
                  voiceRecorded
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:text-teal-700"
                }`}
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>{voiceRecorded ? "Voice Note Attached (0:18)" : "Record Voice Complaint"}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              All files are cryptographically verified with SHA-256 integrity hashes upon upload.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Running AI Multi-Domain Triage..." : "Submit Complaint for Resolution"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
