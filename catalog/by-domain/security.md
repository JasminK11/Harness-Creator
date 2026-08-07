# Domäne: security

80 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (34)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/code-reviewer` | Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing… | 9 |
| `affaan-m__ecc/agent/csharp-reviewer` | Expert C# code reviewer specializing in .NET conventions, async patterns, security, nullable reference types, and performance. Us… | 6 |
| `affaan-m__ecc/agent/database-reviewer` | PostgreSQL database specialist for query optimization, schema design, security, and performance. Use PROACTIVELY when writing SQL… | 4 |
| `affaan-m__ecc/agent/django-reviewer` | Expert Django code reviewer specializing in ORM correctness, DRF patterns, migration safety, security misconfigurations, and prod… | 5 |
| `affaan-m__ecc/agent/fastapi-reviewer` | Reviews FastAPI applications for async correctness, dependency injection, Pydantic schemas, security, OpenAPI quality, testing, a… | 3 |
| `affaan-m__ecc/agent/java-reviewer` | Expert Java code reviewer for Spring Boot and Quarkus projects. Automatically detects the framework and applies the appropriate r… | 5 |
| `affaan-m__ecc/agent/network-config-reviewer` | Reviews router and switch configurations for security, correctness, stale references, risky change-window commands, and missing o… | 4 |
| `affaan-m__ecc/agent/php-reviewer` | Expert PHP code reviewer specializing in PSR-12 compliance, PHP type system, Eloquent ORM patterns, security, and performance. Us… | 6 |
| `affaan-m__ecc/agent/python-reviewer` | Expert Python code reviewer specializing in PEP 8 compliance, Pythonic idioms, type hints, security, and performance. Use for all… | 3 |
| `affaan-m__ecc/agent/react-reviewer` | Expert React/JSX code reviewer specializing in hook correctness, render performance, server/client component boundaries, accessib… | 5 |
| `affaan-m__ecc/agent/security-reviewer` | Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authenti… | 4 |
| `affaan-m__ecc/agent/typescript-reviewer` | Expert TypeScript/JavaScript code reviewer specializing in type safety, async correctness, Node/web security, and idiomatic patte… | 7 |
| `affaan-m__ecc/agent/vue-reviewer` | Expert Vue.js code reviewer specializing in Composition API correctness, reactivity pitfalls, component architecture, template se… | 15 |
| `AgriciDaniel__claude-seo/agent/seo-technical` | Technical SEO specialist. Analyzes crawlability, indexability, security, URL structure, mobile optimization, Core Web Vitals, and… | 3 |
| `msitarzewski__agency-agents/agent/ai-generated-code-security-auditor` | Security reviewer for AI-generated and vibe-coded apps — hunts the hardcoded secrets, broken row-level security, and prompt-injec… | 17 |
| `msitarzewski__agency-agents/agent/api-platform-engineer` | Expert API platform engineer for public and partner APIs — contract-first design (OpenAPI/gRPC), versioning and deprecation polic… | 13 |
| `msitarzewski__agency-agents/agent/application-security-engineer` | AppSec specialist who secures the software development lifecycle through threat modeling, secure code review, SAST/DAST integrati… | 25 |
| `msitarzewski__agency-agents/agent/autonomous-optimization-architect` | Intelligent system governor that continuously shadow-tests APIs for performance while enforcing strict financial and security gua… | 8 |
| `msitarzewski__agency-agents/agent/blockchain-security-auditor` | Expert smart contract security auditor specializing in vulnerability detection, formal verification, exploit analysis, and compre… | 21 |
| `msitarzewski__agency-agents/agent/cloud-security-architect` | Cloud-native security specialist designing zero trust architectures, implementing defense-in-depth across AWS, Azure, and GCP, an… | 23 |
| `msitarzewski__agency-agents/agent/code-reviewer` | Expert code reviewer who provides constructive, actionable feedback focused on correctness, maintainability, security, and perfor… | 3 |
| `msitarzewski__agency-agents/agent/compliance-auditor` | Expert technical compliance auditor specializing in SOC 2, ISO 27001, HIPAA, and PCI-DSS audits — from readiness assessment throu… | 7 |
| `msitarzewski__agency-agents/agent/fedramp-rmf-compliance-engineer` | Expert FedRAMP and NIST Risk Management Framework compliance engineer specializing in both FedRAMP authorization pathways — the t… | 32 |
| `msitarzewski__agency-agents/agent/incident-responder` | Digital forensics and incident response specialist who leads breach investigations, contains active threats, coordinates crisis r… | 24 |
| `msitarzewski__agency-agents/agent/infrastructure-maintainer` | Expert infrastructure specialist focused on system reliability, performance optimization, and technical operations management. Ma… | 22 |
| `msitarzewski__agency-agents/agent/penetration-tester` | Offensive security specialist conducting authorized penetration tests, red team operations, and vulnerability assessments across … | 21 |
| `msitarzewski__agency-agents/agent/roblox-systems-scripter` | Roblox platform engineering specialist - Masters Luau, the client-server security model, RemoteEvents/RemoteFunctions, DataStore,… | 15 |
| `msitarzewski__agency-agents/agent/rust-refactoring-specialist` | Expert Rust engineer for repository-scale refactoring, safe renames, module restructuring, duplication removal, panic hardening, … | 15 |
| `msitarzewski__agency-agents/agent/secrets-credential-hygiene-engineer` | Owns the full lifecycle of secrets and credentials — detection, prevention, vaulting, rotation, and leak response — so an applica… | 13 |
| `msitarzewski__agency-agents/agent/security-architect` | Expert security architect specializing in threat modeling, secure-by-design architecture, trust-boundary analysis, defense-in-dep… | 18 |
| `msitarzewski__agency-agents/agent/senior-secops-engineer` | Defensive application security specialist who scans every code submission for secrets and sensitive data exposure before anything… | 31 |
| `msitarzewski__agency-agents/agent/solidity-smart-contract-engineer` | Expert Solidity developer specializing in EVM smart contract architecture, gas optimization, upgradeable proxy patterns, DeFi pro… | 21 |
| `msitarzewski__agency-agents/agent/threat-detection-engineer` | Expert detection engineer specializing in SIEM rule development, MITRE ATT&CK coverage mapping, threat hunting, alert tuning, and… | 24 |
| `msitarzewski__agency-agents/agent/threat-intelligence-analyst` | Cyber threat intelligence specialist who tracks adversary groups, maps attack campaigns to MITRE ATT&CK, produces actionable inte… | 28 |

## command (10)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/code-review` | Review code for quality, security, and maintainability | 2 |
| `affaan-m__ecc/command/cpp-review` | Comprehensive C++ code review for memory safety, modern C++ idioms, concurrency, and security. Invokes the cpp-reviewer agent. | 3 |
| `affaan-m__ecc/command/fastapi-review` | Review a FastAPI application for architecture, async correctness, dependency injection, Pydantic schemas, security, performance, … | 1 |
| `affaan-m__ecc/command/flutter-review` | Review Flutter/Dart code for idiomatic patterns, widget best practices, state management, performance, accessibility, and securit… | 4 |
| `affaan-m__ecc/command/kotlin-review` | Comprehensive Kotlin code review for idiomatic patterns, null safety, coroutine safety, and security. Invokes the kotlin-reviewer… | 4 |
| `affaan-m__ecc/command/python-review` | Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer age… | 7 |
| `affaan-m__ecc/command/react-review` | Comprehensive React/JSX code review for hook correctness, render performance, server/client component boundaries, accessibility, … | 6 |
| `affaan-m__ecc/command/security` | Run comprehensive security review | 2 |
| `affaan-m__ecc/command/security-scan` | Run AgentShield against agent, hook, MCP, permission, and secret surfaces. | 3 |
| `affaan-m__ecc/command/vue-review` | Comprehensive Vue.js code review for Composition API correctness, reactivity, composable patterns, template security, accessibili… | 6 |

## hook (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/governance-capture` | !/usr/bin/env node | 9 |
| `affaan-m__ecc/hook/insaits-security-monitor` | !/usr/bin/env python3 | 8 |
| `affaan-m__ecc/hook/insaits-security-wrapper` | !/usr/bin/env node | 4 |

## plugin (1)

| ID | Beschreibung | KB |
|---|---|---:|
| `AgriciDaniel__claude-seo/plugin/claude-seo` | Comprehensive SEO analysis plugin for Claude Code. 25 sub-skills (21 core + 1 orchestrator + 1 framework + 2 extension mirrors) a… | 4119 |

## skill (32)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/defi-amm-security` | Security checklist for Solidity AMM contracts, liquidity pools, and swap flows. Covers reentrancy, CEI ordering, donation or infl… | 5 |
| `affaan-m__ecc/skill/django-security` | Django security best practices, authentication, authorization, CSRF protection, SQL injection prevention, XSS prevention, and sec… | 16 |
| `affaan-m__ecc/skill/django-verification` | Verification loop for Django projects: migrations, linting, tests with coverage, security scans, and deployment readiness checks … | 11 |
| `affaan-m__ecc/skill/docker-patterns` | > Docker and Docker Compose patterns for local development, container security, networking, volume strategies, and multi-service … | 8 |
| `affaan-m__ecc/skill/enterprise-agent-ops` | Operate long-lived agent workloads with observability, security boundaries, and lifecycle management. | 1 |
| `affaan-m__ecc/skill/fastapi-patterns` | FastAPI patterns for async APIs, dependency injection, Pydantic request and response models, OpenAPI docs, tests, security, and p… | 9 |
| `affaan-m__ecc/skill/flutter-dart-code-review` | Library-agnostic Flutter/Dart code review checklist covering widget best practices, state management patterns (BLoC, Riverpod, Pr… | 23 |
| `affaan-m__ecc/skill/github-ops` | GitHub repository operations, automation, and management. Issue triage, PR management, CI/CD operations, release management, and … | 5 |
| `affaan-m__ecc/skill/hipaa-compliance` | HIPAA-specific entrypoint for healthcare privacy and security work. Use when a task is explicitly framed around HIPAA, PHI handli… | 4 |
| `affaan-m__ecc/skill/intent-driven-development` | Turn ambiguous or high-impact product and engineering changes into scoped, verifiable acceptance criteria before or alongside imp… | 17 |
| `affaan-m__ecc/skill/kubernetes-patterns` | Kubernetes workload patterns, resource management, RBAC, probes, autoscaling, ConfigMap/Secret handling, and kubectl debugging fo… | 20 |
| `affaan-m__ecc/skill/laravel-security` | Buenas prácticas de seguridad en Laravel para autenticación/autorización, validación, CSRF, asignación masiva, subida de archivos… | 8 |
| `affaan-m__ecc/skill/llm-trading-agent-security` | Security patterns for autonomous trading agents with wallet or transaction authority. Covers prompt injection, spend limits, pre-… | 4 |
| `affaan-m__ecc/skill/mle-workflow` | Production machine-learning engineering workflow for data contracts, reproducible training, model evaluation, deployment, monitor… | 22 |
| `affaan-m__ecc/skill/network-config-validation` | Pre-deployment checks for router and switch configuration, including dangerous commands, duplicate addresses, subnet overlaps, st… | 7 |
| `affaan-m__ecc/skill/perl-security` | Comprehensive Perl security covering taint mode, input validation, safe process execution, DBI parameterized queries, web securit… | 13 |
| `affaan-m__ecc/skill/postgres-patterns` | > PostgreSQL database patterns for query optimization, schema design, indexing, and security. Quick reference for common patterns… | 4 |
| `affaan-m__ecc/skill/prediction-market-risk-review` | Review prediction-market, basket, oracle, and trading-agent workflows for compliance, safety, data-quality, privacy, and executio… | 2 |
| `affaan-m__ecc/skill/quarkus-security` | Buenas prácticas de seguridad en Quarkus para autenticación, autorización, JWT/OIDC, RBAC, validación de entrada, CSRF, gestión d… | 10 |
| `affaan-m__ecc/skill/security-bounty-hunter` | Hunt for exploitable, bounty-worthy security issues in repositories. Focuses on remotely reachable vulnerabilities that qualify f… | 3 |
| `affaan-m__ecc/skill/security-review` | Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing pay… | 12 |
| `affaan-m__ecc/skill/security-scan` | Scan your Claude Code configuration (.claude/ directory) for security vulnerabilities, misconfigurations, and injection risks usi… | 4 |
| `affaan-m__ecc/skill/springboot-security` | Spring Security best practices for authn/authz, validation, CSRF, secrets, headers, rate limiting, and dependency security in Jav… | 8 |
| `affaan-m__ecc/skill/token-budget-advisor` | >- Offers the user an informed choice about how much response depth to consume before answering. Use this skill when the user exp… | 6 |
| `affaan-m__ecc/skill/x-api` | X/Twitter API integration for posting tweets, threads, reading timelines, search, and analytics. Covers OAuth auth patterns, rate… | 7 |
| `AgriciDaniel__claude-seo/skill/seo-technical` | > Technical SEO audit across 9 categories: crawlability, indexability, security, URL structure, mobile, Core Web Vitals, structur… | 22 |
| `mattpocock__skills/skill/writing-beats` | Writing, exploit — assemble raw material into a journey of beats, grounding each term before a beat leans on it. | 5 |
| `mattpocock__skills/skill/writing-shape` | Writing, exploit — shape raw material into an article, paragraph by paragraph. | 6 |
| `usestrix__strix/skill/ci-security-scanning-with-strix` | Add security scanning to CI/CD with Strix — GitHub Actions, GitLab CI, or any pipeline — so every pull request gets a diff-scoped… | 8 |
| `usestrix__strix/skill/fix-security-vulnerabilities-with-strix` | Fix security vulnerabilities found by a Strix pentest (open-source CLI or app.strix.ai cloud) — triage by severity, patch the roo… | 6 |
| `usestrix__strix/skill/managed-pentesting-with-strix` | Run a managed pentest of a web app or API through the app.strix.ai REST API — no local Docker, LLM key, or install needed. Create… | 8 |
| `usestrix__strix/skill/penetration-testing-with-strix` | Pentest a web app, API, codebase, repository, URL, domain, or IP with Strix — autonomous AI penetration testing that exploits and… | 8 |

