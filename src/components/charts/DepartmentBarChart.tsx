import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Employee } from "@/types/employee";
import { useTheme } from "@/hooks/useTheme";

export function DepartmentBarChart({ employees }: { employees: Employee[] }) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#2a3040" : "#e5e7eb";
  const textColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  const counts = employees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.department] = (acc[emp.department] ?? 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department-wise Headcount</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="department"
              tick={{ fontSize: 11, fill: textColor }}
              angle={-20}
              textAnchor="end"
              height={50}
              interval={0}
            />
            <YAxis tick={{ fontSize: 11, fill: textColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
