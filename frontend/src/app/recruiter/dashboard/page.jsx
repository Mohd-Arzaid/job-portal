
"use client";

import ProtectedRoute from "@/routes/auth/protected-route";
import Button from "@/components/ui/button";
import useLogout from "@/hooks/use-logout";
import { BriefcaseBusiness, LogOut, LoaderCircle } from "lucide-react";

export default function RecruiterDashboardPage() {
  const { handleLogout, isLoggingOut } = useLogout();

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
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              leftIcon={
                isLoggingOut ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )
              }
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
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
