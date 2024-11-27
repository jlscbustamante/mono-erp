import { Modal, Table } from 'antd'
import { useEffect, useState } from 'react'

import { AddFilterButton } from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { IDispatch, IDispatchItem } from '@/data/products/types'
import { Filters3, OpFilter } from '@/data/types/Filters'

import { useDispatch } from '../../state/useDispatch'

export const ListTemplateModal: React.FC<{
  setIsOpen: (s: boolean) => void
  dispatch: Partial<IDispatch>
  selectItems?: (items: IDispatchItem[]) => void
  messageApi: any
}> = ({ setIsOpen, dispatch, selectItems, messageApi }) => {
  const { store, loadFilterTemplate } = useDispatch()
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<Filters3<IDispatch>>({})
  const [dispatches, setDispatches] = useState<IDispatch[]>([])
  const [controlLoad, setControlLoad] = useState(0)
  const items = [
    {
      label: 'id',
      key: 'id',
      options: [OpFilter.Equal],
    },
    {
      label: 'Descripcion',
      key: 'gloss',
      options: [OpFilter.Contain, OpFilter.Equal],
    },
    {
      label: 'Orig.',
      key: 'wareFromId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
    {
      label: 'Dest.',
      key: 'wareToId',
      options: [OpFilter.Select, OpFilter.SelectIn],
    },
  ]

  const addItems = (items: IDispatchItem[]) => {
    selectItems?.(items ?? [])
    messageApi.success('Items agregados', 1.6)
    setIsOpen(false)
  }

  useEffect(() => {
    if (dispatch.wareFromId && dispatch.wareToId) {
      setFilters({
        ...filters,
        wareFromId: [OpFilter.Select, dispatch.wareFromId],
        wareToId: [OpFilter.Select, dispatch.wareToId],
      })
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const dispatchResponse = await loadFilterTemplate(filters)
      setDispatches(dispatchResponse)
      setLoading(false)
    })()
  }, [controlLoad])

  return (
    <Modal
      width={650}
      title="Usar template"
      open={true}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-1">
        <AddFilterButton
          items={items}
          setUserFilters={setFilters}
          userFilters={filters}
        />
        <ShowFilters
          rootClass="flex gap-1 flex-wrap"
          options={items}
          userFilters={filters}
          setUserFilters={(newFilters) => {
            setFilters(newFilters)
            setControlLoad(controlLoad + 1)
          }}
          selections={{
            wareFromId: store.warehouses.map((w) => ({
              label: w.name,
              value: w.id,
            })),
            wareToId: store.warehouses.map((w) => ({
              label: w.name,
              value: w.id,
            })),
          }}
        />
      </div>
      <div className="mt-2">
        <Table
          rowKey={'id'}
          size="small"
          loading={loading}
          dataSource={dispatches}
          pagination={false}
          columns={[
            {
              title: 'Id',
              dataIndex: 'id',
              width: 80,
            },
            {
              title: 'Descripción',
              dataIndex: 'gloss',
            },
            {
              title: 'Desde',
              dataIndex: ['wareFrom', 'name'],
            },
            {
              title: 'Hacia',
              dataIndex: ['wareTo', 'name'],
            },
            {
              title: 'Items',
              render: (record) => {
                return record.items.length
              },
            },
            {
              title: 'Fecha',
              dataIndex: 'moveAt',
              render: (text) => text?.split(' ')[0],
            },
            {
              render: (record) => {
                return (
                  <a
                    onClick={() => {
                      addItems(record.items ?? [])
                    }}
                  >
                    Usar
                  </a>
                )
              },
            },
          ]}
        />
      </div>
    </Modal>
  )
}
