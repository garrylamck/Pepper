# Pepper

A personal WhatsApp assistant for Garry Lam, built to reduce the admin load
running Supreme Gear Sdn Bhd (and eventually the other Supreme Gear group
companies).

## Phase 1 (this build)

- Runs as a Google Apps Script web app (no separate server/hosting needed —
  uses your existing Google Workspace).
- Connects to the **WhatsApp Cloud API** (Meta's official API) for reliable,
  ToS-safe 1:1 messaging between you and Pepper.
- Only responds to your WhatsApp number — everyone else is ignored.
- Commands supported:
  - `find <name/plate/doc type>` — searches your Drive documents folder and
    sends back any matching files (cover note, policy, VOC, AP, etc).
  - `help` — shows what Pepper can do.

**Not included yet** (by design, see conversation): reading group chats for
booking detection. WhatsApp's official API cannot read group messages at
all — that requires an unofficial, ToS-violating library and real risk of a
number ban. It's deliberately deferred to a later phase, on a separate
disposable number, once you're ready to accept that tradeoff.

## Roadmap

1. ~~Foundation: WhatsApp Cloud API + Apps Script webhook, document retrieval~~ (this phase)
2. Morning briefing — Pepper proactively messages you each morning with a summary
3. Insurance renewal tracking — reads a renewal tracker sheet, pings you before due dates
4. Stock list logging — via a dedicated, disposable number added to sales group chats

## Setup

See [SETUP.md](./SETUP.md) for the full step-by-step guide (Meta Developer
app, WhatsApp number registration, Apps Script deployment).

## Project structure

```
src/
  appsscript.json   Apps Script manifest
  Code.gs           Webhook entry points (doGet/doPost) + command handling
  Config.gs         Reads secrets from Script Properties
  WhatsApp.gs       Send text/document via WhatsApp Cloud API
  DocSearch.gs      Searches the Drive documents folder
```
