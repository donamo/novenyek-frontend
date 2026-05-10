import { useState } from "react";
import { api, type CurrentUser } from "../lib/api";
import { useAsyncData } from "../lib/useAsyncData";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/ui/Button";

export function SystemAdminPage() {
  const { user: me } = useAuthStore();
  const { data: users, isLoading, error, setData } = useAsyncData(() => api.getUsers());
  const [saving, setSaving] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function toggleEnabled(target: CurrentUser) {
    setSaving(target.id);
    setActionError(null);
    try {
      const updated = await api.setUserEnabled(target.id, !target.isEnabled);
      setData((prev) => prev?.map((u) => (u.id === updated.id ? updated : u)) ?? prev);
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Ismeretlen hiba.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Felhasználók kezelése</h2>

      {isLoading && <p className="text-muted">Betöltés...</p>}
      {(error ?? actionError) && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error ?? actionError}</p>
      )}

      {!isLoading && users && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Felhasználó</th>
                <th className="px-4 py-3">Szerepkör</th>
                <th className="px-4 py-3">Státusz</th>
                <th className="px-4 py-3 text-right">Művelet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.displayName ?? u.email}</div>
                    {u.displayName && <div className="text-xs text-muted">{u.email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {u.isAdmin ? (
                      <span className="inline-flex rounded-full bg-leaf-100 px-2 py-1 text-xs font-semibold text-leaf-800">
                        Admin
                      </span>
                    ) : (
                      <span className="text-muted">Felhasználó</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.isEnabled ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        Engedélyezett
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        Tiltott
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id === me?.id ? (
                      <span className="text-xs text-muted">Te vagy</span>
                    ) : (
                      <Button
                        variant={u.isEnabled ? "danger" : "secondary"}
                        disabled={saving === u.id}
                        onClick={() => void toggleEnabled(u)}
                      >
                        {saving === u.id ? "..." : u.isEnabled ? "Tiltás" : "Engedélyezés"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted">Nincsenek felhasználók.</p>
          )}
        </div>
      )}
    </div>
  );
}
