---
type: Doktrin
title: Harness-Doktrin — welche Modellschwäche jede Komponente kompensiert
description: "Beantwortet, ob und warum eine Harness-Komponente gebaut wird — jede Komponente als überprüfbare Wette auf eine konkrete Modellschwäche."
status: stable
sources:
  - id: anthropic-harness-design
    resource: https://www.anthropic.com/engineering/harness-design-long-running-apps
    title: Harness design for long-running application development
    author: Anthropic Engineering
    last_modified: 2026-03-24
  - id: anthropic-effective-harnesses
    resource: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
    title: Effective harnesses for long-running agents
    author: Anthropic Engineering
    last_modified: 2025-11-26
  - id: anthropic-context-engineering
    resource: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
    title: Effective context engineering for AI agents
    author: Anthropic Engineering
    last_modified: 2025-09-29
  - id: anthropic-building-effective-agents
    resource: https://www.anthropic.com/engineering/building-effective-agents
    title: Building effective agents
    author: Anthropic Engineering
    last_modified: 2024-12-19
  - id: claude-sdk-subagents
    resource: https://code.claude.com/docs/en/agent-sdk/subagents
    title: Subagents in the SDK
    author: Anthropic
  - id: claude-sdk-overview
    resource: https://code.claude.com/docs/en/agent-sdk/overview
    title: Agent SDK overview
    author: Anthropic
  - id: claude-context-editing
    resource: https://platform.claude.com/docs/en/build-with-claude/context-editing
    title: Context editing
    author: Anthropic
  - id: claude-compaction
    resource: https://platform.claude.com/docs/en/build-with-claude/compaction
    title: Compaction
    author: Anthropic
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-02-07
tags: [harness, modellschwaechen, planner-generator-evaluator, context-reset, kontext-engineering, anthropic]
---

# 01 — Harness-Doktrin

> **Worum es geht:** Die Begründungen hinter Harness-Komponenten — welche Modellschwäche jede Komponente kompensiert und wann sie überflüssig wird.
> **Für wen:** Claude-Agenten, die in einem fremden Projekt entscheiden müssen, welche Skills/Agents/Commands/Hooks aus dieser Bibliothek eingebaut werden und welche nicht.
> **Wann lesen:** Vor dem ersten Zusammenbau eines Harness für ein neues Projekt — und erneut bei jedem Modellwechsel.

---

## 0. Wie du diese Datei benutzt

Diese Datei ist kein Katalog. Der Katalog steht in den anderen Dateien dieser Bibliothek. Hier steht das **Warum**.

Die Regel, die alles andere überschreibt: **Jede Komponente, die du einbaust, musst du mit einer konkreten Modellschwäche begründen können, die in diesem Projekt tatsächlich auftritt.** Kannst du das nicht, baust du sie nicht ein. Ein Harness ist Kosten — an Tokens, Laufzeit, Wartung und Fehlerfläche. Es muss sich rechnen.

---

## 1. Was ein Harness ist — und was nicht

Ein Harness ist die strukturelle Umgebung, die ein Agent-Modell umgibt, damit es über mehrere Context Windows hinweg kohärent an einer Aufgabe arbeiten kann: spezialisierte Prompts, Environment-Setup, Tracking-Mechanismen, Verifikationswege und die Regeln, wie Agenten Zustand aneinander übergeben ([Anthropic, Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).

Die zentrale Definition, aus der alles Weitere folgt:

> "every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing"
> ([Anthropic, Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps))

Das ist die operative Definition. Ein Harness ist eine **Sammlung von Wetten auf Modellschwächen**. Jede Wette kann falsch sein — entweder weil die Schwäche in diesem Projekt nicht auftritt, oder weil das Modell sie inzwischen nicht mehr hat.

| Ein Harness ist … | Ein Harness ist NICHT … |
|---|---|
| eine Menge von Annahmen über Modellschwächen, jede einzeln überprüfbar | eine Sammlung guter Prompts |
| Struktur, die über Context-Grenzen hinweg trägt | Kontext-Anreicherung innerhalb eines Laufs |
| ein Kontrollsystem mit Rückkopplung (Verifikation, Bewertung, Korrektur) | ein linearer Workflow ohne Feedback-Kanal |
| kostenpflichtig und alterungsanfällig | dauerhaft gültige Best Practice |

**Abgrenzung Workflow vs. Agent.** Anthropic unterscheidet: *Workflows* sind Systeme, in denen LLMs und Tools vorgegebene Code-Pfade durchlaufen; *Agents* sind Systeme, in denen das LLM seinen eigenen Prozess dynamisch steuert und selbst über Tool-Einsatz entscheidet ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)). Ein Harness kann beides orchestrieren. Die Entscheidung Workflow-vs-Agent gehört an den Anfang deiner Planung, nicht ans Ende: Ein deterministischer Pfad, der funktioniert, schlägt jedes Agenten-Konstrukt.

**Entscheidungsregel:** Wenn du die Schrittfolge vorab vollständig kennst, baue einen Workflow (Command, Skript, Hook-Kette). Nur wenn die Schrittfolge vom Zwischenergebnis abhängt, brauchst du einen Agenten — und erst dann stellt sich die Harness-Frage überhaupt.

### 1.1 Womit du ein Harness in diesem Ökosystem tatsächlich baust

Die Bausteine, die dir Claude Code und das Agent SDK geben, sind keine austauschbaren Features. Jeder deckt einen anderen Teil der Harness-Aufgabe ab ([Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)):

| Baustein | Was er im Harness leistet | Wähle ihn, wenn … |
|---|---|---|
| **Subagent** (`.claude/agents/*.md` oder `agents`-Parameter) | Context-Isolation, Rollentrennung, Tool-Beschränkung, Parallelität | du eine zweite, unabhängige Sichtweise brauchst — Evaluator, Planner, Explorer |
| **Skill** | wiederverwendbares Spezialwissen, das nur bei Bedarf in den Kontext kommt | Wissen sonst als Dauerrauschen im Hauptprompt läge |
| **Command** (Slash-Command) | fester, wiederholbarer Ablauf, vom Menschen ausgelöst | die Schrittfolge deterministisch ist (→ Workflow, nicht Agent) |
| **Hook** | Code an definierten Punkten des Agent-Lebenszyklus, **nicht verhandelbar** | eine Regel garantiert greifen muss, auch wenn das Modell sie ignorieren möchte |
| **Permissions** | welche Tools ohne Rückfrage laufen dürfen | du Autonomie erhöhen willst, ohne die Fehlerfläche mitzuerhöhen |
| **MCP-Server** | externe Werkzeuge und Datenquellen | der Agent Fakten aus der laufenden Welt braucht (z. B. Browser-Automation für QA) |
| **Sessions** | Kontext über Aufrufe hinweg, resume/fork | du Context Resets mit Wiederaufnahme kombinierst |

**Der wichtigste Unterschied für deine Entscheidung:** Ein Prompt, eine Skill und ein Command sind *Bitten* — das Modell kann sie überstimmen. Ein Hook und eine Permission-Regel sind *Zwang*. Wenn eine Regel im Fehlerfall teuer ist (nie auf `main` committen, nie Tests löschen, nie ohne Verifikation abschließen), gehört sie in einen Hook. Die dokumentierte Notlösung ohne Hook ist eine wörtlich sehr scharfe Prompt-Anweisung — im Referenzprojekt: *"It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality."* ([Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)). Das ist schwächer als ein Hook, aber besser als nichts.

**Warnung zur Subagent-Verschachtelung:** Subagents können standardmäßig selbst Subagents starten, bis zu drei Ebenen unter der Hauptkonversation; steuerbar über `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` (Wert `1` schaltet Verschachtelung ab) ([Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)). Tiefe Verschachtelung macht Kosten und Laufzeit unvorhersagbar. In einem Harness, dessen Kosten du kalkulieren willst, begrenze sie bewusst.

---

## 2. Das Grundprinzip: einfachste Lösung zuerst

Das Leitprinzip, auf das sich sowohl der Harness-Artikel als auch die Agenten-Grundlagen berufen:

> "finding the simplest solution possible, and only increasing complexity when needed"
> ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents); zitiert in [Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))

Agentische Systeme "trade latency and cost for better task performance" ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)). Der Preis ist messbar. Im Retro-Game-Maker-Experiment:

| Aufbau | Laufzeit | Kosten | Ergebnis |
|---|---|---|---|
| Solo-Agent, ein Prompt | 20 Min. | 9 $ | Das Spiel war kaputt: "My entities appeared on screen but nothing responded to input." |
| Volles Harness | 6 Std. | 200 $ | funktionierende App |

Das Harness war "over 20x more expensive" ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps)). Faktor 20 an Kosten und Faktor 18 an Laufzeit sind der Normalfall, nicht der Ausreißer. Diesen Preis zahlst du nur, wenn das Solo-Ergebnis nachweislich unbrauchbar ist.

**Warum das bei jedem Modellwechsel neu geprüft werden muss.** Die Komponenten kompensieren Schwächen einer *konkreten Modellgeneration*. Im selben Projekt fiel beim Wechsel von Opus 4.5 auf Opus 4.6 der komplette Sprint-Konstrukt weg, und der Evaluator wanderte von "pro Sprint" auf "ein einziger Durchgang am Ende". Begründung: Opus 4.6 "plans more carefully, sustains agentic tasks for longer, can operate more reliably in larger codebases, and has better code review and debugging skills". Für Aufgaben, die auf 4.5 den Evaluator brauchten, gilt auf 4.6: "the boundary moved outward. Tasks that used to need the evaluator's check … were now often within what the generator handled well on its own." ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))

**Entscheidungsregel:** Baue das Harness in dieser Reihenfolge auf, und höre auf, sobald das Ergebnis gut genug ist:

1. Ein Prompt, ein Agent, keine Struktur.
2. + Verifikationsweg (Tests, Browser-Automation, Build-Check) — der billigste echte Hebel.
3. + Planner (getrennter Spec-Schritt vorab).
4. + separater Evaluator.
5. + Context Resets mit Handoff.
6. + Parallelisierung / mehrere spezialisierte Subagents.

Springe nie direkt auf Stufe 5. Wenn du auf Stufe 5 landest, musst du sagen können, welches Symptom dich auf Stufe 4 gezwungen hat.

**Zweitbeleg für die Position von Stufe 2, aus fremder Praxis.** Eno Reyes (Factory) misst die „agent readiness" einer Codebasis als Anzahl der vorhandenen deterministischen Prüfschleifen — Linter, Typechecker, Security-Scans, End-to-End-Tests — und leitet daraus ab: „the quality of the output of these very long-running harnesses of advanced agents is directly proportional to the degree to which you can validate their work" (13:00), sowie als Ratschlag an Kunden „Less so solving the problem, more so preparing the environment for verification of the problem" (15:33).
**Geltungsbereich.** Die Aussage betrifft die Prüfinfrastruktur des **Zielprojekts**, nicht die Eskalationsstufen des Harness. Sie stützt, dass Stufe 2 vor Stufe 3 kommt, und sagt nichts über Stufe 3 bis 6. Sie ist Praxisbeobachtung eines Anbieters mit Produktinteresse, ohne veröffentlichte Zahlen. Reyes' eigene Begründung über dichte Belohnung im Post-Training fällt unter den in `knowledge/05` Abschnitt 3 verworfenen Trainingsstrang und wird nicht übernommen. Bemerkenswert ist die Gegenprobe, die er selbst liefert: für Bereiche ohne Validator bleibt auch bei ihm die Autonomie aus — „we do not yet have validators that can validate some of the hard visual problems … So, we're unable to close the loop" (19:01). Herleitung und Grenzen: `knowledge/08` Abschnitte 1 und 2.

---

## 3. Die Modellschwächen, gegen die ein Harness arbeitet

Jede Zeile hier ist eine Wette. Prüfe pro Projekt, ob sie gilt.

### 3.1 Kontextverlust bei langen Läufen ("Context Rot")

**Symptom:** "models tend to lose coherence on lengthy tasks as the context window fills" ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps)). Der zugrundeliegende Effekt heißt Context Rot: "as the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases" ([Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Kontext ist "a finite resource with diminishing marginal returns".

**Gegenmaßnahme (nach Aufgabentyp gestaffelt):**

| Aufgabentyp | Mechanismus | Konkret |
|---|---|---|
| Hin-und-her-Arbeit, ein durchgehender Thread | Compaction | Server-Side Compaction, Default-Trigger 150.000 Input-Tokens, konfigurierbares Minimum 50.000 ([Compaction](https://platform.claude.com/docs/en/build-with-claude/compaction)) |
| Iterative Entwicklung mit klaren Meilensteinen | Structured Note-Taking | Persistente Dateien außerhalb des Context Window: `claude-progress.txt`, Feature-Liste, Git-History ([Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)) |
| Breite Exploration, parallele Teilaufgaben | Subagent-Architektur | Jeder Subagent startet in eigener frischer Conversation; nur die Abschlussnachricht geht an den Parent ([Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)) |
| Tool-Output-lastige Läufe (Suche, Crawling) | Context Editing | `clear_tool_uses_20250919`, Default-Trigger 100.000 Input-Tokens, `keep` = 3 Tool-Uses, `exclude_tools` für unverzichtbare Ergebnisse ([Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)) |

**Wann die Maßnahme überflüssig wird:** Wenn der gesamte Lauf zuverlässig unter dem Trigger-Schwellwert bleibt. Miss das, statt es zu vermuten: `count_tokens` mit `context_management` liefert `original_input_tokens` und den Wert nach dem Clearing ([Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)). Ein Lauf, der bei 40.000 Tokens endet, braucht keinerlei Kontext-Management.

### 3.2 Context Anxiety (vorzeitiges Abbrechen)

**Symptom:** Modelle "begin wrapping up work prematurely as they approach what they believe is their context limit". Bei Claude Sonnet 4.5 war das so ausgeprägt, dass "compaction alone wasn't sufficient" ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps)). Erkennbar an: Der Agent liefert eine Zusammenfassung und ein "Nächste Schritte"-Kapitel, obwohl noch Budget da ist; Features werden als erledigt markiert, die nie liefen.

**Gegenmaßnahme:** Context **Reset**, nicht Compaction. Siehe Abschnitt 5. Compaction erhält die Kontinuität, gibt dem Agenten aber keinen sauberen Zustand — "context anxiety can still persist. A reset provides a clean slate."

**Wann überflüssig:** Modellabhängig, nicht projektabhängig. Prüfe es empirisch: Lass einen langen Lauf ohne Reset durchlaufen und lies das Transkript daraufhin, ob der Abbruch inhaltlich (Aufgabe fertig) oder ängstlich (Budget-Sorge) begründet wird. Im Referenzprojekt lief der Builder auf Opus 4.6 "coherently for over two hours" ohne Reset.

### 3.3 Zu positive Selbstbewertung

**Symptom:** "When asked to evaluate work they've produced, agents tend to respond by confidently praising the work—even when, to a human observer, the quality is obviously mediocre." Besonders stark "for subjective tasks like design, where there is no binary check equivalent to a verifiable software test". Kurzform: "agents reliably skew positive when grading their own work." ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))

**Gegenmaßnahme:** Separater Evaluator-Agent mit eigenem Context (Abschnitt 4). Für alles, was binär prüfbar ist, gilt vorher: **echter Test schlägt jede Bewertung.** Ein grüner Build und ein bestandener E2E-Test brauchen keinen Evaluator.

**Wann überflüssig:** Wenn die Qualitätsfrage vollständig auf verifizierbare Checks reduzierbar ist (Compiler, Typechecker, Test-Suite, Linter, Schema-Validierung). Der Evaluator ist der Ersatz für einen fehlenden Test, nicht seine Ergänzung.

### 3.4 Unterschätzung des Umfangs

**Symptom:** "Without the planner, the generator under-scoped: given the raw prompt, it would start building without first speccing its work." ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps)) Der Agent liefert etwas Lauffähiges, aber Kleineres als das, was gefragt war — und merkt es nicht.

**Gegenmaßnahme:** Ein vorgelagerter Planner-Agent, der aus 1–4 Sätzen eine vollständige Produkt-Spec macht, explizit geprompted, "to be ambitious about scope". Wichtig: Der Planner bleibt auf Produktkontext und High-Level-Design und geht **nicht** in detaillierte technische Implementierung — Begründung in 3.5/6.2.

**Wann überflüssig:** Selten. Der Planner war im Referenzprojekt die einzige Komponente, die auch nach dem Modell-Upgrade auf Opus 4.6 unverändert blieb. Weglassen nur, wenn der User bereits eine ausformulierte Spec liefert. Kosten sind minimal: 4,7 Minuten und 0,46 $ von insgesamt 3 Std. 50 Min. und 124,70 $ im DAW-Lauf.

### 3.5 Oberflächliches QA

**Symptom:** "Out of the box, Claude is a poor QA agent. In early runs, I watched it identify legitimate issues, then talk itself into deciding they weren't a big deal and approve the work anyway." Außerdem: es "tended to test superficially, rather than probing edge cases" ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps)). Verwandt: In früheren Läufen markierte Claude Features als fertig, ohne sie je getestet zu haben ([Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).

**Gegenmaßnahme, zweiteilig:**

1. **Werkzeug statt Meinung.** Der Evaluator bekommt Browser-Automation (Playwright MCP im Referenzprojekt; Puppeteer MCP im Vorgänger) und klickt sich durch die laufende Anwendung "the way a user would, testing UI features, API endpoints, and database states". Das "dramatically improved performance", weil Bugs sichtbar werden, die im Code-Review unsichtbar sind.
2. **Prompt-Tuning gegen Nachsicht.** "The tuning loop was to read the evaluator's logs, find examples where its judgment diverged from mine, and update the QA's prompt to solve for those issues. It took several rounds of this development loop before the evaluator was grading in a way that I found reasonable."

**Wann überflüssig:** Wenn eine echte Test-Suite existiert, die das Verhalten abdeckt. QA-Agenten ersetzen fehlende Tests; sie sind teurer und unzuverlässiger als Tests.

---

## 4. Kernpattern: Planner / Generator / Evaluator

Das Referenz-Harness besteht aus drei Rollen, die über **Dateien** kommunizieren: "one agent would write a file, another agent would read it and respond either within that file or with a new file that the previous agent would read in turn" ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps)).

| Rolle | Aufgabe | Prompt-Haltung | Kosten im DAW-Lauf |
|---|---|---|---|
| **Planner** | 1–4 Sätze → vollständige Produkt-Spec | ambitioniert im Scope, High-Level in der Technik | 4,7 Min. / 0,46 $ |
| **Generator** | implementiert gegen die Spec, hat Git | frei in der Umsetzung, gebunden an Deliverables | Runden: 2 Std. 7 Min. / 71,08 $ · 1 Std. 2 Min. / 36,89 $ · 10,9 Min. / 5,88 $ |
| **Evaluator** | testet die laufende App über Browser-Automation, benotet | skeptisch, sucht aktiv Edge Cases | Runden: 8,8 Min. / 3,24 $ · 6,8 Min. / 3,09 $ · 9,6 Min. / 4,06 $ |

Gesamt: **3 Std. 50 Min. / 124,70 $.** Der weit überwiegende Teil geht an den Generator; QA ist billig. Das ist ein starkes Argument dafür, den Evaluator eher einzubauen als wegzulassen: Er kostet im Beispiel rund 8 % der Gesamtsumme.

### 4.1 Warum die Trennung

Die drei Rollen brauchen **unvereinbare Haltungen**. Der Generator muss produktiv und lösungsorientiert sein, der Evaluator misstrauisch und ergebnisoffen. Ein Agent kann beides nacheinander simulieren, aber nicht glaubwürdig — er hat die eigene Begründungskette im Kontext und verteidigt sie.

Der entscheidende Satz für deine Entscheidung:

> "tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work"
> ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))

### 4.2 Warum der Evaluator ein *separater* Agent sein muss

Weil Context-Isolation der Wirkmechanismus ist. Ein Subagent "runs in its own fresh conversation" und bekommt **nicht** die Conversation-History des Parents; das Einzige, was hineingeht, ist der Prompt-String des Agent-Tool-Aufrufs ([Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)). Der Evaluator sieht damit das Artefakt, nicht die Begründung, warum es so gebaut wurde. Genau das erzeugt die Distanz, die die Selbstbewertungs-Verzerrung aus 3.3 aufhebt.

Praktische Konsequenz: **Alles, was der Evaluator wissen muss, muss in seinen Prompt oder in eine Datei, die er liest.** Er kann nichts aus dem Kontext des Generators erben.

Zusätzlich lässt sich der Evaluator technisch entschärfen: über `tools` auf lesende Werkzeuge beschränken (`Read`, `Grep`, `Glob` plus Browser-MCP), damit er das Problem nicht selbst "wegrepariert" statt es zu melden ([Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)).

### 4.3 Wie man den Evaluator skeptisch prompted

Es gibt kein publiziertes Zauber-Prompt. Publiziert ist die **Methode**: Logs des Evaluators lesen, Fälle sammeln, in denen sein Urteil vom eigenen abweicht, und den Prompt gezielt gegen genau diese Fälle härten — mehrere Runden lang. Was aus den Quellen ableitbar ist:

- **Kriterien vorgeben statt Gesamturteil verlangen.** Im Frontend-Teil waren es vier: *Design quality* ("Does the design feel like a coherent whole rather than a collection of parts?"), *Originality* ("Is there evidence of custom decisions, or is this template layouts, library defaults, and AI-generated patterns?"), *Craft* (Typografie-Hierarchie, Spacing, Farbharmonie, Kontrastverhältnisse — "a competence check rather than a creativity check") und *Functionality* ("Can users understand what the interface does, find primary actions, and complete tasks without guessing?"). Gewichtet wurde zugunsten von Design Quality und Originality.
- **Dieselben Kriterien an Generator und Evaluator geben.** Beide arbeiten gegen denselben Maßstab.
- **Kriterien granular halten.** Im Game-Editor-Beispiel hatte allein Sprint 3 **27 Kriterien** für den Level-Editor.
- **Beobachtung statt Codelektüre verlangen.** Die im DAW-Lauf gefundenen Mängel sind durchweg Verhaltensaussagen: "Clips can't be dragged/moved on the timeline", "Audio recording is still stub-only (button toggles but no mic capture)", "Effect visualizations are numeric sliders, not graphical (no EQ curve)". Solche Befunde entstehen nur, wenn der Evaluator die App wirklich bedient.
- **Den Ausstieg blockieren.** Die dokumentierte Fehlermode ist nicht "findet nichts", sondern "findet etwas und redet es klein". Der Prompt muss das Herunterstufen eines gefundenen Befunds ausdrücklich verbieten.

Der Evaluator-Optimizer-Loop funktioniert generell dann gut, wenn sich Ergebnisse durch artikuliertes Feedback nachweislich verbessern und das LLM diese Kritik zuverlässig liefern kann ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)). Beides musst du für dein Projekt beantworten, bevor du den Loop baust.

### 4.4 Wie viele Runden?

Im Frontend-Teil: "I ran 5 to 15 iterations per generation", volle Läufe bis zu vier Stunden. Bemerkenswert am Museums-Website-Beispiel: Bis zur neunten Iteration wurde verfeinert, in der zehnten wurde der Ansatz komplett verworfen und neu begonnen. **Setze das Iterationsbudget nicht auf 2–3.** Die interessanten Sprünge kommen spät.

---

## 5. Context Resets statt Kompression

**Definition.** Context Reset heißt: "clearing the context window entirely and starting a fresh agent, combined with a structured handoff that carries the previous agent's state and the next steps". Compaction dagegen: "earlier parts of the conversation are summarized in place so the same agent can keep going on a shortened history." ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))

| | Compaction | Context Reset |
|---|---|---|
| Agent | derselbe | neuer |
| Zustand | zusammengefasste History im Kontext | strukturierter Handoff in Dateien |
| Kontinuität | erhalten | bewusst gebrochen |
| Context Anxiety | **bleibt bestehen** | aufgehoben ("A reset provides a clean slate") |
| Aufwand | konfigurierbar, quasi kostenlos | Handoff-Format muss gebaut und gepflegt werden |

**Die Entscheidungsregel:** Compaction löst ein *Platzproblem*. Reset löst ein *Zustandsproblem*. Wenn dein Symptom vorzeitiges Aufhören ist, hilft Compaction nicht — im Referenzprojekt war es bei Sonnet 4.5 ausdrücklich nicht ausreichend.

Auch die Plattformdokumentation grenzt Compaction ein: nicht empfohlen, "when you need verbatim preservation of specific historical context" oder wenn die Aufgabe exakte Erinnerung an frühe Details verlangt ([Compaction](https://platform.claude.com/docs/en/build-with-claude/compaction)). Ein Reset mit Handoff ist in diesen Fällen sauberer, weil du selbst kontrollierst, was verbatim übernommen wird.

**Was in einen Handoff gehört.** Belegt sind folgende Bausteine ([Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)):

| Artefakt | Zweck | Belegtes Detail |
|---|---|---|
| Feature-Liste als **JSON** | Wahrheit über Fertig/Nicht-Fertig | über 200 Features, initial alle auf "failing"; JSON statt Markdown gewählt, weil Modelle strukturierte Daten seltener versehentlich überschreiben |
| Fortschritts-Log (`claude-progress.txt`) | Erzählkontext, Entscheidungen, Sackgassen | wird zu Sessionbeginn gelesen |
| Git-History | Rollback und nachvollziehbare Schritte | aussagekräftige Commit-Messages gefordert |
| Startskript (`init.sh`) | reproduzierbarer Environment-Start | standardisiert den Sessionbeginn |

Dazu ein wörtlich dokumentierter Schutz gegen die naheliegendste Abkürzung: *"It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality."*

**Session-Startsequenz für den Nachfolge-Agenten:** Fortschrittsdatei lesen → Git-Log prüfen → einen einfachen End-to-End-Test laufen lassen → **erst dann** neue Features implementieren.

**Merke:** Der Handoff ist ein Anwendungsfall von "the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome" ([Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Er soll nicht die alte Session nacherzählen, sondern den Nachfolger handlungsfähig machen.

### 5.1 Woran du den Reset auslöst

Ein Reset an der falschen Stelle zerstört Arbeitszustand, ein Reset zu spät bringt den Agenten in die Zone, in der er ohnehin nicht mehr zuverlässig ist. Drei brauchbare Auslöser, in dieser Rangfolge:

| Auslöser | Wie du ihn erkennst | Bewertung |
|---|---|---|
| **Meilenstein erreicht** | Ein Feature ist implementiert und verifiziert, Commit ist gesetzt | **bester Auslöser** — der Zustand ist ohnehin sauber und vollständig in Dateien abgebildet |
| **Token-Schwelle** | Input-Tokens überschreiten einen gesetzten Wert | brauchbar als Sicherheitsnetz; technisch abbildbar über `pause_after_compaction`, das den Lauf beim Erreichen der Schwelle mit `stop_reason: "compaction"` anhält und dir die Kontrolle zurückgibt ([Compaction](https://platform.claude.com/docs/en/build-with-claude/compaction)) |
| **Verhaltenssignal** | Der Agent beginnt zusammenzufassen, statt zu arbeiten | Notbremse — an diesem Punkt ist meist schon Qualität verloren |

**Gesamtbudget begrenzen.** Wenn ein Lauf beliebig lange weiterlaufen könnte, brauchst du eine Obergrenze. Das dokumentierte Muster: Compaction-Ereignisse zählen und beim Erreichen des Budgets eine Abschlussaufforderung einschieben (*"Please wrap up your work and summarize the final state."*) ([Compaction](https://platform.claude.com/docs/en/build-with-claude/compaction)). Ohne solches Limit ist ein Harness kostenoffen — bei Faktor-20-Kosten gegenüber dem Solo-Lauf ist das keine akademische Sorge.

**Kostenkontrolle beim Abrechnen:** Compaction ist ein zusätzlicher Sampling-Schritt. Die Top-Level-Felder `input_tokens`/`output_tokens` zeigen **nur** die Nicht-Compaction-Iterationen; die Gesamtkosten musst du über alle Einträge in `usage.iterations` summieren ([Compaction](https://platform.claude.com/docs/en/build-with-claude/compaction)). Wer das übersieht, unterschätzt die Harness-Kosten systematisch.

---

## 6. Anti-Patterns

### 6.1 Solo-Agent für eine komplexe Anwendung

**Folge:** Belegt am Retro-Game-Maker: 20 Minuten, 9 $, und "the actual game was broken. My entities appeared on screen but nothing responded to input." Die App sah fertig aus und war es nicht. Das ist der teure Fall, weil der Fehler erst beim Benutzen auffällt.
**Regel:** Bei mehr als einer Handvoll interagierender Features darf kein Lauf ohne Verifikationsschritt an echtem Verhalten enden.

### 6.2 Zu detaillierte Vorab-Spezifikation → Fehlerkaskaden

**Folge:** Der Planner wurde bewusst auf "product context and high level technical design rather than detailed technical implementation" beschränkt. Grund: "if the planner tried to specify granular technical details upfront and got something wrong, the errors in the spec would cascade into the downstream implementation." Der Generator korrigiert die Spec nicht — er implementiert sie.
**Regel:** "constrain the agents on the deliverables to be produced and let them figure out the path as they worked." Spezifiziere das **Was** hart und das **Wie** weich. Das gilt auch für dich, wenn du einem Subagenten einen Auftrag schreibst.

### 6.3 Der Agent bewertet sich selbst

**Folge:** Systematisch zu positive Noten; bei subjektiven Aufgaben ohne binären Check besonders ausgeprägt. Praktisch: Der Lauf endet mit "alle Features implementiert", und die Hälfte funktioniert nicht.
**Regel:** Kein Selbst-Review als Qualitätstor. Entweder ein automatisierbarer Test oder ein separater Agent mit eigenem Kontext. Ein "Review-Schritt" am Ende desselben Prompts zählt nicht.

### 6.4 Harness-Komponenten, die niemand mehr prüft

**Folge:** Du bezahlst Tokens und Laufzeit für Struktur, die nichts mehr bewirkt — und schlimmer: Struktur, die das Modell einengt, obwohl es die Aufgabe inzwischen besser ohne sie löst. Das Sprint-Konstrukt ist der belegte Fall: auf Opus 4.5 nötig, auf Opus 4.6 ersatzlos gestrichen.
**Regel:** Jede Komponente braucht eine notierte Begründung (welche Schwäche, welches Symptom) und ein Datum. Ohne beides fliegt sie beim nächsten Review raus.

### 6.5 Radikale Vereinfachung in einem Schritt (der Gegenfehler)

**Folge:** Der Versuch, das Harness auf einen Schlag drastisch zu vereinfachen, scheiterte im Referenzprojekt. Erfolgreich war stattdessen: "removing one component at a time and reviewing what impact it had on the final result."
**Regel:** Abbau ist genauso inkrementell wie Aufbau. Eine Komponente pro Testlauf.

### 6.6 Orchestrierung im Konversationskontext bei sehr vielen Agenten

**Folge:** Subagents "work well for a few delegated tasks per turn". Für Läufe, die Dutzende bis Hunderte Agenten koordinieren, gehört die Orchestrierung in ein Skript außerhalb des Konversationskontexts — dafür existiert das `Workflow`-Tool ([Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)).
**Regel:** Ab etwa einem Dutzend koordinierter Agenten pro Lauf: nicht mehr turn-by-turn delegieren.

---

## 7. Wartung: Harnesses altern

Harness-Komponenten sind an Modellgenerationen gebunden. Der publizierte Wartungsauftrag:

> "When a new model lands, it is generally good practice to re-examine a harness, stripping away pieces that are no longer load-bearing to performance and adding new pieces to achieve greater capability that may not have been possible before."
> ([Harness design](https://www.anthropic.com/engineering/harness-design-long-running-apps))

Und die Gegenthese zur Erwartung, Harnesses würden bedeutungslos:

> "the space of interesting harness combinations doesn't shrink as models improve. Instead, it moves"

### 7.1 Der Load-Bearing-Test

So prüfst du, ob eine Komponente noch trägt:

1. Wähle **eine** Komponente. Nicht mehrere.
2. Definiere vorher das Messkriterium — dieselbe Aufgabe, dieselben Bewertungskriterien, dieselbe Iterationszahl.
3. Lauf A: mit Komponente. Lauf B: ohne.
4. Vergleiche Ergebnisqualität, Laufzeit und Kosten.
5. Fällt die Qualität nicht messbar: Komponente entfernen. Fällt sie: Begründung mit Modellversion und Datum notieren.
6. Nächste Komponente.

Ergänzend gilt: "It is always good practice to experiment with the model you're building against, read its traces on realistic problems, and tune its performance to achieve your desired outcomes." **Traces lesen ist die eigentliche Arbeit** — nicht Prompt-Raten.

### 7.2 Erfahrungswerte: was zuerst wegfällt

| Komponente | Alterungsrisiko | Belegte Beobachtung |
|---|---|---|
| Sprint-/Chunking-Konstrukt | **hoch** | auf Opus 4.6 vollständig entfernt |
| Evaluator pro Zwischenschritt | **hoch** | auf einen einzigen Durchgang am Ende reduziert |
| Evaluator generell | **mittel**, aufgabenabhängig | auf Opus 4.5 für einfachere Aufgaben "necessary overhead"; auf 4.6 verschob sich die Grenze nach aussen |
| Context Reset / Handoff | **mittel** | Builder lief auf Opus 4.6 "coherently for over two hours" am Stück |
| Planner | **niedrig** | blieb über den Modellwechsel erhalten; ohne ihn "under-scoped" der Generator |
| Verifikation an laufender Software | **niedrig** | Werkzeug, keine Krücke — ersetzt keine Modellschwäche, sondern liefert Fakten |

**Merkregel:** Komponenten, die dem Modell **Information oder Werkzeuge geben** (Planner, Browser-Automation, Tests, Handoff-Dateien), altern langsam. Komponenten, die das Modell **einschränken oder zerlegen** (Sprints, Zwangs-Chunking, Zwischen-Checkpoints), altern schnell.

---

## 8. Checkliste: Brauche ich hier überhaupt ein Harness?

Arbeite die Fragen der Reihe nach ab. Jede Zeile hat eine Konsequenz.

| # | Frage | Bei **Nein** | Bei **Ja** |
|---|---|---|---|
| 1 | Läuft die Aufgabe voraussichtlich länger als ein Context Window? | Kein Harness. Ein guter Prompt plus Tests reicht. | Weiter zu 2. |
| 2 | Gibt es mehrere voneinander abhängige Artefakte (Frontend + Backend + Daten + Tests)? | Kein Multi-Agent-Aufbau. Höchstens Planner-Schritt vorschalten. | Weiter zu 3. |
| 3 | Ist "fertig" durch einen automatischen Check entscheidbar (Build, Tests, Typechecker)? | Du brauchst einen **Evaluator**. Weiter zu 4. | Kein Evaluator. Baue stattdessen den Check ein — er ist billiger und zuverlässiger. |
| 4 | Enthält die Aufgabe subjektive Qualität (Design, Text, UX)? | Kriterienkatalog optional. | Kriterienkatalog **verpflichtend** — sonst benotet der Evaluator nach Bauchgefühl. |
| 5 | Kann ein Fehler unbemerkt bleiben, bis ein Mensch die Software benutzt? | Code-Review genügt. | Der Evaluator braucht **Browser-/Runtime-Automation**, nicht nur Dateizugriff. |
| 6 | Muss über mehrere Sessions hinweg gearbeitet werden (oder wird der Lauf unterbrochen)? | Kein Handoff-Format nötig. | **Handoff bauen**: Feature-Liste (JSON), Fortschritts-Log, Git, Startskript. |
| 7 | Ist der Nutzen 20-fache Kosten und 15-fache Laufzeit wert? | **Solo-Agent verwenden.** Ein Wochenend-Skript, ein Bugfix, ein Refactoring in einer Datei: kein Harness. | Harness bauen — schrittweise nach Abschnitt 2. |
| 8 | Kannst du für **jede** eingeplante Komponente die Modellschwäche benennen, die sie kompensiert? | Streiche die Komponenten, bei denen du es nicht kannst. | Bauen. Begründung und Modellversion mit ins Repo schreiben. |

**Zusatzregel für parallele Subagents:** Erst einbauen, wenn die Teilaufgaben wirklich unabhängig sind. Der Gewinn ist Zeit ("independent subtasks finish in the time of the slowest one rather than the sum of all of them") und Kontext-Sauberkeit — nicht Qualität ([Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)). Bei abhängigen Schritten erzeugt Parallelisierung nur Merge-Konflikte.

**Die drei Prinzipien, an denen du dich am Ende misst** ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)):

1. **Simplicity** — halte das Design einfach.
2. **Transparency** — mache den Planungsschritt des Agenten explizit sichtbar.
3. **Agent-Computer-Interface** — investiere in Tool-Dokumentation und Tool-Tests wie in eine öffentliche API.

---

## 9. Anhang A — Symptom-Index

Nachschlagewerk für den laufenden Betrieb: Du beobachtest ein Verhalten, du suchst die Maßnahme. Jede Zeile verweist auf den Abschnitt mit der Begründung.

| Beobachtetes Symptom | Wahrscheinliche Ursache | Erste Maßnahme | Abschnitt |
|---|---|---|---|
| Agent liefert Zusammenfassung + "Nächste Schritte", obwohl Budget übrig ist | Context Anxiety | Context Reset mit Handoff (nicht Compaction) | 3.2 / 5 |
| Agent widerspricht Fakten, die er selbst früher im Lauf festgestellt hat | Context Rot | Notizen in Dateien auslagern; Compaction oder Context Editing | 3.1 |
| Lauf endet mit "alle Features implementiert", die Hälfte funktioniert nicht | Selbstbewertungs-Verzerrung + oberflächliches QA | separater Evaluator mit Runtime-Zugriff | 3.3 / 3.5 |
| Evaluator findet Bugs und stuft sie dann selbst herab | nachsichtiges QA-Prompting | Logs lesen, Divergenzfälle sammeln, Prompt härten; Herunterstufen verbieten | 4.3 |
| Ergebnis ist lauffähig, aber deutlich kleiner als beauftragt | Scope-Unterschätzung | Planner vorschalten, explizit "ambitious about scope" | 3.4 |
| Fehler wiederholt sich in vielen Dateien identisch | Fehlerkaskade aus zu detaillierter Spec | Spec auf Deliverables reduzieren, Implementierungsdetails freigeben | 6.2 |
| Generator "repariert" gemeldete Probleme, statt sie zu bestätigen | Evaluator hat Schreibrechte | Evaluator über `tools` auf `Read`/`Grep`/`Glob` + Browser-MCP beschränken | 4.2 |
| Kosten explodieren, Ergebnis wird nicht besser | Komponenten ohne Wirkung | Load-Bearing-Test, eine Komponente pro Lauf entfernen | 7.1 |
| Agent bricht Aufgaben ab, weil ein Tool fehlt oder unklar dokumentiert ist | schwaches Agent-Computer-Interface | Tool-Beschreibungen überarbeiten und testen | 8 (Prinzip 3) |
| Parallele Subagents erzeugen widersprüchliche Änderungen | Teilaufgaben waren nicht unabhängig | sequenziell ausführen; Parallelität nur bei echter Unabhängigkeit | 8 (Zusatzregel) |
| Analyse ist inhaltlich falsch, obwohl das Material vollständig übergeben wurde | zu viel Rohmaterial in einem Aufruf; Entitäten falsch aufgelöst | verdichtete Sicht vorschalten, nicht den Prompt verlängern | 3.1 / `07` B3 |
| Analyse bleibt ausufernd, auch nachdem der Kontext gekürzt wurde | keine Kontextfrage — das Modell gewichtet Detail nicht | weiteres Kürzen hilft nachweislich nicht; Umfang an anderer Stelle begrenzen | `08` 3 |

Die letzte Zeile ist die einzige in dieser Tabelle, die auf ein **Nicht**-Symptom dieses Kapitels zeigt: Ausschweifung überlebt jede Kontextkürzung, weil sie keine Mengenfrage ist. Wer sie als Context Rot behandelt, kürzt vergeblich weiter.
| Neue Modellversion, Ergebnisse unverändert oder schlechter | veraltete Zwangsstruktur | Sprints/Chunking zuerst streichen, dann Zwischen-Evaluatoren | 7.2 |

## 10. Anhang B — Kurzform der Doktrin

Wenn du nur zehn Zeilen mitnimmst:

1. Ein Harness ist eine Menge von Wetten auf Modellschwächen. Jede Wette braucht eine Begründung und ein Verfallsdatum.
2. Einfachste Lösung zuerst; Komplexität nur gegen ein beobachtetes Symptom.
3. Der Preis ist real: im belegten Beispiel Faktor 20 an Kosten gegenüber dem Solo-Lauf.
4. Ein echter Test schlägt jeden Evaluator. Ein Evaluator schlägt jede Selbstbewertung.
5. Der Evaluator muss ein separater Agent mit eigenem, frischem Kontext sein — sonst wirkt der Mechanismus nicht.
6. Reset schlägt Compaction, wenn das Problem der Zustand ist und nicht der Platz.
7. Spezifiziere das Was hart, das Wie weich.
8. Baue inkrementell auf und inkrementell ab — eine Komponente pro Testlauf.
9. Komponenten, die informieren, altern langsam. Komponenten, die einschränken, altern schnell.
10. Was garantiert gelten muss, gehört in einen Hook, nicht in einen Prompt.

---

## Quellen

Alle URLs abgerufen am **2026-08-07**.

**Primärquelle**
1. Anthropic Engineering — *Harness design for long-running application development* (24.03.2026): https://www.anthropic.com/engineering/harness-design-long-running-apps

**Weitere Anthropic-Engineering-Artikel**
2. Anthropic Engineering — *Effective harnesses for long-running agents* (26.11.2025): https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
3. Anthropic Engineering — *Effective context engineering for AI agents* (29.09.2025): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
4. Anthropic Engineering — *Building effective agents* (19.12.2024): https://www.anthropic.com/engineering/building-effective-agents

**Claude-Plattform-Dokumentation**
5. *Subagents in the SDK*: https://platform.claude.com/docs/en/agent-sdk/subagents (leitet weiter auf https://code.claude.com/docs/en/agent-sdk/subagents)
6. *Agent SDK overview*: https://platform.claude.com/docs/en/agent-sdk/overview (leitet weiter auf https://code.claude.com/docs/en/agent-sdk/overview)
7. *Context editing*: https://platform.claude.com/docs/en/build-with-claude/context-editing
8. *Compaction*: https://platform.claude.com/docs/en/build-with-claude/compaction

**Hinweis zur Haltbarkeit:** Alle Zahlen in dieser Datei stammen aus Läufen auf Claude Opus 4.5 bzw. Opus 4.6. Sie sind Größenordnungen, keine Garantien, und sie verschieben sich mit jeder Modellgeneration. Die Modellschwächen aus Abschnitt 3 sind ebenfalls modellgebunden — prüfe sie neu, statt sie zu glauben.
