---
type: Rezept
title: Rezept 05 — SEO- / Content- / Marketing-Projekt
description: "Beantwortet, mit welchem Kern-Set ein Harness für ein SEO-/Content-Projekt beginnt, in dem der binäre Check fast vollständig fehlt."
status: stable
sources:
  - id: harness-katalog
    resource: catalog/index.json
    title: Katalog der Harness-Bibliothek — jede genannte ID über `node tools/harness.mjs show <id>` geprüft
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: harness-doktrin
    resource: knowledge/01-harness-doktrin.md
    title: Harness-Doktrin — Abschnitte 3.1, 3.3, 3.4, 3.5, 5, 6.2, 6.4, 7.2 und Checkliste 8 als Begründung der Auswahl
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: kern-set-entscheid
    resource: recipes/README.md
    title: Kern-Set-Entscheid vom 2026-08-08 — kein Hook im Kern-Set; die zwei standalone-fähigen generischen Schutz-Hooks werden je Rezept einzeln bewertet
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-08
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-05-07
tags: [rezept, seo, content, structured-data, core-web-vitals, ai-overviews]
---

# Rezept 05 — SEO- / Content- / Marketing-Projekt

## Wann dieses Rezept passt

- Es gibt eine erreichbare Live-URL oder eine, die demnächst live geht.
- Der Erfolg misst sich an Sichtbarkeit, Rankings oder Conversion — nicht an grünen Tests.
- Es entstehen Texte und Seitenstrukturen, nicht (nur) Anwendungslogik.
- Jemand wird fragen: "Warum ranken wir dafür nicht?" — und eine belegte Antwort erwarten.

**Wann es nicht passt:** Ein internes Werkzeug ohne öffentliche Auffindbarkeit.
Reine Performance-Optimierung einer App — dafür ist `react-performance` aus
Rezept 01 zuständig. Und: Wenn keine Live-URL abrufbar ist, liefern die meisten
Bausteine hier nichts, weil sie auf tatsächlichem Abruf beruhen.

**Voraussetzung der Kern-Set-Bausteine:** Die gesamte `AgriciDaniel__claude-seo`-Kette
— `seo-audit`, `seo-technical`, `seo-content`, `seo-performance`, `seo-schema` —
braucht eine **abrufbare Live-URL**, die crawlbar ist und nicht hinter Login oder
Bot-Sperre liegt; `seo-performance` misst Core Web Vitals und braucht dafür echte
Abrufe, keine Kopie im Dateisystem. Ohne das erzählen die Bausteine
SEO-Allgemeinplätze aus dem Modellwissen — genau die erste Zeile der
Schmerzpunkt-Tabelle unten.
Das ist eine Aussage über die Bausteine, keine Vermutung über dein Projekt.

## Die Schmerzpunkte dieses Projekttyps

| Symptom | Doktrin |
|---|---|
| Der Agent erzählt SEO-Allgemeinplätze aus dem Modellwissen, statt die Seite abzurufen. Nichts davon ist auf dieses Projekt bezogen. | 3.5 Oberflächliches QA |
| Empfehlungen werden nicht priorisiert: ein fehlendes `alt`-Attribut steht neben einer `noindex`-Direktive. | 3.4 |
| Text wird produziert, der sprachlich sauber ist und keine Suchabsicht bedient. | 3.3 Selbstbewertung |
| Ein Deployment kippt Titles oder robots.txt, und niemand merkt es wochenlang. | 3.1 Kontextverlust über Läufe hinweg |
| Structured Data wird geschrieben, aber nie validiert; Rich Results erscheinen nie. | 3.5 |
| Kein Zwischenstand wird festgehalten — beim nächsten Lauf beginnt die Analyse von vorn. | 5 Handoff |

Hier fehlt der binäre Check fast vollständig. Nach Doktrin 8/Frage 3 heisst das:
**Kriterienkatalog verpflichtend** und getrennte Bewerter. Genau das liefert
`claude-seo` — spezialisierte Subagenten mit je eigenem Kontext statt eines
Alleskönners.

## Kern-Set (Startauswahl, zu kürzen)

**Bindend ist die Spalte „Welches Problem er löst", nicht die Liste.** Wer das
Symptom im eigenen Projekt nicht wiederfindet, streicht die Zeile — vier passende
Bausteine schlagen sieben plausible. Dass jede ID im Katalog auflöst, macht sie
belegt, nicht verpflichtend.

| ID | Typ | Welches Problem er löst | KB |
|---|---|---|---:|
| `AgriciDaniel__claude-seo/skill/seo-audit` | skill | Orchestriert den vollständigen Audit: crawlt, erkennt den Geschäftstyp und verteilt an die Fach-Subagenten. Der Einstiegspunkt. | 8 |
| `AgriciDaniel__claude-seo/agent/seo-technical` | agent | Crawlability, Indexierbarkeit, URL-Struktur, Mobile, JS-Rendering. Die Klasse Fehler, die alles andere wirkungslos macht. | 3 |
| `AgriciDaniel__claude-seo/agent/seo-content` | agent | E-E-A-T, Tiefe, Lesbarkeit, Thin Content, Zitierfähigkeit für KI-Antworten. Eigener Kontext — bewertet den Text, nicht die Absicht dahinter. | 4 |
| `AgriciDaniel__claude-seo/agent/seo-performance` | agent | Core Web Vitals gemessen statt geschätzt. Fakt statt Einschätzung. | 4 |
| `AgriciDaniel__claude-seo/skill/seo-schema` | skill | Structured Data erkennen, **validieren** und erzeugen. Der Validierungsschritt ist der Punkt. | 11 |
| `AgriciDaniel__claude-seo/skill/seo-plan` | skill | Strategie, Seitenarchitektur, Content-Kalender vorab. Der Planner-Schritt — die Komponente, die laut Doktrin 7.2 am langsamsten altert. | 32 |

Sechs Bausteine, rund 62 KB. Das ist die Obergrenze für diesen Projekttyp.
`seo-plan` ist der grösste; er trägt den Scope-Teil und bleibt deshalb im Kern.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `AgriciDaniel__claude-seo/skill/seo-content-brief` | skill | Nur wenn tatsächlich Texte entstehen. Liefert Briefings mit Abschnitts-Wortzahlen und Wettbewerber-Scoring. | 23 |
| `AgriciDaniel__claude-seo/skill/seo-geo` | skill | Nur wenn Sichtbarkeit in AI Overviews, ChatGPT oder Perplexity ein erklärtes Ziel ist. | 24 |
| `AgriciDaniel__claude-seo/skill/seo-local` | skill | Nur bei lokalem Geschäft mit Google Business Profile, NAP-Konsistenz, Standortseiten. | 17 |
| `AgriciDaniel__claude-seo/skill/seo-drift` | skill | Nur ab regelmässigen Deployments. Baseline und Diff der SEO-Elemente — das strukturierte Gedächtnis zwischen Sessions (Doktrin 5). | 12 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | skill | Nur mit DataForSEO-Zugang. Ohne API-Schlüssel liefert der Baustein nichts. | 23 |
| `affaan-m__ecc/skill/marketing-campaign` | skill | Nur wenn über SEO hinaus ein Launch ansteht: Positionierung, Landingpage-Copy, E-Mail-Strecken, Content-Kalender. | 5 |
| `affaan-m__ecc/skill/brand-voice` | skill | Nur wenn ein erkennbarer Ton gehalten werden muss. Leitet das Stilprofil aus echten Texten ab statt aus Adjektiven. | 5 |
| `affaan-m__ecc/hook/config-protection` | hook | Nur wenn der Auftritt selbst eine Codebasis mit **bestehenden** Lint-/Format-Configs ist (ESLint, Prettier, Biome, Ruff) und das Symptom auftritt, dass der Agent bei Code-Fixes — typisch: Core-Web-Vitals-Nacharbeit nach `seo-performance`-Befunden — die Config aufweicht, statt den beanstandeten Code zu reparieren. Ohne solche Configs ist der Hook ein No-op (fail-open). Feuert erst nach Registrierung in `.claude/settings.json`; `install` druckt das Snippet. | 5 |

Hooks kommen in keinem Rezept ins Kern-Set (entschieden 2026-08-08, Begründung in
`recipes/README.md`): Ein Rezept kennt die Prüfschleifen eines fremden Projekts
nicht, und ein installierter Hook ist bis zur Registrierung in
`.claude/settings.json` ohnehin inaktiv.

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `AgriciDaniel__claude-seo/plugin/claude-seo` (4.119 KB, 379 Dateien) | Das komplette Repo als ein Paket. Enthält alles, auch die Extensions, die ohne API-Schlüssel tot sind. Sechs einzelne Skills und Agenten decken den Bedarf bei rund 1,5 % der Grösse. |
| `affaan-m__ecc/skill/seo` (6 KB) und `affaan-m__ecc/agent/seo-specialist` (3 KB) | Doppelung zum `claude-seo`-Bestand, deutlich flacher, ohne die spezialisierten Subagenten. Der Skill liegt zudem nur japanisch vor. Wenn zwei Bausteine dasselbe lösen, bleibt einer. |
| `AgriciDaniel__claude-seo/skill/seo-cluster` (50 KB, 5 Dateien) | Grösster Baustein der Domäne und teuer im Betrieb: paarweiser SERP-Vergleich kostet viele Abfragen. Lohnt erst, wenn die Content-Architektur wirklich neu entworfen wird — nicht beim Audit. |
| `AgriciDaniel__claude-seo/skill/seo-firecrawl` (8 KB), `seo-ahrefs`, `seo-profound`, `seo-seranking` | Extension-Skills, die ohne den jeweiligen API-Zugang keinen Wert haben. Nur nachrüsten, wenn der Zugang nachweislich vorliegt — sonst sind es Komponenten ohne Wirkung (Doktrin 6.4). |
| `affaan-m__ecc/hook/block-no-verify` (14 KB) | Blockiert Git-Hook-Bypässe (`--no-verify`, `core.hooksPath=`) — erzwingt also nur etwas, wo Git-Hooks (pre-commit, pre-push) existieren. Dieses Rezept setzt einen Projekttyp voraus, in dem der binäre Check fast vollständig fehlt (siehe Schmerzpunkte); ohne Git-Hooks feuert der Hook nie und ist eine Komponente ohne Wirkung (Doktrin 6.4). Das Risiko liegt hier in der unbelegten Empfehlung, nicht im übersprungenen Commit-Gate. Trägt das konkrete Projekt doch pre-commit-Hooks, ist er nachrüstbar — dann erst in `.claude/settings.json` registrieren, sonst bleibt er inaktiv. |

## Installationsbefehl

```bash
cd "<projektverzeichnis>"
node tools/harness.mjs install \
  AgriciDaniel__claude-seo/skill/seo-audit \
  AgriciDaniel__claude-seo/agent/seo-technical \
  AgriciDaniel__claude-seo/agent/seo-content \
  AgriciDaniel__claude-seo/agent/seo-performance \
  AgriciDaniel__claude-seo/skill/seo-schema \
  AgriciDaniel__claude-seo/skill/seo-plan \
  --to <projektpfad>
```

## Verifikationspfad — auszufüllen, bevor eingeführt wird

```
Befehl im Zielprojekt, der ein Ja/Nein liefert:  ______________________
Zuletzt grün gelaufen am:                        ______________________
```

Hier steht **kein** fester Befehl, weil kein Rezept die Umgebung eines fremden
Auftritts kennt. Bei diesem Projekttyp ist die Prüfschleife ein **wiederholbarer
Abruf**: derselbe Crawl oder Messlauf gegen dieselben URLs, dessen Ergebnis sich
zwischen zwei Ständen vergleichen lässt.

**Existiert kein solcher Befehl, ist er der erste Arbeitsschritt**, nicht der letzte.
Ohne Vorher-Wert ist jede Empfehlung eine Meinung — und ein Deployment, das Titles
oder `robots.txt` kippt, fällt monatelang niemandem auf.

## Reihenfolge der Einführung

1. **Zuerst messen, nicht planen.** `seo-audit` mit `seo-technical` und
   `seo-performance` auf die bestehende URL. Ein Plan ohne Ausgangswert ist eine
   Meinung.
2. **Dann das Blockierende beheben.** Was Indexierung verhindert (robots, noindex,
   Canonicals, kaputtes Rendering), hat Vorrang vor allem Inhaltlichen. Vorher
   wirkt kein Text.
3. **Dann `seo-plan`.** Erst jetzt, mit den Befunden in der Hand. Der Planner
   soll ambitioniert im Umfang und weich in der Umsetzung bleiben (Doktrin 6.2).
4. **Dann Inhalt.** `seo-content` als Bewerter, `seo-content-brief` als Erzeuger —
   in dieser Reihenfolge, damit der Bewerter nicht seinen eigenen Text benotet.
5. **Dann `seo-schema`**, wenn die Seitentypen feststehen. Structured Data vor
   der Struktur zu schreiben, erzeugt nur Nacharbeit.
6. **Zuletzt `seo-drift`** als Baseline. Ab da ist jeder Regressionsfund billig;
   davor gibt es nichts zu vergleichen.
