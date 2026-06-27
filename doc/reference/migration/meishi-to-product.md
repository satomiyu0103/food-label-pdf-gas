# 名刺PDF版から商品PDF版への移行チェックリスト

最終更新: 2026年6月27日

> 対象: 既存の名刺PDF→Sheets GASプロジェクトを、商品PDF→Sheets抽出プログラムへ転用する実装者。
> 要件・スキーマ: [商品PDF_引継ぎ資料.md](../../specs/商品PDF_引継ぎ資料.md) / [product-schema-design.md](../setup/product-schema-design.md)

---

## 1. 移行の前提

- 初期版は **1 PDF = 1 商品 = 1 シート行**
- Sheets列定義の正本は `gas/src/schema.js`
- Driveの3フォルダ構成は流用する
- 秘密情報は Script Properties に置く

---

## 2. コード変更チェックリスト

### `gas/src/schema.js`

- [x] `sheetName` を `商品DB` に変更
- [x] 商品列へ置き換え（23列）
- [x] `normalizeDuplicateValue_()` を商品向けに定義
- [ ] `spreadsheet.js` 側の重複検索処理を商品キー対応に実装

### `gas/src/gemini.js`

- [ ] `extractProductFromPdf_()` を実装
- [ ] `buildGeminiPrompt_()` を商品ラベル向けに完成させる
- [ ] 429/500 リトライ、401 即停止を維持

### `gas/src/spreadsheet.js`

- [ ] `appendProductRecord_()` を実装
- [ ] JAN / 商品コード / 複合キー重複チェック

### `gas/src/main.js` / `drive.js` / `ui.js` / `notification.js`

- [ ] 名刺版の処理制御を流用し、商品向け文言・関数名に変更

---

## 3. 検証チェックリスト

- [ ] 1 PDF 1 商品で商品名・期限・栄養成分が想定列へ入る
- [ ] 破損 PDF はエラーフォルダへ隔離
- [ ] 同じ JAN で 2 回投入したときの挙動が仕様通り

---

## 流用元リポジトリ

名刺 PDF 版: `meishi-pdf-to-sheets`（同一親ディレクトリ配下を想定）。`gas/src/` の各モジュールを参照して実装する。
