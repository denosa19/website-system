import type { Customer } from "../../types/customer";
import CustomerStatusBadge from "./CustomerStatusBadge";

type CustomerTableProps = {
  customers: Customer[];
  onDeleteCustomer: (customerId: string) => void;
};

export default function CustomerTable({
  customers,
  onDeleteCustomer,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800">
      <div className="grid grid-cols-6 border-b border-neutral-800 bg-neutral-900 px-6 py-4 text-sm text-neutral-400">
        <div>Kunde</div>
        <div>Branche</div>
        <div>Status</div>
        <div>Projekte</div>
        <div>E-Mail</div>
        <div>Aktion</div>
      </div>

      {customers.map((customer) => (
        <div
          key={customer.id}
          className="grid grid-cols-6 items-center border-b border-neutral-900 px-6 py-5 text-sm last:border-b-0 hover:bg-neutral-900"
        >
          <div>
            <div className="font-medium text-white">{customer.company}</div>
            <div className="text-xs text-neutral-500">
              {customer.contactPerson}
            </div>
          </div>

          <div className="text-neutral-400">{customer.industry}</div>

          <div>
            <CustomerStatusBadge status={customer.status} />
          </div>

          <div className="text-neutral-400">{customer.projects}</div>
          <div className="text-neutral-400">{customer.email}</div>

          <button
            onClick={() => onDeleteCustomer(customer.id)}
            className="text-left text-red-400 hover:text-red-300"
          >
            Löschen
          </button>
        </div>
      ))}
    </div>
  );
}