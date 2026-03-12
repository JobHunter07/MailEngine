import create from 'zustand'

type State = {
  session?: string | null
  setSession: (s: string | null) => void
  logout: () => Promise<void>
}

const useAuthStore = create<State>((set) => ({
  session: typeof document !== 'undefined' ? (document.cookie.match(/mailengine_session=([^;]+)/)?.[1] ?? null) : null,
  setSession: (s) => set({ session: s }),
  logout: async () => {
    await fetch('/auth/google/logout', { method: 'POST' })
    document.cookie = 'mailengine_session=; Max-Age=0; path=/'
    set({ session: null })
  }
}))

export default useAuthStore
