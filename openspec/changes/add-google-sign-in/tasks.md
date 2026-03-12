# Tasks: Implement Google Sign‑In (OAuth 2.0 + PKCE)

## 1. Project setup & prerequisites
- Create a Google Cloud project and OAuth 2.0 credentials (Web Application).
- Add redirect URIs for local and production:
  - https://server-mailengine.dev.localhost:7416//auth/google/callback
  - http://webfrontend-mailengine.dev.localhost:55459/auth/google/callback
- Obtain `ClientId` and `ClientSecret`.
- Enable Gmail API, Calendar API, People API (Contacts), and Drive API in Google Cloud.
- Document all required scopes and justification for Google OAuth verification.

---

## 2. Add change scaffold (already done)
- [x] Location: `openspec/changes/add-google-sign-in/`

---

## 3. Backend: configuration
- [x] Add `Google:ClientId`, `Google:ClientSecret`, `Google:RedirectUri` to `appsettings.Development.json`.
- [x] Add DI registration for:
  - `IGoogleAuthService`
  - `IGoogleTokenStore`
  - `IGoogleProviderAccountService`
- Add configuration for provider‑specific account roots:
  - `/accounts/gmail/{googleUserId}/`

---

## 4. Backend: implement Google auth endpoints
### Controllers
- Create `MailEngine.Server/Controllers/GoogleAuthController.cs` with:
  - `GET /auth/google/start` — generates PKCE, state, and redirect URL.
  - `GET /auth/google/callback` — validates state, exchanges code for tokens, creates provider account root, sets session cookie.
  - `POST /auth/logout` — clears session cookie.
  - `DELETE /auth/google/disconnect` — revokes tokens, deletes provider account root.

### Services
- Create `MailEngine.Server/Services/GoogleAuthService.cs`:
  - Generate PKCE code verifier + challenge.
  - Generate and validate `state` and `nonce`.
  - Exchange authorization code for access + refresh tokens.
  - Handle token refresh and silent rotation.
  - Detect revoked tokens and surface errors.

### Token Storage (critical)
- Create `MailEngine.Server/Services/GoogleTokenStore.cs`:
  - Store refresh tokens encrypted at rest (AES‑256 or platform‑native DPAPI).
  - Store access tokens in memory only.
  - Store tokens under provider account root:
    - `/accounts/gmail/{googleUserId}/tokens.json`
  - Implement token revocation and deletion.

### Provider Account Root
- Create provider account root on first login:
  - `/accounts/gmail/{googleUserId}/`
- Store:
  - tokens.json (encrypted)
  - sync metadata
  - raw MIME storage folder
  - provider config

---

## 5. Frontend: login page & routing
- Add `src/pages/LoginPage.tsx` styled with Material Design.
- Add Google Identity Services (GIS) button for “Sign in with Google”.
- Button triggers `GET /auth/google/start`.
- Add consent explanation listing requested Google permissions.
- Add `useAuthStore` or `useAuth` hook for:
  - session state
  - current provider accounts
  - login/logout/disconnect actions
- Update router:
  - Redirect unauthenticated users to `/login`.
  - Redirect authenticated users to `/inbox` or main app.

Status: [x] `src/pages/LoginPage.tsx` created
Status: [x] `src/store/useAuthStore.ts` created
Status: [x] Router updated to include `/login` and redirect unauthenticated users

---

## 6. Frontend: dependencies
- Add Material UI:
  - `@mui/material`
  - `@emotion/react`
  - `@emotion/styled`
- Add GIS script loader if needed.

---

## 7. Demo endpoint
### Backend
- Add `GET /api/google/demo/labels`:
  - Uses stored tokens to call Gmail API.
  - Returns list of labels for authenticated account.

### Frontend
- Add demo UI to fetch and display Gmail labels after login.

---

## 8. Multi‑Account Support
- Backend:
  - Support multiple Gmail accounts per user.
  - Each account gets its own provider root and token set.
- Frontend:
  - Add “Add another Gmail account” button (can be hidden for MVP).
  - Add account switcher UI (optional for MVP).
- Ensure session cookie identifies the active provider account.

---

## 9. Redirect URI strategy
- Add all local and production redirect URIs to Google Cloud.
- Add future desktop URI placeholder:
  - `mailengine://auth/google/callback` (reserved)

---

## 10. Error handling & UX
- Add UI states for:
  - User denies consent
  - Invalid/expired authorization code
  - Token exchange failure
  - Token refresh failure
  - Token revoked
  - Provider unavailable
  - Account already connected
- Add retry and recovery flows.

---

## 11. Logout & Disconnect
### Logout
- Clear session cookie only.

### Disconnect
- Revoke refresh token via Google API.
- Delete encrypted token file.
- Delete provider account root.
- Remove account from UI.

---

## 12. Documentation & README
- Document:
  - How to create Google OAuth credentials.
  - Required scopes and justification.
  - How to configure redirect URIs.
  - How to add credentials to `appsettings.Development.json`.
  - How to run the dev server and test the sign‑in flow.
  - How multi‑account support works.

---

## 13. Testing
### Manual tests
- Start server → visit app → redirect to `/login`.
- Complete Google consent → return authenticated.
- Verify session cookie is HTTP‑only and SameSite=Strict.
- Call demo endpoint and confirm Gmail labels load.
- Test disconnect and token revocation.

### Automated tests
- Add integration tests (Playwright):
  - Login redirect
  - Callback handling
  - Session cookie behavior
  - Token refresh logic
- Add unit tests for:
  - PKCE generation
  - State/nonce validation
  - Token storage encryption
  - Token refresh and revocation

---

## 14. Security review
- Ensure:
  - No tokens are ever exposed to the frontend.
  - Access tokens are memory‑only.
  - Refresh tokens are encrypted at rest.
  - PKCE is used for every auth request.
  - State and nonce are validated.
  - Session cookie is:
    - HTTP‑only
    - SameSite=Strict
    - Secure in production
- Add threat model notes for:
  - Token theft
  - Replay attacks
  - CSRF
  - Provider impersonation

---

## Estimated effort
2–3 developer days depending on token storage, multi‑account support, and provider abstraction work.

---

## Files to create (summary)
- openspec/changes/add-google-sign-in/{proposal.md,design.md,tasks.md}
- src/pages/LoginPage.tsx
- src/store/useAuthStore.ts (or hook)
- MailEngine.Server/Controllers/GoogleAuthController.cs
- MailEngine.Server/Services/GoogleAuthService.cs
- MailEngine.Server/Services/GoogleTokenStore.cs
- MailEngine.Server/Services/GoogleProviderAccountService.cs
- appsettings.Development.json (update)

---

## Run
Use `/opsx:apply` to begin implementing these tasks.
