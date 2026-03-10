import { useEffect } from 'react'
import useMailStore from '../store/useMailStore'
import { useNavigate } from 'react-router-dom'

const useKeyboardShortcuts = () => {
  const navigate = useNavigate()
  const compose = () => navigate('/compose')
  const setSearch = useMailStore.getState().setSearchQuery

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      if (e.key === 'c') compose()
      if (e.key === '/') { e.preventDefault(); setSearch(''); }
      if (e.key === 'e') { /* archive selected */ useMailStore.getState().archiveSelected() }
      if (e.key === '#') { useMailStore.getState().deleteSelected() }
      if (e.key === 'x') { /* toggle selection of focused — omitted for simplicity */ }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export default useKeyboardShortcuts
