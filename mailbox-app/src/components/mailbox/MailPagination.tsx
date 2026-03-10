import React from 'react'
import { Box, Select, MenuItem, Pagination } from '@mui/material'
import useMailStore from '../../store/useMailStore'

const MailPagination: React.FC = () => {
  const page = useMailStore((s) => s.currentPage)
  const pageSize = useMailStore((s) => s.pageSize)
  const total = useMailStore((s) => s.total)
  const setPage = useMailStore((s) => s.setCurrentPage)
  const setPageSize = useMailStore((s) => s.setPageSize)

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
      <Box>
        <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} size="small">
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </Box>
      <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} />
    </Box>
  )
}

export default MailPagination
