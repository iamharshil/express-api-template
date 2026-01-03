import z from "zod";

export const signupValiation = z
    .object({
        email: z.email("Please provide valid email address."),
        name: z
            .string("Name is required")
            .min(3, "Name must be greater than 3 characters")
            .max(20, "Name less than 20 characters"),
        password: z
            .string("Password is required")
            .min(8, "Password must be longer than 8 characters")
            .max(50, "Password must be less than 50 character"),
        confirmPassword: z.string("Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Password and confirm password does not match",
        path: ["confirmPassword"],
    });

export const loginValidation = z.object({
    email: z.email("Please provide valid email address."),
    password: z
        .string("Password is required")
        .min(8, "Password must be longer than 8 characters")
        .max(50, "Password must be less than 50 characters"),
});
