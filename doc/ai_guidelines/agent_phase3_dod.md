# Phase 3 — 完了後 DoD（Definition of Done）

最終更新: 2026-05-30

> Cursor ルール [`agent_core.mdc`](../../.cursor/rules/agent_core.mdc) / [`agent_implement.mdc`](../../.cursor/rules/agent_implement.mdc) から参照する **正本**。Phase 3 の長い表・`doc/records/` 分割はここに集約する。

---

## 更新トリガー一覧

> プロトタイプ後・doc 整合の **監査用チェック** は [checklists/documentation.md](checklists/documentation.md)（根拠: 下表・§6）。

| トリガー（いつ） | 更新するドキュメント | 必須度 |
|---|---|:---:|
| 実装・修正・ドキュメント整備を完了した | `doc/specs/07_CHANGELOG.md`（`[Unreleased]`・FR コード付き） | 必須 |
| 新機能追加 or 実装状況が変わった | `doc/specs/04_機能一覧.md`（実装状況列） | 条件 |
| ファイル・ディレクトリの追加・削除・移動 | `doc/specs/05_ディレクトリ構成.md`、`src/{{APP_DIR}}/README.md` のツリー | 条件 |
| 要件・スコープ・MoSCoW が変わった | `doc/specs/02_要件定義.md` | 条件 |
| 設計・データモデル・画面・API が変わった | `doc/specs/03_システム設計.md` | 条件 |
| 再利用価値のあるエラーが発生した | `doc/ai_guidelines/試験実装のエラー.md`（記載条件は同ファイル参照） | 条件 |
| 技術選定の理由を残す決定をした | `doc/adr/NNNN-タイトル.md` を新規追加 | 条件 |
| `doc/` に新規 md を追加 or 参照先一覧を変えた | `doc/ai_guidelines/Project_map.md`、必要なら `README.md`・`TEMPLATE_SETUP.md` | 条件 |
| 新しい生成物・秘密ファイルのパターンが増えた | `.gitignore` | 条件 |
| フェーズ計画・優先度が変わった | `doc/specs/06_ROADMAP.md` | 条件 |
| `src/` 配下に README を新設した | `doc/ai_guidelines/Project_map.md` 早引き（`実装規約.md` §10 参照） | 条件 |
| 日誌・CHANGELOG 等が肥大し `doc/records/` を分割 | `doc/records/` 新設・`specs/` スタブ化・索引更新（下記 §6） | 条件 |
| エージェントチャットで実装・設計変更を完了した | `doc/records/agent_sessions/YYYY-MM-DD_*.md` + `00_開発日誌.md` 索引（`エージェント実装記録.md` 参照） | 必須 |

---

## 1. CHANGELOG（必須）

`doc/specs/07_CHANGELOG.md` の `[Unreleased]` に以下の形式で記入する:

```markdown
### Added / Changed / Fixed
- `FR-XXXX` 機能名: 変更内容の1行サマリ
```

FR コード・サマリが欠ける場合は記入を中断し、ユーザーに確認する。

---

## 2. ディレクトリ構成（条件付き）

ファイル・ディレクトリの追加・削除・移動を行った場合:

- `doc/specs/05_ディレクトリ構成.md` を実態に合わせて修正する
- `src/your_package/README.md`（テンプレ適用後は `src/{{APP_DIR}}/README.md`）のディレクトリツリーも合わせて修正する

---

## 3. 機能一覧（条件付き）

新機能を追加した場合または実装状況が変わった場合:

- `doc/specs/04_機能一覧.md` の実装状況列を更新する

---

## 4. 既知エラー（条件付き）

`doc/ai_guidelines/試験実装のエラー.md` の「記載する条件」を満たす場合のみ追記する。単純な typo や個人環境だけの障害は書かない。

---

## 5. 参照インデックス（条件付き）

`doc/` 配下の構成・参照先が変わった場合:

- `doc/ai_guidelines/Project_map.md` のツリーと要約表を更新する
- テンプレートリポジトリでは `README.md` と `TEMPLATE_SETUP.md` のツリーも整合させる

---

## 6. `doc/records/` への分割・移動（条件付き）

`doc/specs/` は **要件・台帳・直近の変更** を置く。時系列で膨らむ本文は `doc/records/` に逃がし、`specs/` には **索引（スタブ）** を残す。Phase 1 の必読パスは可能な限り維持する（スタブ先リンクで足りる状態にする）。

### 分割の対象になりうるファイル

| 種別 | 現パス | 性質 | 分割後の置き場（例） |
|---|---|---|---|
| 開発日誌 | `doc/specs/00_開発日誌.md` | 時系列・長文・追記頻度高 | `doc/records/journal/YYYY.md` |
| 実装履歴（確定版） | `doc/specs/07_CHANGELOG.md` | バージョン単位で増殖 | `doc/records/changelog/vX.Y.Z.md` または年次 |
| 実機 FB 記録 | （貼り付け先が日誌内） | セッション単位の記録 | `doc/records/feedback/YYYY-MM-DD.md` |
| ギャップ詳細 | `doc/specs/01_ABC見送り・ギャップ台帳.md` | 正本だが行数が増える | 索引は `specs/`、長い事例は `doc/records/gaps/` |
| ロードマップ履歴 | `doc/specs/06_ROADMAP.md` | フェーズ計画＋過去の検討 | 完了フェーズのみ `doc/records/roadmap/`（任意） |

### `doc/records/` を **作成する** 基準（いずれか1つで可）

| # | 条件 |
|:---:|---|
| 1 | 分割対象ファイルのいずれかが **400 行超** |
| 2 | 分割対象のいずれかが **250 行超** かつ、直近 1 ヶ月で **5 回以上** 追記した |
| 3 | `00_開発日誌.md` が **300 行超**（最優先で `journal/` 分割を検討） |
| 4 | `07_CHANGELOG.md` の **リリース済み** セクションが **3 バージョン分** を超え、ファイル全体が **350 行超** |
| 5 | 実機 FB を日誌に貼り続け、1 ファイル内の FB セクションが **読み返しづらい** とチームで合意した |

作成時は `doc/records/README.md`（索引）を必ず置く。

### **分割** と **移動** の使い分け

| 操作 | いつ使う | `doc/specs/` に残すもの |
|---|---|---|
| **分割（推奨）** | ファイルの一部だけが肥大 | ファイル名は維持。先頭に索引を残し、本文は `records/` へリンク |
| **移動** | ファイル全体が記録アーカイブ化 | 同名の **スタブ**（10〜30 行）のみ |
| **移動しない** | 04 機能一覧・02 要件定義・03 設計・05 ディレクトリ構成 | 常に `specs/` 正本のまま |

**原則**: 削除ではなく **スタブ＋リンク**。`Project_map`・`01_ABC` からの参照を切らない。

### 分割後のディレクトリ例

```text
doc/records/
├── README.md
├── journal/
├── changelog/
├── feedback/
├── gaps/
└── agent_sessions/
```

### 実施時の必須後処理

`doc/records/` を新設・分割・移動した場合:

- `doc/specs/05_ディレクトリ構成.md` を更新
- `doc/ai_guidelines/Project_map.md` のツリー・要約表を更新
- `07_CHANGELOG.md` に `Changed` で分割理由を1行記録
- スタブ化した `specs/` 側ファイルのリンク切れを全リポジトリ検索で修正

---

## 参照

- [エージェント実装記録.md](エージェント実装記録.md) — セッション記録
- [Project_map.md](Project_map.md) — doc 索引
- [checklists/README.md](checklists/README.md) — 定期監査チェックリスト索引
