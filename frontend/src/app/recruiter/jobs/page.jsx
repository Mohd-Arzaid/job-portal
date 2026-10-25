"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  PlusCircle,
  MapPin,
  Calendar,
  Building2,
  Users,
  ExternalLink,
} from "lucide-react";

import Button from "@/components/ui/button";
import useRecruiterJobs from "@/hooks/use-recruiter-jobs";
import { useCompanyStore } from "@/store/company.store";

export default function RecruiterJobsListPage() {
  const { recruiterJobs, isLoading } = useRecruiterJobs();
  const company = useCompanyStore((state) => state.company);

  // Format salary in LPA
  const formatSalary = (amount) => {
    if (amount == null || amount === "") return "Not specified";

    return `${Number(amount)} LPA`;
  };

  // Format location with commas
  const formatLocation = (location) => {
    if (!location) return "Location not specified";

    if (Array.isArray(location)) {
      return location
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join(", ");
    }

    // Handles strings like "RemoteDelhi" or "RemoteBengaluruIndia"
    if (typeof location === "string") {
      return location.trim();
    }

    return String(location);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
              My Job Postings
            </h1>

            {company?.name && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-medium text-neutral-800">
                <Building2 size={13} className="text-neutral-500" />
                {company.name}
              </span>
            )}
          </div>

          <p className="mt-1.5 max-w-[68ch] text-sm text-neutral-500">
            View, track, and manage all active job vacancies published by your
            company.
          </p>
        </div>

        <Link href="/recruiter/jobs/create">
          <Button leftIcon={<PlusCircle size={15} />}>Post a Job</Button>
        </Link>
      </header>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex min-h-75 w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
            <p className="text-xs text-neutral-500">
              Loading your job postings...
            </p>
          </div>
        </div>
      ) : recruiterJobs?.length === 0 ? (
        /* Empty State */
        <section className="overflow-hidden rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-black/10">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <BriefcaseBusiness size={24} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-neutral-950">
            No jobs posted yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
            Get started by publishing your first open position to connect with
            qualified candidates.
          </p>

          <div className="mt-6">
            <Link href="/recruiter/jobs/create">
              <Button leftIcon={<PlusCircle size={15} />}>
                Post Your First Job
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        /* Jobs Grid / List */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs font-medium text-neutral-500">
            <span>
              Showing {recruiterJobs.length}{" "}
              {recruiterJobs.length === 1 ? "posting" : "postings"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recruiterJobs.map((job) => (
              <section
                key={job._id}
                className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/10 transition hover:ring-black/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-neutral-950">
                        {job.title}
                      </h3>

                      <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-white">
                        {job.jobType}
                      </span>
                    </div>

                    <p className="line-clamp-2 max-w-2xl text-sm text-neutral-600">
                      {job.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} className="text-neutral-400" />
                        {formatLocation(job.location)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        {formatSalary(job.salary)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Users size={14} className="text-neutral-400" />
                        {job.position}{" "}
                        {job.position === 1 ? "vacancy" : "vacancies"}
                      </span>

                      {job.createdAt && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={14} className="text-neutral-400" />
                          Posted {formatDate(job.createdAt)}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {job.requirements?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.requirements.map((req, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col justify-between gap-3 pt-2 sm:items-end sm:pt-0">
                    <Link
                      href={`/jobs/${job._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 self-start text-xs font-medium text-neutral-500 transition hover:text-neutral-950 sm:self-end"
                    >
                      <span>Public View</span>
                      <ExternalLink size={13} />
                    </Link>

                    <Link href={`/recruiter/applicants?jobId=${job._id}`}>
                      <Button
                        size="sm"
                        variant="default"
                        leftIcon={<Users size={14} />}
                        className="w-full text-xs sm:w-auto"
                      >
                        View Applicants
                        {typeof job.applications?.length === "number" && (
                          <span className="ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {job.applications.length}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
