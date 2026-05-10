import { Route, Routes } from "react-router-dom";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NoAccessPage } from "./pages/NoAccessPage";
import { PlantDetailPage } from "./pages/PlantDetailPage";
import { SystemAdminPage } from "./pages/SystemAdminPage";
import { PlantsPage } from "./pages/PlantsPage";
import { RoomsPage } from "./pages/RoomsPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login.html" element={<LoginPage />} />
      <Route path="/no-access" element={<NoAccessPage />} />
      <Route path="/no-access.html" element={<NoAccessPage />} />
      <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/:plantId" element={<PlantDetailPage />} />
          <Route path="/system-admin" element={<SystemAdminPage />} />
      </Route>
    </Routes>
  );
}
