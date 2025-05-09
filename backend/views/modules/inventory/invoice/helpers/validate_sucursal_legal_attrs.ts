import { AdmSucursalSelect } from "../../../../../shared/types/index.ts";

export function validate_suscursal_legal_attrs(sucursal: AdmSucursalSelect) {
  if (!sucursal.sede_nro_ruc) {
    throw new Error(`Sucursal ${sucursal.title} no tiene nro de ruc`);
  }
  if (!sucursal.sede_razon_social) {
    throw new Error(`Sucursal ${sucursal.title} no tiene razon social`);
  }
  if (!sucursal.ubi_address) {
    throw new Error(`Sucursal ${sucursal.title} no tiene direccion`);
  }
}
