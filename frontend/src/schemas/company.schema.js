import { z } from "zod";

// Company Registration Schema
export const registerCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters."),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .pipe(z.url("Please enter a valid website URL (e.g. https://company.com)").or(z.literal("")))
    .optional(),

  location: z
    .string()
    .trim()
    .max(100, "Location cannot exceed 100 characters.")
    .optional()
    .or(z.literal("")),
});
