#!/usr/bin/env node
// Stop-Hook: macht aus der CLAUDE.md-Bitte "nach jeder Änderung lint" den
// Zwang, den Doktrin 1.1 verlangt — an der Stelle, an der die Bitte gemeint
// ist: bevor die Arbeit als abgeschlossen gilt, nicht nach jedem Tastendruck.
//
// Warum Stop statt PostToolUse pro Edit: lint liest tools/harness.mjs gar
// nicht — pro Edit gäbe es nur Stille, wiederholte Altbefunde oder
// Stacktraces halb editierter Zwischenstände. Ein konsolidierter Lauf pro
// Turn ordnet Befunde eindeutig der abgeschlossenen Änderung zu. Das Symptom
// ist belegt: acht widersprüchliche Bestandszahlen und die still verfallene
// 1.050 entstanden genau dann, wenn nichts den Abgleich erzwang. Präzedenz:
// cmdUpdate Schritt 4 koppelt den Exit-Code an den Eval-Lauf.
// (Prüflauf 2026-08-08; gemessen: lint Ø 338 ms, eval Ø 526 ms.)
//
// Was der Hook NICHT abdeckt: "einmal jeden Subcommand aufrufen" nach
// Werkzeugänderungen — das bleibt Pflicht des werkzeug-aenderer-Ablaufs.

import { execSync, spawnSync } from "node:child_process";

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let ev = {};
  try {
    ev = JSON.parse(raw);
  } catch {
    /* ohne Ereignisdaten unten weiter wie bei leerem Ereignis */
  }
  // Ohne diesen Guard hielte der Hook das Turn-Ende in einer Schleife fest:
  // sein eigenes Exit 2 löst den nächsten Stop aus.
  if (ev.stop_hook_active) process.exit(0);

  let status = "";
  try {
    status = execSync("git status --porcelain", { encoding: "utf8" });
  } catch {
    // Kein git verfügbar oder kein Repo — dann gibt es nichts zu prüfen.
    process.exit(0);
  }

  const geaendert = status
    .split("\n")
    .filter(Boolean)
    .map((z) => z.slice(3).replace(/\\/g, "/"));

  const werkzeug = geaendert.some((p) => p.includes("tools/harness.mjs"));
  const wissen = geaendert.some((p) =>
    /^(knowledge|recipes|catalog|evals)\/|^INDEX\.md/.test(p)
  );
  if (!werkzeug && !wissen) process.exit(0);

  // Werkzeug geändert → eval UND lint: Die Routing-Evals kodieren exakt die
  // Fehlerklasse, die früher durchrutschte (ODER-Suche, classify). lint dient
  // dabei als Smoke-Test — ein Syntaxfehler in harness.mjs lässt ihn crashen.
  const laeufe = werkzeug
    ? [["eval", "--no-save"], ["lint"]]
    : [["lint"]];

  const befunde = [];
  for (const args of laeufe) {
    const r = spawnSync("node", ["tools/harness.mjs", ...args], {
      encoding: "utf8",
      timeout: 60000,
    });
    if (r.status !== 0) {
      const text = ((r.stdout || "") + "\n" + (r.stderr || "")).trim();
      // Stacktraces und Volltext auf das Verwertbare kürzen — das Modell
      // braucht die Befundzeilen, nicht die Rohausgabe.
      const zeilen = text.split("\n").filter(Boolean).slice(0, 20);
      befunde.push(`>> ${args[0]} schlug fehl (Exit ${r.status}):\n${zeilen.join("\n")}`);
    }
  }

  if (befunde.length) {
    process.stderr.write(
      "Prüfpflicht (Stop-Hook): Änderungen im Arbeitsbaum, aber die Läufe sind rot.\n" +
        befunde.join("\n\n") +
        "\n\nBeheben, bevor der Turn endet — CLAUDE.md: der Lauf ist der Test."
    );
    process.exit(2);
  }
  process.exit(0);
});
