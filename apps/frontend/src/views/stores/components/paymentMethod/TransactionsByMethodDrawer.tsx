import { Drawer, Table } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import { format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ExcelExportBtn } from '@/components/excel-btn'
import { NOTIFICATION } from '@/const/notification'
import { ITransactionOfMethod } from '@/data/stores/types/paymentMethods'
import { fNumber } from '@/utils/formatNumber'

import {
  usePaymentMethod,
  usePaymentMethodStore,
} from '../../state/usePaymentMethod'

export const TransactionsByMethodDrawer = () => {
  const [data, setData] = useState<ITransactionOfMethod[]>([])
  const { loadTransactionsByMethod } = usePaymentMethod()
  const { drawers, setTransactionDrawer, loading } = usePaymentMethodStore()

  const columns = [
    {
      title: 'Terminal',
      dataIndex: 'terminal',
    },
    {
      title: 'Tienda',
      dataIndex: 'name',
    },
    {
      title: 'Fecha transc.',
      dataIndex: 'date',
      render: (date: string) => {
        return format(parseISO(date), 'dd/MM/yyyy HH:mm:ss')
      },
    },
    {
      title: 'Fecha abono',
      dataIndex: 'dateAbono',
    },
    {
      title: 'Importe',
      dataIndex: 'importe',
      __cellType__: 'TypeNumeric',
      render: (amount: number) => fNumber(amount),
    },
    {
      title: 'Comision',
      dataIndex: 'comisionventa',
      __cellType__: 'TypeNumeric',
      render: (amount: number) => fNumber(amount),
    },
    {
      title: 'IGV',
      dataIndex: 'igv',
      __cellType__: 'TypeNumeric',
      render: (amount: number) => fNumber(amount),
    },
    {
      title: 'Importe Neto',
      dataIndex: 'importeneto',
      __cellType__: 'TypeNumeric',
      render: (amount: number) => fNumber(amount),
    },
    {
      title: 'N° Tarjeta',
      dataIndex: 'numtarjeta',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
    },
  ]
  const handleExport = () => {
    try {
      const excel = new Excel()
      excel.addSheet('Datos').addRow()
      excel
        .addColumns(columns as any)
        .addDataSource(data)
        .saveAs('reporte-transacciones-izipay.xlsx')
    } catch (err: any) {
      toast.error('error al tratar de exportar', NOTIFICATION.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (
        drawers.transactionMethod.open &&
        drawers.transactionMethod.sucursalcode &&
        drawers.transactionMethod.method
      ) {
        const transactions = await loadTransactionsByMethod(
          drawers.transactionMethod.sucursalcode,
          drawers.transactionMethod.method,
        )
        setData(transactions)
      }
    })()
  }, [drawers.transactionMethod])
  return (
    <Drawer
      open={drawers.transactionMethod.open}
      onClose={() =>
        setTransactionDrawer({ open: false, method: '', sucursalcode: '' })
      }
      title={`Reporte de transacción de medio de pago : ${drawers.transactionMethod.method}`}
      placement="bottom"
      height={'100%'}
    >
      <div className="text-right mb-3">
        {/* <Button type="default" onClick={handleExport}>
          Exportar excel
        </Button> */}
        <ExcelExportBtn onExport={handleExport} />
      </div>
      <Table
        pagination={false}
        columns={columns}
        loading={loading.transactionMethod}
        dataSource={data}
        rowKey={'id'}
      />
    </Drawer>
  )
}
