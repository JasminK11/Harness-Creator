---
name: harness-build
description: Baut das Harness für ein Projekt aus der Harness-Bibliothek zusammen — sucht passende Skills, Subagents, Commands und Hooks, legt sie zur Bestätigung vor und installiert sie. Nutzen bei "bau mir das Harness", "Harness aufsetzen", "welche Skills brauche ich hier", "welche Agenten passen zu dem Projekt", "Projekt-Setup mit Claude-Bausteinen", "/harness-build". Auch nutzen, wenn der User auf den Ordner "Harnes Creator" verweist.
---

# /harness-build — Harness für dieses Projekt zusammenstellen

Die Harness-Bibliothek liegt unter `C:\Users\info\OneDrive\Desktop\Harnes Creator`.
Sie katalogisiert Bausteine aus einer wachsenden Zahl fremder Repos: Skills,
Subagents, Slash-Commands, Hooks, MCP-Konfigurationen, Plugins.

Deine Aufgabe: aus diesem Bestand die wenigen Bausteine herausziehen, die *dieses*
Projekt wirklich braucht — und den Rest liegen lassen.

## Die Regel, an der alles hängt

Der Katalog umfasst über 25.000 Bausteine. Ein Agent, der ihn einliest, hat sein
Kontextfenster voll, bevor er die erste Zeile Projektcode gesehen hat. Deshalb gilt
ohne Ausnahme:

- **Nie** `catalog/index.json` lesen. Diese Datei ist mehrere Megabyte gross.
- **Nie** die Repo-Klone unter `C:\Users\info\.harness-sources\` mit Glob, Grep oder
  Read durchsuchen.
- Der einzige Zugriffsweg ist das CLI. Es hält den Katalog ausserhalb deines
  Kontexts und liefert nur die Treffer zurück.

`INDEX.md` der Bibliothek darfst und sollst du komplett lesen — sie ist genau dafür
klein gehalten.

## Werkzeug

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"

node tools/harness.mjs stats                       # Bestand im Überblick
node tools/harness.mjs search "<worte>"            # Treffer als kompakte Zeilen
     [--type skill|agent|command|hook|mcp|plugin]
     [--domain <domäne>] [--repo <repo>] [--limit N] [--all]
node tools/harness.mjs show <id> [--head N]        # Detail zu einem Baustein
node tools/harness.mjs install <id...> --to <proj> # kopieren
     [--dry-run] [--force] [--no-claude-md]
node tools/harness.mjs bootstrap --to <proj>       # nur Zugriffsregel schreiben
```

`install` legt im Zielprojekt zwei Dinge an: `.claude/harness-manifest.json` als
Herkunftsnachweis und einen Regelblock in der `CLAUDE.md`, damit der Agent im
Projekt später weiss, wie er die Bibliothek benutzt. Beides ist idempotent.

### Massen-Repos

Rund 24.500 der Bausteine stammen aus einem deutschen Rechts-Repo, das als `bulk`
markiert ist. Es bleibt aus der Standardsuche ausgeblendet, sonst verdrängt es alles
andere. Der normale Bestand umfasst rund 1.050 Bausteine.

Für ein Projekt mit deutschem Rechtsbezug gezielt suchen:

```bash
node tools/harness.mjs search "<worte>" --domain legal-de
```

## Ablauf

### 1. Projekt verstehen

Bevor du irgendetwas suchst, musst du wissen, wofür. Klär ab:

- **Was wird gebaut?** Art der Anwendung, wer sie benutzt.
- **Stack?** Sprache, Framework, Datenhaltung, Deployment-Ziel.
- **Reifegrad?** Erste Zeile Code, laufendes MVP, oder Produktivsystem mit Nutzern.
- **Wo tut es weh?** Das ist die wichtigste Frage. Ein Harness ist kein Zubehör,
  sondern eine Antwort auf konkrete Schmerzen: Tests brechen ständig, Reviews
  übersehen dieselben Fehler, Deployments schlagen fehl, niemand kennt die Codebasis.

Vieles davon kannst du dem Projekt selbst entnehmen — `package.json`, `pyproject.toml`,
`go.mod`, vorhandene CI-Konfiguration, `README`. Tu das zuerst. Frag nur nach, was du
nicht sehen kannst, und nutz dafür `AskUserQuestion` statt einer offenen Frage.

Fasse dein Verständnis in drei Sätzen zusammen und leg es dem User vor. Wenn deine
Zusammenfassung falsch ist, ist alles Weitere falsch.

### 2. Bedarf in Suchen übersetzen

Aus den Schmerzpunkten werden 4 bis 8 konkrete Suchen. Nicht aus dem Stack allein —
"React" als Suchbegriff liefert Treffer, die nichts lösen. Such nach dem Problem.

| Schmerz | Suche |
|---|---|
| Reviews übersehen dieselben Fehler | `search "code review" --type agent` |
| Keiner traut sich an den Code | `search "codebase onboarding"` |
| Tests fehlen oder brechen | `search "tdd testing" --domain testing` |
| Sicherheitslücken nicht gefunden | `search "security audit" --domain security` |
| Deployments schlagen fehl | `search "deployment ci" --domain devops` |
| Unklare Architekturentscheidungen | `search "architecture decision"` |

Prüf vorher in `INDEX.md`, welche Domänen es überhaupt gibt.

### 3. Rezept prüfen

Sieh in `recipes/` nach, ob für diesen Projekttyp schon ein Bauplan existiert. Wenn
ja, ist das dein Startpunkt — aber kein Dogma. Ein Rezept enthält auch einen
Abschnitt "Bewusst weggelassen"; lies ihn, bevor du einen dort verworfenen Baustein
erneut evaluierst.

### 4. Kandidaten prüfen

`search` liefert dir ID, Beschreibung, Grösse und Domänen. Das reicht für die
Vorauswahl. Nur bei der engeren Auswahl — höchstens fünf Bausteine — gehst du mit
`show` ins Detail.

Auswahlkriterien, in dieser Reihenfolge:

1. **Löst er ein benanntes Problem dieses Projekts?** Wenn du nicht in einem Satz
   sagen kannst, welchen Schmerz er nimmt, fliegt er raus.
2. **Ist er spezifisch genug?** Ein Baustein für genau deinen Stack schlägt einen
   generischen. `react-reviewer` schlägt `code-reviewer`, wenn es eine React-Codebasis ist.
3. **Ist er klein?** Die KB-Zahl steht in der Suchausgabe. Kleine Bausteine sind
   leichter zu prüfen, leichter zu ändern und richten weniger Schaden an, wenn sie
   nicht passen.
4. **Ist er der einzige für dieses Problem?** Zwei Bausteine für dieselbe Sache sind
   schlechter als einer — das Modell muss dann raten, welchen es ziehen soll.

Ein Hook, der eine Regel erzwingt, ist mehr wert als drei Skills, die sie empfehlen.
Hooks laufen immer; Skills nur, wenn das Modell sie für einschlägig hält.

### 5. Umfang begrenzen

Es gibt keine feste Obergrenze, aber eine harte Regel: **Für jeden Baustein musst du
in einem Satz benennen können, welches konkrete Problem dieses Projekts er löst.**
Was diese Prüfung nicht besteht, kommt nicht rein.

In der Praxis landen die meisten Projekte bei 5 bis 12 Bausteinen. Wer bei 20 landet,
hat meist nicht ausgewählt, sondern gesammelt.

Der Grund ist nicht Speicherplatz. Von jeder Skill liegen `name` und `description`
permanent im Kontext; der Rest wird erst geladen, wenn sie greift. Das Problem bei
zu vielen Skills ist die **Trennschärfe**: wenn sich fünf Beschreibungen ähneln,
zieht das Modell die falsche oder gar keine. Weniger, klarer abgegrenzte Bausteine
schlagen mehr überlappende.

### 6. Auswahl vorlegen

Bevor du irgendetwas kopierst, legst du die Auswahl vor:

| Baustein | Typ | Löst welches Problem | KB |
|---|---|---|---|

Dazu, was du geprüft und verworfen hast, mit Begründung. Dann `AskUserQuestion` zur
Bestätigung. Kopieren ohne Bestätigung ist nicht vorgesehen — der User kennt sein
Projekt besser als du.

### 7. Installieren

Erst trocken, dann echt:

```bash
node tools/harness.mjs install <id1> <id2> ... --to "<projektpfad>" --dry-run
node tools/harness.mjs install <id1> <id2> ... --to "<projektpfad>" --yes
```

Der Trockenlauf gibt vor dem Kopieren aus, was die Bausteine an **ausführbarem
Code** mitbringen: Skript-Dateien, Shebangs, und je Fundstelle die Zeilennummer zu
Prozessaufruf, Netzwerkzugriff, Zielen ausserhalb des Projekts und Zugriff auf
Zugangsdaten. Das ist eine Sichtprüfung, kein Schutz — sie zeigt, was sonst
unbemerkt ins Projekt käme.

**Diese Ausgabe gehört vor die Bestätigung aus Schritt 6, nicht danach.** Läuft
etwas Ausführbares mit, legst du die Fundstellen dem User vor und holst seine
Zustimmung; erst dann der echte Lauf. `--yes` überspringt nur die Rückfrage des
CLI, nicht die des Users — ohne `--yes` bricht `install` in einer Agenten-Sitzung
ab, weil dort kein Terminal für die Rückfrage da ist.

Danach prüfen, dass die Dateien am erwarteten Ort liegen: Skills unter
`.claude/skills/`, Subagents unter `.claude/agents/`, Commands unter
`.claude/commands/`, Hooks unter `.claude/hooks/`.

**Hooks sind nicht mit dem Kopieren aktiv.** Sie müssen in `.claude/settings.json`
eingetragen werden. Sieh dir den kopierten Hook an, trag ihn korrekt ein, und sag dem
User, was er jetzt bei welchem Ereignis tut. Ein Hook, den niemand erwartet, ist eine
schlechte Überraschung.

### 8. Ergebnis dokumentieren

Berichte knapp: was installiert wurde, welches Problem es jeweils löst, was noch
Handarbeit braucht (Hook-Registrierung, MCP-Zugangsdaten, Anpassung an den Stack).

## Wenn nichts Passendes da ist

Sag das. Ein leeres Ergebnis ist ein brauchbares Ergebnis — besser als ein Baustein,
der ungefähr passt. Vorschlag an den User: entweder ein passendes Repo in
`sources.txt` aufnehmen und `/harness-update` laufen lassen, oder den Baustein für
dieses Projekt selbst schreiben.

## Die Wissensbank befragen

Die Bibliothek katalogisiert nicht nur Bausteine, sondern hält begründetes Wissen
dazu, wie man ein Setup richtig baut — aus Anthropics Engineering-Material und
ausgewerteten Konferenzvorträgen.

```bash
node tools/harness.mjs knowledge "<frage>"     # liefert Abschnitte, keine Dateien
node tools/harness.mjs knowledge --list        # Inhaltsverzeichnis
```

Nutze das **während** der Auswahl, nicht danach. Typische Momente:

| Situation | Abfrage |
|---|---|
| Regel als Hook, Skill oder CLAUDE.md? | `knowledge "hook statt skill"` |
| Lohnt ein Subagent an dieser Stelle? | `knowledge "subagent kontext kosten"` |
| Wie prüfen ohne Selbstbewertung? | `knowledge "evaluator agent"` |
| Wird das Setup zu komplex? | `knowledge "einfachste lösung zuerst"` |
| Was macht eine gute description aus? | `knowledge "description routing"` |

Die Dateien unter `knowledge/` und `recipes/` **nicht** am Stück lesen. Sie
umfassen tausende Zeilen und wachsen mit jedem ausgewerteten Vortrag weiter.
`knowledge` schneidet den passenden Abschnitt heraus und nennt Datei und Zeile.

## Verhältnis zu `/bootstrap-project`

`/bootstrap-project` setzt ein Projekt aus einem Profil des Obsidian-Vaults auf:
Verzeichnisse, `settings.json`, MCP-Auswahl, CLAUDE.md-Grundgerüst. `/harness-build`
füllt dieses Gerüst mit Bausteinen aus der Bibliothek.

Sinnvolle Reihenfolge: erst `/bootstrap-project`, dann `/harness-build`. Wenn beide
laufen sollen, sag das dem User, statt Arbeit doppelt zu machen.
