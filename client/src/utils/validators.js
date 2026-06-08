/**
 * Shared Zod validators for auth & common forms.
 * Reused by react-hook-form via zodResolver.
 */
import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Select a doctor'),
  date: z.string().min(1, 'Select a date'),
  timeSlot: z.string().min(1, 'Select a time slot'),
  reason: z.string().max(500).optional(),
});

export const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.string().optional(),
});

export const prescriptionSchema = z.object({
  appointmentId: z.string().min(1, 'Select an appointment'),
  medicines: z.array(medicineSchema).min(1, 'Add at least one medicine'),
  advice: z.string().max(1000).optional(),
  followUpDate: z.string().optional(),
});
