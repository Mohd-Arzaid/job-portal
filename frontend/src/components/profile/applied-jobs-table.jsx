"use client";

import useAppliedJobs from "@/hooks/use-applied-jobs";
import Button from "../ui/button";
import {
  Briefcase,
  MapPin,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/utils/date.utils";
import Link from "next/link";

export default function AppliedJobsTable() {
  const { appliedJobs, isLoading, error, fetchAppliedJobs } = useAppliedJobs();

  // Status Badge UI Helper
  const renderStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "accepted") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
          Accepted
        </span>
      );
    }

    if (normalizedStatus === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
          <XCircle size={13} className="shrink-0 text-rose-600" />
          Rejected
        </span>
      );
    }

    // Default status: Pending
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
        <Clock size={13} className="shrink-0 text-amber-600" />
        Pending
      </span>
    );
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              Applied Jobs
            </h2>
            {!isLoading && (
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                {appliedJobs?.length || 0}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Track the status of all your submitted job applications.
          </p>
        </div>

        {/* Refresh button agar error ho ya update dekhna ho */}
        <Button
          variant="outline"
          onClick={fetchAppliedJobs}
          disabled={isLoading}
          leftIcon={
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          }
          className="self-start text-xs sm:self-auto sm:text-sm"
        >
          Refresh
        </Button>
      </div>

      {/* 1. LOADING STATE */}
      {isLoading && (
        <div className="divide-y divide-neutral-100 p-6 sm:p-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center justify-between py-4"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-neutral-100" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-neutral-100" />
                  <div className="h-3 w-28 rounded bg-neutral-100" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-neutral-100" />
            </div>
          ))}
        </div>
      )}

      {/* 2. ERROR STATE */}
      {!isLoading && error && (
        <div className="p-8 text-center sm:p-12">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertCircle size={22} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-neutral-900">
            Failed to load applied jobs
          </h3>
          <p className="mt-1 text-sm text-neutral-500">{error}</p>
          <Button variant="outline" onClick={fetchAppliedJobs} className="mt-5">
            Try Again
          </Button>
        </div>
      )}

      {/* 3. EMPTY STATE */}
      {!isLoading && !error && appliedJobs?.length === 0 && (
        <div className="p-8 text-center sm:p-14">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-500">
            <Briefcase size={24} />
          </div>
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">
            No applications yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
            You haven&apos;t applied to any jobs yet. Start exploring
            opportunities that match your skills!
          </p>
          <div className="mt-6">
            <Link href="/jobs">
              <Button leftIcon={<Briefcase size={16} />}>Explore Jobs</Button>
            </Link>
          </div>
        </div>
      )}

      {/* 4. DATA LIST / TABLE */}
      {!isLoading && !error && appliedJobs?.length > 0 && (
        <>
          {/* Desktop Table View (>= sm) */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/70 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Company & Role
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Date Applied
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70">
                {appliedJobs.map((application) => {
                  const job = application?.job;
                  const company = job?.company;
                  const companyName = company?.name || "Company";
                  const companyLogo = company?.logo;
                  const location =
                    job?.location || company?.location || "Remote";
                  return (
                    <tr
                      key={application._id}
                      className="group transition-colors duration-150 hover:bg-neutral-50/70"
                    >
                      {/* Company & Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white p-1">
                            {companyLogo ? (
                              <img
                                src={companyLogo}
                                alt={companyName}
                                className="size-full rounded-lg object-contain"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-neutral-800">
                                {companyName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-950 group-hover:text-neutral-900">
                              {job?.title || "Job Title"}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {companyName}{" "}
                              {job?.jobType ? `• ${job.jobType}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date Applied */}
                      <td className="whitespace-nowrap px-6 py-4 text-neutral-600">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                          <Calendar size={14} className="text-neutral-400" />
                          {formatDate(application.createdAt)}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="whitespace-nowrap px-6 py-4 text-neutral-600">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                          <MapPin size={14} className="text-neutral-400" />
                          <span className="truncate max-w-40">{location}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {renderStatusBadge(application.status)}
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {job?._id ? (
                          <Link
                            href={`/jobs/${job._id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 transition hover:text-neutral-950"
                          >
                            View Job
                            <ArrowUpRight size={14} />
                          </Link>
                        ) : (
                          <span className="text-xs text-neutral-400">
                            Unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (< sm) */}
          <div className="divide-y divide-neutral-200 sm:hidden">
            {appliedJobs.map((application) => {
              const job = application?.job;
              const company = job?.company;
              const companyName = company?.name || "Company";
              const companyLogo = company?.logo;
              const location = job?.location || company?.location || "Remote";

              return (
                <div key={application._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white p-1">
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="size-full rounded-lg object-contain"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-neutral-800">
                            {companyName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-neutral-950 text-sm">
                          {job?.title || "Job Title"}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          {companyName}
                        </p>
                      </div>
                    </div>

                    {renderStatusBadge(application.status)}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-neutral-400" />
                      <span>{formatDate(application.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-neutral-400" />
                      <span>{location}</span>
                    </div>

                    {job?.jobType && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
                        {job.jobType}
                      </span>
                    )}
                  </div>

                  {job?._id && (
                    <div className="mt-4 border-t border-neutral-100 pt-3 text-right">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900"
                      >
                        View Job Details
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
