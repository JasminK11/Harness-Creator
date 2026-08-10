---
type: Arbeitsliste
title: Maßnahmen — was als Nächstes zu tun ist, und was bewusst nicht
description: "Beantwortet, welche Maßnahmen an Bibliothek, CLI und Wissensbank anstehen, welche erledigt sind, in welcher Reihenfolge, mit welchem Aufwand — und welche Vorschläge nach adversarialer Prüfung ausdrücklich verworfen wurden."
status: stable
sources:
  - id: adversariale-pruefung
    resource: knowledge/06-massnahmen.md
    title: Adversariale Prüfung aller zwölf Maßnahmen gegen den laufenden Code und das CLI
    author: Harness-Bibliothek (lokal, Prüfläufe 2026-08-07)
  - id: harness-cli
    resource: tools/harness.mjs
    title: Eigenes CLI — cmdSync, cmdExtract, cmdSearch, cmdInstall, cmdLint, cmdUpdate
    author: Harness-Bibliothek (lokal)
  - id: knowledge-04
    resource: knowledge/04-governance.md
    title: Governance — offene Maßnahmen M1–M10, Aufwandsschätzungen, Reihenfolge
    author: Harness-Bibliothek (lokal)
  - id: suchfix-2026-08-08
    resource: tools/harness.mjs
    title: Suchfix Wortanfangs-Präfix-Matching mit Stoppwortfilter — Messläufe am laufenden System, von Umsetzer und adversarialem Prüfer unabhängig verifiziert
    author: Harness-Bibliothek (lokal, Beschluss des Projektverantwortlichen im autonomen Mandat vom 2026-08-08)
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2026-11-07
tags: [massnahmen, roadmap, cli, governance, pruefung]
---

# 06 — Maßnahmen

## Abstract

Diese Datei ist die Arbeitsliste der Bibliothek: was als Nächstes zu tun ist, warum,
und was bewusst unterbleibt. Jede Maßnahme wurde adversarial geprüft — ein Agent hat
versucht, sie am laufenden Code und am CLI zu widerlegen, und **keine einzige hat die
Prüfung unverändert überstanden**. Was hier steht, ist die korrigierte Fassung mit
Belegen; das unterscheidet diese Liste von einer Wunschliste.

Die Liste ist inzwischen weitgehend abgearbeitet. **Der Stand je Maßnahme steht in
der Übersichtstabelle**, nicht in den Abschnitten darunter: dort ist der „Was zu tun
ist"-Teil bewusst im Wortlaut des Auftrags stehengeblieben, damit die Begründung
nachvollziehbar bleibt. Wer eine Maßnahme anfassen will, liest erst die Zeile in der
Tabelle und dann den Abschnitt.

Zwei Buchführungshinweise vorab: Die IDs M1–M12 dieser Datei sind **nicht** identisch
mit den IDs M1–M10 in `knowledge/04-governance.md`. Kollisionen sind unten je Maßnahme
vermerkt. Und: Mehrere Maßnahmen sind nach der Prüfung deutlich kleiner geworden — die
Aufwandsspalte trägt den korrigierten Wert, nicht den ursprünglich geschätzten.

**Nachtrag (2026-08-10).** M2 (Quarantäne-Flag in `extract`) und M3
(`hookDescription()`-Shebang-Fix) aus der Tabelle „Sollten wir tun" in
`knowledge/04-governance.md` sind umgesetzt und dort als erledigt markiert
(Beleg: `knowledge/LOG.md`, Einträge „M2 umgesetzt" und „M3 umgesetzt"). Geprüft
per Grep: keine der beiden Maßnahmen taucht unter einer eigenen ID in dieser
Datei auf — sie sind ausschliesslich in `04` gebucht, nicht hierher dupliziert.
Wer sie sucht, findet sie also nur in `04`, nicht unter einer M-Nummer hier.

## Übersicht

Die Spalte **Stand** ist am 2026-08-07 gegen den laufenden Code und die Textdateien
nachgeprüft worden (M9 nach dem `extract`-Lauf erneut am 2026-08-08), nicht aus der
Absicht abgeleitet. Sie ist der Grund, warum diese
Tabelle überhaupt eine solche Spalte hat: eine Arbeitsliste ohne Stand ist nach dem
ersten Umsetzungslauf eine Fehlerquelle, keine Liste.

| ID | Titel | Art | Aufwand | Prio | Stand |
|----|-------|-----|---------|------|-------|
| M1 | `lint` um drei Nahtprüfungen erweitern, mit Exit-Code | CLI | mittel (~90 Z.) | 1 | erledigt |
| M2 | Herkunft belegbar machen, `uninstall` ermöglichen | CLI | klein | 1 | erledigt |
| M3 | `install` meldet den erreichten Zustand, nicht den Kopiervorgang | CLI | klein | 1 | erledigt |
| M4 | Installationsgrenze absichern — `install` prüft, was ausführt | CLI | mittel (~3 Std) | 1 | erledigt |
| M6 | Kollisionen an der Installationsgrenze melden statt still mischen | CLI | klein | 2 | erledigt |
| M7 | `evals/routing.jsonl` + `harness.mjs eval` — Drifterkennung | CLI | klein | 2 | erledigt, ohne `--recipes` |
| M10 | Frontmatter-Schema erfüllen, Falschaussagen in `04` richtigstellen | Doku | klein | 2 | erledigt |
| M12a | `verify-recipes` als Subcommand | CLI | klein (~50 Z.) | 2 | **abgewandelt**: sitzt in `cmdLint` |
| M5 | Vertrauensstufe als Dokumentation und Auswahlkriterium | Struktur | klein (~45 Min) | 2 | erledigt, ohne `INDEX.md` |
| M8 | Sprachhinweis in der Sackgasse statt Synonymtabelle | CLI | klein (~20 Min) | 3 | erledigt |
| M9 | Feuerpreis anzeigen statt Verzeichnisgröße | CLI | klein (~5 Z.) | 3 | erledigt |
| M11 | Rezepte auf Abschnittsebene selbsttragend machen | Struktur | klein | 3 | erledigt |
| M12b/c | Rauchtest für Ausführbares, `verified`-Feld setzen | Prozess | klein | 4 | (b) **verworfen**, (c) erledigt |
| M13 | `harness-build` Schritt 1: Prüfschleifen erheben, Ausschlussfrage stellen | Doku | klein (~6 Z.) | 2 | erledigt |
| M14 | Rückkanal: was ein `harness-build`-Lauf hinterlässt | Doku | klein (~12 Z.) | 2 | erledigt |
| M15 | `eval` sichtbar machen und an `update` hängen | CLI | klein | 2 | erledigt |
| M16 | `cmdStats` bekommt seinen Einwand | CLI | klein (~2 Z.) | 3 | erledigt |
| M17 | Reibung kennzeichnen; `activationOf` bei unregistriertem Hook-Skript | Doku + CLI | klein | 3 | erledigt |
| M18 | Naht `/harness-plan` → `/harness-build` schliessen | Doku | klein | 2 | erledigt |

**Was offen bleibt.** M9 war gebaut, aber unwirksam, bis einmal `extract` gelaufen
ist — das Feld `entryBytes` entsteht beim Katalogbau. Der Lauf ist inzwischen erfolgt;
nachgeprüft am 2026-08-08: `show anthropics__skills/skill/webapp-testing` meldet
„Lädt sofort 4 KB" bei 22 KB Gesamtgröße in 6 Dateien. Damit ist M9 erledigt.
M7 ohne `--recipes` und M12a
als eigener Subcommand sind begründet verworfen (siehe „Bewusst nicht umgesetzt");
die Prüfung wohnt in `cmdLint`, damit es nicht zwei Grenzen gibt, die dasselbe
bewachen. M5 ohne Spalte in `INDEX.md`: die Datei erzeugt `writeMarkdownIndexes()`,
eine Änderung von Hand hielte bis zum nächsten `extract`.

M13 bis M18 stammen aus der Auswertung von fünf Vorträgen zu Forward Deployed
Engineering und simulationsbasiertem Prüfen; Belege und Grenzen jeweils in
`knowledge/08`. Sie fassen drei Dateien an, die sonst nirgends in dieser Liste vorkommen:
`harness-build/SKILL.md` (M13, M14, M17a, M18), `harness-plan/SKILL.md` (M18) und
`werkzeug-aenderer.md` (M15). M13 und M18 betreffen beide Schritt 1 derselben Skill und
wurden in einem Zug erledigt.

<!-- lint:historisch --> Die ursprüngliche Reihenfolgeempfehlung lautete: „innerhalb
Priorität 1 **M3 → M2 → M6 → M4 → M1**; M3, M2 und M6 fassen dieselbe Funktion
(`cmdInstall`) an." Sie ist abgearbeitet und bleibt stehen, weil sie die Begründung
für den Zuschnitt der Läufe trägt.

---

## M1 — `lint` um drei Nahtprüfungen erweitern, mit Exit-Code

**Was zu tun ist.** Kein neues Subcommand. Alles in `cmdLint()` (`tools/harness.mjs`
Z. 1118), das die Nische „Naht zwischen generiert und handgepflegt" bereits besetzt.

- **Prüfung A — Baustein-IDs.** Alle `repo__name/typ/slug`-Muster aus `recipes/`,
  `knowledge/`, `README.md`, `INDEX.md` und beiden `SKILL.md` gegen `cat.items` prüfen.
  Schwere: in `recipes/` **hoch** (dort stehen die `install`-Befehle), in `knowledge/`
  **mittel**. Zeilen mit `<!-- lint:historisch -->` überspringen.
- **Prüfung B — Bestandszahlen.** Gültigkeitsmenge aus dem Katalog bilden (`totals.*`,
  je Repo, je Typ, je Domäne, Standard/Bulk-Split), dann `Zahl + Bezugswort` suchen.
  Bei „rund"/„ca."/„etwa" Toleranz ±1 %, sonst exakt; Werte < 40 ignorieren;
  Unterdrückung per `<!-- lint:keine-bestandszahl -->`.
- **Prüfung C — Verweise auf erzeugte Dateien.** Backtick-Nennungen von `CHANGELOG.md`,
  `INDEX.md`, `catalog/by-domain/*.md`, `sources.txt` gegen das Dateisystem prüfen.
- **Statt INDEX-Summen**: die `Stand:`-Zeile gegen `cat.generatedAt` vergleichen.
- **Statt voller sources.txt-Prüfung**: nur Repos mit **null** Katalogeinträgen melden.
- **Exit-Code gestaffelt**: `--strict` → 1 bei jedem Befund; ohne Flag → 1 nur bei A/B/C.

**Warum.** Chan: die Maschine muss Konsistenz erzwingen statt menschlicher Sorgfalt.
Garg: deterministische Verifier liefern das Artefakt, auf dem qualitative Urteile
aufsetzen.

**Was die Prüfung ergab.** Der Kern trägt, die ursprüngliche Ausführung nicht.
Das Symptom ist massiv: 22 veraltete Bestandszahlen in 6 Dateien, darunter **drei
sich widersprechende Gesamtzahlen** für dieselbe Größe (25.593 / 25.322 / 25.000 bei
tatsächlich 25.497), „rund 1.050" statt 954, „152 Hooks" statt 56, drei tote
Baustein-IDs in `knowledge/`, ein an sieben Stellen versprochenes `CHANGELOG.md`, das
nicht existiert. Vier Ausführungsfehler des Originals: die INDEX-Summen prüfen den
Generator gegen sich selbst (Tautologie); `sources.txt` ↔ Katalog hat kein Symptom
(13 zu 13, keine Abweichung); ein neues Subcommand `verify` neben `lint` verdoppelt
eine Grenze; „läuft nach jedem `sync`" ist der falsche Zeitpunkt — `sync` zieht nur
die Repos, den Katalog baut `extract`.

**Betroffen.** `cmdLint()` Z. 1118–1214, Aufhängepunkt am Ende von `cmdUpdate()` als
Schritt 4/4, dazu Schritt 2 in `skills/harness-update/SKILL.md`. Nicht enthalten:
Auto-Korrektur der Zahlen — maschinell umgeschriebene Prosa stimmt nicht mehr.
<!-- lint:historisch --> Der ursprüngliche Zusatz „kostenlos mitzunehmen: zwei
md5-Vergleiche zwischen `skills/*/SKILL.md` und `~/.claude/skills/*/SKILL.md`" ist
**gegenstandslos** — es gibt nur noch eine Ablage, `.claude/skills/` im Projekt.
Damit entfällt die Fehlerklasse „eine Kopie geändert, die andere nicht" ersatzlos.

## M2 — Herkunft belegbar machen und Entfernen ermöglichen

**Was zu tun ist.** Kein `catalog/state.json`. Repo, SHA und Zeitstempel liegen bereits
in `catalog/index.json` (`repos[].head`, `repos[].lastCommit`, `generatedAt`).

1. `INDEX.md`-Repo-Tabelle (Z. 610, 631) um eine Spalte `Commit` mit `r.head`. Da
   `INDEX.md` git-getrackt ist, konserviert die Repo-Historie damit den Lauf-Bezeichner.
2. `cmdUpdate` Z. 1245: die vorhandenen `before`/`after`-SHAs ins `CHANGELOG.md`
   schreiben statt wegzuwerfen — `- \`repo\` — updated (abc1234 -> def5678)`.
3. Manifest um `commit`, `installedAt`, `bytes` erweitern (`cmdInstall` Z. 921, ~4 Z.).
4. `uninstall <id...> --to DIR` (~40 Z.): liest `installedTo`, zeigt an, löscht,
   entfernt den Eintrag, schreibt den CLAUDE.md-Markerblock neu. Weigerung bei
   abweichendem Inhalt außer mit `--force`; `--dry-run` wie bei `install`.
5. `list --to DIR`, das jeden Eintrag mit `entry.commit` gegen den heutigen
   `repos[].head` hält — die Auswertung, die Punkt 3 erst nutzbar macht.

**Warum.** Davis: wer die Kennung eines Laufs nicht auf Platte schreibt, verliert sie
endgültig. Feng: Replayability ist Vorbedingung für Vergleiche. Eigene Doktrin:
`knowledge/01-harness-doktrin.md:332` schreibt Entfernen als Routinehandgriff vor.

**Was die Prüfung ergab.** Der Kern ist belegt, die Hälfte der Ausführung nicht.
Ein eigener Zustandsspeicher wäre die dritte Kopie derselben Angaben — genau das, was
der Code an anderer Stelle selbst ablehnt. Belegt fehlend: `cmdSync` berechnet die SHAs
(Z. 198/202) und wirft sie weg; das Manifest führt weder Commit noch Zeit pro Eintrag
(nach dem zweiten `install` war der erste Zeitpunkt unwiederbringlich fort);
`uninstall`/`list` existieren nicht. **Abgelehnt**: das Feld „bestätigt ja/nein" (der
installierende Prozess kann über sich selbst nur „ja" sagen) und ein Rückrollpfad
(uns gehört keines der 14 Repos; die Rollback-Einheit ist die Versionsverwaltung des
Projekts).

**Betroffen.** `cmdSync` Z. 198/202, `cmdUpdate` Z. 1245, `cmdInstall` Z. 921,
`writeMarkdownIndexes` Z. 610/631, `writeClaudeMd`. Entspricht M7 aus `knowledge/04`.

## M3 — `install` meldet den erreichten Zustand, nicht den Kopiervorgang

**Was zu tun ist.**

1. **Manifest-Wahrheit bei `--force`** (wichtigster Punkt): den verdrängten Eintrag
   entfernen, nach `installedTo` deduplizieren, Meldung „überschreibt `<alte-id>`".
2. **Statusfeld** je Manifest-Eintrag: `aktiv` oder `inaktiv: <Grund>`; vierte Spalte
   „Status" in der CLAUDE.md-Tabelle. Inaktive bleiben im Manifest — Herkunftsnachweis.
3. **Hooks: warnen und vorlegen, nicht eintragen.** Hook-Text gegen die vorhandene
   `HOOK_EVENTS`-Konstante (Z. 450) prüfen; bei genau einem Treffer den fertigen
   `settings.json`-Schnipsel ausgeben, sonst ehrliche Ratlosigkeit. Immer
   `status = "inaktiv: nicht in settings.json registriert"`.
4. **MCP**: heißt die Quelldatei nicht `.mcp.json`, ablehnen („kein MCP-Server-Manifest").
   Echte `.mcp.json` bei bestehender Datei nicht überschreiben, sondern Schlüssel ausgeben.
5. **Plugins**: vor dem Kopieren warnen, dass `.claude/plugins` keine Aktivierung bewirkt.
6. **Größenwarnung** ab 5 MB oder 200 Dateien, ohne `--force` abbrechen.

**Warum.** Garg: „the only way we can really verify correctness is to actually look at
the state itself". Davis: die Lücke zwischen Beschreibung und Verhalten findet nur, wer
es laufen lässt.

**Was die Prüfung ergab.** Live nachgestellt: das CLI meldete Erfolg für Hook und MCP —
tatsächlich existiert kein `settings.json` im Projekt, der Hook ist wirkungslos, die
„MCP-Konfiguration" war ein Desktop-Extension-Manifest im Projektwurzelverzeichnis.
Der String `settings` kommt in 1.347 Zeilen `harness.mjs` kein einziges Mal vor.
Stärkster Fund, den das Original nicht nennt: `--force` macht das Manifest nachweislich
unwahr (zwei IDs auf demselben Pfad). **Gestrichen**: Frontmatter-Prüfung (402 von 402
Skills bestehen sie), Namenskonfliktprüfung (existiert, Z. 915–918), Existenzprüfung
der Zieldatei (`copyFileSync` wirft ohnehin), automatisches Schreiben in `settings.json`
(bei 23 von 56 Hooks nicht ableitbar — das Scharfschalten fremden Codes gehört vor den
User). Auch die Formel „nur was diese Prüfung besteht, gilt als installiert" ist falsch
herum: ein Hook ist korrekt kopiert, nur inaktiv — Statusfeld statt Weglassen.

**Betroffen.** `cmdInstall` Z. 897–945, `TARGET_BY_TYPE` Z. 769–776, `writeClaudeMd`.

## M4 — Installationsgrenze absichern: `install` prüft, was ausführt

**Was zu tun ist.**

1. `extract`: **eine** Flagge `executable: true` für Hooks (Endung `.js/.mjs/.py/.sh/.ps1`
   — trifft 51 von 56) und Plugins mit `hooks/`- oder `scripts/`-Ordner. Dazu je Hook
   drei aus dem Code gelesene Angaben: gestartete Prozesse, Netzaufrufe, Schreibziele
   außerhalb des Projekts. **Keine** Flagge für Skills, Agents, Commands.
2. `install`: deterministischer Halt vor dem Kopieren, drei Klassen — *erlauben*
   (skill/agent/command/mcp), *bestätigen* (jeder Hook: Pfad, Größe, Zeilenzahl,
   Fundstellen mit Zeilennummer, nicht die Datei), *bestätigen* (>5 MB oder >200 Dateien).
   `--yes` für nicht-interaktive Läufe; ohne TTY Abbruch statt stillem Durchlauf.
3. Paarwarnung **als Satz, nicht als Matrix**, mit Ehrlichkeitszusatz, dass im
   Zielprojekt bereits ungeprüfte Skills und MCP-Server aktiv sein können.
4. `bootstrap` gibt die ask/deny-Grundausstattung als kopierfertigen Block aus und
   verweist auf `/bootstrap-project` als zuständigen Schreiber — **kein** zweiter
   Schreiber in `settings.json`.

**Warum.** Rallabandi: einzeln geprüft reicht nicht, der Guard gehört deterministisch an
die Handlungsfläche. Salomon/Yosef: fremder ausführbarer Code über genau einen
auditierbaren Pfad.

**Was die Prüfung ergab.** Belegt: `install <hook> <plugin> --dry-run` gibt zwei Zeilen
aus — keine Rechte, keine Bestätigung, keine Größe, obwohl das Plugin 49.642 KB in
3.438 Dateien mitbringt. Dies ist **keine neue Maßnahme, sondern die offene M8 aus
`knowledge/04:390`**, dort mit 3 Std und Verortung „CLI + Skill" — „Aufwand klein" und
„Art Prozess" waren beide falsch, und `knowledge/04:409` verbietet die Prozessvariante
ausdrücklich. Widerlegt: Rechte-Flaggen aus Metadaten (nur 61 von damals 954
Bausteinen deklarieren Rechte — Messung am Katalogstand 2026-08-07 08:57, seither
sind zwei Bausteine hinzugekommen und die Messung wurde nicht wiederholt
<!-- lint:historisch -->) und Klartextanzeige (44 von 56 Hooks länger als 60 Zeilen,
Median 120, Maximum 1.279). Die Paarwarnung feuert über die sechs Rezept-Kernsets genau einmal
(05-seo) — richtige Größenordnung.

**Betroffen.** `extractRepo`, `cmdInstall` Z. 897–945, `cmdBootstrap`, dazu Schritt 7 in
`harness-build/SKILL.md`: Hook-Inspektion **vor** die Bestätigung ziehen (heute Z. 165
nach dem Kopieren). ID-Kollision auflösen: diese Maßnahme ist M8 in `knowledge/04`.

## M5 — Vertrauensstufe als Dokumentation und Auswahlkriterium

**Was zu tun ist.** Zusammenlegen mit M10 aus `knowledge/04`.

1. `sources.txt`: je Repo eine **Kommentarzeile** `# Vertrauen: offiziell | gepflegt |
   unbekannt` mit Halbsatz-Begründung. Bewusst kein `!`-Marker — `readSources()` bleibt
   unverändert, keine Parser-Abhängigkeit für ein Feld ohne Logik.
2. `INDEX.md`: Spalte „Vertrauen" in der Repo-Tabelle.
3. `show`: die vorhandene Zeile `Repo <id>` (Z. 746) um die Stufe ergänzen. In `search`
   **keine** zusätzliche Spalte.
4. **Sortierung bleibt unverändert.**
5. `harness-build/SKILL.md`: fünftes Auswahlkriterium — bei fachlicher Gleichwertigkeit
   die gepflegtere Quelle, aber „fachliche Passung schlägt Herkunft".

**Warum.** Chan: ein System, das den vereidigten Buchhalter nicht vom Gerücht
unterscheidet, ist nicht bereit für echtes Geld.

**Was die Prüfung ergab.** Der Tiebreaker ist tatsächlich die alphabetische ID (Z. 710)
und in ~7 von 10 Top-Treffern aktiv. Aber: der nachgebaute Vertrauens-Tiebreaker löst
das genannte Problem nicht (`affaan-m__ecc` bleibt in 15 von 20 Abfragen auf Platz 1
statt heute 18 von 20 — die Dominanz ist ein Bestandseffekt, 522 von 1.099) und erzeugt
belegte Verschlechterungen: bei `search "hook"` hebt er einen beschreibungslosen
`hooks.json`-Eintrag auf Platz 1, bei `search "performance"` einen SEO-Agenten über
einen Performance-Optimizer. `!einzelquelle` ist am eigenen Wissensbestand widerlegt —
`Graphify-Labs__graphify` hat 2 Bausteine und ist Vorbild in `knowledge/03`.

**Betroffen.** `sources.txt`, `INDEX.md`, `cmdShow` Z. 746, `harness-build/SKILL.md`
Z. 110–120. **Anschlussmaßnahme, separat zu bewerten**: die eigentliche Ursache ist die
flache Punkteskala (10/3/+1), die 7 von 10 Treffern gleichzieht.

## M6 — Kollisionen an der Installationsgrenze melden statt still mischen

**Was zu tun ist.** Umfang: 4 echte Ziel-Kollisionsgruppen im Standardbestand
(`.claude/hooks/hooks.json` aus 4 Repos, `./.mcp.json` aus 2, `.claude/skills/design-system`,
`.claude/skills/seo`).

1. `cmdInstall`: Ziel-Pfade während der Schleife in einer Map mitführen statt nur
   `fs.existsSync` — damit meldet `--dry-run` dieselbe Kollision wie der Echtlauf.
2. `copyRecursive` bei `--force`: Zielverzeichnis vorher leeren, damit kein Mischbestand
   aus zwei Autoren entsteht.
3. `--force` auf eine Kollision **innerhalb desselben Aufrufs**: abbrechen.
4. Manifest: pro `installedTo` nur ein Eintrag.
5. `hooks.json` und `.mcp.json` gesondert behandeln — Konfigurationsdateien, keine
   Bausteine: bei bestehender Datei melden, welche Schlüssel im Konflikt stehen.
6. `harness-build/SKILL.md` Schritt 7: Kollisionsmeldung durch Auswahl auflösen, nicht
   durch `--force`.

**Warum.** Chan: Widersprüche werden gemeldet, nie geglättet.

**Was die Prüfung ergab.** Das Kronzeugen-Beispiel des Originals kollidiert nicht — die
vier `code-review`-Bausteine haben vier verschiedene Ziele. Trefferzahl (Z. 720/727) und
Spalte „verworfen, weil" (`SKILL.md` Z. 147) existieren bereits. Eine Slug-Warnung in
`search` wäre zu 77 % Rauschen (33 von 43 Gruppen sind gewollte agent/skill-Paare
desselben Autors). Der echte Widerspruch sitzt in `install`, dreifach belegt:
`--dry-run` sagt die Kollision **nicht** voraus, die der Echtlauf fängt; `--force`
überschreibt nicht, es **mischt** (ecc-`SKILL.md` über 14 `references/`-Dateien eines
anderen Autors); das Manifest behauptet danach etwas Falsches.

**Betroffen.** `cmdInstall` Z. 897–922 (Zielbildung 911–913, Kollisionszweig 915–918),
`copyRecursive` Z. 778–790, Manifest Z. 924–938. **Nicht** umgesetzt: jede Änderung an
`cmdSearch`.

## M7 — `evals/routing.jsonl` plus `harness.mjs eval`: Drifterkennung ohne Baseline

**Was zu tun ist.** Zweck präzise benennen: Regressionsprüfung, ob dieselbe Absicht nach
einem Katalogumbau denselben Baustein findet. Keine Qualitätsaussage.

1. **Baseline streichen.** Vergleichspunkt ist der letzte grüne Lauf (`evals/last-run.json`),
   Meldung als eigene Kategorie `VERSCHOBEN <id> 3 -> 14`.
2. Umfang hart auf **12–18 Fälle**, englisch — so festgeschrieben in `knowledge/04:284`.
3. Deutsche Fälle: höchstens drei, `erwartet: "rot"`, getrennt bilanziert, zählen nicht
   in den Exit-Code. Damit Fortschrittsanzeiger statt Dauerfehler.
4. **`eval --recipes` zuerst bauen**: alle IDs aus `recipes/*.md` (heute 99) gegen den
   Katalog. ~20 Zeilen, keine Pflegedatei, fängt den stillen Upstream-Rename.
5. Ausgabe je Fall eine Zeile, Exit-Code ≠ 0 nur bei FEHLT/VERBOTEN/toter Rezept-ID,
   zusätzlich `--json`.
6. Stufe 2 (Modelllauf gegen `harness-build/SKILL.md`) bleibt draußen, bis Stufe 1 zwei
   Update-Zyklen überlebt hat. Wenn sie gebaut wird, gelten die fünf Bauvorgaben in
   `knowledge/04` 4.1 — Kontext als Fixture statt als Prompt-Block, Aufgabenkonstruktion
   **nicht** offenlegen, Umformulierungs-Zweitfassung je Fall, Präfix-Test ohne zweiten
   Lauf, und der Aufwanddeckel aus `knowledge/07` C1(b). Der Läufer gehört nicht ins CLI,
   sondern als Skill oder Subagent ins Harness: der teure Teil ist der Modelllauf, nicht
   das Ablesen.
7. **Ein Fall mit langer, profilartiger Anfrage fehlt.** Alle Fälle mit `erwartet` sind
   heute zweiwörtig. `cmdSearch` liest Mehrwortanfragen als UND und lockert erst auf
   Teiltreffer, wenn kein Baustein alle Wörter trägt — ein volles Projektprofil
   überschreitet diese Schwelle zuverlässig und kippt die Suche von scharf auf breit.
   Gemessen: `tdd testing` setzt `affaan-m__ecc/agent/tdd-guide` auf Rang 1, als
   zwölfwörtiges Profil fällt derselbe Baustein auf Rang 11 und damit aus `topN: 5`.
   Der Fall ist heute rot und gehört wie die beiden Sprachfälle mit `optional: true`
   geführt, bis die Lockerungslogik entschärft ist — sonst bricht er den Exit-Code,
   ohne dass jemand die Ursache angehen kann.

**Warum.** Rallabandi besteht auf einer Vergleichsbasis. Branco: die Dekomposition wird
selbst zur Ground Truth.

**Warum eine Vorab-Regressionsprüfung überhaupt etwas fängt — der einzige Fremdbeleg.**
Aman Gupta (Nubank, Anwender, nicht Anbieter) berichtet zwei Funde aus dem Regelbetrieb:
„we caught a regression uh with simulation that could have made it to production, but
simulation caught it. And at the same time, we also caught in another agent an issue uh
which could have lowered our self-service rate" (11:55). Übertragbar ist davon nur der
Regressionsfall; die Selbstbedienungsquote ist Fachdomäne, nicht Methode. **Grenze:**
zwei Funde ohne Nenner, ohne Zeitraum und ohne Fehlalarmzahl — keine Trefferquote, es
gilt `knowledge/07` E5 und F3. Verschoben hat sich der *Fundort*, nicht die Absicht.
Siehe `knowledge/08` Abschnitt 9.

**Warum „Keine Qualitätsaussage" keine Bescheidenheit ist.** Für die Frage „ist der
empfohlene Satz gut?" existiert kein Validator. Das Kriterium lässt sich nicht nach links
schieben (`knowledge/07` B6), und ein Modell darf nicht über die eigene Ausgabe richten
(`knowledge/07` D4) — das abschliessende Güteurteil bleibt deshalb offen markiert,
während die Auswahl selbst Aufgabe von `harness-build` bleibt. Fremd belegt bei Reyes
(Factory) für dessen eigenes Kernprodukt: „we do not yet have validators … we're unable
to close the loop on some of those challenges. It's an engineering task to build the
system that can verify some of those very hard problems" (19:01).

**Zur Wiederholung desselben Falls.** Sie ist bei Stufe 2 zulässig und nützlich: sie
schärft die Bestehensquote pro Fall, und genau die ist der Messgegenstand — ein Eval
misst Modellverhalten, nicht die Welt. Anand stützt das ausdrücklich: „It improves my
estimate of what the model is telling me." Unzulässig ist nur der Sprung von dieser
Quote zu einer Aussage über die Güte eines Bausteins; dafür hilft keine Wiederholung,
sondern nur ein neuer, anders gelagerter Fall. Für Stufe 1 entfällt die Frage —
`cmdSearch` ist deterministisch, zwei Läufe liefern byteidentische Ausgabe.

**Was die Prüfung ergab.** Die vorgeschlagene Baseline ist entartet: `cmdSearch` ist
selbst ein namensgewichteter Term-Matcher, die „Baseline" also ein Spezialfall des
Prüfgegenstands. <!-- lint:historisch --> Zum Prüfzeitpunkt 2026-08-07 arbeitete
`cmdSearch` als Substring-Matcher (+10 auf `name + id`) — gemessen 8/10 gegen 7/10 bei
identischem Top-1 in 9 von 10 Fällen; dieser Altstand bleibt stehen, weil die Messung
gegen genau dieses Verhalten lief und ohne ihn nicht nachvollziehbar wäre. Seit
2026-08-08 matcht `cmdSearch` auf Wortanfangs-Präfixe mit Stoppwortfilter
(`bewerteTreffer()`, `STOPPWOERTER`, `termRegex()` in `tools/harness.mjs`); am
Argument ändert das nichts — die „Baseline" bliebe ein Spezialfall des
Prüfgegenstands. Der Umfang (bis zu 120 Fälle) widerspricht `knowledge/04:284`;
die Spezifikation verrottet an sich selbst (ihr Beispielfall `keine-jp-stummel` ist
bereits falsch). Deutsche Fälle sind auf Rot konstruiert: 5 von 6 realistischen deutschen
Anfragen liefern null Treffer.

**Betroffen.** Neuer Subcommand `eval`, neues Verzeichnis `evals/`. Entspricht M5 aus
`knowledge/04:387` — nicht doppelt zählen.

## M8 — Sprachhinweis in der Sackgasse statt Synonymtabelle

**Was zu tun ist.** Kein `catalog/synonyms.json`, keine Query-Expansion.

1. `tools/harness.mjs`, Nullstellen-Zweig Z. 714–718, ~10 Zeilen: sieht die Query
   deutsch aus (`[äöüß]`, oder `ae|oe|ue` in einem Wort > 5 Zeichen, oder Endung
   `-ung|-heit|-keit|-ierung|-barkeit`), eine Hinweiszeile ergänzen: der Katalog ist
   durchgängig englisch, mit drei Beispielen **im Hinweistext**, nicht in einer Datei.
2. `harness-build/SKILL.md` Schritt 2, zwei Sätze über der bestehenden Symptomtabelle:
   warum englisch gesucht wird, und dass 0 Treffer zuerst den falschen englischen
   Begriff verdächtigen lassen, nicht einen leeren Katalog.

**Warum.** Rallabandis Relevanzkriterium macht die Lücke messbar.

**Was die Prüfung ergab.** Die Übersetzungsschicht existiert bereits an der richtigen
Stelle: `harness-build/SKILL.md` Schritt 2 heißt wörtlich „Bedarf in Suchen übersetzen",
alle sechs Queries der Tabelle liefern Treffer. Die vorgeschlagene Tabelle wäre
schlechter als das Modell (das Beispiel „kontext sparen → context economy" liefert
37 Relaxations-Treffer mit einem Legacy-Shim an Platz 1; das Modell wählt „token budget"
und trifft), arbeitet gegen die bewusst gesetzte UND-Semantik (Z. 703–706) und scheitert
an deutscher Morphologie ohne Stemming. Zudem kollidiert sie mit `catalog/intents.yaml`
(M9 in `knowledge/04:356`).

**Betroffen.** `cmdSearch` Z. 714–718, `harness-build/SKILL.md` Z. 81–93.
**Nebenbefund, separat**: Z. 711 gibt „zeige Teiltreffer" aus und direkt danach Z. 715
„Keine Treffer" — Fix `if (relaxed && scored.length)`. Neue ID vergeben, M8 ist in
`knowledge/04:355` belegt.

**Nachtrag (2026-08-08): die Stoppwortliste ist keine Synonymtabelle.** Der Suchfix
vom 2026-08-08 hat eine Stoppwortliste eingeführt (`STOPPWOERTER` in
`tools/harness.mjs`, 89 englische Funktionswörter). Das ist keine Wiederbelebung der
hier abgelehnten Synonymtabelle: die Tabelle hätte übersetzt und expandiert — eine
offene Bedeutungstabelle, die mit jeder Domäne wächst und gepflegt werden muss. Die
Stoppwortliste übersetzt und expandiert nichts, sie entfernt Terme einer
geschlossenen Grammatikklasse — endlich, sprachstabil, ohne Domänenpflege. Die
Ablehnung oben bleibt in Kraft; der M8-Sprachhinweis selbst blieb beim Suchfix
unangetastet.

## M9 — Den Feuerpreis anzeigen statt der Verzeichnisgröße

**Was zu tun ist.**

1. `extractRepo`, Skill-Zweig ab Z. 273: Feld `entryBytes: safeSize(full)` neben `bytes`.
2. `cmdSearch` Z. 724: `8 KB lädt · 1125 KB gesamt in 61 Datei(en)`. Bei
   `entryBytes === bytes` unverändert ausgeben.
3. `cmdSearch` Z. 697: Kleinheitsbonus auf `entryBytes < 20000` umstellen.
4. `cmdShow` Z. 748 analog, mit Token-Schätzung als Schätzung gekennzeichnet.
5. Eine Schwelle, kein Budget: `entryBytes > 40.000` → „große SKILL.md, steht ab dem
   Greifen dauerhaft im Kontext".
6. `harness-build/SKILL.md` Z. 116, Kriterium 3 präzisieren; Spalte `KB` → `lädt`.

**Warum.** Garg: der Harness bestimmt den Tokenverbrauch mit. Kumar: was vorberechnet
ist, erspart den Dateiaufruf.

**Was die Prüfung ergab.** Zwei Annahmen sind falsch. `eager/lazy` existiert bereits,
und zwar präziser: `knowledge/02:62` führt eine Typ-Tabelle mit Spalte „Kontext-Kosten"
plus einem Absatz je Typ. Und die Budgetsumme misst nichts: zwölf Bausteine kosten
dauerhaft rund **555 Token**; keine Description im Bestand erreicht die Kappungsgrenze.
`harness-build/SKILL.md` begründet die 5-bis-12-Grenze bereits richtig mit
Trennschärfe, nicht mit Speicher — M9 hätte die falsche Begründung wieder eingeführt.
Was stimmt, aber umgekehrt: die angezeigte KB-Zahl ist die falsche. `search "docx"`
meldet 1125 KB bei 7.002 Bytes SKILL.md — Faktor 160. Bei 37 von 402 Skills überschätzt
die Anzeige um mehr als das Vierfache, und zwei Stellen handeln darauf (Auswahlkriterium
3, Score-Bonus). Die Bibliothek rankt damit ihre eigenen Referenz-Skills nach unten.
Umgekehrt unsichtbar: `last30days` mit 224.496 Bytes SKILL.md.

**Betroffen.** `extractRepo` Z. 273 ff., `cmdSearch` Z. 697/724, `cmdShow` Z. 748,
`harness-build/SKILL.md` Z. 116/144. Braucht einen `extract`-Lauf.

## M10 — Frontmatter-Schema erfüllen, Falschaussagen in `04` richtigstellen

**Was zu tun ist.**

1. **Frontmatter nach dem vorhandenen Schema**, nicht nach `stand:` — `cmdLint`
   Z. 1136–1146 prüft `sources`, `status`, `stale_after`, `verified`. `stale_after`:
   3 Monate für `04` (misst einen beweglichen Katalog), 12 Monate für `01/02/03`.
2. **Zahlen nicht löschen, sondern reproduzierbar machen**: jede Katalogzahl bekommt den
   erzeugenden Befehl danebengeschrieben. Code-Konstanten (1.536-Zeichen-Limit,
   Score +10/+3/+1) bleiben ohne Stempel.
3. **Falschaussagen in `knowledge/04` richtigstellen**: die Suche macht **UND mit
   Lockerung**, nicht ODER (`code review` = 49, `review` = 112 — die Doku behauptet 231
   gegen 107, also das Gegenteil); Tabelle Z. 33–38 neu messen; Bestand 1.050 → 954,
   25.593 → 25.497; `ja-jp` 163 → 1; Hooks 152 → 56 und 45 % → 89 %, ausdrücklich als
   **Verschlechterung** gekennzeichnet; `general` 27 % → 34,7 %, ebenfalls schlechter.
4. M1 und M6 in der Maßnahmentabelle als **erledigt** kennzeichnen, mit Codebeleg
   (`TRANSLATION_RE` Z. 236, `isPlaceholder` Z. 241, `classify()` Z. 180–186) — nicht
   löschen, sonst geht die Begründung verloren.
5. Mitfixen, was `lint` nicht erreicht: `knowledge/02` Z. 176/413, `recipes/README.md`
   Z. 73, beide `SKILL.md` — dort durch einen Verweis auf `stats` ersetzen, nicht durch
   eine neue Zahl. <!-- lint:historisch --> Der ursprüngliche Zusatz „Beide Kopien
   (`skills/` und `~/.claude/skills/`) ändern" ist **gegenstandslos**: die globale
   Ablage der Bedien-Skills unter `~/.claude/skills/` existiert nicht mehr, es gibt je
   Skill genau eine Datei unter `.claude/skills/` im Projekt.
<!-- lint:historisch --> Punkt 3 nennt die alten Werte (1.050, 25.593, 163, 152) absichtlich:
eine Korrekturanweisung ohne den zu ersetzenden Wert ist nicht ausführbar.

**Warum.** Salomon/Yosef: wer beschreibt statt zieht, hat Drift. Wang: veraltete
Dokumentation ist Teil der Realität. Branco: Verfall muss gemeldet werden.

**Was die Prüfung ergab.** Der Kern ist härter belegt als behauptet:
`node tools/harness.mjs knowledge "suche mehrwort treffer"` liefert den falschen
Abschnitt wörtlich aus — unter dem Header „Quelle: ausgewertetes Fremdmaterial mit
Belegen, kein Modellwissen. Beim Weitergeben die Fundstelle nennen." Das CLI weist den
Agenten also an, den falschen Zahlen zu vertrauen und sie zu zitieren. Es sind
mindestens sieben Falschaussagen, nicht vier. Vier Ausführungsfehler: `stand:` ist kein
Feld, das der eigene Linter kennt; „datieren" ist schon da (`04:10` trägt ein Datum und
ist trotzdem falsch — bindend ist allein `stale_after` + `lint`); „jede Bestandszahl
ersatzlos raus" zerstört die Beweislast von `04`; und der Satz „danach hält M1 diesen
Zustand automatisch" ist falsch — `cmdLint` prüft heute keine einzige Zahl.

**Betroffen.** Alle Dateien unter `knowledge/` und `recipes/`, `recipes/README.md`,
beide `SKILL.md` in doppelter Ablage. **Nicht behauptet**: dass `lint` diesen Zustand
danach automatisch hält — das ist M1.

## M11 — Rezepte auf Abschnittsebene selbsttragend machen

**Was zu tun ist**, in dieser Reihenfolge:

1. **CLI zuerst** (~10 Zeilen in `cmdInstall`): `--dry-run` gibt je Zeile die KB-Zahl und
   am Ende `N Bausteine, ~X KB` aus. Ohne das bleibt jede Bar-Formulierung wirkungslos.
2. `## Kern-Set (Pflicht)` → `## Kern-Set (Startauswahl, zu kürzen)`, plus zwei Sätze
   **im selben Abschnitt**: bindend ist die Spalte „Welches Problem er löst", nicht die
   Liste; wer ein Symptom nicht wiederfindet, streicht die Zeile.
3. Bar je Rezept vereinheitlichen — 02–06 bekommen den Satz aus 01, mit den bestehenden
   Summen (52/50/43/63/36 KB) als Obergrenze. Keine neuen Zahlen erfinden.
4. **Verifikationspfad als auszufüllendes Feld**, nicht als fester Befehl: vor
   „Reihenfolge der Einführung" ein Dreizeiler, der einen Befehl im Zielprojekt
   verlangt; existiert keiner, ist er der erste Arbeitsschritt.
5. `harness-build/SKILL.md` Schritt 7: der ausgefüllte Verifikationsbefehl steht im
   Ergebnisbericht.
6. Optional (~15 Z. in `cmdLint`): Rezept-IDs gegen den Katalog — überschneidet sich mit
   M1 Prüfung A und M12a.
7. **Den vorhandenen Block „Wann es nicht passt" um belegbare Voraussetzungen einzelner
   Kern-Set-Bausteine ergänzen** — nur dort, wo ein Baustein ohne die Voraussetzung
   nachweislich nichts liefert, und nur mit einer Bedingung, die aus `show` bzw. dem
   Baustein selbst hervorgeht. Die Form existiert bereits zweimal und wird kopiert, nicht
   erfunden: Rezept 03 („Reine LLM-Anwendungen ohne eigenes Training brauchen
   `mle-workflow` nicht") und Rezept 05 („Wenn keine Live-URL abrufbar ist, liefern die
   meisten Bausteine hier nichts"). Kandidaten mit harter Voraussetzung:
   `anthropics__skills/skill/webapp-testing` (lokal startbare App),
   `msitarzewski__agency-agents/agent/api-tester` (erreichbare Endpunkte),
   `usestrix__strix/skill/penetration-testing-with-strix` (ausführbares Ziel plus die in
   Rezept 04 bereits genannte schriftliche Erlaubnis), die `AgriciDaniel__claude-seo`-Kette (abrufbare
   Live-URL). Formuliert als Voraussetzung des **Bausteins**, nicht als Vermutung über
   das Zielprojekt. Keine neue Tabellenspalte, kein neuer Abschnitt. Grund: die harten
   Voraussetzungen stehen heute nur auf Rezept-Ebene, nicht am Baustein — und `knowledge`
   schneidet abschnittsweise aus.

**Warum.** Garg warnt vor kollabiertem Lösungsraum. Wang verlangt Verifikationspfad,
erlaubten Zustand, vorab einzusammelnden Kontext.

**Was die Prüfung ergab.** Der reale Mechanismus ist ein Retrieval-Verlust: die
Entdogmatisierung existiert, aber in `recipes/README.md` — und `knowledge` schneidet
abschnittsweise aus, liefert also „Kern-Set (**Pflicht**)" samt ID-Tabelle ohne die
Relativierung. Behoben mit einer Überschrift plus zwei Sätzen, nicht mit einer
Strukturmaßnahme. Widerlegt: „IDs nur als Beispiel" (alle 99 lösen auf; sie sind der
Nutzen der Ebene, und die Degradierung schickt den Agenten zurück in die teuerste
Operation der Bibliothek) und „Durchsicht auf Ausnahmeklauseln" (der Grep findet keine
einzige; Rezept 04 dreht sie sogar um: „Ohne diesen zweiten Lauf ist ‚behoben' eine
Behauptung"). Trigger-Kollision ist doktrinär abgedeckt, aber nicht maschinell prüfbar —
also keine „Bar" im Wang-Sinn. Aufwand fällt von „groß" auf „klein".

**Betroffen.** `cmdInstall`, alle sechs `recipes/0*.md`, `harness-build/SKILL.md`.

## M12 — `verify-recipes` statt manueller Durchlauf-Kampagne

**Was zu tun ist.**

- **(a) Priorität 2, ~50 Zeilen.** `node tools/harness.mjs verify-recipes`: alle IDs aus
  `recipes/*.md` gegen den Katalog, plus Typ-Abweichung zwischen Tabellenspalte und
  Katalog, plus Größenabweichung gegen die KB-Spalte, plus `--dry-run` je Rezept. Läuft
  nach `update` und im `lint`-Sammellauf. Meldet heute 0 Befunde bei 99 IDs — das ist
  der Punkt: Regressionsschutz, kein Reparaturauftrag.
- **(b) Priorität 4.** Rauchtest **nur für Ausführbares**: `verify-recipes` markiert
  Bausteine mit Nicht-`.md`-Dateien. Im gesamten Kern-Set aller sechs Rezepte ist das
  derzeit genau einer — `anthropics__skills/skill/webapp-testing`. Einmal
  `scripts/with_server.py --help` laufen lassen und Voraussetzungen (Python, Playwright,
  Browser) sowie Ausfallverhalten im Rezept vermerken. Eine halbe Stunde.
- **(c) Priorität 4.** Vermerk über das vorhandene OKF-Feld `verified: YYYY-MM-DD` plus
  den Repo-HEAD als Anker (`repos[].head`, Z. 497–502) — kein neues Feld erfinden.

**Warum.** Wang: erst vertikal tief, dann horizontal breit. Davis: die Referenz-
implementierung hielt die eigene Spezifikation nicht ein, und das fand nur, wer sie
laufen ließ.

**Was die Prüfung ergab.** Beide Prämissen tragen nicht. Die IDs sind geprüft: 99 von 99
lösen auf; der Nachweis ist nur nicht wiederholbar, nicht fehlend. Und die Rauchtest-
Prämisse trifft ins Leere: die Kern-Sets bestehen aus 33 Einträgen, ausschließlich
`skill` und `agent`, 24 davon eine einzige Markdown-Datei. Eine Markdown-Datei hat kein
Ausfallverhalten. Fengs Taxonomie greift bei genau 1 von 32 Pflichtbausteinen. Für die
übrigen 31 degeneriert „auslösen und gegen die Description halten" zur Routing-Frage,
die M7 deterministisch besitzt. **Zusatzbefund mit eigenständigem Wert**: kein Kern-Set
eines Rezepts enthält einen Hook, Command oder MCP — die Rezepte empfehlen im
Pflichtteil ausschließlich Kontextmaterial und keinen einzigen Zwang. Gegen Doktrin 1.1
(„Hook = Zwang, nicht Bitte") ist das vor jedem Rauchtest zu klären.

**Betroffen.** Neuer Subcommand `verify-recipes` (Überschneidung mit M1 Prüfung A und
M7 Punkt 4 — vor der Umsetzung entscheiden, wo die Prüfung wohnt), `recipes/*.md`
Frontmatter.

---

## M13 — `harness-build` Schritt 1: Prüfschleifen erheben und die Ausschlussfrage stellen

**Was zu tun ist.** Zwei Fragen in Schritt 1 von `harness-build/SKILL.md`, zusammen rund
sechs Zeilen Prosa, keine Codeänderung.

1. **Welche Prüfschleifen liefern heute ein Ja/Nein?** Linter, Typechecker, Testsuite,
   Schema-Validierung, Security-Scan, CI-Gate. Abzulesen aus `package.json`,
   `pyproject.toml`, `go.mod`/`Makefile`, `tsconfig.json`, Linter- und CI-Konfiguration —
   das liest Schritt 1 ohnehin. **Notiere den Befehl, nicht die Absicht**, und
   unterscheide „vorhanden" von „läuft und ist grün": ein `"test": "echo no tests"` und
   eine rote CI sind keine Schleifen. Geht es aus den Dateien nicht hervor, ist das die
   eine Sache, die per `AskUserQuestion` an den User geht. Tatsachen sammeln, kein
   Qualitätsurteil über das fremde Projekt fällen.
2. **Was ausdrücklich nicht gebraucht wird.** Diese Angabe steht in keiner Projektdatei —
   was hier nicht gefragt wird, setzt der Agent selbst, und der User sieht es erst in der
   Auswahl. Auf Rezeptebene gibt es dafür „Bewusst weggelassen", auf Projektebene nichts.

In Schritt 6, eine Zeile über der Auswahltabelle: `Prüfschleifen heute: <befehl> ·
<befehl>` — oder `Prüfschleifen heute: keine.`

**Regel bei null Schleifen.** Der erste Baustein ist der, der **„fertig" entscheidbar
macht**; der Typ folgt aus dem Fall und ist nicht vorgegeben. Zuerst den Massstab: bei
bestehender Codebasis ohne Test-Suite ein Agent, der Invarianten mit Test-Ankern aus dem
Code zieht (`affaan-m__ecc/agent/spec-miner`, so in `recipes/06` bereits begründet); bei
jungem Projekt ein TDD-erzwingender Command. **Erst wenn ein Check existiert, der Hook**,
der ihn bei jeder Änderung ausführt. Ein Hook führt eine Prüfung aus, er erzeugt keine —
vorher installiert liegt er tot in `.claude/hooks/`.

**Warum.** Reyes (Factory) macht die Dichte deterministischer Prüfschleifen zur
Messgrösse über die Codebasis und leitet daraus die Ausgabequalität ab; Anand belegt,
dass fehlender Kontext nicht ausgelassen, sondern erfunden wird. Belege und Grenzen:
`knowledge/08` Abschnitte 1, 2 und 6. Doktrinärer Rückhalt im eigenen Bestand:
`knowledge/01` Checkliste Frage 3 („Baue stattdessen den Check ein — er ist billiger und
zuverlässiger").

**Was die Prüfung ergab.** Die Lücke ist real: `harness-build/SKILL.md` erhebt heute
Was, Stack, Reifegrad und Schmerz, die CI-Konfiguration taucht nur als Informationsquelle
über den Stack auf, nicht als Befund. Widerlegt wurde die ursprüngliche Typ-Vorgabe
„Hook oder Command" für den Null-Schleifen-Fall: ein katalogisierter Hook führt eine
vorhandene Prüfung aus und erzeugt keine, und `recipes/06` beantwortet denselben Fall
bereits mit einem Agenten. Ebenfalls widerlegt: eine zweite Spalte „Woran sichtbar, dass
es gewirkt hat" — Schritt 6 liegt vor der Installation, der Baustein hat im Zielprojekt
nie gelaufen.

**Betroffen.** `.claude/skills/harness-build/SKILL.md`, Schritt 1 und Schritt 6. Kein
CLI-Eingriff.

## M14 — Rückkanal: was ein `harness-build`-Lauf hinterlässt

**Was zu tun ist.** Ein Schritt 9 „Rückmeldung an die Bibliothek" in
`harness-build/SKILL.md`, rund zwölf Zeilen, plus zwei Ablageorte, die es schon gibt.

1. **Die tatsächlich abgesetzten Suchen wörtlich mitschreiben** — Frage, Filter,
   gewählter Baustein, **und die Suchen, die nichts Brauchbares lieferten**. Ohne diese
   Notiz gibt es beim ersten echten Lauf nichts zu ernten: das Manifest führt die
   Herkunft des *Bausteins*, nicht die *Frage*, die zu ihm führte. Aus einer solchen
   Notiz wird ein Fall in `evals/routing.jsonl` (`frage`, `erwartet`, `warum`; ein
   sachlich falscher Treffer als `verboten` im selben Fall) — im Rahmen des
   Umfangsdeckels aus M7, also ersetzend statt ergänzend.
2. **Der fehlende Baustein bekommt einen benannten Ort:** ein Kommentarblock am Ende von
   `sources.txt`, eine Zeile je Lücke, Format `# Lücke: <Suche> · <Projekt> · <Datum> ·
   Kandidat: <Repo-URL oder "keiner">`. `sources.txt` ist die Datei, die diese
   Information verbraucht, und das CLI liest sie ausschliesslich — Kommentare überleben
   jedes `update`. **Eine leere Lückenliste ist ein gültiges Ergebnis** und wird als
   solche vermerkt, sonst erfindet der nächste Lauf Lücken.
3. **Drei Fragen an den Besitzer, als Text:** Was hat gefehlt oder nicht gepasst? War das
   an diesem Projekt oder allgemein? Wenn allgemein: welches Rezept oder welcher
   Wissensabschnitt zieht nach? Die Antwort geht **an den Besitzer**, nicht vom
   Zielprojekt-Agenten in die Bibliothek — er sitzt ausserhalb und hat dort keine
   Schreibzuständigkeit.
4. **Einarbeitung über die vorhandenen Bahnen.** Führt der Befund zu einer Rezept- oder
   Wissensänderung, ist das ein `revise`-Eintrag; die Aktionsartentabelle verlangt dort
   ohnehin „woran der Irrtum bemerkt wurde" — dort steht dann „beim Setup von Projekt X".
   War der Befund projektspezifisch, kommt eine Zeile in „Bewusst nicht umgesetzt", deren
   Grundspalte den Projektbezug nennt. Zuständig bleibt der `wissensbank-autor`.

**Warum.** Wu (Cognition): „the feedback is actually like half of the loop that makes the
next deployment better than the previous deployment" — und die Entscheidung „allgemein
oder einmalig" ist genau der Schritt, der aus Dienstleistung Erkenntnis macht. Reyes
lehnt Kundenarbeit ab, die nicht ins Produkt zurückwirkt. Belege: `knowledge/08`
Abschnitt 11.

**Was die Prüfung ergab.** Der Rückkanal ist heute an zwei Stellen als Handlungsanweisung
vorhanden (`harness-build/SKILL.md` und `harness-update/SKILL.md`: „wenn nichts Passendes
da ist, ein passendes Repo in `sources.txt` aufnehmen") und nirgends persistiert;
`sources.txt` enthält keine einzige vermerkte Lücke. Verworfen: eine vierte Aktionsart in
`knowledge/LOG.md`, weil `revise` die geforderten Felder bereits verlangt und LOG.md das
Änderungsprotokoll der Wissensbank ist, nicht ein Laufprotokoll des Werkzeugs.
Ebenfalls verworfen: verworfene Treffer zusätzlich zu persistieren — eine verworfene ID
sagt nach dem nächsten `update` nichts mehr über den dann geltenden Bestand.

**Sicherheit: mittel, nicht hoch.** Es hat noch keinen Einsatz gegen ein Fremdprojekt
gegeben (Aufgabe „Am echten Projekt verifizieren" ist offen). Der Nutzen ist begründet,
nicht gemessen — aber jetzt ist der billigste Zeitpunkt, die Notiz zu setzen.

**Betroffen.** `.claude/skills/harness-build/SKILL.md`, `sources.txt` (nur Kommentare),
`evals/routing.jsonl`. Kein CLI-Eingriff.

## M15 — `eval` sichtbar machen und an einen Ablauf hängen

**Was zu tun ist.** Vier kleine Eingriffe. Der Befehl existiert, läuft in unter einer
Sekunde und setzt bei Pflichtfehlschlag Exit-Code 1 — er wird nur von nichts ausgelöst
und steht an keiner Stelle, die ein Agent liest.

1. **Vierter Schritt in `cmdUpdate`:** nach dem Changelog-Block ein Schritt
   `4/4  Routing-Evals`, der `cmdEval` fährt. Den bereits geladenen Katalog durchreichen,
   statt ihn ein zweites Mal zu laden. Fehlendes `evals/`-Verzeichnis darf `update`
   **nicht** per `die()` abbrechen — in dem Fall eine Hinweiszeile und regulär enden; das
   Changelog ist zu diesem Zeitpunkt schon geschrieben.
2. **Ergebnis als eine Zeile in den obersten `CHANGELOG.md`-Abschnitt**, den `cmdUpdate`
   ohnehin erzeugt (`Routing-Evals: 12 von 12 bestanden` bzw. die durchgefallenen Fälle
   namentlich). **Nicht** in `knowledge/LOG.md`: dort steht die Geschichte der
   Wissensbank mit drei definierten Aktionsarten und einer Begründungspflicht, die eine
   Maschine nicht erfüllen kann — und die Datei läuft durch `lint`, wo maschinell
   angehängte Zahlen und IDs Fehlalarme auslösen.
3. **Sichtbarkeit:** eine Zweckzeile für `eval` in `befehlsUebersicht()`, damit `extract`
   die Zeile nach `INDEX.md` schreibt. `INDEX.md` führt heute elf Befehle, der Dispatcher
   zwölf — die einzige Lücke ist `eval`, und ihre Ursache ist ein `extract`, das seit dem
   Einbau nicht mehr lief. Die Zahlangabe „alle elf Befehle" in `CLAUDE.md` wird damit
   ebenfalls falsch und muss mit.
4. **`node tools/harness.mjs eval` in den Nachweis-Block von
   `.claude/agents/werkzeug-aenderer.md`** aufnehmen; dort steht heute nur `lint --all`.
   Und zwei Sätze in `harness-update/SKILL.md`: dass `update` vier Schritte hat und ein
   roter Eval-Lauf dem User gemeldet wird, statt in der Rohausgabe unterzugehen.

**Warum.** Gupta (Nubank) macht den billigen Test zur Vorbedingung des teuren: „They
don't launch until they're happy with the sim output." **Die Begründung ist bei uns
umgekehrt herzuleiten:** dort ist die Verifikation der teure Teil (Evals „a few days", ein
A/B-Test „can take forever"), hier ist sie praktisch gratis und läuft trotzdem nie, weil
kein Ablauf sie auslöst. Siehe `knowledge/08` Abschnitt 9.

**Was die Prüfung ergab.** Verworfen wurde eine Kette `lint` → `eval`: die beiden prüfen
Verschiedenes, und `lint --strict` steht heute allein deshalb auf 1, weil Rohquellen noch
nicht ausgewertet waren — eine Kette hätte den Suchtest gesperrt, weil ein Vortrag noch
nicht eingepflegt war. Ebenfalls verworfen: das Ergebnis nach `knowledge/LOG.md` zu
schreiben (Kategorienfehler, siehe Punkt 2). Der Exit-Code von `update` ändert sich durch
Punkt 1 — das ist gewollt (`knowledge/04` 4.2), aber eine bewusste Vertragsänderung.

**Vorbedingung für mehr.** Bevor `eval` weitere Sperrwirkung bekommt, muss einmal
gemessen werden, ob ein grüner Lauf überhaupt mit dem Ausgang einer Projektverifikation
zusammenhängt. Ohne diesen Abgleich ist jede weitere Schranke eine Schranke ohne
Vorhersagewert — genau die Bedingung, die Gupta für seine eigene Sperre erfüllt hat.

**Betroffen.** `cmdUpdate`, `befehlsUebersicht()`, `INDEX.md` (erzeugt), `CLAUDE.md`,
`.claude/agents/werkzeug-aenderer.md`, `.claude/skills/harness-update/SKILL.md`.

## M16 — `cmdStats` bekommt seinen Einwand, wie `eval` und `lint` ihn haben

**Was zu tun ist.** Zwei Zeilen an die Kopfausgabe von `cmdStats`:

> Was diese Zahl nicht sagt: ob ein Baustein gut ist oder je benutzt wurde.
> Sie wächst mit jedem aufgenommenen Repo.

Belegbar ohne neue Datenquelle: der Katalog führt `bulk` je Eintrag, die Aufteilung in
Standardzugriff und Massen-Repos ist bereits berechenbar.

**Warum.** Wu (Cognition) formuliert den Einwand gegen seine eigene Aktivitätszahl, bevor
das Publikum ihn stellt („this actually just kind of looks like token maxing"). Die
einzige Zahl dieser Bibliothek, die sich genauso verhält — sie wächst mit jedem
aufgenommenen Repo, ohne dass Nutzen entsteht — ist die Bestandszahl. `eval` und `lint`
tragen ihren Einwand bereits in der eigenen Ausgabe; `cmdStats` ist der einzige
zahlenausgebende Befehl ohne. Siehe `knowledge/08` Abschnitt 4.

**Was die Prüfung ergab.** Ausdrücklich verworfen: ein Zähler „wurde jemals ausgelöst".
Die Bibliothek führt kein Register ihrer Zielprojekte — `cmdInstall` schreibt das Manifest
ausschliesslich ins Ziel, nichts zurück —, Hooks hinterlassen ohnehin keine Spur, und die
Messung läge heute bei null verstrichener Zeit. Die ehrlichere Zahl ist der von
`activationOf` bestimmte Zustand: ob ein Baustein überhaupt feuern **kann**, aus dem
Zustand des Zielprojekts statt aus fremder Telemetrie. Ebenfalls verworfen: die
Routing-Trefferquote als „unsere Sessionzahl" zu führen — sie ist gegen eine eingefrorene
Falldatei gerechnet und durch Benutzung nicht aufblasbar.

**Betroffen.** `cmdStats`.

## M17 — Reibung kennzeichnen, und `activationOf` nicht „wirksam" melden lassen, wo nichts wirkt

**Was zu tun ist.** Zwei getrennt zu entscheidende Teile.

**(a) Kennzeichnung in `harness-build/SKILL.md` Schritt 6, reiner Prosa-Eingriff.** Hinter
dem Baustein-Namen eine Marke für jeden Baustein, der den Ablauf des Menschen **anhält**
statt ihn nur zu unterstützen; unter der Tabelle je markiertem Baustein eine Zeile: *was*
blockiert wird (Ereignis und Werkzeug), *wann* es feuert, und wie man es wieder abstellt.
Im Bericht (Schritt 8) je Marke eine Zeile, was den Baustein zum Schweigen bringt.

**Woher die Marke kommt — nicht aus der Description.** Die ist an genau dieser Stelle
unzuverlässig: `affaan-m__ecc/skill/gateguard` schreibt „blocks Edit/Write/Bash", besteht
aber nur aus einer `SKILL.md` und blockiert nichts. Die Marke wird aus dem gezogen, was
`show` und der Trockenlauf tatsächlich zeigen: Typ `hook` mit `PreToolUse`, `Stop` oder
`SubagentStop` → unterbricht; ausführbare Datei im Paket mit einem dieser Ereignisse im
Code → unterbricht; nur Text, der ein Gate beschreibt → **nicht** unterbricht, sondern
bremst, mit dem Zusatz, dass der Baustein eine Bitte ist und kein Zwang
(`knowledge/02` 3.1) und dass der beschriebene Hook erst nachgebaut werden müsste.

**(b) Nebenbefund, eigener Fall für das CLI.** Der Zustandsbericht meldet für
`affaan-m__ecc/skill/delivery-gate` „aktiv … kein weiterer Schritt", obwohl das
mitgelieferte `hooks/quality-gate.py` unregistriert bleibt und der Stop-Gate damit nicht
wirkt. Für den Skill-Anteil ist die Meldung richtig, für den Hook-Anteil irreführend —
das gehört in `activationOf()`, nicht in eine `SKILL.md`.

**Warum.** Reyes: Prüfungen werden abgeschaltet, wenn sie als kleinlich empfunden werden.
Bei uns ist die Aussage aber aus dem eigenen Bestand belegt und **nicht** auf Reyes zu
stützen: `knowledge/02` führt „Fehlalarme und Reibung" als Kostenspalte der
deterministischen Bausteine, und Abschnitt 7 beschreibt den zu oft feuernden Hook samt
Folge („der User schaltet den Hook ab"). Reyes' eigentliche These über Änderungen am
Arbeitsablauf setzt Team und Kunde voraus und gilt hier nicht.

**Was die Prüfung ergab.** Verworfen: eine zweite Bestätigungsrunde als eigener Schritt.
Schritt 7 erzwingt bereits eine Zwischenzustimmung für ausführbare Inhalte; eine dritte
Runde erzieht zum Durchklicken. Verworfen ebenso: Prozentzahlen aus dem Vortrag und jede
Berufung auf Reyes in der Wissensbank.

**Betroffen.** (a) `.claude/skills/harness-build/SKILL.md` Schritte 6 und 8. (b)
`activationOf()`.

## M18 — Die Naht zwischen `/harness-plan` und `/harness-build` schliessen

**Was zu tun ist.** `harness-plan/SKILL.md` sagt zu: „Danach `/harness-build`
vorschlagen — es liest Abschnitt 5 und 6 der `PLAN.md`". `harness-build/SKILL.md` nennt
`PLAN.md` an keiner Stelle. Zwei Möglichkeiten, und nur eine davon ist billig:

1. **In `harness-build` Schritt 1 ergänzen:** Existiert eine `PLAN.md` im Projekt, sind
   deren Abschnitt 5 (Schmerzpunkte) und 6 (Prüfverfahren) die Symptomliste; die
   Rückfragen aus Schritt 1 entfallen insoweit. Die dort notierten Bars sind der Massstab,
   gegen den die Auswahl später bewertet wird; ein Baustein, der auf keinen davon
   einzahlt, braucht eine ausdrückliche Begründung.
2. **Oder** `harness-plan` so umformulieren, dass es den Ist-Zustand beschreibt, statt ein
   Verhalten von `harness-build` zu behaupten, das dort nicht kodiert ist.

Dazu, unabhängig davon und billig: die Schmerzpunkte aus Schritt 1 als **nummerierte
Liste** schreiben statt nur als Dreisatz-Zusammenfassung und zusammen mit ihr bestätigen
lassen; auf diese Nummern verweisen Schritt 4 Kriterium 1 und Schritt 5 dann wörtlich.
Die Regel existiert bereits, sie bekommt nur einen geschriebenen Bezugspunkt statt eines
erinnerten. Und: **eine leere Liste ist ein gültiges Ergebnis** — findet sich kein
benennbarer Schmerzpunkt, lautet die Antwort „kein Harness" bzw. nur `bootstrap`, nicht
ein generisches Kern-Set aus einem Rezept (Anschluss an `knowledge/01` Checkliste 8).

**Warum.** Ein Dokument, das das Gegenteil des tatsächlichen Verhaltens behauptet, ist die
Fehlerklasse, gegen die diese Wissensbank gebaut ist. Der auslösende Befund kam aus zwei
Prüfungen unabhängig voneinander (Wu zur Zeitaufteilung Verstehen gegen Bauen, Reyes zur
ROI-Geschichte vor dem Bau) — die Quellen liefern den Anlass, nicht die Begründung.

**Was die Prüfung ergab.** Ausdrücklich verworfen: `/harness-plan` als Pflichtschritt vor
`/harness-build`. Das widerspricht `harness-plan` selbst (bei Wegwerf-Prototypen „reiner
Overhead"), dem Einsatzfall von `harness-build` (laufendes MVP oder Produktivsystem — dort
gibt es keine `PLAN.md`) und dem Grundprinzip „einfachste Lösung zuerst". Ebenfalls
verworfen: „`harness-build` sucht danach nur noch zu Symptomen aus dieser Liste" — die
Liste ist die Ausgangshypothese, kein Deckel; eine Suche darf ein Symptom aufdecken, das
im Gespräch nicht benannt wurde.

**Betroffen.** `.claude/skills/harness-build/SKILL.md` Schritte 1, 4, 5;
`.claude/skills/harness-plan/SKILL.md`.

---

## Bewusst nicht umgesetzt

Kein Vorschlag wurde vollständig verworfen, aber diese Teile sind nach der Prüfung
gestrichen. Der Abschnitt existiert, damit sie nicht in sechs Monaten erneut
vorgeschlagen werden.

| Verworfen | Grund |
|-----------|-------|
| Neues Subcommand `verify` neben `lint` | Verdoppelt eine Grenze, vor der `knowledge/02` §6.2 und `knowledge/04` §5.3 selbst warnen. |
| Prüfung der INDEX.md-Summen | Tautologie — `INDEX.md` und `index.json` entstehen im selben Lauf aus demselben Objekt. |
| Volle `sources.txt` ↔ Katalog-Prüfung | Kein Symptom (13 zu 13, keine Abweichung); verwaiste Klone meldet `cmdSync` Z. 219–226 bereits. |
| Auto-Korrektur von Zahlen in Prosa | Maschinell umgeschriebene Sätze stimmen danach nicht mehr. Befund melden, Korrektur bleibt Handarbeit. |
| `catalog/state.json` | Dritte Kopie von `repos[].head`, `lastCommit`, `generatedAt`. Der Code lehnt vorberechnete Zweitindizes an anderer Stelle selbst ab. |
| Manifest-Feld „bestätigt ja/nein" | Selbstauskunft des installierenden Prozesses; kann nur „ja" sagen. Bestätigung fällt im Gespräch, nicht im CLI. |
| Rückrollpfad im CLI | Uns gehört keines der 14 Repos. Rollback-Einheit ist die Versionsverwaltung des Projekts; der protokollierte SHA genügt. |
| Blankes `list` | Das Manifest ist klein und direkt lesbar. Lohnend nur als `list --to DIR` mit Commit-Abgleich. |
| Frontmatter-Prüfung in `install` | 402 von 402 Skills bestehen sie; Agents ohne `name`/`description` kommen gar nicht in den Katalog. Null Nutzen. |
| Namenskonflikt-Prüfung in `install` | Existiert und funktioniert (Z. 915–918). |
| Existenzprüfung der Zieldatei | `copyFileSync` wirft bei Fehlschlag; ein stiller Teilkopiervorgang kommt nicht vor. |
| Automatisches Schreiben in `settings.json` | Bei 23 von 56 Hooks ist das Event nicht ableitbar, der `matcher` in keinem Fall. Fremden Code scharfzuschalten ist eine Sicherheitsentscheidung, keine Buchhaltung. |
| Zweiter Schreiber für `.claude/settings.json` | `bootstrap-project` und `update-config` sind zuständig; ein zweiter erzeugt Konflikte. |
| Rechte-Flaggen für Skills/Agents/Commands | Nur 61 von damals 954 Bausteinen deklarieren Rechte (Messung am Katalogstand 2026-08-07 08:57, nicht wiederholt <!-- lint:historisch -->); ein Bash-Block in einer `SKILL.md` ist Dokumentation, kein Vollzug. |
| Klartextanzeige von Hook-Code | 44 von 56 Hooks über 60 Zeilen, Median 120, Maximum 1.279. Sprengt das Budget, gegen das die Bibliothek gebaut ist. |
| Paarwarnung als Matrix | Suggeriert eine Abdeckung, die es nicht gibt — das Zielumfeld trägt bereits vier aktivierte Plugins und mehrere MCP-Server, die die Bibliothek nie sieht. |
| Vertrauens-Tiebreaker in der Sortierung | Greift in ~70 % der Top-10-Plätze, ändert die Reihenfolge in 13 von 20 Abfragen, verschlechtert Platz 1 in mindestens 2 Fällen. |
| Marker `!einzelquelle` | Misst Repo-Größe, nicht Qualität. `Graphify-Labs__graphify` hat 2 Bausteine und ist Vorbild in `knowledge/03`. |
| Kollisionshinweise oder Gruppierung in `search` | 33 von 43 Slug-Gruppen sind gewollte agent/skill-Paare desselben Autors; die Warnung wäre überwiegend falsch. |
| Ähnlichkeitsvergleich von Descriptions | Kein belegtes Symptom, und Beinahe-Gleichheit ist ohne Schwellenwert nicht entscheidbar. |
| Weiterreichen der Auswahl an den Besitzer | Widerspricht `harness-build/SKILL.md` Z. 115/119–120 — Auswählen **ist** die Aufgabe des Skills. |
| Naive Baseline im Eval | `cmdSearch` ist selbst ein namensgewichteter Term-Matcher (seit 2026-08-08 Wortanfangs-Präfix mit Stoppwortfilter, davor Substring); die „Baseline" ist ein Spezialfall des Prüfgegenstands. |
| 60–120 Eval-Fälle, deutsch und englisch | `knowledge/04:284`: „12–20 Fälle. Mehr wird nicht gepflegt und verrottet." Deutsche Fälle wären Dauerrot. |
| `catalog/synonyms.json` mit Query-Expansion | Schlechter als das Modell, arbeitet gegen die bewusste UND-Semantik, scheitert an deutscher Morphologie, kollidiert mit `catalog/intents.yaml` (M9 in `04`). |
| Token-Feld, `eager/lazy`-Kennzeichen, Budgetsumme | Kontextverhalten ist eine Eigenschaft des Typs (`knowledge/02:62`), nicht der Datei; zwölf Bausteine kosten dauerhaft ~555 Token — eine Obergrenze dagegen wäre Theater. |
| Feld `stand:` im Frontmatter | Kennt der eigene Linter nicht. Bindend sind `status`, `sources`, `verified`, `stale_after`. |
| Jede Bestandszahl ersatzlos entfernen | Zerstört die Beweislast von `knowledge/04`; Code-Konstanten sind ohnehin nicht flüchtig. |
| IDs in Rezepten zu Beispielen degradieren | Alle 99 lösen auf — die verifizierten IDs sind der Ertrag der Rezept-Ebene. |
| Durchsicht der Rezepte auf Ausnahmeklauseln | Der Grep findet keine einzige; Fengs Bedingung ist bereits erfüllt. |
| Trigger-Kollision als maschinelle „Bar" | Es gibt kein Werkzeug für Description-Überlappung; doktrinär bereits abgedeckt. |
| Hartkodierter Verifikationsbefehl im Rezept | Das Rezept kennt das Zielprojekt nicht — das wäre genau die Hartkodierung, die M11 abstellen will. |
| Jeden der 32 Pflichtbausteine manuell auslösen | Dutzende Sitzungen für ein nicht reproduzierbares Ergebnis, das beim nächsten `update` still verfällt. |
| Messfelder im `harness-manifest.json` (Vorher/Nachher-Wert) | Die Dokumentebene wird bei jedem `install` neu geschrieben; aus `prev` wird nur `.items` gelesen. Der Wert wäre nach der nächsten Installation weg. Und `install` läuft im Agentenbetrieb zwingend mit `--yes` — es gibt keinen Eingabepfad, der Agent schriebe die Zahl selbst. |
| Pflichtfeld `herkunft` je Eval-Fall | Nicht belegbar (kein Anfragenprotokoll), praktisch konstant, kein Trennwert. Der Zustand gehört einmal in den Kopf von `evals/routing.jsonl`. |
| Pflichtfelder `autor`/`datum` je Eval-Fall | `git blame` liefert beides generiert statt gepflegt; `lint` prüft `evals/` gar nicht, es gäbe keinen Erzwinger. Doppelt geführte Angaben verbietet `knowledge/07` E3. |
| Gewichtung „Feldfall zählt stärker" im Eval | `cmdEval` kennt bestanden/durchgefallen und einen Exit-Code; eine Gewichtung hätte keinen Konsumenten. |
| Vielfaltszahl (verschiedene IDs in den Top-n) als zweite Kennzahl | Falsch gepolt: bei der einzigen real belegten Einebnung (frühere ODER-Semantik) steigt sie, während die Bestehensquote fällt. Die richtige zweite Zahl ist die Rangverschiebung, M7 Punkt 1. |
| Protokollierung jeder Suchanfrage nach `evals/` | `ladeEvalFaelle` macht aus jeder Nicht-Kommentarzeile in `evals/*.jsonl` einen Fall; Logzeilen gälten als bestanden und machten die echten unsichtbar. Ein Log liefert ausserdem Ist-Treffer, ein Eval-Fall braucht Soll-Treffer — teuer ist das Label, nicht die Frage. |
| Kette `lint` → `eval` als Sperre | Prüfen Verschiedenes. `lint --strict` stand zeitweise allein deshalb auf 1, weil Rohquellen noch nicht ausgewertet waren — die Kette hätte den Suchtest gesperrt, weil ein Vortrag fehlte. |
| Eval-Ergebnis nach `knowledge/LOG.md` schreiben | Kategorienfehler: LOG.md ist der Zeitstrahl der Wissensbank mit drei Aktionsarten und Begründungspflicht, ein Routing-Eval misst den Katalog. Für Katalogläufe existiert `CHANGELOG.md`. |
| Vierte Aktionsart in `knowledge/LOG.md` für Einsatzberichte | `revise` verlangt bereits „woran der Irrtum bemerkt wurde"; projektspezifische Befunde gehören in diesen Abschnitt hier. Eine vierte Art machte aus dem Änderungsprotokoll ein Laufprotokoll. |
| Eingriffsstufen-Spalte (`autonom`/`Freigabe`/`Mensch`) in den Rezepten | Kategorienfehler: Rezeptzeilen sind Bausteine, keine Prozessschritte. Eine Markdown-Spalte erzwingt nichts; Erzwingung säße in `permissions`, die das CLI bewusst nicht schreibt. |
| Rückfallzeile „greift nicht, wenn X — dann Y" je Kern-Set-Eintrag | 33 Zeilen über sechs Rezepte, jede eine belegpflichtige Aussage über ein Zielprojekt, das die Bibliothek nicht betreibt. M11 Punkt 7 leistet dasselbe für ein Sechstel des Aufwands. |
| `/harness-plan` als Pflichtschritt vor `/harness-build` | Widerspricht `harness-plan` selbst („reiner Overhead" bei Wegwerf-Prototypen) und dem Einsatzfall von `harness-build` (laufendes MVP oder Produktivsystem — dort gibt es keine `PLAN.md`). |
| Zweite Spalte „Woran sichtbar, dass es gewirkt hat" in der Auswahltabelle | Schritt 6 liegt vor der Installation; der Baustein hat im Zielprojekt nie gelaufen. Eine Pflichtspalte, die nur mit Vermutung zu füllen ist, erzeugt „Die Vermutung im Faktenkostüm". |
| Zweite Bestätigungsrunde für reibungserzeugende Bausteine | Schritt 7 erzwingt bereits eine Zwischenzustimmung für ausführbare Inhalte; eine dritte Runde erzieht zum Durchklicken. |
| Kriterium „gibt nur eine Meinung ab" vor „löst ein benanntes Problem" | Achsenverwechslung — der bestehende Satz trennt Zwang von Bitte, nicht prüfbar von nicht prüfbar. Und die Typvorliebe räumte alle sechs Kern-Sets leer, die ausschliesslich aus Skills und Agents bestehen. |
| Eigenes Werkzeug zur Namensauflösung („meinen zwei IDs dasselbe?") | IDs sind `repo/typ/slug`, deterministisch und eindeutig; von 54 Namensgruppen sind 45 gewollte Typ-Sätze desselben Repos. Der Auflöser existiert bereits als `--type`. |
| Zähler „Baustein wurde jemals ausgelöst" | Kein Register der Zielprojekte, Hooks hinterlassen keine Spur, und die Messung läge heute bei null verstrichener Zeit. `activationOf` liefert die ehrlichere Grösse: ob ein Baustein feuern **kann**. |

**Nachgetragen beim Umsetzungslauf am 2026-08-07** — Teile, die erst bei der
Ausführung als überflüssig erkennbar wurden:

| Verworfen | Grund |
|-----------|-------|
| `verify-recipes` als eigener Subcommand (M12a) | Die ID-Prüfung sass zum Umsetzungszeitpunkt bereits in `cmdLint` als Naht 1, Typ- und Grössenabweichung kamen als Naht 7 dazu. Ein zweiter Subcommand wäre die Verdopplung, vor der der Abschnitt oben schon warnt. Damit ist die Frage entschieden, die M12a offengelassen hatte: **die Prüfung wohnt in `lint`.** |
| `--dry-run` je Rezept in `verify-recipes` (M12a) | Fällt mit dem Subcommand weg. `install --dry-run` mit allen Kern-Set-IDs in einem Aufruf leistet dasselbe und ist der Befehl, den `harness-build` ohnehin fährt. |
| `eval --recipes` (M7 Punkt 4) | Ein Rezept ist eine Auswahl, kein Routing-Fall: es hat keine Frage, gegen die eine Suche gemessen werden könnte. Was prüfbar ist — lösen die IDs auf, stimmen Typ und Grösse — prüft `lint`. |
| `lint` als fünfter Schritt in `cmdUpdate` (M1) | `update` fährt schon `eval` als Schritt 4 und hängt seinen Exit-Code daran. Eine zweite Sperre im selben Lauf macht aus einem Katalogbau ein Gate mit zwei Ursachen, und `lint` prüft Text gegen Text — davon ändert `update` nichts. `cmdUpdate` weist stattdessen am Ende auf `lint` hin, wenn sich der Bestand geändert hat. |
| Rauchtest für ausführbare Kern-Set-Bausteine (M12b) | `install --dry-run` über alle 32 Kern-Set-IDs meldet bei 31 „nichts Ausführbares gefunden". Einziger Träger ist `anthropics__skills/skill/webapp-testing`. Eine Markdown-Datei hat kein Ausfallverhalten — es gäbe bei 31 von 32 nichts zu testen. |
| Spalte „Vertrauen" in `INDEX.md` / `catalog/by-repo.md` (M5 Punkt 2) | Beide Dateien erzeugt `writeMarkdownIndexes()`. Von Hand eingetragen hielte die Spalte bis zum nächsten `extract`. Als Codeänderung bleibt sie möglich; als Textmassnahme ist sie es nicht. |

**Nachgetragen beim Suchfix am 2026-08-08** — dem Fix ging ein Design-Vorlauf mit
drei Entwürfen und drei adversarialen Judges voraus (Punktesummen E1 21,5 / E3 19 /
E2 16,5); umgesetzt wurde E1, das Wortanfangs-Präfix-Matching mit Stoppwortfilter.
Zwei Entscheidungen daraus gehören in diesen Abschnitt:

| Verworfen / zurückgestellt | Grund |
|-----------|-------|
| E2: IDF-Coverage-Suche mit Fallback-Kappung | **Zurückgestellt, nicht verworfen.** Eine Messbehauptung des Entwurfs („z22 bleibt Top 5") wurde am System falsifiziert; die Spezifikation ist unterbestimmt — zwei werkgetreue Nachbauten lieferten für z21 Rang 3 bzw. Rang 14; der Konflikt mit dem M5-Wortlaut „Sortierung bleibt unverändert" blieb unadressiert. **Wiedervorlage-Auslöser:** erst wenn die M2/M3-Beschreibungspflege trägt ODER ein Pflichtfall bzw. ein echter `harness-build`-Lauf Fallback-Fluten als Problem belegt. |
| Sofortfix der `hayName`-Restschwäche: der Repo-Teil der ID zählt als Inhaltssignal | Erkannte, bewusst nicht sofort behobene Schwäche. Beleg am Eval-Fall z22 („nobody understands this codebase"): sechs `Egonex-AI__Understand-Anything`-Bausteine kassieren den Namensbonus über den Repo-Teil der ID („Understand" trifft „understands" als Präfix) und stehen vor dem einschlägigen Treffer `msitarzewski__agency-agents/agent/codebase-onboarding-engineer` (Rang 7 statt Top 5 — z22 bleibt deklariert rot). Derselbe Fehlertyp wie der behobene `classify()`-Präzedenzfall, bei dem der Dateipfad als Klassifikationssignal zählte: ein Pfad- bzw. ID-Bestandteil gilt fälschlich als Inhalt. |

---

## Wie diese Liste zu benutzen ist

Diese Liste ist ein **Vorschlag, keine Verpflichtung**. Der Besitzer entscheidet, was
umgesetzt wird und in welcher Reihenfolge; die Prioritätsspalte ordnet nach
Nutzen pro Aufwand, nicht nach Dringlichkeit für irgendjemanden sonst.

Drei Regeln für den Umgang:

1. **Nichts umsetzen, ohne den Prüfabschnitt gelesen zu haben.** Die korrigierten
   Fassungen weichen an mehreren Stellen erheblich vom ursprünglichen Vorschlag ab.
   Wer nur den „Was zu tun ist"-Teil liest, baut in einigen Fällen genau das, was die
   Prüfung widerlegt hat.
2. **Was erledigt ist, wird als erledigt markiert — nicht gelöscht.** Sonst geht die
   Begründung verloren, und der Vorschlag kommt in sechs Monaten zurück. Dasselbe gilt
   für den Abschnitt „Bewusst nicht umgesetzt": er ist der eigentliche Wert dieser Datei.
3. **Zahlen in dieser Datei sind Messwerte vom 2026-08-07.** Sie driften mit jedem
   `extract`. Vor einer Umsetzungsentscheidung neu messen — `node tools/harness.mjs stats`
   und der jeweils im Abschnitt genannte Befehl. `lint` meldet die Drift inzwischen selbst.
4. **Die Übersichtstabelle ist die einzige Stelle, an der der Stand steht.** Wer eine
   Maßnahme umsetzt, ändert die Zeile dort — nicht den Abschnitt darunter. Zwei
   Standangaben derselben Sache an zwei Stellen sind genau die Fehlerklasse, gegen
   die diese Wissensbank gebaut ist.

Wenn eine Maßnahme umgesetzt wird, gehört ein Eintrag in `knowledge/LOG.md` — was
getan wurde, wodurch es belegt ist, und was dadurch in dieser Liste hinfällig wird.
