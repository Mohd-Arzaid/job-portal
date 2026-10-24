import React from "react";

export default function AppliedJobsTable() {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
              Applied Jobs
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
