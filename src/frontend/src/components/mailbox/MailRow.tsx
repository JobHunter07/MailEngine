import React from 'react'
import { ListItem, ListItemAvatar, Avatar, Checkbox, IconButton, ListItemText, Box, Chip, Typography } from '@mui/material'
import StarBorder from '@mui/icons-material/StarBorder'
import AttachFile from '@mui/icons-material/AttachFile'
import { useNavigate } from 'react-router-dom'
import { MailItem } from '../../utils/constants'
import useMailStore from '../../store/useMailStore'
import { formatDistanceToNow } from 'date-fns'

const MailRow: React.FC<{ mail: MailItem }> = ({ mail }) => {
  const navigate = useNavigate()
  const toggleStar = useMailStore((s) => s.toggleStar)
  const toggleSelect = useMailStore((s) => s.toggleSelect)
  const openMail = useMailStore((s) => s.openMail)

  const onOpen = (e: React.MouseEvent) => {
    // avoid open when clicking interactive elements
    const tag = (e.target as HTMLElement).tagName.toLowerCase()
    if (['input', 'button', 'svg', 'path'].includes(tag)) return
    openMail(mail.id)
    navigate(`/mail/${mail.id}`)
  }

  return (
    <ListItem secondaryAction={
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {mail.hasAttachments && <AttachFile />}
        <Typography variant="caption" sx={{ ml: 2 }}>{formatDistanceToNow(new Date(mail.timestamp), { addSuffix: true })}</Typography>
      </Box>
    } disablePadding>
      <Checkbox onClick={(e) => { e.stopPropagation(); toggleSelect(mail.id) }} checked={mail._selected || false} />
      <IconButton onClick={(e) => { e.stopPropagation(); toggleStar(mail.id) }}><StarBorder color={mail.starred ? 'warning' : 'inherit'} /></IconButton>
      <ListItemAvatar>
        <Avatar>{mail.sender[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText onClick={onOpen} primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontWeight: mail.read ? 400 : 700 }}>{mail.sender}</Typography><Chip size="small" label={mail.labels?.[0]} /></Box>} secondary={<>{mail.subject} — <span style={{ color: '#666' }}>{mail.preview}</span></>} />
    </ListItem>
  )
}

export default MailRow
