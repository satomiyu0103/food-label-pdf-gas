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

- `NFR-OPS-002` 運用・保守: ログ更新時のテンプレ同期方針を `template_sync`・`memory_logger`・Phase 3 Skill に追記
- `NFR-OPS-002` 運用・保守: `documentation_wording.mdc` を新設し「人間」「人向け」表記を「利用者」「開発者」等へ置換
