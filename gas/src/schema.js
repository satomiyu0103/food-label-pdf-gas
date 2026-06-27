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
   * key: Gemini JSON / コード内部キー
   * header: シート1行目の表示名
   */
  columns: [
    { key: 'processed_at', header: '処理日時', required: true, type: 'datetime', gemini: false },
    { key: 'source_file', header: '元ファイル', required: true, type: 'string', gemini: false },
    { key: 'product_name', header: '商品名', required: true, type: 'string', gemini: true },
    { key: 'maker', header: 'メーカー', required: false, type: 'string', gemini: true },
    { key: 'brand', header: 'ブランド', required: false, type: 'string', gemini: true },
    { key: 'jan_code', header: 'JANコード', required: false, type: 'string', gemini: true, duplicateKey: true },
    { key: 'product_code', header: '商品コード', required: false, type: 'string', gemini: true, duplicateKey: true },
    { key: 'expiration_type', header: '期限種別', required: false, type: 'string', gemini: true },
    { key: 'expiration_date', header: '期限日', required: false, type: 'string', gemini: true },
    { key: 'net_content', header: '内容量', required: false, type: 'string', gemini: true },
    { key: 'ingredients', header: '原材料', required: false, type: 'string', gemini: true },
    { key: 'allergens', header: 'アレルゲン', required: false, type: 'string', gemini: true },
    { key: 'storage_method', header: '保存方法', required: false, type: 'string', gemini: true },
    { key: 'country_of_origin', header: '原産国', required: false, type: 'string', gemini: true },
    { key: 'serving_size', header: '栄養成分の基準量', required: false, type: 'string', gemini: true },
    { key: 'energy_kcal', header: 'エネルギー kcal', required: false, type: 'string', gemini: true },
    { key: 'protein_g', header: 'たんぱく質 g', required: false, type: 'string', gemini: true },
    { key: 'fat_g', header: '脂質 g', required: false, type: 'string', gemini: true },
    { key: 'carbohydrate_g', header: '炭水化物 g', required: false, type: 'string', gemini: true },
    { key: 'salt_equivalent_g', header: '食塩相当量 g', required: false, type: 'string', gemini: true },
    { key: 'nutrition_notes', header: '栄養成分メモ', required: false, type: 'string', gemini: true },
    { key: 'confidence_notes', header: '読み取りメモ', required: false, type: 'string', gemini: true },
    { key: 'notes', header: '備考', required: false, type: 'string', gemini: true },
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
