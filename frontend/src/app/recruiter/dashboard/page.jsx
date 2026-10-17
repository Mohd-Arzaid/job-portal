
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/routes/auth/protected-route";
import { useAuthStore } from "@/store/auth.store";
import { BriefcaseBusiness, LogOut, LoaderCircle } from "lucide-react";

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/login");
    } catch {
      // Stay on the dashboard if logout fails.
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <main className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          {/* Dashboard Header */}
          <header className="flex flex-col gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                <BriefcaseBusiness size={16} />
                Recruiter Workspace
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-neutral-500 sm:text-base">
                Manage your hiring activities from one place.
              </p>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}

              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </header>

          {/* Dashboard Content */}
          <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Welcome to your recruiter dashboard
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Your workspace for managing job postings and tracking
              applications will appear here.
            </p>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
