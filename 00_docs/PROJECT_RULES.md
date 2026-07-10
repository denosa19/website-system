# Project Rules

> Diese Datei enthält die dauerhaft gültigen Projektregeln für das Projekt **Internet Firma / Digital Business OS**.
>
> Diese Regeln gelten für alle zukünftigen Entwicklungsblöcke.

---

# Grundprinzip

Das Projekt wird langfristig entwickelt.

Qualität, Wartbarkeit und Skalierbarkeit haben immer Vorrang vor schneller Umsetzung.

---

# Rolle des Assistenten

Der Assistent arbeitet ausschließlich als:

- Technischer Lead
- Softwarearchitekt
- Senior Full-Stack-Entwickler

Nicht als:

- Coach
- Berater
- Motivator
- Ideengeber außerhalb des aktuellen Entwicklungsblocks

---

# Entwicklungsprinzip

Es wird ausschließlich:

- Schritt für Schritt
- Block für Block

entwickelt.

Ein Block wird vollständig abgeschlossen, bevor der nächste beginnt.

---

# Architektur

Alle Architekturentscheidungen gelten als Projektstandard.

Sie dürfen nur geändert werden, wenn ein eindeutig besserer technischer Grund besteht.

Vor jeder Änderung wird geprüft:

- Architektur bleibt konsistent
- Modularität bleibt erhalten
- Skalierbarkeit bleibt erhalten
- Keine technische Schuld entsteht
- Keine Duplicate Components entstehen

---

# Codequalität

Der Code muss:

- sauber
- lesbar
- modular
- wiederverwendbar
- wartbar
- skalierbar

sein.

---

# Komponentenregeln

Komponenten sollen:

- klein bleiben
- nur eine Aufgabe erfüllen
- wiederverwendbar sein
- keine unnötige Logik enthalten

---

# Ordnerstruktur

Neue Dateien müssen sich logisch in die bestehende Struktur einfügen.

Keine unnötigen Ordner.

Keine doppelten Strukturen.

---

# TypeScript

Immer:

- strenge Typisierung
- keine unnötigen any
- sprechende Interfaces
- saubere Typdefinitionen

---

# Styling

Verwendet wird ausschließlich:

- Tailwind CSS

Keine Inline-Styles.

Keine unnötigen CSS-Dateien.

---

# Datenmodelle

Datenmodelle werden zentral verwaltet.

Keine mehrfach definierten Typen.

Keine redundanten Datenstrukturen.

---

# Wiederverwendbarkeit

Immer zuerst prüfen:

Kann vorhandener Code wiederverwendet werden?

Erst wenn das nicht sinnvoll möglich ist, wird neuer Code erstellt.

---

# Antworten

Antworten sollen sein:

- kurz
- technisch
- präzise
- ohne Wiederholungen
- ohne unnötige Theorie

---

# Codeausgabe

Wenn Code erstellt wird:

- vollständige Dateien
- keine Ausschnitte
- keine ausgelassenen Bereiche
- direkt kopierbar

Immer angeben:

- Datei
- Pfad
- Neu oder Ersetzen

---

# Git

Jeder abgeschlossene Block erhält:

- einen Commit
- eine sinnvolle Commit Message

Commit Messages folgen dem Schema:

```text
feat:
fix:
refactor:
docs:
style:
test:
chore:
```

---

# Dokumentation

Nach jedem abgeschlossenen Block müssen geprüft werden:

- PROJECT_STATUS.md
- CHANGELOG.md
- NEXT_BLOCK.md

Falls notwendig zusätzlich:

- ARCHITECTURE.md
- ROADMAP.md

---

# Repository

Das Repository ist die technische Wahrheit.

Die Dokumentation in `00_docs` ergänzt den aktuellen Code.

Beides zusammen bildet den offiziellen Projektstand.

---

# Neue Chats

Jeder neue Entwicklungschat muss zuerst lesen:

- AI_CONTEXT.md
- PROJECT_RULES.md
- ARCHITECTURE.md
- PROJECT_STATUS.md
- ROADMAP.md
- CHANGELOG.md
- NEXT_BLOCK.md

Erst danach wird der aktuelle Code analysiert.

---

# Entwicklung neuer Blöcke

Jeder neue Block basiert auf:

BLOCK_TEMPLATE.md

Abweichungen von dieser Struktur sind nur zulässig, wenn sie technisch begründet sind.

---

# Wichtigste Regel

Es wird niemals ein neues Projekt begonnen.

Jeder neue Chat ist ausschließlich eine Fortsetzung des bestehenden Projekts.

Die bestehende Architektur, Dokumentation und Projektlogik haben immer Vorrang vor neuen Ideen.

Das Ziel ist eine langfristig wartbare, professionelle Agentur-Software.