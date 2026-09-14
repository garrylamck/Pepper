/**
 * Central config access. All secrets live in Script Properties
 * (Project Settings > Script Properties in the Apps Script editor),
 * never hardcoded here.
 *
 * Required properties:
 *   WHATSAPP_TOKEN          - permanent access token from Meta app
 *   WHATSAPP_PHONE_ID       - the Cloud API "Phone number ID"
 *   VERIFY_TOKEN            - any string you choose, must match Meta webhook setup
 *   OWNER_WAID               - your WhatsApp number in international format, no plus, e.g. 60123456789
 *   DOCS_FOLDER_ID           - Google Drive folder ID containing customer documents
 */
function getConfig_() {
  const p = PropertiesService.getScriptProperties();
  return {
    token: p.getProperty('WHATSAPP_TOKEN'),
    phoneId: p.getProperty('WHATSAPP_PHONE_ID'),
    verifyToken: p.getProperty('VERIFY_TOKEN'),
    ownerWaId: p.getProperty('OWNER_WAID'),
    docsFolderId: p.getProperty('DOCS_FOLDER_ID')
  };
}
