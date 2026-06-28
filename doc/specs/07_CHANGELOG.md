# CHANGELOG

このファイルは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) 形式に準拠する。

---

## [Unreleased]

### Added

- `FR-NTF-001` エラー通知: PDF 処理失敗時に Slack Incoming Webhook へ通知（`notification.js`・未設定時はスキップ）
- `FR-PDF-001` PDF 自動検知: スプレッドシートメニュー「インプット PDF 一括処理」から `processAllPendingPdfs` を実行可能（`ui.js`）
- `FR-PDF-004` PDF ファイル名自動変更: 抽出成功後に `{yyyymmdd}_{ジャンル}_{商品名}.pdf` 形式へリネーム（`drive.js`・`genreList.js`）
- `FR-PDF-001` PDF 自動検知: `processAllPendingPdfs` とインプットフォルダ列挙を実装
- `FR-PDF-003` 処理済み移動: `moveFileToProcessedFolder_` を実装（フォルダ ID 未設定時はスキップ）
- `FR-PDF-002` 商品情報抽出: 裏面刻印 YY.MM（例 28.08/+DFL/B）の期限正規化とプロンプト強化
- `FR-SHT-001` DB 書き込み: `setupSpreadsheet.js`・`spreadsheet.js`・`main.js` で商品DB シート作成・手動 1 件追記（PoC）を実装

- プロジェクト初期化: `ai-agent-devenv-template` ベースの doc / config / scripts 構成
- GAS 雛形: `gas/src/`（`schema.js` に商品DB 23 列定義）
- 引継ぎ資料: `doc/specs/商品PDF_引継ぎ資料.md`
- スキーマ設計メモ: `doc/reference/setup/product-schema-design.md`
- 移行チェックリスト: `doc/reference/migration/meishi-to-product.md`
- `.cursor/skills/`: Phase 1〜3・監査・CHANGELOG 等 17 本のタスク手順 Skill
- `NFR-OPS-002` 運用・保守: `japanese-tech-writing` Skill と `japanese_tech_writing.mdc`（適用タイミング）を追加

### Changed

- `NFR-OPS-002` 運用・保守: `git_workflow` にモード A/B ブランチ戦略・Plan 連携を追記。Phase 2 を ROADMAP 上で一段落に更新
- `FR-SHT-001` DB 書き込み: `schema.js` に `genre`・`drive_file_name` 列を追加（25 列）
- `FR-SHT-001` DB 書き込み: 商品DB 列順を日常確認項目左・メタ・ID 右に再配置（`schema.js`）
- `NFR-OPS-002` 運用・保守: README・`00_プロジェクト概要.md`・`gas/README.md` に運用名 SmartShelf とリポジトリ名 `food-label-pdf-gas` の対応を明記
- `NFR-OPS-002` 運用・保守: ログ更新時のテンプレ同期方針を `template_sync`・`memory_logger`・Phase 3 Skill に追記
- `NFR-OPS-002` 運用・保守: `documentation_wording.mdc` を新設し「人間」「人向け」表記を「利用者」「開発者」等へ置換
- `NFR-OPS-002` 運用・保守: Phase 3・`agent_core`・`Project_map` に日本語技術文書ルールへの参照を追加
- `NFR-OPS-002` 運用・保守: memory_stream・agent_sessions・開発日誌をテンプレへ同時同期する方針に変更（`template_sync`・`memory_logger`・`agent-session-record`）
- `NFR-OPS-002` 運用・保守: 「終了」等のセッション完了時にログ同期・commit・push まで行う締め手順を `memory_logger` に追加
