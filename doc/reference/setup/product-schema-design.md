# 商品PDF向けスキーマ設計メモ

最終更新: 2026年6月27日

> 対象: 商品PDF抽出版のGoogle Sheets列設計。実装前の合意形成と `gas/src/schema.js` 変更時の参照用。

---

## 基本方針

初期実装では、既存の `schema.js` 駆動設計を維持し、商品1件をスプレッドシート1行として保存する。

- 列定義の正本は `gas/src/schema.js`
- Geminiに抽出させるキーは `gemini: true` の列から自動生成する
- シート列順は `SHEET_SCHEMA.columns` の配列順に合わせる
- 栄養成分は主要項目をフラット列にし、その他はメモ列に逃がす

---

## 推奨シート名

候補: `商品DB`

---

## 初期列案

| # | ヘッダー | key | gemini | 備考 |
|:---:|---|:---:|:---:|---|
| 1 | 処理日時 | `processed_at` | — | GAS付与 |
| 2 | 元ファイル | `source_file` | — | GAS付与 |
| 3 | 商品名 | `product_name` | ○ | 必須候補 |
| 4 | メーカー | `maker` | ○ | |
| 5 | ブランド | `brand` | ○ | |
| 6 | JANコード | `jan_code` | ○ | 重複キー候補 |
| 7 | 商品コード | `product_code` | ○ | 重複キー候補 |
| 8 | 期限種別 | `expiration_type` | ○ | 消費期限 / 賞味期限 / 不明 |
| 9 | 期限日 | `expiration_date` | ○ | YYYY-MM-DD 推奨 |
| 10〜23 | 原材料・栄養成分等 | — | ○ | `schema.js` 参照 |

---

## 重複キー設計

| 優先度 | キー | 正規化例 |
|:---:|---|---|
| 1 | `jan_code` | 数字以外を除去 |
| 2 | `product_code` | 空白除去 + 大文字化 |
| 3 | `product_name + maker + expiration_date` | trim + 空白正規化 |

---

## 関連

- [商品PDF_引継ぎ資料.md](../../specs/商品PDF_引継ぎ資料.md)
- [meishi-to-product.md](../migration/meishi-to-product.md)
