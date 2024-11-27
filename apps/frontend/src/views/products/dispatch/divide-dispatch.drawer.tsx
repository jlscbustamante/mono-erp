import { divideDispatch } from '@/data/hex/inventory'
import { Dispatch, DispatchItem, WAREHOUSE_TYPE } from '@/data/hex/types'
import { useDefaultWarehouse } from '@/hooks/data/iventory/use-default-warehouse'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Modal, Select, Table } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'
import { useSucursales } from '../components/stock/hooks/useSucursales'

const divideDispatchAtom = atom<boolean>({
  key: 'useDivideDispatchAtom',
  default: false,
})

export const useDivideDispatchDrawer = () => {
  const [dispatch, setDispatch] = useRecoilState(divideDispatchAtom)

  return {
    isOpen: !!dispatch,
    open: () => setDispatch(true),
    close: () => setDispatch(false),
  }
}

export const DivideDispatchDrawer = ({
  dispatch,
  onFinish,
}: {
  dispatch: Dispatch
  onFinish?: () => void
}) => {
  const { isOpen, close } = useDivideDispatchDrawer()
  return (
    <Drawer
      open={isOpen}
      width={800}
      title="Dividir despacho por almacen"
      onClose={close}
    >
      {!isOpen && (
        <div className="text-center my-3">No hay un despacho seleccionado</div>
      )}
      {dispatch && (
        <Content
          dispatch={dispatch}
          onFinish={() => {
            close()
            onFinish?.()
          }}
        />
      )}
    </Drawer>
  )
}

const Content = ({
  dispatch,
  onFinish,
}: {
  dispatch: Dispatch
  onFinish?: () => void
}) => {
  const warehousesAll = useSucursales()
  const { data: defaultWarehouse } = useDefaultWarehouse()
  const [relation, setRelation] = useState<
    { dispatchItemId: number; warehouseCode: string | undefined }[]
  >(
    dispatch.items.map((el) => ({
      dispatchItemId: el.id,
      warehouseCode: undefined,
    })),
  )
  const warehouses = useMemo(() => {
    return (
      warehousesAll.data?.filter((w) => w.type === WAREHOUSE_TYPE.WAREHOUSE) ??
      []
    )
  }, [warehousesAll])

  const divideDispatchMt = useMutation({
    mutationFn: divideDispatch,
    onError: (err) => {
      toast.error(err.message, { autoClose: false })
    },
    onSuccess: () => {
      onFinish?.()
    },
  })

  const handleDispatch = () => {
    if (relation.some((el) => el.warehouseCode == undefined)) {
      toast.error('Todos los almacenes son obligatorios', {
        autoClose: false,
      })
      return
    }

    const uniqueWarehouses = Array.from(
      new Set(relation.map((el) => el.warehouseCode)),
    )
    if (uniqueWarehouses.length < 2) {
      toast.error('Todos los almacenes son iguales', {
        autoClose: false,
      })
      return
    }

    Modal.confirm({
      title: 'Dividir despacho',
      content: '¿Estas seguro de dividir este despacho?',
      onOk: () => {
        divideDispatchMt.mutate({
          dispatchId: dispatch.id,
          relation: relation.map((el) => ({
            dispatchItemId: el.dispatchItemId,
            warehouseId: el.warehouseCode!,
          })),
        })
      },
    })
  }

  useEffect(() => {
    setRelation(
      relation.map((el) => {
        return {
          ...el,
          warehouseCode: defaultWarehouse ?? undefined,
        }
      }),
    )
  }, [defaultWarehouse])

  return (
    <div className="">
      <div className="flex justify-end mb-3">
        <Button
          type="primary"
          onClick={handleDispatch}
          loading={divideDispatchMt.isPending}
        >
          Dividir
        </Button>
      </div>
      <Table
        size="small"
        pagination={false}
        rowKey={'itemId'}
        dataSource={dispatch.items}
        columns={[
          {
            title: 'Item de inventario',
            dataIndex: 'itemName',
          },
          {
            title: 'Almacen',
            width: 200,
            render: (_, record: DispatchItem) => {
              const item = relation.find((el) => el.dispatchItemId == record.id)
              return (
                <>
                  <Select
                    className="w-full"
                    size="small"
                    value={item?.warehouseCode}
                    onChange={(val) => {
                      setRelation(
                        relation.map((el) => {
                          if (el.dispatchItemId == record.id) {
                            return {
                              ...el,
                              warehouseCode: val,
                            }
                          }
                          return el
                        }),
                      )
                    }}
                  >
                    {warehouses.map((w) => (
                      <Select.Option key={w.code} value={w.code}>
                        {w.name}
                      </Select.Option>
                    ))}
                  </Select>
                </>
              )
            },
          },
        ]}
      />
    </div>
  )
}
