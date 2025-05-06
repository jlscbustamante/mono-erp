import { create } from 'zustand'
import { IMockAuthorizedUser } from './type_mock'

interface IStore {
  users: IMockAuthorizedUser[]
  set_users: (users: IMockAuthorizedUser[]) => void
  add_user: (user: IMockAuthorizedUser) => void
}

export const useSeguridadStore = create<IStore>((set, get) => ({
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '932250406',
    },
  ],
  set_users: (users) => set({ users: users }),
  add_user: (user) => set({ users: [...get().users, user] }),
}))
