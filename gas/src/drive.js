/**
 * Google ドライブ操作（FR-PDF-001 / FR-PDF-003 / FR-PDF-004 / FR-NTF-002）。
 *
 * 入力・処理済み・エラーの 3 フォルダ分離と PDF リネームを担う。
 */

/** Drive ファイル名の最大長（拡張子 .pdf を除く） */
const DRIVE_FILE_NAME_MAX_LEN = 200;

/** PDF 拡張子 */
const PDF_FILE_EXTENSION = '.pdf';

/**
 * インプットフォルダ内の PDF ファイル一覧を返す。
 * @returns {GoogleAppsScript.Drive.File[]}
 */
function listInputFolderPdfFiles_() {
  const folderId = getDriveInputFolderId_();
  const folder = DriveApp.getFolderById(folderId);
  const files = [];
  const iterator = folder.getFilesByType(MimeType.PDF);
  while (iterator.hasNext()) {
    files.push(iterator.next());
  }
  return files;
}

/**
 * 正常処理後、PDF を処理済みフォルダへ移動する（FR-PDF-003）。
 * DRIVE_PROCESSED_FOLDER_ID 未設定時はスキップする。
 *
 * @param {GoogleAppsScript.Drive.File} file
 * @returns {boolean} 移動した場合 true
 */
function moveFileToProcessedFolder_(file) {
  const folderId = getScriptPropertyOrNull_(CONFIG_KEYS.DRIVE_PROCESSED_FOLDER_ID);
  if (!folderId) {
    console.log('[drive] DRIVE_PROCESSED_FOLDER_ID 未設定のため移動をスキップ');
    return false;
  }
  const folder = DriveApp.getFolderById(folderId);
  file.moveTo(folder);
  console.log('[drive] 処理済みフォルダへ移動: ' + file.getName());
  return true;
}

/**
 * 解析失敗 PDF をエラーフォルダへ移動する（FR-NTF-002）。
 * DRIVE_ERROR_FOLDER_ID 未設定時はスキップする。
 *
 * @param {GoogleAppsScript.Drive.File} file
 * @returns {boolean}
 */
function moveFileToErrorFolder_(file) {
  const folderId = getScriptPropertyOrNull_(CONFIG_KEYS.DRIVE_ERROR_FOLDER_ID);
  if (!folderId) {
    console.log('[drive] DRIVE_ERROR_FOLDER_ID 未設定のため隔離をスキップ');
    return false;
  }
  const folder = DriveApp.getFolderById(folderId);
  file.moveTo(folder);
  console.log('[drive] エラーフォルダへ隔離: ' + file.getName());
  return true;
}

/**
 * 抽出結果から PDF ファイル名を組み立てる（FR-PDF-004）。
 *
 * @param {Object} geminiRecord
 * @param {Date} processedAt
 * @returns {string} 拡張子付きファイル名
 */
function buildProductPdfFileName_(geminiRecord, processedAt) {
  const record = geminiRecord || {};
  const datePrefix = buildDatePrefixForFileName_(record.expiration_date, processedAt);
  const genre = normalizeGenre_(record.genre);
  const productName = sanitizeDriveFileNamePart_(record.product_name || '商品名不明');
  const baseName = datePrefix + '_' + genre + '_' + productName;
  const truncated = truncateDriveFileBaseName_(baseName, DRIVE_FILE_NAME_MAX_LEN);
  return truncated + PDF_FILE_EXTENSION;
}

/**
 * 期限日優先・処理日フォールバックで yyyymmdd を返す。
 *
 * @param {string} expirationDate
 * @param {Date} processedAt
 * @returns {string}
 */
function buildDatePrefixForFileName_(expirationDate, processedAt) {
  const fromExpiration = parseExpirationDateToYyyymmdd_(expirationDate);
  if (fromExpiration) {
    return fromExpiration;
  }
  const date = processedAt instanceof Date ? processedAt : new Date();
  return Utilities.formatDate(date, 'Asia/Tokyo', 'yyyyMMdd');
}

/**
 * expiration_date を yyyymmdd に正規化する。不正なら空文字。
 *
 * @param {string} expirationDate
 * @returns {string}
 */
function parseExpirationDateToYyyymmdd_(expirationDate) {
  const iso = normalizeExpirationDateToIso_(expirationDate);
  if (!iso) {
    return '';
  }
  return iso.replace(/-/g, '');
}

/**
 * Drive 禁止文字を除去し、空白をアンダースコアに統一する。
 *
 * @param {string} part
 * @returns {string}
 */
function sanitizeDriveFileNamePart_(part) {
  let sanitized = String(part)
    .replace(/[\/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!sanitized) {
    return '名称不明';
  }
  return sanitized;
}

/**
 * 拡張子を除いたベース名を最大長に切り詰める。
 *
 * @param {string} baseName
 * @param {number} maxLen
 * @returns {string}
 */
function truncateDriveFileBaseName_(baseName, maxLen) {
  if (baseName.length <= maxLen) {
    return baseName;
  }
  return baseName.substring(0, maxLen).replace(/_+$/g, '');
}

/**
 * フォルダ内で一意なファイル名を返す。衝突時は _2, _3 … を付与。
 *
 * @param {GoogleAppsScript.Drive.Folder} folder
 * @param {string} desiredFileName 拡張子付き
 * @returns {string}
 */
function ensureUniqueFileNameInFolder_(folder, desiredFileName) {
  if (!folder.getFilesByName(desiredFileName).hasNext()) {
    return desiredFileName;
  }
  const dotIndex = desiredFileName.lastIndexOf('.');
  const base = dotIndex >= 0 ? desiredFileName.substring(0, dotIndex) : desiredFileName;
  const ext = dotIndex >= 0 ? desiredFileName.substring(dotIndex) : '';
  for (let suffix = 2; suffix <= 999; suffix++) {
    const candidate = base + '_' + suffix + ext;
    if (!folder.getFilesByName(candidate).hasNext()) {
      return candidate;
    }
  }
  throw new Error('一意なファイル名を生成できませんでした: ' + desiredFileName);
}

/**
 * PDF を安全にリネームする。失敗しても throw しない。
 *
 * @param {GoogleAppsScript.Drive.File} file
 * @param {string} desiredFileName 拡張子付き
 * @returns {string|null} リネーム後のファイル名。失敗時 null
 */
function renamePdfFileSafely_(file, desiredFileName) {
  if (!file || !desiredFileName) {
    console.warn('[drive] リネーム対象またはファイル名が空のためスキップ');
    return null;
  }
  try {
    const parentFolders = file.getParents();
    if (!parentFolders.hasNext()) {
      console.warn('[drive] 親フォルダが見つからないためリネームをスキップ');
      return null;
    }
    const parentFolder = parentFolders.next();
    const uniqueName = ensureUniqueFileNameInFolder_(parentFolder, desiredFileName);
    if (uniqueName !== file.getName()) {
      file.setName(uniqueName);
      console.log('[drive] リネーム完了: ' + uniqueName);
    }
    return uniqueName;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[drive] リネーム失敗（処理は継続）: ' + message);
    return null;
  }
}

/**
 * デバッグ: ファイル名生成ロジックを検証する（Drive API 不要）。
 *
 * @returns {{ cases: Object[] }}
 */
function debugTestBuildProductPdfFileName_() {
  const processedAt = new Date('2026-06-28T12:00:00+09:00');
  const cases = [
    {
      label: '期限日あり',
      record: { product_name: 'チョコレートクッキー', genre: '菓子', expiration_date: '2026-07-15' },
      expectedPrefix: '20260715',
    },
    {
      label: '期限日なし',
      record: { product_name: 'テスト商品', genre: '飲料', expiration_date: '' },
      expectedPrefix: '20260628',
    },
    {
      label: 'ジャンル不一致',
      record: { product_name: '商品A', genre: '未知カテゴリ', expiration_date: '2026-08-01' },
      expectedGenre: 'その他',
    },
    {
      label: 'YY.MM刻印',
      record: { product_name: 'テスト', genre: 'その他', expiration_date: '28.08/+DFL/B' },
      expectedPrefix: '20280831',
    },
    {
      label: '禁止文字',
      record: { product_name: '商品/名:テスト', genre: '調味料', expiration_date: '2026-09-01' },
    },
  ];

  const results = cases.map(function (testCase) {
    const fileName = buildProductPdfFileName_(testCase.record, processedAt);
    const result = {
      label: testCase.label,
      fileName: fileName,
      ok: true,
    };
    if (testCase.expectedPrefix && fileName.indexOf(testCase.expectedPrefix) !== 0) {
      result.ok = false;
      result.error = '期待プレフィックス不一致: ' + testCase.expectedPrefix;
    }
    if (testCase.expectedGenre) {
      const genrePart = fileName.split('_')[1];
      if (genrePart !== testCase.expectedGenre) {
        result.ok = false;
        result.error = '期待ジャンル不一致: ' + testCase.expectedGenre;
      }
    }
    if (/[\/\\:*?"<>|]/.test(fileName)) {
      result.ok = false;
      result.error = '禁止文字が残っています';
    }
    return result;
  });

  const summary = { cases: results, allOk: results.every(function (r) { return r.ok; }) };
  console.log('[drive] debugTestBuildProductPdfFileName_: ' + JSON.stringify(summary));
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}
