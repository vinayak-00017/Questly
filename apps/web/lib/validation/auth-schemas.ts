import { z } from "zod";

// Registration validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Adventurer name must be at least 2 characters")
    .max(50, "Adventurer name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Adventurer name can only contain letters and spaces"),
  
  email: z
    .string()
    .email("Please enter a valid scroll address (email)")
    .min(1, "Scroll address is required"),
  
  password: z
    .string()
    .min(8, "Your key must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Your key needs at least one letter")
    .regex(/[0-9]/, "Your key needs at least one number for power")
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid scroll address (email)")
    .min(1, "Scroll address is required"),
  
  password: z
    .string()
    .min(1, "Your key is required to enter the realm")
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;