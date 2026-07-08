import { customers } from "../../data/customers";
import CustomerStatusBadge from "./CustomerStatusBadge";

export default function CustomerTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800">
      <div className="grid grid-cols-5 border-b border-neutral-800 bg-neutral-900 px-6 py-4 text-sm text-neutral-400">
        <div>Kunde</div>
        <div>Branche</div>
        <div>Status</div>
        <div>Projekte</div>
        <div>E-Mail</div>
      </div>

      {customers.map((customer) => (
        <div
          key={customer.id}
          className="grid grid-cols-5 items-center border-b border-neutral-900 px-6 py-5 text-sm last:border-b-0 hover:bg-neutral-900"
        >
          <div>
            <div className="font-medium text-white">{customer.company}</div>
            <div className="text-xs text-neutral-500">{customer.contactPerson}</div>
          </div>

          <div className="text-neutral-400">{customer.industry}</div>

          <div>
            <CustomerStatusBadge status={customer.status} />
          </div>

          <div className="text-neutral-400">{customer.projects}</div>
          <div className="text-neutral-400">{customer.email}</div>
        </div>
      ))}
    </div>
  );
}