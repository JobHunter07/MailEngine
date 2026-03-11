import React from 'react'
import { Box, Typography } from '@mui/material'

const EmptyState: React.FC<{ title?: string }> = ({ title = 'No messages' }) => (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" color="text.secondary">Try refreshing or adjust your filters.</Typography>
  </Box>
)

export default EmptyState
