import React from 'react'
import { AppBar, Toolbar, Typography, Box, Badge } from '@mui/material'
import SearchInput from '../components/common/SearchInput'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import useMailStore from '../store/useMailStore'

const Topbar: React.FC = () => {
  const unread = useMailStore((s) => s.mails.filter((m) => !m.read && m.folder === 'inbox').length)

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        <Badge color="primary" badgeContent={unread} overlap="circular" sx={{ mr: 2 }}>
          <MailOutlineRoundedIcon sx={{ color: '#1a73e8' }} />
        </Badge>
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
