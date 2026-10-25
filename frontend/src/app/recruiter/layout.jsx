"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import RecruiterLayout from "@/components/layouts/recruiter-layout";

export default function RequireRecruiterLayout({ children }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "recruiter") {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "recruiter") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <p className="text-xs text-neutral-500">Verifying recruiter access...</p>
        </div>
      </div>
    );
  }

  return <RecruiterLayout>{children}</RecruiterLayout>;
}
