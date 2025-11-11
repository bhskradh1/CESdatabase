import { z } from "zod";

// Phone number regex: allows digits, spaces, hyphens, parentheses, and plus sign
const phoneRegex = /^[0-9+\-\s()]*$/;

// URL validation helper
const urlSchema = z.union([
  z.literal(""),
  z.string().url({ message: "Invalid URL format" })
]);

export const studentFormSchema = z.object({
  student_id: z.string().min(1, "Student ID is required").max(50, "Student ID must be less than 50 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  roll_number: z.string().min(1, "Roll number is required").max(50, "Roll number must be less than 50 characters"),
  class: z.string().min(1, "Class is required").max(50, "Class must be less than 50 characters"),
  section: z.string().max(10, "Section must be less than 10 characters").optional(),
  contact: z.string().regex(phoneRegex, "Invalid phone format").max(20, "Contact must be less than 20 characters").optional(),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
  total_fee: z.number().min(0, "Fee must be 0 or greater").max(10000000, "Fee cannot exceed 10,000,000"),
  photo_url: urlSchema.optional(),
  remarks: z.string().max(1000, "Remarks must be less than 1000 characters").optional(),
});

export const teacherFormSchema = z.object({
  teacher_id: z.string().min(1, "Teacher ID is required").max(50, "Teacher ID must be less than 50 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format").max(255, "Email must be less than 255 characters"),
  contact: z.string().regex(phoneRegex, "Invalid phone format (use only digits, spaces, +, -, ( ))").max(20, "Contact must be less than 20 characters"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  qualification: z.string().min(1, "Qualification is required").max(200, "Qualification must be less than 200 characters"),
  experience: z.number().int().min(0, "Experience must be 0 or greater").max(50, "Experience cannot exceed 50 years"),
  level: z.string().min(1, "Level is required"),
  class_taught: z.string().max(50, "Class taught must be less than 50 characters").optional(),
  salary: z.number().min(0, "Salary must be 0 or greater").max(10000000, "Salary cannot exceed 10,000,000"),
  photo_url: urlSchema.optional(),
});

export const paymentFormSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0").max(1000000, "Amount cannot exceed 1,000,000"),
  payment_method: z.string().min(1, "Payment method is required"),
  payment_date: z.string().min(1, "Payment date is required"),
  remarks: z.string().max(1000, "Remarks must be less than 1000 characters").optional(),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
export type TeacherFormData = z.infer<typeof teacherFormSchema>;
export type PaymentFormData = z.infer<typeof paymentFormSchema>;
