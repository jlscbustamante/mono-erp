import { Sucursal } from '../../../entities/Sucursal'

export interface UpdateSucursalDto extends Sucursal {
  sede_razon_social: string
  cfd_serie_fa: string
  cfd_seql_fa?: number
  cfd_serie_gr: string
  cfd_seql_gr?: number
}
