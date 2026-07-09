import type { ProjectType } from "../types/project";

export const projectTemplates: Record<ProjectType, string[]> = {
  Firmenwebseite: [
    "Kundendaten prüfen",
    "Logo übernehmen",
    "Farben definieren",
    "Startseite erstellen",
    "Leistungen erstellen",
    "Kontaktseite erstellen",
    "Impressum & Datenschutz",
    "SEO Grundoptimierung",
    "Go Live vorbereiten",
  ],
  Landingpage: [
    "Zielgruppe definieren",
    "Hero Bereich erstellen",
    "Call-To-Action einbauen",
    "Kontaktformular einrichten",
    "SEO Grundoptimierung",
    "Go Live vorbereiten",
  ],
  Onlineshop: [
    "Produkte vorbereiten",
    "Zahlungsanbieter prüfen",
    "Warenkorb planen",
    "Checkout prüfen",
    "Versandinformationen ergänzen",
    "SEO Shop prüfen",
  ],
  Mitgliederportal: [
    "Login planen",
    "Benutzerrollen definieren",
    "Mitgliederbereich erstellen",
    "Buchungssystem prüfen",
    "Zahlungssystem prüfen",
  ],
  Academy: [
    "Trainerdaten prüfen",
    "Kurse strukturieren",
    "Buchungssystem planen",
    "Mitgliederbereich prüfen",
    "Online-Zahlung vorbereiten",
    "SEO Grundcheck",
  ],
  Blog: [
    "Blogstruktur planen",
    "Kategorien definieren",
    "Autoren anlegen",
    "SEO Vorlage erstellen",
    "Erste Beiträge vorbereiten",
  ],
};