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
    last_modified: 2026-08-08
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
| `anthropics__claude-plugins-official/agent/legacy-analyst` | agent | Liest die Legacy-Basis (Tools `Read`, `Glob`, `Grep`, `Bash`) und bindet **jede Aussage an ein Pflicht-Zitat `file:line`**; trennt „is" von „appears to be" mit Kennzeichnung der Inferenzbasis und schliesst mit einem Confidence-&-Gaps-Footer samt offenen SME-Fragen. Gegen das plausible Halluzinieren gerichtet — Inferenz wird sichtbar gemacht statt verboten. Dazu Legacy-Stack-Vokabular (COBOL/JCL/CICS), Secret-Maskierung und die Anweisung, Prompt-Injection in fremdem Code als Befund zu melden statt zu befolgen. | 4 |
| `affaan-m__ecc/agent/code-explorer` | agent | Reine Exploration in eigenem Kontext, Werkzeuge auf `Read`, `Grep`, `Glob` beschränkt. Kann nichts kaputtmachen, verbrennt fremden Kontext statt deinem. | 3 |
| `affaan-m__ecc/skill/inherit-legacy-style` | skill | Leitet die Meta-Architektur des Projekts ab und macht sie zur Verhaltensbeschränkung für alle folgenden Aufgaben. Direkt gegen Style Drift. | 8 |
| `affaan-m__ecc/agent/spec-miner` | agent | Zieht aus dem bestehenden Code Requirements und Invarianten mit Test-Ankern. Erzeugt den Massstab, an dem "fertig" später messbar wird. | 15 |
| `mattpocock__skills/skill/handoff` | skill | Verdichtet den Stand in ein Übergabedokument für die nächste Session. Der Handoff, den Doktrin 5 verlangt — 1 KB, keine Ausrede ihn wegzulassen. | 1 |

Fünf Bausteine, 31 KB (4+3+8+15+1). Das ist die Obergrenze für diesen Projekttyp. Bewusst
klein: In einer fremden Codebasis ist Kontext die knappste Ressource, und jeder
Baustein verbraucht davon.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `affaan-m__ecc/agent/code-reviewer` | agent | Sobald eigene Änderungen entstehen. Vorher gibt es nichts zu prüfen. | 9 |
| `anthropics__claude-plugins-official/agent/architecture-critic` | agent | Erst wenn die Übernahme in einen Umbau/Neuentwurf mündet — prüft dann adversarial (Default-Haltung „skeptical") Architekturvorschläge und transformierte Module: Service-Schnitte, Datenmigrations-Story, durchschlagende Legacy-Struktur („JOBOL"). Das deckt der diff-basierte `code-reviewer` nicht ab; beide Zeilen gelten nebeneinander, kein Ersatz. Zum Startzeitpunkt des Rezepts existiert nichts, das er reviewen könnte. Read-only nur per Prompt-Anweisung — `Bash` steht im Tool-Set, eine harte Werkzeugbeschränkung wie beim `code-explorer` gibt es nicht. | 3 |
| `anthropics__claude-plugins-official/agent/business-rules-extractor` | agent | Domänenlogik-lastiges System, in dem Fachexperten/SMEs die extrahierten Regeln abnehmen sollen: Plain-English-Regeln, Given/When/Then mit konkreten Werten, Pflicht-SME-Frage bei Confidence < High — das leistet der entwicklerorientierte `spec-miner` nicht; Ergänzung, kein Ersatz. **Output zwingend vom Aufrufer persistieren:** der Agent hat kein `Write`-Tool und gibt seine Findings nur an die Session zurück — mit `handoff` aus dem Kern-Set festhalten, sonst stirbt der Output beim Sessionwechsel. Solo gilt das inline beschriebene Extraktionsformat (`file:line`, Plain English, GWT, Parameter, Confidence); der Prompt-Verweis auf das Rule-Card-Format von `/modernize-extract-rules` läuft ins Leere und darf **nicht** durch Mit-Installation des Commands geheilt werden — der hängt an Plugin-Workflow-Skripten. | 4 |
| `affaan-m__ecc/agent/planner` | agent | Ab dem ersten Umbau, der mehr als eine Datei berührt. Verhindert Scope-Unterschätzung (Doktrin 3.4). | 7 |
| `mattpocock__skills/skill/wayfinder` | skill | Nur wenn die Übernahme in mehrere Sessions zerfällt und ein Issue-Tracker vorhanden ist. Verteilt Entscheidungen auf Tickets statt auf Kontext. | 12 |
| `Egonex-AI__Understand-Anything/skill/understand` (386 KB, 50 Dateien) plus `understand-explain` (5 KB) | skill | Nur bei sehr grosser Codebasis, in der wiederholte Exploration teurer ist als ein persistenter Wissensgraph. Der Preis ist erheblich — vorher rechnen. | 391 |
| `Graphify-Labs__graphify/agent/graphify` | agent | Alternative zum Vorigen, wenn auch Nicht-Code-Material (Dokumente, Papers, Bilder) in denselben Graph soll. Nur eines von beiden nehmen. | 61 |

> **Kein Widerspruch zu `knowledge/03-vorbilder.md`, Teil E.** Dort wird ein
> `/graphify`-Lauf **abgelehnt** — das gilt ausschliesslich für die
> Harness-Bibliothek selbst, deren Katalog aus unverbundenen Bausteinen aus
> 13 fremden Repos besteht und in dem nur Attributfragen gestellt werden.
> Hier ist der Korpus eine **fremde, zusammenhängende Codebasis**: genau der
> Fall, für den ein Graph gebaut ist. Die Empfehlung hier und die Absage dort
> beziehen sich auf verschiedene Korpora, nicht auf verschiedene Urteile über
> das Werkzeug.

| `anthropics__claude-plugins-official/agent/test-engineer` | agent | Sobald die erste Änderung ansteht und der Verifikationspfad noch leer ist — nach `spec-miner`, vor dem ersten Diff. Er liefert die Tests, die `refactor-cleaner` voraussetzt: Characterization-Tests nach dem Prinzip „the legacy code is the oracle", konkrete Literalwerte, jeder Branch mindestens ein Fall, lauffähig ab Tag eins. Ehrliche Reichweite: Der Prompt ist für den Rewrite-Fall geschrieben — beim Einsatz ohne Rewrite muss der Aufrufer (a) ein Zielverzeichnis explizit benennen (der Write-Scope nennt wörtlich `modernized/`), (b) den Dual-Run-Teil („Tests must run against BOTH") auf Nur-Legacy-Oracle einschränken, (c) wissen, dass die Disabled-Marker das RULE-NNN-Schema des Herkunfts-Plugins referenzieren, nicht `spec-miner`s OpenSpec-IDs — die Anker sind manuell zu verknüpfen. | 3 |
| `affaan-m__ecc/agent/refactor-cleaner` | agent | **Erst** wenn Specs oder Tests existieren. Toten Code ohne Sicherheitsnetz zu entfernen, ist der klassische Legacy-Unfall. | 3 |
| `affaan-m__ecc/skill/search-first` | skill | Nur wenn eigene Implementierungen dazukommen: erst nach vorhandenen Lösungen suchen, dann bauen. | 8 |
| `affaan-m__ecc/hook/config-protection` | hook | Sobald der erste Diff eine bestehende Lint-/Format-Config anfasst (`.eslintrc`, Prettier, Biome, Ruff u. a.), um Checks zum Schweigen zu bringen statt den Code zu fixen — die dokumentierte Modellschwäche, gegen die der Hook gebaut ist. In einer übernommenen Codebasis sind diese Configs geronnene Konvention: dasselbe, was `inherit-legacy-style` auf Textebene schützt, erzwingt der Hook auf Dateiebene. Ehrliche Reichweite: Ohne vorhandene Lint-/Format-Configs im Repo ist er ein No-op; Neuanlage bleibt erlaubt. Er blockiert auch legitime Config-Modernisierung — die gehört bei einer Übernahme ohnehin in einen bewussten, menschlich entschiedenen Schritt, nicht in einen Nebenbei-Diff. | 5 |
| `affaan-m__ecc/hook/block-no-verify` | hook | Nur wenn das Repo Git-Hooks hat (husky, `.git/hooks`, `core.hooksPath`) — er erzwingt nichts, wo keine existieren. Wo sie existieren, sind sie in einem Legacy-Repo oft das einzige funktionierende Gate, solange der Verifikationspfad oben noch leer ist. Das Symptom: Ein Commit läuft mit `--no-verify` durch, weil ein alter pre-commit-Hook rot war und niemand verstand, warum — bei diesem Projekttyp ist dieses Rot ein Befund, kein Hindernis. Der Hook blockt die Bypass-Flags (`--no-verify`, `core.hooksPath=`) rein aus dem Kommandostring und braucht dafür null Projektwissen. | 14 |

**Zu den beiden Schutz-Hooks:** Ein installierter Hook ist zunächst inaktiv — er
feuert erst, wenn er in der `.claude/settings.json` des Zielprojekts registriert
ist; `install` legt nur die Datei ab und druckt das nötige Snippet. Ins Kern-Set
gehören sie nicht: Der erste Hebel bleibt der Verifikationspfad des Zielprojekts,
Zwang kommt danach (Entscheid vom 2026-08-08, `recipes/README.md`).

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `msitarzewski__agency-agents/agent/codebase-onboarding-engineer` (9 KB) | Bis 2026-08-08 im Kern-Set, dann gegen `legacy-analyst` getauscht. Gleiche Fakten-Bindung („state only facts"), verbietet Inferenz aber komplett — „Avoid inference, assumptions, and speculation completely" steht wörtlich im Prompt. Bei der Prämisse dieses Rezepts (keine Doku, Kommentare lügen) wird ein Inferenz-Totalverbot still verletzt — exakt der 3.5-Fehler aus der Symptomtabelle; `legacy-analyst` ersetzt das Verbot durch einen falsifizierbaren Mechanismus (gekennzeichnete Inferenz plus SME-Fragen). Dazu fehlen Secret-Maskierung, Injection-Disziplin und Legacy-Stack-Vokabular, bei mehr als doppelter Ladegrösse (9 statt 4 KB). Beide nebeneinander wären redundant. |
| `affaan-m__ecc/skill/codebase-onboarding` (8 KB) | Naheliegendster Treffer beim Namen. Bleibt draussen, weil `legacy-analyst` dieselbe Aufgabe mit Fakten-Bindung plus sichtbar gemachter Inferenz abdeckt. (Frühere Begründung „2 KB, ausschliesslich japanisch" war am System doppelt widerlegt: `show` liefert 8 KB und eine englische `SKILL.md` — korrigiert 2026-08-08.) |
| `anthropics__claude-plugins-official/agent/scaffolder` | Hart an den `modernize-reimagine`-Workflow gekoppelt: der Prompt erklärt `REIMAGINED_ARCHITECTURE.md` und `AI_NATIVE_SPEC.md` zum verbindlichen Blueprint („are your blueprint … follow exactly"), der Write-Scope ist auf `modernized/<service>/` festgelegt, und das Design geht von parallel arbeitenden Geschwister-Scaffoldern aus. Solo installiert hat er keine Eingaben und damit keine Funktion. Rezept 06 baut nicht neu; wer den kompletten Reimagine-Pfad will, nimmt das Plugin `code-modernization` als Ganzes. (Entscheid 2026-08-08.) |
| `anthropics__claude-plugins-official/agent/code-explorer` (2 KB) | Nahezu identisch mit dem Bestands-`code-explorer` im Kern-Set — der ist erkennbar von diesem offiziellen Agenten abgeleitet. Die offizielle Variante trägt aber `WebFetch`/`WebSearch` und weitere Tools, also Netzwerkzugriff und mehr Oberfläche, und ihr fehlt die Prompt-Defense-Baseline des Bestands. Das Rezept begründet den Bestand ausdrücklich mit „Werkzeuge auf `Read`, `Grep`, `Glob` beschränkt. Kann nichts kaputtmachen" — genau dieses Argument spricht gegen den Tausch. Offizielle Herkunft allein ist kein Symptom. (Entscheid 2026-08-08.) |
| `Egonex-AI__Understand-Anything/plugin/understand-anything` (32.102 KB, 499 Dateien) | 32 MB Sammelpaket. Der nützliche Kern sind zwei Skills daraus, die einzeln installierbar sind. Ein Paket dieser Grösse in ein fremdes Repo zu legen, ist kein Onboarding, sondern eine zweite Fremdheit. |
| `affaan-m__ecc/skill/repo-scan` (3 KB), `code-tour` (8 KB), `architecture-decision-records` (7 KB), `git-workflow` (15 KB), `context-budget` (6 KB) | Keiner der fünf löst ein Rezept-Symptom, das Kern-Set oder Erweiterung nicht schon abdecken. Inhaltlich zum Teil sehr passend — bei Bedarf `show --head 20` und bewusst entscheiden. (Frühere Begründung „nur als japanische Übersetzung unter `docs/ja-JP/skills/…`" ist seit einem Katalog-`update` überholt: alle fünf lösen per `show` als englische Skills unter `skills/` auf, KB-Werte am 2026-08-08 nachgezogen.) |
| `affaan-m__ecc/agent/doc-updater` (3 KB) | Erzeugt Codemaps und aktualisiert READMEs. Das Problem beim Übernehmen ist aber Verstehen, nicht Dokumentieren. Dokumentation, die vor dem Verständnis entsteht, verlängert nur die Liste der Dinge, die lügen. |

## Installationsbefehl

```bash
cd "<projektverzeichnis>"
node tools/harness.mjs install \
  anthropics__claude-plugins-official/agent/legacy-analyst \
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

1. **Zuerst lesen lassen, nichts ändern.** `legacy-analyst` und
   `code-explorer` installieren, Schreibrechte im Projekt noch nicht erweitern.
   Ergebnis ist eine Landkarte: Einstiegspunkte, Datenfluss, Fremdabhängigkeiten —
   plus die offenen SME-Fragen aus dem Confidence-&-Gaps-Footer.
2. **Sofort danach der Handoff.** `handoff` einsetzen und das Verstandene in eine
   Datei schreiben — Fortschrittslog plus Landkarte. Alles, was nur im Chatverlauf
   steht, ist beim nächsten Lauf weg (Doktrin 3.1).
3. **Dann den Stil festnageln.** `inherit-legacy-style` **vor** der ersten Änderung.
   Danach ist es zu spät: der erste Diff im falschen Idiom setzt den Massstab für
   alle folgenden.
4. **Dann den Massstab bauen.** `spec-miner` auf den Bereich, der als Erstes
   angefasst wird — nicht auf das ganze Repo. Requirements mit Test-Ankern für
   einen Teilbereich sind mehr wert als eine vollständige Sammlung ohne Anker.
5. **Dann den Massstab ausführbar machen.** Ist der Verifikationspfad oben noch
   leer, `test-engineer` (Erweiterung) einsetzen: Characterization-Tests gegen den
   Legacy-Code als Orakel, bevor der erste Diff entsteht. Zielverzeichnis explizit
   benennen (siehe Erweiterungstabelle).
6. **Erst jetzt ändern.** Und `code-reviewer` dazu, sobald der erste Diff steht.
7. **Wissensgraph zuletzt, wenn überhaupt.** `understand` oder `graphify` erst,
   wenn du zählen kannst, wie oft dieselbe Exploration wiederholt wurde. Vorher
   ist es eine Investition ohne Messwert (Doktrin 6.4).
