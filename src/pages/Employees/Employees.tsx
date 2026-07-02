import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { SkeletonTable } from "@/components/common/SkeletonTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmployeeDialog } from "@/components/forms/EmployeeDialog";
import { FiltersBar } from "@/pages/Employees/FiltersBar";
import { EmployeeTable } from "@/pages/Employees/EmployeeTable";
import { PaginationBar } from "@/pages/Employees/PaginationBar";
import { ViewEmployeeDialog } from "@/pages/Employees/ViewEmployeeDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteEmployee, useEmployees } from "@/hooks/useEmployees";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/constants";
import type { Employee, EmployeeFilters, SortState } from "@/types/employee";

const DEFAULT_FILTERS: EmployeeFilters = {
  search: "",
  department: "all",
  status: "all",
  dateFrom: null,
  dateTo: null,
};

export default function Employees() {
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [filters, setFilters] = useState<EmployeeFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") ?? "",
  });
  const [sort, setSort] = useState<SortState>({ field: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [addOpen, setAddOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const { data, isLoading, isFetching, isError, refetch } = useEmployees({
    filters: effectiveFilters,
    sort,
    pagination: { page, pageSize },
  });

  const deleteMutation = useDeleteEmployee();

  const handleFiltersChange = (next: EmployeeFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const confirmDelete = () => {
    if (!deletingEmployee) return;
    deleteMutation.mutate(deletingEmployee.id, {
      onSuccess: () => setDeletingEmployee(null),
    });
  };

  const employees = data?.data ?? [];
  const hasAnyResults = employees.length > 0;
  const hasFiltersApplied =
    effectiveFilters.search || filters.department !== "all" || filters.status !== "all" || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your team's information, roles, and status."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add employee
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-4 border-b border-border p-5">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              className="pl-9"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search employees by name or email"
            />
          </div>
          <FiltersBar filters={filters} onChange={handleFiltersChange} onReset={handleResetFilters} />
        </div>

        {isLoading ? (
          <SkeletonTable rows={pageSize} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !hasAnyResults ? (
          <EmptyState
            icon={Users}
            title={hasFiltersApplied ? "No employees match your filters" : "No employees yet"}
            description={
              hasFiltersApplied
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Add your first employee to get started."
            }
            actionLabel={hasFiltersApplied ? "Reset filters" : "Add employee"}
            onAction={hasFiltersApplied ? handleResetFilters : () => setAddOpen(true)}
          />
        ) : (
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <EmployeeTable
              employees={employees}
              sort={sort}
              onSortChange={(next) => {
                setSort(next);
                setPage(1);
              }}
              onView={setViewingEmployee}
              onEdit={setEditingEmployee}
              onDelete={setDeletingEmployee}
            />
          </div>
        )}

        {data && hasAnyResults && (
          <PaginationBar
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            totalPages={data.totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </Card>

      <EmployeeDialog open={addOpen} onOpenChange={setAddOpen} />

      <EmployeeDialog
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(undefined)}
        employee={editingEmployee}
      />

      <ViewEmployeeDialog employee={viewingEmployee} onOpenChange={(open) => !open && setViewingEmployee(null)} />

      <ConfirmDialog
        open={!!deletingEmployee}
        onOpenChange={(open) => !open && setDeletingEmployee(null)}
        title="Delete employee?"
        description={`This will permanently remove ${deletingEmployee?.name ?? "this employee"} from your organization. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
