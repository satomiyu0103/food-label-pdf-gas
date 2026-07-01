# GAS プロジェクト（商品 PDF → Sheets）

Google Apps Script 上のプロジェクト名は **SmartShelf** です。Git リポジトリ名（`food-label-pdf-gas`）とは別名です。詳細は [ルート README の「名称について」](../README.md#名称について) を参照してください。

## 概要

Google ドライブ内の商品 PDF を **GAS + Gemini API** で読み取り、商品情報を構造化してスプレッドシート「商品DB」へ追記する。

設計の正本:

- `src/schema.js` — 列定義・Gemini JSON キー
- `doc/specs/商品PDF_引継ぎ資料.md` — 要件・設計たたき台
- `doc/reference/setup/product-schema-design.md` — スキーマ設計メモ

## 初回セットアップ

1. `pnpm install`
2. `pnpm exec clasp login`
3. GAS プロジェクト（SmartShelf 等）を用意し、`.clasp.json` を設定する

   | キー | 値 | 備考 |
   |---|---|---|
   | `scriptId` | GAS エディタのスクリプト ID | 各自のプロジェクトに合わせる |
   | `rootDir` | **`gas/src`** | **必須**。`gas/` ではなく `gas/src` にすること |

   `rootDir` を `gas/src` にすると、ローカルの `gas/src/config.js` が GAS エディタ上では `config.gs`（ルート直下）として表示される。`rootDir` を `gas` にすると `src/config.gs` となり見づらくなる。

   `appsscript.json` と `ControlPanel.html` は **`gas/src/` 直下** に置く（`rootDir` と一致させる）。

   ```json
   {
     "scriptId": "<あなたのスクリプトID>",
     "rootDir": "gas/src",
     "scriptExtensions": [".js", ".gs"],
     "htmlExtensions": [".html"],
     "jsonExtensions": [".json"],
     "filePushOrder": [],
     "skipSubdirectories": false
   }
   ```

4. `pnpm exec clasp push`（既存 GAS に旧 `src/` 構成が残る場合は初回のみ `--force`）
5. Script Properties に `GEMINI_API_KEY` を登録（`config/.env.example` 参照）
6. スプレッドシートで **商品DB** メニュー → **商品DB シートを作成**

詳細: [doc/reference/setup/gas-clasp-pnpm.md](../doc/reference/setup/gas-clasp-pnpm.md)

## PoC 検証手順（Phase 1）

1. メニュー「商品DB → 商品DB シートを作成」でヘッダー 25 列を確認
2. 列順変更後は「ヘッダー行を再適用」を実行（既存データ行は手動移行またはシート作り直し）
3. メニュー「ダミー行を追記（デバッグ）」または GAS エディタで `debugAppendDummyRecord()`
4. GAS エディタで `debugPocExtractPdf()` — Gemini 単体（要 Script Property `DEBUG_PDF_FILE_ID`）
5. GAS エディタで `debugProcessPdf()` — PDF → 商品DB 1 行 → リネーム → 処理済み移動
6. GAS エディタで `debugTestBuildProductPdfFileName_()` — ファイル名生成ロジックの検証

## 運用（一括処理）

1. Script Properties に `DRIVE_INPUT_FOLDER_ID`・`DRIVE_PROCESSED_FOLDER_ID`・`DRIVE_ERROR_FOLDER_ID`・`GEMINI_API_KEY` を登録
2. （任意）`SLACK_WEBHOOK_URL` を登録 — 処理失敗時に Slack 通知（未設定時はスキップ）
3. インプットフォルダに PDF を配置
4. スプレッドシートを開き直し、メニュー **商品DB → 操作パネルを表示** または **インプット PDF 一括処理** を実行
5. サイドバーまたは alert のサマリで成功・失敗件数を確認。失敗 PDF はエラーフォルダへ隔離される

### 操作パネル（サイドバー）が開かないとき

`appsscript.json` に `script.container.ui` を追加した直後は **再認可** が必要です。

1. 対象スプレッドシートを開いたまま GAS エディタを開く
2. 関数 `authorizeContainerUi` を選択して **実行**
3. 承認ダイアログで **許可**（`script.container.ui` を含む）
4. スプレッドシートを再読み込み → **商品DB → 操作パネルを表示**

「エラーが発生しました。もう一度お試しください。」のみ表示される場合も、上記の再認可で解消することが多いです。

デバッグ用メニュー（**商品DB → デバッグ**）:

- **ダミー行を追記** — シート追記の確認
- **Slack 通知テスト（ダミー）** — `SLACK_WEBHOOK_URL` 疎通確認（GAS エディタからは `debugNotifySlackTest()` も可）

### PDF ファイル名規則（FR-PDF-004）

正常処理後: `{yyyymmdd}_{ジャンル}_{商品名}.pdf`

- 日付: 期限日（`expiration_date`）優先。取れない場合は処理日
- ジャンル: `src/genreList.js` のマスタから Gemini が選択

### 重複チェック（FR-SHT-002）

JAN → 商品コード → 複合キー（商品名+メーカー）の優先順。全経路で期限日を比較する。

- 同一ベースキーで期限が異なる → 別行として追記
- 一方または両方に期限なし → 既存行と重複とみなしスキップ

## ファイル

| ファイル | 役割 | 状態 |
|---|---|---|
| `src/schema.js` | 列定義・Gemini JSON キー（正本） | 実装済 |
| `src/genreList.js` | ジャンルマスタ・正規化 | 実装済 |
| `src/config.js` | Script Properties キー名 | 実装済 |
| `src/setupSpreadsheet.js` | シート作成・ヘッダー初期化 | 実装済 |
| `src/spreadsheet.js` | JSON → 商品DB 行追加・重複チェック・drive_file_name 更新 | 実装済 |
| `src/gemini.js` | PDF → Gemini API → JSON | 実装済 |
| `src/main.js` | 単件・一括オーケストレーション | 実装済 |
| `src/ui.js` | カスタムメニュー・一括処理導線 | 実装済 |
| `src/drive.js` | PDF 列挙・リネーム・フォルダ移動 | 実装済 |
| `src/notification.js` | Slack エラー通知 | 実装済 |
| `src/ControlPanel.html` | サイドバー UI | 実装済 |
| `src/appsscript.json` | マニフェスト（OAuth スコープ等） | 実装済 |

## 流用元

名刺 PDF 版（`meishi-pdf-to-sheets`）の処理制御・Drive 操作・Gemini 通信・Sheets 追記を流用する。移行チェックリストは [doc/reference/migration/meishi-to-product.md](../doc/reference/migration/meishi-to-product.md)。
