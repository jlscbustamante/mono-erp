import { badImplementation, badRequest } from '@hapi/boom'
import axios from 'axios'

import config from '../config/config'

class RucService {
  URL: string
  TOKEN: string
  constructor() {
    this.URL = 'https://ruc.com.pe/api/v1/consultas'
    const { tokenRucApi: TOKEN_RUC_API } = config
    this.TOKEN = TOKEN_RUC_API
  }

  async getInfoRuc(ruc: string): Promise<{
    success: boolean
    ruc: string
    nombre_o_razon_social: string
    estado_del_contribuyente: string
  }> {
    try {
      const result = await axios({
        method: 'post',
        url: this.URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ruc,
          token: this.TOKEN,
        },
      })

      return result.data
    } catch (err: any) {
      console.log(err.response.data)
      if (err.response.data.error) throw badRequest(err.response.data.error)
      else throw badImplementation(err)
    }
  }
}

const rucService = new RucService()

export default rucService
