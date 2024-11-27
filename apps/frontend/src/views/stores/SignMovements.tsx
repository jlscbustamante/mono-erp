import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import { ICategory } from '@/data/category/types'
import { cashAccountStoreSt, categoriesStoreSt } from '@/data/resources/state'
import * as sdk from '@/data/stores/sdk'
import {
  cashMovesSt,
  dateFilterSt,
  endingBalanceSt,
  initialBalanceSt,
  netCashMovesSt,
  netEndingBalanceSt,
  netInitialBalanceSt,
  storeFilterSt,
} from '@/data/stores/state'
import { CashMoveStatus, ICashMove, INetCashMove } from '@/data/stores/types'
import { Filters, OpFilter } from '@/data/types/Filters'
import { filterOption, safeAny } from '@/utils'

import { ControlAdminMovements } from './components/ControlAdmin'
import { EfisisMovements } from './components/ControlEfisis'

export default function SignMovements() {
  const dateFilter = useRecoilValue(dateFilterSt)
  const storeFilter = useRecoilValue(storeFilterSt)
  const setCashMoves = useSetRecoilState(cashMovesSt)
  const cashAccounts = useRecoilValue(cashAccountStoreSt)
  const categories = useRecoilValue(categoriesStoreSt)
  const setNetCashMoves = useSetRecoilState(netCashMovesSt)
  const setNetInitialBalance = useSetRecoilState(netInitialBalanceSt)
  const setInitialBalance = useSetRecoilState(initialBalanceSt)
  const endingBalance = useRecoilValue(endingBalanceSt)
  const netEndingBalance = useRecoilValue(netEndingBalanceSt)
  const [loading, setLoading] = useState(false)
  const [isErrorNet, setIsErrorNet] = useState(false)

  function esperarApi(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Error('Tiempo de espera excedido'))
      }, ms)
    })
  }
  const loadNetInfo = async (codefis: string, dateFilter: string) => {
    try {
      setIsErrorNet(false)
      const initialBalanceNet = await Promise.race([
        sdk.netInitialBalance(codefis, dateFilter),
        esperarApi(7000),
      ])
      if (initialBalanceNet instanceof Error) {
        throw initialBalanceNet
      }
      const dataNet = await Promise.race([
        sdk.netMoves(codefis, dateFilter),
        esperarApi(7000),
      ])
      if (dataNet instanceof Error) {
        console.log(dataNet)
        throw dataNet
      }
      return {
        initialBalanceNet,
        dataNet,
      } as {
        initialBalanceNet: number
        dataNet: INetCashMove[]
      }
    } catch (err: any) {
      setIsErrorNet(true)
    }
  }

  const applyFilters = async () => {
    try {
      if (loading) return
      setLoading(true)
      setCashMoves([])
      setInitialBalance({ balance: 0, status: CashMoveStatus.Closed })
      if (!storeFilter || !dateFilter) return
      const cash = cashAccounts.find((cc) => cc.id === storeFilter)!
      const filters: Filters<ICashMove> = {}
      filters.cash_id = [OpFilter.Equal, storeFilter]
      filters.requested_at = [OpFilter.EqualDate, dateFilter]
      filters.status = [
        OpFilter.In,
        CashMoveStatus.Active,
        CashMoveStatus.Closed,
        CashMoveStatus.Registered,
        CashMoveStatus.Signed,
      ]
      const [cashMoves, initialBalance] = await Promise.all([
        sdk.filter(filters),
        // sdk.netMoves(cash.codefis, dateFilter),
        // sdk.netInitialBalance(cash.codefis, dateFilter),
        sdk.initialBalanceStore(storeFilter, dateFilter),
      ])

      const _dataNet = await loadNetInfo(cash.codefis, dateFilter)
      if (_dataNet) {
        const { dataNet, initialBalanceNet } = _dataNet
        const stopAndReload = await saveCashMovesFromEfisis(cashMoves, dataNet)
        if (stopAndReload) applyFilters()
        else {
          setNetInitialBalance({ balance: initialBalanceNet })
          setNetCashMoves(dataNet)
          if (
            !isNaN(endingBalance.balance) &&
            !isNaN(netEndingBalance.balance) &&
            endingBalance.balance.toFixed(2) !=
              netEndingBalance.balance.toFixed(2)
          )
            toast.warning('Los saldos finales de caja no cuadran', {
              autoClose: false,
              closeOnClick: true,
              position: 'bottom-left',
            })
        }
      }
      setCashMoves(cashMoves)
      setInitialBalance({
        balance: initialBalance.balance,
        status: initialBalance.status,
      })
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
    } finally {
      setLoading(false)
    }
  }

  const saveCashMovesFromEfisis = async (
    cashMoves: ICashMove[],
    netCashMoves: INetCashMove[],
  ): Promise<boolean | undefined> => {
    try {
      if (cashMoves.length > 0 || netCashMoves.length === 0) return false
      const moves: Partial<ICashMove>[] = []
      const cashAccount = cashAccounts.find((cc) => cc.id === storeFilter)!
      const idNot = toast.loading('Cargando datos...', {
        position: 'bottom-left',
        type: 'info',
      })
      netCashMoves.forEach((move) => {
        console.log(move)
        let category: ICategory | null | undefined = categories.find(
          (cc) => cc.id === move.idCatDep,
        )
        if (!category) category = null
        // throw new Error(
        //   `Cargando datos, error. La categoria ${move.idCatDep} no fue encontrada`,
        // )
        moves.push({
          description: move.descripcion,
          amount: move.valor,
          cash_id: cashAccount.id,
          account_flow: category ? category.account_flow : null,
          cash_account_id: cashAccount.account_id as number,
          category_expense_id: category ? category.id : null,
          category_account_id: category ? category.account_id : null,
          requested_at: dateFilter,
        })
      })
      await sdk.createMoves(moves)
      toast.update(idNot, {
        render: 'Movimientos guardados',
        autoClose: 2000,
        closeOnClick: true,
        isLoading: false,
      })
      return true
    } catch (err: any) {
      console.log(err)
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <div className="container mx-auto mb-8 p-3">
      <FiltersComponent applyFilters={applyFilters} loading={loading} />
      <div className="flex gap-4 justify-center">
        <EfisisMovements isError={isErrorNet} />
        <ControlAdminMovements applyFilters={applyFilters} />
      </div>
    </div>
  )
}

const FiltersComponent: React.FC<{
  applyFilters: () => void
  loading: boolean
}> = ({ loading, applyFilters }) => {
  const [dateFilter, setDateFilter] = useRecoilState(dateFilterSt)
  const [storeFilter, setStoreFilter] = useRecoilState(storeFilterSt)
  const cashAccounts = useRecoilValue(cashAccountStoreSt)
  return (
    <div className="flex gap-2 my-4">
      <DatePicker
        allowClear={false}
        value={dayjs(dateFilter)}
        onChange={(e: safeAny) => {
          setDateFilter(e.format('YYYY-MM-DD'))
        }}
      />
      <Select
        showSearch
        placeholder="Select a Tienda"
        optionFilterProp="children"
        filterOption={filterOption as safeAny}
        onChange={(e) => {
          setStoreFilter(e)
        }}
        value={storeFilter}
        style={{ width: 210 }}
        options={cashAccounts.map((el) => ({
          value: el.id,
          label: el.name,
        }))}
      />
      <Button type="primary" onClick={applyFilters} loading={loading}>
        Seleccionar
      </Button>
    </div>
  )
}
