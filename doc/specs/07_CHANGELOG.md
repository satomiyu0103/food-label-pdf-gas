# CHANGELOG

このファイルは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) 形式に準拠する。

---

## [Unreleased]

### Added

- プロジェクト初期化: `ai-agent-devenv-template` ベースの doc / config / scripts 構成
- GAS 雛形: `gas/src/`（`schema.js` に商品DB 23 列定義）
- 引継ぎ資料: `doc/specs/商品PDF_引継ぎ資料.md`
- スキーマ設計メモ: `doc/reference/setup/product-schema-design.md`
- 移行チェックリスト: `doc/reference/migration/meishi-to-product.md`
- `.cursor/skills/`: Phase 1〜3・監査・CHANGELOG 等 17 本のタスク手順 Skill

### Changed

- `NFR-OPS-002` 運用・保守: `doc/ai_guidelines` ガイド正本を `.cursor/rules`・`.cursor/skills` へ再配置（doc は索引スタブ、`agent_implement.mdc` → `agent_implement_entry.mdc`）
- `NFR-OPS-002` 運用・保守: `ai-agent-devenv-template/` を同構成に同期（Rules 12・Skills 17・doc スタブ化）
