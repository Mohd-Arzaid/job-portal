import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().pipe(z.email("Please enter a valid email address.")),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["student", "recruiter"], {
    error: (issue) =>
      issue.input === undefined
        ? "Please select a role"
        : "Invalid role. Select student or recruiter",
  }),
});
