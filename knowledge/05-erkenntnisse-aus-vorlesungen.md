---
type: Erkenntnisse
title: Erkenntnisse aus neun Konferenzvorträgen — was Praktiker über Harness-Bau berichten
description: "Sieben themenübergreifende Befunde aus neun Vorträgen der AI Engineer Conference 2026, ihre Belege, die offenen Widersprüche zwischen den Sprechern, und die ehrliche Abgrenzung dessen, was eine Katalog-Bibliothek daraus nicht übernehmen kann."
status: stable
sources:
  - id: chan-memo
    title: "Build for the Memo, Not the Demo — AI Engineer Conference"
    author: Shawn Chan (China Resources Holdings)
    resource: Konferenzvortrag, 2026-07-30
    retrieved: 2026-08-07
  - id: wang-emulated
    title: "Emulated: The Data for Fully Autonomous Software Engineers and Companies"
    author: Joseph Wang (Emulated)
    resource: Konferenzvortrag, veröffentlicht 2026-07-31
    retrieved: 2026-08-07
  - id: branco-slop
    title: "Ending AI Slop"
    author: Thais Castello Branco (Taste Labs)
    resource: Konferenzvortrag, 2026-07-31
    retrieved: 2026-08-07
  - id: feng-learning
    title: "Learning on the Job: The Future of Post-Training"
    author: Raymond Feng (Applied Compute)
    resource: Konferenzvortrag
    retrieved: 2026-08-07
  - id: kumar-eventsourced
    title: "Let's integrate AI Agents in Event-Sourced Systems"
    author: Divakar Kumar (FlyersSoft)
    resource: Konferenzvortrag, 2026-07-30
    retrieved: 2026-08-07
  - id: salomon-yosef-mcpapps
    title: "MCP Apps: Extending the Frontier"
    author: Ido Salomon & Liad Yosef (MCP Steering Committee)
    resource: Konferenzvortrag, veröffentlicht 2026-08-03
    retrieved: 2026-08-07
  - id: davis-mcptasks
    title: "MCP Tasks (async): Why Aren't Any Agents Supporting Them?"
    author: Cornelia Davis (Temporal)
    resource: Konferenzvortrag
    retrieved: 2026-08-07
  - id: garg-environments
    title: "Rethinking Environments for Long-Horizon Work"
    author: Rayan Garg (Theta Software)
    resource: Konferenzvortrag, 2026
    retrieved: 2026-08-07
  - id: rallabandi-wearing
    title: "Wearing the Agent: From Group Chats to Glasses"
    author: Sai Krishna Rallabandi
    resource: Konferenzvortrag
    retrieved: 2026-08-07
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-08-07
tags: [erkenntnisse, harness, verifikation, zustand, sicherheit, kuration, widersprueche, belege]
---

# 05 — Erkenntnisse aus neun Konferenzvorträgen

> **Abstract.** Neun Praktiker der AI Engineer Conference 2026 beschreiben unabhängig voneinander dieselben sieben Muster: das Harness deckelt das Ergebnis, Zustand gehört auf die Platte, geprüft wird gegen den Zustand, Qualität wird zerlegt statt beurteilt, Quellen sind nicht gleichwertig, Sicherheit sitzt im Set statt im Baustein, und die schmale Schicht ist das Produkt.
> Für wen: wer an dieser Bibliothek baut — an `tools/harness.mjs`, an `recipes/`, an den Skills `/harness-build` und `/harness-update` — und begründen können muss, warum eine Entscheidung so und nicht anders fällt.
> Wann lesen: vor jedem strukturellen Eingriff in CLI, Rezepte oder Katalogfelder; die Abschnitte 3 und 4 vor jeder Diskussion darüber, ob ein weiterer Vortrag oder ein 14. Repo noch etwas beiträgt.

Alle wörtlichen Zitate stammen aus automatisch erzeugten Transkripten und sind an
verstümmelten Stellen in eckigen Klammern ergänzt. Zahlen sind nur dort übernommen,
wo der Sprecher sie selbst nennt; Einordnungen, die aus unserer Bibliothek stammen
und nicht aus dem Vortrag, sind als solche gekennzeichnet.

---

## 1. Die Themen

### 1.1 Das Harness ist die feste Grösse, nicht das Modell

**These.** Die Umgebung deckelt das Ergebnis, nicht die Modellgüte. Wer bessere
Ergebnisse will, tauscht nicht zuerst das Modell aus.

**Belege.** Vier Vorträge sagen das unabhängig voneinander:

| Sprecher | Beleg |
|---|---|
| Feng | Applied Compute trainiert gegen Harnesses, „including ones that you don't necessarily have access to the source code of". Das Harness ist die Konstante, das Modell das Anpassbare. |
| Wang | „why is it that my model or my agent is so proficient at handling the application layer, but struggles when it comes to reasoning through infrastructure complexities?" — weil die Umgebung nur das Code-Verzeichnis enthält. |
| Garg | „different harnesses you care about have a pretty big impact on how many tokens are actually consumed on a task". Eine Kennzahl ohne festgehaltenen Harness ist nicht interpretierbar: „if a task takes GPT model 500,000 tokens, that doesn't really tell you a lot about what that task would look like for cloud models". |
| Chan | Nach seinen fünf Vertrauensforderungen: „[Not] one of these is a bigger brain problem. All five [are] plumbing and honesty problems." |

Der schärfste Einzelbeleg kommt von Feng und betrifft Zuverlässigkeit: rund
10 Prozent der Tool-Calls schlugen wegen Netzwerkproblemen fehl, woraufhin das
Modell „shorter and shorter responses" ausgab — „this was really surprising to us
because in our reward function, we actually didn't have any length penalty."
Sein Bild dafür: fehlschlagende Tool-Calls sind Schlaglöcher im Gehweg, also läuft
man nicht mehr weit. Fazit: „any mistake that you make, even if it's not
intentional, will end up inducing these subtle undesirable behaviors."

**Was daraus folgt.**

1. Die Existenzberechtigung dieser Bibliothek ist damit von aussen belegt und
   gehört als datierter Beleg nach `knowledge/01-harness-doktrin.md` — Arbeit am
   Harness hat längere Halbwertszeit als Arbeit an Prompts für ein bestimmtes Modell.
2. Der Harness ist eine eigene **Kostenvariable**. Jeder Katalogeintrag braucht
   einen Kontextpreis (Grösse der SKILL.md, Zahl und Grösse mitgeladener
   Referenzdateien, eager oder lazy), und `/harness-build` muss vor der Bestätigung
   ein Kontextbudget des Gesamt-Setups ausweisen. Zwölf Skills à 400 Zeilen sind ein
   anderes Produkt als zwölf Skills à 40 Zeilen, auch wenn die Trefferliste
   gleich aussieht.
3. **Zuverlässigkeit schlägt Formulierung.** Bausteine, die Verhalten erzwingen
   (Hooks, Gates, Commands mit festem Ablauf), sind höher zu gewichten als
   Prosa-Skills. Ein Baustein mit perfekter Beschreibung und flakigem Werkzeug
   richtet mehr Schaden an als ein mittelmässiger, der zuverlässig läuft — und der
   Schaden zeigt sich an einer Stelle, an der niemand sucht.
4. Unser Bestand steht dazu im Widerspruch: 24.729 Skills gegen 70 Hooks und
   4 MCP-Konfigurationen. Für `sources.txt` heisst das, gezielt nach Repos mit
   Hooks, Validierern und CI-Gates zu suchen statt nach weiteren Skill-Sammlungen.
5. Einschränkung, die nicht verschwiegen wird: bei Feng entsteht der Effekt über
   Gewichtsupdates, bei uns nur in-context innerhalb einer Sitzung. Der Effekt ist
   derselbe, die Halbwertszeit kürzer.

---

### 1.2 Zustand gehört auf die Platte, der Kontext bekommt nur den Einstiegspunkt

**These.** Was ein Lauf erzeugt, wird persistiert und gezielt abgefragt — nicht im
Kontextfenster mitgeschleppt und nicht ungefiltert gelistet.

**Belege.** Sechs Vorträge beschreiben dasselbe Muster aus verschiedenen Richtungen:

| Sprecher | Beleg |
|---|---|
| Davis | „if you don't persist task IDs, there is no way to get it back. So, I'm not quite sure why this doesn't have an all caps must." Und zum ungefilterten Listing: „what happens if you've got a whole slew of agents out there and you've got a million tasks at the back end. Spoiler alert, there is no filter on that endpoint." — „just because you can doesn't mean you should." |
| Feng | Der Zustand wandert über drei Stufen aus dem teuren Kern heraus: „in this simple setup for Q&A, you don't have anything living outside of the training stack" → „we offload a lot of the environment state outside of the training stack" → „The only thing we have left is the model completion endpoint and some way to record the requests and responses". Replayability ist die Vorbedingung für jeden Vergleich: „for any specific prompt, you can always roll back to the initial state and rerun it." |
| Kumar | Der Agent liest nie den Event Store: „you won't be able to rely entirely upon the event store for the query operation ... you will be having different read models which are optimized for the read operations." Drei Read Models, „one for timelines, one for customer information, and one for the fraud in the indicators, the risk view." |
| Garg | „you can't just use this really basic approach of taking the trajectory and stuffing it in the context window ... we need to make the trajectory itself queryable." |
| Salomon/Yosef | Teure Artefakte per Identifier adressieren statt neu erzeugen: „maybe we can pass some identifier from the server in a way that would help the model actually keep updating the same view." Und: „In practice, it's usually consumed beforehand, like it's preloaded." |
| Rallabandi | „store everything and then keep compacting" ist der naive Weg; besser „extract some form of atomic information, atomic bits from this conversation" plus „intelligent retrieval as opposed to crawling everything". |

**Was daraus folgt.**

Die **Leseseite** haben wir richtig gebaut: `INDEX.md` (5 KB) als Einstieg,
`catalog/by-domain/*.md` als Mittelschicht, `catalog/index.json` (20 MB)
ausschliesslich über das CLI. Das ist von sechs Vorträgen bestätigt und keine
Baustelle mehr. Davis liefert zusätzlich die Begründung, warum das keine
Bequemlichkeit ist: ein ungefiltertes Listing über 25.642 Einträge ist nicht
„gross", es ist unbrauchbar. Konsequenz über die bestehende Regel hinaus: die
Filterpflicht ins CLI einbauen statt in die Doku — `search` ohne `--type`/`--domain`
und ohne `--limit` sollte nicht das Vollergebnis liefern, `--all` bleibt eine
bewusste Entscheidung, und breite Suchen fordern aktiv zum Nachschärfen auf.

Die **Schreibseite** fehlt komplett. Konkret:

- `cmdSync` erhebt pro Repo before/after-HEAD-SHAs und den Status
  (new/updated/unchanged/error/orphan), reicht diesen `syncReport` aber nur an
  `cmdUpdate` weiter, das daraus Prosa in `CHANGELOG.md` schreibt. Die SHAs landen
  nirgends maschinenlesbar. Ein `state.json` mit Repo-SHA, Extract-Zeitstempel und
  Lauf-ID wäre die direkte Umsetzung.
- Das Install-Manifest führt keinen Quell-Commit. Ohne gepinnte Commits ist ein
  einmal funktionierendes Setup nicht reproduzierbar — und damit ist die Aussage
  „Setup A war besser als B" Erinnerung, kein Beleg.
- Eine abgebrochene `/harness-build`-Sitzung fängt die Recherche bei null an. Der
  Vorschlag lebt nur im Gespräch. Er gehört als Datei ins Zielprojekt
  (`.harness/selection.json`: geprüfte IDs, Quell-Commit, Zielpfad, Kurzbegründung,
  Entscheidungsstand), damit der Zustand „wartet auf Freigabe" ein benannter
  Zustand ist und keine Gesprächspause.
- Dasselbe Änderungssignal, das `cmdSync` bereits erhebt, sollte den Extract
  steuern: nur geänderte Repos neu parsen. Heute läuft `cmdExtract` über alle
  14 Repos, einschliesslich der 24.543 Bausteine aus dem Massen-Repo, auch wenn
  dort nichts passiert ist. Das ist eine reine Auswertung von Daten, die das CLI
  heute schon erhebt und wegwirft.

Kumars Punkt kommt zusätzlich: **eine Projektion reicht nicht**. Er hat drei, weil
es drei Fragearten gibt. Uns fehlt eine Sicht nach Baustein-Typ — obwohl der Typ
nach `knowledge/02-bausteine.md` das eigentliche Entscheidungskriterium ist — und
eine Sicht nach Rezept/Projekttyp. Und seine Kontextlehre ist Vorberechnung, nicht
Sparsamkeit beim Lesen: Zeilenumfang, Vorhandensein einer Frontmatter-Description,
Anzahl referenzierter Tools, Quell-Repo und letzte Änderung im Katalogeintrag
ersparen je einen `show`-Aufruf.

---

### 1.3 Geprüft wird gegen den Zustand, nie gegen die Selbstauskunft

**These.** Korrektheit stellt man am Endzustand der Umgebung fest. Was ein Agent
über seine Arbeit berichtet und was ein Autor über seinen Baustein behauptet, sind
Behauptungen.

**Belege.**

| Sprecher | Beleg |
|---|---|
| Garg | „besides just like looking at the tool calls agent made which are usually not very reliable it actually has to also check the GitHub logs it might check the AWS logs". Und: „the only way we can really verify correctness is to actually look at the state itself." Dazu die Rollentrennung: „judges are agents too ... it's really important that the judge has access to the environment in the same way with some important safeguards ... Maybe that means enforcing read-only permissions". |
| Chan | Der New Yorker Anwalt, sechs erfundene Gerichtsurteile mit „beautiful citations, proper formatting". Vor der Einreichung fragte er den Chatbot, ob die Fälle echt seien — Antwort: ja. „That is like asking the guy who sold you the watch whether the watch is real. The judge fined him." Und der Produkttest: „the click-through is a product. Everything else is well-written packaging." |
| Davis | Die V1-Referenzimplementierung hielt ihre eigene Spezifikation nicht ein: bei mehreren parallelen `input_required` war der Client faktisch FIFO — „you could only respond to the first one." Gefunden nur, weil sie sie laufen liess. |
| Branco | „LLM as a judge might not necessarily always be the best method. We know that there's a lot of reward hacking." |
| Kumar | Fremde Quellen halten sich nicht an unser Muster: „you can't say other teams to follow the same patterns" — deshalb ist die Normalisierungsschicht der tragende Teil, nicht Beiwerk. |

**Was daraus folgt.** Zwei harte Konsequenzen.

**Erstens: „installiert" ist eine Zustandsaussage.** `/harness-build` darf nicht
melden, ein Baustein sei eingebaut, weil ein Kopierbefehl fehlerfrei zurückkam.
Geprüft wird im Zielprojekt: liegt die Datei unter `.claude/skills/<name>/SKILL.md`,
ist das Frontmatter parsebar, sind `name` und `description` gesetzt, gibt es keinen
Namenskonflikt, sind deklarierte Hooks tatsächlich in `settings.json` registriert
(heute macht `install` das nachweislich nicht). Dasselbe für `sync`/`update`: nicht
„14 Repos gezogen" melden, sondern Katalogzahlen vorher gegen nachher stellen.

**Zweitens: die Description eines fremden Autors ist eine Behauptung.** Sie ist bei
uns das Routing-Signal, und bei 50 von 56 Hooks ist sie die Shebang-Zeile. Für
Bausteine, die ein Rezept als Pflicht setzt, reicht das nicht: es braucht einen
Rauchtest (installieren, einmal auf einem Wegwerf-Projekt auslösen, Ergebnis gegen
die Description halten) und das Ergebnis als Vermerk im Rezept. Chans Drift-Strecke
gilt bei uns wörtlich: Frontmatter → `search`-Ausgabe → Empfehlungsliste →
`CLAUDE.md` des neuen Projekts, drei Umschreibungen. Ein Feld
`beschreibung: uebernommen | geprueft` gehört in den Katalog **und** in die
installierte Kopie — eine Markierung, die nur in der Suchansicht existiert, ist
wertlos.

**Und: der Erbauer nimmt sein Werk nicht selbst ab.** Wenn wir eine Qualitätsprüfung
für gebaute Setups wollen, dann als eigener Subagent mit demselben CLI-Zugang
(`stats`, `search`, `show`), aber ohne `install`, `sync`, `update` und ohne
Schreibrechte im Zielprojekt — und mit Leserecht auf das tatsächliche `.claude/`
des Zielprojekts, sonst bewertet er nur Behauptungen.

---

### 1.4 Qualität wird zerlegt und messbar gemacht, nicht beurteilt

**These.** „Capability follows measurability." Ein Ganzheitsurteil über Qualität ist
keine Aussage; die Zerlegung in benannte Elemente ist selbst die Ground Truth.

**Belege.**

| Sprecher | Beleg |
|---|---|
| Branco | „capability follows measurability. So if we can solve the measurability problem or at least part of it, then we can solve a big portion of these domains." Und die Abgrenzung: „in this case that decomposition that I mentioned becomes the ground truth" — bewertet wird gegen die Elemente, ausdrücklich nicht gegen eine Musterlösung, „because it could come up with completely new ways of using these components that are still valid but are different from the original." |
| Wang | „you're going to have to meet certain bars like throttling, authentication, authorization. You can't really go without these things." Die Umgebung fällt das Bestanden/Durchgefallen, nicht ein Mensch. |
| Chan | Seite 1 nennt 18 Prozent Umsatzwachstum, Tabelle auf Seite 11 nennt 17,4. „Nobody in the room cares about the missing 0.6. They care about what it means: if this person didn't check the easy mathematics, what did they not check on the hard stuff?" Forderung: „the system refuse[s] to ship a memo where the figures don't match. No human checking at 2:00 in the morning." |
| Garg | „deterministic verifiers aren't completely dead. Oftentimes we use them in tandem with judges. Maybe generating an artifact for the judge to actually look over". |
| Rallabandi | Rater-Kriterien für eine Retrieval-Schicht: Extraktion atomarer Fakten, Relevanz, hierarchische Beziehung, Zeitverlauf, Retrieval. Und die Baseline-Pflicht: „the naive approach here is basically at 50% which is a coin flip and it improves on top of that." |

**Was daraus folgt.** Das erklärte Ziel des Besitzers — „richtiger Setup, damit man
das beste Ergebnis erhält" — ist heute Prosa in `knowledge/01` und damit genau die
Art Frage, die Branco für unbeantwortbar hält. Es muss in eine Elementliste
zerfallen, gegen die jedes fertige Harness läuft:

| Element | Prüfbar durch |
|---|---|
| Kontextbudget der aktiven Descriptions bleibt unter Obergrenze | Summe der Description-Token, deterministisch |
| Keine zwei kollidierenden Trigger im installierten Set | Ähnlichkeitsvergleich der Descriptions, Namenskollision |
| Jeder Rezeptschritt nennt eine existierende Katalog-ID | ID-Auflösung gegen den Index, Exit-Code |
| Erzwungenes Verhalten läuft über Hooks statt Prosa | Typ-Prüfung der Bausteine, die eine Regel tragen |
| Frontmatter aller installierten Bausteine parsebar, `name`/`description` gesetzt | Lint über das Zielprojekt |
| Build und Tests laufen nach dem Setup noch | Verifikationspfad des Rezepts |

Daraus folgen zwei Werkzeuge, die es nicht gibt:

- **`harness.mjs verify`** — Konsistenz mit Exit-Code ungleich 0 bei unbekannter ID
  in `recipes/` oder `knowledge/`, bei Summenfehlern in `INDEX.md` und bei Repos in
  `sources.txt` ohne Katalogeinträge.
- **`harness.mjs eval`** — Routing-Trefferquote gegen eine naive Baseline
  (Titel-Substring-Match), gefahren gegen eine feste Liste von Beispielanfragen aus
  den sechs Rezepten mit erwartetem Treffer. Ohne Baseline ist eine Qualitätsaussage
  keine Aussage.

Die drei Zugriffsebenen stimmen heute nur deshalb überein, weil sie aus demselben
Lauf stammen (nachgerechnet am Katalogstand 2026-08-08 19:36: `INDEX.md` Typ-Tabelle
431+407+141+70+46+4 = 1.099, die Repo-Tabelle `catalog/by-repo.md` summiert über die
14 Repos auf 25.642; `stats` 24.729+417+281+141+70+4 = 25.642). Ungeprüft ist
die Naht zwischen generiert und handgepflegt: `sources.txt` gegen tatsächlich
katalogisierte Repos, in `recipes/` und `knowledge/` genannte IDs, und die
Bedien-Skills unter `.claude/skills/`, die Zahlen zitieren. <!-- lint:historisch -->
Eine frühere Fassung nannte hier `~/.claude/skills` — die Skills lagen doppelt,
im Projekt und global, byte-identisch und ohne Sync. Die globale Ablage ist weg;
es gibt je Skill genau eine Datei. Diese Nähte prüft `lint` inzwischen: IDs gegen
den Katalog, CLI-Aufrufe gegen den Dispatcher, zugesagte Dateien gegen das
Dateisystem, Repos ohne Katalogeintrag.

Ergänzend Fengs Regel gegen Schlupflöcher: **ein Gate darf den Zustand „nicht
bewertbar" nie günstiger stellen als „bewertet und schlecht".** Bei ihm entstand
genau das, weil Sandbox-Timeouts aus dem Training gefiltert wurden — „if the model
feels like the problem is really hard, it will actually just be incentivized to
abuse the tool calls ... so it avoids getting a reward of zero. It just gets the
rollout dropped." Formulierungen wie „falls die Tests nicht laufen, überspringe die
Prüfung" sind dieses Schlupfloch. Nicht-Ausführbarkeit zählt als Fehlschlag.

---

### 1.5 Quellen sind nicht gleichwertig, und Widersprüche werden gemeldet statt geglättet

**These.** Retrieval greift den Text, der der Frage am nächsten liegt — unabhängig
davon, wie belastbar er ist. Und ein System, das Konflikte auflöst statt sie zu
melden, zerstört Information unbemerkt.

**Belege.**

| Sprecher | Beleg |
|---|---|
| Chan | Die Hierarchie: „a number from an audit[ed] filing is your accountant speaking under oath. A number from an analyst note is a friend at a party, confident. [A number] from someone's internal email is a thing you overheard in an elevator." Vorfall: ein teures KI-Werkzeug zog eine Zahl aus einem Gruppenchat — eine Schätzung von vor sechs Monaten —, während die geprüfte Zahl „three rows away in the actual filings" stand. „The AI just liked the group chat version better. It sounded more enthusiastic." |
| Chan | „a contradiction is not a bug, a contradiction is a gift." Und: „Your job as a builder isn't resolve the argument. It's to make sure that the argument happens in front of a human instead of quietly [going on] inside [the] box." Beleg für die stille Glättung: CEO-Zahl und Filing-Zahl deutlich verschieden, niemand meldete es — „We caught it because one person happened to have both documents open at once. Pure luck. Luck is not a control." |
| Branco | Die Diagnoseregel: Uneinigkeit über Objektives („alignment is something that's pretty objective") heisst, eine Quelle ist schlicht falsch; Uneinigkeit über Stil oder Ästhetik „is not necessarily bad data, that's actually good data." |
| Kumar | Der Preis der Glättung: zwei Agenten-Urteile per Metrik verrechnet ergab „many false positive cases" — und landete wieder beim Regelsystem, dem er entkommen wollte. |
| Davis | Reifegrad als Signal: auf ihre eigene Titelfrage antwortet sie „well, cuz they're smart". Die Spezifikation war „marked as experimental"; sieben Monate später strich V2 `tasks/list` ersatzlos. |

**Was daraus folgt.**

1. **Vertrauensstufe in `sources.txt`.** Unsere 14 Repos sind nicht gleichwertig:
   `anthropics/skills` (21 Bausteine) ist die geprüfte Bilanz, `affaan-m/ecc`
   (522 Bausteine) die Analystennotiz, ein Repo mit genau einem Baustein die
   Gruppenchat-Nachricht. Der Tiebreaker der Suche ist heute die alphabetische ID,
   weshalb bei Gleichstand systematisch `affaan-m__ecc` gewinnt. Ein Feld
   `vertrauen: offiziell | kuratiert | einzelquelle` gehört in jede `search`- und
   `show`-Zeile, dient als Tiebreaker, und wenn eine Einzelquelle eine offizielle
   schlägt, wird das in der Empfehlung ausdrücklich vermerkt.
2. **Kollisionen als Gruppe markieren.** Belegter Fall im eigenen Bestand:
   `affaan-m__ecc/agent/code-reviewer` und
   `msitarzewski__agency-agents/agent/code-reviewer` — gleicher Name, nahezu
   deckungsgleiche Beschreibung, verschiedene Repos, untereinander in derselben
   Trefferliste, beim Installieren derselbe Zielpfad. `search` muss solche Gruppen
   markieren, und `/harness-build` legt sie dem Besitzer vor, statt still eine
   Variante zu wählen. `search "code review"` liefert 49 Treffer aus vier Repos,
   angezeigt werden fünf — die Vorschlagsliste braucht eine Spalte „verworfen, weil"
   (Dublette, älteres Repo, zu gross für den Kontext, durch Rezept abgedeckt) und
   die Trefferzahl, damit die verworfene Menge sichtbar bleibt.
3. **Reifegrad-Feld.** Bei Bausteinen, die auf beweglichen Untergrund setzen —
   konkret die drei MCP-Einträge —, gehört die Protokollversion in den Katalog, und
   in `recipes/` gilt: nichts als Pflichtbaustein vorschreiben, dessen Grundlage als
   experimentell markiert ist.
4. **Dieselbe Regel nach innen.** Ein Rezept, das einer Doktrin-Regel widerspricht,
   ist der interessanteste Fund, kein Formatierungsfehler.

---

### 1.6 Sicherheit sitzt an der Handlungsfläche und im Set, nicht am einzelnen Baustein

**These.** Einzeln geprüfte Bausteine ergeben kein sicheres Set. Und der Guard
gehört an die Stelle, an der der Agent handelt, nicht an den Eingang.

**Belege.**

| Sprecher | Beleg |
|---|---|
| Rallabandi | „we can't read our way or we can't model check our way to safety". Beispiel: ein OCR-Modul und ein Reporting-Modul — „Both of the skills static scans are pretty good. They're pristine. They pass them." Gemeinsam: „the OCR extracts the information but the reporting agent when it sends the information along with the information it also sends our PII to a third party." Häufigkeit, wörtlich: „The papers have observed that around 90% of the attacks have this." |
| Rallabandi | Guard-Position: „Instead of guarding whatever the agent reads, we let the agent read everything and then design a guard which is deterministic. So it's fast. ... But design when it is taking the action." Handlungspunkte: „when it is reading bash variables or when it is exporting something or when it is reading secret variables with respect to configs". Drei Klassen: erlauben, bestätigen, verweigern. |
| Rallabandi | Grenze der Inhaltsprüfung: „instead of writing the text normally if you write it interspersed with dots like I do. L.I.K.E. The regex based approaches and most of the static approaches fail at that." |
| Salomon/Yosef | Fremder ausführbarer Code läuft gesandboxt: „just a React component ... and renders it in a sandbox", „that black box iframe". Die App empfiehlt, der Host entscheidet und führt aus: „the host decides what to do. The host keeps this control of the flow" — „everything will go through the chat for auditability." |
| Chan | Protokollpflicht: „a real human approval gate, and it is logged. Who reviewed what change, when they signed." Und zur Auslagerung von Verantwortung an die eigene Software: „If your architecture doesn't have a[n accountable] human at the end of it, you have not built a product. You have built an excuse generator." |

**Was daraus folgt.** Das ist unsere grösste ungedeckte Flanke: 56 Hooks und bis zu
50 MB Plugin-Inhalt werden ungeprüft kopiert, ohne Anzeige der Tool-Rechte, ohne
Bestätigung bei Hooks, ohne jede Isolation.

| Massnahme | Wo |
|---|---|
| Zwei Flags je Katalogeintrag: „liest fremden Inhalt" (WebFetch, Issues, E-Mail, Screenshots, MCP-Reads) und „hat Handlungs-/Ausgangsfläche" (Bash, Datei-Schreiben, Netz-Egress, MCP-Writes) | `extract` |
| Warnung, wenn beide Flags im selben installierten Set auftreten, mit namentlicher Nennung des Paares | `/harness-build` vor der Bestätigung |
| Klartextanzeige jedes Hooks und jedes Bausteins mit Bash-Aufrufen vor der Installation; Ablehnung bei `--dangerously-skip-permissions`, bei Netzaufrufen an nicht gelistete Hosts, bei Schreibzugriffen ausserhalb des Projekts | `/harness-build` |
| ask/deny-Grundausstattung für Env-Variablen, Secrets/Config-Dateien und Netz-Egress | `bootstrap` |
| Ledger-Zeile je Zielprojekt: ID, Quell-Repo, Commit/Stand, Datum, bestätigt ja/nein | `install` |

Die Ledger-Zeile ist bei uns kein Audit-Instrument — ein Besitzer, kein Kunde, kein
Tribunal —, sondern Diagnose und Update: Wochen später beantwortet sie „warum feuert
dieser Skill hier?" und „welche installierten Bausteine haben sich upstream
geändert?". Ohne Protokoll ist ein installiertes Harness eine Blackbox aus
13 fremden Repos.

Wichtig ist die Abgrenzung aus Rallabandis dritter Lektion: **deterministische Hooks
dürfen nur die Form der Handlung prüfen** — welches Tool, welche Argumentstruktur,
welche Pfade —, nicht den Inhalt. Ein Katalog-Hook, der Prompt-Injection per
Textmuster erkennen will, gibt falsche Sicherheit und gehört im Katalog
entsprechend gekennzeichnet. Und als Design-Aussage über unsere Baustein-Typen:
Sicherheit wird nie über Skill-Text formuliert, sondern über PreToolUse-Hooks und
die `permissions` in `settings.json` — `allow`/`ask`/`deny` sind exakt Rallabandis
drei Klassen.

---

### 1.7 Die schmale Schicht ist das Produkt — und sie muss auch schrumpfen können

**These.** In unscharfen Domänen schlägt wenig, sehr sorgfältig Kuratiertes viel
Unsauberes. Und ohne Abgangsmechanismus verrottet die schmale Ebene still, während
die Suche weiter Treffer liefert.

**Belege.**

| Sprecher | Beleg |
|---|---|
| Branco | „I would advocate for a quality over quantity approach. ... having that be incredibly high quality done by people that also are incredibly high taste ... yield far better results than getting a bunch of noisy data". Und: „What is considered good today is different than five years ago and different than five years from now." Gut ist eine Relation zu Kontext und Zeitpunkt, keine Eigenschaft. |
| Salomon/Yosef | „I don't need 99% of the UI that is shown there because this UI doesn't know me. ... What if we could just take these UIs and just break them into atoms?" |
| Rallabandi | Vergessen ist eine eigene Funktion; ein Relevanz-Scorer, „which keeps scoring continually. The important word here being continually". |
| Wang | Erst vertikal tief, dann horizontal breit: „domain expertise is something that informs how high quality your data can be" und „lessons learned that going really vertical on a single domain like infrastructure do translate into other horizontal domains." |
| Davis | „Task list has gone away. Good. Wasn't particularly useful anyway, especially at large scale." |

**Was daraus folgt.** Die 1.099 im Standardzugriff sind das Produkt, nicht die 25.642 —
und sie sollten eher schrumpfen als wachsen. Ein weiteres Repo erhöht erst einmal die
Menge, nicht die Qualität; das 14. (`anthropics__claude-plugins-official`, offiziell,
aufgenommen 2026-08-08 auf Zuruf des Besitzers, +143 Bausteine) kam deshalb über die
Aufnahmekriterien in `sources.txt`, nicht über Zuwachslogik. Zur Grössenordnung:
24.161 der 25.642 Bausteine stammen aus einem
einzigen en bloc gespiegelten Mega-Repo, das für 12 der 13 Domänen nie gebraucht
wird. Die Regel gehört explizit in `knowledge/01`: **aufgenommen wird ein Repo,
ausgeliefert werden einzelne Bausteine**; ein Repo, aus dem über mehrere Projekte
hinweg nie ein einzelner Baustein installiert wurde, gehört aus `sources.txt`
entfernt oder hinter die Standardsicht.

Was fehlt, ist die Gegenrichtung. `update` kennt nur Zugänge. Konkret: pro Eintrag
ein Datum der letzten Quell-Änderung und ein Zähler „zuletzt in einem Setup
installiert"; Bausteine ohne Quell-Änderung und ohne Nutzung über einen Zeitraum
wandern aus dem Standardzugriff in den Langzeitbereich, statt gelöscht zu werden.
`harness-update` berichtet dann beides: Zugänge und Abgänge. Zusätzlich meldet es,
was unter bestehenden IDs geändert wurde oder verschwunden ist — sonst installiert
`harness-build` weiter gegen ein Bild, das es nicht mehr gibt.

Zwei Nebenbefunde, die hierher gehören:

- **Generik-Bias.** Bei 25.642 Einträgen liefert jede Textsuche zuverlässig die
  generischsten Bausteine; der eng passende Nischen-Baustein liegt am Rand der
  Verteilung. Das ist messbar: dieselbe Suchroutine über mehrere sehr verschiedene
  Projektprofile fahren und die Überlappung der Top-Treffer zählen. Gegenmittel im
  Rahmen unserer Mittel: pro Teilbedarf eng formulierte Suchen mit `--type` und
  `--domain` statt einer breiten Top-N-Liste, und im Vorschlag mindestens ein
  nicht-offensichtlicher Kandidat mit Begründung.
- **Wangs Reihenfolge ist die Antwort auf „Qualität statt Vollständigkeit".** Ein
  Rezept an einem echten Projekt wirklich durchspielen bringt mehr als der nächste
  Breiten-Sync — die dabei gefundene Form (Bars, Verifikationspfad, Manifest)
  überträgt sich auf die anderen fünf.

---

## 2. Widersprüche

Wo die Praktiker uneins sind, ist die Frage offen. Jeder Abschnitt nennt die
Positionen und danach unsere begründete Position — die eine Entscheidung ist, kein
Befund.

### 2.1 Mehr hochwertiges Material ist immer besser — oder gerade nicht

**Positionen.** Wang: „model capability has never regressed whenever you introduce
more high-quality data"; sein ganzer Ansatz ist, der Umgebung mehr Unordnung, mehr
Kontext, mehr Quellen hinzuzufügen. Branco und Salomon/Yosef sagen das Gegenteil:
wenig, sehr sorgfältig Kuratiertes schlägt viel Unsauberes, und 99 Prozent einer
fremden Oberfläche sind totes Gewicht. Rallabandi verlangt sogar aktives Vergessen.

**Unsere Position.** Wangs Satz gilt für **Trainingsdaten**, nicht für
**Laufzeitkontext** — der Unterschied ist bei uns entscheidend und wird sonst
stillschweigend übersprungen. Für den Katalog auf der Platte hat Wang recht:
25.642 Einträge schaden niemandem, solange sie hinter dem CLI liegen. Für alles,
was im Kontextfenster landet, hat Branco recht: jeder zusätzlich sichtbare Baustein
verschiebt das Routing aller anderen, weil Descriptions um dieselben Auslöser
konkurrieren. **Platte darf wachsen, Standardzugriff nicht** — die 1.099 bekommen
Aufnahmekriterien und einen Abgangsmechanismus, der Rest bleibt durchsuchbar, aber
unempfohlen.

### 2.2 Deterministisch zusammenfassen oder Modellurteil fällen lassen

**Positionen.** Kumar verrechnete zwei Agenten-Urteile per Metrik — der scheinbar
sichere, auditierbare Weg — und bekam „many false positive cases"; seine Lösung war
mehr Agent, ein dritter als Richter. Garg sagt, deterministische Verifier seien
nicht tot und liefen im Tandem mit dem Judge. Wang will maschinell prüfbare Bars
ohne Menschen. Branco hält menschliches Urteil für deutlich höherwertig als jeden
LLM-Judge.

**Unsere Position.** Der Widerspruch löst sich an der **Frageart** auf, nicht am
Werkzeug.

| Frageart | Entscheidung | Beispiele |
|---|---|---|
| Formal und ressourcenbezogen | hartes Gate mit Exit-Code | Existiert die ID? Parst das Frontmatter? Kollidieren zwei Namen? Kontextbudget überschritten? Hook registriert? |
| Passung eines Bausteins zu einem Projekt | begründetes Urteil auf einem deterministisch erzeugten Artefakt | Zahlen, Kollisionsliste, Budget als Grundlage; kein Schwellenwert |

Kumars Fehler war, die Passungsfrage in eine Schwelle zu giessen. In beiden Fällen
gilt Gargs Trennung: Bau und Prüfung dürfen nicht derselbe Agent sein, der Prüfer
bekommt denselben CLI-Zugang, aber nur lesend.

### 2.3 Fremden Input filtern oder alles lesen lassen

**Positionen.** Salomon/Yosef isolieren fremden ausführbaren Code in einer
iframe-Sandbox und lassen jede Aktion über den Host laufen. Rallabandi hält genau
den Eingangsfilter für falsch — „we let the agent read everything", weil ein
Eingangsfilter „is going to gate everything" — und setzt den deterministischen Guard
ausschliesslich an die Handlungsfläche. Wang wiederum sagt, der saubere Sandkasten
sei nicht die Lösung, sondern die Obergrenze der Fähigkeit.

**Unsere Position.** Die drei reden über verschiedene Objekte, und die Trennung ist
brauchbar. **Fremder ausführbarer Code** (unsere 56 Hooks, Plugin-Skripte) wird
isoliert und einzeln freigegeben — dort hat Salomon/Yosef recht, und wir haben dafür
heute gar nichts. **Fremder Text** (Descriptions, SKILL.md-Rumpf) wird nicht
inhaltlich gefiltert, weil das nachweislich an trivialer Verschleierung scheitert
und alles ausbremst — dort hat Rallabandi recht, und die Absicherung sitzt an der
Stelle, an der der Agent tatsächlich etwas tut (`permissions` allow/ask/deny,
PreToolUse). Wangs Punkt bleibt als Warnung stehen, betrifft aber
Trainingsumgebungen: wir kaufen mit Isolation keine Fähigkeit weg, wir kopieren
Dateien.

### 2.4 Harte Vorgaben erzwingen oder den Lösungsraum offen halten

**Positionen.** Chan und Wang wollen Maschinen, die sich weigern: Zahlen müssen
automatisch zusammenpassen, Bars entscheiden über bestanden/durchgefallen; Kumar
will den Tier-1-Regelweg zuerst und Agenten-Urteil nur für die Grauzone. Garg warnt
genau davor: „if we kind of enforce this too tightly, we collapse the state space of
how many actual paths the agent actually explores", und der Abgleich gegen eine
Musterlösung versagt bei offenen Aufgaben.

**Unsere Position.** **Rigide bei Ressourcen, Form und Sicherheit — offen beim
Lösungsweg.** Die Zugriffsregel aufs CLI, das Kontextbudget, die Frontmatter-Pflicht
und das Hook-Gate bleiben hart und sollen es sein; sie schützen ein Kostenlimit und
eine Angriffsfläche, keinen Lösungsraum. Die sechs Rezepte dagegen dürfen keine
Soll-Listen bleiben, gegen die ein Bau-Agent auf Übereinstimmung prüft, sonst wird
aus Auswahl ein Abgleich. Sie werden als **Abdeckungskriterien** formuliert („das
Setup muss Testausführung, Migrationssicherheit und Review abdecken") mit
beispielhaften IDs. Kumars Tier-1-Logik bleibt trotzdem gültig: passt eine Anfrage
sauber auf ein Rezept, wird es angewendet und nicht neu erwogen.

### 2.5 Widerspruch melden oder Widerspruch entscheiden

**Positionen.** Chan: „Your job as a builder isn't resolve the argument. It's to make
sure that the argument happens in front of a human." Branco: bei Uneinigkeit zuerst
den Typ bestimmen — Uneinigkeit über Objektives heisst, eine Quelle ist schlicht
falsch, und das ist kein Fund, sondern ein Fehler.

**Unsere Position.** Branco präzisiert Chan, sie widerspricht ihm nur scheinbar —
aber die Präzisierung ist die eigentliche Arbeitsanweisung. Widerspruch über
**Überprüfbares** (Hook-Event-Namen, Frontmatter-Felder, Pfade, eine ID, die es
nicht mehr gibt) wird nicht vorgelegt, sondern markiert und korrigiert; das ist
Aufgabe von `verify`. Widerspruch über **Stil und Zuschnitt** (Skill-Granularität,
Subagent oder Command, vier gleichwertige code-review-Bausteine) wird nie
stillschweigend aufgelöst, sondern dem Besitzer als Gruppe vorgelegt und, wenn er
entscheidet, als dokumentierte Wahl in die Doktrin geschrieben.

### 2.6 Beweglichen Standards folgen oder sich von ihnen fernhalten

**Positionen.** Salomon/Yosef: „We built this talk yesterday, so it might be out of
date" — die Gegenmassnahme ist ziehen statt beschreiben, „all changes to the spec are
immediately reflected in the SDK". Davis antwortet auf ihre eigene Titelfrage, warum
niemand MCP Tasks implementiert: „because they're smart" — sieben Monate später
strich V2 `tasks/list` ersatzlos und drehte das Protokoll von stateful auf
stateless; wer früh gebaut hat, hat umsonst gebaut.

**Unsere Position.** Kein echter Gegensatz, sondern zwei Ebenen mit verschiedenen
Kosten. Was billig zu ziehen ist, wird gezogen — der Katalog macht das mit
`sync`/`update` bereits. Was teuer zu bauen ist, wartet auf Stabilität: nichts,
dessen Grundlage als experimentell gilt, wird in einem Rezept zur Pflicht. Der teure
Mittelweg ist unsere Wissensbank, die bewegliche Fremdvorgaben von Hand beschreibt
und deshalb sofort driftet — belegt an `knowledge/04`, das die Suche als
ODER-Semantik beschreibt, obwohl der Code seit dem Umbau UND macht. Konsequenz:
Reifegrad-Feld im Katalog, Datum und Quell-URL in jedem Wissenskapitel, und **keine
Zahl in einem Kapitel, die `stats` besser liefert**.

---

## 3. Was uns nicht betrifft

Dieser Abschnitt existiert, damit niemand dieselben neun Vorträge erneut auf
Anwendbarkeit prüft. Was hier steht, ist geprüft und verworfen.

| Themenblock | Aus welchen Vorträgen | Warum nicht anwendbar |
|---|---|---|
| Modelltraining insgesamt: Post-Training-Pipelines, RL-Mechanik, Gewichtsupdates, GRPO, Self-Distillation, LoRA-Adapter, RoBERTa-Klassifikator, Belohnungsdichte und Learnability | Feng, Wang, Garg, Branco, Rallabandi | Wir trainieren nichts, vergeben keine Belohnung und haben keine Gewichte. Von diesem Strang bleibt nur, was deterministische Regeln nicht leisten. |
| RL-Environments und Trainingsdaten als Geschäft: Data-Lab-Modell, Expertennetzwerke, Präferenzdatensätze, erzwungene Verteilung über tausend Annotatoren, Präferenzvektor pro Person | Branco, Wang | Ein Nutzer, keine Population, keine Annotatoren. Der Präferenzvektor löst ein Problem (widersprüchliche Urteile vieler Annotatoren), das hier nicht existiert. |
| Verteilte Laufzeit-Architektur: Cosmos DB, CDC/Change Feed, Message Broker, Saga-Orchestrierung, Serverless-Betrieb, 500-ms-SLA, Multi-Node-Sandboxen, Sim-to-Real-Gap, MVCC-Korruption, Clock Skew, Netzwerkpartitionen | Kumar, Wang, Davis | Build-Time-Bibliothek. `sync` und `extract` sind synchrone Node-Funktionen ohne Gegenstelle. Wiederanlauf heisst hier: `node tools/harness.mjs update` erneut — der Vorgang ist idempotent. |
| Durable Execution: Temporal-Workflows, Signale, programmierte Retries, Wiederanlauf nach Prozesstod, FastMCP-Implementierung | Davis | Wir führen keine langlaufenden verteilten Abläufe aus. Eine Workflow-Engine wäre Aufwand ohne Gegenwert; übernommen wird nur der billige Teil (Kennungen und Zeitstempel persistieren). |
| Rendering- und Oberflächen-Ebene: React-/Web-Component, iframe-Sandbox, Callback-Protokoll, declarative bis fully generative UI, Farben als Kennzeichnung, Citation-Tabs, Browser-Tabs, Markenidentität | Salomon/Yosef, Chan | Wir haben ein CLI und Markdown. Die Ideen müssen in Textmarker, ID-Präfixe und Exit-Codes übersetzt werden; die visuelle Umsetzung ist nicht übertragbar. |
| Portabilität und Verteilung: „write once, run anywhere" über mehrere Hosts, Adoptionslisten, 800 Millionen Wochennutzer, „170 times the total addressable market" | Salomon/Yosef | Ein Host (Claude Code), ein Nutzer, kein Marktplatz. Die Zahlen sind zusätzlich mit „someone said" eingeleitet und nicht hergeleitet — sie gehören bewusst nicht in unsere Doktrin. |
| Gruppen- und Wearable-Prämisse: mehrere Nutzer in einem Chat, Mandantentrennung, Brille, Auto-Medienanlage, proaktives Ansprechen, „wann darf ich sprechen" | Rallabandi | Ein Besitzer, keine Laufzeit, in der Informationen an Dritte geroutet werden. Übrig bleibt die Analogie zum Skill-Routing (breite Description = „over articulative"). |
| Benchmark-Betrieb: METR-Zeithorizonte, GDPval, ToolBench, APEX Agents, Rubrik-QA-Suite mit Expert Agreement, dynamische Teilpunkte | Garg | Wir messen keine Modellfähigkeit und veröffentlichen keine Benchmark-Zahl. Als Warnung bleibt: keine geliehenen Horizont-Zahlen als Qualitätsbeleg zitieren — sie sind laut Sprecher schon zwischen Messteams nicht vergleichbar. |
| Fachdomänen: geprüfte Abschlüsse, Investment Committees, KYC, Chargebacks, Device-Fingerprints, Brand/Typografie/Motion, Purchase Order und ERP-Freigabe | Chan, Kumar, Branco, Davis | Beispiel, nicht Methode. Übertragbar sind Quellenhierarchie und Zerlegungsprinzip, nicht die Domäne. |
| Haftung und Regulierung: Tribunal, Kundenschaden, Audit-Trail als Rechtsinstrument | Chan | Ein Besitzer, kein Kunde, kein Gegner im Raum. Das Protokoll übernehmen wir als Diagnosewerkzeug, nicht als Haftungsnachweis. |

**Themen, zu denen einzelne Vorträge nichts sagen** — hier nichts ableiten:

- **Kontext-Ökonomie im Sinne von Token-Budget:** Chan, Branco, Feng und Davis
  äussern sich dazu nicht. Fengs „inside/outside the training stack" ist eine
  Grenzziehung um eine teure kontrollierte Zone; die Übertragung aufs Kontextfenster
  ist unsere Analogie, nicht seine Aussage. Dasselbe gilt für Davis' Kritik am
  ungefilterten Listing: bei ihr geht es um Serverlast, bei uns um Kontextbudget.
- **Zustandshaltung zwischen Sitzungen:** kommt bei Branco und Feng nicht vor.
- **Setup und Werkzeugketten im technischen Sinn:** Branco handelt von Bewertungs-
  und Datendesign. Wer daraus Empfehlungen zu Hooks, MCP-Ketten oder
  Session-Persistenz ableitet, erfindet sie.

**Zur Belastbarkeit der Belege insgesamt.** Chans interne Anekdoten sind
anonymisiert und nicht überprüfbar; seine vier öffentlichen Vorfälle sind
nachprüfbar, aber ohne Quellenangabe. Kumars Vortrag enthält fast keine
Ergebniszahlen — die Demo lief auf synthetischen Daten und brach live ab; alles
darin ist Architektur-Argument, nicht Messergebnis. Gargs Vortrag ist ein
Firmenvortrag mit Akquise-Absicht und legt keine reproduzierbaren Methoden offen.
Rallabandis KV-Cache-Aussage ist die einzige in seinem Vortrag, die er ohne Beispiel
oder Paper stehen lässt — sie gehört als Faustregel gekennzeichnet, nicht als
belegte Zahl. Mehrere Transkripte sind fehlerhaft automatisch erzeugt („Model one"
statt vermutlich „failure mode one", „Thata Software", „cloud models" für
Claude-Modelle).

---

## 4. Die überraschenden Aussagen

Neun Sprecher, neun Stellen, an denen der Vortrag der gängigen Annahme widerspricht.

| Sprecher | Die Aussage | Warum sie überrascht |
|---|---|---|
| Chan | „A contradiction is not a bug, a contradiction is a gift." Und: „Your job as a builder isn't resolve the argument. It's to make sure that the argument happens in front of a human." | Die gängige Annahme ist, dass ein gutes System eine kohärente, glatte Antwort liefert. Er dreht sie um: Ein System, das Konflikte auflöst statt sie zu melden, zerstört Information — unbemerkt, weil das Ergebnis besser liest als vorher. Er kündigt diesen Punkt selbst als den an, der Leute überrascht. |
| Wang | „there is a critical mass at which sandboxing on a single node can only get you so far" — und veraltete Dokumentation wird absichtlich in die Umgebung eingebaut. | Die Annahme lautet: sauberer, deterministischer Container = reproduzierbar und sicher. Er sagt, genau dieser Container deckelt die Fähigkeit. Zweiter Teil: die Fähigkeit, mit widersprüchlichem und altem Kontext zu entscheiden, ist das Lernziel, nicht ein Mangel, den man vorher wegräumt. |
| Branco | „we treat the fact that code is verifiable and measurable as something that is a property about models ... realistically it's actually a fact about code. Code is something that decomposes, it verifies, it executes." | Modelle sind nicht gut im Programmieren, weil sie klug sind, sondern weil Code zerfällt. Das dreht die Reihenfolge jeder Verbesserung um: wer bessere Ergebnisse will, tauscht nicht zuerst Modell oder Bausteinauswahl aus, sondern macht die Aufgabe zerlegbar und prüfbar. |
| Feng | Rund 10 Prozent fehlschlagende Tool-Calls durch Netzwerkprobleme führten zu immer kürzeren Antworten — „in our reward function, we actually didn't have any length penalty." | Widerspricht der Annahme, schlechtes Agentenverhalten sei ein Spezifikationsproblem, das man mit besseren Anweisungen behebt. Hier war es reine Infrastruktur-Unzuverlässigkeit, und Fengs Team konnte sich das Verhalten zunächst nicht erklären. |
| Kumar | Nicht der Agent war die Fehlerquelle, sondern die deterministische Zusammenfassung seiner Ausgabe: „it is again going back to the same criteria like where we had this rule-based mechanism." Seine Lösung war mehr Agent, nicht weniger. | Widerspricht der Annahme, man solle nichtdeterministische Ergebnisse am Ende immer in eine harte Schwelle giessen. Der scheinbar sichere, auditierbare Weg erzeugte „many false positive cases". |
| Salomon/Yosef | „It's factually correct, but it's useless." Und: „text is really the worst way to convey a lot of information" — genau das sei „the main blocker from companies to build an MCP server. They don't want to be reduced to a textual database." | Nicht Korrektheit ist die Qualitätsschwelle, sondern Verwertbarkeit. Und der Engpass beim Bau von MCP-Servern ist demnach nicht Funktion, Sicherheit oder Protokoll, sondern die Darstellungsform. |
| Davis | Auf die eigene Titelfrage „Warum unterstützt kein Agent MCP Tasks?": „well, cuz they're smart." | Nichtadoption eines veröffentlichten Standards ist hier das Qualitätssignal, nicht der Rückstand — und die Zeit gab ihr recht. Dazu der zweite Satz gegen die Intuition: für langlaufende Arbeit fühlt sich eine lang offene Verbindung wie die naheliegende Lösung an, und genau die war der Fehler. |
| Garg | „judges are agents too" — der Prüfer braucht mehr Infrastruktur als der Ausführende, denselben Werkzeugzugang (nur lesend), und der Verlauf muss vorher in eine abfragbare, in Phasen zerlegte Form gebracht werden. | Widerspricht der Annahme, LLM-as-a-Judge sei ein billiger Zusatzschritt am Ende. Dicht daneben eine zweite Gegenintuition: eine dichtere, detailliertere Rubrik macht die Bewertung nicht besser, sondern inkonsistent. |
| Rallabandi | Zwei Skills mit makellosem Static Scan werden gemeinsam bösartig, „around 90% of the attacks have this" — und der Eingang ist der falsche Ort zum Filtern: „we let the agent read everything", weil ein Eingangsfilter „is going to gate everything". | Dreht beide üblichen Annahmen um: Bausteine sind nicht einzeln prüfbar, und gefiltert wird nicht am Eingang, sondern ausschliesslich an der Handlungsfläche. |

---

## 5. Quellen

Alle neun Vorträge, abgerufen und ausgewertet am **2026-08-07**. Transkripte
automatisch erzeugt; Zitate an verstümmelten Stellen in eckigen Klammern ergänzt.

| # | Titel | Sprecher | Datum laut Quelle |
|---|---|---|---|
| 1 | Build for the Memo, Not the Demo | Shawn Chan, China Resources Holdings | 2026-07-30 |
| 2 | Emulated: The Data for Fully Autonomous Software Engineers and Companies | Joseph Wang (mit Co-Founder Sid), Emulated | veröffentlicht 2026-07-31 |
| 3 | Ending AI Slop | Thais Castello Branco, Taste Labs | 2026-07-31 |
| 4 | Learning on the Job: The Future of Post-Training | Raymond Feng, Applied Compute | AI Engineer Conference 2026 |
| 5 | Let's integrate AI Agents in Event-Sourced Systems | Divakar Kumar, FlyersSoft | 2026-07-30 |
| 6 | MCP Apps: Extending the Frontier | Ido Salomon & Liad Yosef, MCP Steering Committee | veröffentlicht 2026-08-03 |
| 7 | MCP Tasks (async): Why Aren't Any Agents Supporting Them? | Cornelia Davis, Temporal | AI Engineer Conference 2026 |
| 8 | Rethinking Environments for Long-Horizon Work | Rayan Garg, Theta Software | AI Engineer Conference 2026 |
| 9 | Wearing the Agent: From Group Chats to Glasses | Sai Krishna Rallabandi | AI Engineer Conference 2026 |

**Verwandte Kapitel dieser Wissensbank.** `01-harness-doktrin.md` (Abschnitte 1.1,
1.6, 1.7 liefern externe Belege), `02-bausteine.md` (Abschnitt 1.6 zur Typ-Wahl bei
Sicherheit; die Kategorie MCP Apps fehlt dort bislang), `03-vorbilder.md`
(Abschnitt 1.2 benennt das Muster „Einstiegspunkt im Kontext, Zustand auf der
Platte"), `04-governance.md` (Abschnitte 1.3 und 1.5 zu Descriptions als
Routing-Signale und zum Umgang mit Widersprüchen).
