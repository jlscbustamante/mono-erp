import { LRUCache } from 'lru-cache'

const options = {
  max: 500,
  // maxAge: 1000 * 60 * 5,
  // maxage 5seg
  ttl: 1000 * 60 * 20,
}

const cache = new LRUCache(options)

const cacheApi = new LRUCache({
  max: 500,
  // ttl after 5min
  ttl: 1000 * 60 * 2,
})

const cacheHalfDay = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60 * 12,
})

export { cache, cacheApi, cacheHalfDay }
