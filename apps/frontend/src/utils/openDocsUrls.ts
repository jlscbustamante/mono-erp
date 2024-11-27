import { URLDOC } from '@/const'

import { validateUrl } from '.'

export const openDocsUrls = (url: string | null) => {
  if (!url) return
  const urls = url.split(',')
  const cleanUrls = urls.filter((el) => Boolean(el))
  cleanUrls.forEach((el) => {
    if (validateUrl(el)) window.open(el, '_blank')
    else window.open(`${URLDOC}/${el}`, '_blank')
  })
}
