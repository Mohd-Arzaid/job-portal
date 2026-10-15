import { z } from "zod";

export const registerCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),

  description: z.string().optional(),

  website: z
    .string()
    .trim()
    .pipe(z.url("Please enter a valid website URL").or(z.literal("")))
    .optional(),

  location: z.string().optional(),
});
