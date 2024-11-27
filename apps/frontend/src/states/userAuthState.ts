import { atom, RecoilState } from 'recoil'

import { IUserAuth } from '@/data/auth/types/user'

export const userAuthState: RecoilState<IUserAuth | null> = atom({
  key: 'userAuthState',
  default: null as IUserAuth | null,
})
