import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5175',
    trace: 'off'
  },
  outputDir: 'testing-results'
})
