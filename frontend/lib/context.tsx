"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, User } from "./api";

interface AuthContextType {
  user: User | null;
  role: "customer" | "solver" | "company_user" | "platform_admin";
  isLoading: boolean;
  switchPersona: (role: "customer" | "solver" | "company_user" | "platform_admin") => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"customer" | "solver" | "company_user" | "platform_admin">("customer");
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    try {
      const token = api.getToken();
      if (!token) {
        // Auto-initialize demo persona as Customer
        const res = await api.switchPersona("customer");
        setUser(res.user);
        setRole(res.user.role);
      } else {
        const u = await api.getMe();
        setUser(u);
        setRole(u.role);
      }
    } catch (e) {
      console.error("Auth init fallback:", e);
      try {
        const res = await api.switchPersona("customer");
        setUser(res.user);
        setRole(res.user.role);
      } catch (inner) {
        console.error("Critical auth failure:", inner);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const switchPersona = async (newRole: "customer" | "solver" | "company_user" | "platform_admin") => {
    setIsLoading(true);
    try {
      const res = await api.switchPersona(newRole);
      setUser(res.user);
      setRole(res.user.role);
    } catch (e) {
      console.error("Failed to switch persona:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const u = await api.getMe();
      setUser(u);
      setRole(u.role);
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, switchPersona, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
