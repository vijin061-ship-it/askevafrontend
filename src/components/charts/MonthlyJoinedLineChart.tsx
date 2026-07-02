import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Employee } from "@/types/employee";
import { useTheme } from "@/hooks/useTheme";

function lastTwelveMonths(): { key: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return months;
}

export function MonthlyJoinedLineChart({ employees }: { employees: Employee[] }) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#2a3040" : "#e5e7eb";
  const textColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  const months = lastTwelveMonths();
  const counts: Record<string, number> = {};
  months.forEach((m) => (counts[m.key] = 0));

  employees.forEach((emp) => {
    const d = new Date(emp.joiningDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in counts) counts[key] += 1;
  });

  const data = months.map((m) => ({ month: m.label, hires: counts[m.key] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Joined Employees</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: textColor }} />
            <YAxis tick={{ fontSize: 11, fill: textColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="hires"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
