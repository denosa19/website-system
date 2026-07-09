"use client";

import { useState } from "react";
import type { CustomerStatus } from "../../../types/customer";

type Props = {
  onCreate: (customer: {
    company: string;
    contactPerson: string;
    email: string;
    phone: string;
    industry: string;
    status: CustomerStatus;
  }) => void;
};

export default function CustomerForm({ onCreate }: Props) {
  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "Handwerk",
    status: "Lead" as CustomerStatus,
  });

  function update(field: string, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit() {
    onCreate(formData);

    setFormData({
      company: "",
      contactPerson: "",
      email: "",
      phone: "",
      industry: "Handwerk",
      status: "Lead",
    });
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-2xl font-bold">Neuen Kunden anlegen</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          value={formData.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Firma"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <input
          value={formData.contactPerson}
          onChange={(e) => update("contactPerson", e.target.value)}
          placeholder="Ansprechpartner"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <input
          value={formData.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="E-Mail"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <input
          value={formData.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Telefon"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <button
          onClick={submit}
          className="col-span-2 rounded-xl bg-white py-3 font-semibold text-black"
        >
          Kunde anlegen
        </button>
      </div>
    </div>
  );
}