import { Session } from 'shared'
import { create } from 'zustand'

export const useSession = create<
  Session & {
    setSession: (session: Session) => void
  }
>((set) => ({
  mail: '',
  roleId: -1,
  roleName: '',
  userId: -1,
  userName: '',
  setSession: (session) => set(session),
}))
