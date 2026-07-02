import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Employee } from "@/types/employee";

const COLORS: Record<string, string> = {
  active: "hsl(152 60% 36%)",
  inactive: "hsl(0 72% 51%)",
  "on-leave": "hsl(38 92% 50%)",
};

const LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
};

export function StatusPieChart({ employees }: { employees: Employee[] }) {
  const counts = employees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.status] = (acc[emp.status] ?? 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).map(([status, value]) => ({
    name: LABELS[status] ?? status,
    value,
    key: status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={COLORS[entry.key]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
