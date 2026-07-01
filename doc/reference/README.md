# reference（利用者向けドキュメント）

> **入口はこのファイル**。番号ではなく **カテゴリ + ファイル名** で探す。

`doc/reference/` は仕様（`doc/specs/`）やエージェント規約（`doc/ai/guidelines/`）とは別に、**利用者が読んで作業する手順・早見表** を置く場所です。  
フォルダに全部入れていること自体は問題ではなく、**1〜6 の連番で性質の違う資料を並べていたこと**が探しづらさの原因でした。

---

## カテゴリ一覧

| フォルダ | いつ読むか | ファイル |
|:---|:---|:---|
| [getting-started/](getting-started/) | 初参加・コードの読み方 | [入門ガイド.md](getting-started/入門ガイド.md) / [コード解説.md](getting-started/コード解説.md) |
| [setup/](setup/) | 環境を初めて構築するとき | [uv.md](setup/uv.md) / [gas-clasp-pnpm.md](setup/gas-clasp-pnpm.md) / [product-schema-design.md](setup/product-schema-design.md) |
| [migration/](migration/) | 既存実装の転用 | [meishi-to-product.md](migration/meishi-to-product.md) |
| [cheatsheets/](cheatsheets/) | 作業中に何度も見る | [git.md](cheatsheets/git.md) / [markdown.md](cheatsheets/markdown.md) / [ide-chat-enter.md](cheatsheets/ide-chat-enter.md) |

---

## 目的別クイックリンク

| やりたいこと | 開くファイル |
|:---|:---|
| リポジトリの全体像・フォルダの意味 | [getting-started/入門ガイド.md](getting-started/入門ガイド.md) |
| ソースの読み方・ファイルの役割 | [getting-started/コード解説.md](getting-started/コード解説.md) |
| Python / uv の環境構築 | [setup/uv.md](setup/uv.md) |
| GAS を clasp + pnpm で開発 | [setup/gas-clasp-pnpm.md](setup/gas-clasp-pnpm.md) |
| 商品DB 列設計 | [setup/product-schema-design.md](setup/product-schema-design.md) |
| 名刺PDF版からの移行 | [migration/meishi-to-product.md](migration/meishi-to-product.md) |
| 引継ぎ・設計たたき台 | [../specs/商品PDF_引継ぎ資料.md](../specs/商品PDF_引継ぎ資料.md) |
| Git の日常操作 | [cheatsheets/git.md](cheatsheets/git.md) |
| Markdown の書き方 | [cheatsheets/markdown.md](cheatsheets/markdown.md) |
| AI チャット Enter キー（改行 / 送信） | [cheatsheets/ide-chat-enter.md](cheatsheets/ide-chat-enter.md) |

---

## 初めて参加した利用者の読む順（推奨）

1. [getting-started/入門ガイド.md](getting-started/入門ガイド.md)
2. [setup/uv.md](setup/uv.md)（Python 開発の場合）
3. [cheatsheets/git.md](cheatsheets/git.md)
4. [getting-started/コード解説.md](getting-started/コード解説.md)
5. 仕様は [../specs/02_要件定義.md](../specs/02_要件定義.md) / [../specs/04_機能一覧.md](../specs/04_機能一覧.md)

GAS のみ触る場合は 2 を [setup/gas-clasp-pnpm.md](setup/gas-clasp-pnpm.md) に差し替える。

---

## 新しいファイルを追加するとき

### ルール

1. **連番は付けない**（`07_xxx.md` のような全体番号は使わない）
2. **次のいずれかのフォルダに入れる**
   - `getting-started/` … プロジェクト理解・読み方
   - `setup/` … 初回構築・ツール導入の手順書
   - `cheatsheets/` … コマンド・記法などの早見表
3. **この README.md を更新する**（カテゴリ表・目的別リンクのどちらか、必要なら両方）
4. ルート [README.md](../../README.md) の「for user」表に載せるかは、**全員が最初に読むべきか**で判断（必須でなければ reference README だけでよい）

### 新カテゴリが必要なとき

例: `testing/`（テスト手順専用）、`operations/`（デプロイ・運用）など、**3ファイル以上**が同じ目的で増える見込みならサブフォルダを新設してよい。  
1〜2ファイルだけなら、既存カテゴリに入れるか `setup/` に置く。

### ファイル名の目安

| よい例 | 避ける例 |
|:---|:---|
| `uv.md`, `docker.md`, `markdown.md` | `03_uv_setup.md`（全体連番） |
| `gas-clasp-pnpm.md`（内容が分かる英小文字+ハイフン） | `新しいドキュメント.md`（曖昧） |

---

## specs / ai_guidelines との役割分担

| 置き場所 | 内容 |
|:---|:---|
| `doc/specs/` | 何を作るか・設計・機能 ID・CHANGELOG（**正本**） |
| `doc/ai/guidelines/` | エージェント向け規約・既知エラー・実装ルール |
| `doc/reference/`（ここ） | 利用者向けの手順・早見表（**番号なし・カテゴリ別**） |
