export enum WAREHOUSE_TYPE {
  WAREHOUSE = 'W',
  STORE = 'T',
}

export interface Warehouse {
  code: string
  name: string
  type: WAREHOUSE_TYPE | null
}

export interface WarehouseLegal extends Warehouse {
  legalName: string
  legalAddress: string
  legalNumber: string
  serie: string
  correlativo: number
  guideSerie: string
  guideCorrelativo: number
  district: string
}

export interface WarehouseRoute extends Warehouse {
  route: string
}
