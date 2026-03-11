import React from 'react'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useKeyboardShortcuts()
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{ flex: 1, p: 3, mt: '64px' }}>
        {children}
      </Box>
    </Box>
  )
}

export default AppShell
