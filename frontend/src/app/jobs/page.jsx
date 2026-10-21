"use client";

// import { DUMMY_JOBS } from "@/components/jobs/dummy-jobs";
import FilterOptions from "@/components/jobs/filter-options";
import JobCard from "@/components/jobs/job-card";
import JobCardSkeleton from "@/components/jobs/job-card-skeleton";
import FrontendLayout from "@/components/layouts/frontend-layout";
import useJobs from "@/hooks/use-jobs";
import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";

function JobsContent() {
  // State Management

  // Params object ko stable rakhne ke liye useMemo use kar rahe h taaki har re-render par iska naya reference na bane
  // Example: Agar component re-render hota hai aur params ki value{ limit: 100 } hi hai, toh useMemo same object reference return karega
  // Isse fetchAllJobs unnecessarily recreate nahi hoga aur useEffect baar-baar run hokar unnecessary API calls nahi karega
  // Empty dependency array [] ka matlab hai ki is object ko component ke renders ke beech dobara create nahi karna hai
  const params = useMemo(() => ({ limit: 100 }), []);
  const { jobs, isLoading, error, fetchAllJobs } = useJobs(params);

  // 1. SEARCH STATE
  // Previous page se search karke aane par
  // keyword pre-filled rahega, otherwise empty rahega
  const searchParams = useSearchParams();
  const initialSearch =
    searchParams.get("search") || searchParams.get("keyword") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // 2. SELECTED JOB TYPES STATE
  // User ne kaun-kaun se job types select kiye hai
  // Example - ["Full-time", "Internship"]
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  // 3. SELECTED LOCATIONS STATE
  // User ne kaun-kaun si locations select ki hai,
  // Example - ["Delhi NCR", "Remote"]
  const [selectedLocations, setSelectedLocations] = useState([]);

  // 4. SELECTED EXPERIENCE STATE
  // User ne kaunsa experience level select kiya hai
  // Example - "1-2", "3-4", "5+"
  // String use ki kyunki ek time par sirf ek experience level select karna hai, multiple levels nahi
  // Multiple options select karne hain → useState([])
  // Sirf ek option select karna hai → useState("")
  const [selectedExperience, setSelectedExperience] = useState("");

  // 5. SELECTED SALARY STATE
  // User ne kaunsi salary range select ki hai
  // Example - "0-6", "6-15", "15-25", "25+"
  const [selectedSalary, setSelectedSalary] = useState("");

  // 6. ACTIVE FILTER STATE
  // Check karta hai ki user ne search query ya koi bhi filter select kiya hai ya nahi
  // searchQuery.trim() check karta hai ki search box mein actual text hai ya sirf extra spaces hai
  // Boolean() poore result ko true ya false mein convert
  // karta hai
  // Iska use UI mein active filters indicator, filter tags aur Clear All button dikhane ke liye hota hai.
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedJobTypes.length > 0 ||
    selectedLocations.length > 0 ||
    selectedExperience ||
    selectedSalary,
  );

  // 7. ACTIVE SORT BY STATE
  // User ne jobs ko kis order mein sort karna hai, us option ko store karna hai
  // Example: "latest", "salary-high", "salary-low", "experience"
  // setSortBy ki help se user ke selected sorting option ko update karenge
  const [sortBy, setSortBy] = useState("latest");

  // 8. MOBILE FILTERS STATE
  // Mobile screen par filters drawer open ha ya close uski state store karna ke liye
  // true  -> Drawer open hoga
  // false -> Drawer close hoga
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Handlers

  // 1. JOB TYPE SELECTION HANDLER
  // User jab kisi job type ko select kare,
  // toh agar woh pehle se selected hai, toh use array se remove karna hai
  // Agar selected nahi hai, toh use array mein add karna hai.
  // prev mein selected job types ki previous list milti hai for ex : ["Full-time"] — agar user Internship select kare,
  // toh updated list ["Full-time", "Internship"] ho jayegi
  const handleToggleJobType = (jobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType)
        ? prev.filter((type) => type !== jobType) // filter ek new array banata hai , jis mai vo jobtype jo user ne select kiya h , usko chord kar baki saare job type filter ho jayenge new array mai -> filter() mein jis element ke liye condition true hoti hai, woh new array mein rehta hai. Jiske liye false hoti hai, woh remove ho jata hai
        : [...prev, jobType],
    );
  };

  // 2. LOCATION SELECTION HANDLER
  // User jab kisi location ko select kare,
  // toh agar woh pehle se selected hai, use array se remove karna hai
  // Agar selected nahi hai, toh use array mein add karna hai
  //
  // prev mei selected locations ki previous list milti hai
  // Example: ["Delhi NCR"] — agar user Remote select kare,
  // toh updated list ["Delhi NCR", "Remote"] ho jayegi.

  const handleToggleLocation = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location],
    );
  };

  // 3. RESET FILTERS HANDLER
  // Purpose - User ke saare selected filters ko clear karna
  // Job types aur locations ko empty array mein reset karenge,
  // experience aur salary ko empty string mein reset karenge
  // Sorting ko bhi default "latest" par reset karenge

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedJobTypes([]);
    setSelectedLocations([]);
    setSelectedExperience("");
    setSelectedSalary("");
    setSortBy("latest");
  };

  // filteredJobs -> An array, not a function.
  // It stores the array returned after applying the filter and sort logic

  const filteredJobs = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return [];

    // return DUMMY_JOBS.filter((job) => {
    return jobs
      .filter((job) => {
        // 1. Keyword Search
        // purpose -> job ke title , description , company name , requirements mai searchQuery ko find krna hai

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();

          const matchesTitle = job.title?.toLowerCase().includes(query);
          const matchesDesc = job.description?.toLowerCase().includes(query);
          const matchesCompany = job.company?.name
            ?.toLowerCase()
            .includes(query);
          const matchesRequirements = job.requirements?.some((req) =>
            req.toLowerCase().includes(query),
          );

          // agar keyword title, description , company name aur requirements - in chaaro mai kahi ni mila , toh current object ko reject krna hai

          if (
            !matchesTitle &&
            !matchesDesc &&
            !matchesCompany &&
            !matchesRequirements
          ) {
            return false; // remove job becoz keyword match ni hua
          }
        }

        // 2. Job Type Filter
        if (
          selectedJobTypes.length > 0 &&
          !selectedJobTypes.includes(job.jobType)
        ) {
          return false; // Selected job type match nahi hua
        }

        // 3. Location Filter
        if (selectedLocations.length > 0) {
          const matchesLoc = selectedLocations.some((loc) => {
            return (
              job.location?.toLowerCase().includes(loc.toLowerCase()) ||
              job.company?.location?.toLowerCase().includes(loc.toLowerCase())
            );
          });

          if (!matchesLoc) return false;
        }

        // 4. Experience Level Filter
        if (selectedExperience) {
          const exp = job.experienceLevel;
          if (selectedExperience === "0" && exp !== 0) return false;
          if (selectedExperience === "1-2" && (exp < 1 || exp > 2))
            return false;
          if (selectedExperience === "3-4" && (exp < 3 || exp > 4))
            return false;
          if (selectedExperience === "5+" && exp < 5) return false;
        }

        // 5. Salary Range Filter
        if (selectedSalary) {
          const sal = job.salary;
          if (selectedSalary === "0-6" && sal > 6) return false;
          if (selectedSalary === "6-15" && (sal < 6 || sal > 15)) return false;
          if (selectedSalary === "15-25" && (sal < 15 || sal > 25))
            return false;
          if (selectedSalary === "25+" && sal < 25) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting
        // b - a → highest to lowest
        // a - b → lowest to highest

        if (sortBy === "salary-high") {
          return (b.salary || 0) - (a.salary || 0);
        }

        if (sortBy === "salary-low") {
          return (a.salary || 0) - (b.salary || 0);
        }

        if (sortBy === "experience") {
          return (b.experienceLevel || 0) - (a.experienceLevel || 0);
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [
    jobs,
    searchQuery,
    selectedJobTypes,
    selectedLocations,
    selectedExperience,
    selectedSalary,
    sortBy,
  ]);

  return (
    <FrontendLayout>
      <div className="py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700">
            <span className="size-1.5 rounded-full bg-neutral-900" />
            Explore Careers
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Find your next opportunity
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
            Discover roles that match your expertise across verified companies
            and growing teams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Box */}
          <div className="relative flex flex-1 items-center rounded-xl border border-neutral-200 bg-white px-3.5 shadow-sm transition-focus focus-within:border-neutral-900">
            <Search size={18} className="shrink-0 text-neutral-400" />

            <input
              type="text"
              value={searchQuery} // 1st state : searchQuery -> Current search value
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, skill, or company..."
              className="h-11 w-full bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="rounded-md p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button  */}
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="flex size-2 rounded-full bg-neutral-900" />
            )}
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex items-start gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden w-72 shrink-0 lg:block sticky top-20">
            <FilterOptions
              selectedJobTypes={selectedJobTypes}
              onToggleJobType={handleToggleJobType} // toggle means ek state ko badalna — select se unselect ya unselect se select
              selectedLocations={selectedLocations}
              onToggleLocation={handleToggleLocation} // Yaha sirf function pass kar rahe hai, call nahi kar rahe, isliye yahan argument pass nahi kar rahe, Child component mai function call karte waqt location ki value argument ke roop mein bhejenge
              selectedExperience={selectedExperience}
              onSelectExperience={(experience) =>
                setSelectedExperience((prev) =>
                  prev === experience ? "" : experience,
                )
              }
              // Inline function → function wahi define aur use hota hai, Separate function → pehle function define karte hain, phir prop mein pass karte hai

              selectedSalary={selectedSalary}
              onSelectSalary={(salaryRange) =>
                setSelectedSalary((prev) =>
                  prev === salaryRange ? "" : salaryRange,
                )
              }
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Mobile Filter Modal / Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex bg-neutral-950/40 backdrop-blur-xs lg:hidden">
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <h3 className="text-base font-semibold text-neutral-950">
                    Filters
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  <FilterOptions
                    className="border-none p-0 shadow-none"
                    selectedJobTypes={selectedJobTypes}
                    onToggleJobType={handleToggleJobType}
                    selectedLocations={selectedLocations}
                    onToggleLocation={handleToggleLocation}
                    selectedExperience={selectedExperience}
                    onSelectExperience={(exp) =>
                      setSelectedExperience((prev) => (prev === exp ? "" : exp))
                    }
                    selectedSalary={selectedSalary}
                    onSelectSalary={(sal) =>
                      setSelectedSalary((prev) => (prev === sal ? "" : sal))
                    }
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </div>
                <div className="border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    View {isLoading ? "..." : filteredJobs.length} Jobs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Listing Column */}
          <main className="min-w-0 flex-1">
            {/* List Header : Counts + Active Filters + Sort */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {isLoading ? (
                  <div className="h-5 w-44 animate-pulse rounded-md bg-neutral-100" />
                ) : (
                  <p className="text-sm font-medium text-neutral-500">
                    Showing{" "}
                    <span className="font-semibold text-neutral-950">
                      {filteredJobs.length}
                    </span>{" "}
                    {filteredJobs.length === 1 ? "job" : "jobs"} available
                  </p>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-500">
                  Sort by:
                </span>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-xl border border-neutral-200 bg-white py-1.5 pl-3 pr-9 text-xs font-medium text-neutral-800 outline-none transition hover:border-neutral-300 focus:border-neutral-900"
                  >
                    <option value="latest">Latest</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="experience">Experience</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-neutral-500">
                  Active filters
                </span>

                {/* Keyword Filter Tag */}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    Keyword: &quot;{searchQuery}&quot;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* Job Type Filter Tag */}
                {selectedJobTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => handleToggleJobType(type)}
                      className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {/* Location Filter Tag */}
                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => handleToggleLocation(loc)}
                      className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {/* Experience Filter Tag */}
                {selectedExperience && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    Exp: {selectedExperience} Yrs
                    <button
                      type="button"
                      onClick={() => setSelectedExperience("")}
                      className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {/* Salary Filter Tag */}
                {selectedSalary && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    Salary: {selectedSalary} LPA
                    <button
                      type="button"
                      onClick={() => setSelectedSalary("")}
                      className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-medium text-neutral-500 underline underline-offset-2 cursor-pointer hover:text-neutral-950"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Jobs Cards Feed */}

            {isLoading ? (
              // Loading Skel
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {[...Array(6)].map((_, idx) => (
                  <JobCardSkeleton key={idx} />
                ))}
              </div>
            ) : error && jobs.length === 0 ? (
              // Error State With Retry Button
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 py-16 px-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-500 shadow-xs">
                  <AlertCircle size={24} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-neutral-950">
                  Failed to load jobs
                </h3>

                <p className="mt-1.5 max-w-sm text-sm text-neutral-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => fetchAllJobs()}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            ) : filteredJobs.length > 0 ? (
              // Real Backend Jobs Feed
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-16 px-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-500">
                  <Briefcase size={24} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-neutral-950">
                  No matching jobs found
                </h3>

                <p className="mt-1.5 max-w-sm text-sm text-neutral-500">
                  We couldn&apos;t find any jobs matching your current filters.
                  Try clearing some filters or searching for something else.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </FrontendLayout>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <FrontendLayout>
          <div className="py-12 text-center text-sm text-neutral-500">
            Loading jobs...
          </div>
        </FrontendLayout>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
