"use client";

import FrontendLayout from "@/components/layouts/frontend-layout";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SignUpSchema } from "@/schemas/auth.schema";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ImagePlus, UserRound, BriefcaseBusiness } from "lucide-react";

export default function RegisterPage() {
  const [profilePreview, setProfilePreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "student",
    },
  });

  const selectedRole = watch("role");

  // UI only: no API integration yet.
  const handleSignup = async (data) => {
    console.log("Signup form data:", data);
  };

  const handleProfileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfilePreview(URL.createObjectURL(file));
  };

  return (
    <FrontendLayout>
      <section className="flex min-h-[75vh] items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base">
              Join JobPortal and take the next step in your career.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleSignup)}
            className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-black/[0.02] sm:p-8"
          >
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              {...register("fullName")}
              error={errors.fullName?.message}
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              autoComplete="tel"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Account Type */}
            <div>
              <label className="mb-3 block text-sm font-medium text-neutral-800">
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Student */}
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "student", {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  aria-pressed={selectedRole === "student"}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selectedRole === "student"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      selectedRole === "student"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Student
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">Find a job</p>
                  </div>
                </button>

                {/* Recruiter */}
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "recruiter", {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  aria-pressed={selectedRole === "recruiter"}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selectedRole === "recruiter"
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      selectedRole === "recruiter"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Recruiter
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">Hire talent</p>
                  </div>
                </button>
              </div>

              {errors.role && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Profile Picture */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800">
                Profile Picture
                <span className="ml-1 font-normal text-neutral-400">
                  (optional)
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-neutral-300 p-4 transition-colors hover:border-neutral-500 hover:bg-neutral-50">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="size-5 text-neutral-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-800">
                    Upload a profile picture
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    PNG, JPG or WEBP
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleProfileChange}
                />
              </label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm leading-6 text-neutral-500">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-neutral-950 underline underline-offset-4 transition-colors hover:text-neutral-600"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </FrontendLayout>
  );
}
