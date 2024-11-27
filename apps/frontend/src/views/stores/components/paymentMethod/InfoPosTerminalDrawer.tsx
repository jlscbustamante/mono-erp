import { Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'

import { IInfoPos } from '@/data/stores/types/paymentMethods'
import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import {
  usePaymentMethod,
  usePaymentMethodStore,
} from '../../state/usePaymentMethod'

export const InfoPosTerminalDrawer = () => {
  const { date, drawers, setInfoPosDrawer, loading } = usePaymentMethodStore()
  const { loadInfoPosBySucursal } = usePaymentMethod()

  const [data, setData] = useState<IInfoPos[]>([])
  const [sumData, setSumData] = useState(0)
  const columns = [
    {
      title: 'Terminal',
      dataIndex: 'codigo',
    },
    {
      title: '',
      dataIndex: 'method',
    },
    {
      title: 'Importe',
      dataIndex: 'amount',
      render: (amount: number) => (
        <p className="text-right">{fNumber(amount)}</p>
      ),
    },
  ]

  useEffect(() => {
    ;(async () => {
      if (drawers.infoPos.open && drawers.infoPos.sucursalcode) {
        const dataResponse = await loadInfoPosBySucursal(
          drawers.infoPos.sucursalcode,
        )
        setData(dataResponse)
        setSumData(
          dataResponse.reduce((acc, curr) => acc + Number(curr.amount), 0),
        )
      }
    })()
  }, [drawers.infoPos])

  return (
    <Drawer
      open={drawers.infoPos.open}
      onClose={() =>
        setInfoPosDrawer({ open: false, sucursalcode: '', name: '' })
      }
      placement="right"
      title="Reporte de ventas por pos"
      width={450}
    >
      <div className="flex flex-col gap-2 mb-3">
        <p>Tienda : {drawers.infoPos.name}</p>
        <p>Fecha: {date}</p>
      </div>
      <Table
        columns={columns}
        rowKey={'codigo'}
        dataSource={data}
        pagination={false}
        loading={loading.infoPos}
        footer={() => (
          <div className="flex justify-between">
            <span className="font-bold">TOTAL</span>
            <span>{fCurrency(sumData)}</span>
          </div>
        )}
      />
    </Drawer>
  )
}
