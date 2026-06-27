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
