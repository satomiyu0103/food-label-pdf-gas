/**
 * Slack エラー通知（FR-NTF-001）。
 */

/** Slack 本文のエラーメッセージ最大文字数 */
const SLACK_ERROR_MESSAGE_MAX_LEN = 500;

/**
 * PDF 処理失敗を Slack へ通知する（秘密情報・PDF 本文は含めない）。
 * @param {string} sourceFile
 * @param {string} fileId
 * @param {string} errorMessage
 * @returns {{ ok: boolean, skipped: boolean, httpStatus?: number, detail: string }}
 */
function notifyPdfProcessingErrorSafely_(sourceFile, fileId, errorMessage) {
  const safeFileName = String(sourceFile || '（ファイル名不明）');
  const safeFileId = String(fileId || '').trim();
  const safeError = truncateNotificationText_(errorMessage, SLACK_ERROR_MESSAGE_MAX_LEN);

  const lines = [
    '*SmartShelf 商品PDF処理エラー*',
    '元ファイル: ' + safeFileName,
  ];
  if (safeFileId) {
    lines.push('Drive fileId: ' + safeFileId);
  }
  lines.push('エラー: ' + safeError);

  return postSlackMessageSafely_(lines.join('\n'));
}

/**
 * GAS エディタ・デバッグメニュー用: ダミーデータで Slack 通知疎通を確認する。
 * @returns {{ ok: boolean, skipped: boolean, httpStatus?: number, detail: string }}
 */
function debugNotifySlackTest() {
  return notifyPdfProcessingErrorSafely_(
    'debug_dummy_scan.pdf',
    'DEBUG_FILE_ID_NOT_REAL',
    '[テスト] Slack 通知疎通確認（PDF 処理は行っていません）'
  );
}

/**
 * Slack Incoming Webhook へテキストを POST する。失敗時も throw しない。
 * @param {string} text
 * @returns {{ ok: boolean, skipped: boolean, httpStatus?: number, detail: string }}
 */
function postSlackMessageSafely_(text) {
  const webhookUrl = getScriptPropertyOrNull_(CONFIG_KEYS.SLACK_WEBHOOK_URL);
  if (!webhookUrl) {
    const detail = 'SLACK_WEBHOOK_URL 未設定のため通知スキップ';
    console.warn('[notification] ' + detail);
    return { ok: false, skipped: true, detail: detail };
  }

  try {
    const response = UrlFetchApp.fetch(webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ text: text }),
      muteHttpExceptions: true,
    });
    const status = response.getResponseCode();
    if (status < 200 || status >= 300) {
      const detail =
        'HTTP ' +
        status +
        ': ' +
        truncateNotificationText_(response.getContentText(), 200);
      console.warn('[notification] Slack 送信失敗 ' + detail);
      return { ok: false, skipped: false, httpStatus: status, detail: detail };
    }
    return { ok: true, skipped: false, httpStatus: status, detail: '送信成功' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[notification] Slack 送信例外: ' + message);
    return { ok: false, skipped: false, detail: message };
  }
}

/**
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncateNotificationText_(text, maxLen) {
  const value = String(text || '');
  if (value.length <= maxLen) {
    return value;
  }
  return value.substring(0, maxLen) + '…';
}
