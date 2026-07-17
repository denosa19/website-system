
`00_docs/DECISIONS.md` — komplett ersetzen

```md
# Decisions

> Diese Datei dokumentiert alle wichtigen Architektur- und Projektentscheidungen.
>
> Ziel:
>
> In Zukunft jederzeit nachvollziehen können, warum eine Entscheidung getroffen wurde.
>
> Entscheidungen werden grundsätzlich nicht gelöscht.
>
> Falls sie später geändert werden, wird eine neue Entscheidung ergänzt.

---

# Entscheidung 001

## Titel

Projekt wird als Monorepo entwickelt.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Das Projekt besteht aus mehreren Anwendungen.

Unter anderem:

- Dashboard
- Starter-System
- zukünftige weitere Apps

Ein Monorepo ermöglicht:

- gemeinsame Typen
- gemeinsame Komponenten
- gemeinsame Utilities
- einfache Wartung
- bessere Skalierbarkeit

## Konsequenzen

- gemeinsame Projektstruktur
- wiederverwendbarer Code
- einheitliche Architektur

---

# Entscheidung 002

## Titel

Next.js wird als Framework verwendet.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Next.js wird verwendet für:

- Dashboard
- Starter-Webseiten

Vorteile:

- moderne Architektur
- App Router
- Server Components
- gute Performance
- große Community

## Konsequenzen

- beide Anwendungen basieren auf Next.js
- Routing erfolgt über den App Router

---

# Entscheidung 003

## Titel

TypeScript ist verpflichtend.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Ziele:

- Typsicherheit
- weniger Fehler
- bessere Wartbarkeit
- bessere Skalierbarkeit

## Konsequenzen

- zentrale Typdefinitionen
- keine unnötigen `any`
- Datenmodelle werden typisiert

---

# Entscheidung 004

## Titel

Tailwind CSS wird für das Styling verwendet.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Ziele:

- einheitliches Designsystem
- keine unnötigen CSS-Dateien
- wiederverwendbare UI
- schnelle konsistente Umsetzung

## Konsequenzen

- Styling erfolgt über Tailwind CSS
- keine Inline-Styles
- keine unnötigen zusätzlichen CSS-Dateien

---

# Entscheidung 005

## Titel

Blockbasierte Entwicklung.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Das Projekt wird ausschließlich Block für Block entwickelt.

Ein Block wird vollständig abgeschlossen, bevor der nächste beginnt.

Dadurch entstehen:

- weniger Fehler
- klarere Commits
- bessere Dokumentation
- nachvollziehbare Entwicklung

## Konsequenzen

- immer nur ein aktiver Entwicklungsblock
- jeder Block erhält einen Test
- jeder Block erhält einen Commit
- Dokumentation wird nach jedem Block geprüft

---

# Entscheidung 006

## Titel

Das Repository ist die technische Wahrheit.

## Status

Aktiv

## Datum

2026-07-10

## Grund

Die Projektlogik darf nicht von einem einzelnen Chat abhängen.

Der aktuelle Code im Repository bildet gemeinsam mit der Dokumentation in `00_docs` den offiziellen Projektstand.

Chats dienen ausschließlich der Umsetzung und Abstimmung.

## Konsequenzen

- aktueller Repository-Code hat Vorrang vor alten Chatständen
- Dateien werden vor Änderungen aus dem Repository gelesen
- Projektstände werden nicht aus Erinnerung rekonstruiert

---

# Entscheidung 007

## Titel

Dokumentation ist verpflichtender Bestandteil des Projekts.

## Status

Aktiv

## Datum

2026-07-10

## Grund

Nach jedem abgeschlossenen Entwicklungsblock werden mindestens aktualisiert:

- `PROJECT_STATUS.md`
- `CHANGELOG.md`
- `NEXT_BLOCK.md`

Bei Bedarf zusätzlich:

- `ARCHITECTURE.md`
- `ROADMAP.md`
- `DECISIONS.md`

Dadurch bleibt der Projektstand jederzeit nachvollziehbar.

## Konsequenzen

- Dokumentation und Code bilden gemeinsam den offiziellen Projektstand
- neue Chats müssen die Dokumentation zuerst lesen
- abgeschlossene Blöcke werden dokumentiert

---

# Entscheidung 008

## Titel

Dashboard und Website-Engine bleiben getrennte Anwendungen.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Die interne Agentur-Software und die Kundenwebsite-Basis verfolgen unterschiedliche Ziele.

`apps/dashboard` ist das interne Agentur-Betriebssystem.

`apps/starter` ist die getrennte Website-Engine.

## Alternativen

- beide Bereiche in einer Anwendung entwickeln
- Starter-Komponenten direkt in das Dashboard integrieren

Diese Alternativen wurden nicht gewählt.

## Konsequenzen

- keine Vermischung von interner Software und Kundenwebsite
- aktueller Entwicklungsfokus liegt auf `apps/dashboard`
- `apps/starter` bleibt erhalten
- `apps/starter` wird nur bei bestätigtem Bedarf erweitert

---

# Entscheidung 009

## Titel

AI Studio bleibt aktuell das Werkzeug für die visuelle Website-Erstellung.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Die Agentur-Software soll Kundenwebseiten aktuell nicht selbst vollständig visuell gestalten.

Sie soll den Produktionsprozess vorbereiten und steuern.

## Konsequenzen

Internet Firma OS erzeugt und verwaltet insbesondere:

- Projektdaten
- Website-Checklisten
- Projektvorlagen
- AI-Studio-Prompts
- Modul-Prompts
- SEO-Daten
- spätere Automatisierungen

Eine direkte AI-Studio-Integration ist noch nicht vorhanden.

---

# Entscheidung 010

## Titel

Next.js App Router wird statt React Router verwendet.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Next.js enthält bereits ein geeignetes Routing-System.

Eine zusätzliche Routing-Bibliothek ist nicht erforderlich.

## Konsequenzen

- Hauptmodule erhalten eigene Verzeichnisse unter `app/`
- Navigation verwendet Next.js-Routen
- aktive Route wird über den aktuellen Pfad bestimmt

---

# Entscheidung 011

## Titel

Der Projekttyp gehört zum Projekt und nicht zum Kunden.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Ein Kunde kann mehrere Projekte unterschiedlicher Typen besitzen.

Beispiele:

- Firmenwebseite
- Landingpage
- Onlineshop
- Mitgliederportal
- Academy
- Blog

## Konsequenzen

- `Project` besitzt das Feld `type`
- `Customer` besitzt kein Projekt-Typ-Feld
- ein Kunde kann mehrere unterschiedliche Projekte erhalten

---

# Entscheidung 012

## Titel

Projekte werden über Kunden-IDs mit Kunden verknüpft.

## Status

Aktiv

## Datum

Nicht dokumentiert

## Grund

Der Kundenname soll nicht die einzige fachliche Verknüpfung zwischen Kunden und Projekten sein.

Eine stabile ID-Verknüpfung ist für spätere Funktionen notwendig.

## Konsequenzen

Projekte besitzen:

```text
customerId