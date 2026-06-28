/**
 * 商品ジャンルマスタ（FR-PDF-004）。
 *
 * Gemini はこの一覧から 1 件だけ選択する。運用開始前に利用者が調整する。
 */
const PRODUCT_GENRE_LIST = [
  '菓子',
  '飲料',
  '調味料',
  '麺類',
  '米・穀物',
  '乳製品',
  '冷凍食品',
  '缶詰',
  'その他',
];

/** マスタ外ジャンルのフォールバック */
const PRODUCT_GENRE_FALLBACK = 'その他';

/**
 * ジャンルマスタ一覧を返す（コピー）。
 * @returns {string[]}
 */
function getProductGenreList_() {
  return PRODUCT_GENRE_LIST.slice();
}

/**
 * Gemini プロンプト用のジャンル説明文。
 * @returns {string}
 */
function formatProductGenreListForPrompt_() {
  return PRODUCT_GENRE_LIST.join(' / ');
}

/**
 * ジャンルをマスタに正規化する。一覧外は「その他」。
 * @param {string} genre
 * @returns {string}
 */
function normalizeGenre_(genre) {
  const trimmed = genre ? String(genre).trim() : '';
  if (!trimmed) {
    return PRODUCT_GENRE_FALLBACK;
  }
  const matched = PRODUCT_GENRE_LIST.find(function (item) {
    return item === trimmed;
  });
  return matched || PRODUCT_GENRE_FALLBACK;
}
