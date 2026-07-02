import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { EmployeeForm } from "@/components/forms/EmployeeForm";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import type { Employee } from "@/types/employee";
import type { EmployeeFormValues } from "@/validations/employeeSchema";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
}

export function EmployeeDialog({ open, onOpenChange, employee }: EmployeeDialogProps) {
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (values: EmployeeFormValues) => {
    if (employee) {
      updateMutation.mutate(
        { id: employee.id, input: values },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit employee" : "Add new employee"}</DialogTitle>
          <DialogDescription>
            {employee
              ? "Update this employee's details below."
              : "Fill in the details to add a new employee to your organization."}
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm
          defaultValues={employee}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
