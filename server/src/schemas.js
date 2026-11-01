import { z } from "zod";

const trimmed = (minimum, maximum) =>
  z.string().trim().min(minimum).max(maximum);

export const registrationSchema = z.object({
  name: trimmed(2, 120),
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  admission_number: trimmed(3, 50),
  phone_number: trimmed(7, 30),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[0-9]/, "Password needs a number")
    .regex(/[^A-Za-z0-9]/, "Password needs a special character"),
});

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()).optional(),
    admission_number: trimmed(3, 50).optional(),
    password: z.string().min(1).max(128),
  })
  .refine((value) => value.email || value.admission_number, {
    message: "Email or admission number is required",
  });

export const googleSchema = z.object({
  idToken: z.string().min(100).max(10000),
});

export const privilegedUserSchema = registrationSchema.extend({
  role: z.enum(["maintenance_staff", "admin"]),
});

export const reportSchema = z.object({
  title: trimmed(3, 160),
  description: trimmed(10, 5000),
  location: trimmed(2, 255),
  category: trimmed(2, 80),
  priority: z
    .string()
    .trim()
    .transform((value) => value.toLowerCase())
    .pipe(z.enum(["low", "medium", "high", "urgent"])),
});

const statusAliases = {
  new: "pending",
  pending: "pending",
  "pending review": "pending",
  pending_review: "pending",
  active: "in_progress",
  "in progress": "in_progress",
  in_progress: "in_progress",
  completed: "resolved",
  resolved: "resolved",
  rejected: "rejected",
};

export const statusSchema = z.object({
  status: z
    .string()
    .trim()
    .transform((value) => statusAliases[value.toLowerCase()] || value.toLowerCase())
    .pipe(z.enum(["pending", "in_progress", "resolved", "rejected"])),
});

export const assignmentSchema = z.object({
  maintenance_id: z.coerce.number().int().positive(),
});

export const idSchema = z.coerce.number().int().positive();

export function parse(schema, value) {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const error = new Error("Validation failed");
  error.status = 400;
  error.details = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  throw error;
}
