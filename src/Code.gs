/**
 * Pepper - personal WhatsApp assistant for Garry Lam / Supreme Gear Sdn Bhd.
 * Phase 1: 1:1 chat only (official WhatsApp Cloud API), document retrieval
 * from Drive, and a basic help/status reply. No group-chat reading yet.
 */

// Pings the script's own config on a timer so the Apps Script container
// stays warm, reducing cold-start latency on the next real request
// (Meta's webhook verification is a single attempt with no retry, so a
// slow cold start can make it fail outright).
function keepWarm() {
  getConfig_();
}

// Meta calls this once, on webhook setup, to verify you own the endpoint.
function doGet(e) {
  const cfg = getConfig_();
  const mode = e.parameter['hub.mode'];
  const token = e.parameter['hub.verify_token'];
  const challenge = e.parameter['hub.challenge'];

  if (mode === 'subscribe' && token === cfg.verifyToken) {
    return ContentService.createTextOutput(challenge);
  }
  return ContentService.createTextOutput('Forbidden').setMimeType(ContentService.MimeType.TEXT);
}

// Meta POSTs every inbound message/event here.
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const cfg = getConfig_();

    const entry = body.entry && body.entry[0];
    const change = entry && entry.changes && entry.changes[0];
    const value = change && change.value;
    const message = value && value.messages && value.messages[0];

    if (!message) {
      // Status callbacks (sent/delivered/read) land here too; ignore them.
      return ContentService.createTextOutput('ok');
    }

    const fromWaId = message.from;

    // Only ever respond to allowlisted owner numbers. Anyone else is ignored.
    if (cfg.ownerWaIds.indexOf(fromWaId) === -1) {
      return ContentService.createTextOutput('ok');
    }

    const text = message.text && message.text.body ? message.text.body.trim() : '';
    handleOwnerMessage_(fromWaId, text);
  } catch (err) {
    console.error('doPost error: ' + err);
  }
  return ContentService.createTextOutput('ok');
}

function handleOwnerMessage_(fromWaId, text) {
  if (!text) {
    sendWhatsAppText_(fromWaId, "I can only read text messages for now.");
    return;
  }

  const lower = text.toLowerCase();

  if (lower === 'help' || lower === 'menu') {
    sendWhatsAppText_(fromWaId,
      "Hi Garry, I'm Pepper. Here's what I can do right now:\n\n" +
      "• \"find <name/plate/doc type>\" - I'll search your documents folder and send matching files.\n" +
      "   e.g. \"find cover note ABC1234\" or \"find VOC Ali Bin Ahmad\"\n" +
      "• \"help\" - show this menu\n\n" +
      "More coming soon: morning briefing, insurance renewal alerts, stock list logging.");
    return;
  }

  if (lower.indexOf('find ') === 0) {
    const query = text.substring(5).trim();
    handleDocumentRequest_(fromWaId, query);
    return;
  }

  sendWhatsAppText_(fromWaId,
    "Not sure what you mean. Send \"help\" to see what I can do, or \"find <name/plate>\" to get a document.");
}

function handleDocumentRequest_(fromWaId, query) {
  if (!query) {
    sendWhatsAppText_(fromWaId, "Tell me what to look for, e.g. \"find cover note ABC1234\".");
    return;
  }

  const matches = findDocuments_(query);

  if (matches.length === 0) {
    sendWhatsAppText_(fromWaId, "Couldn't find anything matching \"" + query + "\" in the documents folder. Try fewer or different keywords.");
    return;
  }

  if (matches.length > 5) {
    sendWhatsAppText_(fromWaId, "Found " + matches.length + " matches for \"" + query + "\" - too many to send. Try being more specific.");
    return;
  }

  sendWhatsAppText_(fromWaId, "Found " + matches.length + " match(es) for \"" + query + "\", sending now…");
  matches.forEach(function (file) {
    sendWhatsAppDocument_(fromWaId, file.getBlob(), file.getName(), '');
  });
}
