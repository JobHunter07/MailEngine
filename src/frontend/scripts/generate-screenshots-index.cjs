const fs = require('fs')
const path = require('path')

const resultsDir = path.join(__dirname, '..', 'testing-results')
const outFile = path.join(resultsDir, 'index.html')

function makeIndex() {
  if (!fs.existsSync(resultsDir)) {
    console.warn('No testing-results directory found')
    return
  }
  const items = fs.readdirSync(resultsDir).filter((f) => fs.statSync(path.join(resultsDir, f)).isDirectory())
  // sort descending
  items.sort((a, b) => b.localeCompare(a))

  let html = `<!doctype html><html><head><meta charset="utf-8"><title>Testing Results</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;background:#f7f7f7} .run{margin-bottom:24px;padding:12px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08)} .thumb{height:120px;margin-right:8px;border:1px solid #ddd}</style></head><body><h1>Playwright Testing Results</h1>`

  for (const run of items) {
    const runPath = path.join(resultsDir, run)
    const files = fs.readdirSync(runPath).filter((f) => /\.png$/.test(f)).sort()
    html += `<div class="run"><h2>${run}</h2><div style="display:flex;flex-wrap:wrap">`
    for (const f of files) {
      const rel = path.posix.join(run, f)
      html += `<a href="${rel}" target="_blank"><img src="${rel}" class="thumb"/></a>`
    }
    html += `</div></div>`
  }

  html += `</body></html>`
  fs.writeFileSync(outFile, html, 'utf8')
  console.log('Generated', outFile)
}

makeIndex()
