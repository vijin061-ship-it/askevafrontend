import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { STATUS_BADGE_STYLES } from "@/constants";
import { avatarColor, formatDate, getInitials } from "@/utils/formatters";
import type { Employee } from "@/types/employee";

interface ViewEmployeeDialogProps {
  employee: Employee | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewEmployeeDialog({ employee, onOpenChange }: ViewEmployeeDialogProps) {
  return (
    <Dialog open={!!employee} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {employee && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white ${avatarColor(
                    employee.name
                  )}`}
                >
                  {getInitials(employee.name)}
                </span>
                <div>
                  <DialogTitle>{employee.name}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{employee.designation}</p>
                </div>
              </div>
            </DialogHeader>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Field label="Email" value={employee.email} />

              <Field label="Department" value={employee.department} />
              <Field
                label="Status"
                value={
                  <Badge className={STATUS_BADGE_STYLES[employee.status]}>
                    {employee.status.replace("-", " ")}
                  </Badge>
                }
              />
              <Field label="Joined" value={formatDate(employee.joiningDate)} />
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
