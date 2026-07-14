import { z } from "zod";

export const PASSWORD_RULES = [
  { label: "Minimum 8 znaków", test: (v: string) => v.length >= 8 },
  { label: "Przynajmniej jedna wielka litera", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Przynajmniej jedna cyfra", test: (v: string) => /[0-9]/.test(v) },
] as const;

export const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków.")
  .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę.")
  .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę.");

export const loginSchema = z.object({
  email: z.string().email("Podaj prawidłowy adres email."),
  password: z.string().min(1, "Podaj hasło."),
});

export const signupSchema = z
  .object({
    email: z.string().email("Podaj prawidłowy adres email."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Podaj aktualne hasło."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie są identyczne.",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie są identyczne.",
    path: ["confirmPassword"],
  });
