/**
 * Slack エラー通知（FR-NTF-001）。
 *
 * TODO: notifyPdfProcessingErrorSafely_ / notifySystemErrorSafely_ を商品PDF向け文言で実装。
 */

/**
 * PDF 処理失敗を Slack へ通知する（秘密情報・PDF 本文は含めない）。
 * @param {string} sourceFile
 * @param {string} fileId
 * @param {string} errorMessage
 */
function notifyPdfProcessingErrorSafely_(sourceFile, fileId, errorMessage) {
  console.warn('[notification] 未実装のため通知スキップ: ' + sourceFile);
}
