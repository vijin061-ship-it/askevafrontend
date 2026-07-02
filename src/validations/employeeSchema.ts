import { z } from "zod";
import { DEPARTMENTS, DESIGNATIONS } from "@/constants";


export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  department: z.enum(DEPARTMENTS, { errorMap: () => ({ message: "Select a department" }) }),
  designation: z.enum(DESIGNATIONS, { errorMap: () => ({ message: "Select a designation" }) }),
  joiningDate: z
    .string()
    .min(1, "Joining date is required")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), "Enter a valid date")
    .refine((val) => new Date(val).getTime() <= Date.now() + 86_400_000, {
      message: "Joining date can't be far in the future",
    }),
  status: z.enum(["active", "inactive", "on-leave"]),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
