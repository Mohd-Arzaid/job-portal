"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X, Building2, Globe, MapPin, Upload } from "lucide-react";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { registerCompanySchema } from "@/schemas/company.schema";

export default function RegisterCompanyPage() {
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  // 1. React Hook Form with Zod validation
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

  // 2. Form submit handler (as requested: logs all FormData without calling API)
  const handleRegisterCompany = async (data) => {
    const formData = new FormData();

    // Fields in backend order: name -> description -> website -> location -> file
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("website", data.website || "");
    formData.append("location", data.location || "");

    if (logoFile) {
      formData.append("file", logoFile);
    }

    console.log("=========================================");
    console.log("🏢 REGISTER COMPANY FORM DATA -");
    console.log("=========================================");

    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }
  };

  // 3. Logo upload handler
  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  // 4. Remove selected logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
      setLogoPreviewUrl("");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
            Register Company
          </h1>
          <p className="mt-1.5 max-w-[68ch] text-sm text-neutral-500">
            Create your company profile to start publishing job listings and hiring talent.
          </p>
        </div>
      </header>

      {/* Main Form Section */}
      <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/10">
        <form onSubmit={handleSubmit(handleRegisterCompany)} className="p-6 sm:p-8 space-y-6">
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
                {logoPreviewUrl ? (
                  <img
                    src={logoPreviewUrl}
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
                    <span>{logoPreviewUrl ? "Change Logo" : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleLogoChange}
                    />
                  </label>

                  {logoPreviewUrl && (
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[160px]"
            >
              {isSubmitting ? "Registering..." : "Register Company"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
