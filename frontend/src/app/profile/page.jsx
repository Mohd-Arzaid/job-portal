"use client";

import FrontendLayout from "@/components/layouts/frontend-layout";
import ProtectedRoute from "@/routes/auth/protected-route";
import { useAuthStore } from "@/store/auth.store";
import { Mail, Phone, ShieldCheck, User } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute allowedRoles={["student", "recruiter"]}>
      <FrontendLayout>
        <main className="mx-auto max-w-4xl py-10">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              {user?.profile?.profilePhoto ? (
                <img
                  src={user.profile.profilePhoto}
                  alt={user.fullName}
                  className="size-24 rounded-full border border-neutral-200 object-cover shadow-sm"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-neutral-900 text-3xl font-bold text-white shadow-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-neutral-900">
                  {user?.fullName || "User Name"}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-800">
                  <ShieldCheck size={14} />
                  Role: {user?.role}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-100 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Personal Information
              </h2>

              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <User size={14} /> Full Name
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-neutral-900">
                    {user?.fullName || "N/A"}
                  </dd>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <Mail size={14} /> Email Address
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-neutral-900">
                    {user?.email || "N/A"}
                  </dd>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <Phone size={14} /> Phone Number
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-neutral-900">
                    {user?.phoneNumber || "N/A"}
                  </dd>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <ShieldCheck size={14} /> Account Role
                  </dt>
                  <dd className="mt-1 text-sm font-medium capitalize text-neutral-900">
                    {user?.role || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </FrontendLayout>
    </ProtectedRoute>
  );
}
