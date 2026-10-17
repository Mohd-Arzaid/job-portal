// Logged out: /login par redirect hoga
// Recruiter logged in: allowedRoles={["recruiter"]} par access milega
// Student logged in: allowedRoles={["student"]} par access milega
// Both roles allowed: allowedRoles={["student", "recruiter"]} par access milega
// Unauthorized role: / par redirect hoga
// Profile check ho raha hai: Tab tak page render nahi hoga

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Wait until authentication check is complete.
    if (isLoading) return;

    // Redirect to login if user is not logged in.
    if (!user) {
      router.replace("/login");
      return;
    }

    // Redirect if user role is not allowed.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, isLoading, allowedRoles, router]);

  // Hide the page while loading or redirecting
  if (isLoading || !user) {
    return null;
  }

  // Prevent access to unauthorized roles.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}
