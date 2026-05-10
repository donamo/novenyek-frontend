import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { useAuthStore } from "../stores/authStore";
import { Home, Leaf, MapPinned, Settings, Sprout } from "lucide-react";

const navigation = [
  { to: "/", label: "Áttekintés", icon: Home },
  { to: "/plants", label: "Növények", icon: Sprout },
  { to: "/rooms", label: "Helyiségek", icon: MapPinned }
];

export function ProtectedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, loadUser, logout } = useAuthStore();

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas p-4 text-ink">
        <Card className="mx-auto mt-16 max-w-md">Belépés ellenőrzése...</Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user.isEnabled) {
    return <Navigate to="/no-access" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-leaf-700 text-white">
              <Leaf aria-hidden className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">NövényNapló</p>
              <h1 className="text-xl font-semibold">Otthoni növénygondozás</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex gap-2 overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                    {({ isActive }) => (
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                          isActive
                            ? "bg-leaf-700 text-white"
                            : "text-muted hover:bg-leaf-50 hover:text-leaf-700"
                        ].join(" ")}
                      >
                        <Icon aria-hidden className="h-4 w-4" />
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
              <span className="max-w-48 truncate text-sm text-muted">{user.displayName ?? user.email}</span>
              {user.isAdmin && (
                <Button
                  variant="secondary"
                  icon={<Settings className="h-4 w-4" />}
                  onClick={() => navigate("/system-admin")}
                >
                  Rendszeradmin
                </Button>
              )}
              <Button
                aria-label="Kijelentkezés"
                variant="ghost"
                icon={<LogOut className="h-4 w-4" />}
                onClick={() => void handleLogout()}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
