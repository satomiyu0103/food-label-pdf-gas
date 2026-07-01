# doc/ai — エージェント知識層

エージェント向けのガイド・セッション記録・意思決定索引を **1 ツリー** に集約する正本です。

実行層（常時制約・手順・短期記憶）は [`.cursor/`](../.cursor/) にあります。役割分担は [runtime.md](runtime.md) を参照してください。

## ディレクトリ

| パス | 内容 |
|---|---|
| [guidelines/](guidelines/) | Project_map・checklists・既知エラー正本 |
| [sessions/](sessions/) | チャット由来のセッション記録本文 |
| [decisions/](decisions/README.md) | ADR・ABC・sessions の横断索引 |
| [runtime.md](runtime.md) | `.cursor` 実行層の説明 |

## 記録の流れ

```text
チャット（比較検討・実装）
  → doc/ai/sessions/（本文）
  → doc/specs/00_開発日誌.md（索引）
  → 昇格先（rules / specs / ABC / adr / エラー正本）
  → doc/ai/decisions/README.md（トピック索引）
```

## 手順 SKILL

| 状況 | SKILL |
|---|---|
| 実装タスク完了 | [agent-session-record](../../.cursor/skills/agent-session-record/SKILL.md) |
| 設計のみ・比較検討 | [design-decision-record](../../.cursor/skills/design-decision-record/SKILL.md) |
| 既知エラー | [known-error-entry](../../.cursor/skills/known-error-entry/SKILL.md) |
| 短期ファクト（自動） | [memory_logger](../../.cursor/rules/memory_logger.mdc) → `.cursor/doc/memory_stream.md` |

## 索引

詳細な参照先一覧は [guidelines/Project_map.md](guidelines/Project_map.md) を参照。
