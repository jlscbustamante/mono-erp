import { Button, Modal, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { FaTrash } from 'react-icons/fa6'
import { MdRemoveRedEye } from 'react-icons/md'
import { toast } from 'react-toastify'

import * as sdk from '@/data/products/sdk'
import { IInvPurchase } from '@/data/products/types/purchase'
import { fNumber } from '@/utils/formatNumber'

import { revertStorePurchase } from '@/data/hex/inventory'
import { PURCHASE_STATUS } from '@/data/hex/types'
import { cn } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { RxReset } from 'react-icons/rx'
import { usePurchaseStore } from '../../state/usePurchase'

export const TablePurchase = () => {
  const store = usePurchaseStore()

  const deletePurchase = async (id: number) => {
    try {
      await sdk.deletePurchase(id)
      store.addControlLoadPurchase()
    } catch (err: any) {
      toast.error('No se pudo eliminar la compra. ', err.message)
    }
  }

  const getTagStatus = (status: number) => {
    if (status == 1) return <Tag>Nuevo</Tag>
    else if (status == 3) return <Tag color="green">Almacenado</Tag>
    else if (status == 9) return <Tag color="red">Rechazado</Tag>
    else return <Tag>{status}</Tag>
  }

  const revertPurchaseStoreMt = useMutation({
    mutationFn: revertStorePurchase,
    onSuccess: () => {
      store.addControlLoadPurchase()
    },
    onError: (err: any) => {
      toast.error('No se pudo revertir la compra. ' + err.message)
    },
  })

  const columns: ColumnsType<IInvPurchase> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Fecha',
      dataIndex: 'purchaseAt',
      key: 'purchaseAt',
      width: 144,
      render: (text: string) => {
        return text.split(' ')[0]
      },
    },
    {
      title: 'Glosa',
      dataIndex: 'gloss',
      key: 'gloss',
      render: (text) => {
        if (!text) return '(sin descripción)'
        return text
      },
    },
    {
      title: 'Razón social',
      dataIndex: 'supplierName',
      key: 'id',
    },
    {
      title: 'Factura',
      dataIndex: 'numInvoice',
      key: 'numInvoice',
    },

    {
      title: 'Subtotal',
      dataIndex: 'netValue',
      key: 'netValue',
      render: (value: number) => fNumber(value),
    },
    {
      title: 'IGV',
      dataIndex: 'taxValue',
      key: 'igv',
    },
    {
      title: 'Valor total',
      dataIndex: 'totalValue',
      key: 'totalValue',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (val) => {
        return getTagStatus(val)
      },
    },
    {
      title: '',
      onCell: () => {
        return {
          width: '20px',
        }
      },
      render: (record) => {
        return (
          <div className="flex gap-2 justify-between items-center">
            <Button
              type="text"
              size="small"
              className={cn('inline-flex items-center justify-center', {
                hidden: record.status !== (PURCHASE_STATUS.STORED as any),
              })}
              onClick={() =>
                Modal.confirm({
                  title: '¿Está seguro de deshacer este compra?',
                  content: 'Las cantidades seran removidas del almacén',
                  onOk: () => {
                    revertPurchaseStoreMt.mutate(record.id)
                  },
                })
              }
            >
              <RxReset className="text-black w-4 h-auto" />
            </Button>
            <div
              className="cursor-pointer"
              onClick={() => {
                store.setInfoDrawer(record.id)
              }}
            >
              <MdRemoveRedEye className="w-5 h-auto" />
            </div>
            {record.status == 1 && (
              <div
                className="cursor-pointer"
                onClick={() =>
                  Modal.confirm({
                    title: 'Eliminar',
                    content: '¿Está seguro de eliminar esta compra?',
                    onOk: async () => {
                      await deletePurchase(record.id)
                    },
                  })
                }
              >
                <FaTrash className="w-4 h-auto" />
              </div>
            )}
          </div>
        )
      },
    },
  ]
  return (
    <Table
      size="small"
      style={{ width: '100%' }}
      loading={store.loadings.purchases}
      rowKey={'id'}
      columns={columns}
      dataSource={store.purchases}
      pagination={false}
      // pagination={{
      //   pageSize: 20,
      // }}
      // onChange={(pagination) => {
      //   // store.setOrder('id', sorter?.order)
      //   if (
      //     pagination.current != store.pagination.page ||
      //     pagination.pageSize != store.pagination.lot
      //   ) {
      //     store.setPagination({
      //       page: pagination.current ?? 1,
      //       lot: pagination.pageSize ?? 15,
      //     })
      //   }
      // }}
      // pagination={{
      //   pageSize: store.pagination.lot,
      //   showSizeChanger: true,
      //   current: store.pagination.page,
      //   total: store.totalPurchases,
      // }}
    />
  )
}
