import CustomerFilters from "./CustomerFilters";
import CustomerForm from "./CustomerForm";
import CustomerTable from "./CustomerTable";
import Button from "../ui/Button";

export default function CrmPage() {
  return (
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

      <div className="mt-8">
        <CustomerFilters />
      </div>

      <div className="mt-8">
        <CustomerTable />
      </div>
    </section>
  );
}