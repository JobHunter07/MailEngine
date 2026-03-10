import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import routes from './router/routes'
import AppShell from './layout/AppShell'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/inbox" replace />} />
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
    </AppShell>
  )
}
