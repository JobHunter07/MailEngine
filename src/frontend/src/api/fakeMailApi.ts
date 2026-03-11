import seed from '../data/seedMailData'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

const fakeApi = {
  getMails: async () => { await delay(300); return seed },
  getMailById: async (id: string) => { await delay(150); return seed.find((s) => s.id === id) },
  sendMail: async (payload: any) => { await delay(200); return { ok: true, id: 'sent-' + Date.now() } },
  saveDraft: async (payload: any) => { await delay(200); return { ok: true, id: 'draft-' + Date.now() } },
  archiveMail: async (id: string) => { await delay(150); return { ok: true } },
  deleteMail: async (id: string) => { await delay(150); return { ok: true } },
  bulkArchive: async (ids: string[]) => { await delay(300); return { ok: true } },
  bulkDelete: async (ids: string[]) => { await delay(300); return { ok: true } },
  updateMail: async (id: string, patch: any) => { await delay(150); return { ok: true } },
  assignLabels: async (ids: string[], labels: string[]) => { await delay(200); return { ok: true } }
}

export default fakeApi
