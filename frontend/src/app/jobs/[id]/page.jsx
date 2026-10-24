"use client";

import { getJobById } from "@/api-services/job.service";
import FrontendLayout from "@/components/layouts/frontend-layout";
import { useJobStore } from "@/store/job.store";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Users,
  ArrowLeft,
  ArrowUpRight,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  Building2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

// Helper: Human-readable time ago (e.g. "3 days ago", "1 mo ago")
function getTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInDays <= 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return diffInDays + " days ago";
  const diffInMonths = Math.floor(diffInDays / 30);
  return diffInMonths + " mo ago";
}

// Helper: Formatted full date (e.g. "24 Oct 2026")
function formatDate(dateString) {
  if (!dateString) return "Not disclosed";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobDetailsPage() {
  const router = useRouter();
  // URL se job ID nikaalo, e.g. /jobs/abc123 -> params.id = "abc123"
  const params = useParams();
  const jobId = params?.id;

  const user = useAuthStore((state) => state.user);

  const selectedJob = useJobStore((state) => state.selectedJob);
  const setSelectedJob = useJobStore((state) => state.setSelectedJob);
  const clearSelectedJob = useJobStore((state) => state.clearSelectedJob);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Job Details
  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);
    setError(null);

    try {
      // GET JOB BY ID API CALL
      const response = await getJobById(jobId);

      if (response?.data) {
        // Fetched job data store mein save karo
        setSelectedJob(response.data);
      }

      return response;
    } catch (err) {
      console.error(
        "GET JOB BY ID ERROR............",
        err?.response?.data || err?.message || err,
      );

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load job details. Please try again.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, setSelectedJob]);

  useEffect(() => {
    fetchJob();

    // Cleanup: component unmount hone par stale job data clear karo
    // Taaki next job page par purani job ka data na dikhay
    return () => {
      clearSelectedJob();
    };
  }, [fetchJob, clearSelectedJob]);

  // Derived data from selectedJob object
  const companyName = selectedJob?.company?.name || "Company";
  const companyLogo = selectedJob?.company?.logo;
  const companyLocation =
    selectedJob?.location || selectedJob?.company?.location || "Remote";

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

        {/* Loading State — Skeleton */}
        {isLoading && (
          <div className="mt-6 animate-pulse space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-5">
                  <div className="size-16 shrink-0 rounded-2xl bg-neutral-100" />
                  <div className="space-y-3">
                    <div className="h-7 w-56 rounded-lg bg-neutral-100" />
                    <div className="h-4 w-36 rounded bg-neutral-100" />
                    <div className="h-4 w-28 rounded bg-neutral-100" />
                    <div className="flex gap-2">
                      <div className="h-6 w-20 rounded-full bg-neutral-100" />
                      <div className="h-6 w-24 rounded-full bg-neutral-100" />
                    </div>
                  </div>
                </div>
                <div className="h-11 w-36 shrink-0 rounded-xl bg-neutral-100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-neutral-100 bg-white p-4">
                <div className="mb-2 h-3 w-16 rounded bg-neutral-100" />
                <div className="h-5 w-20 rounded bg-neutral-100" />
              </div>
              <div className="rounded-xl border border-neutral-100 bg-white p-4">
                <div className="mb-2 h-3 w-16 rounded bg-neutral-100" />
                <div className="h-5 w-20 rounded bg-neutral-100" />
              </div>
              <div className="rounded-xl border border-neutral-100 bg-white p-4">
                <div className="mb-2 h-3 w-16 rounded bg-neutral-100" />
                <div className="h-5 w-20 rounded bg-neutral-100" />
              </div>
              <div className="rounded-xl border border-neutral-100 bg-white p-4">
                <div className="mb-2 h-3 w-16 rounded bg-neutral-100" />
                <div className="h-5 w-20 rounded bg-neutral-100" />
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-2.5">
              <div className="mb-4 h-5 w-32 rounded bg-neutral-100" />
              <div className="h-3.5 w-full rounded bg-neutral-100" />
              <div className="h-3.5 w-5/6 rounded bg-neutral-100" />
              <div className="h-3.5 w-4/5 rounded bg-neutral-100" />
              <div className="h-3.5 w-full rounded bg-neutral-100" />
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && !selectedJob && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-500 shadow-xs">
              <AlertCircle size={24} />
            </div>
            <h2 className="mt-4 text-base font-semibold text-neutral-950">
              Failed to load job details
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-neutral-600">{error}</p>
            {/* Retry button — is page ka fetchJob directly call karta hai */}
            <button
              type="button"
              onClick={fetchJob}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {/* Main Job Details */}
        <div className="mt-6 space-y-4">
          {/* Hero Card: Company Logo + Job Title + Apply Button */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              {/* Left: Logo + Title + Meta */}
              <div className="flex items-start gap-5">
                {/* Company Logo */}
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="size-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-neutral-700">
                      {companyName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Title + Company + Location + Tags */}
                <div>
                  {/* h1 — yeh page ka main heading hai, SEO ke liye ek hi h1 hona chahiye */}
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                    {selectedJob?.title}
                  </h1>

                  {/* Company Name */}
                  <div className="mt-1.5 flex items-center gap-1.5 text-sm text-neutral-600">
                    <Building2
                      size={14}
                      className="shrink-0 text-neutral-400"
                    />
                    <span className="font-medium">{companyName}</span>
                  </div>

                  {/* Location */}
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                    <MapPin size={14} className="shrink-0" />
                    <span>{companyLocation}</span>
                  </div>

                  {/* Quick Tags: Job Type + Posted Time */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {selectedJob?.jobType && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
                        <Briefcase size={11} className="text-neutral-400" />
                        {selectedJob.jobType}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500">
                      <Clock size={11} />
                      {getTimeAgo(selectedJob?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Apply Now Button */}
              <div className="shrink-0">
                {/* Sirf recruiter ko nahi dikhega apply button */}
                {user?.role !== "recruiter" && (
                  <button
                    type="button"
                    id="apply-now-btn-top"
                    className={cn(
                      "cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 bg-neutral-900 text-white hover:bg-neutral-800",
                    )}
                  >
                    Apply Now
                    <ArrowUpRight size={16} />
                  </button>
                )}

                {/* Recruiter ke liye sirf view label */}

                {user?.role === "recruiter" && (
                  <span className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-5 text-sm font-medium text-neutral-400">
                    Recruiter View
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Row: Salary | Experience | Openings | Date Posted */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Salary */}
            <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-xs">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <IndianRupee size={12} />
                Salary
              </p>
              <p className="text-base font-semibold text-neutral-950">
                {selectedJob?.salary !== undefined
                  ? selectedJob?.salary + " LPA"
                  : "Not disclosed"}
              </p>
            </div>

            {/* Experience */}
            <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-xs">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <GraduationCap size={12} />
                Experience
              </p>
              <p className="text-base font-semibold text-neutral-950">
                {selectedJob?.experienceLevel === 0
                  ? "Fresher / Entry"
                  : selectedJob?.experienceLevel + "+ Years"}
              </p>
            </div>

            {/* Openings */}
            <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-xs">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <Users size={12} />
                Openings
              </p>
              <p className="text-base font-semibold text-neutral-950">
                {selectedJob?.position
                  ? selectedJob?.position +
                    (selectedJob?.position > 1 ? " Positions" : " Position")
                  : "Not disclosed"}
              </p>
            </div>

            {/* Date Posted */}
            <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-xs">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <CalendarDays size={12} />
                Posted On
              </p>
              <p className="text-base font-semibold text-neutral-950">
                {formatDate(selectedJob?.createdAt)}
              </p>
            </div>
          </div>

          {/* Description + Requirements Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            {/* About this role */}
            <h2 className="text-base font-semibold tracking-tight text-neutral-950">
              About this role
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600 whitespace-pre-line">
              {selectedJob?.description || "No description provided."}
            </p>

            {/* Skills / Requirements */}
            {selectedJob?.requirements?.length > 0 && (
              <>
                <div className="my-6 border-t border-neutral-100" />
                <h2 className="text-base font-semibold tracking-tight text-neutral-950">
                  Skills and Requirements
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedJob?.requirements.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bottom CTA Strip — recruiter ko nahi dikhega */}
          {user?.role !== "recruiter" && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-sm font-semibold text-neutral-950">
                  Interested in this role?
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Apply now and take the next step in your career.
                </p>
              </div>

              <button
                type="button"
                id="apply-now-btn-bottom"
                className={cn(
                  "cursor-pointer inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 bg-neutral-900 text-white hover:bg-neutral-800",
                )}
              >
                <>
                  Apply Now
                  <ArrowUpRight size={16} />
                </>
              </button>
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
}
