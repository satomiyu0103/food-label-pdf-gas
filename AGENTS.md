# Agent 運用フロー

> **常時**: [`.cursor/rules/agent_core.mdc`](.cursor/rules/agent_core.mdc)  
> **実装時**（`src/`・`doc/` 等）: [`.cursor/rules/agent_implement_entry.mdc`](.cursor/rules/agent_implement_entry.mdc)  
> **Phase 3 詳細**: [`.cursor/skills/phase3-doc-updates/SKILL.md`](.cursor/skills/phase3-doc-updates/SKILL.md)

---

## クイックリファレンス

| やりたいこと | 参照先 |
|---|---|
| 要件確認 | `doc/specs/02_要件定義.md` |
| 機能一覧・実装状況 | `doc/specs/04_機能一覧.md` |
| 設計・フロー確認 | `doc/specs/03_システム設計.md` |
| 過去のエラー確認 | `doc/ai/guidelines/試験実装のエラー.md` |
| 意思決定・セッション索引 | `doc/ai/decisions/README.md` |
| エージェント知識の入口 | `doc/ai/README.md` |
| 開発ルール | `.cursor/rules/` 各 `*.mdc` |
| Phase 1〜3 手順 | `.cursor/skills/implementation-phase1/` 〜 `phase3-doc-updates/` |
| AI エージェント向け参照先一覧 | `doc/ai/guidelines/Project_map.md` |
| 設計のみの意思決定記録 | `.cursor/skills/design-decision-record/SKILL.md` |
| 日本語技術文書の文体 | `.cursor/rules/japanese_tech_writing.mdc` → `japanese-tech-writing/SKILL.md` |
| 記憶ストリーム（ファクト追記） | `.cursor/doc/memory_stream.md`（`.cursor/rules/memory_logger.mdc`） |
| テンプレ同期（`ai-agent-devenv-template/` がある場合） | `.cursor/rules/template_sync.mdc` — **同期対象変更時は同一ターン内に必須** |

---

## チャットでのスコープ明示（任意）

別プロジェクトの話題が混ざりやすいとき、依頼の先頭に付ける。

```
[ワークスペースのみ]
このリポジトリ以外・別プロジェクトの話はしないでください。
```

常時の境界定義: [`.cursor/rules/workspace_boundary.mdc`](.cursor/rules/workspace_boundary.mdc)
