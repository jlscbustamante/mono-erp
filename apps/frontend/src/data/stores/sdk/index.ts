import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { baseUrl } from '@/data/api/baseUrl'
import { ICashAccount } from '@/data/cashAccount/types'
import { ICategory } from '@/data/category/types'
import { CashBalanceStatus } from '@/data/types'
import { Filters } from '@/data/types/Filters'

import {
  ICashMove,
  ICompareEfis,
  IFilteredCashMove,
  INetCashMove,
} from '../types'
import {
  IInfoPaymentMethod,
  IInfoPos,
  ITransactionOfMethod,
} from '../types/paymentMethods'

const arrayToQueryString = (fieldName: string, array: string[]) => {
  if (!Array.isArray(array)) {
    throw new Error('El argumento proporcionado no es un array.')
  }

  if (array.length === 0) {
    return ''
  }

  const queryString = array
    .map((value) => `${fieldName}[]=${encodeURIComponent(value)}`)
    .join('&')

  return queryString
}

export const filter = async (filters: Filters<ICashMove>) => {
  return baseUrl<IFilteredCashMove[]>('store/cash-moves/filter', {
    query: filters,
    headers: { pragma: 'no-cache', 'cache-control': 'no-cache' },
  })
}

export const createMove = async (cashMove: Partial<ICashMove>) => {
  return baseUrl<void>('store/cash-moves/movement/create', {
    method: 'POST',
    body: cashMove,
  })
}

export const getAllStatusPayment = () => {
  return baseUrl<{ states: string[] }>('store/all-states-payment', {
    method: 'GET',
  })
}

export const createMoves = async (cashMoves: Partial<ICashMove>[]) => {
  return baseUrl<void>('store/cash-moves/movements', {
    method: 'POST',
    body: { moves: cashMoves },
  })
}

export const updateMove = async (cashMove: Partial<IFilteredCashMove>) => {
  const newObj = {
    id: cashMove.id,
    description: cashMove.description,
    amount: cashMove.amount,
    cash_id: cashMove.cash_id,
    account_flow: cashMove.account_flow,
    cash_account_id: cashMove.cash_account_id,
    category_expense_id: cashMove.category_expense_id,
    category_account_id: cashMove.category_account_id,
    requested_at: cashMove.requested_at,
  }

  return baseUrl<void>('store/cash-moves/movement/update', {
    method: 'PUT',
    body: newObj,
  })
}

export const sign = async (moveId: number) => {
  return baseUrl<void>(`store/cash-moves/movement/sign/${moveId}`, {
    method: 'PUT',
  })
}

export const unsign = async (moveId: number) => {
  return baseUrl<void>(`store/cash-moves/movement/unsign/${moveId}`, {
    method: 'PUT',
  })
}

export const deleteMove = async (moveId: number) => {
  return baseUrl<void>(`store/cash-moves/movement/${moveId}`, {
    method: 'DELETE',
  })
}

export const netMoves = async (
  storeIdEfis: string,
  date: string,
): Promise<INetCashMove[]> => {
  const data = await fetch(
    `https://api.pizzaraulsap.com/api/CajaTienda/GetCajaDetallado?fecha=${date}&tienda=${storeIdEfis}`,
  )
  const fdata = await data.json()
  if (!fdata.isSuccess)
    throw new Error(
      'Error en la api .net' + (fdata.messageError ?? 'Error en la api .net'),
    )
  return fdata.result as INetCashMove[]
}

export const compareEfis = async (
  dates: [string, string],
): Promise<ICompareEfis[]> => {
  return baseUrl<ICompareEfis[]>('store/cash-moves/compare-balances', {
    query: {
      dates: dates,
    },
  })
}

export const netInitialBalance = async (
  storeIdEfis: string,
  date: string,
): Promise<number> => {
  const data = await fetch(
    `https://api.pizzaraulsap.com/api/CajaTienda/GetSaldoInicialEfisis?fecha=${date}&codTienda=${storeIdEfis}`,
  )
  const fdata = await data.json()
  if (!fdata.isSuccess)
    throw new Error(
      'Error en la api .net' + (fdata.messageError ?? 'Error en la api .net'),
    )
  return fdata.result[0]?.saldoInicial ?? NaN
}

export const getInfoMethodPayments = (
  date: string,
  exclude = [] as string[],
) => {
  return baseUrl<IInfoPaymentMethod[]>(
    `store/reconcile-payment-methods?date=${date}&${arrayToQueryString(
      'exclude',
      exclude,
    )}`,
  )
}

export const getAmountByPos = (
  sucursal: string,
  date: string,
  exclude?: string[],
) => {
  return baseUrl<IInfoPos[]>(
    `store/amount-by-pos?sucursalcode=${sucursal}&date=${date}&${arrayToQueryString(
      'exclude',
      exclude ?? [],
    )}`,
  )
}
export const getAllTerminalsBySucursal = (sucursal: string) => {
  return baseUrl<
    {
      id: number
      terminal: string
      sucursal_id: string
      supplier: string
      status: 1 | 0
      created_at: string
      updated_at: string
    }[]
  >(`terminalPost/filter?sucursal_id[]=equal&sucursal_id[]=${sucursal}`)
}

export const getTransactionsByMethod = (
  sucursal: string,
  method: string,
  date: string,
  exclude?: string[],
) => {
  return baseUrl<ITransactionOfMethod[]>(
    `store/transaction-by-method?sucursalcode=${sucursal}&date=${date}&method=${method}&${arrayToQueryString(
      'exclude',
      exclude ?? [],
    )}`,
  )
}

export const categories = () => baseUrl<ICategory[]>('store/get-categories')

export const cashAccount = () =>
  baseUrl<ICashAccount[]>('store/get-cash-accounts')

export const closeStoreCashAccounts = async (
  cashAccountIds: number[],
  date: string,
  force?: boolean,
  replace?: boolean,
): Promise<string[] | null> => {
  const body = {
    cashAccountIds,
    date,
    type: 'store',
    force,
    replace,
  }
  const token = localStorage.getItem(ITEM.TOKEN)
  const result = await fetch(`${config.API}/store/close-cash-accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
  const data = await result.json()
  if (result.status != 200 && !data.logs) throw new Error(data.message)
  return data.logs
}

export const balanceReportStore = async (dates: [string, string]) => {
  return baseUrl<{ [key: string]: CashBalanceStatus }>('store/balance-report', {
    query: { dates, module: 'store' },
  })
}

export const initialBalanceStore = async (storeId: number, date: string) => {
  return baseUrl<{ balance: number; status: CashBalanceStatus }>(
    'store/initial-balance-store',
    {
      query: { cashAccountId: storeId, date },
    },
  )
}

export const firmarMetodoPago = async (
  cashId: number,
  date: string,
  sucursalcode: string,
  culqiAmount?: number,
  izipayAmount?: number,
) => {
  return baseUrl<void>(`store/reconcile-payment-methods/sign`, {
    method: 'PUT',
    body: {
      date,
      cashId,
      sucursalCode: sucursalcode,
      culqiAmount,
      izipayAmount,
    },
  })
}

export const loadFromEfisis = async (date: string) => {
  return baseUrl('store/load-from-efisis', {
    method: 'POST',
    body: {
      date,
    },
  })
}

export const startJob = async (jobName: string) => {
  return baseUrl<string>('awsServices/startJob', {
    method: 'POST',
    body: {
      name: jobName,
    },
  })
}

export const verifyStatusJob = async (jobId: string, jobName: string) => {
  return baseUrl<{
    status: 'FAILED' | 'RUNNING' | 'SUCCEEDED'
    errorMessage: string
  }>('awsServices/verifyStatusJob', {
    method: 'POST',
    body: {
      jobId,
      name: jobName,
    },
  })
}

export const getListJobs = async () => {
  return baseUrl<string[]>('awsServices/getProcessGlu', {
    method: 'GET',
  })
}
