import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Employee } from "@/types/employee";
import { useTheme } from "@/hooks/useTheme";

function lastSixMonths(): { key: string; label: string; ts: number }[] {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      ts: d.getTime(),
    });
  }
  return months;
}

export function DepartmentGrowthAreaChart({ employees }: { employees: Employee[] }) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#2a3040" : "#e5e7eb";
  const textColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  const months = lastSixMonths();
  const data = months.map((m) => {
    const cumulative = employees.filter(
      (emp) => new Date(emp.joiningDate).getTime() <= m.ts + 31 * 86_400_000
    ).length;
    return { month: m.label, headcount: cumulative };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Headcount Growth</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="headcount"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#growthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
