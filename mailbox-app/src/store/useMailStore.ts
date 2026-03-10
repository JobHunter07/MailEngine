import create from 'zustand'
import { MailItem } from '../utils/constants'
import fakeApi from '../api/fakeMailApi'

type State = {
  mails: MailItem[]
  visibleMails: MailItem[]
  selectedIds: string[]
  currentPage: number
  pageSize: number
  total: number
  searchQuery: string
  composeDraft: { to: string; subject: string; body: string }
  counts: { inbox: number }
  loadMails: () => Promise<void>
  setCurrentPage: (p: number) => void
  setPageSize: (n: number) => void
  setSearchQuery: (q: string) => void
  toggleStar: (id: string) => void
  toggleSelect: (id: string) => void
  selectAllVisible: () => void
  clearSelection: () => void
  archiveSelected: () => void
  deleteSelected: () => void
  toggleReadSelected: () => void
  openMail: (id: string) => void
  getMailById: (id: string) => MailItem | undefined
  setComposeDraft: (d: any) => void
  saveDraft: () => void
  sendMail: () => void
  archiveMail: (id: string) => void
  deleteMail: (id: string) => void
}

const useMailStore = create<State>((set, get) => ({
  mails: [],
  visibleMails: [],
  selectedIds: [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchQuery: '',
  composeDraft: { to: '', subject: '', body: '' },
  counts: { inbox: 0 },

  loadMails: async () => {
    const mails = await fakeApi.getMails()
    set({ mails })
    // compute counts
    set({ counts: { inbox: mails.filter((m) => m.folder === 'inbox').length } })
    // apply filters after load
    const state = get()
    const query = state.searchQuery
    const page = state.currentPage
    const pageSize = state.pageSize
    const filtered = state.mails.filter((m) => m.folder === 'inbox' || m.folder === 'sent' || m.folder === 'drafts' || m.folder === 'archive' || m.folder === 'trash')
    const searched = query ? filtered.filter((m) => [m.sender, m.subject, m.preview, m.body].join(' ').toLowerCase().includes(query.toLowerCase())) : filtered
    const total = searched.length
    const visible = searched.slice((page - 1) * pageSize, page * pageSize)
    set({ visibleMails: visible, total })
  },

  applyFilters: () => {
    const s = get()
    const q = s.searchQuery.trim().toLowerCase()
    const page = s.currentPage
    const pageSize = s.pageSize
    let list = s.mails
    // filter by query
    if (q) {
      list = list.filter((m) => [m.sender, m.subject, m.preview, m.body, (m.labels || []).join(' ')].join(' ').toLowerCase().includes(q))
    }
    const total = list.length
    const visible = list.slice((page - 1) * pageSize, page * pageSize)
    set({ visibleMails: visible, total })
  },

  setCurrentPage: (p) => set({ currentPage: p }),
  setPageSize: (n) => set({ pageSize: n, currentPage: 1 }),
  setSearchQuery: (q) => { set({ searchQuery: q, currentPage: 1 }); get().applyFilters?.() },

  toggleStar: (id) => set((s) => ({ mails: s.mails.map((m) => m.id === id ? { ...m, starred: !m.starred } : m) })),
  toggleSelect: (id) => set((s) => ({ selectedIds: s.selectedIds.includes(id) ? s.selectedIds.filter((x) => x !== id) : [...s.selectedIds, id], mails: s.mails.map((m) => m.id === id ? { ...m, _selected: !m._selected } : m) })),
  selectAllVisible: () => set((s) => ({ selectedIds: s.visibleMails.map((m) => m.id), mails: s.mails.map((m) => s.visibleMails.find((v) => v.id === m.id) ? { ...m, _selected: true } : m) })),
  clearSelection: () => set((s) => ({ selectedIds: [], mails: s.mails.map((m) => ({ ...m, _selected: false })) })),
  archiveSelected: async () => {
    const ids = get().selectedIds
    await fakeApi.bulkArchive(ids)
    set((s) => ({ mails: s.mails.map((m) => ids.includes(m.id) ? { ...m, folder: 'archive' } : m), selectedIds: [] }))
    get().applyFilters?.()
  },
  deleteSelected: async () => {
    const ids = get().selectedIds
    await fakeApi.bulkDelete(ids)
    set((s) => ({ mails: s.mails.map((m) => ids.includes(m.id) ? { ...m, folder: 'trash' } : m), selectedIds: [] }))
    get().applyFilters?.()
  },
  toggleReadSelected: () => set((s) => ({ mails: s.mails.map((m) => s.selectedIds.includes(m.id) ? { ...m, read: !m.read } : m) })),
  openMail: (id) => set((s) => ({ mails: s.mails.map((m) => m.id === id ? { ...m, read: true } : m) })),
  getMailById: (id) => get().mails.find((m) => m.id === id),
  setComposeDraft: (d) => set({ composeDraft: d }),
  saveDraft: async () => { const d = get().composeDraft; await fakeApi.saveDraft(d); set((s) => ({ mails: [{ id: 'draft-' + Date.now(), sender: 'me', senderEmail: 'me@local', recipients: [d.to], subject: d.subject, preview: d.body.slice(0, 80), body: d.body, timestamp: new Date().toISOString(), read: true, starred: false, folder: 'drafts', labels: [], attachments: [], hasAttachments: false }, ...s.mails] })) },
  sendMail: async () => { const d = get().composeDraft; await fakeApi.sendMail(d); set((s) => ({ mails: [{ id: 'sent-' + Date.now(), sender: 'me', senderEmail: 'me@local', recipients: [d.to], subject: d.subject, preview: d.body.slice(0, 80), body: d.body, timestamp: new Date().toISOString(), read: true, starred: false, folder: 'sent', labels: [], attachments: [], hasAttachments: false }, ...s.mails], composeDraft: { to: '', subject: '', body: '' } })) },
  archiveMail: async (id) => { await fakeApi.archiveMail(id); set((s) => ({ mails: s.mails.map((m) => m.id === id ? { ...m, folder: 'archive' } : m) })); get().applyFilters?.() },
  deleteMail: async (id) => { await fakeApi.deleteMail(id); set((s) => ({ mails: s.mails.map((m) => m.id === id ? { ...m, folder: 'trash' } : m) })); get().applyFilters?.() }
}))

export default useMailStore
