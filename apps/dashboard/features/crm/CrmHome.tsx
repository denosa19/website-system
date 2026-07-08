import CustomerTable from "../../components/crm/CustomerTable";

export default function CrmHome() {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Kunden</h1>
          <p className="mt-3 text-neutral-400">
            Verwalte Leads, Kunden und laufende Geschäftsbeziehungen.
          </p>
        </div>

        <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
          + Neuer Kunde
        </button>
      </div>

      <div className="mt-8 flex gap-4">
        <input
          placeholder="Kunden suchen..."
          className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none"
        />

        <select className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none">
          <option>Alle Status</option>
          <option>Lead</option>
          <option>Anfrage</option>
          <option>Aktiv</option>
        </select>
      </div>

      <div className="mt-8">
        <CustomerTable />
      </div>
    </section>
  );
}