---
type: Arbeitsliste
title: Maßnahmen — was als Nächstes zu tun ist, und was bewusst nicht
description: "Beantwortet, welche zwölf Maßnahmen an Bibliothek, CLI und Wissensbank anstehen, in welcher Reihenfolge, mit welchem Aufwand — und welche Vorschläge nach adversarialer Prüfung ausdrücklich verworfen wurden."
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
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2026-11-07
tags: [massnahmen, roadmap, cli, governance, pruefung]
---

# 06 — Maßnahmen

## Abstract

Diese Datei ist die Arbeitsliste der Bibliothek: was als Nächstes zu tun ist, warum,
und was bewusst unterbleibt. Jede der zwölf Maßnahmen wurde adversarial geprüft — ein
Agent hat versucht, sie am laufenden Code und am CLI zu widerlegen, und **keine
einzige hat die Prüfung unverändert überstanden**. Was hier steht, ist die korrigierte
Fassung mit Belegen; das unterscheidet diese Liste von einer Wunschliste.

Zwei Buchführungshinweise vorab: Die IDs M1–M12 dieser Datei sind **nicht** identisch
mit den IDs M1–M10 in `knowledge/04-governance.md`. Kollisionen sind unten je Maßnahme
vermerkt. Und: Mehrere Maßnahmen sind nach der Prüfung deutlich kleiner geworden — die
Aufwandsspalte trägt den korrigierten Wert, nicht den ursprünglich geschätzten.

## Übersicht

| ID | Titel | Art | Aufwand | Prio |
|----|-------|-----|---------|------|
| M1 | `lint` um drei Nahtprüfungen erweitern, mit Exit-Code | CLI | mittel (~90 Z.) | 1 |
| M2 | Herkunft belegbar machen, `uninstall` ermöglichen | CLI | klein | 1 |
| M3 | `install` meldet den erreichten Zustand, nicht den Kopiervorgang | CLI | klein | 1 |
| M4 | Installationsgrenze absichern — `install` prüft, was ausführt | CLI | mittel (~3 Std) | 1 |
| M6 | Kollisionen an der Installationsgrenze melden statt still mischen | CLI | klein | 2 |
| M7 | `evals/routing.jsonl` + `harness.mjs eval` — Drifterkennung | CLI | klein | 2 |
| M10 | Frontmatter-Schema erfüllen, Falschaussagen in `04` richtigstellen | Doku | klein | 2 |
| M12a | `verify-recipes` als Subcommand | CLI | klein (~50 Z.) | 2 |
| M5 | Vertrauensstufe als Dokumentation und Auswahlkriterium | Struktur | klein (~45 Min) | 2 |
| M8 | Sprachhinweis in der Sackgasse statt Synonymtabelle | CLI | klein (~20 Min) | 3 |
| M9 | Feuerpreis anzeigen statt Verzeichnisgröße | CLI | klein (~5 Z.) | 3 |
| M11 | Rezepte auf Abschnittsebene selbsttragend machen | Struktur | klein | 3 |
| M12b/c | Rauchtest für Ausführbares, `verified`-Feld setzen | Prozess | klein | 4 |

Reihenfolge innerhalb Priorität 1: **M3 → M2 → M6 → M4 → M1**. M3, M2 und M6 fassen
dieselbe Funktion (`cmdInstall`) an und sollten in einem Zug erledigt werden; M1 setzt
auf den bis dahin korrigierten Zahlenbestand auf.

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
Kostenlos mitzunehmen: zwei md5-Vergleiche zwischen `skills/*/SKILL.md` und
`~/.claude/skills/*/SKILL.md` (heute byte-identisch, ohne jeden Sync-Mechanismus).

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
(uns gehört keines der 13 Repos; die Rollback-Einheit ist die Versionsverwaltung des
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
ausdrücklich. Widerlegt: Rechte-Flaggen aus Metadaten (nur 61 von 954 Bausteinen
deklarieren Rechte) und Klartextanzeige (44 von 56 Hooks länger als 60 Zeilen, Median
120, Maximum 1.279). Die Paarwarnung feuert über die sechs Rezept-Kernsets genau einmal
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
statt heute 18 von 20 — die Dominanz ist ein Bestandseffekt, 520 von 954) und erzeugt
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
   Update-Zyklen überlebt hat.

**Warum.** Rallabandi besteht auf einer Vergleichsbasis. Branco: die Dekomposition wird
selbst zur Ground Truth.

**Was die Prüfung ergab.** Die vorgeschlagene Baseline ist entartet: `cmdSearch` **ist**
bereits ein namensgewichteter Substring-Matcher (+10 auf `name + id`), die „Baseline"
also ein Spezialfall des Prüfgegenstands — gemessen 8/10 gegen 7/10 bei identischem
Top-1 in 9 von 10 Fällen. Der Umfang (bis zu 120 Fälle) widerspricht `knowledge/04:284`;
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
   eine neue Zahl. Beide Kopien (`skills/` und `~/.claude/skills/`) ändern.
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
| Rückrollpfad im CLI | Uns gehört keines der 13 Repos. Rollback-Einheit ist die Versionsverwaltung des Projekts; der protokollierte SHA genügt. |
| Blankes `list` | Das Manifest ist klein und direkt lesbar. Lohnend nur als `list --to DIR` mit Commit-Abgleich. |
| Frontmatter-Prüfung in `install` | 402 von 402 Skills bestehen sie; Agents ohne `name`/`description` kommen gar nicht in den Katalog. Null Nutzen. |
| Namenskonflikt-Prüfung in `install` | Existiert und funktioniert (Z. 915–918). |
| Existenzprüfung der Zieldatei | `copyFileSync` wirft bei Fehlschlag; ein stiller Teilkopiervorgang kommt nicht vor. |
| Automatisches Schreiben in `settings.json` | Bei 23 von 56 Hooks ist das Event nicht ableitbar, der `matcher` in keinem Fall. Fremden Code scharfzuschalten ist eine Sicherheitsentscheidung, keine Buchhaltung. |
| Zweiter Schreiber für `.claude/settings.json` | `bootstrap-project` und `update-config` sind zuständig; ein zweiter erzeugt Konflikte. |
| Rechte-Flaggen für Skills/Agents/Commands | Nur 61 von 954 Bausteinen deklarieren Rechte; ein Bash-Block in einer `SKILL.md` ist Dokumentation, kein Vollzug. |
| Klartextanzeige von Hook-Code | 44 von 56 Hooks über 60 Zeilen, Median 120, Maximum 1.279. Sprengt das Budget, gegen das die Bibliothek gebaut ist. |
| Paarwarnung als Matrix | Suggeriert eine Abdeckung, die es nicht gibt — das Zielumfeld trägt bereits vier aktivierte Plugins und mehrere MCP-Server, die die Bibliothek nie sieht. |
| Vertrauens-Tiebreaker in der Sortierung | Greift in ~70 % der Top-10-Plätze, ändert die Reihenfolge in 13 von 20 Abfragen, verschlechtert Platz 1 in mindestens 2 Fällen. |
| Marker `!einzelquelle` | Misst Repo-Größe, nicht Qualität. `Graphify-Labs__graphify` hat 2 Bausteine und ist Vorbild in `knowledge/03`. |
| Kollisionshinweise oder Gruppierung in `search` | 33 von 43 Slug-Gruppen sind gewollte agent/skill-Paare desselben Autors; die Warnung wäre überwiegend falsch. |
| Ähnlichkeitsvergleich von Descriptions | Kein belegtes Symptom, und Beinahe-Gleichheit ist ohne Schwellenwert nicht entscheidbar. |
| Weiterreichen der Auswahl an den Besitzer | Widerspricht `harness-build/SKILL.md` Z. 115/119–120 — Auswählen **ist** die Aufgabe des Skills. |
| Naive Baseline im Eval | `cmdSearch` ist selbst ein namensgewichteter Substring-Matcher; die „Baseline" ist ein Spezialfall des Prüfgegenstands. |
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
   und der jeweils im Abschnitt genannte Befehl. Ab M1 meldet `lint` die Drift selbst.

Wenn eine Maßnahme umgesetzt wird, gehört ein Eintrag in `knowledge/LOG.md` — was
getan wurde, wodurch es belegt ist, und was dadurch in dieser Liste hinfällig wird.
