"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
  Search, 
  X, 
  FileText, 
  AlertTriangle, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.globalSearch(query);
        setResults(res.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "incident":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "solver":
        return <Wrench className="w-4 h-4 text-emerald-400" />;
      case "policy":
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-teal-200/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden space-y-0">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 space-x-3 bg-slate-50/60">
          <Search className="w-5 h-5 text-teal-600" />
          <input
            type="text"
            placeholder="Search complaints, incidents, solvers, policies, error codes (e.g., E-42, Extruder, INC-2047)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-500 border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {loading && (
            <div className="text-center py-8 text-xs text-slate-500">Searching cross-domain repository...</div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching complaints, incidents, or policies found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {!loading && results.length === 0 && !query && (
            <div className="p-4 text-xs text-slate-600 space-y-2">
              <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">Quick Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {["Apex Industrial Extruder", "E-42", "INC-2047", "Dr. Marcus Vance", "Refund Policy", "Overheating", "Display"].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs transition border border-slate-200/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((res) => (
            <div
              key={res.id}
              onClick={() => handleSelect(res.link_url)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-teal-50/60 cursor-pointer transition group"
            >
              <div className="flex items-start space-x-3 truncate pr-3">
                <div className="p-2 rounded-lg bg-teal-50 group-hover:bg-teal-100/70 border border-teal-200 mt-0.5">
                  {getEntityIcon(res.entity_type)}
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">{res.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                      {res.entity_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{res.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-400 group-hover:text-teal-600">
                <span className="text-[10px] font-semibold hidden sm:inline">Open</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
