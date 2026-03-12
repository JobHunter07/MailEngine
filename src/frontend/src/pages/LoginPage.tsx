import React from 'react'
import Button from '@mui/material/Button'
import useAuthStore from '../store/useAuthStore'

export default function LoginPage() {
  const setSession = useAuthStore((s) => s.setSession)

  const startLogin = async () => {
    const res = await fetch('/auth/google/start')
    if (!res.ok) return
    const data = await res.json()
    // store state if needed
    window.location.href = data.redirect
  }

  const demoLabels = async () => {
    const res = await fetch('/api/google/demo/labels')
    if (!res.ok) {
      alert('Demo labels failed')
      return
    }
    const json = await res.json()
    alert('Labels: ' + JSON.stringify(json))
    // if session cookie was set by server, read it
    const cookie = document.cookie.match(/mailengine_session=([^;]+)/)?.[1]
    if (cookie) setSession(cookie)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign in</h2>
      <p>Sign in with Google to connect your Gmail account.</p>
      <Button variant="contained" color="primary" onClick={startLogin} style={{ marginRight: 12 }}>
        Sign in with Google
      </Button>
      <Button variant="outlined" onClick={demoLabels}>Demo labels (mock)</Button>
    </div>
  )
}
