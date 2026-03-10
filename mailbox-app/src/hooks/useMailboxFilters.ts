import { useEffect } from 'react'
import useMailStore from '../store/useMailStore'

const useMailboxFilters = () => {
  const apply = useMailStore((s) => s.applyFilters)
  useEffect(() => { apply() }, [useMailStore.getState().searchQuery, useMailStore.getState().currentPage, useMailStore.getState().pageSize])
}

export default useMailboxFilters
