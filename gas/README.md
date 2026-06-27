# GAS プロジェクト（商品 PDF → Sheets）

## 概要

Google ドライブ内の商品 PDF を **GAS + Gemini API** で読み取り、商品情報を構造化してスプレッドシート「商品DB」へ追記する。

設計の正本:

- `src/schema.js` — 列定義・Gemini JSON キー
- `doc/specs/商品PDF_引継ぎ資料.md` — 要件・設計たたき台
- `doc/reference/setup/product-schema-design.md` — スキーマ設計メモ

## 初回セットアップ

1. `pnpm install`
2. `pnpm exec clasp login`
3. GAS プロジェクトを作成し `.clasp.json` の `scriptId` を設定
4. `pnpm exec clasp push`
5. Script Properties に API キー・フォルダ ID を登録（`config/.env.example` 参照）
6. スプレッドシートで **商品DB** メニュー → **商品DB シートを作成**

詳細: [doc/reference/setup/gas-clasp-pnpm.md](../doc/reference/setup/gas-clasp-pnpm.md)

## ファイル

| ファイル | 役割 | 状態 |
|---|---|---|
| `src/schema.js` | 列定義・Gemini JSON キー（正本） | 実装済 |
| `src/config.js` | Script Properties キー名 | 実装済 |
| `src/main.js` | オーケストレーション | 未実装 |
| `src/drive.js` | インプットフォルダ PDF 列挙・移動 | 未実装 |
| `src/gemini.js` | PDF → Gemini API → JSON | 未実装 |
| `src/spreadsheet.js` | JSON → 商品DB 行追加・重複チェック | 未実装 |
| `src/setupSpreadsheet.js` | シート作成・ヘッダー初期化 | 未実装 |
| `src/notification.js` | Slack エラー通知 | 未実装 |
| `src/ui.js` | メニュー・サイドバー | 一部実装 |
| `ControlPanel.html` | サイドバー UI | 雛形のみ |

## 流用元

名刺 PDF 版（`meishi-pdf-to-sheets`）の処理制御・Drive 操作・Gemini 通信・Sheets 追記を流用する。移行チェックリストは [doc/reference/migration/meishi-to-product.md](../doc/reference/migration/meishi-to-product.md)。
