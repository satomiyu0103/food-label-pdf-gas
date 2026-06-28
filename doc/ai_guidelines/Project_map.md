# プロジェクトマップ（AIエージェント向け）

このプロジェクトは、**商品 PDF から Google Sheets へデータを取り込む RPA ツール** の実装です。
AI エージェントが短時間で要件・設計・運用ルールを把握できるように、参照先を整理しています。

> **行動規範**: [`.cursor/rules/agent_core.mdc`](../../.cursor/rules/agent_core.mdc)（常時） / [`.cursor/rules/agent_implement_entry.mdc`](../../.cursor/rules/agent_implement_entry.mdc)（実装時） / [`.cursor/skills/phase3-doc-updates/SKILL.md`](../../.cursor/skills/phase3-doc-updates/SKILL.md)（Phase 3 詳細）

## まず読むべき 4 ファイル（Phase 1）

1. `doc/ai_guidelines/Project_map.md` — このファイル（参照先一覧）
2. `doc/specs/02_要件定義.md` — 実装範囲（MoSCoW）と非機能要件（FR/NFR コード）
3. `doc/specs/04_機能一覧.md` — 全機能の実装状況と採番ルール
4. `doc/ai_guidelines/試験実装のエラー.md` — 既知エラーと再発防止策

---

## specs 番号と開発フロー（ライフサイクル順）

`doc/specs` の **先頭番号**は、アイデアを仕様へ載せ実装し記録するまでの **利用者向けの並び** に合わせています（上記 Phase 1 の必読4件は **エージェント着手時の最適順**であり、番号順と一致しない場合があります）。

| 番号 | ファイル | フェーズの目安 |
|:---:|:---|:---|
| 00 | `00_プロジェクト概要.md` | 課題の文脈・シナリオ |
| 01 | `01_ABC見送り・ギャップ台帳.md` | 比較検討・見送り・ギャップ理由の構造化（正本） |
| 02 | `02_要件定義.md` | MoSCoW・要件（FR/NFR コードと対応） |
| 03 | `03_システム設計.md` | 技術設計・データモデル・画面 |
| 04 | `04_機能一覧.md` | 機能 ID・実装状況の台帳（正本） |
| 05 | `05_ディレクトリ構成.md` | コード配置・モジュール責務 |
| 06 | `06_ROADMAP.md` | フェーズ別の実装計画 |
| 07 | `07_CHANGELOG.md` | リリース単位の実装履歴 |

---

## 機能コード体系（FR / NFR）

> 詳細は `doc/specs/04_機能一覧.md` の「採番ルール」セクションを参照。

```
[TYPE]-[CATEGORY]-[NNN]

TYPE:  FR = 機能要件  /  NFR = 非機能要件

CATEGORY（FR 用）:
  PDF   = PDF 取込・解析・ファイル移動
  SHT   = スプレッドシート連携
  NTF   = 通知・エラー処理

CATEGORY（NFR 用）:
  SEC   = セキュリティ
  PERF  = パフォーマンス
  OPS   = 運用・保守

NNN: カテゴリ内の連番（001〜）。欠番は振り直さない。
```

---

## .cursor 構成（エージェント正本）

```text
.cursor/
├─ rules/                           ← 常時または glob 適用の制約
│  ├─ agent_core.mdc                ← 禁止事項・CHANGELOG 最低義務
│  ├─ agent_implement_entry.mdc     ← 実装タスク入口（Phase Skills 案内）
│  ├─ memory_logger.mdc             ← タスク完了時の記憶ストリーム追記
│  ├─ template_sync.mdc            ← ai-agent-devenv-template/ 同期
│  ├─ project_identity.mdc          ← プロジェクト概要・FR/NFR 採番
│  ├─ naming_conventions.mdc / git_workflow.mdc / code_comments.mdc
│  ├─ testing_rules.mdc / external_api.mdc / god_class_watch.mdc
│  └─ safe_operations_core.mdc / src_readme_policy.mdc
└─ skills/                          ← タスク時にロードする手順
   ├─ implementation-phase1/ phase2/ phase3-doc-updates/
   ├─ changelog-entry/ agent-session-record/ records-split/
   ├─ known-error-entry/ refactoring-report/ safe-operations-detail/
   ├─ django-ui-changes/
   └─ audit-security/ audit-implementation/ audit-operations/ …
└─ doc/
   └── memory_stream.md              ← チャット由来ファクト（memory_logger が追記）
```

`doc/ai_guidelines/` のガイド系 md は **索引スタブ**（正本は上記 `.cursor/`）。

## doc ディレクトリ構造

```text
doc/
├─ ai_guidelines/
│  ├─ Project_map.md                  ← このファイル
│  ├─ Django_UIUX_ガイド.md          ← UI/テンプレート方針（記入式）
│  ├─ 実装規約.md                    ← 索引 → `.cursor/rules/`
│  ├─ 安全運用ガイド.md              ← 索引 → `.cursor/rules/` + skills
│  ├─ エージェント実装記録.md        ← 索引 → `.cursor/skills/agent-session-record/`
│  ├─ agent_phase3_dod.md            ← 索引 → `.cursor/skills/phase3-doc-updates/`
│  ├─ ai_setup_check_list.md         ← セキュリティチェックリスト索引
│  ├─ checklists/                    ← 定期監査（Yes/No データ正本）
│  │  ├─ README.md
│  │  ├─ security.md / implementation.md / operations.md
│  │  ├─ refactoring.md / documentation.md
│  │  ├─ post_prototype_audit.md / refactor_audit.md
│  ├─ 試験実装のエラー.md            ← 既知エラー（データ正本）
│  └─ リファクタリング判断基準.md    ← 索引 → `.cursor/rules/god_class_watch.mdc`
├─ Information.md                     ← テスト用ログイン情報（プロジェクト作成後に追加）
├─ templates/                         ← 記入用テンプレ（TPL_実機FB 等）
├─ reference/                         ← 利用者向け手順・早見表（README.md が目次）
│  ├─ README.md
│  ├─ getting-started/
│  ├─ setup/
│  └─ cheatsheets/
│     ├─ git.md
│     ├─ markdown.md
│     └─ ide-chat-enter.md
├─ records/
│  ├─ README.md
│  └─ agent_sessions/
└─ specs/
   ├─ 00_プロジェクト概要.md
   ├─ 00_開発日誌.md
   ├─ 01_ABC見送り・ギャップ台帳.md
   ├─ 02_要件定義.md
   ├─ 03_システム設計.md
   ├─ 04_機能一覧.md
   ├─ 05_ディレクトリ構成.md
   ├─ 06_ROADMAP.md
   └─ 07_CHANGELOG.md
doc/adr/
   ├─ 0001-hatchling-build-backend.md
   └─ 0002-utc-aware-datetime.md
```

## ファイル要約（1行サマリ）

| ファイル | 要約 |
|---|---|
| `doc/ai_guidelines/試験実装のエラー.md` | 既知の実装エラーと対策集。着手前に必読。 |
| `doc/ai_guidelines/リファクタリング判断基準.md` | 索引 → `.cursor/rules/god_class_watch.mdc`（検証: `checklists/refactoring.md`）。 |
| `doc/ai_guidelines/実装規約.md` | 索引 → `.cursor/rules/`（命名・PR・テスト・外部 API）。 |
| `doc/ai_guidelines/安全運用ガイド.md` | 索引 → `.cursor/rules/safe_operations_core.mdc` + skills。 |
| `doc/ai_guidelines/agent_phase3_dod.md` | 索引 → `.cursor/skills/phase3-doc-updates/SKILL.md`。 |
| `doc/ai_guidelines/エージェント実装記録.md` | 索引 → `.cursor/skills/agent-session-record/SKILL.md`。 |
| `doc/ai_guidelines/Django_UIUX_ガイド.md` | Django UI/UX・テンプレート方針（任意・記入式）。 |
| `doc/ai_guidelines/checklists/README.md` | 定期監査チェックリスト索引（プロトタイプ後・リファクタ時）。 |
| `doc/ai_guidelines/ai_setup_check_list.md` | セキュリティチェックリスト索引（正: `checklists/security.md`）。 |
| `doc/reference/README.md` | reference 目次・目的別リンク・新規ファイル追加ルール。 |
| `doc/reference/getting-started/入門ガイド.md` | フォルダ構成の意味・レイヤの考え方・読む順番。 |
| `doc/reference/getting-started/コード解説.md` | ファイル別コード解説。 |
| `doc/reference/setup/uv.md` | uv による開発環境構築手順。 |
| `doc/reference/setup/gas-clasp-pnpm.md` | GAS 開発環境（Node.js + pnpm + clasp）。 |
| `doc/reference/cheatsheets/git.md` | 中途参加向け Git コマンド早見表。 |
| `doc/reference/cheatsheets/markdown.md` | Markdown 記法とプレビュー結果の早見表。 |
| `doc/reference/cheatsheets/ide-chat-enter.md` | Cursor / VS Code AI チャットの Enter キー設定早見表。 |
| `doc/specs/00_プロジェクト概要.md` | プロジェクトの目的・スコープ・関連 specs への入口（記入式）。 |
| `doc/specs/00_開発日誌.md` | 開発メモ・実機 FB の時系列ログ（肥大時は `doc/records/` へ分割）。 |
| `doc/specs/01_ABC見送り・ギャップ台帳.md` | A/B/C ギャップ台帳。見送り・未着手・盲点の理由分類（正本）。 |
| `doc/specs/02_要件定義.md` | AS-IS/TO-BE、機能・非機能要件（FR/NFR コード付き）、MoSCoW 優先度。 |
| `doc/specs/03_システム設計.md` | 技術選定、データモデル、画面要件とルーティング。 |
| `doc/specs/05_ディレクトリ構成.md` | 推奨ディレクトリ構成と主要モジュールの責務定義。 |
| `doc/specs/04_機能一覧.md` | FR/NFR コード付き全機能一覧・実装状況・採番ルール。 |
| `doc/specs/07_CHANGELOG.md` | バージョン別の実装履歴。 |
| `doc/specs/06_ROADMAP.md` | フェーズ別の実装計画。 |

## AI エージェント向け参照ガイド

| やりたいこと | 参照先 |
|---|---|
| 要件確認 | `doc/specs/02_要件定義.md` |
| 課題の文脈・シナリオ | `doc/specs/00_プロジェクト概要.md` |
| スコープ外・未着手の理由（A/B/C） | `doc/specs/01_ABC見送り・ギャップ台帳.md` |
| 機能コード・実装状況 | `doc/specs/04_機能一覧.md` |
| 実装計画・将来候補 | `doc/specs/06_ROADMAP.md` |
| 設計・フロー確認 | `doc/specs/03_システム設計.md` |
| ディレクトリ構成・命名規則 | `doc/specs/05_ディレクトリ構成.md` |
| 過去のエラーと対策 | `doc/ai_guidelines/試験実装のエラー.md` |
| 開発ルール（命名・Git・テスト） | `.cursor/rules/` 各 `*.mdc` |
| ログ・通知・処理量 | `.cursor/rules/safe_operations_core.mdc` / `skills/safe-operations-detail/` |
| UI/テンプレート変更 | `.cursor/skills/django-ui-changes/SKILL.md` |
| 利用者向けドキュメント目次 | `doc/reference/README.md` |
| コードの書き方・解説 | `doc/reference/getting-started/コード解説.md` |
| Git の日常操作 | `doc/reference/cheatsheets/git.md` |
| Markdown 記法 | `doc/reference/cheatsheets/markdown.md` |
| AI チャット Enter キー設定 | `doc/reference/cheatsheets/ide-chat-enter.md` |
| uv 環境構築 | `doc/reference/setup/uv.md` |
| Agent 憲法（常時） | `.cursor/rules/agent_core.mdc` |
| Agent 実装時入口 | `.cursor/rules/agent_implement_entry.mdc` |
| 記憶ストリーム | `.cursor/doc/memory_stream.md`（`.cursor/rules/memory_logger.mdc`） |
| テンプレ同期 | `.cursor/rules/template_sync.mdc` |
| ドキュメント表記 | `.cursor/rules/documentation_wording.mdc` |
| Phase 1〜3 手順 | `.cursor/skills/implementation-phase1/` 〜 `phase3-doc-updates/` |
| セキュリティチェック（セットアップ） | `.cursor/skills/audit-security/SKILL.md` |
| プロトタイプ後の総合監査 | `.cursor/skills/audit-post-prototype/SKILL.md` |
| リファクタ前後の監査 | `.cursor/skills/audit-refactor-full/SKILL.md` |
| 定期監査の大分類一覧 | `doc/ai_guidelines/checklists/README.md` |
| テスト用アカウント | `doc/Information.md` |
