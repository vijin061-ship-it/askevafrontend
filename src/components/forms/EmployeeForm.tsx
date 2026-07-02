import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { employeeSchema, type EmployeeFormValues } from "@/validations/employeeSchema";
import { DEPARTMENTS, DESIGNATIONS, STATUS_OPTIONS } from "@/constants";
import type { Employee } from "@/types/employee";

interface EmployeeFormProps {
  defaultValues?: Employee;
  isSubmitting?: boolean;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
}

export function EmployeeForm({ defaultValues, isSubmitting, onSubmit, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          email: defaultValues.email,
          department: defaultValues.department as EmployeeFormValues["department"],
          designation: defaultValues.designation as EmployeeFormValues["designation"],
          joiningDate: defaultValues.joiningDate.slice(0, 10),
          status: defaultValues.status,
        }
      : {
          name: "",
          email: "",
          joiningDate: new Date().toISOString().slice(0, 10),
          status: "active",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jane Cooper" error={!!errors.name} {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="jane@company.com" error={!!errors.email} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="department">Department</Label>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="designation">Designation</Label>
          <Controller
            control={control}
            name="designation"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="designation">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGNATIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.designation && <p className="text-xs text-destructive">{errors.designation.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="joiningDate">Joining date</Label>
          <Input id="joiningDate" type="date" error={!!errors.joiningDate} {...register("joiningDate")} />
          {errors.joiningDate && <p className="text-xs text-destructive">{errors.joiningDate.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {defaultValues ? "Save changes" : "Add employee"}
        </Button>
      </div>
    </form>
  );
}
