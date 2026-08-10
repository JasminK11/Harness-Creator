---
type: Governance
title: Governance — was ab rund tausend Bausteinen kippt
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
    title: Bestandsübersicht nach Typ, Domäne und Repo — Katalogstand 2026-08-07 08:57
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: harness-build-skill
    resource: .claude/skills/harness-build/SKILL.md
    title: Skill harness-build — Symptomtabelle und Ablauf search/show/install
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: cli-laeufe-2026-08-07
    resource: catalog/index.json
    title: CLI-Läufe stats/search/show vom 2026-08-07; Bestandszahlen und die Description-Messung in 3.2 am 2026-08-08 neu erhoben
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-08
  - id: duplikat-sichtung-2026-08-08
    resource: tools/harness.mjs
    title: show-Vergleiche der sieben Namensvettern-Paare offiziell/ecc (Abschnitt 3.5) am Katalogstand 2026-08-08; adversarial geprüfte Urteile aus Workflow-Lauf w3da4z86w, result.abgelehnteVorschlaege
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-08
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-05-07
tags: [governance, katalog, routing, descriptions, eval, admission, lifecycle, coherence]
---

# 04 — Governance: was ab rund tausend Bausteinen kippt

> **Abstract.** Unsere Bibliothek hat mit 1.099 Bausteinen im Standardzugriff Mirajes dritte Schwelle (~100) um den Faktor 11,0 überschritten — die Architektur ist dafür gebaut, die Governance ist bei null.
> Die Diagnose ist hart: Domänen entstehen aus Regex-Treffern statt aus Nutzerabsicht, 69 der 70 Hooks tragen als Beschreibung ihre Shebang-Zeile, ein Code-Fragment oder gar nichts (Messung in 3.2), und breite Suchen liefern über 100 Kandidaten mit austauschbaren Descriptions.
> Weil wir fremde Repos katalogisieren statt eigene Skills zu besitzen, sind drei von Mirajes fünf Governance-Aspekten bei uns nicht anwendbar — wir brauchen Ersatzmechanismen an der Katalog-Grenze, nicht am Baustein.
> **Stand.** Diese Diagnose bildet den Katalogstand 2026-08-08 19:36 ab, gegen den die Datei geschrieben wurde. M2 und M3 (Tabelle „Sollten wir tun") sind am 2026-08-10 umgesetzt: Standardzugriff jetzt 1.084, `search "usr/bin/env"` liefert 0 statt 56 Treffer. Die 1.099 und die 69-von-70-Zahl bleiben hier als Ausgangsbefund stehen, aktueller Stand im Nachtrag zu Abschnitt 3.2. <!-- lint:historisch -->

Anlass ist der Konferenzvortrag von **Yogendra Miraje** (Principal AI Engineer, FactSet), *„Building skill-centric agentic products"*. Er beschreibt eine Skill-Bibliothek, die dieselbe Kurve genommen hat wie unsere, und benennt die Punkte, an denen sie kippt. Diese Datei erzählt den Vortrag nicht nach, sondern misst unsere Bibliothek an seinen Aussagen.

Alle Zahlen unten stammen aus Läufen von `node tools/harness.mjs stats` und `search`. Die Bestandszahlen sind auf den Katalogstand 2026-08-08 19:36 nachgezogen; die Trefferzahlen einzelner `search`-Läufe stammen, wo im Text nicht anders datiert, aus dem Stand 2026-08-07 08:57 und sind seither nicht neu erhoben.

---

## 1. Wo wir auf der Skalierungsskala stehen

Miraje nennt drei Regime:

| Bestand | Was reicht | Wo wir stehen |
|---|---|---|
| bis ~10 | alle Skills in den System-Prompt schieben | weit überschritten |
| ab ~10 | Vorauswahl per Embeddings/Similarity oder kleinem Vorfilter-Modell | überschritten |
| ab ~100 | Hierarchie, Metadaten-Filter, **Governance** | 1.099 — Faktor 11,0 darüber |

**Die Architektur ist in Ordnung.** Wir haben genau das, was das dritte Regime verlangt: Hierarchie (`INDEX.md` mit 4,6 KB → `catalog/by-domain/*.md` → `search`/`show`), Metadaten-Filter (`--type`, `--domain`, `--repo`, `--limit`) und ein Mengen-Ventil (`!bulk` in `sources.txt` hält 24.543 Rechts-Bausteine aus der Standardsuche; ohne das wären wir bei 25.642 und jede Suche wertlos).

**Die Governance fehlt vollständig.** Kein Admission-Gate, keine Ownership, keine Boundaries, keine Lifecycle-Policy, keine Audits. Genau die Dimension, die Miraje ab 100 fordert, ist bei uns die einzige, die wir nie gebaut haben.

### Die Schwelle, die uns tatsächlich bindet

Mirajes Zahlen beschreiben, wie viele Skills ein Agent gleichzeitig unterscheiden muss. Unser Agent sieht nie 1.099 — er sieht die Trefferliste einer Suche. **Die relevante Grösse ist also nicht der Bestand, sondern die Trefferzahl pro Anfrage.** Und die liegt bei breiten Fragen weiterhin über Mirajes 100er-Schwelle:

| Suchanfrage | Treffer (ohne Massen-Repo) |
|---|---:|
| `search "review"` | 112 |
| `search "code review"` | 49 |
| `search "refactor"` | 18 |
| `search "api design"` | 10 |
| `search "documentation"` | 10 |
| `search "security audit"` | 5 |

Das ist bimodal: entweder man trifft ein seltenes Wort und bekommt eine brauchbare Liste, oder man trifft ein Allerweltswort und bekommt ein Regime, für das wir keine Vorauswahl haben. Der Agent bekommt per Default 25 davon zu sehen — sortiert nach einem Score, der Namenstreffer mit 10 und alles andere mit 3 gewichtet und kleine Bausteine mit +1 bevorzugt. Bei 112 Kandidaten ist die Auswahl der sichtbaren 25 damit weitgehend Zufall.

**Inzwischen entschärft:** `cmdSearch` wertet Mehrwortanfragen als **UND** und lockert erst dann auf Teiltreffer, wenn kein einziger Baustein alle Wörter trägt. Deshalb liefert `"code review"` (49) heute *weniger* Treffer als `"review"` (112) — je präziser der Nutzer seine Absicht formuliert, desto schärfer das Ergebnis. Eine frühere Fassung dieser Datei behauptete das Gegenteil (ODER-Semantik, 231 gegen 107); das galt für einen älteren Stand von `cmdSearch` und ist überholt. Das verbleibende Problem ist damit nicht mehr die Mehrwortsemantik, sondern allein die Trefferzahl bei Einwortsuchen.

---

## 2. Diagnose: unsere Domänen sind nach Datenmodell geschnitten

### 2.1 Wie die Klassifikation tatsächlich arbeitet

`DOMAIN_RULES` in `tools/harness.mjs` ist eine Liste aus **12 Regex-Regeln**. `classify()` wirft Name, Description und etwaige Zusatzfelder in einen String und gibt jede Domäne zurück, deren Regex trifft. Mehrfachtreffer sind erlaubt, ohne Gewichtung, ohne Reihenfolge.

**Warum hier 12, 13 und 12 nebeneinander stehen — und keine der Zahlen falsch ist.** `DOMAIN_RULES` enthält 12 Regeln. Trifft keine davon, fällt der Baustein auf `general` zurück; es gibt also **13 mögliche Domänenwerte**, und genau 13 Zeilen weist auch `node tools/harness.mjs stats` aus. In `catalog/by-domain/` liegen dagegen nur **12 Dateien**: `legal-de` fehlt dort, weil diese Domäne ausschliesslich aus dem Massen-Repo stammt und nicht in den Standardzugriff gehört. Regel-Anzahl, Wert-Anzahl und Datei-Anzahl messen drei verschiedene Dinge.

Zwei Konstruktionsfehler folgten daraus unmittelbar:

1. **Der Dateipfad war gleichberechtigtes Klassifikationssignal.** Ein Ordner namens `docs/` erzeugte die Domäne `docs`, unabhängig vom Inhalt. **Behoben:** `classify()` prüft den Pfad heute nur noch als Rückfallebene — dann, wenn Name und Description keinen einzigen Treffer liefern (Massnahme M6, Abschnitt 6).
2. **Die Kategorien sind Technikbegriffe.** `frontend`, `backend`, `testing`, `devops`, `media` beschreiben, *woraus* ein Baustein gemacht ist — nicht, *wofür* jemand ihn sucht. Genau der Schnitt, den Miraje an seinem eigenen Bestand refaktorieren musste (`estimates-analysis` → `earnings-preparation`). Das ist der Fehler, der **offen** ist.

### 2.2 Belege aus dem Katalog

**Die Domäne `docs` bestand zu drei Vierteln aus einem Ordnernamen — behoben.** `search "ja-jp"` lieferte 163 Treffer; `search "ja-jp" --domain docs` dieselben 163. Alle lagen unter `affaan-m__ecc/docs/ja-JP/…` und waren nur deshalb `docs`. Heute liefert dieselbe Suche **1 Treffer**, und `search "日本語翻訳"` **keinen einzigen**: `TRANSLATION_RE` in `tools/harness.mjs` erkennt Übersetzungsverzeichnisse (`translations/`, `i18n/`, `locales/`, Sprachkürzel wie `ja-JP`), `isPlaceholder()` erkennt Übersetzungsstümpfe im Text. Das frühere Musterbeispiel löst heute auf das englische Original auf:

```
node tools/harness.mjs show affaan-m__ecc/skill/production-audit
  Domänen  general
  Quelle   …\affaan-m__ecc\skills\production-audit
  Beschr.  Local-evidence production readiness audit for shipped apps, pre-launch
           reviews, post-merge checks, and "what breaks in prod?" questions …
```

`docs` umfasst heute 72 Bausteine (`search "" --domain docs`, Massen-Repo eingerechnet) bzw. 55 im Standardzugriff (`INDEX.md`). Die Domäne misst damit erstmals den Zweck statt den Ablageort.

**Ein einzelnes Wort im Fliesstext kippt die Domäne.** Drei Fälle aus derselben Suche:

- `competitive-platform-analysis` (Wettbewerbsanalyse) liegt in `devops` — wegen des Satzes „First step in the three-skill competitive **pipeline**". Ebenso `competitive-report-structure`.
- `e2e-testing` liegt in `data-ai` — wegen „Page Object **Model**"; die `data-ai`-Regex enthält `model`.
- `inherit-legacy-style` liegt in `data-ai` — wegen „onboarding an AI coding **agent** onto a legacy project". Ein Skill zum Übernehmen fremder Code-Konventionen ist damit weder in `docs` noch in einer Onboarding-Kategorie auffindbar.

**`react-reviewer` liegt in fünf Domänen gleichzeitig:** `security, frontend, backend, meta, media`. `meta` wegen „**hook** correctness", `media` wegen „**render** performance", `backend` wegen „**server**/client component boundaries". Ein Baustein, der in fünf von dreizehn Domänen auftaucht, filtert nichts mehr.

**Gleichartige Bausteine landen unterschiedlich.** In derselben Familie `*-reviewer` aus demselben Repo: `cpp-reviewer` → `general`, `go-reviewer` → `general`, `csharp-reviewer` → `security`, `django-reviewer` → `security, backend`, `react-reviewer` → fünf Domänen. Identische Funktion, fünf verschiedene Einordnungen — je nachdem, welches Fachwort zufällig in der Description steht.

**Hooks sind unklassifizierbar.** 42 der 56 Hooks liegen in `meta`, der Rest verteilt sich nach Zufallstreffern: `post-bash-build-complete` → `testing`, `insaits-security-wrapper` → `security`, `pre-bash-dev-server-block` → `backend`. Grundlage ist bei **allen** die Shebang-Zeile oder eine fehlende Beschreibung (siehe Abschnitt 3).

### 2.3 Vorschlag: zwölf Absichts-Kategorien

Wer die Bibliothek befragt, kommt nicht mit „ich brauche etwas aus dem Bereich Backend", sondern mit einer Situation. Diese zwölf decken die Fälle ab, die in `harness-build/SKILL.md` und in unseren Rezepten tatsächlich vorkommen:

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

Zwölf Einträge, davon zehn für Software; `vermarkten` und `rechtliches` sind Randbereiche, gehören aber dazu, weil sie die Domänen `seo` (58), `product` (106) und `media` (48) bzw. die 24.543 Rechts-Bausteine des Massen-Repos abdecken (Domänenzahlen aus `INDEX.md`, Standardzugriff; die drei Mengen überlappen, eine Gesamtsumme lässt sich per CLI nicht ermitteln). Beachte, was die Liste **nicht** enthält: keine Sprache, kein Framework, keine Technikkategorie. Das sind Mirajes **Triggerwörter** — sie gehören in die Description (`cpp-reviewer` unterscheidet sich von `go-reviewer` allein durch „C++" bzw. „Go"), nicht in die Kategorie.

### 2.4 Urteil: zweite Ebene, kein Austausch

**Ein Austausch der Domänen gegen Absichten lohnt nicht.** Begründung:

- Die Domänen sind als *Grobfilter* brauchbar. `--domain seo` (64) oder `--domain devops` (90) schneidet den Suchraum wirksam. `docs` ist mit M1 und M6 repariert; kaputt bleibt `general` (365 von 1.084 — der Auffangkorb, Stand nach M2). <!-- lint:historisch --> Die 365 wurden nicht neu gezählt, seit der Standardzugriff über M2 hinaus auf 1.091 gewachsen ist (Erweiterung der Beschreibungs-Extraktion auf JSDoc-Blöcke, Python-Docstrings und JSON-`description`-Felder, 2026-08-10); das Verhältnis steht hier als Beleg des damaligen Befunds, nicht als aktuelle Kennzahl.
- Ein Austausch bedeutet, 1.091 Bausteine neu zu klassifizieren. Regex reicht dafür nicht: ob ein Baustein zu `verstehen` oder `umbauen` gehört, steht nicht in einem Stichwort. Das wäre ein LLM-Klassifikationslauf über den Gesamtbestand — bei jedem `/harness-update` erneut, für alle neuen Bausteine.
- Der Katalog wird von `extract` **vollständig neu erzeugt**. Eine von Hand gepflegte Absichts-Zuordnung würde bei jedem Update überschrieben, wenn sie nicht ausserhalb von `index.json` liegt.

**Was stattdessen: eine Absichts-Ebene neben den Domänen, als Datei gepflegt statt berechnet.**

Der Ansatz existiert im Keim bereits. `harness-build/SKILL.md` führt eine Symptomtabelle („Reviews übersehen dieselben Fehler" → `search "code review" --type agent`; „Keiner traut sich an den Code" → `search "codebase onboarding"`; „Deployments schlagen fehl" → `search "deployment ci" --domain devops`). Das ist eine Absichts-Ebene mit sechs Einträgen, hartkodiert in einer Skill-Datei, ohne Verbindung zum Katalog. Der Vorschlag ist, sie herauszuziehen und aufzuwerten — `catalog/intents.yaml`, von Hand gepflegt, überlebt jedes `extract`:

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

- ~~Den Dateipfad aus `classify()` entfernen oder auf die letzten zwei Pfadsegmente begrenzen.~~ **Erledigt** — der Pfad ist heute reine Rückfallebene.
- ~~Ordner mit Sprachkürzeln (`ja-JP`, `zh-CN`, …) beim `walk` überspringen.~~ **Erledigt** über `TRANSLATION_RE`. Siehe Abschnitt 5.1.
- **Offen:** Die Wortlisten der `data-ai`- und `media`-Regeln entschärfen: `model`, `agent`, `render` sind zu häufig. `\bmodel\b` sollte mindestens zu `\b(ml model|model training|fine-?tun)\b` werden.

---

## 3. Descriptions als Routing-Signale — Qualität unseres Bestands

Mirajes Regel: `name` und `description` sind **Routing-Signale**. Die Description muss an der **Nutzeranfrage** ausgerichtet sein, nicht am Skill selbst. Zwei Skills unterscheiden sich brauchbar, wenn genau ein Wort in der Description den Fall trennt (`report-html` vs. `report-pdf` über das Wort „PDF").

### 3.1 Stichprobe

25 Bausteine aus 8 Repos, gezogen über `search` zu den Themen code review, testing, deployment, onboarding, design, incident, plus einen Vollabzug (`--type hook`). Bewertet wurde nur, was der Agent tatsächlich sieht: die Trefferzeile aus `search`. Alle IDs sind mit `node tools/harness.mjs show <id>` gegengeprüft und in dieser Form auflösbar.

**Kategorie A — an der Nutzeranfrage ausgerichtet (11 von 25):**

| Baustein | Was es richtig macht |
|---|---|
| `affaan-m__ecc/skill/cpp-testing` | „**Use only when** writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests" — Situation, Triggerwort *C++*, und eine ausdrückliche Obergrenze. Bestes Beispiel im Bestand |
| `anthropics__skills/skill/canvas-design` | „**You should use this skill when the user asks to** create a poster…" — wörtlich die Nutzeranfrage |
| `nextlevelbuilder__ui-ux-pro-max-skill/agent/design-review` | „Use PROACTIVELY **after any front-end change and before calling UI work complete**" — Zeitpunkt statt Thema |
| `affaan-m__ecc/agent/cpp-reviewer` · `agent/go-reviewer` | identische Schablone, trennscharf allein über das Sprachwort |
| `affaan-m__ecc/skill/inherit-legacy-style` | „Use when the user types `/inherit-legacy-style`, or when onboarding an AI coding agent onto a legacy project" |
| `affaan-m__ecc/skill/python-testing` · `anthropics__skills/skill/brand-guidelines` | „Use when writing or improving Python tests" bzw. „Use it when …" |
| `Egonex-AI__Understand-Anything/skill/understand-chat` · `…/skill/understand-explain` | beide „Use when you need …" — richtig gebaut, aber untereinander kaum trennbar |
| `affaan-m__ecc/agent/code-reviewer` | „Use immediately after writing or modifying code" — richtig gebaut, aber siehe C |

**Kategorie B — beschreibt nur sich selbst (7 von 25):**

| Baustein | Description | Fehlt |
|---|---|---|
| `affaan-m__ecc/command/code-review` | „Review code for quality, security, and maintainability" | jeder Auslöser |
| `mattpocock__skills/skill/code-review` | „Two-axis review of the diff between HEAD and a fixed point the user supplies:" | endet im Doppelpunkt — die Beschreibung ist der Anfang einer Liste |
| `msitarzewski__agency-agents/agent/code-reviewer` | „Expert code reviewer who provides constructive, actionable feedback…" | Rollenbeschreibung statt Situation |
| `affaan-m__ecc/skill/e2e-testing` | „Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies" | Merkmalsliste; sagt nicht, wann |
| `mattpocock__skills/skill/grill-me` | „A relentless interview to sharpen a plan or design." | stimmungsvoll, aber ohne Anlass |
| `msitarzewski__agency-agents/agent/incident-response-commander` | „Expert incident commander specializing in production incident management…" | Persona statt Anfrage |
| `msitarzewski__agency-agents/agent/incident-responder` | „Digital forensics and incident response specialist who leads breach investigations…" | Persona; nicht von der Zeile darüber trennbar |

**Kategorie C — als Routing-Signal unbrauchbar (7 von 25):**

Die Stichprobe musste hier vollständig neu gezogen werden. Die ursprünglichen sieben Beispiele sind alle hinfällig: `affaan-m__ecc/skill/production-audit`, `…/skill/perl-testing` und `…/skill/csharp-testing` tragen seit M1 wieder ihre englische Originalbeschreibung; `affaan-m__ecc/hook/after-file-edit`, `multica-ai__multica/hook/use-auto-scroll` und `…/hook/index` existieren im Katalog nicht mehr, seit `isClaudeHook()` React-Hooks und Fremdformate aussortiert. **Alle sieben Ersatzbeispiele sind Hooks** — und das ist der Befund, nicht die Auswahl: <!-- lint:historisch -->

| Baustein | Description im Katalog |
|---|---|
| `affaan-m__ecc/hook/adapter` | `!/usr/bin/env node` |
| `affaan-m__ecc/hook/design-quality-check` | `!/usr/bin/env node` |
| `affaan-m__ecc/hook/before-shell-execution-block-no-verify` | `!/usr/bin/env node` |
| `affaan-m__ecc/hook/hooks` | *(keine Beschreibung)* |
| `AgriciDaniel__claude-seo/hook/hooks` | *(keine Beschreibung)* |
| `Egonex-AI__Understand-Anything/hook/post-tool-use-auto-update` | *(keine Beschreibung)* |
| `mvanhorn__last30days-skill/hook/hooks` | *(keine Beschreibung)* |

### 3.2 Das Ergebnis in Zahlen

**11 von 25 (44 %) an der Nutzeranfrage ausgerichtet, 7 (28 %) rein selbstbeschreibend, 7 (28 %) unbrauchbar.** Vier davon — die vier `code-review`-Varianten — sind untereinander nicht unterscheidbar.

Zwei der drei Kategorien lassen sich über das CLI auf den Gesamtbestand hochrechnen:

- `search "usr/bin/env"` → **56 Bausteine** führen ihre Shebang-Zeile als Beschreibung (Messung wiederholt am Katalogstand 2026-08-08 19:36; erste Wiederholung 2026-08-07: 50); `search "usr/bin/env" --type hook` liefert dieselben 56, es ist also kein einziger Nicht-Hook darunter. Dazu kommt `anthropics__claude-plugins-official/hook/stop-hook`, dessen `!/bin/bash`-Shebang diese Suche nicht fängt — 57 Shebang-Hooks bei 70 Hooks insgesamt, **81 %**. Ursache ist unverändert `hookDescription()` in `harness.mjs`: sie nimmt den ersten Kommentar der Datei — und das ist bei Skripten die Shebang.
- **Der Anteil ist gegenüber der ersten Messung (45 % von 152) gestiegen, nicht gefallen.** Das ist keine Verschlechterung am Bestand, sondern eine Bereinigung: `isClaudeHook()` sortiert inzwischen React-`use*`-Hooks und Testdateien aus. Verschwunden sind dadurch vor allem die Einträge, die überhaupt eine Prosa-Beschreibung trugen — übrig bleibt der harte Kern echter Shell- und Node-Hooks, und der beschreibt sich geschlossen mit seiner Shebang.
- 7 weitere Hooks tragen **gar keine** Beschreibung (`(keine Beschreibung)` in der Trefferzeile; der siebte kam mit `anthropics__claude-plugins-official/hook/hooks` hinzu), und 5 Hooks desselben neuen Repos führen ein Code- oder Trennzeichen-Fragment als Beschreibung (`gitutil`, `llm`, `diffstate`, `review-api`, `extensibility`).
- `search "日本語翻訳"` → **kein Treffer** mehr, `search "ja-jp"` noch **einer**. Die 163 Übersetzungseinträge der ersten Messung sind seit `TRANSLATION_RE` und `isPlaceholder()` aus dem Katalog.

Nachgezählt statt geschätzt (Messung wiederholt am Katalogstand 2026-08-08 19:36): **69 der 1.099 Bausteine (6,3 %) haben keine Description, die einen deutsch- oder englischsprachigen Agenten routen könnte** — 57 mit Shebang, 7 ohne jede Beschreibung, 5 mit Code- oder Trennzeichen-Fragment. Das sind **69 der 70 Hooks des Katalogs**; kein Baustein eines anderen Typs ist betroffen. Die einzige Ausnahme ist `anthropics__claude-plugins-official/hook/patterns` („Security patterns configuration" — drei Wörter, Merkmalsliste, keine Situation). Der Bestand insgesamt ist damit deutlich sauberer als bei der ersten Messung (rund 230 ≙ 22 %), das Hook-Problem dafür praktisch vollständig: **auch das offizielle Plugin-Repo liefert 13 seiner 14 Hooks ohne routbare Beschreibung.** Diese Messung ist der Vor-M3-Zustand vom 2026-08-08 und mit `1.099`/`69` absichtlich in ihrer damaligen Form zitiert — der Nachtrag unten hält den Stand nach M2 und M3. <!-- lint:historisch -->

**Nachtrag (2026-08-10): Messung nach M2 und M3 wiederholt.** M3 (`hookDescription()` überspringt Shebang-Zeilen) und M2 (Quarantäne-Flag in `extract`) sind umgesetzt, siehe die Tabelle „Sollten wir tun" unten und `knowledge/LOG.md`. `search "usr/bin/env"` liefert jetzt **0** Treffer statt 56 — die Ursache aus diesem Abschnitt ist behoben, nicht nur versteckt. Von den ursprünglich unroutbaren Descriptions sind die 13 leeren und die 2 reinen Trennzeichen-Fälle (15 insgesamt, alle nicht-bulk — die Erwartung „~12" aus diesem Abschnitt war zu niedrig) per M2 quarantänisiert: sie stehen weiter im Katalog, tauchen in der Standardsuche aber nicht mehr auf, erreichbar über `--all`. Ein 16. Fall (`Klotzkette__claude-fuer-deutsches-recht/skill/rechtsmittelbelehrung-zivil`) war zunächst ebenfalls betroffen, war aber kein echter Leerfall, sondern ein CRLF-Artefakt in `frontmatter()`: bei Windows-Zeilenenden ging das letzte Frontmatter-Feld — meist `description` — verloren, und der Baustein fiel deshalb fälschlich in die Quarantäne. Seit dem Fix vom 2026-08-10 ist er wieder regulär im Katalog, mit seiner echten Frontmatter-Description (`knowledge/LOG.md`, Eintrag „CRLF-Bug in `frontmatter()` behoben"). Die verbliebenen Fragment-Descriptions (`gitutil`, `llm`, `diffstate`, `review-api`, `extensibility`, `# Architecture` und ähnliche) sind **bewusst sichtbar geblieben** — dafür gäbe es nur eine Geschmacks-Heuristik, und eine Fehlklassifikation in die Quarantäne wiegt schwerer als ein sichtbarer Rausch-Eintrag (Begründung in `knowledge/LOG.md`, Eintrag „M2 umgesetzt"). **Weiterer Nachtrag (2026-08-10, selber Tag):** Die Beschreibungs-Extraktion wurde um JSDoc-Blöcke, Python-Docstrings und JSON-`description`-Felder erweitert (die „Offene Folgeaufgabe" unten ist damit erledigt) — 7 der 15 quarantänisierten Bausteine tragen dadurch ihre echte Beschreibung und sind zurück in der Standardsuche, die verbleibenden 8 bleiben quarantänisiert. Standardzugriff insgesamt: **1.091** (1.099 vor M2, 1.084 direkt nach M2/M3, jetzt 1.091 nach der Erweiterung).

**Folgeaufgabe — umgesetzt (2026-08-10, im Arbeitsbaum, ungecommittet, in adversarialer Prüfung).** Für einen Teil der verbliebenen 15 Quarantäne-Fälle existierte eine echte, brauchbare Beschreibung — nur nicht im Frontmatter, sondern an Orten, die `hookDescription()` damals nicht las: JSDoc-Blöcke (`adapter.js`, `design-quality-check.js`, `plan-canvas-sessions.js`), Python-Docstrings (`diffstate.py`, `review_api.py`) und JSON-`description`-Felder (`codex-hooks.json`, mehrere `hooks.json`). Die Erweiterung des Extractors um diese Quellen ist erfolgt und hat die Quarantäne um 7 dieser Fälle geleert, ohne die Quarantäne-Logik selbst anzufassen — Standardzugriff jetzt 1.091, Quarantäne 8 statt 15 (Beleg: `node tools/harness.mjs stats`). Die verbleibenden 8 bleiben bewusst quarantänisiert statt mit abgeschnittenen Fragmenten sichtbar zu sein — dieselbe Abwägung wie beim vorigen Absatz, nur mit dem gegenteiligen Ergebnis, weil dort eine vollständige Beschreibung erreichbar wäre, kein Rauschfragment.

### 3.3 Die Überlappungen, die tatsächlich schaden

**Der `code-review`-Cluster.** `search "code review"` liefert 49 Treffer; die ersten vier sind `affaan-m__ecc/agent/code-reviewer`, `affaan-m__ecc/command/code-review`, `mattpocock__skills/skill/code-review`, `msitarzewski__agency-agents/agent/code-reviewer`. Drei Repos, drei Typen, austauschbare Beschreibungen. Miraje: „überlappende Descriptions führen dazu, dass der Agent den falschen oder gar keinen Skill zieht." Bei uns kommt hinzu, dass die vier auch noch **unterschiedliche Bausteintypen** sind — der Agent müsste aus der Description ableiten, ob er einen Subagenten mit eigenem Kontextfenster oder einen Slash-Command will. Das steht dort nirgends.

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

### 3.5 Duplikat-Familien: Ableitungen erkennen und das Original vorziehen

**Befund (Sichtung 2026-08-08).** Sieben Agenten tragen in `affaan-m__ecc` denselben Namen wie Agenten des offiziellen Plugin-Repos `anthropics__claude-plugins-official`, und bei sechs davon ist die ecc-Fassung erkennbar die Ableitung: gleicher Description-Kern, gleiche Analysestruktur, ergänzt um den repo-einheitlichen Prompt-Defense-Vorspann. Das ist ein anderes Phänomen als der `code-review`-Cluster aus 3.3 — dort kollidieren unabhängig entstandene Bausteine mit austauschbaren Beschreibungen, hier existieren Original und Kopie desselben Bausteins in zwei Vertrauensstufen, und die Frage ist, welche Fassung die Bibliothek empfiehlt. Alle sieben Paare wurden per `show` an beiden Fassungen verglichen (adversarial geprüfter Workflow-Lauf, Task `w3da4z86w`; jede Zeile unten am laufenden System nachvollzogen):

| Offiziell (`anthropics__claude-plugins-official/agent/…`) | Ableitung (`affaan-m__ecc/agent/…`) | Befund per `show` |
|---|---|---|
| `comment-analyzer`, 5 KB | `comment-analyzer`, 2 KB, haiku | Verlustbehaftete Kurzfassung: das Original verifiziert Kommentare gegen die Implementierung und sucht aktiv nach Fehldeutungspotenzial („Identify Misleading Elements"); die Ableitung destilliert auf eine Seite. Bei Bedarf Original vorziehen. |
| `type-design-analyzer`, 5 KB | `type-design-analyzer`, 2 KB | Verlustbehaftete Kurzfassung derselben vier Achsen (Encapsulation, Invariant Expression, Usefulness, Enforcement); das Original trägt das quantitative Rating-Verfahren, die Ableitung nur die Achsennamen. Bei Bedarf Original vorziehen. |
| `code-architect`, 2 KB | `code-architect`, 2 KB | Nahezu deckungsgleich, Description fast wortgleich; die Ableitung mit Prompt-Defense-Vorspann und engerem Tool-Set (`Read`/`Grep`/`Glob` statt u. a. `WebFetch`/`WebSearch`). Echter Gleichstand — hier entscheidet die Vertrauensstufe für das Original. |
| `silent-failure-hunter`, 8 KB | `silent-failure-hunter`, 2 KB | Original deutlich reicher (Catch-Block-Spezifität, Fallback-Rechtfertigung, Fehlermeldungsqualität), aber projektkontaminiert: es fragt „Is there an error ID from constants/errorIds.ts for Sentry tracking?" — Strukturen eines Anthropic-internen Projekts, die es im Zielprojekt nicht gibt; die Prüfung erzeugte dort Falschbefunde. Die generische ecc-Destillation bleibt die Empfehlung. |
| `code-simplifier`, 3 KB, opus, keine `tools`-Deklaration | `code-simplifier`, 2 KB, sonnet | Original projektkontaminiert: unter „Apply Project Standards … from CLAUDE.md" stehen feste TS/React-Regeln (ES modules, `function` statt Arrow-Functions, explizite Return-Types, React-Props-Patterns, „avoid try/catch when possible") — in einem Python- oder Go-Zielprojekt Fehlanweisungen. Zudem arbeitet es laut Prompt „autonomously and proactively … without requiring explicit requests" auf dem teuersten Modell. Die ecc-Ableitung ist die stack-neutrale Fassung. |
| `code-explorer`, 2 KB | `code-explorer`, 3 KB | Ableitung mit engerem Tool-Set: das Original trägt u. a. `WebFetch`/`WebSearch` (Netzzugriff), die Ableitung ist auf `Read`/`Grep`/`Glob` beschränkt — genau die Eigenschaft, mit der Rezept 06 die Aufnahme begründet („Kann nichts kaputtmachen"). Tausch auf das Original am 2026-08-08 adversarial geprüft und abgelehnt. |
| `code-reviewer`, 3 KB | `code-reviewer`, 9 KB, aus `.kiro/agents/` | **Kein Ableitungsfall**, sondern ein Namensvetter mit eigenständiger Checklisten-Fassung samt Code-Beispielen; beide filtern Befunde bei ~80 % Konfidenz. Vergleich je Einsatzzweck, nicht nach der Duplikat-Regel. |

**Was das für die Auswahlregel heißt.** `sources.txt` legt fest: fachliche Passung schlägt Herkunft; die Vertrauensstufe entscheidet nur den Gleichstand. Duplikat-Familien präzisieren diese Regel in beide Richtungen:

1. **Original gegen verlustbehaftete Kopie ist kein Gleichstand.** Wer bei `comment-analyzer` oder `type-design-analyzer` die 2-KB-Ableitung wählt, wählt weniger Prüftiefe zur selben Frage. Das Original ist vorzuziehen — außer die Kürzung ist für den Zweck belegt ausreichend, etwa wenn das engere Tool- oder Modellprofil der Ableitung der eigentliche Aufnahmegrund ist (so beim `code-explorer` in Rezept 06).
2. **„Offiziell" schützt nicht vor Kontamination.** Zwei der sieben Originale (`silent-failure-hunter`, `code-simplifier`) tragen Regeln ihres Heimatprojekts als vermeintliche Standards mit. Der `show`-Vergleich beider Fassungen ist deshalb Pflicht, keine Formalie — die Vertrauensstufe ersetzt ihn nicht.

Der Kurzvermerk dazu steht seit 2026-08-08 in der Vertrauenszeile von `affaan-m__ecc` in `sources.txt` und erscheint damit in jeder `show`-Ausgabe eines ecc-Bausteins.

**Offene Tauschkandidaten für den nächsten Prüfzyklus.** Per Grep über `recipes/` (2026-08-08) stehen drei der betroffenen ecc-IDs in Rezepten. Kein Tausch in diesem Lauf — jeder braucht erst eine adversariale Einzelprüfung wie beim `legacy-analyst`-Tausch (LOG-Eintrag `[2026-08-08] revise | Rezept 06: Kern-Set-Tausch auf legacy-analyst …`):

- `affaan-m__ecc/agent/silent-failure-hunter` — `recipes/02-backend-api.md`, Erweiterung. Stand der heutigen Prüfung: bleibt, weil das Original projektkontaminiert ist; ein Tausch bräuchte den Beleg, dass die `errorIds.ts`/Sentry-Annahmen im Zielprojekt unschädlich sind.
- `affaan-m__ecc/agent/code-reviewer` — `recipes/06-legacy-onboarding.md`, Erweiterung. Kein Ableitungsfall; ob die knappere offizielle Fassung (3 KB Confidence-Scoring statt 9 KB Checkliste) für den Legacy-Fall genügt, ist ungeprüft.
- `affaan-m__ecc/agent/code-explorer` — `recipes/06-legacy-onboarding.md`, Kern-Set. **Bereits entschieden**, kein offener Kandidat: der Tausch wurde am 2026-08-08 abgelehnt, weil das breitere Tool-Set des Originals die Rezept-Begründung bricht; das Original steht dort unter „Bewusst weggelassen". Hier nur zur Vollständigkeit gelistet.

---

## 4. Die Eval-Lücke

Mirajes Vorfall: Modell-Upgrade, keine Zeile im Skill geändert, Agent befolgte den Skill nicht mehr — das neue Modell gewichtete den Anfang stärker, die kritische Anweisung stand am Ende. Sein Merksatz: Skills sind keine Dokumentation, sondern **Verträge, versioniert gegen ein Modell**.

Bei uns ist die exponierte Stelle eine andere. Wir schreiben die Skills nicht, wir wählen sie aus. Das driftende Verhalten ist deshalb nicht „befolgt der Agent den Skill", sondern: **Findet der Agent für eine gegebene Absicht noch denselben Baustein?** Das driftet aus drei unabhängigen Gründen: das Modell ändert sich, der Katalog ändert sich (`/harness-update` zieht 13 Repos, die uns nicht gehören), oder der Score in `cmdSearch` ändert sich. Ohne Messung merkt es niemand — die Suche gibt nie einen Fehler zurück, nur ein anderes Ergebnis.

### 4.1 Das minimal sinnvolle Verfahren

Eine Liste von Testanfragen mit erwarteten Treffern, gegen die `search` läuft. Zwei Stufen:

**Stufe 1 — deterministisch, ohne Modell.** Reines `search`-Verhalten, läuft in Sekunden und kann an jedes `/harness-update` gehängt werden. Pro Fall: eine Anfrage, die Bausteine die **im Ergebnis stehen müssen** (`erwartet`), optional welche die **nicht** darin stehen dürfen (`verboten`), und ab welcher Position das noch zählt (`topN`). Die Feldnamen sind die der Umsetzung; die frühere Fassung dieses Abschnitts nannte `must` und `top`, die es im Code nie gab.

**Stufe 2 — mit Modell, seltener.** Man gibt dem Agenten die Nutzerabsicht im Klartext („mein Deployment bricht seit dem Umzug auf Kubernetes") und lässt ihn ohne weitere Hilfe suchen und auswählen. Bewertet wird nur, ob die erwarteten Bausteine in seiner Endauswahl stehen. Das ist der Eval, der Mirajes Fall abbildet: Er misst nicht den Katalog, sondern ob `harness-build/SKILL.md` das Modell noch führt. Läuft manuell — bei jedem Modellwechsel, sonst nie. Stufe 2 ist bis heute nicht gebaut und bleibt es laut `knowledge/06` M7 Punkt 6, bis Stufe 1 zwei Update-Zyklen überlebt hat; die folgenden fünf Regeln sind die Bauvorgabe für diesen Zeitpunkt, keine Aufforderung, ihn vorzuziehen.

**Die zwei Hälften, die Stufe 1 und Stufe 2 voneinander trennen.** Pruitt (Varick Agents) zerlegt dasselbe Problem in „writing good analysis from the context and extracting the correct context in the first place" (18:12). Stufe 1 misst ausschliesslich die zweite Hälfte — ob die Suche für eine Absicht noch denselben Baustein liefert. Die erste Hälfte, ob die Begründung taugt, die `harness-build` zu Auswahl und Verwurf schreibt, ist hier absichtlich nicht automatisiert: `harness-build/SKILL.md` legt die Auswahl mit Begründung vor und holt vor jedem Kopiervorgang eine Bestätigung ein. Einen Eval dafür zu bauen, hiesse ein menschliches Gate zu ersetzen, das heute funktioniert. Belege und Herleitung: `knowledge/08` Abschnitte 2 und 3.

**Fünf Bauvorgaben für Stufe 2.**

1. **Kontext als Fixture auf der Platte, nicht als Block im Prompt.** Pro Fall ein Minimal-Projektverzeichnis mit echter `package.json` bzw. `go.mod`, `README` und einer Zeile „Nicht gebraucht: …"; der Agent bekommt nur den Satz Nutzerabsicht plus den Pfad. Grund: fehlender Kontext wird nicht ausgelassen, sondern erfunden (`knowledge/08` Abschnitt 6). Ein Kontextblock im Prompt überspränge zusätzlich Schritt 1 der Skill — also genau das, was Stufe 2 prüfen soll.
2. **Was ausdrücklich nicht in den Prompt gehört:** dass aus einem Katalog ausgewählt wird, welche Grössenordnung üblich ist, und dass eine Leerauswahl erlaubt ist. Diese drei sind wörtlich der Inhalt von `harness-build/SKILL.md` und damit die Messgrösse selbst; die Leerauswahl steht dort ausserdem weit hinten — also genau an der Schwanzposition, auf die Mirajes Vorfall zielt. Wer sie mitliefert, misst den Prompt statt den Skill.
3. **Eine Zweitfassung je Fall: dieselbe Absicht anders formuliert**, zweiter Lauf in frischem Kontext. Kippt die Endauswahl zwischen den Fassungen, ist der Fall **fehlgeschlagen**, nicht neutral — die Instabilität ist der Befund, den Stufe 2 erzeugen soll. Folgenlos bleibt die Abweichung nur, wenn beide Auswahlen die erwarteten Bausteine enthalten und sich lediglich in der Ergänzung unterscheiden; das wird als „abweichend, Kern gehalten" vermerkt, nicht als bestanden. Herleitung: `knowledge/08` Abschnitt 7.
4. **Der Präfix-Test kostet keinen zweiten Lauf.** Die Endauswahl des Agenten gegen die ersten n aus derselben Suche vergleichen: ist sie das Präfix in genau dieser Reihenfolge, hat er die Trefferliste übernommen statt ausgewählt — eigene Meldung, kein Extralauf.
5. **Der Aufwanddeckel aus `knowledge/07` C1(b) gilt auch hier:** wird ein Lauf länger als wenige Minuten Handarbeit, läuft er beim nächsten Modellwechsel nicht. Dann ist zuerst der schnellere Pfad zu bauen, nicht der Eval zu erweitern. Der Läufer gehört deshalb nicht ins CLI — das hat keine Abhängigkeiten und keinen Modellzugang, und der teure Teil wäre ohnehin der Modelllauf, nicht das Ablesen — sondern als Skill oder Subagent ins Harness, dessen Sitzung das Modell bereits hat.

### 4.2 Dateiformat und Ort

`evals/routing.jsonl` — eine Zeile pro Fall, damit ein neuer Fall ein Einzeiler-Diff ist und ein Lauf zeilenweise über die Datei iterieren kann:

Die tatsächlich umgesetzten Felder — `frage`, optional `typ` und `domaene`, `erwartet`, `verboten`, `topN` (Standard 5), `mindestens`/`maxTreffer`, `hoechstensSoVieleWie`, `optional`, `warum`; Zeilen mit `_kommentar` werden übersprungen:

```jsonl
{"frage":"code review","erwartet":["affaan-m__ecc/agent/code-reviewer"],"topN":5,"warum":"Häufigster Einstieg überhaupt: Reviews übersehen dieselben Fehler"}
{"frage":"code review","typ":"command","erwartet":["affaan-m__ecc/command/code-review"],"topN":3,"warum":"Gegenprobe zum Typfilter"}
{"frage":"deployment patterns","erwartet":["affaan-m__ecc/skill/deployment-patterns"],"verboten":["AgriciDaniel__claude-seo/skill/seo-drift"],"topN":5,"warum":"Deployment bricht. Der SEO-Treffer auf Platz 2 belegt Domänenrauschen"}
{"frage":"arbeitsvertrag","maxTreffer":0,"warum":"Rechts-Repo ist bulk und darf die Standardsuche nicht fluten"}
{"frage":"code review","hoechstensSoVieleWie":"review","warum":"Zwei Wörter dürfen nie mehr Treffer liefern als eins"}
```

<!-- lint:historisch --> Die frühere Fassung dieses Abschnitts zeigte ein erfundenes Schema mit `id`, `stufe`, `q`, `flags`, `top`, `must` und `notiz` sowie einen Stufe-2-Fall mit `absicht`. Keines dieser Felder existiert im Code; `ladeEvalFaelle` reicht unbekannte Felder stillschweigend durch, und eine Zeile mit `absicht` statt `frage` wird heute zur Suche nach dem Literal „undefined". Der Altstand ist hier benannt, weil er als Fundstelle in mehreren Prüfberichten zitiert wurde; er ist damit erledigt (offener Rest von M10 in `knowledge/06`). Vor dem Bau von Stufe 2 braucht der Runner deshalb ein Feld, an dem er Stufe-2-Fälle erkennt und aussortiert.

Daneben `evals/README.md` mit dem Modellstand des letzten Stufe-2-Laufs — das ist die Versionierung gegen ein Modell, die Miraje meint, z. B.: *„Letzter Stufe-2-Lauf: 2026-08-07, `claude-opus-5[1m]`, 11/12 bestanden. Fehlgeschlagen: `review-qualität` (zog command statt agent)."* Diese Datei existiert bis heute nicht; `evals/` enthält nur `routing.jsonl`.

Der Subcommand `eval` führt Stufe 1 aus und gibt eine Zeile pro auffälligem Fall aus plus eine Bilanz, die bekannte Schwächen (`optional`) getrennt führt. Exit-Code ≠ 0 bei Fehlschlägen, damit `/harness-update` daran hängen kann — daran hängt es heute noch nicht, siehe `knowledge/06` M15.

**Umfang, der sich lohnt: 12–20 Fälle.** Einer pro Absicht aus Abschnitt 2.3, plus drei Trennschärfe-Fälle, plus zwei Negativ-Fälle gegen die bekannten Müll-Einträge. Mehr wird nicht gepflegt und verrottet. Fälle aus einem echten `harness-build`-Lauf **ersetzen** konstruierte, sie kommen nicht dazu — zuerst die, deren Frage im Namen des erwarteten Bausteins steht und die deshalb nur prüfen, ob ein Substring-Matcher einen Substring findet.

### 4.3 Woran man Drift erkennt

| Symptom im Eval-Lauf | Wahrscheinliche Ursache |
|---|---|
| Ein `erwartet` fällt von Position 3 auf 14, sonst nichts | Katalog gewachsen — neue Konkurrenz aus einem der 14 Repos. Kein Handlungsbedarf, ausser `topN` war zu grosszügig |
| Mehrere `erwartet` fallen gleichzeitig weg | Ein Repo hat umbenannt oder umsortiert. `CHANGELOG.md` prüfen |
| `erwartet` existiert gar nicht mehr | Baustein upstream gelöscht. Eval-Fall auf den Nachfolger umschreiben oder streichen — mit Notiz |
| Bestehensquote unverändert grün, erwartete IDs rutschen aber im Rang | Score-Gewichtung eingeebnet. `eval` misst heute nur, *ob* die ID unter `topN` steht, nicht *wo* — deshalb bleibt der Lauf grün. Die Rangverschiebung gegen den letzten grünen Lauf ist die dafür fehlende zweite Zahl (`knowledge/06` M7 Punkt 1, offen) |
| Eval grün, aber ein echter Projektlauf wählte einen anderen Baustein als erwartet | Die Erwartung war falsch, nicht der Lauf. Ein Eval-Fall ist eine Vorhersage darüber, was ein Agent für diese Absicht finden *sollte*; geprüft wird er durch den Einsatz, nicht umgekehrt. `erwartet` auf den tatsächlich brauchbaren Baustein korrigieren oder den Fall auf `optional: true` setzen, `warum` trägt die Begründung. Nie den Projektlauf an den Eval anpassen |
| Stufe 1 grün, Stufe 2 rot | **Das ist Mirajes Fall.** Der Katalog ist in Ordnung, das Modell folgt `harness-build/SKILL.md` nicht mehr. Skill-Datei prüfen: steht die kritische Anweisung weit hinten? |

Der letzte Fall ist der einzige, den man ohne Eval niemals bemerkt — und der einzige, gegen den nur ein Modelllauf hilft. Die vorletzte Zeile ist die jüngste: Sie kam aus der Einsicht, dass auch die menschliche beziehungsweise handgeschriebene Referenz nicht die Wahrheit ist, sondern eine Vorhersage, die widerlegt werden kann (Anand: „They are not people, they are forecasts, and we should treat them accordingly", 18:29). Eine Änderung an einem Eval-Fall aus diesem Grund ist ein `revise`-Eintrag in `knowledge/LOG.md` — die Aktionsart verlangt dort ohnehin „woran der Irrtum bemerkt wurde", also den Verweis auf den Projektlauf.

---

## 5. Die fünf Governance-Aspekte, auf eine Katalog-Bibliothek übertragen

Der entscheidende Unterschied zu Miraje: **er besitzt seine Skills, wir nicht.** Wir katalogisieren 13 fremde Repos. Wir können keinen Baustein versionieren, keinen Maintainer benennen, keine Deprecation-Warnung in eine fremde `SKILL.md` schreiben. Was wir kontrollieren, sind genau zwei Stellen: **die Aufnahme in `sources.txt`** und **den Weg vom Katalog ins Zielprojekt** (`search` → `show` → `install`). Jeder Governance-Mechanismus, der nicht an einer dieser beiden Stellen ansetzt, funktioniert bei uns nicht.

### 5.1 Admission — anwendbar, aber auf anderer Ebene

Miraje: Gehört dieser Skill überhaupt in die Bibliothek, oder in einen bestehenden? Automatisiertes Gate mit Human-in-the-Loop.

Bei uns gibt es **zwei** Admission-Entscheidungen, und beide sind heute ungeregelt:

**(a) Aufnahme eines Repos in `sources.txt`.** Das ist unser echtes PR-Review-Äquivalent — die einzige Stelle, an der ein Mensch entscheidet. Es gibt dafür keine Kriterien. Ergebnis: `multica-ai/multica` lieferte 36 Bausteine, von denen die Mehrzahl **React-Hooks aus einer Anwendung** waren, keine Claude-Code-Bausteine — etwa `multica-ai__multica/hook/use-auto-scroll` aus `packages/ui/hooks/use-auto-scroll.ts`. Der Extraktor erkannte Hooks am Ordnernamen `hooks/` und konnte ein React-`hooks/`-Verzeichnis nicht von einem Claude-Code-`hooks/`-Verzeichnis unterscheiden. <!-- lint:historisch -->

**Am Extraktor behoben, am Gate nicht.** `isClaudeHook()` in `tools/harness.mjs` verwirft heute Dateien nach dem Muster `use<Grossbuchstabe>…` mit `.ts`/`.tsx`-Endung sowie Testdateien und verlangt sonst ein bekanntes Hook-Event oder ein stdin-lesendes Shebang-Skript. Das Repo liefert dadurch nur noch **10 Bausteine**, allesamt echte Skills; keiner der genannten React-Hooks ist im Katalog auflösbar. Das Admission-Kriterium („liefert das Repo Claude-Code-Bausteine oder Anwendungscode?") fehlt trotzdem weiterhin — behoben wurde ein Symptom im Extraktor, nicht die ungeregelte Aufnahme.

**(b) Aufnahme eines extrahierten Bausteins in den Katalog.** Automatisierbar. Ein Baustein, der R1–R3 aus Abschnitt 3.4 verletzt, gehört nicht in den Standardzugriff. Konkret: `extract` markiert ihn als `quarantaene: true`, analog zum bestehenden `bulk`-Mechanismus — er bleibt katalogisiert, taucht in der Standardsuche aber nicht auf. Erreichbar über `--all`. Das trifft die 50 Shebang-Hooks und die 6 Hooks ohne Beschreibung: **56 Bausteine, die heute den Suchraum verstopfen.**

Der zweite Teil dieser Massnahme ist **erledigt**: Übersetzungsverzeichnisse werden über `TRANSLATION_RE` erkannt, ihre Stümpfe über `isPlaceholder()` verworfen. Nötig war das, weil `extract` über die ID dedupliziert (`seen.has(it.id)`) und beim `walk` gewinnt, wer zuerst kommt: `docs/…` kommt alphabetisch vor `skills/…`, also **überschrieb der japanische Platzhalter das englische Original**. Genau deshalb war `affaan-m__ecc/skill/production-audit` im Katalog ein leerer Stummel; heute löst die ID wieder auf die englische Vollfassung auf.

Human-in-the-Loop bleibt bei (a). (b) ist reine Automatik.

### 5.2 Ownership — **nicht anwendbar. Ersatz: Herkunftsnachweis.**

Wir können keine Maintainer benennen. Ein `CODEOWNERS` über fremde Bausteine wäre eine Lüge — wir haben weder Zugriff noch Verantwortung. Was wir stattdessen brauchen, ist die Frage, die Ownership eigentlich beantwortet: **Wen frage ich, wenn dieser Baustein Ärger macht?** Antwort bei uns: das Upstream-Repo. Der Ersatz ist ein lückenloser Herkunftsnachweis.

Er ist inzwischen vollständig. `cmdInstall()` schreibt `.claude/harness-manifest.json` mit `id`, `from`, `sourcePath`, `catalogGeneratedAt` — und mit `commit`, `installedAt`, `bytes` sowie einer md5-Liste je Datei. <!-- lint:historisch --> Eine frühere Fassung dieses Abschnitts nannte den **Commit-Hash** als das Fehlende: `cmdExtract()` erhob ihn (`repos[].head`), reichte ihn aber nicht durch. Er wird durchgereicht; `list --to DIR` liest ihn zurück und bestimmt jeden Zustand neu.

Zweiter Teil: eine Vertrauensstufe je Quelle — **umgesetzt in `sources.txt`**, als Kommentarzeile `# Vertrauen: offiziell | gepflegt | unbekannt — <Halbsatz>` unmittelbar über der Repo-Zeile, plus die Aufnahmekriterien im Kopf derselben Datei. `show` hängt die Stufe an die `Repo`-Zeile; `readSources()` blieb unangetastet, damit `sync` und `extract` nicht an einem Feld ohne Logik hängen. `anthropics/skills` steht als einziges auf `offiziell`; `multica-ai/multica` auf `unbekannt` — eine Anwendung, deren `hooks/`-Ordner mitkatalogisiert wird. Diese Unterscheidung ist Ownership-Ersatz: nicht *wer pflegt den Baustein*, sondern *wie sehr traue ich der Quelle*. Sie sortiert und wählt nichts vor: **fachliche Passung schlägt Herkunft**, die Stufe entscheidet erst den Gleichstand.

Eine Spalte „Vertrauen" in `INDEX.md` bzw. `catalog/by-repo.md` bleibt offen und ist kein Textauftrag: beide Dateien erzeugt `writeMarkdownIndexes()`, eine Änderung von Hand wird beim nächsten `extract` überschrieben.

### 5.3 Boundaries — teilweise anwendbar, und wir tun es heute nicht

Miraje: Allow-List für Tools pro Skill, Tools sind zugriffskontrolliert. Das können wir **nicht durchsetzen** — wir kopieren fremde Dateien, wir schreiben ihr Frontmatter nicht. Aber wir können es **sichtbar machen**, und das ist der Teil, den wir heute liegen lassen.

`extractRepo()` liest `allowed-tools` für Skills und Commands sowie `tools` für Agents bereits aus und legt sie in `meta` ab. `cmdShow()` gibt sie aus. **`cmdSearch()` gibt sie nicht aus.** Der Agent, der aus 112 Treffern auswählt, sieht also nicht, dass Kandidat A nur `Read, Grep` will und Kandidat B uneingeschränkten `Bash`-Zugriff. Bei 25 sichtbaren Treffern kann er nicht für jeden ein `show` machen.

Konkret umsetzbar:

- Ein Warnhinweis in der `search`-Trefferzeile, wenn ein Baustein `Bash`, `Write` oder gar kein `allowed-tools` deklariert. Eine Zeile Ausgabe, kein neues Konzept.
- Ein `install`-Gate: Bausteine, die Schreib- oder Shell-Rechte anfordern, werden nur mit ausdrücklicher Bestätigung installiert. Das ist die einzige Boundary, die wir tatsächlich **durchsetzen** können, weil sie an unserer Grenze liegt.
- Hooks sind der Sonderfall: ein Hook läuft immer, ohne Modellentscheidung. Ein Hook aus einem fremden Repo ist damit die risikoreichste Kategorie überhaupt — und **kein einziger** von ihnen hat eine brauchbare Beschreibung (89 % Shebang, der Rest gar keine). **Hooks gehören grundsätzlich nur nach `show` und Lesen der Quelldatei installiert.** Das gehört als harte Regel in `harness-build/SKILL.md`.

### 5.4 Lifecycle — **nicht anwendbar. Ersatz: Divergenz-Erkennung.**

Semantische Versionierung, Deprecation-Warnungen, Changelog pro Skill — nichts davon können wir für fremde Bausteine leisten. Ein Repo kann jederzeit umbenennen, löschen oder umbauen, ohne uns zu informieren. Was wir haben, ist die Gegenrichtung: **wir erkennen Änderungen, statt sie anzukündigen.** `cmdUpdate()` vergleicht bereits den Katalog vor und nach dem Sync und schreibt `Neu` / `Geändert` / `Entfernt` in `CHANGELOG.md`. Das ist ein Lifecycle-Ersatz auf Bibliotheksebene.

Was fehlt, ist der Bezug zu den **Projekten**, in denen die Bausteine gelandet sind. Ein Baustein, der upstream verschwindet, steht weiter in fünf Projekten und niemand erfährt es. Der fehlende Mechanismus: `harness.mjs drift --to <projekt>` — liest `.claude/harness-manifest.json`, gleicht gegen den aktuellen Katalog ab und meldet drei Zustände:

| Zustand | Bedeutung |
|---|---|
| `entfernt` | Der Baustein existiert upstream nicht mehr. Die Kopie im Projekt ist verwaist — funktioniert weiter, wird aber nie wieder aktualisiert |
| `geändert` | Upstream hat sich `bytes` oder `description` geändert. Vielleicht ein Bugfix, vielleicht eine Bedeutungsverschiebung. Erfordert einen Menschen |
| `abgewichen` | Die Kopie im Projekt wurde lokal bearbeitet. Dann ist sie ein Fork und darf nicht blind überschrieben werden |

Das ist die ehrliche Version von Lifecycle bei fremdem Code: keine Deprecation-Policy, sondern ein Divergenz-Melder.

**Stand: die Hälfte davon existiert, unter anderem Namen.** `list --to DIR` liest das Manifest eines Zielprojekts, gibt je Eintrag den Quell-Commit und das Installationsdatum aus, bestimmt den Wirksamkeitszustand über `activationOf()` neu und meldet Einträge, deren Dateien nicht mehr da sind. `uninstall` erkennt über die md5-Liste, ob eine Kopie lokal bearbeitet wurde, und weigert sich dann ohne `--force` — das ist der Zustand `abgewichen`, an der Stelle, an der er zählt. **Nicht gebaut ist der Abgleich gegen den heutigen Katalog**: `list` vergleicht `entry.commit` nicht mit `repos[].head` und meldet damit weder `entfernt` noch `geändert`. Wer das heute braucht, hält den obersten `CHANGELOG.md`-Abschnitt gegen die IDs aus `list` — von Hand, wie in `harness-update/SKILL.md` beschrieben.

**Und für unsere eigenen Texte: `verified` plus Repo-HEAD als Anker.** Rezepte und Wissensdateien altern nicht am Kalender, sondern am Bestand — eine Baustein-Beschreibung, die sich upstream ändert, macht die Zeile im Rezept still falsch. Das OKF-Frontmatter führt dafür bereits zwei getrennte Felder, und der Unterschied ist der ganze Punkt:

| Feld | Bedeutung | Wer setzt es |
|---|---|---|
| `generated: { by: …, at: … }` | Ein Modell hat den Text erzeugt. Niemand hat ihn gegengelesen | das erzeugende Modell |
| `verified: YYYY-MM-DD` | Ein **Mensch** hat die Aussagen gegen die Quelle gehalten | ausschliesslich ein Mensch |

`verified` ist kein Synonym für „geprüft von einem Agenten". Ein Modell, das sich selbst `verified` einträgt, hat genau die Selbstbewertung ausgeführt, gegen die die halbe Doktrin gerichtet ist (`knowledge/01`, 3.3). `lint` meldet nur, dass **eines von beiden** fehlt — es kann den Unterschied nicht erzwingen.

Der Anker daneben ist kein neues Feld, sondern der vorhandene `repos[].head` aus dem Katalog: der Commit, gegen den geprüft wurde. Ohne ihn heisst `verified: 2026-08-07` nur „irgendwann geprüft, gegen irgendetwas". Mit ihm lässt sich sagen, ob sich das Quell-Repo seither überhaupt bewegt hat — `catalog/by-repo.md` führt Stand und Commit je Repo, `list --to DIR` hält den Manifest-Commit eines Zielprojekts gegen den heutigen. Prüfung notieren als: `verified: <Datum>` im Frontmatter, der Commit im Quellen-Block darunter.

### 5.5 Coherence — anwendbar, und hier gehört der Eval hin

Miraje: periodische Audits und Validierungsläufe, damit die Bibliothek als Ganzes stimmig bleibt. Das ist der Aspekt, der bei uns **eins zu eins übertragbar** ist, denn Kohärenz ist eine Eigenschaft des Katalogs — und der Katalog gehört uns, auch wenn die Bausteine es nicht tun.

Der Audit ist genau der Eval aus Abschnitt 4, plus eine Bestandshygiene-Prüfung, die `extract` nebenbei erhebt und in `CHANGELOG.md` schreibt:

```
Katalog-Hygiene 2026-08-08 (Nenner: 1.099 im Standardzugriff):
  ohne brauchbare Description       69  (6,3 %)  ← Ziel: < 5 %
  mit mehr als 3 Domänen             ?           ← Ziel: < 10 %
  in Domäne 'general' (Auffang)    365  (33,2 %) ← Ziel: < 15 %
  Namensdubletten über Repos         ?           ← nur berichten
```

Vier Kennzahlen, bei jedem `/harness-update` erhoben, als Zeitreihe im Changelog. Wenn „ohne brauchbare Description" nach einem Update springt, hat ein Repo etwas getan, das wir sehen müssen. Das ist Coherence ohne Bürokratie — Miraje: „Governance muss keine Bürokratie sein, es hängt an der Automatisierung."

---

## 6. Massnahmen, priorisiert

### Sollten wir tun

| # | Massnahme | Warum | Aufwand | Wohin |
|---|---|---|---|---|
| M1 | ~~`docs/ja-JP/` und Geschwister-Sprachordner beim `walk` überspringen~~ — **erledigt** | 163 Bausteine (15 %) waren Übersetzungen; 25 davon **überschrieben per ID-Dedup ihr englisches Original**. Umgesetzt als `TRANSLATION_RE` + `isPlaceholder()`; `search "ja-jp"` liefert heute 1 statt 163 Treffer | erledigt | CLI |
| M2 | ~~Quarantäne-Flag in `extract`: Bausteine mit Shebang-, Leer- oder Platzhalter-Description aus der Standardsuche nehmen (analog `bulk`)~~ — **erledigt** | 56 Bausteine verstopfen den Suchraum, ohne je installierbar zu sein. Mechanismus existiert bereits. Umgesetzt 2026-08-10: 16 Bausteine (14 leer, 2 nur Trennzeichen) quarantänisiert, Standardzugriff 1.099 → 1.084 (Vorher-Wert bewusst als Beleg der Korrektur stehen gelassen <!-- lint:historisch -->), Fragmente bleiben bewusst sichtbar (`knowledge/LOG.md`, Eintrag „M2 umgesetzt"). Von den 14 vermeintlich leeren Fällen war einer ein CRLF-Artefakt in `frontmatter()`, kein echter Leerfall — seit dem Fix vom selben Tag korrigiert auf 15 Quarantäne-Fälle (13 leer + 2 Trennzeichen), Beleg und Einordnung im Nachtrag zu 3.2 | erledigt | CLI |
| M3 | ~~`hookDescription()` reparieren: Shebang überspringen, erst den folgenden Kommentar nehmen~~ — **erledigt** | Behebt 50 Fälle an der Wurzel statt sie zu verstecken. Ergänzt M2, ersetzt es nicht. Umgesetzt 2026-08-10: `search "usr/bin/env"` liefert 0 statt 56 Treffer (`knowledge/LOG.md`, Eintrag „M3 umgesetzt") | erledigt | CLI |
| M4 | Prüfregeln R1–R8 in `harness-build/SKILL.md` aufnehmen | Der Agent installiert heute ungeprüft, was oben in der Trefferliste steht. R5 (Überlappung) und R7 (Typwahl) sind die, die Fehlgriffe verhindern | 1 Std | Skill |
| M5 | `evals/routing.jsonl` mit 12–20 Fällen anlegen + `harness.mjs eval` (Stufe 1) | Ohne das merkt niemand, wenn ein Update oder ein Modellwechsel das Routing zerlegt. Stufe 1 kostet Sekunden und kann an `/harness-update` hängen | 1 Tag | CLI + neue Datei |
| M6 | ~~Dateipfad aus `classify()` entfernen oder auf die letzten zwei Segmente begrenzen~~ — **erledigt** | Beseitigte die Ursache dafür, dass `docs` zu 73 % aus einem Ordnernamen bestand. Umgesetzt: `classify()` wertet den Pfad nur noch aus, wenn Name und Description nichts hergeben. Zusammen mit M1 ist `docs` erstmals eine echte Domäne | erledigt | CLI |
| M7 | ~~Commit-Hash des Quell-Repos ins `harness-manifest.json` schreiben~~ — **erledigt** | Ownership-Ersatz. Das Manifest führt jetzt `commit`, `installedAt`, `bytes` und md5 je Datei; `list --to DIR` wertet sie aus und `uninstall` entfernt nur, was unverändert ist | erledigt | CLI |
| M8 | `search` zeigt Tool-Rechte in der Trefferzeile; `install` verlangt Bestätigung für `Bash`/`Write` und für **alle** Hooks | Die einzige Boundary, die wir durchsetzen können. Hooks laufen ohne Modellentscheidung — sie ungeprüft zu kopieren ist der riskanteste Vorgang im ganzen Ablauf | 3 Std | CLI + Skill |
| M9 | `catalog/intents.yaml` mit den zwölf Absichten + `harness.mjs intent <id>` | Der Absichts-Schnitt, den Miraje fordert, ohne 1.091 Bausteine neu zu klassifizieren. Ersetzt die hartkodierte Symptomtabelle in `harness-build` | 1,5 Tage | CLI + neue Datei + Skill |
| M10 | ~~Aufnahmekriterien für `sources.txt` festhalten, plus Stufe „Vertrauen"~~ — **erledigt** | Unser einziges echtes Human-in-the-Loop-Gate. Hätte `multica-ai/multica` (React-Hooks statt Claude-Bausteine) abgefangen. Umgesetzt **im Kopf von `sources.txt`**, nicht in `knowledge/`: die Kriterien stehen dort, wo die Entscheidung fällt, und die Vertrauenszeile steht neben dem Repo, das sie bewertet | erledigt | Doku |
| M11 | Katalog-Hygiene-Kennzahlen bei jedem `extract` erheben und in `CHANGELOG.md` schreiben | Macht Coherence-Verfall sichtbar, bevor jemand ihn spürt. Vier Zahlen, keine Bürokratie | 2 Std | CLI |

Empfohlene Reihenfolge: **M1, M2, M3, M6, M7 und M10 sind erledigt** (M2 und M3 am 2026-08-10, siehe Nachtrag in 3.2), und M4, M5 und M8 sind in `knowledge/06` unter anderen Nummern aufgegangen und dort umgesetzt (Prüfregeln und Auswahlkriterien in `harness-build/SKILL.md`, `evals/routing.jsonl` samt `eval`-Subcommand, Bestätigung und Sichtprüfung vor dem Kopieren). Es bleibt **M9 → M11**.

**Buchführungshinweis.** Die IDs M1–M11 dieser Tabelle sind **nicht** die IDs M1–M18 aus `knowledge/06-massnahmen.md`. Wer eine Massnahme sucht, prüft beide Listen — `06` ist die aktuelle Arbeitsliste, diese Tabelle der Befund, aus dem mehrere davon hervorgegangen sind.

### Wäre theoretisch schön

| Massnahme | Warum wir es (noch) nicht tun |
|---|---|
| Embedding-basierte Suche statt Wort-Score | Behebt die 112-Treffer-Listen bei Einwortsuchen wirklich — das ist nach der UND-Umstellung das einzige verbliebene Trefferzahl-Problem. Aber: Index bauen, Modell einbinden, bei jedem Update neu berechnen — und der Nutzen hängt daran, dass die Descriptions etwas taugen. Erst nach M2 und M3 sinnvoll, sonst betten wir Shebangs ein |
| ~~UND-Semantik oder Phrasensuche in `cmdSearch`~~ — **erledigt** | Die UND-Semantik mit Lockerung auf Teiltreffer ist umgesetzt (siehe Abschnitt 1). Das damals genannte Risiko — bestehende Suchen in `harness-build` und den Rezepten liefern schlagartig andere Ergebnisse — hat sich realisiert und ist der Grund, warum M5 (Eval) weiterhin fehlt: die Umstellung lief ohne Messung |
| LLM-gestützte Neuklassifikation aller Bausteine nach Absicht | Der saubere Miraje-Schnitt. Kosten: ein Modelllauf über 1.091 Bausteine bei jedem Update, plus derselbe Lauf über 24.543 im Massen-Repo, wenn man es je öffnet. M9 liefert 80 % davon für 5 % der Kosten |
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

- `INDEX.md` — Bestand nach Typ, Domäne und Repo; Stand 2026-08-07 18:27
- `tools/harness.mjs` (1.397 Zeilen) — `DOMAIN_RULES`, `classify()`, `SKIP_DIRS`, `TRANSLATION_RE`, `isPlaceholder()`, `isClaudeHook()`, `hookDescription()`, ID-Dedup in `extractRepo()`, Score und UND-Semantik in `cmdSearch()`, Diff in `cmdUpdate()`, Manifest in `cmdInstall()`. **Bewusst ohne Zeilennummern:** eine frühere Fassung dieser Datei referenzierte zeilengenau gegen einen Stand von 805 Zeilen; nach dem Wachstum auf 1.397 zeigte jeder dieser Verweise ins Leere. Bezeichner überleben, Zeilennummern nicht
- `.claude/skills/harness-build/SKILL.md` — Symptomtabelle, Ablauf `search` → `show` → `install`. <!-- lint:historisch --> Frühere Fassungen dieser Datei nannten hier den Pfad `C:\Users\info\.claude\skills\harness-build\SKILL.md`. Die Bedien-Skills lagen einmal doppelt — einmal im Projekt, einmal global unter `~/.claude/skills/`, byte-identisch und ohne jeden Sync-Mechanismus. Die globale Ablage existiert nicht mehr; **die Fassung im Projekt ist die einzige**. Wer eine Skill ändert, ändert genau eine Datei
- `knowledge/01-harness-doktrin.md`, `knowledge/03-vorbilder.md` — Doktrin und Formatvorbild

**CLI-Läufe, aus denen die Zahlen stammen** (alle 2026-08-07):

- `stats`, Katalogstand 2026-08-08 19:36 (25.642 gesamt, 1.099 im Standardzugriff, 24.543 im Massen-Repo, 13 Domänenzeilen) — Zahl des damaligen Laufs bewusst zitiert; nach M2 vom 2026-08-10 stehen 1.084 im Standardzugriff, siehe Nachtrag in 3.2 <!-- lint:historisch -->
- Die folgenden `search`- und `show`-Läufe stammen aus dem Katalogstand **08:57** desselben Tages und sind nach dem Update um 18:27 **nicht** wiederholt worden. Betroffen sind nur Trefferzahlen, nicht der Bestand; das Update brachte zwei Skills hinzu (`affaan-m__ecc/skill/ito-inference`, `…/ito-training`) und benannte die vier `usestrix__strix`-Skills um. `affaan-m__ecc` steht seither bei 522 statt 520.
- `lint`
- `search` mit: `ja-jp` (1) · `日本語翻訳` (0) · `usr/bin/env` (50) · `usr/bin/env --type hook` (50) · `"" --type hook` (56) · `"" --type hook --domain meta` (42) · `review` (112) · `code review` (49) · `refactor` (18) · `api design` (10) · `documentation` (10) · `security audit` (5) · `"" --domain` für general (331), docs (72), seo (64), devops (86) · `"" --repo` für multica (10), mattpocock (36), anthropics (21), nextlevelbuilder (12), msitarzewski (270), affaan-m__ecc (520)
- `show` für alle in Abschnitt 3.1 genannten IDs sowie `affaan-m__ecc/skill/production-audit`, `affaan-m__ecc/agent/react-reviewer`, `affaan-m__ecc/skill/competitive-platform-analysis`
- `ls catalog/by-domain/` (12 Dateien) · `wc -l tools/harness.mjs` (1.397)

**Nicht verifiziert / Vermutung:** Die Zahl 56 „ohne brauchbare Description" (Abschnitt 3.2) ist disjunkt gezählt — 50 Shebang-Treffer plus 6 Einträge ohne jede Beschreibung, beide Mengen ausschliesslich Hooks, zusammen genau der Hook-Bestand. Die frühere Angabe „rund 230" war eine geschätzte Summe mit unbekannter Überschneidung und ist ersetzt. Offen bleiben die Werte in der Hygiene-Tabelle (Abschnitt 5.5) für „mehr als 3 Domänen" und „Namensdubletten" — sie lassen sich erst mit M11 erheben, weil `catalog/index.json` per Regel nicht gelesen werden darf. Die Aussage zur `walk`-Reihenfolge in Abschnitt 5.1 (alphabetisch, `docs/` vor `skills/`) ist aus dem damals beobachteten Ergebnis erschlossen, nicht aus einem Testlauf mit protokollierter Verzeichnisreihenfolge; sie ist seit `TRANSLATION_RE` nicht mehr nachstellbar. Die Union der Domänen `seo`, `product` und `media` (Abschnitt 2.3) ist **nicht** ermittelt — die drei Mengen überlappen, und eine überschneidungsfreie Summe wäre nur aus `catalog/index.json` zu holen.
