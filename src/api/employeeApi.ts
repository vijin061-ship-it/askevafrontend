import { axiosClient } from "./axiosClient";
import type {
  Employee,
  EmployeeFilters,
  EmployeeInput,
  PaginatedResult,
  PaginationState,
  SortState,
  EmployeeStatus,
} from "@/types/employee";

export interface EmployeeQueryParams {
  filters: EmployeeFilters;
  sort: SortState;
  pagination: PaginationState;
}

function mapBackendStatusToFrontend(status: string): EmployeeStatus {
  const s = status.toLowerCase();
  if (s === "on leave" || s === "on-leave") return "on-leave";
  if (s === "inactive") return "inactive";
  return "active";
}

function mapFrontendStatusToBackend(status: EmployeeStatus): string {
  if (status === "on-leave") return "On Leave";
  if (status === "inactive") return "Inactive";
  return "Active";
}

function mapBackendEmployeeToFrontend(emp: any): Employee {
  return {
    id: String(emp.id),
    name: emp.employee_name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
    email: emp.email,
    avatarUrl: emp.avatarUrl || "",
    department: emp.department,
    designation: emp.designation,
    joiningDate: emp.joining_date || emp.joiningDate,
    status: mapBackendStatusToFrontend(emp.status),
    createdAt: emp.created_at || emp.createdAt || new Date().toISOString(),
    updatedAt: emp.updated_at || emp.updatedAt || new Date().toISOString(),
  };
}

function mapFrontendInputToBackend(input: EmployeeInput) {
  const [first_name, ...lastNameParts] = input.name.trim().split(/\s+/);
  const last_name = lastNameParts.join(" ") || "";

  return {
    first_name,
    last_name,
    email: input.email,
    department: input.department,
    designation: input.designation,
    status: mapFrontendStatusToBackend(input.status),
    joining_date: input.joiningDate,
    address: "",
  };
}

export const employeeApi = {
  async getEmployees(params: EmployeeQueryParams): Promise<PaginatedResult<Employee>> {
    const backendParams: any = {
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters.search,
    };

    if (params.filters.department && params.filters.department !== "all") {
      backendParams.department = params.filters.department;
    }

    if (params.filters.status && params.filters.status !== "all") {
      backendParams.status = mapFrontendStatusToBackend(params.filters.status);
    }

    if (params.filters.dateFrom) {
      backendParams.dateFrom = params.filters.dateFrom;
    }

    if (params.filters.dateTo) {
      backendParams.dateTo = params.filters.dateTo;
    }

    if (params.sort && params.sort.field) {
      backendParams.sortBy = params.sort.field;
      backendParams.sortDir = params.sort.direction;
    }

    const response = await axiosClient.get("/employee", { params: backendParams });
    const { data, total, page, limit } = response.data.data;

    const mappedData = data.map(mapBackendEmployeeToFrontend);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: mappedData,
      total,
      page,
      pageSize: limit,
      totalPages,
    };
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    const response = await axiosClient.get("/employee", {
      params: { limit: 100000 },
    });
    const employees = response.data.data.data;
    const found = employees.find((emp: any) => String(emp.id) === id);
    return found ? mapBackendEmployeeToFrontend(found) : undefined;
  },

  async createEmployee(input: EmployeeInput): Promise<Employee> {
    const backendBody = mapFrontendInputToBackend(input);
    const response = await axiosClient.post("/employee", backendBody);
    return mapBackendEmployeeToFrontend(response.data.data);
  },

  async updateEmployee(id: string, input: Partial<EmployeeInput>): Promise<Employee> {
    const backendBody: any = {};
    if (input.name !== undefined) {
      const [first_name, ...lastNameParts] = input.name.trim().split(/\s+/);
      backendBody.first_name = first_name;
      backendBody.last_name = lastNameParts.join(" ") || "";
    }
    if (input.email !== undefined) backendBody.email = input.email;
    if (input.department !== undefined) backendBody.department = input.department;
    if (input.designation !== undefined) backendBody.designation = input.designation;
    if (input.status !== undefined) backendBody.status = mapFrontendStatusToBackend(input.status);
    if (input.joiningDate !== undefined) backendBody.joining_date = input.joiningDate;
    
    backendBody.address = "";

    const response = await axiosClient.put(`/employee/${id}`, backendBody);
    return mapBackendEmployeeToFrontend(response.data.data);
  },

  async deleteEmployee(id: string): Promise<void> {
    await axiosClient.delete(`/employee/${id}`);
  },

  async getAllForAnalytics(): Promise<Employee[]> {
    const response = await axiosClient.get("/employee", {
      params: { limit: 100000 },
    });
    const employees = response.data.data.data;
    return employees.map(mapBackendEmployeeToFrontend);
  },
};
