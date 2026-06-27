/**
 * スプレッドシート操作（FR-SHT-001 / FR-SHT-002）。
 *
 * schema.js の列順で行を組み立て、商品DB へ追記する。
 * 重複チェック: JANコード優先 → 商品コード → 複合キー（doc/specs/商品PDF_引継ぎ資料.md §5）。
 *
 * TODO: appendProductRecord_ / findDuplicateRowForRecord_ を実装。
 */

/**
 * 抽出 JSON を商品DB シートの最終行へ追記する。
 * @param {Object} geminiRecord Gemini 抽出結果
 * @param {string} sourceFile PDF ファイル名
 * @param {Date} processedAt 処理日時
 * @returns {{ row: number, skipped: boolean, duplicate_of_row: number|null }}
 */
function appendProductRecord_(geminiRecord, sourceFile, processedAt) {
  throw new Error('未実装: appendProductRecord_（spreadsheet.js）');
}
