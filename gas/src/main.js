/**
 * 本番オーケストレーション（FR-PDF-002 / FR-PDF-003 / FR-PDF-004 / FR-SHT-001）。
 *
 * 処理の流れ:
 *   単件: Drive PDF → Gemini 抽出 → 商品DB 追記 → リネーム → 処理済み移動
 *   バッチ: インプットフォルダ列挙 → 一括処理（FR-PDF-001）
 *
 * 実装方針: 名刺PDF版 main.js の単件処理制御を流用（doc/specs/商品PDF_引継ぎ資料.md §2）。
 */

/**
 * PDF 1 枚を処理し、商品DB シートに 1 行追記する（手動 1 件実行用）。
 *
 * @param {string} fileId Google ドライブの PDF ファイル ID
 * @returns {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, drive_file_name: string, product_name: string, maker: string, jan_code: string, genre: string }}
 */
function processPdfByFileId(fileId) {
  if (!fileId || !String(fileId).trim()) {
    throw new Error(
      'fileId を指定してください。\n' +
        'GAS エディタから実行する場合: debugProcessPdf（Script Property DEBUG_PDF_FILE_ID）または debugProcessFirstInputPdf を使ってください'
    );
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
 *
 * @returns {Array<{ ok: boolean, result?: Object, source_file?: string, error?: string }>}
 */
function processAllPendingPdfs() {
  const files = listInputFolderPdfFiles_();
  console.log('[main] 一括処理開始: ' + files.length + ' 件');
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sourceFile = file.getName();
    try {
      const result = processPdfFile_(file, new Date());
      results.push({ ok: true, result: result });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logProcessFailure_(file.getId(), err);
      notifyPdfProcessingErrorSafely_(sourceFile, file.getId(), errorMessage);
      if (isGeminiAuthErrorMessage_(errorMessage)) {
        throw err;
      }
      moveFileToErrorFolder_(file);
      results.push({ ok: false, source_file: sourceFile, error: errorMessage });
    }
  }
  console.log(
    '[main] 一括処理完了: 成功 ' +
      results.filter(function (r) { return r.ok; }).length +
      ' / ' +
      results.length
  );
  return results;
}

/**
 * 1 PDF の Gemini 抽出・シート追記・リネーム・移動。
 *
 * @param {GoogleAppsScript.Drive.File} file
 * @param {Date} processedAt
 * @returns {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, drive_file_name: string, product_name: string, maker: string, jan_code: string, genre: string }}
 */
function processPdfFile_(file, processedAt) {
  const sourceFile = file.getName();
  console.log('[main] 処理開始: ' + sourceFile);
  const geminiRecord = extractProductFromPdf_(file);
  const appendResult = appendProductRecord_(geminiRecord, sourceFile, processedAt);
  if (appendResult.skipped) {
    console.warn(
      '[main] 重複スキップ: source_file=' +
        sourceFile +
        ' duplicate_of_row=' +
        appendResult.duplicate_of_row
    );
  }

  const newFileName = buildProductPdfFileName_(geminiRecord, processedAt);
  const renamedFileName = renamePdfFileSafely_(file, newFileName);
  if (appendResult.row && !appendResult.skipped) {
    updateDriveFileNameOnRow_(appendResult.row, renamedFileName || '');
  }

  moveFileToProcessedFolder_(file);

  return {
    row: appendResult.row,
    skipped: appendResult.skipped,
    duplicate_of_row: appendResult.duplicate_of_row,
    source_file: sourceFile,
    drive_file_name: renamedFileName || '',
    product_name: geminiRecord.product_name,
    maker: geminiRecord.maker,
    jan_code: geminiRecord.jan_code,
    genre: geminiRecord.genre,
  };
}

/**
 * 単件処理結果を UI / ログ向けの文字列に整形する。
 *
 * @param {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, drive_file_name: string, product_name: string, maker: string, jan_code: string, genre: string }} result
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
  const driveNameLine = result.drive_file_name
    ? '\nDriveファイル名: ' + result.drive_file_name
    : '\nDriveファイル名: （リネームなし）';
  return (
    '処理完了\n' +
    '行番号: ' +
    result.row +
    '\n' +
    '元ファイル: ' +
    result.source_file +
    driveNameLine +
    '\n' +
    '商品名: ' +
    result.product_name +
    '\n' +
    'ジャンル: ' +
    result.genre +
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
 * @param {{ row: number|null, skipped: boolean, duplicate_of_row: number|null, source_file: string, drive_file_name: string, product_name: string, maker: string, jan_code: string, genre: string }} result
 */
function logProcessSuccess_(result) {
  const message = formatProcessResultMessage_(result);
  Logger.log(message);
  console.log('[main] ' + message.replace(/\n/g, ' | '));
}

/**
 * GAS エディタ用: Script Property DEBUG_PDF_FILE_ID の PDF を本番フロー（抽出・追記・リネーム・移動）で処理する。
 *
 * @returns {Object}
 */
function debugProcessPdf() {
  return processPdfByFileId(getDebugPdfFileIdOrThrow_());
}

/**
 * GAS エディタ用: インプットフォルダ内の先頭 PDF を本番フローで処理する。
 *
 * @returns {Object}
 */
function debugProcessFirstInputPdf() {
  const files = listInputFolderPdfFiles_();
  if (files.length === 0) {
    throw new Error(
      'インプットフォルダに PDF がありません。DRIVE_INPUT_FOLDER_ID とフォルダ内の PDF を確認してください'
    );
  }
  const file = files[0];
  console.log('[main] 先頭 PDF を処理: ' + file.getName() + ' id=' + file.getId());
  return processPdfByFileId(file.getId());
}
