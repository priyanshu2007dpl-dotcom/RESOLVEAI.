"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context";
import { 
  Cpu, 
  Search, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  User, 
  Wrench,
  Layers,
  Download
} from "lucide-react";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { NotificationDrawer } from "./NotificationDrawer";

export function Navbar() {
  const pathname = usePathname();
  const { role, user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <header className="bg-white/90 border-b border-teal-100 backdrop-blur-md sticky top-7 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Resolve AI Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="hidden lg:block border-l border-slate-200 pl-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 block w-max">
                  AI Platform
                </span>
                <p className="text-[10px] text-slate-500 font-medium">
                  Intelligent Investigation &amp; Resolution
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/" ? "text-teal-700 bg-teal-50 font-semibold border border-teal-200/60" : "text-slate-600 hover:text-teal-700 hover:bg-slate-100"
              }`}
            >
              Overview
            </Link>
            <Link
              href="/customer"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/customer" ? "text-teal-700 bg-teal-50 font-semibold border border-teal-200" : "text-slate-600 hover:text-teal-700 hover:bg-slate-100"
              }`}
            >
              Customer
            </Link>
            <Link
              href="/solver"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/solver" ? "text-amber-800 bg-amber-50 font-semibold border border-amber-200" : "text-slate-600 hover:text-amber-700 hover:bg-slate-100"
              }`}
            >
              Solver Workspace
            </Link>
            <Link
              href="/company"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/company" ? "text-emerald-800 bg-emerald-50 font-semibold border border-emerald-200" : "text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
              }`}
            >
              Company Intel
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/admin" ? "text-purple-800 bg-purple-50 font-semibold border border-purple-200" : "text-slate-600 hover:text-purple-700 hover:bg-slate-100"
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Right Action Controls: Search, Notifications, Demo */}
          <div className="flex items-center space-x-2.5">
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 text-xs border border-slate-200 transition"
              title="Global Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline text-[11px] font-medium">Search...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 rounded bg-white text-slate-500 text-[9px] font-mono border border-slate-200 shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* In-App Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 relative transition"
                title="In-App Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              </button>
              <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* Direct Browser Download Zip Button */}
            <a
              href="/resolve-ai-platform.zip"
              download="resolve-ai-platform.zip"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-300 shadow-xs transition-all hover:scale-105"
              title="Download Entire Platform Source Code (.zip)"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Download ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </a>

            {/* Live WOW Demo Button */}
            <Link
              href="/demo"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-semibold shadow-md shadow-teal-600/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200 animate-spin" style={{ animationDuration: "6s" }} />
              <span className="hidden sm:inline">WOW Demo Studio</span>
              <span className="sm:hidden">Demo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
