import { viewClient } from '@/lib/rpc'
import { cn, fCurrency } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { IRequirementPresentation, REQUIERMENT_TYPE } from '@view'
import { Button, Collapse, CollapseProps, DatePicker, Empty, Table } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { StatusTag } from '../../components/status-req'
import { use_cost_center } from './state'

const RangePicker = DatePicker.RangePicker
export function ReportByCostCenterPage() {
  const dates = use_cost_center((st) => st.dates)
  const set_dates = use_cost_center((st) => st.set_dates)
  const refetch = use_cost_center((st) => st.refetch)
  const control_refetch = use_cost_center((st) => st.control_refetch)

  const query = useQuery({
    queryKey: ['req:rp_cost_center', control_refetch],
    enabled: control_refetch > 0,
    queryFn: async () => {
      const res = await viewClient.api.view.requirement.report.cost_center.$get(
        {
          query: {
            start: dates[0],
            end: dates[1],
          },
        },
      )

      const data = await res.json()
      return data.data as IRequirementPresentation[]
    },
  })

  const requirement_by_cost_center: CollapseProps['items'] = useMemo(() => {
    if (!query.data || query.data.length == 0) return []

    const keys = query.data.reduce(
      (acc, el) => {
        if (el.costCenter != '' && !acc.includes(el.costCenter)) {
          acc.push(el.costCenter)
        }
        return acc
      },
      ['SIN CENTRO DE COSTO'] as string[],
    )

    const items: CollapseProps['items'] = keys.map((key) => {
      let data
      if (key === 'SIN CENTRO DE COSTO') {
        data = query.data.filter((el) => el.costCenter == '' || !el.costCenter)
      } else {
        data = query.data.filter((el) => el.costCenter == key)
      }
      const total = data.reduce((acc, el) => acc + el.amount, 0)
      return {
        key: key,
        label: key,
        children: <CostCenterTable data={data} />,
        extra: fCurrency(total),
        style: {},
      }
    })
    return items
  }, [query.data])

  return (
    <div className="min-h-full bg-blue-50 py-3">
      <div className="space-y-3 container mx-auto p-3 bg-white rounded-md">
        <div className="">
          <div className="flex gap-2">
            <RangePicker
              value={[dayjs(dates[0]), dayjs(dates[1])]}
              onChange={(val) => {
                if (val && val[0] && val[1]) {
                  set_dates([
                    val[0].format('YYYY-MM-DD'),
                    val[1].format('YYYY-MM-DD'),
                  ])
                }
              }}
              allowClear={false}
            />
            <Button type="primary" onClick={refetch}>
              Buscar
            </Button>
          </div>
        </div>
        <div>
          <div
            className={cn('my-6', {
              hidden: requirement_by_cost_center.length > 0,
            })}
          >
            <Empty description="No hay requerimientos encontrados" />
          </div>
          <Collapse
            accordion
            bordered={false}
            items={requirement_by_cost_center}
            style={{ background: 'white' }}
          />
        </div>
      </div>
    </div>
  )
}

const CostCenterTable = ({ data }: { data: IRequirementPresentation[] }) => {
  return (
    <div>
      <Table
        dataSource={data}
        size="small"
        bordered
        pagination={false}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Fecha',
            dataIndex: 'requestedAt',
          },
          {
            title: 'Descripcion',
            dataIndex: 'description',
          },
          {
            title: 'Categoria',
            dataIndex: 'category',
          },
          {
            title: 'Tipo',
            dataIndex: 'type',
            render: (val) => {
              if (val == REQUIERMENT_TYPE.SUPPLIER) return 'Proveedores'
              if (val == REQUIERMENT_TYPE.TRANSFER) return 'Transferencia'
              if (val == REQUIERMENT_TYPE.LIQUIDATION) return 'Liquidación'
              if (val == REQUIERMENT_TYPE.SIMPLE) return 'Simple'
              return ''
            },
          },
          {
            title: 'Estado',
            dataIndex: 'status',
            render: (val) => {
              return <StatusTag status={val} />
            },
          },
          {
            title: 'Monto',
            align: 'right',
            dataIndex: 'amount',
            render: (val) => {
              return fCurrency(val, false)
            },
          },
        ]}
      />
    </div>
  )
}
