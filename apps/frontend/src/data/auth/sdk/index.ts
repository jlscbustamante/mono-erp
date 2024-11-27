import { baseUrl } from '@/data/api/baseUrl'

import { IUserAuth } from '../types/user'

export const login = (email: string, password: string) => {
  return baseUrl<IUserAuth>('user/login', {
    method: 'POST',
    body: {
      email,
      password,
    },
  })
}
