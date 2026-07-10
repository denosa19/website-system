# Decisions

> Diese Datei dokumentiert alle wichtigen Architektur- und Projektentscheidungen.
>
> Ziel:
>
> In Zukunft jederzeit nachvollziehen können,
> warum eine Entscheidung getroffen wurde.
>
> Entscheidungen werden grundsätzlich **nicht gelöscht**.
>
> Falls sie später geändert werden, wird eine neue Entscheidung ergänzt.

---

# Entscheidung 001

## Titel

Projekt wird als Monorepo entwickelt.

## Status

Aktiv

## Datum

YYYY-MM-DD

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

- Gemeinsame Projektstruktur
- Wiederverwendbarer Code
- Einheitliche Architektur

---

# Entscheidung 002

## Titel

Next.js als Framework

## Status

Aktiv

## Datum

YYYY-MM-DD

## Grund

Verwendet für:

- Dashboard
- Starter-Webseiten

Vorteile:

- moderne Architektur
- App Router
- Server Components
- gute Performance
- große Community

---

# Entscheidung 003

## Titel

TypeScript verpflichtend

## Status

Aktiv

## Datum

YYYY-MM-DD

## Grund

Ziele:

- Typsicherheit
- weniger Fehler
- bessere Wartbarkeit
- bessere Skalierbarkeit

---

# Entscheidung 004

## Titel

Tailwind CSS

## Status

Aktiv

## Datum

YYYY-MM-DD

## Grund

Einheitliches Designsystem.

Keine unnötigen CSS-Dateien.

Wiederverwendbare UI.

---

# Entscheidung 005

## Titel

Blockbasierte Entwicklung

## Status

Aktiv

## Datum

YYYY-MM-DD

## Grund

Das Projekt wird ausschließlich Block für Block entwickelt.

Ein Block wird vollständig abgeschlossen bevor der nächste beginnt.

Dadurch entstehen:

- weniger Fehler
- klarere Commits
- bessere Dokumentation
- nachvollziehbare Entwicklung

---

# Entscheidung 006

## Titel

Repository ist die technische Wahrheit

## Status

Aktiv

## Datum

YYYY-MM-DD

## Grund

Die Projektlogik darf nicht von einem einzelnen Chat abhängen.

Deshalb gilt:

Der aktuelle Code im Repository bildet gemeinsam mit der Dokumentation in `00_docs` den offiziellen Projektstand.

Chats dienen ausschließlich der Umsetzung.

---

# Entscheidung 007

## Titel

Dokumentation ist verpflichtender Bestandteil des Projekts

## Status

Aktiv

## Datum

YYYY-MM-DD

## Grund

Nach jedem abgeschlossenen Entwicklungsblock werden mindestens aktualisiert:

- PROJECT_STATUS.md
- CHANGELOG.md
- NEXT_BLOCK.md

Bei Bedarf zusätzlich:

- ARCHITECTURE.md
- ROADMAP.md
- DECISIONS.md

Dadurch bleibt der Projektstand jederzeit nachvollziehbar.

---

# Vorlage für zukünftige Entscheidungen

---

# Entscheidung XXX

## Titel

...

## Status

Aktiv | Ersetzt | Veraltet

## Datum

YYYY-MM-DD

## Grund

Warum wurde diese Entscheidung getroffen?

## Alternativen

Welche Alternativen wurden betrachtet?

## Konsequenzen

Welche Auswirkungen hat diese Entscheidung?

## Ersetzt durch

Falls später geändert:

Entscheidung XXX