import { Chrome, Leaf } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export function LoginPage() {
  const location = useLocation();
  const { user, isLoading, loadUser } = useAuthStore();
  const from = typeof location.state?.from === "string" ? location.state.from : "/";

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  if (!isLoading && user?.isEnabled) {
    return <Navigate to={from} replace />;
  }

  if (!isLoading && user && !user.isEnabled) {
    return <Navigate to="/no-access" replace />;
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-10 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md content-center">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-leaf-700 text-white">
              <Leaf aria-hidden className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">NövényNapló</p>
              <h1 className="text-xl font-semibold">Bejelentkezés</h1>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <p className="text-sm text-muted">
              Google fiókkal lehet belépni. A növények oldalak csak engedélyezett felhasználóknak nyílnak meg.
            </p>
            <Button
              icon={<Chrome className="h-4 w-4" />}
              onClick={() => {
                window.location.href = api.getGoogleLoginUrl(window.location.origin);
              }}
            >
              Belépés Google-lal
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
