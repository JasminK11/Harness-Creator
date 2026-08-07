---
type: Rezept
title: Rezept 06 — Bestehende, unbekannte Codebasis übernehmen
description: "Beantwortet, mit welchem Kern-Set ein Harness für die Übernahme einer fremden Legacy-Codebasis beginnt — Kontext-Isolation plus persistente Notizen."
status: stable
sources:
  - id: harness-katalog
    resource: catalog/index.json
    title: Katalog der Harness-Bibliothek — jede genannte ID über `node tools/harness.mjs show <id>` geprüft
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: harness-doktrin
    resource: knowledge/01-harness-doktrin.md
    title: Harness-Doktrin — Abschnitte 3.1, 3.3, 3.4, 3.5, 5, 6.1, 6.2, 6.4 und Checkliste 8 als Begründung der Auswahl
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-08-07
tags: [rezept, legacy, onboarding, kontext-isolation, handoff, spec-mining]
---

# Rezept 06 — Bestehende, unbekannte Codebasis übernehmen

## Wann dieses Rezept passt

- Das Repo existiert seit Längerem; niemand im aktuellen Team kennt es vollständig.
- Es gibt wenig oder keine verlässliche Dokumentation, und Kommentare lügen stellenweise.
- Die Test-Suite ist dünn, veraltet oder fehlt — "funktioniert" ist nicht entscheidbar.
- Der Code folgt eigenen Konventionen, die nicht dem Mainstream des Frameworks entsprechen.
- Die Einarbeitung dauert länger als ein Context Window.

**Wann es nicht passt:** Ein fremdes Repo, in das nur ein kleiner, klar umrissener
Bugfix soll — dafür genügen `code-explorer` einzeln und ein guter Prompt
(Doktrin 8/Frage 7). Ein gut dokumentiertes Projekt mit grüner Test-Suite ist
kein Legacy-Fall, sondern ein normales Projekt: dort direkt das
technologiepassende Rezept nehmen.

## Die Schmerzpunkte dieses Projekttyps

| Symptom | Doktrin |
|---|---|
| Der Agent beschreibt die Architektur plausibel und falsch — er ergänzt aus dem Modellwissen, was er im Code nicht gefunden hat. | 3.5 |
| Beim ersten Eingriff schreibt er im Mainstream-Idiom des Frameworks statt im Stil des Projekts. Der Diff ist doppelt so gross wie nötig und der Review unmöglich. | 6.2 |
| Die Exploration frisst das Context Window, bevor die erste Änderung entsteht. | 3.1 Context Rot |
| "Fertig" ist nicht prüfbar, weil niemand aufgeschrieben hat, was das System eigentlich garantiert. | 3.3 |
| Beim Sessionwechsel geht alles Verstandene verloren; der nächste Lauf beginnt von vorn. | 5 Context Reset |
| Der Agent will umbauen, bevor er verstanden hat — und entfernt Code, dessen Zweck er nicht kennt. | 6.1 |

Die Gegenmassnahme ist nicht "mehr Agenten", sondern **Kontext-Isolation plus
persistente Notizen**. Explorationsarbeit gehört in Subagenten mit eigenem
Fenster; das Ergebnis gehört in Dateien, nicht in den Chatverlauf.

## Kern-Set (Startauswahl, zu kürzen)

**Bindend ist die Spalte „Welches Problem er löst", nicht die Liste.** Wer das
Symptom im eigenen Projekt nicht wiederfindet, streicht die Zeile — vier passende
Bausteine schlagen sieben plausible. Dass jede ID im Katalog auflöst, macht sie
belegt, nicht verpflichtend.

| ID | Typ | Welches Problem er löst | KB |
|---|---|---|---:|
| `msitarzewski__agency-agents/agent/codebase-onboarding-engineer` | agent | Liest Quellcode, verfolgt Pfade und **nennt ausdrücklich nur Fakten, die im Code stehen**. Genau gegen das plausible Halluzinieren gerichtet. | 9 |
| `affaan-m__ecc/agent/code-explorer` | agent | Reine Exploration in eigenem Kontext, Werkzeuge auf `Read`, `Grep`, `Glob` beschränkt. Kann nichts kaputtmachen, verbrennt fremden Kontext statt deinem. | 3 |
| `affaan-m__ecc/skill/inherit-legacy-style` | skill | Leitet die Meta-Architektur des Projekts ab und macht sie zur Verhaltensbeschränkung für alle folgenden Aufgaben. Direkt gegen Style Drift. | 8 |
| `affaan-m__ecc/agent/spec-miner` | agent | Zieht aus dem bestehenden Code Requirements und Invarianten mit Test-Ankern. Erzeugt den Massstab, an dem "fertig" später messbar wird. | 15 |
| `mattpocock__skills/skill/handoff` | skill | Verdichtet den Stand in ein Übergabedokument für die nächste Session. Der Handoff, den Doktrin 5 verlangt — 1 KB, keine Ausrede ihn wegzulassen. | 1 |

Fünf Bausteine, rund 36 KB. Das ist die Obergrenze für diesen Projekttyp. Bewusst
klein: In einer fremden Codebasis ist Kontext die knappste Ressource, und jeder
Baustein verbraucht davon.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `affaan-m__ecc/agent/code-reviewer` | agent | Sobald eigene Änderungen entstehen. Vorher gibt es nichts zu prüfen. | 9 |
| `affaan-m__ecc/agent/planner` | agent | Ab dem ersten Umbau, der mehr als eine Datei berührt. Verhindert Scope-Unterschätzung (Doktrin 3.4). | 7 |
| `mattpocock__skills/skill/wayfinder` | skill | Nur wenn die Übernahme in mehrere Sessions zerfällt und ein Issue-Tracker vorhanden ist. Verteilt Entscheidungen auf Tickets statt auf Kontext. | 12 |
| `Egonex-AI__Understand-Anything/skill/understand` (386 KB, 50 Dateien) plus `understand-explain` (5 KB) | skill | Nur bei sehr grosser Codebasis, in der wiederholte Exploration teurer ist als ein persistenter Wissensgraph. Der Preis ist erheblich — vorher rechnen. | 391 |
| `Graphify-Labs__graphify/agent/graphify` | agent | Alternative zum Vorigen, wenn auch Nicht-Code-Material (Dokumente, Papers, Bilder) in denselben Graph soll. Nur eines von beiden nehmen. | 62 |

> **Kein Widerspruch zu `knowledge/03-vorbilder.md`, Teil E.** Dort wird ein
> `/graphify`-Lauf **abgelehnt** — das gilt ausschliesslich für die
> Harness-Bibliothek selbst, deren Katalog aus unverbundenen Bausteinen aus
> 13 fremden Repos besteht und in dem nur Attributfragen gestellt werden.
> Hier ist der Korpus eine **fremde, zusammenhängende Codebasis**: genau der
> Fall, für den ein Graph gebaut ist. Die Empfehlung hier und die Absage dort
> beziehen sich auf verschiedene Korpora, nicht auf verschiedene Urteile über
> das Werkzeug.
| `affaan-m__ecc/agent/refactor-cleaner` | agent | **Erst** wenn Specs oder Tests existieren. Toten Code ohne Sicherheitsnetz zu entfernen, ist der klassische Legacy-Unfall. | 3 |
| `affaan-m__ecc/skill/search-first` | skill | Nur wenn eigene Implementierungen dazukommen: erst nach vorhandenen Lösungen suchen, dann bauen. | 8 |

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `affaan-m__ecc/skill/codebase-onboarding` (2 KB) | Naheliegendster Treffer beim Namen, aber nur 2 KB und im Katalog ausschliesslich japanisch. Der `codebase-onboarding-engineer` aus `agency-agents` löst dieselbe Aufgabe belastbarer und mit expliziter Fakten-Bindung. |
| `Egonex-AI__Understand-Anything/plugin/understand-anything` (32.102 KB, 499 Dateien) | 32 MB Sammelpaket. Der nützliche Kern sind zwei Skills daraus, die einzeln installierbar sind. Ein Paket dieser Grösse in ein fremdes Repo zu legen, ist kein Onboarding, sondern eine zweite Fremdheit. |
| `affaan-m__ecc/skill/repo-scan` (5 KB), `code-tour` (3 KB), `architecture-decision-records` (9 KB), `git-workflow` (15 KB), `context-budget` (7 KB) | Alle fünf liegen im Katalog nur als japanische Übersetzung unter `docs/ja-JP/skills/…`. Inhaltlich zum Teil sehr passend — bei Bedarf `show --head 20` und bewusst entscheiden. |
| `affaan-m__ecc/agent/doc-updater` (3 KB) | Erzeugt Codemaps und aktualisiert READMEs. Das Problem beim Übernehmen ist aber Verstehen, nicht Dokumentieren. Dokumentation, die vor dem Verständnis entsteht, verlängert nur die Liste der Dinge, die lügen. |

## Installationsbefehl

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs install \
  msitarzewski__agency-agents/agent/codebase-onboarding-engineer \
  affaan-m__ecc/agent/code-explorer \
  affaan-m__ecc/skill/inherit-legacy-style \
  affaan-m__ecc/agent/spec-miner \
  mattpocock__skills/skill/handoff \
  --to <projektpfad>
```

## Verifikationspfad — auszufüllen, bevor eingeführt wird

```
Befehl im Zielprojekt, der ein Ja/Nein liefert:  ______________________
Zuletzt grün gelaufen am:                        ______________________
```

Hier steht **kein** fester Befehl, weil kein Rezept die Skripte eines fremden
Projekts kennt — und bei diesem Projekttyp weiss es zu Beginn nicht einmal der
Mensch. Trag ein, was sich als Erstes zum Laufen bringen lässt: der Build, die
vorhandene Test-Suite, notfalls nur ein Start ohne Absturz.

**Existiert kein solcher Befehl, ist er der erste Arbeitsschritt**, nicht der letzte.
In einer fremden Codebasis ist er sogar das erste Ergebnis überhaupt: solange nichts
reproduzierbar läuft, ist jede Aussage über die Architektur unwiderlegbar — und genau
das ist die Fehlermode, gegen die die halbe Auswahl oben gerichtet ist.

## Reihenfolge der Einführung

1. **Zuerst lesen lassen, nichts ändern.** `codebase-onboarding-engineer` und
   `code-explorer` installieren, Schreibrechte im Projekt noch nicht erweitern.
   Ergebnis ist eine Landkarte: Einstiegspunkte, Datenfluss, Fremdabhängigkeiten.
2. **Sofort danach der Handoff.** `handoff` einsetzen und das Verstandene in eine
   Datei schreiben — Fortschrittslog plus Landkarte. Alles, was nur im Chatverlauf
   steht, ist beim nächsten Lauf weg (Doktrin 3.1).
3. **Dann den Stil festnageln.** `inherit-legacy-style` **vor** der ersten Änderung.
   Danach ist es zu spät: der erste Diff im falschen Idiom setzt den Massstab für
   alle folgenden.
4. **Dann den Massstab bauen.** `spec-miner` auf den Bereich, der als Erstes
   angefasst wird — nicht auf das ganze Repo. Requirements mit Test-Ankern für
   einen Teilbereich sind mehr wert als eine vollständige Sammlung ohne Anker.
5. **Erst jetzt ändern.** Und `code-reviewer` dazu, sobald der erste Diff steht.
6. **Wissensgraph zuletzt, wenn überhaupt.** `understand` oder `graphify` erst,
   wenn du zählen kannst, wie oft dieselbe Exploration wiederholt wurde. Vorher
   ist es eine Investition ohne Messwert (Doktrin 6.4).
