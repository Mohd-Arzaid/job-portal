"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import FrontendLayout from "@/components/layouts/frontend-layout";

export default function RequireStudentLayout({ children }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "student") {
        router.replace("/recruiter/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "student") {
    return (
      <FrontendLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      </FrontendLayout>
    );
  }

  return <FrontendLayout>{children}</FrontendLayout>;
}
