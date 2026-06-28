# Memory Stream (AI Chat Log & Facts)

## 記憶ストリームの運用定義
- 本ファイルはタスク完了時にAIエージェントが自動でファクトを追記する領域です。
- 利用者による手動編集は原則不要です。
- 追記ルール: [`.cursor/rules/memory_logger.mdc`](../rules/memory_logger.mdc)

## 過去の共通原則

（50KB 超過時に memory_logger が古いログを圧縮して追記する領域）

## 蓄積されたファクト

### [2026-06-28] memory_logger・template_sync

- 日付: [2026-06-28]
- タスク: memory_logger・template_sync 新設と ai-agent-devenv-template 同期
- エラーと解決: なし
- ユーザー指摘: テンプレ由来ファイル変更時は ai-agent-devenv-template も同様に更新するルール必須

### [2026-06-28] documentation_wording

- 日付: [2026-06-28]
- タスク: 「人間」「人向け」表記の利用者・開発者への置換と documentation_wording ルール新設
- エラーと解決: なし
- ユーザー指摘: 利用者・開発者を「人間」と呼ばない。今後もルールで縛る

### [2026-06-28] log-template-sync

- 日付: [2026-06-28]
- タスク: ログ更新時のテンプレ正本同期方針を Rules・Skills に追記
- エラーと解決: なし
- ユーザー指摘: ログ更新時は ai-agent-devenv-template も更新。clone 正本で Agent AI 運用を横展開

### [2026-06-28] japanese-tech-writing

- 日付: [2026-06-28]
- タスク: japanese-tech-writing Skill 導入と japanese_tech_writing ルール・出典明記
- エラーと解決: ライセンス gist の誤クローン削除
- ユーザー指摘: 原本確認のため ATTRIBUTION 明記。適用タイミングのルール化とログ更新・コミットプッシュ

### [2026-06-28] template-repo-dual-push

- 日付: [2026-06-28]
- タスク: ai-agent-devenv-template 正本リポジトリへの commit/push と二リポジトリ運用手順の整理
- エラーと解決: 親リポ未追跡のネスト clone。テンプレ側で別途 push が必要
- ユーザー指摘: 運用基盤変更時は food-label-pdf-gas と ai-agent-devenv-template の両方を更新する

### [2026-06-28] log-template-dual-sync

- 日付: [2026-06-28]
- タスク: memory_stream・agent_sessions のテンプレ同時同期ルール化と現行ログのテンプレコピー
- エラーと解決: なし
- ユーザー指摘: memory_stream と Agent session はプロジェクトだけでなくテンプレも同時更新

### [2026-06-28] naming-conventions

- 日付: [2026-06-28]
- タスク: 命名規約の二層化（言語マジョリティのケース + 平易複合名必須）とフォルダ規約追記
- エラーと解決: なし
- ユーザー指摘: snake_case/camelCase は言語慣習に従う。平易で内容が分かる語彙・構成は全言語必須

### [2026-06-28] session-end-commit-push

- 日付: [2026-06-28]
- タスク: 終了合図時のログ更新と commit/push 締め手順を memory_logger に追加
- エラーと解決: なし
- ユーザー指摘: 終了は休憩・就寝前の完全終了。ログ更新と同時にコミットプッシュまで自動実行

### [2026-06-28] smartshelf-naming-repo-split

- 日付: [2026-06-28]
- タスク: 名刺版統合 vs 別リポ検討・SmartShelf 運用名の README 明記・リポ名は food-label-pdf-gas 維持
- エラーと解決: なし
- ユーザー指摘: GAS/GCP は SmartShelf。リポジトリ名は現状維持で README に対応表記

### [2026-06-28] phase1-poc

- 日付: [2026-06-28]
- タスク: Phase 1 PoC（setupSpreadsheet・spreadsheet・gemini・main 単件処理）の名刺版からの移植
- エラーと解決: なし
- ユーザー指摘: 重複チェック・バッチ・Drive 移動は Phase 2。一括処理メニューは Phase 1 では非表示

### [2026-06-28] clasp-deploy-sync

- 日付: [2026-06-28]
- タスク: GAS 連携状況確認・clasp セットアップ・scriptId 設定・pnpm clasp:push 同期完了
- エラーと解決: 誤パッケージ clasp@1.0.0 → @google/clasp 使用。scriptId 空で Project settings not found。OAuth 再ログイン汎用エラーは既ログイン済みで回避
- ユーザー指摘: なし

### [2026-06-28] phase1-poc-sheet-verify

- 日付: [2026-06-28]
- タスク: Phase 1 PoC 実機確認（シート作成・ヘッダ再適用・ダミー行 2 回追記）
- エラーと解決: なし
- ユーザー指摘: 列順は日常確認左・メタ ID 右の推奨案で schema 更新済み

### [2026-06-28] phase2-pdf-rename-git-branch

- 日付: [2026-06-28]
- タスク: Phase 2 コア（FR-PDF-001/003/004）・YY.MM 期限正規化・git ブランチ戦略改訂
- エラーと解決: pocExtract fileId 未指定 → debug* 関数と DEBUG_PDF_FILE_ID Script Property
- ユーザー指摘: 28.08 は YY.MM で当月末。Phase 2 一段落可。Plan 実装はブランチ必須（モード B）

### [2026-06-28] operation-menu-slack

- 日付: [2026-06-28]
- タスク: 運用メニュー一括処理・Slack エラー通知（FR-NTF-001）
- エラーと解決: なし
- ユーザー指摘: 提案 A 1→2（最短で使える状態）を優先。一括処理・Slack ダミー通知の実機確認済み

### [2026-06-28] duplicate-check-fr-sht-002

- 日付: [2026-06-28]
- タスク: 重複チェック FR-SHT-002（提案 A-3）実装・検証完了
- エラーと解決: なし
- ユーザー指摘: ダミー実行・一括処理・重複スキップの実機確認済み。提案 A-3 完了

### [2026-06-28] control-panel-sidebar

- 日付: [2026-06-28]
- タスク: ControlPanel サイドバー UI（FR-PDF-001）実装・実機確認
- エラーと解決: showSidebar 権限不足 → script.container.ui 追加。汎用エラー → authorizeContainerUi で再認可
- ユーザー指摘: サイドバー表示・3 操作（一括処理・シート作成・ヘッダー再適用）の実機確認済み

### [2026-06-28] clasp-rootdir-flat

- 日付: [2026-06-28]
- タスク: clasp rootDir を gas/src に変更し GAS エディタをフラット表示
- エラーと解決: なし
- ユーザー指摘: なし

### [2026-06-28] clasp-rootdir-init-docs

- 日付: [2026-06-28]
- タスク: 初期セットアップ doc に clasp rootDir gas/src を明記
- エラーと解決: なし
- ユーザー指摘: なし