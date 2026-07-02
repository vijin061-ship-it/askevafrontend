import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const navigate = useNavigate();

  const handleGlobalSearchChange = (value: string) => {
    setGlobalSearch(value);
    if (value.trim()) {
      navigate(`/employees?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          globalSearch={globalSearch}
          onGlobalSearchChange={handleGlobalSearchChange}
        />
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
