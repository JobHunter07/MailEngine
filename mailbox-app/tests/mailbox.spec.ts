import { test, expect } from '@playwright/test'

test('homepage and basic mailbox flows', async ({ page, baseURL }) => {
  await page.goto(baseURL || '/')
  await page.waitForLoadState('networkidle')
  // wait a bit for app to render
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'testing-results/inbox.png', fullPage: true })

  // try to click first mail row if present
  const row = await page.locator('li .MuiListItemText-root').first()
  if (await row.count() > 0) {
    await row.click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: 'testing-results/mail-open.png', fullPage: true })
  }

  // open compose
  await page.goto('/compose')
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'testing-results/compose.png', fullPage: true })
})
