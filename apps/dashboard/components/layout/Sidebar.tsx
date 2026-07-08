const items = [
  "Dashboard",
  "Kunden",
  "Projekte",
  "Websites",
  "KI",
  "Angebote",
  "SEO",
  "Einstellungen",
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-neutral-800 bg-neutral-950 p-6">
      <h1 className="mb-10 text-2xl font-bold">
        Internet Firma OS
      </h1>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item}
            className="w-full rounded-lg px-4 py-3 text-left transition hover:bg-neutral-900"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}