#!/usr/bin/env node
/**
 * harness.mjs — CLI der Harness-Bibliothek.
 *
 * Aufgerufen von: den Skills `harness-update` und `harness-build`
 * (C:\Users\info\.claude\skills\...\SKILL.md) sowie direkt vom User.
 *
 * Subcommands:
 *   sync              Repos aus sources.txt klonen/pullen
 *   extract           Bausteine katalogisieren -> catalog/index.json + Markdown-Indizes
 *   update            sync + extract + CHANGELOG.md schreiben
 *   search <query>    Katalog durchsuchen (kompakte Trefferzeilen)
 *   show <id>         Detail zu einem Baustein
 *   install <id...>   Baustein(e) in ein Zielprojekt kopieren
 *   stats             Übersicht
 *
 * Warum ein CLI statt "Claude liest die Repos":
 * Die Quellen umfassen >2000 Bausteine. Ein Agent, der die durchliest, hat sein
 * Kontextfenster voll, bevor er die erste Zeile Projektcode sieht. Das CLI hält
 * den Katalog ausserhalb des Kontexts und liefert nur die Treffer.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
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
  for (const line of text.slice(3, end).split(/\r?\n/)) {
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

function dirSize(dir) {
  let bytes = 0, files = 0;
  walk(dir, (p, isDir) => {
    if (isDir) return;
    try { bytes += fs.statSync(p).size; files++; } catch { /* egal */ }
  });
  return { bytes, files };
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
        git(["fetch", "--depth", "1", "origin"], dest);
        const branch = s.branch || git(["symbolic-ref", "--short", "HEAD"], dest);
        git(["reset", "--hard", `origin/${branch}`], dest);
        const after = git(["rev-parse", "HEAD"], dest);
        report.push({ repo: s.dir, status: before === after ? "unchanged" : "updated", before, after });
        console.log(`${before === after ? "  =" : "  ^"} ${s.dir}`);
      } else {
        const args = ["clone", "--depth", "1", "--quiet"];
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
        files: size.files,
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
  const c = text.match(/^\s*(?:#|\/\/)\s*(.+)$/m);
  return c ? c[1].slice(0, 200) : null;
}

function cmdExtract({ quiet = false } = {}) {
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
    if (!quiet) console.log(`  . ${s.dir}: ${items.length} Bausteine${isBulk ? "  [bulk — nur per --repo/--domain sichtbar]" : ""}`);
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

function writeMarkdownIndexes(catalog) {
  // Bulk-Bausteine bleiben aus den Markdown-Indizes draussen — sonst besteht
  // by-domain/legal-de.md aus 24.500 Tabellenzeilen und ist unlesbar.
  const normal = catalog.items.filter((i) => !i.bulk);
  const bulkRepos = catalog.repos.filter((r) => r.bulk);
  const byDomain = {};
  for (const it of normal) {
    for (const d of it.domains) (byDomain[d] ||= []).push(it);
  }

  // --- Ebene 1: INDEX.md — bewusst klein gehalten. Das ist die einzige Datei,
  //     die ein Agent im Normalfall komplett liest.
  const l1 = [];
  l1.push("# Harness-Bibliothek — Index (Ebene 1)");
  l1.push("");
  l1.push("> Automatisch erzeugt von `tools/harness.mjs extract` — **nicht von Hand bearbeiten.**");
  l1.push(`> Stand: ${catalog.generatedAt.slice(0, 16).replace("T", " ")} · ${normal.length} Bausteine im Standardzugriff` +
    (bulkRepos.length ? ` (+ ${catalog.totals.items - normal.length} in Massen-Repos, siehe unten)` : "") +
    ` aus ${catalog.repos.length} Repos`);
  l1.push("");
  l1.push("## Regel für Agenten");
  l1.push("");
  l1.push("Diese Datei lesen. **Nicht** `catalog/index.json` lesen (zu gross) und **nicht** die");
  l1.push("Quell-Repos durchsuchen. Für alles Weitere das CLI benutzen:");
  l1.push("");
  l1.push("```bash");
  l1.push('node tools/harness.mjs search "<stichwort>"     # Treffer als kompakte Zeilen');
  l1.push("node tools/harness.mjs show <id>                # Detail zu einem Baustein");
  l1.push("node tools/harness.mjs install <id> --to <proj> # in Zielprojekt kopieren");
  l1.push("```");
  l1.push("");
  l1.push("Grund: Der volle Katalog umfasst " + catalog.totals.items + " Bausteine. Wer den einliest,");
  l1.push("hat sein Kontextfenster voll, bevor er die erste Zeile Projektcode sieht.");
  l1.push("");
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
  l1.push("Einstieg über die Domäne, dann `search` innerhalb davon.");
  l1.push("");
  l1.push("| Domäne | Bausteine | Detail-Index |");
  l1.push("|---|---:|---|");
  for (const [d, items] of Object.entries(byDomain).sort((a, b) => b[1].length - a[1].length)) {
    l1.push(`| ${d} | ${items.length} | \`catalog/by-domain/${d}.md\` |`);
  }
  l1.push("");
  l1.push("## Quell-Repos");
  l1.push("");
  l1.push("| Repo | Bausteine | Schwerpunkt | Stand |");
  l1.push("|---|---:|---|---|");
  for (const r of catalog.repos.filter((r) => !r.bulk).sort((a, b) => b.count - a.count)) {
    l1.push(`| [${r.owner}/${r.repo}](${r.url}) | ${r.count} | ${r.domains.join(", ") || "—"} | ${(r.lastCommit || "").slice(0, 10)} |`);
  }
  l1.push("");

  if (bulkRepos.length) {
    l1.push("## Massen-Repos (opt-in)");
    l1.push("");
    l1.push("Diese Repos sind vollständig katalogisiert, tauchen aber **nicht** in der normalen");
    l1.push("Suche auf. Sie enthalten so viele Bausteine, dass jede Suche sonst von ihnen");
    l1.push("dominiert würde. Zugriff nur gezielt:");
    l1.push("");
    l1.push("```bash");
    for (const r of bulkRepos) {
      l1.push(`node tools/harness.mjs search "<stichwort>" --repo ${r.dir}`);
    }
    l1.push('node tools/harness.mjs search "<stichwort>" --all   # alles, inklusive Massen-Repos');
    l1.push("```");
    l1.push("");
    l1.push("| Repo | Bausteine | Schwerpunkt | Stand |");
    l1.push("|---|---:|---|---|");
    for (const r of bulkRepos) {
      l1.push(`| [${r.owner}/${r.repo}](${r.url}) | ${r.count} | ${r.domains.join(", ") || "—"} | ${(r.lastCommit || "").slice(0, 10)} |`);
    }
    l1.push("");
  }
  l1.push("## Weiterlesen");
  l1.push("");
  l1.push("- `knowledge/` — **warum** ein Harness so gebaut wird (Doktrin, Entscheidungsbaum, Anti-Patterns)");
  l1.push("- `recipes/` — fertige Baupläne pro Projekttyp");
  l1.push("- `CHANGELOG.md` — was sich beim letzten `/harness-update` geändert hat");
  fs.writeFileSync(path.join(ROOT, "INDEX.md"), l1.join("\n") + "\n");

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

function cmdSearch(argv) {
  const flags = parseFlags(argv);
  const query = flags._.join(" ").toLowerCase().trim();
  const cat = loadCatalog();
  const terms = query.split(/\s+/).filter(Boolean);

  let items = cat.items;
  // Massen-Repos nur, wenn ausdrücklich verlangt: sonst verdrängen 24.500 Rechts-Skills
  // jeden anderen Treffer.
  const wantsBulk = flags.all || flags.repo || flags.domain;
  if (!wantsBulk) items = items.filter((i) => !i.bulk);
  if (flags.type) items = items.filter((i) => i.type === flags.type);
  if (flags.domain) items = items.filter((i) => i.domains.includes(flags.domain));
  if (flags.repo) items = items.filter((i) => i.repo.toLowerCase().includes(String(flags.repo).toLowerCase()));

  const rated = items.map((i) => {
    const hayName = (i.name + " " + i.id).toLowerCase();
    const hayAll = (hayName + " " + i.description + " " + i.path + " " + i.domains.join(" ")).toLowerCase();
    let score = 0, hits = 0;
    for (const t of terms) {
      const inAll = hayAll.includes(t);
      if (inAll) hits++;
      if (hayName.includes(t)) score += 10;
      if (inAll) score += 3;
    }
    // Kleine Bausteine bevorzugen: billiger einzubauen, leichter zu prüfen.
    if (score > 0 && i.bytes < 20000) score += 1;
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
  if (relaxed) console.log(`Kein Baustein enthält alle Suchwörter — zeige Teiltreffer.\n`);

  const limit = Number(flags.limit || 25);
  if (!scored.length) {
    console.log(`Keine Treffer für "${query}".`);
    console.log("Tipp: breiter suchen, --type/--domain weglassen, oder --all für Massen-Repos.");
    console.log("Verfügbare Domänen siehe INDEX.md.");
    return;
  }
  console.log(`${scored.length} Treffer für "${query}"${scored.length > limit ? ` (zeige ${limit})` : ""}:\n`);
  for (const { i } of scored.slice(0, limit)) {
    console.log(`${i.type.padEnd(7)} ${i.id}`);
    console.log(`        ${short(i.description, 150) || "(keine Beschreibung)"}`);
    console.log(`        ${Math.max(1, Math.round(i.bytes / 1024))} KB · ${i.files} Datei(en) · ${i.domains.join(", ")}`);
    console.log("");
  }
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
  console.log(`Repo        ${it.repo}`);
  console.log(`Domänen     ${it.domains.join(", ")}`);
  console.log(`Grösse      ${Math.max(1, Math.round(it.bytes / 1024))} KB in ${it.files} Datei(en)`);
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

/** Zielverzeichnis nach Typ: so, wie Claude Code die Bausteine tatsächlich lädt. */
const TARGET_BY_TYPE = {
  skill: ".claude/skills",
  agent: ".claude/agents",
  command: ".claude/commands",
  hook: ".claude/hooks",
  mcp: ".",
  plugin: ".claude/plugins",
};

function copyRecursive(src, dest) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const e of fs.readdirSync(src)) {
      if (SKIP_DIRS.has(e)) continue;
      copyRecursive(path.join(src, e), path.join(dest, e));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
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

function claudeMdBlock(installed, catalogGeneratedAt) {
  const L = [];
  L.push(CLAUDE_MD_START);
  L.push("## Harness-Bibliothek");
  L.push("");
  L.push(`Dieses Projekt bezieht Harness-Bausteine aus \`${ROOT}\`.`);
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
  L.push("node tools/harness.mjs show <id>");
  L.push(`node tools/harness.mjs install <id> --to "${"<dieses Projekt>"}"`);
  L.push("```");
  L.push("");
  L.push("Reihenfolge bei einer Frage nach passenden Bausteinen: erst `search`, dann");
  L.push("`show` für die engere Auswahl, dann `install`. `INDEX.md` der Bibliothek darf");
  L.push("komplett gelesen werden — sie ist dafür klein gehalten.");
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
    L.push("| Baustein | Typ | Liegt in |");
    L.push("|---|---|---|");
    for (const m of installed) L.push(`| \`${m.id}\` | ${m.type} | \`${m.installedTo}\` |`);
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
  const block = claudeMdBlock(installed, catalogGeneratedAt);
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

function cmdInstall(argv) {
  const flags = parseFlags(argv);
  const target = path.resolve(flags.to || process.cwd());
  const cat = loadCatalog();
  const dry = !!flags["dry-run"];
  if (!flags._.length) die("Keine ID angegeben. Beispiel: install affaan-m__ecc/skill/tdd-workflow --to C:\\proj");

  const manifest = [];
  for (const id of flags._) {
    const it = findItem(cat, id);
    if (!it) { console.log(`  ! nicht gefunden: ${id}`); continue; }
    const src = path.join(CLONE_DIR, it.path);
    if (!fs.existsSync(src)) { console.log(`  ! Quelle fehlt: ${src}`); continue; }

    const subdir = TARGET_BY_TYPE[it.type] || ".claude";
    const leaf = it.type === "skill" || it.type === "plugin" ? slug(it.name) : path.basename(it.path);
    const dest = path.join(target, subdir, leaf);

    if (fs.existsSync(dest) && !flags.force) {
      console.log(`  = ${it.id} — existiert schon (${path.relative(target, dest)}), --force zum Überschreiben`);
      continue;
    }
    console.log(`  ${dry ? "~" : "+"} ${it.id} -> ${path.relative(target, dest).split(path.sep).join("/")}`);
    if (!dry) copyRecursive(src, dest);
    manifest.push({ id: it.id, type: it.type, from: it.repo, sourcePath: it.path, installedTo: path.relative(target, dest).split(path.sep).join("/") });
  }

  if (!dry && manifest.length) {
    // Manifest = Herkunftsnachweis. Ohne ihn weiss beim nächsten Update niemand mehr,
    // welcher Baustein aus welchem Repo stammt und ob er dort inzwischen anders aussieht.
    const mf = path.join(target, ".claude", "harness-manifest.json");
    let prev = [];
    if (fs.existsSync(mf)) { try { prev = JSON.parse(fs.readFileSync(mf, "utf8")).items || []; } catch { /* egal */ } }
    const merged = [...prev.filter((p) => !manifest.some((m) => m.id === p.id)), ...manifest];
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
}

/** Schreibt nur den Regelblock, ohne Bausteine zu installieren.
 *  Für Projekte, die die Bibliothek durchsuchen wollen, ohne (noch) etwas zu übernehmen. */
function cmdBootstrap(argv) {
  const flags = parseFlags(argv);
  const target = path.resolve(flags.to || flags._[0] || process.cwd());
  if (!fs.existsSync(target)) die(`Zielverzeichnis existiert nicht: ${target}`);
  const cat = loadCatalog();
  const mf = path.join(target, ".claude", "harness-manifest.json");
  let installed = [];
  if (fs.existsSync(mf)) { try { installed = JSON.parse(fs.readFileSync(mf, "utf8")).items || []; } catch { /* egal */ } }
  const cf = writeClaudeMd(target, installed, cat.generatedAt);
  console.log(`Regelblock geschrieben: ${cf}`);
  console.log(installed.length
    ? `  ${installed.length} bereits installierte Bausteine aufgeführt.`
    : "  Noch keine Bausteine installiert — nur die Zugriffsregel.");
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

// ---------------------------------------------------------------- update

function cmdUpdate() {
  const before = fs.existsSync(INDEX_JSON) ? loadCatalog() : null;
  console.log("1/3  Repos synchronisieren");
  const syncReport = cmdSync();
  console.log("\n2/3  Bausteine katalogisieren");
  const after = cmdExtract({ quiet: false });
  console.log("\n3/3  Changelog schreiben");

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
    for (const r of repoLines) lines.push(`- \`${r.repo}\` — ${r.status}${r.error ? `: ${r.error}` : ""}`);
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

  const cl = path.join(ROOT, "CHANGELOG.md");
  const head = "# Changelog der Harness-Bibliothek\n\nNeueste Einträge oben. Erzeugt von `/harness-update`.\n\n";
  const old = fs.existsSync(cl) ? fs.readFileSync(cl, "utf8").replace(head, "") : "";
  fs.writeFileSync(cl, head + lines.join("\n") + "\n---\n\n" + old);

  console.log(`\n  +${added.length} neu · ~${changed.length} geändert · -${removed.length} entfernt`);
  console.log("  Details in CHANGELOG.md");
}

// ---------------------------------------------------------------- stats

function cmdStats() {
  const cat = loadCatalog();
  console.log(`Katalog vom ${cat.generatedAt.slice(0, 16).replace("T", " ")}`);
  console.log(`${cat.totals.items} Bausteine aus ${cat.repos.length} Repos\n`);
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
  node tools/harness.mjs search <worte>            Katalog durchsuchen
       [--type skill|agent|command|hook|mcp|plugin] [--domain X] [--repo X] [--limit N]
       [--all]   auch Massen-Repos (!bulk in sources.txt) einbeziehen
  node tools/harness.mjs show <id> [--head N]      Detail zu einem Baustein
  node tools/harness.mjs install <id...> --to DIR  Baustein(e) ins Zielprojekt kopieren
       [--force] [--dry-run] [--no-claude-md]
  node tools/harness.mjs bootstrap --to DIR        nur den Regelblock in die
                                                   CLAUDE.md des Projekts schreiben
  node tools/harness.mjs knowledge "<frage>"       Wissensbank durchsuchen —
       [--limit N] [--lines N]                     liefert Abschnitte, nicht Dateien
  node tools/harness.mjs knowledge --list          Inhaltsverzeichnis der Wissensbank
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
  case "install": cmdInstall(rest); break;
  case "bootstrap": cmdBootstrap(rest); break;
  case "knowledge": case "know": case "why": cmdKnowledge(rest); break;
  case "stats": cmdStats(); break;
  default: console.log(USAGE);
}
