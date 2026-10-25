"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Building2,
  DollarSign,
  MapPin,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { createJobSchema } from "@/schemas/job.schema";
import { useCompanyStore } from "@/store/company.store";
import useCreateJob from "@/hooks/use-create-job";
import { cn } from "@/lib/utils";

const JOB_TYPES = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
];

const SUGGESTED_REQUIREMENTS = [
  "React",
  "Node.js",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "MongoDB",
  "Express.js",
  "Python",
  "SQL",
  "Docker",
  "AWS",
  "Git",
];

const SUGGESTED_LOCATIONS = [
  "Remote",
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
];

const MAX_REQUIREMENTS_COUNT = 15;
const MAX_LOCATIONS_COUNT = 5;

export default function CreateJobPage() {
  const company = useCompanyStore((state) => state.company);
  const isCompanyLoading = useCompanyStore((state) => state.isLoading);
  const initializeCompany = useCompanyStore((state) => state.initializeCompany);

  // Custom hook for posting job to backend API
  const { handleCreateJob, isCreatingJob } = useCreateJob();

  // Requirements text input state
  const [requirementInput, setRequirementInput] = useState("");
  
  // Location text input state
  const [locationInput, setLocationInput] = useState("");

  // 1. Recruiter ki registered company details fetch kar rahe hain
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
      requirements: [],
      salary: "",
      experienceLevel: 0,
      location: [],
      jobType: "Full-time",
      position: 1,
    },
  });

  // Combined loading state
  const isProcessing = isSubmitting || isCreatingJob;

  // watch() -> Jab field value ke according UI dynamically update karni ho
  const selectedJobType = watch("jobType");
  const selectedRequirements = watch("requirements") || [];
  const selectedLocations = watch("location") || [];

  // Requirement add karne ka handler (Enter press ya Add button click par)
  const handleAddRequirement = (requirementToAdd) => {
    const trimmedRequirement = (requirementToAdd || requirementInput).trim();
    if (!trimmedRequirement) return;

    // Check maximum tags limit
    if (selectedRequirements.length >= MAX_REQUIREMENTS_COUNT) {
      toast.error(`Maximum ${MAX_REQUIREMENTS_COUNT} requirements allowed.`);
      return;
    }

    // Duplicate check (case-insensitive)
    if (
      selectedRequirements.some(
        (item) => item.toLowerCase() === trimmedRequirement.toLowerCase(),
      )
    ) {
      toast.error(`"${trimmedRequirement}" is already added!`);
      return;
    }

    const updatedRequirements = [...selectedRequirements, trimmedRequirement];
    setValue("requirements", updatedRequirements, { shouldValidate: true });
    setRequirementInput("");
  };

  // Requirement tag delete karne ka handler
  const handleRemoveRequirement = (indexToRemove) => {
    const updatedRequirements = selectedRequirements.filter(
      (_, index) => index !== indexToRemove,
    );
    setValue("requirements", updatedRequirements, { shouldValidate: true });
  };

  // Enter key press par requirement add karo
  const handleRequirementKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Form ko submit hone se prevent karta hai
      handleAddRequirement();
    } else if (
      event.key === "Backspace" &&
      !requirementInput &&
      selectedRequirements.length > 0
    ) {
      handleRemoveRequirement(selectedRequirements.length - 1);
    }
  };

  // Location add karne ka handler (Enter press ya Add button click par)
  const handleAddLocation = (locationToAdd) => {
    const trimmedLocation = (locationToAdd || locationInput).trim();
    if (!trimmedLocation) return;

    // Check maximum tags limit
    if (selectedLocations.length >= MAX_LOCATIONS_COUNT) {
      toast.error(`Maximum ${MAX_LOCATIONS_COUNT} locations allowed.`);
      return;
    }

    // Duplicate check (case-insensitive)
    if (
      selectedLocations.some(
        (item) => item.toLowerCase() === trimmedLocation.toLowerCase(),
      )
    ) {
      toast.error(`"${trimmedLocation}" is already added!`);
      return;
    }

    const updatedLocations = [...selectedLocations, trimmedLocation];
    setValue("location", updatedLocations, { shouldValidate: true });
    setLocationInput("");
  };

  // Location tag delete karne ka handler
  const handleRemoveLocation = (indexToRemove) => {
    const updatedLocations = selectedLocations.filter(
      (_, index) => index !== indexToRemove,
    );
    setValue("location", updatedLocations, { shouldValidate: true });
  };

  // Enter key press par location add karo
  const handleLocationKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Form ko submit hone se prevent karta hai
      handleAddLocation();
    } else if (
      event.key === "Backspace" &&
      !locationInput &&
      selectedLocations.length > 0
    ) {
      handleRemoveLocation(selectedLocations.length - 1);
    }
  };

  // 3. Form submit handler - connects to useCreateJob hook and API
  const handleCreateJobFormSubmit = async (formData) => {
    await handleCreateJob(formData);
  };

  // Form reset karne ka handler
  const handleResetJobForm = () => {
    reset();
    setRequirementInput("");
    setLocationInput("");
    toast("Form cleared", { icon: "🧹" });
  };

  // 4. Loading State while checking company status
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
        <form
          onSubmit={handleSubmit(handleCreateJobFormSubmit)}
          className="p-6 sm:p-8 space-y-8"
        >
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
              disabled={isProcessing}
              placeholder="e.g. Senior Frontend Engineer, Product Designer, DevOps Specialist"
              {...register("title")}
              error={errors.title?.message}
            />

            {/* Description */}
            <Textarea
              label="Job Description *"
              rows={5}
              disabled={isProcessing}
              placeholder="Describe the responsibilities, day-to-day impact, and what success looks like in this role..."
              {...register("description")}
              error={errors.description?.message}
            />

            {/* Interactive Requirements / Skills Tags */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-800">
                Key Requirements & Skills *
                {selectedRequirements.length > 0 && (
                  <span className="ml-2 font-normal text-xs text-neutral-500">
                    ({selectedRequirements.length}/{MAX_REQUIREMENTS_COUNT} added)
                  </span>
                )}
              </label>

              {/* Tag Input Field with Add Button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={requirementInput}
                  disabled={isProcessing}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={handleRequirementKeyDown}
                  placeholder="Type a skill and press Enter (e.g. React, Docker, Node.js)"
                  className="h-11 flex-1 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 disabled:opacity-50"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddRequirement()}
                  disabled={isProcessing || !requirementInput.trim()}
                  leftIcon={<Plus size={15} />}
                  className="h-11 px-4 text-xs font-semibold"
                >
                  Add Skill
                </Button>
              </div>

              {errors.requirements && (
                <p className="text-sm text-red-600">
                  {errors.requirements.message}
                </p>
              )}

              {/* Active Tags / Badges */}
              {selectedRequirements.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedRequirements.map((requirement, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-2xs"
                    >
                      <span>{requirement}</span>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleRemoveRequirement(index)}
                        className="rounded-full p-0.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer disabled:pointer-events-none"
                        title={`Remove ${requirement}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Suggestions */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                  <Sparkles size={12} />
                  <span>Quick suggestions:</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_REQUIREMENTS.filter(
                    (suggested) =>
                      !selectedRequirements.some(
                        (existing) =>
                          existing.toLowerCase() === suggested.toLowerCase(),
                      ),
                  ).map((suggestedSkill) => (
                    <button
                      key={suggestedSkill}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleAddRequirement(suggestedSkill)}
                      className="inline-flex items-center gap-1 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Plus size={11} className="text-neutral-400" />
                      {suggestedSkill}
                    </button>
                  ))}
                </div>
              </div>
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
                label="Salary (LPA) *"
                type="number"
                min="1"
                disabled={isProcessing}
                placeholder="e.g. (12 LPA)"
                {...register("salary")}
                error={errors.salary?.message}
              />

              {/* Experience Level */}
              <Input
                label="Experience (in Years) *"
                type="number"
                min="0"
                disabled={isProcessing}
                placeholder="e.g. 2 (0 for Freshers)"
                {...register("experienceLevel")}
                error={errors.experienceLevel?.message}
              />

              {/* Open Positions */}
              <Input
                label="Open Vacancies *"
                type="number"
                min="1"
                disabled={isProcessing}
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
                      disabled={isProcessing}
                      onClick={() =>
                        setValue("jobType", type.value, { shouldValidate: true })
                      }
                      className={cn(
                        "flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition cursor-pointer active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
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

            {/* Location - Interactive Tags */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-800">
                Location *
                {selectedLocations.length > 0 && (
                  <span className="ml-2 font-normal text-xs text-neutral-500">
                    ({selectedLocations.length}/{MAX_LOCATIONS_COUNT} added)
                  </span>
                )}
              </label>

              {/* Tag Input Field with Add Button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={locationInput}
                  disabled={isProcessing}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="Type a location and press Enter (e.g. Bengaluru, Remote)"
                  className="h-11 flex-1 rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 disabled:opacity-50"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddLocation()}
                  disabled={isProcessing || !locationInput.trim()}
                  leftIcon={<Plus size={15} />}
                  className="h-11 px-4 text-xs font-semibold"
                >
                  Add Location
                </Button>
              </div>

              {errors.location && (
                <p className="text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}

              {/* Active Location Tags / Badges */}
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedLocations.map((location, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-2xs"
                    >
                      <span>{location}</span>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleRemoveLocation(index)}
                        className="rounded-full p-0.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer disabled:pointer-events-none"
                        title={`Remove ${location}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Location Suggestions */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                  <Sparkles size={12} />
                  <span>Quick suggestions:</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_LOCATIONS.filter(
                    (suggested) =>
                      !selectedLocations.some(
                        (existing) =>
                          existing.toLowerCase() === suggested.toLowerCase(),
                      ),
                  ).map((suggestedLocation) => (
                    <button
                      key={suggestedLocation}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleAddLocation(suggestedLocation)}
                      className="inline-flex items-center gap-1 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Plus size={11} className="text-neutral-400" />
                      {suggestedLocation}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 pt-4 border-t border-neutral-100 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetJobForm}
              disabled={isProcessing}
            >
              Clear Form
            </Button>

            <Button
              type="submit"
              disabled={isProcessing}
              leftIcon={<PlusCircle size={16} />}
              className="min-w-44"
            >
              {isProcessing ? "Publishing Job..." : "Publish Job Opening"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
