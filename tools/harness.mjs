#!/usr/bin/env node
/**
 * harness.mjs — CLI der Harness-Bibliothek.
 *
 * Aufgerufen von: den Skills `harness-update` und `harness-build`
 * (C:\Users\info\.claude\skills\...\SKILL.md) sowie direkt vom User.
 *
 * Subcommands: siehe `USAGE` und den `switch` am Dateiende. Hier stand einmal
 * eine dritte Kopie derselben Liste — sie war nach zwei neuen Befehlen falsch.
 * Der Dispatcher ist die Wahrheit; `USAGE` beschreibt ihn, `befehlsUebersicht()`
 * liest ihn für INDEX.md aus.
 *
 * Warum ein CLI statt "Claude liest die Repos":
 * Die Quellen umfassen >2000 Bausteine. Ein Agent, der die durchliest, hat sein
 * Kontextfenster voll, bevor er die erste Zeile Projektcode sieht. Das CLI hält
 * den Katalog ausserhalb des Kontexts und liefert nur die Treffer.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_FILE = path.join(ROOT, "sources.txt");
const CATALOG_DIR = path.join(ROOT, "catalog");
const INDEX_JSON = path.join(CATALOG_DIR, "index.json");
const CLONE_DIR =
  process.env.HARNESS_SOURCES ||
  path.join(process.env.USERPROFILE || process.env.HOME || ROOT, ".harness-sources");

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "out", "__pycache__", "venv", ".venv",
  "target", ".next", "coverage", ".pytest_cache", "vendor", ".turbo", "site-packages",
]);

/** Ab wie vielen Bausteinen ein Repo automatisch als "bulk" gilt.
 *  ecc liefert ~600 und soll voll sichtbar bleiben; das Rechts-Repo liefert
 *  ~24.500 und würde jede Suche unbrauchbar machen. */
const BULK_THRESHOLD = 2000;

// ---------------------------------------------------------------- Hilfsfunktionen

const rel = (p) => path.relative(CLONE_DIR, p).split(path.sep).join("/");
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function readSources() {
  if (!fs.existsSync(SOURCES_FILE)) die(`sources.txt fehlt: ${SOURCES_FILE}`);
  return fs
    .readFileSync(SOURCES_FILE, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line) => {
      // Marker `!bulk` / `!full` steuern, ob ein Repo im Hauptindex auftaucht.
      let bulk = null;
      const cleaned = line.replace(/\s*!(bulk|full)\b/i, (_, f) => { bulk = f.toLowerCase() === "bulk"; return ""; }).trim();
      const [url, branch] = cleaned.split("#").map((s) => s.trim());
      const m = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
      if (!m) return null;
      const [, owner, repo] = m;
      return { url, branch: branch || null, owner, repo, dir: `${owner}__${repo}`, bulk };
    })
    .filter(Boolean);
}

/**
 * Vertrauensstufen aus den Kommentarzeilen von `sources.txt`.
 *
 * Format: eine Zeile `# Vertrauen: offiziell | gepflegt | unbekannt — <Halbsatz>`
 * unmittelbar über der Repo-Zeile, auf die sie sich bezieht.
 *
 * Warum in einer eigenen Funktion und nicht in `readSources()`: dort hinge
 * `sync` und `extract` an einem Feld ohne jede Logik. Die Stufe ist eine Angabe
 * für Menschen — sie ändert keine Sortierung, keine Auswahl, keinen Punktwert.
 * Ein nachgebauter Vertrauens-Tiebreaker wurde ausprobiert und verworfen: er löste
 * die Dominanz eines grossen Repos nicht (die ist ein Bestandseffekt) und hob
 * dafür beschreibungslose Einträge nach oben.
 *
 * Fehlt die Zeile — heute bei allen Repos —, gibt `show` unverändert aus.
 */
function vertrauensstufen() {
  const out = new Map();
  if (!fs.existsSync(SOURCES_FILE)) return out;
  let offen = null;
  for (const roh of fs.readFileSync(SOURCES_FILE, "utf8").split(/\r?\n/)) {
    const l = roh.trim();
    if (!l) { offen = null; continue; }
    const v = l.match(/^#\s*Vertrauen:\s*(.+)$/i);
    if (v) { offen = v[1].trim(); continue; }
    if (l.startsWith("#")) continue;
    const m = l.match(/github\.com\/([^/]+)\/([^/.\s]+)/);
    if (m && offen) out.set(`${m[1]}__${m[2]}`, offen);
    offen = null;
  }
  return out;
}

function die(msg) {
  console.error("FEHLER: " + msg);
  process.exit(1);
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

/** YAML-Frontmatter aus einer Markdown-Datei. Bewusst simpel: wir brauchen nur
 *  Skalare (name, description, tools, model, ...). Verschachteltes YAML ignorieren wir. */
function frontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const out = {};
  let key = null;
  // CRLF-Dateien aus Windows-Checkouts: der Block-Schnitt über indexOf("\n---")
  // trifft auch bei "\r\n---" (das "\n" gehört zum "\r\n"), endet aber VOR dem
  // "\n" — die letzte Zeile des Blocks behält dadurch ihr "\r". Ohne den Strip
  // verfehlt der Zeilen-Regex sie ("." matcht kein "\r", kein m-Flag), und das
  // letzte Feld — in den Quell-Repos fast immer die description — geht still
  // verloren; der Baustein landet dann fälschlich in der Quarantäne oder mit
  // Prosa-Fallback im Katalog.
  for (const line of text.slice(3, end).split("\n").map((l) => l.replace(/\r$/, ""))) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) {
      key = m[1];
      let v = m[2].trim();
      if (/^["'].*["']$/.test(v)) v = v.slice(1, -1);
      out[key] = v;
    } else if (key && /^\s+\S/.test(line) && out[key] !== undefined) {
      // Fortsetzungszeile eines mehrzeiligen Werts
      out[key] = (out[key] + " " + line.trim()).trim();
    }
  }
  return out;
}

function firstHeading(text) {
  const m = text.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

/** Erste sinnvolle Prosa-Zeile — Fallback, wenn kein description-Frontmatter da ist.
 *  Die Quell-Repos kommen mit gemischten Zeilenenden; der Frontmatter-Block muss
 *  deshalb CRLF-tolerant abgeschnitten werden, sonst bleibt der Trenner `---`
 *  stehen und landet als Beschreibung im Katalog. */
function firstProse(text) {
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim().replace(/^>\s*/, "");
    if (!t || t === "---" || t.startsWith("#") || t.startsWith("```") || t.startsWith("<!--")) continue;
    const clean = t.replace(/[*_`]/g, "").trim();
    if (clean.length < 3) continue;
    return clean.slice(0, 300);
  }
  return null;
}

function walk(dir, fn, depth = 0) {
  if (depth > 8) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      fn(full, true);
      walk(full, fn, depth + 1);
    } else if (e.isFile()) {
      fn(full, false);
    }
  }
}

/**
 * Grösse, Dateizahl — und wie viele davon ausgeführt statt gelesen werden.
 *
 * `exec` wird hier mitgezählt, weil der Baum ohnehin abgelaufen wird. Es ist
 * bewusst nur die **Zahl** und bewusst nur nach Endung: der Fundort mit
 * Zeilennummer und die Mustersuche bleiben, wo sie hingehören — in `inspectItem()`
 * zur Installationszeit, wo eine geänderte Musterliste sofort wirkt und keinen
 * Katalogneubau erzwingt. Was der Katalog trägt, ist die eine Angabe, die vor der
 * Auswahl gebraucht wird und sich nur mit dem Bestand ändert: bringt dieser
 * Baustein Code mit, oder ist er Text?
 */
function dirSize(dir) {
  let bytes = 0, files = 0, exec = 0;
  walk(dir, (p, isDir) => {
    if (isDir) return;
    try { bytes += fs.statSync(p).size; files++; } catch { /* egal */ }
    if (EXEC_EXT.test(path.basename(p))) exec++;
  });
  return { bytes, files, exec };
}

// ---------------------------------------------------------------- Domain-Klassifikation

/** Warum Domains: Der Bauplan-Agent sucht nie "alle Skills", sondern
 *  "was hilft mir bei X". Domain ist der erste, billigste Filter. */
const DOMAIN_RULES = [
  ["legal-de", /\b(recht|gesetz|bgb|hgb|gmbh|anwalt|mandant|schriftsatz|klage|urteil|arbeitszeugnis|dsgvo|agb|kanzlei|gericht|straf|miet|erb|steuer|notar|betriebsrat|insolvenz)\b/i],
  ["security", /\b(security|pentest|vuln|exploit|xss|sqli|owasp|ssrf|auth|secret|cve|threat|hardening|audit-log)\b/i],
  ["seo", /\b(seo|serp|backlink|keyword|schema\.org|sitemap|geo|e-e-a-t|crawl|indexation|search console|hreflang)\b/i],
  ["frontend", /\b(react|vue|svelte|next\.?js|nuxt|tailwind|css|ui|ux|component|design system|animation|motion|accessib|a11y|frontend|shadcn)\b/i],
  ["backend", /\b(api|rest|graphql|database|sql|postgres|mysql|redis|orm|prisma|migration|backend|server|microservice|queue|grpc)\b/i],
  ["devops", /\b(docker|kubernetes|k8s|ci\/cd|deploy|terraform|helm|pipeline|github action|monitoring|observab|infra)\b/i],
  ["testing", /\b(test|tdd|e2e|playwright|jest|vitest|pytest|coverage|regression|qa\b|mock)\b/i],
  ["data-ai", /\b(llm|prompt|embedding|rag|vector|knowledge graph|ml\b|model|dataset|fine-?tun|inference|pytorch|agent)\b/i],
  ["docs", /\b(documentation|docs|readme|changelog|adr|writing|article|blog|technical writ)\b/i],
  ["meta", /\b(skill-creator|harness|orchestrat|subagent|hook|slash command|mcp server|plugin|claude code|context window|evaluat)\b/i],
  ["product", /\b(product|roadmap|prd|user story|stakeholder|market|competitor|brand|pricing|growth)\b/i],
  ["media", /\b(image|video|audio|render|figma|canva|pdf|docx|pptx|xlsx|screenshot)\b/i],
];

/**
 * Domäne aus Name und Beschreibung bestimmen. Der Pfad ist bewusst nur
 * Rückfallebene: Ein Skill, der zufällig unter `docs/` liegt, ist deswegen kein
 * Dokumentations-Skill. Als gleichberechtigtes Signal gewertet, kippte der Pfad
 * ganze Verzeichnisbäume in die falsche Domäne.
 */
function classify(name, description, pathHint, ...extra) {
  const primary = [name, description, ...extra].filter(Boolean).join(" ");
  const hits = DOMAIN_RULES.filter(([, re]) => re.test(primary)).map(([d]) => d);
  if (hits.length) return hits;

  const fromPath = DOMAIN_RULES.filter(([, re]) => re.test(String(pathHint || ""))).map(([d]) => d);
  return fromPath.length ? fromPath : ["general"];
}

// ---------------------------------------------------------------- sync

function cmdSync() {
  const sources = readSources();
  fs.mkdirSync(CLONE_DIR, { recursive: true });
  const report = [];

  for (const s of sources) {
    const dest = path.join(CLONE_DIR, s.dir);
    try {
      if (fs.existsSync(path.join(dest, ".git"))) {
        const before = git(["rev-parse", "HEAD"], dest);
        // Auch bestehende Klone brauchen die Einstellung — sie wurden womöglich
        // ohne sie angelegt, und `reset --hard` scheitert dann an jedem zu langen
        // Pfad. Ohne diese Zeile blieb ein Repo dauerhaft auf altem Stand.
        try { git(["config", "core.longpaths", "true"], dest); } catch { /* egal */ }
        git(["fetch", "--depth", "1", "origin"], dest);
        const branch = s.branch || git(["symbolic-ref", "--short", "HEAD"], dest);
        git(["reset", "--hard", `origin/${branch}`], dest);
        const after = git(["rev-parse", "HEAD"], dest);
        report.push({ repo: s.dir, status: before === after ? "unchanged" : "updated", before, after });
        console.log(`${before === after ? "  =" : "  ^"} ${s.dir}`);
      } else {
        // `core.longpaths` beim Klonen setzen, nicht danach: Windows bricht sonst
        // schon beim ersten Auschecken ab. Das Rechts-Repo hat Pfade wie
        // `arbeitszeugnisgenerator/testakte/.../06-reinhilde-eisentraeger-…` und
        // reisst damit die 260-Zeichen-Grenze — der Klon schlug fehl, das Repo
        // fror auf altem Stand ein, und im Changelog ging es zwischen den anderen
        // Meldungen unter. Auf Nicht-Windows ist die Option wirkungslos.
        const args = ["-c", "core.longpaths=true", "clone", "--depth", "1", "--quiet"];
        if (s.branch) args.push("--branch", s.branch);
        args.push(s.url, dest);
        execFileSync("git", args, { stdio: ["ignore", "pipe", "pipe"] });
        report.push({ repo: s.dir, status: "new", after: git(["rev-parse", "HEAD"], dest) });
        console.log(`  + ${s.dir} (neu)`);
      }
    } catch (e) {
      report.push({ repo: s.dir, status: "error", error: String(e.message || e).slice(0, 200) });
      console.log(`  ! ${s.dir} — ${String(e.message || e).split("\n")[0]}`);
    }
  }

  // Verwaiste Klone melden (Repo aus sources.txt entfernt), aber nie automatisch löschen.
  const known = new Set(sources.map((s) => s.dir));
  for (const d of fs.existsSync(CLONE_DIR) ? fs.readdirSync(CLONE_DIR) : []) {
    if (!known.has(d) && fs.statSync(path.join(CLONE_DIR, d)).isDirectory()) {
      report.push({ repo: d, status: "orphan" });
      console.log(`  ? ${d} — nicht mehr in sources.txt (bleibt liegen)`);
    }
  }

  // Ein fehlgeschlagenes Repo friert still auf altem Stand ein. Das ist
  // gefährlicher als ein Abbruch: der Katalog sieht vollständig aus, enthält aber
  // Bausteine, die es im Original längst nicht mehr gibt — genau so zeigten vier
  // Rezept-IDs auf Skills, die ein Repo umbenannt hatte. Die Zeile weiter oben
  // ging zwischen dreizehn anderen unter, deshalb hier noch einmal am Stück.
  const fehler = report.filter((r) => r.status === "error");
  if (fehler.length) {
    console.log(`\n  ${fehler.length} Repo(s) NICHT aktualisiert — der Katalog zeigt für sie einen alten Stand:`);
    for (const f of fehler) {
      console.log(`      ${f.repo}`);
      console.log(`        ${String(f.error).split("\n")[0].slice(0, 120)}`);
    }
    console.log("  Bis das behoben ist, können Bausteine dieser Repos im Katalog stehen,");
    console.log("  die es im Original nicht mehr gibt.");
  }
  return report;
}

// ---------------------------------------------------------------- extract

/** Übersetzte Spiegelungen eines Bausteins. Mehrere Repos legen unter
 *  `docs/ja-JP/skills/...` Übersetzungen ab. Die tragen dieselbe ID wie das
 *  Original — wer zuerst gewalkt wird, gewinnt, und dann steht eine japanische
 *  Beschreibung im Katalog, die keine Suche mehr findet. */
const TRANSLATION_RE = /(^|\/)(docs\/)?(translations?|i18n|locales?|[a-z]{2}-[A-Z]{2})(\/|$)/;
const isTranslation = (p) => TRANSLATION_RE.test(p);

/** Platzhalter-Dateien, die nur ankündigen, dass eine Übersetzung fehlt.
 *  Sie belegen sonst Trefferplätze, ohne Inhalt zu haben. */
function isPlaceholder(text, bytes) {
  if (bytes > 1500) return false;
  return /翻訳|需要翻译|번역|traducción pendiente|translation needed|needs translation/i.test(text);
}

function extractRepo(repoDir, repoName) {
  const items = [];
  const seen = new Map();

  const add = (it) => {
    const prev = seen.get(it.id);
    if (prev) {
      // Ein Original ersetzt eine bereits erfasste Übersetzung — umgekehrt nie.
      if (isTranslation(prev.path) && !isTranslation(it.path)) Object.assign(prev, it);
      return;
    }
    seen.set(it.id, it);
    items.push(it);
  };

  walk(repoDir, (full, isDir) => {
    const r = rel(full);
    const base = path.basename(full);

    // --- Skills: erkennbar an SKILL.md ---
    if (!isDir && base.toLowerCase() === "skill.md") {
      const text = safeRead(full);
      const fm = frontmatter(text);
      const skillDir = path.dirname(full);
      const name = fm.name || path.basename(skillDir);
      const size = dirSize(skillDir);
      if (isPlaceholder(text, size.bytes)) return;
      add({
        id: `${repoName}/skill/${slug(name)}`,
        type: "skill",
        name,
        repo: repoName,
        description: fm.description || firstProse(text) || firstHeading(text) || "",
        path: rel(skillDir),
        entry: r,
        bytes: size.bytes,
        // Was beim Greifen **sofort** in den Kontext geht: die SKILL.md, nicht der
        // Ordner. `references/` und `assets/` werden erst gelesen, wenn der Skill
        // sie nennt — oder nie. Beide Zahlen zu führen ist der Punkt: `bytes`
        // beantwortet "was kopiere ich", `entryBytes` "was kostet es mich".
        entryBytes: safeSize(full),
        files: size.files,
        exec: size.exec,
        meta: pick(fm, ["allowed-tools", "argument-hint", "model", "license", "version"]),
        domains: classify(name, fm.description, r),
      });
      return;
    }

    if (isDir) return;
    if (!/\.(md|json|ya?ml|js|mjs|ts|py|sh|ps1)$/i.test(base)) return;

    const parent = path.basename(path.dirname(full));
    const parentPath = path.dirname(full);

    // --- Agents: agents/<name>.md ---
    if (/^agents?$/i.test(parent) && /\.md$/i.test(base) && !/^readme\.md$/i.test(base)) {
      const text = safeRead(full);
      const fm = frontmatter(text);
      const name = fm.name || base.replace(/\.md$/i, "");
      add({
        id: `${repoName}/agent/${slug(name)}`,
        type: "agent",
        name,
        repo: repoName,
        description: fm.description || firstProse(text) || "",
        path: r,
        entry: r,
        bytes: safeSize(full),
        files: 1,
        meta: pick(fm, ["tools", "model", "color"]),
        domains: classify(name, fm.description, r),
      });
      return;
    }

    // --- Commands: commands/<name>.md ---
    if (/^commands?$/i.test(parent) && /\.md$/i.test(base) && !/^readme\.md$/i.test(base)) {
      const text = safeRead(full);
      const fm = frontmatter(text);
      const name = fm.name || base.replace(/\.md$/i, "");
      add({
        id: `${repoName}/command/${slug(name)}`,
        type: "command",
        name,
        repo: repoName,
        description: fm.description || firstProse(text) || firstHeading(text) || "",
        path: r,
        entry: r,
        bytes: safeSize(full),
        files: 1,
        meta: pick(fm, ["allowed-tools", "argument-hint", "model"]),
        domains: classify(name, fm.description, r),
      });
      return;
    }

    // --- Hooks: hooks/<datei> ---
    // Der Ordnername allein reicht nicht: In React-Projekten heisst `hooks/`
    // das Verzeichnis für useXyz-Hooks, und Test-Suites legen ihre Fixtures
    // daneben. Beides sind keine Claude-Code-Lifecycle-Hooks. Deshalb wird
    // zusätzlich der Inhalt geprüft.
    if (/^hooks?$/i.test(parent) && !/^readme/i.test(base) && isClaudeHook(full, base)) {
      const text = safeRead(full);
      const fm = frontmatter(text);
      const name = fm.name || base.replace(/\.[^.]+$/, "");
      add({
        id: `${repoName}/hook/${slug(name)}`,
        type: "hook",
        name,
        repo: repoName,
        description: fm.description || hookDescription(text) || "",
        path: r,
        entry: r,
        bytes: safeSize(full),
        files: 1,
        meta: pick(fm, ["event", "matcher"]),
        domains: classify(name, fm.description, r, text.slice(0, 400)),
      });
      return;
    }

    // --- MCP-Server-Konfigurationen ---
    if (/^(\.mcp\.json|mcp\.json)$/i.test(base) || (/^mcp$/i.test(parent) && /\.json$/i.test(base))) {
      const text = safeRead(full);
      let servers = [];
      try {
        const j = JSON.parse(text);
        servers = Object.keys(j.mcpServers || j.servers || {});
      } catch { /* kaputtes JSON ignorieren */ }
      add({
        id: `${repoName}/mcp/${slug(base.replace(/\.json$/i, "")) || "config"}`,
        type: "mcp",
        name: base,
        repo: repoName,
        description: servers.length ? `MCP-Server: ${servers.join(", ")}` : "MCP-Konfiguration",
        path: r,
        entry: r,
        bytes: safeSize(full),
        files: 1,
        meta: { servers: servers.join(",") },
        domains: ["meta"],
      });
      return;
    }

    // --- Plugin-Manifeste ---
    if (/^plugin\.json$/i.test(base) && /\.claude-plugin$/i.test(parent)) {
      const text = safeRead(full);
      let j = {};
      try { j = JSON.parse(text); } catch { /* egal */ }
      const pluginRoot = path.dirname(parentPath);
      const size = dirSize(pluginRoot);
      add({
        id: `${repoName}/plugin/${slug(j.name || path.basename(pluginRoot))}`,
        type: "plugin",
        name: j.name || path.basename(pluginRoot),
        repo: repoName,
        description: j.description || "Claude-Code-Plugin",
        path: rel(pluginRoot),
        entry: r,
        bytes: size.bytes,
        files: size.files,
        exec: size.exec,
        meta: pick(j, ["version", "author"]),
        domains: classify(j.name, j.description, r),
      });
      return;
    }

    // --- Freistehende Agent-Definitionen ---
    // Nicht jedes Repo legt Agents in einen `agents/`-Ordner. msitarzewski/agency-agents
    // etwa sortiert 316 Personas nach Fachgebiet (`design/ui-designer.md`).
    // Erkennungsmerkmal ist deshalb das Frontmatter, nicht der Pfad: name + description
    // plus mindestens ein agent-typisches Feld. Ohne dieses Zusatzsignal würden
    // beliebige Doku-Seiten mit Frontmatter als Agents durchgehen.
    if (/\.md$/i.test(base) && !/^(readme|contributing|license|licence|changelog|code_of_conduct|security|agents|claude|architecture|benchmarks|notice)\.md$/i.test(base)) {
      const text = safeRead(full);
      if (!text.startsWith("---")) return;
      const fm = frontmatter(text);
      if (!fm.name || !fm.description) return;
      const agentSignal = fm.tools || fm.model || fm.color || fm.emoji || fm.vibe || fm.persona;
      if (!agentSignal) return;
      add({
        id: `${repoName}/agent/${slug(fm.name)}`,
        type: "agent",
        name: fm.name,
        repo: repoName,
        description: fm.description,
        path: r,
        entry: r,
        bytes: safeSize(full),
        files: 1,
        meta: pick(fm, ["tools", "model", "color"]),
        domains: classify(fm.name, fm.description, r),
      });
    }
  });

  return items;
}

const pick = (o, keys) => {
  const out = {};
  for (const k of keys) if (o && o[k] != null && o[k] !== "") out[k] = String(o[k]).slice(0, 200);
  return out;
};
const safeRead = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const safeSize = (p) => { try { return fs.statSync(p).size; } catch { return 0; } };

/** Lifecycle-Ereignisse, an denen Claude Code Hooks aufruft. Ihr Vorkommen ist
 *  das verlässlichste Signal dafür, dass eine Datei wirklich ein Hook ist. */
const HOOK_EVENTS = /\b(PreToolUse|PostToolUse|UserPromptSubmit|SubagentStop|SessionStart|SessionEnd|PreCompact|Notification|hookSpecificOutput|permissionDecision)\b/;

function isClaudeHook(full, base) {
  // React-Hooks (useAuth.ts, useDebounce.tsx) und Testdateien fliegen sofort raus.
  if (/^use[A-Z]/.test(base) && /\.(t|j)sx?$/i.test(base)) return false;
  if (/([-_.](test|spec)\.|\.(test|spec)\.)/i.test(base)) return false;
  if (/[-_](test|spec)\.[^.]+$/i.test(base)) return false;

  // In `.claude/hooks/` ist die Zugehörigkeit durch den Ort belegt.
  if (full.split(/[\\/]/).includes(".claude")) return true;

  const text = safeRead(full);
  if (!text) return false;
  if (HOOK_EVENTS.test(text)) return true;
  // Shell-Skripte mit Shebang, die stdin lesen, sind das klassische Hook-Muster.
  return /^#!.*\b(bash|sh|python|node)\b/.test(text) && /stdin|process\.stdin|sys\.stdin|read -r/.test(text);
}

function hookDescription(text) {
  // Reihenfolge (nach Frontmatter, das im Aufrufer immer zuerst greift):
  //   1. JSON-Top-Level-"description" — JSON kennt keine Kommentare, das Feld
  //      ist der einzige Ort, an dem eine hooks.json sich beschreiben kann.
  //   2. Blockkommentar/Docstring am Dateianfang (leadingBlockDescription) —
  //      VOR der Zeilenkommentar-Suche, denn wer seine Datei per JSDoc oder
  //      Docstring dokumentiert, hat den ersten #/-Zeilenkommentar tief im
  //      Rumpf, und der ist dort ein Abschnittstrenner, kein Summary: am
  //      Bestand belegt durch security_reminder_hook.py ("# Architecture"),
  //      diffstate.py ("====="), review_api.py ("-----"). Ein Zeilenkommentar
  //      VOR dem Block gewinnt weiterhin, weil der Block dann nicht mehr am
  //      Dateianfang steht — bestehende gute Descriptions bleiben unberührt.
  //   3. Erster #/-Zeilenkommentar wie bisher.
  // Die Shebang ist keine Beschreibung: 56 Hooks trugen "!/usr/bin/env ..." als
  // Description und waren damit fürs Routing wertlos (knowledge/04, 3.2).
  // Findet sich nichts, ist eine leere Description ehrlicher als die Shebang.
  if (text.trimStart().startsWith("{")) {
    try {
      const j = JSON.parse(text);
      if (typeof j.description === "string" && j.description.trim()) {
        return j.description.trim().slice(0, 200);
      }
    } catch { /* kein valides JSON — dann greifen die Kommentar-Wege unten */ }
  }

  const block = leadingBlockDescription(text);
  if (block) return block;

  for (const m of text.matchAll(/^\s*(?:#|\/\/)\s*(.+)$/gm)) {
    if (/^\s*#!/.test(m[0])) continue;
    return m[1].slice(0, 200);
  }
  return null;
}

/**
 * Erste inhaltstragende Zeile eines Blockkommentars (JSDoc, C-Stil) oder
 * Python-Docstrings, aber nur wenn der Block am Dateianfang steht — Shebang,
 * BOM und PEP-263-Encoding-Zeile dürfen davor stehen, sonst nichts. Die
 * Beschränkung auf den Dateianfang ist die Konservativitäts-Garantie: ein
 * Block mitten in der Datei ist Implementierungs-Doku, kein Datei-Summary,
 * und jede Datei, die heute über führende Zeilenkommentare beschrieben ist,
 * behält ihre Description unverändert.
 */
function leadingBlockDescription(text) {
  let rest = text.replace(/^\uFEFF/, "").replace(/^#![^\n]*\n/, "");
  // PEP 263: "# -*- coding: utf-8 -*-" steht bei Python-Dateien zwischen
  // Shebang und Docstring und wäre sonst faelschlich der "erste Kommentar".
  rest = rest.replace(/^#[^\n]*coding[:=][^\n]*\n/, "").replace(/^\s+/, "");

  let body = null;
  let m = /^\/\*+([\s\S]*?)\*\//.exec(rest);
  if (m) body = m[1];
  else if ((m = /^("""|''')([\s\S]*?)\1/.exec(rest))) body = m[2];
  if (body == null) return null;

  for (const raw of body.split("\n")) {
    const line = raw.replace(/^\s*\*+\s?/, "").trim();
    if (!line) continue;
    // @tags (JSDoc-Metadaten, @ts-nocheck) und Linter-Pragmas beschreiben das
    // Werkzeug-Setup, nicht die Datei; Lizenzköpfe beschreiben das Recht an
    // der Datei — beides wäre fürs Routing Rauschen mit Wortinhalt, das die
    // Quarantäne-Prüfung nicht mehr abfangen könnte.
    if (line.startsWith("@")) continue;
    if (/^(eslint|jshint|jslint|prettier|biome|istanbul|globals?\b)/i.test(line)) continue;
    if (/^(copyright|licen[cs]e|spdx-|all rights reserved)/i.test(line)) continue;
    // Dieselbe Wortinhalt-Schwelle wie quarantaeneGrund(): reine Trennzeilen
    // ("=====", "-----") sollen hier gar nicht erst Description werden.
    if (!/\p{L}{3}/u.test(line)) continue;
    return line.slice(0, 200);
  }
  return null;
}

/**
 * Quarantäne (M2, knowledge/04): liefert den Grund, warum ein Baustein aus der
 * Standardsuche fällt, oder null. Ein Eintrag ohne verwertbare Description ist
 * fürs Routing wertlos — er belegt einen Trefferplatz als "(keine
 * Beschreibung)", den niemand begründet wählen kann. Er bleibt aber
 * katalogisiert: `show` löst ihn auf und nennt den Grund, `--all` zeigt ihn.
 *
 * Bewusst nur harte, inhaltsfreie Kriterien — eine Fehlklassifikation in die
 * Quarantäne wiegt schwerer als ein sichtbarer Rausch-Eintrag, denn den Rausch
 * sieht man, die Lücke nicht:
 *   1. leere Description (nach der Shebang-Reparatur in hookDescription() der
 *      ehrliche Zustand kommentarloser Skripte),
 *   2. kein Buchstaben-Lauf ab drei Zeichen — fängt ####, =====, -----;
 *      \p{L} statt [a-z], damit CJK-Beschreibungen NICHT hineinfallen. Diese
 *      Sicherheit gilt nur für Zeichen-Läufe ab drei OHNE Leerzeichen: eine
 *      CJK-Description, die ausschliesslich aus Zweizeichen-Wörtern mit
 *      Leerzeichen dazwischen besteht, fiele in die Quarantäne — wer die
 *      Heuristik verschärft, muss diesen Fall zuerst absichern.
 * Fragmente wie "continue" oder "gitutil" bleiben sichtbar: dafür gäbe es nur
 * eine Geschmacks-Heuristik, kein hartes Kriterium. Übersetzungs-Platzhalter
 * (isPlaceholder) erreichten den Katalog am Messtag 2026-08-10 in null Fällen —
 * deshalb prüft hier niemand zum zweiten Mal auf sie.
 */
function quarantaeneGrund(description) {
  const d = String(description || "").trim();
  if (!d) return "leere Description — kein Suchwort kann diesen Eintrag treffen";
  if (!/\p{L}{3}/u.test(d)) return "Description ohne Wortinhalt (nur Trenn-/Sonderzeichen)";
  return null;
}

/**
 * M11 (knowledge/04-governance.md, Abschnitt 5.5 "Coherence"): vier
 * Bestandshygiene-Kennzahlen, erhoben bei jedem `extract` (auch als
 * Teilschritt von `update`) und als Zeitreihe ins CHANGELOG.md geschrieben.
 *
 * Nenner ist bewusst "ohne Bulk/Massen-Repos" und NICHT "ohne Quarantäne" wie
 * in cmdStats(): Kennzahl 1 zählt genau die Quarantäne-Fälle (M2), und ein
 * Nenner, der sie vorher schon herausfiltert, würde diese Kennzahl für immer
 * auf 0 zwingen — sie soll aber zeigen, wenn ein neues Repo den Anteil nach
 * oben treibt.
 *
 * Reine Berechnung ohne I/O — das Schreiben übernehmen die Aufrufer
 * (cmdExtract, cmdUpdate), damit diese Funktion auch für eine Vorschau ohne
 * Seiteneffekt nutzbar bleibt.
 */
function katalogHygiene(catalog) {
  const nichtBulk = catalog.items.filter((i) => !i.bulk);
  const nenner = nichtBulk.length;
  const tausender = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Kennzahl 1: dieselbe Funktion wie die M2-Quarantäne selbst — keine zweite,
  // abweichende Definition von "brauchbar". `it.quarantaene` steht hier schon,
  // cmdExtract ruft quarantaeneGrund() für jedes Item vor diesem Aufruf.
  const ohneBeschreibung = nichtBulk.filter((i) => i.quarantaene).length;

  // Kennzahl 2: classify() sammelt ALLE passenden DOMAIN_RULES in ein Array,
  // nicht nur die erste — ein Baustein trägt also messbar mehr als eine
  // Domäne, gemessen bis zu sechs gleichzeitig (2026-08-10). Die "?" in der
  // ursprünglichen Spezifikation war Unwissen, keine strukturelle Grenze.
  const mehrAls3Domaenen = nichtBulk.filter((i) => (i.domains || []).length > 3).length;

  // Kennzahl 3: 'general' ist genau der Auffangfall aus classify() — keine
  // DOMAIN_RULES-Regel hat gegriffen.
  const general = nichtBulk.filter((i) => (i.domains || []).includes("general")).length;

  // Kennzahl 4: IDs sind `repo/typ/slug`, deterministisch (knowledge/08). Eine
  // Namensgruppe ist ein Slug, der mehr als einmal vorkommt; "repoübergreifend"
  // heisst, die Träger stammen aus mehr als einem Repo. Slug + verschiedene
  // Typen *desselben* Repos (z.B. Skill und Command "code-review") ist ein
  // gewollter Typ-Satz — der zählt hier bewusst nicht mit, nur die Streuung
  // über Repo-Grenzen wird berichtet.
  const traegerJeSlug = new Map();
  for (const i of nichtBulk) {
    const teile = String(i.id).split("/");
    const s = teile[teile.length - 1];
    if (!traegerJeSlug.has(s)) traegerJeSlug.set(s, []);
    traegerJeSlug.get(s).push(teile[0]);
  }
  let namensdublettenUeberRepos = 0;
  for (const repos of traegerJeSlug.values()) {
    if (repos.length < 2) continue; // Slug kommt nur einmal vor -> keine Gruppe
    if (new Set(repos).size > 1) namensdublettenUeberRepos++;
  }

  const zeile = (label, n, zielProzent) => {
    const p = nenner ? (n / nenner) * 100 : 0;
    if (zielProzent == null) return `  ${label.padEnd(34)}${String(n).padStart(4)}  ← nur berichten`;
    const proz = `(${p.toFixed(1).replace(".", ",")} %)`;
    // Sichtbar machen statt sperren (M11-Vorgabe): kein Exit-Code hängt daran.
    const ueber = p >= zielProzent ? "  !  über Ziel" : "";
    return `  ${label.padEnd(34)}${String(n).padStart(4)}  ${proz.padEnd(9)}← Ziel: < ${zielProzent} %${ueber}`;
  };

  // B1 (externe Prüfung, 2026-08-10): "im Standardzugriff" hiess in cmdStats()
  // und INDEX.md schon etwas anderes (!bulk && !quarantaene, 1.091) — zwei
  // generierte Artefakte desselben Laufs, derselbe Begriff, zwei Zahlen. Die
  // Nenner-Entscheidung (siehe Funktionskopf) war richtig, stand aber nur in
  // einem Kommentar, nicht im Artefakt selbst. Die Formel im Etikett macht sie
  // an Ort und Stelle nachprüfbar, ohne den Code lesen zu müssen.
  return [
    `Katalog-Hygiene ${String(catalog.generatedAt || "").slice(0, 10)} (Nenner: ${tausender(nenner)} = Standardzugriff + Quarantäne, ohne Massen-Repos):`,
    zeile("ohne brauchbare Description", ohneBeschreibung, 5),
    zeile("mit mehr als 3 Domänen", mehrAls3Domaenen, 10),
    zeile("in Domäne 'general' (Auffang)", general, 15),
    zeile("Namensdubletten über Repos", namensdublettenUeberRepos, null),
  ];
}

function cmdExtract({ quiet = false, viaUpdate = false } = {}) {
  if (!fs.existsSync(CLONE_DIR)) die(`Keine Klone unter ${CLONE_DIR} — erst 'sync' laufen lassen.`);
  const sources = readSources();
  const all = [];
  const repos = [];

  for (const s of sources) {
    const dir = path.join(CLONE_DIR, s.dir);
    if (!fs.existsSync(dir)) {
      if (!quiet) console.log(`  - ${s.dir} (nicht geklont, übersprungen)`);
      continue;
    }
    const items = extractRepo(dir, s.dir);

    // Massen-Repos (z.B. 24.000 Rechts-Skills) würden jeden Index und jede Suche
    // dominieren. Sie bleiben katalogisiert, aber ausserhalb der Standardsicht:
    // erreichbar nur über --repo / --domain / --all. Steuerbar per `!bulk` / `!full`
    // in sources.txt, sonst automatisch ab BULK_THRESHOLD.
    const isBulk = s.bulk !== null ? s.bulk : items.length >= BULK_THRESHOLD;
    if (isBulk) for (const it of items) it.bulk = true;

    // M2: Der Grund wandert als Feld in den Katalog, nicht nur ein Flag —
    // `show` soll sagen können, *warum* ein Eintrag nicht in der Suche ist,
    // sonst sieht Quarantäne wie ein Katalogfehler aus.
    let quarantaeneN = 0;
    for (const it of items) {
      const grund = quarantaeneGrund(it.description);
      if (grund) { it.quarantaene = grund; quarantaeneN++; }
    }

    let head = null, date = null;
    try {
      head = git(["rev-parse", "--short", "HEAD"], dir);
      date = git(["log", "-1", "--format=%cI"], dir);
    } catch { /* egal */ }
    repos.push({
      dir: s.dir, url: s.url, owner: s.owner, repo: s.repo,
      head, lastCommit: date, count: items.length, bulk: isBulk,
      byType: countBy(items, "type"),
      domains: topDomains(items),
    });
    all.push(...items);
    if (!quiet) console.log(`  . ${s.dir}: ${items.length} Bausteine${isBulk ? "  [bulk — nur per --repo/--domain sichtbar]" : ""}${quarantaeneN ? `  [${quarantaeneN} in Quarantäne — Description unbrauchbar]` : ""}`);
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    cloneDir: CLONE_DIR,
    totals: { items: all.length, ...countBy(all, "type") },
    repos,
    items: all.sort((a, b) => a.id.localeCompare(b.id)),
  };

  fs.mkdirSync(CATALOG_DIR, { recursive: true });
  fs.writeFileSync(INDEX_JSON, JSON.stringify(catalog, null, 1));
  writeMarkdownIndexes(catalog);
  if (!quiet) console.log(`\n  ${all.length} Bausteine -> catalog/index.json`);

  // M11: Hygiene läuft hier und nicht erst in cmdUpdate(), damit ein `extract`
  // ohne vorausgehendes `update` denselben Befund liefert — sonst verstummt
  // der Coherence-Check genau dann, wenn jemand nur den Katalog neu baut.
  const hygieneZeilen = katalogHygiene(catalog);
  if (!quiet) { console.log(); for (const z of hygieneZeilen) console.log(z); }
  if (!viaUpdate) {
    // cmdUpdate() schreibt sein eigenes, umfangreicheres Änderungsprotokoll
    // (Repo-Diff, Eval-Bilanz) und übernimmt den Hygiene-Block dort hinein;
    // dieser Zweig deckt nur den Fall ab, dass `extract` direkt läuft — sonst
    // gäbe es für ihn nirgends einen Changelog-Eintrag.
    const cl = path.join(ROOT, "CHANGELOG.md");
    const head = "# Changelog der Harness-Bibliothek\n\nNeueste Einträge oben. Erzeugt von `/harness-update`.\n\n";
    const old = fs.existsSync(cl) ? fs.readFileSync(cl, "utf8").replace(head, "") : "";
    const stamp = catalog.generatedAt.slice(0, 16).replace("T", " ");
    const block = [`## ${stamp} — extract (ohne update)`, "", ...hygieneZeilen, ""].join("\n");
    fs.writeFileSync(cl, head + block + "\n---\n\n" + old);
  }
  return catalog;
}

function countBy(items, key) {
  const out = {};
  for (const i of items) out[i[key]] = (out[i[key]] || 0) + 1;
  return out;
}

function topDomains(items) {
  const c = {};
  for (const i of items) for (const d of i.domains) c[d] = (c[d] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([d, n]) => `${d}:${n}`);
}

// ---------------------------------------------------------------- Markdown-Indizes

const short = (s, n) => {
  const t = String(s || "").replace(/\s+/g, " ").replace(/\|/g, "/").trim();
  return t.length > n ? t.slice(0, n - 1) + "\u2026" : t;
};

/**
 * Die Befehlsliste für INDEX.md — gelesen aus dem Dispatcher, nicht gepflegt.
 *
 * Warum: Eine Handliste wäre die dritte Stelle, an der dieselben elf Namen
 * stehen (Dispatcher, USAGE, INDEX), und die erste, die vergessen wird. Ein
 * dokumentierter Befehl, den es nicht gibt, ist schlimmer als ein
 * undokumentierter. Hier steht deshalb nur der *Zweck* von Hand; welche Befehle
 * es gibt, entscheidet allein `cliOberflaeche()`. Ein neuer Subcommand ohne
 * Zweckzeile taucht trotzdem auf — sichtbar unbeschrieben statt unsichtbar.
 *
 * Bewusst ohne Flaggen: die ändern sich häufiger als die Namen und stehen
 * vollständig im Aufruf ohne Argument. Zwei Quellen für dieselbe Flagge sind
 * eine Quelle zu viel.
 */
function befehlsUebersicht() {
  const zweck = {
    search:    ["Katalog durchsuchen", "der übliche Einstieg"],
    show:      ["Detail zu einem Baustein", "vor dem Installieren"],
    intent:    ["Absicht statt Stichwort suchen", "hinterlegte Suchen + Anker aus catalog/intents.yaml, M9"],
    install:   ["Baustein(e) ins Zielprojekt kopieren", "meldet danach, was wirkt und was nicht"],
    uninstall: ["Bausteine wieder entfernen", "genau die Dateien aus dem Manifest, nichts sonst"],
    bootstrap: ["nur die Zugriffsregel schreiben", "in die CLAUDE.md eines Projekts, ohne Bausteine"],
    knowledge: ["die Wissensbank befragen", "liefert Abschnitte, nicht Dateien — auch `know`, `why`"],
    lint:      ["Wissensbank und Nähte prüfen", "tote Verweise, abgelaufene Metadaten, falsche IDs"],
    eval:      ["Routing-Evals fahren", "findet die Suche noch, was sie finden soll — läuft als Schritt 4 von `update` mit"],
    list:      ["zeigt, was in einem Zielprojekt liegt", "aus dessen Manifest, mit heutigem Wirksamkeitszustand"],
    stats:     ["Bestandszahlen", "die Quelle für jede Zahl, die man über den Katalog sagt"],
    update:    ["Repos pullen + Katalog neu bauen", "dauert Minuten, schreibt den Katalog neu"],
    sync:      ["nur Repos pullen/klonen", "Teilschritt von `update`"],
    extract:   ["nur Katalog neu bauen", "Teilschritt von `update`"],
  };
  const alias = new Set(["know", "why"]);
  const vorhanden = cliOberflaeche().subcommands;

  const out = ["## Die Befehle", "",
    "Aus dem Dispatcher des CLI erzeugt — diese Liste kann nicht veralten. Flaggen und",
    "Warnungen stehen im Aufruf ohne Argument.", "",
    "| Befehl | Wofür | Anmerkung |", "|---|---|---|"];
  for (const [name, [was, wozu]] of Object.entries(zweck)) {
    if (!vorhanden.has(name)) continue; // umbenannt oder entfernt: dann verschwindet die Zeile mit
    out.push(`| \`${name}\` | ${was} | ${wozu} |`);
  }
  for (const name of [...vorhanden].sort()) {
    if (zweck[name] || alias.has(name)) continue;
    out.push(`| \`${name}\` | — | neu, noch nicht beschrieben — \`node tools/harness.mjs\` fragen |`);
  }
  out.push("");
  return out;
}

function writeMarkdownIndexes(catalog) {
  // Bulk-Bausteine bleiben aus den Markdown-Indizes draussen — sonst besteht
  // by-domain/legal-de.md aus 24.500 Tabellenzeilen und ist unlesbar.
  // Quarantäne-Einträge ebenso: eine Tabellenzeile ohne Beschreibung trägt
  // nichts, und die Indizes sollen zeigen, was die Standardsuche liefert.
  const normal = catalog.items.filter((i) => !i.bulk && !i.quarantaene);
  const bulkRepos = catalog.repos.filter((r) => r.bulk);
  const bulkN = catalog.items.filter((i) => i.bulk).length;
  // Wie in cmdStats: ausserhalb der Massen-Repos gezählt, damit Standard +
  // Massen-Repos + Quarantäne die Gesamtzahl ergeben.
  const quarantaeneN = catalog.totals.items - normal.length - bulkN;
  const byDomain = {};
  for (const it of normal) {
    for (const d of it.domains) (byDomain[d] ||= []).push(it);
  }

  // --- Ebene 1: INDEX.md — bewusst klein gehalten. Das ist die einzige Datei,
  //     die ein Agent im Normalfall komplett liest. Sie muss unter hundert
  //     Zeilen bleiben, auch wenn sources.txt weiter wächst: deshalb stehen die
  //     Repo-Tabellen in catalog/by-repo.md und nicht mehr hier.
  const l1 = [];
  l1.push("# Harness-Bibliothek — Index (Ebene 1)");
  l1.push("");
  l1.push("> Automatisch erzeugt von `tools/harness.mjs extract` — **nicht von Hand bearbeiten.**");
  l1.push(`> Stand: ${catalog.generatedAt.slice(0, 16).replace("T", " ")} · ${normal.length} Bausteine im Standardzugriff` +
    (bulkRepos.length ? ` (+ ${bulkN} in Massen-Repos` + (quarantaeneN ? `, ${quarantaeneN} in Quarantäne` : "") + `, siehe unten)` : "") +
    ` aus ${catalog.repos.length} Repos`);
  l1.push("");
  l1.push("## Was das hier ist");
  l1.push("");
  l1.push("Ein Katalog von Claude-Bausteinen aus fremden Repos — Skills, Subagents,");
  l1.push("Slash-Commands, Hooks, MCP-Konfigurationen — und eine Wissensbank, die begründet,");
  l1.push("wann welcher Typ der richtige ist. Du ziehst daraus die wenigen Bausteine, die");
  l1.push("*dein* Projekt wirklich braucht, und lässt den Rest liegen.");
  l1.push("");
  l1.push("## So fängst du an");
  l1.push("");
  l1.push("```bash");
  l1.push(`cd "${ROOT}"`);
  l1.push("node tools/harness.mjs        # vollständige Befehlsübersicht mit allen Flaggen");
  l1.push("```");
  l1.push("");
  l1.push("Dann in dieser Reihenfolge: `search` findet Kandidaten, `show` prüft einen davon,");
  l1.push("`install --to <projekt>` kopiert ihn. Steht keine Suche an, sondern eine");
  l1.push("Entscheidung — Hook oder Skill, lohnt hier ein Subagent, wie prüft man ohne");
  l1.push("Selbstbewertung —, dann fragst du die Wissensbank, statt zu raten:");
  l1.push("");
  l1.push("```bash");
  l1.push('node tools/harness.mjs knowledge "hook statt skill"');
  l1.push("```");
  l1.push("");
  l1.push("## Was du niemals tun darfst");
  l1.push("");
  l1.push("- **`catalog/index.json` lesen.** Rund 20 MB. Das CLI liest sie an deiner Stelle.");
  l1.push(`- **Die Repo-Klone unter \`${catalog.cloneDir}\` mit Glob, Grep oder Read durchsuchen.**`);
  l1.push("  Derselbe Grund, und du bekommst dort keine Beschreibungen, sondern rohe Dateien.");
  l1.push("- **`knowledge/` oder `recipes/` am Stück lesen.** Der Befehl `knowledge` schneidet");
  l1.push("  den passenden Abschnitt heraus und nennt Datei und Zeile.");
  l1.push("");
  l1.push("Grund: Der volle Katalog umfasst " + catalog.totals.items + " Bausteine. Wer den einliest,");
  l1.push("hat sein Kontextfenster voll, bevor er die erste Zeile Projektcode sieht.");
  l1.push("");
  l1.push(...befehlsUebersicht());
  l1.push("## Bestand nach Typ");
  l1.push("");
  l1.push("| Typ | Anzahl | Was es ist | Wann einbauen |");
  l1.push("|---|---:|---|---|");
  const typeInfo = {
    skill: ["Ordner mit `SKILL.md` + Assets", "Wiederkehrendes Verfahren, das Claude nachschlagen soll"],
    agent: ["Subagent mit eigenem Kontextfenster", "Arbeit, die viel Kontext frisst oder unabhängig geprüft werden muss"],
    command: ["Slash-Command", "Manuell ausgelöster Ablauf mit festem Namen"],
    hook: ["Skript an einem Lifecycle-Event", "Regel, die *immer* greifen muss — nicht dem Modell überlassen"],
    mcp: ["MCP-Server-Konfiguration", "Zugriff auf externes System (DB, API, Browser)"],
    plugin: ["Gebündeltes Paket", "Mehrere zusammengehörige Bausteine auf einmal"],
  };
  for (const [t, n] of Object.entries(countBy(normal, "type")).sort((a, b) => b[1] - a[1])) {
    if (!typeInfo[t]) continue;
    l1.push(`| ${t} | ${n} | ${typeInfo[t][0]} | ${typeInfo[t][1]} |`);
  }
  l1.push("");
  l1.push("## Bestand nach Domäne");
  l1.push("");
  l1.push("Einstieg über die Domäne (`search \"<worte>\" --domain <name>`), voller Detail-Index");
  l1.push("je Domäne unter `catalog/by-domain/<domäne>.md`. Die erste Zahl ist der");
  l1.push("Standardzugriff, die Zahl in Klammern kommt aus Massen-Repos hinzu — `--domain`");
  l1.push("liefert die Summe, der Detail-Index listet nur die erste Zahl:");
  l1.push("");
  // Fliesstext statt Tabelle: dieselbe Information in einem Fünftel der Zeilen.
  // INDEX.md hat ein Zeilenbudget, die Domänenliste wächst mit dem Bestand.
  //
  // Die Zahl in Klammern ist der Anteil aus Massen-Repos. Ohne sie stand hier eine
  // Zahl direkt neben dem Befehl, der eine andere liefert: `seo` zählte 58, weil
  // `byDomain` nur den Standardzugriff kennt — `search --domain seo` gibt aber 64
  // zurück, weil `--domain` das Massen-Repo einschliesst. Beide Zahlen waren
  // richtig und widersprachen sich trotzdem, und zwei Wissensdateien zitierten je
  // eine davon als "die" Domänengrösse.
  const bulkProDomaene = {};
  for (const it of catalog.items) {
    if (!it.bulk) continue;
    for (const d of it.domains) bulkProDomaene[d] = (bulkProDomaene[d] || 0) + 1;
  }
  const domListe = Object.entries(byDomain)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([d, items]) => {
      const extra = bulkProDomaene[d] || 0;
      return `\`${d}\` ${items.length}${extra ? ` (+${extra})` : ""}`;
    });
  for (let i = 0; i < domListe.length; i += 5) {
    const zeile = domListe.slice(i, i + 5).join(" · ");
    l1.push(i + 5 < domListe.length ? zeile + " ·" : zeile);
  }
  l1.push("");

  if (bulkRepos.length) {
    l1.push("## Massen-Repos (opt-in)");
    l1.push("");
    l1.push("Diese Repos sind vollständig katalogisiert, tauchen aber **nicht** in der normalen");
    l1.push("Suche auf — sonst würde jede Suche von ihnen dominiert. Zugriff nur gezielt:");
    l1.push("");
    l1.push("```bash");
    for (const r of bulkRepos) {
      l1.push(`node tools/harness.mjs search "<stichwort>" --repo ${r.dir}`);
    }
    l1.push('node tools/harness.mjs search "<stichwort>" --all   # alles, inklusive Massen-Repos');
    l1.push("```");
    l1.push("");
  }
  // Zwei Zeilen, kein Absatz mehr: INDEX.md hat ein Zeilenbudget, und mehr als
  // "warum fehlen die, wie komme ich trotzdem ran" muss hier nicht stehen.
  if (quarantaeneN) {
    l1.push("## Quarantäne");
    l1.push("");
    l1.push(`${quarantaeneN} Bausteine mit leerer oder inhaltsfreier Beschreibung stehen nicht in der`);
    l1.push("Standardsuche; `show <id>` nennt den Grund, `search --all` schliesst sie ein.");
    l1.push("");
  }
  l1.push("## Wohin für mehr");
  l1.push("");
  l1.push("- `knowledge/` — **warum** ein Harness so gebaut wird: Doktrin, Entscheidungsbaum,");
  l1.push("  Anti-Patterns, ein Kapitel zum Aufsetzen eines neuen Projekts. Über");
  l1.push('  `node tools/harness.mjs knowledge "<frage>"` abfragen, nicht am Stück lesen.');
  l1.push("- `recipes/` — fertige Baupläne pro Projekttyp, mit verifizierten Baustein-IDs.");
  l1.push("- `catalog/by-repo.md` — welches Repo was beisteuert, mit Stand und Link.");
  l1.push("- `README.md` — Installation, Repo aufnehmen, Aufbau des Projekts.");
  // Entsteht erst beim ersten `update`. Ein Verweis auf eine Datei, die es nicht
  // gibt, kostet einen fremden Agenten einen Fehlversuch und etwas Vertrauen.
  if (fs.existsSync(path.join(ROOT, "CHANGELOG.md"))) {
    l1.push("- `CHANGELOG.md` — was sich beim letzten `update` geändert hat.");
  }
  fs.writeFileSync(path.join(ROOT, "INDEX.md"), l1.join("\n") + "\n");

  // --- Ebene 2: die Repo-Herkunft. Aus INDEX.md ausgelagert, weil diese Tabelle
  //     mit jeder Zeile in sources.txt wächst und INDEX.md klein bleiben muss.
  const rp = ["# Quell-Repos", "",
    `${catalog.repos.length} Repos, Stand ${catalog.generatedAt.slice(0, 16).replace("T", " ")}. Erzeugt von \`tools/harness.mjs extract\`.`,
    "",
    "Die Bausteine stehen unter den Lizenzen ihrer jeweiligen Urheber. Dieses Repo",
    "enthält keine Kopien, nur den Katalog.",
    ""];
  // Die Commit-Spalte ist der Anker, gegen den ein installierter Baustein später
  // geprüft werden kann: das Manifest im Zielprojekt führt denselben `head` unter
  // `commit`. Ohne ihn steht dort ein Datum, und ein Datum sagt nicht, welcher
  // Stand kopiert wurde — die Klone werden bei jedem `sync` hart zurückgesetzt.
  const repoTabelle = (liste) => {
    rp.push("| Repo | Bausteine | Schwerpunkt | Commit | Stand |", "|---|---:|---|---|---|");
    for (const r of liste) {
      rp.push(`| [${r.owner}/${r.repo}](${r.url}) | ${r.count} | ${r.domains.join(", ") || "—"} | ${r.head ? `\`${r.head}\`` : "—"} | ${(r.lastCommit || "").slice(0, 10)} |`);
    }
    rp.push("");
  };
  repoTabelle(catalog.repos.filter((r) => !r.bulk).sort((a, b) => b.count - a.count));
  if (bulkRepos.length) {
    rp.push("## Massen-Repos", "",
      "Nur mit `--repo`, `--domain` oder `--all` sichtbar.", "");
    repoTabelle(bulkRepos);
  }
  fs.writeFileSync(path.join(CATALOG_DIR, "by-repo.md"), rp.join("\n") + "\n");

  // --- Ebene 2: pro Domäne eine Datei ---
  const domDir = path.join(CATALOG_DIR, "by-domain");
  fs.rmSync(domDir, { recursive: true, force: true });
  fs.mkdirSync(domDir, { recursive: true });

  for (const [d, items] of Object.entries(byDomain)) {
    const lines = [`# Domäne: ${d}`, "", `${items.length} Bausteine. Erzeugt von \`tools/harness.mjs extract\`.`, ""];
    const grouped = {};
    for (const it of items) (grouped[it.type] ||= []).push(it);
    for (const [type, list] of Object.entries(grouped).sort()) {
      lines.push(`## ${type} (${list.length})`, "");
      lines.push("| ID | Beschreibung | KB |");
      lines.push("|---|---|---:|");
      for (const it of list.sort((a, b) => a.id.localeCompare(b.id))) {
        lines.push(`| \`${it.id}\` | ${short(it.description, 130) || "—"} | ${Math.max(1, Math.round(it.bytes / 1024))} |`);
      }
      lines.push("");
    }
    fs.writeFileSync(path.join(domDir, `${d}.md`), lines.join("\n") + "\n");
  }
}

// ---------------------------------------------------------------- search / show / install

function loadCatalog() {
  if (!fs.existsSync(INDEX_JSON)) die("catalog/index.json fehlt — erst 'node tools/harness.mjs update' laufen lassen.");
  return JSON.parse(fs.readFileSync(INDEX_JSON, "utf8"));
}

/**
 * Was ein Baustein beim Greifen sofort in den Kontext lädt.
 *
 * Warum das nicht `bytes` ist: `bytes` ist die Verzeichnisgrösse. Ein Skill mit
 * 7 KB SKILL.md und 1.118 KB Referenzmaterial wurde damit als "1125 KB" angezeigt —
 * Faktor 160 über dem, was er tatsächlich kostet. Zwei Stellen handelten auf diese
 * Zahl (das Auswahlkriterium in `harness-build`, der Kleinheitsbonus der Suche),
 * die Bibliothek rankte also ausgerechnet ihre gründlichsten Skills nach unten.
 *
 * Der Rückfall auf `bytes` ist kein Schönheitsfehler, sondern nötig: Kataloge, die
 * vor dieser Änderung gebaut wurden, führen `entryBytes` nicht. Bis zum nächsten
 * `extract` verhält sich alles wie zuvor, statt Unsinn anzuzeigen.
 */
const ladeBytes = (i) => (typeof i.entryBytes === "number" ? i.entryBytes : i.bytes);

/** Ob die Ladegrösse **gemessen** ist oder nur der Rückfall auf die
 *  Verzeichnisgrösse. Bei einer einzelnen Datei sind beide dasselbe, also ist sie
 *  auch dort belegt. Nur wo sie belegt ist, darf eine Warnung darauf gestützt
 *  werden — sonst meldet der Rückfall bei jedem grossen Ordner eine grosse
 *  SKILL.md, und das ist genau die Falschaussage, gegen die diese Änderung ist. */
const ladeBytesBelegt = (i) => typeof i.entryBytes === "number" || i.files === 1;

/** Ab hier steht eine SKILL.md dauerhaft im Kontext, sobald der Skill greift.
 *  Eine Schwelle, kein Budget: eine Summe über alle Bausteine misst nichts, weil
 *  sie unterstellt, dass alle gleichzeitig greifen. */
const ENTRY_GROSS = 40 * 1024;

const kb = (b) => Math.max(1, Math.round(b / 1024));

/** Erkennungsmerkmale einer deutschen Suchanfrage jenseits der Umlaute.
 *  Bewusst knapp: der Hinweis darf nicht bei englischen Anfragen erscheinen, sonst
 *  wird er zum Rauschen. Lieber einen deutschen Fall verpassen als einen englischen
 *  Nutzer belehren. */
const DEUTSCHE_WOERTER = /\b(und|oder|nicht|mit|ohne|für|von|beim|der|die|das|ein|eine|wie|was|warum|prüfen|testen|schreiben|bauen|finden|suchen|erstellen|verbessern|beheben|fehler|sicherheit|qualität|übersicht|bereitstellung)\b/i;

/** Übersetzungen für die häufigsten Suchabsichten. Keine vollständige Tabelle —
 *  nur so viel, dass die Sackgasse einen brauchbaren nächsten Befehl anbietet. */
const UEBERSETZUNG = {
  sicherheit: "security", sicher: "security", schwachstelle: "vulnerability",
  test: "testing", tests: "testing", testen: "testing", testfall: "test",
  prüfen: "review", prüfung: "review", überprüfen: "review", bewerten: "review",
  qualität: "quality", fehler: "bug", fehlern: "bug", bug: "bug",
  dokumentation: "documentation", doku: "documentation", schreiben: "writing",
  bereitstellung: "deployment", ausrollen: "deployment", veröffentlichen: "release",
  datenbank: "database", schnittstelle: "api", oberfläche: "ui",
  leistung: "performance", geschwindigkeit: "performance",
  übersicht: "onboarding", einarbeitung: "onboarding", architektur: "architecture",
  aufräumen: "refactor", umbau: "refactor", bauen: "build", erstellen: "create",
};

/** Englische Funktionswörter, die vor der Bewertung aus der Anfrage fallen.
 *  Warum: Füllwörter kippten den UND-Filter auf ODER — "how do I know the agent
 *  did it right" fand keinen Baustein mit allen acht Wörtern, fiel auf Teiltreffer
 *  zurück und flutete 953 Ergebnisse, in denen der gesuchte auf Rang 733 stand.
 *  Ob 'same'/'know'/'right' hineingehören, wurde an beiden Varianten gemessen
 *  (Fälle z21/z24 in evals/routing.jsonl, 2026-08-08): mit ihnen z21 Rang 3 von
 *  119 und z24 Rang 432 von 496, ohne sie z21 Rang 5 von 121 und z24 Rang 438
 *  von 512 — die Variante mit ihnen hat in beiden Fällen den grösseren Puffer,
 *  ohne einen Pflichtfall oder anderen optionalen Fall zu kippen. */
const STOPPWOERTER = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "at", "with",
  "for", "from", "by", "about", "how", "what", "when", "where", "why", "who",
  "which", "do", "does", "did", "done", "i", "you", "we", "they", "it", "its",
  "my", "our", "your", "their", "this", "that", "these", "those", "is", "are",
  "was", "were", "be", "been", "being", "have", "has", "had", "can", "could",
  "should", "would", "will", "shall", "may", "might", "must", "keep", "keeps",
  "know", "right", "same", "get", "gets", "got", "make", "makes", "made",
  "need", "needs", "want", "wants", "let", "lets", "use", "using", "not", "no",
  "so", "if", "then", "than", "as", "up", "out", "off",
]);

/** Baut aus einem Suchterm einen Wortanfangs-Präfix-Regex.
 *
 *  Warum kein `includes` mehr: Mittwort-Substrings erzeugten Phantom-Treffer
 *  samt Namensbonus — "our" traf mitten in "opensource", "and" mitten in
 *  "command", und diese Zufallstreffer standen dann vor den echten. Der Regex
 *  verlangt einen Wortanfang (`^` oder Nicht-Alphanumerikum davor), lässt das
 *  Wort aber weiterlaufen: "review" trifft "reviews" und "reviewer".
 *
 *  Gekoppelte Invariante: Der Plural-s-Stamm (aus "releases" wird "release")
 *  ist NUR gefahrlos, weil das Matching Präfix-Matching ist — "kubernetes"
 *  wird zu "kubernete" gestammt und trifft "kubernetes" trotzdem weiter. Wer
 *  einen der beiden Teile isoliert zurückbaut, bricht den anderen. */
function termRegex(t) {
  let stamm = t;
  if (stamm.length > 3 && stamm.endsWith("s") && !stamm.endsWith("ss")) stamm = stamm.slice(0, -1);
  const esc = stamm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Bewusst ohne g-Flag: ein g-Regex trägt lastIndex über test()-Aufrufe hinweg
  // und würde denselben Term in jedem zweiten Baustein "nicht finden".
  return new RegExp("(^|[^a-z0-9])" + esc);
}

/**
 * Bewertet, filtert und sortiert die übergebenen (bereits vorgefilterten) Items
 * gegen eine Suchanfrage. Eine Funktion für beide Aufrufer, weil `eval` über
 * `sucheIds` misst, was der Nutzer über `cmdSearch` sieht — zwei Kopien der
 * Bewertungslogik waren eine belegte Drift-Gefahr: jede Änderung an Gewichten
 * oder Filtern musste zweimal identisch passieren, und niemand prüfte das.
 *
 * Liefert neben der Trefferliste die Termbilanz-Rohdaten: welche Terme als
 * Stoppwörter fielen (`gefiltert`) und welche im durchsuchten Bestand keinen
 * Wortanfangs-Treffer haben (`unerfuellbar`).
 */
function bewerteTreffer(items, frage) {
  const roh = String(frage).toLowerCase().split(/\s+/).filter(Boolean);
  const gefiltert = roh.filter((t) => STOPPWOERTER.has(t));
  let terms = roh.filter((t) => !STOPPWOERTER.has(t));
  // Guard: eine Anfrage nur aus Stoppwörtern behält ihre Originalterme — sonst
  // wäre die Termliste leer und der UND-Filter liesse den Gesamtbestand durch.
  if (!terms.length && roh.length) terms = roh;
  // Einmal pro Suchlauf kompilieren, nicht einmal pro Baustein: der Katalog hat
  // fünfstellig viele Items, und Regex-Kompilierung dominiert sonst die Suche.
  const regexe = terms.map(termRegex);
  const treffbar = new Array(terms.length).fill(false);

  const rated = items.map((i) => {
    const hayName = (i.name + " " + i.id).toLowerCase();
    const hayAll = (hayName + " " + i.description + " " + i.path + " " + i.domains.join(" ")).toLowerCase();
    let score = 0, hits = 0;
    for (let k = 0; k < regexe.length; k++) {
      const inAll = regexe[k].test(hayAll);
      if (inAll) { hits++; treffbar[k] = true; }
      if (regexe[k].test(hayName)) score += 10;
      if (inAll) score += 3;
    }
    // Kleine Bausteine bevorzugen: billiger einzubauen, leichter zu prüfen.
    // Gemessen am Einstiegsdokument, nicht am Ordner — sonst bestraft der Bonus
    // mitgeliefertes Referenzmaterial, das gar nicht geladen wird.
    if (score > 0 && ladeBytes(i) < 20000) score += 1;
    return { i, score, hits };
  });

  // Mehrwortsuchen als UND lesen, nicht als ODER. Sonst liefert "code review"
  // mehr Treffer als "review" — je genauer die Absicht, desto unschärfer das
  // Ergebnis. Nur wenn kein Baustein alle Wörter trägt, wird gelockert.
  let scored = rated.filter((x) => terms.length === 0 || x.hits === terms.length);
  let relaxed = false;
  if (!scored.length && terms.length > 1) {
    scored = rated.filter((x) => x.hits > 0);
    relaxed = true;
  }
  scored.sort((a, b) => b.hits - a.hits || b.score - a.score || a.i.id.localeCompare(b.i.id));

  const unerfuellbar = terms.filter((_, k) => !treffbar[k]);
  return { scored, relaxed, terms, gefiltert, unerfuellbar };
}

/**
 * Eine Trefferzeile im Format von `search` — ausgelagert, damit `cmdIntent`
 * (Absichts-Suche, M9) dieselbe Zeilenform benutzt statt sie nachzubauen. Zwei
 * Kopien derselben Druckausgabe wären dieselbe Drift-Gefahr wie zwei Kopien der
 * Bewertungslogik: eine Änderung am Format (neue Zeile, andere Kürzung) müsste
 * zweimal identisch nachgezogen werden, und das prüft niemand zuverlässig.
 */
function druckeTreffer(i) {
  console.log(`${i.type.padEnd(7)} ${i.id}`);
  console.log(`        ${short(i.description, 150) || "(keine Beschreibung)"}`);
  const lade = ladeBytes(i);
  // Bei einer einzelnen Datei sind beide Zahlen dieselbe — dann nicht zweimal
  // dasselbe hinschreiben, sonst wird die Zeile länger und sagt weniger.
  const groesse = lade === i.bytes
    ? `${kb(i.bytes)} KB · ${i.files} Datei(en)`
    : `${kb(lade)} KB lädt · ${kb(i.bytes)} KB gesamt in ${i.files} Datei(en)`;
  // Vor der Auswahl sichtbar, nicht erst an der Installationsgrenze: wer zwischen
  // zwei gleichwertigen Bausteinen wählt, soll wissen, dass einer davon Code
  // mitbringt, den Claude Code später von selbst startet.
  const codeHinweis = i.type === "hook" ? "Hook — startet von selbst"
    : (i.exec > 0 ? `${i.exec} ausführbare Datei(en)` : "");
  console.log(`        ${groesse} · ${i.domains.join(", ")}${codeHinweis ? " · " + codeHinweis : ""}`);
  if (ladeBytesBelegt(i) && lade > ENTRY_GROSS) console.log(`        grosse ${path.basename(i.entry || "SKILL.md")} — steht ab dem Greifen dauerhaft im Kontext`);
  console.log("");
}

function cmdSearch(argv) {
  const flags = parseFlags(argv);
  const query = flags._.join(" ").toLowerCase().trim();
  const cat = loadCatalog();

  let items = cat.items;
  // Quarantäne-Übersicht: eigener Zweig vor jedem anderen Filter, kein Suchmodus.
  // Die Description ist per Definition unbrauchbar (quarantaeneGrund) — ein
  // Text-Score darauf wäre Zufall, keine Auskunft. `stats` nennt nur die Zahl;
  // hier steht, WELCHE Einträge das sind und WARUM, sonst bleibt ein falsch
  // einsortierter Eintrag (False Positive) unauffindbar, ausser man kennt seine
  // ID schon. --type/--domain/--repo bleiben nutzbar, weil sie generische
  // Eingrenzungen sind; --all/Bulk-Filter und Scoring werden übersprungen, weil
  // sie für diese Frage nichts beitragen — auch ein quarantänisierter Eintrag
  // aus einem Massen-Repo gehört in diese Liste, sonst verschwindet er doppelt.
  if (flags.quarantine) {
    let q = items.filter((i) => i.quarantaene);
    if (flags.type) q = q.filter((i) => i.type === flags.type);
    if (flags.domain) q = q.filter((i) => i.domains.includes(flags.domain));
    if (flags.repo) q = q.filter((i) => i.repo.toLowerCase().includes(String(flags.repo).toLowerCase()));
    q.sort((a, b) => a.id.localeCompare(b.id));
    console.log(`${q.length} Bausteine in Quarantäne:\n`);
    for (const i of q) console.log(`${i.type.padEnd(7)} ${i.id}  —  ${i.quarantaene}`);
    return;
  }
  // Massen-Repos nur, wenn ausdrücklich verlangt: sonst verdrängen 24.500 Rechts-Skills
  // jeden anderen Treffer.
  const wantsBulk = flags.all || flags.repo || flags.domain;
  if (!wantsBulk) items = items.filter((i) => !i.bulk);
  // Quarantäne (M2): Einträge ohne verwertbare Description sind in jeder
  // Trefferliste nur Rauschen. Anders als bulk öffnen --repo/--domain sie
  // NICHT mit: wer ein Repo eingrenzt, sucht dessen brauchbare Bausteine,
  // nicht dessen leere. Nur --all zeigt alles; `show <id>` löst sie immer auf.
  if (!flags.all) items = items.filter((i) => !i.quarantaene);
  if (flags.type) items = items.filter((i) => i.type === flags.type);
  if (flags.domain) items = items.filter((i) => i.domains.includes(flags.domain));
  if (flags.repo) items = items.filter((i) => i.repo.toLowerCase().includes(String(flags.repo).toLowerCase()));

  const { scored, relaxed, gefiltert, unerfuellbar } = bewerteTreffer(items, query);

  // Termbilanz nur in der Sackgasse (UND-Filter leer oder gar kein Treffer):
  // sie benennt, was die Suche stillschweigend entschieden hat, damit das Modell
  // die unerfüllbaren Nutzerwörter gezielt durch Katalogvokabular ersetzen kann
  // (M8: Übersetzen ist Aufgabe des Modells, die Bilanz liefert die Fakten).
  const termbilanz = () => {
    if (gefiltert.length) console.log(`Als Füllwörter übergangen: ${gefiltert.join(", ")}`);
    for (const t of unerfuellbar) {
      console.log(`'${t}' kommt im durchsuchten Bestand nicht vor — ${scored.length ? "ignoriert" : "nicht erfüllbar"}`);
    }
    if (gefiltert.length || unerfuellbar.length) console.log("");
  };

  // Nur ankündigen, wenn tatsächlich Teiltreffer folgen. Sonst stand die Zeile
  // "zeige Teiltreffer" direkt über "Keine Treffer" — eine Ankündigung von nichts.
  if (relaxed && scored.length) {
    console.log("Kein Baustein enthält alle Suchwörter — zeige Teiltreffer.\n");
    termbilanz();
  }

  const limit = Number(flags.limit || 25);
  if (!scored.length) {
    console.log(`Keine Treffer für "${query}".`);
    termbilanz();
    // Der Bestand stammt aus englischsprachigen Repos, die Nutzer denken deutsch.
    // Ein Eval-Fall belegt es: "sicherheit prüfen" liefert null Treffer, "security"
    // liefert reichlich. Statt einer Synonymtabelle, die gepflegt werden müsste und
    // trotzdem lückenhaft bliebe, steht der Hinweis dort, wo er gebraucht wird —
    // in der Sackgasse.
    if (/[äöüß]/i.test(query) || DEUTSCHE_WOERTER.test(query)) {
      console.log("");
      console.log("Die Bausteine stammen aus englischsprachigen Repos — deutsche Begriffe");
      console.log("finden dort selten etwas. Versuch es englisch:");
      const vorschlag = query.split(/\s+/).map((w) => UEBERSETZUNG[w] || w).join(" ");
      if (vorschlag !== query) console.log(`  node tools/harness.mjs search "${vorschlag}"`);
      else console.log(`  z.B. security, testing, review, deployment, documentation`);
    }
    console.log("");
    console.log("Sonst: breiter suchen, --type/--domain weglassen, oder --all für Massen-Repos.");
    console.log("Verfügbare Domänen siehe INDEX.md.");
    return;
  }
  console.log(`${scored.length} Treffer für "${query}"${scored.length > limit ? ` (zeige ${limit})` : ""}:\n`);
  for (const { i } of scored.slice(0, limit)) druckeTreffer(i);
  if (scored.length > limit) console.log(`... ${scored.length - limit} weitere. Mit --limit N mehr anzeigen.`);
}

function findItem(cat, id) {
  return (
    cat.items.find((i) => i.id === id) ||
    cat.items.find((i) => i.id.toLowerCase() === String(id).toLowerCase()) ||
    cat.items.find((i) => i.id.toLowerCase().endsWith("/" + String(id).toLowerCase()))
  );
}

function cmdShow(argv) {
  const flags = parseFlags(argv);
  const cat = loadCatalog();
  const it = findItem(cat, flags._[0] || "");
  if (!it) die(`Baustein nicht gefunden: ${flags._[0]}`);

  console.log(`ID          ${it.id}`);
  console.log(`Typ         ${it.type}`);
  // Die Stufe steht in `show`, nicht in `search`: sie ist ein Kriterium für die
  // engere Wahl zwischen zwei fachlich gleichwertigen Bausteinen, keine Spalte für
  // fünfundzwanzig Trefferzeilen — und fachliche Passung schlägt Herkunft.
  const stufe = vertrauensstufen().get(it.repo);
  console.log(`Repo        ${it.repo}${stufe ? `   (Vertrauen: ${stufe})` : ""}`);
  console.log(`Domänen     ${it.domains.join(", ")}`);
  // Der Grund steht im Katalog (quarantaeneGrund in extract) — ohne diese Zeile
  // sähe ein per ID aufgelöster Quarantäne-Eintrag wie ein normaler Treffer aus,
  // und sein Fehlen in der Suche wie ein Katalogfehler.
  if (it.quarantaene) console.log(`Quarantäne  ${it.quarantaene} — aus der Standardsuche genommen, sichtbar nur mit --all; install funktioniert weiter`);
  const lade = ladeBytes(it);
  console.log(`Grösse      ${kb(it.bytes)} KB in ${it.files} Datei(en)`);
  if (lade !== it.bytes) {
    // Die Token-Zahl ist eine Schätzung und wird so genannt: vier Zeichen je Token
    // ist eine Faustregel, keine Messung, und sie gilt für englischen Fliesstext
    // besser als für Codeblöcke. Trotzdem nützlicher als gar keine Grössenordnung.
    console.log(`Lädt sofort ${kb(lade)} KB (${it.entry}) — grob geschätzt ~${Math.round(lade / 4 / 100) * 100} Token`);
    console.log(`            Der Rest wird erst gelesen, wenn der Baustein selbst darauf verweist.`);
  }
  if (ladeBytesBelegt(it) && lade > ENTRY_GROSS) {
    console.log(`            Achtung: über ${kb(ENTRY_GROSS)} KB Einstiegsdokument — das steht ab dem Greifen dauerhaft im Kontext.`);
  }
  if (it.exec > 0) {
    console.log(`Ausführbar  ${it.exec} von ${it.files} Datei(en) haben eine Endung, unter der Code ausgeführt wird`);
    console.log("            Was darin steht, meldet `install` vor dem Kopieren mit Fundstelle.");
  }
  console.log(`Quelle      ${path.join(CLONE_DIR, it.path)}`);
  for (const [k, v] of Object.entries(it.meta || {})) console.log(`${k.padEnd(11)} ${v}`);
  console.log(`\nBeschreibung\n  ${short(it.description, 600) || "—"}`);

  const entry = path.join(CLONE_DIR, it.entry);
  if (fs.existsSync(entry)) {
    const head = Number(flags.head || 60);
    console.log(`\n--- ${it.entry} (erste ${head} Zeilen) ---`);
    console.log(safeRead(entry).split(/\r?\n/).slice(0, head).join("\n"));
  }
  if (it.files > 1) {
    console.log(`\n--- Dateien in ${it.path} ---`);
    const files = [];
    walk(path.join(CLONE_DIR, it.path), (p, isDir) => { if (!isDir) files.push(rel(p)); });
    console.log(files.slice(0, 40).join("\n"));
    if (files.length > 40) console.log(`... ${files.length - 40} weitere`);
  }
}

// ---------------------------------------------------------------- intent

/** M9 (knowledge/04-governance.md, Abschnitt 2.4): eine Absichts-Ebene neben
 *  den Domänen, von Hand gepflegt statt aus dem Katalog berechnet — sie
 *  überlebt deshalb jedes `extract`, das `index.json` komplett neu schreibt. */
const INTENTS_YAML = path.join(CATALOG_DIR, "intents.yaml");

/** Entfernt einen `#`-Kommentar von einer YAML-Zeile, aber nur ausserhalb von
 *  doppelten Anführungszeichen — sonst würde ein '#' innerhalb eines Frage- oder
 *  Suchtexts (z.B. "Ticket #42") die Zeile an der falschen Stelle abschneiden. */
function stripYamlComment(line) {
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === "#" && !inQuotes) return line.slice(0, i);
  }
  return line;
}

const parseYamlScalar = (raw) => {
  const v = raw.trim();
  return /^".*"$/.test(v) ? v.slice(1, -1) : v;
};

/** `[a, "b c", d]` — Elemente sind im Subset frei von Kommas, ein simpler
 *  Komma-Split reicht deshalb; jedes Element läuft danach durch denselben
 *  Skalar-Parser wie ein einzelner Wert (quotet oder nicht). */
function parseYamlInlineList(raw) {
  const inner = raw.trim().replace(/^\[/, "").replace(/\]$/, "").trim();
  return inner ? inner.split(",").map(parseYamlScalar) : [];
}

/** Bekannte Feldnamen in intents.yaml. Jede andere Zeile innerhalb eines
 *  Eintrags — ob ein unbekannter Feldname, eine vergessene Doppelpunkt-Zeile
 *  wie `suche []`, oder ein Listenelement ohne offenes Feld — ist ein
 *  Format-Fehler in dieser von Hand gepflegten Datei, kein neuer Sonderfall,
 *  und wird gemeldet statt still verschluckt. Ohne diese Meldung wäre eine
 *  vergessene Doppelpunkt-Zeile nicht von einer bewusst leeren Liste zu
 *  unterscheiden — beide sähen in `intent <id>` gleich aus: null Treffer über
 *  dieses Feld, ohne jeden Hinweis warum. */
const INTENT_FELDER = new Set(["id", "frage", "suche", "domains", "anker"]);

/**
 * Minimaler YAML-Parser für GENAU das Subset aus `catalog/intents.yaml`: eine
 * Liste von Objekten (`- feld: wert`), Skalare (unquoted oder doppelt gequotet),
 * Inline-Listen (`[a, b]`), eingerückte Strich-Listen unter einem leeren Feld
 * (`anker:` gefolgt von `  - id`) und `#`-Kommentare (ganze Zeile und hinter
 * einem Wert). Kein generisches YAML: die Projektregel verbietet Abhängigkeiten
 * ausserhalb der Node-Standardbibliothek, und eine echte YAML-Bibliothek wäre
 * damit die einzige Fremdabhängigkeit im gesamten Werkzeug — für ein Format, das
 * hier nur eine flache Liste mit drei Feldtypen trägt.
 *
 * Jedes Objekt trägt zusätzlich `_zeile` (die Zeile seines `- id: ...`-Starts) —
 * kein Datenfeld der Absicht, sondern die Fundstelle für Abbruchmeldungen in
 * `ladeIntents()`, wenn genau diesem Eintrag ein Pflichtfeld fehlt.
 */
function parseIntentsYaml(text) {
  const out = [];
  const warnen = (nr, text) => console.log(`  Warnung: catalog/intents.yaml:${nr} ${text}`);
  let obj = null;
  let listKey = null;   // Feld, das gerade eine eingerückte Strich-Liste sammelt
  let listIndent = -1;  // Einrückung der Feld-Zeile, die diese Liste eröffnet hat

  const feldSetzen = (key, wert, indent) => {
    const w = wert.trim();
    if (!w) {
      // Leerer Wert: das Feld ist eine eingerückte Strich-Liste, die erst in
      // den Folgezeilen kommt (Beispiel: `anker:`).
      obj[key] = [];
      listKey = key; listIndent = indent;
    } else if (/^\[.*\]$/.test(w)) {
      obj[key] = parseYamlInlineList(w);
      listKey = null; listIndent = -1;
    } else {
      obj[key] = parseYamlScalar(w);
      listKey = null; listIndent = -1;
    }
  };

  const zeilen = text.split(/\r?\n/);
  for (let n = 0; n < zeilen.length; n++) {
    const nr = n + 1;
    const zeile = stripYamlComment(zeilen[n]);
    if (!zeile.trim()) continue;
    const indent = zeile.match(/^ */)[0].length;
    const inhalt = zeile.trim();

    if (indent === 0) {
      if (!inhalt.startsWith("-")) continue; // Zeilen ausserhalb der Liste ignorieren
      if (obj) out.push(obj);
      obj = { _zeile: nr };
      // Neues Objekt: eine Strich-Liste, die noch zum VORIGEN Eintrag gehörte,
      // darf hier nicht weiterlaufen — sonst würde eine dangling Listen-Zeile
      // unter diesem neuen (evtl. fehlerhaften) Eintrag auf ein Feld zeigen,
      // das auf `obj` gar nicht existiert.
      listKey = null; listIndent = -1;
      const feld = inhalt.replace(/^-\s*/, "").match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
      if (feld && INTENT_FELDER.has(feld[1])) feldSetzen(feld[1], feld[2], 2);
      else if (feld) warnen(nr, `unbekanntes Feld "${feld[1]}" — ignoriert`);
      else warnen(nr, `nicht als Feld erkannt (erwartet "- id: ...") — ignoriert: "${inhalt}"`);
      continue;
    }
    if (!obj) continue; // Zeilen vor dem ersten "- " ignorieren

    if (inhalt.startsWith("-")) {
      // Element einer eingerückten Strich-Liste — gehört zum zuletzt geöffneten
      // Feld, solange die Einrückung tiefer liegt als die der Feld-Zeile.
      if (listKey && indent > listIndent) obj[listKey].push(parseYamlScalar(inhalt.replace(/^-\s*/, "")));
      else warnen(nr, `Listenelement ohne offenes Feld — ignoriert: "${inhalt}"`);
      continue;
    }

    const feld = inhalt.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (feld && INTENT_FELDER.has(feld[1])) feldSetzen(feld[1], feld[2], indent);
    else if (feld) warnen(nr, `unbekanntes Feld "${feld[1]}" — ignoriert`);
    else warnen(nr, `nicht erkannt (weder Feld noch Listenelement) — ignoriert: "${inhalt}"`);
  }
  if (obj) out.push(obj);
  return out;
}

/** Lädt und validiert `catalog/intents.yaml`. Bricht mit klarer Meldung ab statt
 *  zu crashen, wenn die Datei fehlt — sie entsteht in einem eigenen Auftrag (M9)
 *  und kann zur Laufzeit dieses Subcommands noch nicht existieren. */
function ladeIntents() {
  if (!fs.existsSync(INTENTS_YAML)) {
    die("catalog/intents.yaml fehlt. Die Absichts-Ebene aus M9 (knowledge/04-governance.md, " +
      "Abschnitt 2.4) ist noch nicht angelegt oder liegt woanders — 'intent' braucht diese Datei.");
  }
  const eintraege = parseIntentsYaml(safeRead(INTENTS_YAML));
  for (const e of eintraege) {
    if (!e.id) die(`catalog/intents.yaml:${e._zeile} enthält einen Eintrag ohne 'id' — Datei-Format geprüft?`);
    // Felder fehlen dürfen (z.B. ein Eintrag ohne Anker); nur der Typ muss stimmen,
    // sonst bricht die Vereinigung weiter unten an einer falschen Annahme.
    e.suche = Array.isArray(e.suche) ? e.suche : [];
    e.domains = Array.isArray(e.domains) ? e.domains : [];
    e.anker = Array.isArray(e.anker) ? e.anker : [];
  }
  return eintraege;
}

/** Flaggen, die ein einzelner `suche`-String in intents.yaml tragen darf —
 *  dieselben zwei wie bei `search`, mit derselben Bedeutung, aber nur für GENAU
 *  diese eine Query wirksam, nicht für die ganze Absicht. Warum überhaupt
 *  nötig: "code review" allein liefert Hunderte Treffer über alle Typen hinweg;
 *  der eingebettete Filter (`code review --type agent`) ist Wissen der
 *  Redakteurin, das sonst verloren ginge, wenn `intent` den String nur als
 *  Fliesstext an `bewerteTreffer()` weiterreichte. */
const INTENT_QUERY_FLAGS = new Set(["type", "domain"]);

/**
 * Trennt `--type`/`--domain` aus einem `suche`-String heraus und gibt den
 * bereinigten Suchtext plus die erkannten Filter zurück. Ein `--`-Token, das
 * keins von beiden ist (Tippfehler in intents.yaml, z.B. `--typ`), ist ein
 * Datenfehler in der Datei, kein Suchwort — würde es als Text durchgereicht,
 * verfälschte es die UND-Suche in `bewerteTreffer()` mit einem Term, den kein
 * Baustein je trägt, und die Query liefe fälschlich auf 0 Treffer.
 */
function parseSucheQuery(query) {
  const tokens = String(query).split(/\s+/).filter(Boolean);
  const rest = [];
  const filter = {};
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.startsWith("--")) { rest.push(t); continue; }
    const name = t.slice(2);
    if (INTENT_QUERY_FLAGS.has(name) && tokens[i + 1] && !tokens[i + 1].startsWith("--")) {
      filter[name] = tokens[++i];
    } else {
      console.log(`  Warnung: unbekanntes Flag in intents.yaml-Suche "${query}": ${t} — ignoriert`);
    }
  }
  return { text: rest.join(" "), type: filter.type, domain: filter.domain };
}

/**
 * Führt jede hinterlegte Suche einer Absicht über `bewerteTreffer()` — dieselbe
 * Bewertung, die auch `cmdSearch` und `sucheIds()` (eval) benutzen — und
 * vereinigt die Treffer dedupliziert. Eine eigene Such- oder Score-Logik für
 * `intent` wäre dieselbe Drift-Gefahr, die `sucheIds()` schon vermeidet: jede
 * Änderung an Gewichten oder Filtern müsste an mehreren Stellen identisch
 * nachgezogen werden, ungeprüft.
 * Taucht dieselbe ID unter mehreren Suchen auf, gewinnt der höhere Score — das
 * ist die Formulierung, die am besten zu diesem Baustein passt.
 *
 * `items` ist hier nur um Quarantäne bereinigt, NICHT um Massen-Repos: ob eine
 * einzelne Query Massen-Repos sieht, entscheidet ihr eigenes `--domain` — exakt
 * wie bei `cmdSearch`, wo `--domain` dieselbe Tür öffnet. Ohne das läge
 * "rechtliches" (`Vertragsrecht --domain legal-de`) bei null Treffern, weil
 * `legal-de` fast vollständig aus dem Massen-Repo besteht.
 */
function intentTreffer(items, suchen) {
  const merged = new Map();
  for (const roh of suchen) {
    const { text, type, domain } = parseSucheQuery(roh);
    let pool = items;
    if (!domain) pool = pool.filter((i) => !i.bulk);
    if (type) pool = pool.filter((i) => i.type === type);
    if (domain) pool = pool.filter((i) => i.domains.includes(domain));
    const { scored } = bewerteTreffer(pool, text);
    for (const t of scored) {
      const bisher = merged.get(t.i.id);
      if (!bisher || t.score > bisher.score) merged.set(t.i.id, t);
    }
  }
  return [...merged.values()].sort((a, b) => b.score - a.score || b.hits - a.hits || a.i.id.localeCompare(b.i.id));
}

function cmdIntent(argv) {
  const flags = parseFlags(argv);
  const arg = flags._[0];

  if (!arg || flags.list) {
    const eintraege = ladeIntents();
    console.log(`${eintraege.length} Absichten in catalog/intents.yaml:\n`);
    for (const e of eintraege) console.log(`  ${e.id.padEnd(18)} ${e.frage}`);
    console.log("\nDetail: node tools/harness.mjs intent <id>");
    return;
  }

  const eintraege = ladeIntents();
  const eintrag = eintraege.find((e) => e.id === arg);
  if (!eintrag) {
    // Exit-Code ungleich 0, aber kein die() vor der Liste — wer die id vertippt
    // hat, soll die gültigen sofort sehen, nicht erst nachschlagen müssen.
    console.error(`FEHLER: Unbekannte Absicht "${arg}".`);
    console.error(`Gültige ids: ${eintraege.map((e) => e.id).join(", ")}`);
    process.exit(1);
  }

  console.log(`Absicht ${eintrag.id}`);
  console.log(`  ${eintrag.frage}`);
  // Domains sind hier bewusst NUR Anzeige, kein Filter: eine Absicht deckt laut
  // Spezifikation mehrere Domänen ab (M9), ein harter Filter würde genau die
  // Treffer wegschneiden, die die Absichts-Ebene erst zusammenführen soll.
  if (eintrag.domains.length) console.log(`Domänen (informativ, kein Filter): ${eintrag.domains.join(", ")}`);
  console.log("");

  const cat = loadCatalog();
  // Quarantäne bleibt immer aussen vor — `intent` kennt kein --all. Ob eine
  // einzelne Query Massen-Repos sieht, entscheidet ihr eigenes eingebettetes
  // --domain (siehe intentTreffer/parseSucheQuery), nicht dieser Filter hier.
  const items = cat.items.filter((i) => !i.quarantaene);
  const treffer = intentTreffer(items, eintrag.suche);
  const restById = new Map(treffer.map((t) => [t.i.id, t]));

  if (eintrag.anker.length) {
    console.log(`Anker (${eintrag.anker.length}, immer vorn, unabhängig vom Score):\n`);
    for (const ankerId of eintrag.anker) {
      // `findItem` löst gegen den VOLLEN Katalog auf (auch bulk/Quarantäne):
      // ein Anker ist eine bewusste Einzelauswahl, keine Trefferliste, die den
      // Standardfiltern unterliegt.
      const i = findItem(cat, ankerId);
      if (!i) {
        // Nach einem `update` kann ein Quell-Repo einen Baustein umbenannt oder
        // entfernt haben — das gehört gemeldet, nicht still verschluckt: sonst
        // hält jemand die verbliebenen Anker fälschlich für die volle Liste.
        console.log(`  ACHTUNG: Anker löst nicht im Katalog auf (Repo entfernt/umbenannt?): ${ankerId}\n`);
        continue;
      }
      druckeTreffer(i);
      restById.delete(i.id); // steht schon oben — unten nicht doppelt zeigen
    }
  }

  const rest = [...restById.values()];
  const limit = Number(flags.limit || 25);
  if (!rest.length) {
    console.log("Keine weiteren Treffer über die hinterlegten Suchen.");
    return;
  }
  console.log(`${rest.length} weitere Treffer${rest.length > limit ? ` (zeige ${limit})` : ""}:\n`);
  for (const { i } of rest.slice(0, limit)) druckeTreffer(i);
  if (rest.length > limit) console.log(`... ${rest.length - limit} weitere. Mit --limit N mehr anzeigen.`);
}

/** Zielverzeichnis nach Typ: so, wie Claude Code die Bausteine tatsächlich lädt. */
const TARGET_BY_TYPE = {
  skill: ".claude/skills",
  agent: ".claude/agents",
  command: ".claude/commands",
  hook: ".claude/hooks",
  mcp: ".",
  plugin: ".claude/plugins",
};

/**
 * Kopiert und **protokolliert dabei, was tatsächlich geschrieben wurde**.
 *
 * Warum die Rückgabe: `uninstall` darf nicht raten. Ein Verzeichnis nachträglich
 * abzulaufen wäre die falsche Quelle — bei `--force` über eine bestehende
 * Installation stünden dort auch Dateien, die dieser Lauf nie angefasst hat, und
 * das Manifest würde fremde Dateien zum Löschen freigeben. Nur der Kopiervorgang
 * selbst weiss es genau, also sagt er es.
 */
function copyRecursive(src, dest, out = []) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const e of fs.readdirSync(src)) {
      if (SKIP_DIRS.has(e)) continue;
      copyRecursive(path.join(src, e), path.join(dest, e), out);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    out.push(dest);
  }
  return out;
}

/**
 * Konfigurationsdateien, die zufällig wie Bausteine aussehen.
 *
 * `hooks.json` und `.mcp.json` werden vom Extraktor katalogisiert wie alles andere,
 * sind aber keine Pakete, sondern **Zustand des Zielprojekts**: dort stehen die
 * Hooks und MCP-Server, die dieses Projekt schon hat. Eine solche Datei zu
 * überschreiben heisst nicht "Baustein ersetzt", sondern "fremde Konfiguration
 * gelöscht" — und zwar stumm, weil das Kopieren keinen Unterschied kennt.
 */
const KONFIG_DATEI_RE = /^(hooks\.json|\.mcp\.json|mcp\.json|settings\.json|settings\.local\.json)$/i;

/** Schlüssel einer Claude-Konfiguration. Bei `hooks` und `mcpServers` trägt erst
 *  die zweite Ebene die Aussage — "beide Dateien haben `hooks`" ist kein Befund,
 *  "beide belegen `hooks.PreToolUse`" ist einer. */
function konfigSchluessel(datei) {
  let j;
  try { j = JSON.parse(safeRead(datei)); } catch { return null; }
  if (!j || typeof j !== "object") return null;
  const out = new Set();
  for (const [k, v] of Object.entries(j)) {
    if ((k === "hooks" || k === "mcpServers" || k === "servers") && v && typeof v === "object") {
      for (const k2 of Object.keys(v)) out.add(`${k}.${k2}`);
    } else out.add(k);
  }
  return out;
}

/** md5 einer Datei. Kein Sicherheitsmerkmal, sondern ein Änderungsindikator:
 *  `uninstall` soll erkennen, ob der User die Datei nach der Installation
 *  angefasst hat, und sie dann in Ruhe lassen. */
function fileHash(file) {
  try { return createHash("md5").update(fs.readFileSync(file)).digest("hex"); }
  catch { return null; }
}

// ---------------------------------------------------------------- Installationsgrenze

/**
 * Sichtprüfung vor dem Kopieren: was bringt der Baustein an ausführbarem Code mit?
 *
 * Warum das nötig ist: `install` kopiert Code aus dreizehn **fremden** Repos in
 * Projekte des Users. Bei einem Hook ist das kein Lesestoff — Claude Code ruft ihn
 * bei einem Lifecycle-Ereignis von selbst auf, ohne dass jemand ihn vorher geöffnet
 * hat. Bis hierhin meldete das CLI nur den Kopiervorgang ("+ id -> pfad"), nicht,
 * was da kopiert wird.
 *
 * **Das ist eine Sichtprüfung, kein Schutz.** Ein Textmuster-Abgleich erkennt keinen
 * verschleierten Aufruf, kennt keine Absicht und gibt keine Freigabe. Er macht
 * sichtbar, was sonst unbemerkt ins Projekt käme. Wer den Hinweis liest und
 * bestätigt, hat entschieden — genau das ist der Zweck, und mehr wird nicht
 * behauptet. Deshalb steht die Ehrlichkeitszeile auch in der Ausgabe und nicht nur
 * hier im Kommentar.
 */

/** Endungen, bei denen eine Datei ausgeführt statt gelesen wird.
 *  Die Liste war zu kurz und liess .pyw, .php, .lua, .jsx und weitere durch —
 *  belegt beim Prüflauf. Sie bleibt trotzdem unvollständig: Ausführbarkeit hängt
 *  am Aufrufer, nicht an der Endung. Deshalb hängt die Rückfrage in cmdInstall
 *  nicht mehr daran, ob hier etwas anschlägt. */
const EXEC_EXT = /\.(sh|bash|zsh|fish|ksh|nu|command|ps1|psm1|psd1|bat|cmd|vbs|wsf|py|pyw|rb|pl|php|lua|r|jl|js|mjs|cjs|jsx|ts|mts|cts|tsx|scpt|applescript)$/i;

/**
 * Auffällige Muster. Bewusst wenige und bewusst grob: jede Meldung kostet
 * Aufmerksamkeit, und eine Liste, die pro Baustein zwanzig Zeilen ausgibt, wird
 * nach dem zweiten Mal überblättert statt gelesen. `auch` verlangt einen zweiten
 * Treffer in derselben Zeile — ohne das meldete "Zugangsdaten" jedes process.env.PATH.
 * Die Lookbehinds halten `regex.exec(...)` und `array.eval` heraus, die in
 * JS-Bausteinen häufiger vorkommen als die gemeinten Aufrufe.
 */
const RISK_PATTERNS = [
  { label: "Netzwerkzugriff", re: /\b(curl|wget|axios|urllib|httpx|node-fetch|Invoke-WebRequest|Invoke-RestMethod)\b|\bfetch\s*\(|\brequests\.(get|post|put|patch|delete)\b|\bhttps?\.request\b|\bnew\s+WebSocket\b/ },
  { label: "Prozessaufruf", re: /\b(child_process|subprocess|execSync|execFileSync|spawnSync|Start-Process|Invoke-Expression|os\.system|popen)\b|\bspawn\s*\(|(?<![.\w])exec\s*\(|(?<![.\w])eval\s*\(|\bnew\s+Function\s*\(/ },
  { label: "Ziel ausserhalb", re: /\b(os\.homedir|expanduser|USERPROFILE|HOMEPATH)\b|\$HOME\b|~\/\.[a-z]|(?:^|[\s"'`(])\/etc\/|\bHKEY_|\.ssh\b/ },
  { label: "Zugangsdaten", re: /\b(process\.env|os\.environ|getenv|\$env:)\b|\$\{?[A-Z_]{2,}\}?/, auch: /\b[A-Z_]*(API_?KEY|_KEY|TOKEN|SECRET|PASSW|CREDENTIAL)[A-Z_]*\b/i },
];

const fmtSize = (b) =>
  b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

/**
 * Liest die Quelle des Bausteins und sammelt, was ausführbar ist.
 *
 * Warum nicht im `extract`-Lauf als Katalogfeld: eine Flagge im Katalog würde jede
 * Änderung an den Mustern zu einem vollen Neuaufbau des Katalogs zwingen, und der
 * Fundort mit Zeilennummer — das eigentlich Nützliche — passt ohnehin nicht in
 * einen Katalogeintrag. Beim Kopieren wird die Quelle sowieso gelesen; hier kostet
 * die Prüfung nichts extra.
 */
function inspectItem(it, src) {
  const bericht = { id: it.id, type: it.type, dateien: [], bytes: 0, anzahl: 0, gekuerzt: false, gruende: [] };
  const alle = [];
  try {
    if (fs.statSync(src).isDirectory()) walk(src, (p, isDir) => { if (!isDir) alle.push(p); });
    else alle.push(src);
  } catch { return bericht; }
  bericht.anzahl = alle.length;

  let geoeffnet = 0;
  for (const f of alle) {
    const size = safeSize(f);
    bericht.bytes += size;
    const base = path.basename(f);
    const byExt = EXEC_EXT.test(base);
    // Dateien ohne Endung können eine Shebang-Zeile tragen und werden deshalb
    // geöffnet. Alles andere (.md, .json, Bilder) nicht — ein Plugin mit 3.438
    // Dateien würde sonst bei jedem `install` komplett eingelesen.
    if (!byExt && (base.includes(".") || size > 200000)) continue;
    if (geoeffnet >= 300) { bericht.gekuerzt = true; continue; }
    geoeffnet++;
    const text = safeRead(f);
    if (!text) continue;
    const shebang = /^#!/.test(text);
    if (!byExt && !shebang) continue;

    const lines = text.split("\n");
    const funde = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.length > 400) continue; // minifizierte Zeile: der Fundort sagt nichts aus
      for (const pat of RISK_PATTERNS) {
        if (!pat.re.test(l)) continue;
        if (pat.auch && !pat.auch.test(l)) continue;
        funde.push({ zeile: i + 1, label: pat.label, text: l.trim().slice(0, 88) });
        break; // eine Meldung pro Zeile genügt, sonst wird die Liste unlesbar
      }
    }
    const r = path.relative(src, f).split(path.sep).join("/");
    bericht.dateien.push({ rel: r || base, bytes: size, zeilen: lines.length, shebang, funde });
  }

  // Gründe für eine Rückfrage. Ein Hook zählt immer — nicht wegen seines Inhalts,
  // sondern weil er von selbst startet; das ist der Unterschied zu einem Skill,
  // den der Agent erst laden muss.
  if (it.type === "hook") bericht.gruende.push("Hook — feuert bei Lifecycle-Ereignissen automatisch, ohne dass ihn jemand aufruft");
  if (bericht.dateien.length) {
    const mitFund = bericht.dateien.filter((d) => d.funde.length).length;
    bericht.gruende.push(`${bericht.dateien.length} ausführbare Datei(en)${mitFund ? `, davon ${mitFund} mit Fundstellen` : ""}`);
  }
  if (bericht.bytes > 5 * 1048576) bericht.gruende.push(`${fmtSize(bericht.bytes)} — grösser als 5 MB`);
  if (bericht.anzahl > 200) bericht.gruende.push(`${bericht.anzahl} Dateien — mehr als 200`);
  return bericht;
}

function printInspection(berichte) {
  console.log("\n  Prüfung vor dem Kopieren:\n");
  for (const b of berichte) {
    console.log(`  ${b.gruende.length ? "!" : "-"} ${b.id} (${b.type}) — ${b.anzahl} Datei(en), ${fmtSize(b.bytes)}`);
    if (!b.gruende.length) { console.log("      nichts Ausführbares gefunden"); continue; }
    for (const g of b.gruende) console.log(`      ${g}`);

    // Ein Plugin bringt 296 ausführbare Dateien mit, 123 davon mit Fundstellen —
    // vollständig ausgegeben wäre das eine Wand, die niemand liest, und damit
    // schlechter als eine kurze Liste. Deshalb: erst die auffälligen Dateien,
    // höchstens zwölf, der Rest als Zahl. Wer mehr will, hat `show`.
    const mitFund = b.dateien.filter((d) => d.funde.length);
    const ohneFund = b.dateien.filter((d) => !d.funde.length);
    const zeigen = (mitFund.length ? mitFund : ohneFund).slice(0, 12);
    for (const d of zeigen) {
      console.log(`      ${d.rel}  (${fmtSize(d.bytes)}, ${d.zeilen} Zeilen${d.shebang ? ", Shebang" : ""})`);
      for (const f of d.funde.slice(0, 4)) console.log(`        Z.${String(f.zeile).padStart(4)}  ${f.label.padEnd(16)} ${f.text}`);
      if (d.funde.length > 4) console.log(`        ... ${d.funde.length - 4} weitere Fundstelle(n) in dieser Datei`);
    }
    const restFund = mitFund.length - (mitFund.length ? zeigen.length : 0);
    const restOhne = ohneFund.length - (mitFund.length ? 0 : zeigen.length);
    if (restFund > 0) console.log(`      ... ${restFund} weitere Datei(en) mit Fundstellen, hier nicht aufgeführt`);
    if (restOhne > 0) console.log(`      ... ${restOhne} weitere ausführbare Datei(en) ohne Fundstelle`);
    if (b.gekuerzt) console.log("      (zu viele Dateien — nicht alle geöffnet, Rest ungeprüft)");
  }
  // Die Summe, nicht nur die Einzelzeilen: die Auswahl wird als Menge getroffen
  // ("dieses Kern-Set"), und die Frage vor dem Kopieren lautet, was das Paket
  // zusammen kostet. Ohne diese Zeile muss sie jeder selbst addieren — und jede
  // Bar-Formulierung in einem Rezept ("höchstens 50 KB") bliebe unprüfbar.
  const summeBytes = berichte.reduce((s, b) => s + b.bytes, 0);
  const summeDateien = berichte.reduce((s, b) => s + b.anzahl, 0);
  console.log("");
  console.log(`  Zusammen: ${berichte.length} Baustein(e), ${summeDateien} Datei(en), ~${fmtSize(summeBytes)}`);
  console.log("");
  console.log("  Das ist eine Sichtprüfung, kein Schutz: ein Textmuster-Abgleich erkennt keinen");
  console.log("  verschleierten Aufruf und sagt nichts über Absicht. Er zeigt, was sonst");
  console.log("  unbemerkt ins Projekt käme. Wer bestätigt, hat entschieden.");
}

/**
 * Rückfrage vor dem Kopieren.
 *
 * Ohne TTY und ohne `--yes` wird **nicht** installiert. Stilles Durchwinken wäre
 * schlimmer als gar keine Prüfung: es sähe aus wie eine bestandene Kontrolle,
 * obwohl niemand hingesehen hat.
 */
function confirmInstall(flags) {
  if (flags.yes) { console.log("\n  --yes: ohne Rückfrage bestätigt.\n"); return true; }
  if (!process.stdin.isTTY) {
    console.log("\n  Abbruch: keine Eingabemöglichkeit (kein TTY) und kein --yes — nichts kopiert.");
    console.log("  Wenn die Fundstellen oben gelesen und in Ordnung sind: denselben Befehl mit --yes.");
    // Kein `die()`: die Meldung oben ist die eigentliche Nachricht. Aber ein
    // Skript, das `install` aufruft, darf einen Abbruch nicht als Erfolg lesen.
    process.exitCode = 1;
    return false;
  }
  process.stdout.write("\n  Fortfahren? [j/N] ");
  let antwort = "";
  try {
    const buf = Buffer.alloc(64);
    const n = fs.readSync(0, buf, 0, buf.length, null);
    antwort = buf.toString("utf8", 0, n).trim().toLowerCase();
  } catch {
    console.log("\n  Abbruch: Eingabe nicht lesbar — nichts kopiert. Mit --yes wiederholen.");
    process.exitCode = 1;
    return false;
  }
  if (antwort === "j" || antwort === "ja" || antwort === "y" || antwort === "yes") return true;
  console.log("  Abgebrochen — nichts kopiert.");
  process.exitCode = 1;
  return false;
}

// ---------------------------------------------------------------- Zustandsbericht

/**
 * Was nach dem Kopieren tatsächlich wirkt — und was nicht.
 *
 * Warum das eine eigene Ebene braucht: `install` meldete bisher den
 * **Kopiervorgang** ("+ id -> pfad"). Das ist nicht dasselbe wie das Ergebnis. Ein
 * Skill liegt nach dem Kopieren an seinem Platz und wird geladen; ein Hook liegt
 * ebenfalls an seinem Platz und tut **nichts**, solange er nicht in
 * `.claude/settings.json` eingetragen ist. Beide meldete das CLI mit demselben "+".
 * Wer das las, hielt einen wirkungslosen Hook für installiert — und ein Agent, der
 * `install` aufruft und danach berichtet, gab diesen Irrtum weiter.
 *
 * Der Bericht sagt deshalb pro Baustein: wirksam oder nicht, und bei "nicht" den
 * fehlenden Schritt. Bei Hooks nicht als Beschreibung, sondern als
 * einsetzfertiger JSON-Schnipsel — die Beschreibung "trag ihn in settings.json ein"
 * ist genau die Auskunft, die den User googeln lässt.
 *
 * Die Zeilen beginnen mit `[aktiv]` / `[inaktiv]`, damit ein Agent den Bericht ohne
 * Sprachverständnis auswerten und die inaktiven Bausteine weiterreichen kann.
 */

/** Ereignisse, unter denen ein Hook in `settings.json` steht. Bewusst **nicht**
 *  `HOOK_EVENTS`: dort sind `hookSpecificOutput` und `permissionDecision`
 *  mitgeführt, weil sie eine Datei als Hook ausweisen — als Schlüssel in
 *  settings.json wären sie falsch, denn es sind Ausgabefelder, keine Ereignisse. */
const HOOK_EVENT_NAMES = ["PreToolUse", "PostToolUse", "UserPromptSubmit", "Stop", "SubagentStop", "SessionStart", "SessionEnd", "PreCompact", "Notification"];
const HOOK_EVENT_RE = new RegExp(`\\b(${HOOK_EVENT_NAMES.join("|")})\\b`, "g");
/** Nur diese beiden filtern nach Werkzeug, nur sie tragen einen `matcher`. */
const MATCHER_EVENTS = new Set(["PreToolUse", "PostToolUse"]);

/** Wie die Datei gestartet wird. Ohne Eintrag hier steht der Pfad allein da —
 *  richtig für alles mit Shebang und gesetztem Ausführungsrecht. */
const HOOK_RUNNER = {
  ".py": "python", ".rb": "ruby", ".pl": "perl",
  ".sh": "bash", ".bash": "bash", ".zsh": "zsh",
  ".js": "node", ".mjs": "node", ".cjs": "node",
  ".ps1": "powershell -NoProfile -File",
};

/** Beide Dateien, weil Hooks in `settings.json` wie in `settings.local.json`
 *  stehen dürfen — nur in einer zu suchen meldete einen registrierten Hook als
 *  wirkungslos, und eine falsche Warnung kostet mehr Vertrauen als keine. */
function settingsText(target) {
  return ["settings.json", "settings.local.json"]
    .map((n) => safeRead(path.join(target, ".claude", n)))
    .join("\n");
}

function hookBefehl(relPfad) {
  const zitiert = `"$CLAUDE_PROJECT_DIR/${relPfad}"`;
  const runner = HOOK_RUNNER[path.extname(relPfad).toLowerCase()];
  return runner ? `${runner} ${zitiert}` : zitiert;
}

/**
 * Rät das Ereignis aus dem Hook-Code — nach Häufigkeit der Nennung.
 *
 * Das Frontmatter, wenn vorhanden, sticht: es ist eine Aussage des Autors, der
 * Textfund nur ein Indiz. Ein Hook, der beide Ereignisse nennt, bekommt beide
 * genannt statt eines geratenen — falsch eingetragen ist schlimmer als ungefragt.
 */
function hookEreignisse(text, meta) {
  if (meta && meta.event) return [String(meta.event).trim()];
  const zaehler = new Map();
  for (const m of text.matchAll(HOOK_EVENT_RE)) zaehler.set(m[1], (zaehler.get(m[1]) || 0) + 1);
  return [...zaehler.entries()].sort((a, b) => b[1] - a[1]).map(([e]) => e);
}

function hookSnippet(relPfad, ereignis, matcher) {
  const eintrag = { type: "command", command: hookBefehl(relPfad) };
  const gruppe = MATCHER_EVENTS.has(ereignis)
    ? { matcher: matcher || "*", hooks: [eintrag] }
    : { hooks: [eintrag] };
  return JSON.stringify({ hooks: { [ereignis]: [gruppe] } }, null, 2);
}

/**
 * Ausführbare Dateien **im Paket eines Skills**, die ein Lifecycle-Ereignis nennen.
 *
 * Warum das gebraucht wird: `affaan-m__ecc/skill/delivery-gate` bringt ein
 * `hooks/quality-gate.py` mit. Der Skill-Anteil wirkt durch blosses Vorhandensein —
 * für ihn ist "aktiv, kein weiterer Schritt" richtig. Das mitgelieferte Skript
 * dagegen bleibt unregistriert und feuert nie, das angekündigte Stop-Gate greift
 * also nicht. Beides in einer Zeile "aktiv" zusammenzufassen ist die irreführendere
 * Hälfte: wer den Bericht liest, hält das Gate für scharf.
 *
 * Bewusst nur Dateien mit einem Ereignisnamen im Code — ein Hilfsskript ohne
 * `PreToolUse`/`Stop` ist Teil des Skills und wird von ihm aufgerufen, nicht von
 * Claude Code. Der Deckel bei 200 Dateien hält Pakete mit Hunderten Dateien draussen.
 */
function mitgelieferteHooks(basis) {
  const treffer = [];
  try { if (!basis || !fs.statSync(basis).isDirectory()) return treffer; } catch { return treffer; }
  let gesehen = 0;
  walk(basis, (p, isDir) => {
    if (isDir || gesehen >= 200 || treffer.length >= 4) return;
    const b = path.basename(p);
    if (!EXEC_EXT.test(b)) return;
    gesehen++;
    const ereignisse = hookEreignisse(safeRead(p), null);
    if (ereignisse.length) {
      treffer.push({ rel: path.relative(basis, p).split(path.sep).join("/"), ereignisse });
    }
  });
  return treffer;
}

/**
 * Bestimmt den Zustand **eines** Manifest-Eintrags im Zielprojekt.
 *
 * Arbeitet auf der installierten Kopie, nicht auf dem Katalog. Damit gilt der
 * Befund auch für Bausteine aus früheren Läufen: wer den Hook inzwischen in
 * settings.json eingetragen hat, sieht ihn beim nächsten `install` als aktiv,
 * ohne dass irgendwo ein Zustand nachgeführt werden müsste.
 *
 * `extra.quelle` ist der Weg für `--dry-run`: dort gibt es die Zieldatei noch
 * nicht, gelesen wird dann die Quelle im Klon.
 */
function activationOf(entry, target, extra = {}) {
  const rel = entry.installedTo || "";
  const ziel = path.join(target, rel);
  const base = path.basename(rel);

  if (entry.type === "skill" || entry.type === "agent" || entry.type === "command") {
    // Diese drei greifen durch blosses Vorhandensein — Claude Code liest die
    // Verzeichnisse beim Sitzungsstart selbst ein. Nichts einzutragen.
    const wo = entry.type === "skill" ? ".claude/skills" : entry.type === "agent" ? ".claude/agents" : ".claude/commands";
    // ... für den Skill-Anteil. Bringt das Paket ein Hook-Skript mit, gilt der Satz
    // "kein weiterer Schritt" für dieses Skript **nicht**.
    const hooks = mitgelieferteHooks(fs.existsSync(ziel) ? ziel : extra.quelle);
    const einschraenkung = hooks.length
      ? `enthält ${hooks.map((h) => `${h.rel} (${h.ereignisse.slice(0, 2).join("/")})`).join(", ")}` +
        " — nicht in .claude/settings.json registriert, dieser Teil wirkt nicht"
      : null;
    return {
      status: "aktiv", grund: null,
      wirkung: `wird aus ${wo}/ beim nächsten Sitzungsstart geladen — kein weiterer Schritt`,
      einschraenkung, snippet: null,
    };
  }

  if (entry.type === "hook") {
    // Der verlässlichste Beleg für "registriert" ist der Dateiname in der
    // settings.json. Ein JSON-Parse wäre genauer, scheitert aber an jeder
    // Datei mit Kommentaren — und ein Fehlalarm ist hier der teurere Fehler.
    if (base && settingsText(target).includes(base)) {
      return { status: "aktiv", grund: null, wirkung: "in .claude/settings.json registriert", snippet: null };
    }
    const datei = fs.existsSync(ziel) ? ziel : (extra.quelle || ziel);
    let text = "";
    try { text = fs.statSync(datei).isDirectory() ? "" : safeRead(datei); } catch { /* egal */ }
    const ereignisse = hookEreignisse(text, extra.meta || entry.meta);
    const matcher = (extra.meta || entry.meta || {}).matcher;
    return {
      status: "inaktiv: nicht in .claude/settings.json registriert",
      grund: "kopiert, aber wirkungslos — ein Hook feuert nur, wenn er unter einem Ereignis in .claude/settings.json steht",
      wirkung: null,
      ereignisse,
      matcher,
      snippet: ereignisse.length ? hookSnippet(rel, ereignisse[0], matcher) : null,
    };
  }

  if (entry.type === "mcp") {
    // `TARGET_BY_TYPE.mcp` ist das Projektwurzelverzeichnis, und der Extraktor
    // klassifiziert jede passende JSON als MCP. Heisst die Datei nicht
    // `.mcp.json`, liest Claude Code sie nie — sie liegt dann nur herum.
    if (base !== ".mcp.json") {
      return {
        status: `inaktiv: heisst ${base}, nicht .mcp.json`,
        grund: "Claude Code liest MCP-Server nur aus .mcp.json im Projektwurzelverzeichnis — diese Datei ist Vorlage, keine Konfiguration",
        wirkung: null, snippet: null,
      };
    }
    const text = safeRead(fs.existsSync(ziel) ? ziel : (extra.quelle || ziel));
    // Platzhalter sind der Normalfall bei fremden MCP-Konfigurationen: der Server
    // startet, meldet 401 und der User sucht den Fehler im falschen Werkzeug.
    const platz = [...new Set((text.match(/\$\{?[A-Z][A-Z0-9_]{2,}\}?|<[A-Za-z_-]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Za-z_-]*>/g) || []))].slice(0, 6);
    return {
      status: platz.length ? "inaktiv: Zugangsdaten fehlen" : "inaktiv: Bestätigung beim nächsten Start nötig",
      grund: platz.length
        ? `Platzhalter in der Konfiguration (${platz.join(", ")}) — ohne gesetzte Werte startet der Server nicht`
        : "Claude Code fragt beim nächsten Start, ob die MCP-Server dieses Projekts benutzt werden dürfen",
      wirkung: null, snippet: null,
    };
  }

  if (entry.type === "plugin") {
    return {
      status: "inaktiv: Plugins werden nicht aus .claude/plugins geladen",
      grund: "ein Ordner dort aktiviert nichts — ein Plugin wird über einen Marketplace-Eintrag mit /plugin aktiviert. Die enthaltenen Skills/Commands wirken erst danach",
      wirkung: null, snippet: null,
    };
  }

  return { status: "unbekannt", grund: `Typ ${entry.type} — Wirksamkeit nicht bestimmbar`, wirkung: null, snippet: null };
}

/**
 * Der Bericht. Zwei Adressaten, eine Ausgabe: der User liest die Prosa, ein Agent
 * die Marken am Zeilenanfang und die Ergebniszeile am Ende.
 */
function printActivation(zustaende, dry) {
  console.log(`\n  Zustand im Zielprojekt${dry ? " (nach einem Lauf ohne --dry-run)" : ""}:\n`);
  for (const { entry, z } of zustaende) {
    const marke = z.status === "aktiv" ? "[aktiv]  " : "[inaktiv]";
    console.log(`  ${marke} ${entry.id}  ->  ${entry.installedTo}`);
    if (z.status === "aktiv") {
      console.log(`            ${z.wirkung}`);
      // Die Einschränkung steht unter der aktiven Zeile, nicht als eigener Zustand:
      // der Baustein *ist* aktiv, nur nicht in dem Teil, den seine Beschreibung
      // am lautesten verspricht.
      if (z.einschraenkung) {
        console.log(`            aber: ${z.einschraenkung}`);
        console.log("            Das Gate, das die Beschreibung verspricht, ist damit nicht scharf.");
      }
      continue;
    }
    console.log(`            ${z.status}`);
    if (z.grund) console.log(`            ${z.grund}`);
    if (z.ereignisse && z.ereignisse.length > 1) {
      console.log(`            Ereignis nicht eindeutig — im Code genannt: ${z.ereignisse.join(", ")}. Unten steht das häufigste.`);
    } else if (z.ereignisse && !z.ereignisse.length) {
      console.log("            Ereignis nicht aus dem Code ableitbar — Hook öffnen und selbst zuordnen.");
    }
    if (z.snippet) {
      console.log("\n            In .claude/settings.json eintragen (bestehende Ereignisse ergänzen, nicht ersetzen):\n");
      for (const l of z.snippet.split("\n")) console.log(`            ${l}`);
      console.log("");
    }
  }
  const aktiv = zustaende.filter((x) => x.z.status === "aktiv").length;
  const teilweise = zustaende.filter((x) => x.z.status === "aktiv" && x.z.einschraenkung).length;
  const offen = zustaende.length - aktiv;
  console.log(`\n  Ergebnis: ${aktiv} von ${zustaende.length} wirksam, ${offen} brauchen einen Schritt von Hand.`);
  if (teilweise) console.log(`  ${teilweise} davon nur teilweise: mitgeliefertes Hook-Skript nicht registriert (siehe "aber:").`);
  if (offen) console.log("  Wer diesen Lauf berichtet, nennt die [inaktiv]-Zeilen mit: kopiert heisst nicht wirksam.");
}

/**
 * Schreibt einen Regelblock in die CLAUDE.md des Zielprojekts.
 *
 * Warum das der wichtigste Teil von `install` ist: Ein dreistufiger Index nützt
 * nichts, wenn der Agent im Zielprojekt gar nicht weiss, dass er ihn benutzen soll.
 * Ohne diesen Block greift er zum Naheliegenden — Glob über die Bibliothek, Read
 * auf index.json — und hat sein Kontextfenster voll, bevor er anfängt. Der Block
 * verlagert die Regel dorthin, wo sie gilt: ins Zielprojekt, immer geladen.
 *
 * Idempotent über Marker-Kommentare: mehrfaches Installieren ersetzt den Block,
 * statt ihn zu vervielfachen. Alles ausserhalb der Marker bleibt unangetastet.
 */
const CLAUDE_MD_START = "<!-- harness-library:start — automatisch erzeugt, Änderungen hier gehen verloren -->";
const CLAUDE_MD_END = "<!-- harness-library:end -->";

function claudeMdBlock(installed, catalogGeneratedAt, target) {
  // Die Bibliothek kann auf sich selbst angewendet werden — und soll das auch,
  // denn ein Werkzeug, das seine eigenen Regeln nicht befolgt, taugt nichts.
  // Dann stimmt aber "dieses Projekt bezieht Bausteine aus ..." nicht mehr:
  // es bezieht nicht, es ist die Quelle.
  const selbst = target && path.resolve(target) === path.resolve(ROOT);

  const L = [];
  L.push(CLAUDE_MD_START);
  L.push("## Harness-Bibliothek");
  L.push("");
  L.push(selbst
    ? "Dies **ist** die Harness-Bibliothek. Die Regeln unten gelten für die Arbeit an ihr selbst — sie sind dieselben, die sie jedem Zielprojekt mitgibt."
    : `Dieses Projekt bezieht Harness-Bausteine aus \`${ROOT}\`.`);
  L.push("");
  L.push("### Zugriffsregel — bindend");
  L.push("");
  L.push("Der Katalog umfasst über 25.000 Bausteine. Wer ihn einliest, hat sein");
  L.push("Kontextfenster voll, bevor er die erste Zeile Projektcode sieht. Deshalb:");
  L.push("");
  L.push("- **Nie** `catalog/index.json` lesen.");
  L.push("- **Nie** die Repo-Klone unter `" + CLONE_DIR + "` mit Glob/Grep/Read durchsuchen.");
  L.push("- Der einzige Zugriffsweg ist das CLI:");
  L.push("");
  L.push("```bash");
  L.push(`cd "${ROOT}"`);
  L.push('node tools/harness.mjs search "<stichwort>" [--type X] [--domain X] [--limit N]');
  L.push("node tools/harness.mjs intent --list      # kein Stichwort, nur ein Symptom?");
  L.push("node tools/harness.mjs intent <id>        # die hinterlegten Suchen dieser Absicht");
  L.push("node tools/harness.mjs show <id>");
  L.push(`node tools/harness.mjs list --to "${"<dieses Projekt>"}"     # was liegt hier schon?`);
  L.push(`node tools/harness.mjs install <id> --to "${"<dieses Projekt>"}"`);
  L.push("```");
  L.push("");
  L.push("Reihenfolge bei einer Frage nach passenden Bausteinen: erst `search` — oder");
  L.push("`intent`, wenn nur ein Symptom vorliegt und kein Suchwort —, dann `show` für die");
  L.push("engere Auswahl, dann `install`. Davor `list`: was schon liegt, wird nicht ersetzt.");
  L.push("");
  // Diese drei Fallen sind der Grund, warum eine Suche leer ausgeht — alle drei am
  // laufenden Katalog gemessen und als Fall in evals/routing.jsonl festgehalten.
  // Ohne sie wiederholt der Agent dieselbe Anfrage, statt ihre Form zu ändern.
  L.push("### Wenn die Suche nichts Passendes findet");
  L.push("");
  L.push("Nicht dieselbe Anfrage wiederholen. Das Suchverhalten hat drei belegte Fallen:");
  L.push("");
  L.push("- **Mehrere Wörter gelten als UND.** Trägt kein Baustein alle, fällt die Suche");
  L.push("  auf ODER zurück und sagt das („Kein Baustein enthält alle Suchwörter\"). Je");
  L.push("  gängiger die Einzelwörter, desto mehr Teiltreffer — ein Projektprofil mit sieben");
  L.push("  Wörtern liefert über 250. Zwei gezielte Wörter sind besser als das ganze Profil.");
  L.push("- **Die Suche matcht am Wortanfang.** Der Stamm findet alle längeren Formen");
  L.push("  (`review` findet `reviews`, `reviewer`, `reviewing`); ein Plural-s wird");
  L.push("  abgeschnitten, jede andere längere Form findet die kürzere nicht, und zwei");
  L.push("  Endungen am selben Stamm finden einander nicht (`pruefen` findet `pruefung`");
  L.push("  nicht). Deshalb den Wortstamm eingeben: `pruef` findet beides.");
  L.push("- **Der Standardbestand ist englisch beschrieben.** Deutsche Anfragen laufen");
  L.push("  dort ins Leere; den englischen Fachbegriff einsetzen. Die deutschen Bausteine");
  L.push("  liegen im Massen-Repo `legal-de` und sind nur mit `--domain legal-de` oder");
  L.push("  `--all` erreichbar.");
  L.push("");
  L.push("Bleibt es dabei, ist auch das ein Ergebnis: **kein Baustein ist besser als ein");
  L.push("unpassender.** Dann nichts installieren, sondern die Lücke unter „Lücken\" in");
  L.push("`" + path.join(ROOT, "sources.txt") + "` vermerken — das Format steht dort.");
  L.push("");
  // Absoluter Pfad, kein blosses "INDEX.md": in einem fremden Projekt zeigt der
  // relative Name auf die falsche Datei oder ins Leere — und dann rät der Agent.
  // Die Zahl aus dem Dispatcher lesen, nicht ausschreiben: "alle elf Befehle" stand
  // hier, während der Dispatcher zwölf führte — und der Block wird in jedes
  // Zielprojekt geschrieben, die falsche Zahl also vervielfältigt.
  const befehlsZahl = [...cliOberflaeche().subcommands].filter((s) => !["know", "why"].includes(s)).length;
  L.push(`Wer mehr braucht — alle ${befehlsZahl} Befehle, Bestand nach Typ und Domäne, die vollen`);
  L.push(`Verbote —, liest \`${path.join(ROOT, "INDEX.md")}\` **komplett**. Sie ist unter`);
  L.push("hundert Zeilen lang und genau dafür da. Kein Ersatz dafür, im Verzeichnis der");
  L.push("Bibliothek herumzusuchen.");
  L.push("");
  L.push("### Die Wissensbank befragen");
  L.push("");
  L.push("Die Bibliothek enthält nicht nur Bausteine, sondern begründetes Wissen dazu,");
  L.push("wie man ein Agenten-Setup richtig baut — ausgewertet aus Anthropics");
  L.push("Engineering-Material und Konferenzvorträgen von Praktikern.");
  L.push("");
  L.push("```bash");
  L.push('node tools/harness.mjs knowledge "<frage>"     # liefert Abschnitte, keine Dateien');
  L.push("node tools/harness.mjs knowledge --list        # Inhaltsverzeichnis");
  L.push("```");
  L.push("");
  L.push("**Wann das dran ist** — nicht nur bei Fragen zur Bibliothek, sondern immer,");
  L.push("wenn eine Entscheidung über den Aufbau dieses Projekts ansteht:");
  L.push("");
  L.push("- Soll eine Regel als Hook, Skill oder in die CLAUDE.md? → `knowledge \"hook statt skill\"`");
  L.push("- Lohnt sich hier ein Subagent? → `knowledge \"subagent kontext kosten\"`");
  L.push("- Wie prüft man Ergebnisse, ohne dass der Agent sich selbst gut findet?");
  L.push("  → `knowledge \"evaluator agent\"`");
  L.push("- Wird das Setup zu komplex? → `knowledge \"einfachste lösung zuerst\"`");
  L.push("");
  L.push("Die Wissensbank-Dateien **nicht** am Stück lesen. Sie umfassen tausende Zeilen");
  L.push("und wachsen weiter; `knowledge` schneidet den passenden Abschnitt heraus.");
  L.push("");
  if (installed.length) {
    L.push("### Installierte Bausteine");
    L.push("");
    L.push("| Baustein | Typ | Liegt in | Zustand |");
    L.push("|---|---|---|---|");
    // Der Zustand wird hier **neu bestimmt** statt aus dem Manifest übernommen:
    // wer den Hook seit der Installation in settings.json eingetragen hat, soll
    // ihn nicht auf Dauer als wirkungslos gemeldet bekommen. Die Angabe im
    // Manifest ist der Stand des Installationslaufs, die hier ist der von heute.
    for (const m of installed) {
      const z = target ? activationOf(m, target) : null;
      const st = z
        ? z.status + (z.einschraenkung ? " (mitgeliefertes Hook-Skript nicht registriert)" : "")
        : (m.status || "unbekannt");
      L.push(`| \`${m.id}\` | ${m.type} | \`${m.installedTo}\` | ${st} |`);
    }
    L.push("");
    L.push("**Kopiert ist nicht wirksam.** Skills, Subagents und Commands greifen durch");
    L.push("blosses Vorhandensein; Hooks brauchen einen Eintrag in `.claude/settings.json`,");
    L.push("MCP-Server eine bestätigte `.mcp.json` samt Zugangsdaten, Plugins eine");
    L.push("Aktivierung über `/plugin`. Was hier als `inaktiv:` steht, tut nichts.");
    L.push("");
    L.push(`Stand des Katalogs bei der Installation: ${String(catalogGeneratedAt).slice(0, 16).replace("T", " ")}.`);
    L.push("Herkunftsnachweis: `.claude/harness-manifest.json`.");
    L.push("");
  }
  L.push("### Wo das Wissen herkommt");
  L.push("");
  L.push("`knowledge/` — Begründungen, nicht Bedienungsanleitungen. Harness-Design nach");
  L.push("Anthropic, die sechs Baustein-Typen im Vergleich, Kontext-Vorbilder,");
  L.push("Governance ab Bibliotheksgrösse, ausgewertete Konferenzvorträge.");
  L.push("`recipes/` — Baupläne pro Projekttyp mit verifizierten Baustein-IDs.");
  L.push("");
  L.push("Beides über `knowledge` abfragen statt am Stück lesen.");
  L.push(CLAUDE_MD_END);
  return L.join("\n");
}

function writeClaudeMd(target, installed, catalogGeneratedAt) {
  const file = path.join(target, "CLAUDE.md");
  const block = claudeMdBlock(installed, catalogGeneratedAt, target);
  let text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

  const s = text.indexOf(CLAUDE_MD_START);
  const e = text.indexOf(CLAUDE_MD_END);
  if (s !== -1 && e !== -1 && e > s) {
    text = text.slice(0, s) + block + text.slice(e + CLAUDE_MD_END.length);
  } else {
    if (text && !text.endsWith("\n")) text += "\n";
    text += (text ? "\n" : "") + block + "\n";
  }
  fs.writeFileSync(file, text);
  return file;
}

/**
 * Ermittelt das Zielverzeichnis — und verweigert die Arbeit, wenn keines genannt
 * wurde.
 *
 * Warum kein Rückfall auf das Arbeitsverzeichnis: Diese Befehle schreiben und
 * löschen in fremden Projekten. Ein stiller Standardwert bedeutet, dass ein
 * vergessenes `--to` nicht auffällt, sondern irgendwo Dateien anlegt oder
 * entfernt — bei `uninstall` unwiederbringlich. Genau das ist beim Prüfen dieses
 * Codes passiert: ein Testaufruf ohne `--to` installierte in die Bibliothek selbst
 * und schrieb deren CLAUDE.md um.
 *
 * Lieber ein Abbruch mit klarer Ansage als eine Aktion am falschen Ort.
 */
function requireTarget(flags, befehl, { erlaubeSelbst = false, positional = false, grund = "weil es in einem fremden Projekt schreibt" } = {}) {
  // `positional` nur dort, wo die freien Argumente nicht schon belegt sind:
  // bei install und uninstall sind das die Baustein-IDs, nicht das Ziel.
  const roh = flags.to || (positional ? flags._[0] : null);
  if (!roh || roh === true) {
    die(`Kein Zielverzeichnis angegeben.\n` +
        `  ${befehl} verlangt --to, ${grund}.\n` +
        `  Beispiel: node tools/harness.mjs ${befehl} ... --to "C:\\Pfad\\zum\\Projekt"\n` +
        `  Für das aktuelle Verzeichnis ausdrücklich: --to .`);
  }
  const target = path.resolve(String(roh));
  if (!fs.existsSync(target)) die(`Zielverzeichnis existiert nicht: ${target}`);
  if (!erlaubeSelbst && path.resolve(target) === path.resolve(ROOT)) {
    die(`Ziel ist die Bibliothek selbst: ${target}\n` +
        `  ${befehl} ist für Zielprojekte gedacht. Für die Bibliothek selbst gibt es\n` +
        `  nur 'bootstrap --to .' — das schreibt den Regelblock, ohne Bausteine zu kopieren.`);
  }
  return target;
}

function cmdInstall(argv) {
  const flags = parseFlags(argv);
  const target = requireTarget(flags, "install");
  const cat = loadCatalog();
  const dry = !!flags["dry-run"];
  if (!flags._.length) die("Keine ID angegeben. Beispiel: install affaan-m__ecc/skill/tdd-workflow --to C:\\proj");

  // Erst auflösen, dann prüfen, dann kopieren. Die Trennung ist der Kern der
  // Installationsgrenze: läge der Halt in der Kopierschleife, wäre der erste
  // Baustein längst geschrieben, während der zweite noch zur Bestätigung ansteht.
  const plan = [];
  // Die bereits **geplanten** Ziele mitführen, nicht nur die vorhandenen.
  // `fs.existsSync` sieht zur Planzeit nichts: geschrieben wird erst später. Genau
  // daran ging die Kollision durch, die der Echtlauf dann traf — `--dry-run` sagte
  // sie nicht voraus, und `--force` überschrieb nicht, sondern **mischte** zwei
  // Autoren in einem Ordner.
  const geplant = new Map();
  let kollision = false;
  for (const id of flags._) {
    const it = findItem(cat, id);
    if (!it) { console.log(`  ! nicht gefunden: ${id}`); continue; }
    const src = path.join(CLONE_DIR, it.path);
    if (!fs.existsSync(src)) { console.log(`  ! Quelle fehlt: ${src}`); continue; }

    const subdir = TARGET_BY_TYPE[it.type] || ".claude";
    const leaf = it.type === "skill" || it.type === "plugin" ? slug(it.name) : path.basename(it.path);
    const dest = path.join(target, subdir, leaf);
    const zielRel = path.relative(target, dest).split(path.sep).join("/");
    // Windows vergleicht Pfade ohne Rücksicht auf Gross-/Kleinschreibung; zwei
    // Bausteine mit `Design-System` und `design-system` landen dort im selben Ordner.
    const schluessel = path.resolve(dest).toLowerCase();

    if (geplant.has(schluessel)) {
      console.log(`  ! Kollision: \`${it.id}\` und \`${geplant.get(schluessel)}\` zielen beide auf ${zielRel}`);
      kollision = true;
      continue;
    }
    geplant.set(schluessel, it.id);

    // Konfigurationsdateien sind kein Baustein-Paket, sondern Zustand des Projekts.
    if (KONFIG_DATEI_RE.test(path.basename(dest)) && fs.existsSync(dest)) {
      console.log(`  ! ${it.id} — \`${path.basename(dest)}\` ist eine Konfigurationsdatei des Projekts, kein Paket:`);
      console.log("      sie würde als Ganzes ersetzt, nicht zusammengeführt.");
      const vorhanden = konfigSchluessel(dest);
      const neu = konfigSchluessel(src);
      if (vorhanden && neu) {
        const gemeinsam = [...neu].filter((k) => vorhanden.has(k));
        console.log(gemeinsam.length
          ? `      Im Konflikt: ${gemeinsam.slice(0, 8).join(", ")} — diese Einträge des Projekts gingen verloren.`
          : `      Keine gemeinsamen Schlüssel (vorhanden: ${[...vorhanden].slice(0, 6).join(", ") || "—"}) — sie gingen trotzdem verloren.`);
      } else {
        console.log("      Eine der beiden Dateien ist kein lesbares JSON — Inhalt von Hand vergleichen.");
      }
      console.log("      Richtiger Weg: `show` lesen und die gewünschten Einträge von Hand übernehmen.");
    }

    if (fs.existsSync(dest) && !flags.force) {
      console.log(`  = ${it.id} — existiert schon (${zielRel}), --force zum Überschreiben`);
      continue;
    }
    plan.push({ it, src, dest });
  }

  // Eine Kollision im selben Aufruf ist kein Grund für "der letzte gewinnt": beide
  // IDs wurden ausdrücklich genannt, und welche gemeint war, weiss nur der Aufrufer.
  // Auch `--force` hebt das nicht auf — es erlaubt, Vorhandenes zu ersetzen, nicht,
  // zwei Bausteine auf denselben Platz zu legen.
  if (kollision) {
    console.log("\n  Abbruch — nichts kopiert. Zwei Bausteine auf denselben Zielpfad ist");
    console.log("  keine Frage von --force, sondern eine Auswahl: einen der beiden weglassen");
    console.log("  oder den anderen in einem zweiten Aufruf mit --force installieren.");
    process.exitCode = 1;
    return;
  }
  if (!plan.length) return;

  // --dry-run zeigt die Analyse ebenfalls — sonst wäre der Probelauf genau um die
  // Angabe ärmer, wegen der man ihn macht.
  // Die Rückfrage hängt am **Vorgang**, nicht am Ergebnis der Mustersuche.
  //
  // Vorher hing sie an `gruende.length`: Fand die Erkennung nichts, gab es keine
  // Ausgabe, keine Rückfrage, keinen Abbruch ohne TTY. Damit war die Mustersuche
  // nicht die Qualität der Warnung, sondern der Ein-/Ausschalter der ganzen
  // Grenze — und jede Erkennungslücke wurde von "Fundstelle nicht gemeldet" zu
  // "ungefragt installiert". Da die Erkennung nachweislich Lücken hat (.pyw,
  // .php, .lua und weitere), wäre das eine Grenze gewesen, die genau dann
  // durchlässt, wenn sie gebraucht wird.
  //
  // Fremder Code wird in ein fremdes Projekt kopiert. Das allein ist der Anlass
  // zu fragen. Was die Erkennung findet, macht die Frage nur besser begründet.
  const berichte = plan.map((p) => inspectItem(p.it, p.src));
  printInspection(berichte);
  if (dry) {
    console.log("\n  --dry-run: hier stünde die Rückfrage. Nichts wird kopiert.\n");
  } else if (!confirmInstall(flags)) {
    return;
  }

  const manifest = [];
  const zustaende = [];
  const now = new Date().toISOString();
  for (const { it, src, dest } of plan) {
    console.log(`  ${dry ? "~" : "+"} ${it.id} -> ${path.relative(target, dest).split(path.sep).join("/")}`);
    // `--force` hiess bisher "Datei für Datei überschreiben". Was der neue Baustein
    // nicht mitbringt, blieb liegen: eine `SKILL.md` des einen Autors über vierzehn
    // `references/`-Dateien eines anderen. Das Ergebnis gehört niemandem, und das
    // Manifest kann es nicht beschreiben. Also erst leeren, dann kopieren.
    if (!dry && flags.force && fs.existsSync(dest)) {
      const drin = path.resolve(dest).startsWith(path.resolve(target) + path.sep);
      let istOrdner = false;
      try { istOrdner = fs.statSync(dest).isDirectory(); } catch { /* egal */ }
      if (drin && istOrdner) {
        fs.rmSync(dest, { recursive: true, force: true });
        console.log("      (--force: Zielordner vorher geleert — kein Mischbestand aus zwei Quellen)");
      }
    }
    const geschrieben = dry ? [] : copyRecursive(src, dest);
    // Die Dateiliste ist das, was den Weg zurück überhaupt erst möglich macht:
    // `installedTo` allein benennt nur den Ordner, und bei `mcp` sogar das
    // Projektwurzelverzeichnis — daraus liesse sich nichts löschen, ohne zu raten.
    // `commit` ist der Repo-Stand, aus dem die Kopie stammt; er steht bereits im
    // Katalog und wäre nach dem nächsten `sync` nicht mehr rekonstruierbar.
    const eintrag = {
      id: it.id, type: it.type, from: it.repo, sourcePath: it.path,
      installedTo: path.relative(target, dest).split(path.sep).join("/"),
      commit: cat.repos.find((r) => r.dir === it.repo)?.head || null,
      installedAt: now,
      bytes: it.bytes,
      files: geschrieben.map((f) => ({
        path: path.relative(target, f).split(path.sep).join("/"),
        md5: fileHash(f),
      })),
    };
    // Der Zustand kommt ins Manifest, nicht nur auf den Bildschirm: die Ausgabe
    // ist nach dem Schliessen des Terminals fort, der inaktive Hook bleibt.
    // Inaktive Einträge werden deshalb auch nie ausgelassen — sie sind kopiert,
    // und der Herkunftsnachweis muss sie führen, sonst löscht `uninstall` sie nie.
    const z = activationOf(eintrag, target, { meta: it.meta, quelle: src });
    eintrag.status = z.status;
    manifest.push(eintrag);
    zustaende.push({ entry: eintrag, z });
  }

  if (zustaende.length) printActivation(zustaende, dry);

  if (!dry && manifest.length) {
    // Manifest = Herkunftsnachweis. Ohne ihn weiss beim nächsten Update niemand mehr,
    // welcher Baustein aus welchem Repo stammt und ob er dort inzwischen anders aussieht.
    const mf = path.join(target, ".claude", "harness-manifest.json");
    let prev = [];
    if (fs.existsSync(mf)) { try { prev = JSON.parse(fs.readFileSync(mf, "utf8")).items || []; } catch { /* egal */ } }
    // Deduplizierung über `id` **und** `installedTo`. Warum beides: `--force`
    // schreibt einen anderen Baustein auf denselben Pfad. Wird nur über `id`
    // verglichen, stehen danach zwei IDs mit demselben `installedTo` im Manifest —
    // der Herkunftsnachweis behauptet dann zwei Herkünfte für eine Datei, die es
    // nur einmal gibt, und `uninstall` würde beim ersten Eintrag Dateien löschen,
    // die inzwischen dem zweiten gehören.
    const verdraengt = prev.filter((p) => !manifest.some((m) => m.id === p.id) && manifest.some((m) => m.installedTo === p.installedTo));
    for (const v of verdraengt) console.log(`  überschreibt \`${v.id}\` (${v.installedTo}) — Manifest-Eintrag entfernt`);
    const merged = [...prev.filter((p) => !manifest.some((m) => m.id === p.id || m.installedTo === p.installedTo)), ...manifest];
    fs.mkdirSync(path.dirname(mf), { recursive: true });
    fs.writeFileSync(mf, JSON.stringify({
      generatedAt: new Date().toISOString(),
      library: ROOT,
      catalogGeneratedAt: cat.generatedAt,
      items: merged,
    }, null, 2));
    console.log(`\n  Manifest: ${path.relative(target, mf).split(path.sep).join("/")} (${merged.length} Bausteine)`);

    if (!flags["no-claude-md"]) {
      const cf = writeClaudeMd(target, merged, cat.generatedAt);
      console.log(`  Regelblock: ${path.relative(target, cf).split(path.sep).join("/")}`);
    }
  }

  // Zum Schluss: Was ist im Zielprojekt sonst noch passiert? Siehe meldeSchaden().
  meldeSchaden(target);
}

/**
 * Räumt leergewordene Hüllen auf — aber nur die, und nur innerhalb des Zielprojekts.
 *
 * Ohne das bliebe nach dem letzten Skill ein leeres `.claude/skills/<name>/` stehen
 * und sähe aus wie eine kaputte Installation. Der Abbruch bei der ersten nicht
 * leeren Ebene ist der Punkt: fremde Nachbardateien halten den Ordner am Leben.
 */
function removeEmptyDirs(dir, stopAt) {
  const stop = path.resolve(stopAt);
  let d = path.resolve(dir);
  while (d !== stop && d.startsWith(stop + path.sep)) {
    try {
      if (fs.readdirSync(d).length) return;
      fs.rmdirSync(d);
    } catch { return; }
    d = path.dirname(d);
  }
}

/**
 * `uninstall <id...> --to DIR` — der Weg zurück.
 *
 * Warum das ohne Manifest nicht geht und mit Raten nicht gehen darf: Was zu einem
 * Baustein gehört, weiss nach dem Kopieren nur das Manifest. `installedTo` benennt
 * einen Ordner, und bei Typ `mcp` ist dieser Ordner das Projektwurzelverzeichnis —
 * ein rekursives Löschen darauf wäre kein Deinstallieren, sondern ein Unfall.
 * Deshalb gilt hier eine harte Regel: **gelöscht wird ausschliesslich, was namentlich
 * im Manifest steht.** Alles andere im selben Verzeichnis bleibt liegen, auch wenn
 * es offensichtlich dazugehört.
 *
 * Die zweite Regel schützt den User vor uns: hat er eine Datei nach der Installation
 * angepasst — md5 weicht ab —, bleibt sie stehen und der Manifest-Eintrag bleibt
 * mit ihr bestehen. Seine Arbeit wiegt schwerer als ein sauberer Rückbau. Erst
 * `--force` überstimmt das.
 */
function cmdUninstall(argv) {
  const flags = parseFlags(argv);
  const target = requireTarget(flags, "uninstall");
  const dry = !!flags["dry-run"];
  if (!flags._.length) die("Keine ID angegeben. Beispiel: uninstall affaan-m__ecc/skill/tdd-workflow --to C:\\proj");

  const mf = path.join(target, ".claude", "harness-manifest.json");
  if (!fs.existsSync(mf)) {
    die(`Kein Manifest in ${target}\n` +
        "  Ohne Manifest ist nicht belegbar, welche Dateien zu einem Baustein gehören.\n" +
        "  Hier wird nicht geraten — von Hand entfernen.");
  }
  let doc;
  try { doc = JSON.parse(fs.readFileSync(mf, "utf8")); } catch (e) { die(`Manifest nicht lesbar: ${e.message}`); }
  const items = Array.isArray(doc.items) ? doc.items : [];

  // Auflösen wie `install`: exakt, sonst case-insensitiv, sonst als Suffix.
  const treffer = [];
  for (const id of flags._) {
    const s = String(id).toLowerCase();
    const e = items.find((i) => i.id === id)
      || items.find((i) => String(i.id).toLowerCase() === s)
      || items.find((i) => String(i.id).toLowerCase().endsWith("/" + s));
    if (!e) { console.log(`  ! nicht im Manifest: ${id}`); continue; }
    if (!treffer.includes(e)) treffer.push(e);
  }
  if (!treffer.length) return;

  // Vorprüfung, bevor die erste Datei fällt: Manifeste aus der Zeit vor der
  // Dateiliste bleiben lesbar, aber sie tragen die nötige Angabe nicht. Abbruch
  // für den ganzen Lauf — ein halb ausgeführter Rückbau ist schlechter als keiner.
  const ohneListe = treffer.filter((e) => !Array.isArray(e.files) || !e.files.length);
  if (ohneListe.length) {
    console.log("Abbruch — Manifest-Einträge ohne Dateiliste (aus einer älteren Version):");
    for (const e of ohneListe) console.log(`  - ${e.id}  →  ${e.installedTo}`);
    console.log("\n  Diese Einträge nennen nur das Zielverzeichnis, nicht die Dateien darin.");
    console.log("  Entweder von Hand entfernen, oder einmal neu installieren");
    console.log("  (`install <id> --to DIR --force`) — danach führt das Manifest die Dateien.");
    process.exitCode = 1;
    return;
  }

  // Erst vollständig entscheiden, dann löschen — dieselbe Trennung wie in
  // `cmdInstall`: sonst ist Baustein 1 weg, während Baustein 2 noch geprüft wird.
  const plan = [];
  for (const e of treffer) {
    const weg = [], behalten = [], fehlt = [];
    for (const f of e.files) {
      const abs = path.resolve(target, f.path);
      // Das Manifest liegt im Projekt und ist editierbar. Ein Pfad, der aus dem
      // Zielverzeichnis herausführt, wird nicht angefasst.
      if (abs !== target && !abs.startsWith(target + path.sep)) {
        behalten.push({ f, grund: "Pfad ausserhalb des Zielprojekts" });
        continue;
      }
      if (!fs.existsSync(abs)) { fehlt.push(f); continue; }
      const jetzt = fileHash(abs);
      const geaendert = !!(f.md5 && jetzt && jetzt !== f.md5);
      if (geaendert && !flags.force) {
        behalten.push({ f, grund: "seit der Installation geändert — bleibt ohne --force" });
        continue;
      }
      weg.push({ f, abs, geaendert });
    }
    plan.push({ e, weg, behalten, fehlt });
  }

  let summeWeg = 0, summeBehalten = 0;
  for (const p of plan) {
    const herkunft = `${p.e.type}, aus ${p.e.from}${p.e.commit ? ` @ ${p.e.commit}` : ""}`;
    console.log(`\n${p.e.id}  (${herkunft})`);
    console.log(`  ${p.e.files.length} Datei(en) laut Manifest unter ${p.e.installedTo}`);
    for (const w of p.weg) console.log(`  ${dry ? "~" : "-"} ${w.f.path}${w.geaendert ? "   [geändert, per --force entfernt]" : ""}`);
    for (const b of p.behalten) console.log(`  = ${b.f.path}   bleibt: ${b.grund}`);
    if (p.fehlt.length) console.log(`  . ${p.fehlt.length} Datei(en) waren schon nicht mehr da`);
    summeWeg += p.weg.length;
    summeBehalten += p.behalten.length;
    if (!dry) {
      for (const w of p.weg) {
        try { fs.rmSync(w.abs, { force: true }); } catch (err) { console.log(`  ! ${w.f.path}: ${err.message}`); continue; }
        removeEmptyDirs(path.dirname(w.abs), target);
      }
    }
  }

  if (dry) {
    console.log(`\n  --dry-run: ${summeWeg} Datei(en) würden entfernt, ${summeBehalten} blieben stehen.`);
    console.log("  Nichts gelöscht, Manifest unverändert.");
    return;
  }

  // Manifest fortschreiben. Ein Eintrag verschwindet nur, wenn nichts von ihm
  // übrig blieb; sonst bleibt er mit den verbliebenen Dateien stehen — sonst
  // behauptete der Herkunftsnachweis Dateien, die es nicht mehr gibt, und die
  // stehengebliebenen hätten überhaupt keinen Nachweis mehr.
  const rest = [];
  for (const it of items) {
    const p = plan.find((x) => x.e === it);
    if (!p) { rest.push(it); continue; }
    if (!p.behalten.length) continue;
    rest.push({ ...it, files: p.behalten.map((b) => b.f), partiallyRemoved: true });
  }
  fs.writeFileSync(mf, JSON.stringify({ ...doc, generatedAt: new Date().toISOString(), items: rest }, null, 2));
  console.log(`\n  ${summeWeg} Datei(en) entfernt, ${summeBehalten} stehengelassen.`);
  console.log(`  Manifest: ${path.relative(target, mf).split(path.sep).join("/")} (${rest.length} Bausteine)`);

  if (!flags["no-claude-md"]) {
    const cf = writeClaudeMd(target, rest, doc.catalogGeneratedAt);
    console.log(`  Regelblock: ${path.relative(target, cf).split(path.sep).join("/")}`);
  }

  // Gerade nach einem Rückbau ist die Frage berechtigt, ob mehr verschwunden ist
  // als beabsichtigt.
  meldeSchaden(target);
}

/**
 * `list --to DIR` — was liegt in diesem Projekt, woher kam es, wirkt es heute?
 *
 * Warum als eigener Befehl und nicht als Nebenausgabe von `install`: Die Frage
 * stellt sich vor allem dann, wenn gerade **nicht** installiert wird — beim
 * Übernehmen eines fremden Projekts, vor einem `update`, nach einem Rückbau. Bis
 * hierhin war der einzige Weg dorthin, das Manifest von Hand zu lesen; genau das
 * verbietet der Rest dieses Werkzeugs an jeder anderen Stelle.
 *
 * Der Zustand wird **neu bestimmt** statt aus dem Manifest übernommen: `status`
 * dort ist der Stand des Installationslaufs, nicht der von heute. Wer den Hook
 * seither eingetragen hat, sieht ihn hier als aktiv.
 */
function cmdList(argv) {
  const flags = parseFlags(argv);
  // Der einzige lesende Befehl mit `--to`: kein Rückfall auf das
  // Arbeitsverzeichnis, sonst berichtet er über ein anderes Projekt als gemeint.
  const target = requireTarget(flags, "list", {
    erlaubeSelbst: true, positional: true,
    grund: "weil sonst offenbliebe, über welches Projekt es berichtet",
  });
  const mf = path.join(target, ".claude", "harness-manifest.json");
  if (!fs.existsSync(mf)) {
    console.log(`Kein Manifest in ${target}`);
    console.log("  Dieses Projekt hat (noch) keine Bausteine aus der Bibliothek —");
    console.log("  oder sie wurden von Hand kopiert und sind damit nicht nachweisbar.");
    return;
  }
  let doc;
  try { doc = JSON.parse(fs.readFileSync(mf, "utf8")); } catch (e) { die(`Manifest nicht lesbar: ${e.message}`); }
  const items = Array.isArray(doc.items) ? doc.items : [];
  console.log(`${items.length} Baustein(e) laut Manifest in ${target}`);
  if (doc.catalogGeneratedAt) console.log(`Katalogstand bei der Installation: ${String(doc.catalogGeneratedAt).slice(0, 16).replace("T", " ")}`);
  console.log("");

  let aktiv = 0, fehlend = 0;
  for (const e of items) {
    const z = activationOf(e, target);
    if (z.status === "aktiv") aktiv++;
    const da = (e.files || []).filter((f) => fs.existsSync(path.resolve(target, f.path)));
    const weg = (e.files || []).length - da.length;
    if (weg) fehlend++;
    console.log(`${z.status === "aktiv" ? "[aktiv]  " : "[inaktiv]"} ${e.id}`);
    console.log(`          ${e.type} · ${e.installedTo} · aus ${e.from}${e.commit ? ` @ ${e.commit}` : ""}${e.installedAt ? ` · ${String(e.installedAt).slice(0, 10)}` : ""}`);
    console.log(`          ${z.status === "aktiv" ? z.wirkung : z.status}`);
    if (z.einschraenkung) console.log(`          ${z.einschraenkung}`);
    if (weg) console.log(`          ${weg} von ${(e.files || []).length} Datei(en) nicht mehr vorhanden — von Hand entfernt oder verschoben`);
  }
  if (items.length) {
    console.log(`\n  ${aktiv} von ${items.length} wirksam, ${items.length - aktiv} brauchen einen Schritt von Hand.`);
    if (fehlend) console.log(`  ${fehlend} Eintrag/Einträge nennen Dateien, die es nicht mehr gibt — \`uninstall\` räumt den Rest auf.`);
  }
  meldeSchaden(target);
}

/**
 * Legt im Zielprojekt die Skills ab, mit denen es die Bibliothek bedient.
 *
 * Warum das zum Bootstrap gehört: Die Skills liegen bewusst im Projekt der
 * Bibliothek und nicht in der globalen Claude-Konfiguration — so sind sie
 * versioniert, wandern mit dem Repo und gelten nicht ungefragt für jedes
 * Verzeichnis auf der Platte. Der Preis dafür ist, dass ein frisches Zielprojekt
 * sie nicht kennt. Also bekommt es sie hier.
 */
function copySkillsTo(target, namen) {
  const quelle = path.join(ROOT, ".claude", "skills");
  if (!fs.existsSync(quelle)) return [];
  const kopiert = [];
  for (const n of namen) {
    const src = path.join(quelle, n);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(target, ".claude", "skills", n);
    copyRecursive(src, dest);
    kopiert.push(n);
  }
  return kopiert;
}

/** Schreibt den Regelblock und legt die Bedien-Skills ab, ohne Bausteine zu
 *  installieren. Für Projekte, die die Bibliothek nutzen wollen, ohne (noch)
 *  etwas zu übernehmen. */
function cmdBootstrap(argv) {
  const flags = parseFlags(argv);
  // Selbstanwendung ist hier erlaubt und erwünscht: Die Bibliothek soll ihren
  // eigenen Regelblock tragen. Kopiert wird dabei nichts.
  const target = requireTarget(flags, "bootstrap", { erlaubeSelbst: true, positional: true });
  const cat = loadCatalog();
  const mf = path.join(target, ".claude", "harness-manifest.json");
  let installed = [];
  if (fs.existsSync(mf)) { try { installed = JSON.parse(fs.readFileSync(mf, "utf8")).items || []; } catch { /* egal */ } }

  const cf = writeClaudeMd(target, installed, cat.generatedAt);
  console.log(`Regelblock: ${cf}`);
  console.log(installed.length
    ? `  ${installed.length} bereits installierte Bausteine aufgeführt.`
    : "  Noch keine Bausteine installiert — nur die Zugriffsregel.");

  // Die Bibliothek braucht sich selbst nichts zu kopieren.
  if (path.resolve(target) !== path.resolve(ROOT) && !flags["no-skills"]) {
    const kopiert = copySkillsTo(target, ["harness-build", "harness-plan"]);
    if (kopiert.length) {
      console.log(`\nSkills: ${kopiert.join(", ")} -> .claude/skills/`);
      console.log("  /harness-plan  — Projekt planen, bevor Code entsteht");
      console.log("  /harness-build — passende Bausteine auswählen und installieren");
    }
  }

  // Die Zugriffsregel steht bis hierher nur als Prosa in der CLAUDE.md. Prosa wird
  // befolgt, bis sie unbequem wird — und der teuerste Fehlgriff (20 MB Katalog oder
  // ein Repo-Klon im Kontext) passiert genau dann, wenn es eilig ist. Ein
  // deny-Eintrag macht ihn unmöglich, statt ihn zu verbieten. Nicht automatisch
  // geschrieben: `settings.json` gehört dem Projekt, und ungefragt in fremde
  // Berechtigungen zu schreiben wäre dieselbe Grenzverletzung, gegen die der
  // Rest dieses Befehls antritt.
  const regelBlock = {
    permissions: {
      deny: [
        `Read(${INDEX_JSON})`,
        `Read(${path.join(CLONE_DIR, "**")})`,
        `Glob(${path.join(CLONE_DIR, "**")})`,
      ],
      ask: [
        "Bash(node *harness.mjs install*)",
        "Bash(node *harness.mjs uninstall*)",
      ],
    },
  };
  console.log("\nEmpfohlener Block für .claude/settings.json dieses Projekts:\n");
  for (const l of JSON.stringify(regelBlock, null, 2).split("\n")) console.log("  " + l);
  console.log("");
  console.log("  deny: macht die Zugriffsregel aus der CLAUDE.md maschinell wirksam — der");
  console.log("        Katalog und die Repo-Klone sind über das CLI erreichbar, sonst nicht.");
  console.log("  ask:  install und uninstall schreiben und löschen in diesem Projekt.");
  console.log("  Nicht eingetragen, nur vorgeschlagen: settings.json gehört dem Projekt.");
  console.log("  Die Musterform der Pfade richtet sich nach den Regeln von Claude Code —");
  console.log("  nach dem Eintragen einmal prüfen, ob die Regel wirklich greift.");
  console.log("\n  Ein ganzes Projekt neu aufsetzen (Profil, CLAUDE.md, MCPs) macht");
  console.log("  /bootstrap-project. Dieser Befehl hier schreibt nur den Regelblock.");

  // `bootstrap` ist meist der erste Befehl in einem fremden Projekt — also die
  // beste Gelegenheit, auf Verschwundenes hinzuweisen, solange es noch jemand
  // rückgängig machen kann. Siehe meldeSchaden().
  meldeSchaden(target);
}

// ---------------------------------------------------------------- knowledge

/**
 * Durchsucht die Wissensbank (`knowledge/`, `recipes/`) auf **Abschnittsebene**.
 *
 * Warum nicht einfach die Dateien lesen: Die Wissensbank wächst mit jedem
 * ausgewerteten Vortrag und jedem neuen Rezept. Ab ein paar tausend Zeilen ist sie
 * genau das, wogegen der Katalog gebaut wurde — zu viel, um sie zu lesen, also
 * liest sie niemand. Ein Abschnitt umfasst typisch 15 bis 30 Zeilen und ist die
 * kleinste Einheit, die für sich allein eine Frage beantwortet.
 *
 * Bewusst ohne Index: 2000-odd Zeilen sind in Millisekunden geparst. Ein
 * vorberechneter Index wäre eine weitere Datei, die veralten kann.
 */
const KNOWLEDGE_DIRS = ["knowledge", "recipes"];

function collectSections() {
  const sections = [];
  for (const dir of KNOWLEDGE_DIRS) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full).filter((f) => /\.md$/i.test(f)).sort()) {
      const text = safeRead(path.join(full, file));
      const lines = text.split(/\r?\n/);
      let cur = null;
      let inFence = false;
      const push = () => { if (cur && cur.body.join("").trim()) sections.push(cur); };

      for (let n = 0; n < lines.length; n++) {
        const line = lines[n];
        if (/^\s*```/.test(line)) inFence = !inFence;
        const h = !inFence && line.match(/^(#{2,4})\s+(.+?)\s*$/);
        if (h) {
          push();
          cur = { file: `${dir}/${file}`, level: h[1].length, title: h[2].trim(), line: n + 1, body: [] };
        } else if (cur) {
          cur.body.push(line);
        }
      }
      push();
    }
  }
  return sections;
}

function cmdKnowledge(argv) {
  const flags = parseFlags(argv);
  const sections = collectSections();
  if (!sections.length) die("Keine Wissensbank gefunden — knowledge/ und recipes/ sind leer.");

  if (flags.list) {
    let lastFile = null;
    for (const s of sections) {
      if (s.file !== lastFile) { console.log(`\n${s.file}`); lastFile = s.file; }
      console.log(`  ${"  ".repeat(s.level - 2)}${s.title}`);
    }
    console.log(`\n${sections.length} Abschnitte in ${new Set(sections.map((s) => s.file)).size} Dateien.`);
    return;
  }

  const terms = flags._.join(" ").toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    console.log('Keine Frage angegeben. Beispiel: knowledge "warum hooks statt skills"');
    console.log("Inhaltsverzeichnis: knowledge --list");
    return;
  }

  const rated = sections.map((s) => {
    const title = s.title.toLowerCase();
    const body = s.body.join("\n").toLowerCase();
    let score = 0, hits = 0;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const inBody = body.includes(t);
      if (inTitle || inBody) hits++;
      if (inTitle) score += 12;
      if (inBody) score += Math.min(4, (body.split(t).length - 1));
    }
    return { s, score, hits };
  });

  // Wie bei `search`: alle Wörter müssen vorkommen, sonst wird die Frage durch
  // Präzisierung schlechter beantwortet statt besser.
  let found = rated.filter((x) => x.hits === terms.length);
  let relaxed = false;
  if (!found.length) { found = rated.filter((x) => x.hits > 0); relaxed = true; }
  if (!found.length) {
    console.log(`Nichts gefunden zu "${terms.join(" ")}".`);
    console.log("Inhaltsverzeichnis: node tools/harness.mjs knowledge --list");
    return;
  }
  found.sort((a, b) => b.hits - a.hits || b.score - a.score);

  const limit = Number(flags.limit || 4);
  if (relaxed) console.log("Kein Abschnitt enthält alle Wörter — zeige Teiltreffer.\n");
  console.log(`${found.length} Abschnitte, zeige ${Math.min(limit, found.length)}:\n`);

  // Provenienz-Hinweis. Die Wissensbank enthält ausgewertetes Praktiker- und
  // Herstellermaterial, das in den Trainingsdaten der lesenden Modelle nicht
  // vorkommt. Ohne diesen Hinweis vermischt ein Agent Gelesenes mit Erinnertem,
  // und hinterher ist nicht mehr unterscheidbar, welcher Teil belegt war.
  console.log("Quelle: ausgewertetes Fremdmaterial mit Belegen, kein Modellwissen.");
  console.log("Beim Weitergeben die Fundstelle nennen und nichts aus dem Gedächtnis ergänzen.\n");

  for (const { s } of found.slice(0, limit)) {
    console.log("=".repeat(72));
    console.log(`${s.file}:${s.line}  —  ${s.title}`);
    console.log("=".repeat(72));
    const body = s.body.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    const maxLines = Number(flags.lines || 45);
    const bodyLines = body.split("\n");
    console.log(bodyLines.slice(0, maxLines).join("\n"));
    if (bodyLines.length > maxLines) {
      console.log(`\n[... ${bodyLines.length - maxLines} weitere Zeilen — ganzer Abschnitt mit --lines 999]`);
    }
    console.log("");
  }
  if (found.length > limit) {
    console.log(`Weitere ${found.length - limit} Abschnitte:`);
    for (const { s } of found.slice(limit, limit + 10)) console.log(`  ${s.file} — ${s.title}`);
  }
}

// ---------------------------------------------------------------- schaden

/**
 * Meldet, was im Zielprojekt verschwunden oder verändert wurde.
 *
 * Warum das im Werkzeug steht und nicht in einer Anweisung: Beim Ausstatten eines
 * echten Projekts wurden vier Dateien des Besitzers gelöscht — `.claude/commands/`
 * und `settings.local.json` — obwohl der Auftrag ausdrücklich verbot, zu löschen,
 * was man nicht selbst angelegt hat. Kein Bericht erwähnte es. Aufgefallen ist es
 * nur, weil jemand `git status` gegen den Endzustand hielt statt den Meldungen zu
 * glauben.
 *
 * Eine Anweisung wird befolgt, bis sie unbequem wird. Was nicht verhandelbar ist,
 * gehört deshalb nicht ins Modell, sondern in den Ablauf.
 *
 * Läuft nur, wenn das Ziel ein Git-Repository ist — sonst gibt es keinen Bezugspunkt.
 */
function meldeSchaden(target, { still = false } = {}) {
  let status;
  try {
    status = execFileSync("git", ["-C", target, "status", "--porcelain"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return { pruefbar: false, geloescht: [], geaendert: [] };
  }

  const geloescht = [], geaendert = [];
  for (const zeile of status.split(/\r?\n/)) {
    if (!zeile.trim()) continue;
    const marke = zeile.slice(0, 2);
    const datei = zeile.slice(3).trim();
    if (/D/.test(marke)) geloescht.push(datei);
    else if (/M/.test(marke)) geaendert.push(datei);
  }

  if (!still && (geloescht.length || geaendert.length)) {
    console.log("");
    if (geloescht.length) {
      console.log(`  ACHTUNG — ${geloescht.length} Datei(en) fehlen gegenüber dem letzten Commit:`);
      for (const d of geloescht.slice(0, 12)) console.log(`      ${d}`);
      if (geloescht.length > 12) console.log(`      ... ${geloescht.length - 12} weitere`);
      console.log(`  Wiederherstellen mit:  git -C "${target}" checkout HEAD -- <datei>`);
      console.log("");
    }
    if (geaendert.length) {
      console.log(`  ${geaendert.length} Datei(en) geändert (nicht von install angelegt):`);
      for (const d of geaendert.slice(0, 8)) console.log(`      ${d}`);
      if (geaendert.length > 8) console.log(`      ... ${geaendert.length - 8} weitere`);
      console.log(`  Ansehen mit:  git -C "${target}" diff`);
    }
    console.log("");
  }
  return { pruefbar: true, geloescht, geaendert };
}

// ---------------------------------------------------------------- eval

/**
 * Führt die Routing-Evals aus `evals/*.jsonl` gegen die tatsächliche Suche aus.
 *
 * Warum das nötig ist: Suchqualität verschlechtert sich still. Ein neues Repo
 * schiebt sich vor die bisherigen Treffer, eine geänderte Heuristik verschiebt das
 * Ranking, ein Modellwechsel ändert, welche Formulierung ein Agent überhaupt
 * eingibt. Nichts davon wirft einen Fehler — es liefert nur schlechtere Treffer,
 * und das fällt erst auf, wenn eine Auswahl im echten Projekt danebengeht.
 *
 * Bewusst ohne Bewertung durch ein Modell: Ein Eval, das selbst geraten wird, misst
 * nichts. Geprüft wird nur, was maschinell entscheidbar ist — steht die erwartete ID
 * unter den ersten N, taucht eine unerwünschte auf, liefert eine präzisere Frage
 * weniger Treffer als eine gröbere.
 */
function ladeEvalFaelle() {
  const dir = path.join(ROOT, "evals");
  if (!fs.existsSync(dir)) return [];
  const faelle = [];
  for (const datei of fs.readdirSync(dir).filter((f) => /\.jsonl$/i.test(f)).sort()) {
    const text = safeRead(path.join(dir, datei));
    text.split(/\r?\n/).forEach((zeile, i) => {
      const t = zeile.trim();
      if (!t) return;
      let o;
      try { o = JSON.parse(t); } catch {
        console.log(`  ! ${datei}:${i + 1} ist kein gültiges JSON — übersprungen`);
        return;
      }
      if (o._kommentar !== undefined) return;
      faelle.push({ ...o, quelle: `${datei}:${i + 1}` });
    });
  }
  return faelle;
}

/** Führt eine Suche aus und gibt die Treffer-IDs in Rangfolge zurück.
 *  Nutzt dieselbe Bewertung wie `cmdSearch` — eine nachgebaute Zweitlogik würde
 *  messen, was der Nutzer gerade nicht bekommt. */
function sucheIds(cat, { frage, typ, domaene, repo }) {
  let items = cat.items;
  // Abweichung von cmdSearch, bewusst: hier gibt es kein --all, weil kein
  // Eval-Fall den Gesamtbestand samt Massen-Repos abfragt.
  const wantsBulk = repo || domaene;
  if (!wantsBulk) items = items.filter((i) => !i.bulk);
  // Quarantäne wie in cmdSearch, ohne Ausnahme: Eval-Fälle messen, was ein
  // Nutzer ohne --all bekommt — ein quarantänisierter Treffer wäre einer,
  // den es für ihn nicht gibt.
  items = items.filter((i) => !i.quarantaene);
  if (typ) items = items.filter((i) => i.type === typ);
  if (domaene) items = items.filter((i) => i.domains.includes(domaene));
  if (repo) items = items.filter((i) => i.repo.toLowerCase().includes(String(repo).toLowerCase()));

  return bewerteTreffer(items, frage).scored.map((x) => x.i.id);
}

/**
 * `opts.cat` — bereits geladener Katalog. `update` hat ihn gerade gebaut; ihn ein
 * zweites Mal von Platte zu lesen kostet 20 MB Parsen für nichts.
 * `opts.weich` — kein `die()` bei fehlendem `evals/`. Aus `update` heraus ist der
 * Eval-Lauf der letzte Schritt; ein Abbruch dort würde einen Lauf als gescheitert
 * melden, dessen eigentliche Arbeit — Klone, Katalog, Changelog — längst getan ist.
 */
function cmdEval(argv, opts = {}) {
  const flags = parseFlags(argv);
  const faelle = ladeEvalFaelle();
  if (!faelle.length) {
    if (opts.weich) {
      console.log("  Keine Evals gefunden (erwartet: evals/*.jsonl) — Schritt übersprungen.");
      return null;
    }
    die("Keine Evals gefunden. Erwartet: evals/*.jsonl");
  }
  const cat = opts.cat || loadCatalog();

  // Für `hoechstensSoVieleWie` müssen die Trefferzahlen aller Fragen vorliegen.
  const zahlen = new Map();
  for (const f of faelle) if (f.frage) zahlen.set(f.frage, sucheIds(cat, f).length);

  const ergebnisse = [];
  for (const f of faelle) {
    const ids = sucheIds(cat, f);
    const topN = Number(f.topN || 5);
    const oben = ids.slice(0, topN);
    const maengel = [];

    for (const soll of f.erwartet || []) {
      if (!oben.includes(soll)) {
        const rang = ids.indexOf(soll);
        maengel.push(rang === -1
          ? `\`${soll}\` fehlt vollständig`
          : `\`${soll}\` steht auf Rang ${rang + 1}, verlangt sind die ersten ${topN}`);
      }
    }
    for (const nicht of f.verboten || []) {
      if (oben.includes(nicht)) maengel.push(`\`${nicht}\` steht unter den ersten ${topN}, gehört dort nicht hin`);
    }
    if (f.mindestens !== undefined && ids.length < f.mindestens) {
      maengel.push(`${ids.length} Treffer, mindestens ${f.mindestens} verlangt`);
    }
    if (f.maxTreffer !== undefined && ids.length > f.maxTreffer) {
      maengel.push(`${ids.length} Treffer, höchstens ${f.maxTreffer} erlaubt`);
    }
    if (f.hoechstensSoVieleWie) {
      const grenze = zahlen.get(f.hoechstensSoVieleWie);
      if (grenze !== undefined && ids.length > grenze) {
        maengel.push(`${ids.length} Treffer — mehr als "${f.hoechstensSoVieleWie}" (${grenze}). Die präzisere Frage muss enger treffen.`);
      }
    }

    // Rang jeder erwarteten ID, 0 = gar nicht gefunden. Nur daraus lässt sich
    // später eine Verschiebung ablesen — ein bestandener Fall, dessen Treffer von
    // Rang 3 auf Rang 5 gerutscht ist, sagt mehr über die Suche als sein "ok".
    const raenge = {};
    for (const soll of f.erwartet || []) raenge[soll] = ids.indexOf(soll) + 1;

    ergebnisse.push({ f, ids, maengel, raenge, ok: maengel.length === 0 });
  }

  const pflicht = ergebnisse.filter((e) => !e.f.optional);
  const bestanden = pflicht.filter((e) => e.ok).length;
  const optionalOk = ergebnisse.filter((e) => e.f.optional && e.ok).length;
  const optionalGesamt = ergebnisse.filter((e) => e.f.optional).length;

  // --- Verschiebungen gegen den letzten Lauf -----------------------------
  // Bestanden/durchgefallen ist ein grobes Raster: es schlägt erst an, wenn ein
  // Treffer aus den ersten N gefallen ist. Die Bewegung davor — Rang 3 auf Rang 14 —
  // ist dieselbe Verschlechterung, nur früher sichtbar. Der Schlüssel ist die Frage
  // samt Filtern, nicht die Zeilennummer: die verschiebt sich beim ersten Einfügen
  // eines neuen Falls und machte jeden Vergleich wertlos.
  const schluessel = (f) => [f.frage, f.typ || "", f.domaene || "", f.repo || ""].join("|");
  const LAST_RUN = path.join(ROOT, "evals", "last-run.json");
  let vorher = null;
  try { vorher = JSON.parse(safeRead(LAST_RUN)); } catch { /* erster Lauf */ }
  const verschoben = [];
  if (vorher && vorher.raenge) {
    for (const e of ergebnisse) {
      const alt = vorher.raenge[schluessel(e.f)];
      if (!alt) continue;
      for (const [id, rang] of Object.entries(e.raenge)) {
        if (alt[id] === undefined || alt[id] === rang) continue;
        verschoben.push({ frage: e.f.frage, id, von: alt[id], nach: rang });
      }
    }
  }

  const bilanz = {
    generatedAt: new Date().toISOString(),
    katalog: cat.generatedAt,
    bestanden, pflicht: pflicht.length, optionalOk, optionalGesamt,
    verschoben,
    faelle: ergebnisse.map((e) => ({ frage: e.f.frage, quelle: e.f.quelle, optional: !!e.f.optional, ok: e.ok, maengel: e.maengel, raenge: e.raenge })),
  };

  if (flags.json) {
    console.log(JSON.stringify(bilanz, null, 1));
  } else {
    console.log(`Routing-Evals: ${bestanden} von ${pflicht.length} bestanden` +
      (optionalGesamt ? `  ·  ${optionalOk} von ${optionalGesamt} bekannten Schwächen behoben` : ""));
    console.log(`Katalog vom ${cat.generatedAt.slice(0, 16).replace("T", " ")}\n`);

    for (const e of ergebnisse) {
      if (e.ok && !flags.all) continue;
      const marke = e.ok ? "+" : (e.f.optional ? "~" : "!");
      const filter = [e.f.typ && `--type ${e.f.typ}`, e.f.domaene && `--domain ${e.f.domaene}`].filter(Boolean).join(" ");
      console.log(`${marke} "${e.f.frage}"${filter ? " " + filter : ""}   (${e.f.quelle})`);
      if (e.f.warum) console.log(`    ${e.f.warum}`);
      for (const m of e.maengel) console.log(`    -> ${m}`);
      if (!e.ok && e.ids.length) console.log(`    tatsächlich: ${e.ids.slice(0, 5).join(", ")}`);
      console.log("");
    }

    if (bestanden === pflicht.length && !flags.all) {
      console.log("Alle Pflichtfälle bestanden. Mit --all auch die bestandenen anzeigen.\n");
    }
    if (verschoben.length) {
      const rang = (n) => (n ? `Rang ${n}` : "nicht gefunden");
      console.log(`${verschoben.length} Rangänderung(en) gegenüber dem letzten Lauf vom ${String(vorher.generatedAt).slice(0, 16).replace("T", " ")}:`);
      for (const v of verschoben.slice(0, 12)) {
        console.log(`  VERSCHOBEN ${v.id}  ${rang(v.von)} -> ${rang(v.nach)}   ("${v.frage}")`);
      }
      if (verschoben.length > 12) console.log(`  ... ${verschoben.length - 12} weitere`);
      console.log("");
    }
    console.log("Was das misst: ob die Suche findet, was sie finden soll — nicht, ob ein");
    console.log("Baustein gut ist. Nach einem Modellwechsel und nach neuen Repos erneut laufen lassen.");
  }

  // Der Vergleichsstand wird nach jedem Lauf fortgeschrieben. Folge: zweimal
  // hintereinander laufen lassen zeigt beim zweiten Mal keine Verschiebung mehr —
  // die Meldung gehört dem Lauf, der die Änderung zuerst gesehen hat.
  if (!flags["no-save"]) {
    try {
      const raenge = {};
      for (const e of ergebnisse) raenge[schluessel(e.f)] = e.raenge;
      fs.writeFileSync(LAST_RUN, JSON.stringify({ generatedAt: bilanz.generatedAt, katalog: cat.generatedAt, raenge }, null, 1));
    } catch { /* Schreibfehler darf keinen Prüflauf umbringen */ }
  }

  if (bestanden < pflicht.length) process.exitCode = 1;
  return bilanz;
}

// ---------------------------------------------------------------- lint

/**
 * Prüft die Wissensbank auf Verfall und Brüche.
 *
 * Warum das nötig ist: Eine Wissensbank, in die nur eingepflegt wird, verrottet
 * still. Karpathys LLM-Wiki nennt neben Ingest und Query ausdrücklich eine dritte
 * Operation — Lint: Widersprüche zwischen Seiten, veraltete Aussagen, verwaiste
 * Seiten, fehlende Querverweise. Google zieht im Open Knowledge Format dieselbe
 * Konsequenz und schreibt Verfallsdaten und Prüfvermerke ins Frontmatter.
 *
 * Was hier maschinell geht, läuft hier. Widerspruchsprüfung braucht ein Modell und
 * gehört in die Skill, die das Einpflegen begleitet.
 *
 * Quellen: gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
 *          github.com/GoogleCloudPlatform/knowledge-catalog (OKF v0.2)
 */
const HEUTE = () => new Date().toISOString().slice(0, 10);

function knowledgeFiles() {
  const out = [];
  for (const dir of KNOWLEDGE_DIRS) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full).filter((x) => /\.md$/i.test(x)).sort()) {
      out.push({ rel: `${dir}/${f}`, abs: path.join(full, f) });
    }
  }
  return out;
}

/* --- Nahtprüfungen ------------------------------------------------------
 * Die bisherigen `lint`-Prüfungen sehen jede Wissensdatei für sich an. Die
 * teureren Fehler entstehen aber dort, wo handgeschriebener Text auf
 * maschinell Erzeugtes trifft: eine ID, die im Katalog nicht mehr steht; ein
 * Aufruf, den das CLI nicht mehr kennt; ein Katalog, der stillschweigend
 * veraltet. Keiner dieser Fehler meldet sich von selbst — er zeigt sich erst,
 * wenn ein Agent dem Text folgt und der Befehl abbricht.
 */

/** Dateien, die keine Wissensseiten sind, aber dieselben Aussagen tragen.
 *  Bewusst NICHT in `knowledgeFiles()` aufgenommen: dort liefe die
 *  Frontmatter-Prüfung mit, und eine README braucht kein `stale_after`. */
/** Dateien ausserhalb von knowledge/ und recipes/, die trotzdem auf Nähte geprüft
 *  werden: Bestandszahlen, Baustein-IDs, Verweise auf CLI-Befehle.
 *
 *  Die Skills und Subagenten gehören dazu, weil sie dieselben Zahlen und IDs
 *  nennen wie die Wissensbank — und weil genau dort ein veralteter Bestand
 *  überlebt hat ("rund 1.050 Bausteine", tatsächlich 954), während lint sauber
 *  meldete. Eine Prüfung, die den Ort auslässt, an dem der Fehler sitzt, prüft
 *  das Falsche. */
const NAHT_EXTRA = [
  "README.md", "INDEX.md", "CLAUDE.md",
  ...(() => {
    const out = [];
    for (const unter of ["skills", "agents"]) {
      const dir = path.join(ROOT, ".claude", unter);
      if (!fs.existsSync(dir)) continue;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
          const f = path.join(dir, e.name, "SKILL.md");
          if (fs.existsSync(f)) out.push(`.claude/${unter}/${e.name}/SKILL.md`);
        } else if (/\.md$/i.test(e.name)) {
          out.push(`.claude/${unter}/${e.name}`);
        }
      }
    }
    return out;
  })(),
];

/** Absatz-Marke, mit der ein Autor eine bewusst tote Angabe stehen lässt.
 *  HTML-Kommentar, damit sie in jeder Markdown-Ansicht unsichtbar bleibt. */
const LINT_HISTORISCH = "<!-- lint:historisch -->";

/** Zeichenbereiche der Absätze, die `LINT_HISTORISCH` tragen.
 *  Warum absatzweise und nicht zeilenweise: die Unterdrückung gilt dem Gedanken,
 *  nicht dem Zeilenumbruch — eine Tabelle, die einen alten Bestand dem neuen
 *  gegenüberstellt, ist ein Absatz, und die Marke steht einmal darunter.
 *  Warum überhaupt: ein `revise`-Eintrag, der nicht sagt, was vorher galt,
 *  erfüllt seinen Zweck nicht. Die Doktrin verlangt dieses Protokoll, also darf
 *  die Zahlenprüfung nicht prinzipiell daran scheitern. */
function historischBereiche(text) {
  const out = [];
  let pos = 0;
  for (const teil of text.split(/(\r?\n[ \t]*\r?\n)/)) {
    if (teil.includes(LINT_HISTORISCH)) out.push([pos, pos + teil.length]);
    pos += teil.length;
  }
  return out;
}

const istHistorisch = (bereiche, idx) => bereiche.some(([a, b]) => idx >= a && idx < b);

/** 1-basierte Zeilennummer zu einem Zeichenversatz. Ohne sie muss man bei sieben
 *  Befunden in einer 500-Zeilen-Datei sieben Zahlen von Hand suchen. */
const zeileVon = (text, idx) => text.slice(0, idx).split(/\r?\n/).length;

/** Baustein-IDs im Fliesstext. Das Repo-Präfix ist optional, damit auch die
 *  Kurzform `nextlevelbuilder/agent/design-review` auffällt — sie liest sich
 *  richtig, ist aber für `install` unauflösbar. */
const NAHT_ID_RE = /`([A-Za-z0-9._-]+(?:__[A-Za-z0-9._-]+)?\/(?:skill|agent|command|hook|mcp|plugin)\/[A-Za-z0-9._/-]+)`/g;

/** Ab wann ein Katalog als veraltet gilt. */
const KATALOG_MAX_TAGE = 30;

/**
 * Dateien, die **diese** Bibliothek herstellt oder pflegt.
 *
 * Warum eine feste Liste und nicht "jeder Dateiname in Backticks": ausprobiert und
 * verworfen. Von 162 in Backticks genannten Dateinamen zeigen 137 auf fremde
 * Projekte — auf die Dateien eines Bausteins, auf die eines Zielprojekts, auf
 * Beispiele. Die Prüfung hätte 137 Fehlalarme und einen Fund geliefert, und ein
 * Lint, das man wegklickt, findet auch den Fund nicht mehr.
 *
 * Geprüft wird deshalb nur, was die Bibliothek selbst zusagt. Genau dort ist die
 * Zusage bindend: wer `CHANGELOG.md` nennt, schickt einen fremden Agenten zu einer
 * Datei, die es geben muss.
 */
const WERKSTUECKE = [
  "CHANGELOG.md", "INDEX.md", "README.md", "CLAUDE.md", "sources.txt",
  "catalog/index.json", "catalog/by-repo.md", "catalog/by-domain/*.md",
  "evals/routing.jsonl", "tools/harness.mjs", "knowledge/LOG.md",
];

/** Existiert das Werkstück? Mit `*` genügt **eine** passende Datei — die
 *  Domänen-Indizes heissen nach dem Bestand und nicht nach einer festen Liste. */
function werkstueckDa(name) {
  if (!name.includes("*")) return fs.existsSync(path.join(ROOT, name));
  const dir = path.join(ROOT, path.dirname(name));
  const re = new RegExp("^" + path.basename(name).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", "i");
  try { return fs.readdirSync(dir).some((f) => re.test(f)); } catch { return false; }
}

function nahtDateien() {
  const out = knowledgeFiles();
  for (const f of NAHT_EXTRA) {
    const abs = path.join(ROOT, f);
    if (fs.existsSync(abs)) out.push({ rel: f, abs });
  }
  return out;
}

/** Liest die eigene Oberfläche aus dem eigenen Quelltext: die Subcommands aus
 *  dem `switch` am Dateiende, die Flaggen aus jedem `flags.x`-Zugriff.
 *  Warum nicht eine gepflegte Liste: die wäre die dritte Stelle, an der
 *  dasselbe steht (Dispatcher, USAGE, Liste) — und die erste, die vergessen
 *  wird. Der Dispatcher kann nicht veralten, er ist die Wahrheit. */
function cliOberflaeche() {
  const selbst = safeRead(fileURLToPath(import.meta.url));
  const subcommands = new Set();
  // Nicht zeilenanfangs-verankert: `case "knowledge": case "know": case "why":`
  // steht auf einer Zeile, und die Aliase sind genauso gültige Aufrufe.
  for (const m of selbst.matchAll(/\bcase "([a-z-]+)":/g)) subcommands.add(m[1]);
  const flaggen = new Set();
  for (const m of selbst.matchAll(/flags\.([A-Za-z]\w*)/g)) flaggen.add(m[1]);
  for (const m of selbst.matchAll(/flags\["([^"]+)"\]/g)) flaggen.add(m[1]);
  // `flags["dry-run"]` und `flags.dryRun` meinen dieselbe Flagge; auf der
  // Kommandozeile steht immer die Bindestrich-Form.
  for (const f of [...flaggen]) flaggen.add(f.replace(/([A-Z])/g, (_, c) => "-" + c.toLowerCase()));
  return { subcommands, flaggen };
}

function cmdLint(argv) {
  const flags = parseFlags(argv);
  const files = knowledgeFiles();
  if (!files.length) die("Keine Wissensbank gefunden.");

  const heute = HEUTE();
  const befunde = [];
  const add = (schwere, datei, text) => befunde.push({ schwere, datei, text });

  const alleTitel = new Map();   // Überschrift -> [Datei]
  const alleDateien = new Set(files.map((f) => path.basename(f.rel)));

  for (const f of files) {
    const text = safeRead(f.abs);
    const fm = frontmatter(text);
    const hatFm = text.startsWith("---");

    // --- Frontmatter nach OKF ---
    if (!hatFm) {
      add("hoch", f.rel, "Kein Frontmatter. Ohne Metadaten ist nicht erkennbar, woher das Wissen stammt, wer es geprüft hat und wann es verfällt.");
    } else {
      if (!fm.sources && !fm.source) add("mittel", f.rel, "Kein `sources`-Feld — die Herkunft der Aussagen ist nicht maschinell nachvollziehbar.");
      if (!fm.status) add("niedrig", f.rel, "Kein `status` (draft / stable / deprecated).");
      if (!fm.stale_after) {
        add("mittel", f.rel, "Kein `stale_after` — die Seite kann unbemerkt veralten.");
      } else if (fm.stale_after < heute) {
        add("hoch", f.rel, `Verfallen: \`stale_after: ${fm.stale_after}\` liegt vor heute (${heute}). Inhalt gegen die Quellen prüfen.`);
      }
      if (!fm.verified && !fm.generated) add("niedrig", f.rel, "Weder `generated` noch `verified` — die Vertrauensstufe ist unbekannt.");
    }

    // --- Verweise auf nicht vorhandene Dateien ---
    for (const m of text.matchAll(/\]\(([^)#][^)]*\.md)(?:#[^)]*)?\)/g)) {
      const ziel = path.basename(m[1]);
      if (!alleDateien.has(ziel) && !fs.existsSync(path.resolve(path.dirname(f.abs), m[1]))) {
        add("mittel", f.rel, `Verweis ins Leere: \`${m[1]}\``);
      }
    }

    // --- Doppelte Überschriften: Redundanz oder Widerspruch ---
    // Nur innerhalb von `knowledge/`. Rezepte folgen absichtlich einer festen
    // Schablone ("Wann dieses Rezept passt", "Kern-Set", "Bewusst weggelassen") —
    // dort ist die Wiederholung das gewünschte Verhalten, kein Befund.
    if (f.rel.startsWith("knowledge/")) {
      let inFence = false;
      for (const line of text.split(/\r?\n/)) {
        if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
        if (inFence) continue;
        const h = line.match(/^#{2,3}\s+(.+?)\s*$/);
        if (!h) continue;
        const key = h[1].toLowerCase().replace(/^[\d.\s]+/, "").trim();
        if (key.length < 8) continue;
        (alleTitel.get(key) || alleTitel.set(key, []).get(key)).push(f.rel);
      }
    }
  }

  for (const [titel, dateien] of alleTitel) {
    const uniq = [...new Set(dateien)];
    if (uniq.length > 1) {
      add("mittel", uniq.join(", "), `Gleiche Überschrift "${titel}" in mehreren Dateien — Redundanz oder Widerspruch. Zusammenführen oder abgrenzen.`);
    }
  }

  // Einmal geladen, danach von der Bestandszahl- und den Naht-Prüfungen gemeinsam
  // benutzt: die Datei ist 20 MB gross, ein zweites Parsen kostete mehr als
  // sämtliche Prüfungen zusammen.
  let cat = null;
  if (fs.existsSync(INDEX_JSON)) {
    try { cat = JSON.parse(fs.readFileSync(INDEX_JSON, "utf8")); } catch { /* egal */ }
  }

  // --- Bestandszahlen gegen den aktuellen Katalog ---
  // Wissensdateien nennen Kennzahlen im Fliesstext ("rund 1.050 Bausteine"). Ändert
  // sich der Katalog — etwa weil der Extractor genauer wird — veralten sie still und
  // widersprechen einander. Genau die Klasse Fehler, gegen die eine gepflegte
  // Wissensbank antritt: Widersprüche, die niemandem auffallen, weil niemand
  // abgleicht.
  if (cat) {
    const kennzahlen = [
      { wert: cat.totals.items, was: "Bausteine gesamt" },
      // Standardzugriff heisst: was `search` ohne Flaggen durchsucht — seit M2
      // also ohne Quarantäne. Dieselbe Definition wie in cmdStats, sonst meldet
      // lint eine Zahl als falsch, die stats selbst ausgibt.
      { wert: cat.items.filter((i) => !i.bulk && !i.quarantaene).length, was: "Bausteine im Standardzugriff" },
      { wert: cat.items.filter((i) => i.bulk).length, was: "Bausteine in Massen-Repos" },
    ];
    // Jede Zahl, die der Katalog selbst hergibt, ist eine richtige Zahl — auch
    // wenn sie keine der drei Leitgrössen ist. Ohne diese Menge meldete die
    // Prüfung „24.700 Skills" als Abweichung von 25.497, obwohl `stats` genau
    // 24.700 Skills ausweist: eine korrekte Teilmenge, kein Widerspruch. Wer
    // eine Teilmenge nennt, soll sie nennen dürfen, ohne dafür angemeckert zu
    // werden — sonst schreibt niemand mehr Zahlen in die Wissensbank.
    const alleWerte = new Set(kennzahlen.map((k) => k.wert));
    for (const v of Object.values(cat.totals)) alleWerte.add(v);          // pro Typ
    for (const r of cat.repos || []) alleWerte.add(r.count);              // pro Repo
    const proDomain = {};
    for (const i of cat.items) for (const d of i.domains || []) proDomain[d] = (proDomain[d] || 0) + 1;
    for (const v of Object.values(proDomain)) alleWerte.add(v);           // pro Domäne

    // Eine Zahl ist nur dann eine Bestandsangabe, wenn das Bezugswort direkt an
    // ihr klebt: „954 Bausteine", „Bestand: 954". Die frühere Fassung suchte im
    // Umkreis von ±70 Zeichen nach irgendeinem Stichwort — in einer Wissensbank
    // *über* Bausteine steht dort praktisch immer eines. Ergebnis waren Token-
    // Budgets („25.000 Token"), Zeilenzahlen fremder Dateien („859 Zeilen"),
    // KB-Angaben und Code-Zeilenverweise („Z. 897–945") als Bestandswiderspruch.
    // Ein Lint, das Fehlalarme produziert, wird nicht mehr gelesen — und findet
    // dann auch die echten Fehler nicht mehr.
    // Die Endungen ausschreiben, nicht `\b` hinter den Stamm setzen: „954
    // Bausteine" scheiterte sonst am Plural-e, und genau der Plural ist die
    // Form, in der eine Bestandsangabe im Deutschen dasteht.
    const BESTAND_NACH_RE = /^\s*(?:bausteine?n?|einträge?n?|eintrag|skills?|agents?|hooks?|commands?|plugins?|mcps?)\b/i;
    const BESTAND_VOR_RE = /\b(?:bestand|bausteine?|einträge?|katalog|standardzugriff|massen-repos?|umfasst|verzeichnet|enthält)\b[^.:;\n]{0,24}?[\s:|=]+(?:rund|etwa|circa|ca\.|über|knapp|gut|mehr als)?\s*$/i;
    // Steht hinter der Zahl eine Einheit, zählt sie etwas anderes als Bausteine.
    const EINHEIT_RE = /^\s*(?:token|zeichen|zeilen?|wörter|wort|byte|bytes|[kmg]b|ms|sekunden?|minuten?|stunden?|tage?|%|€|\$)\b/i;
    // Bewusste Rundungen sind keine Widersprüche, sondern korrekte Prosa.
    const RUNDUNG_RE = /\b(rund|etwa|circa|ca\.|über|mehr als|knapp|gut)\s*$/i;

    for (const f of files) {
      const text = safeRead(f.abs);
      const historisch = historischBereiche(text);
      const gesehen = new Set();
      for (const m of text.matchAll(/\b(\d{1,3}(?:[.,]\d{3})+|\d{3,6})\b/g)) {
        const roh = m[1];
        const zahl = Number(roh.replace(/[.,]/g, ""));
        if (!Number.isFinite(zahl) || zahl < 100 || gesehen.has(zahl)) continue;
        if (alleWerte.has(zahl)) continue;                      // stimmt
        if (istHistorisch(historisch, m.index)) continue;        // absichtlich alt

        const vor = text.slice(Math.max(0, m.index - 70), m.index);
        const nach = text.slice(m.index + roh.length, m.index + roh.length + 70);
        if (EINHEIT_RE.test(nach)) continue;                    // Token, Zeilen, KB
        if (!BESTAND_NACH_RE.test(nach) && !BESTAND_VOR_RE.test(vor)) continue;
        if (RUNDUNG_RE.test(vor) && zahl % 1000 === 0) continue; // „über 25.000"

        gesehen.add(zahl);
        for (const k of kennzahlen) {
          const abweichung = Math.abs(zahl - k.wert) / k.wert;
          if (abweichung > 0 && abweichung < 0.2) {
            add("hoch", `${f.rel}:${zeileVon(text, m.index)}`, `Bestandszahl \`${roh}\` weicht vom Katalog ab — aktuell ${k.wert} (${k.was}). Veraltete Zahl oder Verwechslung. Ist der alte Wert absichtlich zitiert: \`${LINT_HISTORISCH}\` in denselben Absatz setzen.`);
            break;
          }
        }
      }
    }
  }

  // --- Naht 1: genannte Baustein-IDs gegen den Katalog ---
  // Eine tote ID in einem Rezept macht nicht die Zeile unbrauchbar, sondern das
  // ganze Rezept: der Agent setzt den `install`-Befehl ab, der bricht ab, und der
  // Agent hat keinen Anhaltspunkt, ob der Baustein umbenannt wurde oder nie
  // existierte. Deshalb dort "hoch". In `knowledge/` ist dieselbe ID nur ein
  // Beleg im Fliesstext — falsch, aber nicht handlungsleitend, also "mittel".
  if (cat) {
    const bekannt = new Set(cat.items.map((i) => i.id));
    const bekanntKlein = new Set(cat.items.map((i) => i.id.toLowerCase()));
    for (const f of nahtDateien()) {
      const tot = new Set();
      // Absatzweise, nicht zeilenweise: die Unterdrückung gilt für den Gedanken,
      // nicht für den Zeilenumbruch. Wissensdateien nennen tote IDs absichtlich,
      // wenn sie erklären, warum sie tot sind — dieser Satz ist selbst der Beleg
      // und darf nicht als Fehler zurückkommen.
      for (const block of safeRead(f.abs).split(/\r?\n\s*\r?\n/)) {
        if (block.includes(LINT_HISTORISCH)) continue;
        for (const m of block.matchAll(NAHT_ID_RE)) {
          const id = m[1];
          if (bekannt.has(id) || bekanntKlein.has(id.toLowerCase())) continue;
          tot.add(id);
        }
      }
      if (tot.size) {
        const schwere = f.rel.startsWith("recipes/") ? "hoch" : "mittel";
        add(schwere, f.rel, `${tot.size} Baustein-ID(en) nicht im Katalog auflösbar — \`install\` bricht damit ab:\n      ${[...tot].slice(0, 8).join("\n      ")}` +
          `\n      Richtige Form mit \`search\` suchen. Ist die ID absichtlich genannt, weil sie nicht mehr existiert: \`${LINT_HISTORISCH}\` in denselben Absatz setzen.`);
      }
    }
  }

  // --- Naht 2: genannte CLI-Aufrufe gegen das CLI selbst ---
  // Geprüft wird nur, was in einem Codeblock steht. Der Unterschied ist inhaltlich,
  // nicht kosmetisch: ein Codeblock ist eine Anweisung ("führ das aus"), ein
  // Inline-Backtick im Fliesstext ist oft ein Vorschlag ("ein Subcommand `eval`
  // wäre …"). Prüfte man beides, meldete `lint` jede geplante Maßnahme aus
  // `knowledge/04` und `knowledge/06` als Fehler — 11 Fehlalarme, kein Fund.
  {
    const { subcommands, flaggen } = cliOberflaeche();
    for (const f of nahtDateien()) {
      const totSub = new Set(), totFlag = new Set();
      let inFence = false;
      for (const line of safeRead(f.abs).split(/\r?\n/)) {
        if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
        if (!inFence || line.includes(LINT_HISTORISCH)) continue;
        // `node` verlangt, weil `tools/harness.mjs   Das CLI …` in der
        // Verzeichnisübersicht der README sonst als Aufruf von `Das` gilt.
        const m = line.match(/\bnode\s+\S*harness\.mjs\s+([a-zA-Z][\w-]*)/);
        if (m && !subcommands.has(m[1])) totSub.add(m[1]);
        // Nur was **hinter** `harness.mjs` steht, ist eine Flagge des CLI. Alles
        // davor gehört dem Aufrufer: `node --check tools/harness.mjs` prüft die
        // Syntax und ist ein völlig richtiger Befehl — die vorherige Fassung
        // meldete das als unbekannte Flagge und hätte dazu verführt, eine korrekte
        // Zeile zu ändern, statt die Prüfung zu schärfen.
        const nachCli = line.split(/harness\.mjs/)[1];
        if (nachCli === undefined) continue;
        for (const g of nachCli.matchAll(/\s(--[a-z][a-z-]*)/g)) {
          if (!flaggen.has(g[1].slice(2))) totFlag.add(g[1]);
        }
      }
      if (totSub.size) add("hoch", f.rel, `Codeblock ruft Subcommand(s) auf, die es nicht gibt: ${[...totSub].map((s) => `\`${s}\``).join(", ")}. Vorhanden: ${[...subcommands].join(", ")}.`);
      if (totFlag.size) add("hoch", f.rel, `Codeblock nennt Flagge(n), die das CLI nicht kennt: ${[...totFlag].map((s) => `\`${s}\``).join(", ")}.`);
    }
  }

  // --- Naht 3: Alter des Katalogs ---
  // Die 13 Quell-Repos wachsen täglich. Ein alter Katalog gibt keine Fehlermeldung,
  // er liefert nur weniger Treffer als es gäbe — der Ausfall ist unsichtbar, und
  // genau deshalb muss ihn jemand melden.
  let katalogTage = null;
  if (cat?.generatedAt) {
    katalogTage = Math.floor((Date.now() - Date.parse(cat.generatedAt)) / 86400000);
    if (katalogTage > KATALOG_MAX_TAGE) {
      add("mittel", "catalog/index.json", `Katalog ist ${katalogTage} Tage alt (Grenze ${KATALOG_MAX_TAGE}), erzeugt am ${cat.generatedAt.slice(0, 10)}. Die Quell-Repos wachsen täglich: \`node tools/harness.mjs update\` laufen lassen.`);
    }
  }

  // --- Naht 4: zugesagte Werkstücke gegen das Dateisystem ---
  // Ein Verweis auf eine Datei, die es nicht gibt, kostet einen fremden Agenten
  // einen Fehlversuch und danach das Vertrauen in den ganzen Text. Aggregiert nach
  // Datei**namen**, nicht nach Fundstelle: sechs Meldungen über dieselbe fehlende
  // CHANGELOG.md sind sechsmal derselbe Fehler und einmal zu viel.
  {
    const zusagen = new Map();
    for (const f of nahtDateien()) {
      for (const block of safeRead(f.abs).split(/\r?\n\s*\r?\n/)) {
        if (block.includes(LINT_HISTORISCH)) continue;
        for (const m of block.matchAll(/`([^`\s]+\.(?:md|json|jsonl|txt|mjs))`/g)) {
          const name = m[1].replace(/\\/g, "/").replace(/^\.\//, "");
          if (!WERKSTUECKE.includes(name)) continue;
          (zusagen.get(name) || zusagen.set(name, new Set()).get(name)).add(f.rel);
        }
      }
    }
    for (const [name, wo] of zusagen) {
      if (werkstueckDa(name)) continue;
      add("mittel", [...wo].slice(0, 6).join(", "),
        `\`${name}\` wird an ${wo.size} Stelle(n) als vorhanden angesprochen, existiert aber nicht. ` +
        `Entweder erzeugen (bei erzeugten Dateien: \`node tools/harness.mjs update\`) oder die Zusagen streichen.`);
    }
  }

  // --- Naht 5: erzeugte Indizes gegen den Katalog, aus dem sie stammen ---
  // INDEX.md trägt eine `Stand:`-Zeile aus `generatedAt`. Läuft `extract` nicht mehr,
  // bleibt sie stehen und behauptet einen Stand, den der Katalog längst überholt hat.
  // Das ist die eine Zahl, der ein fremder Agent ohne Nachprüfen glaubt.
  if (cat?.generatedAt) {
    for (const rel of ["INDEX.md", "catalog/by-repo.md"]) {
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) continue;
      const m = safeRead(abs).match(/Stand:?\s*(\d{4}-\d{2}-\d{2})/);
      if (!m) continue;
      if (m[1] < cat.generatedAt.slice(0, 10)) {
        add("mittel", rel, `\`Stand: ${m[1]}\` ist älter als der Katalog (${cat.generatedAt.slice(0, 10)}) — die Datei wurde seit dem letzten \`extract\` nicht neu erzeugt und beschreibt einen überholten Bestand.`);
      }
    }
  }

  // --- Naht 6: Repos, die nichts beisteuern ---
  // Eine Zeile in sources.txt ohne einen einzigen Katalogeintrag ist entweder ein
  // fehlgeschlagener Klon oder ein Repo, dessen Aufbau der Extraktor nicht erkennt.
  // Beides sieht in `stats` wie ein Repo aus und liefert nichts.
  if (cat?.repos) {
    const leer = cat.repos.filter((r) => !r.count).map((r) => r.dir);
    if (leer.length) {
      add("mittel", "sources.txt", `${leer.length} Repo(s) ohne einen einzigen Katalogeintrag: ${leer.slice(0, 8).join(", ")}. Entweder ist der Klon fehlgeschlagen (\`sync\` ansehen) oder der Extraktor erkennt den Aufbau nicht — in beiden Fällen zählt das Repo in jeder Bestandsangabe mit, ohne etwas beizutragen.`);
    }
  }

  // --- Naht 7: die Tabellen der Rezepte gegen den Katalog ---
  // Die IDs prüft schon Naht 1. Hier gehen die **Spalten** dazu: ein Rezept, das
  // einen Skill als `agent` führt, schickt den Leser auf den falschen Baustein-Typ,
  // und eine KB-Angabe, die um das Vierfache danebenliegt, macht die Bar des
  // Rezepts ("höchstens 50 KB") zu einer Zahl ohne Deckung. Regressionsschutz, kein
  // Reparaturauftrag: heute stimmen alle 71 Zeilen.
  if (cat) {
    const nach = new Map(cat.items.map((i) => [i.id, i]));
    const ZEILE_RE = /^\|\s*`([^`]+)`\s*\|\s*([a-z]+)\s*\|[^|]*\|\s*(\d+)\s*\|\s*$/;
    for (const f of knowledgeFiles().filter((x) => x.rel.startsWith("recipes/"))) {
      const text = safeRead(f.abs);
      const historisch = historischBereiche(text);
      let pos = 0;
      for (const zeile of text.split(/\r?\n/)) {
        const idx = pos; pos += zeile.length + 1;
        const g = zeile.match(ZEILE_RE);
        if (!g || istHistorisch(historisch, idx)) continue;
        const it = nach.get(g[1]);
        if (!it) continue;                                   // Naht 1 meldet das schon
        if (it.type !== g[2]) {
          add("hoch", `${f.rel}:${zeileVon(text, idx)}`, `\`${g[1]}\` steht als \`${g[2]}\` in der Tabelle, ist im Katalog aber \`${it.type}\` — der Baustein landet in einem anderen Verzeichnis und wirkt anders.`);
        }
        // Gegen beide Grössen prüfen: gemeint sein kann die Verzeichnisgrösse
        // (`bytes`) oder das, was beim Greifen lädt (`entryBytes`). Eine Spalte,
        // die einen der beiden Werte trifft, ist keine falsche Angabe — und die
        // Prüfung überlebt damit den Wechsel von der einen auf die andere Zahl.
        const soll = Number(g[3]);
        if (soll !== kb(it.bytes) && soll !== kb(ladeBytes(it))) {
          add("mittel", `${f.rel}:${zeileVon(text, idx)}`, `\`${g[1]}\` steht mit ${soll} KB in der Tabelle, der Katalog nennt ${kb(ladeBytes(it))} KB beim Greifen und ${kb(it.bytes)} KB gesamt. Die Summen unter dem Kern-Set stimmen damit auch nicht mehr.`);
        }
      }
    }
  }

  // --- Rohquellen ohne Auswertung ---
  const rawDir = path.join(ROOT, "Learnings");
  if (fs.existsSync(rawDir)) {
    const roh = fs.readdirSync(rawDir).filter((f) => /\.(md|txt|pdf)$/i.test(f));
    const wissenText = files.map((f) => safeRead(f.abs)).join("\n").toLowerCase();
    const unerwaehnt = roh.filter((r) => {
      const stamm = r.replace(/\.[^.]+$/, "").split(/[—_]/)[0].trim().toLowerCase();
      return stamm.length > 6 && !wissenText.includes(stamm.slice(0, Math.min(30, stamm.length)));
    });
    if (unerwaehnt.length) {
      add("mittel", "Learnings/", `${unerwaehnt.length} Rohquelle(n) tauchen in keiner Wissensdatei auf:\n      ${unerwaehnt.slice(0, 8).map((u) => u.slice(0, 70)).join("\n      ")}`);
    }
  }

  // --- Ausgabe ---
  const rang = { hoch: 0, mittel: 1, niedrig: 2 };
  befunde.sort((a, b) => rang[a.schwere] - rang[b.schwere]);
  const zaehler = { hoch: 0, mittel: 0, niedrig: 0 };
  for (const b of befunde) zaehler[b.schwere]++;

  console.log(`Wissensbank geprüft: ${files.length} Dateien, Nähte in ${nahtDateien().length}, ${befunde.length} Befunde`);
  console.log(`  ${zaehler.hoch} hoch · ${zaehler.mittel} mittel · ${zaehler.niedrig} niedrig`);
  // Das Alter immer nennen, auch wenn es unter der Grenze liegt: sonst weiss
  // niemand, ob die Prüfung gelaufen ist oder der Katalog nur knapp durchkam.
  if (katalogTage !== null) console.log(`  Katalog ${katalogTage} Tage alt (Grenze ${KATALOG_MAX_TAGE})`);
  console.log("");

  const zeigen = flags.all ? befunde : befunde.filter((b) => b.schwere !== "niedrig");
  for (const b of zeigen) {
    console.log(`[${b.schwere}] ${b.datei}`);
    console.log(`      ${b.text}\n`);
  }
  if (!flags.all && zaehler.niedrig) console.log(`${zaehler.niedrig} Befunde niedriger Schwere ausgeblendet — mit --all anzeigen.`);

  console.log("\nWas dieser Befehl nicht kann: inhaltliche Widersprüche zwischen Seiten");
  console.log("erkennen. Das braucht ein Modell und gehört in den Einpflege-Ablauf.");

  // --- Exit-Code ---
  // Bis hierher war `lint` ein Bericht, den jemand lesen musste. Ein Exit-Code
  // macht daraus eine Schranke, die auch dann greift, wenn niemand hinsieht.
  // Gestaffelt, weil die Schweren verschieden zwingend sind: "hoch" heisst, ein
  // Befehl im Text schlägt fehl — das darf nie durchgehen. "mittel" heisst, eine
  // Aussage stimmt nicht mehr; das ist eine Bringschuld, aber kein Grund, einen
  // Lauf abzubrechen, der etwas ganz anderes tut. Wer beides will, nimmt --strict.
  const scharf = zaehler.hoch + (flags.strict ? zaehler.mittel : 0);
  process.exitCode = scharf ? 1 : 0;
  if (scharf) {
    console.log(`\nExit-Code 1 — ${scharf} Befund(e) ${flags.strict ? "hoher oder mittlerer" : "hoher"} Schwere.`);
  } else if (zaehler.mittel && !flags.strict) {
    console.log(`\nExit-Code 0 — kein Befund hoher Schwere. Mit --strict zählen auch die ${zaehler.mittel} mittleren.`);
  }
  return zaehler;
}

// ---------------------------------------------------------------- update

function cmdUpdate() {
  const before = fs.existsSync(INDEX_JSON) ? loadCatalog() : null;
  console.log("1/4  Repos synchronisieren");
  const syncReport = cmdSync();
  console.log("\n2/4  Bausteine katalogisieren");
  // viaUpdate: true — cmdExtract() soll seinen Hygiene-Block NICHT selbst als
  // eigenen CHANGELOG-Eintrag schreiben; dieser Lauf hat schon einen (unten).
  const after = cmdExtract({ quiet: false, viaUpdate: true });
  console.log("\n3/4  Changelog schreiben");

  const beforeIds = new Set(before ? before.items.map((i) => i.id) : []);
  const afterIds = new Set(after.items.map((i) => i.id));
  const added = after.items.filter((i) => !beforeIds.has(i.id));
  const removed = before ? before.items.filter((i) => !afterIds.has(i.id)) : [];
  const beforeMap = new Map((before?.items || []).map((i) => [i.id, i]));
  const changed = after.items.filter((i) => {
    const b = beforeMap.get(i.id);
    return b && (b.bytes !== i.bytes || b.description !== i.description);
  });

  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const lines = [];
  lines.push(`## ${stamp}`, "");
  lines.push(`Bestand: **${after.totals.items}** Bausteine aus ${after.repos.length} Repos` +
    (before ? ` (vorher ${before.totals.items})` : ""), "");

  const repoLines = syncReport.filter((r) => r.status !== "unchanged");
  if (repoLines.length) {
    lines.push("**Repos:**", "");
    // `before`/`after` sind die Commit-SHAs aus `cmdSync` und wurden bisher
    // verworfen. Sie sind der einzige Anker, mit dem sich ein Katalogstand später
    // gegen das Quell-Repo halten lässt: "updated" allein sagt nicht, wogegen.
    for (const r of repoLines) {
      const kurz = (s) => (s ? String(s).slice(0, 7) : null);
      const spanne = r.before && r.after && r.before !== r.after
        ? ` (${kurz(r.before)} → ${kurz(r.after)})`
        : (r.after ? ` (${kurz(r.after)})` : "");
      lines.push(`- \`${r.repo}\` — ${r.status}${spanne}${r.error ? `: ${r.error}` : ""}`);
    }
    lines.push("");
  } else {
    lines.push("Alle Repos unverändert.", "");
  }

  const listing = (title, arr, n = 30) => {
    if (!arr.length) return;
    lines.push(`**${title} (${arr.length}):**`, "");
    for (const i of arr.slice(0, n)) lines.push(`- \`${i.id}\` — ${short(i.description, 100) || "—"}`);
    if (arr.length > n) lines.push(`- ... ${arr.length - n} weitere`);
    lines.push("");
  };
  listing("Neu", added);
  listing("Geändert", changed);
  listing("Entfernt", removed);

  if (!added.length && !changed.length && !removed.length) lines.push("Keine Änderungen am Katalog.", "");

  // M11: Hygiene-Block direkt neben der Eval-Bilanz — beides zusammen ist der
  // "Audit" aus knowledge/04-governance.md 5.5, keine zwei getrennten Prüfungen.
  lines.push(...katalogHygiene(after), "");

  // --- Schritt 4: Routing-Evals ------------------------------------------
  // Warum an `update` und nicht an `lint`: die beiden prüfen Verschiedenes. `lint`
  // liest Text gegen Text, `eval` misst die Suche gegen den Katalog — und genau
  // dieser Katalog ist eine Zeile weiter oben neu gebaut worden. Ein neues Repo, das
  // die bisherigen Treffer verdrängt, ist ein Ergebnis dieses Laufs; es hier nicht
  // zu messen hiesse, die einzige Gelegenheit verstreichen zu lassen, bei der die
  // Ursache noch benannt werden kann.
  //
  // Der Exit-Code von `update` hängt damit auch am Eval-Lauf. Das ist eine bewusste
  // Vertragsänderung: ein Update, das die Suche verschlechtert, ist kein
  // erfolgreiches Update.
  console.log("\n4/4  Routing-Evals");
  let evalZeile = "Routing-Evals: nicht gelaufen.";
  try {
    const bilanz = cmdEval([], { cat: after, weich: true });
    if (bilanz) {
      evalZeile = `Routing-Evals: **${bilanz.bestanden} von ${bilanz.pflicht}** Pflichtfällen bestanden` +
        (bilanz.optionalGesamt ? `, ${bilanz.optionalOk} von ${bilanz.optionalGesamt} bekannten Schwächen behoben` : "") +
        (bilanz.verschoben.length ? `, ${bilanz.verschoben.length} Rangänderung(en) gegenüber dem letzten Lauf` : "") + ".";
    } else {
      evalZeile = "Routing-Evals: übersprungen — kein `evals/`-Verzeichnis.";
    }
  } catch (e) {
    // Ein gescheiterter Eval-Lauf darf das Changelog nicht kosten: Klone, Katalog
    // und Vergleich sind zu diesem Zeitpunkt fertige Arbeit.
    evalZeile = `Routing-Evals: Lauf abgebrochen — ${String(e.message || e).split("\n")[0]}`;
    console.log(`  ! ${evalZeile}`);
    process.exitCode = 1;
  }
  lines.push(evalZeile, "");

  // Geschrieben wird erst jetzt, damit das Eval-Ergebnis im **obersten** Abschnitt
  // steht statt in einem Nachtrag. Die Reihenfolge der Schritte auf dem Bildschirm
  // bleibt davon unberührt.
  const cl = path.join(ROOT, "CHANGELOG.md");
  const head = "# Changelog der Harness-Bibliothek\n\nNeueste Einträge oben. Erzeugt von `/harness-update`.\n\n";
  const old = fs.existsSync(cl) ? fs.readFileSync(cl, "utf8").replace(head, "") : "";
  fs.writeFileSync(cl, head + lines.join("\n") + "\n---\n\n" + old);

  console.log(`\n  +${added.length} neu · ~${changed.length} geändert · -${removed.length} entfernt`);
  console.log(`  ${evalZeile.replace(/\*\*/g, "")}`);
  console.log("  Details in CHANGELOG.md");
  // Kein fünfter Schritt: `lint` liest Text gegen Text und braucht ein Urteil
  // darüber, was zu ändern ist — das gehört in den Einpflege-Ablauf, nicht an das
  // Ende eines Katalogbaus. Der Hinweis gehört trotzdem hierhin: jede Bestandszahl
  // in der Wissensbank kann seit einer Minute falsch sein.
  if (added.length || removed.length) {
    console.log("  Der Bestand hat sich geändert — `node tools/harness.mjs lint` sagt, welche");
    console.log("  Zahlen und IDs in der Wissensbank jetzt nicht mehr stimmen.");
  }
}

// ---------------------------------------------------------------- stats

/**
 * Der Einwand steht in der Ausgabe, nicht nur hier: `stats` ist der Befehl, dessen
 * Zahl weitergetragen wird ("die Bibliothek hat 25.497 Bausteine"), und eine Zahl
 * ohne ihren Vorbehalt wird zur Leistungsangabe. `eval` und `lint` tragen ihren
 * Einwand längst mit; `stats` war der einzige zahlenausgebende Befehl ohne.
 *
 * Bewusst **nicht** ergänzt: ein Zähler "wurde jemals ausgelöst". Die Bibliothek
 * führt kein Register ihrer Zielprojekte — `install` schreibt das Manifest
 * ausschliesslich ins Ziel —, Hooks hinterlassen ohnehin keine Spur, und eine
 * Nutzungszahl, die immer null ist, wäre die unehrlichere Angabe.
 */
function cmdStats() {
  const cat = loadCatalog();
  const standard = cat.items.filter((i) => !i.bulk && !i.quarantaene).length;
  const bulkN = cat.items.filter((i) => i.bulk).length;
  // Quarantäne ausserhalb der Massen-Repos gezählt, damit die drei Angaben sich
  // zur Gesamtzahl addieren — ein quarantänisierter Bulk-Eintrag ist durch sein
  // Repo ohnehin schon unsichtbar und würde sonst doppelt erscheinen.
  const quarantaene = cat.totals.items - standard - bulkN;
  console.log(`Katalog vom ${cat.generatedAt.slice(0, 16).replace("T", " ")}`);
  console.log(`${cat.totals.items} Bausteine aus ${cat.repos.length} Repos`);
  console.log(`  davon ${standard} im Standardzugriff, ${bulkN} in Massen-Repos (nur mit --repo/--domain/--all)`);
  if (quarantaene) console.log(`  dazu ${quarantaene} in Quarantäne: Description leer oder ohne Wortinhalt, kein Suchwort kann sie treffen — katalogisiert bleiben sie, show und --all erreichen sie`);
  console.log("");
  console.log("Was diese Zahl nicht sagt: ob ein Baustein gut ist oder je benutzt wurde.");
  console.log("Sie wächst mit jedem aufgenommenen Repo — Bestand ist keine Leistung.\n");
  console.log("Nach Typ:");
  for (const [k, v] of Object.entries(cat.totals)) if (k !== "items") console.log(`  ${k.padEnd(9)} ${v}`);
  const byDomain = {};
  for (const i of cat.items) for (const d of i.domains) byDomain[d] = (byDomain[d] || 0) + 1;
  console.log("\nNach Domäne:");
  for (const [k, v] of Object.entries(byDomain).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(11)} ${v}`);
  console.log("\nGrösste Repos:");
  for (const r of [...cat.repos].sort((a, b) => b.count - a.count).slice(0, 8)) {
    console.log(`  ${String(r.count).padStart(5)}  ${r.dir}`);
  }
}

// ---------------------------------------------------------------- CLI

function parseFlags(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      if (v !== undefined) out[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) out[k] = argv[++i];
      else out[k] = true;
    } else out._.push(a);
  }
  return out;
}

const USAGE = `
harness.mjs — Harness-Bibliothek

  node tools/harness.mjs update                    Repos pullen + Katalog neu bauen + Changelog
  node tools/harness.mjs sync                      nur Repos pullen/klonen
  node tools/harness.mjs extract                   nur Katalog neu bauen
                                                   (+ Hygiene-Block in CHANGELOG.md, M11)
  node tools/harness.mjs search <worte>            Katalog durchsuchen
       [--type skill|agent|command|hook|mcp|plugin] [--domain X] [--repo X] [--limit N]
       [--all]   auch Massen-Repos (!bulk in sources.txt) und Quarantäne-Einträge
                 (Description leer oder ohne Wortinhalt) einbeziehen
       [--quarantine]   NUR die Quarantäne auflisten, je Zeile ID + Grund, kein
                 Suchwort nötig (Worte werden ignoriert); --type/--domain/--repo
                 grenzen weiter ein. Für "stimmt der Bestand?" — stats nennt nur
                 die Zahl.
  node tools/harness.mjs show <id> [--head N]      Detail zu einem Baustein
  node tools/harness.mjs intent                    Absichten aus catalog/intents.yaml
  node tools/harness.mjs intent --list              auflisten (id + Frage) — M9,
                                                   knowledge/04-governance.md 2.4
  node tools/harness.mjs intent <id> [--limit N]   die hinterlegten Suchen dieser
                 Absicht ausführen (dieselbe Bewertung wie search), Anker-Bausteine
                 immer vorn, danach die übrigen Treffer nach Score. Unbekannte id:
                 Fehlermeldung + Liste der gültigen ids, Exit-Code 1. Ein einzelner
                 suche-String darf ein eingebettetes --type/--domain tragen (wirkt
                 nur für diese eine Query, gleiche Bedeutung wie bei search); ein
                 unbekanntes --flag darin ist ein Datenfehler in intents.yaml und
                 wird gemeldet statt als Suchwort gewertet.
  node tools/harness.mjs install <id...> --to DIR  Baustein(e) ins Zielprojekt kopieren
       [--force] [--dry-run] [--no-claude-md]
       [--yes]   Rückfrage überspringen. Vor dem Kopieren wird gemeldet, was der
                 Baustein an ausführbarem Code mitbringt (Hooks feuern automatisch)
                 samt Fundstelle mit Zeilennummer. Ohne --yes und ohne TTY wird
                 abgebrochen statt kopiert. Sichtprüfung, kein Schutz.
       Nach dem Kopieren folgt ein Zustandsbericht: [aktiv] / [inaktiv] je Baustein.
       Skills, Subagents und Commands wirken sofort; Hooks brauchen einen Eintrag in
       .claude/settings.json — der fertige JSON-Schnipsel wird ausgegeben —, MCP eine
       .mcp.json mit Zugangsdaten, Plugins eine Aktivierung über /plugin.
  node tools/harness.mjs uninstall <id...> --to DIR
       [--dry-run] [--force] [--no-claude-md]
                 Entfernt genau die Dateien, die im Manifest des Zielprojekts zu
                 diesen Bausteinen stehen — nichts sonst, auch nicht im selben
                 Ordner. Dateien, die seit der Installation geändert wurden,
                 bleiben stehen; --force entfernt auch sie. Manifest-Einträge
                 ohne Dateiliste (ältere Version) führen zum Abbruch.
  node tools/harness.mjs list --to DIR             was liegt in diesem Projekt?
       Liest das Manifest des Zielprojekts und bestimmt den Zustand jedes Eintrags
       neu — [aktiv] / [inaktiv] wie nach install, aber mit dem Stand von heute.
       Meldet ausserdem Manifest-Einträge, deren Dateien nicht mehr da sind.
  node tools/harness.mjs bootstrap --to DIR        nur den Regelblock in die
       [--no-skills]                               CLAUDE.md des Projekts schreiben
       Legt ausserdem die Bedien-Skills harness-plan und harness-build unter
       .claude/skills/ des Zielprojekts ab — ein frisches Projekt kennt sie sonst
       nicht. --no-skills unterdrückt das. Nur bootstrap tut das; install nicht.
  node tools/harness.mjs knowledge "<frage>"       Wissensbank durchsuchen —
       [--limit N] [--lines N]                     liefert Abschnitte, nicht Dateien
  node tools/harness.mjs knowledge --list          Inhaltsverzeichnis der Wissensbank
  node tools/harness.mjs eval [--all]              Routing-Evals aus evals/*.jsonl:
       [--json] [--no-save]                        findet die Suche noch, was sie
                                                   finden soll? Exit-Code 1, wenn ein
                                                   Pflichtfall fehlschlägt. Läuft als
                                                   Schritt 4 von "update" mit.
       Vergleicht ausserdem die Ränge der erwarteten Treffer mit dem letzten Lauf
       (evals/last-run.json) und meldet Verschiebungen, bevor ein Fall durchfällt.
       --no-save schreibt den Vergleichsstand nicht fort, --json gibt die Bilanz
       maschinenlesbar aus.
       Kurzformen: "know" und "why" sind gleichwertige Namen für "knowledge".
  node tools/harness.mjs lint [--all] [--strict]   Wissensbank auf Verfall prüfen:
                                                   fehlende Metadaten, abgelaufenes
                                                   stale_after, tote Verweise,
                                                   nicht ausgewertete Rohquellen
       Dazu die Nähte zwischen Text und Maschine: jede genannte Baustein-ID gegen
       den Katalog (in recipes/ hoch, sonst mittel), jeden Aufruf "node
       tools/harness.mjs <sub> --<flag>" aus einem Codeblock gegen den Dispatcher,
       das Alter von catalog/index.json gegen ${KATALOG_MAX_TAGE} Tage, die zugesagten
       eigenen Dateien (CHANGELOG.md, INDEX.md, catalog/by-domain/*.md, ...) gegen
       das Dateisystem, die "Stand:"-Zeile der erzeugten Indizes gegen den Katalog,
       Repos ohne einen einzigen Katalogeintrag, und in den Rezept-Tabellen die
       Spalten Typ und KB gegen den Katalogeintrag derselben ID.
       Geprüft werden knowledge/, recipes/ sowie README.md, INDEX.md, CLAUDE.md.
       Eine absichtlich tote Angabe entschärft "${LINT_HISTORISCH}" im selben Absatz.
       Exit-Code: 1 bei jedem Befund hoher Schwere, sonst 0. Mit --strict zählen
       auch mittlere. Damit ist lint als Schranke in einer CI benutzbar.
  node tools/harness.mjs stats                     Übersicht

Klon-Verzeichnis: ${CLONE_DIR}
(überschreibbar mit Umgebungsvariable HARNESS_SOURCES)
`;

const [cmd, ...rest] = process.argv.slice(2);
switch (cmd) {
  case "sync": cmdSync(); break;
  case "extract": cmdExtract(); break;
  case "update": cmdUpdate(); break;
  case "search": cmdSearch(rest); break;
  case "show": cmdShow(rest); break;
  case "intent": cmdIntent(rest); break;
  case "install": cmdInstall(rest); break;
  case "uninstall": cmdUninstall(rest); break;
  case "bootstrap": cmdBootstrap(rest); break;
  case "list": cmdList(rest); break;
  case "knowledge": case "know": case "why": cmdKnowledge(rest); break;
  case "lint": cmdLint(rest); break;
  case "eval": cmdEval(rest); break;
  case "stats": cmdStats(); break;
  default: console.log(USAGE);
}
