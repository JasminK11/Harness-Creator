# Arbeit an der Harness-Bibliothek

Dieses Projekt sammelt Wissen darüber, wie man Agenten-Setups richtig baut. Die
Regeln hier sind dieses Wissen, angewendet auf die Arbeit am Projekt selbst.

Der Grund ist nicht Symmetrie: Ein Werkzeug, das seine eigenen Regeln nicht
befolgt, ist der beste Beweis, dass die Regeln nichts taugen. Wo eine Regel hier
unpraktikabel ist, gehört sie geändert — in der Wissensbank, nicht nur hier.

## Was hier nicht behauptet werden darf

Die Wissensbank enthält Material, das in den Trainingsdaten der lesenden Modelle
nicht vorkommt. Genau deshalb existiert sie. Daraus folgt die wichtigste Regel:

**Nichts aus dem Gedächtnis ergänzen.** Jede Zahl, jede Baustein-ID, jede Aussage
über das Verhalten des Werkzeugs muss aus einer Quelle stammen oder am laufenden
System ermittelt sein:

```bash
node tools/harness.mjs stats          # Bestandszahlen
node tools/harness.mjs show <id>      # existiert diese ID?
node tools/harness.mjs lint           # widerspricht sich die Wissensbank?
```

Wer eine Zahl schätzt, weil sie plausibel klingt, hat die Wissensbank beschädigt.
Das ist bereits passiert: Drei Dateien trugen drei verschiedene Bestandszahlen,
weil der Extractor korrigiert wurde und niemand abglich. `lint` findet das jetzt —
aber nur bei Zahlen, nicht bei Aussagen.

## Prüfen heißt: von jemand anderem prüfen lassen

Die eigene Doktrin sagt, warum:

```bash
node tools/harness.mjs knowledge "evaluator agent"
```

Ein Agent, der seine eigene Arbeit bewertet, findet sie gut. Das ist kein
Charakterfehler, sondern messbar. Deshalb gilt hier:

- Größere Änderungen laufen über einen Workflow mit **separater Prüfphase**.
- Der Prüfer bekommt die Standardhaltung „ablehnen" und muss am laufenden System
  belegen, dass ein Problem existiert — nicht, dass es plausibel klingt.
- Er sieht das Ergebnis, nicht die Begründung. Ein Prüfer, der weiß, warum etwas so
  gebaut wurde, prüft es nicht mehr ergebnisoffen.

Das hat sich mehrfach ausgezahlt: Die Prüfläufe haben gefunden, dass `search`
Mehrwortanfragen als ODER wertete, dass `classify()` den Dateipfad als Signal nahm,
dass japanische Übersetzungen ihre Originale überschrieben, und dass eine
Wissensdatei das Gegenteil des tatsächlichen Verhaltens behauptete. Keiner dieser
Fehler wäre beim Lesen der eigenen Arbeit aufgefallen.

## Der Kreislauf

Neues Material — Vorträge, Artikel, Repos — landet in `Learnings/` oder in
`sources.txt`. Was dann passiert, ist nicht optional:

1. **Auswerten**, bei mehreren oder langen Quellen über einen Workflow, ein Agent
   pro Quelle, mit Pflichtfeld „Beleg".
2. **Gegen den Ist-Zustand halten** — was ist schon umgesetzt, was geht bei einer
   Bibliothek *fremder* Repos gar nicht.
3. **Adversarial prüfen.**
4. **Umsetzen**, nicht nur dokumentieren. Eine Erkenntnis, die nur in einer
   Markdown-Datei landet, hat nichts verändert. Das gilt in beide Richtungen: in
   die Wissensbank **und** in das Werkzeug, wenn sie darauf anwendbar ist.
5. **Abgelehntes festhalten**, mit Grund — sonst wird es in sechs Monaten erneut
   vorgeschlagen.

`Learnings/` ist die Rohschicht: **nur lesen, nie ändern.** Sie ist der Beleg für
alles, was in `knowledge/` steht. Wer die Rohquelle anfasst, zerstört die
Nachvollziehbarkeit.

## Änderungen an `tools/harness.mjs`

- **Keine Abhängigkeiten.** Nur die Node-Standardbibliothek. Wer eine Bibliothek
  braucht, hat das Problem falsch zugeschnitten. Das CLI muss überall laufen, wo
  Node läuft, ohne Installation.
- **Kommentare erklären das Warum**, nicht das Was. `// Schleife über Items` ist
  wertlos; „Massen-Repos würden sonst jede Suche dominieren" ist der Grund, warum
  jemand die Zeile nicht wegoptimiert.
- **Nach jeder Änderung** `node tools/harness.mjs lint` und einmal jeden Subcommand
  aufrufen. Die Datei hat keine Tests — der Lauf ist der Test.
- Wer eine Zeilennummer in die Dokumentation schreibt, hat sie beim nächsten Commit
  ungültig gemacht. Funktions- und Konstantennamen verwenden.

## Änderungen an der Wissensbank

- Jede Datei trägt OKF-Frontmatter: `sources`, `status`, `stale_after`, `generated`.
- **`verified` nur setzen, wenn ein Mensch die Datei tatsächlich gelesen hat.** Ohne
  das Feld gilt sie als ungeprüft, und das ist der ehrliche Zustand.
- Überschriften so wählen, dass sie als Suchtreffer taugen. Die Dateien werden über
  `harness.mjs knowledge` abschnittsweise abgefragt, nicht am Stück gelesen.
  „3.2 Warum ein Prototyp kein Produktivsystem ist" findet man; „Weiteres" nicht.
- Jede Änderung bekommt einen Eintrag in `knowledge/LOG.md`. Nur ergänzen, nie
  löschen.

## Was hier schiefgehen kann

| Symptom | Ursache | Gegenmittel |
|---|---|---|
| Kontext ist voll, bevor die Arbeit beginnt | Jemand hat `catalog/index.json` gelesen oder die Klone durchsucht | Nur über das CLI |
| Zwei Dateien sagen etwas Verschiedenes | Neue Erkenntnis wurde ergänzt statt eingearbeitet | `lint`, dann abgleichen |
| Eine Empfehlung klingt gut, hilft aber nicht | Kein Prüfer hat versucht, sie zu widerlegen | Prüfphase nachholen |
| Eine Zahl stimmt nicht mehr | Werkzeug wurde geändert, Doku nicht | `lint` prüft Bestandszahlen |

<!-- harness-library:start — automatisch erzeugt, Änderungen hier gehen verloren -->
## Harness-Bibliothek

Dies **ist** die Harness-Bibliothek. Die Regeln unten gelten für die Arbeit an ihr selbst — sie sind dieselben, die sie jedem Zielprojekt mitgibt.

### Zugriffsregel — bindend

Der Katalog umfasst über 25.000 Bausteine. Wer ihn einliest, hat sein
Kontextfenster voll, bevor er die erste Zeile Projektcode sieht. Deshalb:

- **Nie** `catalog/index.json` lesen.
- **Nie** die Repo-Klone unter `C:\Users\info\.harness-sources` mit Glob/Grep/Read durchsuchen.
- Der einzige Zugriffsweg ist das CLI:

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs search "<stichwort>" [--type X] [--domain X] [--limit N]
node tools/harness.mjs show <id>
node tools/harness.mjs install <id> --to "<dieses Projekt>"
```

Reihenfolge bei einer Frage nach passenden Bausteinen: erst `search`, dann
`show` für die engere Auswahl, dann `install`. `INDEX.md` der Bibliothek darf
komplett gelesen werden — sie ist dafür klein gehalten.

### Die Wissensbank befragen

Die Bibliothek enthält nicht nur Bausteine, sondern begründetes Wissen dazu,
wie man ein Agenten-Setup richtig baut — ausgewertet aus Anthropics
Engineering-Material und Konferenzvorträgen von Praktikern.

```bash
node tools/harness.mjs knowledge "<frage>"     # liefert Abschnitte, keine Dateien
node tools/harness.mjs knowledge --list        # Inhaltsverzeichnis
```

**Wann das dran ist** — nicht nur bei Fragen zur Bibliothek, sondern immer,
wenn eine Entscheidung über den Aufbau dieses Projekts ansteht:

- Soll eine Regel als Hook, Skill oder in die CLAUDE.md? → `knowledge "hook statt skill"`
- Lohnt sich hier ein Subagent? → `knowledge "subagent kontext kosten"`
- Wie prüft man Ergebnisse, ohne dass der Agent sich selbst gut findet?
  → `knowledge "evaluator agent"`
- Wird das Setup zu komplex? → `knowledge "einfachste lösung zuerst"`

Die Wissensbank-Dateien **nicht** am Stück lesen. Sie umfassen tausende Zeilen
und wachsen weiter; `knowledge` schneidet den passenden Abschnitt heraus.

### Wo das Wissen herkommt

`knowledge/` — Begründungen, nicht Bedienungsanleitungen. Harness-Design nach
Anthropic, die sechs Baustein-Typen im Vergleich, Kontext-Vorbilder,
Governance ab Bibliotheksgrösse, ausgewertete Konferenzvorträge.
`recipes/` — Baupläne pro Projekttyp mit verifizierten Baustein-IDs.

Beides über `knowledge` abfragen statt am Stück lesen.
<!-- harness-library:end -->
