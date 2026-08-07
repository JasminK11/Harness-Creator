# Harness Creator

Eine durchsuchbare Bibliothek von Claude-Code-Bausteinen — Skills, Subagents,
Slash-Commands, Hooks, MCP-Konfigurationen — gesammelt aus fremden GitHub-Repos.

Wenn ein neues Projekt startet, holt sich Claude über ein CLI genau die Bausteine
heraus, die dieses Projekt braucht. Nicht mehr.

## Das Problem

Es gibt inzwischen dutzende Repos voller guter Claude-Bausteine. Der naheliegende
Weg — alle klonen und Claude draufloslassen — funktioniert nicht:

Der hier katalogisierte Bestand umfasst rund **25.500 Bausteine**. Ein Agent, der
die durchliest, hat sein Kontextfenster voll, bevor er die erste Zeile Projektcode
gesehen hat. Er trifft dann keine bessere Auswahl, sondern gar keine.

## Die Lösung: drei Ebenen

Der Katalog ist so geschnitten, dass nie mehr in den Kontext gelangt als nötig.

| Ebene | Datei | Grösse | Wer liest sie |
|---|---|---|---|
| 1 | `INDEX.md` | ~5 KB | Der Agent, komplett |
| 2 | `catalog/by-domain/*.md` | je 5–80 KB | Der Agent, gezielt eine Domäne |
| 3 | `catalog/index.json` | ~20 MB | **Niemand.** Nur das CLI |

Der Agent stellt nie eine Frage an den Katalog, sondern an das CLI. Das CLI liest
die 20 MB, filtert, und gibt zwanzig Zeilen zurück.

Dieselbe Logik eine Ebene höher: Repos, die mehr als 2.000 Bausteine liefern,
werden als `bulk` markiert und aus der Standardsuche ausgeblendet. Sie bleiben
katalogisiert und über `--repo`, `--domain` oder `--all` erreichbar. Ohne das
würde ein einzelnes Repo mit 24.500 Rechts-Skills jede Suche dominieren.

## Installation

Voraussetzungen: Node.js 18+, Git.

```bash
git clone https://github.com/JasminK11/Harness-Creator.git
cd Harness-Creator
node tools/harness.mjs update
```

Der erste Lauf klont alle Repos aus `sources.txt` und baut den Katalog. Das dauert
einige Minuten. Die Klone landen unter `~/.harness-sources` — bewusst ausserhalb
des Repos und ausserhalb von OneDrive, weil sonst hunderte Megabyte an
`.git`-Objekten synchronisiert würden. Anderer Ort:

```bash
HARNESS_SOURCES=/pfad/nach/wahl node tools/harness.mjs update
```

Die beiden Skills in `skills/` nach `~/.claude/skills/` kopieren, damit
`/harness-build` und `/harness-update` verfügbar sind:

```bash
cp -r skills/harness-build skills/harness-update ~/.claude/skills/
```

Beide Skills enthalten absolute Pfade zur Bibliothek. Wer sie woanders ablegt,
muss die Pfade darin anpassen.

## Benutzung

### Neues Projekt ausstatten

Im neuen Projekt Claude sagen: **"bau mir das Harness"**. Die Skill
`/harness-build` übernimmt: Projekt verstehen, passende Bausteine suchen, Auswahl
zur Bestätigung vorlegen, installieren.

Von Hand geht es genauso:

```bash
node tools/harness.mjs search "code review" --type agent
node tools/harness.mjs show affaan-m__ecc/agent/code-reviewer
node tools/harness.mjs install affaan-m__ecc/agent/code-reviewer --to /pfad/zum/projekt
```

`install` legt im Zielprojekt zwei Dinge an:

- `.claude/harness-manifest.json` — Herkunftsnachweis: welcher Baustein aus welchem
  Repo, mit dem Katalogstand der Installation
- einen Regelblock in der `CLAUDE.md` — damit der Agent *in diesem Projekt* weiss,
  dass er die Bibliothek über das CLI befragt und nicht durchsucht

Der Regelblock ist der eigentliche Trick. Ein dreistufiger Index nützt nichts,
wenn der Agent im Zielprojekt nicht weiss, dass er ihn benutzen soll — dann greift
er zum Naheliegenden und liest die 20 MB. Der Block ist über Marker-Kommentare
idempotent und lässt alles andere in der Datei unangetastet.

Nur den Regelblock, ohne Bausteine:

```bash
node tools/harness.mjs bootstrap --to /pfad/zum/projekt
```

### Bibliothek aktuell halten

Die Quell-Repos wachsen laufend. In Claude: **"/harness-update"**. Oder direkt:

```bash
node tools/harness.mjs update
```

Das pullt alle Repos, baut den Katalog neu und schreibt nach `CHANGELOG.md`, was
neu, geändert oder verschwunden ist.

### Repo aufnehmen

Zeile in `sources.txt` eintragen, dann `update`:

```
https://github.com/owner/repo
https://github.com/owner/repo #develop        # bestimmter Branch
https://github.com/owner/repo !bulk           # aus der Standardsuche ausblenden
```

Zum Entfernen die Zeile löschen und `update` laufen lassen. Der Klon bleibt liegen
und wird als verwaist gemeldet — das CLI löscht nie von selbst.

## CLI

```
node tools/harness.mjs update                    Repos pullen + Katalog + Changelog
node tools/harness.mjs sync                      nur Repos pullen/klonen
node tools/harness.mjs extract                   nur Katalog neu bauen
node tools/harness.mjs search <worte>            durchsuchen
     [--type skill|agent|command|hook|mcp|plugin]
     [--domain X] [--repo X] [--limit N] [--all]
node tools/harness.mjs show <id> [--head N]      Detail zu einem Baustein
node tools/harness.mjs install <id...> --to DIR  ins Zielprojekt kopieren
     [--dry-run] [--force] [--no-claude-md]
node tools/harness.mjs bootstrap --to DIR        nur den Regelblock schreiben
node tools/harness.mjs stats                     Übersicht
```

## Aufbau

```
sources.txt              Repo-Liste — die einzige Datei, die man von Hand pflegt
tools/harness.mjs        Das CLI. Ohne Abhängigkeiten, nur Node-Standardbibliothek
INDEX.md                 Ebene 1 — erzeugt, nicht bearbeiten
catalog/
  index.json             Ebene 3 — erzeugt, ~20 MB, nicht im Repo
  by-domain/*.md         Ebene 2 — erzeugt
knowledge/               Warum ein Harness so gebaut wird
recipes/                 Baupläne pro Projekttyp
skills/                  Die beiden Claude-Skills zum Kopieren nach ~/.claude/skills/
CHANGELOG.md             Was sich bei jedem update geändert hat — erzeugt
```

Alles unter `catalog/`, `INDEX.md` und `CHANGELOG.md` wird erzeugt. Von Hand
gepflegt werden nur `sources.txt`, `knowledge/`, `recipes/` und `tools/`.

## Hintergrund

`knowledge/` enthält nicht Bedienungsanleitungen, sondern Begründungen:

- **`01-harness-doktrin.md`** — Was ein Harness ist, welche Modellschwäche jede
  Komponente adressiert, und woran man erkennt, dass eine Komponente überflüssig
  geworden ist. Grundlage ist Anthropics Engineering-Artikel zum Harness-Design.
- **`02-bausteine.md`** — Skill vs. Subagent vs. Slash-Command vs. Hook vs. MCP.
  Wann welcher Typ der richtige ist und warum die anderen es nicht sind.
- **`03-vorbilder.md`** — Wie Understand-Anything und graphify das Kontextproblem
  lösen, und was davon hier übernommen wurde.
- **`04-governance.md`** — Was ab welcher Bibliotheksgrösse kippt: Descriptions als
  Routing-Signale, Skill-Drift bei Modellwechseln, Governance jenseits von hundert
  Bausteinen.

## Quellen

Die katalogisierten Bausteine stammen aus den Repos in `sources.txt` und stehen
unter den Lizenzen ihrer jeweiligen Urheber. Dieses Repo enthält keine Kopien —
nur den Katalog, das Werkzeug und die Begründungen. `install` kopiert direkt aus
den lokalen Klonen ins Zielprojekt; `.claude/harness-manifest.json` hält fest,
woher jeder Baustein stammt.
