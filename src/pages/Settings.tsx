import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { avatarColor, getInitials } from "@/utils/formatters";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile and application preferences." />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white ${avatarColor(
              user?.name ?? "U"
            )}`}
          >
            {getInitials(user?.name ?? "User")}
          </span>
          <div>
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-1 text-xs capitalize text-muted-foreground">{user?.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-mode">Dark mode</Label>
            <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
          </div>
          <Switch id="dark-mode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </CardContent>
      </Card>
    </div>
  );
}
