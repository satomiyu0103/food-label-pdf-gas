/**
 * 期限日正規化のローカル検証。schema.js と同ロジック。
 * 実行: node scripts/verify-expiration-date.mjs
 */

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
  if (/^\d{6}$/.test(trimmed)) {
    const year = 2000 + parseInt(trimmed.slice(0, 2), 10);
    const month = parseInt(trimmed.slice(2, 4), 10);
    const day = parseInt(trimmed.slice(4, 6), 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  if (/^\d{4}$/.test(trimmed)) {
    const year = 2000 + parseInt(trimmed.slice(0, 2), 10);
    const month = parseInt(trimmed.slice(2, 4), 10);
    if (month >= 1 && month <= 12) return lastDayOfMonthIso_(year, month);
  }
  const yyMm = extractYyMmFromStamp_(trimmed);
  if (yyMm) return lastDayOfMonthIso_(yyMm.year, yyMm.month);
  return '';
}

const cases = [
  ['28.08/+DFL/B', '2028-08-31'],
  ['28.08', '2028-08-31'],
  ['20260828', '2026-08-28'],
  ['260828', '2026-08-28'],
  ['2808', '2028-08-31'],
  ['2026-07-15', '2026-07-15'],
];

let failed = 0;
for (const [input, expected] of cases) {
  const got = normalizeExpirationDateToIso_(input);
  const ok = got === expected;
  console.log(`${ok ? 'OK' : 'FAIL'} ${input} → ${got} (期待 ${expected})`);
  if (!ok) failed++;
}

process.exit(failed > 0 ? 1 : 0);
