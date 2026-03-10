import React from 'react'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'

const TrashPage: React.FC = () => (
  <div>
    <h3>Trash</h3>
    <MailToolbar />
    <MailList />
  </div>
)

export default TrashPage
