import { Button, Card, InputNumber, List, Modal, Popover, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Link from 'antd/es/typography/Link'
import { useEffect, useMemo, useState } from 'react'
import { FaEraser } from 'react-icons/fa'
import { GrTextAlignCenter } from 'react-icons/gr'
import { MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue } from 'recoil'

// import { StoreDisabledCategories } from '@/const'
import { NOTIFICATION } from '@/const/notification'
// import * as cashAccountSdk from '@/data/cashAccount/sdk'
import { CategoryTypeMove, ICategory } from '@/data/category/types'
import { resetStoreData } from '@/data/hex/movements'
import { cashAccountStoreSt, categoriesStoreSt } from '@/data/resources/state'
import * as sdk from '@/data/stores/sdk'
import {
  cashIsReadOnlySt,
  cashMovesSt,
  dateFilterSt,
  endingBalanceSt,
  initialBalanceSt,
  storeFilterSt,
} from '@/data/stores/state'
import {
  CashMoveStatus,
  ICashMove,
  IFilteredCashMove,
} from '@/data/stores/types'
import { filterOption, safeAny } from '@/utils'
import { fNumber } from '@/utils/formatNumber'
import { useMutation } from '@tanstack/react-query'

export const ControlAdminMovements: React.FC<{
  applyFilters: () => Promise<void>
}> = ({ applyFilters }) => {
  const cashMoves = useRecoilValue(cashMovesSt)
  const categories = useRecoilValue(categoriesStoreSt)
  const cashAccounts = useRecoilValue(cashAccountStoreSt)
  const dateFilter = useRecoilValue(dateFilterSt)
  const storeFilter = useRecoilValue(storeFilterSt)
  const [isCreating, setIsCreating] = useState(false)
  const initialBalance = useRecoilValue(initialBalanceSt)
  const cashIsReadOnly = useRecoilValue(cashIsReadOnlySt)
  const endingBalance = useRecoilValue(endingBalanceSt)
  const [newCashMove, setNewCashMove] = useState<Partial<ICashMove>>({
    description: '',
    amount: 0,
  })

  const handlerClose = async () => {
    try {
      if (!storeFilter || !dateFilter) return
      const idNot = toast.loading('Cerrando caja...', NOTIFICATION.loading)
      if (cashMoves.some((e) => e.status == CashMoveStatus.Active))
        throw new Error(
          'No se puede cerrar una caja con movimientos sin firmar',
        )
      const logs = await sdk.closeStoreCashAccounts([storeFilter], dateFilter)
      if (logs) {
        toast.dismiss()
        logs.forEach((log) => {
          toast.error(log, {
            ...NOTIFICATION.error,
            autoClose: false,
          })
        })
        return
      }
      await applyFilters()
      toast.update(idNot, {
        render: 'La caja fue cerrada correctamente',
        isLoading: false,
        ...NOTIFICATION.info,
      })
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const handlerCreate = async () => {
    try {
      const cash = cashAccounts.find((cc) => cc.id === storeFilter)!
      const cashMove: Partial<ICashMove> = Object.assign({}, newCashMove)
      cashMove.requested_at = dateFilter
      cashMove.cash_id = cash.id
      cashMove.cash_account_id = cash.account_id as number
      setIsCreating(true)
      await sdk.createMove(cashMove)
      await applyFilters()
      clearNewData()
      toast.info('Movimiento registrado', NOTIFICATION.info)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsCreating(false)
    }
  }
  const cancelCreation = () => {
    setIsCreating(false)
    clearNewData()
  }
  const clearNewData = () => {
    setNewCashMove({
      description: '',
      amount: 0,
    })
  }

  const resetStoreDataMt = useMutation({
    mutationFn: resetStoreData,
    onSuccess: async () => {
      await applyFilters()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })

  const btnAvailable = useMemo(() => {
    if (!storeFilter || !dateFilter) return false
    return true
  }, [storeFilter, dateFilter])

  const handleResetDat = () => {
    if (!storeFilter || !dateFilter) return
    Modal.confirm({
      title: '¿Desea actualizar los movimientos?',
      content:
        'Se eliminaran los movimientos actuales y se traera los movimientos del pos',
      onOk: () => {
        resetStoreDataMt.mutate({
          cashId: storeFilter,
          date: dateFilter,
        })
      },
    })
  }

  return (
    <div style={{ width: '100%', maxWidth: 700 }}>
      <div className="p-1 flex justify-end">
        <Button
          size="small"
          type="primary"
          onClick={handleResetDat}
          loading={resetStoreDataMt.isPending}
          disabled={!btnAvailable}
        >
          Actualizar movimientos(pos)
        </Button>
      </div>
      <Card>
        <List
          header={
            <div className="flex justify-between font-bold">
              <span>SALDO INICIAL</span>{' '}
              <span>
                {isNaN(initialBalance.balance)
                  ? '0.00'
                  : fNumber(initialBalance.balance)}
              </span>
            </div>
          }
          footer={
            <div className="flex justify-between font-bold">
              <span>SALDO FINAL</span>{' '}
              <span>
                {isNaN(endingBalance.balance)
                  ? '0.00'
                  : fNumber(endingBalance.balance)}
              </span>
            </div>
          }
        >
          {cashMoves.length > 0 &&
            cashMoves.map((item, index) => (
              <ItemMove
                item={item}
                index={index}
                key={item.id}
                applyFilters={async () => {
                  applyFilters()
                }}
              />
            ))}
        </List>
      </Card>
      {cashIsReadOnly ? (
        <div className="p-3 text-center mt-3">
          Esta caja ya esta cerrada o registrada en este fecha
        </div>
      ) : (
        <ActionsBoxCash
          {...{
            isCreating,
            setIsCreating,
            newCashMove,
            categories,
            handlerCreate,
            cancelCreation,
            setNewCashMove,
            storeFilter,
            handlerClose,
          }}
        />
      )}
    </div>
  )
}
const ActionsBoxCash: React.FC<{
  isCreating: boolean
  setIsCreating: safeAny
  newCashMove: Partial<ICashMove>
  categories: ICategory[]
  handlerCreate: () => void
  handlerClose: () => void
  cancelCreation: () => void
  setNewCashMove: (newCashMove: Partial<ICashMove>) => void
  storeFilter: number | null
}> = ({
  isCreating,
  newCashMove,
  setNewCashMove,
  categories,
  handlerCreate,
  cancelCreation,
  setIsCreating,
  storeFilter,
  handlerClose,
}) => {
  return (
    <div>
      <div
        className="items-center gap-2 my-6"
        style={{ display: isCreating ? 'flex' : 'none' }}
      >
        <Select
          showSearch
          placeholder="Select a categoria"
          optionFilterProp="children"
          style={{ width: 210 }}
          value={newCashMove.category_expense_id ?? null}
          filterOption={filterOption as safeAny}
          onChange={(e) => {
            const category = categories.find((el) => el.id === e)!
            setNewCashMove({
              ...newCashMove,
              category_expense_id: e,
              category_account_id: category.account_id,
              account_flow: category.account_flow,
            })
          }}
          options={categories.map((el) => ({
            value: el.id,
            label: el.name,
          }))}
        />
        <TextArea
          autoSize={true}
          style={{ width: 220 }}
          placeholder="descripcion"
          value={newCashMove.description}
          onChange={(e) => {
            setNewCashMove({ ...newCashMove, description: e.target.value })
          }}
        />
        <InputNumber
          prefix="S/"
          precision={2}
          style={{ width: 120 }}
          value={newCashMove.amount}
          onChange={(e) => {
            setNewCashMove({ ...newCashMove, amount: e ?? 0 })
          }}
        />
        <Button type="primary" onClick={handlerCreate}>
          Crear
        </Button>
        <Button danger onClick={cancelCreation} type="primary">
          Cancelar
        </Button>
      </div>
      <div
        className="flex justify-between my-4"
        style={{ display: !isCreating && storeFilter ? 'flex' : 'none' }}
      >
        <Button type="primary" onClick={() => setIsCreating(true)}>
          Agregar movimiento
        </Button>
        <Button
          type="primary"
          onClick={() => {
            Modal.confirm({
              centered: true,
              title: 'Cerrar caja',
              content: '¿Esta seguro? No se podra editar los movimientos luego',
              onOk: () => {
                handlerClose()
              },
            })
          }}
        >
          Cerrar caja
        </Button>
      </div>
    </div>
  )
}

const ItemMove: React.FC<{
  item: IFilteredCashMove
  applyFilters: () => Promise<void>
  index: number
}> = ({ item, applyFilters, index }) => {
  const categories = useRecoilValue(categoriesStoreSt)
  const [movement, setMovement] = useState<null | IFilteredCashMove>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [isReadonly, setIsReadonly] = useState(true)
  const cashIsReadOnly = useRecoilValue(cashIsReadOnlySt)
  const [movementsF, setMovementsF] = useRecoilState(cashMovesSt)

  const handlerChanges = (movementMod: IFilteredCashMove) => {
    setMovement(movementMod)
    setIsUpdating(true)
  }
  const cancelUpdate = () => {
    setMovement(item)
    setIsUpdating(false)
  }

  const handlerUpdate = async () => {
    try {
      setIsUpdating(false)
      setIsExecuting(true)
      await sdk.updateMove(movement!)
      toast.info('Movimiento actualizado', NOTIFICATION.info)
    } catch (err: any) {
      console.log(err)
      setMovement(item)
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsUpdating(false)
      setIsExecuting(false)
    }
  }
  const handlerDelete = async () => {
    try {
      setIsExecuting(true)
      await sdk.deleteMove(movement!.id)
      // setMovement(null)
      await applyFilters()
      toast.info('Movimiento eliminado', NOTIFICATION.info)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handlerSign = async () => {
    try {
      setIsExecuting(true)
      await sdk.sign(movement!.id)
      // await applyFilters()
      const element = Object.assign({}, movementsF[index])
      element.status = CashMoveStatus.Signed
      setMovementsF([
        ...movementsF.slice(0, index),
        element,
        ...movementsF.slice(index + 1),
      ])
      toast.info('Requerimiento firmado', NOTIFICATION.info)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handlerUnsign = async () => {
    try {
      setIsExecuting(true)
      await sdk.unsign(movement!.id)
      await applyFilters()
      // setMovement({ ...movement!, status: CashMoveStatus.Active })
      toast.info('Movimiento desfirmado', NOTIFICATION.info)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsExecuting(false)
    }
  }

  useEffect(() => {
    setMovement(item)
    setIsReadonly(item.status !== CashMoveStatus.Active)
  }, [item])

  return (
    <>
      {movement ? (
        <List.Item className="flex flex-col">
          <div className="flex justify-between gap-2 w-full items-center">
            <Select
              showSearch
              placeholder="Seleccionar Categoria"
              optionFilterProp="children"
              style={{ width: 210 }}
              value={movement.category_expense_id}
              filterOption={filterOption as safeAny}
              aria-readonly={isReadonly}
              onChange={(e) => {
                const category = categories.find((c) => c.id == e)!
                if (isReadonly) return
                handlerChanges({
                  ...movement,
                  category_expense_id: e,
                  category_account_id: category.account_id,
                  account_flow: category.account_flow,
                })
              }}
              options={categories.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
            />
            <Popover
              placement="bottom"
              trigger={'click'}
              content={
                <TextArea
                  value={movement.description}
                  readOnly={isReadonly}
                  onChange={(e) => {
                    handlerChanges({
                      ...movement,
                      description: e.target.value,
                    })
                  }}
                />
              }
            >
              <div>
                <GrTextAlignCenter className="cursor-pointer" />
              </div>
              {/* </Tooltip> */}
            </Popover>
            <InputNumber
              prefix="S/"
              readOnly={isReadonly}
              value={movement.amount}
              onChange={(e: safeAny) => {
                handlerChanges({
                  ...movement,
                  amount: e,
                })
              }}
              precision={2}
              step={0.01}
              style={{
                width: 120,
                borderColor:
                  movement.category?.type_mov === CategoryTypeMove.Expense
                    ? 'red'
                    : '',
              }}
            />
            <Button
              style={{ width: 80 }}
              type="primary"
              disabled={
                isExecuting || movement.status != CashMoveStatus.Active
                // ||
                // StoreDisabledCategories.includes(
                //   movement.category_expense_id ?? -1,
                // )
              }
              onClick={handlerSign}
            >
              {movement.status === CashMoveStatus.Signed ? 'Firmado' : 'Firmar'}
            </Button>
            <Button
              disabled={
                cashIsReadOnly ||
                isExecuting ||
                (movement.status == CashMoveStatus.Signed && !isReadonly)
              }
              type="primary"
              shape="circle"
              icon={<FaEraser />}
              onClick={() => {
                Modal.confirm({
                  centered: true,
                  title: '¿Quitar la firma?',
                  content:
                    '¿Seguro que desea quitar la firma de este movimiento? Esta accion sera informada',
                  onOk: () => {
                    handlerUnsign()
                  },
                })
              }}
              style={{
                display:
                  movement.status == CashMoveStatus.Active ? 'none' : 'initial',
              }}
            />
            <Button
              disabled={isExecuting}
              type="primary"
              shape="circle"
              danger
              icon={<MdDeleteOutline />}
              onClick={() => {
                Modal.confirm({
                  centered: true,
                  title: 'Eliminar movimiento',
                  content: '¿Seguro que desea eliminar este movimiento?',
                  onOk: () => {
                    handlerDelete()
                  },
                })
              }}
              style={{
                display:
                  movement.status == CashMoveStatus.Active ? 'initial' : 'none',
              }}
            />
          </div>
          <div
            className="my-2 flex justify-start w-full gap-8"
            style={{ display: isUpdating ? 'flex' : 'none' }}
          >
            <Link onClick={handlerUpdate}>Guardar cambios</Link>
            <Link onClick={cancelUpdate}>Cancelar</Link>
          </div>
        </List.Item>
      ) : null}
    </>
  )
}
