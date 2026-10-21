import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-100", className)}
      {...props}
    />
  );
}

export { JobCardSkeleton } from "../jobs/job-card-skeleton";
