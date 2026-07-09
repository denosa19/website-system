import type { ProjectModule } from "../types/module";

export const defaultModules: ProjectModule[] = [
  {
    id: "branding",
    title: "Branding",
    description: "Logo, Farben, Schriften",
    status: "Offen",
  },
  {
    id: "pages",
    title: "Seitenstruktur",
    description: "Alle Seiten und Navigation",
    status: "Offen",
  },
  {
    id: "content",
    title: "Texte",
    description: "Alle Inhalte der Website",
    status: "Offen",
  },
  {
    id: "seo",
    title: "SEO",
    description: "Meta Daten und Struktur",
    status: "Offen",
  },
  {
    id: "media",
    title: "Bilder",
    description: "Bilder und Grafiken",
    status: "Offen",
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Domain, Hosting und Go Live",
    status: "Offen",
  },
];