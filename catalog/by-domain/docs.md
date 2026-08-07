# Domäne: docs

63 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (18)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/code-reviewer` | Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing… | 9 |
| `affaan-m__ecc/agent/database-reviewer` | PostgreSQL database specialist for query optimization, schema design, security, and performance. Use PROACTIVELY when writing SQL… | 4 |
| `affaan-m__ecc/agent/doc-updater` | Documentation and codemap specialist. Use PROACTIVELY for updating codemaps and documentation. Runs /update-codemaps and /update-… | 3 |
| `affaan-m__ecc/agent/docs-lookup` | When the user asks how to use a library, framework, or API or needs up-to-date code examples, use Context7 MCP to fetch current d… | 4 |
| `affaan-m__ecc/agent/opensource-packager` | Generate complete open-source packaging for a sanitized project. Produces CLAUDE.md, setup.sh, README.md, LICENSE, CONTRIBUTING.m… | 8 |
| `affaan-m__ecc/agent/security-reviewer` | Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authenti… | 4 |
| `affaan-m__ecc/agent/tdd-guide` | Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bug… | 3 |
| `Egonex-AI__Understand-Anything/agent/article-analyzer` | / Analyzes markdown files using pre-parsed structural data and LLM inference to extract knowledge graph nodes and edges (entities… | 4 |
| `Graphify-Labs__graphify/agent/graphify` | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ e… | 62 |
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

## hook (1)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/doc-file-warning` | !/usr/bin/env node | 3 |

## skill (41)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/architecture-decision-records` | Capture architectural decisions made during Claude Code sessions as structured ADRs. Auto-detects decision moments, records conte… | 7 |
| `affaan-m__ecc/skill/article-writing` | Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from… | 3 |
| `affaan-m__ecc/skill/brand-voice` | Build a source-derived writing style profile from real posts, essays, launch notes, docs, or site copy, then reuse that profile a… | 5 |
| `affaan-m__ecc/skill/continuous-learning` | [OBSOLETO - usar continuous-learning-v2] Extractor de skill por hook Stop v1 heredado. v2 es un superconjunto estricto con aprend… | 5 |
| `affaan-m__ecc/skill/continuous-learning-v2` | Sistema de aprendizaje basado en instintos que observa sesiones mediante hooks, crea instintos atómicos con puntuación de confian… | 9 |
| `affaan-m__ecc/skill/cpp-coding-standards` | C++ coding standards based on the C++ Core Guidelines (isocpp.github.io). Use when writing, reviewing, or refactoring C++ code to… | 22 |
| `affaan-m__ecc/skill/cpp-testing` | Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding cover… | 9 |
| `affaan-m__ecc/skill/customs-trade-compliance` | > Codified expertise for customs documentation, tariff classification, duty optimization, restricted party screening, and regulat… | 28 |
| `affaan-m__ecc/skill/documentation-lookup` | Use up-to-date library and framework docs via Context7 MCP instead of training data. Activates for setup questions, API reference… | 5 |
| `affaan-m__ecc/skill/fastapi-patterns` | FastAPI patterns for async APIs, dependency injection, Pydantic request and response models, OpenAPI docs, tests, security, and p… | 9 |
| `affaan-m__ecc/skill/golang-testing` | > Go testing best practices including table-driven tests, test helpers, benchmarking, race detection, coverage analysis, and inte… | 6 |
| `affaan-m__ecc/skill/google-workspace-ops` | Operate across Google Drive, Docs, Sheets, and Slides as one workflow surface for plans, trackers, decks, and shared documents. U… | 3 |
| `affaan-m__ecc/skill/laravel-patterns` | Patrones de arquitectura Laravel, routing/controladores, Eloquent ORM, capas de servicio, colas, eventos, caché y API resources p… | 11 |
| `affaan-m__ecc/skill/laravel-security` | Buenas prácticas de seguridad en Laravel para autenticación/autorización, validación, CSRF, asignación masiva, subida de archivos… | 8 |
| `affaan-m__ecc/skill/laravel-tdd` | Desarrollo guiado por pruebas para Laravel con PHPUnit y Pest, factories, pruebas de base de datos, fakes y objetivos de cobertur… | 8 |
| `affaan-m__ecc/skill/laravel-verification` | Bucle de verificación para proyectos Laravel: verificaciones de entorno, linting, análisis estático, pruebas con cobertura, escan… | 5 |
| `affaan-m__ecc/skill/mcp-server-patterns` | Build MCP servers with Node/TypeScript SDK — tools, resources, prompts, Zod validation, stdio vs Streamable HTTP. Use Context7 or… | 4 |
| `affaan-m__ecc/skill/project-guidelines-example` | Project-specific skill template covering architecture, patterns, testing, and deployment guidance. | 11 |
| `affaan-m__ecc/skill/python-testing` | > Python testing best practices using pytest including fixtures, parametrization, mocking, coverage analysis, async testing, and … | 11 |
| `affaan-m__ecc/skill/quarkus-patterns` | Patrones de arquitectura Quarkus 3.x LTS con Camel para mensajería, diseño de API RESTful, servicios CDI, acceso a datos con Pana… | 15 |
| `affaan-m__ecc/skill/quarkus-security` | Buenas prácticas de seguridad en Quarkus para autenticación, autorización, JWT/OIDC, RBAC, validación de entrada, CSRF, gestión d… | 10 |
| `affaan-m__ecc/skill/quarkus-tdd` | Desarrollo guiado por pruebas para Quarkus 3.x LTS usando JUnit 5, Mockito, REST Assured, pruebas Camel y JaCoCo. Usar al agregar… | 14 |
| `affaan-m__ecc/skill/quarkus-verification` | Bucle de verificación para proyectos Quarkus: build, análisis estático, pruebas con cobertura, escaneos de seguridad, compilación… | 9 |
| `affaan-m__ecc/skill/react-patterns` | React 18/19 patterns including hooks discipline, server/client component boundaries, Suspense + error boundaries, form actions, d… | 11 |
| `affaan-m__ecc/skill/react-performance` | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/ve… | 18 |
| `affaan-m__ecc/skill/react-testing` | React component testing with React Testing Library, Vitest/Jest, MSW for network mocking, accessibility assertions with axe, and … | 13 |
| `affaan-m__ecc/skill/scholar-evaluation` | Structured scholarly-work evaluation for papers, proposals, literature reviews, methods sections, evidence quality, citation supp… | 5 |
| `affaan-m__ecc/skill/search-first` | > Research-before-coding workflow. Search for existing tools, libraries, and patterns before writing custom code. Systematizes th… | 8 |
| `affaan-m__ecc/skill/springboot-tdd` | Desarrollo guiado por pruebas para Spring Boot usando JUnit 5, Mockito, MockMvc, Testcontainers y JaCoCo. Usar al agregar funcion… | 4 |
| `affaan-m__ecc/skill/springboot-verification` | Bucle de verificación para proyectos Spring Boot: build, análisis estático, pruebas con cobertura, escaneos de seguridad y revisi… | 6 |
| `affaan-m__ecc/skill/tdd-workflow` | Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage i… | 13 |
| `AgriciDaniel__claude-seo/skill/seo-cluster` | > SERP-based semantic topic clustering for content architecture planning. Groups keywords by actual Google SERP overlap (not text… | 50 |
| `AgriciDaniel__claude-seo/skill/seo-content-brief` | > Generate competitive SEO content briefs with per-section word counts, competitor scoring, keyword density guidance, and page-ty… | 24 |
| `AgriciDaniel__claude-seo/skill/seo-image-gen` | AI image generation for SEO assets: OG/social preview images, blog hero images, schema images, product photography, infographics.… | 9 |
| `anthropics__skills/skill/docx` | Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx… | 1125 |
| `anthropics__skills/skill/theme-factory` | Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 1… | 141 |
| `mattpocock__skills/skill/grill-with-docs` | A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go. | 1 |
| `mattpocock__skills/skill/writing-beats` | Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it. | 5 |
| `mattpocock__skills/skill/writing-for-agents` | Reference for writing any document an agent consumes — a skill, an AGENTS.md / CLAUDE.md, a doc reached by a pointer. The packagi… | 14 |
| `mattpocock__skills/skill/writing-fragments` | Writing, explore — mine raw fragments, no structure yet. | 4 |
| `mattpocock__skills/skill/writing-shape` | Writing, exploit — shape raw material into an article, paragraph by paragraph. | 6 |

