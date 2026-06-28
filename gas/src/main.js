/**
 * 本番オーケストレーション（FR-PDF-002 / FR-SHT-001）。
 *
 * 処理の流れ:
 *   単件: Drive PDF → Gemini 抽出 → 商品DB 追記 → （失敗時 Slack スタブ）
 *   バッチ: Phase 2 で実装（インプットフォルダ列挙 → 一括処理 → フォルダ移動）
 *
 * 実装方針: 名刺PDF版 main.js の単件処理制御を流用（doc/specs/商品PDF_引継ぎ資料.md §2）。
 */

/**
 * PDF 1 枚を処理し、商品DB シートに 1 行追記する（手動 1 件実行用）。
 *
 * PDF の Drive 移動は行わない（一括処理は processAllPendingPdfs — Phase 2）。
 *
 * @param {string} fileId Google ドライブの PDF ファイル ID
 * @returns {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, product_name: string, maker: string, jan_code: string }}
 */
function processPdfByFileId(fileId) {
  if (!fileId || !String(fileId).trim()) {
    throw new Error('fileId を指定してください');
  }
  const trimmedId = String(fileId).trim();
  let sourceFile = trimmedId;
  try {
    const file = DriveApp.getFileById(trimmedId);
    sourceFile = file.getName();
    const result = processPdfFile_(file, new Date());
    logProcessSuccess_(result);
    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logProcessFailure_(trimmedId, err);
    notifyPdfProcessingErrorSafely_(sourceFile, trimmedId, errorMessage);
    throw err;
  }
}

/**
 * インプットフォルダ内の未処理 PDF をすべて処理する（FR-PDF-001）。
 * Phase 2 で実装予定。
 */
function processAllPendingPdfs() {
  throw new Error('未実装: processAllPendingPdfs（Phase 2 — drive.js 実装後）');
}

/**
 * 1 PDF の Gemini 抽出とシート追記。
 *
 * @param {GoogleAppsScript.Drive.File} file
 * @param {Date} processedAt
 * @returns {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, product_name: string, maker: string, jan_code: string }}
 */
function processPdfFile_(file, processedAt) {
  const sourceFile = file.getName();
  console.log('[main] 処理開始: ' + sourceFile);
  const geminiRecord = extractProductFromPdf_(file);
  const appendResult = appendProductRecord_(geminiRecord, sourceFile, processedAt);
  return {
    row: appendResult.row,
    skipped: appendResult.skipped,
    duplicate_of_row: appendResult.duplicate_of_row,
    source_file: sourceFile,
    product_name: geminiRecord.product_name,
    maker: geminiRecord.maker,
    jan_code: geminiRecord.jan_code,
  };
}

/**
 * 単件処理結果を UI / ログ向けの文字列に整形する。
 *
 * @param {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, product_name: string, maker: string, jan_code: string }} result
 * @returns {string}
 */
function formatProcessResultMessage_(result) {
  if (result.skipped) {
    return (
      '処理完了（重複スキップ）\n' +
      '元ファイル: ' +
      result.source_file +
      '\n' +
      '既存行: ' +
      result.duplicate_of_row +
      '\n' +
      'JAN: ' +
      result.jan_code
    );
  }
  return (
    '処理完了\n' +
    '行番号: ' +
    result.row +
    '\n' +
    '元ファイル: ' +
    result.source_file +
    '\n' +
    '商品名: ' +
    result.product_name +
    '\n' +
    'メーカー: ' +
    result.maker +
    '\n' +
    'JAN: ' +
    result.jan_code
  );
}

/**
 * @param {string} fileIdOrName
 * @param {*} err
 */
function logProcessFailure_(fileIdOrName, err) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error('[main] 処理失敗 fileId=' + fileIdOrName + ': ' + errorMessage);
}

/**
 * @param {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, product_name: string, maker: string, jan_code: string }} result
 */
function logProcessSuccess_(result) {
  const message = formatProcessResultMessage_(result);
  Logger.log(message);
  console.log('[main] ' + message.replace(/\n/g, ' | '));
}
