import { useMemo, useState } from "react";
import { customers as initialCustomers } from "../../../data/customers";
import type { Customer, CustomerStatus } from "../../../types/customer";

type StatusFilter = "Alle" | CustomerStatus;

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Alle");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.company.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.industry.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "Alle" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  function createCustomer(data: {
    company: string;
    contactPerson: string;
    email: string;
    phone: string;
    industry: string;
    status: CustomerStatus;
  }) {
    if (!data.company || !data.email) {
      alert("Bitte mindestens Firma und E-Mail eintragen.");
      return;
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      company: data.company,
      contactPerson: data.contactPerson || "Ansprechpartner",
      industry: data.industry,
      status: data.status,
      projects: 0,
      email: data.email,
      phone: data.phone,
    };

    setCustomers((current) => [newCustomer, ...current]);
    setSuccessMessage("Kunde wurde angelegt.");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  function deleteCustomer(customerId: string) {
    setCustomers((current) =>
      current.filter((customer) => customer.id !== customerId)
    );

    setSuccessMessage("Kunde wurde gelöscht.");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  return {
    customers,
    filteredCustomers,
    successMessage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    createCustomer,
    deleteCustomer,
  };
}