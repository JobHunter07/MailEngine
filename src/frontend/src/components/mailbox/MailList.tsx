import React from 'react'
import { List, Divider } from '@mui/material'
import MailRow from './MailRow'
import useMailStore from '../../store/useMailStore'
import MailPagination from './MailPagination'

const MailList: React.FC = () => {
  const visible = useMailStore((s) => s.visibleMails)

  return (
    <div>
      <List>
        {visible.map((m) => (
          <React.Fragment key={m.id}>
            <MailRow mail={m} />
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
      <MailPagination />
    </div>
  )
}

export default MailList
