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
  if (Object.prototype.toString.call(raw) === '[object Date]') {
    if (isNaN(raw.getTime())) return '';
    const y = raw.getFullYear();
    const m = String(raw.getMonth() + 1).padStart(2, '0');
    const d = String(raw.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const trimmed = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  }
  const yyMm = extractYyMmFromStamp_(trimmed);
  if (yyMm) return lastDayOfMonthIso_(yyMm.year, yyMm.month);
  return '';
}

function buildDuplicateBaseValue_(keyType, record) {
  const rec = record || {};
  if (keyType === 'jan_code') {
    return normalizeDuplicateValue_('jan_code', rec.jan_code || '');
  }
  if (keyType === 'product_code') {
    return normalizeDuplicateValue_('product_code', rec.product_code || '');
  }
  if (keyType === 'composite') {
    const parts = [];
    const productName = normalizeTextForDuplicateCheck_(rec.product_name);
    const maker = normalizeTextForDuplicateCheck_(rec.maker);
    if (productName) parts.push(productName);
    if (maker) parts.push(maker);
    if (parts.length === 0) return '';
    return parts.join('|');
  }
  return '';
}

function resolveDuplicateCheckStrategy_(record) {
  const rec = record || {};
  const expirationIso = normalizeExpirationDateToIso_(rec.expiration_date);
  const janNormalized = normalizeDuplicateValue_('jan_code', rec.jan_code || '');
  if (janNormalized) {
    return { keyType: 'jan_code', baseValue: janNormalized, expirationIso };
  }
  const productCodeNormalized = normalizeDuplicateValue_('product_code', rec.product_code || '');
  if (productCodeNormalized) {
    return { keyType: 'product_code', baseValue: productCodeNormalized, expirationIso };
  }
  const compositeBase = buildDuplicateBaseValue_('composite', rec);
  if (compositeBase) {
    return { keyType: 'composite', baseValue: compositeBase, expirationIso };
  }
  return { keyType: null, baseValue: '', expirationIso: '' };
}

function isDuplicateProductRecord_(strategy, existingRecord) {
  if (!strategy || !strategy.keyType || !strategy.baseValue || !existingRecord) return false;
  const existingBase = buildDuplicateBaseValue_(strategy.keyType, existingRecord);
  if (!existingBase || existingBase !== strategy.baseValue) return false;
  const existingExpiration = normalizeExpirationDateToIso_(existingRecord.expiration_date);
  const newExpiration = strategy.expirationIso || '';
  if (newExpiration && existingExpiration && newExpiration !== existingExpiration) return false;
  return true;
}

function formatDuplicateStrategyForLog_(strategy) {
  if (!strategy || !strategy.baseValue) return '';
  if (strategy.expirationIso) return strategy.baseValue + '|' + strategy.expirationIso;
  return strategy.baseValue;
}

function findExistingProductRow_(strategy, existingRows) {
  if (!strategy || !strategy.keyType || !strategy.baseValue) return null;
  for (let i = 0; i < existingRows.length; i++) {
    const row = existingRows[i];
    if (isDuplicateProductRecord_(strategy, row.record)) {
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
failed += assertEqual('JAN baseValue', janStrategy.baseValue, '4901234567890');
failed += assertEqual('JAN expirationIso empty', janStrategy.expirationIso, '');

// JAN + 期限
const janWithExp = resolveDuplicateCheckStrategy_({
  jan_code: '4901234567890',
  expiration_date: '2026-12-31',
});
failed += assertEqual('JAN with expiration', janWithExp.expirationIso, '2026-12-31');
failed += assertEqual(
  'JAN log format',
  formatDuplicateStrategyForLog_(janWithExp),
  '4901234567890|2026-12-31'
);

// JAN ありなら product_code は使わない
const janOverCode = resolveDuplicateCheckStrategy_({
  jan_code: '4901234567890',
  product_code: 'ABC-001',
});
failed += assertEqual('JAN over product_code', janOverCode.keyType, 'jan_code');

// product_code（JAN なし）
const codeStrategy = resolveDuplicateCheckStrategy_({ product_code: 'ab c-001' });
failed += assertEqual('product_code type', codeStrategy.keyType, 'product_code');
failed += assertEqual('product_code baseValue', codeStrategy.baseValue, 'ABC-001');

// 複合キー（期限表記ゆれ）
const compositeStrategy = resolveDuplicateCheckStrategy_({
  product_name: '  テスト商品  ',
  maker: 'テスト食品　株式会社',
  expiration_date: '28.08',
});
failed += assertEqual('composite type', compositeStrategy.keyType, 'composite');
failed += assertEqual('composite baseValue', compositeStrategy.baseValue, 'テスト商品|テスト食品 株式会社');
failed += assertEqual('composite expirationIso', compositeStrategy.expirationIso, '2028-08-31');

// 全キー空
const emptyStrategy = resolveDuplicateCheckStrategy_({});
failed += assertEqual('empty strategy', emptyStrategy.keyType, null);

// 既存行検索（JAN 一致・期限なし）
const existingRows = [
  { sheetRow: 2, record: { jan_code: '490-1234-567890', product_code: '', expiration_date: '' } },
  { sheetRow: 3, record: { jan_code: '999', product_code: '', expiration_date: '' } },
];
const dupRow = findExistingProductRow_(
  { keyType: 'jan_code', baseValue: '4901234567890', expirationIso: '' },
  existingRows
);
failed += assertEqual('find by JAN no expiration', dupRow, 2);

// 同一 JAN・期限違い → 非重複
const diffExpRow = findExistingProductRow_(
  { keyType: 'jan_code', baseValue: '4901234567890', expirationIso: '2027-06-30' },
  [{ sheetRow: 2, record: { jan_code: '4901234567890', expiration_date: '2026-12-31' } }]
);
failed += assertEqual('JAN different expiration not duplicate', diffExpRow, null);

// 同一 JAN・期限同じ → 重複
const sameExpRow = findExistingProductRow_(
  { keyType: 'jan_code', baseValue: '4901234567890', expirationIso: '2026-12-31' },
  [{ sheetRow: 2, record: { jan_code: '4901234567890', expiration_date: '2026-12-31' } }]
);
failed += assertEqual('JAN same expiration duplicate', sameExpRow, 2);

// 既存期限あり・新規期限なし → 重複（期限不問）
const newNoExpRow = findExistingProductRow_(
  { keyType: 'jan_code', baseValue: '4901234567890', expirationIso: '' },
  [{ sheetRow: 2, record: { jan_code: '4901234567890', expiration_date: '2026-12-31' } }]
);
failed += assertEqual('JAN new no expiration duplicate', newNoExpRow, 2);

// 既存期限なし・新規期限あり → 重複（期限不問）
const existNoExpRow = findExistingProductRow_(
  { keyType: 'jan_code', baseValue: '4901234567890', expirationIso: '2026-12-31' },
  [{ sheetRow: 2, record: { jan_code: '4901234567890', expiration_date: '' } }]
);
failed += assertEqual('JAN existing no expiration duplicate', existNoExpRow, 2);

// 商品コード・期限違い → 非重複
const codeDiffExp = findExistingProductRow_(
  { keyType: 'product_code', baseValue: 'ABC-001', expirationIso: '2027-01-01' },
  [{ sheetRow: 5, record: { product_code: 'ABC-001', expiration_date: '2026-01-01' } }]
);
failed += assertEqual('product_code different expiration not duplicate', codeDiffExp, null);

// 複合キー・期限違い → 非重複
const compositeDiffExp = findExistingProductRow_(
  {
    keyType: 'composite',
    baseValue: 'テスト商品|テスト食品',
    expirationIso: '2027-06-30',
  },
  [
    {
      sheetRow: 6,
      record: {
        product_name: 'テスト商品',
        maker: 'テスト食品',
        expiration_date: '2026-12-31',
      },
    },
  ]
);
failed += assertEqual('composite different expiration not duplicate', compositeDiffExp, null);

// キー種別不一致（既存は JAN のみ、新規は product_code のみ）→ 非重複
const mismatchRow = findExistingProductRow_(
  { keyType: 'product_code', baseValue: 'ABC001', expirationIso: '' },
  [{ sheetRow: 2, record: { jan_code: '4901234567890', product_code: '' } }]
);
failed += assertEqual('key type mismatch', mismatchRow, null);

// シート Date 相当（GAS getValues の String(Date)）→ 正規化不能だと期限不問で誤重複
const sheetDateLike = String(new Date('2027-06-30T00:00:00+09:00'));
failed += assertEqual('sheet date string normalizes empty', normalizeExpirationDateToIso_(sheetDateLike), '');

// Date オブジェクトは正規化できる → 期限違いは非重複
const dateObjDiffExp = findExistingProductRow_(
  { keyType: 'composite', baseValue: 'テスト商品|テストメーカー', expirationIso: '2026-03-31' },
  [
    {
      sheetRow: 7,
      record: {
        product_name: 'テスト商品',
        maker: 'テストメーカー',
        expiration_date: new Date('2027-06-30T00:00:00+09:00'),
      },
    },
  ]
);
failed += assertEqual('Date object different expiration not duplicate', dateObjDiffExp, null);

// シートから読み込んだ YYYY-MM-DD 文字列なら期限違いは非重複
const sheetIsoDiffExp = findExistingProductRow_(
  { keyType: 'composite', baseValue: 'テスト商品|テストメーカー', expirationIso: '2026-03-31' },
  [
    {
      sheetRow: 8,
      record: {
        product_name: 'テスト商品',
        maker: 'テストメーカー',
        expiration_date: '2027-06-30',
      },
    },
  ]
);
failed += assertEqual('sheet ISO string different expiration not duplicate', sheetIsoDiffExp, null);

process.exit(failed > 0 ? 1 : 0);
