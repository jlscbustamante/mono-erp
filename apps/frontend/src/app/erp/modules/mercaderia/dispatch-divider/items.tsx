import { WAREHOUSE_TYPE } from '@/data/hex/types'
import { useSucursalSelect } from '@/hooks/selects/sucursal-select'
import { inventoryApi } from '@/lib/api/inventory'
import { viewClient } from '@/lib/rpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Select, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Item } from 'pizzadb'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

interface ItemRelation extends Item {
  storeCode: string
}

const defaultStoreCode = 'CORAL'

export const ListItems = () => {
  const sucursales = useSucursalSelect()
  const [sucursal, setSucursal] = useState<null | string>(null)

  const [newRelation, setNewRelation] = useState<Record<string, string> | null>(
    null,
  )

  const queryRelation = useQuery({
    queryKey: ['items-divider:relation'],
    queryFn: async () => {
      const result =
        await viewClient.api.view.inventory.readDividerRelation.$get()

      return result.json() as unknown as { data: Record<string, string> }
    },
    gcTime: 0,
  })

  const isEditMode = useMemo(() => newRelation, [newRelation])
  const editMode = (ava: boolean) => {
    if (ava) {
      const savedData = queryRelation.data?.data ?? {}
      setNewRelation(savedData)
    } else {
      setNewRelation(null)
    }
  }

  const query = useQuery({
    queryKey: ['items-divider'],
    gcTime: 0,
    queryFn: () =>
      inventoryApi.filterItems({
        select: {
          id: true,
          itemName: true,
        },
        order: {
          itemName: 'ASC',
        },
      }),
  })

  const sucursalName = useMemo(() => {
    const rel: Record<string, string> = {}
    for (const val of sucursales?.data ?? []) {
      rel[val.id] = val.title
    }
    return rel
  }, [sucursales])

  const items: ItemRelation[] = useMemo(() => {
    if (!query.data) return []
    const relations = queryRelation.data?.data ?? {}
    const result = query.data.map((item) => {
      return {
        ...item,
        storeCode: relations[item.id] ?? defaultStoreCode,
      }
    })
    if (sucursal) return result.filter((el) => el.storeCode == sucursal)
    return result
  }, [queryRelation.data, query.data, sucursal])

  const saveRelationMt = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      await viewClient.api.view.inventory.writeDividerRelation.$post({
        json: {
          data,
        },
      })
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      queryRelation.refetch()
      editMode(false)
    },
  })

  const handleSave = () => {
    const filtered: Record<string, string> = {}
    for (const [key, value] of Object.entries(newRelation ?? {})) {
      if (value == defaultStoreCode) continue
      filtered[key] = value
    }
    saveRelationMt.mutate(filtered)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-x-1">
          <Select
            className="w-48"
            allowClear
            value={sucursal}
            onChange={setSucursal}
          >
            {sucursales.data
              ?.filter((el) => el.type_sede == WAREHOUSE_TYPE.WAREHOUSE)
              .map((el) => (
                <Select.Option value={el.id} key={el.id}>
                  {el.title}
                </Select.Option>
              ))}
          </Select>
          <Button
            className={isEditMode ? 'hidden' : ''}
            onClick={() => editMode(true)}
          >
            Editar
          </Button>
          <Button
            className={isEditMode ? '' : 'hidden'}
            onClick={() => editMode(false)}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            loading={saveRelationMt.isPending}
            className={isEditMode ? '' : 'hidden'}
            onClick={handleSave}
          >
            Guardar
          </Button>
        </div>
      </div>
      <Table
        pagination={false}
        size="small"
        bordered
        rowKey={'id'}
        columns={
          [
            {
              title: 'Id',
              dataIndex: 'id',
            },
            {
              title: 'Nombre',
              dataIndex: 'itemName',
            },
            {
              title: 'Almacen',
              dataIndex: 'storeCode',
              render: (val) => sucursalName[val] ?? val,
            },
            {
              title: '',
              hidden: !isEditMode,
              render: (_, record) => {
                const value = newRelation?.[record.id] ?? defaultStoreCode
                return (
                  <Select
                    className="w-32"
                    size="small"
                    value={value}
                    onChange={(val) => {
                      setNewRelation({
                        ...newRelation,
                        [record.id]: val,
                      })
                    }}
                  >
                    {sucursales.data
                      ?.filter((el) => el.type_sede == WAREHOUSE_TYPE.WAREHOUSE)
                      .map((el) => (
                        <Select.Option value={el.id} key={el.id}>
                          {el.title}
                        </Select.Option>
                      ))}
                  </Select>
                )
              },
            },
          ] satisfies ColumnsType<ItemRelation>
        }
        dataSource={items}
      />
    </div>
  )
}
