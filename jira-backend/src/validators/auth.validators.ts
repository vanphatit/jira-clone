import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    repassword: z.string().min(6),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords must match",
    path: ["repassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const VerifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Must be 6 digits"),
});

export const ResendCodeSchema = z.object({
  email: z.string().email(),
});
