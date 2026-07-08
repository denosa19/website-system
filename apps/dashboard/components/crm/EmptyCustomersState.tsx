import Button from "../ui/Button";

export default function EmptyCustomersState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center">
      <h3 className="text-xl font-semibold">Noch keine Kunden</h3>

      <p className="mt-3 text-neutral-400">
        Lege deinen ersten Kunden an, um Projekte, Angebote und Websites zu verwalten.
      </p>

      <div className="mt-6">
        <Button>Ersten Kunden anlegen</Button>
      </div>
    </div>
  );
}