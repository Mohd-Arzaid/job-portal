// Logged out: Login/Register page dikhega
// Recruiter logged in: /recruiter/dashboard par redirect hoga
// Student logged in: / par redirect hoga
// Profile check ho raha hai: Tab tak page render nahi hoga

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function RedirectIfAuthenticated({ children }) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Wait until authentication is checked
    if (isLoading) return;

    // Redirect logged-in users based on their role
    if (user) {
      if (user.role === "recruiter") {
        router.replace("/recruiter/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  // Wait while checking authentication or redirecting
  if (isLoading || user) {
    return null;
  }

  // Show the page to logged-out users
  return children;
}
