# ADR 0003: GAS を本番ランタイムとする

## ステータス

採用

## コンテキスト

商品 PDF の抽出・スプレッドシート転記は Google Workspace 上で完結させたい。Python ローカル実行や有料 SaaS は初期スコープ外とする。

## 決定

- 本番処理は **Google Apps Script（`gas/src/`）** で実装する
- デプロイは **clasp + pnpm** で行う
- Python（uv）は将来の補助スクリプト用に `pyproject.toml` のみ残し、MVP 本番処理には使用しない

## 結果

- Google ドライブ・スプレッドシート・Gemini API との認証が GAS OAuth で統一される
- 名刺 PDF 版（`meishi-pdf-to-sheets`）のモジュール構成を流用しやすい
