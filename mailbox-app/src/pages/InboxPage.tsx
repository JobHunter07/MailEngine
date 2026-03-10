import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'
import useMailStore from '../store/useMailStore'

const InboxPage: React.FC = () => {
  const load = useMailStore((s) => s.loadMails)

  useEffect(() => { load() }, [])

  return (
    <Box>
      <MailToolbar />
      <MailList />
    </Box>
  )
}

export default InboxPage
