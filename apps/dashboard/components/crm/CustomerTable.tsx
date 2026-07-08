const customers = [
  {
    company: "Adler Gebäudetechnik",
    industry: "Handwerk",
    status: "Aktiv",
    projects: 1,
    email: "info@adlergebaudetechnik.de",
  },
  {
    company: "iTouch Academy",
    industry: "Sport / Academy",
    status: "Anfrage",
    projects: 1,
    email: "info@itouchacademy.com",
  },
  {
    company: "Rhein-Neckar Abriss",
    industry: "Dienstleistung",
    status: "Lead",
    projects: 0,
    email: "info@example.de",
  },
];

export default function CustomerTable() {
  return (
    <div className="rounded-2xl border border-neutral-800">
      <div className="grid grid-cols-5 border-b border-neutral-800 px-6 py-4 text-sm text-neutral-400">
        <div>Kunde</div>
        <div>Branche</div>
        <div>Status</div>
        <div>Projekte</div>
        <div>E-Mail</div>
      </div>

      {customers.map((customer) => (
        <div
          key={customer.company}
          className="grid grid-cols-5 px-6 py-5 text-sm hover:bg-neutral-900"
        >
          <div className="font-medium text-white">{customer.company}</div>
          <div className="text-neutral-400">{customer.industry}</div>
          <div className="text-neutral-400">{customer.status}</div>
          <div className="text-neutral-400">{customer.projects}</div>
          <div className="text-neutral-400">{customer.email}</div>
        </div>
      ))}
    </div>
  );
}