# Harness-Bibliothek — Index (Ebene 1)

> Automatisch erzeugt von `tools/harness.mjs extract` — **nicht von Hand bearbeiten.**
> Stand: 2026-08-07 08:52 · 954 Bausteine im Standardzugriff (+ 24543 in Massen-Repos, siehe unten) aus 13 Repos

## Regel für Agenten

Diese Datei lesen. **Nicht** `catalog/index.json` lesen (zu gross) und **nicht** die
Quell-Repos durchsuchen. Für alles Weitere das CLI benutzen:

```bash
node tools/harness.mjs search "<stichwort>"     # Treffer als kompakte Zeilen
node tools/harness.mjs show <id>                # Detail zu einem Baustein
node tools/harness.mjs install <id> --to <proj> # in Zielprojekt kopieren
```

Grund: Der volle Katalog umfasst 25497 Bausteine. Wer den einliest,
hat sein Kontextfenster voll, bevor er die erste Zeile Projektcode sieht.

## Bestand nach Typ

| Typ | Anzahl | Was es ist | Wann einbauen |
|---|---:|---|---|
| skill | 402 | Ordner mit `SKILL.md` + Assets | Wiederkehrendes Verfahren, das Claude nachschlagen soll |
| agent | 375 | Subagent mit eigenem Kontextfenster | Arbeit, die viel Kontext frisst oder unabhängig geprüft werden muss |
| command | 112 | Slash-Command | Manuell ausgelöster Ablauf mit festem Namen |
| hook | 56 | Skript an einem Lifecycle-Event | Regel, die *immer* greifen muss — nicht dem Modell überlassen |
| plugin | 6 | Gebündeltes Paket | Mehrere zusammengehörige Bausteine auf einmal |
| mcp | 3 | MCP-Server-Konfiguration | Zugriff auf externes System (DB, API, Browser) |

## Bestand nach Domäne

Einstieg über die Domäne, dann `search` innerhalb davon.

| Domäne | Bausteine | Detail-Index |
|---|---:|---|
| general | 331 | `catalog/by-domain/general.md` |
| data-ai | 159 | `catalog/by-domain/data-ai.md` |
| meta | 114 | `catalog/by-domain/meta.md` |
| backend | 111 | `catalog/by-domain/backend.md` |
| product | 106 | `catalog/by-domain/product.md` |
| security | 80 | `catalog/by-domain/security.md` |
| frontend | 74 | `catalog/by-domain/frontend.md` |
| testing | 68 | `catalog/by-domain/testing.md` |
| docs | 63 | `catalog/by-domain/docs.md` |
| seo | 60 | `catalog/by-domain/seo.md` |
| devops | 53 | `catalog/by-domain/devops.md` |
| media | 48 | `catalog/by-domain/media.md` |

## Quell-Repos

| Repo | Bausteine | Schwerpunkt | Stand |
|---|---:|---|---|
| [affaan-m/ecc](https://github.com/affaan-m/ecc) | 520 | general:182, data-ai:100, meta:77, backend:67 | 2026-08-06 |
| [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | 270 | general:117, product:52, data-ai:32, devops:22 | 2026-08-06 |
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 52 | seo:52, product:14, backend:8, meta:5 | 2026-07-20 |
| [mattpocock/skills](https://github.com/mattpocock/skills) | 36 | general:25, data-ai:5, docs:5, testing:2 | 2026-08-06 |
| [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | 22 | meta:22, data-ai:9, media:2, docs:1 | 2026-07-30 |
| [anthropics/skills](https://github.com/anthropics/skills) | 21 | media:5, general:4, frontend:4, meta:4 | 2026-07-24 |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 12 | frontend:11, product:3, meta:2, media:1 | 2026-08-06 |
| [multica-ai/multica](https://github.com/multica-ai/multica) | 10 | backend:9, data-ai:3, frontend:1, product:1 | 2026-08-07 |
| [usestrix/strix](https://github.com/usestrix/strix) | 4 | security:4, backend:3, devops:2, data-ai:1 | 2026-08-06 |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | 4 | meta:2, general:2, data-ai:1 | 2026-07-31 |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | 2 | data-ai:1, docs:1, general:1 | 2026-08-06 |
| [Bomx/qwoted-seo-backlinks-skill](https://github.com/Bomx/qwoted-seo-backlinks-skill) | 1 | seo:1 | 2026-05-01 |

## Massen-Repos (opt-in)

Diese Repos sind vollständig katalogisiert, tauchen aber **nicht** in der normalen
Suche auf. Sie enthalten so viele Bausteine, dass jede Suche sonst von ihnen
dominiert würde. Zugriff nur gezielt:

```bash
node tools/harness.mjs search "<stichwort>" --repo Klotzkette__claude-fuer-deutsches-recht
node tools/harness.mjs search "<stichwort>" --all   # alles, inklusive Massen-Repos
```

| Repo | Bausteine | Schwerpunkt | Stand |
|---|---:|---|---|
| [Klotzkette/claude-fuer-deutsches-recht](https://github.com/Klotzkette/claude-fuer-deutsches-recht) | 24543 | legal-de:24543, meta:286, product:86, media:50 | 2026-08-05 |

## Weiterlesen

- `knowledge/` — **warum** ein Harness so gebaut wird (Doktrin, Entscheidungsbaum, Anti-Patterns)
- `recipes/` — fertige Baupläne pro Projekttyp
- `CHANGELOG.md` — was sich beim letzten `/harness-update` geändert hat
