"use client";

import { Check, RotateCcw } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const LOCATIONS = [
  "Remote",
  "Bengaluru, Karnataka",
  "Delhi NCR",
  "Mumbai, Maharashtra",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
];

const EXPERIENCE_LEVELS = [
  { label: "All Experience", value: "" },
  { label: "Fresher / Entry (0 Yrs)", value: "0" },
  { label: "Junior (1 - 2 Yrs)", value: "1-2" },
  { label: "Mid-level (3 - 4 Yrs)", value: "3-4" },
  { label: "Senior (5+ Yrs)", value: "5+" },
];

const SALARY_RANGES = [
  { label: "All Salaries", range: "" },
  { label: "Up to ₹6 LPA", range: "0-6" },
  { label: "₹6 - ₹15 LPA", range: "6-15" },
  { label: "₹15 - ₹25 LPA", range: "15-25" },
  { label: "₹25+ LPA", range: "25+" },
];

export default function FilterOptions({
  selectedJobTypes = [],
  selectedLocations = [],
  selectedExperience = "",
  selectedSalary = "",
  // Handlers
  onToggleJobType,
  onToggleLocation,
  onSelectExperience,
  onSelectSalary,
  onResetFilters,
  hasActiveFilters = false,
  className = "",
}) {
  return (
    <aside
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950">
            Filter Jobs
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6 pt-5">
        {/* Job Type Filter */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Job Type
          </h3>

          <div className="mt-3 space-y-2">
            {JOB_TYPES.map((jobType) => {
              const isChecked = selectedJobTypes.includes(jobType);
              return (
                <label
                  key={jobType}
                  className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
                >
                  <span className="font-medium text-neutral-700 group-hover:text-neutral-950">
                    {jobType}
                  </span>

                  <div
                    className={`flex size-4 items-center justify-center rounded border transition-colors ${
                      isChecked
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white group-hover:border-neutral-400"
                    }`}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleJobType?.(jobType)} // ?. use kiya kyunki agar onToggleJobType undefined ya null hua
                    // (just in case parent component ne child component ko function
                    // pass nahi kiya), toh function call nahi hoga aur error nahi aayega
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* Location Filter */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Location
          </h3>

          <div className="mt-3 space-y-2">
            {LOCATIONS.map((location) => {
              const isChecked = selectedLocations.includes(location);
              return (
                <label
                  key={location}
                  className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
                >
                  <span className="font-medium text-neutral-700 group-hover:text-neutral-950">
                    {location}
                  </span>

                  <div
                    className={`flex size-4 items-center justify-center rounded border transition-colors ${
                      isChecked
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white group-hover:border-neutral-400"
                    }`}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleLocation?.(location)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* Experience Level Filter */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Experience
          </h3>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {EXPERIENCE_LEVELS.map((experience) => {
              const isSelected = selectedExperience === experience.value;
              return (
                <button
                  key={experience.value}
                  type="button"
                  onClick={() => onSelectExperience?.(experience.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  {experience.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-neutral-100" />

        {/* Salary Range Filter */}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Salary (Per Annum)
          </h3>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {SALARY_RANGES.map((salary) => {
              const isSelected = selectedSalary === salary.range;
              return (
                <button
                  key={salary.range}
                  type="button"
                  onClick={() => onSelectSalary?.(salary.range)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  {salary.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
