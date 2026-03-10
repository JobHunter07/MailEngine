import React from 'react'
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material'

const AttachmentPreview: React.FC<{ name: string; type: string; previewUrl?: string }> = ({ name, type, previewUrl }) => {
  return (
    <Card sx={{ width: 160, mr: 1 }}>
      {previewUrl ? <CardMedia component="img" height="90" image={previewUrl} alt={name} /> : <Box sx={{ height: 90, bgcolor: '#eee' }} />}
      <CardContent>
        <Typography variant="caption">{name}</Typography>
        <Typography variant="caption" display="block" color="text.secondary">{type}</Typography>
      </CardContent>
    </Card>
  )
}

export default AttachmentPreview
