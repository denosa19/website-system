# NEXT_BLOCK

Aktueller Stand

Version: 0.1

Zuletzt abgeschlossen:
Block 43

---

# Nächster Entwicklungsblock

## Block 44

Name:

Projektkommunikation

Status:

Bereit zur Umsetzung

---

# Ziel

Jedes Projekt erhält eine eigene Kommunikationshistorie.

Alle wichtigen Informationen sollen direkt am Projekt dokumentiert werden.

Dadurch entfällt die Kommunikation über externe Notizen oder Messenger.

---

# Funktionen

## Kommentare

- Kommentar hinzufügen
- Kommentare bearbeiten
- Kommentare löschen

---

## Projektnotizen

- Freitext
- Dauerhafte Notizen
- Beliebig viele Einträge

---

## Chronik

Automatische Einträge bei:

- Projekt erstellt
- Status geändert
- Priorität geändert
- Besitzer geändert
- Deadline geändert
- Projekt bearbeitet

---

## Zeitstempel

Jeder Eintrag besitzt:

- Datum
- Uhrzeit
- Benutzer
- Typ

---

## Darstellung

Neue Sektion auf der Projektdetailseite:

```
──────────────────────────────

Projektkommunikation

──────────────────────────────

Kommentar schreiben

[______________________]

[Speichern]

──────────────────────────────

Heute

Dennis

Projekt erstellt.

──────────────────────────────

Heute

Status geändert:

In Umsetzung

──────────────────────────────

Heute

Deadline geändert.

──────────────────────────────
```

---

# Architektur

Neue Komponenten

```
components/project/

ProjectComments.tsx

ProjectCommentItem.tsx

ProjectNotes.tsx

ProjectTimeline.tsx

TimelineItem.tsx
```

Neue Datentypen

```
types/

comment.ts

timeline.ts
```

Neue Beispieldaten

```
data/

comments.ts

timeline.ts
```

---

# Qualitätsregeln

- Wiederverwendbare Komponenten
- TypeScript Strict
- Responsive
- Keine Doppelentwicklungen
- Bestehende Architektur beibehalten

---

# Definition abgeschlossen

Nach Abschluss dieses Blocks wird Block 45 geplant.