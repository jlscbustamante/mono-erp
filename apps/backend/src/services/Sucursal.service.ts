import { Sucursal } from 'pizzadb'
import { SucursalRepository } from '../repositories/sucursal.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditSucursal = {
  id: string
  title: string
  ubi_address: string
  ubi_district: string
  ubi_city: string
  type_sede: string
  legalperson_name: string
  legalperson_docnum: string
  legalperson_doctype: string
  legalperson_account_bco: string
  legalperson_account_num: string
  legalperson_account_cci: string
  legalperson_account_cur: string
  legalperson_account_type: string
  status: number
}
export class SucursalService {
  constructor(private readonly sucursalRepository: SucursalRepository) {}
  async updateSucursal(
    existingSucursal: Sucursal,
    args: EditSucursal,
  ): Promise<void> {
    try {
      existingSucursal.title = args.title
      existingSucursal.ubi_address = args.ubi_address
      existingSucursal.ubi_district = args.ubi_district
      existingSucursal.ubi_city = args.ubi_city
      existingSucursal.type_sede = args.type_sede
      existingSucursal.legalperson_name = args.legalperson_name
      existingSucursal.legalperson_docnum = args.legalperson_docnum
      existingSucursal.legalperson_doctype = args.legalperson_doctype
      existingSucursal.legalperson_account_bco = args.legalperson_account_bco
      existingSucursal.legalperson_account_num = args.legalperson_account_num
      existingSucursal.legalperson_account_cci = args.legalperson_account_cci
      existingSucursal.legalperson_account_cur = args.legalperson_account_cur
      existingSucursal.legalperson_account_type = args.legalperson_account_type
      existingSucursal.status = args.status
      existingSucursal.updated_at = dateNow()
      await this.sucursalRepository.save(existingSucursal)
    } catch (error: any) {
      throw new Error(`Error al actualizar sucursal: ${error}`)
    }
  }

  async getFilteredSucursalNt(
    filters: EnvFilters<Sucursal>,
  ): Promise<Sucursal[]> {
    return this.sucursalRepository.filterNt(filters)
  }

  async createSucursal(args: EditSucursal): Promise<void> {
    try {
      const newSucursal = new Sucursal()
      newSucursal.id = args.id
      newSucursal.title = args.title
      newSucursal.ubi_address = args.ubi_address
      newSucursal.ubi_district = args.ubi_district
      newSucursal.ubi_city = args.ubi_city
      newSucursal.type_sede = args.type_sede
      newSucursal.legalperson_name = args.legalperson_name
      newSucursal.legalperson_docnum = args.legalperson_docnum
      newSucursal.legalperson_doctype = args.legalperson_doctype
      newSucursal.legalperson_account_bco = args.legalperson_account_bco
      newSucursal.legalperson_account_num = args.legalperson_account_num
      newSucursal.legalperson_account_cci = args.legalperson_account_cci
      newSucursal.legalperson_account_cur = args.legalperson_account_cur
      newSucursal.legalperson_account_type = args.legalperson_account_type
      newSucursal.status = args.status
      newSucursal.updated_at = dateNow()
      newSucursal.created_at = dateNow()
      await this.sucursalRepository.save(newSucursal)
    } catch (error: any) {
      throw new Error(`Error al crear la sucursal: ${error}`)
    }
  }
}
