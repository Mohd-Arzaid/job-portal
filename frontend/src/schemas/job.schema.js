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
    .number({
      error: () => "Please enter a valid salary amount.",
    })
    .positive("Salary must be greater than 0."),

  experienceLevel: z.coerce
    .number({
      error: () => "Please enter years of experience.",
    })
    .int("Experience must be a whole number.")
    .min(0, "Experience cannot be negative."),

  location: z
    .string()
    .trim()
    .min(2, "Location is required (e.g. Bengaluru, Remote)."),

  jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract"], {
    error: (issue) =>
      issue.input === undefined
        ? "Please select a job type."
        : "Invalid job type. Select Full-time, Part-time, Internship, or Contract.",
  }),

  position: z.coerce
    .number({
      error: () => "Please enter number of open positions.",
    })
    .int("Position must be a whole number.")
    .positive("Open positions must be at least 1."),
});
