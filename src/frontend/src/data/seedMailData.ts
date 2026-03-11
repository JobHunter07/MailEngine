import { MailItem } from '../utils/constants'
import { faker } from '@faker-js/faker/locale/en'

const meEmail = 'me@kbdavis07.com'
const now = Date.now()

const attachmentSample = (i: number) => ({
  id: `att-${i}-${Date.now()}`,
  name: `photo-${i}.png`,
  type: 'image/png',
  size: 1024 + (i % 5) * 512,
  previewUrl: '/favicon.svg'
})

const subjects = [
  (company: string) => `Invoice from ${company}`,
  (company: string) => `${company} — Action required: Update billing info`,
  (company: string) => `${company} Job Opportunity: Senior Engineer`,
  (company: string) => `Meeting: ${faker.date.future().toLocaleDateString()} — ${company}`,
  (company: string) => `${company} Newsletter — ${faker.date.recent().toLocaleDateString()}`,
  (company: string) => `Your ${company} account security alert`,
  (company: string) => `${company} sent you a receipt for ${faker.finance.amount()}`
]

const folders = ['inbox', 'sent', 'drafts', 'archive', 'trash'] as const

const makeMail = (i: number): MailItem => {
  const company = faker.company.name()
  const person = faker.person.fullName()
  const senderKind = faker.helpers.arrayElement(['company', 'person'])
  const sender = senderKind === 'company' ? company : person
  const senderEmail = senderKind === 'company' ? `no-reply@${faker.internet.domainName()}` : faker.internet.email({firstName: faker.person.firstName(), lastName: faker.person.lastName()})
  const folderIndex = i <= 20 ? 0 : i <= 26 ? 1 : i <= 29 ? 2 : i === 30 ? 3 : 4
  const folder = folders[folderIndex]
  const labelSet: string[] = []
  if (i % 5 === 0) labelSet.push('Work')
  if (i % 6 === 0) labelSet.push('Finance')
  if (i % 7 === 0) labelSet.push('Personal')

  const subjFactory = faker.helpers.arrayElement(subjects)
  const subject = subjFactory(company)

  const preview = faker.helpers.arrayElements([
    `${company} processed your payment successfully.`,
    `New candidate applied to your job posting on ${company}.`,
    `Your subscription renewal notice for ${company}.`,
    `Here's a summary of your recent activity at ${company}.`
  ], 1)[0]

  const body = `${faker.person.firstName()} —

Hi Brian,

${faker.company.catchPhrase()}. ${faker.company.buzzPhrase()} This message is regarding ${company}. ${faker.hacker.phrase()}

${faker.helpers.arrayElements([
    'Please let us know if you have any questions.',
    'We appreciate your prompt attention to this matter.',
    'See attached for details and receipts.'
  ], 2).join(' ')}

Best,
${sender}
`

  const hasAttachments = i % 6 === 0

  return {
    id: `mail-${i}-${Math.floor(Math.random() * 100000)}`,
    sender,
    senderEmail,
    recipients: [meEmail],
    cc: [],
    bcc: [],
    subject,
    preview,
    body,
    timestamp: new Date(now - i * 1000 * 60 * 60).toISOString(),
    read: i % 3 === 0,
    starred: i % 8 === 0,
    folder: folder as MailItem['folder'],
    labels: labelSet,
    attachments: hasAttachments ? [attachmentSample(i)] : [],
    hasAttachments
  }
}

const seed: MailItem[] = []
for (let i = 1; i <= 40; i++) {
  seed.push(makeMail(i))
}

export default seed
