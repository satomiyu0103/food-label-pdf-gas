# プロジェクトマップ（AIエージェント向け）

このプロジェクトは、**商品 PDF から Google Sheets へデータを取り込む RPA ツール** の実装です。
AI エージェントが短時間で要件・設計・運用ルールを把握できるように、参照先を整理しています。

> **行動規範**: [`.cursor/rules/agent_core.mdc`](../../.cursor/rules/agent_core.mdc)（常時） / [`.cursor/rules/agent_implement.mdc`](../../.cursor/rules/agent_implement.mdc)（実装時） / [agent_phase3_dod.md](agent_phase3_dod.md)（Phase 3 詳細）

## まず読むべき 4 ファイル（Phase 1）

1. `doc/ai_guidelines/Project_map.md` — このファイル（参照先一覧）
2. `doc/specs/02_要件定義.md` — 実装範囲（MoSCoW）と非機能要件（FR/NFR コード）
3. `doc/specs/04_機能一覧.md` — 全機能の実装状況と採番ルール
4. `doc/ai_guidelines/試験実装のエラー.md` — 既知エラーと再発防止策

---

## specs 番号と開発フロー（ライフサイクル順）

`doc/specs` の **先頭番号**は、アイデアを仕様へ載せ実装し記録するまでの **人間向けの並び** に合わせています（上記 Phase 1 の必読4件は **エージェント着手時の最適順**であり、番号順と一致しない場合があります）。

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

## doc ディレクトリ構造

```text
doc/
├─ ai_guidelines/
│  ├─ Project_map.md                  ← このファイル
│  ├─ Django_UIUX_ガイド.md          ← UI/テンプレート方針（Django 等・プロジェクト作成後に記入）
│  ├─ 実装規約.md                    ← 命名・PR・テスト・ログ等（Human + Agent）
│  ├─ 安全運用ガイド.md              ← ログ・通知・処理量（言語非依存の一般原則）
│  ├─ エージェント実装記録.md        ← チャット実装のセッション記録ルール
│  ├─ agent_phase3_dod.md            ← Phase 3 更新一覧・doc/records 分割（正本）
│  ├─ ai_setup_check_list.md         ← セキュリティチェックリスト索引
│  ├─ checklists/                    ← 定期監査（大分類別・ガイド参照）
│  │  ├─ README.md
│  │  ├─ security.md / implementation.md / operations.md
│  │  ├─ refactoring.md / documentation.md
│  │  ├─ post_prototype_audit.md / refactor_audit.md
│  ├─ 試験実装のエラー.md
│  └─ リファクタリング判断基準.md
├─ Information.md                     ← テスト用ログイン情報（プロジェクト作成後に追加）
├─ templates/                         ← 記入用テンプレ（TPL_実機FB 等）
├─ reference/                         ← 人向け手順・早見表（README.md が目次）
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
| `doc/ai_guidelines/リファクタリング判断基準.md` | 神クラス予兆の判断基準とリファクタ最適タイミング（検証は `checklists/refactoring.md`）。 |
| `doc/ai_guidelines/実装規約.md` | 命名規約・テスト規約・PR粒度・セキュリティ規約・外部API規約。 |
| `doc/ai_guidelines/安全運用ガイド.md` | 実行ログ・例外通知・処理量制御の一般原則（実装詳細は specs 側）。 |
| `doc/ai_guidelines/agent_phase3_dod.md` | Phase 3 完了後の doc 更新トリガー・CHANGELOG 形式・`doc/records/` 分割基準。 |
| `doc/ai_guidelines/エージェント実装記録.md` | チャット実装のセッション記録（2 層: 開発日誌索引 + agent_sessions）。 |
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
| 開発ルール・セキュリティ規約 | `doc/ai_guidelines/実装規約.md` |
| ログ・通知・処理量の一般原則 | `doc/ai_guidelines/安全運用ガイド.md` |
| UI/テンプレート変更 | `doc/ai_guidelines/Django_UIUX_ガイド.md` |
| 人向けドキュメント目次 | `doc/reference/README.md` |
| コードの書き方・解説 | `doc/reference/getting-started/コード解説.md` |
| Git の日常操作 | `doc/reference/cheatsheets/git.md` |
| Markdown 記法 | `doc/reference/cheatsheets/markdown.md` |
| AI チャット Enter キー設定 | `doc/reference/cheatsheets/ide-chat-enter.md` |
| uv 環境構築 | `doc/reference/setup/uv.md` |
| Agent 憲法（常時） | `.cursor/rules/agent_core.mdc` |
| Agent 実装時ルール | `.cursor/rules/agent_implement.mdc` |
| Phase 3 DoD 詳細 | `doc/ai_guidelines/agent_phase3_dod.md` |
| セキュリティチェック（セットアップ） | `doc/ai_guidelines/checklists/security.md` |
| プロトタイプ後の総合監査 | `doc/ai_guidelines/checklists/post_prototype_audit.md` |
| リファクタ前後の監査 | `doc/ai_guidelines/checklists/refactor_audit.md` |
| 定期監査の大分類一覧 | `doc/ai_guidelines/checklists/README.md` |
| テスト用アカウント | `doc/Information.md` |
