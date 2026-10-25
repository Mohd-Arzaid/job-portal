"use client";

import { useMemo } from "react";
import FrontendLayout from "@/components/layouts/frontend-layout";
import JobCard from "@/components/jobs/job-card";
import JobCardSkeleton from "@/components/jobs/job-card-skeleton";
import useJobs from "@/hooks/use-jobs";
import Button from "@/components/ui/button";
import { Briefcase, RefreshCw, AlertCircle, Compass, Sparkles } from "lucide-react";

export default function BrowseJobsPage() {
  const params = useMemo(() => ({ limit: 100 }), []);
  const { jobs, isLoading, error, fetchAllJobs } = useJobs(params);

  return (
    <FrontendLayout>
      <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                <Compass size={14} />
                Explore All Openings
              </div>

              <div className="mt-3 flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                  Browse Jobs
                </h1>
                {!isLoading && (
                  <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-0.5 text-xs font-semibold text-neutral-800">
                    {jobs?.length || 0}
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
                Discover all active career opportunities posted across verified companies. Apply directly and take your career forward.
              </p>
            </div>

            {/* Refresh Action */}
            <Button
              variant="outline"
              onClick={fetchAllJobs}
              disabled={isLoading}
              leftIcon={
                <RefreshCw
                  size={15}
                  className={isLoading ? "animate-spin" : ""}
                />
              }
              className="self-start sm:self-auto"
            >
              Refresh
            </Button>
          </div>

          {/* 1. LOADING STATE */}
          {isLoading && (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* 2. ERROR STATE */}
          {!isLoading && error && (
            <div className="mt-12 rounded-2xl border border-neutral-200 p-8 text-center sm:p-14">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <AlertCircle size={22} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">
                Failed to load jobs
              </h3>
              <p className="mt-1 text-sm text-neutral-500">{error}</p>
              <Button
                variant="outline"
                onClick={fetchAllJobs}
                className="mt-5"
                leftIcon={<RefreshCw size={15} />}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* 3. EMPTY STATE */}
          {!isLoading && !error && (!jobs || jobs.length === 0) && (
            <div className="mt-12 rounded-2xl border border-neutral-200 p-8 text-center sm:p-14">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-500">
                <Briefcase size={24} />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">
                No jobs available right now
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
                Check back later as new career opportunities are posted frequently.
              </p>
              <Button
                variant="outline"
                onClick={fetchAllJobs}
                className="mt-6"
                leftIcon={<RefreshCw size={15} />}
              >
                Refresh List
              </Button>
            </div>
          )}

          {/* 4. JOBS GRID */}
          {!isLoading && !error && jobs && jobs.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
    </FrontendLayout>
  );
}
