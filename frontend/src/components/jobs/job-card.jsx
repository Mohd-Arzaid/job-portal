"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Users,
  ArrowUpRight,
} from "lucide-react";

// Helper to compute human-readable time ago.
function getTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays <= 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} mo ago`;
}

export default function JobCard({ job, className }) {
  const [isSaved, setIsSaved] = useState(false);

  if (!job) return null;

  const {
    _id,
    title,
    description,
    requirements = [],
    salary,
    experienceLevel,
    location,
    jobType,
    position,
    company,
    createdAt,
  } = job;

  const companyName = company?.name || "Company";
  const companyLogo = company?.logo;
  const companyLocation = location || company?.location || "Remote";

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-black/4",
        className,
      )}
    >
      {/* Top Header: Logo + Info + Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-4">
          {/* Company Details */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-1">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="size-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-base font-semibold text-neutral-800">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
                {companyName}
              </h3>

              <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate max-w-50">{companyLocation}</span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={toggleSave}
            aria-label={isSaved ? "Remove from bookmarks" : "Save job"}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 cursor-pointer"
          >
            <Bookmark
              size={16}
              className={cn(
                "transition-colors",
                isSaved && "fill-neutral-900 text-neutral-900",
              )}
            />
          </button>
        </div>
        {/* Job Title */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700">
            {title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
            {description}
          </p>
        </div>

        {/* Job Details */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Job Type */}
          {jobType && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
              <Briefcase size={12} className="text-neutral-500" />
              {jobType}
            </span>
          )}

          {/* Salary */}
          {salary !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-900">
              <IndianRupee size={12} className="text-neutral-500" />
              {salary} LPA
            </span>
          )}

          {/* Experience */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
            {experienceLevel === 0
              ? "Fresher / Entry"
              : `${experienceLevel}+ Yrs Exp`}
          </span>

          {/* Openings */}
          {position && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
              <Users size={12} className="text-neutral-500" />
              {position} {position > 1 ? "Openings" : "Opening"}
            </span>
          )}
        </div>
        {/* Requirements / Skill Tags */}
        {requirements.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {requirements.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="rounded-md border border-neutral-100 bg-neutral-100/60 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
              >
                {skill}
              </span>
            ))}
            {requirements.length > 4 && (
              <span className="text-[11px] font-medium text-neutral-400">
                +{requirements.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Date posted + Apply Button */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <Clock size={13} />
          <span>{getTimeAgo(createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 text-xs font-medium text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            Apply Now
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
