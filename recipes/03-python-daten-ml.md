# Rezept 03 — Python- / Daten- / ML-Projekt

## Wann dieses Rezept passt

- Der Code ist überwiegend Python: `pyproject.toml`, `requirements.txt`, `.ipynb`.
- Es gibt eine Datenverarbeitung oder ein Modell, dessen Güte nicht binär "läuft/läuft nicht" ist.
- Ergebnisse müssen reproduzierbar sein — jemand wird fragen, wie diese Zahl entstand.
- Der Übergang vom Notebook zu etwas Betreibbarem steht an oder ist schon passiert.

**Wann es nicht passt:** Ein kurzes Python-Skript ohne Modell und ohne
Wiederholbarkeitsanspruch — dort genügt `python-patterns` einzeln, wenn überhaupt.
Ein reines Django- oder FastAPI-Webprojekt gehört nach Rezept 02, dieses hier
liefert nur die Sprachbausteine dazu. Reine LLM-Anwendungen ohne eigenes Training
brauchen `mle-workflow` nicht.

## Die Schmerzpunkte dieses Projekttyps

| Symptom | Doktrin |
|---|---|
| "Das Modell ist besser geworden" — ohne Baseline, ohne festen Split, ohne Seed. Nicht nachprüfbar, also nicht wahr. | 3.3 Selbstbewertung |
| Notebook-Code wandert unverändert in die Pipeline; Zellenreihenfolge wird zur unsichtbaren Abhängigkeit. | 3.5 |
| Training läuft durch, das Ergebnis ist Unsinn: Shape passt zufällig, Label-Leck bleibt unentdeckt. | 3.5 |
| Datenannahmen stehen nirgends. Ändert sich eine Spalte, bricht die Pipeline still. | 3.1 Kontextverlust |
| Der Agent baut ein grosses Modell, wo eine Baseline gereicht hätte, und misst nie dagegen. | 3.4 Scope-Fehleinschätzung |

Der entscheidende Punkt: Modellgüte ist kein Compiler-Ergebnis. Nach Doktrin 8/Frage 3
braucht man hier **entweder** einen automatisierbaren Eval-Check **oder** einen
separaten Bewerter. Das Kern-Set setzt auf den Check — `mle-workflow` liefert das
Gerüst dafür — und ergänzt ihn um einen Reviewer mit eigenem Kontext.

## Kern-Set (Pflicht)

| ID | Typ | Welches Problem er löst | KB |
|---|---|---|---:|
| `affaan-m__ecc/skill/mle-workflow` | skill | Datenverträge, reproduzierbares Training, Offline/Online-Eval, Deployment, Monitoring, Rollback. Das Gerüst, das aus einem Notebook ein System macht. | 22 |
| `affaan-m__ecc/agent/mle-reviewer` | agent | Zweite Sicht auf Feature-Pipeline, Reproduzierbarkeit und Eval-Aufbau. Findet Label-Lecks und undokumentierte Annahmen. | 5 |
| `affaan-m__ecc/skill/python-testing` | skill | pytest-Fixtures, Parametrisierung, Mocking, Coverage, Async — macht Datenannahmen prüfbar statt kommentierbar. | 11 |
| `affaan-m__ecc/skill/python-patterns` | skill | Protocols, Dataclasses, Context Manager, Type Hints, Paketstruktur. Gegen den Notebook-Stil im Produktivcode. | 9 |
| `affaan-m__ecc/agent/python-reviewer` | agent | PEP 8, Idiome, Type Hints, Sicherheit, Performance — eng, 3 KB, günstig einzusetzen. | 3 |

Fünf Bausteine, rund 50 KB. Bewusst schlank: Die teuersten Fehler liegen in der
Methodik, nicht in der Syntax.

## Erweiterung (optional)

| ID | Typ | Bedingung | KB |
|---|---|---|---:|
| `affaan-m__ecc/skill/pytorch-patterns` | skill | Nur wenn PyTorch tatsächlich verwendet wird. Deckt Trainingsschleife, Dataloading, Reproduzierbarkeit. | 11 |
| `affaan-m__ecc/agent/pytorch-build-resolver` | agent | Nur wenn Training abstürzt: Shape-Mismatch, Device-Fehler, Gradienten, AMP. Nicht vorsorglich einbauen. | 5 |
| `affaan-m__ecc/skill/ml-adoption-playbook` | skill | Nur wenn ML in eine bestehende Nicht-ML-Codebasis eingezogen wird. Problemrahmung, Datenreife, Entkopplung, Baseline. | 4 |
| `affaan-m__ecc/skill/fastapi-patterns` | skill | Nur wenn das Modell als HTTP-Dienst ausgeliefert wird. Dann zusätzlich Rezept 02 querlesen. | 9 |
| `msitarzewski__agency-agents/agent/statistician` | agent | Nur wenn Signifikanz-, A/B- oder Kausalaussagen getroffen werden. Prüft Versuchsaufbau, nicht Code. | 11 |
| `msitarzewski__agency-agents/agent/rag-pipeline-engineer` | agent | Nur bei Retrieval-Systemen: Chunking, Hybrid-Suche, Re-Ranking, Eval-getriebene Iteration. | 18 |
| `affaan-m__ecc/skill/recsys-pipeline-architect` | skill | Nur wenn "Top-K Items für (User, Kontext)" die Kernaufgabe ist — Feed, Ranking, Notification-Triage, Search-Reranking. | 8 |

## Bewusst weggelassen

| Kandidat | Warum nicht |
|---|---|
| `affaan-m__ecc/skill/benchmark-methodology` (10 KB) | Der Name führt in die Irre. Der Inhalt ist Wettbewerber-Scoring über neun Marketing-Dimensionen, kein ML-Benchmark. Gehört zu Rezept 05, nicht hierher. |
| `affaan-m__ecc/skill/eval-harness` (6 KB) | Bewertet **Claude-Code-Sessions**, nicht Modellgüte. Für Modell-Evaluation ist der Eval-Teil von `mle-workflow` das Richtige. Zwei Dinge mit ähnlichem Namen, verschiedene Aufgaben. |
| `affaan-m__ecc/skill/cost-aware-llm-pipeline` (7 KB), `regex-vs-llm-structured-text` (8 KB), `data-scraper-agent` (3 KB) | Inhaltlich passend für LLM-lastige Datenprojekte, im Katalog aber nur als japanische Übersetzung (`docs/ja-JP/skills/…`). Vor Übernahme `show --head 20` prüfen. |
| `affaan-m__ecc/skill/django-patterns` (21 KB) | Python ist nicht gleich Django. Grösster Baustein der Domäne, und in einem Daten-/ML-Projekt fast immer ungenutzter Ballast. |

## Installationsbefehl

```bash
cd "C:\Users\info\OneDrive\Desktop\Harnes Creator"
node tools/harness.mjs install \
  affaan-m__ecc/skill/mle-workflow \
  affaan-m__ecc/agent/mle-reviewer \
  affaan-m__ecc/skill/python-testing \
  affaan-m__ecc/skill/python-patterns \
  affaan-m__ecc/agent/python-reviewer \
  --to <projektpfad>
```

## Reihenfolge der Einführung

1. **Zuerst der Messweg.** Aus `mle-workflow` nur den Eval-Teil: fester Split,
   fester Seed, Baseline, eine Zahl, die man vergleichen kann. Ohne diese Zahl ist
   jede spätere Aussage über Verbesserung Selbstlob (Doktrin 3.3).
2. **Dann die Datenverträge.** Ebenfalls aus `mle-workflow`. Erwartete Spalten,
   Typen, Wertebereiche als Assertions — das fängt stille Pipeline-Brüche ab.
3. **Dann Tests.** `python-testing` auf die Transformationsschritte. Nicht auf das
   Modell — das prüft die Eval.
4. **Dann Code-Qualität.** `python-patterns` und `python-reviewer`, sobald Code
   das Notebook verlässt. Vorher unnötig.
5. **Zuletzt `mle-reviewer`**, und nur wenn Punkt 1 und 2 stehen. Ein Reviewer, der
   auf eine Pipeline ohne Baseline schaut, kann nichts Belastbares sagen.

Framework-Erweiterungen (PyTorch, FastAPI, RAG) erst, wenn das Framework
tatsächlich im Repo liegt — nicht wenn es geplant ist.
