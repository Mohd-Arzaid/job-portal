import { cn } from "@/lib/utils";

export default function JobCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 animate-pulse",
        className,
      )}
    >
      <div className="flex flex-1 flex-col">
        {/* Top Header: Logo + Info + Bookmark */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-xl bg-neutral-100" />
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-neutral-100" />
              <div className="h-3 w-20 rounded bg-neutral-100" />
            </div>
          </div>
          <div className="size-9 rounded-lg bg-neutral-100" />
        </div>

        {/* Title and Description */}
        <div className="mt-4 space-y-2">
          <div className="h-5 w-3/4 rounded bg-neutral-100" />
          <div className="h-3.5 w-full rounded bg-neutral-100" />
          <div className="h-3.5 w-2/3 rounded bg-neutral-100" />
        </div>

        {/* Tags */}
        <div className="mt-4 flex min-h-[3.25rem] flex-wrap gap-2">
          <div className="h-6 w-20 rounded-full bg-neutral-100" />
          <div className="h-6 w-16 rounded-full bg-neutral-100" />
          <div className="h-6 w-24 rounded-full bg-neutral-100" />
        </div>

        {/* Requirements / Skill Tags */}
        <div className="mt-3.5 flex min-h-[1.75rem] gap-1.5">
          <div className="h-5 w-14 rounded bg-neutral-100" />
          <div className="h-5 w-16 rounded bg-neutral-100" />
          <div className="h-5 w-12 rounded bg-neutral-100" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
        <div className="h-4 w-20 rounded bg-neutral-100" />
        <div className="h-9 w-24 rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}

export { JobCardSkeleton };
