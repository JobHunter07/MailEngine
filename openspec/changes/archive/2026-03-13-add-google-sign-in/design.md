<!-- ARCHIVE NOTE: Preserving original design content (unaltered) for historical reference. -->

# Design: Add Google Sign‑In (OAuth 2.0 + PKCE)

Goal
----
Add a secure Google OAuth2 Authorization Code + PKCE flow for MailEngine that:

- Uses PKCE + state to protect the auth request
- Keeps access tokens memory‑only and stores refresh tokens encrypted at rest under provider account roots
- Creates a provider account root per Google account (`/accounts/gmail/{googleUserId}/`)
- Exposes minimal, HTTP‑only session cookie to the frontend

Sequence (high level)
---------------------

```mermaid
sequenceDiagram
	participant FE as Frontend
	participant BE as Backend
	participant Google as Google OAuth
	participant Store as TokenStore

	FE->>BE: GET /auth/google/start
	BE->>BE: generate PKCE (verifier+challenge), state, nonce
	BE->>Google: redirect user to Google with code_challenge & state
	Google->>FE: redirect to /auth/google/callback?code=...&state=...
	FE->>BE: GET /auth/google/callback?code&state
	BE->>Google: POST /oauth2/v4/token (code, code_verifier)
	Google-->>BE: access_token, refresh_token, id_token
	BE->>Store: encrypt refresh_token -> /accounts/gmail/{id}/tokens.json
	BE->>FE: set HTTP‑only session cookie; redirect to app

	Note over BE,Store: Access tokens kept in memory; refresh tokens encrypted at rest
```

Components
----------

- `GoogleAuthController` — endpoints for `/start`, `/callback`, `/logout`, `/disconnect`.
- `GoogleAuthService` — PKCE generation, state/nonce validation, token exchange, refresh handling.
- `GoogleTokenStore` — encrypt/decrypt refresh tokens at rest; expose refresh token retrieval to `GoogleAuthService`.
- `GoogleProviderAccountService` — manage provider account roots and metadata under `/accounts/gmail/{googleUserId}/`.
- Frontend `LoginPage` + `useAuthStore` — present GIS button, call `/auth/google/start`, and handle return flow.

Token storage and lifecycle
-------------------------

- Refresh tokens: encrypted with AES‑256 (or DPAPI on Windows) and stored at `data/accounts/gmail/{googleUserId}/tokens.json`.
- Access tokens: only kept in memory by the running backend process; never written to disk or returned to the browser.
- Refresh flow: `GoogleAuthService` uses the stored refresh token to get new access tokens and updates rotation metadata; revoked or expired refresh tokens surface an error to the UI and require a reconnect.

Security considerations
-----------------------

- Always validate `state` on callback to mitigate CSRF.
- Use `nonce` and validate `id_token` where applicable to prevent replay attacks.
- Session cookie: HTTP‑only, SameSite=Strict, Secure in production.
- Ensure refresh tokens are encrypted at rest; apply least privilege to data folders.
- Avoid exposing tokens or secrets to the frontend; Keycloak/IDP delegation is recommended for production.

Diagram & artifacts
-------------------

The sequence diagram above reproduces the original design flow. Keep this file unchanged for historical reference.
