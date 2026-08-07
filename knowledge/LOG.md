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

Eine Aktion pro Eintrag. Wer in einem Lauf einpflegt **und** prüft, schreibt
zwei Einträge.

## Einträge

## [2026-08-07] revise | Widersprüchliche Bestandszahlen, tote Zeilenverweise und nicht auflösbare Baustein-IDs korrigiert

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
ausdrücklich als „existiert nicht mehr" markiert.

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
