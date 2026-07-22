# Next Block

## Ausgangspunkt

Der aktuelle Projektstand entspricht:

```text
Release 0.9
Block 42 abgeschlossen
### Geplanter Umfang

Bearbeitbar werden:

- Projektname
- Kunde
- Projekttyp
- Status
- Priorität
- Deadline
- Verantwortlicher

Zusätzlich:

- Änderungen werden direkt in den LocalStorage übernommen
- Projekt-ID bleibt unverändert
- Aufgaben bleiben vollständig erhalten
- Module bleiben vollständig erhalten
- SEO-Daten bleiben vollständig erhalten
- Bearbeitungsmodus öffnen
- Änderungen speichern
- Änderungen abbrechen
- Pflichtfelder validieren
- bestehende Projektmigration weiterverwenden

---

### Technische Anforderungen

Die Umsetzung soll:

- den bestehenden `Project`-Typ weiterverwenden
- keine neuen Datenmodelle einführen
- ausschließlich auf der Projekt-Detailroute arbeiten
- bestehende LocalStorage-Funktionen weiterverwenden
- keine bestehenden Funktionen der Projektübersicht entfernen
- vollständig kompatibel mit vorhandenen Projekten bleiben

---

### Nicht Bestandteil dieses Blocks

- Fortschrittsberechnung ändern
- Aufgaben hinzufügen
- Aufgaben löschen
- Aufgaben umbenennen
- Module bearbeiten
- SEO bearbeiten
- Aktivitätsprotokoll
- Projektnotizen
- Dateiverwaltung
- Datenbank
- Authentifizierung
- Mehrbenutzerbetrieb
### Ergebnis nach Abschluss

Nach Block 43 soll ein Projekt vollständig auf seiner eigenen Detailseite bearbeitet werden können.

Die Projektübersicht dient anschließend hauptsächlich als Navigation, während die eigentliche Projektpflege auf der Detailroute erfolgt.

Alle Änderungen werden dauerhaft im LocalStorage gespeichert und stehen nach einem Neuladen der Anwendung weiterhin zur Verfügung.

Die bestehende Projekt-ID bleibt unverändert, damit zukünftige Funktionen wie Aufgabenverwaltung, Notizen, Dateien und Aktivitätsprotokoll auf derselben Projektbasis aufbauen können.

---

### Akzeptanzkriterien

Der Block gilt als abgeschlossen, wenn:

- Projektname bearbeitet werden kann
- Kunde bearbeitet werden kann
- Projekttyp bearbeitet werden kann
- Status bearbeitet werden kann
- Priorität bearbeitet werden kann
- Deadline bearbeitet werden kann
- Verantwortlicher bearbeitet werden kann
- Speichern funktioniert
- Abbrechen funktioniert
- Änderungen nach Reload erhalten bleiben
- Projekt-ID unverändert bleibt
- Aufgaben unverändert bleiben
- Module unverändert bleiben
- Bestehende Projekte weiterhin korrekt geladen werden

---

### Status

```text
Bereit zur Umsetzung
```