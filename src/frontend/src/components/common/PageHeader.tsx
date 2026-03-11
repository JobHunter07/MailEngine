import React from 'react'
import { Box, Typography } from '@mui/material'

const PageHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h5">{title}</Typography>
    {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
  </Box>
)

export default PageHeader
