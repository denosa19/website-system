type CustomerCardProps = {
  company: string;
  industry: string;
  projects: number;
  email: string;
};

export default function CustomerCard({
  company,
  industry,
  projects,
  email,
}: CustomerCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:border-neutral-600">
      <h3 className="text-xl font-semibold">
        {company}
      </h3>

      <p className="mt-2 text-neutral-400">
        {industry}
      </p>

      <div className="mt-6 space-y-2 text-sm text-neutral-400">
        <p>{projects} Projekte</p>

        <p>{email}</p>
      </div>
    </div>
  );
}