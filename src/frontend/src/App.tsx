import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import routes from './router/routes'
import AppShell from './layout/AppShell'
import LoginPage from './pages/LoginPage'
import ReactRouter from 'react'

export default function App() {
  const isAuthenticated = typeof document !== 'undefined' && !!document.cookie.match(/mailengine_session=([^;]+)/)
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/inbox" : "/login"} replace />} />
        <Route path="/login" element={<LoginPage />} />
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
    </AppShell>
  )
}
