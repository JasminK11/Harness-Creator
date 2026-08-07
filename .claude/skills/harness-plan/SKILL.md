---
name: harness-plan
description: Entscheidet, WAS gebaut wird. Führt das Planungsgespräch für ein neues Projekt, bevor Code entsteht — klärt Zuschnitt, Abnahmekriterien, Architektur und Prüfverfahren und schreibt daraus eine PLAN.md. Nutzen bei "ich will ein Projekt planen", "neues Projekt besprechen", "lass uns ein Projekt aufsetzen", "wie fange ich das an", "ich habe eine Idee für ein Projekt", "Projekt durchdenken", "was muss ich vorher entscheiden", "/harness-plan". Wählt selbst keine Bausteine aus und installiert nichts — sobald es um Skills, Agents oder Hooks geht, ist /harness-build dran; um die Bibliothek selbst kümmert sich /harness-update.
---

# /harness-plan — Ein neues Projekt planen, bevor die erste Zeile entsteht

Du führst ein Gespräch, kein Interview. Ergebnis ist eine `PLAN.md` im Projekt, die
`/harness-build` später als Eingabe nutzt.

## Wann diese Skill nicht dran ist

Bei einem Wochenendskript, einer Einzeldatei, einem Wegwerf-Prototyp. Die Schwelle:
**mehr als etwa drei Dateien, oder Zustand, der einen Prozessneustart überleben muss,
oder ein zweiter Mensch, der das Ergebnis sieht.** Trifft nichts davon zu, sag das
offen und fang direkt an zu bauen — eine Planungsphase wäre hier reiner Overhead.

Wenn du unsicher bist, frag genau eine Sache: *"Läuft das nur bei dir einmal durch,
oder soll es länger leben?"*

## Die vier Sätze, gegen die du die ganze Zeit prüfst

1. **Was nicht in einem Schritt nachweisbar ist, gilt als nicht geliefert** — und der
   Nachweis ist der tatsächliche Endzustand, nicht der Bericht des Agenten.
2. **Der Maßstab entsteht vor dem Code.** Wer erst am Ergebnis definiert, was gut ist,
   hat keinen Maßstab, sondern eine Rechtfertigung.
3. **Nachvollziehbarkeit ist eine Architekturentscheidung, kein späteres Feature.**
4. **Einfachste Lösung zuerst.** Komplexität nur gegen ein *beobachtetes* Symptom.
   Jede Zeile in der PLAN.md, die eine Struktur vorbaut, braucht ein benanntes Symptom.

Satz 4 hat Vorrang, wenn er mit einem anderen kollidiert. Du planst kein Konzern-System.

---

## Phase 1 — Zuschnitt

**Zu klären:** Wer kann das Ergebnis ablehnen, woran misst man Erfolg, was macht die
AI und was macht deterministischer Code, wie viele Nutzer und Kanäle.

Stelle offen (Fließtext, nicht als Auswahl):

- *"Wer wird dieses Ergebnis zerreißen wollen — und mit welcher konkreten Frage?"*
  Fällt niemand ein, ist das ein Befund: entweder unkritisch (dann nur K.-o.-Kriterien)
  oder der Zuschnitt ist noch nicht verstanden.
- *"Welche drei bis fünf Größen entscheiden über Annahme oder Ablehnung?"* Nicht
  automatisch Latenz und Kosten — bei einem Auswertungswerkzeug zählen eher
  Falschtreffer-Rate, Nachvollziehbarkeit der Quelle, Wiederherstellbarkeit nach
  Abbruch. Beim Start sind das Hypothesen: als "geschätzt" markieren.
- *"Welcher Teil ist mit Regeln oder zwanzig Zeilen Code lösbar — und was bleibt
  danach für die AI übrig?"*

Nutze `AskUserQuestion` für den Schnitt AI/deterministisch, mit den Optionen:
deterministisch entschieden · mühsam aber eindeutig (→ Skript, das Modell schreibt es
einmal) · Grauzone (→ nur hier AI). Nur die Grauzone bekommt die AI. Baue den
deterministischen Pfad zuerst, auch wenn er noch nicht existiert — er ist zugleich die
Vergleichslinie, an der man später sieht, ob die AI überhaupt etwas beiträgt.

Nicht als Kriterium zulassen: *"Das wäre für mich mühsam."* Mühsam-für-Menschen und
schwer-für-Modelle sind zwei verschiedene Achsen.

**Nutzerzahl:** Standardwert ist ein Nutzer, ein Kanal — und dieser Standard ist zu
bauen, nicht zu überbauen. Keine Mandantenfähigkeit, keine Rollen auf Verdacht.
Notiere nur, was die Annahme kippt (zweiter Mensch mit eigenen Daten, zweiter
Ausgabekanal), und bündle Zustand und Rechte je an einer benannten Stelle.

> **Falle — Die Demo-Falle.** Symptom: Vorführungen laufen glatt, jede Rückfrage endet
> in "das muss ich nachsehen". Gegenmittel: den Abnahmetest gegen den aktiv
> widerlegenden Leser *vor* der ersten Zeile aufschreiben.

**Phase abgeschlossen, wenn:** ein Abnahmetest, drei bis fünf Erfolgs-Bars mit
Messverfahren, K.-o.-Kriterien als binäre Aussagen, und der Schnitt AI/deterministisch
schriftlich stehen. Formuliere beobachtbares Verhalten, nicht Implementierung
("Abbruch mitten im Lauf verliert keine geschriebenen Ergebnisse", nicht "nutze SQLite
mit WAL").

---

## Phase 2 — Architektur

**Zu klären:** Woher kommt jede Aussage, was muss in einem halben Jahr noch erklärbar
sein, was passiert bei Abbruch, welches Zeitbudget gilt.

Fragen:

- *"Welche Zustandsänderungen musst du in sechs Monaten noch erklären können?"* Nur
  für die schreibst du ein unveränderliches Entscheidungsprotokoll (Zeitpunkt,
  Eingangsdaten, verwendete Regel-/Prompt-Version, Ergebnis). Der übrige Zustand darf
  ganz normal mutierbar bleiben. Volles Event Sourcing nur, wenn eine externe Stelle
  die Historie verlangt, mehrere Dienste denselben Strom lesen, oder du zu einem
  beliebigen früheren Zeitpunkt rekonstruieren musst.
- *"Liest das Projekt fremdes Material ein und gibt Aussagen daraus wieder?"* Wenn ja:
  Vertrauensstufe, Dokument-ID und **Absatz-Anker** sind Pflichtfelder beim Ingest.
  Der Anker ist eine Schema-Entscheidung — nachrüsten heißt den Bestand neu einlesen.
  Abnahmekriterium ist der 30-Sekunden-Test: ein Griff vom Satz zum Quellabsatz.
  Relevanz wählt die Kandidaten, die Vertrauensstufe entscheidet zwischen ihnen.
- *"Welche Schritte können länger dauern als eine Verbindung hält?"* Nur diese werden
  Task mit Handle und benannten Zuständen (working, input_required, completed,
  cancelled, failed). Alles andere bleibt ein blockierender Aufruf.
- *"Hast du überhaupt eine zugesagte Antwortzeit?"* Wenn nein: keine erfinden. Dann
  gilt die umgekehrte Anforderung — Zustand gehört in persistente Dateien außerhalb
  des Kontextfensters.

**Betriebspunkte einmal durchgehen** und je `jetzt` / `später` / `nie` mit einem Satz
Begründung festhalten: Auth, Autorisierung, Audit-Log, Throttling, Deployment mit
Rollback, Health-Monitoring, Zertifikate, Telemetrie, Abrechnung. Auf `jetzt` gehören
nur die drei, die das Datenmodell festlegen: **wer ist der Aufrufer, auf wessen Daten
darf er zugreifen, wird jede ändernde Aktion mit Urheber und Zeitstempel festgehalten.**
Entscheiden ist nicht bauen. Bei einem lokalen Werkzeug steht bei fast allem `nie` —
das ist die richtige Antwort, keine Nachlässigkeit.

**Qualitätsversprechen zerlegen** und jedem Kriterium eine Prüfmethode zuordnen, in
dieser Priorität: (1) Test, Linter, Schema, Build — immer zuerst; (2) LLM-Urteil nur,
wo sich das Kriterium nachweislich nicht in einen Check überführen lässt; (3)
menschliche Abnahme. Vor jedem Einsortieren auf Stufe 2 oder 3: weiterzerlegen.
"Marke" ist unprüfbar, "Kontrastverhältnis mindestens 4.5:1" ist eine Linter-Regel.

> **Falle — Nachvollziehbarkeit nachrüsten.** Symptom: Die Frage "warum hat das System
> das gemacht?" wird mit Achselzucken beantwortet, weil die Information nicht mehr
> existiert. Nachträglich einziehen heißt jeden Schreibpfad anfassen.

> **Falle — Die Betriebsschicht vergessen.** Symptom: Es läuft für einen Nutzer auf
> einer Maschine und fühlt sich fertig an. Jede Frage nach Auth oder Versionierung
> löst einen Umbau quer durch den Code aus.

**Phase abgeschlossen, wenn:** für jede Entscheidung ein Satz Begründung im Plan steht
und für die Punkte auf `später`/`nie` das Ereignis benannt ist, das sie wieder aufruft.

---

## Phase 3 — Aufsetzen

**Zu klären:** Wie schnell dreht sich die Schleife, und wo hört die Testumgebung auf,
etwas auszusagen.

- *"Wie lange dauert es von einem frischen Klon bis bauen, starten, testen?"* Der
  Aufbau muss **ein einziger automatisierter Befehl** sein. Jeder manuelle Handgriff
  ist der eigentliche Befund und gehört ins Setup-Skript.
- *"Wie lange dauert der schnellste aussagekräftige Prüfpfad?"* Diese Zahl — nicht die
  Aufbauzeit — bestimmt, wie oft der Agent pro Stunde eine Vermutung widerlegen kann.
- *"Welche Fehlerklassen kann deine Testumgebung strukturell nicht zeigen?"* Als
  Liste, nicht als Satz. Gehe durch: mehrere gleichzeitige Prozesse, echte
  Datenmengen, Netzwerkausfälle, Reihenfolge- und Uhrenprobleme, echte Fremddienste,
  Rechte und Kontingente, Dauerlast. Streiche die nicht zutreffenden. Leer darf sie nie
  sein.

**Definierter Anfangszustand:** ein `reset`-Kommando plus versionierte Fixture-Daten.
Abnahmekriterium: zwei aufeinanderfolgende Läufe starten nachweislich identisch. Wo
die echte Zielumgebung rücksetzbar betrieben werden kann, nimm sie. Wo Rücksetzen nach
außen wirkt (Zahlungen, Mails, kostenpflichtige APIs), ist ein Nachbau Pflicht — dann
`ABWEICHUNGEN.md` mit dem, was der Nachbau anders macht.

**Dauerkontext klein halten, nicht die Zahl der Regeln.** In die `CLAUDE.md` gehören
nur nachprüfbare Projektfakten (Paketmanager, Testkommando, Zielbranch, Struktur).
Alles Übrige wird nicht gestrichen, sondern verschoben: maschinell prüfbar und nicht
verhandelbar → Hook; nur manchmal gebraucht → Skill; vom Menschen ausgelöst → Command
mit `disable-model-invocation: true` (kostet null Kontext).

> **Falle — Flakige Infrastruktur als Modell-Problem missdeuten.** Symptom: Antworten
> werden kürzer und vorsichtiger, der Agent meidet Werkzeuge, du änderst Prompts und
> nichts wird besser. Miss die Werkzeug-Fehlerrate, *bevor* du Verhalten bewertest.

**Phase abgeschlossen, wenn:** Aufbauzeit und Schleifenzeit gemessen (nicht geschätzt)
sind und die Gültigkeitsgrenze als Liste im Plan steht.

---

## Phase 4 — Vorentscheidungen für Bauen, Prüfen, Betrieb

Diese Phase baut nichts. Sie hält fest, was später gilt, damit es später nicht
verhandelt wird.

**Bauen.** Aufträge nie als "mach das gut", sondern gegen ein benanntes Bezugssystem —
zuerst ein vorhandenes Artefakt (Modul, API-Vertrag, Schema, Styleguide), erst dann aus
der Zerlegung. Dieselbe Kriterienliste geht wortgleich an die Abnahme. In dauerhaften
Textartefakten wird **jede einzelne Aussage** markiert: `[ANNAHME]` oder
`[BELEG: datei:zeile | befehl | testname]`, Klartext, pro Aussage, nie pro Dokument.
Ein `[ANNAHME]` darf nur zusammen mit einem eingefügten Beleg verschwinden.

**Prüfen.** Lege jetzt fest: *Welche Datei, welche Datenbankzeile, welches Log beweist,
dass eine Aufgabe erledigt ist?* Der Bericht des Agenten zählt nicht, seine Tool-Call-
Liste auch nicht. Nicht ausführbar heißt fehlgeschlagen, nicht übersprungen. Braucht
eine Prüfung ein Urteil, urteilt eine zweite Instanz mit eigenem Kontext, Lesezugriff
und **ohne Schreibrechte** — über `permissions.deny`, nicht als Bitte im Prompt.

**Betrieb.** Liste die Handlungen, die irreversibel sind oder nach außen wirken: Geld,
Veröffentlichen, Löschen, Deploy, Schreibzugriff auf fremde Systeme. Nur diese bekommen
ein Gate, technisch erzwungen (`ask`/`deny`, PreToolUse-Hook), **vor** der Handlung.
Alles Reversible bekommt bewusst keins, sonst wird Freigabe zum Reflex. Und: der
Rückweg muss einmal echt gelaufen sein, bevor etwas für jemand anderen erreichbar ist.

> **Falle — Selbstauskunft als Nachweis.** Symptom: Der Lauf endet mit "alle Features
> implementiert", der Bericht ist detailliert und präzise, und im Betrieb funktioniert
> die Hälfte nicht. Ein Modell, das eine Quelle erfunden hat, bestätigt auf Nachfrage
> ihre Echtheit.

> **Falle — Kollaps zum Mittelwert.** Symptom: Jede Ausgabe fühlt sich vertraut an,
> man kann nicht sagen was falsch ist, nur dass es "typisch KI" wirkt. Markiere die
> Felder ohne überprüfbar richtige Antwort (Namen, Texte, Oberfläche, Ton) — dort wird
> die erste Ausgabe nicht übernommen, sondern drei im Ansatz verschiedene Varianten
> vorgelegt, und der Besitzer wählt.

---

## Wissen nachschlagen statt raten

Bei jeder Entscheidung, die dieser Leitfaden nicht abdeckt, frag die Wissensbank statt
zu vermuten:

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs knowledge "<frage>"
node tools/harness.mjs knowledge --list
```

| Situation in der Planung | Abfrage |
|---|---|
| Brauche ich hier überhaupt ein Harness? | `knowledge "einfachste lösung zuerst"` |
| Workflow oder Agent für diesen Schritt? | `knowledge "workflow oder agent"` |
| Wie prüfen ohne Selbstbewertung? | `knowledge "evaluator agent separater kontext"` |
| Regel als Hook, Skill oder CLAUDE.md? | `knowledge "hook statt skill"` |
| Wie überlebt Zustand einen Context Reset? | `knowledge "context reset handoff"` |

Lies `knowledge/` und `recipes/` **nie** am Stück und `catalog/index.json` **nie
überhaupt** — beides sprengt den Kontext. Das CLI schneidet den passenden Abschnitt
heraus und nennt Datei und Zeile.

---

## Ergebnis: PLAN.md

Schlage vor, das Ergebnis als `PLAN.md` in die Projektwurzel zu legen, und lass es vom
User bestätigen, bevor du schreibst. Inhalt, in dieser Reihenfolge:

1. **Zuschnitt** — was gebaut wird, in drei Sätzen. Wer es ablehnen kann und mit
   welcher Frage.
2. **Abnahme** — drei bis fünf Bars mit Messverfahren (geschätzte als solche markiert),
   K.-o.-Kriterien als binäre Aussagen. Wo ein Kriterium automatisch prüfbar ist, steht
   der Befehl daneben.
3. **Schnitt AI / deterministisch** — die drei Spalten mit dem prüfbaren Grenzkriterium.
4. **Architekturentscheidungen mit Begründung** — je Entscheidung ein Satz *warum*, und
   bei `später`/`nie` das Ereignis, das sie wieder aufruft.
5. **Schmerzpunkte** — wo es erfahrungsgemäß weh tun wird. Das ist die Eingabe, aus der
   `/harness-build` seine Suchen ableitet; ohne sie sucht es nach Stack statt nach
   Problem.
6. **Prüfverfahren** — pro Qualitätskriterium die zugeordnete Methode und der Befehl
   bzw. die Instanz, die urteilt.
7. **Annahmen** — Nutzerzahl, Kanäle, Reifegrad der externen Abhängigkeiten, jeweils
   mit dem Auslöser, der sie kippt.

Halte die Datei unter zwei Seiten. Eine 40-Punkte-Spezifikation kaskadiert als
Fehlerquelle in die Umsetzung: **spezifiziere das Was hart und das Wie weich.**

Setze in die `CLAUDE.md` des Projekts eine Zeile, die auf die Datei verweist:
*"Vor Umsetzungs- und Architekturentscheidungen zuerst `PLAN.md` lesen."* Eine Datei,
die niemand verlinkt, liest ein frischer Agent in der nächsten Sitzung nicht.

## Übergabe

Danach `/harness-build` vorschlagen — es liest Abschnitt 5 und 6 der `PLAN.md` und
sucht daraus Bausteine. Wiederhole dessen Arbeit nicht: du wählst **keine** Skills,
Agents oder Hooks aus und installierst nichts. Du entscheidest nur, welche Probleme
gelöst werden müssen.

Soll das Projektverzeichnis erst noch entstehen (Ordner, `settings.json`, MCP-Auswahl),
ist die Reihenfolge: `/harness-plan` → `/bootstrap-project` → `/harness-build`.
