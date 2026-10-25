// Check if the user is already logged in
// and fetch their details when the app loads

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const initializeCompany = useCompanyStore((state) => state.initializeCompany);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user?.role === "recruiter") {
      initializeCompany();
    }
  }, [user, initializeCompany]);

  return children;
}
