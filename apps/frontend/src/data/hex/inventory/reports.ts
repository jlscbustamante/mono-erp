import config from '@/config'
import { baseUrl } from '@/data/api/baseUrl'

export interface CashRegisterReport {
  initialBalance: number
  sales: number
  otherIncome: number
  cashDeposit: number
  paymentMethods: number
  otherExpenses: number
  saldoCaja: number
}

export interface InventoryReport {
  initialStockValue: number
  warehouseDispatch: number
  storeDispatch: number
  merchandisePurchase: number
  storeOutgoing: number
  saldoFinal: number
}

interface ApiInventoryReport {
  tieneInventario: boolean
  saldoInicial: number
  saldoFinal: number
  totalDeAlmacenes: number
  totalEntradaDeTienda: number
  totalDespachoATienda: number
}

interface ApiPosCash {
  result: {
    otros_ingresos: string
    saldo_inicial: string
    saldo_caja: string
    deposito_efectivo: string
    medios_pagos: string
    otros_egresos: string
    ventas: string
  }
}

export const getCashReport = async ({
  start,
  end,
  code,
}: {
  code: string
  start: string
  end: string
}): Promise<CashRegisterReport> => {
  const response = await fetch(
    `${config.hostPos}/api/store/storeResumenRangeWithDates?start_date=${start}&end_date=${end}&store_code=${code}`,
  )
  const data: ApiPosCash = await response.json()
  console.log(data)
  return {
    sales: Number(data.result.ventas),
    initialBalance: Number(data.result.saldo_inicial),
    otherExpenses: Number(data.result.otros_egresos),
    cashDeposit: Number(data.result.deposito_efectivo),
    paymentMethods: Number(data.result.medios_pagos),
    otherIncome: Number(data.result.otros_ingresos),
    saldoCaja: Number(data.result.saldo_caja),
  }
}

export const getInventoryReport = async ({
  start,
  end,
  code,
}: {
  code: string
  start: string
  end: string
}): Promise<InventoryReport> => {
  const response = await baseUrl<ApiInventoryReport>(
    `hex/inventory/report/stock?start=${start}&end=${end}&sucursalCode=${code}`,
  )
  return {
    initialStockValue: response.saldoInicial,
    merchandisePurchase: 0,
    storeDispatch: response.totalEntradaDeTienda,
    storeOutgoing: response.totalDespachoATienda,
    warehouseDispatch: response.totalDeAlmacenes,
    saldoFinal: response.saldoFinal,
  }
}
