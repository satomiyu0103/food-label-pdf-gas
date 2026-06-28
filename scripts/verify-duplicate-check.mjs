/**
 * 重複チェック正規化のローカル検証。schema.js と同ロジック。
 * 実行: node scripts/verify-duplicate-check.mjs
 */

function normalizeDuplicateValue_(key, value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (key === 'jan_code') return trimmed.replace(/\D/g, '');
  if (key === 'product_code') return trimmed.replace(/\s+/g, '').toUpperCase();
  return trimmed;
}

function normalizeTextForDuplicateCheck_(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim().replace(/\s+/g, ' ');
}

function extractYyMmFromStamp_(text) {
  if (!text) return null;
  const match = String(text).match(/(\d{2})\.(\d{2})(?:\/|\+|$|\s|[^0-9])/);
  if (!match) return null;
  const month = parseInt(match[2], 10);
  if (month < 1 || month > 12) return null;
  return { year: 2000 + parseInt(match[1], 10), month };
}

function lastDayOfMonthIso_(year, monthOneToTwelve) {
  const lastDate = new Date(year, monthOneToTwelve, 0);
  const y = lastDate.getFullYear();
  const m = String(lastDate.getMonth() + 1).padStart(2, '0');
  const d = String(lastDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function normalizeExpirationDateToIso_(raw) {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  }
  const yyMm = extractYyMmFromStamp_(trimmed);
  if (yyMm) return lastDayOfMonthIso_(yyMm.year, yyMm.month);
  return '';
}

function buildCompositeDuplicateKey_(record) {
  const rec = record || {};
  const parts = [];
  const productName = normalizeTextForDuplicateCheck_(rec.product_name);
  const maker = normalizeTextForDuplicateCheck_(rec.maker);
  const expirationIso = normalizeExpirationDateToIso_(rec.expiration_date);
  if (productName) parts.push(productName);
  if (maker) parts.push(maker);
  if (expirationIso) parts.push(expirationIso);
  if (parts.length === 0) return '';
  return parts.join('|');
}

function resolveDuplicateCheckStrategy_(record) {
  const rec = record || {};
  const janNormalized = normalizeDuplicateValue_('jan_code', rec.jan_code || '');
  if (janNormalized) return { keyType: 'jan_code', normalizedValue: janNormalized };
  const productCodeNormalized = normalizeDuplicateValue_('product_code', rec.product_code || '');
  if (productCodeNormalized) {
    return { keyType: 'product_code', normalizedValue: productCodeNormalized };
  }
  const compositeKey = buildCompositeDuplicateKey_(rec);
  if (compositeKey) return { keyType: 'composite', normalizedValue: compositeKey };
  return { keyType: null, normalizedValue: '' };
}

function normalizeExistingRowForDuplicateCheck_(strategy, rowRecord) {
  if (!strategy || !strategy.keyType || !rowRecord) return '';
  if (strategy.keyType === 'jan_code') {
    return normalizeDuplicateValue_('jan_code', rowRecord.jan_code || '');
  }
  if (strategy.keyType === 'product_code') {
    return normalizeDuplicateValue_('product_code', rowRecord.product_code || '');
  }
  if (strategy.keyType === 'composite') return buildCompositeDuplicateKey_(rowRecord);
  return '';
}

function findExistingProductRow_(strategy, existingRows) {
  if (!strategy || !strategy.keyType || !strategy.normalizedValue) return null;
  for (let i = 0; i < existingRows.length; i++) {
    const row = existingRows[i];
    const existingNormalized = normalizeExistingRowForDuplicateCheck_(strategy, row.record);
    if (existingNormalized && existingNormalized === strategy.normalizedValue) {
      return row.sheetRow;
    }
  }
  return null;
}

function assertEqual(label, got, expected) {
  const ok = got === expected;
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}: got=${JSON.stringify(got)} expected=${JSON.stringify(expected)}`);
  return ok ? 0 : 1;
}

let failed = 0;

// JAN 優先（ハイフン付きも一致）
const janStrategy = resolveDuplicateCheckStrategy_({ jan_code: '490-1234-567890' });
failed += assertEqual('JAN strategy type', janStrategy.keyType, 'jan_code');
failed += assertEqual('JAN normalized', janStrategy.normalizedValue, '4901234567890');

// JAN ありなら product_code は使わない
const janOverCode = resolveDuplicateCheckStrategy_({
  jan_code: '4901234567890',
  product_code: 'ABC-001',
});
failed += assertEqual('JAN over product_code', janOverCode.keyType, 'jan_code');

// product_code（JAN なし）
const codeStrategy = resolveDuplicateCheckStrategy_({ product_code: 'ab c-001' });
failed += assertEqual('product_code type', codeStrategy.keyType, 'product_code');
failed += assertEqual('product_code normalized', codeStrategy.normalizedValue, 'ABC-001');

// 複合キー（期限表記ゆれ）
const compositeStrategy = resolveDuplicateCheckStrategy_({
  product_name: '  テスト商品  ',
  maker: 'テスト食品　株式会社',
  expiration_date: '28.08',
});
failed += assertEqual('composite type', compositeStrategy.keyType, 'composite');
failed += assertEqual(
  'composite key',
  compositeStrategy.normalizedValue,
  'テスト商品|テスト食品 株式会社|2028-08-31'
);

// 全キー空
const emptyStrategy = resolveDuplicateCheckStrategy_({});
failed += assertEqual('empty strategy', emptyStrategy.keyType, null);

// 既存行検索
const existingRows = [
  { sheetRow: 2, record: { jan_code: '490-1234-567890', product_code: '' } },
  { sheetRow: 3, record: { jan_code: '999', product_code: '' } },
];
const dupRow = findExistingProductRow_(
  { keyType: 'jan_code', normalizedValue: '4901234567890' },
  existingRows
);
failed += assertEqual('find by JAN', dupRow, 2);

// キー種別不一致（既存は JAN のみ、新規は product_code のみ）→ 非重複
const mismatchRow = findExistingProductRow_(
  { keyType: 'product_code', normalizedValue: 'ABC001' },
  [{ sheetRow: 2, record: { jan_code: '4901234567890', product_code: '' } }]
);
failed += assertEqual('key type mismatch', mismatchRow, null);

process.exit(failed > 0 ? 1 : 0);
