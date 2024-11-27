import { format } from 'date-fns'

export const dateNow = (): string => {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}
