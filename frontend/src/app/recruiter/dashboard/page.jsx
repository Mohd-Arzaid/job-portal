"use client";

import ProtectedRoute from "@/routes/auth/protected-route";

export default function RecruiterDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <main className="min-h-screen p-6">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

        <p className="mt-2 text-neutral-600">
          Welcome to your recruiter dashboard.
        </p>
      </main>
    </ProtectedRoute>
  );
}
