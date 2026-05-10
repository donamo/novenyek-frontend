import { AlertTriangle, CheckCircle2, Leaf, ListTodo, Wifi } from "lucide-react";
import { useQuery } from "@apollo/client";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
import { useAsyncData } from "../lib/useAsyncData";
import { API_STATUS_QUERY } from "../graphql/status";

const summaryItems = [
  { key: "totalPlants", label: "Összes növény", icon: Leaf },
  { key: "goodPlants", label: "Jó állapot", icon: CheckCircle2 },
  { key: "watchPlants", label: "Figyelendő", icon: ListTodo },
  { key: "badPlants", label: "Problémás", icon: AlertTriangle }
] as const;

export function DashboardPage() {
  const dashboard = useAsyncData(() => api.getDashboard(), []);
  const status = useQuery<{ apiStatus: string }>(API_STATUS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted">Áttekintés</p>
        <h2 className="text-2xl font-semibold">Mai növényállapot</h2>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          const value = dashboard.data?.[item.key] ?? 0;
          return (
            <Card key={item.key} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-1 text-3xl font-semibold">{value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-leaf-50 text-leaf-700">
                <Icon aria-hidden className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <h3 className="text-lg font-semibold">Havi státusz hiányzik</h3>
          <p className="mt-2 text-4xl font-semibold">{dashboard.data?.missingMonthlyStatus ?? 0}</p>
          <p className="mt-2 text-sm text-muted">
            Ezeknél a növényeknél érdemes havi állapotot rögzíteni és szükség esetén fotót feltölteni.
          </p>
          {dashboard.error ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">
              REST kapcsolat hiba: {dashboard.error}
            </p>
          ) : null}
        </Card>

        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-leaf-50 text-leaf-700">
            <Wifi aria-hidden className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Backend kapcsolat</h3>
            <p className="mt-1 text-sm text-muted">REST: {api.baseUrl}</p>
            <p className="mt-1 text-sm text-muted">
              GraphQL: {status.data?.apiStatus ?? (status.loading ? "Ellenőrzés..." : "Nem elérhető")}
            </p>
            {status.error ? <p className="mt-2 text-sm text-red-700">{status.error.message}</p> : null}
          </div>
        </Card>
      </section>
    </div>
  );
}
