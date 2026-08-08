#!/usr/bin/env node
// PreToolUse-Hook: Zugriffsschutz für catalog/index.json und die Repo-Klone.
//
// Warum als Hook statt Prosa: Die Zugriffsregel ist in CLAUDE.md als "bindend"
// deklariert und wird an mindestens acht Stellen als Text wiederholt — so viel
// wiederholte Prosa ist selbst der Beleg, dass das Projekt die Regel für
// bruchgefährdet hält. Der Schaden eines Fehlgriffs ist still und innerhalb
// der Sitzung irreversibel: index.json hat ~20 MB, ein einziger Read kostet
// das Kontextfenster. Doktrin-Kurzform Punkt 10: "Was garantiert gelten muss,
// gehört in einen Hook, nicht in einen Prompt." (Prüflauf 2026-08-08,
// fünf adversariale Agenten, Urteil: umsetzen mit Änderung.)
//
// Bewusst NICHT auf Bash ausgeweitet: extract SCHREIBT index.json über Bash,
// lint liest den Katalog in-process, harness-update löscht Klone per
// Remove-Item — ein Matcher auf Bash blockte legitime Arbeit, und ein Hook,
// der bei legitimen Aktionen blockt, wird im Ganzen abgeschaltet und schützt
// dann gar nichts mehr (knowledge/02, Fehlerklasse 7.3). Die Bash-Lücke ist
// dokumentiertes Restrisiko; der Hook fängt den häufigsten Fehlerpfad, den
// naiven Standard-Tool-Aufruf.

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let ev;
  try {
    ev = JSON.parse(raw);
  } catch {
    // Kaputtes JSON ist nicht unser Fall — fail-open, der Hook ist
    // Kontextschutz, kein Sicherheitsprodukt.
    process.exit(0);
  }
  const tool = ev.tool_name || "";
  const inp = ev.tool_input || {};

  // Zu prüfende Felder je Tool. Bei Grep NUR das path-Feld — pattern ist ein
  // Regex über Dateiinhalte, und ein Suchmuster wie "harness-sources" in
  // erlaubten Verzeichnissen ist legitime Arbeit an der Regel selbst
  // (belegter Falsch-Positiv-Fall aus dem Prüflauf). Bei Glob zusätzlich
  // pattern, denn ein Glob-Pattern ist selbst ein Pfad.
  const kandidaten = [];
  if (tool === "Read") kandidaten.push(inp.file_path);
  else if (tool === "Grep") kandidaten.push(inp.path);
  else if (tool === "Glob") kandidaten.push(inp.path, inp.pattern);
  else process.exit(0);

  // Windows: Backslashes normalisieren, case-insensitiv vergleichen.
  const norm = (p) => String(p || "").replace(/\\/g, "/").toLowerCase();

  for (const k of kandidaten) {
    const p = norm(k);
    if (!p) continue;
    // Nur die Datei index.json sperren, nie das Verzeichnis catalog/ —
    // catalog/by-repo.md und catalog/by-domain/ sind die legitime Ebene 2.
    if (p.endsWith("catalog/index.json") || p.includes(".harness-sources")) {
      process.stderr.write(
        "Zugriff gesperrt (Kontextschutz: catalog/index.json hat ~20 MB, die " +
          "Klone unter .harness-sources sind Massenmaterial). Katalogzugriff " +
          "nur über: node tools/harness.mjs search|show|knowledge — siehe INDEX.md."
      );
      process.exit(2);
    }
  }
  process.exit(0);
});
