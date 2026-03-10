# Mailbox App

This is a Vite + React + TypeScript mailbox UI demo using Material UI, Zustand for state, and Playwright for end-to-end tests.

Getting started

1. Install dependencies

```bash
cd mailbox-app
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Install Playwright browsers (required once)

```bash
npx playwright install --with-deps
```

4. Run E2E tests and capture screenshots

```bash
npm run test:e2e
```

Screenshots and test artifacts

- Test screenshots and artifacts are saved to `testing-results/`.

Notes
- The `test:e2e` script runs `npx playwright install --with-deps` first to ensure browsers are available, then runs Playwright tests.
- If the dev server is not running on `http://localhost:5175`, set the environment variable `PLAYWRIGHT_BASE_URL` to point to your running app before running tests.
