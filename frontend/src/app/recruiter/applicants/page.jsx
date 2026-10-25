"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  BriefcaseBusiness,
  Search,
  Mail,
  Phone,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  LoaderCircle,
  PlusCircle,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/button";
import {
  getApplicants,
  updateApplicationStatus,
} from "@/api-services/application.service";
import useRecruiterJobs from "@/hooks/use-recruiter-jobs";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
];

function ApplicantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId");

  const { recruiterJobs, isLoading: isJobsLoading } = useRecruiterJobs();

  const [selectedJobId, setSelectedJobId] = useState(urlJobId || "");
  const [applicants, setApplicants] = useState([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Sync selected job with URL and available jobs
  useEffect(() => {
    if (urlJobId) {
      setSelectedJobId(urlJobId);
    } else if (!selectedJobId && recruiterJobs?.length > 0) {
      setSelectedJobId(recruiterJobs[0]._id);
    }
  }, [urlJobId, recruiterJobs, selectedJobId]);

  // Fetch applicants when selected job changes
  useEffect(() => {
    if (!selectedJobId) {
      setApplicants([]);
      setIsLoadingApplicants(false);
      return;
    }

    let isMounted = true;

    const loadApplicants = async () => {
      setIsLoadingApplicants(true);

      try {
        const response = await getApplicants(selectedJobId);

        if (isMounted) {
          setApplicants(response.data || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching applicants:", error);

          toast.error(
            error?.response?.data?.message || "Failed to fetch applicants",
          );

          setApplicants([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingApplicants(false);
        }
      }
    };

    loadApplicants();

    return () => {
      isMounted = false;
    };
  }, [selectedJobId]);

  // Handle job selection
  const handleJobChange = (newJobId) => {
    setSelectedJobId(newJobId);
    setStatusFilter("all");
    setSearchQuery("");

    router.replace(`/recruiter/applicants?jobId=${newJobId}`, {
      scroll: false,
    });
  };

  // Update application status
  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);

    try {
      await updateApplicationStatus(applicationId, newStatus);

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );

      toast.success(`Application marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update application status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Active job details
  const selectedJob = useMemo(() => {
    return recruiterJobs?.find((job) => job._id === selectedJobId) || null;
  }, [recruiterJobs, selectedJobId]);

  // Format salary in LPA: $6 LPA, $12 LPA
  const formatSalary = (amount) => {
    if (amount == null || amount === "") {
      return "Not specified";
    }

    const salary = Number(amount);

    if (!Number.isFinite(salary)) {
      return "Not specified";
    }

    return `${salary} LPA`;
  };

  // Format location and separate array values with commas
  const formatLocation = (location) => {
    if (!location) {
      return "Location not specified";
    }

    if (Array.isArray(location)) {
      return location
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join(", ");
    }

    // Strings should ideally be stored with commas by the job form/backend.
    return String(location).trim();
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

  // Filter applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      const applicantName = (app.applicant?.fullName || "").toLowerCase();

      const applicantEmail = (app.applicant?.email || "").toLowerCase();

      const applicantSkills = (app.applicant?.profile?.skills || [])
        .join(" ")
        .toLowerCase();

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        applicantName.includes(query) ||
        applicantEmail.includes(query) ||
        applicantSkills.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [applicants, statusFilter, searchQuery]);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: applicants.length,
      Pending: applicants.filter((a) => a.status === "Pending").length,
      Accepted: applicants.filter((a) => a.status === "Accepted").length,
      Rejected: applicants.filter((a) => a.status === "Rejected").length,
    };
  }, [applicants]);

  // Clean candidate name
  const cleanCandidateName = (name) => {
    if (!name) return "Anonymous Candidate";

    return (
      name.replace(/\s*\(\s*(?:student|recruiter)\s*\)/gi, "").trim() ||
      "Candidate"
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200/80 pb-6">
        <Link
          href="/recruiter/jobs"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={14} />
          Back to My Job Postings
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Job Applicants
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Review received candidate profiles, evaluate resumes, and make
              hiring decisions.
            </p>
          </div>

          {/* Job Selector */}
          {recruiterJobs?.length > 0 && (
            <div className="relative min-w-[240px] max-w-sm sm:self-start">
              <label
                htmlFor="job-selector"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500"
              >
                Select Job Posting
              </label>

              <div className="relative">
                <select
                  id="job-selector"
                  value={selectedJobId}
                  onChange={(e) => handleJobChange(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-neutral-900 shadow-xs outline-none transition hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100"
                >
                  {recruiterJobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title} ({job.jobType})
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {isJobsLoading ? (
        <div className="flex min-h-[300px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle size={28} className="animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-500">Loading job postings...</p>
          </div>
        </div>
      ) : recruiterJobs?.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <BriefcaseBusiness size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-neutral-950">
            No active job postings
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
            You haven't posted any jobs yet. Create a job posting to start
            receiving applications.
          </p>

          <div className="mt-6">
            <Link href="/recruiter/jobs/create">
              <Button leftIcon={<PlusCircle size={15} />}>Post a Job</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Active Job Summary */}
          {selectedJob && (
            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-5 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      {selectedJob.title}
                    </h2>

                    <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                      {selectedJob.jobType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    {selectedJob.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-neutral-400" />
                        {formatLocation(selectedJob.location)}
                      </span>
                    )}

                    {selectedJob.salary != null &&
                      selectedJob.salary !== "" && (
                        <span className="inline-flex items-center gap-1">
                          {formatSalary(selectedJob.salary)}
                        </span>
                      )}

                    <span className="inline-flex items-center gap-1">
                      <Users size={13} className="text-neutral-400" />
                      {applicants.length}{" "}
                      {applicants.length === 1 ? "applicant" : "applicants"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/jobs/${selectedJob._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:bg-neutral-50 hover:text-neutral-950 sm:self-center"
                >
                  <span>Public View</span>
                  <ExternalLink size={12} className="text-neutral-400" />
                </Link>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Filters */}
            <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100/80 p-1">
              {STATUS_FILTERS.map((filter) => {
                const isActive = statusFilter === filter.value;
                const count = statusCounts[filter.value];

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-white font-semibold text-neutral-950 shadow-xs"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <span>{filter.label}</span>

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, email, skills..."
                className="h-9 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-xs text-neutral-900 shadow-xs outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100"
              />
            </div>
          </div>

          {/* Applicants List */}
          {isLoadingApplicants ? (
            <div className="flex min-h-[260px] w-full items-center justify-center rounded-xl border border-neutral-200/80 bg-white p-8">
              <div className="flex flex-col items-center gap-2.5">
                <LoaderCircle
                  size={24}
                  className="animate-spin text-neutral-400"
                />
                <p className="text-xs text-neutral-500">
                  Loading applicants...
                </p>
              </div>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="rounded-xl border border-neutral-200/80 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                <Users size={22} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-neutral-950">
                {applicants.length === 0
                  ? "No applications received yet"
                  : "No matching candidates found"}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs text-neutral-500">
                {applicants.length === 0
                  ? "Candidate applications for this job will be listed here as soon as they apply."
                  : "Try clearing your search query or switching the status filter tab."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map((application) => {
                const applicant = application.applicant;
                const candidateName = cleanCandidateName(applicant?.fullName);
                const isUpdating = updatingId === application._id;

                return (
                  <div
                    key={application._id}
                    className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-5 shadow-xs transition hover:border-neutral-300"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Candidate Info */}
                      <div className="flex min-w-0 flex-1 items-start gap-3.5">
                        {/* Avatar */}
                        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-900 text-sm font-semibold text-white">
                          {applicant?.profile?.profilePhoto ? (
                            <img
                              src={applicant.profile.profilePhoto}
                              alt={candidateName}
                              className="size-full object-cover"
                            />
                          ) : (
                            candidateName.charAt(0)?.toUpperCase() || "C"
                          )}
                        </div>

                        {/* Name and Contact */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-neutral-950">
                              {candidateName}
                            </h3>

                            {application.status === "Pending" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                                <Clock size={11} className="text-amber-600" />
                                Pending
                              </span>
                            )}

                            {application.status === "Accepted" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                                <CheckCircle2
                                  size={11}
                                  className="text-emerald-600"
                                />
                                Accepted
                              </span>
                            )}

                            {application.status === "Rejected" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-800">
                                <XCircle size={11} className="text-red-600" />
                                Rejected
                              </span>
                            )}
                          </div>

                          {/* Email, Phone, Applied Date */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
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

                            {application.createdAt && (
                              <span className="inline-flex items-center gap-1 text-neutral-400">
                                <Calendar size={12} />
                                Applied {formatDate(application.createdAt)}
                              </span>
                            )}
                          </div>

                          {/* Bio */}
                          {applicant?.profile?.bio && (
                            <p className="line-clamp-2 pt-1 text-xs text-neutral-600">
                              {applicant.profile.bio}
                            </p>
                          )}

                          {/* Skills */}
                          {applicant?.profile?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1.5">
                              {applicant.profile.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2 pt-2 lg:pt-0">
                        {/* Resume */}
                        {applicant?.profile?.resume ? (
                          <a
                            href={applicant.profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:bg-neutral-50 hover:text-neutral-950"
                          >
                            <FileText size={13} className="text-neutral-400" />
                            <span>View Resume</span>
                            <ExternalLink
                              size={11}
                              className="text-neutral-400"
                            />
                          </a>
                        ) : (
                          <span className="px-2 text-[11px] italic text-neutral-400">
                            No resume provided
                          </span>
                        )}

                        {/* Status Buttons */}
                        <div className="flex items-center gap-1.5">
                          {application.status !== "Accepted" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(application._id, "Accepted")
                              }
                              disabled={isUpdating}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <LoaderCircle
                                  size={12}
                                  className="animate-spin"
                                />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              <span>Accept</span>
                            </button>
                          )}

                          {application.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(application._id, "Rejected")
                              }
                              disabled={isUpdating}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-xs transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <LoaderCircle
                                  size={12}
                                  className="animate-spin"
                                />
                              ) : (
                                <XCircle size={12} />
                              )}
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function RecruiterApplicantsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[300px] w-full items-center justify-center">
          <LoaderCircle size={28} className="animate-spin text-neutral-400" />
        </div>
      }
    >
      <ApplicantsContent />
    </Suspense>
  );
}
