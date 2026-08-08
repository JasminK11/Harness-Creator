---
name: harness-build
description: Entscheidet, WOMIT gearbeitet wird. Stattet ein Zielprojekt mit Bausteinen aus der Harness-Bibliothek aus — sucht passende Skills, Subagents, Commands und Hooks, legt die Auswahl zur Bestätigung vor und installiert sie. Nutzen bei "bau mir das Harness", "Harness aufsetzen", "welche Skills brauche ich hier", "welche Agenten passen zu dem Projekt", "Projekt-Setup mit Claude-Bausteinen", "/harness-build". Auch nutzen, wenn der User auf den Ordner "Harnes Creator" verweist und Bausteine für sein Projekt will. Durchdenkt das Vorhaben nicht selbst (das ist /harness-plan) und aktualisiert die Bibliothek nicht (das ist /harness-update).
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
     [--dry-run] [--yes] [--force] [--no-claude-md]
node tools/harness.mjs uninstall <id...> --to <proj> # wieder entfernen
node tools/harness.mjs bootstrap --to <proj>       # nur Zugriffsregel schreiben
```

Das ist der Ausschnitt, den du hier brauchst. **Alle** Befehle mit sämtlichen Flaggen
gibt `node tools/harness.mjs` ohne Argument aus; `INDEX.md` nennt sie mit Zweck. Nenne
die Zahl der Befehle nie aus dem Gedächtnis — sie wächst, und `lint` prüft jeden
Aufruf aus einem Codeblock gegen den Dispatcher.

`install` legt im Zielprojekt zwei Dinge an: `.claude/harness-manifest.json` als
Herkunftsnachweis und einen Regelblock in der `CLAUDE.md`, damit der Agent im
Projekt später weiss, wie er die Bibliothek benutzt. Beides ist idempotent.

### Massen-Repos

Der weit überwiegende Teil der Bausteine stammt aus einem deutschen Rechts-Repo, das
als `bulk` markiert ist. Es bleibt aus der Standardsuche ausgeblendet, sonst verdrängt
es alles andere. Wie gross der Bestand im Standardzugriff tatsächlich ist, steht in
der Kopfzeile von `INDEX.md` und in `node tools/harness.mjs stats` — nenne die Zahl
nie aus dem Gedächtnis, sie ändert sich mit jedem `update`.

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
`go.mod`, vorhandene CI-Konfiguration, `README`, dazu Issue-Tracker-Referenzen
(Linear-/Jira-IDs in Commits) und Doku-Muster (OpenAPI, JSDoc), die auf gelebte
Abläufe zeigen. Tu das zuerst. Frag nur nach, was du nicht sehen kannst, und nutz
dafür `AskUserQuestion` statt einer offenen Frage.

Erhebe außerdem, was schon da ist: `node tools/harness.mjs list --to <projekt>`
zeigt bereits installierte Bausteine samt Zustand, und ein Blick in `.claude/`
zeigt Handgebautes. Wer empfiehlt, ohne den Bestand zu kennen, empfiehlt doppelt —
das offizielle Setup-Plugin macht diese Bestandsaufnahme als Allererstes, und darin
hat es recht (`anthropics__claude-plugins-official/skill/claude-automation-recommender`).

#### 1a. Liegt eine `PLAN.md` im Projekt?

Dann sind **Abschnitt 5 (Schmerzpunkte)** und **Abschnitt 6 (Prüfverfahren)** deine
Symptomliste und deine Prüfschleifen-Erhebung; die Rückfragen aus diesem Schritt
entfallen insoweit. `/harness-plan` schreibt die Datei genau dafür. Die dort notierten
Erfolgs-Bars sind der Massstab, an dem du in Schritt 5 begründest, warum ein Baustein
drin ist.

Die Liste ist die **Ausgangshypothese, kein Deckel**: findest du beim Lesen des Codes
einen Schmerzpunkt, den die `PLAN.md` nicht kennt, nimm ihn auf und sag dazu, dass er
neu ist. Widerspricht der Code der `PLAN.md`, gewinnt der Code — und der Widerspruch
gehört in den Bericht, nicht unter den Tisch.

#### 1b. Welche Prüfschleifen liefern heute ein Ja/Nein?

Erheben, bevor du suchst: Linter, Typechecker, Testsuite, Schema-Validierung,
Security-Scan, CI-Gate. **Notiere den Befehl, nicht die Absicht** — `npm run lint`,
`pytest -q`, `go vet ./...`, `mypy src/` — und unterscheide „vorhanden" von „läuft
und ist grün": ein `"test": "echo no tests"` und eine rote CI sind keine Schleifen.

Geht das aus den Projektdateien nicht hervor, ist **das** die eine Sache, die per
`AskUserQuestion` an den User geht. Du sammelst Tatsachen und fällst kein
Qualitätsurteil über das fremde Projekt.

**Wenn es null Schleifen gibt**, ist der erste Baustein der, der „fertig" überhaupt
entscheidbar macht — ein Check, den jemand ausführen kann. **Erst wenn ein Check
existiert, der Hook**, der ihn bei jeder Änderung ausführt. Ein Hook führt eine
Prüfung aus, er erzeugt keine: vorher installiert liegt er tot in `.claude/hooks/`.

#### 1c. Was ausdrücklich nicht gebraucht wird

Diese Angabe steht in keiner Projektdatei. Was du hier nicht fragst, setzt du selbst —
und der User sieht es erst in der Auswahltabelle in Schritt 6, wo es zu spät ist.
Frag es also: *Gibt es Bereiche, in denen du ausdrücklich keine Unterstützung willst?*

#### 1d. Vorlegen

Fasse dein Verständnis in drei Sätzen zusammen. Die Schmerzpunkte schreibst du als
**nummerierte Liste** darunter — auf diese Nummern beziehen sich Auswahlkriterium 1 in
Schritt 4 und die Begründung in Schritt 5 wörtlich. Leg beides zusammen dem User zur
Bestätigung vor. Wenn deine Zusammenfassung falsch ist, ist alles Weitere falsch.

**Eine leere Liste ist ein gültiges Ergebnis.** Findet sich kein benennbarer
Schmerzpunkt, lautet die Antwort „kein Harness" — oder höchstens `bootstrap`, damit
ein späterer Agent den Zugriffsweg zur Bibliothek kennt.

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

Wenn die Suche eine Termbilanz ausgibt — welche Wörter als Füllwörter übergangen
wurden und welche im Bestand keinen Treffer haben —, ersetze die unerfüllbaren
Terme durch Katalogvokabular und such erneut. Die Übersetzung von Nutzersprache
in Katalogsprache ist deine Aufgabe als Modell; die Bilanz liefert dir dafür die
Fakten.

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

1. **Löst er ein benanntes Problem dieses Projekts?** Nenn die **Nummer** aus der
   Schmerzpunkt-Liste aus Schritt 1d. Wenn du keine Nummer nennen kannst, fliegt er
   raus — „passt gut zum Stack" ist keine Nummer.
2. **Ist er spezifisch genug?** Ein Baustein für genau deinen Stack schlägt einen
   generischen. `react-reviewer` schlägt `code-reviewer`, wenn es eine React-Codebasis ist.
3. **Wie viel lädt er, wenn er greift?** Entscheidend ist, was beim Greifen in den
   Kontext geht — die Einstiegsdatei —, nicht die Ordnergrösse. Die beiden liegen
   weit auseinander: `anthropics__skills/skill/docx` meldet 1125 KB bei einer
   SKILL.md von 7 KB, weil 61 Dateien mitgezählt werden, die erst bei Bedarf gelesen
   werden. Ein Baustein mit `references/` ist deshalb **nicht** automatisch teuer, und
   umgekehrt kann eine einzelne riesige SKILL.md dauerhaft im Kontext liegen. Nimm die
   Ladegrösse, wo das CLI sie ausgibt; sonst Ordnergrösse **und** Dateizahl zusammen
   lesen und bei vielen Dateien nicht auf die KB-Zahl abstellen.
4. **Ist er der einzige für dieses Problem?** Zwei Bausteine für dieselbe Sache sind
   schlechter als einer — das Modell muss dann raten, welchen es ziehen soll.
5. **Erst bei fachlicher Gleichwertigkeit: die gepflegtere Quelle.** `show` hängt an
   die `Repo`-Zeile die Vertrauensstufe aus `sources.txt` — `offiziell`, `gepflegt`
   oder `unbekannt`, jeweils mit Halbsatz. Sie sortiert nichts und wählt nichts vor;
   sie entscheidet nur den Gleichstand. **Fachliche Passung schlägt Herkunft**: ein
   `unbekannt`-Baustein, der genau dieses Problem löst, schlägt einen `offiziell`-en,
   der danebenliegt. Fehlt die Zeile, ist das kein Gütesiegel, sondern eine Lücke.

Ein Hook, der eine Regel erzwingt, ist mehr wert als drei Skills, die sie empfehlen.
Hooks laufen immer; Skills nur, wenn das Modell sie für einschlägig hält.

### 5. Umfang begrenzen

Es gibt keine feste Obergrenze, aber eine harte Regel: **Für jeden Baustein musst du
in einem Satz benennen können, welchen nummerierten Schmerzpunkt aus Schritt 1d er
löst.** Was diese Prüfung nicht besteht, kommt nicht rein. Liegt eine `PLAN.md` vor,
ist der Massstab die Erfolgs-Bar aus ihrem Abschnitt 2, an der sich zeigen müsste,
dass der Baustein etwas geändert hat.

In der Praxis landen die meisten Projekte bei 5 bis 12 Bausteinen. Wer bei 20 landet,
hat meist nicht ausgewählt, sondern gesammelt.

Der Grund ist nicht Speicherplatz. Von jeder Skill liegen `name` und `description`
permanent im Kontext; der Rest wird erst geladen, wenn sie greift. Das Problem bei
zu vielen Skills ist die **Trennschärfe**: wenn sich fünf Beschreibungen ähneln,
zieht das Modell die falsche oder gar keine. Weniger, klarer abgegrenzte Bausteine
schlagen mehr überlappende.

### 6. Auswahl vorlegen

Bevor du irgendetwas kopierst, legst du die Auswahl vor. Eine Zeile über der Tabelle
steht, was du in Schritt 1b erhoben hast:

```
Prüfschleifen heute: npm run lint · npm test
```

oder, wenn es keine gibt:

```
Prüfschleifen heute: keine.
```

Dann die Tabelle:

| Baustein | Typ | Löst welches Problem (Nr. aus Schritt 1) | laden | hält an |
|---|---|---|---:|---|

Die Spalte `laden` ist die Zahl, die `search` und `show` ausgeben — und zwar die
Zahl vor `lädt`, sobald das CLI sie führt. Sie ist **nicht** die Ordnergrösse: die
kann um ein Vielfaches darüber liegen, weil `references/` und mitgelieferte Skripte
mitgezählt werden, aber erst bei Bedarf gelesen werden. `anthropics__skills/skill/docx`
meldet 1125 KB bei einer SKILL.md von 7 KB — Faktor 160.

Gibt die Ausgabe nur eine einzige Zahl aus, ist es die Ordnergrösse. Dann schreib sie
hin **und** dazu, wie viele Dateien der Baustein hat: bei mehr als einer Handvoll
Dateien ist die Zahl eine Obergrenze, kein Preis. Erfinde keine Ladegrösse.

#### Die Spalte „hält an" — Bausteine, die den Menschen anhalten

Ein Baustein, der den Ablauf **unterbricht**, ist etwas anderes als einer, der ihn
unterstützt. Füll die Spalte, und zwar **nicht aus der Description**: die ist an genau
dieser Stelle unzuverlässig — `affaan-m__ecc/skill/gateguard` schreibt „blocks
Edit/Write/Bash", besteht aber nur aus einer `SKILL.md` und blockiert nichts.

Der Eintrag kommt aus dem, was `show` und der Trockenlauf tatsächlich zeigen:

| Befund | Eintrag |
|---|---|
| Typ `hook`, und `show` zeigt `PreToolUse`, `Stop` oder `SubagentStop` | **ja** |
| Ausführbare Datei im Paket, die eines dieser Ereignisse nennt — der Trockenlauf listet sie namentlich, der Zustandsbericht schreibt „aber: enthält …" | **ja, sobald registriert** |
| Nur Text, der ein Gate beschreibt | `—` — bremst, blockiert nicht |

Unter der Tabelle je Baustein mit **ja** eine Zeile:

- **was** blockiert wird — Ereignis und Werkzeug (`PreToolUse` auf `Write`),
- **wann** es feuert — bei jeder Änderung, nur am Sitzungsende, nur bei Subagenten,
- **wie man es wieder abstellt** — der Eintrag aus `.claude/settings.json`, der
  entfernt wird, oder die Datei, die gelöscht wird.

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

#### Wenn `install` eine Kollision meldet

Zwei Bausteine, die auf denselben Zielpfad wollen (klassisch: `hooks.json` aus
mehreren Repos, `.mcp.json`, gleichnamige Skills verschiedener Autoren), lassen den
ganzen Lauf abbrechen — auch mit `--force`, und im Trockenlauf genauso wie im echten.
Das ist Absicht.

**Löse die Kollision durch Auswahl, nicht durch `--force`.** Geh zurück in Schritt 4,
entscheide, welcher der beiden Bausteine das Problem besser löst, und nimm den anderen
raus. `--force` überschreibt einen **vorhandenen** Bestand im Zielprojekt — es ist
kein Mittel, zwei Autoren in denselben Ordner zu mischen; genau dieser Mischbestand war
der Grund für den Abbruch. Bei `hooks.json` und `.mcp.json` nennt das CLI die
Schlüssel, die im Konflikt stehen: das ist Konfiguration, kein Baustein, und die
Zusammenführung entscheidet der User.

### 7b. Den Zustandsbericht auswerten

Nach dem Kopieren gibt `install` aus, **was jetzt wirkt und was nicht**. Jede Zeile
beginnt mit `[aktiv]` oder `[inaktiv]`, am Ende steht `Ergebnis: N von M wirksam`.
Lies das, statt es zu überspringen: kopiert heisst nicht wirksam.

- `[aktiv]` — Skills, Subagents, Commands. Sie greifen durch blosses Vorhandensein,
  ab der nächsten Sitzung. Nichts weiter zu tun.
- `[inaktiv]` bei einem **Hook** — er liegt in `.claude/hooks/` und tut nichts,
  solange er nicht in `.claude/settings.json` steht. Der Bericht gibt den fertigen
  JSON-Schnipsel mit dem abgeleiteten Ereignis aus. Übernimm ihn in die vorhandene
  `settings.json`, ohne bestehende Ereignisse zu ersetzen. Nennt der Bericht mehrere
  Ereignisse oder keines, sieh in den Hook und ordne ihn selbst zu — falsch
  eingetragen ist schlimmer als gar nicht.
- `[inaktiv]` bei **MCP** — Zugangsdaten setzen, und die `.mcp.json` wird erst beim
  nächsten Start des Zielprojekts zur Bestätigung angeboten.
- `[inaktiv]` bei einem **Plugin** — ein Ordner unter `.claude/plugins` aktiviert
  nichts; das läuft über `/plugin`.

Dass ein Hook feuert, ohne dass ihn jemand aufruft, ist der Punkt: sag dem User, bei
welchem Ereignis er was tut. Ein Hook, den niemand erwartet, ist eine schlechte
Überraschung.

### 8. Ergebnis dokumentieren

Berichte knapp: was installiert wurde, welches Problem es jeweils löst, und —
wörtlich aus dem Zustandsbericht — welche Bausteine `[inaktiv]` sind und was ihnen
fehlt (Hook-Registrierung, MCP-Zugangsdaten, Plugin-Aktivierung, Anpassung an den
Stack). Melde nie "installiert", wo der Bericht `[inaktiv]` sagt.

Drei Dinge gehören zusätzlich in den Bericht:

- **Je „ja" in der Spalte „hält an" eine Zeile, was den Baustein zum Schweigen bringt.** Wer nicht weiss,
  wie er ein Gate wieder loswird, umgeht es beim ersten Ärger — und dann steht es im
  Projekt, ohne zu wirken. Nenne den Eintrag in `.claude/settings.json` oder die
  Datei, die dafür weg muss.
- **Der ausgefüllte Verifikationsbefehl.** Der Befehl aus Schritt 1b, mit dem sich im
  Zielprojekt zeigen lässt, ob das Harness etwas geändert hat. Gab es keinen, steht
  hier der Befehl, den einzurichten der erste Arbeitsschritt ist — und die Aussage,
  dass bis dahin niemand messen kann, ob die Auswahl gewirkt hat.
- **Was nur teilweise wirkt.** Der Zustandsbericht schreibt `[aktiv]` mit einem
  `aber:` darunter, wenn ein Skill ein Hook-Skript mitbringt, das nicht registriert
  ist. Diese Zeile wörtlich übernehmen — sie ist der Unterschied zwischen einem
  scharfen und einem angekündigten Gate.

### 9. Rückmeldung an die Bibliothek

Ein Lauf gegen ein fremdes Projekt ist die einzige Gelegenheit, an der die Bibliothek
erfährt, wo sie nicht trägt. Ohne diesen Schritt geht das Wissen mit der Sitzung
verloren.

1. **Die tatsächlich abgesetzten Suchen wörtlich mitschreiben** — Frage, Filter,
   gewählter Baustein. **Und die Suchen, die nichts Brauchbares lieferten**: die sind
   der eigentliche Ertrag. Aus einer solchen Notiz wird ein Fall in
   `evals/routing.jsonl` (`frage`, `erwartet`, `warum`); ein sachlich falscher Treffer
   kommt als `verboten` in denselben Fall. Die Falldatei hat einen Umfangsdeckel — ein
   neuer Fall **ersetzt** einen schwächeren, er kommt nicht dazu.
2. **Der fehlende Baustein bekommt einen benannten Ort.** Am Ende von `sources.txt`
   steht ein Kommentarblock „Lücken", eine Zeile je Lücke:

   ```
   # Lücke: <Suche> · <Projekt> · <Datum> · Kandidat: <Repo-URL oder "keiner">
   ```

   **Eine leere Lückenliste ist ein gültiges Ergebnis.** Sie heisst, der Bestand hat
   gereicht — nicht, dass niemand hingesehen hat. Schreib das hin.
3. **Drei Fragen an den Besitzer, als Text, nicht als Auswahl:** Was hat gefehlt oder
   nicht gepasst? War das an diesem Projekt oder allgemein? Wenn allgemein: welches
   Rezept oder welcher Wissensabschnitt zieht nach?
4. **Einarbeitung über die vorhandenen Bahnen.** Führt der Befund zu einer Rezept-
   oder Wissensänderung, ist das ein `revise`-Eintrag in `knowledge/LOG.md`, und
   zuständig bleibt der Subagent `wissensbank-autor`. Kein neues Protokoll, keine
   neue Aktionsart, keine eigene Datei.

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
