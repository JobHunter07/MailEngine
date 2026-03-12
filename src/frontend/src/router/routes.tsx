import React from 'react'
import InboxPage from '../pages/InboxPage'
import MailReadPage from '../pages/MailReadPage'
import ComposePage from '../pages/ComposePage'
import LabelPage from '../pages/LabelPage'
import StarredPage from '../pages/StarredPage'
import SentPage from '../pages/SentPage'
import DraftsPage from '../pages/DraftsPage'
import ArchivePage from '../pages/ArchivePage'
import TrashPage from '../pages/TrashPage'
import LoginPage from '../pages/LoginPage'

const routes = [
  { path: '/inbox', element: <InboxPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/mail/:id', element: <MailReadPage /> },
  { path: '/compose', element: <ComposePage /> },
  { path: '/label/:labelName', element: <LabelPage /> },
  { path: '/starred', element: <StarredPage /> },
  { path: '/sent', element: <SentPage /> },
  { path: '/drafts', element: <DraftsPage /> },
  { path: '/archive', element: <ArchivePage /> },
  { path: '/trash', element: <TrashPage /> }
]

export default routes
