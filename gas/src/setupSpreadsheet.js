/**
 * 商品 DB シートのセットアップ（開いているスプレッドシート内に「商品DB」タブを作成）。
 *
 * GAS エディタ / メニューから:
 *   setupCreateDataSheetInActive()  … 推奨: 開いているブックに商品DBシート + ID 保存
 *   setupCreateSpreadsheet()        … 後方互換エイリアス（中身は上と同じ）
 *   setupInitHeadersOnExisting()    … ヘッダー行のみ再適用
 *   setupRegisterSpreadsheetFromActive() … 後方互換エイリアス
 *   setupShowSpreadsheetId()        … 登録済み ID をログ表示
 */

/**
 * 開いているスプレッドシートに「商品DB」シートを作成し、ヘッダーを設定、ID を保存する。
 * 新規ブックは作成しない。
 * @returns {{ id: string, url: string, sheetName: string, created: boolean }}
 */
function setupCreateDataSheetInActive() {
  const ss = getActiveSpreadsheetOrThrow_();
  const id = ss.getId();
  setScriptProperty_(CONFIG_KEYS.SPREADSHEET_ID, id);

  const existing = ss.getSheetByName(SHEET_SCHEMA.sheetName);
  const created = !existing;
  const sheet = getOrCreateDataSheet_(ss);
  applyHeaderRow_(sheet);
  ss.setActiveSheet(sheet);

  logSpreadsheetSetupResult_(id, ss.getUrl(), created ? '商品DBシート新規作成' : '商品DBシート更新');
  return { id: id, url: ss.getUrl(), sheetName: SHEET_SCHEMA.sheetName, created: created };
}

/** @deprecated 新規ブックは作成しない。setupCreateDataSheetInActive を使用。 */
function setupCreateSpreadsheet() {
  return setupCreateDataSheetInActive();
}

/**
 * 開いているブック（または Script Properties の ID）の商品DBシートにヘッダー行を適用する。
 * @returns {{ id: string, url: string }}
 */
function setupInitHeadersOnExisting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) {
    setScriptProperty_(CONFIG_KEYS.SPREADSHEET_ID, ss.getId());
    const sheet = getOrCreateDataSheet_(ss);
    applyHeaderRow_(sheet);
    return { id: ss.getId(), url: ss.getUrl() };
  }
  const id = getSpreadsheetId_();
  return initHeadersBySpreadsheetId_(id);
}

/**
 * スプレッドシート URL から ID を抽出する。
 * @param {string} url
 * @returns {string}
 */
function extractSpreadsheetIdFromUrl(url) {
  const match = String(url).match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error('スプレッドシート URL の形式が不正です: ' + url);
  }
  return match[1];
}

/**
 * URL を指定して ID を Script Properties に保存し、商品DBシートを作成する。
 * @param {string} spreadsheetUrl
 */
function setupRegisterSpreadsheetFromUrl(spreadsheetUrl) {
  const id = extractSpreadsheetIdFromUrl(spreadsheetUrl);
  setScriptProperty_(CONFIG_KEYS.SPREADSHEET_ID, id);
  const result = initHeadersBySpreadsheetId_(id);
  logSpreadsheetSetupResult_(id, result.url, 'URL から登録');
  return result;
}

/** 後方互換エイリアス。setupCreateDataSheetInActive と同じ。 */
function setupRegisterSpreadsheetFromActive() {
  return setupCreateDataSheetInActive();
}

/** 登録済み SPREADSHEET_ID をログに出力（config/.env への転記用） */
function setupShowSpreadsheetId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) {
    const id = ss.getId();
    logSpreadsheetSetupResult_(id, ss.getUrl(), 'アクティブブック');
    return id;
  }
  const id = getSpreadsheetId_();
  const remote = SpreadsheetApp.openById(id);
  logSpreadsheetSetupResult_(id, remote.getUrl(), '登録済み');
  return id;
}

/**
 * @param {string} id
 * @returns {{ id: string, url: string }}
 */
function initHeadersBySpreadsheetId_(id) {
  const ss = SpreadsheetApp.openById(id);
  const sheet = getOrCreateDataSheet_(ss);
  applyHeaderRow_(sheet);
  return { id: id, url: ss.getUrl() };
}

/**
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getActiveSpreadsheetOrThrow_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'スプレッドシートを開いた状態で実行してください。GAS エディタ単体ではなく、対象のスプレッドシートから実行してください。'
    );
  }
  return ss;
}

/**
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getOrCreateDataSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_SCHEMA.sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_SCHEMA.sheetName);
  }
  return sheet;
}

/**
 * 1 行目にヘッダー文字列のみ書き込む（列幅・色・固定行などの見た目は変更しない）。
 *
 * Why 見た目は触らない: 利用者がスプレッドシート UI で自由に整形できるようヘッダー文字列のみ正本とする。
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function applyHeaderRow_(sheet) {
  const headers = getSheetHeaders_();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

/**
 * @param {string} id
 * @param {string} url
 * @param {string} mode
 */
function logSpreadsheetSetupResult_(id, url, mode) {
  const message =
    '[商品DB セットアップ: ' +
    mode +
    ']\n' +
    'SPREADSHEET_ID=' +
    id +
    '\n' +
    'URL=' +
    url +
    '\n' +
    'SHEET=' +
    SHEET_SCHEMA.sheetName +
    '\n\n' +
    '→ 開いているブック内に「' +
    SHEET_SCHEMA.sheetName +
    '」シートを作成/更新しました\n' +
    '→ Script Properties に SPREADSHEET_ID を保存済み\n' +
    '→ ローカル開発用: config/.env の SPREADSHEET_ID= にも同じ値を記入';
  Logger.log(message);
  console.log(message);
}
