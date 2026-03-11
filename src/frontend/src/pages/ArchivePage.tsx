import React from 'react'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'

const ArchivePage: React.FC = () => (
  <div>
    <h3>Archive</h3>
    <MailToolbar />
    <MailList />
  </div>
)

export default ArchivePage
