# Architecture

## Projektart

Interne Agentur-Software für die Verwaltung und spätere Automatisierung einer Webagentur.

Das System wird als **Internet Firma / Digital Business OS** entwickelt.

---

## Repository

Monorepo

```text
website-system/
├── 00_docs/
├── apps/
│   ├── dashboard/
│   └── starter/
├── packages/ (optional zukünftig)
└── weitere Projektdateien
```

---

## Anwendungen

### apps/dashboard

Interne Agentur-Software.

Zweck:

- Dashboard
- Kundenverwaltung
- Projektverwaltung
- Aufgabenverwaltung
- SEO Workspace
- spätere Business-Module

---

### apps/starter

Starter-System für Kundenwebseiten.

Zweck:

- wiederverwendbare Website-Basis
- Standard-Komponenten
- schnelle Erstellung neuer Kundenprojekte

---

## Technischer Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- GitHub
- Vercel
- Monorepo

---

## Architekturprinzipien

- Modular
- Skalierbar
- Wiederverwendbare Komponenten
- Trennung von UI, Daten und Logik
- Keine Duplicate Components
- Klare Ordnerstruktur
- Langfristig wartbar

---

## Datenhaltung

Aktuell werden Daten über TypeScript-Datenmodelle verwaltet.

Bekannte Bereiche:

- Kunden
- Projekte
- Aufgaben
- SEO

---

## Entwicklungsregel

Der aktuelle Code ist die technische Wahrheit.

Diese Datei beschreibt ausschließlich bestätigte Architekturentscheidungen.