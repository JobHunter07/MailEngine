# Design: How to revert the Google sign‑in implementation

Goal: Safely remove the provisional Google OAuth implementation and associated artifacts introduced previously, leaving the codebase clean and documented for a future Keycloak integration.

High‑level approach:
1. Identify all files and config edits introduced for Google sign‑in.
2. Remove added files (frontend and backend) and undo code edits (DI registration, routing, config keys).
3. Run build and tests to confirm nothing else depends on the removed pieces.
4. Record the revert in repository docs and open a follow‑up change to add Keycloak integration.

Files/paths to review (likely additions from the prior change):
- Frontend:
  - `src/pages/LoginPage.tsx` (remove if added)
  - `src/store/useAuthStore.ts` (or related hook)
  - Router changes that added `/login` redirection
- Backend:
  - `MailEngine.Server/Controllers/GoogleAuthController.cs`
  - `MailEngine.Server/Services/GoogleAuthService.cs`
  - `MailEngine.Server/Services/GoogleTokenStore.cs`
  - `MailEngine.Server/Services/GoogleProviderAccountService.cs`
  - DI registrations in `MailEngine.Server/Extensions.cs` or `Program.cs`
- Config:
  - `appsettings.Development.json` (remove `Google:ClientId`, `Google:ClientSecret`, `Google:RedirectUri`)

Detailed steps and commands:
1. Create a temporary branch (recommended):

```
git checkout -b revert-add-google-sign-in
```

2. Locate added/changed files. Use `git status` and `git diff` to find unstaged or recent commits. If the Google work was committed in a single commit, prefer `git revert <commit>`.

3a. If files were created and not committed separately, remove them:

```
git rm src/pages/LoginPage.tsx src/store/useAuthStore.ts
git rm MailEngine.Server/Controllers/GoogleAuthController.cs
git rm MailEngine.Server/Services/GoogleAuthService.cs
git rm MailEngine.Server/Services/GoogleTokenStore.cs
git rm MailEngine.Server/Services/GoogleProviderAccountService.cs
```

3b. If code was inserted into existing files (e.g., `Extensions.cs`, `Program.cs`, `router`), edit those files to remove the added code. Example edits:
- Remove DI registrations that add `IGoogleAuthService`, `IGoogleTokenStore`, `IGoogleProviderAccountService`.
- Restore previous router startup behavior.

4. Update `appsettings.Development.json`: remove `Google` section entries.

5. Commit the revert changes with a clear message:

```
git add -A
git commit -m "revert: remove provisional Google sign-in implementation; will use Keycloak"
```

6. Run build and tests:

```
dotnet build
dotnet test MailEngine.Server.Tests
npm install --prefix frontend && npm run build --prefix frontend
```

7. Update docs: add a short note to the repo README or a changelog indicating the revert and that Keycloak will be used.

8. Push branch and open a PR for review.

Notes and alternatives:
- If the prior Google implementation was merged in multiple commits, consider `git revert` of the specific commits rather than manual file removal to preserve history cleanliness.
- If token files or provider account data were created under `data/` or `accounts/`, inspect and remove any test/demo artifacts.
