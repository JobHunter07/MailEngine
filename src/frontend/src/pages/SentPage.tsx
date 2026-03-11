import React from 'react'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'

const SentPage: React.FC = () => (
  <div>
    <h3>Sent</h3>
    <MailToolbar />
    <MailList />
  </div>
)

export default SentPage
