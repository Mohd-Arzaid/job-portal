import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().trim().min(1, "Job title is required"),

  description: z.string().trim().min(1, "Job description is required"),

  requirements: z
    .array(z.string().trim().min(1, "Requirement cannot be empty"))
    .optional()
    .default([]),

  salary: z.coerce.number().positive("Salary must be greater than 0"),

  experienceLevel: z.coerce
    .number()
    .int()
    .min(0, "Experience cannot be negative"),

  location: z
    .array(z.string().trim().min(1, "Location cannot be empty"))
    .min(1, "At least one location is required"),

  jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract"]),

  position: z.coerce.number().int().positive("Position must be at least 1"),
});
