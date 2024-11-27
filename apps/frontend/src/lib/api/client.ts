import { appConfig } from '@/const/config'
import axios from 'axios'

const client = axios.create({
  baseURL: appConfig.apiv2Url,
})

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tk_admin')
    if (!token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default client
