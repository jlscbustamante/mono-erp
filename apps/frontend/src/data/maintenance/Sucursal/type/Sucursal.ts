import { SucursalStatus } from '../status/status'
export interface ISucursal {
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
  status: SucursalStatus
  created_at?: string
}
export interface IFilterSucursal {
  id?: string
  title?: string
  ubi_address?: string
  ubi_district?: string
  ubi_city?: string
  type_sede?: string
  legalperson_name?: string
  legalperson_docnum?: string
  legalperson_doctype?: string
  legalperson_account_bco?: string
  legalperson_account_num?: string
  legalperson_account_cci?: string
  legalperson_account_cur?: string
  legalperson_account_type?: string
  status?: SucursalStatus
}
export interface ICreateSucursal extends ISucursal {
  id: any
}
