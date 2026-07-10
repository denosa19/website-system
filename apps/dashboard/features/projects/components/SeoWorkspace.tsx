"use client";

import type { SeoData } from "../../../types/seo";

type Props = {
  seo: SeoData;
};

export default function SeoWorkspace({ seo }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

      <h3 className="text-xl font-bold">
        SEO Workspace
      </h3>

      <div className="mt-6 grid gap-4">

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">
            Hauptkeyword
          </p>

          <p className="mt-2">
            {seo.mainKeyword || "Noch nicht erstellt"}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">
            Meta Title
          </p>

          <p className="mt-2">
            {seo.metaTitle || "Noch nicht erstellt"}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">
            Meta Description
          </p>

          <p className="mt-2">
            {seo.metaDescription || "Noch nicht erstellt"}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">
            H1
          </p>

          <p className="mt-2">
            {seo.h1 || "Noch nicht erstellt"}
          </p>
        </div>

      </div>

    </div>
  );
}