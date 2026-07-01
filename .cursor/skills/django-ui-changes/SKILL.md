---
name: django-ui-changes
description: Django UI/テンプレート変更時の確認項目。テンプレート・views 変更タスクで使用。
---

# Django UI/UX 変更

プロジェクト固有の記入: `doc/ai/guidelines/Django_UIUX_ガイド.md`（未記入なら既存テンプレートパターンを踏襲）

## 実施チェック

- [ ] ベーステンプレート・ブロック構成を確認
- [ ] テンプレート変更後に構文エラーがないこと
- [ ] migration 連番の整合（モデル変更がある場合）
- [ ] フォーム・バリデーションエラー表示が既存と一致

Phase 2 の Django 項目と併用する。
