import { baseUrl } from '@/data/api/baseUrl'

export const getPublicParamaters = () => {
  return baseUrl<{
    ciaIdMoturider: string | null
  }>('hex/parameters/public')
}
