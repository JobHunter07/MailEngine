# Tasks: Revert Google Sign‑In changes

1. Use the current branch, `feature/add-keycloak-to-aspire-project`


2. Remove frontend artifacts
   - Delete `src/pages/LoginPage.tsx` if it was added
   - Delete `src/store/useAuthStore.ts` (or revert to previous version)
   - Undo router changes that redirect unauthenticated users to `/login`

3. Remove backend artifacts
   - Delete `MailEngine.Server/Controllers/GoogleAuthController.cs` if present
   - Delete `MailEngine.Server/Services/GoogleAuthService.cs`
   - Delete `MailEngine.Server/Services/GoogleTokenStore.cs`
   - Delete `MailEngine.Server/Services/GoogleProviderAccountService.cs`
   - Remove any provider‑account data created under `MailEngine.Server/data/` or `data/accounts/` (confirm before deleting)

4. Revert configuration and DI changes
   - Remove `Google:ClientId`, `Google:ClientSecret`, `Google:RedirectUri` from `appsettings.Development.json`
   - Remove DI registrations for Google services from `Extensions.cs` / `Program.cs`

5. Clean up docs and tests
   - Remove or update any tests added for Google auth
   - Add a short note to README or CHANGELOG stating the revert and that Keycloak will be used

6. Build & verify
   - `dotnet build` and `dotnet test` for server projects
   - `npm run build` for frontend
   - Verify app runs and no lingering references to `Google:` keys remain

7. Commit and open PR
   - `git add -A && git commit -m "revert: remove provisional Google sign-in implementation; switch plan to Keycloak"`

Estimated effort: 1–2 hours (depends on how many files were changed and whether changes were committed as a single commit).

Done: This tasks file documents the exact steps to remove the previously added Google sign‑in implementation. A separate change will be proposed to integrate Keycloak and document the federation with Google.
