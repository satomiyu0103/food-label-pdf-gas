/**
 * スプレッドシート UI（カスタムメニュー・サイドバー）。
 *
 * TODO: onOpen / メニュー「商品DB」/ ControlPanel.html 連携を実装。
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
    .addItem('インプット PDF 一括処理', 'processAllPendingPdfs')
    .addToUi();
}

function menuCreateDataSheet() {
  setupCreateDataSheetInActive();
}

function menuApplyHeaders() {
  throw new Error('未実装: menuApplyHeaders（ui.js）');
}
