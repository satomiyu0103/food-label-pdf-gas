# 商品PDF向けスキーマ設計メモ

最終更新: 2026年6月28日

> 対象: 商品PDF抽出版のGoogle Sheets列設計。実装前の合意形成と `gas/src/schema.js` 変更時の参照用。

---

## 基本方針

初期実装では、既存の `schema.js` 駆動設計を維持し、商品1件をスプレッドシート1行として保存する。

- 列定義の正本は `gas/src/schema.js`
- Geminiに抽出させるキーは `gemini: true` の列から自動生成する
- シート列順は `SHEET_SCHEMA.columns` の配列順に合わせる
- 栄養成分は主要項目をフラット列にし、その他はメモ列に逃がす

---

## 列配置方針（2026-06-28）

| ゾーン | 位置 | 内容 |
|---|---|---|
| A 日常確認 | 左 | 商品名、ジャンル、期限、アレルゲン、原材料、内容量 |
| B 栄養ブロック | 左〜中央 | 基準量と主要 5 成分を連続配置 |
| C 補足 | 中央 | メーカー、保存方法、メモ類 |
| D メタ・ID | 右 | JAN、商品コード、処理日時、元ファイル、Drive ファイル名 |

列順変更後はメニュー「ヘッダー行を再適用」を実行する。既存データ行のセル位置は自動では移動しない。

---

## 推奨シート名

候補: `商品DB`

---

## 列一覧（左から順）

| # | ヘッダー | key | gemini | ゾーン | 備考 |
|:---:|---|:---:|:---:|---|
| 1 | 商品名 | `product_name` | ○ | A | 必須候補 |
| 2 | ジャンル | `genre` | ○ | A | `genreList.js` マスタから 1 件。ファイル名にも使用 |
| 3 | 期限種別 | `expiration_type` | ○ | A | 消費期限 / 賞味期限 / 不明 |
| 4 | 期限日 | `expiration_date` | ○ | A | YYYY-MM-DD。裏面刻印 YY.MM（例 28.08）は当月末日に正規化 |
| 5 | アレルゲン | `allergens` | ○ | A | |
| 6 | 原材料 | `ingredients` | ○ | A | |
| 7 | 内容量 | `net_content` | ○ | A | |
| 8 | 栄養成分の基準量 | `serving_size` | ○ | B | |
| 9 | エネルギー kcal | `energy_kcal` | ○ | B | |
| 10 | たんぱく質 g | `protein_g` | ○ | B | |
| 11 | 脂質 g | `fat_g` | ○ | B | |
| 12 | 炭水化物 g | `carbohydrate_g` | ○ | B | |
| 13 | 食塩相当量 g | `salt_equivalent_g` | ○ | B | |
| 14 | メーカー | `maker` | ○ | C | |
| 15 | ブランド | `brand` | ○ | C | |
| 16 | 保存方法 | `storage_method` | ○ | C | |
| 17 | 原産国 | `country_of_origin` | ○ | C | |
| 18 | 栄養成分メモ | `nutrition_notes` | ○ | C | |
| 19 | 読み取りメモ | `confidence_notes` | ○ | C | |
| 20 | 備考 | `notes` | ○ | C | |
| 21 | JANコード | `jan_code` | ○ | D | 重複キー候補 |
| 22 | 商品コード | `product_code` | ○ | D | 重複キー候補 |
| 23 | 処理日時 | `processed_at` | — | D | GAS付与 |
| 24 | 元ファイル | `source_file` | — | D | スキャン時の元名（不変） |
| 25 | Driveファイル名 | `drive_file_name` | — | D | リネーム後の Drive 上の名前 |

---

## 重複キー設計

優先順位は JAN → 商品コード → 複合キー（`product_name + maker`）。全経路で `expiration_date` を比較に用いる。期限なしは期限不問として既存行と重複とみなす。

| 優先度 | ベースキー | 正規化例 |
|:---:|---|---|
| 1 | `jan_code` | 数字以外を除去 |
| 2 | `product_code` | 空白除去 + 大文字化 |
| 3 | `product_name + maker` | trim + 空白正規化 |

期限比較: `YYYY-MM-DD` 正規化。両方に期限があり日付が異なる場合のみ別行として追記する。

---

## 関連

- [商品PDF_引継ぎ資料.md](../../specs/商品PDF_引継ぎ資料.md)
- [meishi-to-product.md](../migration/meishi-to-product.md)
