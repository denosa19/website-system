# Project Status

## Repository

- Repository: `denosa19/website-system`
- Branch: `main`

---

## Aktueller Stand

Die Agentur-Software ist als Monorepo aufgebaut.

### Anwendungen

- apps/dashboard
- apps/starter

---

## Bereits umgesetzt

### Grundlage

- Monorepo
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- GitHub
- Vercel

### Dashboard

- Dashboard
- Kundenübersicht
- Kundendetails
- Projektübersicht
- Projektdetails
- Aufgabenverwaltung
- Prioritäten
- Status
- Deadlines
- Fortschritt

### Datenmodelle

- Kunden

`00_docs/PROJECT_STATUS.md` — komplett ersetzen

```md
# Project Status

## Repository

- Repository: `denosa19/website-system`
- Branch: `main`
- Dokumentation: `00_docs`
- Hauptanwendung: `apps/dashboard`
- pausierte Website-Engine: `apps/starter`

---

## Aktueller Stand

Die Agentur-Software ist als Monorepo aufgebaut.

### Anwendungen

- `apps/dashboard`
- `apps/starter`

Der aktuelle Entwicklungsfokus liegt auf `apps/dashboard`.

`apps/starter` bleibt erhalten, wird aktuell jedoch nicht aktiv weiterentwickelt.

---

## Bereits umgesetzt

### Grundlage

- Monorepo
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- GitHub
- Vercel

### Layout und Navigation

- AppShell
- Sidebar
- Topbar
- zentrale Navigationskonfiguration
- klickbare Navigation
- aktive Route wird hervorgehoben
- getrennte App-Router-Seiten für Hauptmodule

### Vorhandene Routen

- `/`
- `/crm`
- `/projects`
- `/offers`
- `/ai`
- `/seo`
- `/websites`
- `/settings`

### Dashboard

- Dashboard-Übersicht
- Kennzahlen
- Aufgabenübersicht

### CRM

- zentrales Kundendatenmodell
- zentrale Kunden-Mockdaten
- Kundenübersicht
- Kundenstatus-Badges
- Kundenformular
- Kunden lokal anlegen
- Kunden suchen
- Kunden nach Status filtern
- Kunden lokal löschen
- Kundenlogik in `useCustomers` ausgelagert

### Bekannte Kunden

- Adler Gebäudetechnik
- iTouch Academy
- Rhein-Neckar Abriss

### Projektverwaltung

- zentrales Projektdatenmodell
- zentrale Projekt-Mockdaten
- Projekte anlegen
- Projekte suchen
- Projekte nach Status filtern
- Projekte lokal löschen
- Projektstatus bearbeiten
- Projektpriorität bearbeiten
- Projektfortschritt bearbeiten
- Tabellenansicht
- Kartenansicht
- Projektstatistiken
- Empty State
- Projekt auswählen
- Projekt-Detailansicht
- Projekt-Checkliste
- Aufgaben abhaken
- Projektphasen anzeigen
- Projekttyp auswählen
- projekttypabhängige Aufgaben automatisch erzeugen
- Projekte über `customerId` mit Kunden verknüpfen

### Bekannte Projekte

#### Adler Gebäudetechnik Website

- Kunde: Adler Gebäudetechnik
- Typ: Firmenwebseite
- Status: Umsetzung
- Priorität: Hoch
- Fortschritt: 65 %
- Deadline: 20.07.2026
- Verantwortlich: Dennis

#### iTouch Academy Relaunch

- Kunde: iTouch Academy
- Typ: Academy
- Status: Angebot
- Priorität: Normal
- Fortschritt: 20 %
- Deadline: 01.08.2026
- Verantwortlich: Dennis

### Website-Produktion

- AI-Studio-Projektprompt
- Prompt kopieren
- Prompt als Textdatei exportieren
- Website Wizard
- Eingaben für:
  - Farben
  - Designstil
  - Zielgruppe
  - Textton
  - besondere Funktionen
- projektbezogene Website-Module
- auswählbarer Modul-Workspace
- Modul-Dashboard
- modulspezifischer Prompt
- Modul-Prompt kopieren
- Modul-Prompt exportieren

### Website-Module

- Branding
- Seitenstruktur
- Texte
- SEO
- Bilder
- Deployment

### SEO

- SEO-Datenmodell
- SEO Workspace
- SEO Agent
- SEO Prompt
- SEO Prompt kopieren
- SEO Prompt exportieren
- SEO-Daten werden für jedes Projekt initialisiert

---

## Datenmodelle

Vorhandene zentrale Datenmodelle:

- Kunden
- Projekte
- Aufgaben
- Projektmodule
- SEO

---

## Aktuelle Datenhaltung

Aktuell verwendet:

- TypeScript-Mockdaten
- lokale React-States

Datenänderungen sind noch nicht dauerhaft gespeichert.

Nach einem Neustart oder Neuladen können lokale Änderungen verloren gehen.

---

## Aktuelle KI-Funktionen

Die aktuellen KI-Funktionen erzeugen spezialisierte Prompts.

Prompts können:

- angezeigt
- kopiert
- exportiert

werden.

Noch nicht vorhanden:

- direkte KI-API
- automatische KI-Ausführung
- Prompt-Historie
- persistente KI-Ergebnisse

---

## Noch nicht umgesetzt

- dauerhafte Datenbank
- Persistenz nach Neustart
- Authentifizierung
- Benutzerrollen
- Benutzerrechte
- direkte KI-API-Anbindung
- Datei-Uploads
- echte Dokumentenverwaltung
- CRM-Kundendetailroute
- eigene Projekt-Detailroute
- Angebote
- Rechnungen
- Verträge
- Wartungsverträge
- Domainverwaltung
- DNS-Verwaltung
- Hostingverwaltung
- Analytics
- Kundenportal
- Mitarbeiterverwaltung

---

## Letzter Commit

```text
feat: add seo workspace