# Domäne: docs

86 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (21)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/code-reviewer` | Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing… | 9 |
| `affaan-m__ecc/agent/database-reviewer` | PostgreSQL database specialist for query optimization, schema design, security, and performance. Use PROACTIVELY when writing SQL… | 4 |
| `affaan-m__ecc/agent/doc-updater` | Documentation and codemap specialist. Use PROACTIVELY for updating codemaps and documentation. Runs /update-codemaps and /update-… | 3 |
| `affaan-m__ecc/agent/docs-lookup` | When the user asks how to use a library, framework, or API or needs up-to-date code examples, use Context7 MCP to fetch current d… | 4 |
| `affaan-m__ecc/agent/opensource-packager` | Generate complete open-source packaging for a sanitized project. Produces CLAUDE.md, setup.sh, README.md, LICENSE, CONTRIBUTING.m… | 8 |
| `affaan-m__ecc/agent/security-reviewer` | Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authenti… | 4 |
| `affaan-m__ecc/agent/tdd-guide` | Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bug… | 3 |
| `anthropics__claude-plugins-official/agent/agent-sdk-verifier-py` | Use this agent to verify that a Python Agent SDK application is properly configured, follows SDK best practices and documentation… | 5 |
| `anthropics__claude-plugins-official/agent/agent-sdk-verifier-ts` | Use this agent to verify that a TypeScript Agent SDK application is properly configured, follows SDK best practices and documenta… | 5 |
| `anthropics__claude-plugins-official/agent/comment-analyzer` | Use this agent when you need to analyze code comments for accuracy, completeness, and long-term maintainability. This includes (1… | 5 |
| `Egonex-AI__Understand-Anything/agent/article-analyzer` | / Analyzes markdown files using pre-parsed structural data and LLM inference to extract knowledge graph nodes and edges (entities… | 4 |
| `Graphify-Labs__graphify/agent/graphify` | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ e… | 61 |
| `msitarzewski__agency-agents/agent/blockchain-security-auditor` | Expert smart contract security auditor specializing in vulnerability detection, formal verification, exploit analysis, and compre… | 21 |
| `msitarzewski__agency-agents/agent/civil-engineer` | Expert civil and structural engineer with global standards coverage — Eurocode, DIN, ACI, AISC, ASCE, AS/NZS, CSA, GB, IS, AIJ, a… | 17 |
| `msitarzewski__agency-agents/agent/grant-writer` | Expert grant writing specialist for nonprofits, research institutions, and social enterprises — covering prospect research, lette… | 26 |
| `msitarzewski__agency-agents/agent/hr-onboarding` | Comprehensive HR onboarding specialist for employee orientation, documentation management, compliance tracking, benefits enrollme… | 23 |
| `msitarzewski__agency-agents/agent/legal-billing-time-tracking` | Comprehensive legal billing and time tracking specialist for accurate time capture, invoice generation, billing narrative writing… | 27 |
| `msitarzewski__agency-agents/agent/model-qa-specialist` | Independent model QA expert who audits ML and statistical models end-to-end - from documentation review and data reconstruction t… | 20 |
| `msitarzewski__agency-agents/agent/multi-platform-publisher` | Expert orchestrator for one-click Chinese blog publishing. Routes a single article to 知乎 / 小红书 / CSDN / B站 / 公众号 / 掘金 via Wechats… | 14 |
| `msitarzewski__agency-agents/agent/sales-outreach` | Consultative B2B sales outreach specialist for cold prospecting, lead follow-up, objection handling, proposal writing, and pipeli… | 20 |
| `msitarzewski__agency-agents/agent/technical-writer` | Expert technical writer specializing in developer documentation, API references, README files, and tutorials. Transforms complex … | 14 |

## command (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/docs` | Legacy slash-entry shim for the documentation-lookup skill. Prefer the skill directly. | 1 |
| `affaan-m__ecc/command/ecc-guide` | Navigate ECC's current agents, skills, commands, hooks, install profiles, and docs from the live repository surface. | 3 |
| `affaan-m__ecc/command/update-docs` | Update documentation for recent changes | 1 |

## hook (2)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/doc-file-warning` | Doc file warning hook (PreToolUse - Write) | 3 |
| `anthropics__claude-plugins-official/hook/security-reminder-hook` | Security Guidance Plugin for Claude Code | 109 |

## plugin (2)

| ID | Beschreibung | KB |
|---|---|---:|
| `anthropics__claude-plugins-official/plugin/claude-security` | Deep vulnerability scanning of your own code, run entirely inside your Claude Code session at a chosen effort tier, with every fi… | 324 |
| `anthropics__claude-plugins-official/plugin/context7` | Upstash Context7 MCP server for up-to-date documentation lookup. Connects to Context7's hosted remote MCP server (https://mcp.con… | 2 |

## skill (58)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/architecture-decision-records` | Capture architectural decisions made during Claude Code sessions as structured ADRs. Auto-detects decision moments, records conte… | 7 |
| `affaan-m__ecc/skill/article-writing` | Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from… | 3 |
| `affaan-m__ecc/skill/brand-voice` | Build a source-derived writing style profile from real posts, essays, launch notes, docs, or site copy, then reuse that profile a… | 5 |
| `affaan-m__ecc/skill/cisco-ios-patterns` | Cisco IOS and IOS-XE review patterns for show commands, config hierarchy, wildcard masks, ACL placement, interface hygiene, and s… | 5 |
| `affaan-m__ecc/skill/clickhouse-io` | ClickHouse database patterns, query optimization, analytics, and data engineering best practices for high-performance analytical … | 10 |
| `affaan-m__ecc/skill/continuous-learning-v2` | Sistema de aprendizaje basado en instintos que observa sesiones mediante hooks, crea instintos atómicos con puntuación de confian… | 9 |
| `affaan-m__ecc/skill/cpp-coding-standards` | C++ coding standards based on the C++ Core Guidelines (isocpp.github.io). Use when writing, reviewing, or refactoring C++ code to… | 22 |
| `affaan-m__ecc/skill/cpp-testing` | Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding cover… | 9 |
| `affaan-m__ecc/skill/csharp-testing` | C# and .NET testing patterns with xUnit, FluentAssertions, mocking, integration tests, and test organization best practices. Use … | 9 |
| `affaan-m__ecc/skill/customs-trade-compliance` | > Codified expertise for customs documentation, tariff classification, duty optimization, restricted party screening, and regulat… | 28 |
| `affaan-m__ecc/skill/dart-flutter-patterns` | Production-ready Dart and Flutter patterns covering null safety, immutable state, async composition, widget architecture, popular… | 16 |
| `affaan-m__ecc/skill/defi-amm-security` | Security checklist for Solidity AMM contracts, liquidity pools, and swap flows. Covers reentrancy, CEI ordering, donation or infl… | 5 |
| `affaan-m__ecc/skill/django-tdd` | Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework … | 21 |
| `affaan-m__ecc/skill/documentation-lookup` | Use up-to-date library and framework docs via Context7 MCP instead of training data. Activates for setup questions, API reference… | 5 |
| `affaan-m__ecc/skill/dotnet-patterns` | Idiomatic C# and .NET patterns, conventions, dependency injection, async/await, and best practices for building robust, maintaina… | 9 |
| `affaan-m__ecc/skill/e2e-testing` | Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strateg… | 8 |
| `affaan-m__ecc/skill/fastapi-patterns` | FastAPI patterns for async APIs, dependency injection, Pydantic request and response models, OpenAPI docs, tests, security, and p… | 9 |
| `affaan-m__ecc/skill/fsharp-testing` | F# testing patterns with xUnit, FsUnit, Unquote, FsCheck property-based testing, integration tests, and test organization best pr… | 8 |
| `affaan-m__ecc/skill/git-workflow` | Git workflow patterns including branching strategies, commit conventions, merge vs rebase, conflict resolution, and collaborative… | 15 |
| `affaan-m__ecc/skill/golang-testing` | > Go testing best practices including table-driven tests, test helpers, benchmarking, race detection, coverage analysis, and inte… | 6 |
| `affaan-m__ecc/skill/google-workspace-ops` | Operate across Google Drive, Docs, Sheets, and Slides as one workflow surface for plans, trackers, decks, and shared documents. U… | 3 |
| `affaan-m__ecc/skill/kotlin-coroutines-flows` | Kotlin Coroutines and Flow patterns for Android and KMP — structured concurrency, Flow operators, StateFlow, error handling, and … | 8 |
| `affaan-m__ecc/skill/kubernetes-patterns` | Kubernetes workload patterns, resource management, RBAC, probes, autoscaling, ConfigMap/Secret handling, and kubectl debugging fo… | 20 |
| `affaan-m__ecc/skill/laravel-verification` | Bucle de verificación para proyectos Laravel: verificaciones de entorno, linting, análisis estático, pruebas con cobertura, escan… | 5 |
| `affaan-m__ecc/skill/living-docs-governance` | Keep a long-lived project's documentation from rotting by assigning existing project docs clear constitution, map, status, and hi… | 8 |
| `affaan-m__ecc/skill/mcp-server-patterns` | Build MCP servers with Node/TypeScript SDK — tools, resources, prompts, Zod validation, stdio vs Streamable HTTP. Use Context7 or… | 4 |
| `affaan-m__ecc/skill/perl-patterns` | Modern Perl 5.36+ idioms, best practices, and conventions for building robust, maintainable Perl applications. Use when writing o… | 11 |
| `affaan-m__ecc/skill/perl-testing` | Perl testing patterns using Test2::V0, Test::More, prove runner, mocking, coverage with Devel::Cover, and TDD methodology. Use wh… | 11 |
| `affaan-m__ecc/skill/prisma-patterns` | Prisma ORM patterns for TypeScript backends — schema design, query optimization, transactions, pagination, and critical traps lik… | 15 |
| `affaan-m__ecc/skill/project-guidelines-example` | Project-specific skill template covering architecture, patterns, testing, and deployment guidance. | 11 |
| `affaan-m__ecc/skill/python-testing` | > Python testing best practices using pytest including fixtures, parametrization, mocking, coverage analysis, async testing, and … | 11 |
| `affaan-m__ecc/skill/quarkus-verification` | Bucle de verificación para proyectos Quarkus: build, análisis estático, pruebas con cobertura, escaneos de seguridad, compilación… | 9 |
| `affaan-m__ecc/skill/react-patterns` | React 18/19 patterns including hooks discipline, server/client component boundaries, Suspense + error boundaries, form actions, d… | 11 |
| `affaan-m__ecc/skill/react-performance` | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/ve… | 18 |
| `affaan-m__ecc/skill/react-testing` | React component testing with React Testing Library, Vitest/Jest, MSW for network mocking, accessibility assertions with axe, and … | 13 |
| `affaan-m__ecc/skill/scholar-evaluation` | Structured scholarly-work evaluation for papers, proposals, literature reviews, methods sections, evidence quality, citation supp… | 5 |
| `affaan-m__ecc/skill/search-first` | > Research-before-coding workflow. Search for existing tools, libraries, and patterns before writing custom code. Systematizes th… | 8 |
| `affaan-m__ecc/skill/springboot-verification` | Bucle de verificación para proyectos Spring Boot: build, análisis estático, pruebas con cobertura, escaneos de seguridad y revisi… | 6 |
| `affaan-m__ecc/skill/tdd-workflow` | Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage i… | 13 |
| `affaan-m__ecc/skill/windows-desktop-e2e` | E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. Use when wr… | 30 |
| `AgriciDaniel__claude-seo/skill/seo-cluster` | > SERP-based semantic topic clustering for content architecture planning. Groups keywords by actual Google SERP overlap (not text… | 48 |
| `AgriciDaniel__claude-seo/skill/seo-content-brief` | > Generate competitive SEO content briefs with per-section word counts, competitor scoring, keyword density guidance, and page-ty… | 23 |
| `AgriciDaniel__claude-seo/skill/seo-image-gen` | AI image generation for SEO assets: OG/social preview images, blog hero images, schema images, product photography, infographics.… | 9 |
| `anthropics__claude-plugins-official/skill/project-artifact` | Generate and publish a project status artifact — an opinionated, tabbed status page for a project too big for one update (overvie… | 46 |
| `anthropics__claude-plugins-official/skill/writing-hookify-rules` | This skill should be used when the user asks to "create a hookify rule", "write a hook rule", "configure hookify", "add a hookify… | 8 |
| `anthropics__skills/skill/academy-guide` | > Stop and check this skill before finishing any reply to a question about how to use Claude or a Claude product — it recommends … | 19 |
| `anthropics__skills/skill/discernment-nudge` | > After you give a substantive answer or draft that the user may act on — advice or recommendations, drafted artifacts such as go… | 21 |
| `anthropics__skills/skill/doc-coauthoring` | Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, … | 15 |
| `anthropics__skills/skill/docx` | Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx… | 1102 |
| `anthropics__skills/skill/theme-factory` | Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 1… | 141 |
| `Graphify-Labs__graphify/skill/graphify` | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ e… | 4028 |
| `mattpocock__skills/skill/domain-modeling` | Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a CONTEXT.md, or recordi… | 8 |
| `mattpocock__skills/skill/grill-with-docs` | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go. | 1 |
| `mattpocock__skills/skill/research` | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the u… | 1 |
| `mattpocock__skills/skill/writing-beats` | Writing, exploit; assemble raw material into a journey of beats, grounding each term before a beat leans on it. | 5 |
| `mattpocock__skills/skill/writing-for-agents` | Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md. | 13 |
| `mattpocock__skills/skill/writing-fragments` | Writing, explore: mine raw fragments, no structure yet. | 4 |
| `mattpocock__skills/skill/writing-shape` | Writing, exploit: shape raw material into an article, paragraph by paragraph. | 6 |

