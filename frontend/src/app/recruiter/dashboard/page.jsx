"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  PlusCircle,
  Users,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useCompanyStore } from "@/store/company.store";
import useRecruiterJobs from "@/hooks/use-recruiter-jobs";

export default function RecruiterDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const company = useCompanyStore((state) => state.company);
  const { recruiterJobs, isLoading: isJobsLoading } = useRecruiterJobs();

  const rawName = user?.fullName || "Recruiter";
  const displayName =
    rawName.replace(/\s*\(\s*recruiter\s*\)/gi, "").trim() || "Recruiter";

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
            <BriefcaseBusiness size={16} />
            Recruiter Workspace
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Welcome back, {displayName}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage your job postings, candidate applications, and company profile.
          </p>
        </div>

        <Link href="/recruiter/jobs/create">
          <Button leftIcon={<PlusCircle size={16} />}>
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Quick Stats / Overview Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/10 transition hover:ring-black/20">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Jobs
            </span>
            <BriefcaseBusiness size={18} />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-950">
            {isJobsLoading ? "..." : recruiterJobs?.length || 0}
          </p>
          <Link
            href="/recruiter/jobs"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-950 transition"
          >
            View all postings <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/10 transition hover:ring-black/20">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Applicants
            </span>
            <Users size={18} />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-950">0</p>
          <p className="mt-2 text-xs text-neutral-500">Across all postings</p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/10 transition hover:ring-black/20">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Company
            </span>
            <Building2 size={18} />
          </div>
          <p className="mt-3 text-base font-semibold text-neutral-950 truncate">
            {company?.name || user?.company?.name || "Register Company"}
          </p>
          <Link
            href="/recruiter/company"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-950 transition"
          >
            Manage profile <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* Hiring Management Card */}
      <section className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/10 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
          Hiring & Recruitment
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Set up your organization, post openings, and start receiving applications from qualified candidates.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/recruiter/jobs/create">
            <Button variant="default" leftIcon={<PlusCircle size={15} />}>
              Post a Job
            </Button>
          </Link>

          <Link href="/recruiter/company">
            <Button variant="outline" leftIcon={<Building2 size={15} />}>
              Setup Company Details
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
