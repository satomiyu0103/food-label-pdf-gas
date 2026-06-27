# チェックリスト — ドキュメント・完了（Phase 3）

最終更新: 2026-05-30

> 根拠ガイド: [agent_phase3_dod.md](../agent_phase3_dod.md)・[エージェント実装記録.md](../エージェント実装記録.md)  
> 実装 **直後** は agent ルールに従い該当 doc のみ更新。本チェックリストは **プロトタイプ後・リファクタ時の doc 整合監査** 用。

---

## A. 実装完了時（毎回）

- [ ] `doc/specs/07_CHANGELOG.md` の `[Unreleased]` に FR コード付き 1 行以上ある  
  - 根拠: [agent_phase3_dod §1](../agent_phase3_dod.md#1-changelog必須)
- [ ] チャットで実装完了した場合、`doc/records/agent_sessions/YYYY-MM-DD_*.md` と `00_開発日誌.md` 索引がある  
  - 根拠: [エージェント実装記録](../エージェント実装記録.md)・[agent_phase3_dod 更新トリガー](../agent_phase3_dod.md#更新トリガー一覧)

## B. 条件付き更新（該当したら必ず）

| 実施したこと | 確認 |
|---|---|
| 新機能・実装状況変更 | [ ] [04_機能一覧.md](../../specs/04_機能一覧.md) の状況列を更新 |
| ファイル・ディレクトリ追加削除 | [ ] [05_ディレクトリ構成.md](../../specs/05_ディレクトリ構成.md)・`src/{{APP_DIR}}/README.md` 整合 |
| 要件・MoSCoW 変更 | [ ] [02_要件定義.md](../../specs/02_要件定義.md) |
| 設計・API・データモデル変更 | [ ] [03_システム設計.md](../../specs/03_システム設計.md) |
| 再利用価値のあるエラー | [ ] [試験実装のエラー.md](../試験実装のエラー.md)（記載条件を満たす場合のみ） |
| 技術選定の決定 | [ ] `doc/adr/NNNN-*.md` 新規 |
| doc 構成・参照先変更 | [ ] [Project_map.md](../Project_map.md)・必要なら `TEMPLATE_SETUP.md` |
| 生成物・秘密パターン追加 | [ ] `.gitignore` |
| フェーズ計画変更 | [ ] [06_ROADMAP.md](../../specs/06_ROADMAP.md) |
| `src/` README 新設 | [ ] Project_map 早引き |

  - 根拠: [agent_phase3_dod 更新トリガー一覧](../agent_phase3_dod.md#更新トリガー一覧)

## C. `doc/records/` 分割（いずれか 1 つで検討）

- [ ] 分割対象が **400 行超**  
- [ ] **250 行超** かつ直近 1 ヶ月で **5 回以上** 追記  
- [ ] `00_開発日誌.md` が **300 行超**  
- [ ] CHANGELOG リリース済みが **3 バージョン超** かつファイル **350 行超**  
- [ ] 実機 FB が日誌内で読み返しづらい（チーム合意）  

  - 根拠: [agent_phase3_dod §6](../agent_phase3_dod.md#6-docrecords-への分割移動条件付き)

分割実施後:

- [ ] `doc/records/README.md` がある  
- [ ] `05_ディレクトリ構成.md`・Project_map を更新した  
- [ ] specs 側はスタブ＋リンク（削除しない）  

---

## 実施記録

| 日付 | 実施者 | 未更新 doc（あれば） |
|---|---|---|
| | | |
