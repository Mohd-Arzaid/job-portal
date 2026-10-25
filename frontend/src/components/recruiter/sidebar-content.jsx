"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Building2,
  ExternalLink,
  LogOut,
  LoaderCircle,
} from "lucide-react";
import useLogout from "@/hooks/use-logout";
import { useAuthStore } from "@/store/auth.store";

// Clean navigation list in requested order:
// Dashboard → Company Profile → Post a Job → My Job Postings
const navigationItems = [
  {
    href: "/recruiter/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/recruiter/company",
    label: "Company Profile",
    icon: Building2,
  },
  {
    href: "/recruiter/jobs/create",
    label: "Post a Job",
    icon: PlusCircle,
  },
  {
    href: "/recruiter/jobs",
    label: "My Job Postings",
    icon: Briefcase,
  },
];

export default function SidebarContent({ pathname, closeSidebar }) {
  const { handleLogout, isLoggingOut } = useLogout();
  const user = useAuthStore((state) => state.user);

  // Strip "(Recruiter)" or "(Student)" from displayed user name
  const rawName = user?.fullName || "Recruiter";
  const displayName =
    rawName.replace(/\s*\(\s*(?:student|recruiter)\s*\)/gi, "").trim() ||
    "Recruiter";

  return (
    <div className="flex h-full flex-col justify-between bg-neutral-50 text-neutral-900">
      <div>
        {/* Recruiter Header / Logo (Badge removed) */}
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200/80 px-6">
          <Link
            href="/recruiter/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-neutral-950"
          >
            Job<span className="text-neutral-400">Portal</span>
          </Link>
        </div>

        {/* User Card */}
        {user && (
          <div className="border-b border-neutral-200/70 px-4 py-3.5">
            <div className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-neutral-200/50">
              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-300/80 bg-neutral-900 font-semibold text-white">
                {user.profile?.profilePhoto ? (
                  <img
                    src={user.profile.profilePhoto}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  displayName.charAt(0)?.toUpperCase() || "R"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {displayName}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {user.email || ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items - Clean flat list without group headers */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/recruiter/jobs"
                ? (pathname?.startsWith("/recruiter/jobs") &&
                    pathname !== "/recruiter/jobs/create") ||
                  pathname?.startsWith("/recruiter/applicants")
                : item.href !== "/recruiter/dashboard" &&
                  pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-950"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-neutral-200/80 p-4">
        <Link
          href="/"
          onClick={closeSidebar}
          className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-200/60 hover:text-neutral-950"
        >
          <ExternalLink size={17} />
          View Main Portal
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {isLoggingOut ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <LogOut size={17} />
          )}
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}
