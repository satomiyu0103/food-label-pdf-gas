# ADR-0001: ビルドバックエンドに hatchling を採用

## 状態: 採用済み ({{LAST_UPDATED}})

## 文脈
`uv sync` 実行後もパッケージがインポートできない問題が起きやすい。
`pyproject.toml` に `[build-system]` が未定義の場合、パッケージとして仮想環境にインストールされない。

## 決定
`hatchling` をビルドバックエンドとして採用し、`pyproject.toml` に以下を追加する。

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/your_package"]

[tool.uv]
package = true
```

## 結果
`uv sync` 実行後にパッケージが仮想環境に正しくインストールされる。
hatchling は uv と相性がよく、設定が最小限で済む。
