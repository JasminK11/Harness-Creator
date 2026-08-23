# Domäne: backend

140 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (35)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/database-reviewer` | PostgreSQL database specialist for query optimization, schema design, security, and performance. Use PROACTIVELY when writing SQL… | 4 |
| `affaan-m__ecc/agent/django-build-resolver` | Django/Python build, migration, and dependency error resolution specialist. Fixes pip/Poetry errors, migration conflicts, import … | 9 |
| `affaan-m__ecc/agent/django-reviewer` | Expert Django code reviewer specializing in ORM correctness, DRF patterns, migration safety, security misconfigurations, and prod… | 5 |
| `affaan-m__ecc/agent/docs-lookup` | When the user asks how to use a library, framework, or API or needs up-to-date code examples, use Context7 MCP to fetch current d… | 4 |
| `affaan-m__ecc/agent/harmonyos-app-resolver` | HarmonyOS application development expert specializing in ArkTS and ArkUI. Reviews code for V2 state management compliance, Naviga… | 9 |
| `affaan-m__ecc/agent/php-reviewer` | Expert PHP code reviewer specializing in PSR-12 compliance, PHP type system, Eloquent ORM patterns, security, and performance. Us… | 6 |
| `affaan-m__ecc/agent/react-build-resolver` | Diagnose and fix React build failures across Vite, webpack, Next.js, CRA, Parcel, esbuild, and Bun. Handles JSX/TSX compile error… | 6 |
| `affaan-m__ecc/agent/react-reviewer` | Expert React/JSX code reviewer specializing in hook correctness, render performance, server/client component boundaries, accessib… | 5 |
| `affaan-m__ecc/agent/security-reviewer` | Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authenti… | 4 |
| `affaan-m__ecc/agent/vue-reviewer` | Expert Vue.js code reviewer specializing in Composition API correctness, reactivity pitfalls, component architecture, template se… | 15 |
| `AgriciDaniel__claude-seo/agent/seo-backlinks` | Backlink profile analyst using free and paid sources. Fetches data from Moz API, Bing Webmaster Tools, Common Crawl web graphs, a… | 7 |
| `AgriciDaniel__claude-seo/agent/seo-google` | Google SEO API analyst. Fetches CWV field data via CrUX, indexation status via GSC, and organic traffic via GA4 for enriched audi… | 3 |
| `anthropics__claude-plugins-official/agent/scaffolder` | Scaffolds one service of a reimagined system from the approved architecture and spec — project skeleton, domain model, API stubs,… | 2 |
| `anthropics__claude-plugins-official/agent/silent-failure-hunter` | Use this agent when reviewing code changes in a pull request to identify silent failures, inadequate error handling, and inapprop… | 8 |
| `anthropics__claude-plugins-official/agent/version-delta-analyst` | Identifies the breaking changes between two versions of the SAME stack (e.g. .NET Framework 4.8 → .NET 8, Java 8 → 17/21, Spring … | 7 |
| `msitarzewski__agency-agents/agent/api-platform-engineer` | Expert API platform engineer for public and partner APIs — contract-first design (OpenAPI/gRPC), versioning and deprecation polic… | 13 |
| `msitarzewski__agency-agents/agent/api-tester` | Expert API testing specialist focused on comprehensive API validation, performance testing, and quality assurance across all syst… | 12 |
| `msitarzewski__agency-agents/agent/backend-architect` | Senior backend architect specializing in scalable system design, database architecture, API development, and cloud infrastructure… | 11 |
| `msitarzewski__agency-agents/agent/carousel-growth-engine` | Autonomous TikTok and Instagram carousel generation specialist. Analyzes any website URL with Playwright, generates viral 6-slide… | 14 |
| `msitarzewski__agency-agents/agent/database-optimizer` | Expert database specialist focusing on schema design, query optimization, indexing strategies, and performance tuning for Postgre… | 5 |
| `msitarzewski__agency-agents/agent/database-reliability-engineer` | Expert database reliability engineer (DBRE) — high availability and replication, automated failover, backup and point-in-time rec… | 14 |
| `msitarzewski__agency-agents/agent/drupal-performance-engineer` | Expert Drupal 10/11 performance engineer specializing in Core Web Vitals, render and dynamic page caching, BigPipe, cache tags an… | 23 |
| `msitarzewski__agency-agents/agent/gaussdb-expert-engineer` | Expert database specialist focusing on GaussDB OLTP — Huawei's self-developed enterprise-grade relational database (NOT GaussDB(D… | 15 |
| `msitarzewski__agency-agents/agent/lsp-index-engineer` | Language Server Protocol specialist building unified code intelligence systems through LSP client orchestration and semantic inde… | 11 |
| `msitarzewski__agency-agents/agent/privacy-engineer` | Expert privacy engineer who implements privacy in code — PII discovery and classification, data minimization, consent enforcement… | 14 |
| `msitarzewski__agency-agents/agent/roblox-systems-scripter` | Roblox platform engineering specialist - Masters Luau, the client-server security model, RemoteEvents/RemoteFunctions, DataStore,… | 15 |
| `msitarzewski__agency-agents/agent/security-architect` | Expert security architect specializing in threat modeling, secure-by-design architecture, trust-boundary analysis, defense-in-dep… | 18 |
| `msitarzewski__agency-agents/agent/technical-writer` | Expert technical writer specializing in developer documentation, API references, README files, and tutorials. Transforms complex … | 14 |
| `msitarzewski__agency-agents/agent/tracking-measurement-specialist` | Expert in conversion tracking architecture, tag management, and attribution modeling across Google Tag Manager, GA4, Google Ads, … | 5 |
| `msitarzewski__agency-agents/agent/unity-multiplayer-engineer` | Networked gameplay specialist - Masters Netcode for GameObjects, Unity Gaming Services (Relay/Lobby), client-server authority, la… | 15 |
| `msitarzewski__agency-agents/agent/unreal-multiplayer-architect` | Unreal Engine networking specialist - Masters Actor replication, GameMode/GameState architecture, server-authoritative gameplay, … | 14 |
| `msitarzewski__agency-agents/agent/web-gis-developer` | Full-stack web GIS engineer who builds interactive mapping applications — MapLibre GL JS, ArcGIS JS API, Leaflet, real-time dashb… | 5 |
| `msitarzewski__agency-agents/agent/webassembly-engineer` | Expert WebAssembly engineer — compiling Rust/C++/Go to Wasm, JS interop and the boundary marshalling cost, WASI and server-side r… | 13 |
| `msitarzewski__agency-agents/agent/wechat-mini-program-developer` | Expert WeChat Mini Program developer specializing in 小程序 development with WXML/WXSS/WXS, WeChat API integration, payment systems,… | 15 |
| `msitarzewski__agency-agents/agent/wordpress-performance-engineer` | Expert WordPress performance engineer specializing in Core Web Vitals, object caching (Redis/Memcached), page caching, database a… | 24 |

## command (9)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/database-migration` | Workflow command scaffold for database-migration in everything-claude-code. | 1 |
| `affaan-m__ecc/command/jira` | Retrieve a Jira ticket, analyze requirements, update status, or add comments. Uses the jira-integration skill and MCP or REST API. | 3 |
| `affaan-m__ecc/command/multi-backend` | Run a backend-focused multi-model workflow for APIs, algorithms, data, and business logic. | 5 |
| `affaan-m__ecc/command/pm2` | Analyze a project and generate PM2 service commands for detected frontend, backend, or database services. | 7 |
| `affaan-m__ecc/command/react-build` | Fix React build failures (Vite, webpack, Next.js, CRA, Parcel, esbuild, Bun) incrementally — JSX/TSX compile errors, hydration mi… | 5 |
| `affaan-m__ecc/command/react-review` | Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, … | 6 |
| `affaan-m__ecc/command/vue-review` | Comprehensive Vue.js code review for Composition API correctness, reactivity, composable patterns, template security, accessibili… | 6 |
| `anthropics__claude-plugins-official/command/asana-setup` | Set up the Asana V2 MCP server connection (one-time OAuth app + claude mcp add) | 2 |
| `anthropics__claude-plugins-official/command/create-docker-mcp-tunnel` | Stand up an Anthropic MCP tunnel locally with Docker Compose so Claude can call a private MCP server (manual-credentials quicksta… | 16 |

## hook (7)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/auto-tmux-dev` | Auto-Tmux Dev Hook - Start dev servers in tmux/cmd automatically | 5 |
| `affaan-m__ecc/hook/gateguard-fact-force` | PreToolUse Hook: GateGuard Fact-Forcing Gate | 40 |
| `affaan-m__ecc/hook/mcp-health-check` | The preflight HTTP probe only checks reachability; it does not have access to | 23 |
| `affaan-m__ecc/hook/pre-bash-dev-server-block` | Trailing (?![\w-]) rather than \b: \b treats a hyphen as a word boundary, so | 6 |
| `anthropics__claude-plugins-official/hook/llm` | LLM-based security analysis for the security-guidance plugin. | 113 |
| `anthropics__claude-plugins-official/hook/review-api` | Public review API for the security-guidance agentic commit reviewer. | 24 |
| `anthropics__claude-plugins-official/hook/stop-hook` | Ralph Loop Stop Hook | 7 |

## plugin (11)

| ID | Beschreibung | KB |
|---|---|---:|
| `anthropics__claude-plugins-official/plugin/asana` | Asana project management integration. Connects Claude Code to Asana's V2 MCP server (https://mcp.asana.com/v2/mcp) to create and … | 5 |
| `anthropics__claude-plugins-official/plugin/context7` | Upstash Context7 MCP server for up-to-date documentation lookup. Connects to Context7's hosted remote MCP server (https://mcp.con… | 2 |
| `anthropics__claude-plugins-official/plugin/firebase` | Google Firebase MCP integration. Manage Firestore databases, authentication, cloud functions, hosting, and storage. Build and man… | 1 |
| `anthropics__claude-plugins-official/plugin/github` | Official GitHub MCP server for repository management. Create issues, manage pull requests, review code, search repositories, and … | 1 |
| `anthropics__claude-plugins-official/plugin/laravel-boost` | Laravel development toolkit MCP server. Provides intelligent assistance for Laravel applications including Artisan commands, Eloq… | 1 |
| `anthropics__claude-plugins-official/plugin/mcp-server-dev` | Skills for designing and building MCP servers that work seamlessly with Claude — guides you through deployment models (remote HTT… | 127 |
| `anthropics__claude-plugins-official/plugin/mcp-tunnels` | Connect Claude to a private MCP server through an Anthropic MCP tunnel. Drives the Docker Compose quickstart end to end: certific… | 32 |
| `anthropics__claude-plugins-official/plugin/playwright` | Browser automation and end-to-end testing MCP server by Microsoft. Enables Claude to interact with web pages, take screenshots, f… | 1 |
| `anthropics__claude-plugins-official/plugin/serena` | Semantic code analysis MCP server providing intelligent code understanding, refactoring suggestions, and codebase navigation thro… | 1 |
| `anthropics__claude-plugins-official/plugin/terraform` | The Terraform MCP Server provides seamless integration with Terraform ecosystem, enabling advanced automation and interaction cap… | 1 |
| `nextlevelbuilder__ui-ux-pro-max-skill/plugin/ui-ux-pro-max` | UI/UX design intelligence. Searchable local database with 84 styles, 192 palettes, 74 font pairings, 25 charts, and 22 stacks (Re… | 21036 |

## skill (78)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/ai-regression-testing` | Regression testing strategies for AI-assisted development. Sandbox-mode API testing without database dependencies, automated bug-… | 11 |
| `affaan-m__ecc/skill/api-connector-builder` | Build a new API connector or provider by matching the target repo's existing integration pattern exactly. Use when adding one mor… | 3 |
| `affaan-m__ecc/skill/api-design` | REST API design patterns including resource naming, status codes, pagination, filtering, error responses, versioning, and rate li… | 13 |
| `affaan-m__ecc/skill/backend-patterns` | Backend architecture patterns, API design, database optimization, and server-side best practices for Node.js, Express, and Next.j… | 14 |
| `affaan-m__ecc/skill/bun-runtime` | Bun as runtime, package manager, bundler, and test runner. When to choose Bun vs Node, migration notes, and Vercel support. | 3 |
| `affaan-m__ecc/skill/clickhouse-io` | ClickHouse database patterns, query optimization, analytics, and data engineering best practices for high-performance analytical … | 10 |
| `affaan-m__ecc/skill/coding-standards` | Baseline cross-project coding conventions for naming, readability, immutability, and code-quality review. Use detailed frontend o… | 13 |
| `affaan-m__ecc/skill/contract-first` | Use when multiple consumers and providers must evolve an API or event schema without field drift, integration surprises, or one s… | 9 |
| `affaan-m__ecc/skill/cost-aware-llm-pipeline` | Cost optimization patterns for LLM API usage — model routing by task complexity, budget tracking, retry logic, and prompt caching… | 6 |
| `affaan-m__ecc/skill/database-migrations` | > Database migration best practices for schema changes, data migrations, rollbacks, and zero-downtime deployments across PostgreS… | 10 |
| `affaan-m__ecc/skill/django-patterns` | Django architecture patterns, REST API design with DRF, ORM best practices, caching, signals, middleware, and production-grade Dj… | 21 |
| `affaan-m__ecc/skill/django-security` | Django security best practices, authentication, authorization, CSRF protection, SQL injection prevention, XSS prevention, and sec… | 16 |
| `affaan-m__ecc/skill/django-tdd` | Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework … | 21 |
| `affaan-m__ecc/skill/documentation-lookup` | Use up-to-date library and framework docs via Context7 MCP instead of training data. Activates for setup questions, API reference… | 5 |
| `affaan-m__ecc/skill/flox-environments` | Create reproducible, cross-platform (macOS/Linux) development environments with Flox, a declarative Nix-based environment manager… | 14 |
| `affaan-m__ecc/skill/gget` | gget CLI and Python workflow for quick genomic database queries, sequence lookup, BLAST-style searches, enrichment checks, and re… | 5 |
| `affaan-m__ecc/skill/homelab-vlan-segmentation` | Segmenting home networks into VLANs for IoT, guest, trusted, and server traffic using UniFi, pfSense/OPNsense, and MikroTik — inc… | 10 |
| `affaan-m__ecc/skill/homelab-wireguard-vpn` | WireGuard VPN server setup, peer configuration, key generation, split tunneling vs full tunnel routing, and remote access to a ho… | 10 |
| `affaan-m__ecc/skill/intent-driven-development` | Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside imp… | 17 |
| `affaan-m__ecc/skill/ios-icon-gen` | Generate iOS app icons as PNG imagesets for Xcode asset catalogs from SF Symbols (5000+ Apple-native) or Iconify API (275k+ open … | 21 |
| `affaan-m__ecc/skill/ito-inference` | Inspect the availability of model serving on a completed Itô compute booking and, when the canonical backend becomes available, h… | 6 |
| `affaan-m__ecc/skill/ito-training` | Inspect the availability of ML training on a completed Itô compute booking and, when the canonical backend becomes available, han… | 6 |
| `affaan-m__ecc/skill/jira-integration` | Use this skill when retrieving Jira tickets, analyzing requirements, updating ticket status, adding comments, or transitioning is… | 9 |
| `affaan-m__ecc/skill/kotlin-exposed-patterns` | JetBrains Exposed ORM patterns including DSL queries, DAO pattern, transactions, HikariCP connection pooling, Flyway migrations, … | 22 |
| `affaan-m__ecc/skill/kotlin-ktor-patterns` | Ktor server patterns including routing DSL, plugins, authentication, Koin DI, kotlinx.serialization, WebSockets, and testApplicat… | 19 |
| `affaan-m__ecc/skill/laravel-patterns` | Patrones de arquitectura Laravel, routing/controladores, Eloquent ORM, capas de servicio, colas, eventos, caché y API resources p… | 11 |
| `affaan-m__ecc/skill/mailtrap-email-integration` | Guides agents through integrating transactional email sending via Mailtrap's Email API, including sandbox testing, domain verific… | 4 |
| `affaan-m__ecc/skill/mcp-server-patterns` | Build MCP servers with Node/TypeScript SDK — tools, resources, prompts, Zod validation, stdio vs Streamable HTTP. Use Context7 or… | 4 |
| `affaan-m__ecc/skill/motion-advanced` | Advanced motion patterns for React / Next.js — drag & drop, gestures, text animations, SVG path drawing, custom hooks, imperative… | 18 |
| `affaan-m__ecc/skill/mysql-patterns` | MySQL and MariaDB schema, query, indexing, transaction, replication, and connection-pool patterns for production backends. Use wh… | 12 |
| `affaan-m__ecc/skill/nutrient-document-processing` | Process, convert, OCR, extract, redact, sign, and fill documents using the Nutrient DWS API. Works with PDFs, DOCX, XLSX, PPTX, H… | 6 |
| `affaan-m__ecc/skill/postgres-patterns` | > PostgreSQL database patterns for query optimization, schema design, indexing, and security. Quick reference for common patterns… | 4 |
| `affaan-m__ecc/skill/prediction-market-risk-review` | Review prediction-market, basket, oracle, and trading-agent workflows for compliance, safety, data-quality, privacy, and executio… | 2 |
| `affaan-m__ecc/skill/prisma-patterns` | Prisma ORM patterns for TypeScript backends — schema design, query optimization, transactions, pagination, and critical traps lik… | 15 |
| `affaan-m__ecc/skill/pubmed-database` | Direct PubMed and NCBI E-utilities search workflows for biomedical literature, MeSH queries, PMID lookup, citation retrieval, and… | 5 |
| `affaan-m__ecc/skill/quarkus-patterns` | Patrones de arquitectura Quarkus 3.x LTS con Camel para mensajería, diseño de API RESTful, servicios CDI, acceso a datos con Pana… | 15 |
| `affaan-m__ecc/skill/quarkus-tdd` | Desarrollo guiado por pruebas para Quarkus 3.x LTS usando JUnit 5, Mockito, REST Assured, pruebas Camel y JaCoCo. Usar al agregar… | 14 |
| `affaan-m__ecc/skill/ralphinho-rfc-pipeline` | RFC-driven multi-agent DAG execution pattern with quality gates, merge queues, and work unit orchestration. Use when running RFC-… | 2 |
| `affaan-m__ecc/skill/react-native-patterns` | React Native and Expo app patterns — Expo Router navigation, state separation (server/client/route/form), TanStack Query data fet… | 11 |
| `affaan-m__ecc/skill/react-patterns` | React 18/19 patterns including hooks discipline, server/client component boundaries, Suspense + error boundaries, form actions, d… | 11 |
| `affaan-m__ecc/skill/react-performance` | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/ve… | 18 |
| `affaan-m__ecc/skill/redis-patterns` | Redis data structure patterns, caching strategies, distributed locks, rate limiting, pub/sub, and connection management for produ… | 12 |
| `affaan-m__ecc/skill/security-review` | Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing pay… | 12 |
| `affaan-m__ecc/skill/springboot-patterns` | Spring Boot architecture patterns, REST API design, layered services, data access, caching, async processing, and logging. Use fo… | 10 |
| `affaan-m__ecc/skill/tinystruct-patterns` | Expert guidance for developing with the tinystruct Java framework. Use when working on the tinystruct codebase or any project bui… | 27 |
| `affaan-m__ecc/skill/uspto-database` | USPTO patent and trademark data workflow for official record lookup, PatentSearch queries, TSDR checks, assignment data, and repr… | 6 |
| `affaan-m__ecc/skill/vue-patterns` | Vue.js 3 Composition API patterns, component architecture, reactivity best practices, Pinia state management, Vue Router navigati… | 13 |
| `affaan-m__ecc/skill/x-api` | X/Twitter API integration for posting tweets, threads, reading timelines, search, and analytics. Covers OAuth auth patterns, rate… | 7 |
| `AgriciDaniel__claude-seo/skill/seo-ahrefs` | Ahrefs API analyst (extension). Reads referring domains, backlinks, organic keywords, and content explorer data via the tested @a… | 2 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | > Live SEO data via DataForSEO MCP server: SERP analysis, keyword research (volume, difficulty, intent, trends), backlink profile… | 23 |
| `AgriciDaniel__claude-seo/skill/seo-ecommerce` | > E-commerce SEO analysis: Google Shopping visibility, Amazon marketplace intelligence, product schema validation, competitor pri… | 24 |
| `AgriciDaniel__claude-seo/skill/seo-google` | > Google SEO APIs: Search Console (Search Analytics, URL Inspection, Sitemaps), PageSpeed Insights v5, CrUX field data with 25-we… | 59 |
| `AgriciDaniel__claude-seo/skill/seo-maps` | > Maps intelligence for local SEO: geo-grid rank tracking, GBP profile auditing via API, review intelligence across Google/Tripad… | 12 |
| `AgriciDaniel__claude-seo/skill/seo-unlighthouse` | Multi-page Lighthouse audit via the MIT-licensed Unlighthouse CLI. Free-tier alternative to running PageSpeed against every URL o… | 2 |
| `anthropics__claude-plugins-official/skill/build-mcp-app` | This skill should be used when the user wants to build an "MCP app", add "interactive UI" or "widgets" to an MCP server, "render … | 47 |
| `anthropics__claude-plugins-official/skill/build-mcp-server` | This skill should be used when the user asks to "build an MCP server", "create an MCP", "make an MCP integration", "wrap an API f… | 49 |
| `anthropics__claude-plugins-official/skill/build-mcpb` | This skill should be used when the user wants to "package an MCP server", "bundle an MCP", "make an MCPB", "ship a local MCP serv… | 18 |
| `anthropics__claude-plugins-official/skill/hook-development` | This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate tool use", "… | 63 |
| `anthropics__claude-plugins-official/skill/mcp-integration` | This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use .mcp.json", "s… | 45 |
| `anthropics__claude-plugins-official/skill/receipts` | Generate a personal Claude Code usage & impact report ("receipts") from this machine's local session transcripts — for justifying… | 80 |
| `anthropics__skills/skill/claude-api` | /- Reference for the Claude API / Anthropic SDK — model ids, pricing, params, streaming, tool use, MCP, agents, caching, token co… | 951 |
| `anthropics__skills/skill/xlsx` | Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, rea… | 1077 |
| `Egonex-AI__Understand-Anything/skill/understand-figma` | Analyze a Figma file via the Figma REST API and generate an interactive design knowledge graph (pages, screens, components, compo… | 10 |
| `mattpocock__skills/skill/research` | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the u… | 1 |
| `mattpocock__skills/skill/wizard` | Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure,… | 12 |
| `multica-ai__multica/skill/multica-autopilots` | Use when creating, updating, inspecting, triggering, or debugging a Multica autopilot (scheduled, webhook, or manual). | 7 |
| `multica-ai__multica/skill/multica-creating-agents` | Use when creating, inspecting, or debugging a Multica agent definition via the `multica agent` CLI or POST /api/agents. Not for a… | 39 |
| `multica-ai__multica/skill/multica-projects-and-resources` | Use when creating, inspecting, updating, or debugging Multica projects and their resources (github_repo, local_directory). | 11 |
| `multica-ai__multica/skill/multica-skill-importing` | Use when asked to import or install a specific skill into this Multica workspace from a URL or slug. Not for choosing which skill… | 24 |
| `multica-ai__multica/skill/multica-squads` | Use when creating, inspecting, updating, assigning to, or debugging a Multica squad, including how leader routing picks who runs. | 24 |
| `multica-ai__multica/skill/multica-working-on-issues` | Use when acting on a Multica issue beyond what the brief covers: PR linking vs close intent, reading a linked PR's real state, me… | 32 |
| `usestrix__strix/skill/api-security-testing` | Security-test a REST, GraphQL, or gRPC API with Strix — autonomous agents that enumerate endpoints from an OpenAPI/GraphQL schema… | 6 |
| `usestrix__strix/skill/application-security-testing` | Application security testing (AppSec) across a whole product with Strix — decide which asset needs which test (source code, runni… | 4 |
| `usestrix__strix/skill/ci-security-scanning-with-strix` | Add security scanning to CI/CD with Strix — GitHub Actions, GitLab CI, or any pipeline — so every pull request gets a diff-scoped… | 8 |
| `usestrix__strix/skill/managed-pentesting-with-strix` | Run a managed pentest of a web app or API through the app.strix.ai REST API — no local Docker, LLM key, or install needed. Create… | 8 |
| `usestrix__strix/skill/owasp-top-10-testing` | Test an application against the OWASP Top 10 with Strix — autonomous AI agents that attempt real exploits for each category of th… | 6 |
| `usestrix__strix/skill/penetration-testing-with-strix` | Pentest a web app, API, codebase, repository, URL, domain, or IP with Strix — autonomous AI penetration testing that exploits and… | 9 |
| `usestrix__strix/skill/web-app-penetration-testing` | Pentest a web app or website end to end — black-box testing of a live URL, staging environment, or local dev server that finds an… | 4 |

