export type EmployeeStatus = "active" | "inactive" | "on-leave";

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  department: string;
  designation: string;
  joiningDate: string; 
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeInput = Omit<
  Employee,
  "id" | "avatarUrl" | "createdAt" | "updatedAt"
>;

export interface EmployeeFilters {
  search: string;
  department: string | "all";
  status: EmployeeStatus | "all";
  dateFrom: string | null;
  dateTo: string | null;
}

export type SortField = keyof Pick<
  Employee,
  "name" | "department" | "designation" | "status" | "joiningDate"
>;

export interface SortState {
  field: SortField;
  direction: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
