"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Building2,
  ExternalLink,
  LogOut,
  LoaderCircle,
} from "lucide-react";
import useLogout from "@/hooks/use-logout";
import { useAuthStore } from "@/store/auth.store";

const navigation = [
  {
    title: "MAIN",
    items: [
      {
        href: "/recruiter/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "JOBS & RECRUITING",
    items: [
      {
        href: "/recruiter/jobs",
        label: "My Job Postings",
        icon: Briefcase,
      },
      {
        href: "/recruiter/jobs/create",
        label: "Post a Job",
        icon: PlusCircle,
      },
      {
        href: "/recruiter/applicants",
        label: "Applicants",
        icon: Users,
      },
    ],
  },
  {
    title: "ORGANIZATION",
    items: [
      {
        href: "/recruiter/company",
        label: "Company Profile",
        icon: Building2,
      },
    ],
  },
];

export default function SidebarContent({ pathname, closeSidebar }) {
  const { handleLogout, isLoggingOut } = useLogout();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-full flex-col justify-between bg-white text-neutral-900">
      <div>
        {/* Recruiter Workspace Header */}
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6">
          <Link
            href="/recruiter/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-neutral-950"
          >
            Job<span className="text-neutral-400">Portal</span>
            <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">
              Recruiter
            </span>
          </Link>
        </div>

        {/* User Card */}
        {user && (
          <div className="border-b border-neutral-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-900 font-semibold text-white">
                {user.profile?.profilePhoto ? (
                  <img
                    src={user.profile.profilePhoto}
                    alt={user.fullName}
                    className="size-full object-cover"
                  />
                ) : (
                  user.fullName?.charAt(0)?.toUpperCase() || "R"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {user.fullName || "Recruiter"}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {user.email || ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="mb-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/recruiter/dashboard" &&
                      pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-neutral-200 p-4">
        <Link
          href="/"
          onClick={closeSidebar}
          className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
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
