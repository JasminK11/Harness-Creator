# Domäne: meta

101 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (16)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/gan-evaluator` | GAN Harness — Evaluator agent. Tests the live running application via Playwright, scores against rubric, and provides actionable … | 8 |
| `affaan-m__ecc/agent/gan-generator` | GAN Harness — Generator agent. Implements features according to the spec, reads evaluator feedback, and iterates until quality th… | 6 |
| `affaan-m__ecc/agent/gan-planner` | GAN Harness — Planner agent. Expands a one-line prompt into a full product specification with features, sprints, evaluation crite… | 4 |
| `affaan-m__ecc/agent/harness-optimizer` | Analyze and improve the local agent harness configuration for reliability, cost, and throughput. | 1 |
| `affaan-m__ecc/agent/opensource-packager` | Generate complete open-source packaging for a sanitized project. Produces CLAUDE.md, setup.sh, README.md, LICENSE, CONTRIBUTING.m… | 8 |
| `affaan-m__ecc/agent/react-reviewer` | Expert React/JSX code reviewer specializing in hook correctness, render performance, server/client component boundaries, accessib… | 5 |
| `anthropics__skills/agent/analyzer` | Analyze blind comparison results to understand WHY the winner won and generate improvement suggestions. | 10 |
| `anthropics__skills/agent/comparator` | Compare two outputs WITHOUT knowing which skill produced them. | 7 |
| `anthropics__skills/agent/grader` | Evaluate expectations against an execution transcript and outputs. | 9 |
| `Egonex-AI__Understand-Anything/agent/architecture-analyzer` | / Analyzes a codebase's file structure, summaries, and import relationships to identify logical architectural layers and assign e… | 23 |
| `Egonex-AI__Understand-Anything/agent/assemble-reviewer` | / Reviews the output of merge-batch-graphs.py for semantic issues the script cannot catch. Recovers dropped nodes/edges and fills… | 5 |
| `Egonex-AI__Understand-Anything/agent/domain-analyzer` | / Analyzes codebases to extract business domain knowledge — domains, business flows, and process steps. Produces a domain-graph.j… | 6 |
| `Egonex-AI__Understand-Anything/agent/graph-reviewer` | / Validates knowledge graphs for correctness, completeness, and quality. Runs systematic checks and renders approval or rejection… | 12 |
| `Egonex-AI__Understand-Anything/agent/project-scanner` | / Scans a codebase directory to produce a structured inventory of all project files, detected languages, frameworks, import maps,… | 17 |
| `Egonex-AI__Understand-Anything/agent/tour-builder` | / Designs guided learning tours through codebases, creating 5-15 pedagogical steps that teach project architecture and key concep… | 21 |
| `msitarzewski__agency-agents/agent/wordpress-performance-engineer` | Expert WordPress performance engineer specializing in Core Web Vitals, object caching (Redis/Memcached), page caching, database a… | 24 |

## command (6)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/cost-report` | Generate a local Claude Code cost report from the ECC cost-tracker metrics log. | 4 |
| `affaan-m__ecc/command/harness-audit` | Run a deterministic repository harness audit and return a prioritized scorecard. | 3 |
| `affaan-m__ecc/command/orch-build-mvp` | Orchestrate bootstrapping a working MVP from a design/spec doc — ingest, slice, scaffold, TDD, review, gated commit (reuses the G… | 1 |
| `affaan-m__ecc/command/react-review` | Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, … | 6 |
| `affaan-m__ecc/command/security-scan` | Run AgentShield against agent, hook, MCP, permission, and secret surfaces. | 3 |
| `affaan-m__ecc/command/sessions` | Manage Claude Code session history, aliases, and session metadata. | 14 |

## hook (42)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/adapter` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/auto-tmux-dev` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/bash-hook-dispatcher` | !/usr/bin/env node | 6 |
| `affaan-m__ecc/hook/block-no-verify` | !/usr/bin/env node | 14 |
| `affaan-m__ecc/hook/check-console-log` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/codex-hooks` | — | 2 |
| `affaan-m__ecc/hook/config-protection` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/cost-tracker` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/design-quality-check` | !/usr/bin/env node | 4 |
| `affaan-m__ecc/hook/desktop-notify` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/doc-file-warning` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/ecc-context-monitor` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/ecc-metrics-bridge` | !/usr/bin/env node | 10 |
| `affaan-m__ecc/hook/ecc-statusline` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/evaluate-session` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/gateguard-fact-force` | !/usr/bin/env node | 40 |
| `affaan-m__ecc/hook/governance-capture` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/insaits-security-monitor` | !/usr/bin/env python3 | 8 |
| `affaan-m__ecc/hook/mcp-health-check` | !/usr/bin/env node | 23 |
| `affaan-m__ecc/hook/observe` | !/usr/bin/env bash | 23 |
| `affaan-m__ecc/hook/post-bash-dispatcher` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/post-edit-accumulator` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/post-edit-console-warn` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/post-edit-format` | !/usr/bin/env node | 4 |
| `affaan-m__ecc/hook/post-edit-typecheck` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/posttooluse-dispatcher` | !/usr/bin/env node | 10 |
| `affaan-m__ecc/hook/pre-bash-commit-quality` | !/usr/bin/env node | 16 |
| `affaan-m__ecc/hook/pre-bash-dispatcher` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/pre-compact` | !/usr/bin/env node | 7 |
| `affaan-m__ecc/hook/pre-write-doc-warn` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/quality-gate` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/run-with-flags` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/session-activity-tracker` | !/usr/bin/env node | 16 |
| `affaan-m__ecc/hook/session-end` | !/usr/bin/env node | 12 |
| `affaan-m__ecc/hook/session-end-marker` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/session-start` | !/usr/bin/env node | 27 |
| `affaan-m__ecc/hook/session-start-bootstrap` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/stop-format-typecheck` | !/usr/bin/env node | 9 |
| `AgriciDaniel__claude-seo/hook/hooks` | — | 1 |
| `AgriciDaniel__claude-seo/hook/validate-schema` | !/usr/bin/env python3 | 6 |
| `Egonex-AI__Understand-Anything/hook/hooks` | — | 1 |
| `Egonex-AI__Understand-Anything/hook/post-tool-use-auto-update` | — | 2 |

## mcp (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/mcp/mcp` | MCP-Server: chrome-devtools | 1 |
| `mvanhorn__last30days-skill/mcp/manifest` | MCP-Konfiguration | 5 |
| `nextlevelbuilder__ui-ux-pro-max-skill/mcp/mcp` | MCP-Server: playwright, chrome-devtools, shadcn | 1 |

## plugin (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/plugin/ecc` | Harness-native ECC plugin for engineering teams - 67 agents, 282 skills, 94 legacy command shims, reusable hooks, rules, MCP conv… | 49642 |
| `AgriciDaniel__claude-seo/plugin/claude-seo` | Comprehensive SEO analysis plugin for Claude Code. 25 sub-skills (21 core + 1 orchestrator + 1 framework + 2 extension mirrors) a… | 4119 |
| `Egonex-AI__Understand-Anything/plugin/understand-anything` | AI-powered codebase understanding — analyze, visualize, and explain any project | 32102 |

## skill (31)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/agent-eval` | Head-to-head comparison of coding agents (Claude Code, Aider, Codex, etc.) on custom tasks with pass rate, cost, time, and consis… | 4 |
| `affaan-m__ecc/skill/agent-harness-construction` | Design and optimize AI agent action spaces, tool definitions, and observation formatting for higher completion rates. | 2 |
| `affaan-m__ecc/skill/agentic-os` | Build persistent multi-agent operating systems on Claude Code. Covers kernel architecture, specialist agents, slash commands, fil… | 12 |
| `affaan-m__ecc/skill/architecture-decision-records` | Capture architectural decisions made during Claude Code sessions as structured ADRs. Auto-detects decision moments, records conte… | 7 |
| `affaan-m__ecc/skill/autonomous-agent-harness` | Transform Claude Code into a fully autonomous agent system with persistent memory, scheduled operations, computer use, and task q… | 11 |
| `affaan-m__ecc/skill/autonomous-loops` | Patterns and architectures for autonomous Claude Code loops — from simple sequential pipelines to RFC-driven multi-agent DAG syst… | 24 |
| `affaan-m__ecc/skill/ck` | Persistent per-project memory for Claude Code. Auto-loads project context on session start, tracks sessions with git activity, an… | 53 |
| `affaan-m__ecc/skill/codebase-onboarding` | Analyze an unfamiliar codebase and generate a structured onboarding guide with architecture map, key entry points, conventions, a… | 8 |
| `affaan-m__ecc/skill/config-gc` | Garbage collection for your Claude Code configuration. Periodically scans ~/.claude (skills, memory, hooks, permissions, MCP serv… | 8 |
| `affaan-m__ecc/skill/configure-ecc` | Guide ECC installation, update, or reconfiguration from inside Claude Code, Codex, or Kimi while respecting each harness's real p… | 8 |
| `affaan-m__ecc/skill/context-budget` | Audits Claude Code context window consumption across agents, skills, MCP servers, and rules. Identifies bloat, redundant componen… | 6 |
| `affaan-m__ecc/skill/continuous-learning` | [OBSOLETO - usar continuous-learning-v2] Extractor de skill por hook Stop v1 heredado. v2 es un superconjunto estricto con aprend… | 5 |
| `affaan-m__ecc/skill/cost-tracking` | Track and report Claude Code token usage, spending, and budgets from the local ECC cost-tracker metrics log. Use when the user as… | 4 |
| `affaan-m__ecc/skill/delivery-gate` | Stop hook that blocks Claude from finishing until quality checks pass. Detects rationalization patterns (surface text heuristics)… | 13 |
| `affaan-m__ecc/skill/dmux-workflows` | Multi-agent orchestration using dmux (tmux pane manager for AI agents). Patterns for parallel agent workflows across Claude Code,… | 5 |
| `affaan-m__ecc/skill/eval-harness` | Formal evaluation framework for Claude Code sessions implementing eval-driven development (EDD) principles | 6 |
| `affaan-m__ecc/skill/gan-style-harness` | GAN-inspired Generator-Evaluator agent harness for building high-quality applications autonomously. Based on Anthropic's March 20… | 12 |
| `affaan-m__ecc/skill/healthcare-eval-harness` | Patient safety evaluation harness for healthcare application deployments. Automated test suites for CDSS accuracy, PHI exposure, … | 8 |
| `affaan-m__ecc/skill/hookify-rules` | This skill should be used when the user asks to create a hookify rule, write a hook rule, configure hookify, add a hookify rule, … | 3 |
| `affaan-m__ecc/skill/iterative-retrieval` | Pattern for progressively refining context retrieval to solve the subagent context problem | 7 |
| `affaan-m__ecc/skill/laravel-plugin-discovery` | Discover and evaluate Laravel packages via LaraPlugins.io MCP. Use when the user wants to find plugins, check package health, or … | 6 |
| `affaan-m__ecc/skill/security-scan` | Scan your Claude Code configuration (.claude/ directory) for security vulnerabilities, misconfigurations, and injection risks usi… | 4 |
| `affaan-m__ecc/skill/skill-stocktake` | Use when auditing Claude skills and commands for quality. Supports Quick Scan (changed skills only) and Full Stocktake modes with… | 18 |
| `affaan-m__ecc/skill/verification-loop` | A comprehensive verification system for Claude Code sessions. | 3 |
| `affaan-m__ecc/skill/workspace-surface-audit` | Audit the active repo, MCP servers, plugins, connectors, env surfaces, and harness setup, then recommend the highest-value ECC-na… | 5 |
| `AgriciDaniel__claude-seo/skill/seo-audit` | Full website SEO audit with parallel subagent delegation. Crawls up to 500 pages, detects business type, delegates to up to 15 sp… | 8 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | > Live SEO data via DataForSEO MCP server: SERP analysis, keyword research (volume, difficulty, intent, trends), backlink profile… | 23 |
| `anthropics__skills/skill/skill-creator` | A skill for creating new skills and iteratively improving them. | 225 |
| `Egonex-AI__Understand-Anything/skill/understand-diff` | Analyze the current code changes against the knowledge graph in the project's data directory (.ua/knowledge-graph.json, or the le… | 6 |
| `Egonex-AI__Understand-Anything/skill/understand-explain` | Use when you need a deep-dive explanation of a specific file, function, or module in the codebase | 5 |
| `Egonex-AI__Understand-Anything/skill/understand-onboard` | Generate a comprehensive onboarding guide from the project's knowledge graph. | 5 |

