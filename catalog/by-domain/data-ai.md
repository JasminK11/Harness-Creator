# Domäne: data-ai

144 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (50)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/agent-evaluator` | Evaluates agent output against 5-axis quality rubric (accuracy, completeness, clarity, actionability, conciseness). Use after any… | 8 |
| `affaan-m__ecc/agent/conversation-analyzer` | Use this agent when analyzing conversation transcripts to find behaviors worth preventing with hooks. Triggered by /hookify witho… | 2 |
| `affaan-m__ecc/agent/e2e-runner` | End-to-end testing specialist using Vercel Agent Browser (preferred) with Playwright fallback. Use PROACTIVELY for generating, ma… | 4 |
| `affaan-m__ecc/agent/enrichment-agent` | Pulls detailed profile, company, and activity data for qualified leads. Enriches prospects with recent news, funding data, conten… | 2 |
| `affaan-m__ecc/agent/gan-evaluator` | GAN Harness — Evaluator agent. Tests the live running application via Playwright, scores against rubric, and provides actionable … | 8 |
| `affaan-m__ecc/agent/gan-generator` | GAN Harness — Generator agent. Implements features according to the spec, reads evaluator feedback, and iterates until quality th… | 6 |
| `affaan-m__ecc/agent/gan-planner` | GAN Harness — Planner agent. Expands a one-line prompt into a full product specification with features, sprints, evaluation crite… | 4 |
| `affaan-m__ecc/agent/harness-optimizer` | Analyze and improve the local agent harness configuration for reliability, cost, and throughput. | 1 |
| `affaan-m__ecc/agent/loop-operator` | Operate autonomous agent loops, monitor progress, and intervene safely when loops stall. | 1 |
| `affaan-m__ecc/agent/marketing-agent` | Marketing strategist and copywriter for campaign planning, audience research, positioning, copy creation, and content review. Cov… | 7 |
| `affaan-m__ecc/agent/mle-reviewer` | Production machine-learning engineering reviewer for data contracts, feature pipelines, training reproducibility, offline/online … | 5 |
| `affaan-m__ecc/agent/pytorch-build-resolver` | PyTorch runtime, CUDA, and training error resolution specialist. Fixes tensor shape mismatches, device errors, gradient issues, D… | 5 |
| `AgriciDaniel__claude-seo/agent/seo-drift` | > SEO drift analysis agent. Captures baselines of SEO-critical page elements and compares against stored snapshots to detect regr… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-flow` | FLOW framework prompt analyst. Reads the target URL, selects relevant FLOW stage prompts, applies them, and returns structured ou… | 2 |
| `Egonex-AI__Understand-Anything/agent/article-analyzer` | / Analyzes markdown files using pre-parsed structural data and LLM inference to extract knowledge graph nodes and edges (entities… | 4 |
| `Egonex-AI__Understand-Anything/agent/file-analyzer` | / Analyzes batches of source files to produce knowledge graph nodes and edges. Extracts file structure, functions, classes, and r… | 33 |
| `Egonex-AI__Understand-Anything/agent/knowledge-graph-guide` | / Use this agent when users need help understanding, querying, or working with an Understand-Anything knowledge graph. Guides use… | 5 |
| `Graphify-Labs__graphify/agent/graphify` | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ e… | 62 |
| `msitarzewski__agency-agents/agent/accounts-payable-agent` | Autonomous payment processing specialist that executes vendor payments, contractor invoices, and recurring bills across any payme… | 7 |
| `msitarzewski__agency-agents/agent/aeo-foundations-architect` | Expert in AI Engine Optimization infrastructure — implements llms.txt, AI-aware robots.txt, token-budgeted content, structured Ma… | 15 |
| `msitarzewski__agency-agents/agent/agentic-identity-trust-architect` | Designs identity, authentication, and trust verification systems for autonomous AI agents operating in multi-agent environments. … | 18 |
| `msitarzewski__agency-agents/agent/aging-parent-care-companion` | Compassionate, HIPAA-aligned care coordination and decision-support agent for family caregivers managing an aging parent's appoin… | 25 |
| `msitarzewski__agency-agents/agent/ai-engineer` | Expert AI/ML engineer specializing in machine learning model development, deployment, and integration into production systems. Fo… | 7 |
| `msitarzewski__agency-agents/agent/ai-generated-code-security-auditor` | Security reviewer for AI-generated and vibe-coded apps — hunts the hardcoded secrets, broken row-level security, and prompt-injec… | 17 |
| `msitarzewski__agency-agents/agent/business-strategist` | Senior management consulting specialist for competitive analysis, market entry strategy, business model design, growth planning, … | 25 |
| `msitarzewski__agency-agents/agent/clinical-evidence-agent` | Evidence standards and clinical credibility framework for AI agents operating in healthcare contexts. Defines how to distinguish … | 10 |
| `msitarzewski__agency-agents/agent/data-consolidation-agent` | AI agent that consolidates extracted sales data into live reporting dashboards with territory, rep, and pipeline summaries | 2 |
| `msitarzewski__agency-agents/agent/geoai-ml-engineer` | Geospatial machine learning specialist who builds models for feature extraction, object detection, image segmentation, and land c… | 5 |
| `msitarzewski__agency-agents/agent/geoprocessing-specialist` | ArcPy and Python toolbox expert who automates spatial workflows — builds .pyt toolboxes, Model Builder processes, batch geoproces… | 5 |
| `msitarzewski__agency-agents/agent/identity-graph-operator` | Operates a shared identity graph that multiple AI agents resolve against. Ensures every agent in a multi-agent system gets the sa… | 14 |
| `msitarzewski__agency-agents/agent/image-prompt-engineer` | Expert photography prompt engineer specializing in crafting detailed, evocative prompts for AI image generation. Masters the art … | 11 |
| `msitarzewski__agency-agents/agent/legal-billing-time-tracking` | Comprehensive legal billing and time tracking specialist for accurate time capture, invoice generation, billing narrative writing… | 27 |
| `msitarzewski__agency-agents/agent/llm-post-training-engineer` | Evidence-driven owner for SFT, preference optimization, RLHF/RLVR, MoE post-training, and the release gates that turn a checkpoin… | 11 |
| `msitarzewski__agency-agents/agent/mcp-builder` | Expert Model Context Protocol developer who designs, builds, and tests MCP servers that extend AI agent capabilities with custom … | 12 |
| `msitarzewski__agency-agents/agent/model-qa-specialist` | Independent model QA expert who audits ML and statistical models end-to-end - from documentation review and data reconstruction t… | 20 |
| `msitarzewski__agency-agents/agent/multi-agent-systems-architect` | Systems architect specializing in the design, coordination, and governance of multi-agent AI pipelines — covering topology select… | 29 |
| `msitarzewski__agency-agents/agent/prompt-engineer` | Specialist in crafting, testing, and systematically optimizing prompts for LLMs — turning vague instructions into reliable, produ… | 9 |
| `msitarzewski__agency-agents/agent/rag-pipeline-engineer` | Production RAG specialist focused on chunking strategy, retrieval quality, hybrid search, re-ranking, and eval-driven iteration. … | 18 |
| `msitarzewski__agency-agents/agent/real-estate-buyer-seller` | Comprehensive real estate agent assistant for buyer representation, seller representation, listing management, offer negotiation,… | 30 |
| `msitarzewski__agency-agents/agent/report-distribution-agent` | AI agent that automates distribution of consolidated sales reports to representatives based on territorial parameters | 3 |
| `msitarzewski__agency-agents/agent/roblox-systems-scripter` | Roblox platform engineering specialist - Masters Luau, the client-server security model, RemoteEvents/RemoteFunctions, DataStore,… | 15 |
| `msitarzewski__agency-agents/agent/sales-data-extraction-agent` | AI agent specialized in monitoring Excel files and extracting key sales metrics (MTD, YTD, Year End) for internal live reporting | 3 |
| `msitarzewski__agency-agents/agent/salesforce-architect` | Solution architecture for Salesforce platform — multi-cloud design, integration patterns, governor limits, deployment strategy, a… | 10 |
| `msitarzewski__agency-agents/agent/search-relevance-engineer` | Expert search engineer for Elasticsearch and OpenSearch — index and analyzer design, BM25 query tuning, hybrid lexical+vector ret… | 15 |
| `msitarzewski__agency-agents/agent/security-architect` | Expert security architect specializing in threat modeling, secure-by-design architecture, trust-boundary analysis, defense-in-dep… | 18 |
| `msitarzewski__agency-agents/agent/sovereign-health-systems-agent` | Government health mandate engagement framework for AI agents operating at the intersection of national health infrastructure, UHC… | 15 |
| `msitarzewski__agency-agents/agent/statistician` | Expert in quantitative research methodology, experimental design, and statistical inference — pressure-tests claims, designs soun… | 11 |
| `msitarzewski__agency-agents/agent/strategy-duel-agent` | Conducts live strategy duels using game theory and the 36 Chinese stratagems | 6 |
| `msitarzewski__agency-agents/agent/webassembly-engineer` | Expert WebAssembly engineer — compiling Rust/C++/Go to Wasm, JS interop and the boundary marshalling cost, WASI and server-side r… | 13 |
| `msitarzewski__agency-agents/agent/workflow-architect` | Workflow design specialist who maps complete workflow trees for every system, user journey, and agent interaction — covering happ… | 26 |

## command (20)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/agent-sort` | Legacy slash-entry shim for the agent-sort skill. Prefer the skill directly. | 1 |
| `affaan-m__ecc/command/cpp-build` | Fix C++ build errors, CMake issues, and linker problems incrementally. Invokes the cpp-build-resolver agent for minimal, surgical… | 4 |
| `affaan-m__ecc/command/cpp-review` | Comprehensive C++ code review for memory safety, modern C++ idioms, concurrency, and security. Invokes the cpp-reviewer agent. | 3 |
| `affaan-m__ecc/command/flutter-build` | Fix Dart analyzer errors and Flutter build failures incrementally. Invokes the dart-build-resolver agent for minimal, surgical fi… | 4 |
| `affaan-m__ecc/command/flutter-review` | Review Flutter/Dart code for idiomatic patterns, widget best practices, state management, performance, accessibility, and securit… | 4 |
| `affaan-m__ecc/command/kotlin-build` | Fix Kotlin/Gradle build errors, compiler warnings, and dependency issues incrementally. Invokes the kotlin-build-resolver agent f… | 4 |
| `affaan-m__ecc/command/kotlin-review` | Comprehensive Kotlin code review for idiomatic patterns, null safety, coroutine safety, and security. Invokes the kotlin-reviewer… | 4 |
| `affaan-m__ecc/command/model-route` | Recommend the best model tier for the current task by complexity and budget. | 1 |
| `affaan-m__ecc/command/multi-backend` | Run a backend-focused multi-model workflow for APIs, algorithms, data, and business logic. | 5 |
| `affaan-m__ecc/command/multi-execute` | Execute a multi-model implementation plan while preserving Claude as the only filesystem writer. | 11 |
| `affaan-m__ecc/command/multi-frontend` | Run a frontend-focused multi-model workflow for components, layouts, animation, and UI polish. | 6 |
| `affaan-m__ecc/command/multi-plan` | Create a multi-model implementation plan without modifying production code. | 10 |
| `affaan-m__ecc/command/multi-workflow` | Run a full multi-model development workflow with research, planning, execution, optimization, and review. | 8 |
| `affaan-m__ecc/command/prompt-optimize` | ドラフトプロンプトを分析し、ECC が強化された最適化済みバージョンを出力します。貼り付けてすぐに実行できる状態で出力されます。タスクは実行しません — コンサルティング分析のみを出力します。 | 3 |
| `affaan-m__ecc/command/python-review` | Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer age… | 7 |
| `affaan-m__ecc/command/react-build` | Fix React build failures (Vite, webpack, Next.js, CRA, Parcel, esbuild, Bun) incrementally — JSX/TSX compile errors, hydration mi… | 5 |
| `affaan-m__ecc/command/react-review` | Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, … | 6 |
| `affaan-m__ecc/command/santa-loop` | Adversarial dual-review convergence loop — two independent model reviewers must both approve before code ships. | 6 |
| `affaan-m__ecc/command/security-scan` | Run AgentShield against agent, hook, MCP, permission, and secret surfaces. | 3 |
| `affaan-m__ecc/command/vue-review` | Comprehensive Vue.js code review for Composition API correctness, reactivity, composable patterns, template security, accessibili… | 6 |

## hook (12)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/before-submit-prompt` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/config-protection` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/cost-tracker` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/cursor-session-env` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/ecc-context-monitor` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/ecc-statusline` | !/usr/bin/env node | 5 |
| `affaan-m__ecc/hook/insaits-security-monitor` | !/usr/bin/env python3 | 8 |
| `affaan-m__ecc/hook/plan-canvas-sessions` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/plugin-hook-bootstrap` | !/usr/bin/env node | 8 |
| `affaan-m__ecc/hook/subagent-start` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/subagent-stop` | !/usr/bin/env node | 1 |
| `Egonex-AI__Understand-Anything/hook/auto-update-prompt` | Auto-Update Knowledge Graph (Internal — Hook-Triggered) | 16 |

## plugin (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/plugin/ecc` | Harness-native ECC plugin for engineering teams - 67 agents, 282 skills, 94 legacy command shims, reusable hooks, rules, MCP conv… | 49642 |
| `mattpocock__skills/plugin/mattpocock-skills` | Matt Pocock's agent skills for real engineering — grilling, spec/ticket flows, TDD, code review, domain modelling and more. Plug-… | 650 |
| `mvanhorn__last30days-skill/plugin/last30days` | Research any topic across Reddit, X, YouTube, TikTok, Instagram, Hacker News, Polymarket, GitHub, and 5+ more sources. AI agent s… | 30695 |

## skill (59)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/agent-architecture-audit` | エージェントおよび LLM アプリケーション向けのフルスタック診断。12 層のエージェントスタックにおけるラッパーリグレッション、メモリ汚染、ツール規律の失敗、隠れた修復ループ、レンダリング破損を監査します。重要度順の発見事項とコードファーストの修正を生成し… | 13 |
| `affaan-m__ecc/skill/agent-eval` | カスタムタスクでコーディングエージェント（Claude Code、Aider、Codex など）をヘッドツーヘッドで比較し、合格率、コスト、時間、一貫性のメトリクスを測定します | 6 |
| `affaan-m__ecc/skill/agent-harness-construction` | AI エージェントのアクション空間、ツール定義、観測フォーマットを設計・最適化して完了率を向上させます。 | 3 |
| `affaan-m__ecc/skill/agent-introspection-debugging` | Structured self-debugging workflow for AI agent failures using capture, diagnosis, contained recovery, and introspection reports. | 6 |
| `affaan-m__ecc/skill/agent-payment-x402` | タスクごとのバジェット、支出コントロール、ノンカストディアルウォレットを備えた x402 決済実行を AI エージェントに追加します。agentwallet-sdk を通じて Base をサポートし、OKX Payments / OKX エージェント決済プロ… | 13 |
| `affaan-m__ecc/skill/agent-self-evaluation` | Use after completing any non-trivial task. The agent self-rates its output on 5 axes — accuracy, completeness, clarity, actionabi… | 41 |
| `affaan-m__ecc/skill/agent-sort` | Build an evidence-backed ECC install plan for a specific repo by sorting skills, commands, rules, hooks, and extras into DAILY vs… | 6 |
| `affaan-m__ecc/skill/agentic-engineering` | > Operate as an agentic engineer using eval-first execution, decomposition, and cost-aware model routing. Use when AI agents perf… | 4 |
| `affaan-m__ecc/skill/autonomous-agent-harness` | Claude Codeを永続的なメモリ、スケジュール済み操作、コンピュータ使用、タスクキューイングを備えた完全自動エージェントシステムに変換します。スタンドアロンエージェントフレームワーク（Hermes、AutoGPT）を、Claude Codeのネイティブ… | 7 |
| `affaan-m__ecc/skill/autonomous-loops` | Patterns and architectures for autonomous Claude Code loops — from simple sequential pipelines to RFC-driven multi-agent DAG syst… | 24 |
| `affaan-m__ecc/skill/blender-motion-state-inspection` | Use this skill when inspecting Blender characters, rigs, poses, animation retargeting, ground contact, facing direction, or model… | 8 |
| `affaan-m__ecc/skill/continuous-agent-loop` | 品質ゲート、評価、リカバリーコントロールを備えた継続的な自律エージェントループのパターン。 | 1 |
| `affaan-m__ecc/skill/cost-aware-llm-pipeline` | LLM APIの使用量のコスト最適化パターン — タスクの複雑さによるモデルルーティング、予算追跡、リトライロジック、プロンプトキャッシング。 | 7 |
| `affaan-m__ecc/skill/data-scraper-agent` | 任意のパブリックソース（ジョブボード、価格、ニュース、GitHub、スポーツなど）用の完全自動化されたAI搭載データ収集エージェントを構築します。スケジュールでスクレイプし、無料LLM（Gemini Flash）でデータを豊かにし、Notion/Sheets… | 3 |
| `affaan-m__ecc/skill/dmux-workflows` | Multi-agent orchestration using dmux (tmux pane manager for AI agents). Patterns for parallel agent workflows across Claude Code,… | 5 |
| `affaan-m__ecc/skill/dynamic-workflow-mode` | Design task-local harnesses, eval gates, and reusable skill extraction for Claude dynamic workflow mode and other adaptive agent … | 5 |
| `affaan-m__ecc/skill/e2e-testing` | Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strateg… | 8 |
| `affaan-m__ecc/skill/ecc-recipes` | Map a described workflow to the right ECC command-GROUP with run-order and stop condition, and browse all command-group recipe fa… | 6 |
| `affaan-m__ecc/skill/enterprise-agent-ops` | オブザーバビリティ、セキュリティ境界、およびライフサイクル管理を備えた長寿命エージェントワークロードを運用します。 | 1 |
| `affaan-m__ecc/skill/gateguard` | API、エージェント、およびLLMエンドポイントのアクセス制御と認可パターン。 | 5 |
| `affaan-m__ecc/skill/inherit-legacy-style` | Legacy-project style inheritance skill. Use when the user types /inherit-legacy-style, or when onboarding an AI coding agent onto… | 8 |
| `affaan-m__ecc/skill/intent-driven-development` | Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside imp… | 17 |
| `affaan-m__ecc/skill/ito-data-atlas-agent` | Design background Data Atlas style agents for Itô basket research, market discovery, parameter drafting, and human-in-the-loop ed… | 2 |
| `affaan-m__ecc/skill/llm-trading-agent-security` | 日本語翻訳：このファイルは llm-trading-agent-security 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/loop-design-check` | Design a goal-oriented agent loop, and review it for the ways loops go wrong — spinning and burning tokens, Goodhart-gaming the v… | 12 |
| `affaan-m__ecc/skill/ml-adoption-playbook` | End-to-end methodology for AI agents and software engineers to add machine learning algorithms to existing non-ML codebases. Cove… | 4 |
| `affaan-m__ecc/skill/mle-workflow` | Production machine-learning engineering workflow for data contracts, reproducible training, model evaluation, deployment, monitor… | 22 |
| `affaan-m__ecc/skill/openclaw-persona-forge` | 为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、… | 12 |
| `affaan-m__ecc/skill/orch-add-feature` | Orchestrate building a brand-new feature end to end — research, plan, TDD implementation, review, and gated commit — by delegatin… | 2 |
| `affaan-m__ecc/skill/orch-fix-defect` | Orchestrate fixing a bug — reproduce it as a failing regression test, fix to green, review, and gated commit — by delegating each… | 2 |
| `affaan-m__ecc/skill/orch-pipeline` | Shared orchestration engine for the orch-* skill family. Defines the gated Research-Plan-TDD-Review-Commit pipeline, the size cla… | 6 |
| `affaan-m__ecc/skill/prediction-market-risk-review` | Review prediction-market, basket, oracle, and trading-agent workflows for compliance, safety, data-quality, privacy, and executio… | 2 |
| `affaan-m__ecc/skill/prompt-optimizer` | 日本語翻訳：このファイルは prompt-optimizer 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/pytorch-patterns` | PyTorch deep learning patterns and best practices for building robust, efficient, and reproducible training pipelines, model arch… | 11 |
| `affaan-m__ecc/skill/react-performance` | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/ve… | 18 |
| `affaan-m__ecc/skill/recsys-pipeline-architect` | Design composable recommendation, ranking, and feed pipelines using the six-stage Source→Hydrator→Filter→Scorer→Selector→SideEffe… | 8 |
| `affaan-m__ecc/skill/regex-vs-llm-structured-text` | 構造化テキストの解析に正規表現と大規模言語モデルのどちらを使うかを選択するための意思決定フレームワーク——まず正規表達式から始め、信頼度の低いエッジケースにのみ大規模言語モデルを追加する。 | 8 |
| `affaan-m__ecc/skill/social-publisher` | Agent-driven scheduling and publishing of social media posts across 13 platforms via SocialClaw. Use when the user wants to publi… | 4 |
| `affaan-m__ecc/skill/team-agent-orchestration` | Run team-based orchestration for agent squads using work items, ownership, agent Kanban, merge gates, and control pane handoffs. | 5 |
| `affaan-m__ecc/skill/unified-memory` | Share durable, inspectable context and handoffs between Claude, Codex, Hermes, Cursor, OpenCode, and other agents through the loc… | 6 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | > Live SEO data via DataForSEO MCP server: SERP analysis, keyword research (volume, difficulty, intent, trends), backlink profile… | 23 |
| `AgriciDaniel__claude-seo/skill/seo-geo` | > Optimize content for AI Overviews (formerly SGE), ChatGPT web search, Perplexity, and other AI-powered search experiences. Gene… | 24 |
| `AgriciDaniel__claude-seo/skill/seo-profound` | Profound LLM citation tracker (extension). Time-series brand citation rates across ChatGPT, Perplexity, and other LLMs. Pairs wit… | 2 |
| `anthropics__skills/skill/claude-api` | /- Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token co… | 861 |
| `anthropics__skills/skill/mcp-builder` | Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through … | 122 |
| `Egonex-AI__Understand-Anything/skill/understand` | Analyze a codebase to produce an interactive knowledge graph for understanding architecture, components, and relationships | 386 |
| `Egonex-AI__Understand-Anything/skill/understand-chat` | Use when you need to ask questions about a codebase or understand code using a knowledge graph | 5 |
| `Egonex-AI__Understand-Anything/skill/understand-dashboard` | Launch the interactive web dashboard to visualize a codebase's knowledge graph | 7 |
| `Egonex-AI__Understand-Anything/skill/understand-domain` | Extract business domain knowledge from a codebase and generate an interactive domain flow graph. Works standalone (lightweight sc… | 26 |
| `Egonex-AI__Understand-Anything/skill/understand-figma` | Analyze a Figma file via the Figma REST API and generate an interactive design knowledge graph (pages, screens, components, compo… | 10 |
| `Egonex-AI__Understand-Anything/skill/understand-knowledge` | Analyze a Karpathy-pattern LLM wiki knowledge base and generate an interactive knowledge graph with entity extraction, implicit r… | 44 |
| `mattpocock__skills/skill/claude-handoff` | Hand the current conversation off to a fresh background agent that picks up the work immediately. | 1 |
| `mattpocock__skills/skill/handoff` | Compact the current conversation into a handoff document for another agent to pick up. | 1 |
| `mattpocock__skills/skill/triage` | Move issues and external PRs through a state machine of triage roles — categorise, verify, grill if needed, and write agent-ready… | 19 |
| `mattpocock__skills/skill/wayfinder` | Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on your issue tracker, and… | 12 |
| `multica-ai__multica/skill/multica-creating-agents` | Use when creating, inspecting, or debugging a Multica agent definition via the `multica agent` CLI or POST /api/agents. Not for a… | 32 |
| `multica-ai__multica/skill/multica-mentioning` | Use when an issue comment needs to @mention someone — link to a person, trigger another agent, hand work to a squad, or broadcast… | 28 |
| `multica-ai__multica/skill/multica-runtimes-and-repos` | Use when a Multica runtime or daemon misbehaves: agent not running, task not claimed, runtime offline, workdir or session reuse, … | 7 |
| `usestrix__strix/skill/strix-cloud-api` | Drive the managed Strix platform headlessly through the app.strix.ai REST API — create an API token, register domain/repository a… | 8 |

