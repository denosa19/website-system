# CHANGELOG

Version: 0.1

Alle relevanten Änderungen am Projekt werden hier dokumentiert.

---

# Block 44

Status:
Abgeschlossen

## Neue Funktion

Projekte besitzen jetzt einen eigenen Kommunikationsbereich auf der Projektdetailseite.

## Hinzugefügt

- Projektkommentare
- Projekt-Timeline
- Automatische Aktivitätseinträge
- Gemeinsame Verwaltung von Kommentaren und Aktivitäten
- Projektbezogene lokale Speicherung
- Chronologische Sortierung
- Zeitstempel
- Benutzerzuordnung
- Kommentarvalidierung
- Leere Zustände
- Kommentar- und Ereigniszähler

## Kommentare

Kommentare können direkt innerhalb eines Projekts hinzugefügt werden.

Jeder Kommentar besitzt:

- Projektzuordnung
- Autor
- Inhalt
- Erstellungszeitpunkt
- optionalen Bearbeitungszeitpunkt

Beim Hinzufügen eines Kommentars wird automatisch ein passender Timeline-Eintrag erzeugt.

## Timeline

Die Timeline stellt den bisherigen Projektverlauf chronologisch dar.

Unterstützte Ereignistypen:

- Projekt erstellt
- Kommentar hinzugefügt
- Projekt aktualisiert
- Status geändert
- Priorität geändert
- Besitzer geändert
- Deadline geändert

Jeder Timeline-Eintrag besitzt:

- Projektzuordnung
- Ereignistyp
- Titel
- optionale Beschreibung
- Benutzer
- Datum und Uhrzeit

## Aktivitäts-Engine

Eine zentrale Aktivitäts-Engine wurde eingeführt.

Datei:

```text
apps/dashboard/src/lib/projectActivity.ts