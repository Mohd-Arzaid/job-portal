"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Building2,
  DollarSign,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  FileText,
  ListChecks,
} from "lucide-react";
import toast from "react-hot-toast";

import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { createJobSchema } from "@/schemas/job.schema";
import { useCompanyStore } from "@/store/company.store";
import { cn } from "@/lib/utils";

const JOB_TYPES = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
];

export default function CreateJobPage() {
  const company = useCompanyStore((state) => state.company);
  const isCompanyLoading = useCompanyStore((state) => state.isLoading);
  const initializeCompany = useCompanyStore((state) => state.initializeCompany);

  // 1. Fetch registered company details on mount
  useEffect(() => {
    initializeCompany();
  }, [initializeCompany]);

  // 2. React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      salary: "",
      experienceLevel: 0,
      location: "",
      jobType: "Full-time",
      position: 1,
    },
  });

  const selectedJobType = watch("jobType");

  // 3. Form submit handler (as requested: console logs the form data without making API call)
  const handleCreateJob = async (data) => {
    // Backend expects requirements as an array of strings
    const requirementsArray = data.requirements
      ? data.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const formattedPayload = {
      title: data.title.trim(),
      description: data.description.trim(),
      requirements: requirementsArray,
      salary: Number(data.salary),
      experienceLevel: Number(data.experienceLevel),
      location: data.location.trim(),
      jobType: data.jobType,
      position: Number(data.position),
    };

    console.log("=========================================");
    console.log("💼 CREATE JOB FORM DATA -");
    console.log("=========================================");
    console.log("Raw Form Values:", data);
    console.log("Formatted Payload for Backend:", formattedPayload);
    console.log("Selected Company:", company?.name || "No company");
    console.log("=========================================");

    toast.success("Job form data logged to console! (API call pending)", {
      icon: "📋",
      duration: 4000,
    });
  };

  // 4. Loading State while checking company registration
  if (isCompanyLoading) {
    return (
      <div className="flex min-h-[350px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <p className="text-xs text-neutral-500">Checking organization status...</p>
        </div>
      </div>
    );
  }

  // 5. Warning if recruiter has not registered a company yet
  // Backend rule: job.controller.js enforces "Please register your company first"
  if (!company) {
    return (
      <div className="w-full space-y-6">
        <header className="border-b border-neutral-200/80 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
            Post a Job
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Create and publish a new career opportunity.
          </p>
        </header>

        <section className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-amber-950 sm:text-lg">
                Company Registration Required
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-amber-900/80">
                You must register your company before posting jobs. Job postings are linked directly to your organization profile so candidates know who they are applying to.
              </p>

              <div className="mt-5">
                <Link href="/recruiter/company">
                  <Button rightIcon={<ArrowRight size={15} />}>
                    Register Company First
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
              Post a Job
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-medium text-neutral-800">
              <Building2 size={13} className="text-neutral-500" />
              {company.name}
            </span>
          </div>
          <p className="mt-1.5 max-w-[68ch] text-sm text-neutral-500">
            Fill in the job details below to publish an opening and start receiving applications.
          </p>
        </div>
      </header>

      {/* Main Form Card */}
      <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10">
        <form onSubmit={handleSubmit(handleCreateJob)} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Role Overview */}
          <div className="space-y-6 border-b border-neutral-100 pb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <BriefcaseBusiness size={18} className="text-neutral-700" />
              <span>Role Overview</span>
            </div>

            {/* Job Title */}
            <Input
              label="Job Title *"
              type="text"
              placeholder="e.g. Senior Frontend Engineer, Product Designer, DevOps Specialist"
              {...register("title")}
              error={errors.title?.message}
            />

            {/* Description */}
            <Textarea
              label="Job Description *"
              rows={5}
              placeholder="Describe the responsibilities, day-to-day impact, and what success looks like in this role..."
              {...register("description")}
              error={errors.description?.message}
            />

            {/* Requirements */}
            <div className="space-y-1.5">
              <Input
                label="Key Requirements & Skills *"
                type="text"
                placeholder="React, Node.js, TypeScript, Next.js, Tailwind CSS (comma separated)"
                {...register("requirements")}
                error={errors.requirements?.message}
              />
              <p className="text-xs text-neutral-400">
                Separate individual skills with commas. Candidates will see these as requirement badges.
              </p>
            </div>
          </div>

          {/* Section 2: Compensation & Criteria */}
          <div className="space-y-6 border-b border-neutral-100 pb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <DollarSign size={18} className="text-neutral-700" />
              <span>Compensation & Experience</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Salary */}
              <Input
                label="Salary (LPA / Annual INR) *"
                type="number"
                min="1"
                placeholder="e.g. 1200000 (12 LPA)"
                {...register("salary")}
                error={errors.salary?.message}
              />

              {/* Experience Level */}
              <Input
                label="Experience (in Years) *"
                type="number"
                min="0"
                placeholder="e.g. 2 (0 for Freshers)"
                {...register("experienceLevel")}
                error={errors.experienceLevel?.message}
              />

              {/* Open Positions */}
              <Input
                label="Open Vacancies *"
                type="number"
                min="1"
                placeholder="e.g. 1"
                {...register("position")}
                error={errors.position?.message}
              />
            </div>
          </div>

          {/* Section 3: Job Type & Location */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <MapPin size={18} className="text-neutral-700" />
              <span>Job Type & Work Location</span>
            </div>

            {/* Job Type Selectable Pills */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-800">
                Job Type *
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {JOB_TYPES.map((type) => {
                  const isSelected = selectedJobType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setValue("jobType", type.value, { shouldValidate: true })
                      }
                      className={cn(
                        "flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition cursor-pointer active:scale-[0.98]",
                        isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
                      )}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {errors.jobType && (
                <p className="text-sm text-red-600">{errors.jobType.message}</p>
              )}
            </div>

            {/* Location */}
            <Input
              label="Location *"
              type="text"
              placeholder="e.g. Bengaluru, India or Remote"
              {...register("location")}
              error={errors.location?.message}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 pt-4 border-t border-neutral-100 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Clear Form
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              leftIcon={<PlusCircle size={16} />}
              className="min-w-40"
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
