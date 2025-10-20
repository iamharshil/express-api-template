import { z } from "zod";

export const RegisterSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters long"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const VerifyEmailSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export const LoginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});
