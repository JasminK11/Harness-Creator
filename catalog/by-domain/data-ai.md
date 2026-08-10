# Domäne: data-ai

197 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (63)

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
| `affaan-m__ecc/agent/observer` | Background agent that analyzes session observations to detect patterns and create instincts. Uses Haiku for cost-efficiency. v2.1… | 7 |
| `affaan-m__ecc/agent/pytorch-build-resolver` | PyTorch runtime, CUDA, and training error resolution specialist. Fixes tensor shape mismatches, device errors, gradient issues, D… | 5 |
| `AgriciDaniel__claude-seo/agent/seo-drift` | > SEO drift analysis agent. Captures baselines of SEO-critical page elements and compares against stored snapshots to detect regr… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-flow` | FLOW framework prompt analyst. Reads the target URL, selects relevant FLOW stage prompts, applies them, and returns structured ou… | 2 |
| `anthropics__claude-plugins-official/agent/agent-creator` | / Use this agent when the user asks to "create an agent", "generate an agent", "build a new agent", "make me an agent that...", o… | 7 |
| `anthropics__claude-plugins-official/agent/agent-sdk-verifier-py` | Use this agent to verify that a Python Agent SDK application is properly configured, follows SDK best practices and documentation… | 5 |
| `anthropics__claude-plugins-official/agent/agent-sdk-verifier-ts` | Use this agent to verify that a TypeScript Agent SDK application is properly configured, follows SDK best practices and documenta… | 5 |
| `anthropics__claude-plugins-official/agent/claude-security` | The dedicated Claude Security orchestrator. Hand it an unattended job — "fully scan this repository and patch what you find; I un… | 4 |
| `anthropics__claude-plugins-official/agent/comment-analyzer` | Use this agent when you need to analyze code comments for accuracy, completeness, and long-term maintainability. This includes (1… | 5 |
| `anthropics__claude-plugins-official/agent/conversation-analyzer` | Use this agent when analyzing conversation transcripts to find behaviors worth preventing with hooks. Typical triggers include th… | 6 |
| `anthropics__claude-plugins-official/agent/plugin-validator` | / Use this agent when the user asks to "validate my plugin", "check plugin structure", "verify plugin is correct", "validate plug… | 7 |
| `anthropics__claude-plugins-official/agent/pr-test-analyzer` | Use this agent when you need to review a pull request for test coverage quality and completeness. This agent should be invoked af… | 5 |
| `anthropics__claude-plugins-official/agent/scaffolder` | Scaffolds one service of a reimagined system from the approved architecture and spec — project skeleton, domain model, API stubs,… | 2 |
| `anthropics__claude-plugins-official/agent/silent-failure-hunter` | Use this agent when reviewing code changes in a pull request to identify silent failures, inadequate error handling, and inapprop… | 8 |
| `anthropics__claude-plugins-official/agent/skill-reviewer` | / Use this agent when the user has created or modified a skill and needs quality review, asks to "review my skill", "check skill … | 6 |
| `anthropics__claude-plugins-official/agent/type-design-analyzer` | Use this agent when you need expert analysis of type design in your codebase. Specifically use it (1) when introducing a new type… | 5 |
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

## command (22)

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
| `affaan-m__ecc/command/prompt-optimize` | Legacy slash-entry shim for the prompt-optimizer skill. Prefer the skill directly. | 1 |
| `affaan-m__ecc/command/python-review` | Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer age… | 7 |
| `affaan-m__ecc/command/react-build` | Fix React build failures (Vite, webpack, Next.js, CRA, Parcel, esbuild, Bun) incrementally — JSX/TSX compile errors, hydration mi… | 5 |
| `affaan-m__ecc/command/react-review` | Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, … | 6 |
| `affaan-m__ecc/command/santa-loop` | Adversarial dual-review convergence loop — two independent model reviewers must both approve before code ships. | 6 |
| `affaan-m__ecc/command/security-scan` | Run AgentShield against agent, hook, MCP, permission, and secret surfaces. | 3 |
| `affaan-m__ecc/command/vue-review` | Comprehensive Vue.js code review for Composition API correctness, reactivity, composable patterns, template security, accessibili… | 6 |
| `anthropics__claude-plugins-official/command/modernize-reimagine` | Multi-agent greenfield rebuild — extract specs from legacy, design AI-native, scaffold & validate with HITL | 7 |
| `anthropics__claude-plugins-official/command/new-sdk-app` | Create and setup a new Claude Agent SDK application | 8 |

## hook (10)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/config-protection` | ESLint (legacy + v9 flat config, JS/TS/MJS/CJS) | 5 |
| `affaan-m__ecc/hook/cost-tracker` | Approximate per-1M-token billing rates (USD). | 8 |
| `affaan-m__ecc/hook/ecc-context-monitor` | Context warnings (skip if no context data) | 9 |
| `affaan-m__ecc/hook/ecc-statusline` | Write context % back to bridge for context-monitor | 5 |
| `affaan-m__ecc/hook/insaits-security-monitor` | Configure logging to stderr so it does not interfere with stdout protocol | 8 |
| `affaan-m__ecc/hook/pre-compact` | (.*) not (.+): an explicit but empty header (`**Worktree:**` / `**Worktree:**\n`) | 7 |
| `anthropics__claude-plugins-official/hook/ensure-agent-sdk` | Shared state-dir resolver: SECURITY_WARNINGS_STATE_DIR → CLAUDE_CONFIG_DIR/security | 39 |
| `anthropics__claude-plugins-official/hook/extensibility` | ── caps ───────────────────────────────────────────────────────────────────── | 12 |
| `anthropics__claude-plugins-official/hook/llm` | `pip install --target` fallback (ensure_agent_sdk BUILT_TARGET, used | 115 |
| `anthropics__claude-plugins-official/hook/userpromptsubmit` | Add plugin root to Python path for imports | 1 |

## plugin (11)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/plugin/ecc` | Harness-native ECC plugin for engineering teams - 67 agents, 284 skills, 94 legacy command shims, reusable hooks, rules, MCP conv… | 49708 |
| `anthropics__claude-plugins-official/plugin/agent-sdk-dev` | Claude Agent SDK Development Plugin | 36 |
| `anthropics__claude-plugins-official/plugin/claude-security` | Deep vulnerability scanning of your own code, run entirely inside your Claude Code session at a chosen effort tier, with every fi… | 244 |
| `anthropics__claude-plugins-official/plugin/code-simplifier` | Agent that simplifies and refines code for clarity, consistency, and maintainability while preserving functionality | 15 |
| `anthropics__claude-plugins-official/plugin/context7` | Upstash Context7 MCP server for up-to-date documentation lookup. Connects to Context7's hosted remote MCP server (https://mcp.con… | 3 |
| `anthropics__claude-plugins-official/plugin/greptile` | AI code review agent for GitHub and GitLab. View and resolve Greptile's PR review comments directly from Claude Code. | 2 |
| `anthropics__claude-plugins-official/plugin/playground` | Creates interactive HTML playgrounds — self-contained single-file explorers with visual controls, live preview, and prompt output… | 43 |
| `anthropics__claude-plugins-official/plugin/ralph-loop` | Continuous self-referential AI loops for interactive iterative development, implementing the Ralph Wiggum technique. Run Claude i… | 38 |
| `anthropics__claude-plugins-official/plugin/security-guidance` | Security review for Claude-generated code. Pattern-based warnings on edits, LLM-powered diff review on Stop, and an agentic commi… | 421 |
| `mattpocock__skills/plugin/mattpocock-skills` | Matt Pocock's agent skills for real engineering — grilling, spec/ticket flows, TDD, code review, domain modelling and more. Plug-… | 650 |
| `mvanhorn__last30days-skill/plugin/last30days` | Research any topic across Reddit, X, YouTube, TikTok, Instagram, Hacker News, Polymarket, GitHub, and 5+ more sources. AI agent s… | 30710 |

## skill (91)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/agent-architecture-audit` | Full-stack diagnostic for agent and LLM applications. Audits the 12-layer agent stack for wrapper regression, memory pollution, t… | 10 |
| `affaan-m__ecc/skill/agent-eval` | Head-to-head comparison of coding agents (Claude Code, Aider, Codex, etc.) on custom tasks with pass rate, cost, time, and consis… | 4 |
| `affaan-m__ecc/skill/agent-harness-construction` | Design and optimize AI agent action spaces, tool definitions, and observation formatting for higher completion rates. | 2 |
| `affaan-m__ecc/skill/agent-introspection-debugging` | Structured self-debugging workflow for AI agent failures using capture, diagnosis, contained recovery, and introspection reports. | 6 |
| `affaan-m__ecc/skill/agent-payment-x402` | Add x402 payment execution to AI agents with per-task budgets, spending controls, and non-custodial wallets. Supports Base throug… | 10 |
| `affaan-m__ecc/skill/agent-self-evaluation` | Use after completing any non-trivial task. The agent self-rates its output on 5 axes — accuracy, completeness, clarity, actionabi… | 41 |
| `affaan-m__ecc/skill/agent-sort` | Build an evidence-backed ECC install plan for a specific repo by sorting skills, commands, rules, hooks, and extras into DAILY vs… | 6 |
| `affaan-m__ecc/skill/agentic-engineering` | > Operate as an agentic engineer using eval-first execution, decomposition, and cost-aware model routing. Use when AI agents perf… | 4 |
| `affaan-m__ecc/skill/agentic-os` | Build persistent multi-agent operating systems on Claude Code. Covers kernel architecture, specialist agents, slash commands, fil… | 12 |
| `affaan-m__ecc/skill/ai-first-engineering` | Engineering operating model for teams where AI agents generate a large share of implementation output. | 1 |
| `affaan-m__ecc/skill/ai-regression-testing` | Regression testing strategies for AI-assisted development. Sandbox-mode API testing without database dependencies, automated bug-… | 11 |
| `affaan-m__ecc/skill/autonomous-agent-harness` | Transform Claude Code into a fully autonomous agent system with persistent memory, scheduled operations, computer use, and task q… | 11 |
| `affaan-m__ecc/skill/autonomous-loops` | Patterns and architectures for autonomous Claude Code loops — from simple sequential pipelines to RFC-driven multi-agent DAG syst… | 24 |
| `affaan-m__ecc/skill/blender-motion-state-inspection` | Use this skill when inspecting Blender characters, rigs, poses, animation retargeting, ground contact, facing direction, or model… | 8 |
| `affaan-m__ecc/skill/blueprint` | >- Turn a one-line objective into a step-by-step construction plan for multi-session, multi-agent engineering projects. Each step… | 5 |
| `affaan-m__ecc/skill/ck` | Persistent per-project memory for Claude Code. Auto-loads project context on session start, tracks sessions with git activity, an… | 53 |
| `affaan-m__ecc/skill/claude-devfleet` | Orchestrate multi-agent coding tasks via Claude DevFleet — plan projects, dispatch parallel agents in isolated worktrees, monitor… | 6 |
| `affaan-m__ecc/skill/continuous-agent-loop` | Patterns for continuous autonomous agent loops with quality gates, evals, and recovery controls. | 1 |
| `affaan-m__ecc/skill/cost-aware-llm-pipeline` | Cost optimization patterns for LLM API usage — model routing by task complexity, budget tracking, retry logic, and prompt caching. | 6 |
| `affaan-m__ecc/skill/cost-tracking` | Track and report Claude Code token usage, spending, and budgets from the local ECC cost-tracker metrics log. Use when the user as… | 4 |
| `affaan-m__ecc/skill/data-scraper-agent` | Build a fully automated AI-powered data collection agent for any public source — job boards, prices, news, GitHub, sports, anythi… | 24 |
| `affaan-m__ecc/skill/dmux-workflows` | Multi-agent orchestration using dmux (tmux pane manager for AI agents). Patterns for parallel agent workflows across Claude Code,… | 5 |
| `affaan-m__ecc/skill/dynamic-workflow-mode` | Design task-local harnesses, eval gates, and reusable skill extraction for Claude dynamic workflow mode and other adaptive agent … | 5 |
| `affaan-m__ecc/skill/e2e-testing` | Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strateg… | 8 |
| `affaan-m__ecc/skill/ecc-recipes` | Map a described workflow to the right ECC command-GROUP with run-order and stop condition, and browse all command-group recipe fa… | 6 |
| `affaan-m__ecc/skill/ecc-tools-cost-audit` | Evidence-first ECC Tools burn and billing audit workflow. Use when investigating runaway PR creation, quota bypass, premium-model… | 6 |
| `affaan-m__ecc/skill/enterprise-agent-ops` | Operate long-lived agent workloads with observability, security boundaries, and lifecycle management. | 1 |
| `affaan-m__ecc/skill/finance-billing-ops` | Evidence-first revenue, pricing, refunds, team-billing, and billing-model truth workflow for ECC. Use when the user wants a sales… | 4 |
| `affaan-m__ecc/skill/flox-environments` | Create reproducible, cross-platform (macOS/Linux) development environments with Flox, a declarative Nix-based environment manager… | 14 |
| `affaan-m__ecc/skill/foundation-models-on-device` | Apple FoundationModels framework for on-device LLM — text generation, guided generation with @Generable, tool calling, and snapsh… | 8 |
| `affaan-m__ecc/skill/gan-style-harness` | GAN-inspired Generator-Evaluator agent harness for building high-quality applications autonomously. Based on Anthropic's March 20… | 12 |
| `affaan-m__ecc/skill/inherit-legacy-style` | Legacy-project style inheritance skill. Use when the user types /inherit-legacy-style, or when onboarding an AI coding agent onto… | 8 |
| `affaan-m__ecc/skill/intent-driven-development` | Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside imp… | 17 |
| `affaan-m__ecc/skill/ito-data-atlas-agent` | Design source-grounded Data Atlas style agents for Itô basket research, market discovery, parameter drafting, and human-in-the-lo… | 8 |
| `affaan-m__ecc/skill/ito-inference` | Inspect the availability of model serving on a completed Itô compute booking and, when the canonical backend becomes available, h… | 6 |
| `affaan-m__ecc/skill/ito-training` | Run an ML training job on a completed Itô compute booking through the canonical Itô backend. Use after ito-compute has booked GPU… | 2 |
| `affaan-m__ecc/skill/knowledge-ops` | Knowledge base management, ingestion, sync, and retrieval across multiple storage layers (local files, MCP memory, vector stores,… | 7 |
| `affaan-m__ecc/skill/lead-intelligence` | AI-native lead intelligence and outreach pipeline. Replaces Apollo, Clay, and ZoomInfo with agent-powered signal scoring, mutual … | 21 |
| `affaan-m__ecc/skill/llm-trading-agent-security` | Security patterns for autonomous trading agents with wallet or transaction authority. Covers prompt injection, spend limits, pre-… | 4 |
| `affaan-m__ecc/skill/loop-design-check` | Design a goal-oriented agent loop, and review it for the ways loops go wrong — spinning and burning tokens, Goodhart-gaming the v… | 12 |
| `affaan-m__ecc/skill/ml-adoption-playbook` | End-to-end methodology for AI agents and software engineers to add machine learning algorithms to existing non-ML codebases. Cove… | 4 |
| `affaan-m__ecc/skill/mle-workflow` | Production machine-learning engineering workflow for data contracts, reproducible training, model evaluation, deployment, monitor… | 22 |
| `affaan-m__ecc/skill/openclaw-persona-forge` | 为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、… | 35 |
| `affaan-m__ecc/skill/orch-add-feature` | Orchestrate building a brand-new feature end to end — research, plan, TDD implementation, review, and gated commit — by delegatin… | 2 |
| `affaan-m__ecc/skill/orch-fix-defect` | Orchestrate fixing a bug — reproduce it as a failing regression test, fix to green, review, and gated commit — by delegating each… | 2 |
| `affaan-m__ecc/skill/orch-pipeline` | Shared orchestration engine for the orch-* skill family. Defines the gated Research-Plan-TDD-Review-Commit pipeline, the size cla… | 6 |
| `affaan-m__ecc/skill/plan-orchestrate` | Read a plan document, decompose it into steps, design a per-step agent chain from the ECC catalogue, and emit ready-to-paste /orc… | 18 |
| `affaan-m__ecc/skill/prediction-market-risk-review` | Review prediction-market, basket, oracle, and trading-agent workflows for compliance, safety, data-quality, privacy, and executio… | 2 |
| `affaan-m__ecc/skill/prompt-optimizer` | >- Analyze raw prompts, identify intent and gaps, match ECC components (skills/commands/agents/hooks), and output a ready-to-past… | 16 |
| `affaan-m__ecc/skill/pytorch-patterns` | PyTorch deep learning patterns and best practices for building robust, efficient, and reproducible training pipelines, model arch… | 11 |
| `affaan-m__ecc/skill/ralphinho-rfc-pipeline` | RFC-driven multi-agent DAG execution pattern with quality gates, merge queues, and work unit orchestration. | 1 |
| `affaan-m__ecc/skill/react-performance` | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/ve… | 18 |
| `affaan-m__ecc/skill/recsys-pipeline-architect` | Design composable recommendation, ranking, and feed pipelines using the six-stage Source→Hydrator→Filter→Scorer→Selector→SideEffe… | 8 |
| `affaan-m__ecc/skill/regex-vs-llm-structured-text` | Decision framework for choosing between regex and LLM when parsing structured text — start with regex, add LLM only for low-confi… | 6 |
| `affaan-m__ecc/skill/santa-method` | Multi-agent adversarial verification with convergence loop. Two independent review agents must both pass before output ships. | 12 |
| `affaan-m__ecc/skill/security-scan` | Scan your Claude Code configuration (.claude/ directory) for security vulnerabilities, misconfigurations, and injection risks usi… | 4 |
| `affaan-m__ecc/skill/skill-comply` | Visualize whether skills, rules, and agent definitions are actually followed — auto-generates scenarios at 3 prompt strictness le… | 59 |
| `affaan-m__ecc/skill/social-publisher` | Agent-driven scheduling and publishing of social media posts across 13 platforms via SocialClaw. Use when the user wants to publi… | 4 |
| `affaan-m__ecc/skill/team-agent-orchestration` | Run team-based orchestration for agent squads using work items, ownership, agent Kanban, merge gates, and control pane handoffs. | 5 |
| `affaan-m__ecc/skill/team-builder` | Interactive agent picker for composing and dispatching parallel teams | 7 |
| `affaan-m__ecc/skill/unified-memory` | Share durable, inspectable context and handoffs between Claude, Codex, Hermes, Cursor, OpenCode, and other agents through the loc… | 6 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | > Live SEO data via DataForSEO MCP server: SERP analysis, keyword research (volume, difficulty, intent, trends), backlink profile… | 23 |
| `AgriciDaniel__claude-seo/skill/seo-geo` | > Optimize content for AI Overviews (formerly SGE), ChatGPT web search, Perplexity, and other AI-powered search experiences. Gene… | 24 |
| `AgriciDaniel__claude-seo/skill/seo-profound` | Profound LLM citation tracker (extension). Time-series brand citation rates across ChatGPT, Perplexity, and other LLMs. Pairs wit… | 2 |
| `anthropics__claude-plugins-official/skill/agent-development` | This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent frontmatter", "when… | 70 |
| `anthropics__claude-plugins-official/skill/build-mcp-app` | This skill should be used when the user wants to build an "MCP app", add "interactive UI" or "widgets" to an MCP server, "render … | 48 |
| `anthropics__claude-plugins-official/skill/build-mcp-server` | This skill should be used when the user asks to "build an MCP server", "create an MCP", "make an MCP integration", "wrap an API f… | 50 |
| `anthropics__claude-plugins-official/skill/hook-development` | This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate tool use", "… | 66 |
| `anthropics__claude-plugins-official/skill/mcp-integration` | This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use .mcp.json", "s… | 48 |
| `anthropics__claude-plugins-official/skill/playground` | Creates interactive HTML playgrounds — self-contained single-file explorers that let users configure something visually through c… | 30 |
| `anthropics__skills/skill/claude-api` | /- Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token co… | 901 |
| `anthropics__skills/skill/mcp-builder` | Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through … | 122 |
| `Egonex-AI__Understand-Anything/skill/understand` | Analyze a codebase to produce an interactive knowledge graph for understanding architecture, components, and relationships | 386 |
| `Egonex-AI__Understand-Anything/skill/understand-chat` | Use when you need to ask questions about a codebase or understand code using a knowledge graph | 5 |
| `Egonex-AI__Understand-Anything/skill/understand-dashboard` | Launch the interactive web dashboard to visualize a codebase's knowledge graph | 7 |
| `Egonex-AI__Understand-Anything/skill/understand-domain` | Extract business domain knowledge from a codebase and generate an interactive domain flow graph. Works standalone (lightweight sc… | 26 |
| `Egonex-AI__Understand-Anything/skill/understand-figma` | Analyze a Figma file via the Figma REST API and generate an interactive design knowledge graph (pages, screens, components, compo… | 10 |
| `Egonex-AI__Understand-Anything/skill/understand-knowledge` | Analyze a Karpathy-pattern LLM wiki knowledge base and generate an interactive knowledge graph with entity extraction, implicit r… | 44 |
| `Graphify-Labs__graphify/skill/graphify` | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ e… | 3838 |
| `mattpocock__skills/skill/claude-handoff` | Hand the current conversation off to a fresh background agent that picks up the work immediately. | 1 |
| `mattpocock__skills/skill/domain-modeling` | Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, reco… | 9 |
| `mattpocock__skills/skill/handoff` | Compact the current conversation into a handoff document for another agent to pick up. | 1 |
| `mattpocock__skills/skill/prototype` | Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic f… | 16 |
| `mattpocock__skills/skill/research` | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the u… | 1 |
| `mattpocock__skills/skill/triage` | Move issues and external PRs through a state machine of triage roles — categorise, verify, grill if needed, and write agent-ready… | 19 |
| `mattpocock__skills/skill/wayfinder` | Plan a huge chunk of work — more than one agent session can hold — as a shared map of decision tickets on your issue tracker, and… | 12 |
| `mattpocock__skills/skill/wizard` | Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure,… | 13 |
| `multica-ai__multica/skill/multica-creating-agents` | Use when creating, inspecting, or debugging a Multica agent definition via the `multica agent` CLI or POST /api/agents. Not for a… | 33 |
| `multica-ai__multica/skill/multica-mentioning` | Use when an issue comment needs to @mention someone — link to a person, trigger another agent, hand work to a squad, or broadcast… | 28 |
| `multica-ai__multica/skill/multica-runtimes-and-repos` | Use when a Multica runtime or daemon misbehaves: agent not running, task not claimed, runtime offline, workdir or session reuse, … | 8 |
| `usestrix__strix/skill/managed-pentesting-with-strix` | Run a managed pentest of a web app or API through the app.strix.ai REST API — no local Docker, LLM key, or install needed. Create… | 8 |

