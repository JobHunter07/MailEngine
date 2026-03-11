import React from 'react'
import { Box, IconButton, Tooltip, Checkbox, Menu, MenuItem, Button } from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import DeleteIcon from '@mui/icons-material/Delete'
import MarkEmailRead from '@mui/icons-material/MarkEmailRead'
import MarkEmailUnread from '@mui/icons-material/MarkEmailUnread'
import Refresh from '@mui/icons-material/Refresh'
import LabelIcon from '@mui/icons-material/Label'
import useMailStore from '../../store/useMailStore'

const MailToolbar: React.FC = () => {
  const selected = useMailStore((s) => s.selectedIds)
  const selectAllVisible = useMailStore((s) => s.selectAllVisible)
  const clearSelection = useMailStore((s) => s.clearSelection)
  const archiveSelected = useMailStore((s) => s.archiveSelected)
  const deleteSelected = useMailStore((s) => s.deleteSelected)
  const toggleReadSelected = useMailStore((s) => s.toggleReadSelected)

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Checkbox onChange={(e) => (e.target.checked ? selectAllVisible() : clearSelection())} checked={selected.length > 0} />
      <Tooltip title="Archive"><IconButton onClick={archiveSelected}><ArchiveIcon /></IconButton></Tooltip>
      <Tooltip title="Delete"><IconButton onClick={deleteSelected}><DeleteIcon /></IconButton></Tooltip>
      <Tooltip title="Mark read/unread"><IconButton onClick={() => toggleReadSelected()}><MarkEmailRead /></IconButton></Tooltip>
      <Tooltip title="Refresh"><IconButton onClick={() => location.reload()}><Refresh /></IconButton></Tooltip>
      <Button startIcon={<LabelIcon />} onClick={(e) => setAnchor(e.currentTarget)}>Label</Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => { /* simple label assign */ setAnchor(null) }}>Work</MenuItem>
        <MenuItem onClick={() => { setAnchor(null) }}>Personal</MenuItem>
      </Menu>
    </Box>
  )
}

export default MailToolbar
