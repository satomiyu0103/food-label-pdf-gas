/**
 * スプレッドシート UI（カスタムメニュー・サイドバー）。
 */

/** メニュー alert に表示する失敗件数の上限 */
const MENU_BATCH_FAILURE_DISPLAY_MAX = 5;

/**
 * スプレッドシート起動時にカスタムメニューを追加する。
 * @param {Object} e
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('商品DB')
    .addItem('インプット PDF 一括処理', 'menuProcessAllPendingPdfs')
    .addSeparator()
    .addItem('商品DB シートを作成', 'menuCreateDataSheet')
    .addItem('ヘッダー行を再適用', 'menuApplyHeaders')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu('デバッグ')
        .addItem('ダミー行を追記（デバッグ）', 'menuDebugAppendDummyRecord')
        .addItem('Slack 通知テスト（ダミー）', 'menuDebugNotifySlackTest')
    )
    .addToUi();
}

function menuCreateDataSheet() {
  setupCreateDataSheetInActive();
}

function menuApplyHeaders() {
  setupInitHeadersOnExisting();
}

function menuDebugAppendDummyRecord() {
  debugAppendDummyRecord();
}

function menuDebugNotifySlackTest() {
  const result = debugNotifySlackTest();
  const ui = SpreadsheetApp.getUi();
  if (result.skipped) {
    ui.alert('Slack 通知テスト', result.detail, ui.ButtonSet.OK);
    return;
  }
  if (result.ok) {
    ui.alert(
      'Slack 通知テスト',
      '送信成功（HTTP ' + result.httpStatus + '）。Slack チャンネルを確認してください。',
      ui.ButtonSet.OK
    );
    return;
  }
  ui.alert('Slack 通知テスト', '送信失敗:\n' + result.detail, ui.ButtonSet.OK);
}

/**
 * インプットフォルダ内の未処理 PDF を一括処理し、結果サマリを alert 表示する。
 */
function menuProcessAllPendingPdfs() {
  const ui = SpreadsheetApp.getUi();
  try {
    const results = processAllPendingPdfs();
    ui.alert('一括処理完了', formatBatchProcessSummaryMessage_(results), ui.ButtonSet.OK);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    ui.alert(
      '一括処理が中断されました',
      'Gemini 認証エラー等により処理を停止しました。\n\n' + errorMessage,
      ui.ButtonSet.OK
    );
  }
}

/**
 * @param {Array<{ ok: boolean, result?: Object, source_file?: string, error?: string }>} results
 * @returns {string}
 */
function formatBatchProcessSummaryMessage_(results) {
  const skippedCount = results.filter(function (r) {
    return r.ok && r.result && r.result.skipped;
  }).length;
  const successCount = results.filter(function (r) {
    return r.ok && (!r.result || !r.result.skipped);
  }).length;
  const failureCount = results.length - successCount - skippedCount;
  let message =
    '処理件数: ' +
    results.length +
    '\n成功: ' +
    successCount +
    '\n重複スキップ: ' +
    skippedCount +
    '\n失敗: ' +
    failureCount;

  if (failureCount === 0) {
    return message;
  }

  const failures = results.filter(function (r) {
    return !r.ok;
  });
  message += '\n\n【失敗したファイル】';
  const displayCount = Math.min(failures.length, MENU_BATCH_FAILURE_DISPLAY_MAX);
  for (let i = 0; i < displayCount; i++) {
    const item = failures[i];
    message +=
      '\n・' +
      (item.source_file || '（ファイル名不明）') +
      '\n  ' +
      (item.error || 'エラー内容不明');
  }
  if (failures.length > MENU_BATCH_FAILURE_DISPLAY_MAX) {
    message +=
      '\n…他 ' + (failures.length - MENU_BATCH_FAILURE_DISPLAY_MAX) + ' 件（GAS 実行ログを確認）';
  }
  return message;
}
