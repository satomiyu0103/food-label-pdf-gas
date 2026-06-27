/**
 * 本番オーケストレーション（FR-PDF-001 / FR-PDF-002 / FR-SHT-001）。
 *
 * 処理の流れ:
 *   単件: Drive PDF → Gemini 抽出 → 商品DB 追記 → （失敗時 Slack）
 *   バッチ: インプットフォルダ列挙 → 上記を PDF ごとに実行 → 成功/失敗フォルダへ移動
 *
 * 実装方針: 名刺PDF版 main.js の処理制御を流用する（doc/specs/商品PDF_引継ぎ資料.md §2）。
 * TODO: extractProductFromPdf_ / appendProductRecord_ 等の商品向け関数へ接続する。
 */

/**
 * PDF 1 枚を処理し、商品DB シートに 1 行追記する（手動 1 件実行用）。
 * @param {string} fileId Google ドライブの PDF ファイル ID
 */
function processPdfByFileId(fileId) {
  throw new Error('未実装: processPdfByFileId（main.js）');
}

/**
 * インプットフォルダ内の未処理 PDF をすべて処理する（FR-PDF-001）。
 */
function processAllPendingPdfs() {
  throw new Error('未実装: processAllPendingPdfs（main.js）');
}
