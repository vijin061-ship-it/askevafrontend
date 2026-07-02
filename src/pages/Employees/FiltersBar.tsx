import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { DEPARTMENTS, STATUS_OPTIONS } from "@/constants";
import type { EmployeeFilters } from "@/types/employee";

interface FiltersBarProps {
  filters: EmployeeFilters;
  onChange: (filters: EmployeeFilters) => void;
  onReset: () => void;
}

export function FiltersBar({ filters, onChange, onReset }: FiltersBarProps) {
  const hasActiveFilters =
    filters.department !== "all" || filters.status !== "all" || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Select
        value={filters.department}
        onValueChange={(value) => onChange({ ...filters, department: value as EmployeeFilters["department"] })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All departments</SelectItem>
          {DEPARTMENTS.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value as EmployeeFilters["status"] })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset filters
        </Button>
      )}
    </div>
  );
}
