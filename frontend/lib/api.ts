const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "solver" | "company_user" | "platform_admin";
  organization_id?: string;
  organization_name?: string;
  avatar_url?: string;
}

export interface Complaint {
  id: string;
  tracking_code: string;
  organization_id: string;
  organization_name?: string;
  customer_id: string;
  customer_name?: string;
  title: string;
  description: string;
  product_service: string;
  transaction_ref?: string;
  location?: string;
  urgency: string;
  status: string;
  primary_domain?: string;
  contributing_domains: string[];
  severity_score: number;
  sentiment_score: number;
  detected_entities: Record<string, any>;
  assigned_solver_id?: string;
  assigned_solver_name?: string;
  sla_due_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  evidence_items?: any[];
  events?: any[];
  messages?: any[];
  feedback?: any;
  investigation_summary?: any;
  ai_evaluation?: any;
  related_complaints?: any[];
}

export const api = {
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem("omni_token") : null),
  setToken: (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem("omni_token", token);
  },
  clearToken: () => {
    if (typeof window !== "undefined") localStorage.removeItem("omni_token");
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Network request failed" }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return res.json();
  },

  // Auth & Persona Switching
  async login(email: string, password = "password123") {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  },

  async switchPersona(role: "customer" | "solver" | "company_user" | "platform_admin") {
    const data = await this.request("/auth/switch-persona", {
      method: "POST",
      body: JSON.stringify({ target_role: role }),
    });
    this.setToken(data.access_token);
    return data;
  },

  async getMe(): Promise<User> {
    return this.request("/auth/me");
  },

  // Complaints
  async getComplaints(params: Record<string, string> = {}): Promise<Complaint[]> {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/complaints${qs ? `?${qs}` : ""}`);
  },

  async getComplaint(id: string): Promise<Complaint> {
    return this.request(`/complaints/${id}`);
  },

  async createComplaint(payload: any): Promise<Complaint> {
    return this.request("/complaints", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async assignSolver(complaintId: string, solverId: string) {
    return this.request(`/complaints/${complaintId}/assign`, {
      method: "POST",
      body: JSON.stringify({ solver_id: solverId }),
    });
  },

  async resolveComplaint(complaintId: string, notes: string) {
    return this.request(`/complaints/${complaintId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolution_notes: notes }),
    });
  },

  async reopenComplaint(complaintId: string, reason: string) {
    return this.request(`/complaints/${complaintId}/reopen`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  async submitFeedback(complaintId: string, rating: number, comment: string, confirmed = true) {
    return this.request(`/complaints/${complaintId}/feedback`, {
      method: "POST",
      body: JSON.stringify({ rating, comment, resolution_confirmed: confirmed }),
    });
  },

  async sendMessage(complaintId: string, messageText: string, isInternal = false) {
    return this.request(`/complaints/${complaintId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message_text: messageText, is_internal_note: isInternal }),
    });
  },

  async uploadEvidence(complaintId: string, file: File) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append("complaint_id", complaintId);
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/complaints/upload-evidence`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  // Investigations & Root Cause
  async getInvestigation(id: string) {
    return this.request(`/investigations/${id}`);
  },

  async getRootCauseGraph(investigationId: string) {
    return this.request(`/investigations/${investigationId}/graph`);
  },

  async addCorrectiveAction(investigationId: string, payload: any) {
    return this.request(`/investigations/${investigationId}/corrective-actions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getRootCauses() {
    return this.request("/investigations/root-causes/list");
  },

  async getPreventionRecommendations() {
    return this.request("/investigations/prevention-recommendations/list");
  },

  // Solvers
  async getSolvers() {
    return this.request("/solvers");
  },

  async matchSolvers(complaintId: string) {
    return this.request("/solvers/match", {
      method: "POST",
      body: JSON.stringify({ complaint_id: complaintId }),
    });
  },

  // Incidents & Process Mining
  async getIncidents() {
    return this.request("/incidents");
  },

  async getProcessMining() {
    return this.request("/incidents/process-mining");
  },

  async getSilentFailureAlerts() {
    return this.request("/incidents/silent-failure-alerts");
  },

  // Company
  async getCompanyAnalytics() {
    return this.request("/company/analytics");
  },

  async getOperationalEfficiency() {
    return this.request("/company/operational-efficiency");
  },

  async runWhatIf(payload: { response_sla_hours: number; automate_verification: boolean; preventive_maintenance_enabled: boolean; simulation_horizon_days: number }) {
    return this.request("/company/what-if", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getApiKeys() {
    return this.request("/company/api-keys");
  },

  async createApiKey(name: string) {
    return this.request("/company/api-keys", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async getWebhooks() {
    return this.request("/company/webhooks");
  },

  // AI Copilot
  async queryCopilot(complaintId: string, prompt: string) {
    return this.request("/ai/copilot", {
      method: "POST",
      body: JSON.stringify({ complaint_id: complaintId, prompt }),
    });
  },

  async getAuditLogs() {
    return this.request("/audit-logs");
  },

  // Human Escalation
  async escalateComplaint(complaintId: string, reason?: string) {
    return this.request(`/complaints/${complaintId}/escalate`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  async getHandoffPackage(complaintId: string) {
    return this.request(`/complaints/${complaintId}/handoff-package`);
  },

  // Autonomous Support
  async autonomousSolve(complaintId: string) {
    return this.request(`/complaints/${complaintId}/autonomous-solve`, {
      method: "POST",
    });
  },

  // Customer Context
  async getCustomerContext(complaintId: string) {
    return this.request(`/complaints/${complaintId}/context`);
  },

  // Multi-Agent Deliberation
  async deliberateComplaint(complaintId: string) {
    return this.request("/ai/deliberate", {
      method: "POST",
      body: JSON.stringify({ complaint_id: complaintId }),
    });
  },

  // Policies & Drift
  async getPolicies() {
    return this.request("/policies");
  },

  async getPolicyDrift() {
    return this.request("/policies/drift");
  },

  // Notifications
  async getNotifications() {
    return this.request("/notifications");
  },

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: "POST",
    });
  },

  // Global Search
  async globalSearch(q: string) {
    return this.request(`/search?q=${encodeURIComponent(q)}`);
  },

  // AI Resolution Evaluation & Multi-Persona Self-Assessment
  async getAIEvaluation(complaintId: string) {
    return this.request(`/complaints/${complaintId}/ai-evaluation`);
  },

  async generateAIEvaluation(complaintId: string) {
    return this.request(`/complaints/${complaintId}/ai-evaluation/generate`, {
      method: "POST",
    });
  },

  async getCompanyAIScores() {
    return this.request("/company/ai-quality-scores");
  },
};

