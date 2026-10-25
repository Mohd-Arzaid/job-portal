"use client";

import Button from "@/components/ui/button";
import useLogout from "@/hooks/use-logout";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import {
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  LogOut,
  LoaderCircle,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-neutral-500">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Profile Header */}
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user.fullName || "Profile photo"}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-neutral-700">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                {user?.fullName || "User Name"}
              </h2>

              <p className="mt-1 break-all text-sm text-neutral-500">
                {user?.email || "No email available"}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium capitalize text-neutral-700">
                <ShieldCheck size={14} />
                {user?.role || "User"} Account
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {user?.role === "student" && (
                <Link href="/applied-jobs" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    leftIcon={<FileText size={16} />}
                  >
                    My Applied Jobs
                  </Button>
                </Link>
              )}

              {user?.role === "recruiter" && (
                <Link href="/recruiter/dashboard" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    leftIcon={<BriefcaseBusiness size={16} />}
                  >
                    Recruiter Dashboard
                  </Button>
                </Link>
              )}

              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full sm:w-auto"
                leftIcon={
                  isLoggingOut ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )
                }
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Button>
            </div>
          </div>

          <div className="border-t border-neutral-200" />

          {/* Personal Information */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-neutral-950">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Your registered account details.
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="rounded-xl border border-neutral-200 p-4 transition-colors duration-200 hover:border-neutral-300">
                <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                  <UserRound size={15} />
                  Full Name
                </dt>

                <dd className="mt-3 break-words text-sm font-medium text-neutral-900">
                  {user?.fullName || "N/A"}
                </dd>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-neutral-200 p-4 transition-colors duration-200 hover:border-neutral-300">
                <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                  <Mail size={15} />
                  Email Address
                </dt>

                <dd className="mt-3 break-all text-sm font-medium text-neutral-900">
                  {user?.email || "N/A"}
                </dd>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-neutral-200 p-4 transition-colors duration-200 hover:border-neutral-300">
                <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                  <Phone size={15} />
                  Phone Number
                </dt>

                <dd className="mt-3 text-sm font-medium text-neutral-900">
                  {user?.phoneNumber || "N/A"}
                </dd>
              </div>

              {/* Account Role */}
              <div className="rounded-xl border border-neutral-200 p-4 transition-colors duration-200 hover:border-neutral-300">
                <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                  <ShieldCheck size={15} />
                  Account Role
                </dt>

                <dd className="mt-3 text-sm font-medium capitalize text-neutral-900">
                  {user?.role || "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
