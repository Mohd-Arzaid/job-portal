// Check if the user is already logged in
// and fetch their details when the app loads

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return children;
}
