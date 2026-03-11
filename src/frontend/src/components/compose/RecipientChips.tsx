import React from 'react'
import { Chip, Box } from '@mui/material'

const RecipientChips: React.FC<{ recipients: string[] }> = ({ recipients }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {recipients.map((r) => <Chip key={r} label={r} />)}
    </Box>
  )
}

export default RecipientChips
