import React from 'react'
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import MenuIcon from '@mui/icons-material/Menu'

const MobileNav: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItemButton>
          <ListItemIcon><MenuIcon /></ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}

export default MobileNav
