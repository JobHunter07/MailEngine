import React from 'react'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { useLocation } from 'react-router-dom'

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useKeyboardShortcuts()
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {!isLogin && <Topbar />}
      {!isLogin && <Sidebar />}
      <Box
        component="main"
        sx={
          isLogin
            ? { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }
            : { flex: 1, p: 3, mt: '64px' }
        }
      >
        {children}
      </Box>
    </Box>
  )
}

export default AppShell
