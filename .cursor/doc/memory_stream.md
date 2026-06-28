# Memory Stream (AI Chat Log & Facts)

## 記憶ストリームの運用定義
- 本ファイルはタスク完了時にAIエージェントが自動でファクトを追記する領域です。
- 人間による手動編集は原則不要です。
- 追記ルール: [`.cursor/rules/memory_logger.mdc`](../rules/memory_logger.mdc)

## 過去の共通原則

（50KB 超過時に memory_logger が古いログを圧縮して追記する領域）

## 蓄積されたファクト

### [2026-06-28] memory_logger・template_sync

- 日付: [2026-06-28]
- タスク: memory_logger・template_sync 新設と ai-agent-devenv-template 同期
- エラーと解決: なし
- ユーザー指摘: テンプレ由来ファイル変更時は ai-agent-devenv-template も同様に更新するルール必須
