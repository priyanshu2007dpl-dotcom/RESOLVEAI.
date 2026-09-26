"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  X
} from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getNotifications()
        .then((data) => setNotifications(data || []))
        .catch((err) => console.error("Notification load error:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error("Mark read error:", e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "safety_escalation":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "incident_detected":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "complaint_assigned":
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case "resolution_confirmed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-teal-200/80 rounded-2xl shadow-2xl z-50 overflow-hidden space-y-0 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">In-App Notifications</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications list */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {loading && (
          <div className="text-center py-6 text-xs text-slate-500">Loading alerts...</div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">No new notifications</div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 space-y-1 transition hover:bg-slate-50 ${n.read ? "opacity-70 bg-white" : "bg-teal-50/30"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                  {getIcon(n.notification_type)}
                </div>
                <span className="text-xs font-bold text-slate-900 leading-tight">{n.title}</span>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  title="Mark as read"
                  className="text-slate-400 hover:text-teal-600 p-1"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-600 pl-8 leading-relaxed">{n.message}</p>

            <div className="flex justify-between items-center pl-8 pt-1 text-[10px] text-slate-400">
              <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {n.link_url && (
                <Link
                  href={n.link_url}
                  onClick={onClose}
                  className="text-teal-600 hover:text-teal-700 hover:underline flex items-center space-x-1 font-semibold"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
