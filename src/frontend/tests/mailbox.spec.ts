import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test('homepage and basic mailbox flows', async ({ page, baseURL }, testInfo) => {
  // create an Eastern (America/New_York) timestamp for folder naming
  const makeEasternStamp = () => {
    const d = new Date()
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      fractionalSecondDigits: 3,
      hour12: false,
      timeZoneName: 'short'
    })
    const parts = fmt.formatToParts(d)
    const map: Record<string, string> = {}
    for (const p of parts) map[p.type] = p.value
    // map contains: year, month, day, hour, minute, second, fraction, timeZoneName
    const year = map.year
    const month = map.month
    const day = map.day
    const hour = map.hour
    const minute = map.minute
    const second = map.second
    // fractionalSecondDigits yields 'fraction' part (3 digits)
    const fraction = (map.fraction || '000')
    const zone = (map.timeZoneName || 'ET').replace(/\s+/g, '')
    return `${year}-${month}-${day}T${hour}-${minute}-${second}-${fraction}-${zone}`
  }

  const stamp = makeEasternStamp()
  const runFolder = `testing-results/run-${stamp}`
  // ensure directory exists
  fs.mkdirSync(runFolder, { recursive: true })

  const prefix = `${runFolder}/${testInfo.title.replace(/\s+/g, '_')}_${stamp}`

  await page.goto(baseURL || '/')
  await page.waitForLoadState('networkidle')
  // wait a bit for app to render
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${prefix}_inbox.png`, fullPage: true })

  // try to click first mail row if present
  const row = await page.locator('li .MuiListItemText-root').first()
  if (await row.count() > 0) {
    await row.click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${prefix}_mail-open.png`, fullPage: true })
  }

  // open compose
  await page.goto('/compose')
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${prefix}_compose.png`, fullPage: true })
})
