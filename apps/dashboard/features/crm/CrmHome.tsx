"use client";

import { useState } from "react";
import { customers as initialCustomers } from "../../data/customers";
import type { Customer, CustomerStatus } from "../../types/customer";
import CustomerTable from "../../components/crm/CustomerTable";

export default function CrmHome() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "Handwerk",
    status: "Lead" as CustomerStatus,
  });

  function updateField(field: string, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createCustomer() {
    if (!formData.company || !formData.email) {
      alert("Bitte mindestens Firma und E-Mail eintragen.");
      return;
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      company: formData.company,
      contactPerson: formData.contactPerson || "Ansprechpartner",
      industry: formData.industry,
      status: formData.status,
      projects: 0,
      email: formData.email,
      phone: formData.phone,
    };

    setCustomers((current) => [newCustomer, ...current]);

    setFormData({
      company: "",
      contactPerson: "",
      email: "",
      phone: "",
      industry: "Handwerk",
      status: "Lead",
    });

    setSuccessMessage("Kunde wurde angelegt.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Kunden</h1>
          <p className="mt-3 text-neutral-400">
            Verwalte Leads, Kunden und laufende Geschäftsbeziehungen.
          </p>
        </div>

        <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
          + Neuer Kunde
        </button>
      </div>

      {successMessage && (
        <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
          {successMessage}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-2xl font-bold">Neuen Kunden anlegen</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            placeholder="Firma"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
          />

          <input
            value={formData.contactPerson}
            onChange={(event) =>
              updateField("contactPerson", event.target.value)
            }
            placeholder="Ansprechpartner"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
          />

          <input
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="E-Mail"
            type="email"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
          />

          <input
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Telefon"
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
          />

          <select
            value={formData.industry}
            onChange={(event) => updateField("industry", event.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
          >
            <option>Handwerk</option>
            <option>Dienstleistung</option>
            <option>Sport / Academy</option>
            <option>Immobilien</option>
            <option>Sonstiges</option>
          </select>

          <select
            value={formData.status}
            onChange={(event) =>
              updateField("status", event.target.value as CustomerStatus)
            }
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
          >
            <option>Lead</option>
            <option>Anfrage</option>
            <option>Aktiv</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={createCustomer}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Kunde anlegen
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <input
          placeholder="Kunden suchen..."
          className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none"
        />

        <select className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none">
          <option>Alle Status</option>
          <option>Lead</option>
          <option>Anfrage</option>
          <option>Aktiv</option>
        </select>
      </div>

      <div className="mt-8">
        <CustomerTable customers={customers} />
      </div>
    </section>
  );
}