---
type: Protokoll
title: LOG — Änderungsprotokoll der Wissensbank
description: "Beantwortet, was wann an der Wissensbank getan wurde — ein append-only Zeitstrahl nach Karpathys LLM-Wiki-Konvention."
status: stable
sources:
  - id: karpathy-llm-wiki
    resource: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    title: LLM-Wiki — Konvention für Ingest, Query und Lint sowie das Format des Änderungsprotokolls
    author: Andrej Karpathy
  - id: okf-spec
    resource: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
    title: Open Knowledge Format (OKF) v0.2 — Spezifikation
    author: Google Cloud Platform
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2028-08-07
tags: [protokoll, changelog, wissensbank, okf, llm-wiki]
---

# LOG — Änderungsprotokoll der Wissensbank

## Wozu dieses Protokoll

Diese Datei ist der Zeitstrahl der Wissensbank. Sie beantwortet für Mensch und
Agent eine einzige Frage: **Was ist hier zuletzt passiert, und warum?**

Ohne Zeitstrahl ist eine Wissensbank ein Zustand ohne Geschichte. Man sieht,
was drinsteht, aber nicht, ob eine Aussage gestern eingepflegt oder vor einem
Jahr geprüft wurde — und man kann nicht erkennen, ob eine Datei bewusst
unverändert blieb oder nur vergessen wurde.

**Hier wird nur ergänzt, nie gelöscht.** Ein Eintrag bleibt stehen, auch wenn
sich sein Inhalt später als falsch herausstellt; korrigiert wird durch einen
**neuen** Eintrag, der auf den alten verweist. Wer einen Eintrag entfernt,
zerstört genau die Information, wegen der diese Datei existiert. Das gilt
ausdrücklich auch für Einträge, die peinlich sind.

Neueste Einträge stehen **oben**. Wer nur den aktuellen Stand braucht, liest
den ersten Eintrag und hört auf.

Format jedes Eintrags — die Kopfzeile ist bewusst maschinenlesbar, damit
`grep "^## \[" knowledge/LOG.md` einen vollständigen Index ergibt:

```
## [YYYY-MM-DD] <aktion> | <titel>
```

## Aktionsarten

| Aktion | Wann sie benutzt wird | Was der Eintrag mindestens enthalten muss |
|---|---|---|
| `ingest` | Neues Wissen kommt herein: eine neue Datei, ein neuer Abschnitt, eine ausgewertete Rohquelle | Woher das Wissen stammt (Quelle mit Datum), welche Dateien entstanden oder gewachsen sind |
| `lint` | Die Wissensbank wurde geprüft — maschinell über `node tools/harness.mjs lint` oder inhaltlich durch ein Modell | Anzahl und Schwere der Befunde vorher/nachher, was davon behoben wurde und was offen bleibt |
| `revise` | Bestehendes Wissen wird korrigiert, ersetzt, umsortiert oder für verfallen erklärt | Was vorher galt, was jetzt gilt, und woran der Irrtum bemerkt wurde |
| `add` | Ein Werkzeug der Bibliothek kommt hinzu, das selbst kein Wissen ist — ein Subagent, ein Skill, ein Verzeichnis | Was entsteht, wozu, und welche Zuständigkeit sich dadurch verschiebt |

`add` fehlte in dieser Tabelle, obwohl unten bereits ein Eintrag damit
überschrieben ist (`[2026-08-07] add | Zwei feste Subagenten ergänzt`). Der
Widerspruch fiel auf, als eine Prüfung die Aktionsarten aufzählen sollte und
`add` für definiert hielt. Nachgetragen statt den alten Eintrag umzuschreiben —
diese Datei wird ergänzt, nicht korrigiert. Für **Wissen** bleibt `ingest` die
richtige Aktion; `add` gilt ausschliesslich für Werkzeuge und Struktur.
`cmdLint()` prüft die Kopfzeilen nicht gegen diese Tabelle, die Drift war also
nicht maschinell zu bemerken.

Eine Aktion pro Eintrag. Wer in einem Lauf einpflegt **und** prüft, schreibt
zwei Einträge.

## Einträge

## [2026-08-07] revise | Nach dem `update` um 18:27 nachgezogen — Bestandszahlen in sechs Dateien, und vier Strix-IDs waren durch eine Umbenennung im Quell-Repo tot

**Was vorher galt.** `lint` meldete nach dem Lauf **11 Befunde hoher Schwere und
einen mittleren**: zehn veraltete Bestandszahlen in `knowledge/02`, `03`, `04`, `05`,
`06` und `recipes/README.md`, dazu drei nicht auflösbare Baustein-IDs in
`recipes/04-security-audit-pentest.md` (hoch) und eine vierte in `knowledge/06`
(mittel). Nachher: **0 Befunde**, `lint --all` ebenfalls 0. Keine der Ursachen wurde
stummgeschaltet; die beiden neu gesetzten `<!-- lint:historisch -->`-Marker stehen an
Stellen, die ausdrücklich eine **Messung von damals** zitieren (siehe unten).

**Was sich am Bestand geändert hat.** Das `update` zog `usestrix__strix`
(2275007 → f8a8801) und `affaan-m__ecc` (fd27a0e → f16a6ff); `Klotzkette` schlug beim
`git reset` fehl und blieb unverändert. Netto sechs neue, vier entfernte Bausteine:
Standardzugriff **954 → 956**, Gesamtbestand **25.497 → 25.499**, Typ `skill`
**402 → 404** (beide neuen sind `affaan-m__ecc/skill/ito-inference` und
`…/ito-training`), Repo `affaan-m__ecc` **520 → 522**. Agents, Commands, Hooks,
Plugins und MCP unverändert.
<!-- lint:historisch --> Die jeweils linke Zahl ist der Altwert vom Katalogstand
2026-08-07 08:57 und steht hier absichtlich: ohne das Vorher ist eine Korrektur nicht
dokumentiert. Verbindlich ist die rechte Zahl, Katalogstand 2026-08-07 18:27.

**Vier tote IDs durch eine Umbenennung im Quell-Repo.** `usestrix/strix` hat an einem
Tag **alle vier** seiner Skills umbenannt — die Bausteine tun dasselbe wie vorher, nur
unter neuem Slug. Jede Zuordnung wurde mit `show <id> --head 30` gegen die im Rezept
beschriebene Aufgabe geprüft, nicht aus der Namensähnlichkeit geschlossen; alle vier
hielten stand:

| Alt | Neu | Geprüft |
|---|---|---|
| `strix-pentest` | `penetration-testing-with-strix` | OSS-CLI-Pentest gegen Code/Repo/URL/Domain/IP, validierte Findings mit PoC — identische Aufgabe |
| `strix-ci-setup` | `ci-security-scanning-with-strix` | diff-bezogener Scan pro Pull Request, SARIF, Build-Fail — identische Aufgabe |
| `strix-fix-findings` | `fix-security-vulnerabilities-with-strix` | Triage nach Schwere plus **erneuter Lauf zur Verifikation** — identische Aufgabe |
| `strix-cloud-api` | `managed-pentesting-with-strix` | `app.strix.ai`-REST-API ohne lokales Docker — identische Aufgabe |

Drei davon standen in `recipes/04`, die vierte (`strix-pentest`) zusätzlich in
`knowledge/06` Punkt 7. `strix-cloud-api` stand in **keiner** Datei — die Kern-Set-
Voraussetzung in `recipes/04` nannte den Cloud-Weg zwar als Alternative, ohne je eine
ID dafür zu führen. Diese Lücke ist mit `managed-pentesting-with-strix` unter
„Erweiterung" geschlossen, mit Bedingung. Alle übrigen 13 IDs in `recipes/04` wurden
ebenfalls einzeln gegen den Katalog geprüft und lösen auf; dabei fielen zwei
veraltete KB-Angaben unter „Bewusst weggelassen" auf (`security-scan` 6 → 4 KB,
`security-bounty-hunter` 5 → 3 KB) und die dort behauptete Einschränkung „nur
japanisch im Katalog", die seit `TRANSLATION_RE` für beide nicht mehr zutrifft —
`show` liefert englisches Frontmatter. Beides korrigiert.

**Welche Zahlen nachgezogen wurden.** Aktualisiert, weil sie eine Aussage über den
**heutigen** Bestand sind: `02` (mcp-Randbefund, Quellenzeile samt Katalogstand
08:57 → 18:27 und Typ-Aufschlüsselung 402 → 404), `03` (Stand-Absatz, Massen-Repo-
Anteil, Herkunftssatz), `04` (Abstract, Regime-Tabelle, Trefferzahl-Absatz,
Domänen-Urteil, Hygiene-Block, M9, „Wäre theoretisch schön", Quellenverzeichnis),
`05` (Skill-gegen-Hook-Vergleich 24.700 → 24.702, Listing-Grösse, die Nachrechnung
der drei Zugriffsebenen, Produkt-Absatz, Generik-Bias, Platte-gegen-Standardzugriff),
`06` (Bestandseffekt 520 von 954 → 522 von 956).

Abgeleitete Zahlen sind mitgewandert, statt den Nenner allein zu tauschen: Mirajes
Schwellen-Faktor **9,5 → 9,6** (956/100) an zwei Stellen, der `general`-Anteil im
Hygiene-Block **34,7 % → 34,6 %** (331/956). Unverändert richtig blieben der
Massen-Repo-Anteil 96,3 % (24.543/25.499) und der Description-Anteil 5,9 %
(56/956) — beide runden auf denselben Wert.

**Was als historisch markiert wurde, und warum.** Zwei Stellen in `06` nennen „61 von
954 Bausteinen deklarieren Rechte". Die 61 ist ein Messwert vom Katalogstand
08:57; sie lässt sich nicht neu erheben, ohne `catalog/index.json` zu lesen, was die
Zugriffsregel verbietet. Den Nenner auf 956 zu heben, ohne den Zähler neu zu zählen,
wäre schlimmer als der alte Stand. Beide Stellen sagen deshalb jetzt „von damals 954"
mit Katalogstand im Satz und tragen `<!-- lint:historisch -->` im selben Absatz. Aus
demselben Grund ist im Quellenverzeichnis von `04` ausdrücklich vermerkt, dass die
dort protokollierten `search`-Trefferzahlen aus dem Stand 08:57 stammen und nicht
wiederholt wurden.

**Was entfernt statt aktualisiert wurde.** Zwei Zahlen, die an ihrer Stelle nichts
trugen und sich mit jedem `update` verschieben. Beide Wortlaute unten sind Altstand
vom Katalogstand 2026-08-07 08:57 und werden nur zitiert, um zu zeigen, was ersetzt
wurde — an keiner der beiden Stellen steht heute noch eine Zahl:

- <!-- lint:historisch --> `recipes/README.md` warnte „`catalog/index.json` nie
  direkt lesen — 25.497
  Einträge, rund 19 MB". Die Warnung trägt die Dateigrösse, nicht die Eintragszahl.
  Die Stelle verweist jetzt auf `stats`, statt eine Zahl zu führen.
- <!-- lint:historisch --> Titel und Überschrift von `knowledge/04` lauteten „was ab 954 Bausteinen kippt".
  Das Argument ist die Grössenordnung gegenüber Mirajes 100er-Schwelle, nicht der
  exakte Bestand — eine Überschrift, die jedes `update` überlebt, heisst jetzt „was ab
  **rund tausend** Bausteinen kippt". Die exakte Zahl steht im Abstract darunter,
  wo sie belegt ist.

**Woran der Irrtum bemerkt wurde.** An nichts — genau das ist der Punkt. Kein Mensch
hat eine Datei angefasst; ein `update` hat den Katalog unter dem Text verschoben, und
`lint` hat es gemeldet. Das ist der Kreislauf, wie er gedacht ist. Neu ist nur, dass
diese Erfahrung jetzt aufgeschrieben steht: `recipes/README.md` hat einen Abschnitt
**„Wenn eine Baustein-ID nicht mehr auflöst"** bekommen — fünf Schritte von `lint`
über den `CHANGELOG`-Vergleich alter und neuer Namen bis zur Pflicht, jede Zuordnung
mit `show` gegen die Aufgabe zu prüfen statt sie aus dem Namen zu raten. Die Zusage
weiter oben in derselben Datei („jede ID ist per `show` geprüft, `install` schlägt
also nicht fehl") war zu stark und ist auf eine Aussage über den Katalogstand von
damals zurückgenommen, mit Verweis auf den neuen Abschnitt — die Einschränkung steht
damit in demselben Abschnitt wie die Zusage, die sie relativiert. `recipes/04` trägt
am `install`-Befehl einen kurzen Hinweis auf den konkreten Vorfall und zeigt auf
diesen Abschnitt.

**Nicht angefasst.** `tools/harness.mjs`. `Learnings/`. Die Altwerte in den
bestehenden `lint:historisch`-Absätzen von `LOG.md` und `06`.

## [2026-08-07] revise | Die Text-Maßnahmen aus `06` umgesetzt — Rezepte sagen jetzt „Startauswahl" statt „Pflicht", `sources.txt` trägt Vertrauensstufen und einen Lückenblock, und `harness-build` erhebt Prüfschleifen, bevor es sucht

**Was vorher galt.** Alle sechs Rezepte überschrieben ihre ID-Tabelle mit
`## Kern-Set (Pflicht)`. Die Entdogmatisierung existierte, aber ausschliesslich in
`recipes/README.md` — und `knowledge` schneidet abschnittsweise aus, lieferte also
„Pflicht" samt Tabelle ohne jede Relativierung. Genau der Mechanismus, gegen den die
Doktrin gebaut ist: nicht die Aussage fehlte, sondern ihre Erreichbarkeit.

`sources.txt` führte 13 Repos ohne eine einzige Angabe darüber, wie sehr man der
Quelle traut, und ohne die Aufnahmekriterien, nach denen ein Repo hineinkommt. Ein
Rückkanal aus einem `/harness-build`-Lauf war an zwei Stellen als Handlungsanweisung
vorhanden und nirgends persistiert. `harness-build/SKILL.md` erhob Was, Stack,
Reifegrad und Schmerz — die CI-Konfiguration tauchte nur als Informationsquelle über
den Stack auf, nicht als Befund —, kannte `PLAN.md` an keiner Stelle, obwohl
`harness-plan/SKILL.md` zusagt „es liest Abschnitt 5 und 6", und endete mit Schritt 8.
`werkzeug-aenderer.md` listete `lint --all`, aber kein `eval`. `harness-update/SKILL.md`
sagte „Das führt drei Schritte aus", während `cmdUpdate` seit dem Werkzeuglauf vier
fährt. Und in `knowledge/04`, `05` und `06` standen an vier Stellen Anweisungen, die
sich auf `~/.claude/skills/` bezogen — eine zweite, globale Ablage der Bedien-Skills,
die es nicht mehr gibt.

**Was jetzt gilt.**

- **Rezepte (M11).** Alle sechs tragen `## Kern-Set (Startauswahl, zu kürzen)` und im
  **selben** Abschnitt zwei Sätze: bindend ist die Spalte „Welches Problem er löst",
  nicht die Liste. Die Bar-Zeile ist vereinheitlicht — 02 bis 06 bekommen den Satz aus
  01 mit ihren **bestehenden** Summen (52/50/43/63/36 KB), keine neue Zahl. Jedes
  Rezept hat einen Abschnitt „Verifikationspfad — auszufüllen, bevor eingeführt wird"
  mit einem **leeren Feld** statt eines festen Befehls, plus der Regel: existiert
  keiner, ist er der erste Arbeitsschritt. Und „Wann es nicht passt" nennt jetzt die
  harten Voraussetzungen einzelner Kern-Set-Bausteine — lokal startbare App (01),
  erreichbare Endpunkte (02), ausführbares Ziel plus schriftliche Erlaubnis (04),
  abrufbare Live-URL (05). 03 und 06 bekommen keine, weil ihre Kern-Sets keine haben.
- **Rückkanal (M14).** `harness-build/SKILL.md` hat einen Schritt 9 „Rückmeldung an
  die Bibliothek": abgesetzte Suchen wörtlich mitschreiben, **auch die erfolglosen**;
  daraus ersetzend ein Fall in `evals/routing.jsonl`; die Lücke als Zeile in den neuen
  Kommentarblock am Ende von `sources.txt`; drei Fragen an den Besitzer; Einarbeitung
  als `revise` über den `wissensbank-autor`. Eine leere Lückenliste ist ein gültiges
  Ergebnis und wird als solches hingeschrieben.
- **Vertrauen (M5, Textanteil).** `sources.txt` trägt je Repo eine Kommentarzeile
  `# Vertrauen: offiziell | gepflegt | unbekannt — <Halbsatz>`, dazu im Kopf die drei
  Aufnahmekriterien. `anthropics/skills` steht als einziges auf `offiziell`;
  `multica-ai/multica`, `Bomx/qwoted-…`, `mvanhorn/last30days-skill`,
  `nextlevelbuilder/…` und das Rechts-Repo auf `unbekannt`. `show` gibt die Stufe
  bereits aus. `harness-build` Schritt 4 hat ein fünftes Auswahlkriterium mit der
  ausdrücklichen Schranke: **fachliche Passung schlägt Herkunft**, die Stufe
  entscheidet nur den Gleichstand.
- **Prüfschleifen und die Naht zu `/harness-plan` (M13, M18).** Schritt 1 zerfällt in
  1a bis 1d: `PLAN.md` lesen, falls vorhanden (Abschnitt 5 und 6 ersetzen die
  Rückfragen); Prüfschleifen als **Befehl** erheben und „vorhanden" von „läuft und ist
  grün" unterscheiden; die Ausschlussfrage stellen; die Schmerzpunkte als
  **nummerierte** Liste vorlegen, auf die Kriterium 1 und Schritt 5 wörtlich zeigen.
  Bei null Schleifen ist der erste Baustein der, der „fertig" entscheidbar macht — der
  Hook erst danach. Eine leere Schmerzpunktliste heisst „kein Harness".
- **Reibung kennzeichnen (M17a).** Die Auswahltabelle in Schritt 6 hat zwei neue
  Spalten: `laden` und `hält an`. Der Eintrag in `hält an` kommt **nicht aus der
  Description** — `affaan-m__ecc/skill/gateguard` schreibt „blocks Edit/Write/Bash",
  besteht aber aus einer einzigen 5-KB-Datei —, sondern aus Typ `hook` mit
  Lifecycle-Ereignis oder aus dem, was der Trockenlauf an ausführbaren Dateien listet.
  Je „ja" eine Zeile darunter: was, wann, und wie man es wieder abstellt. Schritt 8
  wiederholt das, plus den ausgefüllten Verifikationsbefehl.
- **`eval` sichtbar (M15, Textanteil).** Der Nachweis-Block in `werkzeug-aenderer.md`
  führt `eval --no-save` und `list --to DIR`, mit der Begründung, warum `lint` es nicht
  ersetzt. `harness-update/SKILL.md` sagt „vier Schritte", erklärt Schritt 4 als Sperre
  und verlangt, einen roten Lauf dem User zu melden statt in der Rohausgabe untergehen
  zu lassen.
- **`verified` (M12c).** `knowledge/04`, Abschnitt 5.4, unterscheidet jetzt in einer
  Tabelle `generated` von `verified` und hält fest: `verified` setzt **ausschliesslich
  ein Mensch**, und der Anker daneben ist der vorhandene `repos[].head`, kein neues
  Feld. In diesem Lauf wurde kein `verified` gesetzt.
- **Buchführung.** Die Übersichtstabelle in `knowledge/06` hat eine Spalte **Stand**,
  gegen Code und Textdateien nachgeprüft. Der Abschnitt „Bewusst nicht umgesetzt" hat
  einen Nachtrag mit sechs Punkten, die erst bei der Ausführung als überflüssig
  erkennbar wurden. In `knowledge/04` sind M7 und M10 als erledigt durchgestrichen.

**Woran der Irrtum bemerkt wurde.** Am Grep. `~/.claude/skills/` kam an vier Stellen
in `knowledge/04`, `05` und `06` als Handlungsanweisung vor („Beide Kopien ändern",
„zwei md5-Vergleiche"), während das Verzeichnis nicht existiert — die Bedien-Skills
liegen nur noch unter `.claude/skills/` im Projekt. Alle vier Stellen sind mit
`<!-- lint:historisch -->` als überholt gekennzeichnet statt gelöscht, weil die
Begründung sonst verloren geht. Ebenso in `knowledge/04`: der Satz „Was fehlt: der
Commit-Hash" war seit dem Werkzeuglauf falsch, das Manifest führt ihn.

**Was bewusst nicht getan wurde.** Kein `verified` gesetzt — kein Mensch hat die
Dateien gelesen. Keine Spalte „Vertrauen" in `INDEX.md` oder `catalog/by-repo.md`:
beide erzeugt `writeMarkdownIndexes()`, ein Eintrag von Hand hielte bis zum nächsten
`extract`. Kein Rauchtest für Kern-Set-Bausteine (M12b): `install --dry-run` über alle
32 Kern-Set-IDs meldet bei 31 „nichts Ausführbares gefunden", einziger Träger ist
`anthropics__skills/skill/webapp-testing` — eine Markdown-Datei hat kein
Ausfallverhalten. Kein Textanteil zu `verify-recipes` und `eval --recipes`, weil der
Werkzeuglauf beide verworfen hat.

**Ein Befund, der bleibt.** Die sechs Kern-Sets bestehen aus 33 Zeilen mit 32
verschiedenen IDs, **ausschliesslich vom Typ `skill` und `agent`** — kein Hook, kein
Command, kein MCP. Der Pflichtteil aller Rezepte empfiehlt damit ausschliesslich
Kontextmaterial und keinen einzigen Zwang. Das steht in Spannung zu Doktrin 1.1
(„Hook = Zwang, nicht Bitte") und zu `harness-build` Schritt 4. Der Befund steht mit
beiden Lesarten in `recipes/README.md` unter einer eigenen Überschrift; entschieden
ist er nicht.

**Prüfprotokoll.** `node tools/harness.mjs lint` → 16 Dateien, Nähte in 26, **1 Befund
(0 hoch · 1 mittel · 0 niedrig)**, Exit-Code 0. Der eine mittlere Befund ist der
bereits vorher bestehende: `CHANGELOG.md` wird an 6 Stellen zugesagt und entsteht erst
beim ersten `update` — durch diesen Lauf ist keine Stelle dazugekommen. `eval
--no-save` → alle Pflichtfälle bestanden. `knowledge "verifikationspfad zielprojekt
auszufüllen"` findet die sechs neuen Rezept-Abschnitte; `knowledge "kern-set
startauswahl kürzen"` liefert die umbenannten Abschnitte **mit** der Relativierung im
Ausschnitt — die Probe, an der die alte Fassung scheiterte. Alle in diesem Lauf neu
genannten IDs sind per `show` verifiziert; `update`, `sync` und `extract` liefen nicht.

## [2026-08-07] revise | Die Werkzeug-Maßnahmen aus `06` umgesetzt — `update` fährt jetzt die Evals, `install` meldet Kollisionen statt still zu mischen, und der Katalog trennt Ladegröße von Ordnergröße

**Was vorher galt.** `tools/harness.mjs` hatte zwölf Subcommands, von denen einer —
`eval` — von nichts ausgelöst wurde und in keiner Übersicht stand. `install` prüfte
Ziel-Kollisionen ausschließlich mit `fs.existsSync`, sah also nur, was bereits auf
der Platte lag, und nie, was derselbe Aufruf eine Zeile später selbst dorthin
schreiben würde; `--force` überschrieb nicht, sondern mischte zwei Autoren in einem
Ordner. Der Zustandsbericht meldete jeden Skill bedingungslos als „aktiv … kein
weiterer Schritt", auch wenn im Paket ein unregistriertes Hook-Skript lag. `search`
und `show` gaben die Verzeichnisgröße als Kostenangabe aus. `stats` war der einzige
zahlenausgebende Befehl ohne Einwand.

**Was jetzt gilt.**

- `cmdUpdate` hat vier Schritte; der vierte fährt `cmdEval` mit dem soeben gebauten
  Katalog und schreibt das Ergebnis in den obersten Abschnitt der `CHANGELOG.md`.
  Ein fehlendes `evals/`-Verzeichnis überspringt den Schritt, statt den Lauf
  abzubrechen. **Der Exit-Code von `update` hängt damit auch am Eval-Lauf** — eine
  bewusste Vertragsänderung: ein Update, das die Suche verschlechtert, ist kein
  erfolgreiches Update.
- `cmdEval` vergleicht die Ränge der erwarteten Treffer mit `evals/last-run.json` und
  meldet Verschiebungen (`VERSCHOBEN`), bevor ein Fall durchfällt; `--json` gibt die
  Bilanz maschinenlesbar aus, `--no-save` schreibt den Vergleichsstand nicht fort.
- `cmdInstall` führt die geplanten Ziele in einer Map mit. Zwei Bausteine auf denselben
  Pfad brechen den ganzen Aufruf ab — auch mit `--force`, denn das ist eine Auswahl
  und keine Überschreibfrage. `--dry-run` sagt damit dieselbe Kollision voraus, die
  der Echtlauf trifft. `--force` leert das Zielverzeichnis vor dem Kopieren.
  Konfigurationsdateien (`hooks.json`, `.mcp.json`) werden gesondert gemeldet, mit den
  Schlüsseln, die im Konflikt stehen.
- `activationOf` prüft bei Skills, Subagenten und Commands, ob im Paket eine
  ausführbare Datei mit einem Lifecycle-Ereignis liegt, und hängt der Meldung „aktiv"
  die Einschränkung an. Belegfall: `affaan-m__ecc/skill/delivery-gate` bringt ein
  Hook-Skript mit, das ohne Eintrag in `.claude/settings.json` nie feuert — der Skill
  wirkte, sein Gate nicht, und der Bericht sagte das Gegenteil.
- Der Katalog führt bei Skills `entryBytes` (was beim Greifen sofort lädt) neben
  `bytes` (was kopiert wird) und `exec` (wie viele Dateien ausgeführt statt gelesen
  werden). `search`, `show` und der Kleinheitsbonus der Suche hängen an der
  Ladegröße. Bis zum nächsten `extract` fällt alles auf `bytes` zurück und verhält
  sich unverändert — eine Warnung wird nur ausgegeben, wo die Zahl belegt ist.
- `list --to DIR` ist neu: es liest das Manifest eines Zielprojekts und bestimmt den
  Zustand jedes Eintrags neu, statt den des Installationslaufs zu wiederholen.
- `lint` bekommt vier Nähte dazu: die von der Bibliothek zugesagten eigenen Dateien
  gegen das Dateisystem, die `Stand:`-Zeile der erzeugten Indizes gegen den Katalog,
  Repos ohne einen einzigen Katalogeintrag, und in den Rezept-Tabellen die Spalten
  Typ und KB gegen den Katalogeintrag derselben ID.
- `stats` trägt seinen Einwand jetzt selbst: was die Zahl nicht sagt, und dass sie mit
  jedem aufgenommenen Repo wächst.

**Woran der Irrtum bemerkt wurde.** An drei Stellen hat das Werkzeug etwas anderes
behauptet als getan: `--dry-run` sagte eine Kollision nicht voraus, die der Echtlauf
fing; der Zustandsbericht nannte ein totes Gate wirksam; und die Größenangabe lag bei
einem Skill mit umfangreichem Referenzmaterial um Faktor 160 über dem, was er
tatsächlich in den Kontext lädt — die Bibliothek rankte damit ihre gründlichsten
Skills nach unten. Alle drei sind dieselbe Fehlerklasse: eine Meldung, die für einen
Teil des Vorgangs stimmt und deshalb für den Rest geglaubt wird.

**Was offen bleibt.** Die neuen Katalogfelder wirken erst nach dem nächsten
`extract`; der wurde bewusst nicht ausgelöst, weil er die Zahlen verändert, gegen die
`lint` gerade prüft. Die neue Naht meldet seither einen mittleren Befund, der stimmt:
`CHANGELOG.md` wird an sechs Stellen als vorhanden angesprochen, entsteht aber erst
beim nächsten `update`. Nicht umgesetzt wurden ein eigener Subcommand
`verify-recipes` (die Prüfung wohnt jetzt in `lint`, wie es der Abschnitt „Bewusst
nicht umgesetzt" in `04` verlangt) und `eval --recipes` aus demselben Grund. Die
Vertrauensstufe aus M5 liest `show` aus Kommentarzeilen in `sources.txt`; solange dort
keine stehen, gibt es unverändert aus.

## [2026-08-07] ingest | Fünf Vorträge zu Forward Deployed Engineering und simulationsbasiertem Prüfen ausgewertet — neues Kapitel `08`, sechs neue Maßnahmen, Korrekturen in fünf bestehenden Dateien

**Woher das Wissen stammt.** Fünf Rohquellen unter `Learnings/`, alle Konferenzvorträge
der AI-Engineer-Reihe, abgerufen und ausgewertet am 2026-08-07:

| Titel | Sprecher | Veröffentlicht |
|---|---|---|
| AI tools for Forward Deployed Engineering | Vasuman Moza (CEO) und JD Pruitt (Head of Engineering), Varick Agents | 2026-07-28 |
| How Forward Deployed Engineering is done at Cognition | Jia Rong Wu, Cognition (Devin) | 2026-07-28 |
| How Forward Deployed Engineering is done at Factory | Eno Reyes, Factory (Droid) | 2026-07-29 |
| Persona Engineering: A Field Guide to AI Synthetic Personas | Ishan Anand, Insight Sciences | 2026-07-29 |
| SimulationMaxxing: How we ship agents 20x faster | Aman Gupta (Nubank) und Shreya Rajpal (Snowglobe) | 2026-07-29 |

Damit ist der `lint`-Befund „5 Rohquelle(n) tauchen in keiner Wissensdatei auf"
abgearbeitet — der einzige mittlere Befund, den der Lauf davor noch führte.

**Was entstanden ist.** `knowledge/08-pruefbarkeit-und-pruefdaten.md`, 15 Abschnitte.
Die Entscheidung für eine eigene Datei statt einer Erweiterung von `05` hat zwei Gründe:
`05` ist ein geschlossenes Korpus von neun namentlich gezählten Vorträgen — Titel,
Abstract und drei seiner fünf Abschnitte nennen die Zahl, eine Erweiterung hätte die
Identität der Datei umgeschrieben. Und die fünf neuen Quellen teilen ein Thema, das die
neun alten nicht haben: Arbeit am fremden, laufenden System, und daraus abgeleitet
Prüfbarkeit als Grenze der Automatisierung. Gegen die Gefahr eines zweiten Namensraums —
der Fehler, der zu den zwei widersprechenden M1–M12-Listen geführt hat — vergibt `08`
ausdrücklich keine M-Nummern und keine Spezifikation: Belege und Befunde stehen dort,
die Eval-Spezifikation bleibt in `04` Abschnitt 4, die Maßnahmen in `06`. Jeder Abschnitt
nennt die Stelle, die er erweitert oder begrenzt.

**Was in bestehende Dateien eingearbeitet wurde** — der Regelfall, nicht die neue Datei:

- `01-harness-doktrin.md`, Abschnitt 2: Zweitbeleg aus fremder Praxis für die Position
  von Stufe 2 (Reyes, „agent readiness"), mit ausdrücklich begrenztem Geltungsbereich —
  er stützt Stufe 2 vor Stufe 3 und sagt nichts über Stufe 3 bis 6.
- `01`, Anhang A: zwei Symptom-Zeilen. Die zweite („Analyse bleibt ausufernd, auch nachdem
  der Kontext gekürzt wurde") ist ein **Nicht**-Symptom dieses Kapitels und die eigentlich
  neue Information: Ausschweifung überlebt jede Kontextkürzung.
- `02-bausteine.md`, 2.4: „Ein Hook startet keinen Agenten." Alle Hook-Ereignisse setzen
  eine laufende Sitzung voraus, auch `SessionStart`; was von aussen startet, ist kein
  Baustein dieser Bibliothek. Dazu die zweite Verwechslung: eine Description, die ein Gate
  ankündigt, macht ohne Skript im Paket noch keinen Hook.
- `04-governance.md`, 4.1: fünf Bauvorgaben für Stufe 2 und die Trennung der beiden
  Hälften (Kontext finden gegen aus ihm schreiben).
- `04`, 4.2: das erfundene Feldschema (`must`, `top`, `q`, `stufe`, `flags`, `notiz`)
  durch die tatsächlichen Felder ersetzt und der Altstand mit `lint:historisch` samt
  Begründung markiert — das war der offene Rest von M10.
- `04`, 4.3: zwei neue Drift-Zeilen. Die wichtigere: Ein Eval-Fall ist eine Vorhersage,
  kein Urteil — widerlegt ihn ein echter Projektlauf, wird der Eval korrigiert, nie der
  Lauf.
- `07-projekt-mit-ai-aufsetzen.md`: A1 bekommt den Vorbedingungssatz (das Kriterium ist
  die billigere Hälfte, die Umgebung die teurere) und Reyes als eng begrenzten
  Zweitbeleg; A2 bekommt die Regel „nimm eine Kennzahl, die das Projekt ohnehin führt";
  Abschnitt 7.7 die Frage nach dem Auslöser im Zielprojekt.
- `06-massnahmen.md`: M7 um zwei Punkte und drei Begründungsabsätze erweitert, M11 um
  Punkt 7 (Voraussetzungen einzelner Kern-Set-Bausteine), sechs neue Maßnahmen M13–M18,
  und 17 neue Zeilen in „Bewusst nicht umgesetzt".

**Was ausdrücklich nicht übernommen wurde.** 19 Vorschläge, jeder mit Grund, in `08`
Abschnitt 14 und in `06` „Bewusst nicht umgesetzt". Die drei folgenreichsten: keine der
Kernzahlen dieser fünf Vorträge ist als Beleg verwendbar (alle aus anonymisierten
Fallstudien ohne Methodenteil oder mit „maybe" gehedgt); kein Pflichtfeld `herkunft` je
Eval-Fall, weil es mangels Anfragenprotokoll nicht belegbar und praktisch konstant wäre;
und `/harness-plan` wird **kein** Pflichtschritt vor `/harness-build`.

**Was offen bleibt.** M13–M18 sind Vorschläge, keine Umsetzungen — sie fassen
`harness-build/SKILL.md`, `harness-plan/SKILL.md`, `werkzeug-aenderer.md` und drei
CLI-Funktionen an und gehören an den `werkzeug-aenderer` beziehungsweise an einen
gesonderten Lauf. In diesem Lauf wurde an `tools/harness.mjs` nichts geändert.

**Belegt durch.** `node tools/harness.mjs lint` vor dem Lauf: 1 Befund mittel (die fünf
Rohquellen), 0 hoch. Nach dem Lauf: 0 Befunde, Exit-Code 0. `node tools/harness.mjs eval`
unverändert 12 von 12 Pflichtfällen bestanden. Alle in diesem Lauf neu genannten
Baustein-IDs vor dem Schreiben mit `show` verifiziert.

## [2026-08-07] revise | Einstiegspunkt für fremde Agenten: `INDEX.md` trägt jetzt Orientierung statt nur Bestand, die Befehlsliste wird aus dem Dispatcher gelesen

**Anlass.** Der Besitzer gibt einem Claude in einem neuen Projekt Zugriff auf dieses
Verzeichnis und sagt „richte mir das Harness ein". Dieser Agent hat ein begrenztes
Kontextfenster und muss in Minuten wissen: was kann ich, wie fange ich an, was darf
ich nicht. Was er vorfand, beantwortete die erste und die zweite Frage nicht.

**Was vorher galt.** `INDEX.md` war eine reine Bestandsübersicht mit einer kurzen
Zugriffsregel und nannte drei Befehle: `search`, `show`, `install`. Es gibt elf.
`knowledge` — der Befehl, an dem das erklärte Ziel des Projekts hängt — kam dort nur
als Verzeichnisname unter „Weiterlesen" vor. Ein Agent, der pflichtgemäss nur
`INDEX.md` las, erfuhr nie, dass er die Wissensbank befragen kann.

**Was jetzt gilt.** `INDEX.md` bleibt der Einstiegspunkt und wird weiter erzeugt —
die Entscheidung gegen eine zweite, handgepflegte Einstiegsdatei fiel aus zwei
Gründen: Alle vier vorhandenen Wegweiser (`README.md`, der Regelblock in jeder
`CLAUDE.md`, `harness-build`, `harness-plan`) zeigen bereits auf `INDEX.md`; eine
zweite Datei wäre ein zweiter Einstiegspunkt und damit genau das Problem, das dieser
Auftrag beseitigen sollte. Und ihre Zahlen stammen aus dem Katalog, können also nicht
veralten — eine handgeschriebene Einstiegsdatei trüge handgeschriebene Zahlen, und
die Symptomtabelle in `CLAUDE.md` führt genau diesen Fehler.

Geändert wurde deshalb `writeMarkdownIndexes()` in `tools/harness.mjs`. Die Datei hat
jetzt vier neue Abschnitte — „Was das hier ist", „So fängst du an" (mit dem absoluten
Pfad und dem einen Befehl `node tools/harness.mjs`), „Was du niemals tun darfst" (drei
Verbote, jedes mit Grund), „Die Befehle" — und schliesst mit „Wohin für mehr" statt
mit „Weiterlesen". Umfang: 96 Zeilen, gemessen mit `wc -l`.

**Das Zeilenbudget wurde bezahlt, nicht ignoriert.** Die beiden Repo-Tabellen wuchsen
mit jeder Zeile in `sources.txt` und hätten `INDEX.md` über hundert Zeilen getrieben.
Sie liegen jetzt vollständig in `catalog/by-repo.md` (Ebene 2, ebenfalls erzeugt),
mit Link, Schwerpunkt und Stand je Repo — nichts entfernt, nur umgehängt. Die
Domänentabelle wurde zu einer Aufzählung verdichtet: dieselben Zahlen in einem
Fünftel der Zeilen.

**Die Befehlsliste wird gelesen, nicht gepflegt.** Neu ist `befehlsUebersicht()`. Sie
holt sich die Namen aus `cliOberflaeche()`, also aus dem `switch` am Dateiende, und
verbindet sie mit einer Zweckzeile. Ein Befehl, den es nicht mehr gibt, verschwindet
aus der Tabelle; ein neuer taucht mit „noch nicht beschrieben" auf, statt unsichtbar
zu bleiben. Flaggen stehen bewusst nicht darin — sie ändern sich häufiger als die
Namen und stehen vollständig im Aufruf ohne Argument.

**Gegenprobe.** Damit die Behauptung „diese Liste kann nicht veralten" belegt ist und
nicht bloss plausibel: `case "probeweise": break;` in den Dispatcher eingesetzt,
`extract` laufen lassen — Zeile 58 von `INDEX.md` lautete danach
`` | `probeweise` | — | neu, noch nicht beschrieben — `node tools/harness.mjs` fragen | ``.
Danach zurückgenommen und erneut erzeugt; `grep -c probeweise INDEX.md` gibt 0.

**Widersprüche zwischen den Dokumenten.** Fünf, alle am laufenden System geprüft:

| Wo | Behauptung | Wahrheit | Erledigt |
|---|---|---|---|
| `README.md` CLI-Block | acht Befehle | elf — `uninstall`, `knowledge`, `lint` fehlten | Block durch Verweis auf `node tools/harness.mjs` ersetzt, mit dem Grund im Text |
| `README.md` | „`bootstrap` und `install` legen die Bedien-Skills ab" | nur `bootstrap` — `copySkillsTo()` hat genau einen Aufrufer, `cmdBootstrap()`; ein Testlauf von `install` legte keine Skills an | korrigiert, `install` ausdrücklich ausgenommen |
| `README.md` Hintergrund | beschrieb `01`–`04` | es gibt `01`–`07`; `07` ist die für ein neues Projekt nützlichste Datei | `05`, `06`, `07` ergänzt, `06` als intern gekennzeichnet |
| `USAGE` | kannte `--no-skills` nicht | die Flagge existiert und wirkt (`bootstrap --to <dir> --no-skills` kopiert nachweislich nichts) | in `USAGE` aufgenommen, samt Hinweis, dass nur `bootstrap` sie kennt |
| Dateikopf `harness.mjs` | dritte Kopie der Subcommand-Liste, um `bootstrap`, `knowledge`, `lint` im Rückstand | der Dispatcher | Liste durch Verweis ersetzt |

Dazu die `CHANGELOG.md`, die an mehreren Stellen als vorhanden angesprochen wurde,
aber erst beim ersten `update` entsteht: `INDEX.md` nennt sie jetzt nur noch, wenn
`fs.existsSync` sie findet; `README.md` und `harness-update` sagen dazu, dass sie bei
diesem Lauf entsteht.

**Die eine echte Falschzahl.** <!-- lint:historisch --> Der Altwert 1.050 muss in
diesem Absatz stehen bleiben, sonst ist nicht dokumentiert, was korrigiert wurde.
`harness-build/SKILL.md` behauptete einen Standardbestand von rund 1.050 Bausteinen;
`stats` sagt 954. Die Stelle nennt jetzt gar keine Zahl mehr, sondern verweist auf
`INDEX.md` und `stats` — denn `lint` prüft `.claude/` nicht, eine Zahl dort würde
also erneut still verfallen. **Offen und hier festgehalten:** der Prüfumfang von
`cmdLint()` (`NAHT_EXTRA`) sollte `.claude/skills/` und `.claude/agents/` einschliessen.

**Trennschärfe der drei Skills.** Die drei `description:`-Zeilen nebeneinandergelegt:
`harness-plan` entscheidet **was** gebaut wird (Objekt: das Vorhaben, Ergebnis
`PLAN.md`), `harness-build` entscheidet **womit** (Objekt: das Zielprojekt, Ergebnis
installierte Bausteine), `harness-update` wirkt auf **die Bibliothek selbst** (Objekt:
`sources.txt` und der Katalog). Jede Zeile beginnt jetzt mit ihrem
Unterscheidungsmerkmal und endet mit einer Abgrenzung gegen die beiden anderen.
Entfernt wurde der Auslöser „Auch nutzen, wenn der User auf den Ordner ‚Harnes
Creator' verweist" in seiner alten, unqualifizierten Form — er kollidierte mit
`harness-update`, das genau dort arbeitet; er steht jetzt mit dem Zusatz „und
Bausteine für sein Projekt will".

**Prüfprotokoll.** `node --check` nach jeder Änderung. `extract` viermal gelaufen,
Bestand jedes Mal unverändert. Danach jeder gefahrlose Subcommand einmal —
`stats`, `search`, `show`, `knowledge`, `knowledge --list`, `lint --all`, `bootstrap`,
`install --dry-run`, `uninstall --dry-run`, Aufruf ohne Argument sowie die Aliasse
`know` und `why`: alle Exit-Code 0. `install` und `uninstall` zusätzlich einmal echt
gegen ein Wegwerf-Zielprojekt. `sync` und `update` nicht gelaufen — sie gehen ans
Netz und schreiben `CHANGELOG.md`, für diese Änderung nicht nötig. `lint --all`
vorher wie nachher: 0 hoch, 1 mittel (die fünf unausgewerteten Rohquellen), Exit 0.

## [2026-08-07] add | Zwei feste Subagenten ergänzt — `werkzeug-aenderer` und `wissensbank-autor`; Rezeptpflege bewusst nicht getrennt

**Anlass.** Für jede grössere Aufgabe wurden Agenten im Workflow-Skript neu
definiert — 25 im einen Lauf, 64 im nächsten, dieselben Rollen jedes Mal neu
formuliert. Festgeschrieben waren nur `learning-auswerter` (Schritt 1 des
Kreislaufs) und `behauptungs-pruefer` (Schritt 3). Die Schritte 4 und 5 — umsetzen
und einarbeiten — hatten keinen Eigentümer.

**Was angelegt wurde.**

| Agent | Objekt | Werkzeuge | Warum eigenständig |
|---|---|---|---|
| `werkzeug-aenderer` | `tools/harness.mjs` | Read, Edit, Grep, Glob, Bash | Die Datei hat keine Tests; der Lauf ist der Test. Kein `Write` — weder das Werkzeug noch `LOG.md` darf als Ganzes überschrieben werden |
| `wissensbank-autor` | `knowledge/`, `recipes/`, `LOG.md` | Read, Write, Edit, Grep, Glob, Bash | `knowledge` liefert Abschnitte, nicht Dateien. Kein `WebFetch` — Nachrecherche beim Schreiben ist der Moment, in dem unbelegtes Material einsickert |

**Was bewusst nicht angelegt wurde — Rezeptpflege als eigene Rolle.** Die härteste
Regel dieser Rolle ist bereits maschinell durchgesetzt: `cmdLint()` prüft jede
Backtick-ID aus `recipes/` gegen den Katalog mit Schwere **hoch** (`NAHT_ID_RE`),
und `lint --all` meldet dort derzeit null Befunde. Was übrig bleibt — OKF-Frontmatter,
selbsttragende Abschnitte, Beleg pro Aussage — ist identisch mit den Regeln für
`knowledge/`, und beide Verzeichnisse liegen ohnehin im selben Abfrageraum
(`KNOWLEDGE_DIRS`). Eine zweite Beschreibung mit denselben Konventionen hätte das
Routing verschlechtert, ohne eine Regel hinzuzufügen. Die ID-Verifikation per `show`
steht deshalb als eigener Abschnitt in `wissensbank-autor`.

Ebenfalls verworfen: ein Prüfer im fremden Zielprojekt. Der mechanische Teil ist
durch den Zustandsbericht `[aktiv]`/`[inaktiv]` von `install` und Schritt 8 in
`harness-build/SKILL.md` abgedeckt; der Rest ist ein Urteil über das fremde Projekt,
für das die Bibliothek keine Belege hat.

**Trennschärfe der vier Beschreibungen.** Vier Verben, vier Objekte, keine
Überschneidung: *auswertet* eine Rohquelle aus `Learnings/` — *prüft* eine einzelne
Behauptung adversarial — *ändert* `tools/harness.mjs` — *schreibt* die Texte der
Bibliothek. Zwei ähnliche Beschreibungen hätten dazu geführt, dass das Modell die
falsche oder gar keine zieht; das ist derselbe Effekt, der bei Skills gilt.

**Prüfprotokoll.** `node tools/harness.mjs lint --all` → `0 hoch · 1 mittel · 0
niedrig`, Exit-Code 0. Der mittlere Befund sind die fünf unausgewerteten Rohquellen
unter `Learnings/` und ist von dieser Änderung unberührt. Die vier `description:`-Zeilen
wurden nebeneinandergelegt und gegeneinander gelesen.

**Betroffen.** `.claude/agents/werkzeug-aenderer.md` (neu),
`.claude/agents/wissensbank-autor.md` (neu).

## [2026-08-07] revise | Zahlenheuristik in `cmdLint()` präzisiert — 14 Fehlalarme beseitigt, ohne eine einzige Zahl zu ändern

**Anlass.** `node tools/harness.mjs lint --all` meldete 14 Befunde hoher Schwere,
alle aus derselben Prüfung: „Bestandszahl X weicht vom Katalog ab". Jeder einzelne
wurde an der Fundstelle nachgeschlagen. **Kein einziger war ein echter
Widerspruch.** Ein Lint, das ausschliesslich Fehlalarme produziert, wird nach
kurzer Zeit nicht mehr gelesen — und findet dann auch die echten Fehler nicht mehr.
Der Vorgänger-Eintrag unten hatte diese Grenze bereits benannt und die Befunde
bewusst stehen lassen; dieser Eintrag behebt die Ursache im Code.

**Ursache.** Die Prüfung entschied über den Umkreis: eine Zahl galt als
Bestandsangabe, sobald irgendwo in ±70 Zeichen ein Wort wie `baustein`, `katalog`
oder `skill` stand. In einer Wissensbank **über** Bausteine steht dort praktisch
immer eines. Dazu kannte sie nur drei Kennzahlen (gesamt, Standardzugriff,
Massen-Repos) und wertete jede andere richtige Zahl als Abweichung. Und sie hatte
als einzige Prüfung keinen Ausweg für absichtlich zitierte Altwerte — `lint` konnte
prinzipiell nie auf null gehen, solange die Bibliothek ihre eigene Historie
protokolliert, und genau das verlangt die Doktrin.

**Die 14 Befunde, nach Antwortart sortiert:**

| Art | Zahlen | Fundstellen | Antwort |
|---|---|---|---|
| Zahl misst etwas anderes | `25.000` (2×), `859`, `1125` | Token-Budget, Zeilenzahl einer fremden Datei, KB-Angabe | Heuristik präzisiert |
| Code-Zeilenverweis | `1118`, `915`, `918`, `897`, `945` | `Z. 897–945` u. ä. in `06-massnahmen.md` | Heuristik präzisiert |
| Zahl ist richtig | `24.700`, `24.161` | Skills gesamt bzw. Domäne `legal-de` | Heuristik kennt jetzt alle Katalogwerte |
| Altwert absichtlich zitiert | `1.050` (2×), `25.593`, `25.322` | `LOG.md`, `06-massnahmen.md` | Absatz mit `<!-- lint:historisch -->` markiert |

**Was im Code geändert wurde** (`tools/harness.mjs`, Abschnitt „Bestandszahlen
gegen den aktuellen Katalog"):

1. **Nähe ersetzt durch Bindung.** Das Bezugswort muss an der Zahl kleben —
   entweder direkt dahinter (`954 Bausteine`) oder unmittelbar davor
   (`Bestand: 954`). `BESTAND_RE` ist durch `BESTAND_NACH_RE` und
   `BESTAND_VOR_RE` ersetzt. Die Endungen stehen ausgeschrieben (`bausteine?n?`),
   weil ein `\b` hinter dem Stamm am deutschen Plural-e scheitert — genau die
   Form, in der eine Bestandsangabe dasteht.
2. **Einheiten schliessen aus.** `EINHEIT_RE` erkennt Token, Zeichen, Zeilen,
   Byte, KB/MB/GB, Zeitangaben, `%`, `€`, `$` hinter der Zahl.
3. **Der Katalog liefert mehr als drei Wahrheiten.** Zusätzlich zu den drei
   Leitgrössen zählen jetzt alle Werte aus `cat.totals` (pro Typ), `cat.repos`
   (pro Repo) und die Summen pro Domäne als richtig. Wer eine korrekte Teilmenge
   nennt, soll sie nennen dürfen.
4. **`<!-- lint:historisch -->` wirkt endlich auch hier.** Neu:
   `historischBereiche()` und `istHistorisch()` — absatzweise, weil die
   Unterdrückung dem Gedanken gilt und nicht dem Zeilenumbruch. Der Marker galt
   bisher nur für die Baustein-ID- und die CLI-Aufruf-Prüfung.
5. **Die Meldung nennt die Zeile.** `zeileVon()`; die Datei steht jetzt als
   `knowledge/06-massnahmen.md:371` da. Vorher musste man bei sieben Befunden
   sieben Zahlen von Hand in einer 500-Zeilen-Datei suchen.

**Wo der Marker gesetzt wurde** — drei Absätze, alle mit Begründung im Text:
`LOG.md` (der Absatz „sank von 1.050 auf 954" und die Vorher/Jetzt-Tabelle des
Vorgänger-Eintrags) sowie `06-massnahmen.md` (die Korrekturanweisung „Bestand
1.050 → 954"). Eine Korrekturanweisung ohne den zu ersetzenden Wert ist nicht
ausführbar; ein `revise`-Eintrag ohne das Vorher erfüllt seinen Zweck nicht.
<!-- lint:historisch --> Der Absatz nennt den Altwert, um den Ort des Markers zu benennen.

**Keine einzige Zahl wurde geändert.** Alle 14 Befunde waren Sache der Heuristik
oder der fehlenden Kennzeichnung. Das war die Auflage und sie wurde eingehalten.

**Gegenprobe, damit die Prüfung nicht bloss verstummt.** Eine Wegwerf-Datei unter
`knowledge/` mit sechs Zeilen wurde eingeschleust und danach gelöscht. Ergebnis:
die beiden erfundenen Falschzahlen (`rund 1.050 Bausteine`, `25.100 Bausteine
verzeichnet`) wurden **gemeldet**; Token-Budget, Zeilenzahl, KB-Angabe,
`Z. 897-945`, `24.700 Skills` und `24.161 Einträge` liefen durch; ein Altwert im
markierten Absatz blieb stumm. <!-- lint:historisch --> Die beiden Falschzahlen in
diesem Absatz sind der Beleg selbst und müssen wörtlich dastehen — dass `lint` sie
beim ersten Lauf prompt gemeldet hat, ist die beste Bestätigung der neuen Bindung.
Eine Prüfung, die nach der Entschärfung nichts mehr
fängt, wäre der schlechtere Zustand — deshalb dieser Beleg.

**Ergebnis.** `lint`: 14 hoch → **0 hoch**, Exit-Code 1 → **0**. Es bleibt **ein**
mittlerer Befund: fünf Rohquellen unter `Learnings/` sind nicht ausgewertet. Der ist
echt und inhaltlich, kein Heuristik-Problem — er gehört in einen `ingest`-Eintrag,
nicht in diesen.

**Geprüft.** `node --check tools/harness.mjs`; danach `stats`, `search`, `show`,
`knowledge` samt Aliassen `know`/`why`, `knowledge --list`, `lint`, `lint --all`,
`lint --strict`, `install --dry-run`, `install --yes`, `bootstrap`, `uninstall`
(gegen ein Wegwerf-Zielprojekt) und der argumentlose Aufruf. `sync`, `extract` und
`update` wurden **nicht** ausgeführt: sie schreiben den 20-MB-Katalog neu und hätten
die Zahlen verändert, gegen die dieser Eintrag gerade belegt wurde.


**Anlass.** Ein Prüflauf fand in `knowledge/02-bausteine.md`,
`knowledge/03-vorbilder.md`, `knowledge/04-governance.md` und
`recipes/README.md` acht verschiedene Bestandszahlen für dieselben zwei Grössen
(`25.593`, `25.322`, `25.497`, `1.050`, `954`, `923`, `859`, `779`). `lint`
meldete 13 Befunde, 11 davon mit höchster Schwere. Widersprüchliche Zahlen in
einer Wissensbank, die von Agenten in fremden Projekten befragt wird, sind
schlimmer als fehlende — sie werden geglaubt und zitiert.

**Ursache.** Der Extractor in `tools/harness.mjs` wurde **nach** dem Schreiben
der Wissensdateien an vier Stellen korrigiert, ohne dass die Dateien nachgezogen
wurden:

| Korrektur im Code | Wirkung auf den Bestand |
|---|---|
| `TRANSLATION_RE` + `isPlaceholder()` | japanische Übersetzungen überschreiben ihre englischen Originale nicht mehr per ID-Dedup; `search "ja-jp"` 163 → 1 |
| `isClaudeHook()` | React-`use*`-Hooks zählen nicht mehr als Claude-Hooks; 152 → 56 Hooks |
| `classify()` | Dateipfad ist nur noch Rückfallebene, nicht mehr gleichberechtigtes Signal |
| `cmdSearch()` | Mehrwortsuche ist **UND mit Lockerung**, nicht mehr ODER |

Der Bestand im Standardzugriff sank dadurch von 1.050 auf **954**, der
Gesamtbestand von 25.593 auf **25.497**. Zusätzlich wuchs `tools/harness.mjs`
von 805 auf 1.397 Zeilen, wodurch sämtliche zeilengenauen Verweise ins Leere
zeigten.
<!-- lint:historisch --> Die Vorher-Werte stehen hier als Beleg der Korrektur.

**Was vorher galt und was jetzt gilt.** Alle Werte per CLI ermittelt
(`stats`, `lint`, `search`, `show`, `ls catalog/by-domain/`,
`wc -l tools/harness.mjs`), Katalogstand 2026-08-07 08:57:

| Grösse | vorher | jetzt |
|---|---|---|
| Bestand gesamt | 25.593 / 25.322 | **25.497** |
| Bestand Standardzugriff | 1.050 | **954** |
| Faktor über Mirajes 100er-Schwelle | 10 | **9,5** |
| Hooks | 152 | **56** |
| Hooks mit Shebang als Beschreibung | 68 ≙ 45 % | **50 ≙ 89 %** |
| ohne brauchbare Description | rund 230 ≙ 22 % | **56 ≙ 5,9 %** |
| Domäne `general` | 283 ≙ 27 % | **331 ≙ 34,7 %** |
| Regeln in `DOMAIN_RULES` | „13 Regex-Regeln" | **12** (+ `general` = 13 Werte, 12 Dateien in `by-domain/`) |
| `search "code review"` / `"review"` | 231 / 107 | **49 / 112** |
| Repo `affaan-m__ecc` | 585 | **520** |
<!-- lint:historisch --> Die Spalte „vorher" ist der Zweck dieser Tabelle.

**Wo eine Argumentation auf einer falschen Zahl aufbaute.** Drei Stellen in
`knowledge/04-governance.md` trugen keine falsche Zahl, sondern eine falsche
**These**, und mussten inhaltlich umformuliert werden:

1. Abschnitt 1 behauptete, `cmdSearch` werte Mehrwortanfragen als ODER, „je
   präziser die Absicht, desto unschärfer das Ergebnis". Der Code tut heute das
   Gegenteil. Die Passage ist umgeschrieben und der frühere Stand ausdrücklich
   als überholt benannt.
2. Abschnitt 2.2 baute die Diagnose „Domänen sind nach Datenmodell geschnitten"
   wesentlich auf 163 japanischen Pfad-Artefakten in `docs` auf. Die sind weg;
   die Diagnose steht jetzt nur noch auf den verbliebenen Belegen.
3. Abschnitt 3.2 kam auf „rund 230 ohne brauchbare Description" als geschätzte
   Summe mit unbekannter Überschneidung. Disjunkt nachgezählt sind es 56 — und
   das sind **exakt alle 56 Hooks**. Die Gesamtlage ist besser, das
   Hook-Problem vollständig. Massnahme M3 ist dadurch von „nice to have" zur
   dringendsten offenen Massnahme geworden.

**Zeilennummern durch Bezeichner ersetzt.** Alle Verweise auf
`tools/harness.mjs` laufen jetzt über `classify()`, `DOMAIN_RULES`,
`cmdSearch()`, `cmdInstall()`, `cmdExtract()`, `cmdUpdate()`, `extractRepo()`,
`hookDescription()`, `isClaudeHook()`, `TRANSLATION_RE`, `isPlaceholder()`.
Bezeichner überleben Commits, Zeilennummern nicht.

**Nicht mehr auflösbare Baustein-IDs.** Vier Kurzformen ohne Repo-Präfix
(`nextlevelbuilder/agent/design-review`, `msitarzewski/agent/code-reviewer`,
`anthropics/skill/brand-guidelines`, `Egonex-AI/skill/understand-chat` und
Geschwister) sind auf die volle, per `show` geprüfte Form gebracht. Vier IDs
existieren gar nicht mehr — `affaan-m__ecc/hook/after-file-edit`,
`multica-ai__multica/hook/use-auto-scroll`, `multica-ai__multica/hook/index`
und der japanische Stummel von `affaan-m__ecc/skill/production-audit`. Die
Beispiele wurden durch geprüfte ersetzt; wo die alten IDs noch stehen, sind sie
ausdrücklich als „existiert nicht mehr" markiert. <!-- lint:historisch -->

**Weitere behobene Widersprüche.** Überschrift „Vorschlag: zehn
Absichts-Kategorien" auf **zwölf** korrigiert (die Tabelle darunter hatte immer
schon zwölf Zeilen). Querverweis zwischen `knowledge/03-vorbilder.md` Teil E
(`/graphify` über den **eigenen Katalog** abgelehnt) und
`recipes/06-legacy-onboarding.md` (`graphify` für eine **fremde Codebasis**
empfohlen) in beide Richtungen ergänzt — beides war richtig, las sich aber als
Widerspruch. `recipes/README.md` hat ein `sources`-Feld auf
`knowledge/01-harness-doktrin.md` bekommen, das im Fliesstext ohnehin zitiert
wird; keine externe Quelle erfunden.

**Ergebnis.** `lint` meldet für die vier bearbeiteten Dateien **null Befunde**
(vorher 12). Die 11 verbleibenden Befunde der Wissensbank sind durchweg
Fehlalarme derselben Zahlenheuristik und wurden bewusst **nicht** geändert:

| Datei | Was die Heuristik für eine Bestandszahl hält | Was es wirklich ist |
|---|---|---|
| `knowledge/02-bausteine.md` | Auto-Compaction- und `MAX_MCP_OUTPUT_TOKENS`-Budget | eine Token-Angabe, kein Bestand |
| `knowledge/03-vorbilder.md` | Zeilenzahl von `skills/understand/SKILL.md` | Umfang einer **fremden** Datei, per `wc -l` gegengeprüft |
| `knowledge/05-erkenntnisse-aus-vorlesungen.md` (2×) | Zahl der Skills bzw. der `legal-de`-Einträge | korrekte **Teilmengen** des Gesamtbestands |
| `knowledge/06-massnahmen.md` (7×) | Zeilennummern in `harness.mjs`, eine KB-Angabe, sowie die dort absichtlich zitierten **alten** Werte | Belege eines Prüfberichts, die den Irrtum dokumentieren |

**Drei Fehlalarme erzeugt dieser Eintrag selbst** — `1.050`, `25.593` und
`25.322` in der Tabelle oben. Sie müssen stehen bleiben: ein `revise`-Eintrag,
der nicht sagt, was vorher galt, erfüllt seinen Zweck nicht. Die Heuristik kann
„gilt" und „galt" nicht unterscheiden; das ist eine Grenze von `cmdLint()`,
kein Mangel dieses Eintrags.

**Offen geblieben.** `knowledge/05-erkenntnisse-aus-vorlesungen.md` und
`knowledge/06-massnahmen.md` wurden nicht angefasst — sie trugen bereits die
richtigen Zahlen und dienten als unabhängige Gegenprobe. Die Zahlen in der
Hygiene-Tabelle (`04`, Abschnitt 5.5) für „mehr als 3 Domänen" und
„Namensdubletten" bleiben offen, weil sie sich nur aus `catalog/index.json`
erheben liessen, das per Regel nicht gelesen wird.

## [2026-08-07] lint | OKF-Metadaten für die gesamte Wissensbank nachgerüstet

**Anlass.** `node tools/harness.mjs lint` meldete 12 Befunde, davon 11 mit
höchster Schwere: keine einzige Datei der Wissensbank trug Frontmatter. Ohne
Metadaten ist für einen lesenden Agenten weder erkennbar, woher eine Aussage
stammt, noch ob sie geprüft wurde, noch wann sie verfällt.

**Was getan wurde.** Allen 11 vorhandenen Dateien wurde Frontmatter nach
**Open Knowledge Format (OKF) v0.2** vorangestellt. Der Inhalt der Dateien
wurde dabei **nicht** verändert — kein Satz umformuliert, nichts gekürzt,
nichts korrigiert. Diese Datei (`knowledge/LOG.md`) kam neu hinzu.

Bestand zum Zeitpunkt dieses Eintrags — 12 Dateien:

| Datei | `type` | `stale_after` |
|---|---|---|
| `knowledge/01-harness-doktrin.md` | Doktrin | 2027-02-07 |
| `knowledge/02-bausteine.md` | Referenz | 2027-02-07 |
| `knowledge/03-vorbilder.md` | Analyse | 2027-05-07 |
| `knowledge/04-governance.md` | Governance | 2027-05-07 |
| `knowledge/LOG.md` | Protokoll | 2028-08-07 |
| `recipes/README.md` | Wegweiser | 2027-08-07 |
| `recipes/01-web-app-react-nextjs.md` | Rezept | 2027-05-07 |
| `recipes/02-backend-api.md` | Rezept | 2027-08-07 |
| `recipes/03-python-daten-ml.md` | Rezept | 2027-08-07 |
| `recipes/04-security-audit-pentest.md` | Rezept | 2027-05-07 |
| `recipes/05-seo-content-marketing.md` | Rezept | 2027-05-07 |
| `recipes/06-legacy-onboarding.md` | Rezept | 2027-08-07 |

**Gesetzte Felder.** `type`, `title`, `description`, `status: stable`,
`sources`, `generated`, `stale_after`, `tags`. Die `sources`-Einträge wurden
aus den `Quellen`- bzw. `Geprüfte Dateien`-Abschnitten der jeweiligen Datei
übernommen; es wurde keine Quelle erfunden. `recipes/README.md` hat kein
`sources`-Feld, weil die Datei keine externe Quelle verwendet.

**`verified` wurde bewusst nicht gesetzt.** Kein Mensch hat diese Dateien
geprüft. Nach OKF gilt eine Seite ohne `verified` als `unverified` — und genau
das ist der ehrliche Zustand. Wer eine dieser Dateien gegen ihre Quellen
prüft, trägt `verified` nach und schreibt hier einen `lint`-Eintrag dazu.

**Offen geblieben.** Die 10 Rohquellen unter `Learnings/`, die in keiner
Wissensdatei auftauchen (Befund mittlerer Schwere), wurden nicht ausgewertet —
das ist Arbeit für einen `ingest`-Lauf, nicht für einen `lint`-Lauf.
