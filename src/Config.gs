/**
 * Central config access. All secrets live in Script Properties
 * (Project Settings > Script Properties in the Apps Script editor),
 * never hardcoded here.
 *
 * Required properties:
 *   WHATSAPP_TOKEN          - permanent access token from Meta app
 *   WHATSAPP_PHONE_ID       - the Cloud API "Phone number ID"
 *   VERIFY_TOKEN            - any string you choose, must match Meta webhook setup
 *   OWNER_WAIDS             - your WhatsApp number(s) in international format, no plus,
 *                             comma-separated for more than one, e.g. 60123456789,60129876543
 *   DOCS_FOLDER_ID          - Google Drive folder ID containing customer documents
 */
function getConfig_() {
  const p = PropertiesService.getScriptProperties();
  const rawOwnerIds = p.getProperty('OWNER_WAIDS') || '';
  return {
    token: p.getProperty('WHATSAPP_TOKEN'),
    phoneId: p.getProperty('WHATSAPP_PHONE_ID'),
    verifyToken: p.getProperty('VERIFY_TOKEN'),
    ownerWaIds: rawOwnerIds.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
    docsFolderId: p.getProperty('DOCS_FOLDER_ID')
  };
}
