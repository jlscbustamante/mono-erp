import { Button, Collapse, DatePicker, Table } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { IFilteredRequest, RequestStatus, RequestType } from '@/data/requests'
import * as sdk from '@/data/requests/sdk'
import { OpFilter } from '@/data/types/Filters'
import { fCurrency, safeAny } from '@/utils'

import { columnsApproved } from '../components'

const RangePicker = DatePicker.RangePicker

export default function BalanceCostCenter() {
  const [activeKey, setActiveKey] = useState<string[]>([])
  const [report, setReport] = useState<
    { costCenterId: number | null; name: string | null; total: string }[]
  >([])
  const [requests, setRequests] = useState<IFilteredRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [dates, setDates] = useState<{ start: string; end: string }>({
    start: dayjs().format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  })

  const onSearch = async () => {
    try {
      setLoading(true)
      setReport([])
      const report = await sdk.reportsByCostCenter(dates.start, dates.end)
      setReport(report)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  const onSearchRequest = async () => {
    try {
      setLoading(true)
      const response = await sdk.requests({
        status: [
          OpFilter.In,
          RequestStatus.Approved,
          RequestStatus.Closed,
          RequestStatus.Registered,
        ],
        approved_at: [OpFilter.RangeDate, dates.start, dates.end],
        request_type: [OpFilter.NotEqual, RequestType.Transfer],
        cost_center_id:
          activeKey[0] == '0'
            ? [OpFilter.IsNull]
            : [OpFilter.Equal, activeKey[0]],
      })
      setRequests(response)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    ;(async () => {
      if (activeKey[0]) await onSearchRequest()
    })()
  }, [activeKey])

  return (
    <div className="container mx-auto my-3 px-3">
      <div className="flex gap-1 items-center">
        <RangePicker
          value={[
            dayjs(dates.start, 'YYYY-MM-DD'),
            dayjs(dates.end, 'YYYY-MM-DD'),
          ]}
          onChange={(e: safeAny) => {
            setDates({
              start: e[0].format('YYYY-MM-DD'),
              end: e[1].format('YYYY-MM-DD'),
            })
          }}
        />
        <Button type="primary" onClick={onSearch} loading={loading}>
          Aplicar
        </Button>
      </div>
      <div>
        <Collapse
          accordion
          bordered={false}
          activeKey={activeKey}
          onChange={(e) => {
            setActiveKey(e as string[])
          }}
          style={{ background: 'white' }}
          items={report.map((el) => {
            return {
              key: el.costCenterId?.toString() ?? '0',
              label: el.name ?? 'Sin centro de costo',
              children: (
                <ItemCostCenter requests={requests} loading={loading} />
              ),
              extra: <p>{fCurrency(el.total)}</p>,
              style: {
                marginBottom: 14,
                borderRadius: '4px',
                border: 'none',
              },
            }
          })}
        />
      </div>
    </div>
  )
}

const ItemCostCenter: React.FC<{
  requests: IFilteredRequest[]
  loading: boolean
}> = ({ requests, loading }) => {
  return (
    <Table
      dataSource={requests}
      columns={columnsApproved.default}
      pagination={false}
      rowKey={(record) => record.id}
      size="small"
      loading={loading}
    />
  )
}
