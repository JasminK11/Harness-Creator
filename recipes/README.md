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
  - id: kern-set-hook-entscheid
    resource: "Beidseitige adversariale Prüfung des Kern-Set-Hook-Befunds, drei Agenten, 2026-08-08"
    title: Kern-Set-Hook-Entscheid — Lesart A widerlegt, Lesart B im Kern bestätigt, Allsatz gefallen
    author: Harness-Bibliothek (lokal, Prüf-Workflow)
    last_modified: 2026-08-08
generated: { by: claude-fable-5, at: 2026-08-08T00:00:00Z }
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
   ausgeschnitten und muss allein stehen können. Eine Rolle, die das Projekt schon
   selbst besetzt — eigener Agent, eigener Hook, eigene Prozessregel —, zählt
   dabei wie ein fehlendes Symptom: der Kern-Set-Baustein fliegt raus. Erster
   Beleg: Dropfolio-Lauf 2026-08-10, `knowledge/LOG.md`.
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

## Kein Pflicht-Hook im Kern-Set — entschieden 2026-08-08, generische Schutz-Hooks je Rezept bewertet

Die sechs Kern-Sets bestehen zusammen aus 33 Zeilen mit 32 verschiedenen IDs
(`affaan-m__ecc/agent/security-reviewer` steht in 02 und 04), **ausschliesslich vom
Typ `skill` und `agent`**. Kein einziger Hook, kein Command, kein MCP-Server. Das
stand in Spannung zu Doktrin 1.1 („Hook = Zwang, nicht Bitte") und zu
`harness-build/SKILL.md` Schritt 4: „Ein Hook, der eine Regel erzwingt, ist mehr wert
als drei Skills, die sie empfehlen." Am **2026-08-08** wurde die Frage in einer
**beidseitigen adversarialen Prüfung** (drei Agenten; jede Lesart musste die
Gegenposition am laufenden System widerlegen) entschieden.

**Lesart A — „mindestens ein Verifikations-Hook gehört in jedes Kern-Set" — ist
widerlegt.** Die Doktrin meint mit dem billigsten Hebel den **Verifikationsweg des
Zielprojekts**, nicht einen Hook-Baustein aus dem Katalog (Reyes-Geltungsbereich).
`search "verification" --type hook` liefert **null Treffer** — es existiert kein
stack-agnostischer Verifikations-Hook, den ein Rezept zur Pflicht machen könnte.
Ein blind installierter Hook wäre nach den Fehlerklassen 7.6/7.3 tot oder
schädlich: die Illusion eines Gates ist schlechter als das ehrliche leere
Verifikationspfad-Feld, das jedes Rezept trägt.

**Lesart B — „skill/agent-only ist korrekt" — hält im Kern, fällt im Allsatz.**
Bestätigt ist die Reihenfolge: erst Verifikationspfad, dann Zwang; kein
hartkodierter Verifikationsbefehl im Rezept, weil es die Skripte eines fremden
Projekts nicht kennt; und die Bibliothek schaltet fremde Hooks bewusst nicht
scharf — ein installierter Hook ist zunächst inaktiv, bis ihn jemand registriert.
Der Allsatz „ein generischer Hook wäre wirkungslos oder falsch" ist dagegen
gefallen: der Katalog enthält mindestens drei generisch wirksame Hooks, alle am
2026-08-08 per `show` geprüft:

- `affaan-m__ecc/hook/config-protection` — blockiert Änderungen an **bestehenden**
  Lint-/Format-Configs (ESLint, Prettier, Biome, Ruff); adressiert die dokumentierte
  Modellschwäche „Checks weichklopfen statt Code fixen"; Neuanlage bleibt erlaubt,
  fail-open. Bester Einzelkandidat.
- `affaan-m__ecc/hook/block-no-verify` — blockiert git-Hook-Bypass (`--no-verify`,
  `core.hooksPath`) rein aus dem Kommandostring, flag-positionsbewusst tokenisiert,
  null Projektwissen nötig; wirkt allerdings nur, wo Git-Hooks existieren.
- `affaan-m__ecc/hook/post-edit-format` — detektiert den Formatter selbst und
  schweigt sonst, hängt aber per `require` an `../lib/resolve-formatter` aus der
  ECC-Repo-Struktur: **nicht standalone**, darum kein Kandidat.

Keiner dieser Kandidaten war je in einem Rezept geprüft worden — weder unter
„Erweiterung" noch unter „Bewusst weggelassen" (Grep über `recipes/`: 0 Treffer,
nachgestellt 2026-08-08). Die skill/agent-only-Zusammensetzung war also
**ungeprüfter Zustand, kein Prüfergebnis**.

**Die Entscheidung.** Die Absicht-Lesart ist für Verifikations-Hooks bestätigt:
**kein Pflicht-Hook im Kern-Set.** Die zwei standalone-fähigen generischen
Schutz-Hooks (`config-protection`, `block-no-verify`) werden **je Rezept einzeln
bewertet** und landen entweder unter „Erweiterung (optional)" mit Bedingung und
dem Hinweis, dass der Hook nach `install` erst durch Registrierung in
`settings.json` wirkt, oder unter „Bewusst weggelassen" mit Grund. Der Ort für das
Ergebnis sind die Erweiterungs- und Weggelassen-Abschnitte der sechs Rezepte —
wer wissen will, warum ein Schutz-Hook in einem Rezept fehlt oder steht, liest
dort nach, nicht hier.

**Korrektur einer Falschaussage dieser Datei.** Frühere Fassungen behaupteten:
„Hooks stehen in allen sechs Rezepten nur unter ‚Erweiterung (optional)', mit
einer Bedingung davor." <!-- lint:historisch --> Der widerlegte Satz bleibt hier
als Altstand zitiert, weil die Korrektur ohne das Vorher nicht dokumentiert wäre;
verbindlich ist der Folgesatz. Tatsächlich nannten am 2026-08-08 nur Rezept 01
(`affaan-m__ecc/hook/post-edit-typecheck`) und Rezept 02
(`affaan-m__ecc/hook/pre-bash-dev-server-block`) überhaupt einen Hook unter
„Erweiterung"; Rezept 04 nannte einen nur unter „Bewusst weggelassen"
(`affaan-m__ecc/hook/insaits-security-monitor`); die Rezepte 03, 05 und 06
enthielten das Wort „Hook" nirgends.

**Teilentschieden ist damit auch die Eigenanwendung.** Dieses Projekt hat am
selben Tag seine ersten eigenen Hooks bekommen (`.claude/settings.json` registriert
`zugriffsschutz.mjs` und `pruefpflicht.mjs`) — die Spannung „die Bibliothek predigt
Zwang und hat im eigenen Haus keinen einzigen" ist nicht mehr offen.

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
