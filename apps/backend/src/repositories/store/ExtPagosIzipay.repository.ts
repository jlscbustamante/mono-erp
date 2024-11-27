import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { ExtPagosIzipay } from '../../entities/store/ExtPagosIzipay'
import { safeAny } from '../../utils/someAny'

export interface ExtPagosIzipayRepository extends Repository<ExtPagosIzipay> {
  getInfoPaymentMethods(
    date: string,
    exclude?: string[],
  ): Promise<
    {
      sucursalcode: string
      sucursalnombre: string
      amount: number
    }[]
  >
}

const extPagosIzipayRepository: ExtPagosIzipayRepository =
  AppDataSource.getRepository(ExtPagosIzipay).extend({
    async getInfoPaymentMethods(date: string, exclude?: string[]) {
      const queryExclude = exclude
        ? `and estado not in (${exclude
            .map((el: string) => "'" + el + "'")
            .join(',')})`
        : ''
      const info = await this.query(
        `select sucursalcode,sucursalnombre,sum(importe) amount from ext_pagos_izipay where date_format(fechadetransaccion,"%Y-%m-%d")=? ${queryExclude} group by sucursalcode,sucursalnombre order by sucursalcode`,
        [date],
      )
      return info
    },
  }) as safeAny

export default extPagosIzipayRepository
