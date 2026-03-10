import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import theme from './theme/theme'
import './styles/global.css'
import useMailStore from './store/useMailStore'
import { updateFavicon } from './utils/favicon'

// subscribe to mails to update favicon unread count
const initFaviconSubscription = () => {
  const compute = (mails: any[]) => mails.filter((m) => !m.read && m.folder === 'inbox').length
  // initial
  const current = useMailStore.getState().mails
  updateFavicon(compute(current))
  // subscribe
  useMailStore.subscribe((m) => m.mails, (mails) => updateFavicon(compute(mails)))
}

initFaviconSubscription()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
