import React from 'react'
import { Box, Typography, Chip, Stack, IconButton } from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Reply from '@mui/icons-material/Reply'
import Forward from '@mui/icons-material/Forward'
import Archive from '@mui/icons-material/Archive'
import Delete from '@mui/icons-material/Delete'
import useMailStore from '../store/useMailStore'
import { useParams, useNavigate } from 'react-router-dom'
import AttachmentPreview from '../components/mailbox/AttachmentPreview'

const MailReadPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const mail = useMailStore((s) => s.getMailById(id || ''))
  const archive = useMailStore((s) => s.archiveMail)
  const remove = useMailStore((s) => s.deleteMail)

  if (!mail) return <div>Mail not found</div>

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
        <IconButton><Reply /></IconButton>
        <IconButton><Forward /></IconButton>
        <IconButton onClick={() => { archive(mail.id); navigate('/inbox') }}><Archive /></IconButton>
        <IconButton onClick={() => { remove(mail.id); navigate('/trash') }}><Delete /></IconButton>
      </Box>

      <Typography variant="h5">{mail.subject}</Typography>
      <Stack direction="row" spacing={1} sx={{ my: 1 }}>
        <Chip label={mail.sender} />
        {mail.labels?.map((l) => <Chip key={l} label={l} color="primary" />)}
      </Stack>
      <Typography variant="caption" color="text.secondary">{new Date(mail.timestamp).toLocaleString()}</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>{mail.body}</Typography>
      </Box>

      {mail.attachments && mail.attachments.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {mail.attachments.map((a) => <AttachmentPreview key={a.id} name={a.name} type={a.type} previewUrl={a.previewUrl} />)}
        </Box>
      )}
    </Box>
  )
}

export default MailReadPage
