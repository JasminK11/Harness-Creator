---
type: Referenz
title: Bausteine — Werkstoffkunde der sechs Claude-Code-Typen
description: "Beantwortet, welcher der sechs Baustein-Typen ein gegebenes Problem löst — und warum die anderen fünf es nicht tun."
status: stable
sources:
  - id: cc-skills
    resource: https://code.claude.com/docs/en/skills
    title: Extend Claude with skills
    author: Anthropic
    last_modified: 2026-08-07
  - id: cc-sub-agents
    resource: https://code.claude.com/docs/en/sub-agents
    title: Create custom subagents
    author: Anthropic
    last_modified: 2026-08-07
  - id: cc-hooks
    resource: https://code.claude.com/docs/en/hooks
    title: Hooks
    author: Anthropic
    last_modified: 2026-08-07
  - id: cc-mcp
    resource: https://code.claude.com/docs/en/mcp
    title: Connect Claude Code to tools via MCP
    author: Anthropic
    last_modified: 2026-08-07
  - id: cc-plugins
    resource: https://code.claude.com/docs/en/plugins
    title: Create plugins
    author: Anthropic
    last_modified: 2026-08-07
  - id: harness-katalog
    resource: catalog/index.json
    title: Katalog der Harness-Bibliothek — gelesen über `node tools/harness.mjs show` und `stats`
    author: Harness-Bibliothek (lokal)
    last_modified: 2026-08-07
  - id: claude-automation-recommender
    resource: anthropics__claude-plugins-official/skill/claude-automation-recommender
    title: claude-automation-recommender — SKILL.md des Plugins claude-code-setup, gelesen über `node tools/harness.mjs show`
    author: Anthropic (claude-plugins-official)
    last_modified: 2026-08-08
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-02-07
tags: [claude-code, skill, subagent, slash-command, hook, mcp-server, plugin, kontextkosten, progressive-disclosure]
---

# 02 — Bausteine: Werkstoffkunde

> **Worum es geht:** Welcher der sechs Baustein-Typen ein gegebenes Problem löst — und warum die anderen fünf es nicht tun.
> **Für wen:** Claude-Agenten, die aus dieser Bibliothek auswählen und die Typfrage entscheiden müssen, bevor sie den ersten Suchbegriff eintippen.
> **Wann lesen:** Wenn feststeht, *welcher Schmerz* behoben werden soll, aber noch offen ist, *womit*.

---

## 0. Abgrenzung

`01-harness-doktrin.md` beantwortet die Frage **ob** — ob ein Harness sich lohnt, welche Modellschwäche eine Komponente kompensiert, wann sie altert. Diese Datei beantwortet die Frage **womit**: Du hast dich für eine Maßnahme entschieden, und jetzt entscheidet sich, ob daraus ein Skill, ein Subagent, ein Command, ein Hook, ein MCP-Server oder ein Plugin wird.

Die Typwahl ist keine Geschmacksfrage. Jeder Typ hat ein anderes **Ladeverhalten** und andere **Kontext-Kosten**, und beides ist nicht verhandelbar. Ein Hook, der als Skill gebaut wurde, greift nur manchmal. Ein Subagent, der als Skill gebaut wurde, frisst den Hauptkontext auf. Beides ist kein Stilfehler, sondern ein Funktionsfehler.

Alle Formatangaben unten sind an der offiziellen Claude-Code-Doku geprüft (Stand 2026-08-07), alle Beispiele an echten Bausteinen dieser Bibliothek. Wo die Doku etwas nicht hergibt, steht das ausdrücklich da.

---

## 1. Die sechs Typen im Überblick

| Typ | Wo er liegt | Wie er geladen wird | Kontext-Kosten (Hauptfenster) | Wann er der richtige ist |
|---|---|---|---|---|
| **Skill** | `.claude/skills/<name>/SKILL.md`, `~/.claude/skills/<name>/SKILL.md`, Plugin-`skills/` | `description` dauerhaft im Kontext; Body erst bei Aktivierung — dann für den Rest der Session | dauernd: nur die `description` (mit `when_to_use` bei 1.536 Zeichen gekappt) · nach Aktivierung: der ganze Body | wiederkehrendes Verfahren oder Spezialwissen, das das Modell **selbst** heranziehen soll |
| **Subagent** | `.claude/agents/*.md`, `~/.claude/agents/*.md`, Plugin-`agents/` | Modell delegiert anhand der `description`; läuft im **eigenen Kontextfenster** | dauernd: nur die `description` · beim Lauf: **nur das Ergebnis** kommt zurück | kontextfressende Arbeit oder eine Bewertung, die frei vom Begründungskontext des Hauptlaufs sein muss |
| **Slash-Command** | `.claude/commands/<name>.md` — oder ein Skill mit `disable-model-invocation: true` | nur auf Tippen von `/name` | mit `disable-model-invocation: true`: **null**, bis du ihn aufrufst | Ablauf, den ein **Mensch** auslöst, weil nur der Mensch den Zeitpunkt kennt |
| **Hook** | `settings.json` (`~/.claude/`, `.claude/`, `.claude/settings.local.json`), Plugin-`hooks/hooks.json`, Skill-/Agent-Frontmatter | vom Laufzeitsystem beim Ereignis ausgeführt — **immer**, ohne Modellentscheidung | null im Ruhezustand; nur die Rückgabe beim Feuern | Regel, die auch dann gelten muss, wenn das Modell sie für unpassend hält |
| **MCP-Server** | `.mcp.json` (Projekt), `~/.claude.json` (local/user), Plugin-Root | Prozess/Verbindung startet bei Sessionbeginn; Tool-Definitionen werden standardmäßig zurückgestellt | Servernamen, Tool-Namen und Server-Instructions dauerhaft; volle Schemas erst bei Nutzung — mit `alwaysLoad: true` dauerhaft | Zugriff auf ein **externes System**, dessen Fakten nicht im Repo stehen |
| **Plugin** | eigenes Verzeichnis mit `.claude-plugin/plugin.json` | bündelt die fünf obigen Typen; Skills werden als `/plugin:skill` benannt | die **Summe** aller enthaltenen Bausteine | ein zusammengehöriges Set, das versioniert und geteilt werden soll |

Zwei Zeilen dieser Tabelle stehen im Gegensatz zueinander, und dieser Gegensatz entscheidet in der Praxis die meisten Typfragen: **Ein Subagent kostet den Hauptkontext fast nichts, ein MCP-Server kostet ihn dauerhaft.** Abschnitt 3.3 arbeitet das aus.

---

## 2. Die sechs Typen einzeln

### 2.1 Skill

**Wofür gebaut.** Wiederverwendbares Verfahrenswissen, das das Modell selbst erkennt und heranzieht. Die Doku nennt den Anlass präzise: wenn du dieselbe Anweisung oder Checkliste immer wieder in den Chat kopierst, oder wenn ein Abschnitt der `CLAUDE.md` von einer Tatsache zu einem Verfahren geworden ist.

**Minimalbeispiel** (echtes Frontmatter aus `mattpocock__skills/skill/tdd`):

```yaml
---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---
```

Alle Frontmatter-Felder sind optional; empfohlen ist nur `description`. Fehlt sie, nimmt Claude Code den ersten Absatz des Markdown-Bodys. Weitere geprüfte Felder: `when_to_use`, `allowed-tools`, `disallowed-tools`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `model`, `effort`, `context`, `agent`, `background`, `hooks`, `paths`, `shell`, `metadata`, `license`, `compatibility`.

Zwei Fallen im Format: Bei persönlichen und Projekt-Skills bestimmt **der Verzeichnisname** den Aufrufnamen, nicht das Feld `name` — `name` ist nur das Anzeigelabel. Und außerhalb von Claude Code (claude.ai-Upload, Skills-API) sind nur sechs Felder erlaubt: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`; jedes weitere Feld lässt das Paketieren mit einem harten Fehler scheitern.

**Warum genau dieser Typ.** Nur der Skill kombiniert zwei Eigenschaften: das Modell zieht ihn **selbständig**, und sein Inhalt kostet vorher nichts. Genau diese Kombination hat sonst kein Typ. Ein Command wird nicht selbständig gezogen; CLAUDE.md-Inhalt kostet immer.

**Wann er die falsche Wahl ist.** Wenn die Regel garantiert greifen muss (→ Hook). Wenn der Ablauf einen menschlich gewählten Zeitpunkt braucht (→ Command). Wenn die Arbeit vor allem Suchergebnisse und Dateiinhalte produziert, die du nie wieder brauchst (→ Subagent). Wenn der Inhalt eine Tatsache über das Projekt ist statt ein Verfahren (→ `CLAUDE.md`).

**Kontext-Kosten.** Dauerhaft: `description` plus `when_to_use`, im Skill-Listing bei 1.536 Zeichen gekappt. Ab Aktivierung: der gerenderte Body als eine Nachricht, die für den Rest der Session stehen bleibt — Claude Code liest die Datei später nicht neu. Bei Auto-Compaction werden die zuletzt aufgerufenen Skills mit je bis zu 5.000 Token und einem gemeinsamen Budget von 25.000 Token wieder angehängt; ältere fallen dabei raus.

**Tote Relative-Links an der Installationsgrenze.** Ein fremder Skill kann relativ auf Nachbar-Dateien seines Quell-Repos verlinken (`../../rules/…`) oder auf Geschwister-Skills (`../accessibility/SKILL.md`); `install` kopiert nur die Baustein-Dateien, solche Links bleiben im Zielprojekt tot. Kein Werkzeugdefekt — Bauart-Grenze beim Katalogisieren fremder Repos (`knowledge/04`, Abschnitt 5): an der Quelle kann die Bibliothek nichts reparieren. Beleg: E2E-Lauf 2026-08-23, `affaan-m__ecc/skill/react-patterns` verlinkt `../../rules/react/hooks.md` und `../../rules/react/` — per Testinstallation bestätigt, beide Ziele fehlen im Zielprojekt.

### 2.2 Subagent

**Wofür gebaut.** Eine Nebenaufgabe, die den Hauptverlauf mit Material fluten würde, oder eine Bewertung, die die Begründungskette des Hauptlaufs *nicht* sehen darf.

**Minimalbeispiel** (Doku-Format, wörtlich):

```yaml
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---
```

`name` und `description` sind Pflicht. `name` muss aus Kleinbuchstaben und Bindestrichen bestehen und darf kein `:` enthalten — das ist für Plugin-Namespaces reserviert; Dateien mit `:` im Namen werden nicht geladen. Weitere geprüfte Felder: `tools`, `disallowedTools`, `model` (`sonnet`, `opus`, `haiku`, `fable`, volle Modell-ID oder `inherit`), `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`, `initialPrompt`.

**Portabilitätswarnung aus dem echten Katalog.** `affaan-m__ecc/agent/code-reviewer` liegt unter `.kiro/agents/` und schreibt `allowedTools:` als YAML-Liste — ein Kiro-Feld, das Claude Code nicht kennt; korrekt wäre `tools:`. `msitarzewski__agency-agents/agent/code-reviewer` setzt `name: Code Reviewer` mit Großbuchstaben und Leerzeichen plus die Felder `emoji:` und `vibe:`. Beides sind brauchbare Prompts in einem fremden Frontmatter. **Prüfe nach dem Kopieren immer das Frontmatter, nicht nur den Body.**

**Warum genau dieser Typ.** Wegen des eigenen Kontextfensters. Ein Subagent bekommt nicht die History des Hauptlaufs, sondern nur den Auftragstext; zurück kommt nur seine Abschlussnachricht. Das ist gleichzeitig die Kostenersparnis *und* der Wirkmechanismus bei Qualitätsprüfungen: Der Prüfer sieht das Artefakt, nicht die Begründung, warum es so gebaut wurde.

**Wann er die falsche Wahl ist.** Wenn das Ergebnis nicht in eine kurze Nachricht passt — alles, was der Hauptlauf danach braucht, muss im Rückgabetext oder in einer Datei stehen. Wenn die Aufgabe engen Dialog mit dem User braucht. Wenn du nur Wissen bereitstellen willst, ohne Arbeit auszulagern (→ Skill). Und: Ein Subagent ohne klar definierten Rückgabevertrag ist eine Kostenstelle ohne Nutzen (Abschnitt 7).

**Kontext-Kosten.** Im Hauptfenster: die `description` dauerhaft (Routing) und der Rückgabetext einmalig. Die eigentliche Arbeit — Dateien lesen, Suchtreffer, Logs — landet nie im Hauptfenster. Das ist der günstigste Typ, gemessen am geleisteten Umfang. Achtung bei `skills:`: Dort gelistete Skills werden dem Subagenten **vollständig** beim Start injiziert, nicht nur mit ihrer Beschreibung.

### 2.3 Slash-Command

**Wofür gebaut.** Ein Ablauf, den der Mensch auslöst.

**Geprüfte Formatänderung:** Custom Commands sind in Skills aufgegangen. `.claude/commands/deploy.md` und `.claude/skills/deploy/SKILL.md` erzeugen beide `/deploy` und verhalten sich gleich; bestehende `commands/`-Dateien laufen weiter, für Neues ist die Skill-Form empfohlen, weil sie Nachbardateien erlaubt. **Der Unterschied „Command vs. Skill" ist heute kein Dateiformat mehr, sondern ein Frontmatter-Feld:**

| Frontmatter | Du kannst aufrufen | Claude kann aufrufen | Was im Kontext liegt |
|---|---|---|---|
| (Standard) | ja | ja | `description` dauerhaft, Body ab Aufruf |
| `disable-model-invocation: true` | ja | **nein** | **nichts**, bis du aufrufst |
| `user-invocable: false` | nein | ja | `description` dauerhaft, Body ab Aufruf |

**Minimalbeispiel** (echt, `affaan-m__ecc/command/pr`):

```yaml
---
description: "Create a GitHub PR from current branch with unpushed commits — discovers templates, analyzes changes, pushes"
argument-hint: "[base-branch] (default: main)"
---
```

Argumente kommen als `$ARGUMENTS` (alles), `$1`/`$2` (positionell) oder als benannte Platzhalter über das Feld `arguments`. `argument-hint` erscheint nur in der Autovervollständigung.

**Warum genau dieser Typ.** Zwei Gründe, und beide sind unabhängig voneinander gültig. Erstens **Zeitpunkthoheit**: Deployen, committen, einen teuren Review starten — das darf nicht passieren, weil das Modell den Moment für günstig hält. Zweitens **Kontext-Nullkosten**: Mit `disable-model-invocation: true` steht die Beschreibung gar nicht erst im Kontext. Ein Projekt kann dreißig solcher Abläufe haben, ohne einen einzigen Token dafür zu bezahlen.

**Wann er die falsche Wahl ist.** Wenn du willst, dass er automatisch greift — dann ist es ein Skill oder ein Hook. Ein Command, den der User in der Praxis nie tippt, ist toter Code; ein Command, den man „eigentlich immer" tippen müsste, ist ein verkappter Hook.

**Kontext-Kosten.** Mit `disable-model-invocation: true` null bis zum Aufruf, danach wie ein Skill. Ohne das Feld: wie ein Skill.

### 2.4 Hook

**Wofür gebaut.** Determinismus. Ein Hook ist Code, den das Laufzeitsystem an einem definierten Ereignis ausführt, ohne das Modell zu fragen.

**Minimalbeispiel** (Doku-Format, wörtlich, `.claude/settings.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

Geprüfte Eckdaten: Die Doku listet rund 30 Ereignisse; die im Harness-Alltag tragenden sind `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `SessionStart`, `PreCompact`. Handler-Typen sind `command`, `http`, `mcp_tool`, `prompt` und `agent` — die letzten beiden schicken die Entscheidung an ein Modell bzw. an einen Subagenten, das Feuern selbst bleibt trotzdem deterministisch. Exit-Codes: `0` = Erfolg, stdout wird als JSON ausgewertet; `2` = blockierender Fehler, stderr geht an Claude; alles andere = nicht-blockierender Fehler. Feiner steuerbar ist `PreToolUse` über `hookSpecificOutput.permissionDecision` mit `allow`, `deny`, `ask` oder `defer`.

**Zwei Fallen aus dieser Bibliothek.** Erstens: **Kopieren aktiviert einen Hook nicht.** Er muss in `settings.json` eingetragen werden, sonst liegt eine Datei im Projekt, die nie läuft — die trügerischste aller Harness-Fehlfunktionen, weil alles installiert aussieht. Zweitens: Die 56 Hook-Einträge im Katalog stammen überwiegend aus fremden Systemen. `affaan-m__ecc/hook/adapter` und `affaan-m__ecc/hook/before-shell-execution-block-no-verify` liegen unter `.cursor/hooks/` und sind Cursor-Hooks, die über eben jene `adapter.js` erst ins Claude-Format übersetzt werden. Vor dem Eintragen prüfen, für welches System der Hook geschrieben wurde.

**Ein Hook startet keinen Agenten.** Er ist ein Kontrollpunkt *innerhalb* eines Laufs, kein Auslöser davor. Sämtliche Ereignisse oben setzen eine bereits laufende Sitzung voraus — auch `SessionStart` feuert erst, nachdem jemand die Sitzung gestartet hat. Was einen Agenten von aussen anstösst (Webhook, CI-Job, Zeitplan, Alerting-Anbindung), ist kein Claude-Code-Baustein, liegt ausserhalb dessen, was diese Bibliothek katalogisiert, und wird von `install` nicht kopiert. Die Verwechslung ist naheliegend, weil ereignisgetriebene Autonomie in fremden Berichten regelmässig als Ziel auftaucht (`knowledge/08` Abschnitt 10) — die Übersetzung „ereignisgetrieben heisst Hook" ist trotzdem falsch. Zweite Verwechslung derselben Art: Ein Baustein, dessen Beschreibung ein Gate ankündigt („blocks Edit/Write/Bash"), ist deshalb noch kein Hook. Liegt kein ausführbares Skript im Paket, ist er eine Bitte im Sinne von Abschnitt 3.1 — der beschriebene Hook müsste erst nachgebaut werden, um zu wirken.

**Warum genau dieser Typ.** Weil er der einzige Typ ist, der nicht von einer Modellentscheidung abhängt. Alles andere in dieser Liste ist eine Bitte.

**Wann er die falsche Wahl ist.** Wenn die Regel Urteilsvermögen braucht („guten Code schreiben") — das kann ein Hook nicht prüfen, und ein Hook, der es versucht, blockiert falsch. Wenn das Ereignis zu oft eintritt (Abschnitt 7). Wenn die Regel nur eine Empfehlung ist: Ein Hook, der bei jeder zweiten legitimen Aktion blockt, wird abgeschaltet, und dann ist auch die berechtigte Hälfte weg.

**Ein Hook führt eine Prüfung aus, er erzeugt keine — mit offiziellem Zweitbeleg.** Die Regel stammt aus dem eigenen Bestand (`knowledge/06`, M13: erst wenn ein Check existiert, der Hook — vorher installiert liegt er tot in `.claude/hooks/`). Dieselbe Kopplung fährt das offizielle Setup-Plugin aus Anthropics Plugin-Verzeichnis: In der Hook-Empfehlungstabelle von `anthropics__claude-plugins-official/skill/claude-automation-recommender` (SKILL.md, Phase 2; Teil des Plugins `claude-code-setup`, 179K Installs) setzt jeder empfohlene `PostToolUse`-Hook ein bereits konfiguriertes Werkzeug voraus — wörtlich „Prettier configured | PostToolUse: auto-format on edit" und „Tests directory exists | PostToolUse: run related tests". Geltungsbereich des Belegs: Er deckt die `PostToolUse`-Zeilen der Tabelle; die `PreToolUse`-Zeilen desselben Bausteins sind Blockaden, keine Prüfungen („`.env` files present | PreToolUse: block `.env` edits"). Und er bestätigt nur die Kopplung, nicht deren Härte: Das Plugin misst per `ls`/`cat`/`grep` ausschließlich, **ob** ein Werkzeug konfiguriert ist, nie ob es läuft — „Tests directory exists" genügt ihm als Signal, ein `"test": "echo no tests"` fiele nicht auf. Die strengere Unterscheidung „vorhanden" gegen „läuft und ist grün" bleibt Bestand der eigenen Regel (`knowledge/06`, M13).

**Kontext-Kosten.** Im Ruhezustand null — Hooks stehen in `settings.json`, nicht im Prompt. Kosten entstehen nur beim Feuern, in Höhe der zurückgegebenen Nachricht. Das macht Hooks zum billigsten Typ überhaupt, solange sie selten feuern.

### 2.5 MCP-Server

**Wofür gebaut.** Zugriff auf ein System, das nicht im Repo liegt: Browser, Datenbank, Ticketsystem, Monitoring, externe API. Die Doku formuliert den Anlass als Kopiertest — wenn du Daten aus einem anderen Werkzeug in den Chat kopierst, gehört dort ein Server hin.

**Minimalbeispiel** (echt, `affaan-m__ecc/mcp/mcp`, aus `.mcp.json`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Drei Scopes: `local` (Standard, in `~/.claude.json`, nur dieses Projekt, privat), `project` (`.mcp.json` im Repo-Root, mit dem Team geteilt, erfordert interaktive Freigabe), `user` (`~/.claude.json`, alle Projekte). Tools erscheinen als `mcp__<server>__<tool>`; aus Plugins als `plugin:<plugin>:<server>`.

**Warum genau dieser Typ.** Er ist der einzige, der dem Agenten neue **Fähigkeiten** gibt statt neuer Anweisungen. Kein Skill kann einen Browser bedienen. Das ist auch die Verbindung zu `01`: Für Qualitätsprüfung an laufender Software ist der MCP-Server das Werkzeug, das aus einer Meinung eine Beobachtung macht.

**Wann er die falsche Wahl ist.** Wenn ein CLI-Aufruf dasselbe leistet — `gh`, `psql`, `curl` über das Bash-Tool kosten null Dauerkontext. Wenn du den Server für genau einen Arbeitsschritt brauchst. Wenn er zwanzig Tools mitbringt, von denen das Projekt eines benutzt.

**Kontext-Kosten — mit geprüfter Einschränkung.** Die alte Faustregel „ein MCP-Server legt seine Tool-Schemas dauerhaft in den Kontext" gilt heute nur noch eingeschränkt. Tool Search ist standardmäßig aktiv (Claude Sonnet/Haiku/Opus 4.5 und neuer): Bei Sessionstart laden nur Tool-Namen und die Server-Instructions, die vollen Definitionen werden zurückgestellt und erst bei Bedarf geholt. Die Doku sagt dazu ausdrücklich, es gebe keine feste Obergrenze pro Server — die praktische Grenze sei das Kontextbudget.

Die Ausnahmen sind aber real und häufig: `alwaysLoad: true` in der Serverkonfiguration lädt alle Tools dieses Servers vorab; `ENABLE_TOOL_SEARCH=auto` lädt vorab, solange die Schemas in 10 % des Kontextfensters passen; hinter einem Nicht-Erstanbieter-Proxy oder auf einer Azure-gehosteten Microsoft-Foundry-Deployment lädt Claude Code grundsätzlich vorab. **Die strukturelle Aussage bleibt deshalb bestehen: MCP-Kosten fallen im Hauptfenster an und sind an die Session gebunden, nicht an die Aufgabe.** Dazu kommen Laufzeitkosten: Ausgaben über 10.000 Token lösen eine Warnung aus, bei 25.000 Token wird gekappt (`MAX_MCP_OUTPUT_TOKENS`).

Ein Randbefund zur Bibliothek: Von 1.091 Bausteinen im Standardzugriff (Stand nach M2 und nach der Erweiterung der Beschreibungs-Extraktion auf JSDoc-Blöcke, Python-Docstrings und JSON-`description`-Felder, beides am 2026-08-10 — 1.099 vor M2, 1.084 direkt danach, 7 der 15 quarantänisierten Bausteine tragen seither ihre echte Beschreibung und sind zurück, Quarantäne jetzt 8) sind genau **vier** vom Typ `mcp` — die Quarantäne betraf ausschliesslich Hooks, der `mcp`-Bestand ist unverändert (`search "" --type mcp` bestätigt 4 mit und ohne `--all`). MCP-Konfigurationen sind fast immer projekt- und zugangsdatenspezifisch — hier ist wenig zu holen, und das ist kein Mangel des Katalogs. <!-- lint:historisch --> Die 1.091 ist bewusst der Stand vom 2026-08-10 (nach M2 und der Beschreibungs-Extraktions-Erweiterung), weil die Aussage über die mcp-Vier sich auf genau diesen Messzeitpunkt bezieht; der aktuelle Standardzugriff liegt höher (`node tools/harness.mjs stats`).

### 2.6 Plugin

**Wofür gebaut.** Verteilung. Ein Plugin bündelt Skills, Agents, Commands, Hooks, MCP- und LSP-Server, Monitore und ausführbare Dateien in einem versionierbaren, installierbaren Verzeichnis.

**Minimalbeispiel** (Doku-Format, wörtlich, `.claude-plugin/plugin.json`):

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

Verzeichnisse liegen im Plugin-**Root**, nicht in `.claude-plugin/` — dort gehört ausschließlich `plugin.json` hinein: `skills/`, `commands/`, `agents/`, `hooks/hooks.json`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json`. Skills eines Plugins werden immer namespaced aufgerufen: `/plugin-name:skill-name`.

**Warum genau dieser Typ.** Wegen Versionierung und Namespace. Wenn ein Set aus mehreren Bausteinen zusammen gepflegt und an ein Team verteilt werden soll, ist das Plugin die einzige Form, die Updates und Kollisionsfreiheit mitbringt.

**Wann er die falsche Wahl ist.** Beim Zusammenbau eines einzelnen Projekt-Harness fast immer. Die Doku empfiehlt selbst: erst standalone in `.claude/` iterieren, dann zum Plugin machen, wenn geteilt werden soll. Für die Auswahl aus dieser Bibliothek heißt das: Nimm einzelne Bausteine, nicht das Plugin, aus dem sie stammen.

**Kontext-Kosten.** Die Summe der enthaltenen Bausteine — und die ist selten überschaubar. Das Repo `affaan-m__ecc` allein steuert 520 Bausteine bei. Ein Plugin dieser Größenordnung zu aktivieren, bedeutet Hunderte von Descriptions im Dauerkontext und die dazugehörige Routing-Unschärfe (Abschnitt 5).

---

## 3. Deterministisch vs. modellgesteuert

### 3.1 Die Trennlinie

Das ist der eine Unterschied, aus dem sich die meisten Fehlentscheidungen erklären.

| | modellgesteuert | deterministisch |
|---|---|---|
| Typen | Skill, Subagent, MCP-Tool-Nutzung, `CLAUDE.md` | Hook, Permission-Regel |
| Auslöser | das Modell hält es für einschlägig | ein Ereignis tritt ein |
| Zuverlässigkeit | hoch, aber nicht 1 | 1 |
| Fehlermodus | greift nicht, obwohl es sollte | greift, obwohl es nicht sollte |
| Kosten | Kontext | Fehlalarme und Reibung |

Skills, Commands und `CLAUDE.md`-Regeln sind **Bitten**. Hooks und Permission-Regeln sind **Zwang**. Die Doku selbst zieht diese Konsequenz an der Stelle, an der sie erklärt, warum ein Skill nach der ersten Antwort scheinbar aufhört zu wirken: Der Inhalt steht meist noch im Kontext, das Modell wählt nur andere Wege — und der empfohlene Ausweg ist, das Verhalten über Hooks deterministisch zu erzwingen.

### 3.2 Was nicht in die `CLAUDE.md` gehört

`CLAUDE.md` ist der teuerste Ort für eine Regel und zugleich der schwächste: Ihr Inhalt liegt in **jedem** Turn im Kontext, und trotzdem kann das Modell sie überstimmen. Man bezahlt also Dauerkosten für eine unverbindliche Bitte.

Daraus folgt eine harte Aufteilung:

- **Muss immer gelten, ist maschinell prüfbar** → Hook. Beispiele: nie auf `main` committen; nach jedem Edit formatieren; nicht ohne grüne Tests abschließen; Tests nicht löschen.
- **Ist ein Verfahren, das nur manchmal gebraucht wird** → Skill. Der Body kostet erst bei Aktivierung.
- **Ist eine Tatsache über das Projekt, die in jedem Turn zählt** → `CLAUDE.md`. Beispiele: Paketmanager, Testkommando, Zielbranch, Verzeichnisstruktur.

Der Merksatz: **Was nicht verhandelbar sein darf, gehört in einen Hook, nicht in die `CLAUDE.md`.** Eine Zeile in Großbuchstaben in der `CLAUDE.md` ist eine dringende Bitte, keine Garantie. Sie ist die dokumentierte Notlösung, wenn kein Hook möglich ist — nicht die Standardlösung.

### 3.3 Der Kostengegensatz Subagent ↔ MCP-Server

Diese beiden Typen stehen kostenseitig genau entgegengesetzt, und wer das übersieht, wählt regelmäßig falsch.

**Subagent — Kosten proportional zum Ergebnis.** Er arbeitet in einem eigenen Kontextfenster. Er kann fünfzig Dateien lesen, hundert Suchtreffer verarbeiten und ein Testprotokoll auswerten; im Hauptfenster erscheinen davon nur seine Abschlusssätze. Der Preis ist Geld und Laufzeit, nicht Hauptkontext. Ein Subagent, der lange arbeitet und wenig zurückgibt, ist der **effizienteste** Baustein, den es gibt.

**MCP-Server — Kosten proportional zur Session.** Er liefert Fähigkeiten, deren Präsenz an die Session gebunden ist, nicht an die Aufgabe. Tool Search dämpft das erheblich (2.5), aber Namen und Server-Instructions liegen ab Sessionstart im Hauptfenster, `alwaysLoad`-Server vollständig, und die Werkzeugausgaben landen ebenfalls dort. Ein MCP-Server, der einmal pro Session gebraucht wird, kostet trotzdem die ganze Session.

**Die Entscheidungsregel daraus:** Wenn du Zugriff auf ein externes System brauchst und die Arbeit damit umfangreich ist — lass sie einen **Subagenten** erledigen, der den MCP-Server nutzt (Feld `mcpServers` im Subagent-Frontmatter). Dann liegen Tool-Präsenz *und* Werkzeugausgaben im fremden Fenster, und der Hauptlauf bekommt nur den Befund. Das ist die kostengünstigste Bauform für Browser-QA, Datenbankanalyse und Ticket-Recherche.

---

## 4. Entscheidungsbaum

Von oben nach unten lesen. Die erste zutreffende Zeile gewinnt.

| Ich will erreichen … | Typ | Warum nicht anders |
|---|---|---|
| **Eine Regel, die ausnahmslos gilt** — nie auf `main` committen, nach jedem Edit formatieren | **Hook** (`PreToolUse` / `PostToolUse`) | Ein Skill greift nur, wenn das Modell ihn für einschlägig hält. Bei einer Regel, deren Bruch teuer ist, sind 95 % Trefferquote wertlos. |
| **Ein Verfahren, das immer wieder gebraucht wird** — TDD-Loop, Release-Checkliste, Review-Kriterien | **Skill** | Ein Hook kann Urteil nicht ersetzen; `CLAUDE.md` bezahlt für jeden Turn mit, obwohl es selten gebraucht wird. |
| **Recherche, die viel Material anfasst** — Codebasis kartieren, Logs durchsehen, Doku sichten | **Subagent** | Im Hauptkontext würde das Material bleiben, obwohl nur das Fazit zählt. |
| **Zugriff auf ein externes System** — Browser, DB, Ticketsystem | **MCP-Server**, wenn kein CLI reicht — und dann bevorzugt **innerhalb eines Subagenten** | Ein Skill kann nichts bedienen. CLI über Bash kostet null Dauerkontext und ist bei einfachen Fällen überlegen. |
| **Ein Ablauf, den ein Mensch startet** — deployen, PR öffnen, teuren Review anstoßen | **Command** (`disable-model-invocation: true`) | Bei automatischer Auslösung entscheidet das Modell den Zeitpunkt. Zusätzlich: null Kontextkosten bis zum Aufruf. |
| **Eine unabhängige Qualitätsprüfung** — Review, QA, Sicherheitsprüfung | **Subagent** mit lesenden Tools | Ein Prüfschritt im selben Kontext bewertet die eigene Begründungskette mit und fällt systematisch zu positiv aus (siehe `01`, Abschnitt 3.3/4.2). |
| **Diese Prüfung soll nicht übersprungen werden können** | **Hook** vom Typ `agent` auf `Stop`, der den Subagenten startet | Ein Subagent allein wird gerufen, wenn das Modell es für nötig hält. Der Hook macht das Rufen unausweichlich. |
| **Ein Set aus mehreren Bausteinen an ein Team verteilen** | **Plugin** | Nur das Plugin bringt Versionierung und Namespace mit. Für ein einzelnes Projekt-Harness ist es Überbau. |
| **Eine Tatsache, die in jedem Turn gilt** — Testkommando, Paketmanager | **`CLAUDE.md`** | Ein Skill dafür wird vom Modell vielleicht nicht gezogen; ein Hook kann eine Tatsache nicht mitteilen. |

---

## 5. Progressive Disclosure — und warum die `description` das Nadelöhr ist

### 5.1 Der Mechanismus

**Nicht die ganze `SKILL.md` liegt permanent im Kontext.** Dauerhaft liegen dort nur `name` und `description` (plus `when_to_use`), gekappt bei 1.536 Zeichen. Der Body wird erst geladen, wenn der Skill greift.

Daraus folgt die Bauform:

1. **`SKILL.md` kurz halten.** Sobald der Skill geladen ist, steht sein Inhalt für den Rest der Session im Kontext — jede Zeile ist eine wiederkehrende Kostenposition. Anweisen, was zu tun ist, statt zu erklären, warum.
2. **Details in Nachbardateien.** Ein Skill-Verzeichnis darf mehrere Dateien enthalten: Referenzen, Beispiele, Vorlagen, ausführbare Skripte. Die `SKILL.md` verweist auf sie und beschreibt, wann sie zu lesen sind; geladen werden sie nur dann.
3. **Verweise beschreiben, nicht nur verlinken.** Das Modell entscheidet anhand deiner Beschreibung, ob es die Nachbardatei öffnet.

Ein echtes Beispiel aus dem Katalog: `mattpocock__skills/skill/tdd` sind 7 KB auf vier Dateien — `SKILL.md`, `tests.md`, `mocking.md` und eine Agent-Definition. Die `SKILL.md` sagt im Fließtext, wann welche Nachbardatei zu lesen ist: „See `tests.md` for examples and `mocking.md` for mocking guidelines." Das ist Progressive Disclosure in ihrer schlichtesten Form — und es ist auch der Bauplan dieser Bibliothek selbst: `INDEX.md` ist klein und darf ganz gelesen werden, `catalog/index.json` ist mehrere Megabyte groß und wird nie gelesen, dazwischen steht ein CLI.

### 5.2 Descriptions sind Routing-Signale

Die `description` ist das Einzige, was das Modell zum Zeitpunkt der Entscheidung sieht. Sie ist keine Zusammenfassung des Skills, sondern der **Abgleichstext gegen die Nutzeranfrage**. Zwei Prüfregeln folgen daraus, und beide werden regelmäßig verletzt.

**Prüfregel 1 — an der Nutzeranfrage ausrichten, nicht am Baustein.** Die Frage lautet nicht „Was tut dieser Skill?", sondern „Welche Formulierung des Users soll ihn ziehen?". Auslösewörter gehören in die `description`, in der Sprache des Users.

**Prüfregel 2 — Trennschärfe gegenüber den Nachbarn.** Trennschärfe ist keine Eigenschaft der einzelnen Beschreibung, sondern des **Sets**. Eine für sich genommen tadellose `description` kann untauglich werden, sobald ein zweiter Baustein mit ähnlichem Auslöser danebenliegt.

Operationalisiert, in dieser Reihenfolge anzuwenden:

1. **Auslöser-Test.** Steht in den ersten 15 Wörtern eine Formulierung, die ein User tatsächlich benutzt? Wenn dort nur Selbstbeschreibung steht, fehlt der Anker.
2. **Kollisions-Test.** Nenne zu jedem bereits ausgewählten Baustein einen Satz, den der eine zieht und der andere nicht. Geht das für ein Paar nicht: einen von beiden streichen oder die Beschreibungen gegeneinander schärfen.
3. **Abgrenzungs-Test.** Steht drin, wann der Baustein *nicht* gemeint ist? Ein „Nicht nutzen für …" ist bei benachbarten Bausteinen oft das wirksamste Trennmittel.
4. **Fremdwort-Test.** Enthält die `description` Vokabular, das nur der Autor benutzt? Hausbegriffe matchen keine Nutzeranfrage.
5. **Längen-Test.** Die wichtigste Aussage muss vorn stehen — nach 1.536 Zeichen wird abgeschnitten.

**Positivbeispiel aus dem Katalog** — `mattpocock__skills/skill/tdd`:

```yaml
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
```

Gegenstand in drei Wörtern, danach drei konkrete Auslöser, davon einer als wörtliches Zitat. Bestanden: Auslöser-, Fremdwort-, Längen-Test.

**Negativbeispiel 1 — Selbstbeschreibung ohne Auslöser.** Drei Skills aus demselben Repo:

```
mattpocock__skills/skill/writing-fragments
  "Writing, explore — mine raw fragments, no structure yet."
mattpocock__skills/skill/writing-shape
  "Writing, exploit — shape raw material into an article, paragraph by paragraph."
mattpocock__skills/skill/writing-beats
  "Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it."
```

Kein Nutzersatz kommt darin vor; „explore/exploit" und „beats" sind Hausvokabular; zwei der drei beginnen identisch. Der Autor kennt den Unterschied, das Modell rät. Für einen Menschen, der die Reihe kennt, sind das gute Skills — als Routing-Signale sind sie unbrauchbar.

**Negativbeispiel 2 — Kollision zwischen zwei für sich guten Beschreibungen.** Beide Zeilen sind einzeln in Ordnung:

```
affaan-m__ecc/skill/tdd-workflow
  "Use this skill when writing new features, fixing bugs, or refactoring code. …"
mattpocock__skills/skill/tdd
  "… Use when the user wants to build features or fix bugs test-first, …"
```

Beide feuern auf „neues Feature" und „Bug beheben". Installiert man beide, kann kein Satz mehr entscheiden, welcher gemeint ist — und der Fehlermodus ist nicht „beide werden geladen", sondern „einer wird geladen, unvorhersagbar welcher", oder gar keiner. Dazu kommt der Rest der Familie: `rust-testing`, `springboot-tdd`, `laravel-tdd`, `quarkus-tdd` — alle mit demselben Kern. **Pro Problem genau ein Baustein**, und zwar der spezifischste für den Stack dieses Projekts.

---

## 6. Zusammenspiel

### 6.1 Kombinationen, die sich bewähren

**Command → Skill.** Der Command ist der menschliche Einstiegspunkt, der Skill trägt das Verfahren. Weil Custom Commands in Skills aufgegangen sind, ist das oft ein einziger Baustein mit `disable-model-invocation: true` — die reine Command-Form. Bleibt beides getrennt, kann derselbe Skill auch automatisch greifen, wenn der Kontext passt.

**Skill → Subagent.** Ein Skill beschreibt das Verfahren und delegiert den kontextfressenden Teil. Zwei geprüfte Bauformen: `context: fork` im Skill-Frontmatter lässt den Skill selbst in einem geforkten Subagenten laufen (mit `agent` und `background` steuerbar); oder die `SKILL.md` beschreibt, wann welcher Subagent zu beauftragen ist. Die zweite Form ist die durchsichtigere.

**Hook → Subagent.** Ein Hook vom Typ `agent` startet bei einem Ereignis einen Prüf-Subagenten. Das ist die Bauform für „unabhängige Prüfung, die nicht übersprungen werden kann": Der Hook garantiert das Stattfinden, der Subagent liefert die Unabhängigkeit. Sie kostet den Hauptkontext fast nichts.

**Subagent → MCP-Server.** Über das Feld `mcpServers` bekommt der Subagent den Serverzugriff, den der Hauptlauf nicht braucht. Die Standardbauform für Browser-QA. Siehe 3.3.

**Skill → Nachbardateien.** Kurze `SKILL.md`, Details daneben. Siehe 5.1.

**Hook → Skill.** Ein `SessionStart`-Hook injiziert Kontext über `additionalContext`, ein Skill enthält das Verfahren dazu. Sinnvoll, wenn der Sitzungsstart Fakten braucht, die nirgends statisch stehen (aktueller Branch, offene Tickets).

### 6.2 Kombinationen, die redundant sind

| Konstruktion | Warum redundant |
|---|---|
| Skill *und* `CLAUDE.md`-Abschnitt mit demselben Inhalt | Doppelte Kosten, und bei Abweichung widersprechen sie sich. Die `CLAUDE.md`-Zeile darf höchstens ein Verweis auf den Skill sein. |
| Hook *und* Skill, die dieselbe Regel durchsetzen | Der Hook setzt sie ohnehin durch. Der Skill kostet dann nur noch seine `description` — sinnvoll allenfalls als Erklärung, warum der Hook blockt. |
| Mehrere Subagents mit fast gleicher `description` | Dasselbe Routing-Problem wie bei Skills, nur teurer, weil jede Fehlentscheidung einen ganzen Agentenlauf kostet. |
| MCP-Server *und* CLI für dieselbe Quelle | Zwei Wege zu denselben Daten. Der Server kostet Dauerkontext, das CLI nicht. |
| Plugin *und* einzeln kopierte Bausteine desselben Plugins | Doppelte Registrierung, doppelte Descriptions. Bei Subagents überschreiben Projekt- und User-Definitionen gleichnamige Plugin-Agents; bei Skills bleiben beide nebeneinander bestehen, weil Plugin-Skills namespaced sind. |
| Command, der nur einen Skill aufruft, der nichts anderes tut | Eine Indirektionsebene ohne Nutzen. `disable-model-invocation: true` im Skill selbst erreicht dasselbe. |

---

## 7. Häufige Fehler

**7.1 Überlappende Descriptions**
*Symptom:* Ein Skill greift nicht, obwohl er passt — oder ein anderer greift, der nicht passt. Reproduzierbar ist es nicht.
*Ursache:* Zwei oder mehr Bausteine mit ähnlichen Auslösern. Belegter Fall im Katalog: `affaan-m__ecc/skill/tdd-workflow` gegen `mattpocock__skills/skill/tdd`, dazu vier stackspezifische TDD-Skills desselben Repos.
*Korrektur:* Pro Problem genau einen Baustein behalten, den spezifischsten für den Stack. Beim Rest die `description` gegeneinander schärfen und ein explizites „Nicht nutzen für …" ergänzen. Fünf Kollisions-Tests sind billiger als eine falsch geroutete Session.

**7.2 Subagent ohne klaren Rückgabevertrag**
*Symptom:* Der Subagent läuft lange, kostet Geld, und der Hauptlauf macht danach unverändert weiter — oder muss die Arbeit selbst nachholen.
*Ursache:* Der Subagent bekommt nicht die History des Hauptlaufs, und zurück kommt nur seine Abschlussnachricht. Ist nicht definiert, was in dieser Nachricht stehen muss, entsteht Prosa statt Ergebnis.
*Korrektur:* Im Agent-Body das Ausgabeformat vorschreiben — Felder, Reihenfolge, maximale Länge, Umgang mit „nichts gefunden". Alles, was der Hauptlauf danach braucht, muss im Rückgabetext oder in einer benannten Datei stehen. Zusätzlich `tools` beschränken: Ein Prüfer mit Schreibrechten repariert das Problem, statt es zu melden.

**7.3 Zu oft feuernder Hook**
*Symptom:* Jeder zweite Arbeitsschritt bricht mit einer Hook-Meldung ab; der User schaltet den Hook ab oder wechselt in einen permissiveren Modus.
*Ursache:* Zu breiter `matcher` (etwa `*` oder `Bash` statt einer `if`-Regel), oder eine Regel, die Urteilsvermögen braucht und deshalb falsch positiv auslöst.
*Korrektur:* Über `if` auf das konkrete Muster einschränken (`"if": "Bash(git push *)"` statt `"matcher": "Bash"`). Für Nicht-Blockierendes `PostToolUse` statt `PreToolUse` wählen. Und die härteste Regel: Ein Hook, der bei legitimen Aktionen blockt, richtet mehr Schaden an als er verhindert — weil er im Ganzen abgeschaltet wird und dann auch der berechtigte Teil weg ist.

**7.4 MCP-Server, der nur Tool-Schemas frisst**
*Symptom:* Der Kontext ist beim Sessionstart schon spürbar belegt; der Server wird selten oder nie benutzt.
*Ursache:* Ein Server mit vielen Tools für einen einzelnen Anwendungsfall, oder ein Server mit `alwaysLoad: true`, oder eine Umgebung ohne Tool Search (Proxy, Azure-Foundry-Deployment, `ENABLE_TOOL_SEARCH=false`).
*Korrektur:* Prüfen, ob ein CLI über das Bash-Tool reicht — `gh`, `psql`, `curl` kosten null Dauerkontext. Wenn nicht: den Server dem **Subagenten** geben, der ihn braucht, statt dem Hauptlauf (Feld `mcpServers`). `alwaysLoad` nur für Tools setzen, die in jedem Turn gebraucht werden. Und: einen Server für genau einen Arbeitsschritt nicht auf `user`-Scope legen.

**7.5 Skill, der eigentlich ein Hook sein müsste**
*Symptom:* Die Regel steht sauber formuliert im Skill, und trotzdem wird sie in etwa jeder zehnten Session gebrochen. Beim Nachlesen des Transkripts steht der Skill-Inhalt noch im Kontext.
*Ursache:* Verwechslung von Bitte und Zwang. Der Skill-Body bleibt zwar in der Session stehen, aber das Modell wählt trotzdem einen anderen Weg — die Doku beschreibt genau diesen Fall und verweist als Lösung auf Hooks.
*Korrektur:* Den maschinell prüfbaren Kern in einen Hook auslagern; im Skill nur behalten, was Urteilsvermögen braucht. Prüffrage: „Wenn diese Regel einmal unter hundert Malen gebrochen wird — ist das teuer?" Bei Ja gehört sie in einen Hook.

**7.6 Kopierter Hook, der nie läuft**
*Symptom:* Alles sieht installiert aus, die Datei liegt unter `.claude/hooks/`, und nichts passiert.
*Ursache:* Ein Hook wird durch Kopieren nicht aktiv. Er muss in `settings.json` unter dem passenden Ereignis eingetragen sein. Zweite Variante: Der Hook stammt aus einem fremden System — `affaan-m__ecc/hook/adapter` ist ein Cursor-Hook aus `.cursor/hooks/`.
*Korrektur:* Nach jedem Installieren die Registrierung in `settings.json` prüfen und dem User sagen, bei welchem Ereignis der Hook jetzt was tut. Vorher das Zielformat verifizieren: Ereignisname, Eingabefelder auf stdin, Exit-Code-Semantik.

**7.7 Fremdes Frontmatter, unverändert übernommen**
*Symptom:* Der Subagent taucht nicht in `/context` auf oder startet mit falschen Rechten.
*Ursache:* Die Bibliothek katalogisiert Bausteine aus 13 fremden Repos, die für Kiro, Cursor, OpenAI-Agenten oder eigene Formate geschrieben wurden. Belegt: `allowedTools:` statt `tools:` in `affaan-m__ecc/agent/code-reviewer`; `name: Code Reviewer` mit Großbuchstaben und Leerzeichen plus `emoji:`/`vibe:` in `msitarzewski__agency-agents/agent/code-reviewer`. Subagent-`name` muss aus Kleinbuchstaben und Bindestrichen bestehen.
*Korrektur:* Nach dem Kopieren immer das Frontmatter gegen die Feldliste aus Abschnitt 2 prüfen, nicht nur den Body lesen. Unbekannte Felder sind meist harmlos, falsch benannte Pflichtfelder nicht.

**7.8 Umfang per Kategorie-Quote gedeckelt statt per Problem-Anker**
*Symptom:* Jede Empfehlungsrunde liefert aus jeder Baustein-Kategorie etwas, auch dort, wo das Projekt gar kein Problem hat. Das Ergebnis „kein Harness" kommt nie vor.
*Ursache:* Der Umfangsdeckel hängt an der Kategorie, nicht am Problem. So arbeitet der Mainstream-Ansatz, wörtlich belegt im offiziellen Setup-Plugin `anthropics__claude-plugins-official/skill/claude-automation-recommender` (SKILL.md): „**Recommend 1-2 of each type**: Don't overwhelm - surface the top 1-2 most valuable automations per category", in Phase 3 wiederholt als „**Only include 1-2 recommendations per category** - the most valuable ones for this specific codebase. Skip categories that aren't relevant." Vorgesehen ist dort nur das Überspringen irrelevanter Kategorien — ein leeres Gesamtergebnis nicht.
*Korrektur:* Den Deckel am Problem verankern statt an der Kategorie. So arbeitet `.claude/skills/harness-build/SKILL.md` Schritt 5: Jede Zeile der Auswahl nennt eine nummerierte Schmerzpunkt-Nummer, und „Eine leere Liste ist ein gültiges Ergebnis" — „kein Harness" ist ausdrücklich vorgesehen. Der Kernunterschied: Eine Quote je Kategorie lädt ein, jede Kategorie zu füllen; ein Problem-Anker lässt Kategorien leer.

---

## Quellen

Alle URLs abgerufen am **2026-08-07**.

**Offizielle Claude-Code-Dokumentation**
1. *Extend Claude with skills* — https://code.claude.com/docs/en/skills (Frontmatter-Referenz, Skill-Content-Lifecycle, 1.536-Zeichen-Kappung, Verzeichnisorte, Nachbardateien; die Seite `…/slash-commands` leitet hierher weiter, da Custom Commands in Skills aufgegangen sind)
2. *Create custom subagents* — https://code.claude.com/docs/en/sub-agents (Frontmatter-Felder, eigenes Kontextfenster, `skills`- und `mcpServers`-Preloading)
3. *Hooks* — https://code.claude.com/docs/en/hooks (Ereignisliste, Handler-Typen, Konfigurationsorte, Exit-Code-Semantik, `hookSpecificOutput`)
4. *Connect Claude Code to tools via MCP* — https://code.claude.com/docs/en/mcp (`.mcp.json`-Struktur, Scopes, Tool Search und `alwaysLoad`, Output-Grenzen)
5. *Create plugins* — https://code.claude.com/docs/en/plugins (Manifest, Verzeichnisstruktur, Namespacing, Standalone-vs-Plugin-Abwägung)

**Geprüfte Bausteine aus dieser Bibliothek** (über `node tools/harness.mjs show`)
- `mattpocock__skills/skill/tdd` — Positivbeispiel `description`, Progressive Disclosure über vier Dateien
- `affaan-m__ecc/skill/tdd-workflow` — Kollisionsbeispiel zu 7.1
- `mattpocock__skills/skill/writing-fragments`, `…/writing-shape`, `…/writing-beats` — Negativbeispiel Selbstbeschreibung
- `affaan-m__ecc/agent/code-reviewer` — Subagent mit Kiro-Frontmatter (`allowedTools:`)
- `msitarzewski__agency-agents/agent/code-reviewer` — Subagent mit fremden Feldern (`emoji:`, `vibe:`) und unzulässigem `name`
- `affaan-m__ecc/command/pr` — Command-Frontmatter mit `argument-hint`
- `affaan-m__ecc/hook/adapter`, `affaan-m__ecc/hook/before-shell-execution-block-no-verify` — Cursor-Hooks aus `.cursor/hooks/`, nicht direkt lauffähig
- `affaan-m__ecc/mcp/mcp` — minimale `.mcp.json`
- `anthropics__claude-plugins-official/skill/claude-automation-recommender` — Empfehlungs-Skill des offiziellen Plugins `claude-code-setup` (179K Installs); Zweitbeleg zu 2.4 (jeder empfohlene `PostToolUse`-Hook setzt ein konfiguriertes Werkzeug voraus) und Beleg zu 7.8 (Kategorie-Quote als Umfangsdeckel)
- Bestandszahlen aus `node tools/harness.mjs stats` und `INDEX.md`, Katalogstand 2026-08-08 19:36: 25.642 Bausteine aus 14 Repos, davon 24.543 im ausgeblendeten Massen-Repo `Klotzkette__claude-fuer-deutsches-recht`; im Standardzugriff 1.099 — 431 Skills, 407 Agents, 141 Commands, 70 Hooks, 46 Plugins, 4 MCP-Konfigurationen (Zahl des Abrufdatums bewusst zitiert; nach der M2-Quarantäne vom 2026-08-10 standen kurzzeitig 1.084 im Standardzugriff, nach der Erweiterung der Beschreibungs-Extraktion am selben Tag stehen dort 1.091, siehe der Randbefund oben) <!-- lint:historisch -->

**Haltbarkeit.** Frontmatter-Felder, Hook-Ereignisse und das Ladeverhalten von MCP-Tools ändern sich mit den Claude-Code-Versionen; Tool Search etwa ist eine vergleichsweise junge Voreinstellung. Prüfe die Formatangaben neu, statt sie zu glauben, wenn zwischen diesem Abrufdatum und deiner Sitzung eine größere Version liegt.
