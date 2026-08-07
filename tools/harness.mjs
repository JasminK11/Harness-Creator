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
 *   uninstall <id...> Bausteine anhand des Manifests wieder entfernen
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
    return { status: "aktiv", grund: null, wirkung: `wird aus ${wo}/ beim nächsten Sitzungsstart geladen — kein weiterer Schritt`, snippet: null };
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
    if (z.status === "aktiv") { console.log(`            ${z.wirkung}`); continue; }
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
  const offen = zustaende.length - aktiv;
  console.log(`\n  Ergebnis: ${aktiv} von ${zustaende.length} wirksam, ${offen} brauchen einen Schritt von Hand.`);
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
    L.push("| Baustein | Typ | Liegt in | Zustand |");
    L.push("|---|---|---|---|");
    // Der Zustand wird hier **neu bestimmt** statt aus dem Manifest übernommen:
    // wer den Hook seit der Installation in settings.json eingetragen hat, soll
    // ihn nicht auf Dauer als wirkungslos gemeldet bekommen. Die Angabe im
    // Manifest ist der Stand des Installationslaufs, die hier ist der von heute.
    for (const m of installed) {
      const st = target ? activationOf(m, target).status : (m.status || "unbekannt");
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
function requireTarget(flags, befehl, { erlaubeSelbst = false, positional = false } = {}) {
  // `positional` nur dort, wo die freien Argumente nicht schon belegt sind:
  // bei install und uninstall sind das die Baustein-IDs, nicht das Ziel.
  const roh = flags.to || (positional ? flags._[0] : null);
  if (!roh || roh === true) {
    die(`Kein Zielverzeichnis angegeben.\n` +
        `  ${befehl} verlangt --to, weil es in einem fremden Projekt schreibt.\n` +
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
    plan.push({ it, src, dest });
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
const NAHT_EXTRA = ["README.md", "INDEX.md", "CLAUDE.md"];

/** Absatz-Marke, mit der ein Autor eine bewusst tote Angabe stehen lässt.
 *  HTML-Kommentar, damit sie in jeder Markdown-Ansicht unsichtbar bleibt. */
const LINT_HISTORISCH = "<!-- lint:historisch -->";

/** Baustein-IDs im Fliesstext. Das Repo-Präfix ist optional, damit auch die
 *  Kurzform `nextlevelbuilder/agent/design-review` auffällt — sie liest sich
 *  richtig, ist aber für `install` unauflösbar. */
const NAHT_ID_RE = /`([A-Za-z0-9._-]+(?:__[A-Za-z0-9._-]+)?\/(?:skill|agent|command|hook|mcp|plugin)\/[A-Za-z0-9._/-]+)`/g;

/** Ab wann ein Katalog als veraltet gilt. */
const KATALOG_MAX_TAGE = 30;

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
      { wert: cat.items.filter((i) => !i.bulk).length, was: "Bausteine im Standardzugriff" },
      { wert: cat.items.filter((i) => i.bulk).length, was: "Bausteine in Massen-Repos" },
    ];
    const alleWerte = new Set(kennzahlen.map((k) => k.wert));

    // Eine Zahl ist nur dann eine Bestandsangabe, wenn ihr Umfeld das sagt.
    // Sonst meldet die Prüfung Zeilenzahlen und Token-Angaben als Widerspruch.
    const BESTAND_RE = /\b(baustein|einträg|katalog|skills?\b|standardzugriff|verzeichnet|umfasst)/i;
    // Bewusste Rundungen sind keine Widersprüche, sondern korrekte Prosa.
    const RUNDUNG_RE = /\b(rund|etwa|circa|ca\.|über|mehr als|knapp|gut)\s*$/i;

    for (const f of files) {
      const text = safeRead(f.abs);
      const gesehen = new Set();
      for (const m of text.matchAll(/\b(\d{1,3}(?:[.,]\d{3})+|\d{3,6})\b/g)) {
        const roh = m[1];
        const zahl = Number(roh.replace(/[.,]/g, ""));
        if (!Number.isFinite(zahl) || zahl < 100 || gesehen.has(zahl)) continue;
        if (alleWerte.has(zahl)) continue;                      // stimmt

        const vor = text.slice(Math.max(0, m.index - 70), m.index);
        const nach = text.slice(m.index + roh.length, m.index + roh.length + 70);
        if (!BESTAND_RE.test(vor + nach)) continue;             // andere Art Zahl
        if (RUNDUNG_RE.test(vor) && zahl % 1000 === 0) continue; // "über 25.000"

        gesehen.add(zahl);
        for (const k of kennzahlen) {
          const abweichung = Math.abs(zahl - k.wert) / k.wert;
          if (abweichung > 0 && abweichung < 0.2) {
            add("hoch", f.rel, `Bestandszahl \`${roh}\` weicht vom Katalog ab — aktuell ${k.wert} (${k.was}). Veraltete Zahl oder Verwechslung.`);
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
        if (!/harness\.mjs/.test(line)) continue;
        for (const g of line.matchAll(/\s(--[a-z][a-z-]*)/g)) {
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
  node tools/harness.mjs bootstrap --to DIR        nur den Regelblock in die
                                                   CLAUDE.md des Projekts schreiben
  node tools/harness.mjs knowledge "<frage>"       Wissensbank durchsuchen —
       [--limit N] [--lines N]                     liefert Abschnitte, nicht Dateien
  node tools/harness.mjs knowledge --list          Inhaltsverzeichnis der Wissensbank
  node tools/harness.mjs lint [--all] [--strict]   Wissensbank auf Verfall prüfen:
                                                   fehlende Metadaten, abgelaufenes
                                                   stale_after, tote Verweise,
                                                   nicht ausgewertete Rohquellen
       Dazu die Nähte zwischen Text und Maschine: jede genannte Baustein-ID gegen
       den Katalog (in recipes/ hoch, sonst mittel), jeden Aufruf "node
       tools/harness.mjs <sub> --<flag>" aus einem Codeblock gegen den Dispatcher,
       und das Alter von catalog/index.json gegen ${KATALOG_MAX_TAGE} Tage.
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
  case "install": cmdInstall(rest); break;
  case "uninstall": cmdUninstall(rest); break;
  case "bootstrap": cmdBootstrap(rest); break;
  case "knowledge": case "know": case "why": cmdKnowledge(rest); break;
  case "lint": cmdLint(rest); break;
  case "stats": cmdStats(); break;
  default: console.log(USAGE);
}
