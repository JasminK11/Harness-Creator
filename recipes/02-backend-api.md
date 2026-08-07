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

## Kern-Set (Pflicht)

| ID | Typ | Welches Problem er löst | KB |
|---|---|---|---:|
| `affaan-m__ecc/skill/api-design` | skill | Ressourcennamen, Statuscodes, Pagination, Fehlerformat, Versionierung, Rate Limits. Stack-neutral. | 13 |
| `affaan-m__ecc/skill/contract-first` | skill | Verhindert Feldverschiebung zwischen Anbieter und Konsument. Genau die Schwäche, die ein Agent ohne Aussensicht hat. | 9 |
| `affaan-m__ecc/skill/database-migrations` | skill | Rollback, Zero-Downtime, Datenmigration — für Postgres, MySQL, Prisma, Drizzle, Django, TypeORM, golang-migrate. | 10 |
| `affaan-m__ecc/agent/database-reviewer` | agent | Zweite Sicht auf SQL, Schema und Indizes. Findet N+1 und fehlende Constraints, die kein Test abfängt. | 4 |
| `affaan-m__ecc/agent/security-reviewer` | agent | Secrets, SSRF, Injection, unsichere Krypto, OWASP Top 10 — ausgelöst durch jeden Endpunkt mit Nutzereingabe. | 4 |
| `msitarzewski__agency-agents/agent/api-tester` | agent | Endpunkte tatsächlich aufrufen statt Code lesen. Der Beobachtungs-Hebel dieses Projekttyps. | 12 |

Sechs Bausteine, rund 52 KB.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `affaan-m__ecc/agent/typescript-reviewer` | agent | Nur bei TypeScript/Node. Deckt `any`-Lecks und Async-Fehler ab, die `database-reviewer` nicht sieht. | 7 |
| `affaan-m__ecc/skill/postgres-patterns` | skill | Nur bei PostgreSQL. Kompakte Index- und Anti-Pattern-Referenz. | 4 |
| `affaan-m__ecc/skill/prisma-patterns` | skill | Nur bei Prisma. Wegen der Fallen: `updateMany` liefert Count statt Records, `migrate dev` setzt die DB zurück, Serverless erschöpft Connections. | 15 |
| `affaan-m__ecc/agent/silent-failure-hunter` | agent | Nur wenn bereits ein Fall auftrat, in dem ein Fehler geschluckt wurde. Sehr klein, sehr eng. | 2 |
| `affaan-m__ecc/skill/docker-patterns` | skill | Nur wenn der Dienst containerisiert läuft und der Agent Compose-Dateien anfasst. | 8 |
| `affaan-m__ecc/hook/pre-bash-dev-server-block` | hook | Nur wenn der Agent wiederholt einen blockierenden Dev-Server startet und die Session hängt. Hook, weil eine Bitte hier nicht zuverlässig greift. | 6 |

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `affaan-m__ecc/skill/backend-patterns` (14 KB) | Deckt dasselbe Feld wie `api-design`, ist aber auf Node/Express/Next-API-Routen zugeschnitten. `api-design` gilt stack-übergreifend und ist damit die bessere einzelne Wahl. Bei reinen Node-Projekten kann man tauschen — nicht beide nehmen. |
| `msitarzewski__agency-agents/agent/backend-architect` (11 KB) | Rollen-Agent ohne prüfbares Artefakt. Die Doktrin verlangt eine benennbare Modellschwäche; "gibt Architekturrat" ist keine. Für echten Entwurfsbedarf ist `affaan-m__ecc/agent/planner` (7 KB) kleiner und konkreter. |
| `affaan-m__ecc/skill/error-handling` (12 KB), `redis-patterns` (12 KB), `hexagonal-architecture` (11 KB) | Im Katalog nur als japanische Übersetzung vorhanden (`docs/ja-JP/skills/…`). Inhaltlich passend, für den deutschsprachigen Betrieb aber schlecht wartbar. Bei Bedarf vorher `show --head 20` prüfen. |
| `affaan-m__ecc/skill/kubernetes-patterns` (20 KB) | Betrifft Betrieb und Deployment, nicht den Bau der API. Gehört in ein DevOps-Harness, nicht hierher. |

## Installationsbefehl

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs install \
  affaan-m__ecc/skill/api-design \
  affaan-m__ecc/skill/contract-first \
  affaan-m__ecc/skill/database-migrations \
  affaan-m__ecc/agent/database-reviewer \
  affaan-m__ecc/agent/security-reviewer \
  msitarzewski__agency-agents/agent/api-tester \
  --to <projektpfad>
```

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
