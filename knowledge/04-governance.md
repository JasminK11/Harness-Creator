---
type: Governance
title: Governance — was ab 1.050 Bausteinen kippt
description: "Beantwortet, welche Governance-Mechanismen eine Katalog-Bibliothek fremder Bausteine ab der 100er-Schwelle braucht — gemessen am eigenen Bestand."
status: stable
sources:
  - id: miraje-skill-centric
    resource: https://www.youtube.com/watch?v=7jjudsEhBtM
    title: Building skill-centric agentic products — Konferenzvortrag
    author: Yogendra Miraje (Principal AI Engineer, FactSet)
  - id: harness-cli
    resource: tools/harness.mjs
    title: Eigenes CLI — DOMAIN_RULES, classify(), SKIP_DIRS, hookDescription(), cmdSearch-Score, cmdUpdate-Diff, cmdInstall-Manifest
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: harness-index
    resource: INDEX.md
    title: Bestandsübersicht nach Typ, Domäne und Repo — Katalogstand 2026-08-07 08:38
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: harness-build-skill
    resource: C:\Users\info\.claude\skills\harness-build\SKILL.md
    title: Skill harness-build — Symptomtabelle und Ablauf search/show/install
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: cli-laeufe-2026-08-07
    resource: catalog/index.json
    title: CLI-Läufe stats/search/show vom 2026-08-07, aus denen alle Zahlen dieser Datei stammen
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-05-07
tags: [governance, katalog, routing, descriptions, eval, admission, lifecycle, coherence]
---

# 04 — Governance: was ab 1.050 Bausteinen kippt

> **Abstract.** Unsere Bibliothek hat mit 1.050 Bausteinen im Standardzugriff Mirajes dritte Schwelle (~100) um den Faktor zehn überschritten — die Architektur ist dafür gebaut, die Governance ist bei null.
> Die Diagnose ist hart: Domänen entstehen aus Regex-Treffern auf Dateipfaden statt aus Nutzerabsicht, 15 % des Bestands sind japanische Übersetzungsstümpfe, 45 % aller Hooks tragen als Beschreibung ihre Shebang-Zeile, und häufige Suchen liefern über 200 Kandidaten mit austauschbaren Descriptions.
> Weil wir fremde Repos katalogisieren statt eigene Skills zu besitzen, sind drei von Mirajes fünf Governance-Aspekten bei uns nicht anwendbar — wir brauchen Ersatzmechanismen an der Katalog-Grenze, nicht am Baustein.

Anlass ist der Konferenzvortrag von **Yogendra Miraje** (Principal AI Engineer, FactSet), *„Building skill-centric agentic products"*. Er beschreibt eine Skill-Bibliothek, die dieselbe Kurve genommen hat wie unsere, und benennt die Punkte, an denen sie kippt. Diese Datei erzählt den Vortrag nicht nach, sondern misst unsere Bibliothek an seinen Aussagen.

Alle Zahlen unten stammen aus Läufen von `node tools/harness.mjs stats` und `search` am 2026-08-07, Katalogstand 2026-08-07 08:38.

---

## 1. Wo wir auf der Skalierungsskala stehen

Miraje nennt drei Regime:

| Bestand | Was reicht | Wo wir stehen |
|---|---|---|
| bis ~10 | alle Skills in den System-Prompt schieben | weit überschritten |
| ab ~10 | Vorauswahl per Embeddings/Similarity oder kleinem Vorfilter-Modell | überschritten |
| ab ~100 | Hierarchie, Metadaten-Filter, **Governance** | 1.050 — Faktor 10 darüber |

**Die Architektur ist in Ordnung.** Wir haben genau das, was das dritte Regime verlangt: Hierarchie (`INDEX.md` mit 4,7 KB → `catalog/by-domain/*.md` → `search`/`show`), Metadaten-Filter (`--type`, `--domain`, `--repo`, `--limit`) und ein Mengen-Ventil (`!bulk` in `sources.txt` hält 24.543 Rechts-Bausteine aus der Standardsuche; ohne das wären wir bei 25.593 und jede Suche wertlos).

**Die Governance fehlt vollständig.** Kein Admission-Gate, keine Ownership, keine Boundaries, keine Lifecycle-Policy, keine Audits. Genau die Dimension, die Miraje ab 100 fordert, ist bei uns die einzige, die wir nie gebaut haben.

### Die Schwelle, die uns tatsächlich bindet

Mirajes Zahlen beschreiben, wie viele Skills ein Agent gleichzeitig unterscheiden muss. Unser Agent sieht nie 1.050 — er sieht die Trefferliste einer Suche. **Die relevante Grösse ist also nicht der Bestand, sondern die Trefferzahl pro Anfrage.** Und die liegt bei typischen Fragen über Mirajes 100er-Schwelle:

| Suchanfrage | Treffer (ohne Massen-Repo) |
|---|---:|
| `search "code review"` | 231 |
| `search "api design"` | 184 |
| `search "security audit"` | 120 |
| `search "review"` | 107 |
| `search "refactor"` | 15 |
| `search "documentation"` | 8 |

Das ist bimodal: entweder man trifft ein seltenes Wort und bekommt eine brauchbare Liste, oder man trifft ein Allerweltswort und bekommt ein Regime, für das wir keine Vorauswahl haben. Der Agent bekommt per Default 25 davon zu sehen — sortiert nach einem Score, der Namenstreffer mit 10 und alles andere mit 3 gewichtet und kleine Bausteine mit +1 bevorzugt. Bei 231 Kandidaten ist die Auswahl der sichtbaren 25 damit weitgehend Zufall.

Verschärfend: `cmdSearch` wertet Mehrwortanfragen als **ODER**, nicht als UND. Deshalb liefert `"code review"` (231) *mehr* Treffer als `"review"` (107). Je präziser der Nutzer seine Absicht formuliert, desto unschärfer wird das Ergebnis. Das ist die direkte Umkehrung dessen, was Miraje von einem Routing-Signal verlangt.

---

## 2. Diagnose: unsere Domänen sind nach Datenmodell geschnitten

### 2.1 Wie die Klassifikation tatsächlich arbeitet

`DOMAIN_RULES` in `tools/harness.mjs` (Zeilen 157–170) ist eine Liste aus 13 Regex-Regeln. `classify()` wirft Name, Description **und den relativen Dateipfad** in einen String und gibt jede Domäne zurück, deren Regex irgendwo trifft. Mehrfachtreffer sind erlaubt, ohne Gewichtung, ohne Reihenfolge.

Zwei Konstruktionsfehler folgen daraus unmittelbar:

1. **Der Dateipfad ist gleichberechtigtes Klassifikationssignal.** Ein Ordner namens `docs/` erzeugt die Domäne `docs`, unabhängig vom Inhalt.
2. **Die Kategorien sind Technikbegriffe.** `frontend`, `backend`, `testing`, `devops`, `media` beschreiben, *woraus* ein Baustein gemacht ist — nicht, *wofür* jemand ihn sucht. Genau der Schnitt, den Miraje an seinem eigenen Bestand refaktorieren musste (`estimates-analysis` → `earnings-preparation`).

### 2.2 Belege aus dem Katalog

**Die Domäne `docs` besteht zu drei Vierteln aus einem Ordnernamen.** `search "ja-jp"` liefert 163 Treffer; `search "ja-jp" --domain docs` liefert dieselben 163. Alle liegen unter `affaan-m__ecc/docs/ja-JP/…` und sind nur deshalb `docs`. Bei 222 `docs`-Bausteinen insgesamt sind das **73 %, die die Domäne über ihren Ablageort erben statt über ihren Zweck**. Beispiel:

```
node tools/harness.mjs show affaan-m__ecc/skill/production-audit
  Domänen  docs
  Quelle   …\affaan-m__ecc\docs\ja-JP\skills\production-audit
  Beschr.  日本語翻訳：このファイルは production-audit 用の日本語翻訳が必要です
```

Ein Production-Audit-Skill in der Domäne `docs` — und die Beschreibung sagt übersetzt „für diese Datei wird noch eine japanische Übersetzung benötigt". Das ist kein Baustein, das ist ein Platzhalter.

**Ein einzelnes Wort im Fliesstext kippt die Domäne.** Drei Fälle aus derselben Suche:

- `competitive-platform-analysis` (Wettbewerbsanalyse) liegt in `devops` — wegen des Satzes „First step in the three-skill competitive **pipeline**". Ebenso `competitive-report-structure`.
- `e2e-testing` liegt in `data-ai` — wegen „Page Object **Model**"; die `data-ai`-Regex enthält `model`.
- `inherit-legacy-style` liegt in `data-ai` — wegen „onboarding an AI coding **agent** onto a legacy project". Ein Skill zum Übernehmen fremder Code-Konventionen ist damit weder in `docs` noch in einer Onboarding-Kategorie auffindbar.

**`react-reviewer` liegt in fünf Domänen gleichzeitig:** `security, frontend, backend, meta, media`. `meta` wegen „**hook** correctness", `media` wegen „**render** performance", `backend` wegen „**server**/client component boundaries". Ein Baustein, der in fünf von zwölf Domänen auftaucht, filtert nichts mehr.

**Gleichartige Bausteine landen unterschiedlich.** In derselben Familie `*-reviewer` aus demselben Repo: `cpp-reviewer` → `general`, `go-reviewer` → `general`, `csharp-reviewer` → `security`, `django-reviewer` → `security, backend`, `react-reviewer` → fünf Domänen. Identische Funktion, fünf verschiedene Einordnungen — je nachdem, welches Fachwort zufällig in der Description steht.

**Hooks sind unklassifizierbar.** 69 der 152 Hooks liegen in `meta`, der Rest verteilt sich nach Zufallstreffern: `after-shell-execution` → `testing`, `before-read-file` → `security, testing`, `after-mcp-execution` → `backend`. Grundlage ist bei fast allen die Shebang-Zeile (siehe Abschnitt 3).

### 2.3 Vorschlag: zehn Absichts-Kategorien

Wer die Bibliothek befragt, kommt nicht mit „ich brauche etwas aus dem Bereich Backend", sondern mit einer Situation. Diese zehn decken die Fälle ab, die in `harness-build/SKILL.md` und in unseren Rezepten tatsächlich vorkommen:

| Absicht (`intent`) | Die Frage dahinter | Deckt heutige Domänen ab |
|---|---|---|
| `verstehen` | „Ich übernehme eine fremde Codebasis und weiss nicht, wo ich anfange." | general, docs, meta |
| `bauen` | „Ich schreibe neuen Code in Stack X und will die Konventionen treffen." | frontend, backend, data-ai |
| `pruefen` | „Ich brauche Review-Qualität, die nicht von meiner Tagesform abhängt." | security, testing, general |
| `absichern` | „Ich will nicht, dass Secrets, Injections oder PII durchrutschen." | security |
| `testen` | „Tests fehlen, brechen oder flackern." | testing |
| `ausliefern` | „Mein Deployment bricht / ich muss auf Produktion." | devops |
| `diagnostizieren` | „Etwas ist kaputt und ich weiss nicht warum." | general, backend, devops |
| `umbauen` | „Der Code muss umgezogen, entkernt oder migriert werden." | general, backend |
| `dokumentieren` | „Das Wissen muss aus den Köpfen raus." | docs, product |
| `harness-bauen` | „Ich richte Claude Code für dieses Projekt ein." | meta |
| `vermarkten` | „Das Produkt muss gefunden und verstanden werden." | seo, product, media |
| `rechtliches` | „Deutsche Rechtsfragen." | legal-de (Massen-Repo) |

Zwölf Einträge, davon zehn für Software; `vermarkten` und `rechtliches` sind Randbereiche, gehören aber dazu, weil sie 128 bzw. 24.543 Bausteine abdecken. Beachte, was die Liste **nicht** enthält: keine Sprache, kein Framework, keine Technikkategorie. Das sind Mirajes **Triggerwörter** — sie gehören in die Description (`cpp-reviewer` unterscheidet sich von `go-reviewer` allein durch „C++" bzw. „Go"), nicht in die Kategorie.

### 2.4 Urteil: zweite Ebene, kein Austausch

**Ein Austausch der Domänen gegen Absichten lohnt nicht.** Begründung:

- Die Domänen sind als *Grobfilter* brauchbar. `--domain seo` (61) oder `--domain devops` (48) schneidet den Suchraum wirksam. Kaputt sind vor allem `docs` (73 % Pfad-Artefakte) und `general` (283 — der Auffangkorb).
- Ein Austausch bedeutet, 1.050 Bausteine neu zu klassifizieren. Regex reicht dafür nicht: ob ein Baustein zu `verstehen` oder `umbauen` gehört, steht nicht in einem Stichwort. Das wäre ein LLM-Klassifikationslauf über den Gesamtbestand — bei jedem `/harness-update` erneut, für alle neuen Bausteine.
- Der Katalog wird von `extract` **vollständig neu erzeugt**. Eine von Hand gepflegte Absichts-Zuordnung würde bei jedem Update überschrieben, wenn sie nicht ausserhalb von `index.json` liegt.

**Was stattdessen: eine Absichts-Ebene neben den Domänen, als Datei gepflegt statt berechnet.**

Der Ansatz existiert im Keim bereits. `harness-build/SKILL.md` führt in den Zeilen 88–93 eine Symptomtabelle („Reviews übersehen dieselben Fehler" → `search "code review" --type agent`; „Keiner traut sich an den Code" → `search "codebase onboarding"`; „Deployments schlagen fehl" → `search "deployment ci" --domain devops`). Das ist eine Absichts-Ebene mit sechs Einträgen, hartkodiert in einer Skill-Datei, ohne Verbindung zum Katalog. Der Vorschlag ist, sie herauszuziehen und aufzuwerten — `catalog/intents.yaml`, von Hand gepflegt, überlebt jedes `extract`:

```yaml
- id: verstehen
  frage: "Ich übernehme eine fremde Codebasis und weiss nicht, wo ich anfange."
  suche: ["codebase onboarding", "architecture map", "code tour"]
  domains: [general, docs, meta]
  anker:                       # Bausteine, die hier immer oben stehen müssen
    - msitarzewski__agency-agents/agent/codebase-onboarding-engineer
    - Egonex-AI__Understand-Anything/skill/understand-onboard
    - affaan-m__ecc/skill/repo-scan
```

Dazu ein Subcommand `harness.mjs intent <id>`, der die hinterlegten Suchen ausführt, die Anker vorn einsortiert und den Rest anhängt. Aufwand: ein halber Tag für das CLI, ein Tag für die zwölf Einträge. Das ist eine Grössenordnung billiger als eine Neuklassifikation und erhält beide Zugänge — Technikfilter für den, der weiss was er sucht, Absichtsfilter für den, der nur ein Symptom hat.

**Was am Domänen-Schnitt trotzdem repariert gehört** (billig, unabhängig von der Absichts-Ebene):

- Den Dateipfad aus `classify()` entfernen oder auf die letzten zwei Pfadsegmente begrenzen. Das allein befreit `docs` von 163 Fehleinträgen.
- Ordner mit Sprachkürzeln (`ja-JP`, `zh-CN`, …) beim `walk` überspringen. Siehe Abschnitt 5.1.
- Die Wortlisten der `data-ai`- und `media`-Regeln entschärfen: `model`, `agent`, `render` sind zu häufig. `\bmodel\b` sollte mindestens zu `\b(ml model|model training|fine-?tun)\b` werden.

---

## 3. Descriptions als Routing-Signale — Qualität unseres Bestands

Mirajes Regel: `name` und `description` sind **Routing-Signale**. Die Description muss an der **Nutzeranfrage** ausgerichtet sein, nicht am Skill selbst. Zwei Skills unterscheiden sich brauchbar, wenn genau ein Wort in der Description den Fall trennt (`report-html` vs. `report-pdf` über das Wort „PDF").

### 3.1 Stichprobe

25 Bausteine aus 6 Repos, gezogen über `search` zu den Themen code review, testing, deployment, onboarding, design, incident, plus zwei Vollabzüge (`--type hook`, `--repo multica`). Bewertet wurde nur, was der Agent tatsächlich sieht: die Trefferzeile aus `search`.

**Kategorie A — an der Nutzeranfrage ausgerichtet (11 von 25):**

| Baustein | Was es richtig macht |
|---|---|
| `affaan-m__ecc/skill/cpp-testing` | „**Use only when** writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests" — Situation, Triggerwort *C++*, und eine ausdrückliche Obergrenze. Bestes Beispiel im Bestand |
| `anthropics__skills/skill/canvas-design` | „**You should use this skill when the user asks to** create a poster…" — wörtlich die Nutzeranfrage |
| `nextlevelbuilder/agent/design-review` | „Use PROACTIVELY **after any front-end change and before calling UI work complete**" — Zeitpunkt statt Thema |
| `affaan-m__ecc/agent/cpp-reviewer` · `agent/go-reviewer` | identische Schablone, trennscharf allein über das Sprachwort |
| `affaan-m__ecc/skill/inherit-legacy-style` | „Use when the user types `/inherit-legacy-style`, or when onboarding an AI coding agent onto a legacy project" |
| `affaan-m__ecc/skill/python-testing` · `anthropics/skill/brand-guidelines` | „Use when writing or improving Python tests" bzw. „Use it when …" |
| `Egonex-AI/skill/understand-chat` · `skill/understand-explain` | beide „Use when you need …" — richtig gebaut, aber untereinander kaum trennbar |
| `affaan-m__ecc/agent/code-reviewer` | „Use immediately after writing or modifying code" — richtig gebaut, aber siehe C |

**Kategorie B — beschreibt nur sich selbst (7 von 25):**

| Baustein | Description | Fehlt |
|---|---|---|
| `affaan-m__ecc/command/code-review` | „Review code for quality, security, and maintainability" | jeder Auslöser |
| `mattpocock__skills/skill/code-review` | „Two-axis review of the diff between HEAD and a fixed point the user supplies:" | endet im Doppelpunkt — die Beschreibung ist der Anfang einer Liste |
| `msitarzewski/agent/code-reviewer` | „Expert code reviewer who provides constructive, actionable feedback…" | Rollenbeschreibung statt Situation |
| `affaan-m__ecc/skill/e2e-testing` | „Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies" | Merkmalsliste; sagt nicht, wann |
| `mattpocock__skills/skill/grill-me` | „A relentless interview to sharpen a plan or design." | stimmungsvoll, aber ohne Anlass |
| `msitarzewski/agent/incident-response-commander` | „Expert incident commander specializing in production incident management…" | Persona statt Anfrage |
| `msitarzewski/agent/incident-responder` | „Digital forensics and incident response specialist who leads breach investigations…" | Persona; nicht von der Zeile darüber trennbar |

**Kategorie C — als Routing-Signal unbrauchbar (7 von 25):**

| Baustein | Description im Katalog |
|---|---|
| `affaan-m__ecc/skill/production-audit` | „日本語翻訳：このファイルは production-audit 用の日本語翻訳が必要です" (Platzhalter) |
| `affaan-m__ecc/skill/perl-testing` | derselbe Platzhalter |
| `affaan-m__ecc/skill/csharp-testing` | echte Prosa, aber ausschliesslich japanisch |
| `affaan-m__ecc/hook/after-file-edit` | `!/usr/bin/env node` |
| `affaan-m__ecc/hook/design-quality-check` | `!/usr/bin/env node` |
| `multica-ai__multica/hook/use-auto-scroll` | „Re-running the initial scroll-to-bottom on every effect mount would" (abgeschnittener Code-Kommentar) |
| `multica-ai__multica/hook/index` | *(keine Beschreibung)* |

### 3.2 Das Ergebnis in Zahlen

**11 von 25 (44 %) an der Nutzeranfrage ausgerichtet, 7 (28 %) rein selbstbeschreibend, 7 (28 %) unbrauchbar.** Vier davon — die vier `code-review`-Varianten — sind untereinander nicht unterscheidbar.

Zwei der drei Kategorien lassen sich über das CLI auf den Gesamtbestand hochrechnen:

- `search "usr/bin/env"` → **68 Bausteine** führen ihre Shebang-Zeile als Beschreibung. Bei 152 Hooks sind das **45 % aller Hooks**. Ursache ist `hookDescription()` in `harness.mjs` (Zeile 416): sie nimmt den ersten Kommentar der Datei — und das ist bei Skripten die Shebang.
- `search "日本語翻訳"` → **25 Bausteine** sind reine Übersetzungsplatzhalter ohne Inhalt. Weitere 138 sind echte, aber ausschliesslich japanische Beschreibungen (163 minus 25).

Konservativ gerechnet: **rund 230 der 1.050 Bausteine (22 %) haben keine Description, die einen deutsch- oder englischsprachigen Agenten routen könnte.**

### 3.3 Die Überlappungen, die tatsächlich schaden

**Der `code-review`-Cluster.** `search "code review"` liefert 231 Treffer; die ersten vier sind `affaan-m__ecc/agent/code-reviewer`, `affaan-m__ecc/command/code-review`, `mattpocock__skills/skill/code-review`, `msitarzewski/agent/code-reviewer`. Vier Repos, vier Typen, austauschbare Beschreibungen. Miraje: „überlappende Descriptions führen dazu, dass der Agent den falschen oder gar keinen Skill zieht." Bei uns kommt hinzu, dass die vier auch noch **unterschiedliche Bausteintypen** sind — der Agent müsste aus der Description ableiten, ob er einen Subagenten mit eigenem Kontextfenster oder einen Slash-Command will. Das steht dort nirgends.

**Der Typ-Drilling in `ecc`.** `react-reviewer` (agent), `react-review` (command) und der zugehörige Skill teilen sich denselben Beschreibungstext. Das ist ein Problem, das Miraje nicht hatte — er verwaltet nur Skills. Wir katalogisieren fünf Typen und der Typ ist das eigentliche Entscheidungskriterium (siehe `knowledge/02`), taucht in der Description aber nie auf.

**Der positive Gegenbeweis.** Die Familie `cpp-reviewer` / `go-reviewer` / `rust-reviewer` / `python-reviewer` benutzt eine identische Schablone und unterscheidet sich ausschliesslich durch das Sprachwort. Genau Mirajes `report-html`/`report-pdf`-Muster — und es funktioniert: eine Suche nach „go review" zieht zuverlässig den richtigen. Wo eine Description-Schablone mit einem harten Triggerwort existiert, ist das Routing sauber. Das ist die Vorlage.

### 3.4 Prüfregeln für `/harness-build`

Anwendbar vor dem `install`, allein auf Basis dessen, was `search`/`show` ausgeben. Jede Regel ist so formuliert, dass sie mechanisch entscheidbar ist.

| # | Regel | Reaktion bei Verstoss |
|---|---|---|
| R1 | Description länger als 20 Zeichen und nicht `!/usr/bin/env …`, nicht `(keine Beschreibung)` | **Nicht installieren**, ohne `show` und Blick in die Quelldatei |
| R2 | Description enthält lateinische Schrift; keine reinen CJK-Beschreibungen | **Nicht installieren.** Der englische Zwilling steht meist unter demselben Namen in einem anderen Pfad — per `show` prüfen |
| R3 | Description enthält keinen Übersetzungsplatzhalter (`翻訳が必要`, `TODO`, `TBD`, `placeholder`) | **Nicht installieren** |
| R4 | Description nennt eine **Situation** („use when", „after", „before", „when the user asks") — nicht nur eine Merkmalsliste | Installieren erlaubt, aber Description im Zielprojekt nachschärfen und im Bericht als nachgebessert ausweisen |
| R5 | Wenn zwei Kandidaten der Auswahl >60 % Wortüberschneidung in Name+Description haben: **nur einen** installieren | Den mit der spezifischeren Description; die Verwerfung mit Begründung in den Bericht |
| R6 | Ein Kandidat trägt mehr als drei Domänen | Domänenangabe für diesen Baustein ignorieren — sie ist Rauschen, nicht Signal |
| R7 | Bei Kandidaten desselben Namens in mehreren Typen (agent/command/skill): Typ aktiv nach `knowledge/02-bausteine.md` entscheiden | Entscheidung im Bericht begründen |
| R8 | Bei über 100 Treffern: nicht die Top-25 durchgehen, sondern mit `--type` und `--domain` nachfiltern oder das Suchwort verengen | Sonst ist die sichtbare Auswahl vom Score-Zufall bestimmt |

R1–R3 sind harte Gates und gehören perspektivisch ins CLI (`search --strict`), damit der Agent unbrauchbare Bausteine gar nicht erst sieht. R4–R8 sind Urteilsregeln und gehören in `harness-build/SKILL.md`.

---

## 4. Die Eval-Lücke

Mirajes Vorfall: Modell-Upgrade, keine Zeile im Skill geändert, Agent befolgte den Skill nicht mehr — das neue Modell gewichtete den Anfang stärker, die kritische Anweisung stand am Ende. Sein Merksatz: Skills sind keine Dokumentation, sondern **Verträge, versioniert gegen ein Modell**.

Bei uns ist die exponierte Stelle eine andere. Wir schreiben die Skills nicht, wir wählen sie aus. Das driftende Verhalten ist deshalb nicht „befolgt der Agent den Skill", sondern: **Findet der Agent für eine gegebene Absicht noch denselben Baustein?** Das driftet aus drei unabhängigen Gründen: das Modell ändert sich, der Katalog ändert sich (`/harness-update` zieht 13 Repos, die uns nicht gehören), oder der Score in `cmdSearch` ändert sich. Ohne Messung merkt es niemand — die Suche gibt nie einen Fehler zurück, nur ein anderes Ergebnis.

### 4.1 Das minimal sinnvolle Verfahren

Eine Liste von Testanfragen mit erwarteten Treffern, gegen die `search` läuft. Zwei Stufen:

**Stufe 1 — deterministisch, ohne Modell.** Reines `search`-Verhalten, läuft in Sekunden und kann an jedes `/harness-update` gehängt werden. Pro Fall: eine Anfrage, die Bausteine die **im Ergebnis stehen müssen** (`must`), optional welche die **nicht** darin stehen dürfen (`verboten`), und ab welcher Position das noch zählt (`top`).

**Stufe 2 — mit Modell, seltener.** Man gibt dem Agenten die Nutzerabsicht im Klartext („mein Deployment bricht seit dem Umzug auf Kubernetes") und lässt ihn ohne weitere Hilfe suchen und auswählen. Bewertet wird nur, ob die `must`-Bausteine in seiner Endauswahl stehen. Das ist der Eval, der Mirajes Fall abbildet: Er misst nicht den Katalog, sondern ob `harness-build/SKILL.md` das Modell noch führt. Läuft manuell — bei jedem Modellwechsel, sonst nie.

### 4.2 Dateiformat und Ort

`evals/routing.jsonl` — eine Zeile pro Fall, damit ein neuer Fall ein Einzeiler-Diff ist und ein Lauf zeilenweise über die Datei iterieren kann:

```jsonl
{"id":"deploy-bricht","stufe":1,"q":"deployment ci","flags":["--domain","devops"],"top":10,"must":["affaan-m__ecc/skill/deployment-patterns"],"verboten":[],"notiz":"Kern-Treffer für die Absicht 'ausliefern'"}
{"id":"fremde-codebasis","stufe":1,"q":"codebase onboarding","top":10,"must":["msitarzewski__agency-agents/agent/codebase-onboarding-engineer","Egonex-AI__Understand-Anything/skill/understand-onboard"],"verboten":[],"notiz":"Absicht 'verstehen'"}
{"id":"go-review","stufe":1,"q":"go code review","top":5,"must":["affaan-m__ecc/agent/go-reviewer"],"verboten":["affaan-m__ecc/agent/cpp-reviewer"],"notiz":"Trennschärfe-Test nach Mirajes report-html/report-pdf-Muster"}
{"id":"keine-jp-stummel","stufe":1,"q":"production audit","top":10,"verboten":["affaan-m__ecc/skill/production-audit"],"must":[],"notiz":"Platzhalter darf nicht als Treffer erscheinen"}
{"id":"deploy-klartext","stufe":2,"absicht":"Mein Deployment bricht seit dem Umzug auf Kubernetes.","must":["affaan-m__ecc/skill/kubernetes-patterns"],"notiz":"prüft harness-build, nicht den Katalog"}
```

Daneben `evals/README.md` mit dem Modellstand des letzten Stufe-2-Laufs — das ist die Versionierung gegen ein Modell, die Miraje meint, z. B.: *„Letzter Stufe-2-Lauf: 2026-08-07, `claude-opus-5[1m]`, 11/12 bestanden. Fehlgeschlagen: `review-qualität` (zog command statt agent)."*

Ein Subcommand `harness.mjs eval [--stufe 1]` führt Stufe 1 aus und gibt eine Zeile pro Fall aus (`OK` / `FEHLT <id> auf Position n` / `VERBOTEN <id> auf Position n`) plus eine Bilanz. Exit-Code ≠ 0 bei Fehlschlägen, damit `/harness-update` daran hängen kann.

**Umfang, der sich lohnt: 12–20 Fälle.** Einer pro Absicht aus Abschnitt 2.3, plus drei Trennschärfe-Fälle (`go-review`), plus zwei Negativ-Fälle gegen die bekannten Müll-Einträge. Mehr wird nicht gepflegt und verrottet.

### 4.3 Woran man Drift erkennt

| Symptom im Eval-Lauf | Wahrscheinliche Ursache |
|---|---|
| Ein `must` fällt von Position 3 auf 14, sonst nichts | Katalog gewachsen — neue Konkurrenz aus einem der 13 Repos. Kein Handlungsbedarf, ausser `top` war zu grosszügig |
| Mehrere `must` fallen gleichzeitig weg | Ein Repo hat umbenannt oder umsortiert. `CHANGELOG.md` prüfen |
| `must` existiert gar nicht mehr | Baustein upstream gelöscht. Eval-Fall auf den Nachfolger umschreiben oder streichen — mit Notiz |
| Stufe 1 grün, Stufe 2 rot | **Das ist Mirajes Fall.** Der Katalog ist in Ordnung, das Modell folgt `harness-build/SKILL.md` nicht mehr. Skill-Datei prüfen: steht die kritische Anweisung weit hinten? |

Der letzte Fall ist der einzige, den man ohne Eval niemals bemerkt — und der einzige, gegen den nur ein Modelllauf hilft.

---

## 5. Die fünf Governance-Aspekte, auf eine Katalog-Bibliothek übertragen

Der entscheidende Unterschied zu Miraje: **er besitzt seine Skills, wir nicht.** Wir katalogisieren 13 fremde Repos. Wir können keinen Baustein versionieren, keinen Maintainer benennen, keine Deprecation-Warnung in eine fremde `SKILL.md` schreiben. Was wir kontrollieren, sind genau zwei Stellen: **die Aufnahme in `sources.txt`** und **den Weg vom Katalog ins Zielprojekt** (`search` → `show` → `install`). Jeder Governance-Mechanismus, der nicht an einer dieser beiden Stellen ansetzt, funktioniert bei uns nicht.

### 5.1 Admission — anwendbar, aber auf anderer Ebene

Miraje: Gehört dieser Skill überhaupt in die Bibliothek, oder in einen bestehenden? Automatisiertes Gate mit Human-in-the-Loop.

Bei uns gibt es **zwei** Admission-Entscheidungen, und beide sind heute ungeregelt:

**(a) Aufnahme eines Repos in `sources.txt`.** Das ist unser echtes PR-Review-Äquivalent — die einzige Stelle, an der ein Mensch entscheidet. Es gibt dafür keine Kriterien. Ergebnis: `multica-ai/multica` liefert 36 Bausteine, von denen die Mehrzahl **React-Hooks aus einer Anwendung** sind, keine Claude-Code-Bausteine:

```
node tools/harness.mjs show multica-ai__multica/hook/use-auto-scroll
  Typ     hook
  Quelle  …\multica-ai__multica\packages\ui\hooks\use-auto-scroll.ts
```

Der Extraktor erkennt Hooks am Ordnernamen `hooks/` (Zeile 309) und kann ein React-`hooks/`-Verzeichnis nicht von einem Claude-Code-`hooks/`-Verzeichnis unterscheiden. Ein Admission-Kriterium („liefert das Repo Claude-Code-Bausteine oder Anwendungscode?") hätte das beim Aufnehmen abgefangen.

**(b) Aufnahme eines extrahierten Bausteins in den Katalog.** Automatisierbar. Ein Baustein, der R1–R3 aus Abschnitt 3.4 verletzt, gehört nicht in den Standardzugriff. Konkret: `extract` markiert ihn als `quarantaene: true`, analog zum bestehenden `bulk`-Mechanismus — er bleibt katalogisiert, taucht in der Standardsuche aber nicht auf. Erreichbar über `--all`. Das trifft die 68 Shebang-Hooks, die 25 Platzhalter und die 138 rein japanischen Beschreibungen: **rund 230 Bausteine, die heute den Suchraum verstopfen.**

Zusätzlich gehört `docs/ja-JP/` (und Geschwister) in `SKIP_DIRS`. Das ist heute nicht nur Rauschen, sondern verdrängt Inhalt: `extract` dedupliziert über die ID (`seen.has(it.id)`), und wer beim `walk` zuerst kommt, gewinnt. `docs/…` kommt alphabetisch vor `skills/…`, also **überschreibt der japanische Platzhalter das englische Original**. Genau deshalb ist `affaan-m__ecc/skill/production-audit` im Katalog ein leerer Stummel, obwohl das Repo den Skill in Vollform enthält.

Human-in-the-Loop bleibt bei (a). (b) ist reine Automatik.

### 5.2 Ownership — **nicht anwendbar. Ersatz: Herkunftsnachweis.**

Wir können keine Maintainer benennen. Ein `CODEOWNERS` über fremde Bausteine wäre eine Lüge — wir haben weder Zugriff noch Verantwortung. Was wir stattdessen brauchen, ist die Frage, die Ownership eigentlich beantwortet: **Wen frage ich, wenn dieser Baustein Ärger macht?** Antwort bei uns: das Upstream-Repo. Der Ersatz ist ein lückenloser Herkunftsnachweis.

Er existiert bereits zur Hälfte. `install` schreibt `.claude/harness-manifest.json` mit `id`, `from`, `sourcePath` und `catalogGeneratedAt` (Zeilen 837–851). Was fehlt: der **Commit-Hash** des Quell-Repos. `extract` erhebt ihn bereits (`repos[].head`, Zeile 444), schreibt ihn aber nicht ins Manifest. Ohne ihn lässt sich nachträglich nicht feststellen, welche Fassung eines Bausteins in einem Projekt liegt.

Zweiter Teil: eine Spalte „Vertrauen" in `sources.txt` bzw. `INDEX.md`. `anthropics/skills` und `mattpocock/skills` sind gepflegte Quellen mit erkennbarem Qualitätsanspruch; `multica-ai/multica` ist eine Anwendung, die zufällig einen `hooks/`-Ordner hat. Diese Unterscheidung ist Ownership-Ersatz: nicht *wer pflegt den Baustein*, sondern *wie sehr traue ich der Quelle*.

### 5.3 Boundaries — teilweise anwendbar, und wir tun es heute nicht

Miraje: Allow-List für Tools pro Skill, Tools sind zugriffskontrolliert. Das können wir **nicht durchsetzen** — wir kopieren fremde Dateien, wir schreiben ihr Frontmatter nicht. Aber wir können es **sichtbar machen**, und das ist der Teil, den wir heute liegen lassen.

`extract` liest `allowed-tools` für Skills und Commands sowie `tools` für Agents bereits aus und legt sie in `meta` ab (Zeilen 254, 281, 302). `show` gibt sie aus. **`search` gibt sie nicht aus.** Der Agent, der aus 231 Treffern auswählt, sieht also nicht, dass Kandidat A nur `Read, Grep` will und Kandidat B uneingeschränkten `Bash`-Zugriff. Bei 25 sichtbaren Treffern kann er nicht für jeden ein `show` machen.

Konkret umsetzbar:

- Ein Warnhinweis in der `search`-Trefferzeile, wenn ein Baustein `Bash`, `Write` oder gar kein `allowed-tools` deklariert. Eine Zeile Ausgabe, kein neues Konzept.
- Ein `install`-Gate: Bausteine, die Schreib- oder Shell-Rechte anfordern, werden nur mit ausdrücklicher Bestätigung installiert. Das ist die einzige Boundary, die wir tatsächlich **durchsetzen** können, weil sie an unserer Grenze liegt.
- Hooks sind der Sonderfall: ein Hook läuft immer, ohne Modellentscheidung. Ein Hook aus einem fremden Repo ist damit die risikoreichste Kategorie überhaupt — und 45 % von ihnen haben nicht einmal eine Beschreibung. **Hooks gehören grundsätzlich nur nach `show` und Lesen der Quelldatei installiert.** Das gehört als harte Regel in `harness-build/SKILL.md`.

### 5.4 Lifecycle — **nicht anwendbar. Ersatz: Divergenz-Erkennung.**

Semantische Versionierung, Deprecation-Warnungen, Changelog pro Skill — nichts davon können wir für fremde Bausteine leisten. Ein Repo kann jederzeit umbenennen, löschen oder umbauen, ohne uns zu informieren. Was wir haben, ist die Gegenrichtung: **wir erkennen Änderungen, statt sie anzukündigen.** `cmdUpdate` vergleicht bereits den Katalog vor und nach dem Sync und schreibt `Neu` / `Geändert` / `Entfernt` in `CHANGELOG.md` (Zeilen 887–923). Das ist ein Lifecycle-Ersatz auf Bibliotheksebene.

Was fehlt, ist der Bezug zu den **Projekten**, in denen die Bausteine gelandet sind. Ein Baustein, der upstream verschwindet, steht weiter in fünf Projekten und niemand erfährt es. Der fehlende Mechanismus: `harness.mjs drift --to <projekt>` — liest `.claude/harness-manifest.json`, gleicht gegen den aktuellen Katalog ab und meldet drei Zustände:

| Zustand | Bedeutung |
|---|---|
| `entfernt` | Der Baustein existiert upstream nicht mehr. Die Kopie im Projekt ist verwaist — funktioniert weiter, wird aber nie wieder aktualisiert |
| `geändert` | Upstream hat sich `bytes` oder `description` geändert. Vielleicht ein Bugfix, vielleicht eine Bedeutungsverschiebung. Erfordert einen Menschen |
| `abgewichen` | Die Kopie im Projekt wurde lokal bearbeitet. Dann ist sie ein Fork und darf nicht blind überschrieben werden |

Das ist die ehrliche Version von Lifecycle bei fremdem Code: keine Deprecation-Policy, sondern ein Divergenz-Melder.

### 5.5 Coherence — anwendbar, und hier gehört der Eval hin

Miraje: periodische Audits und Validierungsläufe, damit die Bibliothek als Ganzes stimmig bleibt. Das ist der Aspekt, der bei uns **eins zu eins übertragbar** ist, denn Kohärenz ist eine Eigenschaft des Katalogs — und der Katalog gehört uns, auch wenn die Bausteine es nicht tun.

Der Audit ist genau der Eval aus Abschnitt 4, plus eine Bestandshygiene-Prüfung, die `extract` nebenbei erhebt und in `CHANGELOG.md` schreibt:

```
Katalog-Hygiene 2026-08-07:
  ohne brauchbare Description      230  (22 %)   ← Ziel: < 5 %
  mit mehr als 3 Domänen            ?           ← Ziel: < 10 %
  in Domäne 'general' (Auffang)    283  (27 %)   ← Ziel: < 15 %
  Namensdubletten über Repos         ?           ← nur berichten
```

Drei Kennzahlen, bei jedem `/harness-update` erhoben, als Zeitreihe im Changelog. Wenn „ohne brauchbare Description" nach einem Update springt, hat ein Repo etwas getan, das wir sehen müssen. Das ist Coherence ohne Bürokratie — Miraje: „Governance muss keine Bürokratie sein, es hängt an der Automatisierung."

---

## 6. Massnahmen, priorisiert

### Sollten wir tun

| # | Massnahme | Warum | Aufwand | Wohin |
|---|---|---|---|---|
| M1 | `docs/ja-JP/` und Geschwister-Sprachordner in `SKIP_DIRS` aufnehmen | 163 Bausteine (15 %) sind Übersetzungen; 25 davon **überschreiben per ID-Dedup ihr englisches Original** und machen echte Skills unauffindbar. Grösster Einzelgewinn im Verhältnis zum Aufwand | 15 Min | CLI (`harness.mjs`, `SKIP_DIRS`) |
| M2 | Quarantäne-Flag in `extract`: Bausteine mit Shebang-, Leer- oder Platzhalter-Description aus der Standardsuche nehmen (analog `bulk`) | ~230 Bausteine verstopfen den Suchraum, ohne je installierbar zu sein. Mechanismus existiert bereits | 2 Std | CLI |
| M3 | `hookDescription()` reparieren: Shebang überspringen, erst den folgenden Kommentar nehmen | Behebt 68 Fälle an der Wurzel statt sie zu verstecken. Ergänzt M2, ersetzt es nicht | 30 Min | CLI |
| M4 | Prüfregeln R1–R8 in `harness-build/SKILL.md` aufnehmen | Der Agent installiert heute ungeprüft, was oben in der Trefferliste steht. R5 (Überlappung) und R7 (Typwahl) sind die, die Fehlgriffe verhindern | 1 Std | Skill |
| M5 | `evals/routing.jsonl` mit 12–20 Fällen anlegen + `harness.mjs eval` (Stufe 1) | Ohne das merkt niemand, wenn ein Update oder ein Modellwechsel das Routing zerlegt. Stufe 1 kostet Sekunden und kann an `/harness-update` hängen | 1 Tag | CLI + neue Datei |
| M6 | Dateipfad aus `classify()` entfernen oder auf die letzten zwei Segmente begrenzen | Beseitigt die Ursache dafür, dass `docs` zu 73 % aus einem Ordnernamen besteht. Zusammen mit M1 wird `docs` erstmals eine echte Domäne | 30 Min | CLI |
| M7 | Commit-Hash des Quell-Repos ins `harness-manifest.json` schreiben | Ownership-Ersatz. `extract` erhebt ihn bereits, er wird nur nicht durchgereicht. Ohne ihn ist nicht feststellbar, welche Fassung in einem Projekt liegt | 30 Min | CLI |
| M8 | `search` zeigt Tool-Rechte in der Trefferzeile; `install` verlangt Bestätigung für `Bash`/`Write` und für **alle** Hooks | Die einzige Boundary, die wir durchsetzen können. Hooks laufen ohne Modellentscheidung — sie ungeprüft zu kopieren ist der riskanteste Vorgang im ganzen Ablauf | 3 Std | CLI + Skill |
| M9 | `catalog/intents.yaml` mit den zwölf Absichten + `harness.mjs intent <id>` | Der Absichts-Schnitt, den Miraje fordert, ohne 1.050 Bausteine neu zu klassifizieren. Ersetzt die hartkodierte Symptomtabelle in `harness-build` | 1,5 Tage | CLI + neue Datei + Skill |
| M10 | Aufnahmekriterien für `sources.txt` in `knowledge/` festhalten, plus Spalte „Vertrauen" | Unser einziges echtes Human-in-the-Loop-Gate. Hätte `multica-ai/multica` (React-Hooks statt Claude-Bausteine) abgefangen | 2 Std | Doku |
| M11 | Katalog-Hygiene-Kennzahlen bei jedem `extract` erheben und in `CHANGELOG.md` schreiben | Macht Coherence-Verfall sichtbar, bevor jemand ihn spürt. Vier Zahlen, keine Bürokratie | 2 Std | CLI |

Empfohlene Reihenfolge: **M1 → M3 → M6 → M2** (ein halber Tag, beseitigt die Ursachen von rund 250 Fehleinträgen), dann **M4 → M7 → M8** (Prüfung und Sicherheit an der Installationsgrenze), dann **M5**, dann **M9 → M10 → M11**.

### Wäre theoretisch schön

| Massnahme | Warum wir es (noch) nicht tun |
|---|---|
| Embedding-basierte Suche statt Wort-Score | Behebt das ODER-Problem und die 231-Treffer-Listen wirklich. Aber: Index bauen, Modell einbinden, bei jedem Update neu berechnen — und der Nutzen hängt daran, dass die Descriptions etwas taugen. Erst nach M1–M3 sinnvoll, sonst betten wir Shebangs ein |
| UND-Semantik oder Phrasensuche in `cmdSearch` | Billiger als Embeddings und behebt einen Teil desselben Problems. Risiko: bestehende Suchen in `harness-build` und den Rezepten liefern schlagartig andere Ergebnisse. Nur zusammen mit M5 machen, damit man den Effekt misst |
| LLM-gestützte Neuklassifikation aller Bausteine nach Absicht | Der saubere Miraje-Schnitt. Kosten: ein Modelllauf über 1.050 Bausteine bei jedem Update, plus derselbe Lauf über 24.543 im Massen-Repo, wenn man es je öffnet. M9 liefert 80 % davon für 5 % der Kosten |
| Automatisches Nachschreiben schlechter Descriptions beim `install` | Verlockend — und genau die Stelle, an der wir aufhören, fremde Bausteine zu katalogisieren, und anfangen, sie zu forken. Dann brauchen wir echtes Lifecycle-Management. Bewusst nicht |
| `harness.mjs drift --to <projekt>` (Abschnitt 5.4) | Richtig gedacht, aber wertlos, solange kaum Projekte aus der Bibliothek installiert haben. Nachziehen, sobald das dritte Projekt ein Manifest hat |

### Ausdrücklich nicht

- **Keine eigene Versionierung fremder Bausteine.** Wir sind kein Paketmanager. Der Commit-Hash im Manifest (M7) ist die richtige Auflösungstiefe.
- **Keine Maintainer-Zuordnung.** Ein `CODEOWNERS` über Code, den wir nicht kontrollieren, erzeugt Scheinsicherheit.
- **Kein Governance-Prozess ohne Automatisierung.** Jede Massnahme oben läuft in `extract`, `search`, `install` oder in einer Datei, die der Agent ohnehin liest. Eine Checkliste, die ein Mensch von Hand abarbeiten müsste, wird nach dem dritten Update nicht mehr abgearbeitet.

---

## Quellen

**Vortrag (Anlass dieser Datei):**

- Yogendra Miraje (Principal AI Engineer, FactSet), *„Building skill-centric agentic products"* — https://www.youtube.com/watch?v=7jjudsEhBtM · abgerufen 2026-08-07
  Verwertet: Skills als Produktfeatures; `name`/`description` als Routing-Signale; die Regel, die Description an der Nutzeranfrage auszurichten (`report-html`/`report-pdf`); Schnitt nach Nutzerabsicht statt Datenmodell (`estimates-analysis` → `earnings-preparation`); Skill-Drift nach Modell-Upgrade und Skills als versionierte Verträge; die Schwellen ~10 / ~100; die fünf Governance-Aspekte Admission, Ownership, Boundaries, Lifecycle, Coherence.

**Geprüfte eigene Dateien** (alle 2026-08-07):

- `INDEX.md` — Bestand nach Typ, Domäne und Repo; Stand 2026-08-07 08:38
- `tools/harness.mjs` — `DOMAIN_RULES` (Z. 157–170), `classify()` (Z. 172–176), `SKIP_DIRS` (Z. 36–39), `hookDescription()` (Z. 416–419), Hook-Erkennung über Ordnernamen (Z. 309), ID-Dedup in `extractRepo` (Z. 227–231), `cmdSearch`-Score (Z. 633–663), `cmdUpdate`-Diff (Z. 887–923), `cmdInstall`-Manifest (Z. 837–851)
- `C:\Users\info\.claude\skills\harness-build\SKILL.md` — Symptomtabelle Z. 88–93, Ablauf `search` → `show` → `install`
- `knowledge/01-harness-doktrin.md`, `knowledge/03-vorbilder.md` — Doktrin und Formatvorbild

**CLI-Läufe, aus denen die Zahlen stammen** (alle 2026-08-07, Katalogstand 2026-08-07 08:38):

- `stats`
- `search` mit: `ja-jp` (163) · `ja-jp --domain docs` (163) · `日本語翻訳` (25) · `usr/bin/env` (68) · `"" --type hook --domain meta` (69) · `code review` (231) · `api design` (184) · `security audit` (120) · `review` (107) · `refactor` (15) · `documentation` (8) · `"" --repo` für multica, mattpocock, anthropics, nextlevelbuilder, msitarzewski
- `show` für: `affaan-m__ecc/skill/production-audit`, `affaan-m__ecc/skill/python-testing`, `affaan-m__ecc/skill/competitive-platform-analysis`, `multica-ai__multica/hook/use-auto-scroll`

**Nicht verifiziert / Vermutung:** Die Zahl „rund 230 Bausteine ohne brauchbare Description" (Abschnitt 3.2) ist die Summe aus 68 Shebang-Treffern und 163 `ja-jp`-Treffern abzüglich einer geschätzten Überschneidung; sie wurde nicht mengenmässig disjunkt gezählt, weil `catalog/index.json` per Regel nicht gelesen werden darf. Die Werte in der Hygiene-Tabelle (Abschnitt 5.5) für „mehr als 3 Domänen" und „Namensdubletten" sind offen — sie lassen sich erst mit M11 erheben. Die Aussage zur `walk`-Reihenfolge in Abschnitt 5.1 (alphabetisch, `docs/` vor `skills/`) ist aus dem beobachteten Ergebnis erschlossen (`production-audit` löst auf `docs/ja-JP/…` auf, `python-testing` auf `.kiro/skills/…`), nicht aus einem Testlauf mit protokollierter Verzeichnisreihenfolge.
