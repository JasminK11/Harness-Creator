# Domäne: testing

85 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (21)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/e2e-runner` | End-to-end testing specialist using Vercel Agent Browser (preferred) with Playwright fallback. Use PROACTIVELY for generating, ma… | 4 |
| `affaan-m__ecc/agent/gan-evaluator` | GAN Harness — Evaluator agent. Tests the live running application via Playwright, scores against rubric, and provides actionable … | 8 |
| `affaan-m__ecc/agent/pr-test-analyzer` | Review pull request test coverage quality and completeness, with emphasis on behavioral coverage and real bug prevention. | 2 |
| `affaan-m__ecc/agent/rag-pipeline-reviewer` | Reviews RAG (Retrieval-Augmented Generation) pipelines for retrieval quality, chunking strategy, embedding choices, and evaluatio… | 6 |
| `affaan-m__ecc/agent/spec-miner` | Extracts behavioral specs from existing codebases for OpenSpec. Produces flat Requirement and Invariant blocks with structured me… | 15 |
| `affaan-m__ecc/agent/tdd-guide` | Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bug… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-visual` | Visual analyzer. Captures screenshots, tests mobile rendering, and analyzes above-the-fold content using Playwright. | 2 |
| `anthropics__claude-plugins-official/agent/agent-creator` | / Use this agent when the user asks to "create an agent", "generate an agent", "build a new agent", "make me an agent that...", o… | 7 |
| `anthropics__claude-plugins-official/agent/pr-test-analyzer` | Use this agent when you need to review a pull request for test coverage quality and completeness. This agent should be invoked af… | 4 |
| `anthropics__claude-plugins-official/agent/test-engineer` | Writes characterization, contract, and equivalence tests that pin down legacy behavior so transformation can be proven correct. U… | 3 |
| `msitarzewski__agency-agents/agent/carousel-growth-engine` | Autonomous TikTok and Instagram carousel generation specialist. Analyzes any website URL with Playwright, generates viral 6-slide… | 14 |
| `msitarzewski__agency-agents/agent/civil-engineer` | Expert civil and structural engineer with global standards coverage — Eurocode, DIN, ACI, AISC, ASCE, AS/NZS, CSA, GB, IS, AIJ, a… | 17 |
| `msitarzewski__agency-agents/agent/evidence-collector` | Screenshot-obsessed, fantasy-allergic QA specialist - Default to finding 3-5 issues, requires visual proof for everything | 8 |
| `msitarzewski__agency-agents/agent/gis-qa-engineer` | Quality assurance specialist who validates geospatial data integrity — topology checks, metadata audits, CRS consistency, accurac… | 5 |
| `msitarzewski__agency-agents/agent/model-qa-specialist` | Independent model QA expert who audits ML and statistical models end-to-end - from documentation review and data reconstruction t… | 20 |
| `msitarzewski__agency-agents/agent/study-abroad-advisor` | Full-spectrum study abroad planning expert covering the US, UK, Canada, Australia, Europe, Hong Kong, and Singapore — proficient … | 17 |
| `msitarzewski__agency-agents/agent/test-automation-engineer` | Expert end-to-end test automation engineer for Playwright and Cypress — resilient selectors, flake elimination, isolated test dat… | 12 |
| `msitarzewski__agency-agents/agent/test-results-analyzer` | Expert test analysis specialist focused on comprehensive test result evaluation, quality metrics analysis, and actionable insight… | 14 |
| `msitarzewski__agency-agents/agent/threat-detection-engineer` | Expert detection engineer specializing in SIEM rule development, MITRE ATT&CK coverage mapping, threat hunting, alert tuning, and… | 24 |
| `msitarzewski__agency-agents/agent/workflow-architect` | Workflow design specialist who maps complete workflow trees for every system, user journey, and agent interaction — covering happ… | 26 |
| `nextlevelbuilder__ui-ux-pro-max-skill/agent/design-review` | >- Expert design reviewer for web UI. Use PROACTIVELY after any front-end change and before calling UI work complete, or when the… | 4 |

## command (13)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/cpp-test` | Enforce TDD workflow for C++. Write GoogleTest tests first, then implement. Verify coverage with gcov/lcov. | 6 |
| `affaan-m__ecc/command/e2e` | Generate and run E2E tests with Playwright | 2 |
| `affaan-m__ecc/command/flutter-test` | Run Flutter/Dart tests, report failures, and incrementally fix test issues. Covers unit, widget, golden, and integration tests. | 4 |
| `affaan-m__ecc/command/go-test` | Go TDD workflow with table-driven tests | 2 |
| `affaan-m__ecc/command/kotlin-test` | Enforce TDD workflow for Kotlin. Write Kotest tests first, then implement. Verify 80%+ coverage with Kover. | 7 |
| `affaan-m__ecc/command/orch-add-feature` | Orchestrate building a brand-new feature end to end — research, plan, TDD, review, gated commit. Wrapper that kicks off the orch-… | 1 |
| `affaan-m__ecc/command/orch-build-mvp` | Orchestrate bootstrapping a working MVP from a design/spec doc — ingest, slice, scaffold, TDD, review, gated commit (reuses the G… | 1 |
| `affaan-m__ecc/command/orch-fix-defect` | Orchestrate fixing a bug — reproduce it as a failing regression test, fix to green, review, gated commit. Wrapper for the orch-fi… | 1 |
| `affaan-m__ecc/command/react-test` | Enforce TDD workflow for React. Write React Testing Library tests first (behavior-focused, accessibility-first), then implement c… | 7 |
| `affaan-m__ecc/command/rust-test` | Rust TDD workflow with unit and property tests | 2 |
| `affaan-m__ecc/command/tdd` | Enforce TDD workflow with 80%+ coverage | 2 |
| `affaan-m__ecc/command/test-coverage` | Analyze and improve test coverage | 2 |
| `anthropics__claude-plugins-official/command/modernize-uplift` | Same-stack version uplift (e.g. .NET Framework 4.8 → .NET 8) — preserve the code, fix the version deltas, prove equivalence by ru… | 24 |

## hook (5)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/check-console-log` | Stop Hook: Check for console.log statements in modified files | 2 |
| `affaan-m__ecc/hook/post-bash-build-complete` | ignore parse errors and pass through | 1 |
| `affaan-m__ecc/hook/post-bash-pr-created` | ignore parse errors and pass through | 2 |
| `affaan-m__ecc/hook/pre-bash-git-push-reminder` | ignore parse errors and pass through | 2 |
| `anthropics__claude-plugins-official/hook/gitutil` | Leaf git/subprocess helpers and diff parsing for the security-guidance plugin. | 34 |

## plugin (4)

| ID | Beschreibung | KB |
|---|---|---:|
| `anthropics__claude-plugins-official/plugin/fakechat` | Localhost iMessage-style web chat for Claude Code — test surface with file upload and edits. No tokens, no access control. | 42 |
| `anthropics__claude-plugins-official/plugin/playwright` | Browser automation and end-to-end testing MCP server by Microsoft. Enables Claude to interact with web pages, take screenshots, f… | 1 |
| `anthropics__claude-plugins-official/plugin/skill-creator` | Create new skills, improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, up… | 231 |
| `mattpocock__skills/plugin/mattpocock-skills` | Matt Pocock's agent skills for real engineering: grilling, spec/ticket flows, TDD, code review, domain modelling and more. Plug-a… | 646 |

## skill (42)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/agent-architecture-audit` | Full-stack diagnostic for agent and LLM applications. Audits the 12-layer agent stack for wrapper regression, memory pollution, t… | 10 |
| `affaan-m__ecc/skill/ai-regression-testing` | Regression testing strategies for AI-assisted development. Sandbox-mode API testing without database dependencies, automated bug-… | 11 |
| `affaan-m__ecc/skill/browser-qa` | Use this skill to automate visual testing and UI interaction verification using browser automation after deploying features. | 4 |
| `affaan-m__ecc/skill/bun-runtime` | Bun as runtime, package manager, bundler, and test runner. When to choose Bun vs Node, migration notes, and Vercel support. | 3 |
| `affaan-m__ecc/skill/cpp-testing` | Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding cover… | 9 |
| `affaan-m__ecc/skill/csharp-testing` | C# and .NET testing patterns with xUnit, FluentAssertions, mocking, integration tests, and test organization best practices. Use … | 9 |
| `affaan-m__ecc/skill/dev-team` | Simulate a collaborative dev team session where multiple role-based personas (PM, Architect, Developer, QA) respond to the same p… | 8 |
| `affaan-m__ecc/skill/django-tdd` | Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework … | 21 |
| `affaan-m__ecc/skill/django-verification` | Verification loop for Django projects: migrations, linting, tests with coverage, security scans, and deployment readiness checks … | 11 |
| `affaan-m__ecc/skill/e2e-testing` | Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strateg… | 8 |
| `affaan-m__ecc/skill/fsharp-testing` | F# testing patterns with xUnit, FsUnit, Unquote, FsCheck property-based testing, integration tests, and test organization best pr… | 8 |
| `affaan-m__ecc/skill/golang-testing` | > Go testing best practices including table-driven tests, test helpers, benchmarking, race detection, coverage analysis, and inte… | 6 |
| `affaan-m__ecc/skill/healthcare-eval-harness` | Patient safety evaluation harness for healthcare application deployments. Automated test suites for CDSS accuracy, PHI exposure, … | 8 |
| `affaan-m__ecc/skill/kotlin-testing` | Kotlin testing patterns with Kotest, MockK, coroutine testing, property-based testing, and Kover coverage. Follows TDD methodolog… | 20 |
| `affaan-m__ecc/skill/laravel-tdd` | Desarrollo guiado por pruebas para Laravel con PHPUnit y Pest, factories, pruebas de base de datos, fakes y objetivos de cobertur… | 8 |
| `affaan-m__ecc/skill/orch-add-feature` | Orchestrate building a brand-new feature end to end — research, plan, TDD implementation, review, and gated commit — by delegatin… | 2 |
| `affaan-m__ecc/skill/orch-build-mvp` | Orchestrate bootstrapping a working MVP from a design or spec document — ingest the doc, plan thin vertical slices, scaffold the … | 2 |
| `affaan-m__ecc/skill/orch-fix-defect` | Orchestrate fixing a bug — reproduce it as a failing regression test, fix to green, review, and gated commit — by delegating each… | 2 |
| `affaan-m__ecc/skill/orch-pipeline` | Shared orchestration engine for the orch-* skill family. Defines the gated Research-Plan-TDD-Review-Commit pipeline, the size cla… | 6 |
| `affaan-m__ecc/skill/perl-testing` | Perl testing patterns using Test2::V0, Test::More, prove runner, mocking, coverage with Devel::Cover, and TDD methodology. Use wh… | 11 |
| `affaan-m__ecc/skill/product-lens` | Use this skill to validate the "why" before building, run product diagnostics, and pressure-test product direction before the req… | 3 |
| `affaan-m__ecc/skill/python-testing` | > Python testing best practices using pytest including fixtures, parametrization, mocking, coverage analysis, async testing, and … | 11 |
| `affaan-m__ecc/skill/quarkus-tdd` | Desarrollo guiado por pruebas para Quarkus 3.x LTS usando JUnit 5, Mockito, REST Assured, pruebas Camel y JaCoCo. Usar al agregar… | 14 |
| `affaan-m__ecc/skill/react-testing` | React component testing with React Testing Library, Vitest/Jest, MSW for network mocking, accessibility assertions with axe, and … | 13 |
| `affaan-m__ecc/skill/rust-testing` | Rust testing patterns including unit tests, integration tests, async testing, property-based testing, mocking, and coverage. Foll… | 11 |
| `affaan-m__ecc/skill/springboot-tdd` | Desarrollo guiado por pruebas para Spring Boot usando JUnit 5, Mockito, MockMvc, Testcontainers y JaCoCo. Usar al agregar funcion… | 4 |
| `affaan-m__ecc/skill/swift-protocol-di-testing` | Protocol-based dependency injection for testable Swift code — mock file system, network, and external APIs using focused protocol… | 6 |
| `affaan-m__ecc/skill/tdd-workflow` | Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage i… | 13 |
| `affaan-m__ecc/skill/ui-demo` | Record polished UI demo videos using Playwright. Use when the user asks to create a demo, walkthrough, screen recording, or tutor… | 15 |
| `affaan-m__ecc/skill/windows-desktop-e2e` | E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. Use when wr… | 30 |
| `AgriciDaniel__claude-seo/skill/seo-drift` | > SEO drift monitoring: capture baselines of SEO-critical elements, detect changes, and track regressions over time. Git for SEO:… | 12 |
| `AgriciDaniel__claude-seo/skill/seo-profound` | Profound LLM citation tracker (extension). Time-series brand citation rates across ChatGPT, Perplexity, and other LLMs. Pairs wit… | 2 |
| `anthropics__claude-plugins-official/skill/skill-creator` | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from … | 220 |
| `anthropics__skills/skill/skill-creator` | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from … | 220 |
| `anthropics__skills/skill/webapp-testing` | Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debu… | 22 |
| `mattpocock__skills/skill/grilling` | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any '… | 2 |
| `mattpocock__skills/skill/migrate-to-shoehorn` | Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to replace `as… | 3 |
| `mattpocock__skills/skill/tdd` | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or want… | 7 |
| `usestrix__strix/skill/api-security-testing` | Security-test a REST, GraphQL, or gRPC API with Strix — autonomous agents that enumerate endpoints from an OpenAPI/GraphQL schema… | 6 |
| `usestrix__strix/skill/application-security-testing` | Application security testing (AppSec) across a whole product with Strix — decide which asset needs which test (source code, runni… | 4 |
| `usestrix__strix/skill/owasp-top-10-testing` | Test an application against the OWASP Top 10 with Strix — autonomous AI agents that attempt real exploits for each category of th… | 6 |
| `usestrix__strix/skill/web-app-penetration-testing` | Pentest a web app or website end to end — black-box testing of a live URL, staging environment, or local dev server that finds an… | 4 |

