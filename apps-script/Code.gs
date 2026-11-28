/**
 * HPC Symposium · bets backend.
 * Paste into the Google Sheet's Extensions → Apps Script, then Deploy → New deployment →
 * Web app (Execute as: Me, Who has access: Anyone). Put the /exec URL in src/data/bets.ts.
 *
 * Sheet layout (tab "Bets", created automatically):
 *   Timestamp | Name | I | II | III | IV | V
 */
const TAB = 'Bets';
const NAME_MAX = 60;
const ANSWER_MAX = 200;

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB);
  if (!sh) {
    sh = ss.insertSheet(TAB);
    sh.appendRow(['Timestamp', 'Name', 'I', 'II', 'III', 'IV', 'V']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Stop text like "=IMPORTXML(...)" being run as a formula. */
function clean_(s, max) {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doGet() {
  const rows = sheet_().getDataRange().getDisplayValues().slice(1);
  const bets = rows
    .filter(function (r) { return r[1]; })
    .map(function (r) {
      return {
        time: r[0],
        name: r[1].replace(/^'/, ''),
        answers: r.slice(2, 7).map(function (a) { return a.replace(/^'/, ''); }),
      };
    });
  return json_({ bets: bets });
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const name = clean_(d.name, NAME_MAX);
    const answers = (Array.isArray(d.answers) ? d.answers : []).slice(0, 5).map(function (a) { return clean_(a, ANSWER_MAX); });
    while (answers.length < 5) answers.push('');
    if (!name) return json_({ ok: false, error: 'Please add your name.' });
    if (!answers.some(function (a) { return a; })) return json_({ ok: false, error: 'Place at least one bet.' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_().appendRow([new Date()].concat([name], answers));
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'Could not save the bet.' });
  }
}
