import React from 'react'
import { Drawer, Box, Button, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Badge } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import StarBorder from '@mui/icons-material/StarBorder'
import Send from '@mui/icons-material/Send'
import Drafts from '@mui/icons-material/Drafts'
import Archive from '@mui/icons-material/Archive'
import Delete from '@mui/icons-material/Delete'
import Label from '@mui/icons-material/Label'
import { useNavigate, useLocation } from 'react-router-dom'
import useMailStore from '../store/useMailStore'

const drawerWidth = 260

const labels = ['Work', 'Personal', 'Finance', 'Urgent', 'Follow Up']

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const counts = useMailStore((s) => s.counts)

  const nav = (path: string) => () => navigate(path)

  return (
    <Drawer variant="permanent" open sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', top: '64px' } }}>
      <Box sx={{ p: 2 }}>
        <Button variant="contained" color="primary" fullWidth onClick={nav('/compose')}>Compose</Button>
      </Box>
      <Divider />
      <List>
        <ListItemButton selected={location.pathname === '/inbox'} onClick={nav('/inbox')}> 
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary="Inbox" />
          <Badge color="primary" badgeContent={counts.inbox} />
        </ListItemButton>
        <ListItemButton selected={location.pathname === '/starred'} onClick={nav('/starred')}>
          <ListItemIcon><StarBorder /></ListItemIcon>
          <ListItemText primary="Starred" />
        </ListItemButton>
        <ListItemButton selected={location.pathname === '/sent'} onClick={nav('/sent')}>
          <ListItemIcon><Send /></ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItemButton>
        <ListItemButton selected={location.pathname === '/drafts'} onClick={nav('/drafts')}>
          <ListItemIcon><Drafts /></ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItemButton>
        <ListItemButton selected={location.pathname === '/archive'} onClick={nav('/archive')}>
          <ListItemIcon><Archive /></ListItemIcon>
          <ListItemText primary="Archive" />
        </ListItemButton>
        <ListItemButton selected={location.pathname === '/trash'} onClick={nav('/trash')}>
          <ListItemIcon><Delete /></ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItemButton>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2">Labels</Typography>
        <List>
          {labels.map((l) => (
            <ListItemButton key={l} onClick={() => navigate(`/label/${encodeURIComponent(l)}`)}>
              <ListItemIcon><Label /></ListItemIcon>
              <ListItemText primary={l} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar
