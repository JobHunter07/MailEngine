import React from 'react'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import SearchInput from '../components/common/SearchInput'

const Topbar: React.FC = () => {
  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 2, color: 'text.primary' }}>
          Mailbox
        </Typography>
        <Box sx={{ flex: 1 }}>
          <SearchInput />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
