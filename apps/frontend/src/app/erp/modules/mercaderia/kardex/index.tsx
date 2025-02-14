import { kardexApi } from '@/lib/api/kardex'
import { fNumber } from '@/utils/formatNumber'
import { useMutation } from '@tanstack/react-query'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { Fillime, InvKardex, type IKardex } from 'pizzadb'
import { KARDEX_MOVE_FLOW } from 'shared'
import { KardexFilters } from './kardex-filters'
import { useKardexStore } from './state'

export const KardexPage = () => {
  const data = useKardexStore((st) => st.data)
  const setData = useKardexStore((st) => st.setData)

  const getKardex = useMutation({
    mutationFn: (filters: Fillime<InvKardex>) =>
      kardexApi.filterKardex(filters) as Promise<IKardex[]>,
    onSuccess: (data) => {
      setData(data)
    },
  })

  return (
    <div className="space-y-3 p-3">
      <KardexFilters
        filterKardex={(filters) => getKardex.mutate(filters)}
        isLoading={getKardex.isPending}
      />
      <Table
        dataSource={data}
        rowKey={(el) => el.id}
        pagination={false}
        size="small"
        columns={
          [
            {
              title: 'Id',
              dataIndex: 'id',
              sorter: (a, b) => a.id - b.id,
            },
            {
              title: 'Fecha',
              dataIndex: 'move_at',
              render: (val) => dayjs(val).format('YYYY-MM-DD HH:mm'),
              sorter: (a, b) =>
                dayjs(a.move_at).unix() - dayjs(b.move_at).unix(),
            },
            {
              title: 'Item',
              dataIndex: 'item_name',
              sorter: (a, b) => a.item_name.localeCompare(b.item_name),
            },
            {
              title: 'Presentacion',
              dataIndex: 'presentation_name',
              sorter: (a, b) =>
                a.presentation_name?.localeCompare(b.presentation_name),
            },
            {
              title: 'Cantidad',
              dataIndex: 'quantity',
              align: 'right',
              render: (val: number) => fNumber(val),
              sorter: (a, b) => a.quantity - b.quantity,
            },
            {
              title: 'Precio',
              dataIndex: 'unit_price',
              align: 'center',
              sorter: (a, b) => a.unit_price - b.unit_price,
            },
            {
              title: 'Costo',
              dataIndex: 'unit_purchase',
              align: 'center',
              sorter: (a, b) => a.unit_purchase - b.unit_purchase,
            },
            {
              title: 'Tipo',
              dataIndex: 'move_flow',
              render: (val) => {
                return val == KARDEX_MOVE_FLOW.IN ? 'Entrada' : 'Salida'
              },
              sorter: (a, b) => a.move_flow?.localeCompare(b.move_flow),
            },
            {
              title: 'Tienda',
              dataIndex: ['warehouse', 'title'],
              sorter: (a, b) =>
                a.warehouse?.title.localeCompare(b.warehouse?.title),
            },
          ] satisfies ColumnsType<IKardex>
        }
      />
    </div>
  )
}
