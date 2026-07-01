# 商品 PDF → Google Sheets（SmartShelf）

Google ドライブ内の商品 PDF を **GAS + Gemini API** で読み取り、商品名・消費期限・栄養成分などを構造化してスプレッドシート「商品DB」へ追記する RPA ツールです。

本番コードは [`gas/src/`](gas/src/)（Google Apps Script）。clasp でデプロイします。

## 名称について

Google 側の運用名と Git リポジトリ名は **別名** です。どちらも同じプロジェクトを指します。

| 呼び方 | 名称 | 使われる場所 |
|---|---|---|
| **製品名（運用名）** | **SmartShelf** | Google Apps Script プロジェクト名、GCP プロジェクト名、スプレッドシートや運用ドキュメント |
| **リポジトリ名** | **food-label-pdf-gas** | GitHub のリポジトリ名、`git clone` 先のフォルダ名、`package.json` / `pyproject.toml` の `name` |

リポジトリ名は「商品ラベル PDF を GAS で処理する」用途を表す内部名として初期化時に付けています。GAS / GCP を **SmartShelf** で作成済みの場合は、`.clasp.json` の `scriptId` と Script Properties をそのプロジェクトに向ければ問題ありません。リポジトリ名を SmartShelf に揃える必要はありません（GitHub でリネームする場合はリモート URL と clone 先の更新が別途必要です）。

---

## クイックスタート

1. リポジトリを clone する
2. Node.js / pnpm を用意し、依存関係を入れる:

   ```powershell
   pnpm install
   ```

3. `config/.env.example` を `config/.env` にコピーし、必要な ID・キー名を確認（**秘密情報は Git に載せない**）
4. `.clasp.json` を設定し、GAS に反映:

   `scriptId` は GAS エディタの **プロジェクトの設定** から取得する。`rootDir` は **`gas/src`**（リポジトリ内の `gas/src/` が push 対象。GAS エディタ上は `config.gs` 等としてルート直下に表示される）。

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

   ```powershell
   pnpm exec clasp login
   pnpm exec clasp push
   ```

   既存 GAS に `src/` フォルダ付きで push 済みの場合は、初回のみ `pnpm exec clasp push --force` でリモートと完全同期する。

5. セットアップ・運用手順: [`gas/README.md`](gas/README.md) と [`doc/reference/setup/gas-clasp-pnpm.md`](doc/reference/setup/gas-clasp-pnpm.md)

Python（uv）は将来の補助スクリプト用に [`pyproject.toml`](pyproject.toml) のみ残しています。現時点で Python パッケージ・pytest は未配置です。

---

## ドキュメント

### 利用者向け

| ファイル | 内容 |
|---|---|
| [doc/reference/README.md](doc/reference/README.md) | 手順・早見表の目次 |
| [doc/specs/商品PDF_引継ぎ資料.md](doc/specs/商品PDF_引継ぎ資料.md) | 要件・設計たたき台（引継ぎ正本） |
| [doc/reference/setup/product-schema-design.md](doc/reference/setup/product-schema-design.md) | 商品DB 列設計メモ |
| [doc/reference/migration/meishi-to-product.md](doc/reference/migration/meishi-to-product.md) | 名刺PDF版からの移行チェックリスト |
| [doc/specs/02_要件定義.md](doc/specs/02_要件定義.md) | 要件・MoSCoW |
| [doc/specs/04_機能一覧.md](doc/specs/04_機能一覧.md) | 機能コードと実装状況 |

### エージェント向け

| ファイル | 内容 |
|---|---|
| [AGENTS.md](AGENTS.md) | 運用フロー入口 |
| [.cursor/rules/agent_core.mdc](.cursor/rules/agent_core.mdc) | 禁止事項・CHANGELOG 義務 |
| [doc/ai/README.md](doc/ai/README.md) | エージェント知識層の入口 |
| [doc/ai/guidelines/Project_map.md](doc/ai/guidelines/Project_map.md) | 参照先一覧 |

---

## ディレクトリ概要

```
gas/src/          … 本番 GAS（clasp rootDir。push 後は GAS 上でルート直下）
.clasp.json       … rootDir は gas/src（必須）
doc/specs/        … 要件・設計・ROADMAP・CHANGELOG
doc/ai/             … エージェント知識層（guidelines・sessions・decisions）
config/           … .env.example（実値 .env は Git 除外）
scripts/          … uv 初回セットアップ（将来の Python 用）
pyproject.toml    … Python プロジェクト定義（パッケージ未配置）
```

---

## 開発コマンド

```powershell
# GAS を Google に push
pnpm exec clasp push

# GAS エディタを開く
pnpm exec clasp open

# Python 仮想環境（補助スクリプト追加時）
uv sync
```
