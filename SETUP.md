# Pepper setup guide (Phase 1)

Two parts: (A) register the WhatsApp number with Meta, (B) deploy the Apps
Script code and connect it to your Drive documents folder.

## A. WhatsApp Cloud API setup (Meta side)

Use the **WhatsApp Business number** you mentioned — not your personal
number, and not a number still logged into the regular WhatsApp Business
app on a phone (a number can only be active in one place at a time; you'll
need to remove it from the phone app during registration).

1. Go to [developers.facebook.com](https://developers.facebook.com) and log
   in with one of your Facebook accounts (e.g. the "Garry Lam" main account
   or "Supreme Gear" page account — either works, just stay consistent).
2. Create a new App → type **Business**.
3. In the app dashboard, add the **WhatsApp** product.
4. Under WhatsApp → API Setup:
   - You'll see a **test number** provided by Meta — you can use this to
     test end-to-end before adding your real number.
   - To use your real Supreme Gear WhatsApp Business number: click
     **Add phone number**, follow the verification (SMS/call OTP).
   - Note down the **Phone number ID** shown here — you'll need it later.
5. Generate a **permanent access token**:
   - Business Settings → System Users → create a system user (e.g.
     "pepper-bot") → assign it to your app with `whatsapp_business_messaging`
     permission → generate a token with no expiry.
   - Save this token somewhere safe (password manager) — you'll paste it
     into Apps Script Script Properties, never into code.
6. Leave this tab open — you'll come back to enter the **Webhook URL** and
   **Verify token** once the Apps Script part (B) is deployed.

## B. Apps Script deployment (Google Workspace side)

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Rename the project to "Pepper".
3. Replace the default `Code.gs` and add the other files, copying content
   from this repo's `src/` folder:
   - `Code.gs`
   - `Config.gs`
   - `WhatsApp.gs`
   - `DocSearch.gs`
4. Open **Project Settings** (gear icon) → check "Show appsscript.json" →
   replace its contents with `src/appsscript.json` from this repo.
5. Still in Project Settings, scroll to **Script Properties** → add these:

   | Property | Value |
   |---|---|
   | `WHATSAPP_TOKEN` | the permanent access token from step A.5 |
   | `WHATSAPP_PHONE_ID` | the Phone number ID from step A.4 |
   | `VERIFY_TOKEN` | make up any string, e.g. `pepper-verify-2026` — just remember it |
   | `OWNER_WAID` | your WhatsApp number in international format, digits only, e.g. `60123456789` (no `+`, no spaces) |
   | `DOCS_FOLDER_ID` | the Google Drive folder ID containing customer documents (from the folder's URL: `drive.google.com/drive/folders/<THIS PART>`) |

6. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (this is required for Meta to reach it —
     the webhook is protected by the `VERIFY_TOKEN` check and the
     owner-number allowlist in the code, not by Apps Script access
     control)
   - Deploy, and copy the **Web app URL** it gives you.

## C. Connect the two

1. Back in the Meta app dashboard (WhatsApp → Configuration):
   - **Callback URL**: paste the Apps Script Web app URL from B.6.
   - **Verify token**: paste the same `VERIFY_TOKEN` value you set in B.5.
   - Click **Verify and save** — if it fails, double check the verify token
     matches exactly and that the deployment access is set to "Anyone".
2. Under **Webhook fields**, subscribe to `messages`.
3. Send a WhatsApp message from your phone (the `OWNER_WAID` number) to the
   business number. You should get a reply within a few seconds. Try
   `help` first, then `find <something in your docs folder>`.

## Troubleshooting

- **No reply at all**: check Apps Script → Executions (left sidebar) for
  errors. Most common cause is a Script Property typo or the Drive folder
  ID being wrong.
- **"Forbidden" on webhook verification**: `VERIFY_TOKEN` in Script
  Properties doesn't match what you typed into Meta.
- **Messages send but "find" never matches**: confirm `DOCS_FOLDER_ID`
  points to the right folder, and that file names actually contain the
  words you're searching (search is a simple substring match on the file
  name, not file contents).
