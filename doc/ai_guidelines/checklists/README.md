# 定期監査チェックリスト（索引）

最終更新: 2026-05-30

> **正本**: 原則・例外・トレードオフは各 **ガイド**（`doc/ai_guidelines/*.md`）にのみ書く。  
> 本フォルダは **観察可能な Yes/No** の検証項目のみ。判断が必要なときは各項目の「根拠」リンク先を読む。

## いつ使うか

| タイミング | 使うファイル |
|---|---|
| プロトタイプ完成後の総点検 | [post_prototype_audit.md](post_prototype_audit.md) |
| 不定期リファクタ・設計見直し前後 | [refactor_audit.md](refactor_audit.md) |
| カテゴリ単体の棚卸し | 下表の大分類ファイル |

**通常の実装・PR 時**は Phase 1〜2 のガイドを読む。本フォルダは **常時必読にしない**（`.cursor/rules/agent_implement.mdc` 参照）。

## 大分類一覧

| 大分類 | ファイル | 根拠ガイド |
|---|---|---|
| セキュリティ | [security.md](security.md) | （項目ごとに specs / 実装規約を参照） |
| 実装・品質 | [implementation.md](implementation.md) | [実装規約.md](../実装規約.md) |
| 運用・バッチ | [operations.md](operations.md) | [安全運用ガイド.md](../安全運用ガイド.md) |
| リファクタリング | [refactoring.md](refactoring.md) | [リファクタリング判断基準.md](../リファクタリング判断基準.md) |
| ドキュメント・完了 | [documentation.md](documentation.md) | [agent_phase3_dod.md](../agent_phase3_dod.md)・[エージェント実装記録.md](../エージェント実装記録.md) |

## AI への渡し方（例）

```text
doc/ai_guidelines/checklists/refactor_audit.md を上から照合し、
未達項目を「大分類 / 項目 / 根拠 § / 該当ファイル」付きで列挙してください。
判断が要る項目は根拠ガイドを引用して結論を書いてください。
```

## 実施記録（任意）

監査実施時は、該当チェックリスト末尾の「実施記録」に日付・実施者・未達の要約を追記する。
