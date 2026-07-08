import type { CustomerStatus } from "../../types/customer";

type CustomerStatusBadgeProps = {
  status: CustomerStatus;
};

const styles = {
  Lead: "bg-neutral-800 text-neutral-300",
  Anfrage: "bg-blue-500/10 text-blue-300",
  Aktiv: "bg-green-500/10 text-green-300",
};

export default function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}