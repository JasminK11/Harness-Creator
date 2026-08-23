---
type: Rezept
title: Rezept 02 — Backend- / API-Projekt
description: "Beantwortet, mit welchem Kern-Set ein Harness für ein Backend mit externen Konsumenten beginnt — Vertragsprüfung statt Bewertungs-Loop."
status: stable
sources:
  - id: harness-katalog
    resource: catalog/index.json
    title: Katalog der Harness-Bibliothek — jede genannte ID über `node tools/harness.mjs show <id>` geprüft
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-08
  - id: harness-doktrin
    resource: knowledge/01-harness-doktrin.md
    title: Harness-Doktrin — Abschnitte 3.3, 3.4, 3.5, 6.2 und Checkliste 8 als Begründung der Auswahl
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-08-07
tags: [rezept, backend, api, contract-first, migrationen, datenbank, sicherheit]
---

# Rezept 02 — Backend- / API-Projekt

## Wann dieses Rezept passt

- Das Projekt liefert HTTP-Endpunkte, gRPC-Methoden oder Event-Handler an fremde Konsumenten.
- Es gibt persistente Daten und damit Migrationen — Schemaänderungen sind nicht folgenlos.
- Mindestens ein Konsument ist nicht im selben Repo (Frontend, Partner, Mobile-App).
- Fehler werden erst in Produktion sichtbar, nicht beim Kompilieren.

**Wann es nicht passt:** Ein Next.js-Projekt mit ein paar `app/api`-Routen für die
eigene Oberfläche — dort genügt Rezept 01 plus einzeln `api-design`. Ein reines
Datenskript ohne Konsumenten braucht nichts davon. Für Python-Backends gilt
zusätzlich Rezept 03 (FastAPI/Django haben eigene Bausteine).

**Voraussetzung eines Kern-Set-Bausteins:**
`msitarzewski__agency-agents/agent/api-tester` ruft Endpunkte tatsächlich auf. Er
braucht eine **erreichbare Instanz** — lokal gestartet oder als Staging-URL — samt
gültigen Zugangsdaten für die geschützten Routen. Gibt es beides nicht, liest er
Code wie jeder andere Agent auch, und der Beobachtungs-Hebel dieses Projekttyps
fällt weg. Das ist eine Aussage über den Baustein, keine Vermutung über dein Projekt.

## Die Schmerzpunkte dieses Projekttyps

| Symptom | Doktrin |
|---|---|
| Der Agent ändert ein Response-Feld, weil es "sauberer" ist, und bricht damit einen Konsumenten, den er nicht sieht. | 6.2 Fehlerkaskade |
| Migrationen laufen lokal grün und sperren in Produktion die Tabelle. Der Fehler ist im Code unsichtbar. | 3.5 |
| Fehler werden abgefangen und weggeloggt; der Endpunkt antwortet 200 mit leerem Ergebnis. | 3.3 Selbstbewertung |
| Auth, Eingabevalidierung und Secrets werden als "später" markiert und nie nachgeholt. | 3.4 Scope-Unterschätzung |
| N+1-Queries und fehlende Indizes fallen erst unter Last auf. | 3.5 |

Für ein Backend gibt es fast immer einen automatischen Check (Tests, Typechecker,
Schema-Validierung). Nach Doktrin 8/Frage 3 heisst das: **kein Evaluator, sondern
Checks.** Das Kern-Set setzt deshalb auf Vertragsprüfung und zwei enge Reviewer
statt auf einen Bewertungs-Loop.

## Kern-Set (Startauswahl, zu kürzen)

**Bindend ist die Spalte „Welches Problem er löst", nicht die Liste.** Wer das
Symptom im eigenen Projekt nicht wiederfindet, streicht die Zeile — vier passende
Bausteine schlagen sieben plausible. Dass jede ID im Katalog auflöst, macht sie
belegt, nicht verpflichtend.

| ID | Typ | Welches Problem er löst | KB |
|---|---|---|---:|
| `affaan-m__ecc/skill/api-design` | skill | Ressourcennamen, Statuscodes, Pagination, Fehlerformat, Versionierung, Rate Limits. Stack-neutral. | 13 |
| `affaan-m__ecc/skill/contract-first` | skill | Verhindert Feldverschiebung zwischen Anbieter und Konsument. Genau die Schwäche, die ein Agent ohne Aussensicht hat. | 9 |
| `affaan-m__ecc/skill/database-migrations` | skill | Rollback, Zero-Downtime, Datenmigration — für Postgres, MySQL, Prisma, Drizzle, Django, TypeORM, golang-migrate. | 10 |
| `affaan-m__ecc/agent/database-reviewer` | agent | Zweite Sicht auf SQL, Schema und Indizes. Findet N+1 und fehlende Constraints, die kein Test abfängt. | 4 |
| `affaan-m__ecc/agent/security-reviewer` | agent | Secrets, SSRF, Injection, unsichere Krypto, OWASP Top 10 — ausgelöst durch jeden Endpunkt mit Nutzereingabe. | 4 |
| `msitarzewski__agency-agents/agent/api-tester` | agent | Endpunkte tatsächlich aufrufen statt Code lesen. Der Beobachtungs-Hebel dieses Projekttyps. | 12 |

Sechs Bausteine, rund 52 KB. Das ist die Obergrenze für diesen Projekttyp.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `affaan-m__ecc/agent/typescript-reviewer` | agent | Nur bei TypeScript/Node. Deckt `any`-Lecks und Async-Fehler ab, die `database-reviewer` nicht sieht. | 7 |
| `affaan-m__ecc/skill/postgres-patterns` | skill | Nur bei PostgreSQL. Kompakte Index- und Anti-Pattern-Referenz. | 4 |
| `affaan-m__ecc/skill/prisma-patterns` | skill | Nur bei Prisma. Wegen der Fallen: `updateMany` liefert Count statt Records, `migrate dev` setzt die DB zurück, Serverless erschöpft Connections. | 15 |
| `affaan-m__ecc/agent/silent-failure-hunter` | agent | Nur wenn bereits ein Fall auftrat, in dem ein Fehler geschluckt wurde. Sehr klein, sehr eng. | 2 |
| `anthropics__claude-plugins-official/agent/pr-test-analyzer` | agent | Nur wenn PRs der Arbeitsmodus sind **und** eine Test-Suite den Verifikationspfad trägt — der Agent arbeitet diff-/PR-zentriert, `git diff` und `gh` vorausgesetzt. Gegen das Symptom „Tests laufen grün, decken die geänderte Logik aber nicht ab": Er prüft verhaltensbezogene Abdeckung (Kritikalität 1–10) und ersetzt kein mechanisches Coverage-Gate, sondern ergänzt es dort, wo Zeilenabdeckung grün ist, Verhaltensabdeckung aber fehlt. Abgrenzung zum Kern-Set: `api-tester` prüft Laufzeitverhalten, dieser Agent, ob die Suite die geänderte Logik abdeckt. Stammt aus dem Plugin `pr-review-toolkit`, ist aber einzeln funktionsfähig — eigene description mit Invocation-Triggern; der dispatchende `command/review-pr` wird bewusst nicht mitinstalliert. | 4 |
| `affaan-m__ecc/skill/docker-patterns` | skill | Nur wenn der Dienst containerisiert läuft und der Agent Compose-Dateien anfasst. | 8 |
| `affaan-m__ecc/hook/pre-bash-dev-server-block` | hook | Nur wenn der Agent wiederholt einen blockierenden Dev-Server startet und die Session hängt. Hook, weil eine Bitte hier nicht zuverlässig greift. | 6 |
| `affaan-m__ecc/hook/config-protection` | hook | Nur wenn der Agent schon einmal eine Lint-/Format-Config aufgeweicht hat, um einen roten Check grün zu bekommen, statt den Code zu fixen — eine dokumentierte Modellschwäche. Blockiert Änderungen an bestehenden ESLint-/Prettier-/Biome-/Ruff-Configs; Neuanlage bleibt erlaubt, im Fehlerfall lässt er durch (fail-open). Ehrliche Reichweite: In einem Projekt ohne solche Configs ist er ein No-op. | 5 |
| `affaan-m__ecc/hook/block-no-verify` | hook | Nur wenn Git-Hooks (husky, pre-commit) die Prüfschleife tragen und der Agent sie schon einmal per `--no-verify` oder `-c core.hooksPath=` umgangen hat. Prüft rein den Kommandostring, flag-positionsbewusst tokenisiert, braucht null Projektwissen. Ehrliche Reichweite: Er erzwingt nur dort etwas, wo Git-Hooks existieren — ohne sie gibt es nichts zu umgehen. | 14 |

Die Hooks dieser Tabelle sind nach `install` zunächst **inaktiv**: Ein installierter
Hook feuert erst, wenn er in `.claude/settings.json` des Zielprojekts registriert
ist — `install` druckt das nötige Snippet mit aus. Die Bibliothek schaltet fremde
Hooks bewusst nicht selbst scharf. Ins Kern-Set gehört keiner davon: Kern-Set-Entscheid
vom 2026-08-08, dokumentiert in `recipes/README.md` — die generischen Schutz-Hooks
werden je Rezept einzeln bewertet, hier mit dem Ergebnis „Erweiterung mit Bedingung",
weil Backends dieses Zuschnitts typischerweise sowohl Lint-/Format-Configs als auch
Git-Hooks tragen.

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `affaan-m__ecc/skill/backend-patterns` (14 KB) | Deckt dasselbe Feld wie `api-design`, ist aber auf Node/Express/Next-API-Routen zugeschnitten. `api-design` gilt stack-übergreifend und ist damit die bessere einzelne Wahl. Bei reinen Node-Projekten kann man tauschen — nicht beide nehmen. |
| `msitarzewski__agency-agents/agent/backend-architect` (11 KB) | Rollen-Agent ohne prüfbares Artefakt. Die Doktrin verlangt eine benennbare Modellschwäche; "gibt Architekturrat" ist keine. Für echten Entwurfsbedarf ist `affaan-m__ecc/agent/planner` (7 KB) kleiner und konkreter. |
| `affaan-m__ecc/skill/error-handling` (12 KB), `redis-patterns` (12 KB), `hexagonal-architecture` (11 KB) | Im Katalog nur als japanische Übersetzung vorhanden (`docs/ja-JP/skills/…`). Inhaltlich passend, für den deutschsprachigen Betrieb aber schlecht wartbar. Bei Bedarf vorher `show --head 20` prüfen. |
| `affaan-m__ecc/skill/kubernetes-patterns` (20 KB) | Betrifft Betrieb und Deployment, nicht den Bau der API. Gehört in ein DevOps-Harness, nicht hierher. |

## Installationsbefehl

```bash
cd "<projektverzeichnis>"
node tools/harness.mjs install \
  affaan-m__ecc/skill/api-design \
  affaan-m__ecc/skill/contract-first \
  affaan-m__ecc/skill/database-migrations \
  affaan-m__ecc/agent/database-reviewer \
  affaan-m__ecc/agent/security-reviewer \
  msitarzewski__agency-agents/agent/api-tester \
  --to <projektpfad>
```

## Verifikationspfad — auszufüllen, bevor eingeführt wird

```
Befehl im Zielprojekt, der ein Ja/Nein liefert:  ______________________
Zuletzt grün gelaufen am:                        ______________________
```

Hier steht **kein** fester Befehl, weil kein Rezept die Skripte eines fremden
Projekts kennt. Trag ein, was dort tatsächlich existiert und grün läuft — bei diesem
Projekttyp typischerweise die Integrationstests, ein Schema- oder OpenAPI-Abgleich,
oder ein Migrationslauf gegen eine Wegwerf-Datenbank.

**Existiert kein solcher Befehl, ist er der erste Arbeitsschritt**, nicht der letzte.
Ohne ihn ist nach dem Einbau nicht messbar, ob sich etwas verbessert hat: alles, was
bleibt, ist das Urteil des Agenten über sich selbst — genau die Schwäche, gegen die
die halbe Auswahl oben gerichtet ist.

## Reihenfolge der Einführung

1. **Zuerst der Vertrag.** `contract-first` und `api-design` vor der ersten Zeile
   Endpunkt-Code. Was hier falsch festgelegt wird, kaskadiert (Doktrin 6.2) —
   und zwar in fremde Repos hinein, wo du es nicht zurückholen kannst.
2. **Dann die Ausführungsprüfung.** `api-tester`, sobald der erste Endpunkt antwortet.
   Ein laufender Aufruf schlägt jede Codelektüre.
3. **Dann Daten.** `database-migrations` vor der ersten Schemaänderung, nicht danach.
   `database-reviewer` dazu, sobald mehr als zwei Tabellen im Spiel sind.
4. **Dann Sicherheit.** `security-reviewer` spätestens beim ersten Endpunkt, der
   Nutzereingaben oder Authentifizierung berührt. Nicht früher — vorher hat er
   nichts zu prüfen und kostet nur.
5. **Erweiterungen zuletzt**, jede gegen ein beobachtetes Symptom. Sobald eine
   Integrationstest-Suite die Verträge prüft, `contract-first` und `api-tester`
   auf Load-Bearing testen (Doktrin 7.1) — Tests sind billiger als Agenten.
