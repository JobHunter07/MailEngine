import React from 'react'
import { useParams } from 'react-router-dom'
import MailToolbar from '../components/mailbox/MailToolbar'
import MailList from '../components/mailbox/MailList'

const LabelPage: React.FC = () => {
  const { labelName } = useParams()
  return (
    <div>
      <h3>Label: {labelName}</h3>
      <MailToolbar />
      <MailList />
    </div>
  )
}

export default LabelPage
