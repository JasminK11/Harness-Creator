---
type: Rezept
title: Rezept 01 — Web-App mit React / Next.js
description: "Beantwortet, mit welchem Kern-Set aus dem Katalog ein Harness für eine React-/Next.js-Web-App beginnt und welche naheliegenden Kandidaten bewusst wegfallen."
status: stable
sources:
  - id: harness-katalog
    resource: catalog/index.json
    title: Katalog der Harness-Bibliothek — jede genannte ID über `node tools/harness.mjs show <id>` geprüft
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: harness-doktrin
    resource: knowledge/01-harness-doktrin.md
    title: Harness-Doktrin — Abschnitte 2, 3.3, 3.5, 6.1, 6.2 als Begründung der Auswahl
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-05-07
tags: [rezept, react, nextjs, frontend, browser-verifikation, accessibility]
---

# Rezept 01 — Web-App mit React / Next.js

## Wann dieses Rezept passt

- `package.json` enthält `react` oder `next`; der Code liegt überwiegend in `.tsx`/`.jsx`.
- Es gibt eine sichtbare Oberfläche, die ein Mensch bedient — nicht nur ein Build-Artefakt.
- Die App lässt sich lokal starten (`dev`-Skript) und im Browser aufrufen.
- Es entstehen mehrere Komponenten, die miteinander Zustand teilen.

**Wann es nicht passt:** Vue, Angular, Svelte (dafür gibt es eigene Bausteine,
z. B. `affaan-m__ecc/skill/vue-patterns`). React Native / Expo — dort greift
`affaan-m__ecc/skill/react-native-patterns`, und Browser-Verifikation entfällt.
Eine einzelne statische Seite ohne Interaktion braucht von diesem Rezept nichts.

**Voraussetzung eines Kern-Set-Bausteins:** `anthropics__skills/skill/webapp-testing`
fährt Playwright gegen eine **lokal startbare** App. Ohne `dev`-Skript, ohne
installierbaren Browser oder in einer Umgebung ohne Prozessstart liefert er nichts —
und dann fällt der Verifikationsweg weg, der die ganze Auswahl trägt. Das ist eine
Aussage über den Baustein, keine Vermutung über dein Projekt: prüf sie einmal, bevor
du ihn einbaust.

## Die Schmerzpunkte dieses Projekttyps

| Symptom | Doktrin |
|---|---|
| Der Agent meldet "Feature fertig", die Schaltfläche tut aber nichts. Nur Bedienen deckt das auf. | 3.5 Oberflächliches QA, 6.1 |
| Hooks werden falsch verschachtelt, `useEffect` läuft doppelt, Server/Client-Grenze wird verletzt — Fehler, die der Compiler nicht sieht. | 3.3 Selbstbewertung |
| Der Build bricht mit einer Bundler-Meldung ab, und der Agent baut die Architektur um, statt die Konfiguration zu reparieren. | 6.2 Fehlerkaskade |
| Tastaturbedienung und Screenreader werden nie geprüft, weil sie visuell nicht auffallen. | 3.5 |
| Bei subjektiver Optik lobt der Agent das eigene Ergebnis. | 3.3 |

Daraus folgt die Auswahl: ein Verifikationsweg an der **laufenden** App (billigster
echter Hebel, Doktrin 2), zwei prüfende Subagenten mit eigenem Kontext, und
Musterwissen genau dort, wo der Compiler nichts merkt.

## Kern-Set (Startauswahl, zu kürzen)

**Bindend ist die Spalte „Welches Problem er löst", nicht die Liste.** Wer das
Symptom im eigenen Projekt nicht wiederfindet, streicht die Zeile — vier passende
Bausteine schlagen sieben plausible. Dass jede ID im Katalog auflöst, macht sie
belegt, nicht verpflichtend.

| ID | Typ | Welches Problem er löst | KB |
|---|---|---|---:|
| `anthropics__skills/skill/webapp-testing` | skill | Playwright-Werkzeugkasten: die App wirklich bedienen, Screenshots und Browser-Logs lesen. Ersetzt Selbstbewertung durch Beobachtung. | 22 |
| `affaan-m__ecc/skill/react-patterns` | skill | Hook-Disziplin, Server/Client-Grenzen, Suspense, Form Actions — die Fehlerklasse, die typecheck-sauber durchläuft. | 11 |
| `affaan-m__ecc/skill/react-testing` | skill | RTL + Vitest/Jest, MSW für Netzwerk, axe für a11y, und die Grenze zwischen Komponententest und E2E. | 13 |
| `affaan-m__ecc/agent/react-reviewer` | agent | Zweite, unabhängige Sicht auf jede `.tsx`-Änderung. Eigener Kontext, kennt die Begründung des Autors nicht. | 5 |
| `affaan-m__ecc/agent/react-build-resolver` | agent | Build-Fehler chirurgisch beheben statt umbauen. Deckt Vite, webpack, Next.js, CRA, Parcel, esbuild, Bun ab. | 6 |
| `affaan-m__ecc/skill/frontend-a11y` | skill | Semantik, ARIA, Fokus, Formular-Labels — prüfbar, aber nur wenn jemand danach sucht. | 12 |

Sechs Bausteine, rund 69 KB. Das ist die Obergrenze für diesen Projekttyp.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `affaan-m__ecc/skill/react-performance` | skill | Nur wenn ein **gemessenes** Performance-Problem vorliegt (LCP, Bundle-Grösse, Re-Render). 70+ Regeln — ohne Messwert nur Rauschen. | 18 |
| `nextlevelbuilder__ui-ux-pro-max-skill/agent/design-review` | agent | Nur wenn Playwright- oder chrome-devtools-MCP verfügbar ist und Optik bewertet werden soll. Fährt echte Viewports, prüft WCAG 2.1 AA. | 5 |
| `anthropics__skills/skill/frontend-design` | skill | Nur bei neuem Interface ohne bestehendes Design-System. Nicht bei Umbau in vorhandener Optik. | 18 |
| `affaan-m__ecc/skill/nextjs-turbopack` | skill | Nur Next.js 16+ und nur, wenn die Dev-Laufzeit stört. | 2 |
| `affaan-m__ecc/command/react-test` | command | Nur wenn TDD verbindlich gelten soll — der Command erzwingt Test-zuerst und prüft Coverage-Ziele. | 7 |
| `affaan-m__ecc/hook/post-edit-typecheck` | hook | Nur wenn der Agent typfehlerhafte Zwischenstände als fertig meldet. Hook = Zwang, nicht Bitte (Doktrin 1.1). | 3 |

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `affaan-m__ecc/skill/frontend-patterns` (16 KB) | Überschneidet sich fast vollständig mit `react-patterns` plus `react-performance`. Zwei Bausteine für dieselbe Frage sind teurer, nicht besser. `react-patterns` ist spezifischer und aktueller (React 18/19). |
| `nextlevelbuilder__ui-ux-pro-max-skill/plugin/ui-ux-pro-max` (15.696 KB, 567 Dateien) | Sammelpaket mit Style-, Palette- und Font-Datenbank. Sprengt jedes Projekt. Der einzelne `design-review`-Agent aus demselben Repo liefert den nützlichen Teil in 5 KB. |
| `affaan-m__ecc/skill/motion-ui`, `motion-patterns`, `motion-foundations`, `motion-advanced` (je 1 KB) | Leere Übersetzungs-Platzhalter ("日本語翻訳：このファイルは … 用の日本語翻訳が必要です"). Kein verwertbarer Inhalt. |
| `affaan-m__ecc/skill/browser-qa` (3 KB) | Liegt nur als japanische Übersetzung vor und ist deutlich flacher als `webapp-testing`, das dieselbe Aufgabe mit lauffähigen Playwright-Skripten löst. |

## Installationsbefehl

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs install \
  anthropics__skills/skill/webapp-testing \
  affaan-m__ecc/skill/react-patterns \
  affaan-m__ecc/skill/react-testing \
  affaan-m__ecc/agent/react-reviewer \
  affaan-m__ecc/agent/react-build-resolver \
  affaan-m__ecc/skill/frontend-a11y \
  --to <projektpfad>
```

Vorher einmal mit `--dry-run` laufen lassen.

## Verifikationspfad — auszufüllen, bevor eingeführt wird

```
Befehl im Zielprojekt, der ein Ja/Nein liefert:  ______________________
Zuletzt grün gelaufen am:                        ______________________
```

Hier steht **kein** fester Befehl, weil kein Rezept die Skripte eines fremden
Projekts kennt. Trag ein, was dort tatsächlich existiert und grün läuft — bei diesem
Projekttyp typischerweise `npm run build`, `npm test` oder ein `tsc --noEmit`.

**Existiert kein solcher Befehl, ist er der erste Arbeitsschritt**, nicht der letzte.
Ohne ihn ist nach dem Einbau nicht messbar, ob sich etwas verbessert hat: alles, was
bleibt, ist das Urteil des Agenten über sich selbst — genau die Schwäche, gegen die
die halbe Auswahl oben gerichtet ist.

## Reihenfolge der Einführung

1. **Zuerst der Verifikationsweg.** `webapp-testing` allein installieren und einen
   Durchlauf machen: App starten, eine Kernfunktion durchklicken lassen. Wenn dabei
   nichts auffällt, was ein Code-Review übersehen hätte, brauchst du weniger
   Harness als hier steht (Doktrin 2, Stufe 2).
2. **Dann das Musterwissen.** `react-patterns` und `frontend-a11y` — sie kosten
   nur Tokens, wenn sie tatsächlich geladen werden.
3. **Dann die Reparatur.** `react-build-resolver` beim ersten Build-Abbruch, nicht vorher.
4. **Dann die Prüfung.** `react-reviewer` einführen, sobald mehr als eine Handvoll
   Komponenten existiert und Änderungen einander beeinflussen.
5. **Zuletzt die Tests.** `react-testing` beim ersten Regressionsfehler. Wo eine
   grüne Test-Suite steht, wird der Reviewer teilweise überflüssig — das ist der
   erwünschte Endzustand, kein Rückschritt (Doktrin 3.3).

Erweiterungen erst danach, einzeln, und jede mit notiertem Symptom.
