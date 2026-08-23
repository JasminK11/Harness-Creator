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

## [2026-08-23] revise | `02-bausteine.md` 2.1: tote Relative-Links an der Installationsgrenze als bekannte Grenze dokumentiert (Befund A1, E2E-Lauf 2026-08-23)

Anlass: E2E-Abnahmelauf vom 2026-08-23. Der Installations-Test von
`affaan-m__ecc/skill/react-patterns` zeigte relative Links auf Dateien des
Quell-Repos, die nicht mitinstalliert werden. Am laufenden System bestätigt:
Testinstallation per CLI in einen Wegwerf-Ordner (`install … --yes --to /tmp/opencode/…`,
danach entfernt) — die installierte `SKILL.md` enthält vier Relative-Links
(`../../rules/react/hooks.md`, `../../rules/react/`, zwei Geschwister-Skill-Links
`../…`); `.claude/rules/` existiert im Ziel nicht, die Geschwister-Skills wurden
nicht mitinstalliert. Eingearbeitet in den bestehenden Abschnitt 2.1 (Typ Skill)
statt eines neuen Abschnitts — derselbe Feldumfang wie die dortige
Kontext-Kosten-Beschreibung: Eigenschaften des Typs an der Werkzeuggrenze.
Eingrenzungsquelle: `knowledge/04`, Abschnitt 5 — wir besitzen die Quell-Repos
nicht und können dort nichts reparieren; kontrollierbar sind nur Aufnahme und
Installationsweg.

## [2026-08-23] revise | install/uninstall/list: gleicher Anlegen-Hinweis wie bootstrap (requireTarget)

Bezug: Folge zu „[2026-08-23] revise | bootstrap: Anlegen-Hinweis bei fehlendem
Zielverzeichnis (requireTarget)" direkt unten. PM-Entscheid: derselbe Hinweis für
alle vier Befehle, konsistent. `anlegenHinweis` ist nicht mehr Optionsschalter mit
Default `false`, sondern Default `true` in `requireTarget()`; die explizite Übergabe
in `cmdBootstrap` ist entfallen. Warum Default statt vier Übergaben: Alle Aufrufer
wollen den Hinweis — ein Parameter, den niemand auf `false` setzt, ist tote
Schnittfläche. Kein automatisches Anlegen: der Hinweis sagt nur, wie es von Hand
geht. Der alte Warum-Kommentar in `requireTarget()` („Nur bootstrap bekommt den
Anlegen-Hinweis …") beschrieb das Gegenteil des neuen Verhaltens und ist ersetzt.
Prüfung: node --check ok; alle vier Befehle gegen nicht existierenden Ordner geben
denselben Satz „… — erst anlegen, z.B.: mkdir -p \"<pfad>\"" aus; Happy Paths
bootstrap/install --yes/list/uninstall --yes gegen Wegwerf-Ordner unverändert;
lint --all 0 Befunde; eval --no-save 12/12; grep-Gegenprobe: „erst anlegen" kommt
genau einmal vor, in `requireTarget()`.

## [2026-08-23] revise | bootstrap: Anlegen-Hinweis bei fehlendem Zielverzeichnis (requireTarget)

Bezug: PM, Befund B1 aus dem E2E-Abnahmelauf. `bootstrap --to <fehlender Ordner>`
brach ab mit nur „FEHLER: Zielverzeichnis existiert nicht" — der Erstnutzer erfuhr
nicht, dass er den Ordner selbst anlegen muss. In `requireTarget()` kommt ein
Optionsschalter `anlegenHinweis` dazu; nur `cmdBootstrap` übergibt ihn, die Meldung
lautet jetzt „… — erst anlegen, z.B.: mkdir -p \"<pfad>\"". Kein automatisches
Anlegen: das Werkzeug soll explizit bleiben. install/uninstall/list behalten die
harte Meldung (sie setzen ein bestehendes Projekt voraus — verifiziert, alle drei
geben weiterhin den Kurzsatz ohne Hinweis aus). USAGE-Absatz zu bootstrap um den
Halbsatz „Das Zielverzeichnis muss bereits existieren — bootstrap legt nichts an."
ergänzt. Prüfung: node --check ok, lint --all 0 Befunde, eval --no-save 12/12,
Happy Path gegen Wegwerf-Ordner unverändert.

## [2026-08-23] revise | harness-build: feste Absichtsanzahl „zwölf" entfernt (Naht zu `nachweis`)

Bezug: Auftrag vom PM, Nachzug zur Absicht `nachweis` (Eintrag unten). Die drei
„zwölf"-Stellen in `.claude/skills/harness-build/SKILL.md` (Zeilen ~143, ~146 und
die ID-Liste ~150) hängen jetzt nicht mehr an einer Zahl: Schritt 2 verweist auf
den Bestand via `intent --list` („derzeit dreizehn"), der `intent`-Kommentar
sagt „alle Absichten", die ID-Liste führt `nachweis` ergänzend auf — verifiziert
gegen `intent --list` am laufenden System. Historische Angaben in knowledge/04
(Vorschlag 2.3, M9) und in diesem Protokoll bleiben unverändert.

## [2026-08-23] add | Absicht `nachweis` ergänzt (catalog/intents.yaml, M9)

Bezug: Auftrag vom PM, Eval-Fall in `evals/routing.jsonl` („how do I know the
agent did it right", `optional:true`): ohne Suchwort findet die Stichwortsuche
den einschlägigen Skill `affaan-m__ecc/skill/eval-harness` erst auf Rang ~468.
Genau für dieses Symptom-ohne-Suchwort liegt die Intent-Ebene (M9) da — von den
bis dahin 12 Absichten deckte keine Verifikation/Nachweis von Agentenarbeit ab.

Neue Absicht `nachweis` mit Frage „Ich will wissen, ob der Agent seine Aufgabe
wirklich und nachprüfbar erledigt hat.", drei Suchen (`eval harness`,
`verification loop`, `agent evaluator rubric`) und drei Ankern. Jede Suche wurde
vor der Aufnahme per `node tools/harness.mjs search` darauf geprüft, dass sie
den Ziel-Baustein vorn liefert; jeder Anker per `show` inhaltlich verifiziert:

- `affaan-m__ecc/skill/eval-harness` (Anker 1): formales Eval-Framework für
  Claude-Code-Sessions, eval-driven development — der im Eval-Fall erwartete Baustein.
- `affaan-m__ecc/skill/verification-loop` (Anker 2): Verifikationsphasen
  (Build, Typcheck, Lint, Tests), „before claiming it is complete".
- `affaan-m__ecc/agent/agent-evaluator` (Anker 3): bewertet Agenten-Ausgabe
  gegen eine 5-Achsen-Rubrik mit Belegpflicht.

Verifikation am laufenden System nach dem Eintrag: `intent --list` zeigt
13 Absichten; `intent nachweis` liefern alle drei Anker auf Rang 1–3. Naht
geprüft: `CLAUDE.md` und `INDEX.md` nennen keine Absichtsanzahl und bleiben
korrekt; **`.claude/skills/harness-build/SKILL.md` sagt zweimal „zwölf
Absichten" (Zeilen ~143 und ~146) und ist damit durch diesen Eintrag falsch
geworden** — Korrektur ist eigener Auftrag, hier nur gemeldet. Historische
„12"-Angaben in diesem Protokoll (Einträge vom 2026-08-07/10) bleiben als
Zeitstrahl unverändert.

## [2026-08-23] revise | Windows-Pfad-Reste aus Bedien-Texten entfernt (Umzug nach Linux)

Bezug: Auftrag vom PM. Das Projekt ist von einem Windows-OneDrive-Pfad nach
Linux gezogen; die Agentendateien unter `.claude/agents/` hatte der PM bereits
selbst bereinigt. Geändert wurden vier Gruppen, jeweils maschinenneutral statt
absolut — dieselbe Bewertung wie beim generierten CLAUDE.md-Block: Skills und
Wissen müssen je Maschine stimmen.

1. **Bedien-Skills**: `harness-plan` (1 Stelle), `harness-build` (3 Stellen),
   `harness-update` (4 Stellen). Projektverzeichnis → `<projektverzeichnis>`,
   Klon-Verzeichnis → „das Klon-Verzeichnis (`~/.harness-sources`,
   überschreibbar mit HARNESS_SOURCES)". Die PowerShell-Zeile
   `Remove-Item "C:\Users\info\.harness-sources\owner__repo"` wurde durch den
   portablen Befehl `rm -rf "$HARNESS_SOURCES/owner__repo"` ersetzt samt Hinweis,
   dass `$HARNESS_SOURCES` dieselbe Variable ist, die auch das CLI auswertet
   (`CLONE_DIR`, harness.mjs) — gegen das laufende System verifiziert.
2. **Rezepte**: je 1 `cd`-Zeile in `recipes/01`–`06` und `recipes/README.md`
   → `cd "<projektverzeichnis>"`. Zusätzlich Formatfehler aus R1 behoben:
   in `recipes/06` fehlte vor der Tabellenzeile `test-engineer` die Leerzeile
   hinter dem Blockzitat (Tabelle renderte dort nicht).
3. **`knowledge/03-vorbilder.md`** (5 Stellen): Herkunftsangaben in Frontmatter
   und Abschnitt „Geprüfte Dateien" nennen jetzt „lokaler Abzug im
   Klon-Verzeichnis der Bibliothek" bzw. `<projektverzeichnis>` für den
   Eigen-Bibliothek-Eintrag — historische Aussage unverändert, nur der
   Fundort maschinenneutral.
4. **`sources.txt`**: Kommentarzeile zum Klon-Verzeichnis auf dieselbe
   neutrale Formulierung umgestellt.

Naht geprüft: `CLAUDE.md` und `INDEX.md` nutzen absolute Pfade, sind aber beide
je Maschine aus dem Werkzeug generiert (INDEX.md schreibt `cmdSync()`/
Ebene 1, CLAUDE.md-Block regeneriert) — kein Widerspruch zu den neutralen
Skill-Texten. Keine Bestandszahl betroffen, daher kein `lint:historisch`.

## [2026-08-23] werkzeug | Nahtprüfung erfasst jetzt jede Markdown-Datei unter `.claude/skills/` und `.claude/agents/` — nicht mehr nur `SKILL.md`

Bezug: der „Offen"-Vermerk im Eintrag `[2026-08-07] revise | …Bestandszahl…`
(`cmdLint()` (`NAHT_EXTRA`) sollte `.claude/skills/` und `.claude/agents/`
einschliessen). Befund vor dem Lauf: die Aufnahme selbst war **schon geschehen**
— derselbe Commit `785e0eb`, der den Vermerk schrieb, hatte die Sammlung der
`.claude`-Dateien in `NAHT_EXTRA` bereits eingebaut; protokolliert als erledigt
wurde sie nie, und die Muss-melden-Gegenprobe bestätigte, dass die Naht dort
greift. Geblieben war ein Restloch gegen den Auftragsumfang
(`.claude/skills/**/*.md`): der Sammler nahm pro Skill-Ordner ausschliesslich
`SKILL.md` und in `agents/` nur Dateien auf direkter Ebene. Eine zweite
Markdown-Datei neben der SKILL.md — Notizen, Referenz, Beispiele — leitet
denselben Agenten zu denselben Aufrufen an und war gegen den Dispatcher unsichtbar.
Nachweis der Lücke vor der Änderung: `NOTIZEN.md` mit
`node tools/harness.mjs serch "x"` in `.claude/skills/harness-build/` angelegt,
`lint --all` blieb stumm (0 Treffer).

**Was geändert wurde.** `tools/harness.mjs`, nur der IIFE-Sammler innerhalb von
`NAHT_EXTRA`: läuft jetzt rekursiv über `.claude/skills/` und `.claude/agents/`
und nimmt jede `.md`-Datei in beliebiger Tiefe. Keine zweite Konstante
(kein `NAHT_PROJEKT_DIRS`) und keine zweite Logik: `NAHT_EXTRA` ist genau die
vorgesehene Liste für Dateien ausserhalb von `KNOWLEDGE_DIRS`, und die Nähte 1,
2 und 4 prüfen sie bereits über `nahtDateien()` mit unveränderter Schwere-Bewertung.
Der Warum-Kommentar steht im Code beim Sammler. Bewusst nicht geändert: die
Extraktion in Naht 2. Die Prüfung auf echte `node … harness.mjs …`-Aufrufe
innerhalb von Codeblöcken behandelt die `cd`-Zeilen und Wegwerf-Ordner-Beispiele
der Agenten-Dateien sauber (`node`-Anforderung, Flaggen nur hinter `harness.mjs`)
— Grenzen statt verbiegen.

**Echte Textfehler in den geprüften Dateien:** keine. Vorher wie nachher
0 Befunde; die heute vorhandenen `.claude`-Dateien bestehen alle Nähte.

**Prüfprotokoll.** `node --check tools/harness.mjs`: ok. `lint --all` vorher:
16 Dateien, Nähte in 27, 0 Befunde (~0,17 s); nachher: 16 Dateien, Nähte in 27,
0 Befunde (~0,17 s) — gleiche Zählung, da noch keine verschachtelte Zusatzdatei
existiert; die Änderung ist rein vorsorgend. `eval --no-save`: 1 Rangänderung
gegenüber dem Lauf vom Vormittag („werbeaussage pruefen" Rang 563 → 1), kein
Rückschritt, Stand nicht fortgeschrieben. Danach jeder gefahrlose Subcommand:
`stats`, `search "review" --limit 3`, `show affaan-m__ecc/agent/code-reviewer`,
`knowledge "evaluator agent"`, `knowledge --list`, `install --dry-run`,
`uninstall --dry-run` (verweigert korrekt ohne Manifest), `list --to`,
`bootstrap --to --dry-run` — alle wie dokumentiert.

**Gegenproben.**
- Muss-melden (neu gedeckte Stelle): `NOTIZEN.md` mit `serch` in
  `.claude/skills/harness-build/` → `[hoch] … Codeblock ruft Subcommand(s) auf,
  die es nicht gibt: 'serch'`. Datei danach gelöscht.
- Muss-melden (bestehende Stelle, Regressionsschutz): `serch`-Block ans Ende von
  `.claude/agents/werkzeug-aenderer.md` → dieselbe Meldung. Danach per
  `git checkout` wiederhergestellt (Datei war gegenüber HEAD unverändert).
- Darf-nicht-melden: Block mit `cd`-Zeile plus korrekten Aufrufen
  (`stats`, `search "review" --limit 3`) an dieselbe Datei angehängt → lint bleibt
  stumm (weiterhin 0 Befunde). Wiederhergestellt.

Damit ist der Offen-Vermerk aus dem Eintrag vom 2026-08-07 erledigt; dessen
Aussage „lint prüft `.claude/` nicht" galt nur bis Commit `785e0eb` am selben Tag.

## [2026-08-23] revise | Eval-Fall „werbeaussage pruefen": `warum` von Ankündigung auf Regressionsfall umgestellt

Bezug: die drei heutigen Einträge darunter (Flexions-Join, Nachschärfung,
claudeMdBlock-Anpassung). Der Fall ist seit dem Vormittagslauf grün, sein
`warum`-Feld sagte aber weiterhin „Grün, sobald die Suche Flexionsformen
verbindet" — eine erfüllte Ankündigung, die künftige Leser zur Verwirrung über
den Ist-Zustand einlädt. **Vorher galt:** der Fall dokumentierte eine offene
Schwäche als Erwartung an das Werkzeug. **Jetzt gilt:** er dokumentiert die
ehemals größte Flexions-Lücke (Echtbefund Dropfolio, 2026-08-10) und nennt im
selben Feld, wodurch sie geschlossen wurde — Flexions-Streifung in
`termRegex`, Endungen `ung`/`ungen`/`en` ab Rest ≥ 4, `e` ab Rest ≥ 5,
Ausnahmen `rechnung`/`rechnungen` (Stand 2026-08-23) — und dass er als
Regressionsfall stehen bleibt. Nur dieses eine Feld dieses einen Falls geändert;
Struktur der Datei unverändert, JSON per Parser gegengelesen. Die
`optional`-Markierung blieb unangetastet — ihre Entfernung wäre eine
Verhaltensänderung der Evals und gehört nicht in diesen Lauf.

**Nahtprüfung** (CLAUDE.md wurde heute per bootstrap regeneriert):
- `INDEX.md`: keine Aussage zum Matchverhalten (Grep 0 Treffer zu
  Flexion/Wortstamm/Endungen); Bestandszahlen gegen `stats` abgeglichen — Kopf
  25.655/1.104/24.543/8/14 exakt, Typ-Tabelle summiert auf 1.104
  (Standardzugriff-Sicht), Domänen-Zahlen decken sich je Paar mit `stats`
  (Differenzen general −3, meta −5 sind die 8 Quarantäne-Einträge). Kein Befund.
- `README.md`: ein Befund, behoben — „Elf Subcommands" korrigiert zu
  „Vierzehn Subcommands"; der Dispatcher listet 14 (`search … extract`,
  selbst gezählt), derselbe Drift-Typ, der laut LOG vom 2026-08-20 schon einmal
  in dieser Datei stand („um drei Befehle im Rückstand") und in CLAUDE.md
  bereits behoben war. Sonst keine Aussagen zum Suchverhalten; „rund 25.500"
  und „24.500 Rechts-Skills" sind gerundete Grössenordnungen, weiter zutreffend.
- `CLAUDE.md`: trägt den neuen Suchfallen-Text (Fall 2 „matcht am Wortanfang
  und verbindet Flexionsformen") wortgleich mit dem heutigen
  claudeMdBlock-Eintrag; kein Widerspruch zu INDEX/README.

## [2026-08-23] revise | claudeMdBlock-Vorlage: Suchfallen-Fall 2 an Flexions-Matching angeglichen

Bezug: die beiden heutigen Einträge „Suche verbindet Flexionsformen desselben
Wortstamms" und „Flexions-Streifung nachschärfend eingegrenzt" — deren
Dokumentationsfolge, hier vollzogen. Nur Text im Template (`claudeMdBlock()`
in `tools/harness.mjs`), keine Zeile an `termRegex`/`FLEXIONS_ENDUNGEN`/
`MIN_STAMM_LAENGE(_E)`/`STREICH_AUSNAHMEN` berührt.

**Vorher galt** (Fall 2 „Die Suche matcht am Wortanfang"): zwei Endungen am
selben Stamm finden einander nicht („`pruefen` findet `pruefung` nicht"),
den Wortstamm einzugeben sei Pflicht. Seit dem Vormittagslauf falsch.

**Neuer Wortlaut** (im Block für CLAUDE.md):

> - **Die Suche matcht am Wortanfang und verbindet Flexionsformen.** Der Stamm
>   findet alle längeren Formen (`review` findet `reviews`, `reviewer`,
>   `reviewing`); Biegungen desselben Stamms finden einander (`pruefen` trifft
>   `pruefung`, beide laufen auf `pruef`) — Endungen `ung`/`ungen`/`en` ab vier
>   Zeichen Rest, `e` ab fünf. Sehr kurze Stämme unter dem Restminimum werden
>   nicht rückwärts verbunden: `pruef` findet weiterhin alles, die Biegung eines
>   hypothetischen Dreizeichen-Stamms nicht. Den Wortstamm einzugeben ist damit
>   kein Muss mehr, bleibt aber der sicherste Weg.

Damit beschreibt der Rat das Verhalten, statt eine alte Grenze zu behaupten;
die Restminimums-Zahlen entsprechen `MIN_STAMM_LAENGE` (4) und
`MIN_STAMM_LAENGE_E` (5) im Wortlaut, nicht per Zeilenverweis.

**Prüfprotokoll:** `node --check` ok; `lint --all`: **0 Befunde** (16 Dateien,
27 Nähte); Gegenprobe über `bootstrap --to <Wegwerf-Ordner>`: generierte
CLAUDE.md trägt den neuen Text, alte Formulierung („Endungen am selben Stamm
finden einander nicht") dort 0-mal; Ordner danach entfernt. `search "pruefen"
--domain legal-de`: unverändert 2.416 Treffer; `eval --no-save`: 12 von 12.
Grep gegen INDEX.md und README.md: keine Fundstellen zur alten Aussage — die
alte Behauptung stand nur im Template und in der dadurch erzeugten CLAUDE.md
(wird vom PM per bootstrap regeneriert). Die Warum-Kommentare an
`FLEXIONS_ENDUNGEN` nennen „'pruefen' fand 'pruefung' nicht" bewusst als
Vergangenheitsbeleg fürs Warum des Streifens — historisch korrekt, nicht geändert.

## [2026-08-23] revise | Flexions-Streifung nachschärfend eingegrenzt (zwei falsch-Positive behoben)

Bezug: Vormittags-Eintrag „Suche verbindet Flexionsformen desselben Wortstamms“
(heute, darüberhalb bzw. darunter je nach Leserichtung). Ein adversarial
Prüflauf belegte zwei Kollisionen der neuen Streifung:

1. `search "state"`: 71 statt 44 Treffer — die `e`-Streifung machte aus `state`
   den Stamm `stat` und zog `statistician`, `instinct-status`, `ecc-statusline`
   mit (4 Kollisionstreffer in den ersten 100).
2. `search "rechnung" --domain legal-de`: `ar-abfindungs-rechner-modular` auf
   Rang 3 der Top 6 — die `ung`-Streifung machte aus `rechnung` den Stamm
   `rechn`, ein Präfix der fremden Wortfamilie Rechner/rechnen/rechnet.

**Geändert:** `termRegex()` in `tools/harness.mjs`. Neu sind `MIN_STAMM_LAENGE_E`
= 5 (höheres Restminimum nur für die Ein-Zeichen-Endung `e`; `MIN_STAMM_LAENGE`
= 4 bleibt für `ungen`/`ung`/`en`) und `STREICH_AUSNAHMEN`
(`rechnung`, `rechnungen` — diese Terme werden gar nicht gestammt). Die
Warum-Kommentare im Code nennen beide Kollisionsbelege.

**Warum diese Form:** Eine reine Streichung von `"e"` aus `FLEXIONS_ENDUNGEN`
fixte Kollision 1, ließ aber Rechner auf Rang 1 stehen (gemessen). Ein global
erhöhtes Restminimum scheiterte messbar an der Arithmetik: `rechn` hat fünf
Zeichen wie `pruef`, trennt also keine Schwelle. Die e-Schwelle 5 ist der
exakte Schnitt: sie kappt genau die 4-Zeichen-Reste (`state`→`stat`) und erhält
die echten Nutzer der e-Streifung — die englische y/ies-Flexion
(`properties`→`properti`, `studies`→`studi`, Rest ≥ 5 bleibt streifbar).
Deutsche e-Joins brauchen den Streifer nicht: das offene Präfix-Matching
verbindet `frage`/`fragen`, `abgabe`/`abgaben` ohnehin; gemessen identische
Trefferzahlen für frage/suche/abgabe/waffe/store/house/cache/queue/table vor/nach.
Die Ausnahmenliste ist bewusst minimal und nur so groß wie der Beleg;
`rechnen` bleibt streifbar und verbindet weiter Richtung Rechnungs-Familie.

**Prüfprotokoll** (`node --check` ok; USAGE, `stats` 25.655 Bausteine,
`search`+`show` code-reviewer, `knowledge "evaluator agent"`, `knowledge --list`,
`lint --all`: **0 Befunde**, install/uninstall/list-Zyklus gegen Wegwerf-Ordner
sauber, bootstrap-Trockenlauf unauffällig):

- `search "state"`: **44 Treffer** (Vormittag: 71), Kollisionstreffer in den
  ersten 100: **0**.
- `search "rechnung" --domain legal-de --limit 6`: **86 Treffer**, kein
  Rechner-Baustein in den Top 6, `grep -c rechner` über die ersten 100: **0**.
  Der Rückgang 359 → 86 ist der beabsichtigte Präzisionsgewinn: die Differenz
  sind genau die `rechn`-falsch-Positiven (Rechner-/rechnet-Treffer), belegt
  durch Tokenzerlegung beider Ergebnismengen.
- `eval --no-save`: **12 von 12 Pflichtfällen grün**; einzige Rangänderung
  gegenüber last-run.json bleibt der Heilfall selbst
  (werbeaussagen-pruefung Rang 563 → 1). Heilfall-Suche
  „werbeaussage pruefen --domain legal-de": Ziel-Skill **Rang 1 von 1**,
  0,153 s (Vormittag: 0,150 s) — keine messbare Einbusse.
- Gegenprobe 1: `search "pruefungen" --domain legal-de` findet weiterhin die
  pruefen/pruefung-Items (Stamm `pruef`, 2.416 Treffer, Top-Treffer sind
  Prüfen-/Prüfung-Skills) — der Vormittags-Nutzfall ist unversehrt.
- Gegenprobe 2: `search "anmeldung" --domain legal-de` findet die
  Anmelde-/Anmeldungen-Familie inkl. `01-anmeldung-pruefen-zustaendigkeit`
  (56 Treffer).

**Negativ-Kontrollen** (beweisen, dass die beiden Sicherungen tragend sind):
Sabotiertes `MIN_STAMM_LAENGE_E = 4` brachte alle vier `state`-Kollisionen
zurück (71 Treffer); geleerte `STREICH_AUSNAHMEN` brachten zwei
Rechner-Bausteine in die Top 6 von `rechnung`. Beide danach zurückgesetzt und
per grep verifiziert. Protokollnotiz zur eigenen Fehlerkultur: der erste
Restore-sed griff ohne Zeilenanker auch in den Seed-Sets von
`cliOberflaeche()` und schleuste `rechnung`/`rechnungen` als Schein-Subcommands
ein — `cmdLint()` fing das sofort (34 hoch-Befunde „Subcommand(s), die es nicht
gibt"); nach zeilengenauer Korrektur wieder 0 Befunde. Der Lauf ist hier erneut
der Test gewesen.

**Nicht geändert:** `FLEXIONS_ENDUNGEN`-Liste selbst, `MIN_STAMM_LAENGE` (4)
für die längeren Endungen, Plural-s-Streifen, UND/ODER-Logik,
`STOPPWOERTER`, `sucheIds()` (erbt über `bewerteTreffer`).

**Dokumentationsfolge (für den wissensbank-autor, hier nur gemeldet):**
Der claudeMdBlock-Vorlagentext (Fall 2, „Die Suche matcht am Wortanfang")
behauptet weiterhin „zwei Endungen am selben Stamm finden einander nicht
(`pruefen` findet `pruefung` nicht)" — das ist seit dem Vormittagslauf falsch
und ist jetzt doppelt unpräzise geworden: Biegungen desselben Stamms finden
sich gegenseitig, außer bei Rest < 5 hinter einem einzelnen `e` und außer bei
den Termen in `STREICH_AUSNAHMEN`. Der praktische Rat („den Wortstamm eingeben")
bleibt richtig. Textänderung gehört in einen eigenen Folgelauf.

## [2026-08-23] werkzeug | Suche verbindet Flexionsformen desselben Wortstamms

Anlass: Eval-Fall „werbeaussage pruefen“ (routing.jsonl:24, optional) stand seit
seinem Eintrag auf Rot — der wortgleiche Skill `werbeaussagen-pruefung` wurde
nicht gefunden, weil `termRegex()` den Term als Wortanfangs-Präfix matchte und
'pruefen' gegen 'pruefung' im 6. Zeichen scheiterte. Belegt vor der Änderung:
`search "pruefen" --domain legal-de` = 582 Treffer, `search "pruefung"` = 605,
Overlap 3; der Ziel-Skill lag auf Rang 563.

**Geändert:** `termRegex()` in `tools/harness.mjs`, neue Konstanten
`FLEXIONS_ENDUNGEN` (`["ungen", "ung", "en", "e"]`) und `MIN_STAMM_LAENGE` (4).
Nach dem bestehenden Plural-s-Streifen wird jetzt zusätzlich eine Flexionsendung
abgestreift, längste zuerst, aber nur wenn mindestens vier Zeichen Rest bleiben.
'pruefen', 'pruefung' und 'pruefungen' laufen alle auf den Stamm 'pruef' und
treffen dieselben Items; die UND-Fallback-auf-ODER-Semantik blieb unverändert,
nur das Token-Matching wurde präziser.

**Warum (steht auch als Kommentar im Code):** Wortanfangs-Matching verbindet
keine Biegungen desselben Stamms — die UND-Suche fiel auf hunderte Teiltreffer
zurück und der wortgleiche Skill lag auf Rang 563. Das Restminimum von vier
Zeichen verhindert, dass 'notes' über 'note' zu 'not' verkürzt alles findet, was
mit 'not…' anfängt (Notariat, Nothing, Notice).

**Prüfprotokoll** (`node --check`, USAGE, `stats`, `search`, `show`,
`knowledge`, `knowledge --list`, `lint --all`: 0 Befunde, alle install/uninstall/
list/bootstrap-Trockenläufe gegen Wegwerf-Ordner — alles unauffällig):

- `eval --no-save`: **12 von 12 Pflichtfällen grün**, der Fall „werbeaussage
  pruefen“ ist jetzt grün; einzige Rangänderung gegenüber last-run.json:
  `werbeaussagen-pruefung` Rang 563 → **Rang 1**.
- Zeitmessung Suchlauf vor/nach der Änderung: 0,155 s → 0,150 s („werbeaussage
  pruefen“, --domain legal-de) — keine messbare Einbusse bei 25.655 Bausteinen.
- Dokumentierter Stamm-Effekt erhalten: `search "review" --limit 3` findet
  code-reviewer, cpp-reviewer, csharp-reviewer wie zuvor.

**Gegenprobe** (eingeschleust als `evals/_gegenprobe-werkzeug-aenderer.jsonl`,
zwei Fälle, danach gelöscht): (1) „werbeaussage pruefen“ muss den Ziel-Skill in
den Top 5 melden — meldete grün, und sein Rot-Können war durch den Baseline-Lauf
vor der Änderung belegt. (2) `search "test"` darf `disclosure-statement-1125`
nicht treffen (`verboten`) — meldete grün; 'statement' beginnt nicht mit 'test'
und wird vom Präfix-Matching nie berührt. Negativ-Kontrolle für die
Mindestlänge: eine sabotierte Werkzeugkopie mit `MIN_STAMM_LAENGE = 1` machte
aus 'notes' den Stamm 'not' und fand 497 Notariats-Treffer statt der 32
sauberen — das Restminimum beweist damit seinen Wert am laufenden Werkzeug.

**Nicht geändert:** der Plural-s-Streifen und die UND/ODER-Logik in
`bewerteTreffer()`; die Termbilanz; `sucheIds()` (erbt das Verhalten über
`bewerteTreffer` automatisch).

**Dokumentationsfolge (für den wissensbank-autor, hier nur gemeldet):**
CLAUDE.md, Abschnitt „Wenn die Suche nichts Passendes findet", zweite Falle
(„Die Suche matcht am Wortanfang"): Der Satzteil „jede andere längere Form
findet die kürzere nicht, und zwei Endungen am selben Stamm finden einander
nicht (`pruefen` findet `pruefung` nicht)" ist durch diese Änderung falsch
geworden — Biegungen desselben Stamms finden sich jetzt gegenseitig, solange
der gemeinsame Rest vier Zeichen behält. INDEX.md macht keine Aussagen zum
Matchverhalten und ist nicht betroffen.

## [2026-08-23] revise | Bestandszahlen-Nachzug nach Katalog-Neubau

Anlass: `update` lief einen neuen Katalog (2026-08-23, `stats`: 25.655 Bausteine,
1.104 im Standardzugriff, 8 in Quarantäne); `lint` meldete 9 hoch-Befunde
(veraltete Bestandszahlen) und 7 mittel-Befunde (KB-Drift in Rezept-Tabellen).
Alle Zahlen unten per CLI belegt (`stats`, `show`), nichts geschätzt.

**Hoch — Bestandszahlen:**

- `knowledge/02-bausteine.md` („Ein Randbefund zur Bibliothek", Abschnitt 2.5):
  `1.091` als bewusst historischer Messwert vom 2026-08-10 belassen und mit
  `<!-- lint:historisch -->` samt Begründung markiert — der Satz bezieht sich
  ausdrücklich auf diesen Messzeitpunkt; die Aussage „vier mcp-Bausteine" wurde
  gegen `stats` (mcp: 4) bestätigt und gilt unverändert.
- `knowledge/03-vorbilder.md` (Teil D, „Stand bei uns"): zeitlose Ist-Stand-Angabe
  aktualisiert 25.642 → **25.655** gesamt und 1.091 → **1.104** im Standardzugriff;
  die datierten Klammerwerte (1.099 vor M2 usw.) blieben als Geschichte stehen.
  Der `--all`-Lauf förderte drei weitere Stellen in derselben Datei zutage, alle
  zeitlose Argumente und ebenfalls aktualisiert: Empfehlung D4 „24.543 von
  25.655 Bausteinen (95,7 %)" (Repo-Zahl 24.543 laut `stats` unverändert,
  Prozentsatz stimmt weiter), Teil E „Unsere 25.655 Bausteine stammen aus 14
  fremden Repos".
- `knowledge/04-governance.md` (Nachtrag 2026-08-10 nach M2/M3): `1.091` ist der
  dokumentierte Messstand dieses Nachtrags — mit `<!-- lint:historisch -->` und
  Begründung markiert statt aktualisiert. Der `--all`-Lauf fand zusätzlich die
  Tabelle „Wäre theoretisch schön" (LLM-Neuklassifikation): zeitlose Kosten-
  argument, 1.091 → **1.104** aktualisiert (`stats`; Massen-Repo weiterhin 24.543).
- `knowledge/05-erkenntnisse-aus-vorlesungen.md`, sechs Stellen:
  „Unser Bestand steht dazu im Widerspruch" aktualisiert 24.729 → **24.739** Skills
  und 70 → **72** Hooks (`stats`: skill 24.739, hook 72, mcp 4);
  „ungefiltertes Listing über … Einträge", „25.642 Einträge schaden niemandem",
  „Unsere Position" (Platte/Standardzugriff), „Generik-Bias" und Teil-E-Absatz
  „das Produkt, nicht die …" je 25.642 → **25.655** bzw. 1.091 → **1.104**
  (zeitlose Argumente über den aktuellen Bestand, daher aktualisiert statt
  markiert); im selben Absatz die veraltete Repo-Zahl 24.161 → **24.543**
  (`stats`: Klotzkette__claude-fuer-deutsches-recht = 24.543, dasselbe Mega-Repo,
  das auch `03` mit 24.543 nennt).
- `knowledge/LOG.md` (zwei ältere Einträge): der Extractor-Gegenprobelauf
  (`25.642`/`1.091`) und die Überschrift des `hookDescription()`-Eintrags vom
  2026-08-10 („Standardzugriff jetzt 1.091") dokumentieren den Stand ihres
  jeweiligen Tages — mit `<!-- lint:historisch -->` und Begründung markiert;
  LOG ist append-only, der damalige Stand muss nennbar bleiben.

**Mittel — KB-Drift in Rezepten:** Alle sieben gemeldeten IDs existieren weiter
(je per `show` verifiziert, Typ unverändert); ersetzt oder gestrichen wurde keine,
korrigiert wurden nur die KB-Spalten auf den neuen `Grösse`-Wert aus `show`
(Konvention der Tabellen: Gesamtgrösse, belegt an unbemängelten Zeilen):

- `recipes/01-web-app-react-nextjs.md`: `design-review` 5 → **4**; zusätzlich die
  Prosa-Erwähnung „nützlichen Teil in 5 KB" → 4 KB.
- `recipes/02-backend-api.md`: `pr-test-analyzer` 5 → **4**.
- `recipes/04-security-audit-pentest.md`: `penetration-testing-with-strix` 8 → **9**;
  Kern-Set-Summe „rund 43 KB" → **rund 44 KB**.
- `recipes/05-seo-content-marketing.md`: `seo-plan` 33 → **32**, Summe „rund 63 KB"
  → **rund 62 KB**; `seo-content-brief` 24 → **23**; `seo-drift` 13 → **12**.
- `recipes/06-legacy-onboarding.md`: `graphify` (agent) 62 → **61**.

Bilanz: 0 IDs ersetzt, 0 gestrichen; 5 Zahlenstellen mit `<!-- lint:historisch -->`
markiert (02, 04-Nachtrag, LOG ×2 inkl. Eintragsüberschrift), übrige 13 Fundstellen
auf den neuen Stand gebracht. Abschluss: `lint --all` 0 Befunde,
`eval --no-save` 12 von 12 Pflichtfällen bestanden — keiner der fünf als bekannte
Schwäche geführten Fälle berührt eine der angefassten IDs.

## [2026-08-23] add | Subagent `pm-orchestrator` angelegt; `wissensbank-autor` trägt zusätzlich die drei Bedien-Skills unter `.claude/skills/`

**Was entsteht.** `.claude/agents/pm-orchestrator.md`: eine PM-/Orchestrator-Rolle,
die Aufträge annimmt, zuschneidet und an die vier Fach-Spezialisten
(`learning-auswerter`, `behauptungs-pruefer`, `werkzeug-aenderer`,
`wissensbank-autor`) delegiert. Er schreibt selbst keine Fachtexte — ausgenommen
seine eigenen Rollendateien.

**Welche Zuständigkeit sich dadurch verschiebt.** Zweifach. Erstens lag die
Auftragszuschneidung bisher beim Nutzer oder beim jeweils beauftragten Spezialisten;
sie liegt jetzt bei einer benannten Rolle. Zweitens trug die Rollendatei des
`wissensbank-autor` bisher nur `knowledge/`, `recipes/` und `LOG.md` — für die drei
Bedien-Skills (`.claude/skills/harness-plan/SKILL.md`, `.claude/skills/harness-build/SKILL.md`,
`.claude/skills/harness-update/SKILL.md`) gab es keine dokumentierte Zuständigkeit
(Grep-Befund: weder dieser LOG noch `06-massnahmen.md` weisen sie jemandem zu; M14
nennt den `wissensbank-autor` für die Einarbeitung des Rückkanal-Befunds allgemein
zuständig — `06-massnahmen.md`, M14 Punkt 4: „Zuständig bleibt der `wissensbank-autor`" —,
nicht nur für die Lückenzeilen in `sources.txt`; für das *Tragen* der drei
SKILL.md-Dateien selbst stand er auch dort nicht). Die
Rollendatei trägt jetzt im Abschnitt „Bedien-Skills — die drei SKILL.md-Dateien
unter .claude/skills/" drei Regeln: ändern nur auf geprüften Befund; nach jeder
Änderung Nahtprüfung gegen `CLAUDE.md` und `INDEX.md` (Abgrenzung zu M18, das genau
diesen Fehlertyp als erledigte Massnahme dokumentiert — hier wird dieselbe Lehre zur
Dauerpflicht des zuständigen Agenten, kein zweiter Massnahmeneintrag); Schritt 9 in
`harness-build` (Rückkanal, M14) nicht ohne Auftrag anfassen.

**Nahtprüfung (Regel 2, nachträglich, 2026-08-23).** Heute wurde keine SKILL.md
geändert — nur die Rollendatei des `wissensbank-autor` und dieser LOG-Eintrag —,
der Pflichtlauf griff also formal nicht an; er wurde trotzdem gegen den neuen
Zuständigkeitsstand nachgeholt: Weder `CLAUDE.md` noch `INDEX.md` treffen eine
Aussage darüber, wer die drei Bedien-Skills trägt oder wer Aufträge zuschneidet
(`CLAUDE.md` nennt Subagenten nur als Frage an die Wissensbank, `INDEX.md` ist von
`extract` erzeugt und beschreibt Befehle und Bestand) — keine der beiden Dateien
widerspricht dem neuen Stand, die Naht ist geschlossen.

## [2026-08-20] revise | Drei Fallen-Punkte in `claudeMdBlock()` nach adversarialer Prüfung neu gefasst

**Was geändert wurde.** `tools/harness.mjs`, Funktion `claudeMdBlock()`, Abschnitt
`### Wenn die Suche nichts Passendes findet` (zu diesem Zeitpunkt nicht committeter
Stand): ausschliesslich die drei Aufzählungspunkte ersetzt. Einleitungssatz,
Schlussabsatz („kein Baustein ist besser als ein unpassender") und der Code-Kommentar
über dem Abschnitt sind unverändert.
- Punkt 1 (UND/ODER): nennt jetzt die tatsächliche Rückfall-Meldung „Kein Baustein
  enthält alle Suchwörter", die gemessene Grösse (sieben Wörter → über 250 Teiltreffer)
  statt „Hunderte", und die Regel „zwei gezielte Wörter statt das ganze Profil".
- Punkt 2: „Flexionsformen greifen nicht ineinander" ersetzt durch das tatsächliche
  Verhalten von `termRegex()` — Matching am Wortanfang, der Stamm findet alle längeren
  Formen, zwei Endungen am selben Stamm finden einander nicht — und die Regel, die
  daraus folgt: den Stamm eingeben (`pruef` findet `pruefen` und `pruefung`).
- Punkt 3: „überwiegend englisch" präzisiert: der Standardbestand ist englisch
  beschrieben, die deutschen Bausteine liegen im Massen-Repo `legal-de` und sind nur
  mit `--domain legal-de` oder `--all` erreichbar.

**Warum.** Die erste Fassung war am laufenden System in Teilen widerlegt: sie nannte
die Rückfall-Meldung nicht, gab für Flexionsformen nur „die andere Form probieren"
statt der Regel, die aus dem Präfix-Matching folgt, und verschwieg, dass deutsche
Bausteine ohne `--domain`/`--all` gar nicht im Suchraum liegen. Der Code-Kommentar über
dem Abschnitt benennt den Zweck: „Ohne sie wiederholt der Agent dieselbe Anfrage,
statt ihre Form zu ändern" — dafür muss jede Falle die richtige Gegenmassnahme tragen.

**Prüfprotokoll (2026-08-20).**
- `node --check tools/harness.mjs`: ok. Jede `L.push`-Zeile ≤ 82 Zeichen Nutztext.
- `lint` und `lint --all`: 16 Dateien, Nähte in 26, 0 Befunde.
- `eval --no-save`: „Alle Pflichtfälle bestanden"; die bekannten weichen Fälle aus
  `evals/routing.jsonl` („werbeaussage pruefen", Profilanfrage mit 257 Treffern)
  unverändert. `--no-save`, damit der Probelauf `evals/last-run.json` nicht fortschreibt.
- Rendering: `install affaan-m__ecc/command/tdd --to <Wegwerfordner> --yes` — der
  Abschnitt erscheint wortgleich in der erzeugten CLAUDE.md, keine der alten
  Formulierungen mehr enthalten; danach `uninstall`, Manifest 0 Bausteine. Ausserdem
  einmal aufgerufen: USAGE, `stats`, `search`, `show`, `knowledge`, `knowledge --list`,
  `list`, `bootstrap`, `install --dry-run`, `uninstall --dry-run`.
- Messungen, die die Texte tragen: `search "react typescript app with tests and
  deployment"` → 257 Treffer mit der Meldung „Kein Baustein enthält alle Suchwörter —
  zeige Teiltreffer"; `search review` 136, `reviews` 136, `reviewer` 41, `reviewing`
  12; `search "werbeaussage pruef" --domain legal-de` → 1 Treffer.
- Gegenprobe: „über 250" testweise durch „25.100 Bausteine" ersetzt → `lint` weiterhin
  0 Befunde. <!-- lint:historisch --> Die 25.100 ist die absichtlich eingeschleuste
  Falschzahl, kein Bestand. Die Zahlenheuristik in `cmdLint()` liest nur
  `knowledgeFiles()` aus `KNOWLEDGE_DIRS`, nicht die Strings in `claudeMdBlock()`. Das
  Schweigen von `lint` ist für diesen Block also kein Beleg — der Beleg ist das
  Rendering plus die Messungen. Zurückgebaut, Datei per `cmp` byteidentisch zum Stand
  davor. Dass dieselbe Falschzahl in **diesem** LOG-Eintrag sofort als `[hoch]`
  gemeldet wurde, zeigt: die Heuristik lebt, sie sieht nur `harness.mjs` nicht.

**Nachtrag, gleicher Tag.** `reviews` liefert exakt die 136 Treffer von `review`, darunter
`code-reviewer`, der das Wort `reviews` nicht enthält: `termRegex()` streicht ein
Plural-s vor dem Matching (Kommentar dort: „aus releases wird release"). Der Halbsatz
in Punkt 2 „die längere Form findet die kürzere nicht" ist damit für genau das im
selben Satz genannte Beispiel `reviews` falsch; er stimmt für `reviewer` (41) und
`reviewing` (12). Vom Umsetzer gemeldet statt still angepasst; daraufhin korrigiert:
Punkt 2 sagt jetzt „ein Plural-s wird abgeschnitten, jede andere längere Form findet
die kürzere nicht“. Rendering danach erneut geprüft.

**Zweiter Nachtrag, gleicher Tag.** Der Regelblock in der eigenen `CLAUDE.md` der
Bibliothek stammte noch aus der Zeit vor `intent` und nannte „alle 13 Befehle“;
INDEX.md und der Dispatcher führen 14. Per `bootstrap --to <Bibliothek>` neu erzeugt —
der vorgesehene Weg der Selbstanwendung; `git diff` zeigte ausschliesslich den Block
zwischen den Markern als geändert. Damit trägt die Bibliothek selbst denselben
Abschnitt „Wenn die Suche nichts Passendes findet“, den sie Zielprojekten mitgibt.

## [2026-08-10] revise | Fünf überholte Stellen zu M11 in `04-governance.md` und `08-pruefbarkeit-und-pruefdaten.md` eingearbeitet

**Anlass.** Der Eintrag direkt unter diesem (`add | Katalog-Hygiene-Kennzahlen bei jedem
`extract`… (M11)`) hält unter „Offen für die Wissensbank" fünf Stellen fest, die durch
die Umsetzung und die externe Prüfung von M11 überholt waren. Dieser Eintrag schliesst
sie ab. Details zu Umsetzung, Kennzahl-Definitionen, den realen Zahlen und der
Korrektur der 66/26-Zählung stehen in jenem Eintrag und im nächsten (Skill-Umbau) —
hier nur, was in den beiden Wissensdateien geändert wurde.

**`knowledge/04-governance.md`, Tabelle „Sollten wir tun".**
- Zeile M11 auf durchgestrichen-**erledigt** gesetzt, Konvention wie M2/M3/M9:
  Umsetzungsdatum 2026-08-10, `katalogHygiene(catalog)` bei jedem `extract`/`update`,
  Nenner-Begründung (Standardzugriff + Quarantäne, ohne Massen-Repos = 1.099 — bewusst
  **nicht** `cmdStats()`s 1.091, sonst wäre die Description-Kennzahl strukturell 0),
  adversarial geprüft und mit vier erfüllten Auflagen angenommen, Verweis auf den
  `add`-Eintrag oben. <!-- lint:historisch --> Die 1.099 hier ist keine veraltete
  Zahl, sondern derselbe andere, bewusst erklärte Nenner wie im `add`-Eintrag oben —
  der Marker unterdrückt den Fehlalarm der Zahlenheuristik, die beide Nenner
  (1.099 vs. 1.091) nicht unterscheiden kann.
- „Es bleibt **M11**." ersetzt: alle Zeilen der Tabelle sind jetzt erledigt oder in
  `knowledge/06` aufgegangen: „Damit ist jede Massnahme dieser Tabelle erledigt oder
  anderweitig in `knowledge/06` aufgegangen — offen bleibt nur, was unter „Wäre
  theoretisch schön" und „Ausdrücklich nicht" steht."
- Abschnitt 5.5: Beispielblock mit den zwei „?"-Platzhaltern und dem Etikett „Nenner:
  1.099 im Standardzugriff" ersetzt durch den realen Block vom 2026-08-10 aus
  `CHANGELOG.md` (Nenner-Etikett „= Standardzugriff + Quarantäne, ohne Massen-Repos",
  „general" mit „! über Ziel" markiert). Ganz ersetzt statt als Altstand daneben
  gestellt — der alte Block war nie eine vollständige Messung (zwei von vier Werten
  waren „?"), verdient also nicht den `lint:historisch`-Schutz einer echten
  superseded-Zahl. Umgebender Satz von Vorschlag auf Bestand gehoben: „…als Zeitreihe
  im `CHANGELOG.md` — Bestand, kein Vorschlag mehr."
- Geprüft (Auftrag Punkt 5, `grep "M11"`): eine sechste, nicht in der „Offen"-Liste
  genannte Stelle im Prüfprotokoll (Abschnitt „Nicht verifiziert / Vermutung", Zeile
  zu Abschnitt 5.5) behauptete ebenfalls noch, die Werte „mehr als 3 Domänen" und
  „Namensdubletten" seien offen und liessen sich „erst mit M11" erheben. Mit
  derselben Sorgfalt ergänzt statt gelöscht: Zeitpunkt der Prüfung (2026-08-07)
  benannt, Nachsatz „Seit M11 (2026-08-10, erledigt) liegen beide Werte vor" mit
  Verweis auf den realen Block in 5.5.

**`knowledge/08-pruefbarkeit-und-pruefdaten.md`, Abschnitt 14.** Zeile zum
verworfenen Namens-Auflösungswerkzeug: die Verwerfungsbegründung (IDs sind
`repo/typ/slug`, deterministisch, keine Identitätsunschärfe) unverändert gelassen.
Die Messung „von 54 Namensgruppen … nur 9 repoübergreifend" mit `<!-- lint:historisch
-->` markiert und im selben Satz begründet (Altstand vom 2026-08-07, Katalog seither
gewachsen), Nachtrag ergänzt: heutige Messung 66 Gruppen / 26 repoübergreifend, davon
20 durch das am 2026-08-08 neu aufgenommene Repo `anthropics__claude-plugins-official`;
Neuzählung ohne dieses Repo 10, nahe an den ursprünglichen 9 — Zahlen wie im
`add`-Eintrag oben, nicht neu ermittelt.

**Geprüft.** `node tools/harness.mjs lint --all` (0 Befunde); `node tools/harness.mjs
eval --no-save` (12 von 12 Pflichtfällen); `node tools/harness.mjs knowledge
"katalog-hygiene kennzahlen extract"` liefert den überarbeiteten 5.5-Abschnitt.

## [2026-08-10] add | Katalog-Hygiene-Kennzahlen bei jedem `extract`: vier Zahlen als Zeitreihe ins CHANGELOG.md (M11)

**Anlass.** Letzte offene Massnahme der Tabelle in `04-governance.md` Abschnitt
5.5 ("Coherence — anwendbar, und hier gehört der Eval hin"): eine
Bestandshygiene-Prüfung, die `extract` nebenbei erhebt und als Zeitreihe ins
CHANGELOG.md schreibt — vier Kennzahlen, kein neuer Subcommand.

**Umsetzung.** Neue Funktion `katalogHygiene(catalog)` — reine Berechnung ohne
I/O — direkt vor `cmdExtract()`. `cmdExtract()` ruft sie nach dem Bau des
Katalogs auf, druckt die Zeilen zur Konsole und schreibt bei einem
eigenständigen Lauf (`viaUpdate: false`, Default) selbst einen
`## <Zeitstempel> — extract (ohne update)`-Block ins CHANGELOG; ruft `update`
sie auf (`viaUpdate: true`, neuer Parameter), übernimmt `cmdUpdate()` dieselben
Zeilen in sein eigenes, schon bestehendes Änderungsprotokoll, direkt neben der
Eval-Bilanz — beides zusammen ist der "Audit" aus 5.5, keine zwei getrennten
Prüfungen. Damit läuft die Erhebung auch bei `update` mit, ohne dass `extract`
je "standalone" verstummt.

**Kennzahl-Definitionen, am bestehenden Code festgemacht (Auftrag: nicht neu
erfinden).** Nenner aller vier Kennzahlen ist "ohne Bulk/Massen-Repos"
(`!i.bulk`, 1.099 Bausteine) — bewusst **nicht** dasselbe "Standardzugriff" wie
in `cmdStats()` (`!i.bulk && !i.quarantaene`, 1.091). Würde Quarantäne den
Nenner schon vorher verlassen, wäre Kennzahl 1 strukturell für immer 0, weil
genau `quarantaeneGrund()` beide Mengen trennt — die Kennzahl soll aber
zeigen, wenn ein neues Repo den Anteil nach oben treibt. <!-- lint:historisch -->
Die 1.099 ist keine veraltete Zahl, sondern ein anderer, hier erklärter Nenner
als `cmdStats()`s "Standardzugriff" (1.091) — der Marker unterdrückt den
Fehlalarm der Zahlenheuristik, die beide Nenner nicht unterscheiden kann.

1. "ohne brauchbare Description" = `it.quarantaene` truthy, gesetzt von
   `quarantaeneGrund()` (M2) — keine zweite, abweichende Brauchbarkeits-Definition.
2. "mehr als 3 Domänen" — geprüft, ob ein Baustein überhaupt mehr als eine
   Domäne tragen kann: `classify()` gibt `DOMAIN_RULES.filter(...)` zurück, ein
   **Array aller** Treffer, kein Einzelwert. Gemessen bis zu sechs Domänen an
   einem Baustein gleichzeitig (2026-08-10). Die "?" in der ursprünglichen
   Spezifikation (`04-governance.md` 5.5) war Unwissen der Verfasserin, keine
   strukturelle Grenze — Befund, der die Wissensbank betrifft, siehe unten.
3. "in Domäne 'general' (Auffang)" = `domains.includes("general")` — genau der
   Rückfall, den `classify()` liefert, wenn keine `DOMAIN_RULES`-Regel griff.
4. "Namensdubletten über Repos" — Gruppierung nach dem letzten `id`-Segment
   (Slug; IDs sind `repo/typ/slug`, s. `knowledge/08`). Eine Gruppe zählt nur,
   wenn derselbe Slug in **mehr als einem Repo** auftaucht; Typ-Sätze desselben
   Repos (z.B. Skill *und* Command "code-review") zählen bewusst nicht mit —
   "nur berichten", keine Zielmarke.

**Reale Zahlen** (Lauf 2026-08-10 17:27, CHANGELOG.md):

```
Katalog-Hygiene 2026-08-10 (Nenner: 1.099 im Standardzugriff):
  ohne brauchbare Description          8  (0,7 %)  ← Ziel: < 5 %
  mit mehr als 3 Domänen              20  (1,8 %)  ← Ziel: < 10 %
  in Domäne 'general' (Auffang)      353  (32,1 %) ← Ziel: < 15 %  !  über Ziel
  Namensdubletten über Repos          26  ← nur berichten
```

"general" liegt klar über der Zielmarke (32,1 % gegen < 15 %) und ist im Block
sichtbar markiert — kein Exit-Code-Abbruch, die Zahlen machen sichtbar, sie
sperren nicht (M11-Vorgabe).

**Namensdubletten gegen die Vorarbeit geprüft.** `knowledge/08`, Abschnitt 14,
nennt "von 54 Namensgruppen ... nur 9 repoübergreifend" (Messung 2026-08-07).
Heutiger Lauf: 66 Gruppen gesamt, 26 repoübergreifend — auf den ersten Blick
eine grosse Abweichung. Ursache geprüft, nicht geraten: 20 der 26
repoübergreifenden Gruppen tragen `anthropics__claude-plugins-official`, ein
Repo, das laut CHANGELOG.md erst am 2026-08-08 19:36 neu in den Katalog kam —
**nach** der 54/9-Messung vom 2026-08-07. Die restlichen 6 Gruppen tragen das
Repo ohnehin nicht — das ist eine Restmenge, kein Rückschluss auf das Repo.
Die eigentliche Gegenprobe ist eine Neuzählung mit entfernten Items dieses
Repos: sie ergibt **10** repoübergreifende Gruppen, nahe an den ursprünglichen
9 — die 6 unveränderten plus vier Gruppen, die auch ohne das Repo aus
mindestens zwei anderen Repos bestehen (`code-reviewer`, `code-review`,
`hooks`, `mcp`). Die Abweichung erklärt sich durch Katalogwachstum, nicht
durch einen Fehler in der neuen Zählung. (Korrigiert nach externer Prüfung,
2026-08-10: die erste Fassung dieses Absatzes zählte 19 statt 20 und verwechselte
die 6-ohnehin-Menge mit einer echten Neuzählung ohne das Repo — die lag bei 10,
nicht bei 6.)

**Gegenprobe.** Vier Fixture-Dateien testweise in bestehende Klone gelegt
(nur die Klone unter `.harness-sources`, `sources.txt` unverändert, `sync`
nicht gelaufen): ein Skill mit leerer Description
(`mattpocock__skills/skills/misc/m11-probe-empty`), ein Skill mit sechs
gleichzeitigen Domain-Treffern (`m11-probe-domains`), und ein neuer,
vorher nirgends vorkommender Slug `m11-probe-crossrepo` gleichzeitig unter
`mattpocock__skills` **und** `anthropics__skills`. `extract` (nicht `sync`,
nicht `update`) lief darauf; Ergebnis exakt wie erwartet: Nenner 1.099→1.103
(+4 Proben), "ohne Beschreibung" 8→9 (+1), "mehr als 3 Domänen" 20→21 (+1),
"general" 353→356 (+3 — drei der vier Proben trafen keine `DOMAIN_RULES`-Regel),
"Namensdubletten über Repos" 26→27 (+1) — nichts Unerwartetes daneben. Fixture-
Dateien danach entfernt, `extract` erneut gelaufen: Katalog exakt auf dem
Ausgangsstand (`node tools/harness.mjs stats` vorher/nachher identisch:
25.642 Bausteine, 1.091 im Standardzugriff nach `cmdStats()`-Definition, 8 in
Quarantäne <!-- lint:historisch --> — diese Zahlen dokumentieren den Katalogstand
des damaligen Testlaufs vom 2026-08-10; das Protokoll muss den damaligen Stand
nennen, sonst ist die Gegenprobe nicht mehr nachvollziehbar. Aktueller Bestand:
`node tools/harness.mjs stats`). Der Gegenprobe-Block (17:26, sichtbar höherer Nenner) steht
weiterhin im CHANGELOG.md, jetzt mit einer Kennzeichnungszeile im
Blockkopf ("… — Gegenprobe mit 4 Fixture-Dateien, siehe knowledge/LOG.md") statt
kommentarlos zwischen echten Katalogzuständen zu stehen — eine erhöhte Zahl
ohne Erklärung im Artefakt selbst sähe wie eine Regression aus, nicht wie ein
Test. Gelöscht statt gekennzeichnet hätte den einzigen Beleg entfernt, dass die
Kennzahlen überhaupt auf eine echte Verschiebung reagieren (s. oben). Die
beiden inhaltsgleichen Wiederherstellungs-Läufe (17:27, ursprünglich hier
entstanden, sowie ein 17:35-Duplikat aus dem externen Prüflauf) wurden beim
Konsolidieren (B3, externe Prüfung 2026-08-10) entfernt und durch einen
einzigen frischen Lauf nach der B1-Korrektur ersetzt (17:40) — sonst stünden
drei wortgleiche Blöcke mit zwei verschiedenen Nenner-Etiketten nebeneinander.

**INDEX.md.** Durch den `extract`-Lauf neu erzeugt; dabei erscheint der
Subcommand `intent` (M9, im Dispatcher schon vorher vorhanden) erstmals in der
`befehlsUebersicht()`-Tabelle — Nebenwirkung der Regeneration, nicht dieser
Änderung.

**Geprüft.** `node --check tools/harness.mjs`; `node tools/harness.mjs`
(USAGE, neue Zeile bei `extract` sichtbar); `stats` vor und nach dem
`extract`-Lauf identisch (25.642 gesamt, 1.091 im Standardzugriff, 8
Quarantäne, gleiche Typ-/Domänen-/Repo-Verteilung); `lint --all` (0 Befunde);
`eval --no-save` (12 von 12 Pflichtfällen); `search "review" --limit 3`,
`show`, `knowledge "evaluator agent"`, `knowledge --list`, `install --dry-run`,
`install --yes` + `list --to` + `uninstall --dry-run`, `bootstrap --to` gegen
einen Wegwerf-Ordner — alle unauffällig. Nach B1–B4 (externe Prüfung,
2026-08-10) erneut geprüft: `node --check`, `lint --all` (0 Befunde),
`eval --no-save` (weiterhin 12 von 12), `stats` vor und nach dem
B3-Nachweislauf identisch.

**Offen für die Wissensbank (bewusst nicht in diesem Lauf nachgezogen — reine
Werkzeugänderung, die Korrektur ist ein eigener `revise`-Eintrag).** Durch
diesen Lauf und die externe Prüfung überholt:

- `knowledge/08-pruefbarkeit-und-pruefdaten.md` Abschnitt 14 (Tabellenzeile
  "von 54 Namensgruppen ... nur 9 repoübergreifend") — mit dem heutigen
  Katalog nicht mehr deckungsgleich, s. Passage oben (66 Gruppen, 26
  repoübergreifend, davon 20 wegen eines seit 2026-08-08 neuen Repos).
- `knowledge/04-governance.md` 5.5, die "?"-Platzhalter im Beispielblock für
  "mehr als 3 Domänen" und "Namensdubletten über Repos" — beide Kennzahlen
  sind jetzt messbar, mit realen Werten oben in diesem Eintrag.
- `knowledge/04-governance.md` 5.5, das Nenner-Etikett im selben
  Beispielblock ("Nenner: 1.099 im Standardzugriff") — der reale Block trägt
  seit B1 (externe Prüfung, 2026-08-10) die Formel "= Standardzugriff +
  Quarantäne, ohne Massen-Repos"; das Beispiel im Fliesstext noch nicht.
- `knowledge/04-governance.md`, Tabelle "Sollten wir tun", Zeile M11 — steht
  noch auf offen und muss wie M2/M3/M9 durchgestrichen-erledigt markiert
  werden.
- `knowledge/04-governance.md`, der Satz "Es bleibt **M11**." direkt unter
  derselben Tabelle — mit M11 umgesetzt ist er nicht mehr richtig.

## [2026-08-10] revise | `harness-build/SKILL.md` Schritt 2: hartkodierte Symptomtabelle durch `intent`-Zugang ersetzt (M9 Skill-Teil)

**Anlass.** Der LOG-Eintrag direkt unter diesem („`04-governance.md` 2.4: … M9-Zeile
mit Teilvermerk statt „erledigt"") hält fest: CLI-Teil von M9
(`catalog/intents.yaml`, Subcommand `intent`) ist umgesetzt und adversarial geprüft;
der Skill-Teil — die Tabelle „Schmerz → Suche" in `harness-build/SKILL.md` Schritt 2
durch den neuen Zugang ersetzen — stand laut `knowledge/04-governance.md:462`
(„Teilvermerk (2026-08-10)") noch aus. Dieser Eintrag schliesst ihn ab. Die
Erledigt-Markierung der M9-Zeile selbst bleibt bewusst unangetastet — sie folgt
erst nach der externen Prüfung dieses Ergebnisses.

**Verifiziert am System vor dem Schreiben.**
- `node tools/harness.mjs intent` ausgeführt: listet alle 12 Absichten (id + Frage),
  Fusszeile „Detail: node tools/harness.mjs intent <id>".
- `node tools/harness.mjs intent verstehen --limit 5` und
  `node tools/harness.mjs intent pruefen --limit 5` ausgeführt: Kopfzeile
  „Absicht <id>", Zeile „Domänen (informativ, kein Filter): …", Abschnitt
  „Anker (3, immer vorn, unabhängig vom Score):", danach „N weitere Treffer
  (zeige 5): …" und „… M weitere. Mit --limit N mehr anzeigen." — Wortlaut in
  den neuen Skill-Text übernommen, nichts erfunden.
- Dispatcher-Hilfe (`node tools/harness.mjs` ohne Argument) für `intent` gelesen:
  bestätigt `intent --list`, `intent <id> [--limit N]`, „dieselbe Bewertung wie
  search", Anker „immer vorn", unbekannte id → Fehlermeldung + gültige ids,
  Exit-Code 1.
- `catalog/intents.yaml` vollständig gelesen (130 Zeilen, `Read`-Tool erlaubt für
  diese kleine Datei): 12 Einträge mit `id`, `frage`, `suche`, `domains`, `anker`;
  Kopfkommentar nennt „Von Hand gepflegt" und „Erstellt: 2026-08-10".
- `tools/harness.mjs`, Nullstellen-Zweig von `cmdSearch` (Zeilen ~1203–1241)
  gelesen: die Termbilanz-Ausgabe und der englische Sprachhinweis („Die Bausteine
  stammen aus englischsprachigen Repos …", Vorschlagszeile bei
  `[äöüß]`/`DEUTSCHE_WOERTER`, Beispielliste `security, testing, review,
  deployment, documentation`) existieren bereits am laufenden System — das ist
  die M8-Massnahme aus `knowledge/06-massnahmen.md:399`, die dieselbe Textstelle
  betrifft und laut ihrem eigenen Nachtrag unangetastet blieb.

**Umsetzung.** In `.claude/skills/harness-build/SKILL.md`, Schritt 2 (Überschrift
„### 2. Bedarf in Suchen übersetzen" unverändert gelassen, weil
`knowledge/06-massnahmen.md:414` sie wörtlich zitiert):
- Die sechs-zeilige Tabelle „Schmerz → Suche" entfernt. Fünf ihrer sechs Fälle
  liegen jetzt in `catalog/intents.yaml`: Reviews → `pruefen`, Codebasis →
  `verstehen`, Tests → `testen`, Sicherheit → `absichern`, Deployments →
  `ausliefern`. Architektur ist nur **teilgedeckt** (korrigiert, siehe
  Prüfauflage unten): `search "architecture decision"` liefert 2 Treffer
  (`affaan-m__ecc/skill/architecture-decision-records`,
  `affaan-m__ecc/agent/architect`); nur der ADR-Skill ist Anker — unter
  `dokumentieren`, nicht unter `verstehen`/`bauen`. `agent/architect` ist über
  keine der zwölf Absichten erreichbar und bleibt nur per `search` auffindbar.
- Ersetzt durch: erst `intent` (Liste aller zwölf Absichten mit Frage), dann
  `intent <id>` — alle zwölf ids namentlich genannt. Erklärt, dass die Anker die
  **erste Prüfmenge** sind, kein fertiges Ergebnis (weiter durch Schritt 4 mit
  `show` zu prüfen), und dass die Domänen-Angabe je Absicht informativ ist, kein
  Filter — Wortlaut direkt aus der CLI-Ausgabe übernommen.
- `search` bleibt als Weg benannt für alles, was keine Absicht abdeckt, oder für
  die engere Suche innerhalb einer Absicht, wenn die Anker nicht reichen.
- M8-Kontext erhalten, nichts gestrichen: der Satz zu „React" als Stichwort ohne
  Problembezug, der `INDEX.md`-Domänenhinweis, der Satz, warum englisch gesucht
  wird und dass 0 Treffer zuerst den falschen englischen Begriff vermuten lassen
  (nicht einen leeren Katalog — jetzt mit den tatsächlichen Beispielwörtern aus
  dem CLI-Hinweistext belegt statt behauptet), und der Termbilanz-Absatz — alle
  sinngemäss an die neue Reihenfolge angepasst.
- Übrige Fundstellen zu „Symptom"/„Schmerz" in derselben Datei per `Grep` geprüft:
  alle beziehen sich auf die Schmerzpunkt-**Liste** aus Schritt 1d (nummerierte
  User-Probleme, referenziert in Schritt 4/5), nicht auf die entfernte Tabelle —
  unverändert gelassen. `harness-plan/SKILL.md` ebenfalls geprüft: seine
  „Symptom"-Treffer sind eigenständige Fallen-Beispiele ohne Bezug zur Tabelle.

**Prüfauflage (2026-08-10, externe Prüfung dieses Eintrags).** Die erste Fassung
dieses Umbaus wurde abgelehnt, mit der Feststellung, dass nach den folgenden
Korrekturen ohne erneute Vollprüfung committet werden darf. Dies ist ein
Korrekturvermerk, kein stilles Umschreiben — der Eintrag war zu keinem Zeitpunkt
committet, die Prüfung hat ihn dennoch beanstandet:

- **Blockierend 1.** Der SKILL.md-Satz „…und drei Anker — Bausteine, die
  `intent <id>` unabhängig vom Score immer zuerst zeigt" verallgemeinerte aus
  zwei Stichproben (`verstehen`, `pruefen`, beide mit drei Ankern). Prüfbefund:
  `intent testen` und `intent ausliefern` liefern nur je zwei Anker (Ausgabe
  „Anker (2, immer vorn…)", selbst nachgemessen). Korrigiert zu „zwei bis drei
  Anker" mit Beleg im selben Satz.
- **Blockierend 2.** Der Umsetzung-Bullet oben behauptete „Architektur →
  `verstehen`/`bauen`" ohne Systemprüfung. Prüfbefund: `search "architecture
  decision"` liefert 2 Treffer; `intent verstehen --limit 999` und
  `intent bauen --limit 999` (beide selbst nachgemessen) enthalten **keinen**
  davon. Korrigiert: Architektur ist nur teilgedeckt, über `dokumentieren`
  (ADR-Skill als Anker); `agent/architect` bleibt nur per `search` erreichbar.
  Bullet oben entsprechend geändert.
- **Auflage 3.** Der SKILL.md-Satz zum Sprachhinweis versprach die
  Nullstellen-Übersetzung für jede Nullstelle. Prüfbefund: der Code
  (`cmdSearch`, Nullstellen-Zweig) bedingt den Hinweis auf eine
  Deutsch-Erkennung (`[äöüß]`/`DEUTSCHE_WOERTER`) — selbst nachgemessen mit
  `search "sicherheit prüfen"` (Übersetzungsvorschlag erscheint) gegen
  `search "xylophone zebra"` (kein Hinweis). SKILL.md-Satz entsprechend auf
  „sieht die Anfrage deutsch aus, schlägt … vor" umformuliert.

**Nacharbeiten (a–c), nach Freigabe der Prüfung ausgeführt.**
- **(a)** `knowledge/04-governance.md`, Tabelle „Sollten wir tun": Zeile M9 auf
  **erledigt** gesetzt (Durchstreichung wie bei den anderen erledigten Zeilen),
  der „Teilvermerk (2026-08-10)" aus dem vorigen LOG-Eintrag zu einer
  Erledigt-Notiz umformuliert, die CLI- **und** Skill-Teil sowie die
  Korrekturauflagen aus diesem Vermerk nennt. Die „Empfohlene
  Reihenfolge"-Zeile darunter von „Es bleibt M9 → M11" auf „Es bleibt M11"
  aktualisiert.
- **(b)** Dasselbe Dokument, Abschnitt 2.4: der Absatz „Der Ansatz existiert im
  Keim bereits. `harness-build/SKILL.md` führt eine Symptomtabelle…" beschrieb
  die inzwischen entfernte Tabelle im Präsens. Ins Präteritum gesetzt
  („existierte", „führte", „war") und um einen Vermerk „**Umgesetzt
  (2026-08-10):**" ergänzt, der auf `intent <id>` und die M9-Zeile verweist —
  ohne Zeilennummern als Referenz.
- **(c)** `knowledge/06-massnahmen.md`, M8-Eintrag „Sprachhinweis in der
  Sackgasse statt Synonymtabelle": die Ortsangabe „zwei Sätze über der
  bestehenden Symptomtabelle" und der Prüfsatz „alle sechs Queries der Tabelle
  liefern Treffer" zeigten nach dem Umbau ins Leere. Nachtrag „(2026-08-10)"
  ergänzt, im Stil der bestehenden Nachträge dort: verweist auf den
  `intent`-Ersatz, markiert die alte Sechs-Treffer-Messung als Beleg des
  damaligen Zustands mit `<!-- lint:historisch -->` samt Begründung im selben
  Satz, stellt klar, dass die Ablehnung der Synonymtabelle und der
  Sprachhinweis in `cmdSearch` selbst unberührt bleiben.

**Verifikation.** `node tools/harness.mjs lint --all`: 16 Dateien, Nähte in 26,
0 Befunde (0 hoch · 0 mittel · 0 niedrig) — unverändert gegenüber vor der
Änderung, auch nach den Korrekturen und Nacharbeiten (a–c).
`node tools/harness.mjs eval --no-save`: 12/12 Pflichtfälle grün. Kein Commit in
diesem Lauf.

## [2026-08-10] revise | `04-governance.md` 2.4: Flag-Verhalten in `intents.yaml`-`suche`-Strings ergänzt (Prüfauflage zu M9), M9-Zeile mit Teilvermerk statt „erledigt"

**Anlass.** Adversariale Prüfung der frisch umgesetzten Massnahme M9 ergab als
Auflage: Abschnitt 2.4 zeigt im YAML-Beispiel nur reine Suchbegriffe
(`suche: ["codebase onboarding", …]`), deckt aber nicht, dass die reale, am
selben Tag erstellte `catalog/intents.yaml` in mehreren `suche`-Strings
eingebettete `--type`/`--domain`-Flags trägt und das neue Subcommand `intent`
sie gesondert behandelt. Der ausführliche Befund samt Mechanik steht bereits
im LOG-Eintrag „Subcommand `intent`" weiter unten in dieser Datei (Nachtrag zur
echten `catalog/intents.yaml`); dieser Eintrag dupliziert ihn nicht, sondern
hält nur die Ergänzung an der Wissensbank-Stelle fest, die als Suchtreffer für
„intents.yaml"-Format dient.

**Verifiziert am System vor dem Schreiben.**
- `catalog/intents.yaml` gelesen: 130 Zeilen, Kopf „Erstellt: 2026-08-10",
  Eintrag `pruefen` mit `suche: ["code review --type agent", "review quality
  --domain testing", "independent review second opinion"]`.
- `node tools/harness.mjs search "code review" --type agent --limit 3` → 32
  Treffer — der Beleg-Messwert aus der Prüfauflage, bestätigt.
- `node tools/harness.mjs intent pruefen --limit 3` läuft ohne Warnung, zeigt
  die drei Anker vorn plus „141 weitere Treffer" (Summe über alle drei
  `suche`-Einträge der Absicht, dedupliziert — nicht direkt mit den 32 der
  einzelnen gefilterten Query zu verwechseln, die genau eine der drei Queries
  betrifft).
- `parseSucheQuery()` in `tools/harness.mjs` (Zeilen 1469–1484) gelesen:
  trennt `--type`/`--domain` vom Suchtext, meldet ein unbekanntes `--`-Token
  als Warnung und ignoriert es, statt es als Suchwort durchzureichen.

**Umsetzung.**
- `knowledge/04-governance.md`, Abschnitt 2.4, direkt nach dem YAML-Beispiel
  (vor „Dazu ein Subcommand …") drei Sätze ergänzt: was in `suche`-Strings an
  Flags erlaubt ist, wie `parseSucheQuery()` sie als Filter je Einzel-Query
  anwendet (inklusive der Massen-Repo-Tür bei `--domain`, mit dem
  32-Treffer-Beleg), und dass ein unbekanntes Flag als Datenfehler gemeldet
  und ignoriert wird statt die UND-Suche zu verfälschen. Kein neuer
  Abschnitt, keine Umstrukturierung — die Stelle bleibt die
  Formatreferenz, auf die `catalog/intents.yaml` selbst in ihrem Kopf
  verweist.
- Tabelle „Sollten wir tun", Zeile M9: **nicht** auf erledigt gesetzt — der
  Skill-Teil (Symptomtabelle in `harness-build/SKILL.md` durch `intent`
  ersetzen) steht noch aus. Stattdessen einen klar gekennzeichneten
  „**Teilvermerk (2026-08-10):**" in die Warum-Zelle ergänzt: CLI-Teil
  (`intent`-Subcommand) und `catalog/intents.yaml` umgesetzt und adversarial
  geprüft, mit Verweis auf den ausführlichen LOG-Eintrag; Skill-Teil offen.

**Verifikation.** `node tools/harness.mjs lint --all` nach der Änderung ohne
Befund hoher Schwere; `node tools/harness.mjs knowledge "intents.yaml Flags
--type --domain"` liefert Abschnitt 2.4 mit der neuen Passage als Treffer.

## [2026-08-10] add | Subcommand `intent`: Absichts-Suche aus `catalog/intents.yaml` (M9) — Anker vorn, `--type`/`--domain` je `suche`-String

**Anlass.** M9 aus `knowledge/04-governance.md`, Abschnitt 2.4: eine
Absichts-Ebene neben den Domänen, von Hand gepflegt in `catalog/intents.yaml`,
die jedes `extract` überlebt. Der Subcommand fehlte bisher; `catalog/intents.yaml`
entstand parallel in einem eigenen Auftrag und lag zu Beginn dieser Arbeit noch
nicht vor.

**Umsetzung.**
- `druckeTreffer(i)` aus der Druckschleife von `cmdSearch()` herausgezogen —
  `cmdIntent()` braucht dieselbe Zeilenform, eine zweite Kopie wäre dieselbe
  Drift-Gefahr wie eine zweite Bewertungslogik.
- `parseIntentsYaml()` (mit `stripYamlComment()`, `parseYamlScalar()`,
  `parseYamlInlineList()`): minimaler Parser für genau das vereinbarte
  YAML-Subset — Liste von Objekten (`- feld: wert`), Skalare (unquoted/doppelt
  gequotet), Inline-Listen `[a, b]`, eingerückte Strich-Listen unter einem
  leeren Feld, `#`-Kommentare (ganze Zeile und hinter Werten, ausserhalb von
  Anführungszeichen). Keine YAML-Bibliothek: die Projektregel erlaubt nur die
  Node-Standardbibliothek.
- `ladeIntents()` lädt und validiert; fehlt `catalog/intents.yaml` oder trägt
  ein Eintrag kein `id`-Feld, bricht sie mit Verweis auf M9 /
  `04-governance.md` 2.4 ab statt zu crashen.
- `intentTreffer()` führt jede `suche`-Query über `bewerteTreffer()` — dieselbe
  Bewertung wie `cmdSearch`/`sucheIds()` — und vereinigt die Treffer
  dedupliziert (bei Mehrfachtreffern gewinnt der höhere Score).
- `cmdIntent()`: ohne Argument/`--list` listet id + Frage; `<id>` zeigt
  Domänen nur informativ (kein Filter — eine Absicht deckt laut Spezifikation
  mehrere Domänen ab), löst Anker über `findItem()` gegen den **vollen**
  Katalog auf (auch Massen-Repo/Quarantäne, weil ein Anker eine bewusste
  Einzelauswahl ist), meldet einen nicht auflösenden Anker als Warnung statt
  ihn zu verschlucken (Repo-Update kann ihn entfernt/umbenannt haben), hängt
  die übrigen Treffer nach Score an (`--limit`, Default 25) und dedupliziert
  sie gegen die bereits gezeigten Anker.

**Nachtrag, nachdem die echte `catalog/intents.yaml` während der Arbeit
geliefert wurde.** Sie weicht in einem Punkt vom Formatbeispiel ab: einzelne
`suche`-Strings tragen eingebettete Flags (`"code review --type agent"`,
`"security audit --domain security"` u.a.). Ohne Behandlung lieferte
`intent pruefen` 737 Treffer statt der belegten 32
(`search "code review" --type agent`). Ergänzt: `parseSucheQuery()` trennt
`--type`/`--domain` je Query heraus; der Filter wirkt nur für **diese eine**
Suche, nicht für die ganze Absicht. Ein unbekanntes `--flag` in einem
`suche`-String ist ein Datenfehler in `intents.yaml`, keine Suchabsicht —
gemeldet („Warnung: unbekanntes Flag …") und aus dem Suchtext entfernt statt
als Wort gewertet. `intentTreffer()` bekommt dazu nicht mehr vorab um
Massen-Repos bereinigte Items, sondern nur um Quarantäne bereinigte: jede
Query entscheidet über ihr eigenes `--domain`, ob sie Massen-Repos sieht —
genau wie bei `cmdSearch`, wo `--domain` dieselbe Tür öffnet. Ohne das läge
`rechtliches` (`"Vertragsrecht --domain legal-de"` u.a.) bei null Treffern,
weil die Domäne `legal-de` fast vollständig aus dem Massen-Repo
(Klotzkette__claude-fuer-deutsches-recht) besteht.

**Dispatcher/USAGE/INDEX.** `case "intent": cmdIntent(rest); break;` im
Dispatcher ergänzt — macht `intent` automatisch in `cliOberflaeche()` und
damit in der aus dem Dispatcher erzeugten Befehlstabelle in `INDEX.md`
sichtbar, sobald als Nächstes `extract`/`update` läuft (bewusst nicht selbst
ausgeführt, `INDEX.md` wird nur vom Generator geschrieben). `zweck`-Zeile in
`befehlsUebersicht()` ergänzt. USAGE-Block um `intent` samt Hinweis auf das
eingebettete Flag-Verhalten ergänzt.

**Gegenprobe, zwei Fälle.**
1. Eintrag ohne `id`-Feld in einer Test-YAML (Scratchpad) → `ladeIntents()`
   bricht mit „… enthält einen Eintrag ohne 'id' …" ab, Exit-Code 1. Danach
   entfernt.
2. `catalog/intents.yaml` kurzzeitig mit `--typo` statt `--type` in der
   `pruefen`-Query überschrieben (vorher per `cp` gesichert) → `intent
   pruefen` meldete „Warnung: unbekanntes Flag in intents.yaml-Suche \"code
   review --typo agent\": --typo — ignoriert". Danach aus der Sicherung
   zurückgespielt.
   **Korrektur (Prüfauflage 2026-08-10):** Hier stand fälschlich, `git diff
   --stat -- catalog/intents.yaml` habe „kein Unterschied zum Original"
   bestätigt. Das ist falsch und wurde von einem Prüfer zurückgewiesen: die
   Datei war zu diesem Zeitpunkt unversioniert (`git status`: `??
   catalog/intents.yaml`), `git diff --stat` gegen eine untracked Datei gibt
   IMMER nichts aus, unabhängig vom tatsächlichen Inhalt — der Befehl belegt
   in diesem Zustand gar nichts. Ein nachträglicher Beweis über die
   Sicherungskopie ist nicht mehr führbar: sie wurde im Aufräumschritt
   direkt nach der Rückspielung bereits gelöscht (bestätigt: unter dem
   Scratchpad-Pfad existiert keine Kopie mehr), ein Hash-Vergleich damit
   scheidet aus. Tatsächlich belegbar ist nur die Mechanik der Rückspielung
   selbst: Die Testmanipulation lief als gezielter `Edit`-Aufruf, der genau
   einen exakten Substring (`--type` → `--typo` in einer einzigen Zeile)
   ersetzte — nichts sonst wurde angefasst; die Sicherung war eine
   Byte-Kopie (`cp`) unmittelbar vor dieser Änderung, die Rückspielung eine
   Byte-Kopie (`cp`) dieser Sicherung zurück, ohne fremden Eingriff
   dazwischen. Das macht eine exakte Wiederherstellung plausibel, ist aber
   kein unabhängiger Nachweis. Als schwaches Indiz danach (2026-08-10,
   Prüfauflagen-Fix): der jetzt strengere `parseIntentsYaml()`-Parser (Absatz
   „Randnotiz-Fix" weiter unten in diesem Eintrag) meldet gegen die aktuelle
   Datei **keine** Formatwarnung — 129 Zeilen, 12 Einträge, `code review --type agent`
   (nicht `--typo`) unverändert vorhanden —, was für ein sauber
   wiederhergestelltes Original spricht, es aber nicht kryptografisch
   beweist. Aktueller Hash zur künftigen Kontrolle festgehalten:
   `md5(catalog/intents.yaml) = e0ae67cfa8609c3fadbcc7250a20c779` (129
   Zeilen, Stand dieses Prüf-Fixes). Falls die Datei durch die parallele
   M9-Arbeit inzwischen ohnehin weiterbearbeitet wurde, ist dieser Hash der
   neue Referenzpunkt, kein Beleg für Identität mit dem allerersten Stand.

**Randnotiz-Fix (Prüfauflage 2026-08-10).** Zweiter Befund derselben
adversarialen Prüfung: `parseIntentsYaml()` verschluckte kaputte Feldzeilen
still. Ein Eintrag mit `suche []` (Doppelpunkt vergessen) parste ohne
Warnung durch und hinterliess eine leere Suchliste — nicht unterscheidbar
von einer bewusst leeren Liste; ein Tippfehler bei einem eingebetteten Flag
(`--typo`, siehe Gegenprobe 2 oben) wurde dagegen gemeldet. Inkonsequent für
ein von Hand gepflegtes Format. Behoben:
- `INTENT_FELDER` (neue Konstante) — die fünf bekannten Feldnamen (`id`,
  `frage`, `suche`, `domains`, `anker`). Jede „key: value"-Zeile mit einem
  anderen Namen löst jetzt eine Warnung aus statt kommentarlos zu gelten.
- `parseIntentsYaml()` zählt Zeilennummern mit (Umstellung von
  `for (const roh of text.split(...))` auf eine indexierte Schleife) und
  meldet jede Zeile innerhalb eines Eintrags, die weder als bekanntes Feld
  noch als Listenelement eines offenen Feldes noch als Kommentar/Leerzeile
  erkennbar ist — Format: „Warnung: catalog/intents.yaml:<Zeile> …". Deckt
  drei Fälle ab: fehlender Doppelpunkt (`suche []`), unbekannter Feldname,
  und ein hängendes `- element` ohne zuvor geöffnetes Listenfeld.
- Jedes geparste Objekt trägt jetzt `_zeile` (die Zeile seines `- id: …`-
  Starts) — kein Datenfeld der Absicht, sondern die Fundstelle für
  Abbruchmeldungen. `ladeIntents()`s Abbruch bei fehlendem `id`-Feld nennt
  jetzt diese Zeile: „catalog/intents.yaml:<Zeile> enthält einen Eintrag
  ohne 'id' …" statt nur den Dateinamen.
- Nebenbei behoben: beim Start eines neuen Objekts wird `listKey`/
  `listIndent` jetzt unbedingt zurückgesetzt, bevor das erste Feld geparst
  wird. Ohne das hätte ein Eintrag mit fehlerhafter erster Feldzeile (die
  `feldSetzen()` nie erreicht) das `listKey` des VORHERGEHENDEN Eintrags
  geerbt — ein `obj[listKey].push(...)` gegen ein auf dem neuen, noch
  leeren Objekt nicht existierendes Feld hätte den Parser zum Absturz
  gebracht. Durch die neue Warnpflicht erstmals erreichbar, vorher lief
  jede erste Feldzeile über `id` und damit immer über `feldSetzen()`.

**Gegenprobe zum Randnotiz-Fix (drei Fälle, gegen Scratchpad-Kopien, echte
Datei unangetastet).**
1. `suche []` anstelle von `suche: [...]` in `verstehen` (echte Zeile 27
   überschrieben in einer Kopie) → „Warnung: catalog/intents.yaml:27 nicht
   erkannt (weder Feld noch Listenelement) — ignoriert: \"suche []\"",
   `intent verstehen` läuft weiter (leere Suchliste, Anker unberührt), kein
   Absturz.
2. Mini-Testdatei mit drei Fällen gleichzeitig (`cat -n` vorab geprüft):
   Zeile 4 `unbekanntesfeld: bar` → „Warnung: … unbekanntes Feld
   \"unbekanntesfeld\" — ignoriert"; Zeile 9 ein Eintrag ohne `id` → Abbruch
   „catalog/intents.yaml:9 enthält einen Eintrag ohne 'id' …", Exit-Code 1;
   Zeile 15 `- hängendes-element-ohne-feld` ohne vorausgehendes offenes
   Listenfeld → „Warnung: … Listenelement ohne offenes Feld — ignoriert".
   Alle drei Zeilennummern stimmten exakt mit `cat -n` überein.
3. Gegen die echte, unveränderte `catalog/intents.yaml`: **keine** Warnung
   — das bestehende Format ist vollständig konform zum jetzt strengeren
   Parser.
Beide Testdateien lagen ausschliesslich im Scratchpad und wurden danach
gelöscht; `catalog/intents.yaml` wurde für diesen Fix nur per temporärem
Pfad-Override von `INTENTS_YAML` gelesen, nie geschrieben.

**Katalog.** `catalog/index.json` unverändert, kein `extract`/`update`
gelaufen. `catalog/intents.yaml` stammt aus dem parallelen M9-Auftrag, hier
weder angelegt noch inhaltlich verändert (nur für die Gegenprobe zu Fall 2
oben kurz überschrieben und zurückgespielt, siehe die Korrektur davor).

**Geprüft (nach Erstlieferung und erneut nach beiden Prüfauflagen-Fixes,
jeweils identisches Ergebnis).** `node --check tools/harness.mjs`; `lint
--all` (0 Befunde: 0 hoch, 0 mittel, 0 niedrig); `eval --no-save` (12 von 12
Pflichtfällen bestanden); alle Subcommands ausser `sync`/`update`/`extract`
(bewusst nicht ausgeführt) — `stats`, `search`, `show`, `install --dry-run`,
`uninstall --dry-run`, `list --to`, `bootstrap --to`, `knowledge`,
`knowledge --list`; `intent` (12 Einträge gelistet, keine Formatwarnung),
`intent verstehen` (3 Anker lösen auf), `intent pruefen` (`--type agent` auf
der ersten Query, 141 weitere + 3 Anker, isolierte Teilquery per `search
"code review" --type agent` mit 32 Treffern gegengeprüft), `intent
absichern` (`--domain security`), `intent rechtliches` (deutsche
Umlaut-Queries + `--domain legal-de` öffnet das Massen-Repo, 154 weitere + 3
Anker), `intent unbekannt-xyz` (Exit-Code 1, Liste der 12 gültigen ids); die
drei Randnotiz-Gegenproben oben.

## [2026-08-10] add | `search --quarantine`: alle Quarantäne-Einträge mit Grund auflisten, ohne neuen Subcommand

**Anlass.** Prüfer-Nebenbefund desselben Tages: kein Befehl listete alle
quarantänisierten Bausteine mit Grund — `cmdStats()` nannte nur die Zahl,
`search --all` fand sie nur über Namenstreffer. Bei Misstrauen gegen die
Quarantäne (ein False Positive war an diesem Tag bereits aufgetreten, siehe
Nachtrag zu `04-governance.md` weiter unten in diesem Protokoll) blieb nur ein
Wegwerf-Node-Skript direkt gegen `catalog/index.json`.

**Design-Entscheidung.** Kein neuer Subcommand, sondern ein Filter-Flag
`--quarantine` in `cmdSearch()` — dieselbe Form wie das schon vorhandene
`--all`, das Quarantäne-Einträge bereits *einblendet*; `--quarantine` blendet
stattdessen alles andere aus. Ein eigener Subcommand hätte die Suchfilter
(`--type`/`--domain`/`--repo`) neu verdrahten müssen, die `cmdSearch()` schon
kennt. Der neue Zweig steht vor dem Bulk-Filter und vor `bewerteTreffer()`:
die Description eines Quarantäne-Eintrags ist laut `quarantaeneGrund()` per
Definition unbrauchbar, ein Text-Score darauf wäre Zufall statt Auskunft —
deshalb ist keine Suchanfrage nötig. `--type`/`--domain`/`--repo` bleiben als
generische Eingrenzung nutzbar; `--all` und der Bulk-Filter werden
übersprungen, damit ein künftig quarantänisierter Bulk-Eintrag nicht doppelt
unsichtbar bliebe.

**Ausgabe.** Je Zeile Typ, ID, Grund (der Text aus `quarantaeneGrund()`),
sortiert nach ID. `node tools/harness.mjs search --quarantine` listete 8
Einträge — deckt sich mit der `cmdStats()`-Zeile „dazu 8 in Quarantäne".
USAGE-Block bei `search` ergänzt.

**Gegenprobe.** Ein bestehender Standard-Eintrag
(`affaan-m__ecc/agent/a11y-architect`) wurde testweise mit
`quarantaene = "TESTFALL-GEGENPROBE"` versehen (direkte Manipulation einer
Kopie von `catalog/index.json`, danach aus dem vorher gezogenen Backup
zurückkopiert; `git status --short catalog/index.json` bestätigt anschliessend:
keine Änderung). `search --quarantine` meldete ihn sofort (9 statt 8, korrekt
alphabetisch einsortiert), `cmdStats()` zog im selben Moment auf 9 mit — beide
Wege bestätigt konsistent, dann entfernt.

**Katalog.** Unverändert, kein `extract` nötig — die Änderung liest nur
`i.quarantaene`, ein seit M2 vorhandenes Katalogfeld.

**Geprüft.** `node --check tools/harness.mjs`; alle Subcommands ausser
`sync`/`update`/`extract`; `eval --no-save` (12 von 12 Pflichtfällen
bestanden); `lint --all` (0 Befunde).

## [2026-08-10] revise | Bestandszahl-Nachzug nach Block-Format-Erweiterung: `1.084` → `1.091` an fünf gemeldeten Stellen entschieden (aktualisiert oder `lint:historisch`), Quarantäne `15` → `8`, Nachtrag in `04` 3.2 und „Offene Folgeaufgabe" als erledigt markiert

**Quelle.** `lint --all` meldete nach dem Eintrag „`hookDescription()` liest
jetzt JSDoc/Blockkommentare …" (weiter unten) erwartungsgemäß 5 Befunde hoher
Schwere: `02-bausteine.md:226`, `03-vorbilder.md:245`, `04-governance.md:152`,
`05-erkenntnisse-aus-vorlesungen.md:446`, `LOG.md:303` — überall die durch die
Block-Format-Erweiterung überholte Zahl `1.084` gegen den jetzigen
Katalogwert `1.091` (`node tools/harness.mjs stats`: 25.642 gesamt, 1.091 im
Standardzugriff, 8 in Quarantäne). Auftrag: je Stelle im Kontext entscheiden,
nicht mechanisch ersetzen.

**Was geändert wurde, mit Begründung je Entscheidung.**

- `02-bausteine.md` Randbefund „vier vom Typ `mcp`" (Abschnitt 2.5):
  **aktualisiert** auf 1.091 mit Halbsatz zu 1.099 vor M2 / 1.084 direkt
  danach / 7 der 15 Quarantäne-Fälle seither zurück (Quarantäne 8) —
  Gegenwartsaussage, kein Datumsbezug. Gegengeprüft: `search "" --type mcp
  --all` liefert weiterhin 4 Treffer, die Erweiterung betraf ausschliesslich
  Hooks. Zusätzlich die von `lint` nicht gemeldete Nachbarstelle im Abschnitt
  „Quellen" (Zeile 469, dort steht bereits `<!-- lint:historisch -->`): der
  Verweis „siehe der Randbefund oben" zeigte sonst auf eine jetzt andere Zahl
  — Halbsatz ergänzt, Marker und der historische 1.099-Wert unverändert.
- `03-vorbilder.md` „Stand bei uns" (Teil D): **aktualisiert** auf 1.091 mit
  derselben Kette 1.099 → 1.084 → 1.091 — die Übernahme-Empfehlungen sind
  offene Arbeit, keine historische Momentaufnahme.
- `04-governance.md`: vier Stellen unterschieden. Abschnitt 2.4, Bullet
  „`general` (365 von 1.084 …)": **historisch markiert** — die 365 wurden
  nicht neu gezählt, `<!-- lint:historisch -->` mit Begründungssatz ergänzt,
  Zahl unverändert. Direkt darunter, Bullet „Ein Austausch bedeutet, …
  Bausteine neu zu klassifizieren": **aktualisiert** auf 1.091 — reine
  Gegenwartsaussage. Abschnitt 3.2, Nachtrag „Messung nach M2 und M3
  wiederholt": Ereignis-Sätze (was M2 damals quarantänisierte — 15 Fälle,
  13 leer + 2 Trennzeichen) unangetastet gelassen; neuer Satz „Weiterer
  Nachtrag" direkt davor ergänzt, der die Block-Format-Erweiterung nennt und
  die Präsens-Aussage auf 8 verbleibende Quarantäne-Fälle nachzieht;
  Schlusssatz „Standardzugriff insgesamt" von 1.084 auf 1.091 mit voller
  Kette aktualisiert. Absatz „Offene Folgeaufgabe" direkt danach: als
  **umgesetzt** markiert (Stand: im Arbeitsbaum, ungecommittet, in
  adversarialer Prüfung), weil genau die dort benannte Extractor-Erweiterung
  inzwischen erfolgt ist — sonst widerspräche sich der Abschnitt selbst
  („offen" direkt neben dem neuen „erledigt"-Satz eine Zeile darüber). Die
  M9-Zeile und die Kosten-Abschätzung unter „Wäre theoretisch schön" (beide
  Tabellenzeilen ohne Datumsbezug, von `lint` wegen Datei-weiter Dedup nicht
  gemeldet, aber als Bausteinzahl ebenso veraltet): **aktualisiert** auf
  1.091.
- `05-erkenntnisse-aus-vorlesungen.md`: Fundstelle 446 („Platte darf wachsen
  …") **aktualisiert** auf 1.091 mit der vollen Kette. Die von `lint` nicht
  gemeldete Nachbarstelle 390 („Was daraus folgt …", Abschnitt 1.7) trägt
  dieselbe Aussage ohne Datumsbezug — ebenfalls **aktualisiert**.
- `LOG.md:303` (bestehender Eintrag „M2 umgesetzt"): **nicht umgeschrieben**
  — Ereignisbeschreibungen werden nie verändert. Stattdessen
  `<!-- lint:historisch -->` samt Begründungssatz an die Überschriftszeile
  selbst angehängt (der einzige umschliessende Absatz einer einzeiligen
  Überschrift), mit Verweis auf diesen Eintrag.

**Prüfprotokoll.** `node tools/harness.mjs lint --all`: **0 Befunde** (0 hoch,
0 mittel, 0 niedrig), Katalog 0 Tage alt. `node tools/harness.mjs knowledge
"Standardzugriff nach Block-Format-Erweiterung aktueller Stand"` liefert
`LOG.md:303` (den neu markierten Eintrag) sowie `LOG.md:220`, `LOG.md:71` und
`LOG.md:683` als Treffer. Keine Datei unter `Learnings/` angefasst, keine
Baustein-ID verändert oder erfunden, `tools/harness.mjs` nicht angefasst.
Nicht committet.

## [2026-08-10] revise | `hookDescription()` liest jetzt JSDoc/Blockkommentare, Python-Docstrings und JSON-Top-Level-`description` — 7 Fälle aus der Quarantäne (15 → 8), 48 Hook-Descriptions verbessert, Standardzugriff jetzt 1.091 <!-- lint:historisch -->

**Quelle.** Die im Eintrag direkt darunter festgehaltene Folgeaufgabe aus der
Prüfauflage des `behauptungs-pruefer` (2026-08-10) und der Nachtrag „Offene
Folgeaufgabe" zu Abschnitt 3.2 in `04-governance.md`. <!-- lint:historisch -->
Die 1.091 in dieser Überschrift ist der Ergebnisstand genau dieses Eintrags vom
2026-08-10; LOG-Einträge dokumentieren den Stand ihres jeweiligen Tages und
dürfen nachträglich nicht umgeschrieben werden. Aktueller Bestand:
`node tools/harness.mjs stats`.

**Was geändert wurde.** In `tools/harness.mjs`: `hookDescription()` prüft vor
der bestehenden Zeilenkommentar-Suche zwei neue Orte, dahinter eine neue
Hilfsfunktion `leadingBlockDescription()`. Reihenfolge (Frontmatter greift im
Aufrufer weiterhin immer zuerst): (1) JSON-Top-Level-`description`, wenn der
Text mit `{` beginnt und parsebar ist — JSON kennt keine Kommentare, das Feld
ist der einzige Beschreibungsort einer `hooks.json`; (2) Blockkommentar/JSDoc
oder Python-Docstring, aber **nur am Dateianfang** (Shebang, BOM und
PEP-263-Encoding-Zeile dürfen davor stehen): erste inhaltstragende Zeile ohne
führende Sternchen, unter Auslassung von `@tags`, Linter-Pragmas, Lizenzköpfen
und reinen Trennzeilen (dieselbe `\p{L}{3}`-Schwelle wie `quarantaeneGrund()`);
(3) erster `#`/`//`-Zeilenkommentar wie bisher. Die Quarantäne-Kriterien in
`quarantaeneGrund()` blieben unberührt — die Fälle verlassen die Quarantäne,
weil sie jetzt eine Description haben.

**Vorrangs-Entscheidung, am Bestand belegt.** Block vor Zeilenkommentar, weil
Dateien, die per Docstring/JSDoc dokumentiert sind, ihren ersten
Zeilenkommentar tief im Rumpf tragen, wo er Abschnittstrenner ist, kein
Summary: `security_reminder_hook.py` trug „# Architecture", `diffstate.py`
„=====", `review_api.py` „-----". Die Dateianfangs-Beschränkung ist die
Konservativitäts-Garantie: vor einem Block am Dateianfang kann kein
Zeilenkommentar stehen, also verliert kein heute per führendem Zeilenkommentar
beschriebener Hook seine Description.

**Prüfprotokoll.** <!-- lint:historisch --> (die 1.084 unten ist der bewusst
zitierte Vorzustand dieser Änderung) `node --check` sauber; Katalog zweimal
per `extract` neu gebaut (einmal mit, einmal ohne Gegenprobe-Datei). Ergebnis:
25.642 Bausteine unverändert, Standardzugriff 1.084 → 1.091, Quarantäne
15 → 8 (verbleibend:
die beiden ecc-Dispatcher, `pretooluse-visible-output`,
`post-tool-use-auto-update.mjs` und vier `hooks.json` ohne
Top-Level-`description`). Alle 7 Zielfälle (`adapter`,
`design-quality-check`, `plan-canvas-sessions`, `diffstate`, `review-api`,
`codex-hooks`, offizielle `hook/hooks`) per `show` verifiziert: echte
Description, Quarantäne-Zeile weg. Vorher/Nachher-Diff aller 70
Hook-Descriptions: 48 geändert, jede einzelne vom Rumpf-Fragment zum
Datei-Summary (z. B. `desktop-notify` „continue" → „Desktop Notification Hook
(Stop)"), 22 unverändert, keine verschlechtert. Gegenprobe: eingeschleuste
Datei mit Anfangsblock aus nur `@ts-nocheck`, `eslint-disable`, `=====` und
Copyright-Zeile bekam korrekt den späteren Zeilenkommentar als Description —
der Filter verwirft Schrott-Blöcke, statt sie durchzureichen; Datei danach
entfernt, Klon sauber, finaler `extract` ohne sie. `eval --no-save`: alle
Pflichtfälle bestanden, alle Ränge identisch zu `evals/last-run.json` (7/467/
563/58) — plausibel, denn kein Eval-Fall zielt auf Hooks. `lint --all`: 5
Hoch-Befunde, alle erwartet — fünf Dateien tragen noch „1.084" als
Standardzugriffszahl; bewusst offen gelassen, Nachzug ist ein eigener Lauf.

**Quelle.** Auflage aus der heutigen Wiederholungsprüfung durch
`behauptungs-pruefer` (angenommen mit Auflage). Der Nachtrag zu Abschnitt 3.2
in `04-governance.md` (verfasst *vor* dem CRLF-Fix desselben Tages) behauptete
weiterhin 16 quarantänisierte Fälle (14 leer + 2 Trennzeichen, davon 15
nicht-bulk); nach dem Fix in `frontmatter()` (siehe Eintrag „CRLF-Bug in
`frontmatter()` behoben" weiter unten) ist einer davon —
`Klotzkette__claude-fuer-deutsches-recht/skill/rechtsmittelbelehrung-zivil` —
kein echter Leerfall mehr, sondern war ein CRLF-Artefakt und steht seither
regulär im Katalog. Der Nachtrag war seit dem Fix falsch, ohne dass ihn
jemand nachgezogen hatte.

**Was geändert wurde.** Drei Stellen in `04-governance.md`:

- Nachtrag zu Abschnitt 3.2 (bei „Nachtrag (2026-08-10): Messung nach M2 und
  M3 wiederholt"): „14 leeren und die 2 reinen Trennzeichen-Fälle (16
  insgesamt, davon 15 nicht-bulk)" korrigiert zu „13 leeren und die 2 reinen
  Trennzeichen-Fälle (15 insgesamt, alle nicht-bulk)"; „Von den ehemals 69"
  zu „Von den ursprünglich unroutbaren Descriptions" geglättet, weil die
  16-Fall-Zahl aus derselben Messung stammte und mit dem Fix nicht mehr zur
  69er-Ausgangszahl passt. Direkt im Anschluss ein neuer Satz, der den
  16. Fall benennt und auf den CRLF-Fix samt LOG-Eintrag verweist.
- Direkt darunter ein neuer Absatz „Offene Folgeaufgabe": ein Teil der
  verbliebenen 15 Quarantäne-Fälle trägt eine echte Beschreibung an Orten,
  die `hookDescription()` nicht liest — JSDoc-Blöcke (`adapter.js`,
  `design-quality-check.js`, `plan-canvas-sessions.js`), Python-Docstrings
  (`diffstate.py`, `review_api.py`), JSON-`description`-Felder
  (`codex-hooks.json`, mehrere `hooks.json`). Eine Extractor-Erweiterung um
  diese Orte würde die Quarantäne um genau diese Fälle leeren; bis dahin
  bewusst quarantänisiert statt mit abgeschnittenen Fragmenten sichtbar.
  Bisher undokumentiert — kommt aus derselben Prüfauflage.
- M2-Tabellenzeile in Abschnitt 6 („Massnahmen, priorisiert"): Ereignis
  darf weiterhin „16 Bausteine (14 leer, 2 nur Trennzeichen)" nennen — das
  war der Stand zum Umsetzungszeitpunkt —, bekommt aber einen Halbsatz, dass
  einer der 14 vermeintlich leeren Fälle ein CRLF-Artefakt war und seit dem
  Fix desselben Tages auf 15 Fälle (13 leer + 2 Trennzeichen) korrigiert ist,
  mit Verweis auf den Nachtrag zu 3.2.

Keine Bestandszahl sonst berührt: `stats` liefert weiterhin 1.084 im
Standardzugriff (der CRLF-Fix betraf ausschliesslich den Bulk-Fall) und
**15** in Quarantäne — das ist der Wert, gegen den diese Korrektur geprüft
wurde, nicht geschätzt.

**Prüfprotokoll.** `node tools/harness.mjs lint --all`: **0 Befunde** (vorher
und nachher — die Korrektur behebt einen inhaltlichen Fehler, den `lint`
prinzipbedingt nicht erkennt, siehe Warnung am Ende jeder `lint`-Ausgabe).
`node tools/harness.mjs stats`: 25.642 gesamt, 1.084 Standardzugriff, 15
Quarantäne — deckt sich mit den neuen Zahlen im Text. `node tools/harness.mjs
knowledge "quarantäne 16 fälle crlf"` liefert den korrigierten Nachtrag als
Treffer. Nicht committet.

## [2026-08-10] revise | CRLF-Bug in `frontmatter()` behoben: letztes Frontmatter-Feld ging bei Windows-Zeilenenden verloren — 24.327 Descriptions repariert, 1 Fehl-Quarantäne aufgehoben

**Quelle.** Adversarial belegt bei der M2-Prüfung am 2026-08-10: `frontmatter()`
schnitt den Block per `indexOf("\n---")`; bei CRLF-Dateien endete der Schnitt vor
dem `\n` des schliessenden Trenners, die letzte Zeile behielt ihr `\r`, und der
Zeilen-Regex (`.` matcht kein `\r`, kein m-Flag) verfehlte sie. Da `description`
in den Quell-Repos fast immer das letzte Feld ist, ging genau sie verloren — der
Baustein fiel in die Quarantäne (leer) oder bekam den `firstProse()`-Fallback.

**Was geändert wurde.** In `frontmatter()` wird jede Zeile vor dem Match von
ihrem trailing `\r` befreit (`split("\n")` + `replace(/\r$/, "")`); der
Block-Schnitt selbst war korrekt, weil das `\n` in `\r\n---` gefunden wird — das
steht jetzt als Warum-Kommentar an der Schleife. Im selben Lauf, vom Prüfer als
Teil der korrigierten Fassung verlangt: der Kommentar an `quarantaeneGrund()`
präzisiert, dass die CJK-Sicherheit von `\p{L}{3}` nur für Zeichen-Läufe ab drei
ohne Leerzeichen gilt — CJK aus Zweizeichen-Wörtern mit Leerzeichen fiele in die
Quarantäne. Katalog per `extract` neu gebaut.

**Gegenprobe.** Die `frontmatter()`-Funktion wurde aus der Datei geschnitten und
direkt getestet: die HEAD-Fassung verlor bei CRLF-Eingabe die description
(`{"name":"x"}`), ebenso bei gequoteten Werten; die neue Fassung liefert beide
Felder, LF-Eingaben und leeres Frontmatter unverändert. Der Testfall musste
melden und hat gemeldet; das Testscript lag im Scratchpad und ist entsorgt.

**Messwerte (Katalog-Diff vorher/nachher, programmatisch).** 24.327 Descriptions
geändert, davon 31 im Standardzugriff (deckt sich mit der Prüfmeldung „~31"),
Rest im Bulk-Repo Klotzkette. 1 Baustein verliess die Quarantäne
(`Klotzkette__claude-fuer-deutsches-recht/skill/rechtsmittelbelehrung-zivil`,
hat jetzt seine Frontmatter-Description und ist per `--repo`-Suche Treffer 1),
0 kamen hinzu. Belegte Beispiele: `anthropics__claude-plugins-official/command/commit`
„- Current git status: !git status" → „Create a git commit";
`anthropics__claude-plugins-official/skill/skill-creator` und
`anthropics__skills/skill/doc-coauthoring` zeigen statt der ersten Prosa-Zeile
die vollen Frontmatter-Descriptions mit „Use when …"-Triggerbedingungen;
`mattpocock__skills/skill/tdd` ebenso.

**Prüfprotokoll.** `node --check` ok; `stats`: 25.642 gesamt (unverändert),
1.084 im Standardzugriff (unverändert — der reparierte Quarantäne-Fall lag im
Bulk), 15 in Quarantäne (vorher 16, alle 15 nicht-bulk); `eval --no-save`:
12/12 Pflichtfälle bestanden, eine Rangverschiebung gegenüber dem Lauf von
11:45 (`affaan-m__ecc/skill/react-patterns` Rang 59 → 58 bei „react typescript
app with tests and deployment" — Folge der besseren Descriptions, kein
Pflichtfall betroffen); `lint --all`: 0 Befunde, die am selben Tag auf 1.084
nachgezogene Wissensbank bleibt konsistent. Jeder Subcommand einmal gelaufen
(ausser `sync`/`update`), `install`/`uninstall` nur `--dry-run` in einem
Wegwerf-Ordner. Nicht committet, `knowledge/` ausser diesem Eintrag unberührt.

## [2026-08-10] revise | Bestandszahl-Nachzug nach M2/M3: `1.099` → `1.084` an vier gemeldeten Stellen entschieden (aktualisiert oder `lint:historisch`), Nachtrag in `04` 3.2, M2/M3 als erledigt markiert

**Quelle.** `lint --all` meldete nach der M2-Quarantäne (Eintrag „M2 umgesetzt"
oben) vier Befunde hoher Schwere: `02-bausteine.md:226`, `03-vorbilder.md:245`,
`04-governance.md:43`, `05-erkenntnisse-aus-vorlesungen.md:446` — überall die
veraltete Zahl `1.099` (Standardzugriff vor M2) gegen den jetzigen Katalogwert
1.084. Auftrag: je Stelle im Kontext entscheiden, nicht mechanisch ersetzen.

**Was geändert wurde, mit Begründung je Entscheidung.**

- `02-bausteine.md` Randbefund „vier vom Typ `mcp`" (Abschnitt 2.5): **aktualisiert**
  auf 1.084 — Gegenwartsaussage über den laufenden Katalog, kein Datumsbezug.
  Gegengeprüft: `search "" --type mcp` und `--all` liefern beide unverändert 4
  Treffer, die Quarantäne betraf ausschliesslich Hooks. Die benachbarte Quellenzeile
  im selben Abschnitt „Geprüfte Bausteine" nennt explizit „Katalogstand
  2026-08-08 19:36" — **historisch markiert**, mit Verweis auf den aktualisierten
  Randbefund als aktuellen Stand.
- `03-vorbilder.md` „Stand bei uns" (Teil D, Einleitung der Übernahme-Empfehlung):
  **aktualisiert** auf 1.084 mit Halbsatz „nach der M2-Quarantäne … am
  2026-08-10" — die Übernahme-Empfehlungen Punkt 1–8 sind offene Arbeit, keine
  historische Momentaufnahme, der Satz beschreibt den laufenden Zustand.
- `04-governance.md`: **historisch markiert**, nicht aktualisiert — der
  Abstract selbst behauptet „69 der 70 Hooks tragen … ihre Shebang-Zeile", was
  nach M3 (`search "usr/bin/env"` → 0) nachweislich nicht mehr zutrifft; die
  gesamte Datei rechnet mit dem am 2026-08-08 19:36 eingefrorenen Katalogstand
  (Zeile 50 sagt das selbst). Abstract um einen Blockquote-Satz „Stand" ergänzt,
  der auf M2/M3 und den Nachtrag verweist, mit `<!-- lint:historisch -->`.
  Dieselbe Entscheidung für die „Nachgezählt …"-Messung in 3.2 (69/1.099) und
  die datierte `stats`-Zeile im Quellen-Abschnitt. Wo die Datei dagegen
  ungedatierte, weiterhin gültige Aussagen über den laufenden Bestand trifft
  (Abschnitt 2.4 „365 von …", „… Bausteine neu zu klassifizieren"; M9-Zeile;
  die Kosten-Abschätzung unter „Wäre theoretisch schön"), **aktualisiert** auf
  1.084 — diese Sätze hängen nicht an einem Messdatum.
- `05-erkenntnisse-aus-vorlesungen.md`: die Fundstelle 446 („Platte darf
  wachsen, Standardzugriff nicht — die 1.099 …") und die benachbarte, von
  `lint` nicht gemeldete Stelle 390 („Die 1.099 im Standardzugriff sind das
  Produkt …") sind beide **aktualisiert** — Positionsaussagen ohne Datumsbezug.
  Die dritte Stelle (264, „431+407+141+70+46+4 = 1.099") stand bereits vor
  dieser Änderung in einem mit `<!-- lint:historisch -->` markierten Absatz und
  blieb unverändert.

**Nachtrag in `04-governance.md` Abschnitt 3.2** („Das Ergebnis in Zahlen"):
die Messreihe (56 Shebang-Descriptions, 69 von 70 Hooks ohne routbare
Description, Katalogstand 2026-08-08 19:36) als Vor-M3-Zustand markiert
(`<!-- lint:historisch -->`, Begründung im selben Satz) und unverändert stehen
gelassen; direkt darunter ein neuer Absatz „Nachtrag (2026-08-10)": Messung
wiederholt — `search "usr/bin/env"` → 0 statt 56; die 14 leeren und 2
Trennzeichen-Fälle sind über M2 quarantänisiert (16 gesamt, 15 nicht-bulk —
gegen die in 3.2 selbst geäusserte Erwartung „~12" kein Widerspruch, siehe
Begründung im „M2 umgesetzt"-Eintrag oben); die verbliebenen
Fragment-Descriptions (`gitutil`, `llm`, `diffstate`, `review-api`,
`extensibility`, „# Architecture" u. ä.) bleiben bewusst sichtbar, ohne weiche
Heuristik. Standardzugriff insgesamt 1.084 statt 1.099. Nichts aus dem
Originaltext gelöscht.

**M2 und M3 als erledigt markiert.** In `04-governance.md`, Tabelle „Sollten
wir tun": beide Zeilen durchgestrichen, `**erledigt**`, mit Ein-Satz-Beleg
(Umsetzungsdatum, Messwert vorher/nachher, Verweis auf `knowledge/LOG.md`) im
Stil von M1/M6/M7/M10 in derselben Tabelle; die „Empfohlene Reihenfolge"
darunter auf „M9 → M11" verkürzt. Für `knowledge/06-massnahmen.md` galt der
Buchführungshinweis aus `04` — die IDs sind dort nicht identisch: geprüft per
Grep (`Quarantäne`, `Shebang`, `hookDescription`, `usr/bin/env`), keiner der
beiden Begriffe kommt in `06-massnahmen.md` unter einer eigenen Maßnahme vor.
`04`s M2/M3 sind dort schlicht nie dupliziert worden. Statt eine nicht
existierende Zeile zu erfinden, trägt `06-massnahmen.md` jetzt einen
Nachtrag im Buchführungsabsatz: M2/M3 aus `04` sind erledigt, ausschliesslich
dort gebucht, unter keiner `06`-ID zu finden.

**Prüfprotokoll.** `node tools/harness.mjs lint --all`: vorher 4 Befunde hoch,
nach den Textänderungen ein neuer Befund bei `04-governance.md`, Zeile der
M2-Tabellenzeile (das dort stehen gelassene „1.099 → 1.084" im selben Zug wie
der Beleg) — mit `<!-- lint:historisch -->` samt Begründungssatz versehen.
Danach: **0 Befunde** (0 hoch, 0 mittel, 0 niedrig), Katalog 0 Tage alt.
`node tools/harness.mjs knowledge "Standardzugriff nach M2 M3 aktueller
Stand"` liefert unter anderem `04-governance.md:227` „3.2 Das Ergebnis in
Zahlen" mit dem neuen Nachtrag im Treffer. Keine Datei unter `Learnings/`
angefasst, keine Baustein-ID verändert oder neu erfunden.

**Offen.** `06-massnahmen.md` Zeile 45 nennt weiterhin „IDs M1–M10" für
`04-governance.md`, obwohl die Tabelle dort inzwischen M1–M11 führt — vorbestehende
Abweichung, unter 100 und daher von `lint` nicht geprüft, nicht Teil dieses
Auftrags und hier unverändert gelassen.

## [2026-08-10] add | M2 umgesetzt: Quarantäne-Flag in `extract` — 16 Bausteine mit unbrauchbarer Description aus der Standardsuche genommen, Standardzugriff jetzt 1.084 <!-- lint:historisch --> (Stand unmittelbar nach M2, am selben Tag; eine spätere Erweiterung der Beschreibungs-Extraktion um JSDoc-Blöcke, Python-Docstrings und JSON-`description`-Felder gab 7 der hier quarantänisierten Bausteine ihre echte Beschreibung zurück — Standardzugriff seither 1.091, Quarantäne 8 statt 15, siehe LOG-Eintrag „Bestandszahl-Nachzug nach Block-Format-Erweiterung" weiter oben)

**Quelle.** Maßnahme M2 aus `04-governance.md` (Tabelle „Sollten wir tun"),
Folge von M3 (Eintrag darunter): nach der Shebang-Reparatur blieben Hooks
zurück, deren Description leer ist oder nur aus Trennzeichen besteht — als
Suchtreffer „(keine Beschreibung)" belegen sie Plätze, die niemand begründet
wählen kann.

**Was geändert wurde.** Neue Funktion `quarantaeneGrund()` in
`tools/harness.mjs`, angewendet in `cmdExtract()` analog zum bulk-Mechanismus:
der Grund wandert als Feld `quarantaene` in den Katalog. Nur zwei harte,
inhaltsfreie Kriterien — leere Description und kein Buchstaben-Lauf ab drei
Zeichen (`\p{L}{3}`, fängt `####`/`=====`/`-----`, lässt CJK durch). Fragmente
wie „continue", „gitutil", „# Architecture" bleiben bewusst sichtbar: dafür
gäbe es nur eine Geschmacks-Heuristik, und eine Fehlklassifikation in die
Quarantäne wiegt schwerer als ein sichtbarer Rausch-Eintrag.
Übersetzungs-Platzhalter (`isPlaceholder()`) erreichen den Katalog am Messtag
in null Fällen und werden deshalb nicht doppelt geprüft. `cmdSearch()` blendet
Quarantäne aus, nur `--all` zeigt sie — anders als bulk öffnen `--repo`/
`--domain` sie nicht mit; `sucheIds()` (eval) filtert genauso. `cmdShow()`
nennt den Grund und dass `install` weiter funktioniert. `cmdStats()` und die
`Stand:`-Zeile von INDEX.md zählen disjunkt (Standard + Massen-Repos +
Quarantäne = gesamt); `cmdLint()` definiert „Bausteine im Standardzugriff"
jetzt identisch zu `stats`. Katalog per `extract` neu gebaut, kein Pull.

**Die 16 IDs.** Leer (14): `affaan-m__ecc/hook/` adapter, codex-hooks,
design-quality-check, hooks, plan-canvas-sessions, post-bash-dispatcher,
pre-bash-dispatcher, pretooluse-visible-output;
`AgriciDaniel__claude-seo/hook/hooks`;
`anthropics__claude-plugins-official/hook/hooks`;
`Egonex-AI__Understand-Anything/hook/` hooks, post-tool-use-auto-update;
`mvanhorn__last30days-skill/hook/hooks`;
`Klotzkette__claude-fuer-deutsches-recht/skill/rechtsmittelbelehrung-zivil`
(einziger Bulk-Fall, war schon per Repo unsichtbar). Nur Trennzeichen (2):
`anthropics__claude-plugins-official/hook/` diffstate, review-api. 15 davon
nicht-bulk — gegen die Erwartung „~12" aus `04-governance.md` kein
Warnsignal: die dortige Messung stammt von vor M3, das die Leeren erst
sichtbar machte, und die 5 „Fragmente" von dort bleiben hier bewusst drin.

**Prüfprotokoll.** <!-- lint:historisch --> `node --check` ok. `stats`:
25.642 gesamt unverändert, Standardzugriff 1.099 → 1.084 (die 1.099 ist der
absichtlich zitierte Vorher-Stand), neue Zeile „dazu 15 in Quarantäne" mit
Erklärsatz. `search "" --type hook`: 55 Treffer ohne Quarantänefälle, mit
`--all` 70 inklusive; `--repo affaan-m__ecc` zeigt adapter weiterhin nicht.
`show` löst diffstate und adapter auf und nennt den Grund; `install --dry-run`
auf diffstate funktioniert. `eval --no-save`: 12 von 12 Pflichtfällen
bestanden, null Rangverschiebungen gegen `last-run.json` („2 von 7 Schwächen
behoben" stand schon im Vergleichsstand von M3, nicht Folge dieser Änderung).
Gegenprobe: temporärer Direkttest mit zwölf Fällen (7× MUSS: leer,
Whitespace, `####`, `=====`, `------------`, `- - -`, „ab 12"; 5× DARF NICHT:
„continue", „gitutil", „# Architecture", CJK-Satz, „=== Review API ==="),
alle korrekt, Testblock wieder entfernt. Alle Subcommands einmal gelaufen
außer `sync`/`update` (pullen — vom Auftrag ausgeschlossen).

**Offen.** `lint` meldet jetzt erwartungsgemäß vier Stellen mit `1.099`
(`02-bausteine.md`, `03-vorbilder.md`, `04-governance.md`,
`05-erkenntnisse-aus-vorlesungen.md`) als veraltet gegen 1.084 — der Nachzug
der Wissensbank-Zahlen ist die angekündigte Folgeaufgabe, hier bewusst nichts
an `knowledge/` geändert. INDEX.md lag schon vor dieser Änderung mit 101
Zeilen über dem „unter hundert"-Budget aus `writeMarkdownIndexes()`; der
Quarantäne-Abschnitt ist auf zwei Textzeilen gekürzt (jetzt 106) — das Budget
selbst braucht eine eigene Entscheidung.

## [2026-08-10] revise | M3 umgesetzt: `hookDescription()` überspringt Shebang-Zeilen — 56 „usr/bin/env"-Descriptions auf 0, Katalog per `extract` neu gebaut

**Quelle.** Maßnahme M3 aus `04-governance.md` (Tabelle „Sollten wir tun"),
Befund dort in Abschnitt 3.2, gemessen am Katalogstand 2026-08-08 19:36:
`hookDescription()` nahm den ersten Kommentar der Datei als Description — bei
Skripten die Shebang. 56 Hooks führten `!/usr/bin/env …` als Beschreibung,
einer `!/bin/bash`, keine davon routbar.

**Was geändert wurde.** `hookDescription()` in `tools/harness.mjs` iteriert
jetzt über alle Kommentarzeilen (`#`- und `//`-Stil wie bisher), überspringt
`#!`-Zeilen und liefert den ersten echten Kommentar; findet sich keiner, `null`
statt der Shebang — eine leere Description ist ehrlicher und wird von M2
(Quarantäne) behandelt, nicht hier. `# !kein-Shebang` (mit Leerzeichen) bleibt
absichtlich gültig: nur die Shebang-Syntax `#!` wird ausgeschlossen. Danach
Katalog aus den **vorhandenen** Klonen per `extract` neu gebaut — bewusst kein
`sync`/`update`, ein Pull hätte den Mess-Katalog verschoben.

**Prüfprotokoll.** `node --check` ok. `search "usr/bin/env"`: vorher 56
Treffer, nachher 0. Stichprobe per `show`:
`anthropics__claude-plugins-official/hook/stop-hook` „!/bin/bash" → „Ralph
Loop Stop Hook" (und über `search "ralph loop stop"` jetzt Treffer 1);
`affaan-m__ecc/hook/adapter` „!/usr/bin/env node" → leer (Header ist
`/** */`-Block, den die Funktion nie konnte — M2-Fall);
`anthropics__claude-plugins-official/hook/security-reminder-hook`
„!/usr/bin/env python3" → „# Architecture" (Fragment aus dem Python-Docstring —
M2-Fall). `stats` unverändert 25.642 gesamt / 1.099 Standardzugriff / 70 Hooks.
`eval`: alle Pflichtfälle bestanden, `last-run.json`-Drift nur Zeitstempel,
null Rangverschiebungen. `lint`: 0 Befunde. Gegenprobe: temporärer
Direkttest mit fünf Fällen eingeschleust (Shebang+Kommentar, Shebang ohne
Kommentar, Kommentar ohne Shebang, nur Shebang, `# !`-mit-Abstand), alle wie
erwartet gemeldet, Testblock wieder entfernt. Alle Subcommands einmal
gelaufen außer `sync`/`update` (pullen — vom Auftrag ausgeschlossen).

**Offen.** Die Description-Messung in `04-governance.md` 3.2 (56/69) beschreibt
jetzt den Zustand **vor** M3 und wird von einer späteren Aufgabe nachgezogen —
`lint` schlägt darauf nicht an, weil er Bestandszahlen prüft, nicht diese
Messreihe. M2 (Quarantäne unbrauchbarer Descriptions: leere, Fragmente wie
„# Architecture", `gitutil`, `llm`, `diffstate`) bleibt eigene Maßnahme.

## [2026-08-10] revise | `recipes/README.md` Punkt 2: besetzte Rolle zählt wie fehlendes Symptom — eigener Fremd-Harness-Abschnitt geprüft und abgelehnt

**Quelle.** `behauptungs-pruefer`-Lauf am 2026-08-10 gegen einen vorgeschlagenen
neuen README-Abschnitt „Wenn das Zielprojekt schon ein Harness hat" — Reaktion
auf den Dropfolio-Lauf (Eintrag direkt unten: fremdes Projekt mit eigenem
vollständigem Harness, 22 Agenten, 9 Hooks, 6 Skills). Der Prüfer lehnte den
vorgeschlagenen Abschnitt als Ganzes ab und benannte einen einzelnen Satz als
einzig tragfähigen Kern.

**Was vorher galt.** `recipes/README.md`, Abschnitt „Ein Rezept ist ein
Startpunkt, kein Dogma", Punkt 2 verlangte Kürzung nach Symptom („Wenn du für
einen Baustein das Symptom nicht benennen kannst, fliegt er raus"), nannte aber
nicht, dass eine vom Zielprojekt bereits selbst besetzte Rolle ebenfalls zum
Ausschluss führt — ein Kern-Set-Baustein, für den es zwar ein Symptom gibt, das
Projekt aber schon eine eigene Antwort darauf hat (Dropfolio: eigener Agent,
eigener Hook oder eigene Prozessregel statt des Katalog-Bausteins), blieb
ungeregelt.

**Was jetzt gilt.** Punkt 2 trägt jetzt einen Satz mehr: „Eine Rolle, die das
Projekt schon selbst besetzt — eigener Agent, eigener Hook, eigene
Prozessregel —, zählt dabei wie ein fehlendes Symptom: der Kern-Set-Baustein
fliegt raus." mit Verweis auf den Dropfolio-Lauf 2026-08-10 als ersten Beleg.

**Abgelehnt: eigener README-Abschnitt „Wenn das Zielprojekt schon ein
Harness hat" mit vier Regeln (Bestandsaufnahme / keine Hooks / keine Agenten /
Kern-Sets nicht anwenden).** Gründe, jeweils am laufenden System bzw. gegen
bestehende Dateien geprüft: (a) Punkt 1 (Bestandsaufnahme) dopplt
`harness-build/SKILL.md` Schritt 1, Punkt 4 (Kern-Sets nicht anwenden) dopplt
den bereits bestehenden Punkt 2 dieser Datei; (b) die Pauschalverbote „keine
Hooks" / „keine Agenten" ersetzen die am 2026-08-08 beschlossene
**Einzelfallprüfung** der Schutz-Hooks (Eintrag „Kern-Set-Befund entschieden",
weiter unten in dieser Datei) durch eine pauschale Projektkategorie — exakt die
Ersetzung eines Pflicht-Allsatzes durch einen Verbots-Allsatz, die am
2026-08-08 bereits verworfen wurde; (c) die im Vorschlag genannte Begründung
„fremde Hooks können bestehende Gates lautlos aushebeln" ist am CLI widerlegt:
Bausteine werden inaktiv installiert, `install` schreibt nie in
`settings.json`, Namenskollisionen brechen den Lauf ab statt still zu
überschreiben; (d) der Vorschlag verallgemeinerte aus einem einzigen Lauf
(n=1, Dropfolio) auf eine ganze Projektkategorie „Zielprojekt hat schon ein
Harness". Der eine tragfähige Kern — besetzte Rolle zählt wie fehlendes
Symptom — ist in Punkt 2 eingearbeitet, nicht als eigener Abschnitt
danebengesetzt.

## [2026-08-10] revise | Erster echter `/harness-build`-Lauf (Dropfolio): Eval-Fall „tests schreiben" gegen neu belegte Flexions-Lücke „werbeaussage pruefen" getauscht

**Quelle.** Erster Praxis-Lauf von `/harness-build` gegen ein fremdes Projekt
(„Dropfolio", Next.js/TypeScript-SaaS mit eigenem vollständigem Harness: 22
Agenten, 9 Hooks, 6 Skills), adversarial geprüft durch einen
`behauptungs-pruefer`-Lauf am 2026-08-10; alle Trefferzahlen und IDs beim
Einpflegen erneut am laufenden System verifiziert (`search`, `show`, `eval`,
`lint`). Ergebnis des Laufs: 8 Bausteine installiert (7 legal-de-Skills für
DSGVO/AGB/UWG plus `affaan-m__ecc/skill/security-scan`), alle `[aktiv]`, die
Lückenliste in `sources.txt` blieb leer — der Bestand hat gereicht.

**Was vorher galt.** `evals/routing.jsonl` führte für die Rubrik
„Deutsche Anfrage auf englischen Bestand" den Fall
`{"frage":"tests schreiben",…}`. Der Prüfer belegte, dass er nur durch das
englisch-deutsche Homonym „tests" grün war (123 Teiltreffer, „schreiben" nicht
im Bestand) — er mass die Sprachgrenze nicht. „sicherheit prüfen" bleibt als
echter Messfall der Rubrik stehen.

**Was jetzt gilt.** An seiner Stelle steht `{"frage":"werbeaussage pruefen",
"domaene":"legal-de","erwartet":["Klotzkette__claude-fuer-deutsches-recht/skill/werbeaussagen-pruefung"],…}`
mit einer im Lauf neu belegten Schwäche: der **Flexions-Lücke**. Der
wortgleiche Skill existiert, wird aber nicht gefunden, weil „pruefen" per
Wortanfangs-Matching nicht „pruefung" matcht; die UND-Suche fällt auf 640
ODER-Teiltreffer zurück (erwartete ID auf Rang 563), während „werbeaussage
pruefung" genau 1 Treffer liefert. Vollzogen und verifiziert: `eval` 12/12,
`lint` 0. Wichtig für die Prüfpflicht: Der **erste** Tausch-Vorschlag
(erwartet=`uwg-irrefuehrung-verbraucherbezug`, Diagnose „Vokabular-Lücke")
wurde vom `behauptungs-pruefer` abgelehnt und korrigiert — die Diagnose war
falsch, und die ursprünglich vorgeschlagene ID teilt kein Wort mit der
Anfrage, ist lexikalisch unerreichbar und hätte die Verbesserung dauerhaft
verdeckt. Die Prüfpflicht trägt also auch bei Eval-Fällen.

**Zwei Nebenbefunde, ohne Eval-Änderung.** (1) Zweiter Flut-Beleg für die
bekannte ODER-Fallback-Schwäche, erstmals im Massen-Repo: `search "agb
pruefung klauseln" --domain legal-de` → 1084 Treffer (der bestehende Fall z29
„react typescript app…" misst dasselbe mit 844/251 Treffern im
Standardbestand). Kein neuer Eval-Fall — gleiche Wurzel, wäre redundant. Als
Praxis-Beleg für die wartende IDF-Massnahme festgehalten: Deren Auslöser
verlangt laut Beschluss vom 2026-08-08 einen belegten **Pflichtfall**; dieser
Beleg ist ein optionaler Praxisfall, der Auslöser ist damit **nicht** erfüllt,
nur gestärkt. (2) Bei Duplikat-/Nachbar-Skills im legal-de-Repo entscheidet
der Fachkontext des Plugin-Ordners mit: `datenschutz-betroffenenrechte-auskunft-loeschung-weg`
stammt aus `weg-hausverwaltung/` und ist mietrechtskontaminiert;
`werbeaussagen-pruefung` stammt aus `produktrecht/` und trägt GPSR/CE-Ballast
— für das SaaS-Projekt wurde der fokussierte `uwg-irrefuehrung-verbraucherbezug`
gewählt, obwohl `werbeaussagen-pruefung` der bessere Suchtreffer wäre.
Auffindbarkeits-Sieger ≠ Inhalts-Sieger.

## [2026-08-08] revise | `04-governance.md` 3.5: Duplikat-Familien offiziell/ecc — sieben Paare per `show` verglichen, Auswahlregel präzisiert, Vertrauenszeile richtiggestellt

**Quelle.** Adversarial geprüfte Urteile aus dem Workflow-Lauf (Task
`w3da4z86w`, `result.abgelehnteVorschlaege`); alle 14 Fassungen (7 Paare) am
laufenden System per `show` nachvollzogen, die Kontaminationszitate
(`constants/errorIds.ts`/Sentry; „Apply Project Standards … from CLAUDE.md",
„autonomously and proactively") per `show <id> --lines 300` verifiziert.

**Was vorher galt.** Die Vertrauenszeile von `affaan-m__ecc` in `sources.txt`
(seit heute früh) nannte den Ableitungsbefund, ließ aber bei „code-simplifier
mit fremden Projektregeln kontaminiert" offen, welche Fassung gemeint ist — im
Satzkontext der ecc-Zeile las es sich als ecc-Befund. Per `show` belegt ist das
Gegenteil: die **offizielle** Fassung trägt die TS/React-Regeln als „established
coding standards from CLAUDE.md", die ecc-Ableitung ist generisch; dasselbe
Muster beim `silent-failure-hunter` (Original fragt nach `errorIds.ts` für
Sentry). Auch der Auftragstext dieses Laufs trug die falsche Richtung — bemerkt
durch die angeordnete Gegenprüfung per `show` vor dem Schreiben. Einen
Abschnitt zur Duplikat-Frage gab es in der Wissensbank nicht; die Erkenntnisse
lagen nur in der Task-Output-Datei.

**Was jetzt gilt.** `knowledge/04-governance.md` trägt Abschnitt 3.5
„Duplikat-Familien: Ableitungen erkennen und das Original vorziehen": die
sieben Namensvettern-Paare als Tabelle mit KB beider Fassungen und Befund
(sechs Ableitungen, `code-reviewer` als eigenständiger Namensvetter
abgegrenzt); die Präzisierung der Auswahlregel aus `sources.txt` in beide
Richtungen — Original gegen verlustbehaftete Kopie ist **kein** Gleichstand,
und „offiziell" schützt nicht vor Projekt-Kontamination, zwei der sieben
Originale tragen fremde Projektregeln. Dazu die drei betroffenen ecc-IDs in
Rezepten als Tauschkandidaten-Liste: zwei offen (`silent-failure-hunter` in
02/Erweiterung, `code-reviewer` in 06/Erweiterung), einer bereits entschieden
(`code-explorer`, Kern-Set 06 — Tausch heute adversarial geprüft und
abgelehnt). **Keine Rezept-Änderung in diesem Lauf**; jeder Tausch braucht
erst eine Einzelprüfung wie beim `legacy-analyst`-Tausch (Eintrag weiter
unten). Die `sources.txt`-Vertrauenszeile ist auf die belegte Richtung
präzisiert und verweist auf 3.5; die Frontmatter von `04` führt die Sichtung
als Quelle. Die Auftrags-Prämisse „`code-reviewer` steht in Rezept 01/02"
bestätigte sich nicht — per Grep steht er nur in 06, Erweiterung.

## [2026-08-08] ingest | `08-pruefbarkeit-und-pruefdaten.md` Abschnitt 1: Das offizielle Setup-Plugin als externer Beleg für Readiness-über-Existenz

**Quelle.** Adversarial geprüfte Erkenntnisse zum offiziellen Setup-Plugin aus
dem Workflow-Lauf (Task `w3da4z86w`, `result.setupPlugin.erkenntnisse`, Befund
„Frage 3 — Schwachpunkt der Signal-Logik"); die Baustein-ID
`anthropics__claude-plugins-official/skill/claude-automation-recommender` am
laufenden System per `show` verifiziert (Vertrauen offiziell, Plugin
`claude-code-setup`, 179K Installs laut Aufnahmevermerk).

**Was gewachsen ist.** Abschnitt 1 trägt jetzt den extern belegten Fall: Das
offizielle Setup-Plugin bestimmt Automatisierungs-Empfehlungen ausschließlich
über Datei-Existenz (`ls`/`cat`/`grep` auf Configs; „Tests directory exists |
PostToolUse: run related tests" genügt für einen Test-Hook) und führt in
keiner Phase eine Prüfschleife aus — der Mainstream misst Readiness über
Vorhandensein, nicht über „läuft und ist grün". Genau die Lücke, die Kapitel 8
begründet; `harness-build` Schritt 1b ist an dieser Stelle strenger als das
offizielle Werkzeug und bleibt unverändert. Geltungsbereich benannt
(dokumentierter Einzelfall; Signal-Logik, nicht Empfehlungsinhalte) und gegen
`knowledge/02` Abschnitt 2.4 abgegrenzt, wo derselbe Baustein die
Hook-Kopplungs-Seite belegt.

**Nebenher nachgezogen.** Der Absatz „Was uns das betrifft" in Abschnitt 1
führte die Prüfdichte-Erhebung noch als offene Maßnahme; `knowledge/06` M13
ist erledigt und `harness-build` Schritt 1b existiert — der Absatz spiegelt
jetzt diesen Stand. Der Vorspann-Satz über Zitate präzisiert auf „Zitate aus
den fünf Vorträgen", weil Abschnitt 1 nun zusätzlich aus einer SKILL.md
zitiert. Frontmatter der Datei um den Baustein als Quelle ergänzt.

## [2026-08-08] revise | Rezept 06: Kern-Set-Tausch auf `legacy-analyst`, drei Erweiterungszeilen, zwei widerlegte Weglass-Begründungen korrigiert

**Quelle.** Adversarial geprüfte Urteile aus dem Workflow-Lauf (Task
`w3da4z86w`, `result.gepruefteVorschlaege` und `result.abgelehnteVorschlaege`);
jede geschriebene ID am laufenden System per `show` verifiziert.

**Was vorher galt, was jetzt gilt** (`recipes/06-legacy-onboarding.md`):

1. **Kern-Set-Tausch.** `msitarzewski__agency-agents/agent/codebase-onboarding-engineer`
   (9 KB) raus, `anthropics__claude-plugins-official/agent/legacy-analyst` (4 KB)
   rein — der Alte verbietet Inferenz komplett („Avoid inference, assumptions,
   and speculation completely"), was bei undokumentierter Basis still verletzt
   wird (Doktrin 3.5); der Neue macht Inferenz sichtbar (Pflicht-`file:line`,
   „is" vs. „appears to be", Confidence-&-Gaps-Footer). Nachgezogen:
   Installationsbefehl, Reihenfolge Schritt 1, Summenzeile jetzt 31 KB (vorher
   „rund 36 KB"); der Getauschte steht mit Grund unter „Bewusst weggelassen".
2. **Drei Erweiterungszeilen neu:** `test-engineer` (3 KB, vor
   `refactor-cleaner`, füllt den leeren Verifikationspfad, Rewrite-Vorbehalte
   dokumentiert; dazu neuer Reihenfolge-Schritt 5), `business-rules-extractor`
   (4 KB, Fachabnahme durch SMEs, kein `Write`-Tool — Persistenz via `handoff`
   zwingend), `architecture-critic` (3 KB, nur bei Umbau/Neuentwurf,
   `code-reviewer` bleibt daneben stehen).
3. **Zwei widerlegte Begründungen korrigiert:** `affaan-m__ecc/skill/codebase-onboarding`
   ist 8 KB und englisch, nicht „2 KB, ausschliesslich japanisch"; die fünf
   Skills der Sammelzeile lösen als englische Skills unter `skills/` auf, nicht
   unter `docs/ja-JP/…` — bemerkt durch die adversariale Prüfung per `show`,
   Ursache mutmasslich ein Katalog-`update` nach dem Schreiben des Rezepts.
4. **Zwei Ablehnungen dokumentiert:** `scaffolder` (an
   `modernize-reimagine`-Blueprints gekoppelt, solo funktionslos) und der
   offizielle `code-explorer` (Duplikat des Bestands mit breiterem Tool-Set
   inkl. Netzzugriff) unter „Bewusst weggelassen".

## [2026-08-08] ingest | `02-bausteine.md`: Offizieller Zweitbeleg für die Hook-Regel und der Kontrast Kategorie-Quote gegen Problem-Anker

**Quelle.** Adversarial geprüfte Erkenntnisse zum offiziellen Setup-Plugin aus
dem Workflow-Lauf (Task `w3da4z86w`, `result.setupPlugin.erkenntnisse`); die
Baustein-ID `anthropics__claude-plugins-official/skill/claude-automation-recommender`
am laufenden System per `show` verifiziert (Vertrauen offiziell, Plugin
`claude-code-setup`, 179K Installs).

**Was gewachsen ist.** Zwei Stellen in `knowledge/02-bausteine.md`:

1. Abschnitt 2.4 (Hook) trägt die Regel „Ein Hook führt eine Prüfung aus, er
   erzeugt keine" jetzt mit offiziellem Zweitbeleg: Die Hook-Empfehlungstabelle
   des Setup-Plugins koppelt jeden empfohlenen `PostToolUse`-Hook an ein
   bereits konfiguriertes Werkzeug („Prettier configured | PostToolUse:
   auto-format on edit", „Tests directory exists | PostToolUse: run related
   tests"; SKILL.md, Phase 2). Geltungsbereich benannt: Der Beleg deckt die
   `PostToolUse`-Zeilen und bestätigt nur die Kopplung, nicht die Härte — das
   Plugin misst Existenz per `ls`/`cat`/`grep`, nie ob das Werkzeug läuft;
   „vorhanden" gegen „läuft und ist grün" bleibt die strengere eigene Regel
   (`knowledge/06`, M13).
2. Neuer Fehlerfall 7.8 „Umfang per Kategorie-Quote gedeckelt statt per
   Problem-Anker": Die Quote des Setup-Plugins („top 1-2 … per category",
   doppelt im Baustein belegt) gegen den Schmerzpunkt-Anker aus
   `harness-build` Schritt 5 (jede Zeile nennt eine Schmerzpunkt-Nummer;
   „Eine leere Liste ist ein gültiges Ergebnis"). Kernsatz: Eine Quote je
   Kategorie lädt ein, jede Kategorie zu füllen; ein Problem-Anker lässt
   Kategorien leer.

Frontmatter und Quellenliste der Datei um den Baustein als Quelle ergänzt.

## [2026-08-08] revise | Rezept 04: `security-auditor` als bedingte Erweiterung, claude-security-Verbund als Sammelablehnung

**Quelle.** Adversarial geprüfte Urteile aus dem Workflow-Lauf (Task
`w3da4z86w`); alle fünf IDs am laufenden System per `show` verifiziert.

**Was jetzt gilt.** `recipes/04-security-audit-pentest.md` führt
`anthropics__claude-plugins-official/agent/security-auditor` (5 KB, Vertrauen
offiziell, standalone aus dem Plugin `code-modernization`) als
Erweiterungszeile — Bedingung: der Prüfbericht geht an Dritte (Deck, Ticket,
committetes Markdown) oder das Prüfobjekt kann instruction-shaped Inhalte
enthalten. Differenzierer sind die verpflichtende Secret-Redaktion im Report
und die Untrusted-Content-Disziplin, die dem statischen Kern-Prüfer
`affaan-m__ecc/agent/security-reviewer` fehlen; die Redaktionsregel des
`secrets-credential-hygiene-engineer` deckt den Secret-Lebenszyklus ab, nicht
den Prüfbericht. Kein Kern-Tausch — der statische Slot bleibt besetzt. Die
Zeile benennt zudem die Spannung zwischen seiner Severity-Regel und dem
Herabstufungs-Verbot (Doktrin 4.3) und löst sie auf: verboten ist Kleinreden
trotz Beleg, nicht Einstufung nach Beweislage.

**Bewusst nicht getan.** Unter „Bewusst weggelassen" eine Sammelzeile für
`anthropics__claude-plugins-official/agent/claude-security` samt
`scan-inventory`, `scan-researcher` und `scan-verifier`: per `show` belegt
aneinander gekoppelt ("not for direct invocation", Dispatch-Parameter wie
`SCAN_ROOT`, `${CLAUDE_PLUGIN_ROOT}`-Referenzen) — einzeln installiert tot,
nur als Gesamtworkflow sinnvoll, der weder dynamisch ausführt wie Strix noch
die lesende Beschränkung (4.2) einhält. Mit dem Vermerk, dass das
Voting-Muster des `scan-verifier`
(`anthropics__claude-plugins-official/agent/scan-verifier`) die hauseigene
Prüfdoktrin — Standardhaltung „ablehnen", Beleg mit file:line, Auszählung
ausserhalb jedes Modells — von offizieller Seite bestätigt.

## [2026-08-08] ingest | Rezept 02: `pr-test-analyzer` (offiziell) als Erweiterung — nur dort, Sekundärempfehlungen 01/03 vom Prüfer gestrichen

**Quelle.** Adversarial geprüfter Befund (Urteil `aufnehmen_mit_aenderung`,
Prüflauf 2026-08-08); Baustein per `show` verifiziert:
`anthropics__claude-plugins-official/agent/pr-test-analyzer`, 5 KB, 1 Datei,
Vertrauen offiziell, model inherit.

**Was gewachsen ist.** `recipes/02-backend-api.md`, Tabelle „Erweiterung
(optional)": neue Zeile mit Bedingung „nur wenn PRs der Arbeitsmodus sind
**und** eine Test-Suite den Verifikationspfad trägt" (diff-/PR-zentriert,
`git diff` und `gh` vorausgesetzt), Abgrenzung zum Kern-Set (`api-tester`
prüft Laufzeitverhalten, dieser Agent verhaltensbezogene Testabdeckung —
ergänzt ein Coverage-Gate dort, wo Zeilenabdeckung grün ist,
Verhaltensabdeckung aber fehlt) und dem Hinweis, dass der Agent aus dem
Plugin `pr-review-toolkit` stammt, einzeln funktionsfähig ist und der
dispatchende `command/review-pr` bewusst nicht mitinstalliert wird.
Quellenzeile `harness-katalog` im Frontmatter auf 2026-08-08 nachgezogen.

**Bewusst nicht getan.** Die im Sichtungsvorschlag genannten
Sekundäraufnahmen in Rezept 01 und 03 hat der Prüfer gestrichen: In 01
kollidiert die Zeile ohne Abgrenzung mit der bestehenden Erweiterung
`affaan-m__ecc/command/react-test` (benachbartes Symptom), in 03 ist der
PR-Arbeitsmodus untypisch und `python-testing` deckt das Testfeld als
Skill. Die katalogseitige Kurzfassung `affaan-m__ecc/agent/pr-test-analyzer`
(2 KB) bleibt draussen — per `show`-Vergleich als verlustbehaftete
Zusammenfassung des offiziellen 5-KB-Originals belegt (ohne
Rating-Leitplanken und Brittle-Test-Heuristik).

## [2026-08-08] revise | Nach dem `update` um 19:36 nachgezogen — Bestandszahlen in fünf Dateien auf 25.642/1.099, die Description-Messung aus `04` 3.2 wiederholt, das 14. Repo dokumentiert

**Was vorher galt.** `lint` meldete nach dem `update` vom 2026-08-08 19:36 **8 Befunde
hoher Schwere**: veraltete Bestandszahlen in `knowledge/02` (2), `03` (2), `04` (1)
und `05` (3). Nachher: **0 Befunde**, `lint --all` ebenfalls 0, Exit-Code 0. Die
tatsächliche Stellenzahl war höher als acht: `lint` meldet jede abweichende Zahl nur
**einmal je Datei** (`gesehen.add(zahl)` in `cmdLint`) — nachgezogen wurden alle
Vorkommen, sonst wäre beim nächsten Lauf die jeweils nächste Stelle nachgerückt.
Kein neuer `lint:historisch`-Marker wurde gesetzt; jede geänderte Stelle ist eine
Aussage über den heutigen Bestand oder eine am System wiederholte Messung.

**Was sich am Bestand geändert hat.** Das `update` nahm `anthropics__claude-plugins-official`
auf (Vertrauen: **offiziell** — offizielles Plugin-Verzeichnis von Anthropic;
aufgenommen 2026-08-08 auf Zuruf des Besitzers, so die Vertrauenszeile in
`sources.txt`; **143 Bausteine**, Aufnahmekriterium 2 erfüllt: Bestand nach dem
ersten `extract` grösser als null, und `lint` meldet kein Repo ohne Katalogeintrag).
Gesamtbestand **25.499 → 25.642**, Standardzugriff **956 → 1.099**, Repos **13 → 14**.
Typen im Standardzugriff (`INDEX.md`): Skills **404 → 431**, Agents **375 → 407**,
Commands **112 → 141**, Hooks **56 → 70**, Plugins **6 → 46**, MCP **3 → 4**; Skills
gesamt (`stats`) **24.702 → 24.729**. `Klotzkette` unverändert 24.543.
<!-- lint:historisch --> Die jeweils linke Zahl ist der Altwert vom Katalogstand
2026-08-07 18:27 und steht hier absichtlich: ohne das Vorher ist eine Korrektur nicht
dokumentiert. Verbindlich ist die rechte Zahl, Katalogstand 2026-08-08 19:36.

**Welche Zahlen nachgezogen wurden.** Aktualisiert, weil sie eine Aussage über den
**heutigen** Bestand sind: `02` (mcp-Randbefund drei → vier von 1.099, Quellenzeile
samt Katalogstand und Typ-Aufschlüsselung), `03` (Stand-Absatz mit Repo-Zahl,
Massen-Repo-Anteil, Herkunftssatz in Teil E), `04` (Abstract, Datierungszeile,
Regime-Tabelle, Trefferzahl-Absatz, Domänen-Urteil, Drift-Tabelle, Hygiene-Block,
M9, „Wäre theoretisch schön", Quellenverzeichnis, Frontmatter-Quellzeile), `05`
(Skill-gegen-Hook-Vergleich 24.702 → 24.729 samt 70 Hooks und 4 MCP, Listing-Grösse,
Extract-über-alle-Repos, sync-Meldebeispiel, Nachrechnung der drei Zugriffsebenen
neu am Stand 19:36 — `catalog/by-repo.md` per Summenprobe auf 25.642 geprüft —,
Vertrauensstufen-Absatz, Produkt-Absatz, Generik-Bias, Platte-gegen-Standardzugriff),
`06` (Bestandseffekt 522 von 956 → 522 von 1.099, zweimal „keines der 13 Repos" → 14).
Der Produkt-Absatz in `05` sagte „Ein 14. Repo erhöht die Menge, nicht die Qualität"
— das 14. ist jetzt da; der Absatz benennt die Aufnahme samt Kriterium, statt still
auf „ein 15." weiterzuzählen.

**Abgeleitete Zahlen sind mitgewandert**, statt den Nenner allein zu tauschen:
Mirajes Schwellen-Faktor **9,6 → 11,0** (1.099/100) an zwei Stellen, der
`general`-Anteil im Hygiene-Block **34,6 % → 33,2 %** (365/1.099, Zähler aus der
`stats`-Domänenliste, deckungsgleich mit der `INDEX.md`-Domänenliste ohne
Massen-Anteil), der Massen-Repo-Anteil **96,3 % → 95,7 %** (24.543/25.642 — diesmal
ändert sich die Rundung, anders als beim Nachzug vom 2026-08-07). Der
Description-Anteil wurde nicht umgerechnet, sondern **neu gemessen**, weil die
Messmethode in `04` 3.2 dokumentiert ist: `search "usr/bin/env"` **50 → 56** (weiterhin
ausschliesslich Hooks), dazu `stop-hook` mit `!/bin/bash`-Shebang, **7 statt 6** ohne
jede Beschreibung, **5** Code-/Trennzeichen-Fragmente aus dem neuen Repo — zusammen
**69 von 1.099 (5,9 % → 6,3 %)**, und zwar 69 der 70 Hooks. Einzige Ausnahme:
`anthropics__claude-plugins-official/hook/patterns` („Security patterns
configuration"). Die Allaussage „kein einziger Hook mit brauchbarer Beschreibung"
ist damit auf **69 von 70** abgeschwächt — auch das offizielle Repo löst das
Hook-Beschreibungsproblem nicht.

**Unverändert richtig geblieben** und deshalb nicht angefasst: `seo` 64, `legal-de`
24.161, `anthropics__skills` 21, Massen-Repo 24.543, „12 der 13 Domänen", die 13
Domänenzeilen in `stats`. Nebenbefund: `05` Abschnitt 1.5 führte `affaan-m/ecc`
noch mit 520 Bausteinen — beim Nachzug vom 2026-08-07 18:27 übersehen, 522 war
schon damals richtig; jetzt 522.

**Woran der Drift bemerkt wurde:** `lint` direkt nach `update` — der Kreislauf, wie
er gedacht ist. Das Prüfpflicht-Hook-Skript hätte ihn ab der nächsten Session am
Turn-Ende erzwungen.

## [2026-08-08] revise | Rezept 04: die zwei generischen Schutz-Hooks bewertet — `block-no-verify` unter „Erweiterung (optional)", `config-protection` unter „Bewusst weggelassen"

Teil desselben Laufs wie die Einträge zu Rezept 01/02/03/05/06 weiter unten; der
Autor dieser Datei hatte seinen Eintrag versäumt, nachgetragen vom koordinierenden
Lauf mit den Fakten aus dem Autorenbericht. `affaan-m__ecc/hook/block-no-verify`
(hook, 14 KB, per `show` verifiziert) steht jetzt unter „Erweiterung (optional)" —
Bedingung: das Zielprojekt hat sicherheitsrelevante pre-commit-Hooks (gitleaks,
detect-secrets) und committet in der Fix-Phase; Symptom: der Agent hängt
`--no-verify` an und schleust das Secret wieder ein. Mit Registrier-Hinweis
(feuert erst nach Eintrag in `.claude/settings.json`; `install` druckt das
Snippet) und ehrlicher Reichweite (No-op bei lesendem Audit und bei
URL-/Domain-/IP-Zielen ohne Repo). `affaan-m__ecc/hook/config-protection` (hook,
5 KB) steht unter „Bewusst weggelassen": Er schützt gegen das Weichklopfen von
Lint-Configs, aber die Fehlermode dieses Rezepttyps ist das Kleinreden von
Befunden (Doktrin 4.3), und die Prüfagenten arbeiten lesend — kein Symptom, das
der Hook träfe. Kern-Set unverändert (Entscheid vom 2026-08-08, siehe
`recipes/README.md`). `lint` nach der Änderung: 0 Befunde.

## [2026-08-08] revise | Kern-Set-Hook-Frage in `recipes/README.md` von offen auf entschieden — kein Pflicht-Hook im Kern-Set, zwei generische Schutz-Hooks je Rezept zu bewerten

Der Abschnitt hiess bislang „Kein Kern-Set enthält einen Zwang — und das ist zu
entscheiden, nicht zu übersehen", weil die Entscheidung ausstand. Sie ist am
2026-08-08 in beidseitiger adversarialer Prüfung (drei Agenten; jede Lesart musste
die Gegenposition am laufenden System widerlegen) gefallen; der Abschnitt heisst
jetzt „Kein Pflicht-Hook im Kern-Set — entschieden 2026-08-08, generische
Schutz-Hooks je Rezept bewertet". Lesart A (Pflicht-Verifikations-Hook im
Kern-Set) ist widerlegt: `search "verification" --type hook` liefert null Treffer,
und die Doktrin meint mit dem billigsten Hebel den Verifikationsweg des
Zielprojekts, nicht einen Katalog-Baustein (Reyes-Geltungsbereich). Lesart B
(skill/agent-only) hält im Kern, fiel aber im Allsatz „ein generischer Hook wäre
wirkungslos oder falsch": `affaan-m__ecc/hook/config-protection` und
`affaan-m__ecc/hook/block-no-verify` sind generisch wirksam und standalone-fähig,
waren aber in keinem Rezept je geprüft (Grep über `recipes/`: 0 Treffer) — die
Zusammensetzung war ungeprüfter Zustand, kein Prüfergebnis. Beide Kandidaten sind
je Rezept zu bewerten (Erweiterung mit Bedingung oder Bewusst weggelassen mit
Grund); die Rezept-Einträge desselben Tages unten sind die Umsetzung. Nebenbefund
korrigiert: die Behauptung, Hooks stünden „in allen sechs Rezepten nur unter
Erweiterung", war falsch — real nur 01 und 02 unter Erweiterung, 04 nur unter
„Bewusst weggelassen", 03/05/06 gar nicht; der Altstand steht im Abschnitt mit
`lint:historisch`-Marker samt Begründung.

## [2026-08-08] revise | `knowledge/08` Abschnitt 5: Scorer-Beschreibung auf den Suchfix vom 2026-08-08 nachgezogen — `bewerteTreffer()`, Präfix-Matching, Stoppwortfilter statt „reiner Substring-Scorer"

Der Absatz „Was uns das betrifft" beschrieb `sucheIds` als reinen
Substring-Scorer; seit dem Suchfix vom 2026-08-08 bewerten `cmdSearch` und
`sucheIds` über die gemeinsame Funktion `bewerteTreffer()` mit
Wortanfangs-Präfix-Matching (`termRegex()`) und Stoppwortfilter (`STOPPWOERTER`)
— vorher zwei driftgefährdete Kopien. Determinismus am laufenden System
nachgemessen (drei `eval`-Läufe: der erste meldet die Rangänderungen aus dem
Umbau gegen den gespeicherten Vorlauf, der zweite und dritte byte-identisch) und
die Fallzählung präzisiert: 7 der 19 Fälle ohne erwartete ID statt „die Hälfte".
Der Altstand vom 2026-08-07 bleibt als eigener Absatz mit
`<!-- lint:historisch -->` stehen, weil er zusammen mit der Nachmessung belegt,
dass der Determinismus nicht am Matching-Verfahren hängt. Kernaussage des
Abschnitts (Obergrenze erst bei Stufe 2 relevant) unverändert.

## [2026-08-08] revise | 06-massnahmen: Suchfix eingearbeitet — M7-Altstand als historisch markiert, M9 erledigt, M8-Abgrenzung Stoppwortliste, zwei Nachträge unter „Bewusst nicht umgesetzt"

Vorher galt in `knowledge/06-massnahmen.md`: `cmdSearch` sei ein namensgewichteter
Substring-Matcher (zwei Stellen), und M9 stehe auf „im Code, wirkt erst nach
`extract`". Jetzt gilt: seit 2026-08-08 matcht `cmdSearch` auf Wortanfangs-Präfixe
mit Stoppwortfilter (`bewerteTreffer()`, `STOPPWOERTER`, `termRegex()`); der
Substring-Altstand bleibt an der Messstelle mit `<!-- lint:historisch -->` und
Begründung stehen. M9 ist erledigt — der `extract` ist gelaufen, nachgeprüft am
System: `show anthropics__skills/skill/webapp-testing` meldet „Lädt sofort 4 KB".
Bemerkt wurde der Drift durch die Messläufe des Suchfixes vom 2026-08-08 (Umsetzer
und adversarialer Prüfer unabhängig). Neu dokumentiert: die Stoppwortliste ist keine
Wiederbelebung der in M8 abgelehnten Synonymtabelle (geschlossene Grammatikklasse
statt offener Bedeutungstabelle); unter „Bewusst nicht umgesetzt" zwei Nachträge —
E2/IDF-Coverage-Suche zurückgestellt mit Wiedervorlage-Auslöser, und die
`hayName`-Restschwäche (Repo-Teil der ID als Inhaltssignal, belegt an z22) als
erkannte, nicht sofort behobene Schwäche.

## [2026-08-08] revise | Rezept 05: die zwei generischen Schutz-Hooks bewertet — `config-protection` unter „Erweiterung (optional)", `block-no-verify` unter „Bewusst weggelassen"

Folge des Kern-Set-Entscheids vom 2026-08-08 (kein Hook im Kern-Set; die zwei
standalone-fähigen generischen Schutz-Hooks werden je Rezept einzeln bewertet;
Begründung in `recipes/README.md`). In `recipes/05-seo-content-marketing.md`,
beide IDs vorab per `show` verifiziert (Typ `hook`):
`affaan-m__ecc/hook/config-protection` (5 KB) steht jetzt unter „Erweiterung
(optional)" — Bedingung: Der Auftritt ist selbst eine Codebasis mit bestehenden
Lint-/Format-Configs, und der Agent weicht bei Code-Fixes (typisch:
Core-Web-Vitals-Nacharbeit nach `seo-performance`-Befunden) die Config auf, statt
den Code zu reparieren; ohne solche Configs ein No-op (fail-open), feuert erst
nach Registrierung in `.claude/settings.json` (`install` druckt das Snippet).
`affaan-m__ecc/hook/block-no-verify` (14 KB) steht unter „Bewusst weggelassen":
Er erzwingt nur etwas, wo Git-Hooks existieren — dieses Rezept setzt einen
Projekttyp voraus, in dem der binäre Check fast vollständig fehlt; ohne Git-Hooks
feuert er nie und wäre eine Komponente ohne Wirkung (Doktrin 6.4). Anders als in
den Code-Rezepten, wo beide Hooks in die Erweiterung kamen, trägt die typische
Ziel-Codebasis hier keine Git-Hooks. Kern-Set und bestehende Abschnitte
unverändert.

## [2026-08-08] revise | Rezept 03: die zwei generischen Schutz-Hooks bewertet — beide unter „Erweiterung (optional)", weil Ruff-Configs in der Schutzliste stehen und Git-Hooks via `pre-commit` bei Python realistisch sind

Folge des Kern-Set-Entscheids vom 2026-08-08 (kein Hook im Kern-Set, siehe
`recipes/README.md`; die zwei standalone-fähigen generischen Schutz-Hooks werden je
Rezept einzeln bewertet). Vorher enthielt `recipes/03-python-daten-ml.md` das Wort
„Hook" nirgends — ungeprüfter Zustand, kein Prüfergebnis. Jetzt stehen
`affaan-m__ecc/hook/config-protection` (5 KB) und `affaan-m__ecc/hook/block-no-verify`
(14 KB) unter „Erweiterung (optional)", beide per `show` verifiziert und per
`install --dry-run` am laufenden System geprüft: Ablage `.claude/hooks/`, Zustand
`[inaktiv]` bis zur Registrierung in `.claude/settings.json`; `block-no-verify`
bekommt von `install` das fertige PreToolUse-Snippet gedruckt, `config-protection`
nicht („Ereignis nicht aus dem Code ableitbar" — Handarbeit). Ehrliche Reichweite
steht im Rezept: `config-protection` schützt `ruff.toml`/`.ruff.toml`, aber bewusst
nicht `[tool.ruff]` in `pyproject.toml` (dort liegen auch Abhängigkeiten);
`block-no-verify` erzwingt nur etwas, wo Git-Hooks tatsächlich existieren.

## [2026-08-08] revise | Rezept 06: die zwei generischen Schutz-Hooks bewertet — beide unter „Erweiterung (optional)", weil bei einer Legacy-Übernahme an fremden Checks gedreht wird

Folge des Kern-Set-Entscheids vom 2026-08-08 (kein Hook im Kern-Set, siehe
`recipes/README.md`; die zwei standalone-fähigen generischen Schutz-Hooks werden
je Rezept einzeln bewertet). Vorher enthielt `recipes/06-legacy-onboarding.md`
das Wort „Hook" nirgends — die skill/agent-only-Zusammensetzung war ungeprüfter
Zustand, kein Prüfergebnis. Jetzt stehen `affaan-m__ecc/hook/config-protection`
(5 KB) und `affaan-m__ecc/hook/block-no-verify` (14 KB) — beide vorab per `show`
verifiziert — in der Erweiterungs-Tabelle: mit Symptom-Bedingung, ehrlicher
Reichweite (config-protection ist ohne Lint-/Format-Configs ein No-op und
blockiert auch legitime Config-Modernisierung; block-no-verify erzwingt nur
etwas, wo Git-Hooks existieren) und dem Hinweis, dass ein installierter Hook
erst nach Registrierung in `.claude/settings.json` feuert (`install` druckt das
Snippet). Begründung der Aufnahme statt Ablehnung: Gerade bei der Übernahme
einer fremden Codebasis wird an fremden Checks gedreht — Configs weichklopfen
statt Code fixen und `--no-verify` gegen unverstandene alte pre-commit-Hooks
sind exakt die Fehlermuster dieses Projekttyps; vorhandene Configs und Git-Hooks
sind dort geronnene Konvention beziehungsweise das einzige funktionierende Gate,
solange der Verifikationspfad noch leer ist. Kern-Set und bestehende Abschnitte
unverändert.

## [2026-08-08] revise | Rezept 01: die zwei generischen Schutz-Hooks bewertet — beide unter „Erweiterung (optional)" mit Bedingung, ehrlicher Reichweite und Registrier-Hinweis

Folge des Kern-Set-Entscheids vom 2026-08-08 (kein Hook im Kern-Set; die zwei
standalone-fähigen generischen Schutz-Hooks werden je Rezept einzeln bewertet;
Begründung in `recipes/README.md`). In `recipes/01-web-app-react-nextjs.md` wurden
`affaan-m__ecc/hook/config-protection` (5 KB) und `affaan-m__ecc/hook/block-no-verify`
(14 KB) — beide vorab per `show` verifiziert (Typ `hook`) — in die
Erweiterungs-Tabelle aufgenommen: mit Symptom-Bedingung, ehrlicher Reichweite
(config-protection ist ohne Lint-/Format-Configs ein No-op; block-no-verify erzwingt
nur etwas, wo Git-Hooks existieren) und einer Notiz unter der Tabelle, dass ein
installierter Hook erst nach Registrierung in `.claude/settings.json` feuert
(`install` druckt das Snippet). Begründung der Aufnahme statt Ablehnung: Die typische
Ziel-Codebasis dieses Rezepts (React/Next.js) führt ESLint-/Prettier-/Biome-Configs,
auf die config-protection wirkt, und die im Hook-Kopf dokumentierte Modellschwäche
("Agents frequently modify these to make checks pass instead of fixing the actual
code") greift genau dort; block-no-verify bleibt an die Bedingung vorhandener
Git-Hooks (husky/pre-commit) geknüpft. Vor dieser Runde tauchte keiner der beiden
Kandidaten in irgendeinem Rezept auf (Grep-Befund der Prüfung: 0 Treffer) — die
skill/agent-lastige Zusammensetzung war ungeprüfter Zustand, kein Prüfergebnis.
Kern-Set und bestehende Abschnitte unverändert.

## [2026-08-08] revise | Rezept 02: die zwei generischen Schutz-Hooks bewertet — beide unter „Erweiterung (optional)" mit Bedingung und Registrier-Hinweis

Folge des Kern-Set-Entscheids vom 2026-08-08 (kein Hook im Kern-Set; die zwei
standalone-fähigen generischen Schutz-Hooks werden je Rezept einzeln bewertet).
In `recipes/02-backend-api.md` wurden `affaan-m__ecc/hook/config-protection`
(5 KB) und `affaan-m__ecc/hook/block-no-verify` (14 KB) — beide vorab per `show`
verifiziert — in die Erweiterungs-Tabelle aufgenommen: mit Symptom-Bedingung,
ehrlicher Reichweite (config-protection ist ohne Lint-/Format-Configs ein No-op;
block-no-verify erzwingt nur etwas, wo Git-Hooks existieren) und dem Hinweis,
dass ein installierter Hook erst nach Registrierung in `.claude/settings.json`
feuert (`install` druckt das Snippet). Begründung der Aufnahme statt Ablehnung:
Die typische Ziel-Codebasis dieses Rezepts (Node/TypeScript- oder Python-Backend)
trägt genau die Configs und Git-Hooks, auf die beide Hooks wirken. Kern-Set und
bestehende Abschnitte unverändert.

## [2026-08-08] revise | Suchfix: Wortanfangs-Präfix-Matching, Stoppwortliste, eine Bewertungsfunktion statt zwei Suchkopien

**Was vorher galt.** Die Suche in `tools/harness.mjs` traf Terme als Substring
irgendwo im Text (Mittwort-Treffer: „sql" fand `postgresql`/`mysql`), englische
Funktionswörter fluteten das Ranking (der Pseudo-Treffer „this" hob eine falsche
ID auf Rang 2, siehe z22 unten), und `cmdSearch` und `sucheIds` führten **zwei
driftgefährdete Kopien** der Bewertungslogik.

**Was jetzt gilt.** Eine gemeinsame Bewertungsfunktion `bewerteTreffer()` für
beide Aufrufer; eine Modul-Konstante `STOPPWOERTER` mit 89 englischen
Funktionswörtern inkl. `same`/`know`/`right` (Variantenmessung: mit den dreien
z21 Rang 3/119, ohne Rang 5/121, Pflichtfälle in beiden grün); `termRegex()` mit
Wortanfangs-Präfix-Matching plus Plural-s-Stamm — gekoppelte Invariante: der
s-Stamm ist nur gefahrlos, **weil** Präfix-Matching gilt; steht als Kommentar am
Code. `cmdSearch` gibt im Fallback-/Nullfall eine Termbilanz aus; der
M8-Sprachhinweis blieb unangetastet.

**Woran der Irrtum bemerkt wurde.** Die Routing-Evals führten die Schwächen als
optionale Fälle (2/7 grün); der Design-Workflow diagnostizierte die Ursachen am
laufenden System statt aus der Plausibilität.

**Einzelwort-Verhaltensänderung.** `search "sql"` 9 → 3 Treffer, `"ops"`
81 → 13 — Mittwort-Treffer wie `postgresql`/`mysql` entfallen. `.js`-Endungen
bleiben treffbar, weil der Punkt Wortgrenze ist („js" 92 Treffer).

**Prüfprotokoll** (von Umsetzer und adversarialem Prüfer unabhängig
verifiziert): 12/12 Pflichtfälle vorher wie nachher grün; optionale Fälle
2/7 → 3/7. Ränge: `code-reviewer` bei „reviews miss the same mistakes" 22 → 3
(grün); `deployment-patterns` bei „our releases keep breaking" 21 → 4 (grün);
`eval-harness` bei „how do I know the agent did it right" 733 → 432 (bleibt
deklariert rot — Vokabellücke, kein Ranking-Problem); `react-patterns` bei der
7-Wort-Profilanfrage 103 → 53 bei 215 Treffern (bleibt rot); „sicherheit
prüfen" 0 Treffer (bleibt deklariert rot, M8). Performance `search "code
review"`: 0,255 s → 0,250 s. Gegenprobe: ein eingeschleuster verboten-Fall in
`routing.jsonl` wurde von `eval` mit Exit 1 gemeldet und wieder entfernt.

**z22-Erwartungspflege als Beschluss.** Im Eval-Fall z22 („nobody understands
this codebase") wurde die Erwartung **ersetzt** durch
`msitarzewski__agency-agents/agent/codebase-onboarding-engineer` (per `show`
verifiziert; `cmdEval` verlangt ALLE erwarteten IDs in topN); die alte ID
`affaan-m__ecc/skill/codebase-onboarding` ist im warum-Feld vermerkt — ihr
alter Rang 2 war ein Artefakt des Füllwort-Pseudo-Treffers „this", real jetzt
Rang 14. z22 bleibt trotzdem ROT: die neue ID steht auf Rang 7, weil sechs
`Egonex-AI__Understand-Anything`-Bausteine den Namensbonus über den Repo-Teil
der ID kassieren („Understand" trifft „understands" als Präfix) — dokumentierte
Restschwäche: der Repo-Teil der ID zählt in `hayName` als Inhaltssignal.
Beschluss des Projektverantwortlichen im autonomen Mandat vom 2026-08-08.

**E2-Wiedervorlage.** Im Design-Vorlauf standen 3 Entwürfe vor 3 adversarialen
Judges (Punktesummen E1 21,5 / E3 19 / E2 16,5). E2 (IDF-Coverage-Suche mit
Fallback-Kappung) wurde NICHT umgesetzt: eine Messbehauptung („z22 bleibt
Top 5") wurde am System falsifiziert, die Spezifikation war unterbestimmt (zwei
werkgetreue Nachbauten lieferten z21 Rang 3 bzw. Rang 14), und der Konflikt mit
dem M5-Wortlaut „Sortierung bleibt unverändert" blieb unadressiert.
Wiedervorlage-Auslöser: erst wenn die M2/M3-Beschreibungspflege trägt ODER ein
Pflichtfall bzw. ein echter `harness-build`-Lauf Fallback-Fluten als Problem
belegt.

**Abgrenzung zu M8.** Die Stoppwortliste ist KEINE Wiederbelebung der in M8
abgelehnten Synonymtabelle: sie übersetzt und expandiert nichts, sondern
entfernt Terme einer geschlossenen Grammatikklasse — endlich, sprachstabil,
keine Domänenpflege.

## [2026-08-08] add | Zwei Hooks für das eigene Projekt-Harness: Zugriffsschutz (PreToolUse) und Prüfpflicht (Stop)

**Was entsteht.** Das Projekt hat erstmals eine `.claude/settings.json` mit
zwei Hooks (Prüflauf mit 5 adversarialen Agenten, 2026-08-08):

1. `zugriffsschutz.mjs`, PreToolUse auf `Read|Grep|Glob`: blockiert
   `catalog/index.json` (gemessen 20.764.187 Bytes) und `.harness-sources` mit
   Exit 2 und Ersatzweg-Meldung. Bei Grep wird NUR das `path`-Feld geprüft —
   `pattern` ist Regex über Inhalte, ein belegter Falsch-Positiv-Fall; bei Glob
   auch `pattern`. Der Matcher wurde bewusst NICHT auf Bash ausgeweitet:
   `extract` schreibt `index.json` über Bash, `lint` liest in-process — ein
   überblockender Hook würde nach Fehlerklasse 7.3 im Ganzen abgeschaltet.
   12/12 synthetische stdin-Fixtures grün.
2. `pruefpflicht.mjs`, Stop-Hook: einmal pro Turn `git status --porcelain`; bei
   geändertem `tools/harness.mjs` → `eval --no-save` UND `lint`, bei geänderten
   `knowledge/recipes/catalog/evals/INDEX.md` → `lint`; Befunde als Exit 2 mit
   gekürzten Befundzeilen; `stop_hook_active`-Guard. Gemessen: `lint` Ø 338 ms,
   `eval` Ø 526 ms. Bewusst NICHT PostToolUse pro Edit: `lint` liest
   `harness.mjs` nicht — pro Edit gäbe es nur Stille, Altbefunde oder
   Stacktraces halb editierter Zwischenstände.

**Wozu.** Für den Zugriffsschutz gibt es keinen dokumentierten Vorfall, aber
die Regel ist als „bindend" deklariert, wird an ≥8 Stellen als Prosa dupliziert,
der Schaden wäre still und sitzungszerstörend, und die eintägige Erfolgsbilanz
stammt von derselben Modellgeneration, die die Regel schrieb — der
Generationswechsel Opus 5 → Fable 5 ist bereits eingetreten (Doktrin-Kurzform
10). Für die Prüfpflicht ist das Symptom belegt: acht widersprüchliche
Bestandszahlen, still verfallene 1.050, die undefinierte Aktionsart `add` — der
Abgleich unterblieb genau dann, wenn nichts ihn erzwang; Präzedenz ist
`cmdUpdate` Schritt 4. Rotpfad-Test: eingeschleuste Wegwerf-Datei ohne
Frontmatter → Exit 2 mit Befundzeilen; sauberer Baum → Exit 0.

**Welche Zuständigkeit sich verschiebt.** Zugriffsregel und Prüfpflicht waren
bisher reine Prosa-Disziplin der lesenden Agenten (CLAUDE.md, INDEX.md und
weitere Duplikate); die Durchsetzung liegt jetzt beim Werkzeug. Die Prosa
bleibt als Begründung stehen, ist aber nicht mehr die einzige Verteidigung.

**Abgelehnt: K2 mit Kippbedingung.** K2 (Rohschicht-Schutz für `Learnings/`
per `Edit|Write`-Block) wurde abgelehnt: null Verstöße über die gesamte
Git-Historie (nur A-Status), git ist das vorhandene billigere Netz —
„Komplexität ohne Symptom". KIPPBEDINGUNG festgehalten: der erste M-Status auf
`Learnings/` in einem Diff dreht das Urteil. Ebenfalls geprüft und verworfen:
ein separater Selbstlern-Mechanismus (alle Ablage-Bahnen existieren; in
Stichproben ging keine Erkenntnis verloren).

**Restrisiken.** Die Bash-Umgehung des Zugriffsschutzes ist dokumentiertes
Restrisiko (bewusste Folge des engen Matchers, siehe oben). Die Hooks greifen
erst ab der nächsten Session — Claude Code lädt `settings.json` beim Start.

## [2026-08-08] revise | Kern-Set-Befund entschieden: kein Pflicht-Hook im Kern-Set, zwei Schutz-Hooks werden je Rezept einzeln bewertet

**Was vorher galt.** Offene Entscheidung: gehört ein Verifikations-Hook in
jedes Kern-Set, oder ist die skill/agent-only-Zusammensetzung der Rezepte
korrekt? Die skill/agent-only-Zusammensetzung war dabei **ungeprüfter Zustand,
kein Prüfergebnis** — keiner der generischen Hook-Kandidaten wurde je in einem
Rezept geprüft, weder unter „Erweiterung" noch unter „Bewusst weggelassen"
(Grep-Befund: 0 Treffer).

**Was jetzt gilt.** Entscheidung des Projektverantwortlichen: Der Befund ist
geschlossen. Die Absicht-Lesart ist für Verifikations-Hooks bestätigt — **kein
Pflicht-Hook im Kern-Set**. Die zwei standalone-fähigen generischen
Schutz-Hooks `affaan-m__ecc/hook/config-protection` und
`affaan-m__ecc/hook/block-no-verify` werden je Rezept einzeln bewertet und
landen entweder unter „Erweiterung (optional)" mit Bedingung und
Registrier-Hinweis oder unter „Bewusst weggelassen" mit Grund.

**Woran es bemerkt wurde: beidseitige adversariale Widerlegung** (3 Agenten,
2026-08-08). Lesart A („mindestens ein Verifikations-Hook gehört in jedes
Kern-Set") ist WIDERLEGT: die Doktrin meint mit dem billigsten Hebel den
Verifikationsweg des Zielprojekts, nicht einen Hook-Baustein
(Reyes-Geltungsbereich); `search "verification" --type hook` liefert null
Treffer, es existiert kein stack-agnostischer Verifikations-Hook im Katalog;
ein blind installierter Hook wäre nach Fehlerklassen 7.6/7.3 tot oder schädlich
— die Illusion eines Gates ist schlechter als das ehrliche leere
Verifikationspfad-Feld. Lesart B („skill/agent-only ist korrekt") hält im KERN
(Reihenfolge erst Verifikationspfad, dann Zwang; kein hartkodierter
Verifikationsbefehl im Rezept; die Bibliothek schaltet fremde Hooks bewusst
nicht scharf — ein installierter Hook ist zunächst inaktiv), fällt aber im
ALLSATZ „ein generischer Hook wäre wirkungslos oder falsch": Der Katalog
enthält mindestens drei generisch wirksame Hooks — `config-protection`
(blockiert Änderungen an bestehenden Lint-/Format-Configs von
ESLint/Prettier/Biome/Ruff; dokumentierte Modellschwäche „Checks weichklopfen
statt Code fixen"; Neuanlage erlaubt, fail-open; bester Einzelkandidat),
`block-no-verify` (blockiert git-Hook-Bypass `--no-verify`/`core.hooksPath`
rein aus dem Kommandostring, flag-positionsbewusst tokenisiert, null
Projektwissen; wirkt nur, wo Git-Hooks existieren) und
`affaan-m__ecc/hook/post-edit-format` (detektiert Formatter selbst, schweigt
sonst; ABER `require` auf `../lib/resolve-formatter` aus der ECC-Repo-Struktur
— nicht standalone, daher kein Kandidat).

**Zusatzbefund.** Der Satz in `recipes/README.md` „Hooks stehen in allen sechs
Rezepten nur unter Erweiterung (optional)" ist falsch: tatsächlich nennen nur
Rezept 01 (`post-edit-typecheck`) und Rezept 02 (`pre-bash-dev-server-block`)
überhaupt einen Hook; 03/05/06 enthalten das Wort „hook" nirgends; 04 nennt
einen Hook nur unter „Bewusst weggelassen".

**Verweis.** Die Umsetzung — je-Rezept-Bewertung der beiden Schutz-Hooks und
Korrektur des falschen README-Satzes — erfolgt in den Rezept-Änderungen
desselben Laufs (2026-08-08, `recipes/`), siehe u. a. den Rezept-02-Eintrag
weiter oben. Die Spannung „kein einziger Zwang im eigenen Haus" ist am selben
Tag teilentschieden: siehe den add-Eintrag über diesem zu den ersten eigenen
Hooks in `.claude/settings.json`.

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
