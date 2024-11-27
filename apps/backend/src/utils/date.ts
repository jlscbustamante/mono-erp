import { eachDayOfInterval, format, parseISO } from 'date-fns'

export const getRangeDate = (start: string, end: string): string[] => {
  const result = eachDayOfInterval({
    start: parseISO(start),
    end: parseISO(end),
  })
  return result.map((el) => format(el, 'yyyy-MM-dd'))
}
