"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import FrontendLayout from "@/components/layouts/frontend-layout";

export default function RedirectIfAuthenticatedLayout({ children }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "recruiter") {
        router.replace("/recruiter/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
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
