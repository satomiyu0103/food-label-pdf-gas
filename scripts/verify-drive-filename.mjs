/**
 * FR-PDF-004 ファイル名生成のローカル検証（GAS 不要）。
 * 実行: node scripts/verify-drive-filename.mjs
 */

const PRODUCT_GENRE_LIST = [
  '菓子', '飲料', '調味料', '麺類', '米・穀物',
  '乳製品', '冷凍食品', '缶詰', 'その他',
];
const PRODUCT_GENRE_FALLBACK = 'その他';
const DRIVE_FILE_NAME_MAX_LEN = 200;

function normalizeGenre_(genre) {
  const trimmed = genre ? String(genre).trim() : '';
  if (!trimmed) return PRODUCT_GENRE_FALLBACK;
  return PRODUCT_GENRE_LIST.find((item) => item === trimmed) || PRODUCT_GENRE_FALLBACK;
}

function parseExpirationDateToYyyymmdd_(expirationDate) {
  if (!expirationDate) return '';
  const trimmed = String(expirationDate).trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return isoMatch[1] + isoMatch[2] + isoMatch[3];
  const compactMatch = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) return compactMatch[1] + compactMatch[2] + compactMatch[3];
  return '';
}

function buildDatePrefixForFileName_(expirationDate, processedAt) {
  const fromExpiration = parseExpirationDateToYyyymmdd_(expirationDate);
  if (fromExpiration) return fromExpiration;
  const d = processedAt instanceof Date ? processedAt : new Date(processedAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function sanitizeDriveFileNamePart_(part) {
  let sanitized = String(part)
    .replace(/[\/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  return sanitized || '名称不明';
}

function buildProductPdfFileName_(record, processedAt) {
  const datePrefix = buildDatePrefixForFileName_(record.expiration_date, processedAt);
  const genre = normalizeGenre_(record.genre);
  const productName = sanitizeDriveFileNamePart_(record.product_name || '商品名不明');
  return `${datePrefix}_${genre}_${productName}.pdf`;
}

const processedAt = new Date('2026-06-28T12:00:00+09:00');
const cases = [
  {
    name: '期限日あり',
    record: { product_name: 'チョコレートクッキー', genre: '菓子', expiration_date: '2026-07-15' },
    expect: (n) => n === '20260715_菓子_チョコレートクッキー.pdf',
  },
  {
    name: '期限日なし',
    record: { product_name: 'テスト商品', genre: '飲料', expiration_date: '' },
    expect: (n) => n.startsWith('20260628_飲料_テスト商品.pdf'),
  },
  {
    name: 'ジャンル不一致',
    record: { product_name: '商品A', genre: '未知', expiration_date: '2026-08-01' },
    expect: (n) => n === '20260801_その他_商品A.pdf',
  },
  {
    name: '禁止文字サニタイズ',
    record: { product_name: '商品/名:テスト', genre: '調味料', expiration_date: '2026-09-01' },
    expect: (n) => n === '20260901_調味料_商品_名_テスト.pdf' && !/[\/\\:*?"<>|]/.test(n),
  },
];

let failed = 0;
for (const c of cases) {
  const fileName = buildProductPdfFileName_(c.record, processedAt);
  const ok = c.expect(fileName);
  console.log(`${ok ? 'OK' : 'FAIL'} ${c.name}: ${fileName}`);
  if (!ok) failed++;
}

// 衝突回避ロジック（フォルダなしの単体）
function ensureUniqueName(existing, desired) {
  if (!existing.includes(desired)) return desired;
  const dot = desired.lastIndexOf('.');
  const base = dot >= 0 ? desired.slice(0, dot) : desired;
  const ext = dot >= 0 ? desired.slice(dot) : '';
  for (let s = 2; s <= 10; s++) {
    const candidate = `${base}_${s}${ext}`;
    if (!existing.includes(candidate)) return candidate;
  }
  throw new Error('collision');
}
const collisionName = ensureUniqueName(
  ['20260715_菓子_クッキー.pdf'],
  '20260715_菓子_クッキー.pdf'
);
const collisionOk = collisionName === '20260715_菓子_クッキー_2.pdf';
console.log(`${collisionOk ? 'OK' : 'FAIL'} 同名衝突: ${collisionName}`);
if (!collisionOk) failed++;

if (failed > 0) {
  console.error(`\n${failed} 件失敗`);
  process.exit(1);
}
console.log('\nすべての検証に合格');
