/**
 * スプレッドシート UI（カスタムメニュー・サイドバー）。
 *
 * 関数の役割分担:
 *   menu*           — サイドバー google.script.run 用（戻り値 string を HTML 側で表示）
 *   menu*WithAlert  — メニューバー用（SpreadsheetApp.getUi().alert で表示）
 *   onOpen          — GAS simple trigger
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
    .addItem('操作パネルを表示', 'showControlPanelSidebar')
    .addSeparator()
    .addItem('インプット PDF 一括処理', 'menuProcessAllPendingPdfsWithAlert')
    .addSeparator()
    .addItem('商品DB シートを作成', 'menuCreateDataSheetWithAlert')
    .addItem('ヘッダー行を再適用', 'menuApplyHeadersWithAlert')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu('デバッグ')
        .addItem('ダミー行を追記（デバッグ）', 'menuDebugAppendDummyRecord')
        .addItem('Slack 通知テスト（ダミー）', 'menuDebugNotifySlackTest')
    )
    .addToUi();
}

/**
 * HTML サイドバー（画面上のボタン UI）。公開名は ControlPanel.html の google.script.run から参照される。
 */
function showControlPanelSidebar() {
  openControlPanelSidebar_();
}

/**
 * GAS エディタから実行する再認可用（appsscript.json のスコープ追加後）。
 * スプレッドシートを開いた状態で実行し、承認ダイアログを完了してからメニューを使う。
 */
function authorizeContainerUi() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'UI 権限の確認',
    '承認ダイアログが表示されたら許可してください。\n完了後、商品DB → 操作パネルを表示 を実行します。',
    ui.ButtonSet.OK
  );
  openControlPanelSidebar_();
}

/**
 * @throws {Error} サイドバーを開けないときは alert で原因を表示してから再 throw
 */
function openControlPanelSidebar_() {
  const ui = SpreadsheetApp.getUi();
  try {
    const html = HtmlService.createHtmlOutputFromFile('ControlPanel')
      .setTitle('商品DB')
      .setWidth(280)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    ui.showSidebar(html);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    ui.alert(
      '操作パネルを開けませんでした',
      errorMessage +
        '\n\n【対処】\n' +
        '1. GAS エディタで authorizeContainerUi を実行し、追加権限を承認\n' +
        '2. スプレッドシートを再読み込みしてから再度お試しください',
      ui.ButtonSet.OK
    );
    throw err;
  }
}

// --- サイドバー用（戻り値のみ・HTML 側で表示） ---

function menuCreateDataSheet() {
  const result = setupCreateDataSheetInActive();
  const action = result.created ? '作成' : '更新';
  return (
    'このブック内に「' +
    result.sheetName +
    '」シートを' +
    action +
    'しました。\nSPREADSHEET_ID=' +
    result.id
  );
}

function menuApplyHeaders() {
  const result = setupInitHeadersOnExisting();
  return 'ヘッダー行を設定しました。\nシート: ' + SHEET_SCHEMA.sheetName + '\nURL: ' + result.url;
}

function menuProcessAllPendingPdfs() {
  const results = processAllPendingPdfs();
  return formatBatchProcessSummaryMessage_(results);
}

// --- メニュー用（ダイアログ付き） ---

function menuCreateDataSheetWithAlert() {
  runWithAlert_('商品DB シート作成', menuCreateDataSheet);
}

function menuApplyHeadersWithAlert() {
  runWithAlert_('ヘッダー再適用', menuApplyHeaders);
}

function menuProcessAllPendingPdfsWithAlert() {
  runWithAlert_('一括処理完了', menuProcessAllPendingPdfs);
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
 * メニューバー用: 処理結果またはエラーを alert 表示する共通ラッパー。
 *
 * @param {string} title
 * @param {function(): string} fn
 */
function runWithAlert_(title, fn) {
  try {
    SpreadsheetApp.getUi().alert(title, fn(), SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    SpreadsheetApp.getUi().alert(title + '（エラー）', errorMessage, SpreadsheetApp.getUi().ButtonSet.OK);
    throw err;
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
