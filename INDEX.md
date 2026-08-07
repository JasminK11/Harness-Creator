# Harness-Bibliothek — Index (Ebene 1)

> Automatisch erzeugt von `tools/harness.mjs extract` — **nicht von Hand bearbeiten.**
> Stand: 2026-08-07 10:51 · 954 Bausteine im Standardzugriff (+ 24543 in Massen-Repos, siehe unten) aus 13 Repos

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

Grund: Der volle Katalog umfasst 25497 Bausteine. Wer den einliest,
hat sein Kontextfenster voll, bevor er die erste Zeile Projektcode sieht.

## Die Befehle

Aus dem Dispatcher des CLI erzeugt — diese Liste kann nicht veralten. Flaggen und
Warnungen stehen im Aufruf ohne Argument.

| Befehl | Wofür | Anmerkung |
|---|---|---|
| `search` | Katalog durchsuchen | der übliche Einstieg |
| `show` | Detail zu einem Baustein | vor dem Installieren |
| `install` | Baustein(e) ins Zielprojekt kopieren | meldet danach, was wirkt und was nicht |
| `uninstall` | Bausteine wieder entfernen | genau die Dateien aus dem Manifest, nichts sonst |
| `bootstrap` | nur die Zugriffsregel schreiben | in die CLAUDE.md eines Projekts, ohne Bausteine |
| `knowledge` | die Wissensbank befragen | liefert Abschnitte, nicht Dateien — auch `know`, `why` |
| `lint` | Wissensbank und Nähte prüfen | tote Verweise, abgelaufene Metadaten, falsche IDs |
| `stats` | Bestandszahlen | die Quelle für jede Zahl, die man über den Katalog sagt |
| `update` | Repos pullen + Katalog neu bauen | dauert Minuten, schreibt den Katalog neu |
| `sync` | nur Repos pullen/klonen | Teilschritt von `update` |
| `extract` | nur Katalog neu bauen | Teilschritt von `update` |

## Bestand nach Typ

| Typ | Anzahl | Was es ist | Wann einbauen |
|---|---:|---|---|
| skill | 402 | Ordner mit `SKILL.md` + Assets | Wiederkehrendes Verfahren, das Claude nachschlagen soll |
| agent | 375 | Subagent mit eigenem Kontextfenster | Arbeit, die viel Kontext frisst oder unabhängig geprüft werden muss |
| command | 112 | Slash-Command | Manuell ausgelöster Ablauf mit festem Namen |
| hook | 56 | Skript an einem Lifecycle-Event | Regel, die *immer* greifen muss — nicht dem Modell überlassen |
| plugin | 6 | Gebündeltes Paket | Mehrere zusammengehörige Bausteine auf einmal |
| mcp | 3 | MCP-Server-Konfiguration | Zugriff auf externes System (DB, API, Browser) |

## Bestand nach Domäne

Einstieg über die Domäne (`search "<worte>" --domain <name>`), voller Detail-Index
je Domäne unter `catalog/by-domain/<domäne>.md`:

`general` 331 · `data-ai` 159 · `backend` 108 · `product` 106 · `meta` 101 ·
`security` 80 · `frontend` 73 · `testing` 68 · `seo` 58 · `docs` 55 ·
`devops` 53 · `media` 48

## Massen-Repos (opt-in)

Diese Repos sind vollständig katalogisiert, tauchen aber **nicht** in der normalen
Suche auf — sonst würde jede Suche von ihnen dominiert. Zugriff nur gezielt:

```bash
node tools/harness.mjs search "<stichwort>" --repo Klotzkette__claude-fuer-deutsches-recht
node tools/harness.mjs search "<stichwort>" --all   # alles, inklusive Massen-Repos
```

## Wohin für mehr

- `knowledge/` — **warum** ein Harness so gebaut wird: Doktrin, Entscheidungsbaum,
  Anti-Patterns, ein Kapitel zum Aufsetzen eines neuen Projekts. Über
  `node tools/harness.mjs knowledge "<frage>"` abfragen, nicht am Stück lesen.
- `recipes/` — fertige Baupläne pro Projekttyp, mit verifizierten Baustein-IDs.
- `catalog/by-repo.md` — welches Repo was beisteuert, mit Stand und Link.
- `README.md` — Installation, Repo aufnehmen, Aufbau des Projekts.
