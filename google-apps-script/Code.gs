/**
 * Ауыл дәмі — тапсырысты WhatsApp-қа жіберетін көпір (Google Apps Script → Green API).
 * Green API кілттері осында, Script Properties ішінде сақталады — сайттың кодында көрінбейді.
 *
 * Script Properties (Project Settings → Script Properties):
 *   GREEN_API_URL   мысалы: https://7105.api.greenapi.com   (Green API консолінде "apiUrl")
 *   GREEN_ID        мысалы: 7105123456                      ("idInstance")
 *   GREEN_TOKEN     ұзын кілт                                ("apiTokenInstance")
 *   ORDER_PHONE     77751255073                             (тапсырыс келетін нөмір, + белгісіз)
 */

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var text = String(body.text || '');

    // Қарапайым қорғаныс: тек біздің сайттан келген тапсырыс мәтіні
    if (text.indexOf('ЖАҢА ТАПСЫРЫС') === -1 || text.length < 30 || text.length > 4000) {
      return json({ ok: false, error: 'bad_request' });
    }

    // Спамнан қорғау: минутына 5 тапсырыстан артық емес
    var cache = CacheService.getScriptCache();
    var n = Number(cache.get('rate') || 0);
    if (n >= 5) return json({ ok: false, error: 'rate_limited' });
    cache.put('rate', String(n + 1), 60);

    var p = PropertiesService.getScriptProperties();
    var url = p.getProperty('GREEN_API_URL').replace(/\/+$/, '') +
      '/waInstance' + p.getProperty('GREEN_ID') +
      '/sendMessage/' + p.getProperty('GREEN_TOKEN');

    var res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chatId: p.getProperty('ORDER_PHONE') + '@c.us', message: text }),
      muteHttpExceptions: true
    });

    var code = res.getResponseCode();
    return json({ ok: code >= 200 && code < 300, status: code });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Браузерден ашып тексеру үшін: .../exec сілтемесін ашсаңыз "ok" көрінеді
function doGet() {
  return json({ ok: true, service: 'auyl-dami-orders' });
}

// Редактордан бір рет іске қосып, WhatsApp-қа тест хабар келетінін тексеріңіз
function testSend() {
  var r = doPost({ postData: { contents: JSON.stringify({ text: '🛒 *ЖАҢА ТАПСЫРЫС*\n\nТест хабарлама — сайт байланысы жұмыс істеп тұр ✅' }) } });
  Logger.log(r.getContent());
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
