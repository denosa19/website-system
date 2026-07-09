import AppShell from "../components/layout/AppShell";
import DashboardHome from "../features/dashboard/DashboardHome";

export default function Home() {
  return (
    <AppShell>
      <DashboardHome />
    </AppShell>
  );
}