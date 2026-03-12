import React from 'react'
import Button from '@mui/material/Button'

export default function LoginPage() {
  const startLogin = async () => {
    const res = await fetch('/auth/google/start')
    if (!res.ok) return
    const text = await res.text()
    try {
      const data = JSON.parse(text)
      if (data && data.redirect) {
        window.location.href = data.redirect
        return
      }
      // Not the expected shape; fall through to try to use the text
    } catch (err) {
      // Ignore JSON parse error and try to handle as plain text
    }

    // If server returned a raw URL or an HTML page containing a redirect link,
    // attempt to extract a URL; otherwise show error to help debugging.
    const maybeUrlMatch = text.match(/https?:\/\/[^"'<>\s]+/)
    if (maybeUrlMatch) {
      window.location.href = maybeUrlMatch[0]
      return
    }

    console.error('Unexpected response from /auth/google/start:', text)
    alert('Login failed: unexpected server response. See console for details.')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Button variant="contained" color="primary" onClick={startLogin}>
        Sign in with Google
      </Button>
    </div>
  )
}
