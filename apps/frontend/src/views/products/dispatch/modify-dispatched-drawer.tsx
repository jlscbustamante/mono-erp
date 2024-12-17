/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Drawer,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
} from 'antd'
import { useMemo, useState } from 'react'
import { atom, useRecoilState } from 'recoil'

import {
  DispatchItem,
  DispatchItemAddDto,
  DispatchUpdateDto,
} from '@/data/hex/types'
import { cn, fCurrency, filterSelectForm } from '@/utils'

import { modifyDispatched } from '@/data/hex/inventory'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useItems } from '../hooks/use-items'
import { StatusTag } from './status-tag'
import { useDispatchDetail } from './use-dispatch-detail'

type Action = 'edit' | 'delete'

interface DispatchItemMod extends DispatchItemAddDto {
  action: Action | null
}

const modifyDispatchAtom = atom<number | null>({
  key: 'modifyDispatchAtom',
  default: null,
})

export const useModifyDispatchDrawer = () => {
  const [isOpen, setIsOpen] = useRecoilState(modifyDispatchAtom)
  const close = () => setIsOpen(null)
  const open = (id: number) => setIsOpen(id)

  return {
    isOpen: !!isOpen,
    close,
    open,
    dispatchId: isOpen,
  }
}

export const ModifyDispatchedDrawer = ({
  onUpdate,
}: {
  onUpdate?: () => void
}) => {
  const { dispatchId, isOpen, close } = useModifyDispatchDrawer()
  const query = useDispatchDetail(dispatchId)
  return (
    <>
      <Drawer
        title="Modificación de despacho"
        open={isOpen}
        onClose={close}
        width={800}
      >
        {query.data && (
          <ModifyDispatchInformation
            dispatch={query.data}
            onFinish={() => {
              onUpdate?.()
              close()
            }}
          />
        )}
        {/* {query.data && <ModifyDispatchStructure dispatch={query.data} />} */}
      </Drawer>
    </>
  )
}

const ModifyDispatchInformation = ({
  dispatch: _dispatch,
  onFinish,
}: {
  dispatch: DispatchUpdateDto
  onFinish?: () => void
}) => {
  const [dispatch, setDispatch] = useState(_dispatch)
  const [openList, setOpenList] = useState(false)

  const [items, setItems] = useState<DispatchItemMod[]>(
    dispatch.items.map((el) => ({
      ...el,
      action: null,
    })),
  )
  const toDelete = useMemo(
    () => items.filter((el) => el.action == 'delete').length,
    [items],
  )
  const toCreate = useMemo(
    () => items.filter((el) => el.action == 'edit' && !el.id).length,
    [items],
  )
  const toUpdate = useMemo(
    () => items.filter((el) => el.action == 'edit' && el.id).length,
    [items],
  )

  const enableModification = useMemo(() => {
    if (toDelete == 0 && toCreate == 0 && toUpdate == 0) return false
    if (dispatch.taxValue == _dispatch.taxValue) return true
    if (items.length == 0) return false
    return true
  }, [items, toDelete, toCreate, toUpdate, dispatch])

  // const modifyDispatchMt = useMutation({
  //   mutationFn: async () => {},
  // })

  const modifyDispatchedMt = useMutation({
    mutationFn: modifyDispatched,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      onFinish?.()
    },
  })

  const handleModify = () => {
    const data = {
      dispatchId: dispatch.id,
      toCreate: items
        .filter((el) => el.action == 'edit' && !el.id)
        .map(({ action, ...rest }) => rest) as DispatchItemAddDto[],
      toUpdate: items
        .filter((el) => el.action == 'edit' && el.id)
        .map(({ action, ...rest }) => rest) as DispatchItem[],
      toDelete: items
        .filter((el) => el.action == 'delete' && el.id)
        .map(({ action, ...rest }) => rest) as DispatchItem[],
      taxValue: dispatch.taxValue,
    }
    modifyDispatchedMt.mutate(data)
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-slate-700">
            MODIFICANDO DESPACHO : {dispatch.id}
          </p>
          <StatusTag status={dispatch.status} />
        </div>

        <DispatchInformation dispatch={dispatch} />
        <div className="my-4">
          {/* <Divider> */}
          <p>
            {dispatch.items.length} items en la lista.{' '}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setOpenList(true)}
            >
              Editar items
            </span>
          </p>
          {/* </Divider> */}
          <SummaryDispatch
            dispatch={dispatch}
            setDispatch={setDispatch}
            items={items}
            enableModification={enableModification}
          />
          <div className="mt-3">
            <div className="mb-3">
              <p className="mb-2 font-semibold">Cambios : </p>
              <p>Modificados: {toUpdate}</p>
              <p>Eliminados : {toDelete}</p>
              <p>Agregados: {toCreate}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              disabled={!enableModification}
              type="primary"
              loading={modifyDispatchedMt.isPending}
              onClick={() =>
                Modal.confirm({
                  title: '¿Estás seguro de modificar el pedido?',
                  content:
                    'Modificar un pedido despachado tambien cambiara el inventario de la tienda. Si la tienda ya ha cerrado, esta accion se cancelara.',
                  okText: 'Continuar',
                  cancelText: 'Cancelar',
                  onOk: handleModify,
                })
              }
            >
              Modificar despacho
            </Button>
          </div>
        </div>
      </div>
      <Drawer
        open={openList}
        onClose={() => setOpenList(false)}
        width={780}
        title={'EDITAR DESAPCHO DE ' + dispatch.wareToName}
      >
        <ModifyDispatchStructure
          dispatch={dispatch}
          items={items}
          setItems={setItems}
        />
      </Drawer>
    </>
  )
}

const SummaryDispatch = ({
  dispatch,
  setDispatch,
  items,
  enableModification,
}: {
  dispatch: DispatchUpdateDto
  setDispatch: (dispatch: DispatchUpdateDto) => void
  items: DispatchItemMod[]
  enableModification: boolean
}) => {
  const changeTax = (value: number) => {
    setDispatch({
      ...dispatch,
      taxValue: value,
      totalValue: value + dispatch.netValue,
    })
  }
  const netValue = useMemo(() => {
    return (
      items.reduce((acc, el) => {
        return acc + el.totalValue
      }, 0) ?? 0
    )
  }, [items])
  const totalValue = useMemo(() => {
    const netValue =
      items.reduce((acc, el) => {
        return acc + el.totalValue
      }, 0) ?? 0
    return netValue + dispatch.taxValue
  }, [items, dispatch])
  return (
    <div>
      <ul className="w-80 space-y-2 mt-4 mb-8">
        {/* <li className="grid grid-cols-2 justify-items-end"> */}
        <li className="grid grid-cols-2">
          <span>Neto:</span>
          <p className="flex items-center gap-2">
            <span
              className={cn('text-red-500 line-through', {
                hidden: !enableModification,
              })}
            >
              {fCurrency(dispatch.netValue)}
            </span>
            <span>{fCurrency(netValue)}</span>
          </p>
        </li>
        <li className="grid grid-cols-2 hidden">
          <span>IGV:</span>
          <div>
            <InputNumber
              precision={2}
              min={0}
              value={dispatch.taxValue}
              onChange={(val) => {
                changeTax(val ?? 0)
              }}
              size="small"
            />
          </div>
        </li>
        <li className="grid grid-cols-2">
          <span>Valor total:</span>
          <p className="flex items-center gap-2">
            <span
              className={cn('text-red-500 line-through', {
                hidden: !enableModification,
              })}
            >
              {fCurrency(dispatch.netValue)}
            </span>

            <span>{fCurrency(totalValue)}</span>
          </p>
        </li>
      </ul>
    </div>
  )
}

const DispatchInformation = ({ dispatch }: { dispatch: DispatchUpdateDto }) => {
  return (
    <ul className="w-80 space-y-1 my-2">
      <li className="grid grid-cols-2">
        <span>Fecha de despacho:</span>
        <span>{dispatch.dispatchAt}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Origen:</span>
        <span>{dispatch.wareFromName}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Destino:</span>
        <span>{dispatch.wareToName}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Registrado por:</span>
        <span>{dispatch.requestBy}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Descripción:</span>
        <span>{dispatch.gloss}</span>
      </li>
    </ul>
  )
}

const ModifyDispatchStructure = ({
  dispatch,
  items,
  setItems,
}: {
  dispatch: DispatchUpdateDto
  items: DispatchItemMod[]
  setItems: (items: DispatchItemMod[]) => void
}) => {
  const queryItems = useItems()
  const [itemSelected, setItemSelected] = useState(0)

  const onChangeQuantity = (itemId: number, quantity: number) => {
    setItems(
      items.map((el) => {
        if (el.itemId === itemId && el.action != 'delete') {
          const totalValue = Number((quantity * el.unitValue).toFixed(2))
          return {
            ...el,
            quantity,
            totalValue,
            action: 'edit',
          }
        }
        return el
      }),
    )
  }

  const removeItem = (itemId: number) => {
    setItems(
      items
        .map((el) => {
          if (el.itemId === itemId) {
            if (el.id) {
              return {
                ...el,
                action: 'delete',
              }
            }
            return null
          }
          return el
        })
        .filter((el) => el) as DispatchItemMod[],
    )
  }

  const addItem = () => {
    const itemDb = queryItems.data?.find((el) => el.id === itemSelected)
    if (!itemDb) return
    const alreadyAdded = items.find((el) => el.itemId === itemDb.id)
    if (alreadyAdded && alreadyAdded.action != 'delete') {
      message.warning('El item ya fue agregado')
      return
    }
    const newItems: DispatchItemMod[] = [
      ...items,
      {
        id: undefined,
        itemId: itemDb.id,
        itemName: itemDb.name,
        unitValue: itemDb.storePrice,
        quantity: 1,
        totalValue: itemDb.storePrice,
        dispatchId: dispatch.id,
        measureId: itemDb.measureId,
        presentationId: itemDb.presentationId,
        presentationName: itemDb.presentationName,
        action: 'edit',
      },
    ]
    setItems(newItems.sort((a, b) => a.itemName.localeCompare(b.itemName)))
    setItemSelected(0)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Select
          className="w-full max-w-xl"
          value={itemSelected == 0 ? undefined : itemSelected.toString()}
          onChange={(val) => setItemSelected(+val)}
          size="small"
          filterOption={filterSelectForm}
          showSearch
        >
          {queryItems.data?.map((el) => (
            <Select.Option key={el.id} value={el.id.toString()}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
        <Button size="small" onClick={addItem}>
          Agregar
        </Button>
      </div>
      <Table
        rowKey={(data) => {
          const id = data.id ?? Math.random()
          return `${data.itemId}-${id}`
        }}
        pagination={false}
        size="small"
        bordered={true}
        dataSource={items.filter((el) => el.action != 'delete')}
        onRow={(record: DispatchItemMod) => {
          if (record.action == 'edit') {
            return {
              style: {
                backgroundColor: '#e0f2fe',
              },
            }
          }
          return {}
        }}
        columns={[
          {
            title: 'Id',
            dataIndex: 'itemId',
          },
          {
            title: 'Item de inventario',
            dataIndex: 'itemName',
          },
          {
            title: 'Precio',
            dataIndex: 'unitValue',
          },
          {
            title: 'Cantidad',
            dataIndex: 'quantity',
            render: (val: any, record: DispatchItemMod) => {
              return (
                <InputNumber
                  value={val}
                  min={0}
                  precision={3}
                  onChange={(val) => {
                    onChangeQuantity(record.itemId, val)
                  }}
                />
              )
            },
          },
          {
            title: 'Total',
            dataIndex: 'totalValue',
          },
          {
            title: '',
            render: (_: any, record: DispatchItemMod) => {
              return (
                <p
                  className="text-blue-500 hover:underline cursor-pointer text-center"
                  onClick={() => removeItem(record.itemId)}
                >
                  Remover
                </p>
              )
            },
          },
        ]}
      />
    </div>
  )
}
