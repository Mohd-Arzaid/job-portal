"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Building2,
  Upload,
  Globe,
  MapPin,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { registerCompanySchema } from "@/schemas/company.schema";
import { registerCompany } from "@/api-services/company.service";
import { useCompanyStore } from "@/store/company.store";

export default function CompanyPage() {
  const company = useCompanyStore((state) => state.company);
  const isCompanyLoading = useCompanyStore((state) => state.isLoading);
  const setCompany = useCompanyStore((state) => state.setCompany);
  const initializeCompany = useCompanyStore((state) => state.initializeCompany);

  // Logo file state for registration form
  const [selectedCompanyLogoUrl, setSelectedCompanyLogoUrl] = useState("");
  const [companyLogoFile, setCompanyLogoFile] = useState(null);

  // 1. Fetch company details on page load if not already fetched
  useEffect(() => {
    initializeCompany();
  }, [initializeCompany]);

  // 2. React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(registerCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
    },
  });

  // 3. Form submit handler: company register hone par store update hoga
  const handleRegisterCompany = async (data) => {
    const formData = new FormData();

    // Fields in backend order: name -> description -> website -> location -> file
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("website", data.website || "");
    formData.append("location", data.location || "");

    if (companyLogoFile) {
      formData.append("file", companyLogoFile);
    }

    console.log("REGISTER COMPANY FORM DATA -");

    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value); // instanceof File -> true -> then // Print file name instead of the entire File object
    }

    try {
      // REGISTER COMPANY API CALL
      const response = await registerCompany(formData);

      toast.success(response?.message || "Company registered successfully!");

      // Update Zustand company store with registered company data
      if (response?.data) {
        setCompany(response.data);
      }
    } catch (error) {
      console.error(
        "REGISTER COMPANY API ERROR............",
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  // 4. Logo upload handler
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCompanyLogoFile(file);
    setSelectedCompanyLogoUrl(URL.createObjectURL(file));
  };

  // 5. Remove selected logo
  const handleRemoveLogo = () => {
    setCompanyLogoFile(null);
    if (selectedCompanyLogoUrl) {
      URL.revokeObjectURL(selectedCompanyLogoUrl);
      setSelectedCompanyLogoUrl("");
    }
  };

  // 6. LOADING STATE: Spinner jab company fetch ho rahi ho
  if (isCompanyLoading) {
    return (
      <div className="flex min-h-[350px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
          <p className="text-xs text-neutral-500">Loading company details...</p>
        </div>
      </div>
    );
  }

  // 7. ALREADY REGISTERED: Agar company pehle se registered hai toh details dikhao
  if (company) {
    return (
      <div className="w-full space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
                Company Profile
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                <CheckCircle2 size={13} />
                Registered
              </span>
            </div>
            <p className="mt-1.5 max-w-[68ch] text-sm text-neutral-500">
              Your registered organization details and public company profile.
            </p>
          </div>

          <Link href="/recruiter/jobs/create">
            <Button leftIcon={<PlusCircle size={16} />}>
              Post a Job
            </Button>
          </Link>
        </header>

        {/* Company Details Card */}
        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10">
          {/* Top Banner / Logo & Name */}
          <div className="border-b border-neutral-100 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Logo */}
              <div className="flex size-20 shrink-0 p-1 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-2xs">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="size-full object-contain"
                  />
                ) : (
                  <Building2 className="size-9 text-neutral-400" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-neutral-950 sm:text-2xl">
                  {company.name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                  {company.location && (
                    <span className="inline-flex items-center gap-1.5 text-neutral-600">
                      <MapPin size={14} className="text-neutral-400" />
                      {company.location}
                    </span>
                  )}

                  {company.website && (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                    >
                      <Globe size={14} className="text-neutral-400" />
                      Visit Website
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {company.createdAt && (
                    <span className="inline-flex items-center gap-1.5 text-neutral-500">
                      <Calendar size={14} className="text-neutral-400" />
                      Joined {new Date(company.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                About the Organization
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                {company.description || "No description provided."}
              </p>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-neutral-400">Headquarters</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {company.location || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-400">Website</p>
                <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                  {company.website || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 8. NOT REGISTERED: Agar company register nahi hai, toh form dikhao
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
            Register Company
          </h1>
          <p className="mt-1.5 max-w-[68ch] text-sm text-neutral-500">
            Create your company profile to start publishing job listings and
            hiring talent.
          </p>
        </div>
      </header>

      {/* Main Form Section */}
      <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10">
        <form
          onSubmit={handleSubmit(handleRegisterCompany)}
          className="p-6 sm:p-8 space-y-6"
        >
          {/* 1. Company Name */}
          <Input
            label="Company Name"
            type="text"
            placeholder="e.g. Acme Corp, Google, Microsoft"
            {...register("name")}
            error={errors.name?.message}
          />

          {/* 2. Description */}
          <Textarea
            label="Description"
            rows={4}
            placeholder="Tell candidates about your company's mission, work culture, and what you build..."
            {...register("description")}
            error={errors.description?.message}
          />

          {/* 3. Website & Location (Two-column grid) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Website"
              type="text"
              placeholder="https://example.com"
              {...register("website")}
              error={errors.website?.message}
            />

            <Input
              label="Location"
              type="text"
              placeholder="e.g. Bengaluru, India or Remote"
              {...register("location")}
              error={errors.location?.message}
            />
          </div>

          {/* 4. Company Logo */}
          <div className="space-y-2 pt-1">
            <label className="block text-sm font-medium text-neutral-800">
              Company Logo{" "}
              <span className="font-normal text-neutral-400">(optional)</span>
            </label>

            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-neutral-300 p-5 transition hover:border-neutral-400 bg-neutral-50/40 sm:flex-row sm:items-center">
              {/* Logo Preview Avatar */}
              <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xs">
                {selectedCompanyLogoUrl ? (
                  <img
                    src={selectedCompanyLogoUrl}
                    alt="Company Logo Preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-8 text-neutral-400" />
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-xs font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]">
                    <Upload size={14} />
                    <span>
                      {selectedCompanyLogoUrl ? "Change Logo" : "Upload Logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleLogoChange}
                    />
                  </label>

                  {selectedCompanyLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <X size={14} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-neutral-500">
                  PNG, JPG, SVG or WEBP up to 5MB. A square logo works best.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button type="submit" disabled={isSubmitting} className="min-w-40">
              {isSubmitting ? "Registering..." : "Register Company"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
