---
name: agent-session-record
description: チャット実装完了時のセッション記録（2 層: 開発日誌索引 + agent_sessions 本文）。
---

# エージェント実装記録

## いつ書くか

| タイミング | 必須 |
|---|---|
| 実装タスク完了（Phase 3 同時） | ○ |
| 設計のみ・コード未変更 | × |
| 1 行修正・typo のみ | ×（CHANGELOG のみ） |

## 2 層構成

| 層 | パス | 内容 |
|---|---|---|
| 索引 | `doc/specs/00_開発日誌.md` | `# YYYYMMDD` で 3〜10 行 + 詳細リンク |
| 本文 | `doc/records/agent_sessions/YYYY-MM-DD_トピック.md` | 背景・意思決定・変更一覧・検証 |

## 本文の必須項目

1. 日付・スコープ（FR コード）
2. 背景・課題
3. 意思決定（採用 / 非採用）
4. 実装サマリ
5. 変更ファイル一覧
6. 検証コマンド

ファイル名: `YYYY-MM-DD_{短いトピック}.md`

## テンプレート同期

- セッション本文・`00_開発日誌.md` の索引追記後、`ai-agent-devenv-template/` が存在すれば [`.cursor/rules/template_sync.mdc`](../../rules/template_sync.mdc) に従い **同一パスでコピー**する
- **本 SKILL の手順・必須項目・パス構造**を変更した場合、または `doc/records/README.md` / `00_開発日誌.md` の **記入ルール** を変更した場合もテンプレを同期する
