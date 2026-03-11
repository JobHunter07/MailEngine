import React from 'react'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'

const DraftsPage: React.FC = () => (
  <div>
    <h3>Drafts</h3>
    <MailToolbar />
    <MailList />
  </div>
)

export default DraftsPage
