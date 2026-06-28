/**
 * スプレッドシート操作（FR-SHT-001）。
 *
 * schema.js の列順で行を組み立て、商品DB へ追記する。
 * 重複チェック（FR-SHT-002）は Phase 2 で実装予定。
 */

/**
 * 抽出 JSON を商品DB シートの最終行へ追記する。
 * @param {Object} geminiRecord Gemini 抽出結果
 * @param {string} sourceFile PDF ファイル名
 * @param {Date} processedAt 処理日時
 * @returns {{ row: number, skipped: boolean, duplicate_of_row: number|null }}
 */
function appendProductRecord_(geminiRecord, sourceFile, processedAt) {
  if (!sourceFile) {
    throw new Error('sourceFile は必須です');
  }
  const sheet = getProductDataSheetOrThrow_();
  const rowValues = buildProductRowValues_(geminiRecord, sourceFile, processedAt || new Date());
  const targetRow = sheet.getLastRow() + 1;
  // getRange(row, col, numRows, numCols) — 第3引数は行数（終了行ではない）。doc/ai_guidelines/試験実装のエラー.md 参照
  sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
  console.log('[spreadsheet] 行 ' + targetRow + ' に追記しました: source_file=' + sourceFile);
  return {
    row: targetRow,
    skipped: false,
    duplicate_of_row: null,
  };
}

/**
 * Script Properties の SPREADSHEET_ID から商品DB シートを取得する。
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getProductDataSheetOrThrow_() {
  const ss = SpreadsheetApp.openById(getSpreadsheetId_());
  const sheet = ss.getSheetByName(SHEET_SCHEMA.sheetName);
  if (!sheet) {
    throw new Error(
      '「' +
        SHEET_SCHEMA.sheetName +
        '」シートがありません。商品DB メニューから「商品DB シートを作成」を実行してください。'
    );
  }
  if (sheet.getLastRow() === 0) {
    throw new Error('ヘッダー行がありません。「ヘッダー行を再適用」を実行してください。');
  }
  return sheet;
}

/**
 * schema 列順の 1 行分の値配列を組み立てる。
 * @param {Object} geminiRecord
 * @param {string} sourceFile
 * @param {Date|string} processedAt
 * @returns {string[]}
 */
function buildProductRowValues_(geminiRecord, sourceFile, processedAt) {
  const record = geminiRecord || {};
  const processedAtStr = formatProcessedAt_(processedAt);
  return SHEET_SCHEMA.columns.map(function (col) {
    if (col.key === 'processed_at') {
      return processedAtStr;
    }
    if (col.key === 'source_file') {
      return String(sourceFile);
    }
    if (col.key === 'drive_file_name') {
      return '';
    }
    const value = record[col.key];
    return value === undefined || value === null ? '' : String(value);
  });
}

/**
 * 処理日時をシート表示用文字列に整形する（Asia/Tokyo）。
 * @param {Date|string} dateOrString
 * @returns {string}
 */
function formatProcessedAt_(dateOrString) {
  if (typeof dateOrString === 'string') {
    return dateOrString;
  }
  return Utilities.formatDate(dateOrString, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * 追記済み行の Drive ファイル名列を更新する（FR-PDF-004）。
 *
 * @param {number} row 1 始まりの行番号
 * @param {string} driveFileName
 */
function updateDriveFileNameOnRow_(row, driveFileName) {
  if (!row || row < 2) {
    return;
  }
  const sheet = getProductDataSheetOrThrow_();
  const colIndex = getColumnIndexByKey_('drive_file_name');
  sheet.getRange(row, colIndex).setValue(driveFileName || '');
  console.log('[spreadsheet] 行 ' + row + ' の drive_file_name を更新: ' + (driveFileName || '(空)'));
}

/**
 * デバッグ: ダミー JSON を商品DB に 1 行追記する（Gemini 不要）。
 * @returns {{ row: number, skipped: boolean, duplicate_of_row: number|null }}
 */
function debugAppendDummyRecord() {
  const now = new Date();
  const geminiRecord = buildEmptyGeminiRecord_();
  geminiRecord.product_name = 'テスト商品';
  geminiRecord.genre = '菓子';
  geminiRecord.maker = 'テスト食品株式会社';
  geminiRecord.jan_code = '4901234567890';
  geminiRecord.expiration_type = '賞味期限';
  geminiRecord.expiration_date = '2026-12-31';
  geminiRecord.notes = 'PoC ダミーレコード（debugAppendDummyRecord）';

  const sourceFile =
    'poc-dummy-' + Utilities.formatDate(now, 'Asia/Tokyo', 'yyyyMMdd-HHmmss') + '.pdf';
  const result = appendProductRecord_(geminiRecord, sourceFile, now);
  const message =
    'ダミー行を追記しました。\n' +
    '行番号: ' +
    result.row +
    '\n' +
    '元ファイル: ' +
    sourceFile +
    '\n商品DB シートで内容を確認してください。';
  Logger.log(message);
  console.log(message);
  return result;
}
