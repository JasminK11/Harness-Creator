# Domäne: testing

120 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (17)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/e2e-runner` | End-to-end testing specialist using Vercel Agent Browser (preferred) with Playwright fallback. Use PROACTIVELY for generating, ma… | 4 |
| `affaan-m__ecc/agent/gan-evaluator` | GAN Harness — Evaluator agent. Tests the live running application via Playwright, scores against rubric, and provides actionable … | 8 |
| `affaan-m__ecc/agent/pr-test-analyzer` | Review pull request test coverage quality and completeness, with emphasis on behavioral coverage and real bug prevention. | 2 |
| `affaan-m__ecc/agent/spec-miner` | Extracts behavioral specs from existing codebases for OpenSpec. Produces flat Requirement and Invariant blocks with structured me… | 15 |
| `affaan-m__ecc/agent/tdd-guide` | Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bug… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-visual` | Visual analyzer. Captures screenshots, tests mobile rendering, and analyzes above-the-fold content using Playwright. | 2 |
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
| `nextlevelbuilder__ui-ux-pro-max-skill/agent/design-review` | >- Expert design reviewer for web UI. Use PROACTIVELY after any front-end change and before calling UI work complete, or when the… | 5 |

## command (12)

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

## hook (62)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/after-shell-execution` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/auto-tmux-dev-test` | Check if tmux is available for conditional tests | 5 |
| `affaan-m__ecc/hook/bash-hook-dispatcher-test` | A pass-through command (no sub-hook adds context) must NOT echo the | 6 |
| `affaan-m__ecc/hook/before-read-file` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/before-tab-file-read` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/block-no-verify-test` | --- Basic allow/block --- | 10 |
| `affaan-m__ecc/hook/check-console-log` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/check-hook-enabled-test` | Remove potentially interfering env vars unless explicitly set | 3 |
| `affaan-m__ecc/hook/config-protection-test` | best-effort cleanup | 12 |
| `affaan-m__ecc/hook/continuous-learning-observe-runner-test` | — | 7 |
| `affaan-m__ecc/hook/continuous-learning-shebang-consistency-test` | Skip hidden/runtime directories (e.g. the observer's `.observer-tmp`) | 3 |
| `affaan-m__ecc/hook/cost-tracker-test` | 1. Passes through input on stdout | 14 |
| `affaan-m__ecc/hook/cursor-block-no-verify-test` | --- Cursor input shapes --- | 5 |
| `affaan-m__ecc/hook/design-quality-check-test` | — | 3 |
| `affaan-m__ecc/hook/detect-project-nongit-test` | Skip on Windows — these tests invoke bash scripts directly | 9 |
| `affaan-m__ecc/hook/detect-project-worktree-test` | Skip on Windows — these tests invoke bash scripts directly | 10 |
| `affaan-m__ecc/hook/doc-file-warning-test` | !/usr/bin/env node | 11 |
| `affaan-m__ecc/hook/ecc-context-monitor-test` | Test helper | 9 |
| `affaan-m__ecc/hook/ecc-metrics-bridge-test` | Test helper | 17 |
| `affaan-m__ecc/hook/ecc-statusline-test` | Test helper | 5 |
| `affaan-m__ecc/hook/evaluate-session-test` | Test helpers | 16 |
| `affaan-m__ecc/hook/gateguard-fact-force-test` | Use a fixed session ID so test process and spawned hook process share the same state file | 90 |
| `affaan-m__ecc/hook/governance-capture-test` | ── detectSecrets ────────────────────────────────────────── | 14 |
| `affaan-m__ecc/hook/hook-flags-test` | Import the module | 20 |
| `affaan-m__ecc/hook/hooks-test` | Fall back to common Git Bash path shapes when cygpath is unavailable. | 271 |
| `affaan-m__ecc/hook/insaits-security-monitor-test` | — | 7 |
| `affaan-m__ecc/hook/insaits-security-wrapper-test` | — | 5 |
| `affaan-m__ecc/hook/mcp-health-check-test` | Windows-only: child_process.spawn cannot resolve .cmd/.bat shims for | 42 |
| `affaan-m__ecc/hook/migrate-homunculus-home-escape-test` | migrate-homunculus.sh and this test's assertions rely on POSIX bash, sed, and | 5 |
| `affaan-m__ecc/hook/observe-entrypoint-allowlist-test` | ignore | 4 |
| `affaan-m__ecc/hook/observe-signal-counter-race-test` | ignore cleanup errors | 9 |
| `affaan-m__ecc/hook/observe-signal-timeout-test` | Extract each `_clv2_bail` handler body: the `def` line plus the indented lines | 7 |
| `affaan-m__ecc/hook/observe-subdirectory-detection-test` | — | 8 |
| `affaan-m__ecc/hook/observer-loop-archive-test` | ignore cleanup errors | 8 |
| `affaan-m__ecc/hook/observer-loop-mktemp-test` | — | 2 |
| `affaan-m__ecc/hook/observer-memory-test` | ignore cleanup errors | 22 |
| `affaan-m__ecc/hook/plan-canvas-sessions-hook-test` | — | 3 |
| `affaan-m__ecc/hook/plugin-hook-bootstrap-test` | Windows-only: PowerShell preference and .sh fallback behaviour. | 12 |
| `affaan-m__ecc/hook/post-bash-build-complete` | !/usr/bin/env node | 1 |
| `affaan-m__ecc/hook/post-bash-hooks-test` | ── post-bash-build-complete.js ────────────────────────────────── | 9 |
| `affaan-m__ecc/hook/post-bash-pr-created` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/posttooluse-dispatcher-test` | — | 17 |
| `affaan-m__ecc/hook/pre-bash-commit-quality-test` | Working tree diverges after staging; hook should still inspect staged content. | 16 |
| `affaan-m__ecc/hook/pre-bash-dev-server-block-test` | --- Blocking tests (non-Windows only) --- | 10 |
| `affaan-m__ecc/hook/pre-bash-git-push-reminder` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/pre-bash-reminders-test` | --- git-push-reminder tests --- | 5 |
| `affaan-m__ecc/hook/pre-bash-tmux-reminder-test` | — | 2 |
| `affaan-m__ecc/hook/pre-compact-test` | Reader built from a path -> content map (returns null for unknown/unreadable). | 5 |
| `affaan-m__ecc/hook/quality-gate-test` | --- run() returns original input for valid JSON --- | 6 |
| `affaan-m__ecc/hook/run-with-flags-truncation-test` | JSON document that exceeds MAX_STDIN so the runner's stdin cap trips. | 6 |
| `affaan-m__ecc/hook/session-activity-tracker-test` | — | 22 |
| `affaan-m__ecc/hook/session-end-test` | Regression: a user message containing $-sequences ($&, $$, $`, $') must be | 4 |
| `affaan-m__ecc/hook/stop-format-typecheck-test` | Use a unique session ID for tests so we don't pollute real sessions | 11 |
| `affaan-m__ecc/hook/stop-hooks-stdout-test` | All registered Stop hooks (hooks/hooks.json). | 11 |
| `affaan-m__ecc/hook/suggest-compact-test` | Test helpers | 35 |
| `affaan-m__ecc/hook/test-insaits-security-monitor` | — | 8 |
| `Egonex-AI__Understand-Anything/hook/post-tool-use-auto-update-test` | — | 5 |
| `multica-ai__multica/hook/use-can-edit-skill-test` | role=null models a member list that hasn't loaded yet or a user who | 2 |
| `multica-ai__multica/hook/use-comment-trigger-preview-test` | Cached agents render immediately for the repeated signature (no | 10 |
| `multica-ai__multica/hook/use-drag-to-scroll` | Kim specced 4–6px. 5 sits in the middle: past the jitter of a real click | 5 |
| `multica-ai__multica/hook/use-file-upload-test` | MUL-3192 — verifies that the URL chosen for markdown persistence is | 8 |
| `multica-ai__multica/hook/use-in-page-find-test` | Text nodes: "foo ", "bar", " foobar". "foo" hits the first and third, | 5 |

## plugin (1)

| ID | Beschreibung | KB |
|---|---|---:|
| `mattpocock__skills/plugin/mattpocock-skills` | Matt Pocock's agent skills for real engineering — grilling, spec/ticket flows, TDD, code review, domain modelling and more. Plug-… | 650 |

## skill (28)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/ai-regression-testing` | AI 支援開発のためのリグレッションテスト戦略。データベース依存なしのサンドボックスモード API テスト、自動化されたバグチェックワークフロー、同じモデルがコードを書いてレビューする AI のブラインドスポットを捕捉するパターン。 | 14 |
| `affaan-m__ecc/skill/browser-qa` | このスキルを使用して、機能をデプロイ後にブラウザ自動化を使用した自動ビジュアルテストとUI相互作用検証を自動化します。 | 3 |
| `affaan-m__ecc/skill/bun-runtime` | Bun as runtime, package manager, bundler, and test runner. When to choose Bun vs Node, migration notes, and Vercel support. | 3 |
| `affaan-m__ecc/skill/cpp-testing` | Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding cover… | 9 |
| `affaan-m__ecc/skill/django-tdd` | Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework … | 22 |
| `affaan-m__ecc/skill/django-verification` | Verification loop for Django projects: migrations, linting, tests with coverage, security scans, and deployment readiness checks … | 13 |
| `affaan-m__ecc/skill/e2e-testing` | Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strateg… | 8 |
| `affaan-m__ecc/skill/golang-testing` | > Go testing best practices including table-driven tests, test helpers, benchmarking, race detection, coverage analysis, and inte… | 6 |
| `affaan-m__ecc/skill/kotlin-testing` | Kotlin testing patterns with Kotest, MockK, coroutine testing, property-based testing, and Kover coverage. Follows TDD methodolog… | 20 |
| `affaan-m__ecc/skill/laravel-tdd` | Desarrollo guiado por pruebas para Laravel con PHPUnit y Pest, factories, pruebas de base de datos, fakes y objetivos de cobertur… | 8 |
| `affaan-m__ecc/skill/orch-add-feature` | Orchestrate building a brand-new feature end to end — research, plan, TDD implementation, review, and gated commit — by delegatin… | 2 |
| `affaan-m__ecc/skill/orch-build-mvp` | Orchestrate bootstrapping a working MVP from a design or spec document — ingest the doc, plan thin vertical slices, scaffold the … | 2 |
| `affaan-m__ecc/skill/orch-fix-defect` | Orchestrate fixing a bug — reproduce it as a failing regression test, fix to green, review, and gated commit — by delegating each… | 2 |
| `affaan-m__ecc/skill/orch-pipeline` | Shared orchestration engine for the orch-* skill family. Defines the gated Research-Plan-TDD-Review-Commit pipeline, the size cla… | 6 |
| `affaan-m__ecc/skill/python-testing` | > Python testing best practices using pytest including fixtures, parametrization, mocking, coverage analysis, async testing, and … | 11 |
| `affaan-m__ecc/skill/quarkus-tdd` | Desarrollo guiado por pruebas para Quarkus 3.x LTS usando JUnit 5, Mockito, REST Assured, pruebas Camel y JaCoCo. Usar al agregar… | 14 |
| `affaan-m__ecc/skill/react-testing` | React component testing with React Testing Library, Vitest/Jest, MSW for network mocking, accessibility assertions with axe, and … | 13 |
| `affaan-m__ecc/skill/rust-testing` | Rust testing patterns including unit tests, integration tests, async testing, property-based testing, mocking, and coverage. Foll… | 11 |
| `affaan-m__ecc/skill/springboot-tdd` | Desarrollo guiado por pruebas para Spring Boot usando JUnit 5, Mockito, MockMvc, Testcontainers y JaCoCo. Usar al agregar funcion… | 4 |
| `affaan-m__ecc/skill/swift-protocol-di-testing` | Protocol-based dependency injection for testable Swift code — mock file system, network, and external APIs using focused protocol… | 6 |
| `affaan-m__ecc/skill/tdd-workflow` | Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage i… | 13 |
| `affaan-m__ecc/skill/ui-demo` | Playwrightを使用して美しいUIデモ動画を録画する。ユーザーがWebアプリのデモ、ウォークスルー、スクリーン録画、またはチュートリアル動画の作成を求める場合に使用する。可視カーソル、自然なリズム、プロフェッショナルな仕上がりのWebM動画を生成する。 | 18 |
| `affaan-m__ecc/skill/windows-desktop-e2e` | E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. | 30 |
| `AgriciDaniel__claude-seo/skill/seo-drift` | > SEO drift monitoring: capture baselines of SEO-critical elements, detect changes, and track regressions over time. Git for SEO:… | 13 |
| `AgriciDaniel__claude-seo/skill/seo-profound` | Profound LLM citation tracker (extension). Time-series brand citation rates across ChatGPT, Perplexity, and other LLMs. Pairs wit… | 2 |
| `anthropics__skills/skill/webapp-testing` | Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debu… | 22 |
| `mattpocock__skills/skill/tdd` | TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, w… | 7 |
| `usestrix__strix/skill/strix-pentest` | Run an autonomous AI penetration test with Strix against a codebase, repository, URL, domain, or IP — either self-hosted with the… | 8 |

