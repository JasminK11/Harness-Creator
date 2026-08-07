# Domäne: meta

138 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (20)

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
| `Egonex-AI__Understand-Anything/agent/article-analyzer` | / Analyzes markdown files using pre-parsed structural data and LLM inference to extract knowledge graph nodes and edges (entities… | 4 |
| `Egonex-AI__Understand-Anything/agent/assemble-reviewer` | / Reviews the output of merge-batch-graphs.py for semantic issues the script cannot catch. Recovers dropped nodes/edges and fills… | 5 |
| `Egonex-AI__Understand-Anything/agent/design-analyzer` | / Analyzes Figma structural nodes (pages, screens, components, instances, tokens) from a deterministic manifest and adds semantic… | 3 |
| `Egonex-AI__Understand-Anything/agent/domain-analyzer` | / Analyzes codebases to extract business domain knowledge — domains, business flows, and process steps. Produces a domain-graph.j… | 6 |
| `Egonex-AI__Understand-Anything/agent/file-analyzer` | / Analyzes batches of source files to produce knowledge graph nodes and edges. Extracts file structure, functions, classes, and r… | 33 |
| `Egonex-AI__Understand-Anything/agent/graph-reviewer` | / Validates knowledge graphs for correctness, completeness, and quality. Runs systematic checks and renders approval or rejection… | 12 |
| `Egonex-AI__Understand-Anything/agent/knowledge-graph-guide` | / Use this agent when users need help understanding, querying, or working with an Understand-Anything knowledge graph. Guides use… | 5 |
| `Egonex-AI__Understand-Anything/agent/project-scanner` | / Scans a codebase directory to produce a structured inventory of all project files, detected languages, frameworks, import maps,… | 17 |
| `Egonex-AI__Understand-Anything/agent/tour-builder` | / Designs guided learning tours through codebases, creating 5-15 pedagogical steps that teach project architecture and key concep… | 21 |
| `msitarzewski__agency-agents/agent/wordpress-performance-engineer` | Expert WordPress performance engineer specializing in Core Web Vitals, object caching (Redis/Memcached), page caching, database a… | 24 |

## command (7)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/cost-report` | Generate a local Claude Code cost report from the ECC cost-tracker metrics log. | 4 |
| `affaan-m__ecc/command/devfleet` | Claude DevFleet を使って並列 Claude Code エージェントをオーケストレーションします — 自然言語でプロジェクトを計画し、隔離されたワークツリーにエージェントをディスパッチし、進捗を監視し、構造化レポートを読み取ります。 | 5 |
| `affaan-m__ecc/command/harness-audit` | Run a deterministic repository harness audit and return a prioritized scorecard. | 3 |
| `affaan-m__ecc/command/orch-build-mvp` | Orchestrate bootstrapping a working MVP from a design/spec doc — ingest, slice, scaffold, TDD, review, gated commit (reuses the G… | 1 |
| `affaan-m__ecc/command/react-review` | Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, … | 6 |
| `affaan-m__ecc/command/security-scan` | Run AgentShield against agent, hook, MCP, permission, and secret surfaces. | 3 |
| `affaan-m__ecc/command/sessions` | Manage Claude Code session history, aliases, and session metadata. | 14 |

## hook (69)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/adapter` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/auto-tmux-dev` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/bash-hook-dispatcher` | !/usr/bin/env node | 6 |
| `affaan-m__ecc/hook/bash-hook-dispatcher-test` | A pass-through command (no sub-hook adds context) must NOT echo the | 6 |
| `affaan-m__ecc/hook/block-no-verify` | !/usr/bin/env node | 14 |
| `affaan-m__ecc/hook/check-console-log` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/check-hook-enabled` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/check-hook-enabled-test` | Remove potentially interfering env vars unless explicitly set | 3 |
| `affaan-m__ecc/hook/codex-hooks` | — | 2 |
| `affaan-m__ecc/hook/config-protection` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/continuous-learning-observe-runner-test` | — | 7 |
| `affaan-m__ecc/hook/cost-tracker` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/cost-tracker-test` | 1. Passes through input on stdout | 14 |
| `affaan-m__ecc/hook/cursor-session-env` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/design-quality-check` | !/usr/bin/env node | 4 |
| `affaan-m__ecc/hook/design-quality-check-test` | — | 3 |
| `affaan-m__ecc/hook/desktop-notify` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/doc-file-warning` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/ecc-context-monitor` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/ecc-metrics-bridge` | !/usr/bin/env node | 10 |
| `affaan-m__ecc/hook/ecc-statusline` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/evaluate-session` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/gateguard-fact-force` | !/usr/bin/env node | 40 |
| `affaan-m__ecc/hook/governance-capture` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/governance-capture-test` | ── detectSecrets ────────────────────────────────────────── | 14 |
| `affaan-m__ecc/hook/hook-flags-test` | Import the module | 20 |
| `affaan-m__ecc/hook/hooks-test` | Fall back to common Git Bash path shapes when cygpath is unavailable. | 271 |
| `affaan-m__ecc/hook/insaits-security-monitor` | !/usr/bin/env python3 | 8 |
| `affaan-m__ecc/hook/mcp-health-check` | !/usr/bin/env node | 23 |
| `affaan-m__ecc/hook/observe` | !/usr/bin/env bash | 23 |
| `affaan-m__ecc/hook/observe-entrypoint-allowlist-test` | ignore | 4 |
| `affaan-m__ecc/hook/observe-signal-counter-race-test` | ignore cleanup errors | 9 |
| `affaan-m__ecc/hook/observe-signal-timeout-test` | Extract each `_clv2_bail` handler body: the `def` line plus the indented lines | 7 |
| `affaan-m__ecc/hook/observe-subdirectory-detection-test` | — | 8 |
| `affaan-m__ecc/hook/plan-canvas-sessions-hook-test` | — | 3 |
| `affaan-m__ecc/hook/plugin-hook-bootstrap` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/plugin-hook-bootstrap-test` | Windows-only: PowerShell preference and .sh fallback behaviour. | 12 |
| `affaan-m__ecc/hook/post-bash-dispatcher` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/post-edit-accumulator` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/post-edit-console-warn` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/post-edit-format` | !/usr/bin/env node | 4 |
| `affaan-m__ecc/hook/post-edit-typecheck` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/posttooluse-dispatcher` | !/usr/bin/env node | 10 |
| `affaan-m__ecc/hook/pre-bash-commit-quality` | !/usr/bin/env node | 16 |
| `affaan-m__ecc/hook/pre-bash-commit-quality-test` | Working tree diverges after staging; hook should still inspect staged content. | 16 |
| `affaan-m__ecc/hook/pre-bash-dev-server-block-test` | --- Blocking tests (non-Windows only) --- | 10 |
| `affaan-m__ecc/hook/pre-bash-dispatcher` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/pre-compact-test` | Reader built from a path -> content map (returns null for unknown/unreadable). | 5 |
| `affaan-m__ecc/hook/pre-write-doc-warn` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/quality-gate` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/run-with-flags` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/run-with-flags-truncation-test` | JSON document that exceeds MAX_STDIN so the runner's stdin cap trips. | 6 |
| `affaan-m__ecc/hook/session-activity-tracker` | !/usr/bin/env node | 16 |
| `affaan-m__ecc/hook/session-activity-tracker-test` | — | 22 |
| `affaan-m__ecc/hook/session-end-marker` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/session-end-test` | Regression: a user message containing $-sequences ($&, $$, $`, $') must be | 4 |
| `affaan-m__ecc/hook/session-start-bootstrap` | !/usr/bin/env node | 3 |
| `affaan-m__ecc/hook/stop-format-typecheck` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/stop-hooks-stdout-test` | All registered Stop hooks (hooks/hooks.json). | 11 |
| `affaan-m__ecc/hook/subagent-start` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/subagent-stop` | !/usr/bin/env node | 1 |
| `AgriciDaniel__claude-seo/hook/hooks` | — | 1 |
| `AgriciDaniel__claude-seo/hook/run-python-hook` | !/usr/bin/env node | 2 |
| `AgriciDaniel__claude-seo/hook/validate-schema` | !/usr/bin/env python3 | 6 |
| `Egonex-AI__Understand-Anything/hook/auto-update-prompt` | Auto-Update Knowledge Graph (Internal — Hook-Triggered) | 16 |
| `Egonex-AI__Understand-Anything/hook/hooks` | — | 1 |
| `Egonex-AI__Understand-Anything/hook/post-tool-use-auto-update` | — | 2 |
| `Egonex-AI__Understand-Anything/hook/useismobile` | — | 1 |
| `Egonex-AI__Understand-Anything/hook/usekeyboardshortcuts` | Prevent shortcuts from firing when typing in input fields | 3 |

## mcp (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/mcp/mcp` | MCP-Server: chrome-devtools | 1 |
| `mvanhorn__last30days-skill/mcp/manifest` | MCP-Konfiguration | 5 |
| `nextlevelbuilder__ui-ux-pro-max-skill/mcp/mcp` | MCP-Server: playwright, chrome-devtools, shadcn | 1 |

## plugin (6)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/plugin/ecc` | Harness-native ECC plugin for engineering teams - 67 agents, 282 skills, 94 legacy command shims, reusable hooks, rules, MCP conv… | 49642 |
| `AgriciDaniel__claude-seo/plugin/claude-seo` | Comprehensive SEO analysis plugin for Claude Code. 25 sub-skills (21 core + 1 orchestrator + 1 framework + 2 extension mirrors) a… | 4119 |
| `Egonex-AI__Understand-Anything/plugin/understand-anything` | AI-powered codebase understanding — analyze, visualize, and explain any project | 32102 |
| `mattpocock__skills/plugin/mattpocock-skills` | Matt Pocock's agent skills for real engineering — grilling, spec/ticket flows, TDD, code review, domain modelling and more. Plug-… | 650 |
| `mvanhorn__last30days-skill/plugin/last30days` | Research any topic across Reddit, X, YouTube, TikTok, Instagram, Hacker News, Polymarket, GitHub, and 5+ more sources. AI agent s… | 30695 |
| `nextlevelbuilder__ui-ux-pro-max-skill/plugin/ui-ux-pro-max` | UI/UX design intelligence. Searchable local database with 84 styles, 192 palettes, 74 font pairings, 25 charts, and 22 stacks (Re… | 15696 |

## skill (33)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/agent-eval` | カスタムタスクでコーディングエージェント（Claude Code、Aider、Codex など）をヘッドツーヘッドで比較し、合格率、コスト、時間、一貫性のメトリクスを測定します | 6 |
| `affaan-m__ecc/skill/agent-harness-construction` | AI エージェントのアクション空間、ツール定義、観測フォーマットを設計・最適化して完了率を向上させます。 | 3 |
| `affaan-m__ecc/skill/agentic-os` | Claude Code 上に永続的なマルチエージェントオペレーティングシステムを構築します。カーネルアーキテクチャ、スペシャリストエージェント、スラッシュコマンド、ファイルベースのメモリ、スケジュールされた自動化、外部データベースなしの状態管理をカバーします。 | 17 |
| `affaan-m__ecc/skill/autonomous-agent-harness` | Claude Codeを永続的なメモリ、スケジュール済み操作、コンピュータ使用、タスクキューイングを備えた完全自動エージェントシステムに変換します。スタンドアロンエージェントフレームワーク（Hermes、AutoGPT）を、Claude Codeのネイティブ… | 7 |
| `affaan-m__ecc/skill/autonomous-loops` | Patterns and architectures for autonomous Claude Code loops — from simple sequential pipelines to RFC-driven multi-agent DAG syst… | 24 |
| `affaan-m__ecc/skill/ck` | Claude Codeの永続的なプロジェクト単位のメモリ。セッション開始時にプロジェクトコンテキストを自動読み込み、gitアクティビティでセッションを追跡し、ネイティブメモリに書き込みます。コマンドは決定的なNode.jsスクリプトを実行します — 動作はモ… | 4 |
| `affaan-m__ecc/skill/codebase-onboarding` | 不慣れなコードベースを分析し、アーキテクチャマップ、主要なエントリポイント、規約、スターターCLAUDE.mdを含む構造化オンボーディングガイドを生成します。新しいプロジェクトに参加するか、リポでClaude Codeを初めてセットアップする場合に使用します。 | 2 |
| `affaan-m__ecc/skill/config-gc` | Garbage collection for your Claude Code configuration. Periodically scans ~/.claude (skills, memory, hooks, permissions, MCP serv… | 8 |
| `affaan-m__ecc/skill/configure-ecc` | Claude Code、Codex、Kimi 内で ECC のインストール、更新、再設定を案内し、各ハーネスが実際に備えるプラグイン、スコープ、フック機能を守ります。 | 9 |
| `affaan-m__ecc/skill/context-budget` | エージェント、スキル、MCPサーバー、ルールにわたってClaude Codeのコンテキストウィンドウ消費を監査します。肥大化、冗長なコンポーネントを特定し、優先順位付けされたトークン節約の推奨事項を生成します。 | 7 |
| `affaan-m__ecc/skill/continuous-learning` | [OBSOLETO - usar continuous-learning-v2] Extractor de skill por hook Stop v1 heredado. v2 es un superconjunto estricto con aprend… | 5 |
| `affaan-m__ecc/skill/cost-tracking` | ローカルのコスト追跡データベースからClaude Codeのトークン使用量、支出、予算を追跡・レポートします。コスト、支出、使用量、トークン、予算、またはプロジェクト、ツール、セッション、日付によるコスト内訳について質問する場合に使用します。 | 6 |
| `affaan-m__ecc/skill/delivery-gate` | Stop hook that blocks Claude from finishing until quality checks pass. Detects rationalization patterns (surface text heuristics)… | 13 |
| `affaan-m__ecc/skill/dmux-workflows` | Multi-agent orchestration using dmux (tmux pane manager for AI agents). Patterns for parallel agent workflows across Claude Code,… | 5 |
| `affaan-m__ecc/skill/eval-harness` | Formal evaluation framework for Claude Code sessions implementing eval-driven development (EDD) principles | 6 |
| `affaan-m__ecc/skill/gan-style-harness` | GAN（生成的敵対ネットワーク）スタイルの評価ハーネス、画像生成パターン、および品質メトリクス。 | 12 |
| `affaan-m__ecc/skill/healthcare-eval-harness` | ヘルスケアAIモデル評価ハーネス、臨床メトリクス、およびレギュレーション遵守の検証。 | 7 |
| `affaan-m__ecc/skill/laravel-plugin-discovery` | Laravel プラグイン検出、パッケージ管理、依存関係解決、およびサービスプロバイダ統合。 | 6 |
| `affaan-m__ecc/skill/security-scan` | AgentShield を使用して、Claude Code の設定（.claude/ ディレクトリ）のセキュリティ脆弱性、設定ミス、インジェクションリスクをスキャンします。CLAUDE.md、settings.json、MCP サーバー、フック、エージェント… | 6 |
| `affaan-m__ecc/skill/verification-loop` | A comprehensive verification system for Claude Code sessions. | 3 |
| `affaan-m__ecc/skill/workspace-surface-audit` | アクティブなリポジトリ、MCPサーバー、プラグイン、コネクター、環境サーフェス、ツールのセットアップを監査し、最も価値の高いECCネイティブスキル、フック、エージェント、オペレーターワークフローを推奨する。ユーザーがClaude Codeのセットアップを支援… | 7 |
| `AgriciDaniel__claude-seo/skill/seo-audit` | Full website SEO audit with parallel subagent delegation. Crawls up to 500 pages, detects business type, delegates to up to 15 sp… | 8 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | > Live SEO data via DataForSEO MCP server: SERP analysis, keyword research (volume, difficulty, intent, trends), backlink profile… | 23 |
| `anthropics__skills/skill/skill-creator` | A skill for creating new skills and iteratively improving them. | 225 |
| `Egonex-AI__Understand-Anything/skill/understand` | Analyze a codebase to produce an interactive knowledge graph for understanding architecture, components, and relationships | 386 |
| `Egonex-AI__Understand-Anything/skill/understand-chat` | Use when you need to ask questions about a codebase or understand code using a knowledge graph | 5 |
| `Egonex-AI__Understand-Anything/skill/understand-dashboard` | Launch the interactive web dashboard to visualize a codebase's knowledge graph | 7 |
| `Egonex-AI__Understand-Anything/skill/understand-diff` | Analyze the current code changes against the knowledge graph in the project's data directory (.ua/knowledge-graph.json, or the le… | 6 |
| `Egonex-AI__Understand-Anything/skill/understand-domain` | Extract business domain knowledge from a codebase and generate an interactive domain flow graph. Works standalone (lightweight sc… | 26 |
| `Egonex-AI__Understand-Anything/skill/understand-explain` | Use when you need a deep-dive explanation of a specific file, function, or module in the codebase | 5 |
| `Egonex-AI__Understand-Anything/skill/understand-figma` | Analyze a Figma file via the Figma REST API and generate an interactive design knowledge graph (pages, screens, components, compo… | 10 |
| `Egonex-AI__Understand-Anything/skill/understand-knowledge` | Analyze a Karpathy-pattern LLM wiki knowledge base and generate an interactive knowledge graph with entity extraction, implicit r… | 44 |
| `Egonex-AI__Understand-Anything/skill/understand-onboard` | Generate a comprehensive onboarding guide from the project's knowledge graph. | 5 |

