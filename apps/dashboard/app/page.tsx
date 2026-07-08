import CrmPage from "../components/crm/CrmPage";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <CrmPage />
        </div>
      </div>
    </main>
  );
}