import React from 'react'
import { Box, TextField, Button, Stack, IconButton } from '@mui/material'
import AttachFile from '@mui/icons-material/AttachFile'
import useMailStore from '../../store/useMailStore'

const ComposeForm: React.FC = () => {
  const draft = useMailStore((s) => s.composeDraft)
  const setDraft = useMailStore((s) => s.setComposeDraft)
  const sendMail = useMailStore((s) => s.sendMail)
  const saveDraft = useMailStore((s) => s.saveDraft)

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); sendMail(); }}>
      <Stack spacing={2}>
        <TextField label="To" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} fullWidth />
        <TextField label="Subject" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} fullWidth />
        <TextField label="Message" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} fullWidth multiline minRows={8} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained">Send</Button>
          <Button variant="outlined" onClick={saveDraft}>Save Draft</Button>
          <IconButton><AttachFile /></IconButton>
        </Box>
      </Stack>
    </Box>
  )
}

export default ComposeForm
