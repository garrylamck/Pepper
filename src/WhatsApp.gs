/**
 * Thin wrapper around the WhatsApp Cloud API (official, 1:1 only).
 */

function sendWhatsAppText_(toWaId, body) {
  const cfg = getConfig_();
  const url = 'https://graph.facebook.com/v20.0/' + cfg.phoneId + '/messages';
  const payload = {
    messaging_product: 'whatsapp',
    to: toWaId,
    type: 'text',
    text: { body: body }
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  const resp = UrlFetchApp.fetch(url, options);
  if (resp.getResponseCode() >= 300) {
    console.error('WhatsApp send failed: ' + resp.getContentText());
  }
  return resp;
}

function sendWhatsAppDocument_(toWaId, blob, filename, caption) {
  const cfg = getConfig_();
  // Upload the media first.
  const uploadUrl = 'https://graph.facebook.com/v20.0/' + cfg.phoneId + '/media';
  const uploadResp = UrlFetchApp.fetch(uploadUrl, {
    method: 'post',
    headers: { Authorization: 'Bearer ' + cfg.token },
    payload: {
      messaging_product: 'whatsapp',
      file: blob
    },
    muteHttpExceptions: true
  });
  const uploadJson = JSON.parse(uploadResp.getContentText());
  if (!uploadJson.id) {
    console.error('WhatsApp media upload failed: ' + uploadResp.getContentText());
    sendWhatsAppText_(toWaId, 'Sorry, I found the file but failed to upload it to WhatsApp. Please check the Drive folder manually.');
    return;
  }

  const sendUrl = 'https://graph.facebook.com/v20.0/' + cfg.phoneId + '/messages';
  const payload = {
    messaging_product: 'whatsapp',
    to: toWaId,
    type: 'document',
    document: {
      id: uploadJson.id,
      filename: filename,
      caption: caption || ''
    }
  };
  UrlFetchApp.fetch(sendUrl, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
