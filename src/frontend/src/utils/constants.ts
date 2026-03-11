export type Attachment = {
  id: string
  name: string
  type: string
  size: number
  previewUrl?: string
}

export type MailItem = {
  id: string
  sender: string
  senderEmail: string
  recipients: string[]
  cc: string[]
  bcc: string[]
  subject: string
  preview: string
  body: string
  timestamp: string
  read: boolean
  starred: boolean
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash'
  labels?: string[]
  attachments?: Attachment[]
  hasAttachments?: boolean
  _selected?: boolean
}
