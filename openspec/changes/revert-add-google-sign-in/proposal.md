# Proposal: Revert Google Sign‑In changes (use Keycloak instead)

What: Revert the code and configuration added for direct Google OAuth sign‑in and remove any related provider account artifacts created yesterday. Replace the plan to implement direct Google OAuth with an approach that delegates authentication and provider federation to Keycloak.

Why: Keycloak is a mature, open‑source identity provider with community and security review, built‑in support for OAuth2/OIDC, social identity federation (including Google), token management, user/session management, and enterprise features (SSO, roles, policies). Implementing and operating custom OAuth/token storage is high risk: it increases attack surface, requires careful secure storage, rotation, revocation, and ongoing maintenance. Using Keycloak avoids "home‑brewing" security and leverages a vetted, community‑maintained solution.

Scope (this change):
- Remove files and code added for the direct Google sign‑in flow (frontend and backend).
- Remove DI registrations, controllers, services, and token storage introduced for Google OAuth.
- Remove `Google:*` entries from `appsettings.Development.json` and any related config changes.
- Update documentation noting that Keycloak will be used and why.

Outcome: The repository will no longer contain the provisional Google sign‑in implementation. A follow‑up change will add Keycloak integration (federating Google via Keycloak) and corresponding implementation artifacts.

Security rationale (short):
- Do not implement custom auth/token persistence logic unless unavoidable.
- Prefer well‑reviewed identity systems (Keycloak, Auth0, etc.) for authentication and federation.
- Keycloak reduces risk by centralizing auth, providing tested token handling, secure defaults, and infrastructure for rotation/revocation.

References:
- Keycloak: https://www.keycloak.org/

Change location: openspec/changes/revert-add-google-sign-in/
