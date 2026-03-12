# Proposal: Add Google Sign‑In (OAuth 2.0 + PKCE) to MailEngine

## Change Name
add-google-sign-in

## Summary (What)
Add a Google Sign‑In flow to the MailEngine frontend and backend so users can authenticate with Google and grant the application access to Gmail, Calendar, Contacts, and Drive. This includes a new `/login` page, a secure OAuth 2.0 Authorization Code + PKCE backend, encrypted token storage, and provider‑specific account roots.

## Why
- Enables real Gmail integration for MailEngine’s local‑first sync engine.
- Allows users to grant required Google scopes once, enabling background sync of email, calendar events, contacts, and Drive files.
- Establishes the Gmail provider as the first OAuth‑based provider in the provider‑agnostic architecture.
- Required before implementing Gmail read/write, calendar sync, contact sync, and Drive‑based attachment workflows.

---

# Scope

## Frontend
- New `/login` page using Google Material Design principles.
- “Sign in with Google” button implemented using Google Identity Services (GIS).
- Support for future provider expansion (e.g., Outlook, IMAP) even if hidden for now.
- Redirect unauthenticated users to `/login`.
- Display clear privacy/consent text explaining why each scope is requested.

## Backend
- Implement OAuth 2.0 Authorization Code Flow with PKCE.
- Endpoints:
  - `GET /auth/google/start`
  - `GET /auth/google/callback`
  - `POST /auth/logout`
  - `DELETE /auth/google/disconnect`
- Validate `state` and `nonce` for CSRF protection.
- Exchange authorization code for access + refresh tokens.
- Store tokens securely (see Token Storage section).
- Implement token refresh logic and automatic rotation handling.
- Detect revoked tokens and surface errors to the UI.
- Expose a minimal, HTTP‑only, SameSite=Strict session cookie to the frontend.

## Provider Abstraction
- Google Sign‑In is implemented under the **Gmail provider**.
- Each authenticated Google account becomes a **provider account root**:
  - `/accounts/{provider}/{accountId}/`
- Tokens, sync metadata, and raw MIME storage live under this root.
- Design supports multiple Gmail accounts and future providers.

---

# Scopes (Requested)
These are full‑access scopes required for a complete email client:

- Gmail Full Access — `https://mail.google.com/`
- Calendar Full Access — `https://www.googleapis.com/auth/calendar`
- Contacts Full Access — `https://www.googleapis.com/auth/contacts`
- Drive Full Access — `https://www.googleapis.com/auth/drive`

## Scope Justification
- **Gmail Full Access** is required for reading, writing, deleting, labeling, and syncing raw MIME messages.
- **Calendar Full Access** is required for two‑way event sync.
- **Contacts Full Access** is required for contact sync and auto‑complete.
- **Drive Full Access** is required for attachments stored in Drive and for future file‑based workflows.

## Google Verification Notes
- These scopes require Google OAuth verification.
- The login page must clearly explain why each scope is needed.
- A fallback plan may be required (e.g., read‑only scopes) if verification is delayed.

---

# Token Storage & Security

## Storage Model
- Tokens stored under each provider account root:
  - `/accounts/gmail/{googleUserId}/tokens.json`
- Refresh tokens encrypted at rest using AES‑256 or platform‑native encryption.
- Access tokens stored only in memory; never written to disk.
- No tokens ever exposed to the browser.

## Token Lifecycle
- Automatic refresh using Google’s token endpoint.
- Handle Google’s silent refresh token rotation.
- Detect revoked tokens and notify the user.
- Support manual disconnect (revoking tokens via Google API).

---

# Multi‑Account Support
- Users may add multiple Gmail accounts.
- Each account has its own:
  - Token set
  - Sync state
  - Local storage root
- UI should support “Add another Gmail account” (even if hidden initially).
- Logout does not delete accounts; disconnect does.

---

# Redirect URI Strategy
- Local development:
  - `http://localhost:3000/auth/google/callback`
  - `http://localhost:5173/auth/google/callback`
- Production:
  - `https://app.mailengine.dev/auth/google/callback`
- Future desktop app:
  - `mailengine://auth/google/callback` (reserved for later)

---

# Error Handling & UX States
The login flow must handle:

- User denies consent
- Invalid or expired authorization code
- Token exchange failure
- Token refresh failure
- Token revoked by user
- Provider unavailable
- Network errors
- Account already connected

Each state should have a clear UI message and retry option.

---

# Logout & Disconnect Behavior

## Logout
- Clears session cookie only.
- Does NOT delete tokens or disconnect the Gmail account.

## Disconnect
- Deletes encrypted tokens from storage.
- Revokes refresh token via Google’s revocation endpoint.
- Removes the provider account root.
- UI confirms the account has been removed.

---

# Acceptance Criteria
- Unauthenticated users are redirected to `/login`.
- `/login` displays a Material Design page with a GIS “Sign in with Google” button.
- OAuth flow completes successfully using Authorization Code + PKCE.
- Backend securely stores encrypted refresh tokens and manages access tokens in memory.
- Session cookie is HTTP‑only, SameSite=Strict, and contains no sensitive data.
- User can add at least one Gmail account.
- A test API call (e.g., list Gmail labels) succeeds using the stored token.
- Disconnecting an account revokes tokens and removes local data.
- All error states are handled gracefully.

---

# Risks & Notes
- Requires a Google Cloud project and OAuth client credentials.
- Full‑access scopes may trigger Google verification requirements.
- Token storage must be encrypted and isolated per account.
- If persistent storage is not ready, use secure in‑memory storage for demo only.
- Must document privacy and data usage clearly.

---

# Testing Requirements
- Unit tests for OAuth endpoints.
- Integration tests for token exchange and refresh.
- Tests for revoked tokens and error handling.
- Manual tests for full sign‑in flow.
- Tests for multi‑account behavior.
- Tests for disconnect and token revocation.

---

# Next Steps
- Implement the design in frontend and backend.
- Add provider‑specific Gmail sync tasks after authentication is stable.
- Run integration tests and manual validation of the full sign‑in flow.
