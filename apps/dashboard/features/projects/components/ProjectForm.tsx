"use client";

import { useState } from "react";
import type { ProjectPriority, ProjectStatus } from "../../../types/project";

type Props = {
  onCreate: (project: {
    title: string;
    customer: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    deadline: string;
    owner: string;
  }) => void;
};

export default function ProjectForm({ onCreate }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    customer: "",
    status: "Anfrage" as ProjectStatus,
    priority: "Normal" as ProjectPriority,
    deadline: "",
    owner: "Dennis",
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
      title: "",
      customer: "",
      status: "Anfrage",
      priority: "Normal",
      deadline: "",
      owner: "Dennis",
    });
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-2xl font-bold">Neues Projekt</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          value={formData.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Projektname"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <input
          value={formData.customer}
          onChange={(e) => update("customer", e.target.value)}
          placeholder="Kunde"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <select
          value={formData.status}
          onChange={(e) => update("status", e.target.value as ProjectStatus)}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        >
          <option>Anfrage</option>
          <option>Angebot</option>
          <option>Umsetzung</option>
          <option>Prüfung</option>
          <option>Online</option>
          <option>Wartung</option>
        </select>

        <select
          value={formData.priority}
          onChange={(e) => update("priority", e.target.value as ProjectPriority)}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        >
          <option>Niedrig</option>
          <option>Normal</option>
          <option>Hoch</option>
        </select>

        <input
          value={formData.deadline}
          onChange={(e) => update("deadline", e.target.value)}
          type="date"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />

        <input
          value={formData.owner}
          onChange={(e) => update("owner", e.target.value)}
          placeholder="Verantwortlicher"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={submit}
          className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
        >
          Projekt anlegen
        </button>
      </div>
    </div>
  );
}