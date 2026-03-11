export const short = (s: string, n = 80) => (s.length > n ? s.slice(0, n) + '…' : s)
