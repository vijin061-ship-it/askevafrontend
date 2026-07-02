import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeApi, type EmployeeQueryParams } from "@/api/employeeApi";
import type { Employee, EmployeeInput, PaginatedResult } from "@/types/employee";
import axios from "axios";

const EMPLOYEES_KEY = "employees";

export function useEmployees(params: EmployeeQueryParams) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, params],
    queryFn: () => employeeApi.getEmployees(params),
    placeholderData: (prev) => prev,
  });
}

export function useEmployeeAnalytics() {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, "analytics"],
    queryFn: () => employeeApi.getAllForAnalytics(),
    staleTime: 60_000,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EmployeeInput) => employeeApi.createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
      toast.success("Employee added successfully");
    },
 onError: (error: unknown) => {
  if (axios.isAxiosError(error)) {
    toast.error(
      error.response?.data?.message || "Failed to add employee"
    );
  } else {
    toast.error("Something went wrong");
  }
}
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EmployeeInput> }) =>
      employeeApi.updateEmployee(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: [EMPLOYEES_KEY] });
      const previous = queryClient.getQueriesData<PaginatedResult<Employee>>({
        queryKey: [EMPLOYEES_KEY],
      });

      previous.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResult<Employee>>(key, {
          ...data,
          data: data?.data?.map((emp) => (emp.id === id ? { ...emp, ...input } : emp)),
        });
      });

      return { previous };
    },
    onError: (error: Error, _vars, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(error.message || "Failed to update employee");
    },
    onSuccess: () => {
      toast.success("Employee updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
      toast.success("Employee removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete employee");
    },
  });
}
