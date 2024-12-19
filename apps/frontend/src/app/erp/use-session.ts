import { Session } from 'shared'
import { create } from 'zustand'

export const useSession = create<{
  user: Session
  setSession: (session: Session) => void
}>((set) => ({
  user: {
    mail: '',
    roleId: -1,
    roleName: '',
    userId: -1,
    userName: '',
    views: [],
    modules: [],
    parameters: {},
  },
  setSession: (session) => set({ user: session }),
}))
