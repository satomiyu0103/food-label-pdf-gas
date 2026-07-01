# ROADMAP

最終更新: 2026年7月1日

---

## Phase 0: プロジェクト初期化（完了）

- [x] テンプレート適用（doc / .cursor / config / scripts）
- [x] 商品DB スキーマ定義（`gas/src/schema.js`）
- [x] GAS モジュール雛形配置
- [x] 引継ぎ資料・要件ドキュメント整備

## Phase 1: PoC（完了）

- [x] `setupSpreadsheet.js` — 商品DB シート作成・ヘッダー
- [x] `spreadsheet.js` — ダミー行追記確認
- [x] `gemini.js` — 商品 PDF 1 件 → JSON 抽出
- [x] `main.js` — 手動 1 件処理（PDF → シート）

## Phase 2: 本番フロー（一段落 — 2026-06-28）

コアパイプライン（検知 → 抽出 → シート → リネーム → 移動）は実機確認済み。以下は完了。

- [x] `drive.js` — インプットフォルダ列挙・PDF 移動・リネーム（FR-PDF-004）
- [x] `schema.js` / `gemini.js` — ジャンル列・マスタ分類・期限 YY.MM 正規化
- [x] `spreadsheet.js` — `drive_file_name` 更新
- [x] `main.js` — 一括処理・バッチ継続
- [x] `gemini.js` — 429/500 リトライ、401 即停止

### Phase 2 残（Phase 3 へ繰越可）

- [x] `notification.js` — Slack エラー通知（FR-NTF-001）
- [x] `ui.js` — 一括処理メニュー・結果 alert（運用導線）
- [x] `spreadsheet.js` — JAN / 商品コード重複チェック（FR-SHT-002）
- [x] `ControlPanel.html` — サイドバー運用 UI

## Phase 3: 検証・改善（未着手）

- [ ] 実サンプル PDF で期限・栄養成分の表記ゆれ検証
- [x] 複数商品 PDF の扱い方針決定（運用で 1 PDF 1 商品を徹底。コードによる複数行展開は見送り）
- [ ] doc 同期（CHANGELOG / agent_sessions）

---

## 未確定事項

| 項目 | 初期案 | 決めるタイミング |
|---|---|---|
| ~~1 PDF に複数商品~~ | **運用ルールで 1 PDF 1 商品**（コード対応は見送り） | 2026-07-01 確定 |
| 重複キー | JAN 優先 | サンプル確認後 |
| 通知先 | 既存 Slack または新規 | 運用前 |
