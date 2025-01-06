import { kardexApi } from '@/lib/api/kardex'
import { fNumber } from '@/utils/formatNumber'
import { useMutation } from '@tanstack/react-query'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Fillime, InvKardex, type IKardex } from 'pizzadb'
import { KARDEX_MOVE_FLOW } from 'shared'
import { KardexFilters } from './kardex-filters'
import { useKardexStore } from './state'

export const KardexPage = () => {
  const data = useKardexStore((st) => st.data)
  const setData = useKardexStore((st) => st.setData)

  const getKardex = useMutation({
    mutationFn: (filters: Fillime<InvKardex>) =>
      kardexApi.filterKardex(filters),
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
            },
            {
              title: 'Item',
              dataIndex: 'item_name',
            },
            {
              title: 'Presentacion',
              dataIndex: 'presentation_name',
            },
            {
              title: 'Cantidad',
              dataIndex: 'quantity',
              align: 'right',
              render: (val: number) => fNumber(val),
            },
            {
              title: 'Tipo',
              dataIndex: 'move_flow',
              render: (val) => {
                return val == KARDEX_MOVE_FLOW.IN ? 'Entrada' : 'Salida'
              },
            },
            {
              title: 'Tienda',
              dataIndex: ['warehouse', 'title'],
            },
          ] satisfies ColumnsType<IKardex>
        }
      />
    </div>
  )
}
