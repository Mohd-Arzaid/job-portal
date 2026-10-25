import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Job title must be at least 2 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Job description must be at least 10 characters."),

  requirements: z
    .array(z.string().trim().min(1, "Requirement cannot be empty"))
    .min(1, "Please add at least one requirement or skill."),

  salary: z.coerce
    .number()
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Salary must be greater than 0.",
    }),

  experienceLevel: z.coerce
    .number()
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val >= 0, {
      message: "Experience must be 0 or greater (in whole years).",
    }),

  location: z
    .string()
    .trim()
    .min(2, "Location is required (e.g. Bengaluru, Karnataka, India or Remote, India)."),

  jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract"], {
    message: "Please select a valid job type.",
  }),

  position: z.coerce
    .number()
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val >= 1, {
      message: "Open positions must be at least 1.",
    }),
});
