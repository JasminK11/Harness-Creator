# Rezepte — Ebene 3 der Harness-Bibliothek

> Fertige Baupläne pro Projekttyp. Kein Ersatz für `knowledge/01-harness-doktrin.md`,
> sondern deren Anwendung auf sechs häufige Fälle.

## Wozu diese Ebene

`INDEX.md` sagt, **was** es gibt. `knowledge/` sagt, **warum** man etwas einbaut.
Hier steht, **womit man anfängt**, wenn das Projekt einem der sechs Typen ähnelt.

Ohne Rezept fängt jeder Agent bei null an: er sucht, rät, baut zu viel ein und
verifiziert nichts. Ein Rezept ersetzt diese Rateschleife durch eine belegte
Startauswahl — jede ID darin ist per `node tools/harness.mjs show <id>` geprüft,
`install` schlägt also nicht fehl.

## Ein Rezept ist ein Startpunkt, kein Dogma

Das ist die wichtigste Zeile dieser Datei. Die Doktrin verlangt für **jeden**
Baustein eine konkrete Modellschwäche, die *in diesem Projekt* tatsächlich
auftritt (`knowledge/01-harness-doktrin.md`, Abschnitt 0 und Checkliste 8).
Ein Rezept kann diese Prüfung nicht vorwegnehmen — es kennt das Projekt nicht.

Deshalb gilt beim Anwenden:

1. Rezept lesen, Abschnitt "Wann dieses Rezept passt" gegen das Projekt halten.
2. Kern-Set durchgehen und **kürzen**. Wenn du für einen Baustein das Symptom
   nicht benennen kannst, fliegt er raus. Vier passende schlagen sieben plausible.
3. Erweiterung nur anfassen, wenn die dort genannte Bedingung erfüllt ist.
4. "Bewusst weggelassen" lesen, bevor du selbst suchst — diese Kandidaten sind
   bereits geprüft und verworfen. Nicht erneut evaluieren.
5. Nach dem Einbau: Begründung und Datum ins Projekt schreiben, damit der
   nächste Load-Bearing-Test (Doktrin 7.1) weiss, warum etwas da ist.

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

Alle sechs Typen sind belegt; keiner musste ersetzt werden. Die Bestände sind
allerdings ungleich tief:

- **Sehr gut:** SEO (61 Bausteine, ein durchgehendes Repo), Frontend/React, Testing.
- **Gut:** Backend/API, Python/ML, Onboarding.
- **Dünn, aber ausreichend:** Pentest — vier Strix-Skills plus Reviewer-Agenten.

Eine Einschränkung, die in allen Rezepten wiederkehrt: Ein grosser Teil der
`ecc`-Skills liegt im Katalog **nur als japanische Übersetzung** vor (Quellpfad
`docs/ja-JP/skills/...`). Betroffen sind unter anderem `error-handling`,
`redis-patterns`, `hexagonal-architecture`, `git-workflow`, `codebase-onboarding`,
`repo-scan`, `code-tour`, `security-scan`. Sie funktionieren technisch, sind für
einen deutschsprachigen Betrieb aber schlecht wartbar — in den Rezepten stehen
sie deshalb konsequent unter "Bewusst weggelassen". Vor der Übernahme eines
solchen Bausteins immer `show <id> --head 20` prüfen.

## Werkzeug

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs show <id>                     # vor dem Einbau ansehen
node tools/harness.mjs install <id...> --to <projekt> # mehrere IDs auf einmal
node tools/harness.mjs install <id> --to <projekt> --dry-run
```

`catalog/index.json` nie direkt lesen — 25.593 Einträge.
