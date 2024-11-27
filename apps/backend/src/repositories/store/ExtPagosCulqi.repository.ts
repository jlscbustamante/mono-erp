import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { ExtPagosCulqi } from '../../entities/store/ExtPagosCulqi'
import { safeAny } from '../../utils/someAny'

export interface ExtPagosCulqiRepository extends Repository<ExtPagosCulqi> {
  getInfoPaymentMethods(
    date: string,
    exclude?: string[],
  ): Promise<
    {
      sucursalcode: string
      sucursalnombre: string
      aplicacion: string
      amount: number
    }[]
  >
}

const extPagosCulqiRepository: ExtPagosCulqiRepository =
  AppDataSource.getRepository(ExtPagosCulqi).extend({
    async getInfoPaymentMethods(date: string, exclude?: string[]) {
      const queryExlude = exclude
        ? `and estado not in (${exclude
            .map((el: string) => "'" + el + "'")
            .join(',')})`
        : ''
      const info = await this.query(
        `select sucursalcode,sucursalnombre,aplicacion,sum(montoventa) amount from ext_pagos_culqi where date_format(fechadelatransaccion,"%Y-%m-%d")=? ${queryExlude} group by sucursalcode,sucursalnombre order by sucursalcode`,
        [date],
      )
      return info
    },
  }) as safeAny

export default extPagosCulqiRepository
