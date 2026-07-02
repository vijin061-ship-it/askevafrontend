import type { EmployeeStatus } from "@/types/employee";

export const APP_NAME = "Askeva";

export const STORAGE_KEYS = {
  TOKEN: "Askeva_access_token",
  TOKEN_EXPIRY: "Askeva_token_expiry",
  USER: "Askeva_user",
  THEME: "Askeva_theme",
  MOCK_DB: "Askeva_mock_employees_db",
} as const;

export const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Customer Support",
] as const;

export const DESIGNATIONS = [
  "Intern",
  "Associate",
  "Senior Associate",
  "Team Lead",
  "Manager",
  "Senior Manager",
  "Director",
  "VP",
] as const;

export const STATUS_OPTIONS: { value: EmployeeStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on-leave", label: "On Leave" },
];

export const STATUS_BADGE_STYLES: Record<EmployeeStatus, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
  "on-leave": "bg-warning/10 text-warning border-warning/20",
};

export const DEFAULT_PAGE_SIZE = 8;
export const PAGE_SIZE_OPTIONS = [5, 8, 10, 25, 50];
export const SEARCH_DEBOUNCE_MS = 500;

export const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "123456",
};
