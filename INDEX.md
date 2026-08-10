# Harness-Bibliothek — Index (Ebene 1)

> Automatisch erzeugt von `tools/harness.mjs extract` — **nicht von Hand bearbeiten.**
> Stand: 2026-08-10 17:40 · 1091 Bausteine im Standardzugriff (+ 24543 in Massen-Repos, 8 in Quarantäne, siehe unten) aus 14 Repos

## Was das hier ist

Ein Katalog von Claude-Bausteinen aus fremden Repos — Skills, Subagents,
Slash-Commands, Hooks, MCP-Konfigurationen — und eine Wissensbank, die begründet,
wann welcher Typ der richtige ist. Du ziehst daraus die wenigen Bausteine, die
*dein* Projekt wirklich braucht, und lässt den Rest liegen.

## So fängst du an

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs        # vollständige Befehlsübersicht mit allen Flaggen
```

Dann in dieser Reihenfolge: `search` findet Kandidaten, `show` prüft einen davon,
`install --to <projekt>` kopiert ihn. Steht keine Suche an, sondern eine
Entscheidung — Hook oder Skill, lohnt hier ein Subagent, wie prüft man ohne
Selbstbewertung —, dann fragst du die Wissensbank, statt zu raten:

```bash
node tools/harness.mjs knowledge "hook statt skill"
```

## Was du niemals tun darfst

- **`catalog/index.json` lesen.** Rund 20 MB. Das CLI liest sie an deiner Stelle.
- **Die Repo-Klone unter `C:\Users\info\.harness-sources` mit Glob, Grep oder Read durchsuchen.**
  Derselbe Grund, und du bekommst dort keine Beschreibungen, sondern rohe Dateien.
- **`knowledge/` oder `recipes/` am Stück lesen.** Der Befehl `knowledge` schneidet
  den passenden Abschnitt heraus und nennt Datei und Zeile.

Grund: Der volle Katalog umfasst 25642 Bausteine. Wer den einliest,
hat sein Kontextfenster voll, bevor er die erste Zeile Projektcode sieht.

## Die Befehle

Aus dem Dispatcher des CLI erzeugt — diese Liste kann nicht veralten. Flaggen und
Warnungen stehen im Aufruf ohne Argument.

| Befehl | Wofür | Anmerkung |
|---|---|---|
| `search` | Katalog durchsuchen | der übliche Einstieg |
| `show` | Detail zu einem Baustein | vor dem Installieren |
| `intent` | Absicht statt Stichwort suchen | hinterlegte Suchen + Anker aus catalog/intents.yaml, M9 |
| `install` | Baustein(e) ins Zielprojekt kopieren | meldet danach, was wirkt und was nicht |
| `uninstall` | Bausteine wieder entfernen | genau die Dateien aus dem Manifest, nichts sonst |
| `bootstrap` | nur die Zugriffsregel schreiben | in die CLAUDE.md eines Projekts, ohne Bausteine |
| `knowledge` | die Wissensbank befragen | liefert Abschnitte, nicht Dateien — auch `know`, `why` |
| `lint` | Wissensbank und Nähte prüfen | tote Verweise, abgelaufene Metadaten, falsche IDs |
| `eval` | Routing-Evals fahren | findet die Suche noch, was sie finden soll — läuft als Schritt 4 von `update` mit |
| `list` | zeigt, was in einem Zielprojekt liegt | aus dessen Manifest, mit heutigem Wirksamkeitszustand |
| `stats` | Bestandszahlen | die Quelle für jede Zahl, die man über den Katalog sagt |
| `update` | Repos pullen + Katalog neu bauen | dauert Minuten, schreibt den Katalog neu |
| `sync` | nur Repos pullen/klonen | Teilschritt von `update` |
| `extract` | nur Katalog neu bauen | Teilschritt von `update` |

## Bestand nach Typ

| Typ | Anzahl | Was es ist | Wann einbauen |
|---|---:|---|---|
| skill | 431 | Ordner mit `SKILL.md` + Assets | Wiederkehrendes Verfahren, das Claude nachschlagen soll |
| agent | 407 | Subagent mit eigenem Kontextfenster | Arbeit, die viel Kontext frisst oder unabhängig geprüft werden muss |
| command | 141 | Slash-Command | Manuell ausgelöster Ablauf mit festem Namen |
| hook | 62 | Skript an einem Lifecycle-Event | Regel, die *immer* greifen muss — nicht dem Modell überlassen |
| plugin | 46 | Gebündeltes Paket | Mehrere zusammengehörige Bausteine auf einmal |
| mcp | 4 | MCP-Server-Konfiguration | Zugriff auf externes System (DB, API, Browser) |

## Bestand nach Domäne

Einstieg über die Domäne (`search "<worte>" --domain <name>`), voller Detail-Index
je Domäne unter `catalog/by-domain/<domäne>.md`. Die erste Zahl ist der
Standardzugriff, die Zahl in Klammern kommt aus Massen-Repos hinzu — `--domain`
liefert die Summe, der Detail-Index listet nur die erste Zahl:

`general` 350 · `data-ai` 198 (+48) · `meta` 172 (+458) · `backend` 137 (+41) · `product` 107 (+101) ·
`security` 101 (+41) · `frontend` 81 (+10) · `testing` 80 (+25) · `docs` 66 (+19) · `seo` 58 (+6) ·
`devops` 57 (+37) · `media` 51 (+66)

## Massen-Repos (opt-in)

Diese Repos sind vollständig katalogisiert, tauchen aber **nicht** in der normalen
Suche auf — sonst würde jede Suche von ihnen dominiert. Zugriff nur gezielt:

```bash
node tools/harness.mjs search "<stichwort>" --repo Klotzkette__claude-fuer-deutsches-recht
node tools/harness.mjs search "<stichwort>" --all   # alles, inklusive Massen-Repos
```

## Quarantäne

8 Bausteine mit leerer oder inhaltsfreier Beschreibung stehen nicht in der
Standardsuche; `show <id>` nennt den Grund, `search --all` schliesst sie ein.

## Wohin für mehr

- `knowledge/` — **warum** ein Harness so gebaut wird: Doktrin, Entscheidungsbaum,
  Anti-Patterns, ein Kapitel zum Aufsetzen eines neuen Projekts. Über
  `node tools/harness.mjs knowledge "<frage>"` abfragen, nicht am Stück lesen.
- `recipes/` — fertige Baupläne pro Projekttyp, mit verifizierten Baustein-IDs.
- `catalog/by-repo.md` — welches Repo was beisteuert, mit Stand und Link.
- `README.md` — Installation, Repo aufnehmen, Aufbau des Projekts.
- `CHANGELOG.md` — was sich beim letzten `update` geändert hat.
