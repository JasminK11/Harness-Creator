---
type: Wegweiser
title: Rezepte — Ebene 3 der Harness-Bibliothek
description: "Beantwortet, welches der sechs Rezepte zu einem Projekt passt und wie ein Rezept anzuwenden ist, ohne die Doktrin-Prüfung zu überspringen."
status: stable
sources:
  - id: harness-doktrin
    resource: knowledge/01-harness-doktrin.md
    title: Harness-Doktrin — Abschnitt 0 und Checkliste 8, Begründungspflicht je Baustein sowie Load-Bearing-Test 7.1
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-08-07
tags: [rezept, wegweiser, harness-bibliothek, projekttypen]
---

# Rezepte — Ebene 3 der Harness-Bibliothek

> Fertige Baupläne pro Projekttyp. Kein Ersatz für `knowledge/01-harness-doktrin.md`,
> sondern deren Anwendung auf sechs häufige Fälle.

## Wozu diese Ebene

`INDEX.md` sagt, **was** es gibt. `knowledge/` sagt, **warum** man etwas einbaut.
Hier steht, **womit man anfängt**, wenn das Projekt einem der sechs Typen ähnelt.

Ohne Rezept fängt jeder Agent bei null an: er sucht, rät, baut zu viel ein und
verifiziert nichts. Ein Rezept ersetzt diese Rateschleife durch eine belegte
Startauswahl — jede ID darin war zum Zeitpunkt des Schreibens per
`node tools/harness.mjs show <id>` geprüft. Das ist eine Aussage über den
Katalogstand von damals, keine Garantie: die IDs gehören fremden Repos, und die
können umbenennen. Wie man das erkennt und auflöst, steht unten unter „Wenn eine
Baustein-ID nicht mehr auflöst".

## Ein Rezept ist ein Startpunkt, kein Dogma

Das ist die wichtigste Zeile dieser Datei. Die Doktrin verlangt für **jeden**
Baustein eine konkrete Modellschwäche, die *in diesem Projekt* tatsächlich
auftritt (`knowledge/01-harness-doktrin.md`, Abschnitt 0 und Checkliste 8).
Ein Rezept kann diese Prüfung nicht vorwegnehmen — es kennt das Projekt nicht.

Deshalb gilt beim Anwenden:

1. Rezept lesen, Abschnitt "Wann dieses Rezept passt" gegen das Projekt halten —
   dort steht auch, welche Kern-Set-Bausteine eine harte Voraussetzung haben
   (startbare App, erreichbare Endpunkte, abrufbare Live-URL, ausführbares Ziel).
2. Kern-Set durchgehen und **kürzen**. Wenn du für einen Baustein das Symptom
   nicht benennen kannst, fliegt er raus. Vier passende schlagen sieben plausible.
   Deshalb heisst der Abschnitt in jedem Rezept "Kern-Set (Startauswahl, zu
   kürzen)" und trägt diesen Satz noch einmal bei sich — er wird abschnittsweise
   ausgeschnitten und muss allein stehen können.
3. Erweiterung nur anfassen, wenn die dort genannte Bedingung erfüllt ist.
4. "Bewusst weggelassen" lesen, bevor du selbst suchst — diese Kandidaten sind
   bereits geprüft und verworfen. Nicht erneut evaluieren.
5. **Verifikationspfad ausfüllen**, bevor irgendetwas installiert wird. Jedes
   Rezept hat dafür ein leeres Feld statt eines festen Befehls: es kennt die
   Skripte eines fremden Projekts nicht. Gibt es keinen solchen Befehl, ist er der
   erste Arbeitsschritt — ohne ihn ist hinterher nicht messbar, ob das Harness
   etwas geändert hat.
6. Nach dem Einbau: Begründung und Datum ins Projekt schreiben, damit der
   nächste Load-Bearing-Test (Doktrin 7.1) weiss, warum etwas da ist.

## Wenn eine Baustein-ID nicht mehr auflöst

Jede ID in einem Rezept zeigt auf ein **fremdes** Repo. Benennt dessen Betreiber
einen Skill um, ist die ID tot, ohne dass jemand hier eine Datei angefasst hat, und
`install` bricht ab. Das ist kein Ausnahmefall: am 2026-08-07 hat `usestrix/strix`
alle vier seiner Skills auf einmal umbenannt (`strix-pentest` →
`penetration-testing-with-strix` und drei weitere), womit drei IDs in Rezept 04 und
eine in `knowledge/06` gleichzeitig ins Leere zeigten.

So läuft die Auflösung:

1. `node tools/harness.mjs lint` findet es. Tote IDs in `recipes/` haben Schwere
   **hoch**, weil dort die `install`-Befehle stehen. Nach jedem `update` einmal
   laufen lassen — der Katalog ist der einzige Zeuge dafür, was es noch gibt.
2. `CHANGELOG.md` lesen. `update` schreibt dort „Neu" und „Entfernt" desselben
   Laufs untereinander; bei einer Umbenennung stehen alter und neuer Name direkt
   nebeneinander, und die Zuordnung ist ablesbar statt geraten.
3. `node tools/harness.mjs search "<stichwort>" --repo <repo>` listet, was das Repo
   heute hergibt, wenn der Changelog nicht reicht.
4. **Jede Zuordnung mit `show <neue-id> --head 30` gegen die Aufgabe prüfen, die im
   Rezept beschrieben ist.** Namensähnlichkeit ist eine Vermutung — ein umbenannter
   Baustein kann auch etwas anderes geworden sein. Tut er nicht mehr, was die Zeile
   verspricht, wird die Zeile gestrichen, nicht die ID getauscht.
5. Den fertigen `install`-Befehl am Ende des Rezepts mitziehen. Er ist die Stelle,
   die zuerst kopiert und zuletzt gelesen wird.

## Welches Rezept

| Datei | Projekttyp | Erkennungsmerkmal |
|---|---|---|
| `01-web-app-react-nextjs.md` | Web-App im Browser | `package.json` mit `react`/`next`, `.tsx`-Dateien |
| `02-backend-api.md` | Server, API, Datenbank | HTTP-Handler, Migrationen, OpenAPI/Schema |
| `03-python-daten-ml.md` | Python, Daten, ML | `pyproject.toml`, Notebooks, Trainings- oder Pipeline-Code |
| `04-security-audit-pentest.md` | Sicherheitsprüfung fremder Software | Ziel ist Befunde finden, nicht Features bauen |
| `05-seo-content-marketing.md` | Sichtbarkeit und Text | Live-URL vorhanden, Ergebnis ist Ranking/Text, nicht Code |
| `06-legacy-onboarding.md` | Fremde Codebasis übernehmen | Repo existiert, niemand im Raum kennt es |

Mehrere Rezepte dürfen sich überlagern. Eine Next.js-App mit eigener API nimmt
das Kern-Set aus `01` und ergänzt aus `02` gezielt — nicht beide Kern-Sets addieren.

## Deckung im Katalog

Alle sechs Typen sind belegt; keiner musste ersetzt werden. Sehr gut versorgt sind
SEO (58 Bausteine im Standardzugriff, überwiegend aus einem durchgehenden Repo),
Frontend/React und Testing; gut versorgt Backend/API, Python/ML und Onboarding;
dünn, aber ausreichend der Pentest-Fall mit vier Strix-Skills plus Reviewer-Agenten.

**Erledigte Einschränkung.** Frühere Fassungen dieser Datei warnten, ein grosser
Teil der `ecc`-Skills liege im Katalog **nur als japanische Übersetzung** vor
(Quellpfad `docs/ja-JP/skills/...`). Das galt, solange die Übersetzung ihr
englisches Original per ID-Dedup überschrieb. Der Extraktor erkennt
Übersetzungsverzeichnisse inzwischen (`TRANSLATION_RE` in `tools/harness.mjs`):
`error-handling`, `redis-patterns`, `hexagonal-architecture`, `git-workflow`,
`codebase-onboarding`, `repo-scan`, `code-tour` und `security-scan` lösen alle
wieder auf ihre englische Fassung auf. Wo sie in einzelnen Rezepten noch unter
"Bewusst weggelassen" stehen, ist die dortige Begründung überholt. `show <id>
--head 20` vor der Übernahme bleibt trotzdem richtig.

## Kein Kern-Set enthält einen Zwang — und das ist zu entscheiden, nicht zu übersehen

Die sechs Kern-Sets bestehen zusammen aus 33 Zeilen mit 32 verschiedenen IDs
(`affaan-m__ecc/agent/security-reviewer` steht in 02 und 04), **ausschliesslich vom
Typ `skill` und `agent`**. Kein einziger Hook, kein Command, kein MCP-Server. Der
Pflichtteil aller Rezepte empfiehlt damit ausschliesslich Kontextmaterial — Wissen,
das das Modell heranziehen *kann* — und keinen einzigen Mechanismus, der etwas
erzwingt.

Das steht in Spannung zu Doktrin 1.1 („Hook = Zwang, nicht Bitte") und zu
`harness-build/SKILL.md` Schritt 4: „Ein Hook, der eine Regel erzwingt, ist mehr wert
als drei Skills, die sie empfehlen." Hooks stehen in allen sechs Rezepten nur unter
"Erweiterung (optional)", mit einer Bedingung davor.

Zwei Lesarten, und die Entscheidung ist noch nicht gefallen:

- **Absicht.** Ein Hook ohne vorhandene Prüfschleife führt nichts aus — er liegt tot
  in `.claude/hooks/`. Ein Rezept kennt die Prüfschleifen des Zielprojekts nicht und
  kann deshalb keinen Hook zur Pflicht machen. Dann ist der Ort für Hooks genau
  „Erweiterung, sobald der Check existiert".
- **Lücke.** Die Rezepte sind aus Kontextmaterial gebaut, weil der Katalog davon am
  meisten hergibt (`skill` und `agent` stellen den Bestand), nicht weil es die
  richtige Wahl war.

Bis das entschieden ist, gilt die erste Lesart als Arbeitsannahme, und
`harness-build` Schritt 1b erhebt die Prüfschleifen des Zielprojekts, bevor
überhaupt gesucht wird.

Ein Rauchtest für ausführbare Kern-Set-Bausteine wurde erwogen und fällt aus:
`install --dry-run` über alle 32 IDs meldet bei 31 „nichts Ausführbares gefunden";
einziger Träger ist `anthropics__skills/skill/webapp-testing` mit vier Skripten,
darunter `scripts/with_server.py`. Eine Markdown-Datei hat kein Ausfallverhalten —
bei 31 von 32 gäbe es nichts zu testen. Wer den Befund nachstellen will, gibt
sämtliche Kern-Set-IDs in einem Aufruf an `install --dry-run --yes` und liest die
Zeilen mit `!` am Anfang.

## Werkzeug

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs show <id>                     # vor dem Einbau ansehen
node tools/harness.mjs install <id...> --to <projekt> # mehrere IDs auf einmal
node tools/harness.mjs install <id> --to <projekt> --dry-run
```

`catalog/index.json` nie direkt lesen — rund 19 MB. Wie viele Einträge das sind,
sagt `node tools/harness.mjs stats`; die Zahl wandert mit jedem `update` und hat
hier nichts zu tragen, die Dateigrösse schon.
