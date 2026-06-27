# ADR-0002: UTC-aware datetime を使用する

## 状態: 採用済み ({{LAST_UPDATED}})

## 文脈
datetime.now() はタイムゾーン情報を持たない（naive datetime）。
外部 API（Google Calendar 等）が ISO 8601 + UTC オフセットを要求する場面で、
naive datetime を渡すと比較エラーや予期しない変換が発生する。

## 決定
プロジェクト内では `datetime.now(timezone.utc)` または `datetime.fromisoformat(...)`
で UTC-aware な datetime のみを扱う。naive datetime を生成・返却する関数は禁止する。

```python
from datetime import datetime, timezone

# Good
dt = datetime.now(timezone.utc)

# Bad（naive datetime — プロジェクト内で使用禁止）
# dt = datetime.now()
# dt = datetime.utcnow()
```

## 結果
タイムゾーン混在によるバグを防止できる。
型チェックや比較が一貫して動作する。
