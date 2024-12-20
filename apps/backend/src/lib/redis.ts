import { Redis } from 'ioredis'

export const redis = new Redis({
  host: 'localhost',
  port: 6379,
})

redis.on('connect', () => {
  console.log('Conectado a redis')
})

redis.on('error', (err) => {
  console.log('Error en redis ', err)
})
