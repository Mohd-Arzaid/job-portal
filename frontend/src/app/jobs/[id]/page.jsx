import FrontendLayout from "@/components/layouts/frontend-layout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function JobDetailsPage() {
  return (
    <FrontendLayout>
      <div className="py-8 sm:py-12">
        {/* Back Navigation */}
        <Link
          href="/jobs"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>
      </div>
    </FrontendLayout>
  );
}
