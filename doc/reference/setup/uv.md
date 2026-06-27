# uv 環境構築ガイド（Windows: PowerShell 優先）

概要
- このドキュメントは `uv` を用いた開発環境の初期セットアップ手順をまとめたものです。主に Windows（PowerShell）向けに記載し、補足で Unix/macOS 向けのコマンドも示します。

前提条件
- `pyproject.toml` がプロジェクトルートに存在すること（依存・ビルド情報はここに記載します）。
- Python（推奨: 3.10 以上）がインストールされていること。
- `uv` CLI を使用できること（未インストールの場合は下記の手順でインストール）。

実行場所
- 以下のコマンドは**必ずプロジェクトルート（`pyproject.toml` と同じ場所）**で実行してください。

PowerShell での確認例:

```powershell
# プロジェクトルートにいるか確認
Test-Path -Path pyproject.toml
```

uv のインストール（例）

PowerShell:
```powershell
python -m pip install --upgrade pip
python -m pip install uv
```

pipx を使う場合（ユーザー領域に隔離してインストール）:
```powershell
python -m pip install --user pipx
python -m pipx install uv
```

Unix/macOS (bash):
```bash
python -m pip install --upgrade pip
python -m pip install uv
```

仮想環境の作成
- `uv venv` をプロジェクトルートで実行します。uv が管理する仮想環境が作成されます。以降の依存操作は `uv pip ...` を使うとその環境内で実行されます。

```powershell
uv venv
```

開発用インストール（editable）

```powershell
# カレントプロジェクトを開発モードでインストール
uv pip install -e .
```

依存の追加とロックファイル
- 依存を追加すると `uv` がロックファイル（`uv.lock` 等）を自動生成／更新します。更新後はロックファイルをコミットして依存再現性を確保してください。

```powershell
uv pip install requests
# 変更をコミット
git add uv.lock
git commit -m "Update uv.lock"
```

開発依存（extras や dev）
- `pyproject.toml` に `dev` エクストラが定義されている場合:

```powershell
uv pip install -e '.[dev]'
```

スクリプト（簡易セットアップ）
- Windows: `scripts/setup_env.ps1` を用意しています。プロジェクトルートから `.	ools\setup_env.ps1`（または `.	ools\setup_env.ps1` の場所に応じて）を実行してください。
- Unix: `scripts/setup_env.sh` を用意しています。`bash scripts/setup_env.sh` で実行できます。

CI（GitHub Actions）への組み込み例
- 最小のサンプルワークフローは `.github/workflows/ci-uv.yml` を参照してください。ポイントは Python をセットアップし `uv` をインストールした後、`uv venv` → `uv pip install -e .` を実行する点です。

トラブルシューティング（よくある問題）
- `pyproject.toml` が見つからない: コマンド実行ディレクトリを確認してください。
- PowerShell のファイル書き込みで日本語が文字化けする（`Set-Content` 等）:
  - 回避策: PowerShell の `Out-File -FilePath <file> -Encoding utf8` を利用するか、Python の `pathlib.Path.write_text(..., encoding='utf-8')` を使って書き出してください。

例: Python で UTF-8 書き込み（PowerShell から実行）

```powershell
python - <<'PY'
from pathlib import Path
Path("example.txt").write_text("日本語のテキスト\n", encoding='utf-8')
PY
```

補足: まとめコマンド（PowerShell）

```powershell
cd C:\path\to\project  # プロジェクトルートへ
python -m pip install --upgrade pip
python -m pip install uv
uv venv
uv pip install -e .
```

補足: まとめコマンド（bash）

```bash
cd /path/to/project
python -m pip install --upgrade pip
python -m pip install uv
uv venv
uv pip install -e .
```

このドキュメントは Windows を優先して書いていますが、必要であれば CI 向けの追加説明や細かな OS 切替手順（PowerShell vs bash）の詳細を追記します。