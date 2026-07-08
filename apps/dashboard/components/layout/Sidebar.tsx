const navigation = [
  "Dashboard",
  "Kunden",
  "Projekte",
  "Websites",
  "KI Center",
  "Angebote",
  "SEO",
  "Wartung",
  "Einstellungen",
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-neutral-800 bg-neutral-950 p-6">
      <h1 className="mb-10 text-2xl font-bold">Internet Firma OS</h1>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <button
            key={item}
            className="w-full rounded-xl px-4 py-3 text-left text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}