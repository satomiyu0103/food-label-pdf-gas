/**
 * Gemini API 通信（FR-PDF-002）。
 *
 * PDF を inlineData で渡し、商品情報 JSON を取得する。
 * 低 temperature、responseMimeType: application/json、429/500 リトライ、401 即停止を維持する。
 *
 * TODO: buildGeminiPrompt_() を商品ラベル・商品仕様書向けに実装（doc/specs/商品PDF_引継ぎ資料.md §6）。
 */

/**
 * 商品 PDF から構造化 JSON を抽出する。
 * @param {GoogleAppsScript.Drive.File} file
 * @returns {Object}
 */
function extractProductFromPdf_(file) {
  throw new Error('未実装: extractProductFromPdf_（gemini.js）');
}

/**
 * Gemini プロンプト本文を組み立てる。
 * @returns {string}
 */
function buildGeminiPrompt_() {
  return [
    'あなたは商品ラベルOCR抽出アシスタントです。',
    '添付PDFから商品名、メーカー、期限、原材料、アレルゲン、栄養成分を読み取り、',
    '指定キーのJSONオブジェクトのみを返してください。',
    '読み取れない項目は空文字 "" にしてください。',
    '期限は可能なら YYYY-MM-DD 形式にしてください。',
    '複数商品が見える場合は主対象1件のみ返し、confidence_notes に複数商品の可能性を記録してください。',
  ].join('\n');
}
