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
