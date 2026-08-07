---
type: Analyse
title: Vorbilder — Understand-Anything und graphify
description: "Beantwortet, wie zwei fremde Projekte eine grosse Wissensmenge so ablegen, dass ein Agent gezielt zugreift statt alles zu laden — und was davon für diese Bibliothek übernehmbar ist."
status: stable
sources:
  - id: understand-anything
    resource: https://github.com/Egonex-AI/Understand-Anything
    title: Understand-Anything — Claude-Code-Plugin für Codebasis-Wissensgraphen (lokaler Abzug unter C:\Users\info\.harness-sources\Egonex-AI__Understand-Anything)
    author: Egonex-AI
  - id: ua-token-reduction-design
    resource: C:\Users\info\.harness-sources\Egonex-AI__Understand-Anything\docs\superpowers\specs\2026-03-27-token-reduction-design.md
    title: Token Reduction Design — Massnahmen C1 bis C5, Schätzung für ein 500-Datei-Projekt
    author: Egonex-AI
    last_modified: 2026-03-27
  - id: graphify
    resource: https://github.com/Graphify-Labs/graphify
    title: graphify — beliebiger Ordner zu persistentem Wissensgraph (lokaler Abzug unter C:\Users\info\.harness-sources\Graphify-Labs__graphify)
    author: Graphify-Labs
  - id: harness-bibliothek
    resource: C:\Users\info\OneDrive\Desktop\Harnes Creator
    title: Eigene Harness-Bibliothek — INDEX.md, sources.txt, tools/harness.mjs, catalog/by-domain
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-05-07
tags: [wissensgraph, kontextbudget, progressive-disclosure, understand-anything, graphify, katalog-architektur]
---

# 03 — Vorbilder: Understand-Anything und graphify

> **Abstract.** Beide Projekte lösen dieselbe Aufgabe wie wir: eine grosse Wissensmenge so auf die Festplatte legen, dass ein Agent gezielt zugreift statt alles zu laden.
> Understand-Anything erreicht das durch Arbeitsteilung (deterministische Skripte + Subagenten, die auf Platte schreiben, nie in den Kontext zurück) und eine dokumentierte Payload-Diät von ~83 % der Token.
> graphify erreicht es durch eine Abfrage-Schnittstelle mit hartem Token-Budget plus eine Always-on-Regel, die dem Agenten die Zugriffs-Reihenfolge vorschreibt.

Anlass ist die Aussage des Users:

> "wir mussen das mit https://github.com/Egonex-AI/Understand-Anything und https://github.com/Graphify-Labs/graphify aufbauen oder so"

Die Sorge dahinter: das Paket in ein neues Projekt zu geben ist "zu viel" — das Kontextfenster ist voll, bevor Arbeit beginnt. Genau dieses Problem lösen beide, auf zwei unterschiedlichen Wegen.

---

## Teil A — Understand-Anything (Egonex-AI)

### A1 · Problem in einem Satz

Eine unbekannte Codebasis wird einmalig analysiert und als `knowledge-graph.json` plus interaktives Dashboard abgelegt, damit Mensch und Agent die Architektur verstehen, ohne die Quelldateien zu lesen.

### A2 · Aufbau und Ablauf

Es ist ein Claude-Code-Plugin (`understand-anything-plugin/`) mit einem TypeScript-Monorepo darunter. Die Rollenverteilung ist strikt:

| Rolle | Wo | Was |
|---|---|---|
| Orchestrator | `skills/understand/SKILL.md` (859 Zeilen) | Steuert 8 Phasen, hält Zustand in Shell-Variablen, ruft alles andere auf |
| Deterministische Skripte | `skills/understand/*.mjs`, `*.py` | `scan-project.mjs`, `compute-batches.mjs`, `extract-structure.mjs` (tree-sitter), `merge-batch-graphs.py`, `build-fingerprints.mjs` |
| Subagenten (LLM) | `agents/*.md` | `project-scanner`, `file-analyzer`, `architecture-analyzer`, `tour-builder`, `assemble-reviewer`, `graph-reviewer` |
| Nachschlage-Fragmente | `skills/understand/languages/*.md` (20), `frameworks/*.md` (10), `locales/*.md` (6) | Werden nur bei Bedarf gelesen |
| Kern-Engine | `packages/core/src/` | Typen, Suche, Embedding-Suche, Fingerprints, Ignore-Filter |

Ablauf: Phase 0 Pre-flight (Voll- oder Inkrementell-Entscheidung) → 0.5 `.understandignore` → 1 SCAN → 1.5 BATCH → 2 ANALYZE (Subagenten, bis zu 5 parallel) → 3 ASSEMBLE REVIEW → 4 ARCHITECTURE → 5 TOUR → 6 REVIEW → 7 SAVE.

Alle Zwischenstände liegen in `$UA_DIR/intermediate/` (`$UA_DIR` = `.ua/`, oder legacy `.understand-anything/`).

### A3 · Wie der Kontext klein bleibt — Kernmechanik

**(1) Subagenten geben nichts zurück.** In `CLAUDE.md` Zeile 28 steht es wörtlich: *"Agents write intermediate results to the data directory's `intermediate/` subdirectory on disk (not returned to context)"*. Der `file-analyzer` schreibt `batch-<i>.json`, der Orchestrator liest davon nur die Zusammenfassung. Das ist der wichtigste einzelne Hebel — der Subagent verbrennt sein eigenes Kontextfenster, nicht das der Hauptsitzung.

**(2) Deterministisch vor LLM.** Datei-Inventar, Import-Auflösung, Batch-Bildung, Merge, Normalisierung, Fingerprints und die Standard-Validierung sind Skripte. LLM-Token fallen nur in Phase 2, 4 und 5 an.

**(3) Dokumentierte Payload-Diät.** `docs/superpowers/specs/2026-03-27-token-reduction-design.md` beziffert für ein 500-Datei-Projekt ~529.000 Eingabe-Token und senkt sie auf ~89.500 (~83 %) über fünf Massnahmen:

| ID | Massnahme | Ersparnis |
|---|---|---:|
| C1 | `importMap` einmal in Phase 1 auflösen statt die 500-Datei-Liste in jeden der 67 Batches zu injizieren | ~154.000 |
| C2 | Batchgrösse 5–10 → 20–30 Dateien, Nebenläufigkeit 3 → 5 | ~94.000 |
| C3 | Sprach-/Framework-Addenda aus den Batches entfernen, nur noch in Phase 4 (die einmal läuft) | ~23.000 |
| C4 | Phase 4/5 nur mit `file`-Knoten, nur `imports`+`calls`-Kanten, Layer ohne `nodeIds` | ~121.500 |
| C5 | Graph-Reviewer per Default durch ein ~50-Zeilen-Node-Skript ersetzen, LLM-Review nur bei `--review` | ~58.500 |

C4 ist die verallgemeinerbare Regel: **jeder Empfänger bekommt nur die Felder, die er tatsächlich benutzt.** Der Tour-Builder braucht keine `tags`, keine `complexity`, keine `languageNotes` — also bekommt er sie nicht.

**(4) Progressive Disclosure der Fragmente.** `languages/python.md` wird nur gelesen, wenn Python erkannt wurde (SKILL.md Phase 4, Schritt 2). `locales/zh.md` nur, wenn die Ausgabesprache nicht Englisch ist. Fehlende Datei = still überspringen.

**(5) Abfrage-Regel im Skill, nicht im Daten-File.** Jedes lesende Skill (`understand-chat`, `understand-explain`, `understand-onboard`) trägt denselben Block:

> *"1. Use Grep to search within the JSON for relevant entries BEFORE reading the full file — 2. Only read sections you need — don't dump the entire graph into context"*

Darüber steht das komplette Graph-Schema als kompakte Tabelle. Der Agent weiss dadurch **vorher**, wonach er greppen muss, und muss sich das nicht durch Probelesen erarbeiten. Das ist der Trick: das Schema kostet ~40 Zeilen, spart aber das Laden einer mehrere MB grossen JSON.

**(6) Frische-Gate zum Nulltarif.** `hooks/hooks.json` prüft bei `SessionStart` per Shell nur, ob `meta.json.gitCommitHash` vom aktuellen `git rev-parse HEAD` abweicht. Erst dann wird `hooks/auto-update-prompt.md` überhaupt gelesen. Dessen Phase 1 klassifiziert geänderte Dateien deterministisch als `NONE` / `COSMETIC` / `STRUCTURAL` und bricht bei `SKIP` mit *"Zero tokens spent"* ab. LLM-Kosten entstehen nur bei echten Struktur-Änderungen.

Wer entscheidet was: **Der Orchestrator (SKILL.md) entscheidet, was in den Kontext kommt.** Der Agent bekommt keine Wahl — die Payload-Zuschnitte stehen als Anweisung im Dispatch-Prompt.

### A4 · Ausgabeformate und Konsumenten

| Artefakt | Ort | Konsument |
|---|---|---|
| `knowledge-graph.json` | `.ua/` | Agent (per Grep) + Dashboard |
| `domain-graph.json` | `.ua/` | Agent, Business-Sicht (`/understand-domain`) |
| `meta.json`, `fingerprints.json`, `config.json` | `.ua/` | Nur Maschine — Frische, Inkrement, Einstellungen |
| React-Dashboard | `packages/dashboard` | Mensch |
| `tour[]` im Graphen | in der JSON | Mensch (geführter Rundgang) + `/understand-onboard` |
| Onboarding-Guide (Markdown) | Chat-Ausgabe | Mensch |

### A5 · Übernehmbare Design-Entscheidungen

| Entscheidung | Wirkung | Passt zu uns? |
|---|---|---|
| Subagent schreibt auf Platte, gibt nur Pfad+Summary zurück | Grösster Kontext-Hebel überhaupt | **Ja** — sobald wir Bausteine analysieren oder bewerten lassen |
| Schema-Tabelle im lesenden Skill | Agent greppt zielgerichtet statt zu explorieren | **Ja, sofort** — unser `index.json`-Schema gehört in die Skill-Datei |
| Empfänger-spezifischer Payload-Zuschnitt (C4) | Lineare Ersparnis, kein Qualitätsverlust | **Ja** — `search` gibt schon kompakte Zeilen aus, `show` sollte Felder filtern können |
| Deterministische Validierung statt LLM-Review (C5) | Happy Path kostet 0 Token | **Ja** — unser `extract` ist bereits deterministisch, das Prinzip ist bestätigt |
| Frische-Gate über Commit-Hash | Kein Update-Lauf ohne Änderung | **Ja** — pro Quell-Repo, wir speichern heute nur ein Datum |
| Vorfilter-Datei (`.understandignore`) mit Nutzer-Bestätigung | Müll kommt gar nicht erst in den Index | **Ja** — bei 24.543 legal-de-Bausteinen dringend |
| tree-sitter-Extraktion, Embedding-Suche, React-Dashboard | Präzision und Optik | **Nein** — Overkill, unsere Bausteine sind Markdown mit Frontmatter |

---

## Teil B — graphify (Graphify-Labs)

### B1 · Problem in einem Satz

Ein beliebiger Ordner (Code, Docs, Papers, Bilder, Video) wird zu einem persistenten Wissensgraphen, den der Agent ab dann **abfragt statt liest**.

### B2 · Aufbau und Ablauf

Eine Python-Bibliothek mit einer Skill-Hülle. `ARCHITECTURE.md` beschreibt die Pipeline als sieben reine Funktionen:

```
detect() → extract() → build_graph() → cluster() → analyze() → report() → export()
```

Ein Modul pro Stufe (`detect.py`, `extract.py`, `build.py`, `cluster.py`, `analyze.py`, `report.py`, `export.py`), Kommunikation über einfache Dicts und NetworkX-Graphen, *"no shared state, no side effects outside `graphify-out/`"*.

Das Extraktions-Schema ist minimal und für alle Extraktoren gleich:

```json
{"nodes": [{"id","label","source_file","source_location"}],
 "edges": [{"source","target","relation","confidence"}]}
```

`confidence` ist `EXTRACTED` (explizit in der Quelle), `INFERRED` (abgeleitet) oder `AMBIGUOUS` (unsicher, wird im Report zur Prüfung markiert). `validate.py` erzwingt das Schema vor `build_graph()`.

Dazu: `serve.py` (MCP-stdio-Server), `watch.py`, `cache.py` (semantischer Cache), `security.py` (URL-, Pfad-, Label-Validierung), `benchmark.py`, `reflect.py` (Arbeitsgedächtnis).

### B3 · Wie der Kontext klein bleibt — Kernmechanik

**(1) Alles liegt in `graphify-out/`, der Agent lädt nichts davon vollständig.** Standard-Ausgabe sind drei Dateien: `graph.json` (voll), `GRAPH_REPORT.md` (Höhepunkte), `graph.html` (Browser).

**(2) Zugriff ausschliesslich über eine gescopte Abfrage mit Token-Deckel.** `graphify query "<frage>"` macht BFS ab den 1–3 bestpassenden Knoten (Tiefe 3), `--dfs` verfolgt eine Kette (Tiefe 6). Der Deckel ist explizit im Code (`references/query.md`):

```python
token_budget = BUDGET          # default 2000
char_budget  = token_budget * 4
... if len(output) > char_budget: output = output[:char_budget] + "... (truncated ...)"
```

Vorher werden die Knoten nach Term-Überlappung sortiert — abgeschnitten wird also das Unwichtigste. Dazu `graphify path "A" "B"` (kürzester Pfad) und `graphify explain "X"` (1-Hop-Nachbarschaft eines Knotens).

**(3) Die Zugriffs-Reihenfolge steht als Always-on-Regel im Zielprojekt.** `graphify/always_on/claude-md.md` wird per `graphify claude install` in die `CLAUDE.md` des Projekts geschrieben — vier Zeilen, die die gesamte Politik festlegen:

> - Für Codebase-Fragen zuerst `graphify query` — *"These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output."*
> - Wenn `graphify-out/wiki/index.md` existiert, dieses zur Navigation nutzen statt Quelltext zu browsen.
> - `GRAPH_REPORT.md` **nur** für breite Architektur-Fragen oder wenn query/path/explain nicht reichen.
> - Nach Code-Änderungen `graphify update .` (AST-only, keine API-Kosten).

Das ist die direkte Antwort auf das "zu viel"-Problem: nicht die Datenmenge schrumpfen, sondern **die Zugriffsreihenfolge vorschreiben** — teuerste Quelle zuletzt.

**(4) Fast Path im Skill selbst.** `graphify/skill.md`, Abschnitt "What You Must Do When Invoked": existiert `graphify-out/graph.json` und ist die Anfrage eine natürliche Frage, dann *"skip Steps 1–5 entirely and jump straight to `## For /graphify query`. … Do not run detect. Do not check corpus size."*

**(5) Progressive Disclosure innerhalb des Skills.** Der Kern (`graphify/skill.md`) enthält vom Query-Flow nur einen ~8-Zeilen-Stub (`tools/skillgen/fragments/query-stub/default.md`); die vollen 311 Zeilen liegen in `references/query.md`. Insgesamt acht Referenzdateien, jede beginnt mit "Load this when …": `query.md`, `update.md`, `exports.md`, `hooks.md`, `add-watch.md`, `transcribe.md`, `extraction-spec.md`, `github-and-merge.md`.

**(6) Vokabular-Expansion gegen Fehlgriffe.** `references/query.md` Step 0 schreibt `graphify-out/.vocab.txt` aus den Knoten-Labels und zwingt den Agenten, **nur Tokens aus dieser Datei** zu wählen: *"You MUST pick only tokens present in the vocabulary file. Do NOT invent tokens."* Findet sich nichts, wird abgebrochen statt geraten. Das verhindert die teuerste Fehlerklasse: eine Suche, die nichts trifft, und ein Agent, der daraufhin doch alles liest.

**(7) Arbeitsgedächtnis.** `graphify save-result --outcome useful|dead_end|corrected` schreibt nach `graphify-out/memory/`; `graphify reflect --if-stale` aggregiert zu `graphify-out/reflections/LESSONS.md` mit *preferred sources*, *known dead ends* und *corrections*. Deterministisch, kein LLM. Beim Sitzungsstart liest der Agent nur diese eine Datei.

**(8) Messung statt Behauptung.** `benchmark.py` rechnet `corpus_tokens` gegen `avg_query_tokens` über fünf Standardfragen und gibt eine `reduction_ratio` aus. Läuft automatisch ab 5.000 Wörtern Korpus — darunter *"the graph value is structural clarity, not token compression"*.

**(9) Prompt-Cache-Schutz.** Die README empfiehlt `graphify-out/` in `.claudeignore` zu setzen, weil jeder Schreibvorgang im Workspace sonst den Prompt-Cache invalidiert.

Wer entscheidet was: **Der Agent entscheidet, aber nach einer Regel, die im Projekt liegt.** Das ist der Gegenentwurf zu Understand-Anything, wo der Orchestrator es fest verdrahtet.

### B4 · Ausgabeformate und Konsumenten

| Artefakt | Konsument | Zweck |
|---|---|---|
| `graphify-out/graph.json` | Agent / GraphRAG | Vollgraph, nie ganz geladen |
| `graphify-out/GRAPH_REPORT.md` | Mensch | God Nodes, Surprising Connections, Communities mit Kohäsion, Token-Kosten |
| `graphify-out/graph.html` | Mensch | Klickbare Visualisierung (aggregiert ab 5.000 Knoten) |
| `graphify-out/wiki/index.md` + ein Artikel je Community | **Agent** | Explizit *"agent-crawlable wiki"* (`wiki.py`), Markdown-Links statt Obsidian-Wikilinks, damit jeder Renderer sie auflöst |
| `graphify-out/obsidian/` | Mensch | Vault, opt-in — erzeugt eine Datei pro Knoten |
| `cypher.txt`, `graph.svg`, `graph.graphml` | Andere Tools | Neo4j / FalkorDB, Notion/GitHub, Gephi/yEd |
| MCP-stdio-Server (`serve.py`) | Fremder Agent | Tools: `query_graph`, `get_node`, `get_neighbors`, `get_community`, `god_nodes`, `graph_stats`, `shortest_path` |
| `reflections/LESSONS.md` | Agent | Was hat beim letzten Mal getaugt |

### B5 · Übernehmbare Design-Entscheidungen

| Entscheidung | Wirkung | Passt zu uns? |
|---|---|---|
| Always-on-Regel-Datei mit Zugriffs-Reihenfolge | Löst "zu viel" ohne Datenverlust | **Ja, höchste Priorität** |
| Abfrage mit hartem Token-Budget + Relevanz-Sortierung vor dem Abschneiden | Antwortgrösse ist planbar, nicht datenabhängig | **Ja** — `search` hat heute kein Budget |
| Konfidenz-Tag an jeder Kante (`EXTRACTED`/`INFERRED`/`AMBIGUOUS`) | Der Agent weiss, wie sehr er einer Angabe trauen darf | **Ja** — unsere Domänen-Zuordnung (`DOMAIN_RULES` in `tools/harness.mjs`) ist Regex-Raterei und sollte als `INFERRED` markiert sein |
| Lean Core + `references/*.md` mit "Load this when …" | Der Skill-Kopf bleibt klein | **Ja** — für unser künftiges `harness-build` |
| Vokabular-Datei, aus der der Agent Suchbegriffe wählen muss | Keine Null-Treffer-Suchen, kein Ausweichen auf Volltextlesen | **Ja, günstig** — Vokabular aus Namen/Tags des Katalogs |
| `skillgen` (`tools/skillgen/`): Fragmente → 16 Plattform-Artefakte, `--check` bricht bei Drift ab | Eine Wahrheit, viele Zielformate | **Teilweise** — nur wenn wir je mehr als Claude Code bedienen |
| Arbeitsgedächtnis (`save-result` → `reflect` → `LESSONS.md`) | Auswahl wird über Zeit besser | **Später** — braucht echte Nutzungsdaten |
| Community Detection, God Nodes, HTML-Viz, Neo4j, MCP-Server, Whisper-Transkription | Erkenntnis über einen zusammenhängenden Korpus | **Nein** — siehe Teil E |

---

## Teil C — Vergleich

| Aspekt | Understand-Anything | graphify |
|---|---|---|
| Eingabe | Eine Codebasis | Beliebiger Ordner: Code, Docs, Papers, Bilder, Video, GitHub-URLs |
| Extraktion | tree-sitter + LLM-Subagenten pro Batch | AST deterministisch; LLM nur für Docs/Papers/Bilder |
| Sprache/Laufzeit | Node/TypeScript-Monorepo, pnpm | Python-Paket (`graphifyy`), NetworkX |
| Ablage | `.ua/` im Projekt | `graphify-out/` im Projekt |
| Zugriff des Agenten | Grep in die JSON, angeleitet durch Schema-Tabelle im Skill | CLI-Unterbefehl (`query`/`path`/`explain`) liefert Teilgraph |
| Token-Deckel | Implizit, über Payload-Zuschnitt im Dispatch | Explizit, `--budget N`, harte Kürzung |
| Wer steuert | Orchestrator-Skill, fest verdrahtet | Regel in `CLAUDE.md`, Agent führt aus |
| Aktualisierung | Fingerprints + Commit-Hash, Klassen NONE/COSMETIC/STRUCTURAL | `--update` (nur geänderte Dateien), Post-Commit-Hook, `--watch` |
| Unsicherheit | Nicht markiert | `EXTRACTED`/`INFERRED`/`AMBIGUOUS` an jeder Kante |
| Erfolgsmessung | Design-Doc mit Vorher/Nachher-Schätzung (~83 %) | `graphify benchmark`, misst zur Laufzeit |
| Menschliche Ausgabe | React-Dashboard, `tour[]` | `GRAPH_REPORT.md`, `graph.html` |
| Agenten-Ausgabe | JSON | JSON + Wiki-Markdown + MCP-Server |

**Was beide gleich machen** — und das ist der eigentliche Befund:

1. **Ein einziges Ausgabe-Verzeichnis** im Zielprojekt (`.ua/` bzw. `graphify-out/`), committfähig, mit Zwischenständen und Metadaten getrennt vom Ergebnis.
2. **Teuer einmal, billig oft.** Der Analyse-Lauf darf aufwendig sein; jede spätere Frage muss billig sein.
3. **Deterministisch, wo es geht.** Beide verschieben so viel wie möglich aus dem LLM in Skripte — UA per `.mjs`/`.py`, graphify per AST und NetworkX.
4. **Zwei Detailgrade nebeneinander:** ein kleiner Überblick für Menschen (`tour[]` / `GRAPH_REPORT.md`) und ein grosser Datensatz für Maschinen, der nie ganz gelesen wird.
5. **Inkrementell statt neu.** Beide erkennen Änderungen und arbeiten nur daran.
6. **Progressive Disclosure der eigenen Anleitung.** Das Skill selbst ist geschichtet — nur der Kern wird immer geladen.

**Wo sie sich unterscheiden — und was das verrät:** UA schneidet Payloads zu, graphify deckelt Antworten. UA verdrahtet die Politik im Orchestrator, graphify legt sie als Regel ins Zielprojekt. Das verrät: Das Problem hat zwei Seiten. Auf der **Schreibseite** (Index bauen) hilft Payload-Zuschnitt; auf der **Leseseite** (Agent arbeitet) hilft nur eine explizite Zugriffsregel plus ein Deckel. Wer nur eine Seite löst, ist nicht fertig. Wir haben bisher nur die Schreibseite (dreistufiger Index) — die Leseseite fehlt uns fast vollständig.

---

## Teil D — Übernahme-Empfehlung für unsere Bibliothek

Stand bei uns: `sources.txt` (13 Repos), `tools/harness.mjs` mit den Unterbefehlen `sync`/`extract`/`search`/`show`/`install`/`update`/`knowledge`/`lint`/`stats`, dreistufiger Index (`INDEX.md` 4,6 KB → `catalog/by-domain/*.md` → `catalog/index.json` **rund 19 MB**), 25.497 Bausteine, davon 954 im Standardzugriff.

Priorisiert, mit ehrlicher Einschätzung:

**1. Always-on-Regelblock für Zielprojekte (Vorbild: `graphify/always_on/claude-md.md`).** Was fehlt: Wir haben die Zugriffsregel nur in unserer eigenen `INDEX.md` — im Zielprojekt weiss ein frischer Claude nichts davon. Nutzen: Genau die Sorge des Users. Ein ~12-Zeilen-Block, den `harness.mjs install` in die `CLAUDE.md` des Zielprojekts schreibt: erst `harness search`, dann `by-domain`, `index.json` nie. Aufwand: sehr klein. **Machen.**

**2. Token-Budget für `search` und `show`.** Was fehlt: Beide Befehle geben aus, was da ist — bei einem Treffer in `legal-de` kann das ausufern. Nutzen: planbare Antwortgrösse. Umsetzung wie in graphify: nach Relevanz sortieren, dann bei `--budget N` × 4 Zeichen abschneiden mit sichtbarem Hinweis. Aufwand: klein. **Machen.**

**3. Katalog-Schema als Tabelle in das lesende Skill (Vorbild: UA-Query-Skills).** Was fehlt: Ein Agent, der `index.json` benutzen *muss*, weiss nicht, welche Felder es gibt, und liest sich das an. Nutzen: gezieltes Greifen statt Explorieren. Aufwand: klein — eine Tabelle mit den Feldern aus `cmdExtract`. **Machen.**

**4. Vorfilter und Domänen-Profil beim Install.** Was fehlt: Das Massen-Repo `Klotzkette__claude-fuer-deutsches-recht` stellt 24.543 von 25.497 Bausteinen (96,3 %) — das erdrückt jede Statistik und jede Suche. Nutzen: grösser als jede Kontext-Optimierung. Umsetzung: `.harnessignore`-Äquivalent für `extract`, plus ein Profil beim `install` (z. B. "nur `seo`, `frontend`, `meta`"). Aufwand: klein bis mittel. **Machen — das ist unser eigentliches "zu viel".**

**5. Konfidenz-/Provenienz-Feld pro Baustein.** Was fehlt: `DOMAIN_RULES` in `tools/harness.mjs` ist eine Regex-Heuristik; im Katalog steht das Ergebnis aber so verbindlich wie ein Fakt. Nutzen: Der Agent weiss, wann er nachsehen muss. Umsetzung: Feld `domainConfidence: "EXTRACTED"` (aus Frontmatter) vs. `"INFERRED"` (aus Regex). Aufwand: klein. **Machen.**

**6. Frische-Gate pro Repo.** Was fehlt: `INDEX.md` zeigt ein Datum, aber `sync`/`extract` laufen immer voll. Nutzen: `update` wird billig und kann öfter laufen. Umsetzung: Commit-Hash je Repo in einer `catalog/meta.json`, nur geänderte Repos neu extrahieren. Aufwand: mittel. **Bald.**

**7. Abhängigkeits-Kanten zwischen Bausteinen.** Was fehlt: Der Katalog ist flach. Wenn ein Skill ein anderes Skill, einen Agenten oder einen MCP-Server voraussetzt, sieht man das nirgends. Nutzen: `install` könnte mitinstallieren, was gebraucht wird. Umsetzung: ein Regex-Durchlauf über `SKILL.md`-Texte nach Nennungen anderer Baustein-Namen → Feld `requires[]`/`mentions[]`, markiert als `INFERRED`. Aufwand: mittel. **Bald** — und siehe Teil E, das ist der einzige Punkt, für den eine Graph-Sicht überhaupt zahlen würde.

**8. Vokabular-Datei für die Suche.** Was fehlt: Eine Suche ohne Treffer führt dazu, dass der Agent doch grösser lädt. Nutzen: mittel. Umsetzung: `catalog/vocab.txt` aus Namen und Tags, Regel im Skill: Suchbegriffe nur daraus. Aufwand: klein. **Nice to have.**

**9. Arbeitsgedächtnis (`save-result`/`reflect`).** Ehrlich: **noch nicht.** Ohne echte Einbau-Historie ist die `LESSONS.md` leer. Frühestens, wenn `install` mehrfach benutzt wurde.

**Overkill für uns — bewusst nicht übernehmen:** MCP-Server für den Katalog (ein CLI reicht, solange nur Claude Code der Konsument ist), HTML-/Obsidian-/Neo4j-Export, Community Detection, tree-sitter, Embedding-Suche, React-Dashboard, `skillgen`-Mehrplattform-Rendering. Alles davon löst Probleme, die wir nicht haben.

---

## Teil E — Lohnt sich ein `/graphify`-Lauf über unsere Bibliothek?

**Urteil: Nein, nicht über den Katalog als Ganzes.** Begründung entlang der Entscheidung, die ein Agent bei uns tatsächlich treffen muss:

> **Abgrenzung — diese Absage gilt nur dem eigenen Katalog.** Sie widerspricht **nicht** `recipes/06-legacy-onboarding.md`, das `Graphify-Labs__graphify/agent/graphify` als Baustein empfiehlt. Dort geht es um eine **fremde Codebasis**, die ein Team übernimmt: ein zusammenhängender Korpus, in dem Beziehungsfragen („was hängt woran") genau die richtigen Fragen sind. Hier geht es um **unseren Katalog**: eine Sammlung unverbundener Bausteine aus 13 fremden Repos, in der nur Attributfragen („welcher Typ, welche Domäne") gestellt werden. Dasselbe Werkzeug, zwei verschiedene Korpora — beide Aussagen stehen nebeneinander, ohne sich zu berühren.

Die Frage lautet immer *"Welchen Baustein baue ich in Projekt X ein?"*. Das ist eine **Auswahl nach Attributen** — Typ, Domäne, Repo, Beschreibung, Grösse. Ein Graph beantwortet dagegen Beziehungsfragen: *"wie hängt A mit B zusammen"*, *"was ist der kürzeste Pfad"*, *"welche Knoten sind zentral"*. Diese Fragen stellt bei unserem Katalog niemand.

Drei konkrete Gegenargumente:

1. **Uns fehlen die Kanten.** graphifys Wert entsteht aus `god nodes`, `surprising connections` und `community detection` — alles setzt einen *zusammenhängenden* Korpus voraus. Unsere 25.497 Bausteine stammen aus 13 fremden Repos, die nichts miteinander zu tun haben. Ein SEO-Skill und ein Rust-Review-Agent haben keine Beziehung, und ein Graph, der das behauptet, wäre schlechter als kein Graph. `GRAPH_REPORT.md` würde vor allem Rauschen ausweisen.

2. **Der Lauf wäre teuer und graphify selbst würde bremsen.** Unsere Bausteine sind Markdown, nicht Code — damit greift nicht die kostenlose AST-Route, sondern die semantische Extraktion per LLM (`skill.md` Step 3, Part B). Ausserdem warnt `detect` ab 500 Dateien bzw. 2 Mio. Wörtern und verlangt Eingrenzung; wir liegen um Grössenordnungen darüber.

3. **Was wir bräuchten, ist billiger anders zu haben.** Es gibt bei uns genau zwei plausible Kantentypen: (a) `plugin` *enthält* `skill`/`agent`/`command`/`hook` — das ist eine Baumstruktur und steht implizit schon in `catalog/index.json`; dafür braucht es keinen Graphen. (b) Baustein A *nennt* Baustein B / einen MCP-Server / ein Tool — das ist die interessante Kante ("was muss ich mitinstallieren"). Genau die erzeugt ein Regex-Durchlauf in `tools/harness.mjs` (Empfehlung D7) direkt beim `extract` — ohne Python, ohne NetworkX, ohne LLM-Kosten, und das Ergebnis landet als Feld im Katalog statt in einem zweiten Datenbestand, den wir pflegen müssten.

**Was stattdessen zu tun ist:** Empfehlungen D1–D5 umsetzen. Sie adressieren die Sorge des Users direkt (Zugriffsregel + Budget + Vorfilter), kosten zusammen weniger Aufwand als ein einziger graphify-Lauf und erzeugen keinen zweiten Datenbestand.

**Wo ein Lauf doch vertretbar wäre — als Experiment, nicht als Infrastruktur:** `/graphify` auf die 12 Dateien in `catalog/by-domain/` (klein, thematisch geclustert, Kosten nahe null; es sind 12 und nicht 13 Dateien, weil `legal-de` als reine Massen-Repo-Domäne dort nicht erzeugt wird — siehe `knowledge/04-governance.md`, Abschnitt 2.1). Erkenntnisziel: findet die Community Detection Baustein-Gruppen, die unsere `DOMAIN_RULES` verfehlen? Wenn ja, ist das ein Hinweis, die Regeln zu verbessern — nicht, einen Graphen einzuführen. Wenn nein, ist die Frage endgültig beantwortet.

---

## Geprüfte Dateien

**Understand-Anything** (`C:\Users\info\.harness-sources\Egonex-AI__Understand-Anything`):

- `CLAUDE.md`
- `understand-anything-plugin/skills/understand/SKILL.md`
- `understand-anything-plugin/skills/understand-chat/SKILL.md`
- `understand-anything-plugin/skills/understand-explain/SKILL.md`
- `understand-anything-plugin/skills/understand-onboard/SKILL.md`
- `understand-anything-plugin/skills/understand-knowledge/SKILL.md`
- `understand-anything-plugin/skills/understand-dashboard/SKILL.md`
- `understand-anything-plugin/agents/file-analyzer.md`
- `understand-anything-plugin/agents/knowledge-graph-guide.md`
- `understand-anything-plugin/hooks/hooks.json`
- `understand-anything-plugin/hooks/auto-update-prompt.md`
- `understand-anything-plugin/packages/core/src/embedding-search.ts`
- `docs/superpowers/specs/2026-03-27-token-reduction-design.md`
- Verzeichnislisten von `skills/`, `agents/`, `packages/core/src/`

**graphify** (`C:\Users\info\.harness-sources\Graphify-Labs__graphify`):

- `ARCHITECTURE.md`
- `README.md` (Abschnitte `graphify-out/`-Layout, Team-Workflow, `.claudeignore`, MCP)
- `graphify/skill.md`
- `graphify/always_on/claude-md.md`
- `graphify/skills/claude/references/query.md`
- `graphify/skills/claude/references/exports.md`
- `graphify/skills/claude/references/hooks.md`
- `graphify/benchmark.py`
- `graphify/wiki.py`
- `graphify/serve.py` (MCP-Tool-Definitionen, Zeilen ~1490–1830)
- `tools/skillgen/gen.py`, `tools/skillgen/platforms.toml`, `tools/skillgen/fragments/query-stub/default.md`
- `worked/httpx/GRAPH_REPORT.md` (Beispielausgabe)

**Eigene Bibliothek** (`C:\Users\info\OneDrive\Desktop\Harnes Creator`):

- `INDEX.md`
- `sources.txt`, `Git wichtig.txt`
- `tools/harness.mjs` (Funktions-Übersicht, `DOMAIN_RULES`, `classify()`, `cmdSearch()`; 1.397 Zeilen — Verweise bewusst über Bezeichner statt über Zeilennummern, eine frühere Fassung nannte hier „805 Zeilen" und war nach dem nächsten Commit falsch)
- `catalog/by-domain/seo.md`, Grösse von `catalog/index.json`

**Nicht verifiziert / Vermutung:** Die Kostenaussage in Teil E, Punkt 2 (Markdown-Korpus ⇒ LLM-Route statt AST) beruht auf `skill.md` Step 3 Part A/B und `detect.py`-Kategorien, nicht auf einem Testlauf. Die Token-Zahlen in A3 stammen aus dem Design-Dokument von Understand-Anything und sind dort selbst als Schätzung für ein 500-Datei-Projekt ausgewiesen.
