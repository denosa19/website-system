type StatCardProps = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 p-6">
      <h3 className="text-neutral-400">{label}</h3>
      <p className="mt-3 text-4xl font-bold">{value}</p>
    </div>
  );
}