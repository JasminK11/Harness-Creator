# Domäne: seo

61 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (24)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/seo-specialist` | SEO specialist for technical SEO audits, on-page optimization, structured data, Core Web Vitals, and content/keyword mapping. Use… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-backlinks` | Backlink profile analyst using free and paid sources. Fetches data from Moz API, Bing Webmaster Tools, Common Crawl web graphs, a… | 7 |
| `AgriciDaniel__claude-seo/agent/seo-cluster` | > Semantic topic clustering analysis using SERP overlap methodology. Expands seed keywords, performs pairwise SERP comparison, cl… | 4 |
| `AgriciDaniel__claude-seo/agent/seo-content` | Content quality reviewer. Evaluates E-E-A-T signals, readability, content depth, AI citation readiness, and thin content detectio… | 4 |
| `AgriciDaniel__claude-seo/agent/seo-dataforseo` | DataForSEO data analyst. Fetches live SERP data, keyword metrics, backlink profiles, on-page analysis, content analysis, business… | 2 |
| `AgriciDaniel__claude-seo/agent/seo-drift` | > SEO drift analysis agent. Captures baselines of SEO-critical page elements and compares against stored snapshots to detect regr… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-ecommerce` | > E-commerce SEO analyst. Validates product schema, analyzes Google Shopping and Amazon marketplace visibility, identifies pricin… | 4 |
| `AgriciDaniel__claude-seo/agent/seo-flow` | FLOW framework prompt analyst. Reads the target URL, selects relevant FLOW stage prompts, applies them, and returns structured ou… | 2 |
| `AgriciDaniel__claude-seo/agent/seo-geo` | GEO and AI search specialist. Analyzes AI crawler accessibility, llms.txt presence (optional; ignored by Google Search), passage-… | 4 |
| `AgriciDaniel__claude-seo/agent/seo-google` | Google SEO API analyst. Fetches CWV field data via CrUX, indexation status via GSC, and organic traffic via GA4 for enriched audi… | 4 |
| `AgriciDaniel__claude-seo/agent/seo-image-gen` | SEO image analyst. Audits existing OG/social preview images, identifies missing or low-quality images, and creates an image gener… | 2 |
| `AgriciDaniel__claude-seo/agent/seo-local` | Local SEO specialist. Analyzes GBP signals, NAP consistency, citations, reviews, local schema, location page quality, and industr… | 5 |
| `AgriciDaniel__claude-seo/agent/seo-maps` | Maps intelligence specialist. Geo-grid rank tracking, GBP profile auditing, review intelligence, cross-platform NAP verification,… | 5 |
| `AgriciDaniel__claude-seo/agent/seo-performance` | Performance analyzer. Measures and evaluates Core Web Vitals and page load performance. | 4 |
| `AgriciDaniel__claude-seo/agent/seo-schema` | Schema markup expert. Detects, validates, and generates Schema.org structured data in JSON-LD format. | 4 |
| `AgriciDaniel__claude-seo/agent/seo-sitemap` | Sitemap architect. Validates XML sitemaps, generates new ones with industry templates, and enforces quality gates for location pa… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-sxo` | > Search Experience Optimization analyst. Performs SERP backwards analysis to detect page-type mismatches, derives user stories f… | 5 |
| `AgriciDaniel__claude-seo/agent/seo-technical` | Technical SEO specialist. Analyzes crawlability, indexability, security, URL structure, mobile optimization, Core Web Vitals, and… | 3 |
| `AgriciDaniel__claude-seo/agent/seo-visual` | Visual analyzer. Captures screenshots, tests mobile rendering, and analyzes above-the-fold content using Playwright. | 2 |
| `msitarzewski__agency-agents/agent/ai-citation-strategist` | Expert in AI recommendation engine optimization (AEO/GEO) — audits brand visibility across ChatGPT, Claude, Gemini, and Perplexit… | 9 |
| `msitarzewski__agency-agents/agent/baidu-seo-specialist` | Expert Baidu search optimization specialist focused on Chinese search engine ranking, Baidu ecosystem integration, ICP compliance… | 13 |
| `msitarzewski__agency-agents/agent/resume-tailor` | Candidate-side resume optimization specialist who analyzes job descriptions, maps real experience to role requirements, improves … | 11 |
| `msitarzewski__agency-agents/agent/search-query-analyst` | Specialist in search term analysis, negative keyword architecture, and query-to-intent mapping. Turns raw search query data into … | 5 |
| `msitarzewski__agency-agents/agent/seo-specialist` | Expert search engine optimization strategist specializing in technical SEO, content optimization, link authority building, and or… | 21 |

## hook (3)

| ID | Beschreibung | KB |
|---|---|---:|
| `AgriciDaniel__claude-seo/hook/hooks` | — | 1 |
| `AgriciDaniel__claude-seo/hook/run-python-hook` | !/usr/bin/env node | 2 |
| `AgriciDaniel__claude-seo/hook/validate-schema` | !/usr/bin/env python3 | 6 |

## plugin (1)

| ID | Beschreibung | KB |
|---|---|---:|
| `AgriciDaniel__claude-seo/plugin/claude-seo` | Comprehensive SEO analysis plugin for Claude Code. 25 sub-skills (21 core + 1 orchestrator + 1 framework + 2 extension mirrors) a… | 4119 |

## skill (33)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/seo` | テクニカル SEO、オンページ最適化、構造化データ、Core Web Vitals、およびコンテンツ戦略にわたる SEO 改善の監査、計画、実施。ユーザーが検索可視性の向上、SEO 修正、スキーママークアップ、サイトマップ/robots の作業、またはキーワ… | 6 |
| `AgriciDaniel__claude-seo/skill/seo` | Comprehensive SEO analysis for any website or business type. Full site audits, single-page analysis, technical SEO (crawlability,… | 106 |
| `AgriciDaniel__claude-seo/skill/seo-ahrefs` | Ahrefs API analyst (extension). Reads referring domains, backlinks, organic keywords, and content explorer data via the tested @a… | 2 |
| `AgriciDaniel__claude-seo/skill/seo-audit` | Full website SEO audit with parallel subagent delegation. Crawls up to 500 pages, detects business type, delegates to up to 15 sp… | 8 |
| `AgriciDaniel__claude-seo/skill/seo-backlinks` | Backlink profile analysis: referring domains, anchor text distribution, toxic link detection, competitor gap analysis. Works with… | 13 |
| `AgriciDaniel__claude-seo/skill/seo-bing` | Bing Webmaster Tools + IndexNow extension. Microsoft Copilot citations are fed by the Bing index; this skill makes Bing visibilit… | 2 |
| `AgriciDaniel__claude-seo/skill/seo-cluster` | > SERP-based semantic topic clustering for content architecture planning. Groups keywords by actual Google SERP overlap (not text… | 50 |
| `AgriciDaniel__claude-seo/skill/seo-competitor-pages` | > Generate SEO-optimized competitor comparison and alternatives pages. Covers "X vs Y" layouts, "alternatives to X" pages, featur… | 8 |
| `AgriciDaniel__claude-seo/skill/seo-content` | > Content quality and E-E-A-T analysis with AI citation readiness assessment. Use when user says "content quality", "E-E-A-T", "c… | 11 |
| `AgriciDaniel__claude-seo/skill/seo-content-brief` | > Generate competitive SEO content briefs with per-section word counts, competitor scoring, keyword density guidance, and page-ty… | 24 |
| `AgriciDaniel__claude-seo/skill/seo-dataforseo` | > Live SEO data via DataForSEO MCP server: SERP analysis, keyword research (volume, difficulty, intent, trends), backlink profile… | 23 |
| `AgriciDaniel__claude-seo/skill/seo-drift` | > SEO drift monitoring: capture baselines of SEO-critical elements, detect changes, and track regressions over time. Git for SEO:… | 13 |
| `AgriciDaniel__claude-seo/skill/seo-ecommerce` | > E-commerce SEO analysis: Google Shopping visibility, Amazon marketplace intelligence, product schema validation, competitor pri… | 25 |
| `AgriciDaniel__claude-seo/skill/seo-firecrawl` | > Full-site crawling, scraping, and site mapping via Firecrawl MCP. Use when user says "crawl site", "map site", "full crawl", "f… | 8 |
| `AgriciDaniel__claude-seo/skill/seo-flow` | > FLOW framework integration: evidence-led SEO using the Find → Leverage → Optimize → Win loop. Surfaces stage-specific AI prompt… | 117 |
| `AgriciDaniel__claude-seo/skill/seo-geo` | > Optimize content for AI Overviews (formerly SGE), ChatGPT web search, Perplexity, and other AI-powered search experiences. Gene… | 24 |
| `AgriciDaniel__claude-seo/skill/seo-google` | > Google SEO APIs: Search Console (Search Analytics, URL Inspection, Sitemaps), PageSpeed Insights v5, CrUX field data with 25-we… | 61 |
| `AgriciDaniel__claude-seo/skill/seo-hreflang` | > Hreflang and international SEO audit, validation, and generation. Detects common mistakes, validates language/region codes, and… | 29 |
| `AgriciDaniel__claude-seo/skill/seo-image-gen` | AI image generation for SEO assets: OG/social preview images, blog hero images, schema images, product photography, infographics.… | 9 |
| `AgriciDaniel__claude-seo/skill/seo-images` | > Image optimization analysis for SEO and performance. Checks alt text, file sizes, formats, responsive images, lazy loading, CLS… | 17 |
| `AgriciDaniel__claude-seo/skill/seo-local` | > Local SEO analysis covering Google Business Profile optimization, NAP consistency, citation health, review signals, local schem… | 17 |
| `AgriciDaniel__claude-seo/skill/seo-maps` | > Maps intelligence for local SEO: geo-grid rank tracking, GBP profile auditing via API, review intelligence across Google/Tripad… | 12 |
| `AgriciDaniel__claude-seo/skill/seo-page` | > Deep single-page SEO analysis covering on-page elements, content quality, technical meta tags, schema, images, and performance.… | 4 |
| `AgriciDaniel__claude-seo/skill/seo-plan` | > Strategic SEO planning for new or existing websites. Industry-specific templates, competitive analysis, content strategy, and i… | 33 |
| `AgriciDaniel__claude-seo/skill/seo-profound` | Profound LLM citation tracker (extension). Time-series brand citation rates across ChatGPT, Perplexity, and other LLMs. Pairs wit… | 2 |
| `AgriciDaniel__claude-seo/skill/seo-programmatic` | > Programmatic SEO planning and analysis for pages generated at scale from data sources. Covers template engines, URL patterns, i… | 9 |
| `AgriciDaniel__claude-seo/skill/seo-schema` | > Detect, validate, and generate Schema.org structured data. JSON-LD format preferred. Use when user says "schema", "structured d… | 11 |
| `AgriciDaniel__claude-seo/skill/seo-seranking` | SE Ranking AI visibility analyst (extension). Tracks AI Share-of-Voice across ChatGPT, Gemini, Perplexity, AI Overviews, and AI M… | 2 |
| `AgriciDaniel__claude-seo/skill/seo-sitemap` | > Analyze existing XML sitemaps or generate new ones with industry templates. Validates format, URLs, and structure. Use when use… | 6 |
| `AgriciDaniel__claude-seo/skill/seo-sxo` | > Search Experience Optimization: reads Google SERPs backwards to detect page-type mismatches, derives user stories from search i… | 36 |
| `AgriciDaniel__claude-seo/skill/seo-technical` | > Technical SEO audit across 9 categories: crawlability, indexability, security, URL structure, mobile, Core Web Vitals, structur… | 22 |
| `AgriciDaniel__claude-seo/skill/seo-unlighthouse` | Multi-page Lighthouse audit via the MIT-licensed Unlighthouse CLI. Free-tier alternative to running PageSpeed against every URL o… | 2 |
| `Bomx__qwoted-seo-backlinks-skill/skill/qwoted-seo-backlinks` | / Automate Qwoted (HARO-style PR platform) end-to-end and earn high-DR backlinks at scale: log in, set up the user's "expert" Sou… | 173 |

