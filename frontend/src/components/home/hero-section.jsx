"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BriefcaseBusiness, MapPin, ArrowUpRight } from "lucide-react";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const searchJobHandler = (e) => {
    e.preventDefault();

    const searchQuery = query.trim();

    if (!searchQuery) return;

    router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto flex min-h-[calc(90vh-64px)] max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Hero Content */}
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700">
            <span className="size-2 rounded-full bg-neutral-900" />
            Your next opportunity starts here
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl">
            Find the job that
            <br className="hidden sm:block" />{" "}
            <span className="text-neutral-400">moves you forward.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            Discover opportunities that match your skills, explore new career
            paths, and take the next step toward your future.
          </p>

          {/* Search Form */}
          <form
            onSubmit={searchJobHandler}
            className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg shadow-black/[0.04] sm:flex-row sm:items-center sm:rounded-full sm:pl-5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-0">
              <Search size={20} className="shrink-0 text-neutral-400" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, skills, or company"
                aria-label="Search jobs"
                className="h-12 w-full min-w-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed sm:rounded-full"
            >
              <Search size={17} />
              Search Jobs
            </button>
          </form>

          {/* Popular Searches */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="mr-1 text-neutral-500">Popular:</span>

            {["Frontend Developer", "React", "Node.js", "Full Stack"].map(
              (skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setQuery(skill)}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-950"
                >
                  {skill}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
