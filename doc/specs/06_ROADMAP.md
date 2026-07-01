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

## Phase 3: 検証・改善（進行中）

- [ ] 実サンプル PDF で期限・栄養成分の表記ゆれ検証
- [x] 複数商品 PDF の扱い方針決定（運用で 1 PDF 1 商品を徹底。コードによる複数行展開は見送り）
- [ ] doc 同期（CHANGELOG / agent_sessions）

## Phase 4: 期限通知・期限管理シート（計画 — 2026-07-01 確定）

> 設計記録: [2026-07-01_expiration-alert-plan.md](../ai/sessions/2026-07-01_expiration-alert-plan.md)

**目的**: 備蓄食料・医療品などの消費期限を、可読性の高い運用シートで管理し、Slack で月初・7 日前にリマインドする。

**方針**: `商品DB` は PDF 正本のまま。`期限管理` シートで在庫・通知フラグ・ステータスを扱う。通知は既存 Slack Webhook を拡張する。

### Phase 4a: 期限管理シート基盤（FR-SHT-003）

- [ ] `schema.js`（または `inventorySchema.js`）— `期限管理` 列定義
- [ ] `setupSpreadsheet.js` — 期限管理タブ作成・ヘッダー・数式列テンプレ
- [ ] `inventorySpreadsheet.js`（新規）— ミラー行作成・フラグ更新
- [ ] `spreadsheet.js` / `main.js` — 商品DB 追記成功時に期限管理へ 1 行同期

### Phase 4b: Slack 期限通知（FR-NTF-003）

- [ ] `expirationAlert.js`（新規）— 日次走査・月初 / 7 日前判定
- [ ] `notification.js` — 期限 digest 本文・`postSlackMessageSafely_` 呼び出し
- [ ] 日次トリガー設定手順（`gas/README.md`）
- [ ] `ui.js` — 期限通知テスト（ダミー）メニュー

### Phase 4c: 運用・検証

- [ ] 条件付き書式（期限接近の色付け）
- [ ] 在庫数・ステータス更新の運用導線（メニューまたはサイドバー）
- [ ] `scripts/` — 期限判定・フラグロジックのローカル検証
- [ ] GAS 実機: 月初 digest・7 日前通知・フラグ更新の確認
- [ ] `04_機能一覧.md` — FR-NTF-003 / FR-SHT-003 を実装済へ更新

### 通知ルール（確定）

| トリガー | 条件 | Slack 内容 |
|---|---|---|
| 毎月 1 日 | `status=有効` かつ `quantity>0` かつ期限日が**当月** | 当月期限商品の一覧 digest |
| 毎日 | 上記に加え期限日 = **今日 + 7 日** かつ `notified_7d` 未済 | 7 日前リマインド（複数件はまとめ可） |

### 暫定デフォルト（実装前に変更可）

| 項目 | 値 |
|---|---|
| 在庫初期値 | PDF 1 枚 = 1 |
| 月初と 7 日前の重複 | 両方通知 |
| 7 日前を逃した場合 | 未通知かつ 7 日以内なら翌日以降も送信 |

---

## 未確定事項

| 項目 | 状態 | 備考 |
|---|---|---|
| ~~1 PDF に複数商品~~ | **確定** | 運用ルールで 1 PDF 1 商品（2026-07-01） |
| 重複キー | JAN 優先 | サンプル確認後 |
| ~~期限通知の通知先~~ | **Slack 確定** | Gmail / Notion / カレンダーは MVP 見送り（2026-07-01） |
| 期限管理シート名 | `期限管理` | Phase 4a で実装 |
| 在庫管理のスコープ | 個人備蓄向けの簡易 `quantity` + `status` | 当初 Wont の在庫管理を限定スコープで再導入 |
