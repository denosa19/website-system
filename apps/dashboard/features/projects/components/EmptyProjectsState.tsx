export default function EmptyProjectsState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center">
      <h3 className="text-xl font-semibold">Keine Projekte gefunden</h3>

      <p className="mt-3 text-neutral-400">
        Passe die Suche oder den Filter an oder lege ein neues Projekt an.
      </p>
    </div>
  );
}