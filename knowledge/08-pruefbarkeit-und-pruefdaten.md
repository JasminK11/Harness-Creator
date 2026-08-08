---
type: Erkenntnisse
title: Prüfbarkeit als Grenze — und woher Prüffälle kommen
description: "Fünf Vorträge über Forward Deployed Engineering und simulationsbasiertes Prüfen, zusammengeführt auf eine Frage: Was sich nicht maschinell prüfen lässt, wird nicht automatisiert — und wenn keine echten Daten vorliegen, entscheidet die Herkunft der Prüffälle über ihren Wert."
status: stable
sources:
  - id: moza-pruitt-varick
    title: "AI tools for Forward Deployed Engineering"
    author: Vasuman Moza (CEO) & JD Pruitt (Head of Engineering), Varick Agents
    resource: "Konferenzvortrag AI Engineer, veröffentlicht 2026-07-28, https://www.youtube.com/watch?v=l0FLhNqBOic"
    retrieved: 2026-08-07
  - id: wu-cognition
    title: "How Forward Deployed Engineering is done at Cognition"
    author: Jia Rong Wu (Deployed Engineering Lead), Cognition (Devin)
    resource: "Konferenzvortrag AI Engineer, veröffentlicht 2026-07-28, https://www.youtube.com/watch?v=RVxym6mmIns"
    retrieved: 2026-08-07
  - id: reyes-factory
    title: "How Forward Deployed Engineering is done at Factory"
    author: Eno Reyes (Co-Founder und CTO), Factory (Droid)
    resource: "Konferenzvortrag AI Engineer, veröffentlicht 2026-07-29, https://www.youtube.com/watch?v=wpOA-UXynoM"
    retrieved: 2026-08-07
  - id: anand-personas
    title: "Persona Engineering: A Field Guide to AI Synthetic Personas"
    author: Ishan Anand (Chief AI Officer), Insight Sciences
    resource: "Konferenzvortrag AI Engineer, veröffentlicht 2026-07-29, https://www.youtube.com/watch?v=YnNF55QV0zs"
    retrieved: 2026-08-07
  - id: gupta-rajpal-simulation
    title: "SimulationMaxxing: How we ship agents 20x faster"
    author: Aman Gupta (Principal ML Engineer, Nubank) & Shreya Rajpal (CEO, Snowglobe)
    resource: "Konferenzvortrag AI Engineer, veröffentlicht 2026-07-29, https://www.youtube.com/watch?v=KMR_RBoCa4M"
    retrieved: 2026-08-07
  - id: claude-automation-recommender
    title: "claude-automation-recommender — SKILL.md des offiziellen Setup-Plugins claude-code-setup (Beleg nur in Abschnitt 1)"
    author: Anthropic (Plugin-Verzeichnis anthropics/claude-plugins-official)
    resource: "Katalog-Baustein anthropics__claude-plugins-official/skill/claude-automation-recommender, per node tools/harness.mjs show verifiziert"
    retrieved: 2026-08-08
generated: { by: claude-opus-5, at: 2026-08-07T00:00:00Z }
stale_after: 2027-02-07
tags: [pruefbarkeit, validator, evals, pruefdaten, forward-deployed, autonomie, messung, herkunft]
---

# 08 — Prüfbarkeit als Grenze, und woher Prüffälle kommen

> **Abstract.** Fünf Praktiker beschreiben dieselbe Grenze aus fünf Richtungen: Ein Agent wird genau so weit autonom, wie sich sein Ergebnis maschinell prüfen lässt — nicht so weit, wie das Modell kann. Daraus folgen zwei Dinge, die diese Bibliothek betreffen: Bevor ein Harness zusammengestellt wird, gehört die Prüfdichte des Zielprojekts erhoben; und ein Eval ist nur so viel wert wie die Herkunft seiner Fälle.
> Für wen: wer an `harness-build`, an `evals/routing.jsonl` oder an der Eval-Spezifikation in `knowledge/04` Abschnitt 4 arbeitet, und wer begründen muss, warum eine Messung bewusst nichts über Qualität sagt.
> Wann lesen: vor jedem Eingriff am Eval, vor jeder Erweiterung von `harness-build/SKILL.md`, und bevor jemand vorschlägt, aus einer Trefferquote eine Qualitätsaussage zu machen.

**Abgrenzung zu den Nachbarkapiteln.** `knowledge/05` wertet neun andere Vorträge aus und bleibt inhaltlich unberührt. `knowledge/04` Abschnitt 4 hält die Eval-**Spezifikation** dieser Bibliothek (Stufen, Dateiformat, Drift-Tabelle), `knowledge/06` M7 die **Maßnahme**. Dieses Kapitel liefert die Befunde und ihre Belege — es vergibt keine M-Nummern und ersetzt keine Spezifikation.

Alle Zitate aus den fünf Vorträgen stammen aus automatisch erzeugten Transkripten und bleiben englisch; die Zitate in Abschnitt 1 aus der SKILL.md des offiziellen Setup-Plugins sind wörtlich aus der Datei übernommen. Namen und Zahlen sind nur übernommen, wo der Sprecher sie selbst nennt; Einordnungen aus dieser Bibliothek sind als solche gekennzeichnet.

---

## 1. Agent-Readiness — die Dichte deterministischer Prüfschleifen im Zielprojekt

**These.** „Agent readiness" ist eine Messgrösse über die **Codebasis**, nicht über den Agenten: die Zahl der Prüfschleifen, die ohne Menschen ein Ja/Nein liefern.

**Beleg.** Eno Reyes (Factory, 12:10): „What agent readiness really is is it's a measure of how many of these deterministic validation loops are present inside of your code base." Er zählt Linter, Typechecker, Security-Scans und End-to-End-Tests dazu — „it's like check mark. Like, it passes or it doesn't" — und schreibt die Folge dem Umfeld zu, nicht dem Modell (15:33): „if your code base isn't agent ready, you won't see any of the success."

**Was uns das betrifft.** `harness-build/SKILL.md` erhob in Schritt 1 zunächst Projekttyp, Stack, Reifegrad und Schmerzpunkt, aber nicht die Prüfdichte — obwohl derselbe Schritt `package.json`, `pyproject.toml`, `go.mod` und die CI-Konfiguration ohnehin liest. Die Rezepte setzen sie stillschweigend voraus: `recipes/01` empfiehlt Bausteine, deren Nutzen an einem laufenden Typecheck hängt, `recipes/02` schreibt die Annahme sogar hin („Für ein Backend gibt es fast immer einen automatischen Check"). Als Maßnahme notiert in `knowledge/06` M13 und dort inzwischen als erledigt geführt: Schritt 1b („Welche Prüfschleifen liefern heute ein Ja/Nein?") erhebt die Schleifen seither vor der Suche, mit Befehl statt Absicht.

**Zwei Präzisierungen, ohne die die Frage falsch beantwortet wird.**

- **Vorhanden ist nicht gleich läuft.** Aus `package.json` liest man Skripte, keine Ergebnisse. Ein `"test": "echo no tests"` und eine rote CI sind keine Prüfschleifen. Gefragt ist der **Befehl**, und ob er heute grün durchläuft.
- **Ein Hook stellt keine Schleife her, er führt eine vorhandene aus.** `affaan-m__ecc/hook/post-edit-typecheck` sucht laut eigenem Quelltext die nächste `tsconfig.json` und ruft `tsc --noEmit` — ohne konfigurierten Typechecker ist er ein No-op und damit exakt der Fehler „kopierter Hook, der nie läuft" aus `knowledge/02` Abschnitt 7. Bei null Schleifen ist der erste Baustein deshalb der, der einen **Massstab herstellt**: bei bestehender Codebasis ohne Tests ein Agent, der Invarianten aus dem Code zieht (`affaan-m__ecc/agent/spec-miner`, so bereits in `recipes/06` begründet), bei jungem Projekt ein TDD-erzwingender Command. Der Hook kommt danach.

**Extern belegter Fall: das offizielle Setup-Plugin misst Datei-Existenz, keine laufende Prüfschleife.** Das offizielle Empfehlungswerkzeug `anthropics__claude-plugins-official/skill/claude-automation-recommender` (aus dem Plugin `claude-code-setup`; der Aufnahmevermerk des Repos vom 2026-08-08, sichtbar in `show`, führt es mit 179K Installs als „das Mainstream-Gegenstück zu /harness-build") beantwortet die Readiness-Frage genau so, wie die erste Präzisierung es verbietet: Phase 1 seiner SKILL.md besteht vollständig aus `ls`-, `cat`- und `grep`-Kommandos auf Konfigurationsdateien — „# Detect project type and tools / ls -la package.json pyproject.toml Cargo.toml go.mod pom.xml 2>/dev/null" — und keine Phase des Ablaufs führt einen Test oder Linter aus. Für die Empfehlung eines Test-Hooks genügt die Signalzeile „Tests directory exists | PostToolUse: run related tests"; ob die Suite grün ist oder das `test`-Script ein `echo no tests` ist, prüft nichts. Das meistinstallierte offizielle Setup-Werkzeug bestimmt Readiness also über **Vorhandensein**, nicht über „läuft und ist grün" — ein Beleg von außen für genau die Lücke, die dieses Kapitel begründet. `harness-build` Schritt 1b ist an dieser Stelle strenger als das offizielle Werkzeug („Notiere den Befehl, nicht die Absicht", „unterscheide ‚vorhanden' von ‚läuft und ist grün'") und bleibt unverändert. **Geltungsbereich:** ein dokumentierter Einzelfall, keine Vermessung des Feldes; und er betrifft die Signal-Logik der Empfehlung, nicht deren Inhalte — dieselbe SKILL.md koppelt jeden empfohlenen `PostToolUse`-Hook korrekt an ein bereits konfiguriertes Werkzeug; dieser Kopplungs-Befund steht mit demselben Baustein als Zweitbeleg in `knowledge/02` Abschnitt 2.4.

**Grenze des Belegs.** Reyes ist Anbieter eines Agentenprodukts und nennt keine Messung; die Zahl im selben Absatz („maybe 30 to 40% of the low-hanging fruit") ist mit „maybe" gehedgt. Belastbar ist die Frage, nicht die Quote.

---

## 2. Prüfbarkeit deckelt die Autonomie — wo kein Validator baubar ist, endet sie

**These.** Die Ausgabequalität langlaufender Agenten hängt an der Prüfbarkeit der Arbeit, nicht an der Schwierigkeit der Aufgabe. Wo sich kein Validator bauen lässt, bleibt die Schleife offen — dauerhaft, weil das eine Ingenieuraufgabe ist und kein Formulierungsproblem.

**Belege.** Reyes (13:00): „the quality of the output of these very long-running harnesses of advanced agents is directly proportional to the degree to which you can validate their work." Und als Ratschlag an Kunden (15:33): „Less so solving the problem, more so preparing the environment for verification of the problem."

Die Gegenprobe liefert er am eigenen Haus (19:01): „our like core harness, uh we do not yet have validators that can validate some of the hard visual problems of a like terminal based harness. Things like flickering are really hard to catch in a verifiable way. So, we're unable to close the loop on some of those challenges. It's an engineering task to build the system that can verify some of those very hard problems." Dazu die Reihenfolge, in der Autonomie tatsächlich ankommt (18:36): „it is not obvious like who gets 100% autonomy first. I would argue it's probably very contained internal tools. Like we have something we call like legal droid, which is our legal workflow. That is effectively 100% autonomously maintained."

**Was daraus folgt — und was ausdrücklich nicht.** Das entscheidende Kriterium ist die **Prüfbarkeit**, nicht die Enge des Wirkungsbereichs. Enge macht eine Prüfinstanz meist billig, sie ist aber nicht die Ursache. Für die Einführungsreihenfolge unserer Rezepte folgt daraus nichts Neues: alle sechs beginnen bereits mit dem Verifikations-, Mess- oder lesenden Weg, zwei davon bewusst mit dem **weitesten** Wirkungsbereich zuerst (`recipes/02` mit contract-first, weil ein falscher Vertrag in fremde Repos kaskadiert; `recipes/04` mit der Umfangs- und Erlaubnisfestlegung). Eine Regel „engster Wirkungsbereich zuerst" wäre gegen den dokumentierten Bestand gerichtet und wird nicht übernommen.

**Was uns das betrifft.** Vollautomatisierbar ist bei uns genau das, wofür eine Prüfinstanz mit Exit-Code existiert — heute `lint` und `eval`. Für die Frage „ist die vorgelegte Auswahl gut?" existiert kein Validator; das ist der sachliche Grund, aus dem `eval` in seiner eigenen Ausgabe sagt „nicht, ob ein Baustein gut ist" (`tools/harness.mjs:2033`) und aus dem `harness-build/SKILL.md` vor jedem Kopiervorgang eine Bestätigung einholt. Das ist keine Bescheidenheit und keine Vorsicht, sondern ein fehlender Validator.

**Nicht übertragbar.** Reyes' eigene Begründung über dichte Belohnung im Post-Training (15:58) fällt unter den in `knowledge/05` Abschnitt 3 bereits verworfenen Trainingsstrang. Übrig bleibt die Praxisbeobachtung, nicht der Mechanismus. Ebenso ist sein Allsatz „if you can frame any problem as the set of verification systems that need to validate it, then you can solve that problem with AI today" (14:28) vom Sprecher selbst eingeschränkt — im vorangehenden Satz auf „problems where like is complete is verifiable", und vier Minuten später am eigenen Produkt widerlegt.

---

## 3. Die zwei getrennten Hälften — den richtigen Kontext finden und aus ihm gut schreiben

**These.** Eine schlechte Analyse hat zwei Ursachen, und sie werden getrennt behoben: falscher Inhalt kommt aus falsch aufgelöstem Kontext, Ausschweifung kommt aus fehlender Gewichtung von Detail. Ein vorgeschalteter Extraktionsschritt behebt nur die erste Hälfte.

**Belege.** JD Pruitt (Varick Agents) beschreibt den Ausgangszustand seiner Forward Deployed Engineers (12:29): „Well, we you know upload about 150 pages of documentation to Claude and then we prompt Claude and then we wait like 2 minutes and then we get analysis and then it's verbose and incorrect and it kind of sucks." Nach dem Extraktionsschritt bleibt die Hälfte bestehen (16:06): „given extracted context for the FTE, do we get a good high-quality output? And the answer is, with Claude, honestly, no, which is kind of surprising."

Die Ursache verortet er nicht in der Menge, sondern in einer fehlenden Fähigkeit (16:23/16:42): „frontier models are extremely verbose, and they lack … I only started believing in consultants once we started hiring them … they're so good at figuring out what is the part of the detail the client actually cares about, and what is the part that can get glossed over. And frontier models have absolutely no concept of this." Varick löst die beiden Hälften mit zwei verschiedenen Mitteln — die Falschheit über Traversierungs-Werkzeuge zur Entitätsauflösung in einer RL-Umgebung, die Ausführlichkeit über Post-Training eines eigenen Modells — und fasst zusammen (17:41): „that's how we solve the two problems. Writing good analysis from the context and extracting the correct context in the first place."

**Unsere Position.** Für die Falschheits-Hälfte bestätigt das, was ohnehin gilt: verdichtete Sicht vor dem Modellaufruf (`knowledge/07` B3 und C5, `knowledge/05` 2.1). Für die Ausführlichkeits-Hälfte ist Varicks Abhilfe hier nicht verfügbar — eigenes Post-Training setzt ein Trainingsvorhaben voraus, das eine Katalog-Bibliothek mit abhängigkeitsfreiem CLI nicht hat. Verwertbar ist deshalb ein **Negativbefund**: Wer nach einer Kontextkürzung immer noch ausufernde Ausgaben sieht, kürzt vergeblich weiter. Das ist kein Context-Rot-Symptom, und die Maßnahme aus `knowledge/01` 3.1 greift dort nicht.

**Die Zahlen bleiben draussen.** „150 Seiten" ist Hörensagen in direkter Rede und im Original mit „about" gehedgt; „2 Minuten" ist eine Latenz-, keine Korrektheitsangabe und gehört sachlich zu Pruitts separater Klage über Wartezeit (13:27). Beide als harte Werte zu übernehmen wäre die Falle „Die Vermutung im Faktenkostüm" aus `knowledge/07` Abschnitt 8.

**Was die Zweiteilung sonst noch ordnet.** Sie beschreibt genau die Achse, an der die zwei Eval-Stufen dieser Bibliothek liegen: Stufe 1 misst ausschliesslich die zweite Hälfte — ob die Suche für eine Absicht noch denselben Baustein liefert. Die erste Hälfte, ob die Begründung taugt, die `harness-build` zu Auswahl und Verwurf schreibt, ist bewusst nicht automatisiert, sondern liegt beim Menschen. Siehe `knowledge/04` Abschnitt 4.1.

---

## 4. Der Nutzennachweis läuft über Kennzahlen, die das Zielsystem ohnehin führt

**These.** Der Nutzen eines Agenten wird als Vorher-Nachher-Delta auf bereits geführten Kennzahlen gemessen, nicht auf eigens erfundenen — und der Nachher-Wert gilt erst bei voller Aktivierung.

**Belege.** Jia Wu (Cognition, 12:41): „If you look at every single metric that you measure before you bring in Devin and after you bring in Devin, you can take a look at that." Und zur Bedingung: „whenever we get deployed, and fully activated within the customer environment". Vorher nimmt er den Einwand gegen seine eigene Aktivitätszahl vorweg (12:35): „this actually just kind of looks like token maxing, right? … how do we know that these sessions are true, meaningful, and valuable?" — und beantwortet ihn nicht mit einer besseren Aktivitätszahl, sondern mit einer Ergebnisgrösse daneben.

**Wie das zu lesen ist.** Wu **verwirft** die Aktivitätszahl nicht. Er führt drei Beweispunkte nebeneinander, zwei davon sind Aktivitätsgrössen (erzeugte Engineering-Stunden, Zahl der PRs), die dritte ist eine Lieferzeit. Die richtige Fassung lautet deshalb: *Aktivität allein hält dem Einwand nicht stand, sie braucht eine Ergebnisgrösse daneben.* Und er erklärt die Nutzenmessung im selben Vortrag ausdrücklich für ungelöst: „how do you measure the return on investment? And it's very ambiguous. And it's an unsolved problem."

**Was uns das betrifft.** Der Mechanismus existiert hier bereits und ist stärker: Load-Bearing-Test (`knowledge/01` 7.1) und das Logbuch A2 (`knowledge/07` 2.2) messen laufweise mit konstant gehaltenen Variablen statt in einem einzigen Vorher/Nachher-Paar. Die einzige belegte Lücke war die **Herkunft der Messgrösse**; sie ist in A2 geschlossen — nimm eine Kennzahl, die das Projekt ohnehin führt.

**Ausdrücklich nicht.** Kein Messfeld im `harness-manifest.json`: die Dokumentebene wird bei jedem `install` neu geschrieben, der Wert wäre nach der nächsten Installation weg; und `install` läuft im Agentenbetrieb zwingend mit `--yes`, es gibt keinen Eingabepfad — der Agent schriebe die Zahl selbst, also Selbstbewertung.

**Zu Reyes' Variante derselben Forderung.** Er verlangt eine ROI-Geschichte „from the beginning" (9:10). Seine Zahl — „maybe 87% less likely to hit a bug" — steht in einer hypothetischen Konstruktion und ist mit „maybe" abgeschwächt; er kennzeichnet sie nicht als erfunden, belegt sie aber auch nicht. Übertragbar ist die Reihenfolge, nicht die Kennzahlenkette: seine Kette endet bei „core business goals" einer Enterprise-Organisation.

---

## 5. Die Obergrenze einer Trefferquote — und warum sie bei einer deterministischen Suche keine ist

**These.** Bevor man ein Ergebnis gegen eine Referenz misst, misst man, wie gut die Referenz mit sich selbst übereinstimmt. Dieser Rauschboden ist die beste Übereinstimmung, die irgendein Verfahren je erreichen kann.

**Beleg.** Ishan Anand (17:28/17:51): „they took those humans and they brought them back 2 weeks later and they redid the battery of surveys and personality tests and they found that the humans on average were only 80% consistent to themselves. … So that sets a noise floor as how accurate our models could ever get because the humans themselves are fundamentally noisy. And so the 83% is actually normalized against that." Als billige Ersatzform, wenn ein zweiter Durchgang zu teuer ist, nennt er wiederholtes Halbieren der Referenzmenge mit gemittelter Korrelation (18:03).

**Geltungsbedingung — ohne sie wandert die Regel an die falsche Stelle.** Ein Rauschboden entsteht nur, wo die Referenz **je Messung neu gezogen** wird: menschliche Rater, ein Modell als Richter. Wo die Referenz eine eingecheckte Datei ist und der Vergleich deterministisch läuft, ist ihre Selbstübereinstimmung per Konstruktion vollständig — dort ist eine Obergrenze eine Zahl, die nichts begrenzt.

**Was uns das betrifft.** Stufe 1 unseres Evals ist genau dieser Fall: `sucheIds` bewertet seit dem Suchfix vom 2026-08-08 über dieselbe Bewertungsfunktion `bewerteTreffer()` wie `cmdSearch` — Wortanfangs-Präfix-Matching per `termRegex()`, Stoppwortfilter über die Modul-Konstante `STOPPWOERTER`, deterministischer Tie-Break. Vorher waren `cmdSearch` und `sucheIds` zwei driftgefährdete Kopien derselben Logik; im Driftfall hätte das Eval eine andere Sortierung gemessen als die, die `search` tatsächlich liefert. Nachgemessen am 2026-08-08 mit drei Läufen von `node tools/harness.mjs eval`: der erste meldet die Rangänderungen aus dem Umbau gegen den gespeicherten Vorlauf, der zweite und dritte sind byte-identisch — die Referenz wird nicht je Messung neu gezogen. Dazu tragen 7 der 19 Fälle (gezählt am 2026-08-08) gar keine erwartete ID, sondern prüfen Trefferzahlen. Eine Obergrenze für Stufe 1 zu schätzen ist gegenstandslos. **Fällig wird die Frage erst mit Stufe 2**, wo die Referenz ein Modellurteil ist — dann, und erst dann, gehört die Selbstübereinstimmung des Urteils neben die Trefferquote ausgewiesen.

<!-- lint:historisch --> Die ursprüngliche Byte-Identitäts-Messung dieses Absatzes stammt vom 2026-08-07, als `sucheIds` noch ein reiner Substring-Scorer war. Der Altstand bleibt hier benannt, weil er zusammen mit der Nachmessung belegt, dass der Determinismus — der tragende Punkt dieses Abschnitts — nicht am Matching-Verfahren hängt: er hat den Umbau überlebt, 12 von 12 Pflichtfällen waren vorher wie nachher grün.

**Verhältnis zur bereits vorhandenen Regel.** `knowledge/05` 1.4 trägt Rallabandis **untere** Schranke („the naive approach here is basically at 50% which is a coin flip"). Anand liefert die **obere**. Die untere Schranke ist in unserer Umsetzung geprüft und verworfen worden, weil eine naive Baseline hier ein Spezialfall des Prüfgegenstands ist (`knowledge/06` M7); die obere kann nicht auf dieselbe Weise entarten, weil sie den Prüfgegenstand nicht nachbaut.

---

## 6. Fehlender Kontext wird nicht ausgelassen, sondern erfunden

**These.** Was im Prompt nicht festgeschrieben ist, wird vom Modell erfunden und damit selbst zur Zufallsvariable des Versuchs. Beim Menschenversuch versteckt man die Versuchskonstruktion, beim Modell muss man sie hineinschreiben.

**Belege.** Anand (6:36–7:10): „when an LLM is missing context, it has to potentially infer or invent confounders. … In a synthetic experiment, if you don't set it up properly, other parts of it actually become part of the random variable itself. I like to say if it's a poorly grounded persona, it's a little like the LLM is playing improv with you. It's like gold watch on a table? Oh, well, we must be in a jewelry store, right? It has to infer what's likely." Und die Umkehrung, die er selbst „bizarrely" nennt (7:16): „In a human subject experiment, you want to hide the study construction from the participant. But in the case of an LLM, they have no universe other than what's in the prompt."

**Wo die Grenze der Übertragung liegt.** Anands Prämisse „they have no universe other than what's in the prompt" gilt für eine werkzeuglose Persona. Unser Prüfling ist ein werkzeugnutzender Agent mit geladener `SKILL.md`, `INDEX.md`, CLI und Projektverzeichnis — der Prompt ist hier nicht die Welt, das Harness ist es. Daraus folgt eine saubere Zweiteilung für Stufe 2: **Umgebung grundieren ja, Aufgabenkonstruktion offenlegen nein.** Ausformuliert in `knowledge/04` Abschnitt 4.1.

**Der eine Punkt, an dem die Regel auch die Bauzeit betrifft.** Alle Angaben, die `harness-build/SKILL.md` in Schritt 1 erhebt, sind positiv formuliert (Was, Stack, Reifegrad, Schmerz). Die einzige Angabe, die sich aus keiner Projektdatei ablesen lässt, ist **was ausdrücklich nicht gebraucht wird** — also genau die, die das Modell erfindet, wenn niemand sie nennt. Auf Rezeptebene gibt es dafür „Bewusst weggelassen", auf Projektebene nichts. Als Maßnahme notiert in `knowledge/06` M13.

**Was daraus nicht folgt.** Anands zweiter, gemessener Befund steht dem ersten scheinbar entgegen: eine zunehmend detailliertere Persona-Konstruktion trieb das Ergebnis weiter von der Wirklichkeit weg (11:10), „their persona construction was actually amplifying bias within the model as they got more and more detailed". Er zieht daraus nicht „weniger Detail", sondern „you're going to have to test it and validate it against ground truth". Die Trennung, die beides verträgt: **Umgebung und Aufgabenrahmen reich beschreiben, die Profilbeschreibung nur so weit ausbauen, wie eine Messung es rechtfertigt.**

---

## 7. Umformulierung, Reihenfolge und Wiederholung — was eine Messung tatsächlich prüft

**These.** Drei Störungen gehören zu jeder Messung an einem Modell, und jede prüft etwas anderes: eine andere Formulierung derselben Absicht, eine vertauschte Reihenfolge gleichwertiger Optionen, und die Wiederholung desselben Laufs. Nur die ersten beiden liefern neue Information über die Sache.

**Belege.** Reihenfolge — Anand (7:43): „they give the same question, same choices, they just swapped the order of the choices. … the model had an extremely strong order bias. Basically, when they took the two results and they averaged them together, it washed out into noise, into 50/50. Now, humans do have a first order bias, but not to this extent." Seine Folgerung: „we need to durability test our personas to understand how they will change under reorderings, under rewordings, and even adversarial challenges to their opinions."

Wiederholung — Anand (16:16): „if I take a forecast and I rerun it a thousand times without changing the input, that doesn't change my certainty of that forecast. It improves my estimate of what the model is telling me but it doesn't make the forecast itself more accurate."

**Unsere Position, Störung für Störung.**

- **Umformulierung ist die einzige der drei, die hier neu ist.** `knowledge/07` E4 verlangt bereits einen Varianz-Lauf, aber nur „derselbe Input, frischer Kontext" — nicht „andere Formulierung, gleiche Absicht". Kippt die Endauswahl zwischen zwei Fassungen derselben Absicht, ist das ein **Fehlschlag**, kein Ausschussposten: genau dafür existiert Stufe 2 (`knowledge/04` 4.3, Zeile „Stufe 1 grün, Stufe 2 rot"). Anand sagt dasselbe — die Instabilität ist der Befund.
- **Reihenfolge nur innerhalb der Punktegruppen.** Unsere Trefferliste ist nach Relevanz sortiert; wer sie komplett umdreht, stellt den schlechtesten Treffer nach oben, und ein abweichendes Modellurteil wäre dann korrektes Verhalten. Anands Versuchsaufbau vertauscht **gleichwertige** Optionen. Die Entsprechung ist die Reihenfolge innerhalb einer Punktegruppe, die allein alphabetisch nach ID entsteht und keine Information trägt. Fälle mit weniger als fünf Treffern sind davon ausgenommen — dort gibt es nichts zu vertauschen.
- **Wiederholung kehrt bei uns das Vorzeichen um.** Anand warnt davor, weil bei ihm eine externe Wahrheit gemessen wird und die Persona nur der Schätzer ist. Ein Eval misst das Gegenteil: dort **ist** das Modellverhalten der Messgegenstand, und genau die Grösse, die laut Anand durch Wiederholung besser wird („my estimate of what the model is telling me"), ist die Grösse, die ein Eval wissen will. Ein Fall, der 3 von 10 Läufen besteht, ist ein anderer Befund als einer, der 10 von 10 besteht. Unzulässig ist allein der Sprung von dieser Quote zu einer Aussage über die Güte eines Bausteins — dafür hilft keine Wiederholung, sondern nur ein neuer, anders gelagerter Fall.

**Eine zweite Kennzahl neben der Trefferquote — aber die richtige.** Anand (16:43): „They can as we mentioned get the average right but the shape of the distribution wrong. And so you're going to need multiple metrics." Bei uns ist die blinde Stelle nicht die Streuung, sondern der **Rang**: `eval` misst heute, *ob* die erwartete ID unter `topN` steht, nicht *wo*. Bei einem Kollaps der Score-Gewichtung bleibt die Bestehensquote grün, während erwartete IDs von Rang 1 auf 2 rutschen. Die passende zweite Zahl ist deshalb eine Rangverschiebung gegen den letzten grünen Lauf — bereits spezifiziert als `knowledge/06` M7 Punkt 1 und dort noch offen. Eine Vielfaltszahl („wie viele verschiedene IDs stehen in den Top-n") ist dafür ungeeignet und nachweislich falsch gepolt: bei der einzigen real belegten Einebnung dieses Projekts, der früheren ODER-Semantik, **steigt** sie, während die Bestehensquote korrekt fällt.

---

## 8. Herkunft der Prüffälle — konstruiert, abgeleitet, aus dem Feld

**These.** Ein Eval besteht aus Metrik und Daten. Die Metrik gilt als handhabbar, die Beschaffung der Daten ist der Engpass — und die belastbarsten Fälle fallen aus echten Einsätzen zurück.

**Belege.** Shreya Rajpal (Snowglobe, 3:04): „evals are really only about two things … metrics and there's data. … the thing that's a bottleneck And that still remains very challenging and unsolved is what is the data that you're actually computing these metrics on and that process is very timeconuming and very expensive specifically so for agents." Sie kennt genau zwei übliche Herkunftsarten (4:49): manuelles Schreiben oder Produktionsspuren.

Jia Wu (Cognition) setzt dieselbe Priorität von der Anwenderseite: „We have the highest fidelity evaluation set that comes back from our customers, right? We are in the field every single day. … the feedback is actually like half of the loop that makes the next deployment better than the previous deployment."

**Der Zustand hier, ohne Beschönigung.** Alle Fälle in `evals/routing.jsonl` sind beim Schreiben des Evals konstruiert; keiner stammt aus einer aufgezeichneten realen Anfrage, weil das CLI keine protokolliert. Fünf der Fälle tragen Absichtstexte, die wörtlich aus der Schmerz-zu-Suche-Tabelle in `harness-build/SKILL.md` stammen — der Eval misst dort einen geschlossenen Kreis: die im Skill fest verdrahteten Suchen gegen den Katalog, für den sie ausgesucht wurden. Und die Kopie ist bereits auseinandergelaufen: die Tabelle nennt einen Filter, den der zugehörige Eval-Fall nicht setzt.

**Was daraus folgt — und was nicht.**

- **Kein Pflichtfeld `herkunft` je Fall.** Der Wert „aus echter Nutzung" ist mangels Anfragenprotokoll nicht belegbar und wäre reine Selbstauskunft; „aus einem Rezept abgeleitet" trifft auf höchstens einen Fall zu. Das Feld stünde fast durchgängig auf demselben Wert und trüge keine Information. Der Zustand gehört **einmal in den Kopf der Datei**, nicht in vierzehn Felder.
- **Was tatsächlich fehlt, ist eine Fallquelle, die sich selbst pflegt.** `eval --recipes` (spezifiziert als `knowledge/06` M7 Punkt 4) prüft alle Baustein-IDs aus `recipes/*.md` gegen den Katalog, braucht keine Pflegedatei und fängt den stillen Upstream-Rename. Das ist die Datenbeschaffung, die hier möglich ist.
- **Der wertvollste Feldfall ist der, in dem die Suche danebenging.** Er wird heute nirgends festgehalten: das Manifest führt die Herkunft des *Bausteins*, nicht die *Frage*, die zu ihm führte. Ohne eine Notiz während des Laufs gibt es beim ersten echten Einsatz nichts zu ernten. Als Maßnahme notiert in `knowledge/06` M14.
- **Der Umfangsdeckel bleibt.** 12 bis 18 Fälle, so festgeschrieben in `knowledge/04` Abschnitt 4.2 und `knowledge/06` M7. Feldfälle ersetzen konstruierte, sie ergänzen sie nicht — zuerst die, deren Frage im Namen des erwarteten Bausteins steht.

**Zur Simulation als dritter Herkunftsart.** Rajpal empfiehlt sie als überlegene Alternative zu beiden üblichen Wegen, erklärt aber im selben Vortrag die Messung des Abstands zur Wirklichkeit zur Vorbedingung: „in order for any of these gains to really be unlocked you really need to close out the sim to real gap." Diese Messung ist hier nicht durchführbar, weil keine reale Vergleichsmenge existiert. Der Kostentreiber ihres Verfahrens — mehrstufige Trajektorien mit konsistentem Zustand über gemockte Tool-Aufrufe — existiert bei einer zustandslosen Einmal-Suche ebenfalls nicht. Übertragbar bleibt die Prioritätsaussage über Daten gegen Metrik, nicht das Verfahren.

---

## 9. Der billige Test als Vorbedingung des teuren

**These.** Der billige Test wird zur Sperre vor dem teuren: erst wenn er überzeugt, läuft der teure überhaupt an.

**Belege.** Aman Gupta (Nubank, 12:37): „now the team uses snow globe and tries different ideas and they're able to short circuit launching AB test. They don't launch until they're happy with the sim output." Belegt mit zwei Funden aus dem Regelbetrieb (11:55): „we caught a regression uh with simulation that could have made it to production, but simulation caught it. And at the same time, we also caught in another agent an issue uh which could have lowered our self-service rate."

**Was die Belege tragen — und was nicht.** Der Konjunktiv ist der des Sprechers („could have made it to production"); das Gegenfaktische ist nicht nachprüfbar. Zwei Funde ohne Nenner, ohne Zeitraum und ohne Fehlalarmzahl sind keine Trefferquote — es gilt `knowledge/07` E5 (Quote gegen gestartete Durchläufe) und F3 (ein Einzelfund ist kein Muster). Verschoben hat sich der **Fundort**, von der Produktionsmessung vor die Freigabe, nicht die Absicht: die Simulation wird über erklärte Personas und Anwendungsfälle gesteuert, sie findet Gesuchtes früher, nicht Ungesuchtes. Die Zahl „10 AB tests a quarter" im selben Satz ist ausdrücklich hypothetisch („imagine if") und taugt nicht als Nenner.

**Wofür das hier den Beleg liefert.** `knowledge/06` M7 nennt bisher nur Begründungen dafür, dass eine Regressionsprüfung sinnvoll wäre, keinen Nachweis, dass eine je etwas gefangen hat. Gupta liefert ihn, und zwar als Anwender.

**Das Zahlenverhältnis ist bei uns umgekehrt — und das ändert die Diagnose.** Bei Nubank ist die Verifikation der teure Teil (Offline-Evals „a few days", ein A/B-Test „can take forever"). Hier läuft `node tools/harness.mjs eval` in unter einer Sekunde, während `update` Minuten braucht. Der Engpass ist also nicht die Dauer der Prüfung, sondern ihr **fehlender Auslöser**: `cmdUpdate` hat drei Schritte und ruft `cmdEval` nicht auf, `harness-update/SKILL.md` erwähnt `eval` nicht, `INDEX.md` führt den Befehl nicht, und der Nachweis-Block des Subagenten `werkzeug-aenderer` nennt ihn nicht. Der richtige Satz lautet deshalb: *die Verifikation ist hier praktisch gratis und läuft trotzdem nie, weil kein Ablauf sie auslöst.* Als Maßnahme notiert in `knowledge/06` M15.

**Vorbedingung, bevor eine Sperre schärfer wird.** Gupta macht seine Sperre nur deshalb belastbar, weil er den Zusammenhang zwischen Simulation und Wirklichkeit gemessen hat. Solange hier niemand geprüft hat, ob ein grüner `eval`-Lauf mit dem Ausgang einer Projektverifikation zusammenhängt, ist jede weitere Schranke eine Schranke ohne Vorhersagewert.

---

## 10. Ausbau in Stufen — die zweite Stufe ist die verlagerte erste, nicht ein neues Werkzeug

**These.** Wer ein Agentenwerkzeug in Stufen baut, gewinnt die zweite Stufe nicht durch ein zusätzliches Bauteil, sondern indem er die erste an den Ort der Arbeit verschiebt.

**Beleg.** JD Pruitt beschreibt drei Stufen und den erreichten Stand (13:02): „And there is three stages of it. The last of which is certainly still in in development." Stufe 1 ist ein Assistent auf Abruf, der Notizen, Dokumente und Folien zusammenzieht. Stufe 2 entsteht durch Verlagerung (13:41): „we took our engagement agent and we embedded it inside of our platform" — dort läuft er beim Bauen mit und meldet „oh, you forgot about this edge case". Stufe 3 wäre ein Agent, der eine Kunden-E-Mail entgegennimmt und den Ablauf selbsttätig ändert: „the final stage, which we're not at yet" (14:18), „the third part, which we are um still building towards" (18:12).

**Wie der Beleg zu lesen ist.** Das ist eine Standsmeldung, keine begründete Bauregel — Pruitt sagt nicht, *warum* Autonomie zuletzt kommt. Der Vortrag hat erklärte Akquiseabsicht; eine Roadmap-Aussage daraus taugt nicht als Priorisierungsgrund. Belastbar ist allein die Konstruktion von Stufe 2.

**Was uns davon betrifft.** Nur der Verlagerungsgedanke. Die Entsprechung zu Stufe 1 ist `node tools/harness.mjs knowledge` — Wissen auf Abruf, das der Agent holen muss. Die Übertragung von Stufe 2 lautet dann: dasselbe Wissen dorthin bringen, wo gebaut wird, statt eine zusätzliche Prüfung zu erfinden. Ob sich das lohnt, entscheidet ein eigenes Symptom, nicht Varicks Reihenfolge.

**Was uns nicht betrifft.** Stufe 3. Die Entsprechung wäre nicht `update` — das fasst kein Zielprojekt an —, sondern selbsttätiges Schreiben in ein fremdes Projekt. Dagegen ist bereits entschieden, und mit einem besseren Grund als einer fremden Roadmap: `confirmInstall()` bricht ohne TTY und ohne `--yes` ab, `harness-update/SKILL.md` verbietet stilles Überschreiben, weil der Nutzer den Baustein angepasst haben kann, und `knowledge/07` F1 verlangt das Gate technisch erzwungen vor irreversiblen Handlungen.

**Verwandter Befund zum selben Stufengedanken.** Wu (Cognition) formuliert als Ziel, sich selbst aus der Auslöserolle herauszuautomatisieren: „How can we automate ourselves out of the job in the sense that we set up the agent in a way that it runs all of the automations for us … It can respond to like specific alerts, specific events." Das ist eine Zielformulierung, kein Abnahmekriterium — im Transkript findet sich kein Fertigstellungskriterium für ein Agenten-Setup. Und die naheliegende Übersetzung „ereignisgetrieben heisst Hook" ist falsch: siehe die Abgrenzung in `knowledge/02` Abschnitt 2.4. Was bleibt, ist eine Frage für die Betriebsphase — siehe `knowledge/07` Abschnitt 7.

---

## 11. Der Rückkanal vom Einsatz zurück in die Bibliothek

**These.** Einsätze wiederholen sich in ähnlichen Formen. Der Wert entsteht erst, wenn nach jedem Einsatz entschieden wird, ob ein Befund allgemein oder einmalig war.

**Belege.** Jia Wu: „are they common across the entire enterprise or are they unique to a specific user? Should like workarounds or like hacks or bugs in in in what we're building become features … the feedback is actually like half of the loop." Eno Reyes zieht dieselbe Linie schärfer, indem er Arbeit ablehnt, die nicht zurückwirkt: „our goal is not to go and actually do that migration on their behalf, even if we happen to be using our product … because we don't think that that actually makes our product that much better. … that is a great way way get I'd say a decent amount of revenue, but I don't think that that's the way that you can scale a business out enormously."

**Was hier fehlt.** Der Rückkanal ist gedacht, aber nirgends aufgezeichnet. `harness-build/SKILL.md` und `harness-update/SKILL.md` weisen beide an, bei erfolgloser Suche ein passendes Repo in `sources.txt` aufzunehmen — festgehalten wird davon nichts; `sources.txt` enthält keine einzige vermerkte Lücke. Der Befund lebt und stirbt mit dem Gesprächskontext. Das ist die belegbar wertvollste Rückmeldung, weil `sources.txt` neben der groben Deckungsübersicht in `recipes/README.md` sonst keine belegte Eingabe hat.

**Wie ein Lauf ausgewertet wird, ohne eine neue Aktionsart zu erfinden.** Ein `harness-build`-Lauf hinterlässt drei Artefakte, jedes an einer Stelle, die es schon gibt:

1. **Suchbegriffe nach `evals/routing.jsonl`**, nicht in Prosa: je installiertem Baustein ein Fall mit `frage` (die tatsächlich gelaufene Suche), `erwartet` (die installierte ID) und `warum` (der benannte Schmerzpunkt). Ein Treffer, der als sachlich falsch verworfen wurde, kommt als `verboten` in denselben Fall. Damit ist der Lauf wiederholbar; Prosa wäre es nicht.
2. **Verworfene Treffer bleiben in der Auswahlvorlage an den Besitzer** und werden nicht zusätzlich persistiert — eine verworfene ID sagt nach dem nächsten `update` nichts mehr über den dann geltenden Bestand. Persistiert wird nur, was der Verwurf über die *Suche* aussagt, also Punkt 1.
3. **Der fehlende Baustein bekommt einen benannten Ort:** ein Kommentarblock am Ende von `sources.txt`, eine Zeile je Lücke. Das CLI liest diese Datei nur und schreibt sie nie, Kommentare überleben also jedes `update`. **Eine leere Lückenliste ist ein gültiges Ergebnis** und wird als solches vermerkt — sonst erfindet der nächste Lauf Lücken, um die Bedingung zu erfüllen.

Ein Eintrag in `knowledge/LOG.md` entsteht genau dann, wenn der Lauf etwas an Wissensbank oder Werkzeug geändert hat, und mit einer der dort definierten Aktionsarten. Ein Lauf ohne Änderung schreibt keinen Eintrag; er hat trotzdem geliefert, wenn die drei Artefakte vorliegen. Als Maßnahme notiert in `knowledge/06` M14.

**Der Kern, scharf formuliert.** Ein `harness-build`-Lauf, der weder einen Eval-Fall noch eine Lückenzeile hinterlässt, ist Dienstleistung am Zielprojekt und zählt nicht als Verifikation der Bibliothek.

---

## 12. Was aus dem Forward-Deployed-Kontext hier keinen Gegenstand hat

Dieser Abschnitt existiert, damit niemand dieselben fünf Vorträge erneut auf Anwendbarkeit prüft. Was hier steht, ist geprüft und verworfen.

| Themenblock | Aus welchen Vorträgen | Warum nicht anwendbar |
|---|---|---|
| Prozess-Reengineering beim Kunden: Änderungsgrösse gegen Übernahmebereitschaft, Aufteilung von Prozessschritten zwischen Mensch und Agent, Adoptionsraten, nicht-technische Operatoren in Finanz, Vertrieb, Beschaffung | Moza, Reyes | Ein Besitzer, der Bauer und Nutzer zugleich ist. Es existiert niemand, dessen Übernahmebereitschaft leiden könnte. |
| Post-Training und RL-Umgebungen als Abhilfe: eigenes Modell auf Open-Source-Basis, Belohnungsdichte, maßgeschneiderte Traversierungs-Werkzeuge | Moza/Pruitt, Reyes | Setzt ein Trainingsvorhaben voraus. Die Bibliothek katalogisiert fremde Repos; das CLI hat keine Abhängigkeiten. Deckt sich mit dem bereits geschlossenen Trainingsblock in `knowledge/05` Abschnitt 3. |
| Marktforschung als Domäne: Produktkonzept-Tests, Kaufbereitschaft, Zahlungsbereitschaft, Panelrekrutierung, statistische Signifikanz über eine Population, generative agent-based modeling | Anand | Ein Nutzer, keine Population, kein Signifikanztest. Bei 12 bis 18 Eval-Fällen gibt es weder Stichprobe noch Test. |
| Verteilungs-Messinstrumentarium: Korrelations- und Formmasse über Antwortverteilungen, Rekonstruktion einer Verteilung aus Freitext über semantische Ähnlichkeit zu Ankertexten | Anand | Der Sprecher grenzt es selbst gegen Evals mit eindeutigem Richtig und Falsch ab — unserer ist genau so einer. Die Ankertext-Methode bräuchte Embeddings, die `knowledge/04` bereits bewusst zurückgestellt hat. |
| Mehrstufige Trajektorien mit Zustand: gemockte Tools, Zustandskonsistenz über alle Tool-Aufrufe, LLM-as-a-judge je Gesprächsschritt, automatische Prompt-Optimierung | Rajpal, Gupta | `search` und `show` sind zustandslose Einzelaufrufe. Es gibt keine Tools zu mocken und keinen Zustand zu halten. |
| A/B-Tests in Produktion, Domänenexperten-Panel als Gültigkeitsnachweis, Bankkennzahlen (Selbstbedienungsquote, TNPS) | Gupta, Rajpal, Wu | Ein Nutzer, keine Kohorten, kein Panel. `knowledge/07` E4 schliesst Gutachterkonsens ausdrücklich aus, weil ein Einzelprojekt keines hat. |
| Enterprise-Betrieb des verkauften Produkts: Air-Gapping, zentrale Governance-Ebene, Selbstmontage bei zehntausenden Codebasen, Autonomie-Quotienten | Reyes | Ein Besitzer, ein Rechner, ein Zielprojekt pro Lauf. Der Autonomie-Quotient ist im Transkript zudem in sich unklar (zwei Zahlen, eine Definition, die zur zweiten nicht passt). |
| Personalauswahl und Organisation: T-Shape-Profil, Einstellungskriterien, Aussendienst, „everybody is go-to-market" | Wu, Reyes | Die Bibliothek stellt niemanden ein. Die naheliegende Übertragung auf Subagent-Zuschnitt stützt sich auf kein Wort der Quellen über Software-Agenten und wäre erfunden. |
| Produkt- und Marktpositionierung, Roadmap-Derisking, Geschäftsmodell-Abschätzungen | Wu, Reyes, Moza | Wir besitzen kein Produkt, in dessen Roadmap etwas zurückfliessen könnte. Übrig bleibt die schwächere Variante: Befund zurück ins Rezept, siehe Abschnitt 11. |

**Themen, zu denen diese fünf Vorträge nichts sagen** — hier nichts ableiten: Varick sagt kein Wort über synthetische Nutzer oder Simulation; Wu nennt kein Fertigstellungskriterium für ein Agenten-Setup; keiner der fünf äussert sich zur Wahl zwischen Baustein-Typen (Skill, Subagent, Command, Hook).

---

## 13. Zur Belastbarkeit dieser fünf Quellen

**Alle fünf sind Firmenvorträge mit erkennbarem Eigeninteresse.** Anand nennt seine Rolle als Anbieter selbst („even though I'm a vendor in the space"). Reyes' Vortrag endet mit Kundenaufruf und Stellenanzeige. Rajpal ist CEO des beschriebenen Produkts, Gupta ist ihr Kunde — die Mechanikbeschreibung stammt durchweg von der Anbieterin, die Wirkungsbelege vom Anwender; getrennt lesen. Bei Varick gilt dieselbe Trennung: die technisch belastbaren Aussagen stammen sämtlich von Pruitt (Engineering), nicht von Moza (CEO).

**Keine Zahl aus diesen fünf Vorträgen ist als Beleg zitierbar.** Wus drei Kernzahlen (rund 150 Prozent zusätzliche Personalleistung, rund 82 Prozent kürzere Lieferzeit, annähernd doppelt so viele PRs) stammen aus anonymisierten Fallstudien ohne Methodenteil; die erste ist in der Einheit sogar in sich widersprüchlich, weil derselbe Absatz „about 150% like plus headcount" und „imagine having 150 extra coworkers" nebeneinanderstellt — 150 Prozent mehr Personal und 150 zusätzliche Personen sind verschiedene Grössen. Reyes' drei Zahlen sind mit „maybe", „I'd say maybe" und „roughly" eingeleitet. Anands 83 und 80 Prozent stammen aus Papern, die er zeigt, aber überwiegend nicht namentlich zitiert. Guptas Zahl im Vortragstitel wird nirgends hergeleitet. Das ist keine neue Regel, sondern die bestehende Praxis aus `knowledge/05`, Abschnitt „Zur Belastbarkeit der Belege insgesamt", angewandt auf fünf weitere Quellen: **zitierbar mit Sprecher und Zeitmarke, nicht verwendbar als Beleg für eine eigene Aussage.**

**Der Sprecher benennt die Grenze seiner Zahlen manchmal selbst — und zieht daraus nicht den Schluss.** Wu nennt die Anonymisierung ausdrücklich („three proof points of anonymized case studies"), wehrt die Folgerung fehlender Nachprüfbarkeit aber ab („these aren't like, you know, private case studies"). Wer ihn zitiert, darf das Eingeständnis nicht in eine Selbstbezichtigung umdeuten.

**Transkriptqualität.** Bei Varick erscheint der Firmenname als „Verkada", „Verek", „Verity", „Verica" und „Varick"; „FDE" wird zu „FTE" und „FDA"; „Kimiko 26" ist vermutlich ein verstümmelter Modellname. Bei Anand steht einmal „Ishan Nand". Zitate sind wörtlich übernommen, einschliesslich dieser Fehler — wer sie weitergibt, lässt sie stehen und nennt die Fundstelle, statt still zu korrigieren.

---

## 14. Aus diesen fünf Vorträgen bewusst nicht übernommen

Geprüft und verworfen. Der Abschnitt existiert, damit dieselben Vorschläge nicht in sechs Monaten erneut auftauchen.

| Verworfener Vorschlag | Grund |
|---|---|
| „150 Seiten" und „2 Minuten" als Feldbeleg für Context Rot in `knowledge/01` 3.1 | Paraphrasierte, im Original gehedgte Fremdangaben ohne Messung. 3.1 schliesst selbst mit „Miss das, statt es zu vermuten" — eine ungemessene Anekdote arbeitet dort gegen die eigene Aussage. |
| Eigenes Werkzeug zur Auflösung, ob zwei Baustein-Namen dasselbe meinen | Unsere IDs sind `repo/typ/slug`, deterministisch und eindeutig; es gibt keine Identitätsunschärfe. Gemessen sind von 54 Namensgruppen 45 gewollte Typ-Sätze desselben Repos, nur 9 repoübergreifend. Der Auflöser existiert bereits als `--type`. |
| Eingriffsstufen-Spalte (`autonom` / `Freigabe` / `Mensch`) in den Rezepttabellen | Kategorienfehler: Rezeptzeilen sind Bausteine, keine Prozessschritte. Und eine Markdown-Spalte erzwingt nichts — Erzwingung säße in `permissions`, die das CLI bewusst nicht schreibt. |
| „Engster Wirkungsbereich zuerst" als Einführungsregel für die Rezepte | Im Bestand widerlegt: `recipes/02` beginnt begründet mit dem weitesten Wirkungsbereich, `recipes/04` mit der Umfangsfestlegung. Das Kriterium ist Prüfbarkeit, nicht Enge. |
| Kriterium „gibt nur eine Meinung ab" vor „löst ein benanntes Problem" in `harness-build` Schritt 4 | Achsenverwechslung: der bestehende Satz trennt Zwang von Bitte, Reyes trennt prüfbar von nicht prüfbar. Und die Typ-Vorliebe würde alle sechs Kern-Sets leerräumen, die ausschliesslich aus Skills und Agents bestehen. |
| Zweite Spalte „Woran sichtbar, dass es gewirkt hat" in der Auswahltabelle | Schritt 6 liegt **vor** der Installation; der Baustein hat im Zielprojekt nie gelaufen. Eine Pflichtspalte, die nur mit plausibler Vermutung zu füllen ist, erzeugt die Falle „Vermutung im Faktenkostüm". |
| Pflichtfeld `herkunft` je Eval-Fall mit drei Werten | Nicht belegbar (kein Anfragenprotokoll), praktisch konstant, kein Trennwert. Der Zustand gehört einmal in den Dateikopf. |
| Pflichtfelder `autor` und `datum` je Eval-Fall | `git blame` liefert beides generiert statt gepflegt; es gäbe keinen Erzwinger, weil `lint` das Verzeichnis `evals/` nicht prüft. Doppelt geführte Angaben verbietet `knowledge/07` E3. |
| Gewichtung „Feldfall zählt stärker als konstruierter Fall" im Eval | `cmdEval` kennt bestanden/durchgefallen und einen Exit-Code; eine Gewichtung hätte keinen Konsumenten. |
| Anzahl verschiedener Bausteine in den Top-n als zweite Kennzahl | Falsch gepolt: bei der einzigen real belegten Einebnung steigt sie, während die Bestehensquote fällt. Die richtige zweite Zahl ist die Rangverschiebung. |
| Paarweise Top-n-Überschneidung benachbarter Fragen als Einebnungsmass | Gemessen null Überschneidung in allen Regimen. Eine lexikalische UND-Filterung kann nicht zur Mitte kollabieren — das Fehlerbild der Quelle hat hier keinen Mechanismus. |
| Protokollierung jeder Suchanfrage nach `evals/` | `ladeEvalFaelle` liest jede `evals/*.jsonl` und macht aus jeder Nicht-Kommentarzeile einen Eval-Fall; Logzeilen zählten als bestandene Fälle und machten die echten unsichtbar. Ein Suchlog liefert ausserdem Ist-Treffer, ein Eval-Fall braucht Soll-Treffer — teuer ist das Label, nicht die Frage. |
| Zweite Bestätigungsrunde in `harness-build` für reibungserzeugende Bausteine | Schritt 7 erzwingt bereits eine Zwischenzustimmung für ausführbare Inhalte; eine dritte Runde erzieht zum Durchklicken. Die Kennzeichnung gehört in die vorhandene Tabelle. |
| `/harness-plan` als Pflichtschritt vor `/harness-build` | Widerspricht `harness-plan` selbst (bei Wegwerf-Prototypen „reiner Overhead") und dem Einsatzfall von `harness-build` (laufendes MVP oder Produktivsystem, dort existiert keine `PLAN.md`). |
| Eine Rückfallzeile „greift nicht, wenn X — dann Y" je Kern-Set-Eintrag | 33 Zeilen über sechs Rezepte, jede eine belegpflichtige Aussage über ein Zielprojekt, das die Bibliothek nicht betreibt. `knowledge/06` hat dieselbe Grössenordnung schon einmal verworfen. |
| Eine vierte Aktionsart in `knowledge/LOG.md` für Einsatzberichte | `revise` verlangt bereits „woran der Irrtum bemerkt wurde"; projektspezifische Befunde haben mit „Bewusst nicht umgesetzt" in `knowledge/06` einen Ort. Eine vierte Art machte aus dem Änderungsprotokoll der Wissensbank ein Laufprotokoll des Werkzeugs. |
| Wirkungsmessung als Feld im `harness-manifest.json` | Die Dokumentebene wird bei jedem `install` neu geschrieben; der Wert wäre nach der nächsten Installation weg. Und es gibt im Agentenbetrieb keinen Eingabepfad — der Agent schriebe die Zahl selbst. |
| Sim-to-Real-Messung als Zulassungsschranke vor der ersten Nutzung | Es gibt keine simulierten Eval-Daten und keinen Subcommand, der welche erzeugt. Bei Nubank lief die Messung ausserdem nachträglich an einem laufenden Agenten, nicht als Gate. |
| Reyes als fünfter Beleg für „Das Harness ist die feste Grösse" (`knowledge/05` 1.1) | Er spricht über Handlungsfreiheit gegenüber einem Anbieter, nicht über Ergebnisdeckelung — und seine Aussage ist die Produktdifferenzierung seiner Firma. Der Abschnitt trägt „unabhängig voneinander"; Reyes dort einzutragen machte das nachweislich falsch. |

---

## 15. Quellen — die fünf ausgewerteten Vorträge

Alle fünf abgerufen und ausgewertet am **2026-08-07**, Rohtranskripte unter `Learnings/`. Transkripte automatisch erzeugt; Zitate wörtlich übernommen, einschliesslich erkennbarer Erkennungsfehler.

| # | Titel und Datei unter `Learnings/` | Sprecher | Veröffentlicht |
|---|---|---|---|
| 1 | `AI tools for Forward Deployed Engineering — Vasuman Moza, Varick Agents.md` | Vasuman Moza (CEO) für 0:01–11:53 und 18:35–20:03; JD Pruitt (Head of Engineering) für 12:06–18:35 | 2026-07-28 |
| 2 | `How Forward Deployed Engineering is done at Cognition — Jia Wu.md` | Jia Rong Wu, Deployed Engineering Lead bei Cognition (Devin) | 2026-07-28 |
| 3 | `How Forward Deployed Engineering is done at Factory — Eno Reyes.md` | Eno Reyes, Co-Founder und CTO bei Factory (Droid) | 2026-07-29 |
| 4 | `Persona Engineering_ A Field Guide to AI Synthetic Personas — Ishan Anand, InsightSciences.ai.md` | Ishan Anand, Chief AI Officer bei Insight Sciences | 2026-07-29 |
| 5 | `SimulationMaxxing_ How we ship agents 20× faster — Aman Gupta (Nubank) + Shreya Rajpal (Snowglobe).md` | Aman Gupta (Principal ML Engineer, Nubank) und Shreya Rajpal (CEO, Snowglobe) | 2026-07-29 |

**Die Sprechertrennung ist bei zwei Quellen tragend.** Bei Varick stammen die technisch belastbaren Aussagen sämtlich von Pruitt; bei SimulationMaxxing stammt die Mechanikbeschreibung von der Anbieterin, die Wirkungsbelege vom Anwender. Wer aus diesen beiden Vorträgen zitiert, nennt den Sprecher.

**Verwandte Kapitel dieser Wissensbank** — abfragen statt am Stück lesen:

- Aufbau-Leiter, Verifikationsweg auf Stufe 2, Symptom-Index → `node tools/harness.mjs knowledge "einfachste lösung zuerst"` (`01-harness-doktrin.md`)
- Abgrenzung Hook gegen Auslöser, Kontextkosten je Typ → `node tools/harness.mjs knowledge "hook startet keinen agenten"` (`02-bausteine.md`)
- Eval-Spezifikation, Stufen, Dateiformat, Drift-Tabelle → `node tools/harness.mjs knowledge "das minimal sinnvolle verfahren"` (`04-governance.md`)
- Die neun anderen Vorträge, ihre Widersprüche und die dortige Abgrenzung → `node tools/harness.mjs knowledge "was uns nicht betrifft"` (`05-erkenntnisse-aus-vorlesungen.md`)
- Maßnahmen samt Prüfergebnis und verworfenen Varianten → `node tools/harness.mjs knowledge "bewusst nicht umgesetzt"` (`06-massnahmen.md`)
- Abnahmedatei, Logbuch, Prüfphase, Betriebsphase → `node tools/harness.mjs knowledge "eigene aufgaben als messlatte"` (`07-projekt-mit-ai-aufsetzen.md`)
