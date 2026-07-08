import AppShell from "../components/layout/AppShell";
import CrmHome from "../features/crm/CrmHome";

export default function Home() {
  return (
    <AppShell>
      <CrmHome />
    </AppShell>
  );
}