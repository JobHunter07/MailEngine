import React from 'react'
import { InputBase, Paper, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import useMailStore from '../../store/useMailStore'

const SearchInput: React.FC = () => {
  const query = useMailStore((s) => s.searchQuery)
  const setQuery = useMailStore((s) => s.setSearchQuery)

  return (
    <Paper component="form" sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
      <InputBase placeholder="Search mail" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ ml: 1, flex: 1 }} />
      <IconButton type="button" aria-label="search"><SearchIcon /></IconButton>
    </Paper>
  )
}

export default SearchInput
