/**
 * Gemini API 通信（FR-PDF-002 / NFR-OPS-002）。
 *
 * PDF を inlineData で渡し、商品情報 JSON を取得する。
 */
/** @see doc/specs/03_システム設計.md */
const GEMINI_MODEL = 'gemini-2.5-flash';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

/** 429/500 系の再試行回数（初回以外） */
const GEMINI_MAX_RETRIES = 3;

/** リトライ待機（固定秒数。指数バックオフは将来改善） */
const GEMINI_RETRY_DELAY_MS = 2000;

/** 抽出の揺れを抑えるため低温度 */
const GEMINI_TEMPERATURE = 0.1;

/** エラーレスポンス本文のログ上限（秘密情報混入を避けつつ要点のみ） */
const GEMINI_ERROR_BODY_MAX_LEN = 200;

/**
 * 商品 PDF から構造化 JSON を抽出する。
 * @param {GoogleAppsScript.Drive.File} file
 * @returns {Object}
 */
function extractProductFromPdf_(file) {
  if (!file) {
    throw new Error('PDF ファイルが指定されていません');
  }
  return extractProductFromPdfBlob_(file.getBlob());
}

/**
 * PDF Blob から商品情報 JSON を抽出する。
 * @param {GoogleAppsScript.Base.Blob} pdfBlob
 * @returns {Object} schema 準拠の Gemini フィールド
 */
function extractProductFromPdfBlob_(pdfBlob) {
  if (!pdfBlob) {
    throw new Error('PDF Blob が指定されていません');
  }
  const mimeType = pdfBlob.getContentType();
  if (mimeType !== 'application/pdf') {
    throw new Error('PDF 以外の Blob です: ' + mimeType);
  }
  const apiKey = getScriptProperty_(CONFIG_KEYS.GEMINI_API_KEY);
  const prompt = buildGeminiPrompt_();
  const payload = buildGeminiRequestPayload_(pdfBlob, prompt);
  const responseText = callGeminiGenerateContentWithRetry_(apiKey, payload);
  return parseGeminiJsonResponse_(responseText);
}

/**
 * 商品ラベル・食品表示向けの抽出プロンプトを組み立てる。
 * @returns {string}
 */
function buildGeminiPrompt_() {
  const keys = getGeminiFieldKeys_();
  const schemaExample = buildEmptyGeminiRecord_();
  const genreListText = formatProductGenreListForPrompt_();
  return (
    'あなたは商品ラベル OCR 抽出アシスタントです。添付 PDF は商品ラベル、商品仕様書、食品表示、栄養成分表示を含む文書です。\n' +
    '読み取れる情報だけを次の JSON キーに埋めてください。読み取れない項目は空文字 "" にしてください。\n' +
    'PDF は表面・裏面が同一ファイルに含まれることがあります。全ページを確認してください。\n' +
    '期限日（expiration_date）:\n' +
    '- 表面の「賞味期限」「消費期限」表記を優先する。\n' +
    '- 裏面・側面の刻印（例: 28.08/+DFL/B）も期限候補とする。スラッシュ・プラス以降（DFL/B 等）は工場・ロットコードで期限日ではない。\n' +
    '- 日本の商品では DD.MM（欧州式日.月）ではなく、YY.MM または yyyymmdd / yymmdd が多い。\n' +
    '- 「28.08」や「28.08/+DFL/B」の「28.08」は YY.MM（2028年8月）と解釈し、expiration_date はその月の末日 YYYY-MM-DD（例: 2028-08-31）で返す。\n' +
    '- 確信が低い場合は expiration_date を空にし、刻印の原文を confidence_notes に残す。\n' +
    '栄養成分は基準量と単位を失わないようにしてください。\n' +
    'genre は次の一覧から最も適切な 1 件だけを選び、一覧外の自由記述は禁止です: ' +
    genreListText +
    '\n' +
    '複数商品が見える場合は主対象 1 件のみ返し、confidence_notes に複数商品の可能性を記録してください。\n' +
    '説明文・Markdown・コードブロックは出力しないでください。JSON オブジェクトのみを返してください。\n\n' +
    'キー一覧: ' +
    keys.join(', ') +
    '\n\n' +
    '出力形式の例:\n' +
    JSON.stringify(schemaExample, null, 2)
  );
}

/**
 * Gemini generateContent リクエスト JSON を組み立てる。
 *
 * Why responseMimeType: application/json — パース失敗を減らすため API 側で JSON 形式を指定。
 *
 * @param {GoogleAppsScript.Base.Blob} pdfBlob
 * @param {string} prompt
 * @returns {Object}
 */
function buildGeminiRequestPayload_(pdfBlob, prompt) {
  return {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: Utilities.base64Encode(pdfBlob.getBytes()),
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: GEMINI_TEMPERATURE,
    },
  };
}

/**
 * 429 / 500 系を最大 GEMINI_MAX_RETRIES 回まで再試行する。
 * @param {string} apiKey
 * @param {Object} payload
 * @returns {string}
 */
function callGeminiGenerateContentWithRetry_(apiKey, payload) {
  let lastStatus = 0;
  let lastError = '';
  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt++) {
    const result = callGeminiGenerateContentOnce_(apiKey, payload);
    if (result.ok) {
      if (attempt > 0) {
        console.log('[gemini] リトライ成功: ' + (attempt + 1) + ' 回目の試行');
      }
      return result.text;
    }
    lastStatus = result.status;
    lastError = result.error;
    if (isGeminiFatalAuthStatus_(result.status)) {
      throw new Error('Gemini API 認証エラー (HTTP 401): ' + result.error);
    }
    if (!isGeminiRetryableStatus_(result.status) || attempt >= GEMINI_MAX_RETRIES) {
      throw new Error('Gemini API エラー (HTTP ' + result.status + '): ' + result.error);
    }
    console.log(
      '[gemini] リトライ待機 ' +
        GEMINI_RETRY_DELAY_MS +
        'ms: HTTP ' +
        result.status +
        ' (' +
        (attempt + 1) +
        '/' +
        GEMINI_MAX_RETRIES +
        ')'
    );
    Utilities.sleep(GEMINI_RETRY_DELAY_MS);
  }
  throw new Error('Gemini API エラー (HTTP ' + lastStatus + '): ' + lastError);
}

/**
 * @param {string} apiKey
 * @param {Object} payload
 * @returns {{ ok: boolean, status: number, text?: string, error?: string }}
 */
function callGeminiGenerateContentOnce_(apiKey, payload) {
  const url =
    GEMINI_API_BASE + GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(apiKey);
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status !== 200) {
    return {
      ok: false,
      status: status,
      error: summarizeGeminiErrorBody_(body),
    };
  }
  const parsed = JSON.parse(body);
  const text = extractGeminiCandidateText_(parsed);
  if (!text) {
    return {
      ok: false,
      status: 502,
      error: 'Gemini API からテキスト応答がありません',
    };
  }
  return { ok: true, status: 200, text: text };
}

/**
 * @param {number} status
 * @returns {boolean}
 */
function isGeminiRetryableStatus_(status) {
  return status === 429 || status >= 500;
}

/**
 * @param {number} status
 * @returns {boolean}
 */
function isGeminiFatalAuthStatus_(status) {
  return status === 401;
}

/**
 * エラーメッセージが Gemini 401 認証失敗かどうか（バッチ中断判定用）。
 * @param {string} message
 * @returns {boolean}
 */
function isGeminiAuthErrorMessage_(message) {
  return String(message).indexOf('HTTP 401') !== -1 || String(message).indexOf('認証エラー') !== -1;
}

/**
 * @param {Object} apiResponse
 * @returns {string}
 */
function extractGeminiCandidateText_(apiResponse) {
  const candidates = apiResponse.candidates;
  if (!candidates || candidates.length === 0) {
    return '';
  }
  const parts = candidates[0].content && candidates[0].content.parts;
  if (!parts || parts.length === 0) {
    return '';
  }
  return parts
    .map(function (part) {
      return part.text || '';
    })
    .join('');
}

/**
 * エラーレスポンス本文を短く要約する（API キー等は含めない）。
 * @param {string} body
 * @returns {string}
 */
function summarizeGeminiErrorBody_(body) {
  try {
    const err = JSON.parse(body);
    const message = err.error && err.error.message ? err.error.message : body;
    return String(message).substring(0, GEMINI_ERROR_BODY_MAX_LEN);
  } catch (e) {
    return String(body).substring(0, GEMINI_ERROR_BODY_MAX_LEN);
  }
}

/**
 * Gemini 応答テキストを schema 準拠オブジェクトにパースする。
 * @param {string} text
 * @returns {Object}
 */
function parseGeminiJsonResponse_(text) {
  const cleaned = stripMarkdownCodeFence_(text.trim());
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Gemini 応答の JSON パースに失敗しました');
  }
  const record = buildEmptyGeminiRecord_();
  getGeminiFieldKeys_().forEach(function (key) {
    if (parsed[key] !== undefined && parsed[key] !== null) {
      record[key] = String(parsed[key]);
    }
  });
  if (record.genre) {
    record.genre = normalizeGenre_(record.genre);
  }
  applyExpirationDateNormalizationToRecord_(record);
  return record;
}

/**
 * モデルが ```json ... ``` で返した場合のフェンス除去。
 *
 * Why: responseMimeType 指定後も Markdown フェンス付きで返ることがあるため。
 *
 * @param {string} text
 * @returns {string}
 */
function stripMarkdownCodeFence_(text) {
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  if (fenced) {
    return fenced[1].trim();
  }
  return text;
}

/**
 * PoC デバッグ: Drive 上の PDF を Gemini で解析しログ出力（シート書込なし）。
 * @param {string} fileId Google ドライブの PDF ファイル ID
 * @returns {Object} 抽出 JSON
 */
function pocExtractFromPdfByFileId(fileId) {
  if (!fileId || !String(fileId).trim()) {
    throw new Error(
      'fileId を指定してください。\n' +
        'GAS エディタから実行する場合: debugPocExtractPdf（Script Property DEBUG_PDF_FILE_ID）または debugPocExtractFirstInputPdf を使ってください。\n' +
        'fileId の取得: Drive で PDF を開き URL の /d/ と /view の間の文字列'
    );
  }
  const file = DriveApp.getFileById(fileId);
  const record = extractProductFromPdf_(file);
  const summary = {
    source_file: file.getName(),
    product_name: record.product_name,
    genre: record.genre,
    maker: record.maker,
    jan_code: record.jan_code,
    expiration_type: record.expiration_type,
    expiration_date: record.expiration_date,
    confidence_notes: record.confidence_notes,
  };
  const message = '[gemini] 抽出完了: ' + JSON.stringify(summary);
  Logger.log(message);
  console.log(message);
  return record;
}

/**
 * GAS エディタ用: Script Property DEBUG_PDF_FILE_ID の PDF を Gemini 抽出のみ実行する。
 * fileId は Drive URL の https://drive.google.com/file/d/【ここ】/view から取得。
 *
 * @returns {Object}
 */
function debugPocExtractPdf() {
  return pocExtractFromPdfByFileId(getDebugPdfFileIdOrThrow_());
}

/**
 * GAS エディタ用: インプットフォルダ内の先頭 PDF を Gemini 抽出のみ実行する。
 * 要 Script Property: DRIVE_INPUT_FOLDER_ID
 *
 * @returns {Object}
 */
function debugPocExtractFirstInputPdf() {
  const files = listInputFolderPdfFiles_();
  if (files.length === 0) {
    throw new Error(
      'インプットフォルダに PDF がありません。DRIVE_INPUT_FOLDER_ID とフォルダ内の PDF を確認してください'
    );
  }
  const file = files[0];
  console.log('[gemini] 先頭 PDF を抽出: ' + file.getName() + ' id=' + file.getId());
  return pocExtractFromPdfByFileId(file.getId());
}

/**
 * デバッグ: リトライ設定をログ出力する。
 * @returns {{ maxRetries: number, delayMs: number, model: string, temperature: number }}
 */
function debugLogGeminiRetryConfig() {
  const config = {
    maxRetries: GEMINI_MAX_RETRIES,
    delayMs: GEMINI_RETRY_DELAY_MS,
    model: GEMINI_MODEL,
    temperature: GEMINI_TEMPERATURE,
  };
  console.log('[gemini] リトライ設定: ' + JSON.stringify(config));
  return config;
}
