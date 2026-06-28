/**
 * 商品 DB スプレッドシートの列定義（正本）。
 * Gemini JSON キー・シートヘッダー・重複チェックの単一ソース。
 *
 * 設計メモ: doc/reference/setup/product-schema-design.md
 */
const SHEET_SCHEMA = {
  /** データ行を書き込むシート名（開いているブック内のタブ名） */
  sheetName: '商品DB',

  /**
   * 列定義（左から順）。
   * 左: 日常確認（商品名・期限・安全・表示）／右: メタ・ID（JAN・処理日時・元ファイル）。
   * key: Gemini JSON / コード内部キー
   * header: シート1行目の表示名
   */
  columns: [
    { key: 'product_name', header: '商品名', required: true, type: 'string', gemini: true },
    { key: 'genre', header: 'ジャンル', required: false, type: 'string', gemini: true },
    { key: 'expiration_type', header: '期限種別', required: false, type: 'string', gemini: true },
    { key: 'expiration_date', header: '期限日', required: false, type: 'string', gemini: true },
    { key: 'allergens', header: 'アレルゲン', required: false, type: 'string', gemini: true },
    { key: 'ingredients', header: '原材料', required: false, type: 'string', gemini: true },
    { key: 'net_content', header: '内容量', required: false, type: 'string', gemini: true },
    { key: 'serving_size', header: '栄養成分の基準量', required: false, type: 'string', gemini: true },
    { key: 'energy_kcal', header: 'エネルギー kcal', required: false, type: 'string', gemini: true },
    { key: 'protein_g', header: 'たんぱく質 g', required: false, type: 'string', gemini: true },
    { key: 'fat_g', header: '脂質 g', required: false, type: 'string', gemini: true },
    { key: 'carbohydrate_g', header: '炭水化物 g', required: false, type: 'string', gemini: true },
    { key: 'salt_equivalent_g', header: '食塩相当量 g', required: false, type: 'string', gemini: true },
    { key: 'maker', header: 'メーカー', required: false, type: 'string', gemini: true },
    { key: 'brand', header: 'ブランド', required: false, type: 'string', gemini: true },
    { key: 'storage_method', header: '保存方法', required: false, type: 'string', gemini: true },
    { key: 'country_of_origin', header: '原産国', required: false, type: 'string', gemini: true },
    { key: 'nutrition_notes', header: '栄養成分メモ', required: false, type: 'string', gemini: true },
    { key: 'confidence_notes', header: '読み取りメモ', required: false, type: 'string', gemini: true },
    { key: 'notes', header: '備考', required: false, type: 'string', gemini: true },
    { key: 'jan_code', header: 'JANコード', required: false, type: 'string', gemini: true, duplicateKey: true },
    { key: 'product_code', header: '商品コード', required: false, type: 'string', gemini: true, duplicateKey: true },
    { key: 'processed_at', header: '処理日時', required: true, type: 'datetime', gemini: false },
    { key: 'source_file', header: '元ファイル', required: true, type: 'string', gemini: false },
    { key: 'drive_file_name', header: 'Driveファイル名', required: false, type: 'string', gemini: false },
  ],
};

/** Gemini に抽出させる JSON キー一覧 */
function getGeminiFieldKeys_() {
  return SHEET_SCHEMA.columns.filter(function (col) {
    return col.gemini;
  }).map(function (col) {
    return col.key;
  });
}

/** Gemini 出力 JSON の空テンプレート */
function buildEmptyGeminiRecord_() {
  const record = {};
  getGeminiFieldKeys_().forEach(function (key) {
    record[key] = '';
  });
  return record;
}

/** シートヘッダー行（日本語） */
function getSheetHeaders_() {
  return SHEET_SCHEMA.columns.map(function (col) {
    return col.header;
  });
}

/** key → 列インデックス（1始まり） */
function getColumnIndexByKey_(key) {
  const idx = SHEET_SCHEMA.columns.findIndex(function (col) {
    return col.key === key;
  });
  if (idx === -1) {
    throw new Error('Unknown column key: ' + key);
  }
  return idx + 1;
}

/** 重複チェックに使うキー一覧（jan_code, product_code） */
function getDuplicateCheckKeys_() {
  return SHEET_SCHEMA.columns
    .filter(function (col) {
      return col.duplicateKey;
    })
    .map(function (col) {
      return col.key;
    });
}

/**
 * 商品向け重複キー正規化（FR-SHT-002）。
 * jan_code: 数字以外除去。product_code: 空白除去 + 大文字化。
 */
function normalizeDuplicateValue_(key, value) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  if (key === 'jan_code') {
    return trimmed.replace(/\D/g, '');
  }
  if (key === 'product_code') {
    return trimmed.replace(/\s+/g, '').toUpperCase();
  }
  return trimmed;
}

/**
 * 裏面刻印などから YY.MM を抽出する（例: 28.08/+DFL/B → 2028年8月）。
 *
 * @param {string} text
 * @returns {{ year: number, month: number }|null}
 */
function extractYyMmFromStamp_(text) {
  if (!text) {
    return null;
  }
  const match = String(text).match(/(\d{2})\.(\d{2})(?:\/|\+|$|\s|[^0-9])/);
  if (!match) {
    return null;
  }
  const month = parseInt(match[2], 10);
  if (month < 1 || month > 12) {
    return null;
  }
  return {
    year: 2000 + parseInt(match[1], 10),
    month: month,
  };
}

/**
 * 指定年月の末日を YYYY-MM-DD で返す。
 *
 * @param {number} year
 * @param {number} monthOneToTwelve 1〜12
 * @returns {string}
 */
function lastDayOfMonthIso_(year, monthOneToTwelve) {
  const lastDate = new Date(year, monthOneToTwelve, 0);
  const y = lastDate.getFullYear();
  const m = String(lastDate.getMonth() + 1).padStart(2, '0');
  const d = String(lastDate.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

/**
 * 期限日を YYYY-MM-DD に正規化する（FR-PDF-002 期限正規化）。
 *
 * 日本の商品ラベル想定:
 * - YYYY-MM-DD / yyyymmdd はそのまま
 * - YY.MM（例: 28.08、28.08/+DFL/B）は 20YY年MM月の末日（28.08 → 2028-08-31）
 * - yymmdd（6桁）は 20YY-MM-DD
 * - yymm（4桁）は当月末日
 *
 * @param {string} raw
 * @returns {string}
 */
function normalizeExpirationDateToIso_(raw) {
  if (!raw) {
    return '';
  }
  const trimmed = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{8}$/.test(trimmed)) {
    return (
      trimmed.slice(0, 4) + '-' + trimmed.slice(4, 6) + '-' + trimmed.slice(6, 8)
    );
  }
  if (/^\d{6}$/.test(trimmed)) {
    const year = 2000 + parseInt(trimmed.slice(0, 2), 10);
    const month = parseInt(trimmed.slice(2, 4), 10);
    const day = parseInt(trimmed.slice(4, 6), 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return (
        String(year) +
        '-' +
        String(month).padStart(2, '0') +
        '-' +
        String(day).padStart(2, '0')
      );
    }
  }
  if (/^\d{4}$/.test(trimmed)) {
    const year = 2000 + parseInt(trimmed.slice(0, 2), 10);
    const month = parseInt(trimmed.slice(2, 4), 10);
    if (month >= 1 && month <= 12) {
      return lastDayOfMonthIso_(year, month);
    }
  }
  const yyMm = extractYyMmFromStamp_(trimmed);
  if (yyMm) {
    return lastDayOfMonthIso_(yyMm.year, yyMm.month);
  }
  return '';
}

/**
 * 読み取りメモに 1 行追記する。
 *
 * @param {string} existing
 * @param {string} line
 * @returns {string}
 */
function appendConfidenceNote_(existing, line) {
  if (!line) {
    return existing || '';
  }
  if (!existing) {
    return line;
  }
  return existing + ' / ' + line;
}

/**
 * Gemini 抽出レコードの期限日を正規化する。
 *
 * @param {Object} record
 */
function applyExpirationDateNormalizationToRecord_(record) {
  if (!record) {
    return;
  }
  const sources = [record.expiration_date, record.confidence_notes, record.notes];
  let iso = '';
  let matchedRaw = '';
  for (let i = 0; i < sources.length; i++) {
    iso = normalizeExpirationDateToIso_(sources[i]);
    if (iso) {
      matchedRaw = sources[i];
      break;
    }
  }
  if (!iso) {
    return;
  }
  if (record.expiration_date !== iso) {
    record.confidence_notes = appendConfidenceNote_(
      record.confidence_notes,
      '期限日正規化: ' + String(matchedRaw).substring(0, 40) + ' → ' + iso
    );
    record.expiration_date = iso;
  }
}
