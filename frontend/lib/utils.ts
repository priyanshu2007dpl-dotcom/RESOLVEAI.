import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function getDomainColor(domain?: string) {
  switch (domain?.toLowerCase()) {
    case "mechanical":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "electrical":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "software":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "hardware":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "electronics":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "appliances":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "automotive":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "billing & payment":
    case "refunds":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

export function getStatusBadge(status?: string) {
  switch (status?.toLowerCase()) {
    case "submitted":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "analyzed":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "in_progress":
    case "investigating":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "resolved":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "confirmed":
      return "bg-teal-500/10 text-teal-400 border-teal-500/30";
    case "reopened":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
}
