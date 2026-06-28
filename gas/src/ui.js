/**
 * スプレッドシート UI（カスタムメニュー・サイドバー）。
 */

/**
 * スプレッドシート起動時にカスタムメニューを追加する。
 * @param {Object} e
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('商品DB')
    .addItem('商品DB シートを作成', 'menuCreateDataSheet')
    .addItem('ヘッダー行を再適用', 'menuApplyHeaders')
    .addSeparator()
    .addItem('ダミー行を追記（デバッグ）', 'menuDebugAppendDummyRecord')
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
