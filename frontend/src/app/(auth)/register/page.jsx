"use client";

import Input from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ImagePlus, UserRound, BriefcaseBusiness } from "lucide-react";
import Button from "@/components/ui/button";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/api-services/auth.service";
import FrontendLayout from "@/components/layouts/frontend-layout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RedirectIfAuthenticated from "@/routes/auth/redirect-if-authenticated";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedProfileImageURL, setSelectedProfileImageURL] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
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

  // watch() -> Jab form field ki value ke according UI change karni ho
  const selectedRole = watch("role");

  const handleRegister = async (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);
    formData.append("role", data.role);

    if (profileImageFile) {
      formData.append("file", profileImageFile);
    }

    console.log("REGISTER FORM DATA -");

    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value); // instanceof File -> true -> then // Print file name instead of the entire File object
    }

    try {
      // REGISTER API CALL
      const response = await registerUser(formData);

      toast.success(response.message || "Account created successfully!");

      router.push("/login");
    } catch (error) {
      console.error(
        "REGISTER API ERROR............",
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setSelectedProfileImageURL(URL.createObjectURL(file));
  };

  return (
    <RedirectIfAuthenticated>
      <FrontendLayout>
        <section className="flex items-center justify-center py-10 sm:py-12">
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
              onSubmit={handleSubmit(handleRegister)}
              className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-black/2 sm:p-8"
            >
              {/* Full Name */}
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                error={errors.fullName?.message}
              />

              {/* Email Address */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                error={errors.email?.message}
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                error={errors.phoneNumber?.message}
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
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
                    onClick={() => {
                      setValue("role", "student", {
                        shouldValidate: true,
                      });
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      selectedRole === "student"
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        selectedRole === "student"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      <UserRound size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        Student
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Find a job
                      </p>
                    </div>
                  </button>
                  {/* Recruiter */}
                  <button
                    type="button"
                    onClick={() => {
                      setValue("role", "recruiter", {
                        shouldValidate: true,
                      });
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      selectedRole === "recruiter"
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        selectedRole === "recruiter"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      <BriefcaseBusiness size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        Recruiter
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Hire talent
                      </p>
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
                    {selectedProfileImageURL ? (
                      <img
                        src={selectedProfileImageURL}
                        alt="Profile Preview"
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
                    accept="image/*" // sabhi image types, jaise PNG, JPG, WEBP
                    className="sr-only" // Input ko visually hide karne ke liye
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Login Link */}
            <p className="mt-5 text-center text-sm text-neutral-600">
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
    </RedirectIfAuthenticated>
  );
}
