"use client";

import Link from "next/link";
import AppliedJobsTable from "@/components/profile/applied-jobs-table";
import Button from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function AppliedJobsPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              Applied Jobs
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Review and monitor the progress of all your submitted job applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/jobs">
              <Button leftIcon={<Briefcase size={16} />}>
                Explore More Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Applied Jobs Table Component */}
        <div className="mt-6">
          <AppliedJobsTable />
        </div>
      </div>
    </main>
  );
}
