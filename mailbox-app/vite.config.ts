import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // simple plugin to serve testing-results folder under /testing-results
    {
      name: 'serve-testing-results',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            if (!req.url) return next()
            if (req.url.startsWith('/testing-results')) {
              // map URL to file in testing-results folder
              const rel = req.url.replace(/^\/testing-results\/?/, '')
              const base = path.resolve(process.cwd(), 'mailbox-app', 'testing-results')
              const filePath = path.join(base, rel || 'index.html')
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath).toLowerCase()
                const map: Record<string,string> = { '.html':'text/html', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.css':'text/css', '.js':'application/javascript' }
                res.statusCode = 200
                res.setHeader('Content-Type', map[ext] || 'application/octet-stream')
                const stream = fs.createReadStream(filePath)
                stream.pipe(res)
                return
              }
            }
          } catch (e) {
            // ignore and fallthrough
            console.error('serve-testing-results error', e)
          }
          next()
        })
      }
    }
  ],
  server: {
    port: 5173
  }
})
