---
name: implementation-phase2
description: 実装実施中の遵守事項。コード変更・テスト追加の Phase 2 で使用。
---

# Phase 2 — 実施中

## 着手直後（Git）

`git_workflow.mdc` の **モード B（本番実装）** を既定とする。

1. `git switch master` → `git pull origin master`
2. `git switch -c feat/FR-XXX-短い説明`（計画・FR に合わせて命名）
3. 利用者が「ブランチ不要」「master で直接」と明示したときのみスキップ

## 遵守ルール（.cursor/rules/ が正本）

- `naming_conventions` / `git_workflow` / `code_comments` / `testing_rules` / `external_api` / `god_class_watch` / `safe_operations_core`

## 実施チェック

- [ ] 作業ブランチを切ってから編集した（`git_workflow` モード B。利用者明示時のみ master 直接可）
- [ ] 機能変更は FR/NFR コードと紐付け（`doc/specs/04_機能一覧.md`）
- [ ] 既存パターンを踏襲。スコープ外改修なし
- [ ] Django 使用時: migration 連番、テンプレート変更後は構文確認
- [ ] `models.py` / `views.py` 編集時: 神クラス予兆を確認し該当時は報告のみ

## 要件外に気づいたら

実装を止め、要件更新を提案する（`git_workflow` §変更前確認）。
