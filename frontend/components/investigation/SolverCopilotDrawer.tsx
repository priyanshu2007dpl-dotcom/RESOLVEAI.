"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle, 
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface SolverCopilotDrawerProps {
  complaintId: string;
}

export function SolverCopilotDrawer({ complaintId }: SolverCopilotDrawerProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "copilot"; text: string; citations?: string[] }>>([
    {
      role: "copilot",
      text: "Hello! I am your AI Solver Copilot. I have indexed this complaint's telemetry, product service manuals, and previous cluster resolutions. What would you like to verify first?",
      citations: ["Apex Extruder Technical Service Manual §4.2", "Incident Cluster INC-2047"]
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "What should I check first?",
    "What similar complaints have been resolved?",
    "What evidence do we already have?",
    "What additional information should I request?",
    "Has this happened before?"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    if (!queryText) setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await api.queryCopilot(complaintId, textToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: "copilot",
          text: res.answer,
          citations: res.citations
        }
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "copilot",
          text: `Error retrieving copilot guidance: ${e.message || "Request timed out."}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-teal-100 p-5 space-y-4 flex flex-col h-[520px] shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">AI Solver Copilot</h3>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Grounded RAG
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Cites engineering manuals, case histories, and past solutions.</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-slate-700 transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl ${
              m.role === "user"
                ? "bg-teal-600 text-white ml-8 shadow-xs"
                : "bg-slate-50 border border-slate-200 text-slate-800 mr-4 space-y-2 shadow-xs"
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-500 font-semibold">
              {m.role === "user" ? <span className="text-teal-100 font-bold">You (Solver)</span> : <span className="text-teal-700 font-bold">Resolve AI Copilot</span>}
            </div>
            <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

            {m.citations && m.citations.length > 0 && (
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 flex items-center space-x-1">
                  <Bookmark className="w-3 h-3 text-teal-600" />
                  <span>Grounding Citations:</span>
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {m.citations.map((c, cIdx) => (
                    <li key={cIdx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
            <span>Consulting engineering knowledge base and case precedent...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Copilot (e.g. 'What torque specification for spindle flange?')..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputPrompt.trim()}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </div>
    </div>
  );
}
