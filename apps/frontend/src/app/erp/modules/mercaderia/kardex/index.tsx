import { SucursalesSelect } from '@/components/selects/inventory/sucursales-select'
import { kardexApi } from '@/lib/api/kardex'
import { fNumber } from '@/utils/formatNumber'
import { useMutation } from '@tanstack/react-query'
import { Button, DatePicker, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { type IKardex } from 'pizzadb'
import { useState } from 'react'
import { KARDEX_MOVE_FLOW } from 'shared'
import { KardexFilters } from './kardex-filters'

const RangePicker = DatePicker.RangePicker

export const KardexPage = () => {
  const [data, setData] = useState<IKardex[]>([])
  const [dates, setDates] = useState<[string, string]>([
    dayjs().format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ])

  const getKardex = useMutation({
    mutationFn: () => kardexApi.getItemsTemplate(),
    onSuccess: (data) => {
      setData(data)
    },
  })

  return (
    <div className="space-y-3 p-3">
      <KardexFilters />
      <div className="flex gap-2">
        <RangePicker
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          allowClear={false}
          onChange={(val: any) => {
            if (val[0] && val[1])
              setDates([
                val[0].format('YYYY-MM-DD'),
                val[1].format('YYYY-MM-DD'),
              ])
          }}
        />
        <SucursalesSelect
          className="w-52"
          placeholder="Tienda"
          allowClear={true}
        />
        <Button type="primary" onClick={() => getKardex.mutate()}>
          Buscar
        </Button>
      </div>
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
