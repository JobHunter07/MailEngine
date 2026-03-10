export function updateFavicon(unread: number) {
  try {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // background
    ctx.fillStyle = '#1a73e8'
    ctx.fillRect(0, 0, size, size)

    // envelope (simple)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(size * 0.1, size * 0.25)
    ctx.lineTo(size * 0.9, size * 0.25)
    ctx.lineTo(size * 0.9, size * 0.75)
    ctx.lineTo(size * 0.1, size * 0.75)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#dfefff'
    ctx.beginPath()
    ctx.moveTo(size * 0.1, size * 0.25)
    ctx.lineTo(size * 0.5, size * 0.5)
    ctx.lineTo(size * 0.9, size * 0.25)
    ctx.closePath()
    ctx.fill()

    // badge
    if (unread > 0) {
      const text = unread > 99 ? '99+' : String(unread)
      const r = size * 0.28
      ctx.beginPath()
      ctx.fillStyle = '#ff3b30'
      ctx.arc(size - r / 2, r / 2, r / 2, 0, Math.PI * 2)
      ctx.fill()

      // count
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 18px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, size - r / 2, r / 2 + 1)
    }

    const url = canvas.toDataURL('image/png')
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = url
    // update document title to include unread count like Gmail: "(3) Title"
    try {
      const raw = document.title || ''
      const stripped = raw.replace(/^\(\d+\+?\)\s*/,'')
      const text = unread > 99 ? '99+' : String(unread)
      document.title = unread > 0 ? `(${text}) ${stripped}` : stripped
    } catch (e) {
      // ignore
    }
  } catch (e) {
    // ignore
    console.warn('updateFavicon failed', e)
  }
}
