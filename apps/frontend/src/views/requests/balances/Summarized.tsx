import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Input,
  List,
  Popover,
  Row,
} from 'antd'
import Link from 'antd/es/typography/Link'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
// import * as sdk from '@/data/cashAccount/sdk'
import * as sdk from '@/data/requests/sdk'
import {
  dateSumReportSt,
  filteredSummariesSt,
  nameSumReportSt,
  summariesReportSt,
} from '@/data/requests/state/'
import { fCurrency, safeAny } from '@/utils'

import { ElementStatusCash } from '../components/StatusCash'

export default function SummarizedBalance() {
  const dateFilter = useRecoilValue(dateSumReportSt)
  const setSummaries = useSetRecoilState(summariesReportSt)
  const applyFilter = async () => {
    const report = await sdk.summaryReport(dateFilter)
    setSummaries(report)
  }
  return (
    <div className="container mx-auto p-3">
      <div className="flex items-center justify-between">
        <Filters
          {...{
            dateFilter,
            applyFilter,
          }}
        />
        <CloseCashAccounts applyFilter={applyFilter} />
      </div>
      <CashRegister />
    </div>
  )
}

const CloseCashAccounts: React.FC<{ applyFilter: () => Promise<void> }> = ({
  applyFilter,
}) => {
  const cashAccounts = useRecoilValue(summariesReportSt).map((summary) => ({
    name: summary.cashAccount.name,
    status: summary.status,
    id: summary.cashAccount.id,
  }))
  const dateFilter = useRecoilValue(dateSumReportSt)
  const [selected, setSelected] = useState<number[]>([])
  const handlerCloseCashAccounts = async () => {
    try {
      if (!selected.length) return
      const idNot = toast.loading('espere un momento, cerrando cajas...', {
        ...NOTIFICATION.loading,
        type: 'info',
      })
      const logs = await sdk.closeCashAccounts(selected, dateFilter)
      if (logs) {
        toast.dismiss()
        logs.forEach((log) => {
          toast.error(log, {
            ...NOTIFICATION.error,
            autoClose: false,
          })
        })
        return
      }
      setSelected([])
      await applyFilter()
      toast.update(idNot, {
        render: 'Las cajas fueron cerradas correctamente',
        isLoading: false,
        autoClose: 1600,
      })
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
    }
  }
  const cleanSelected = () => {
    setSelected([])
  }
  const selectedAll = () => {
    setSelected(
      cashAccounts
        .filter((el) => el.status !== 'C' && el.status !== 'T')
        .map((el) => el.id),
    )
  }
  return (
    <div>
      <Popover
        content={
          <div>
            <div className="flex justify-between mb-3">
              <div className="flex gap-4">
                <Link onClick={selectedAll}>Seleccionar todo</Link>
                <Link onClick={cleanSelected}>Limpiar</Link>
              </div>
              <Button type="text" onClick={handlerCloseCashAccounts}>
                Aceptar
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {cashAccounts.map((el) => (
                <label key={el.id}>
                  <Checkbox
                    value={el.id}
                    checked={selected.includes(el.id)}
                    disabled={el.status === 'C' || el.status === 'T'}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, el.id]
                          : selected.filter((id) => id !== el.id),
                      )
                    }
                  />
                  {el.name}
                </label>
              ))}
            </div>
          </div>
        }
        trigger="click"
        placement="bottomRight"
        arrow={false}
      >
        <Button type="default">Cerrar cajas</Button>
      </Popover>
    </div>
  )
}

const CashRegister = () => {
  const filteredSummaries = useRecoilValue(filteredSummariesSt)
  return (
    <div>
      <Row
        className="items-stretch"
        gutter={[10, 10]}
        align="stretch"
        justify={'center'}
        content="stretch"
      >
        {filteredSummaries.map((summary) => (
          <Col key={summary.cashAccount.id} span={11}>
            <Card
              title={summary.cashAccount.name}
              extra={<ElementStatusCash status={summary.status} />}
            >
              <List
                header={
                  <div className="flex justify-between">
                    <span>SALDO INICIAL</span>{' '}
                    <span>{fCurrency(summary.initialBalance)}</span>
                  </div>
                }
                footer={
                  <div className="flex justify-between">
                    <span>SALDO FINAL</span>{' '}
                    <span className="font-bold">
                      {fCurrency(summary.finalBalance)}
                    </span>
                  </div>
                }
                dataSource={Object.keys(summary.categories)
                  .sort()
                  .map((key) => ({
                    category: key,
                    amount: summary.categories[key],
                  }))}
                renderItem={(item) => (
                  <List.Item className="flex justify-between">
                    <span>{item.category}</span>
                    <span>{fCurrency(item.amount, false)}</span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

const Filters: React.FC<{
  applyFilter: () => Promise<void>
}> = ({ applyFilter }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [dateFilter, setDateFilter] = useRecoilState(dateSumReportSt)
  const [nameFilter, setNameFilter] = useRecoilState(nameSumReportSt)
  const onClick = async () => {
    setIsLoading(true)
    await applyFilter()
    setIsLoading(false)
  }
  return (
    <div className="flex gap-2 my-4">
      <DatePicker
        style={{ width: 140 }}
        allowClear={false}
        value={dayjs(dateFilter)}
        onChange={(e: safeAny) => setDateFilter(e.format('YYYY-MM-DD'))}
      />
      <Button onClick={onClick} type="primary" loading={isLoading}>
        Buscar
      </Button>
      <Input
        placeholder="Filtrar por nombre"
        style={{ width: 240 }}
        // className="max-w-xs"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
    </div>
  )
}
