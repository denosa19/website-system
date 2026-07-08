import CustomerForm from "../components/crm/CustomerForm";
import CustomerTable from "../components/crm/CustomerTable";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <section className="flex-1 p-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold">Kunden</h2>
                <p className="mt-3 text-neutral-400">
                  Verwalte alle Kunden, Leads und laufenden Geschäftsbeziehungen.
                </p>
              </div>

              <Button>+ Neuer Kunde</Button>
            </div>

            <div className="mt-8">
              <CustomerForm />
            </div>

            <div className="mt-8 flex gap-4">
              <Input placeholder="Kunden suchen..." className="w-full max-w-md" />

              <Select>
                <option>Alle Status</option>
                <option>Lead</option>
                <option>Anfrage</option>
                <option>Aktiv</option>
              </Select>
            </div>

            <div className="mt-8">
              <CustomerTable />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}