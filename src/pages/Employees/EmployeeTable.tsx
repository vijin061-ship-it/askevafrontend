import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { STATUS_BADGE_STYLES } from "@/constants";
import { avatarColor, formatDate, getInitials } from "@/utils/formatters";
import type { Employee, SortField, SortState } from "@/types/employee";

interface Column {
  field: SortField;
  label: string;
  sortable: boolean;
  className?: string;
}

const COLUMNS: Column[] = [
  { field: "name", label: "Employee", sortable: true },
  { field: "department", label: "Department", sortable: true, className: "hidden md:table-cell" },
  { field: "designation", label: "Designation", sortable: true, className: "hidden lg:table-cell" },
  { field: "status", label: "Status", sortable: true },
  { field: "joiningDate", label: "Joined", sortable: true, className: "hidden sm:table-cell" },
];

interface EmployeeTableProps {
  employees: Employee[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({ employees, sort, onSortChange, onView, onEdit, onDelete }: EmployeeTableProps) {
  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ field, direction: "asc" });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-card">
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {COLUMNS.map((col) => (
              <th key={col.field} className={`px-5 py-3 ${col.className ?? ""}`}>
                {col.sortable ? (
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort(col.field)}
                  >
                    {col.label}
                    {sort.field === col.field ? (
                      sort.direction === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {employees.map((emp) => (
            <tr key={emp.id} className="transition-colors hover:bg-secondary/50">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(
                      emp.name
                    )}`}
                  >
                    {getInitials(emp.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{emp.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{emp.email}</p>
                  </div>
                </div>
              </td>
              <td className="hidden px-5 py-3.5 text-muted-foreground md:table-cell">{emp.department}</td>
              <td className="hidden px-5 py-3.5 text-muted-foreground lg:table-cell">{emp.designation}</td>
              <td className="px-5 py-3.5">
                <Badge className={STATUS_BADGE_STYLES[emp.status]}>
                  {emp.status.replace("-", " ")}
                </Badge>
              </td>
              <td className="hidden px-5 py-3.5 text-muted-foreground sm:table-cell">
                {formatDate(emp.joiningDate)}
              </td>
              <td className="px-5 py-3.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${emp.name}`}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(emp)}>
                      <Eye className="h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(emp)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(emp)} className="text-destructive">
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
