# Domäne: docs

222 Bausteine. Erzeugt von `tools/harness.mjs extract`.

## agent (19)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/agent/code-reviewer` | Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing… | 9 |
| `affaan-m__ecc/agent/database-reviewer` | PostgreSQL database specialist for query optimization, schema design, security, and performance. Use PROACTIVELY when writing SQL… | 4 |
| `affaan-m__ecc/agent/doc-updater` | Documentation and codemap specialist. Use PROACTIVELY for updating codemaps and documentation. Runs /update-codemaps and /update-… | 3 |
| `affaan-m__ecc/agent/docs-lookup` | When the user asks how to use a library, framework, or API or needs up-to-date code examples, use Context7 MCP to fetch current d… | 4 |
| `affaan-m__ecc/agent/observer` | セッションの観察を分析してパターンを検出し、本能を作成するバックグラウンドエージェント。コスト効率のためにHaikuを使用します。 | 5 |
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

## command (8)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/command/claw` | NanoClaw v2 を起動します — モデルルーティング、スキルホットロード、ブランチ、圧縮、エクスポート、メトリクス機能を備えた ECC の永続的でゼロ依存の REPL。 | 2 |
| `affaan-m__ecc/command/context-budget` | エージェント、スキル、MCP サーバー、ルールにわたるコンテキストウィンドウの使用状況を分析し、最適化の機会を探ります。トークンオーバーヘッドの削減とパフォーマンス警告の回避に役立ちます。 | 1 |
| `affaan-m__ecc/command/devfleet` | Claude DevFleet を使って並列 Claude Code エージェントをオーケストレーションします — 自然言語でプロジェクトを計画し、隔離されたワークツリーにエージェントをディスパッチし、進捗を監視し、構造化レポートを読み取ります。 | 5 |
| `affaan-m__ecc/command/docs` | Context7 を使ってライブラリやトピックの最新ドキュメントを検索します。 | 2 |
| `affaan-m__ecc/command/ecc-guide` | Navigate ECC's current agents, skills, commands, hooks, install profiles, and docs from the live repository surface. | 3 |
| `affaan-m__ecc/command/prompt-optimize` | ドラフトプロンプトを分析し、ECC が強化された最適化済みバージョンを出力します。貼り付けてすぐに実行できる状態で出力されます。タスクは実行しません — コンサルティング分析のみを出力します。 | 3 |
| `affaan-m__ecc/command/rules-distill` | スキルをスキャンして横断的な原則を抽出し、ルールとして蒸留する | 1 |
| `affaan-m__ecc/command/update-docs` | Update documentation for recent changes | 1 |

## hook (2)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/hook/cursor-session-env` | !/usr/bin/env node | 2 |
| `affaan-m__ecc/hook/doc-file-warning` | !/usr/bin/env node | 3 |

## skill (193)

| ID | Beschreibung | KB |
|---|---|---:|
| `affaan-m__ecc/skill/accessibility` | WCAG 2.2 レベル AA 標準を用いてインクルーシブなデジタルプロダクトを設計・実装・監査します。Web 用のセマンティック ARIA および Web・ネイティブプラットフォーム（iOS/Android）のアクセシビリティトレイトを生成するために使用し… | 8 |
| `affaan-m__ecc/skill/agent-architecture-audit` | エージェントおよび LLM アプリケーション向けのフルスタック診断。12 層のエージェントスタックにおけるラッパーリグレッション、メモリ汚染、ツール規律の失敗、隠れた修復ループ、レンダリング破損を監査します。重要度順の発見事項とコードファーストの修正を生成し… | 13 |
| `affaan-m__ecc/skill/agent-eval` | カスタムタスクでコーディングエージェント（Claude Code、Aider、Codex など）をヘッドツーヘッドで比較し、合格率、コスト、時間、一貫性のメトリクスを測定します | 6 |
| `affaan-m__ecc/skill/agent-harness-construction` | AI エージェントのアクション空間、ツール定義、観測フォーマットを設計・最適化して完了率を向上させます。 | 3 |
| `affaan-m__ecc/skill/agent-payment-x402` | タスクごとのバジェット、支出コントロール、ノンカストディアルウォレットを備えた x402 決済実行を AI エージェントに追加します。agentwallet-sdk を通じて Base をサポートし、OKX Payments / OKX エージェント決済プロ… | 13 |
| `affaan-m__ecc/skill/agentic-os` | Claude Code 上に永続的なマルチエージェントオペレーティングシステムを構築します。カーネルアーキテクチャ、スペシャリストエージェント、スラッシュコマンド、ファイルベースのメモリ、スケジュールされた自動化、外部データベースなしの状態管理をカバーします。 | 17 |
| `affaan-m__ecc/skill/ai-first-engineering` | AI エージェントが大量の実装出力を生成するチームのためのエンジニアリング運用モデル。 | 2 |
| `affaan-m__ecc/skill/ai-regression-testing` | AI 支援開発のためのリグレッションテスト戦略。データベース依存なしのサンドボックスモード API テスト、自動化されたバグチェックワークフロー、同じモデルがコードを書いてレビューする AI のブラインドスポットを捕捉するパターン。 | 14 |
| `affaan-m__ecc/skill/android-clean-architecture` | Android と Kotlin Multiplatform プロジェクトのクリーンアーキテクチャパターン — モジュール構造、依存関係ルール、UseCase、Repository、データ層パターン。 | 10 |
| `affaan-m__ecc/skill/angular-developer` | Angular コードを生成し、アーキテクチャ ガイダンスを提供します。プロジェクトの作成、コンポーネント、またはサービスを作成するとき、または反応性（シグナル、linkedSignal、リソース）、フォーム、依存性注入、ルーティング、SSR、アクセシビリテ… | 16 |
| `affaan-m__ecc/skill/api-connector-builder` | ターゲット リポジトリの既存統合パターンに正確に一致する新しい API コネクターまたはプロバイダーを構築します。2 番目のアーキテクチャを発明せずに、1 つ以上の統合を追加するときに使用します。 | 4 |
| `affaan-m__ecc/skill/architecture-decision-records` | コーディングセッション中にアーキテクチャ決定を構造化ADRとして記録し、自動的に決定の瞬間を検出し、コンテキスト、検討された代替案、根拠を記録します。今後の開発者がコードベースの形成理由を理解するためのADRログを維持します。 | 9 |
| `affaan-m__ecc/skill/article-writing` | Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from… | 3 |
| `affaan-m__ecc/skill/automation-audit-ops` | ECC用の証拠ベースの自動化インベントリとオーバーラップ監査ワークフロー。ユーザーがどのジョブ、フック、コネクタ、MCPサーバー、またはラッパーがライブか、壊れているか、冗長であるか、修正前に不足しているかを知りたい場合に使用します。 | 6 |
| `affaan-m__ecc/skill/autonomous-agent-harness` | Claude Codeを永続的なメモリ、スケジュール済み操作、コンピュータ使用、タスクキューイングを備えた完全自動エージェントシステムに変換します。スタンドアロンエージェントフレームワーク（Hermes、AutoGPT）を、Claude Codeのネイティブ… | 7 |
| `affaan-m__ecc/skill/benchmark` | このスキルを使用して、パフォーマンスベースラインを測定し、PR前後の回帰を検出し、スタック代替案を比較します。 | 3 |
| `affaan-m__ecc/skill/blueprint` | >- 1行の目的を複数セッション、複数エージェントエンジニアリングプロジェクト向けのステップバイステップ構築計画に変換します。各ステップには自己完結型コンテキストブリーフがあり、新しいエージェントがそれをコールドで実行できます。 敵対的なレビューゲート、依存… | 4 |
| `affaan-m__ecc/skill/brand-voice` | Build a source-derived writing style profile from real posts, essays, launch notes, docs, or site copy, then reuse that profile a… | 5 |
| `affaan-m__ecc/skill/browser-qa` | このスキルを使用して、機能をデプロイ後にブラウザ自動化を使用した自動ビジュアルテストとUI相互作用検証を自動化します。 | 3 |
| `affaan-m__ecc/skill/canary-watch` | このスキルを使用して、デプロイメント、マージ、または依存関係アップグレード後にデプロイされたURLの回帰を監視します。 | 3 |
| `affaan-m__ecc/skill/carrier-relationship-management` | > キャリアポートフォリオの管理、運賃交渉、キャリアパフォーマンスの追跡、貨物割り当て、戦略的なキャリア関係の維持のための成文化された専門知識。15年以上の経験を持つ輸送マネージャーに情報。スコアカーディングフレームワーク、RFPプロセス、市場情報、コンプラ… | 7 |
| `affaan-m__ecc/skill/cisco-ios-patterns` | showコマンド、コンフィグ階層、ワイルドカードマスク、ACL配置、インターフェースハイジーン、安全な変更ウィンドウ検証のためのCisco IOSおよびIOS-XEレビューパターン。 | 4 |
| `affaan-m__ecc/skill/ck` | Claude Codeの永続的なプロジェクト単位のメモリ。セッション開始時にプロジェクトコンテキストを自動読み込み、gitアクティビティでセッションを追跡し、ネイティブメモリに書き込みます。コマンドは決定的なNode.jsスクリプトを実行します — 動作はモ… | 4 |
| `affaan-m__ecc/skill/claude-devfleet` | Claude DevFleet経由でマルチエージェントコーディングタスクをオーケストレーション — プロジェクトを計画し、分離された作業ツリー内で平行エージェントを派遣し、進捗を監視し、構造化レポートを読む。 | 3 |
| `affaan-m__ecc/skill/click-path-audit` | ユーザー向けボタン/タッチポイントを完全な状態変更シーケンスを通して追跡し、機能が個別に機能するが互いにキャンセルされたり、間違った最終状態を生成したり、UIを矛盾した状態にしたままにするバグを見つけます。次の場合に使用します：体系的なデバッグがバグを見つけ… | 4 |
| `affaan-m__ecc/skill/clickhouse-io` | ClickHouse database patterns, query optimization, analytics, and data engineering best practices for high-performance analytical … | 11 |
| `affaan-m__ecc/skill/code-tour` | CodeTour `.tour`ファイルを作成 — ペルソナターゲット、ステップバイステップウォークスルー（実際のファイルとラインアンカー付き）。オンボーディングツアー、アーキテクチャウォークスルー、PRツアー、RCAツアー、構造化「これがどのように機能する… | 3 |
| `affaan-m__ecc/skill/codebase-onboarding` | 不慣れなコードベースを分析し、アーキテクチャマップ、主要なエントリポイント、規約、スターターCLAUDE.mdを含む構造化オンボーディングガイドを生成します。新しいプロジェクトに参加するか、リポでClaude Codeを初めてセットアップする場合に使用します。 | 2 |
| `affaan-m__ecc/skill/compose-multiplatform-patterns` | KMPプロジェクト向けのCompose MultiplatformおよびJetpack Composeパターン — 状態管理、ナビゲーション、テーマ設定、パフォーマンス、プラットフォーム固有のUI。 | 9 |
| `affaan-m__ecc/skill/configure-ecc` | Claude Code、Codex、Kimi 内で ECC のインストール、更新、再設定を案内し、各ハーネスが実際に備えるプラグイン、スコープ、フック機能を守ります。 | 9 |
| `affaan-m__ecc/skill/connections-optimizer` | レビュー優先の整理、フォロー/追加の推薦、ユーザーの実際の声で書かれたチャネル別ウォームアウトリーチのドラフトを通じて、ユーザーのXとLinkedInネットワークを再編成します。フォローリストを整理したい、現在の優先事項に向けて成長したい、または高品質な関係… | 8 |
| `affaan-m__ecc/skill/context-budget` | エージェント、スキル、MCPサーバー、ルールにわたってClaude Codeのコンテキストウィンドウ消費を監査します。肥大化、冗長なコンポーネントを特定し、優先順位付けされたトークン節約の推奨事項を生成します。 | 7 |
| `affaan-m__ecc/skill/continuous-agent-loop` | 品質ゲート、評価、リカバリーコントロールを備えた継続的な自律エージェントループのパターン。 | 1 |
| `affaan-m__ecc/skill/continuous-learning` | [OBSOLETO - usar continuous-learning-v2] Extractor de skill por hook Stop v1 heredado. v2 es un superconjunto estricto con aprend… | 5 |
| `affaan-m__ecc/skill/continuous-learning-v2` | Sistema de aprendizaje basado en instintos que observa sesiones mediante hooks, crea instintos atómicos con puntuación de confian… | 9 |
| `affaan-m__ecc/skill/cost-aware-llm-pipeline` | LLM APIの使用量のコスト最適化パターン — タスクの複雑さによるモデルルーティング、予算追跡、リトライロジック、プロンプトキャッシング。 | 7 |
| `affaan-m__ecc/skill/cost-tracking` | ローカルのコスト追跡データベースからClaude Codeのトークン使用量、支出、予算を追跡・レポートします。コスト、支出、使用量、トークン、予算、またはプロジェクト、ツール、セッション、日付によるコスト内訳について質問する場合に使用します。 | 6 |
| `affaan-m__ecc/skill/council` | 曖昧な決定、トレードオフ、ゴー/ノーゴーの判断のために4つの声のカウンシルを召集します。複数の有効なパスが存在し、選択前に構造化された異議が必要な場合に使用します。 | 8 |
| `affaan-m__ecc/skill/cpp-coding-standards` | C++ coding standards based on the C++ Core Guidelines (isocpp.github.io). Use when writing, reviewing, or refactoring C++ code to… | 22 |
| `affaan-m__ecc/skill/cpp-testing` | Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing or flaky tests, or adding cover… | 9 |
| `affaan-m__ecc/skill/csharp-testing` | xUnit、FluentAssertions、モッキング、統合テスト、テスト組織のベストプラクティスを使用したC#と.NETのテストパターン。 | 9 |
| `affaan-m__ecc/skill/customer-billing-ops` | Stripeなどの接続された請求ツールを使用して、サブスクリプション、返金、チャーントリアージ、請求ポータルの回復、プラン分析などの顧客請求ワークフローを操作します。顧客を助けたい、サブスクリプション状態を検査したい、または収益に影響する請求操作を管理したい… | 6 |
| `affaan-m__ecc/skill/customs-trade-compliance` | > 通関書類、関税分類、関税最適化、制限当事者スクリーニング、複数の法域にわたる規制コンプライアンスのための成文化された専門知識。15年以上の経験を持つ貿易コンプライアンス専門家に情報。HS分類ロジック、インコターム適用、FTA利用、ペナルティ軽減を含みます… | 4 |
| `affaan-m__ecc/skill/dart-flutter-patterns` | 本番環境対応のDartおよびFlutterパターンは、null安全性、不変状態、非同期構成、ウィジェットアーキテクチャ、人気のある状態管理フレームワーク（BLoC、Riverpod、Provider）、GoRouterナビゲーション、Dioネットワーキング、… | 3 |
| `affaan-m__ecc/skill/dashboard-builder` | Grafana、SigNoz、および同様のプラットフォーム用の実際のオペレータ質問に答える監視ダッシュボードを構築します。メトリクスを虚栄ボードではなく機能するダッシュボードに変える場合に使用します。 | 2 |
| `affaan-m__ecc/skill/data-scraper-agent` | 任意のパブリックソース（ジョブボード、価格、ニュース、GitHub、スポーツなど）用の完全自動化されたAI搭載データ収集エージェントを構築します。スケジュールでスクレイプし、無料LLM（Gemini Flash）でデータを豊かにし、Notion/Sheets… | 3 |
| `affaan-m__ecc/skill/defi-amm-security` | DeFi自動マーケットメーカー（AMM）スマートコントラクトセキュリティ監査パターン。フラッシュローン、スリッページ、サンドイッチング攻撃、価格操作、再入攻撃、不正確な整数演算をカバー。 | 2 |
| `affaan-m__ecc/skill/design-system` | アクセシビリティ、レスポンシブネス、テーマ設定、コンポーネント群、トークンを備えた本番環境対応デザインシステムの構築。Figma、Storybook、コンポーネントライブラリ統合。 | 2 |
| `affaan-m__ecc/skill/django-celery` | DjangoおよびCeleryを使用した非同期タスク処理。タスクキューイング、ワーカー管理、エラー処理、スケジューリング。Redis/RabbitMQ ブローカー統合。 | 2 |
| `affaan-m__ecc/skill/django-tdd` | Django testing strategies with pytest-django, TDD methodology, factory_boy, mocking, coverage, and testing Django REST Framework … | 22 |
| `affaan-m__ecc/skill/django-verification` | Verification loop for Django projects: migrations, linting, tests with coverage, security scans, and deployment readiness checks … | 13 |
| `affaan-m__ecc/skill/documentation-lookup` | Use up-to-date library and framework docs via Context7 MCP instead of training data. Activates for setup questions, API reference… | 5 |
| `affaan-m__ecc/skill/dotnet-patterns` | C#と.NET言語固有のパターン、規約、依存性注入、async/await、およびロバストで保守可能な.NETアプリケーション構築のためのベストプラクティス。 | 9 |
| `affaan-m__ecc/skill/ecc-guide` | ECC の現在のエージェント、スキル、コマンド、フック、ルール、インストールプロファイル、およびプロジェクトオンボーディングをガイドしています。ライブリポジトリサーフェスを読んでから回答するようユーザーをガイドします。 | 6 |
| `affaan-m__ecc/skill/ecc-tools-cost-audit` | ECC ツール、エージェント、スキル、および実装のコスト監査を実施します。プロンプト入力トークンを分析して、計算効率を定量化します。 | 6 |
| `affaan-m__ecc/skill/email-ops` | ECC用の証拠ベースのメールボックストリアージ、ドラフト作成、送信検証、および送信済みメールセーフフォローアップワークフロー。ユーザーがメールを整理したり、実際のメールサーフェスを通じてドラフトまたは送信したい、または送信済みメールに何が到着したかを証明した… | 4 |
| `affaan-m__ecc/skill/energy-procurement` | 電気とガス調達、料金最適化、需要料金管理、再生可能エネルギーPPA評価、およびマルチファシリティーエネルギー戦略のための符号化された専門知識。 Codified expertise for electricity and gas procurement, t… | 30 |
| `affaan-m__ecc/skill/enterprise-agent-ops` | オブザーバビリティ、セキュリティ境界、およびライフサイクル管理を備えた長寿命エージェントワークロードを運用します。 | 1 |
| `affaan-m__ecc/skill/error-handling` | TypeScript、Python、Goにわたる堅牢なエラー処理のパターン。型付きエラー、エラー境界、リトライ、サーキットブレーカー、ユーザー向けエラーメッセージをカバーします。 | 12 |
| `affaan-m__ecc/skill/evm-token-decimals` | EVMチェーン全体でサイレントな小数点不一致バグを防ぐ。ランタイムでの小数点照会、チェーン対応キャッシング、ブリッジドトークンの精度ドリフト、ボット・ダッシュボード・DeFiツール向けの安全な正規化をカバーします。 | 4 |
| `affaan-m__ecc/skill/fastapi-patterns` | FastAPI patterns for async APIs, dependency injection, Pydantic request and response models, OpenAPI docs, tests, security, and p… | 9 |
| `affaan-m__ecc/skill/finance-billing-ops` | ECCの証拠優先の収益、価格設定、返金、チーム請求、請求モデルの実態確認ワークフロー。ユーザーが販売スナップショット、価格比較、重複請求の診断、または汎用的な支払いアドバイスではなくコードに裏付けられた請求の実態を必要とする場合に使用します。 | 5 |
| `affaan-m__ecc/skill/flox-environments` | Floxで再現可能なクロスプラットフォーム開発環境を作成します — Nixに基づく宣言的な環境マネージャー。次の場合は必ずこのスキルを使用してください: システムレベルの依存関係（コンパイラー、データベース、openssl・libvips・BLAS・LAPA… | 18 |
| `affaan-m__ecc/skill/flutter-dart-code-review` | ウィジェットのベストプラクティス、状態管理パターン（BLoC、Riverpod、Provider、GetX、MobX、Signals）、Dartのイディオム、パフォーマンス、アクセシビリティ、セキュリティ、クリーンアーキテクチャをカバーするライブラリに依存し… | 31 |
| `affaan-m__ecc/skill/foundation-models-on-device` | デバイス上基盤モデルの実装パターン、量子化、最適化、およびプライバシーを考慮した推論。 | 8 |
| `affaan-m__ecc/skill/frontend-design-direction` | フロントエンド設計の方向性、美的原則、および一貫した設計言語実装。 | 4 |
| `affaan-m__ecc/skill/fsharp-testing` | F#テストフレームワーク、プロパティベーステスト、および関数型アプローチ。 | 8 |
| `affaan-m__ecc/skill/gan-style-harness` | GAN（生成的敵対ネットワーク）スタイルの評価ハーネス、画像生成パターン、および品質メトリクス。 | 12 |
| `affaan-m__ecc/skill/gateguard` | API、エージェント、およびLLMエンドポイントのアクセス制御と認可パターン。 | 5 |
| `affaan-m__ecc/skill/gget` | ゲノムデータベースへのクイック検索、配列検索、BLAST スタイルの検索、エンリッチメントチェック、および再現可能なバイオインフォマティクス証拠ログのための gget CLI および Python ワークフロー。 | 6 |
| `affaan-m__ecc/skill/git-workflow` | Gitワークフロー、ブランチ戦略、コミットメッセージ規約、およびプルリクエストプロセス。 | 15 |
| `affaan-m__ecc/skill/github-ops` | GitHub操作、自動化、APIインテグレーション、およびCI/CDワークフロー。 | 4 |
| `affaan-m__ecc/skill/golang-testing` | > Go testing best practices including table-driven tests, test helpers, benchmarking, race detection, coverage analysis, and inte… | 6 |
| `affaan-m__ecc/skill/google-workspace-ops` | Google Workspace API操作、Sheets自動化、Gmail統合、およびドキュメント管理。 | 3 |
| `affaan-m__ecc/skill/healthcare-cdss-patterns` | 臨床意思決定支援システム（CDSS）パターン、医学的推論、およびエビデンスベースの実装。 | 9 |
| `affaan-m__ecc/skill/healthcare-emr-patterns` | 電子医療記録（EMR）パターン、相互運用性、およびHL7/FHIR統合。 | 6 |
| `affaan-m__ecc/skill/healthcare-eval-harness` | ヘルスケアAIモデル評価ハーネス、臨床メトリクス、およびレギュレーション遵守の検証。 | 7 |
| `affaan-m__ecc/skill/healthcare-phi-compliance` | 保護医療情報（PHI）コンプライアンス、HIPAA準拠、およびデータセキュリティ。 | 5 |
| `affaan-m__ecc/skill/hermes-imports` | Hermesデータインポート、マッピング、変換、およびデータインテグリティ検証。 | 3 |
| `affaan-m__ecc/skill/hexagonal-architecture` | ヘキサゴナルアーキテクチャ（ポート・アダプタパターン）、境界の分離、および外部依存関係の管理。 | 11 |
| `affaan-m__ecc/skill/hipaa-compliance` | HIPAA準拠実装、セキュリティ対策、監査ログ、およびデータ保護戦略。 | 3 |
| `affaan-m__ecc/skill/homelab-network-readiness` | ホームラボネットワーク準備、セキュリティ評価、パフォーマンステスト、および展開準備。 | 7 |
| `affaan-m__ecc/skill/homelab-network-setup` | ホームラボネットワーク基盤設定、デバイス設定、接続性、およびネットワークセグメンテーション。 | 4 |
| `affaan-m__ecc/skill/homelab-pihole-dns` | ホームラボ用Pi-hole DNS設定、広告ブロック、プライバシー、およびカスタムドメイン解決。 | 9 |
| `affaan-m__ecc/skill/homelab-vlan-segmentation` | ホームラボVLANセグメンテーション、ネットワーク分離、アクセス制御、およびトラフィック管理。 | 10 |
| `affaan-m__ecc/skill/homelab-wireguard-vpn` | ホームラボWireGuard VPN設定、リモートアクセス、キー管理、およびエンドツーエンド暗号化。 | 10 |
| `affaan-m__ecc/skill/hookify-rules` | 自動フック実装、イベントドリブン実行、およびルール駆動ワークフロー。 | 3 |
| `affaan-m__ecc/skill/inventory-demand-planning` | 在庫管理、需要予測、補充戦略、およびサプライチェーン最適化。 Codified expertise for demand forecasting, safety stock optimization, replenishment planning, and … | 24 |
| `affaan-m__ecc/skill/ios-icon-gen` | SF Symbols（Apple ネイティブ 5,000 件以上）または Iconify API（200 以上のコレクションから 275,000 件以上のオープンソースアイコン）から Xcode アセットカタログ用の PNG イメージセットとして iOS ア… | 7 |
| `affaan-m__ecc/skill/iterative-retrieval` | サブエージェントのコンテキスト問題を解決するために、コンテキスト取得を段階的に洗練するパターン | 7 |
| `affaan-m__ecc/skill/jira-integration` | Jira チケットの取得、要件分析、チケットステータスの更新、コメントの追加、またはイシューのトランジションを行う際に使用します。MCP または直接 REST 呼び出しによる Jira API パターンを提供します。 | 11 |
| `affaan-m__ecc/skill/knowledge-ops` | 複数のストレージレイヤー（ローカルファイル、MCP メモリ、ベクターストア、Git リポジトリ）にわたるナレッジベースの管理、取り込み、同期、検索。ユーザーが知識システム全体で保存・整理・同期・重複排除・検索を行いたい場合に使用します。 | 9 |
| `affaan-m__ecc/skill/kotlin-coroutines-flows` | Android および KMP 向けの Kotlin コルーチンと Flow パターン — 構造化並行性、Flow オペレーター、StateFlow、エラーハンドリング、テスト。 | 9 |
| `affaan-m__ecc/skill/kotlin-exposed-patterns` | JetBrains Exposed ORM パターン（DSL クエリ、DAO パターン、トランザクション、HikariCP 接続プーリング、Flyway マイグレーション、リポジトリパターンを含む）。 | 23 |
| `affaan-m__ecc/skill/kotlin-ktor-patterns` | Ktor サーバーパターン（ルーティング DSL、プラグイン、認証、Koin DI、kotlinx.serialization、WebSocket、testApplication テストを含む）。 | 20 |
| `affaan-m__ecc/skill/laravel-patterns` | Patrones de arquitectura Laravel, routing/controladores, Eloquent ORM, capas de servicio, colas, eventos, caché y API resources p… | 11 |
| `affaan-m__ecc/skill/laravel-plugin-discovery` | Laravel プラグイン検出、パッケージ管理、依存関係解決、およびサービスプロバイダ統合。 | 6 |
| `affaan-m__ecc/skill/laravel-security` | Buenas prácticas de seguridad en Laravel para autenticación/autorización, validación, CSRF, asignación masiva, subida de archivos… | 8 |
| `affaan-m__ecc/skill/laravel-tdd` | Desarrollo guiado por pruebas para Laravel con PHPUnit y Pest, factories, pruebas de base de datos, fakes y objetivos de cobertur… | 8 |
| `affaan-m__ecc/skill/laravel-verification` | Bucle de verificación para proyectos Laravel: verificaciones de entorno, linting, análisis estático, pruebas con cobertura, escan… | 5 |
| `affaan-m__ecc/skill/lead-intelligence` | 日本語翻訳：このファイルは lead-intelligence 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/liquid-glass-design` | 日本語翻訳：このファイルは liquid-glass-design 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/literature-review` | 学術、生物医学、技術、科学的なトピックに対するシステマティックな文献レビューワークフロー。検索計画、ソースのスクリーニング、統合、引用確認、証拠ログを含む。 | 6 |
| `affaan-m__ecc/skill/llm-trading-agent-security` | 日本語翻訳：このファイルは llm-trading-agent-security 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/logistics-exception-management` | 日本語翻訳：このファイルは logistics-exception-management 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/make-interfaces-feel-better` | 日本語翻訳：このファイルは make-interfaces-feel-better 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/manim-video` | 日本語翻訳：このファイルは manim-video 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/mcp-server-patterns` | Build MCP servers with Node/TypeScript SDK — tools, resources, prompts, Zod validation, stdio vs Streamable HTTP. Use Context7 or… | 4 |
| `affaan-m__ecc/skill/messages-ops` | 日本語翻訳：このファイルは messages-ops 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/motion-advanced` | 日本語翻訳：このファイルは motion-advanced 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/motion-foundations` | 日本語翻訳：このファイルは motion-foundations 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/motion-patterns` | 日本語翻訳：このファイルは motion-patterns 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/motion-ui` | 日本語翻訳：このファイルは motion-ui 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/mysql-patterns` | 日本語翻訳：このファイルは mysql-patterns 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/nanoclaw-repl` | 日本語翻訳：このファイルは nanoclaw-repl 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/netmiko-ssh-automation` | 日本語翻訳：このファイルは netmiko-ssh-automation 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/network-bgp-diagnostics` | 日本語翻訳：このファイルは network-bgp-diagnostics 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/network-config-validation` | 日本語翻訳：このファイルは network-config-validation 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/network-interface-health` | ルーター、スイッチ、Linuxホスト上のインターフェースエラー、ドロップ、CRC、デュプレックス不一致、フラッピング、速度ネゴシエーション問題、カウンタートレンドを診断する。 | 8 |
| `affaan-m__ecc/skill/nodejs-keccak256` | JavaScriptとTypeScriptにおけるEthereumハッシュバグを防ぐ。NodeのSHA3-256はNIST SHA3であり、Ethereum Keccak-256ではなく、セレクター、署名、ストレージスロット、アドレス導出を静かに破壊する。 | 3 |
| `affaan-m__ecc/skill/nutrient-document-processing` | Nutrient DWS API を使用してドキュメントの処理、変換、OCR、抽出、編集、署名、フォーム入力を行います。PDF、DOCX、XLSX、PPTX、HTML、画像に対応しています。 | 6 |
| `affaan-m__ecc/skill/nuxt4-patterns` | ハイドレーション安全性、パフォーマンス、ルートルール、遅延ロード、useFetchとuseAsyncDataを使ったSSR安全なデータフェッチングのためのNuxt 4アプリパターン。 | 7 |
| `affaan-m__ecc/skill/openclaw-persona-forge` | 为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、… | 12 |
| `affaan-m__ecc/skill/opensource-pipeline` | オープンソースパイプライン: プライベートプロジェクトをフォーク、サニタイズし、安全な公開リリースのためにパッケージ化する。3つのエージェント（フォーカー、サニタイザー、パッケージャー）を連鎖させる。トリガー: '/opensource'、'open sou… | 9 |
| `affaan-m__ecc/skill/parallel-execution-optimizer` | 当用户希望通过并行工作、并发 agents、批量工具调用、隔离 worktree 或多条独立验证通道来大幅加速任务、同时不损失正确性时使用。 | 3 |
| `affaan-m__ecc/skill/perl-patterns` | 堅牢でメンテナブルなPerlアプリケーションを構築するためのModern Perl 5.36+のイディオム、ベストプラクティス、規約。 | 13 |
| `affaan-m__ecc/skill/perl-security` | テイントモード、入力バリデーション、安全なプロセス実行、DBIパラメータ化クエリ、Webセキュリティ（XSS/SQLi/CSRF）、perlcriticセキュリティポリシーを網羅する包括的なPerlセキュリティ。 | 16 |
| `affaan-m__ecc/skill/perl-testing` | 日本語翻訳：このファイルは perl-testing 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/plan-orchestrate` | 日本語翻訳：このファイルは plan-orchestrate 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/plankton-code-quality` | 日本語翻訳：このファイルは plankton-code-quality 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/product-lens` | 日本語翻訳：このファイルは product-lens 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/production-audit` | 日本語翻訳：このファイルは production-audit 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/production-scheduling` | 日本語翻訳：このファイルは production-scheduling 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/project-flow-ops` | 日本語翻訳：このファイルは project-flow-ops 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/project-guidelines-example` | Project-specific skill template covering architecture, patterns, testing, and deployment guidance. | 11 |
| `affaan-m__ecc/skill/prompt-optimizer` | 日本語翻訳：このファイルは prompt-optimizer 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/pubmed-database` | 生物医学文献、MeSH クエリ、PMID 検索、引用取得、および API を利用した文献モニタリングのための PubMed および NCBI E-utilities の直接検索ワークフロー。 | 6 |
| `affaan-m__ecc/skill/python-testing` | > Python testing best practices using pytest including fixtures, parametrization, mocking, coverage analysis, async testing, and … | 11 |
| `affaan-m__ecc/skill/quality-nonconformance` | 日本語翻訳：このファイルは quality-nonconformance 用の日本語翻訳が必要です | 1 |
| `affaan-m__ecc/skill/quarkus-patterns` | Patrones de arquitectura Quarkus 3.x LTS con Camel para mensajería, diseño de API RESTful, servicios CDI, acceso a datos con Pana… | 15 |
| `affaan-m__ecc/skill/quarkus-security` | Buenas prácticas de seguridad en Quarkus para autenticación, autorización, JWT/OIDC, RBAC, validación de entrada, CSRF, gestión d… | 10 |
| `affaan-m__ecc/skill/quarkus-tdd` | Desarrollo guiado por pruebas para Quarkus 3.x LTS usando JUnit 5, Mockito, REST Assured, pruebas Camel y JaCoCo. Usar al agregar… | 14 |
| `affaan-m__ecc/skill/quarkus-verification` | Bucle de verificación para proyectos Quarkus: build, análisis estático, pruebas con cobertura, escaneos de seguridad, compilación… | 9 |
| `affaan-m__ecc/skill/ralphinho-rfc-pipeline` | RFC駆動の複数エージェントDAG実行パターン、品質ゲート、マージキュー、ワークユニットオーケストレーション。 | 2 |
| `affaan-m__ecc/skill/react-patterns` | React 18/19 patterns including hooks discipline, server/client component boundaries, Suspense + error boundaries, form actions, d… | 11 |
| `affaan-m__ecc/skill/react-performance` | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/ve… | 18 |
| `affaan-m__ecc/skill/react-testing` | React component testing with React Testing Library, Vitest/Jest, MSW for network mocking, accessibility assertions with axe, and … | 13 |
| `affaan-m__ecc/skill/redis-patterns` | Redisデータ構造パターン、キャッシング戦略、分散ロック、レート制限、Pub/Sub、本番アプリケーション用コネクション管理。 | 12 |
| `affaan-m__ecc/skill/regex-vs-llm-structured-text` | 構造化テキストの解析に正規表現と大規模言語モデルのどちらを使うかを選択するための意思決定フレームワーク——まず正規表達式から始め、信頼度の低いエッジケースにのみ大規模言語モデルを追加する。 | 8 |
| `affaan-m__ecc/skill/remotion-video-creation` | Remotion のベストプラクティス - React で動画を作成する。3D、アニメーション、音声、字幕、チャート、トランジションなどをカバーするドメイン固有の29のルール。 | 4 |
| `affaan-m__ecc/skill/repo-scan` | クロススタックのソースコード資産監査——各ファイルを分類し、埋め込まれたサードパーティライブラリを検出し、各モジュールに対してインタラクティブなHTMLレポートとともに実用的な4段階の判定を提供する。 | 5 |
| `affaan-m__ecc/skill/research-ops` | 証拠優先のECC現状調査ワークフロー。ユーザーが現在の公開証拠と提供されたローカルコンテキストに基づいて最新の事実、比較、情報の充実、または推奨事項を求める場合に使用する。 | 5 |
| `affaan-m__ecc/skill/returns-reverse-logistics` | 返品承認、受取・検品、処分決定、返金処理、不正検出、保証クレーム管理のための標準化された専門知識。15年以上の経験を持つ返品オペレーションマネージャーの知見に基づく。段階的フレームワーク、処分経済性、不正パターン認識、ベンダー回収プロセスを含む。製品返品、逆… | 30 |
| `affaan-m__ecc/skill/rules-distill` | スキルをスキャンしてドメイン横断的な原則を抽出し、ルールに蒸留する——既存のルールファイルへの追記、修正、または新規作成 | 12 |
| `affaan-m__ecc/skill/safety-guard` | 本番システムでの作業時や、エージェントを自律的に実行する際に破壊的な操作を防ぐためにこのスキルを使用してください。 | 2 |
| `affaan-m__ecc/skill/santa-method` | 収束ループを持つマルチエージェント敵対的検証。2つの独立したレビューエージェントが両方合格して初めて出力を出荷できます。 | 16 |
| `affaan-m__ecc/skill/scholar-evaluation` | 論文、提案書、文献レビュー、方法論セクション、証拠の質、引用サポート、研究論文フィードバックのための構造化された学術的作業評価。 | 6 |
| `affaan-m__ecc/skill/search-first` | > Research-before-coding workflow. Search for existing tools, libraries, and patterns before writing custom code. Systematizes th… | 8 |
| `affaan-m__ecc/skill/security-bounty-hunter` | リポジトリ内の悪用可能なバウンティ対象のセキュリティ問題を発見します。ノイズの多いローカルのみの発見ではなく、実際のレポートに適格なリモートから到達可能な脆弱性に焦点を当てます。 | 5 |
| `affaan-m__ecc/skill/security-scan` | AgentShield を使用して、Claude Code の設定（.claude/ ディレクトリ）のセキュリティ脆弱性、設定ミス、インジェクションリスクをスキャンします。CLAUDE.md、settings.json、MCP サーバー、フック、エージェント… | 6 |
| `affaan-m__ecc/skill/seo` | テクニカル SEO、オンページ最適化、構造化データ、Core Web Vitals、およびコンテンツ戦略にわたる SEO 改善の監査、計画、実施。ユーザーが検索可視性の向上、SEO 修正、スキーママークアップ、サイトマップ/robots の作業、またはキーワ… | 6 |
| `affaan-m__ecc/skill/skill-comply` | スキル、ルール、エージェント定義が実際に遵守されているかを可視化する——3種類のプロンプト厳格度レベルのシナリオを自動生成し、エージェントを実行し、動作シーケンスを分類し、完全なツール呼び出しタイムラインの遵守率をレポートする | 3 |
| `affaan-m__ecc/skill/skill-scout` | 新しいスキルを作成する前に、ローカル・マーケットプレイス・GitHub・Webの既存スキルを検索する。スキルの作成・ビルド・フォーク・検索を行う際に使用。 | 6 |
| `affaan-m__ecc/skill/skill-stocktake` | Claudeのスキルとコマンドの品質を監査するためのツール。変更されたスキルのみを対象とした高速スキャンと、順次サブエージェントバッチ評価を使用した完全棚卸しモードをサポートする。 | 9 |
| `affaan-m__ecc/skill/social-graph-ranker` | XとLinkedInでのウォームイントロ発見、ブリッジスコアリング、ネットワークギャップ分析のための重み付きソーシャルグラフランキング。ユーザーがランキングエンジン自体を必要としている場合（より広いプロモーションやネットワーク維持ワークフローではなく）に使用… | 6 |
| `affaan-m__ecc/skill/springboot-tdd` | Desarrollo guiado por pruebas para Spring Boot usando JUnit 5, Mockito, MockMvc, Testcontainers y JaCoCo. Usar al agregar funcion… | 4 |
| `affaan-m__ecc/skill/springboot-verification` | Bucle de verificación para proyectos Spring Boot: build, análisis estático, pruebas con cobertura, escaneos de seguridad y revisi… | 6 |
| `affaan-m__ecc/skill/swift-concurrency-6-2` | Swift 6.2のアクセシブルな並行処理——デフォルトはシングルスレッド、@concurrentは明示的なバックグラウンドオフロードに使用し、分離の一貫性はMainActor型に使用する。 | 10 |
| `affaan-m__ecc/skill/swiftui-patterns` | @Observableを使用した状態管理、ビュー合成、ナビゲーション、パフォーマンス最適化、モダンなiOS/macOS UIのベストプラクティスを備えたSwiftUIアーキテクチャパターン。 | 8 |
| `affaan-m__ecc/skill/tdd-workflow` | Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage i… | 13 |
| `affaan-m__ecc/skill/team-builder` | 並列チームを構成して派遣するためのインタラクティブなエージェント選択ツール | 10 |
| `affaan-m__ecc/skill/terminal-ops` | ECCのための証拠優先のリポジトリ実行ワークフロー。ユーザーがコマンドの実行、リポジトリの確認、CIの失敗のデバッグ、正確な実行と検証の証明を伴う狭い修正のプッシュを必要とする場合に使用する。 | 4 |
| `affaan-m__ecc/skill/tinystruct-patterns` | tinystructフレームワークでアプリケーションモジュールまたはマイクロサービスを開発する際に使用。ルーティング、コンテキスト管理、BuilderによるJSON処理、CLI/HTTPデュアルモードのパターンをカバー。 | 5 |
| `affaan-m__ecc/skill/token-budget-advisor` | 回答する前に、どれだけの回答深度を消費するかについてユーザーに情報に基づいた選択を提供する。ユーザーが回答の長さ、深さ、またはトークンバジェットを明示的に制御したい場合にこのスキルを使用する。トリガー条件："token budget", "token cou… | 7 |
| `affaan-m__ecc/skill/ui-demo` | Playwrightを使用して美しいUIデモ動画を録画する。ユーザーがWebアプリのデモ、ウォークスルー、スクリーン録画、またはチュートリアル動画の作成を求める場合に使用する。可視カーソル、自然なリズム、プロフェッショナルな仕上がりのWebM動画を生成する。 | 18 |
| `affaan-m__ecc/skill/ui-to-vue` | UIスクリーンショットやデザインエクスポートをVue 3コンポーネントに一括変換する際に使用。Vant、Element Plus、Ant Design Vueに対応。 | 6 |
| `affaan-m__ecc/skill/unified-notifications-ops` | GitHub、Linear、デスクトップアラート、フック、接続された通信インターフェースを網羅する、統合されたECCネイティブワークフローとして通知を運用する。真の問題がアラートルーティング、重複排除、エスカレーション、またはインボックス崩壊である場合に使用… | 8 |
| `affaan-m__ecc/skill/uspto-database` | 公式記録の検索、PatentSearch クエリ、TSDR チェック、譲渡データ、および再現可能な IP 調査ログのための USPTO 特許・商標データワークフロー。 | 8 |
| `affaan-m__ecc/skill/videodb` | ビデオとオーディオの表示、理解、アクション。表示：ローカルファイル、URL、RTSP/ライブストリーム、またはリアルタイムのデスクトップ録画からコンテンツを取得し、リアルタイムコンテキストと再生可能なストリームリンクを返す。理解：フレームを抽出し、ビジュアル… | 142 |
| `affaan-m__ecc/skill/visa-doc-translate` | ビザ申請書類（画像）を英語に翻訳し、原文と翻訳を含むバイリンガルPDFを作成する | 7 |
| `affaan-m__ecc/skill/vite-patterns` | Vite build tool patterns including config, plugins, HMR, env variables, proxy setup, SSR, library mode, dependency pre-bundling, … | 23 |
| `affaan-m__ecc/skill/windows-desktop-e2e` | E2E testing for Windows native desktop apps (WPF, WinForms, Win32/MFC, Qt) using pywinauto and Windows UI Automation. | 30 |
| `affaan-m__ecc/skill/workspace-surface-audit` | アクティブなリポジトリ、MCPサーバー、プラグイン、コネクター、環境サーフェス、ツールのセットアップを監査し、最も価値の高いECCネイティブスキル、フック、エージェント、オペレーターワークフローを推奨する。ユーザーがClaude Codeのセットアップを支援… | 7 |
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

