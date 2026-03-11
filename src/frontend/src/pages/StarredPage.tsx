import React from 'react'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'

const StarredPage: React.FC = () => (
  <div>
    <h3>Starred</h3>
    <MailToolbar />
    <MailList />
  </div>
)

export default StarredPage
