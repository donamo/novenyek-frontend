import { Leaf, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuthStore } from "../stores/authStore";

export function NoAccessPage() {
  const navigate = useNavigate();
  const { user, loadUser, logout } = useAuthStore();

  useEffect(() => {
    if (!user) void loadUser();
  }, [loadUser, user]);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-10 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-lg content-center">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-leaf-700 text-white">
              <Leaf aria-hidden className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">NövényNapló</p>
              <h1 className="text-xl font-semibold">Nincs hozzáférés</h1>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted">
            Az azonosítás sikeres volt, de ehhez az alkalmazáshoz még nincs engedélyezve a fiókod.
          </p>
          {user?.email ? <p className="mt-3 text-sm font-medium">{user.email}</p> : null}
          <div className="mt-6">
            <Button variant="secondary" icon={<LogOut className="h-4 w-4" />} onClick={() => void handleLogout()}>
              Kijelentkezés
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
