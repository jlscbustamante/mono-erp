import { atom, RecoilState, selector } from 'recoil'

import { CategoryTypeMove } from '@/data/category/types'
import { CashBalanceStatus } from '@/data/types'

import { IFilteredCashMove, INetCashMove } from '../types'

export const cashMovesSt: RecoilState<IFilteredCashMove[]> = atom({
  key: 'cashMovesFilteredst',
  default: [] as IFilteredCashMove[],
})

export const netCashMovesSt: RecoilState<INetCashMove[]> = atom({
  key: 'cashMovesEfisis',
  default: [] as INetCashMove[],
})

export const initialBalanceSt: RecoilState<{
  balance: number
  status: CashBalanceStatus
}> = atom({
  key: 'initialBalanceStore',
  default: {
    balance: NaN,
    status: null,
  } as {
    balance: number
    status: CashBalanceStatus
  },
})

export const cashIsReadOnlySt = selector({
  key: 'cashIsReadOnlycashmoves',
  get: ({ get }) => {
    const initialBalance = get(initialBalanceSt)
    if (initialBalance.status == 'C' || initialBalance.status == 'T')
      return true
    return false
  },
})

export const netInitialBalanceSt: RecoilState<{
  balance: number
}> = atom({
  key: 'netInitialBalancest',
  default: {
    balance: NaN,
  },
})

export const netEndingBalanceSt = selector({
  key: 'Selc_netEndingBalanceStore',
  get: ({ get }) => {
    const netInitialBalance = get(netInitialBalanceSt)
    if (isNaN(netInitialBalance.balance)) return { balance: NaN }
    const netCashMoves = get(netCashMovesSt)
    const finalBalance = netCashMoves.reduce((acc, move) => {
      if (move.tipo == 'F' || move.tipo == 'G') return acc - move.valor
      return acc + move.valor
    }, netInitialBalance.balance)
    return { balance: finalBalance }
  },
})

export const endingBalanceSt = selector({
  key: 'Selc_endingBalanceStore',
  get: ({ get }) => {
    const initialBalance = get(initialBalanceSt)
    if (isNaN(initialBalance.balance)) return { balance: NaN }
    const cashMoves = get(cashMovesSt)
    const finalBalance = cashMoves.reduce((acc, move) => {
      if (move.category?.type_mov === CategoryTypeMove.Expense)
        return acc - move.amount
      else if (move.category?.type_mov === CategoryTypeMove.Sale)
        return acc + move.amount
      return acc
    }, initialBalance.balance)
    return { balance: finalBalance }
  },
})
