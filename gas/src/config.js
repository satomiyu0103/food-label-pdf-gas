/**
 * Script Properties / 環境定数のキー名。
 *
 * Why 値をコードに書かない: API キー等は Script Properties のみに保持（NFR-SEC-001）。
 * このファイルはキー名の正本。実値は GAS エディタまたは config/.env（ローカル）で管理。
 */
const CONFIG_KEYS = {
  SPREADSHEET_ID: 'SPREADSHEET_ID',
  GEMINI_API_KEY: 'GEMINI_API_KEY',
  SLACK_WEBHOOK_URL: 'SLACK_WEBHOOK_URL',
  DRIVE_INPUT_FOLDER_ID: 'DRIVE_INPUT_FOLDER_ID',
  DRIVE_PROCESSED_FOLDER_ID: 'DRIVE_PROCESSED_FOLDER_ID',
  DRIVE_ERROR_FOLDER_ID: 'DRIVE_ERROR_FOLDER_ID',
  /** GAS エディタから debugPocExtractPdf / debugProcessPdf 実行時の PDF fileId（デバッグ専用） */
  DEBUG_PDF_FILE_ID: 'DEBUG_PDF_FILE_ID',
};

/**
 * @param {string} key
 * @returns {string}
 */
function getScriptProperty_(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error('Script Property が未設定: ' + key);
  }
  return value;
}

/**
 * @param {string} key
 * @param {string} value
 */
function setScriptProperty_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

function getSpreadsheetId_() {
  return getScriptProperty_(CONFIG_KEYS.SPREADSHEET_ID);
}

function getDriveInputFolderId_() {
  return getScriptProperty_(CONFIG_KEYS.DRIVE_INPUT_FOLDER_ID);
}

function getDriveProcessedFolderId_() {
  return getScriptProperty_(CONFIG_KEYS.DRIVE_PROCESSED_FOLDER_ID);
}

function getDriveErrorFolderId_() {
  return getScriptProperty_(CONFIG_KEYS.DRIVE_ERROR_FOLDER_ID);
}

function getSlackWebhookUrl_() {
  return getScriptProperty_(CONFIG_KEYS.SLACK_WEBHOOK_URL);
}

/**
 * Script Property が未設定のとき null を返す（オプション設定用）。
 * @param {string} key
 * @returns {string|null}
 */
function getScriptPropertyOrNull_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * デバッグ用 PDF fileId（Script Properties: DEBUG_PDF_FILE_ID）。
 * @returns {string}
 */
function getDebugPdfFileIdOrThrow_() {
  const fileId = getScriptPropertyOrNull_(CONFIG_KEYS.DEBUG_PDF_FILE_ID);
  if (!fileId || !String(fileId).trim()) {
    throw new Error(
      'Script Property DEBUG_PDF_FILE_ID が未設定です。' +
        'GAS のプロジェクト設定 → スクリプト プロパティ、または config/.env（ローカル）に登録してください'
    );
  }
  return String(fileId).trim();
}
