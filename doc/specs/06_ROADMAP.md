# ROADMAP

最終更新: 2026年6月28日

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

## Phase 2: 本番フロー（未着手）

- [ ] `drive.js` — インプットフォルダ列挙・PDF 移動
- [ ] `main.js` — 一括処理・バッチ継続
- [ ] `notification.js` — Slack エラー通知
- [ ] `spreadsheet.js` — JAN / 商品コード重複チェック
- [ ] `gemini.js` — 429/500 リトライ、401 即停止
- [ ] `ui.js` / `ControlPanel.html` — 運用 UI

## Phase 3: 検証・改善（未着手）

- [ ] 実サンプル PDF で期限・栄養成分の表記ゆれ検証
- [ ] 複数商品 PDF の扱い方針決定
- [ ] doc 同期（CHANGELOG / agent_sessions）

---

## 未確定事項

| 項目 | 初期案 | 決めるタイミング |
|---|---|---|
| 1 PDF に複数商品 | 初期版は 1 商品のみ | サンプル確認後 |
| 重複キー | JAN 優先 | サンプル確認後 |
| 通知先 | 既存 Slack または新規 | 運用前 |
