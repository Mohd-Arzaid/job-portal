"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BriefcaseBusiness,
  Search,
  Filter,
  Mail,
  Phone,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ExternalLink,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/button";
import { getApplicants, updateApplicationStatus } from "@/api-services/application.service";
import useRecruiterJobs from "@/hooks/use-recruiter-jobs";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
];

const STATUS_CONFIG = {
  Pending: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    dotColor: "bg-amber-500",
  },
  Accepted: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    dotColor: "bg-emerald-500",
  },
  Rejected: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    dotColor: "bg-red-500",
  },
};

export default function RecruiterApplicantsPage() {
  const { recruiterJobs, isLoading: isJobsLoading } = useRecruiterJobs();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch applicants for selected job
  const fetchApplicants = async (jobId) => {
    if (!jobId) return;

    setIsLoadingApplicants(true);
    try {
      const response = await getApplicants(jobId);
      setApplicants(response.data || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch applicants");
      setApplicants([]);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  // Handle job selection
  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setStatusFilter("all");
    setSearchQuery("");
  };

  // Update application status
  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
      
      toast.success(`Application ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update application status",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Fetch applicants when job is selected
  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  // Filter applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      app.applicant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get selected job details
  const selectedJob = recruiterJobs?.find((job) => job._id === selectedJobId);

  // Status counts
  const statusCounts = {
    all: applicants.length,
    Pending: applicants.filter((app) => app.status === "Pending").length,
    Accepted: applicants.filter((app) => app.status === "Accepted").length,
    Rejected: applicants.filter((app) => app.status === "Rejected").length,
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
            Job Applicants
          </h1>
          <p className="mt-1.5 max-w-[68ch] text-sm text-neutral-500">
            Review and manage applications received for your job postings.
          </p>
        </div>
      </header>

      {/* Job Selection */}
      <section className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/10">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          <BriefcaseBusiness size={18} className="text-neutral-700" />
          <span>Select Job Posting</span>
        </div>

        {isJobsLoading ? (
          <div className="flex min-h-[100px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              <p className="text-xs text-neutral-500">Loading job postings...</p>
            </div>
          </div>
        ) : recruiterJobs?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500">
              You haven't posted any jobs yet.
            </p>
            <Link href="/recruiter/jobs/create" className="mt-3 inline-block">
              <Button size="sm" leftIcon={<BriefcaseBusiness size={15} />}>
                Post Your First Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recruiterJobs.map((job) => (
              <button
                key={job._id}
                onClick={() => handleJobSelect(job._id)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition cursor-pointer",
                  selectedJobId === job._id
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50",
                )}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {job.title}
                  </h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      selectedJobId === job._id
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-700",
                    )}
                  >
                    {job.jobType}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs line-clamp-2",
                    selectedJobId === job._id
                      ? "text-white/80"
                      : "text-neutral-500",
                  )}
                >
                  {job.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Applicants Section - Show only when job is selected */}
      {selectedJobId && (
        <>
          {/* Selected Job Info Bar */}
          <section className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <BriefcaseBusiness size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-neutral-950 truncate">
                  {selectedJob?.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  {statusCounts.all} {statusCounts.all === 1 ? "application" : "applications"} received
                </p>
              </div>
            </div>
            <Link
              href={`/jobs/${selectedJobId}`}
              target="_blank"
              className="shrink-0"
            >
              <Button variant="ghost" size="sm" rightIcon={<ExternalLink size={13} />}>
                View Job
              </Button>
            </Link>
          </section>

          {/* Filters and Search */}
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => {
                const isActive = statusFilter === filter.value;
                const count = statusCounts[filter.value];
                return (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition cursor-pointer",
                      isActive
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
                    )}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 sm:w-64"
              />
            </div>
          </section>

          {/* Applicants List */}
          <section className="space-y-4">
            {isLoadingApplicants ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white p-12 shadow-sm ring-1 ring-black/10">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
                  <p className="text-xs text-neutral-500">Loading applicants...</p>
                </div>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="overflow-hidden rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-black/10">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                  <Users size={24} />
                </div>
                <h2 className="mt-4 text-base font-semibold text-neutral-950">
                  {applicants.length === 0
                    ? "No applications yet"
                    : "No matching applicants"}
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
                  {applicants.length === 0
                    ? "Applications will appear here once candidates start applying for this position."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplicants.map((application) => {
                  const applicant = application.applicant;
                  const statusConfig = STATUS_CONFIG[application.status];
                  const StatusIcon = statusConfig.icon;
                  const isUpdating = updatingStatus === application._id;

                  return (
                    <div
                      key={application._id}
                      className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/10 transition hover:ring-black/20"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        {/* Applicant Info */}
                        <div className="flex-1 space-y-4">
                          {/* Header with status */}
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                                <User size={20} />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-neutral-950">
                                  {applicant?.fullName || "Unknown Applicant"}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                  {applicant?.email && (
                                    <span className="inline-flex items-center gap-1">
                                      <Mail size={12} className="text-neutral-400" />
                                      {applicant.email}
                                    </span>
                                  )}
                                  {applicant?.phoneNumber && (
                                    <span className="inline-flex items-center gap-1">
                                      <Phone size={12} className="text-neutral-400" />
                                      {applicant.phoneNumber}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                                statusConfig.color,
                              )}
                            >
                              <span
                                className={cn(
                                  "size-1.5 rounded-full",
                                  statusConfig.dotColor,
                                )}
                              />
                              {application.status}
                            </span>
                          </div>

                          {/* Bio/Skills */}
                          {applicant?.profile?.bio && (
                            <p className="text-sm text-neutral-600 leading-relaxed">
                              {applicant.profile.bio}
                            </p>
                          )}

                          {applicant?.profile?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {applicant.profile.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Resume Link */}
                          {applicant?.profile?.resume && (
                            <a
                              href={applicant.profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 transition"
                            >
                              <FileText size={14} />
                              <span>View Resume</span>
                              <Download size={12} />
                            </a>
                          )}

                          {/* Applied Date */}
                          <div className="flex items-center gap-1 text-xs text-neutral-400">
                            <Calendar size={12} />
                            Applied {formatDate(application.createdAt)}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {application.status === "Pending" && (
                          <div className="flex gap-2 lg:flex-col lg:shrink-0">
                            <Button
                              onClick={() =>
                                handleStatusUpdate(application._id, "Accepted")
                              }
                              disabled={isUpdating}
                              variant="default"
                              size="sm"
                              leftIcon={<CheckCircle2 size={14} />}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 lg:flex-initial lg:min-w-[120px]"
                            >
                              {isUpdating ? "Updating..." : "Accept"}
                            </Button>
                            <Button
                              onClick={() =>
                                handleStatusUpdate(application._id, "Rejected")
                              }
                              disabled={isUpdating}
                              variant="outline"
                              size="sm"
                              leftIcon={<XCircle size={14} />}
                              className="flex-1 border-red-200 text-red-700 hover:bg-red-50 lg:flex-initial lg:min-w-[120px]"
                            >
                              {isUpdating ? "Updating..." : "Reject"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
