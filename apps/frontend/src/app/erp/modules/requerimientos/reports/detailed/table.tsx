import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'
import { RequirementRelationsSelect } from '@pizzadb'
import { REQUIERMENT_TYPE } from '@view'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { StatusTag } from '../../components/status-req'

export function DataTable({
  data,
  cashId,
  initial,
}: {
  data: RequirementRelationsSelect[]
  cashId: number
  initial: number
}) {
  const total = useMemo(() => {
    const amount = data.reduce((acc, el) => {
      return acc + (el.amount ?? 0)
    }, 0)
    return fCurrency(amount)
  }, [data])
  return (
    <div>
      <Table
        bordered
        size="small"
        columns={
          [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              title: 'Categoria/Caja',
              render: (_, record) => {
                if (record.request_type == REQUIERMENT_TYPE.TRANSFER) {
                  const cashbankDiff = record.items?.find(
                    (el) => el.cashbank_id != cashId,
                  )
                  return cashbankDiff?.cashbank_name
                } else {
                  return record.movecash_name
                }
              },
            },
            {
              title: 'Doc',
            },
            {
              title: 'Descripción',
              dataIndex: 'description',
            },
            {
              title: 'Solic. por',
              dataIndex: 'created_by',
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              render: (val, record: any) => {
                if (record.isTitle) return null
                return <StatusTag status={val} />
              },
            },
            {
              title: 'M. total',
              dataIndex: 'amount',
              align: 'right',
              render: (_, record) => {
                if ((record as any).isTitle) return null
                if (record.request_type == REQUIERMENT_TYPE.TRANSFER) {
                  return fCurrency(record.amount ?? 0)
                }
                const total = record.items?.reduce((acc, el) => {
                  if (el.cashbank_id == cashId) return acc + (el.amount ?? 0)
                  return acc
                }, 0)

                return fCurrency(total)
              },
            },
          ] satisfies ColumnsType<RequirementRelationsSelect>
        }
        footer={() => (
          <div className="font-semibold flex justify-between">
            <span>SALDO FINAL</span>
            <span>{total}</span>
          </div>
        )}
        title={() => (
          <div className="font-semibold flex justify-between">
            <span>SALDO INICIAL</span>
            <span>{fNumber(initial)}</span>
          </div>
        )}
        onRow={(record) => {
          if ((record as any).isTitle) {
            return {
              style: {
                fontWeight: 'bold',
              },
              colSpan: 3,
            }
          }
          return {}
        }}
        pagination={false}
        rowKey={(record) => record.id}
        dataSource={[
          {
            isTitle: true,
            id: 'INGRESOS',
            name: 'INGRESOS',
          } as any,
          ...data,
          {
            isTitle: true,
            id: 'SALIDAS',
            name: 'SALIDAS',
          } as any,
        ]}
      />
    </div>
  )
}
