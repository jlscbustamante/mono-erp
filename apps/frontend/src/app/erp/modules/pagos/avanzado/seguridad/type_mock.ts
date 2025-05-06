import { delay } from '@/utils'

export interface IMockAuthorizedUser {
  id: number
  name: string
  email: string
  phone: string
}

export const mock_authorized_users: IMockAuthorizedUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'jhondoe@gmail.com',
    phone: '932250406',
  },
]

export const get_mock_authorized_users = async (): Promise<
  IMockAuthorizedUser[]
> => {
  await delay(1000)
  return mock_authorized_users
}
