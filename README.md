# Harness Creator

Eine durchsuchbare Bibliothek von Claude-Code-Bausteinen — Skills, Subagents,
Slash-Commands, Hooks, MCP-Konfigurationen — gesammelt aus fremden GitHub-Repos.

Wenn ein neues Projekt startet, holt sich Claude über ein CLI genau die Bausteine
heraus, die dieses Projekt braucht. Nicht mehr.

> **Du bist ein Agent und hast gerade Zugriff auf dieses Verzeichnis bekommen?**
> Lies `INDEX.md` — unter hundert Zeilen, und darin steht alles, was du zum Anfangen
> brauchst: was das hier ist, der eine Befehl zum Loslegen, was du nie tun darfst und
> warum. Diese README ist für Menschen, die das Projekt einrichten oder erweitern.

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
| 1 | `INDEX.md` | unter 100 Zeilen | Der Agent, komplett — als Erstes |
| 2 | `catalog/by-domain/*.md`, `catalog/by-repo.md` | je 2–80 KB | Der Agent, gezielt eine Domäne |
| 3 | `catalog/index.json` | ~20 MB | **Niemand.** Nur das CLI |

`INDEX.md` ist der Einstiegspunkt und wird bei jedem `extract` neu erzeugt. Sie sagt
in unter hundert Zeilen, was die Bibliothek ist, mit welchem Befehl man anfängt, was
man nie tun darf und wohin man für mehr geht. Deshalb steht dort auch die
Befehlsliste — aus dem Dispatcher des CLI ausgelesen, nicht von Hand gepflegt.

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

Die Skills liegen unter `.claude/skills/` **im Projekt**, nicht in der globalen
Claude-Konfiguration. So sind sie versioniert, wandern mit dem Repo und gelten
nicht ungefragt für jedes Verzeichnis auf der Platte.

| Skill | Wofür | Wo sie gebraucht wird |
|---|---|---|
| `/harness-plan` | Projekt planen, bevor Code entsteht | im Zielprojekt |
| `/harness-build` | Bausteine auswählen und installieren | im Zielprojekt |
| `/harness-update` | Repos pullen, Katalog neu bauen | hier |

`bootstrap` legt `harness-plan` und `harness-build` automatisch im Zielprojekt ab —
sonst kennt ein frisches Projekt sie nicht. Mit `--no-skills` unterdrücken. `install`
tut das **nicht**: wer installiert, hat die Bibliothek bereits gefunden.

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
neu, geändert oder verschwunden ist. Die Datei entsteht bei diesem Lauf — vor dem
ersten `update` gibt es sie nicht.

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

Elf Subcommands. Die vollständige Übersicht mit allen Flaggen, Warnungen und
Sonderfällen gibt das Werkzeug selbst aus:

```bash
node tools/harness.mjs
```

Hier steht sie bewusst **nicht** noch einmal. Diese Datei hatte eine eigene Kopie der
Liste, und die war irgendwann um drei Befehle im Rückstand — `uninstall`, `knowledge`
und `lint` fehlten. Eine Information an vier Stellen ist eine Information, die an drei
Stellen veraltet. Die Wahrheit ist der `switch` am Ende von `tools/harness.mjs`;
`USAGE` beschreibt ihn, und `INDEX.md` liest ihn aus.

Was womit gemeint ist, in einem Satz je Befehl, steht im Abschnitt „Die Befehle" von
`INDEX.md`.

## Aufbau

```
sources.txt              Repo-Liste — die einzige Datei, die man von Hand pflegt
tools/harness.mjs        Das CLI. Ohne Abhängigkeiten, nur Node-Standardbibliothek
INDEX.md                 Ebene 1, der Einstiegspunkt — erzeugt, nicht bearbeiten
catalog/
  index.json             Ebene 3 — erzeugt, ~20 MB, nicht im Repo
  by-domain/*.md         Ebene 2, ein Detail-Index je Domäne — erzeugt
  by-repo.md             Ebene 2, Herkunft und Stand je Quell-Repo — erzeugt
knowledge/               Warum ein Harness so gebaut wird
  LOG.md                 Änderungsprotokoll der Wissensbank, nur ergänzen
recipes/                 Baupläne pro Projekttyp
Learnings/               Rohquellen — nur lesen, nie ändern
.claude/skills/          Die drei Bedien-Skills, projektlokal
.claude/agents/          Die Subagenten für die Arbeit an der Bibliothek selbst
CLAUDE.md                Arbeitsregeln für dieses Projekt selbst
CHANGELOG.md             Was sich bei jedem update geändert hat — erzeugt,
                         entsteht erst beim ersten `update`
```

Die Bibliothek wendet ihre eigenen Regeln auf sich selbst an: `CLAUDE.md` enthält
den Regelblock, den `bootstrap` in jedes Zielprojekt schreibt, plus die
Arbeitsregeln, die aus der Wissensbank abgeleitet sind. Ein Werkzeug, das seine
eigenen Regeln nicht befolgt, ist der beste Beweis, dass die Regeln nichts taugen.

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
- **`05-erkenntnisse-aus-vorlesungen.md`** — Sieben themenübergreifende Befunde aus
  neun Konferenzvorträgen, mit Belegen, den offenen Widersprüchen zwischen den
  Sprechern und der Abgrenzung dessen, was eine Katalog-Bibliothek daraus nicht
  übernehmen kann.
- **`06-massnahmen.md`** — Die interne Arbeitsliste: was an Bibliothek, CLI und
  Wissensbank ansteht, und was nach adversarialer Prüfung verworfen wurde. Für ein
  fremdes Projekt ohne Wert.
- **`07-projekt-mit-ai-aufsetzen.md`** — Der umfangreichste Teil und für ein neues
  Projekt der nützlichste: Leitsätze, Praktiken entlang der Projektphasen, Fallen
  nach Symptom. Beantwortet die Frage „wie setze ich das hier richtig auf".

Nicht am Stück lesen — `node tools/harness.mjs knowledge "<frage>"` schneidet den
passenden Abschnitt heraus. `knowledge --list` zeigt das Inhaltsverzeichnis.

## Quellen

Die katalogisierten Bausteine stammen aus den Repos in `sources.txt` und stehen
unter den Lizenzen ihrer jeweiligen Urheber. Dieses Repo enthält keine Kopien —
nur den Katalog, das Werkzeug und die Begründungen. `install` kopiert direkt aus
den lokalen Klonen ins Zielprojekt; `.claude/harness-manifest.json` hält fest,
woher jeder Baustein stammt.
