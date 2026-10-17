"use client";

import FrontendLayout from "@/components/layouts/frontend-layout";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { loginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginUser } from "@/api-services/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RedirectIfAuthenticated from "@/routes/auth/redirect-if-authenticated";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student",
    },
  });

  const selectedRole = watch("role");

  const handleLogin = async (data) => {
    try {
      const response = await loginUser(data);

      toast.success(response.message || "Logged in successfully!");

      // Backend se validated role lo, form data se nahi
      const userRole = response.data.role;

      if (userRole === "recruiter") {
        router.push("/recruiter/dashboard");
      } else if (userRole === "student") {
        router.push("/");
      } else {
        toast.error("Invalid account role.");
      }
    } catch (error) {
      console.error(
        "LOGIN API ERROR............",
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <RedirectIfAuthenticated>
      <FrontendLayout>
        <section className="flex w-full items-center justify-center py-10 sm:py-12">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Welcome back
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500 sm:text-base">
                Log in to your account and continue your journey.
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-black/2 sm:p-8"
            >
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
              />

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-neutral-700 underline underline-offset-4 transition-colors hover:text-neutral-950"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Account Type */}
              <div>
                <label className="mb-3 block text-sm font-medium text-neutral-800">
                  Log in as
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Student */}
                  <button
                    type="button"
                    onClick={() =>
                      setValue("role", "student", {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
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
                      <GraduationCap size={19} />
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
                    onClick={() =>
                      setValue("role", "recruiter", {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
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
                  <p className="mt-2 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>

            {/* Register Link */}
            <p className="mt-5 text-center text-sm text-neutral-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-neutral-950 underline underline-offset-4 transition-colors hover:text-neutral-600"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </FrontendLayout>
    </RedirectIfAuthenticated>
  );
}
