import { Users, UserCheck, UserX, Building2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/charts/KpiCard";
import { DepartmentBarChart } from "@/components/charts/DepartmentBarChart";
import { StatusPieChart } from "@/components/charts/StatusPieChart";
import { MonthlyJoinedLineChart } from "@/components/charts/MonthlyJoinedLineChart";
import { DepartmentGrowthAreaChart } from "@/components/charts/DepartmentGrowthAreaChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useEmployeeAnalytics } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: employees, isLoading, isError, refetch } = useEmployeeAnalytics();

  const total = employees?.length ?? 0;
  const active = employees?.filter((e) => e.status === "active").length ?? 0;
  const inactive = employees?.filter((e) => e.status === "inactive").length ?? 0;
  const departments = new Set(employees?.map((e) => e.department)).size;
  const now = new Date();
  const newThisMonth =
    employees?.filter((e) => {
      const d = new Date(e.joiningDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"} 👋`}
        description="Here's what's happening with your team today."
      />

      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isError && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
              : (
                <>
                  <KpiCard label="Total Employees" value={total} icon={Users} accent="primary" />
                  <KpiCard label="Active" value={active} icon={UserCheck} accent="success" />
                  <KpiCard label="Inactive" value={inactive} icon={UserX} accent="destructive" />
                  <KpiCard label="Departments" value={departments} icon={Building2} accent="warning" />
                  <KpiCard label="New This Month" value={newThisMonth} icon={UserPlus} accent="primary" />
                </>
              )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <DepartmentBarChart employees={employees ?? []} />
              <StatusPieChart employees={employees ?? []} />
              <MonthlyJoinedLineChart employees={employees ?? []} />
              <DepartmentGrowthAreaChart employees={employees ?? []} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
