import { Button, Collapse, DatePicker, List, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import {
  balancesReportSt,
  dateBalanceReportSt,
  selectedDaysAESt,
} from '@/data/requests/state'
import { safeAny } from '@/utils'
const { RangePicker } = DatePicker
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { MdOutlineError } from 'react-icons/md'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as serviceAE from '@/data/ae/sdk'
import { AELogsSt } from '@/data/cashAccount/state/AELogs'
// import * as sdk from '@/data/cashAccount/sdk'
import * as sdk from '@/data/requests/sdk'
import { CashBalanceStatus } from '@/data/types'

import { ElementStatusCash } from '../components/StatusCash'

export default function GenerateAccount() {
  const [selectedDates, setSelectedDates] = useRecoilState(selectedDaysAESt)
  const setBalancesReport = useSetRecoilState(balancesReportSt)
  const datesFilter = useRecoilValue(dateBalanceReportSt)
  const [userLogs, setLogs] = useRecoilState(AELogsSt)
  const [isGenerating, setIsGenerating] = useState(false)

  const applyFilters = async () => {
    try {
      const balances = await sdk.balanceReportRequest(datesFilter)
      setSelectedDates(
        selectedDates.filter((el) => {
          return balances[el] != 'T'
        }),
      )
      setBalancesReport(balances)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  const handlerAccoutingEntries = async () => {
    try {
      setIsGenerating(true)
      setLogs([])
      const initialDate = selectedDates[0]
      const lastDate = selectedDates[selectedDates.length - 1]
      const _dates = eachDayOfInterval({
        start: parseISO(initialDate),
        end: parseISO(lastDate),
      }).map((e) => format(e, 'yyyy-MM-dd'))
      if (_dates.length > selectedDates.length)
        throw new Error(
          'Las fechas seleccionadas tienen que ser consecutivas para poder generar el asiento',
        )
      setLogs(
        _dates.map((el) => {
          return {
            date: el,
            loading: true,
            success: false,
            noprocess: true,
          }
        }),
      )
    } catch (err: any) {
      setIsGenerating(false)
      toast.dismiss()
      toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!userLogs.length) return
      const nowDateIndex = userLogs.findIndex((el) => el.noprocess)
      if (nowDateIndex > -1) {
        const logsResponse = await serviceAE.generateAERequest(
          userLogs[nowDateIndex].date,
        )
        await applyFilters()
        setLogs((e) => {
          const newArr = []
          for (let i = 0; i < e.length; i++) {
            if (i == nowDateIndex) {
              newArr.push({
                ...e[i],
                success: logsResponse.success,
                noprocess: false,
                loading: false,
                logs: logsResponse.logs,
              })
            } else {
              if (!logsResponse.success && i > nowDateIndex) {
                newArr.push({
                  ...e[i],
                  noprocess: false,
                  loading: false,
                  logs: ['Revisa las fechas anteriores'],
                })
              } else {
                newArr.push(e[i])
              }
            }
          }

          return newArr
        })
      } else {
        setIsGenerating(false)
      }
    })()
  }, [userLogs])

  return (
    <div className="container px-3">
      <div className="flex justify-between items-center">
        <Filters applyFilters={applyFilters} isGenerating={isGenerating} />
        <div>
          <Button
            type="primary"
            disabled={selectedDates.length === 0 || isGenerating}
            loading={isGenerating}
            onClick={() => {
              Modal.confirm({
                title: 'Generar asientos contables',
                centered: true,
                content: (
                  <div>
                    <p>Se generaran asientos contables en el rango: </p>
                    <p>
                      {selectedDates[0]} -{' '}
                      {selectedDates[selectedDates.length - 1]}
                    </p>
                  </div>
                ),
                onOk: () => {
                  handlerAccoutingEntries()
                },
              })
            }}
          >
            Contabilizar
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-6">
        <TableCashs isGenerating={isGenerating} />
        <ListErros />
      </div>
    </div>
  )
}

const Filters: React.FC<{
  applyFilters: () => Promise<void>
  isGenerating?: boolean
}> = ({ applyFilters, isGenerating }) => {
  const [datesFilter, setDatesFilter] = useRecoilState(dateBalanceReportSt)
  const [isLoading, setIsLoading] = useState(false)

  const handlerOnClick = async () => {
    setIsLoading(true)
    await applyFilters()
    setIsLoading(false)
  }
  return (
    <div className="flex gap-2 my-4">
      <RangePicker
        value={datesFilter.map((el) => dayjs(el)) as safeAny}
        onChange={(e: safeAny) => {
          setDatesFilter([
            e[0]?.format('YYYY-MM-DD'),
            e[1]?.format('YYYY-MM-DD'),
          ])
        }}
        allowClear={false}
      />
      <Button
        type="primary"
        loading={isLoading}
        onClick={handlerOnClick}
        disabled={isGenerating}
      >
        Buscar
      </Button>
    </div>
  )
}

const TableCashs: React.FC<{ isGenerating: boolean }> = ({ isGenerating }) => {
  const balances = useRecoilValue(balancesReportSt)
  const [selectedDates, setSelectedDates] = useRecoilState(selectedDaysAESt)
  const onChange = (el: safeAny[]) => {
    setSelectedDates((el as string[]).sort())
  }

  return (
    <div>
      <Table
        style={{ width: 400 }}
        pagination={false}
        dataSource={Object.keys(balances)
          .sort()
          .map((el) => {
            return {
              key: el,
              date: el,
              status: balances[el],
            }
          })}
        columns={[
          {
            title: 'Fecha',
            dataIndex: 'date',
          },
          {
            title: 'Estado',
            dataIndex: 'status',
            onCell: () => {
              return {
                style: { width: '120px' },
              }
            },
            render: (status) => {
              return <ElementStatusCash status={status} />
            },
          },
        ]}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedDates,
          onChange: onChange,
          getCheckboxProps: (record: {
            status: CashBalanceStatus
            date: string
          }) => ({
            disabled:
              record.status === '' ||
              record.status === null ||
              record.status === 'T' ||
              isGenerating,
            name: 'contabilizar',
          }),
        }}
      />
    </div>
  )
}

const ListErros = () => {
  const logs = useRecoilValue(AELogsSt)
  const items = logs.map((el) => {
    return {
      key: el.date,
      label: `Logs de la fecha : ${el.date}`,
      children: (
        <List
          dataSource={!el.noprocess ? el.logs : []}
          loading={el.loading}
          size="small"
          bordered={false}
          renderItem={(item) => (
            <List.Item>
              {!el.noprocess ? (
                <p className="flex gap-2 items-center">
                  {el.success ? (
                    <FaCircleCheck className="text-green-700" />
                  ) : (
                    <MdOutlineError className="text-red-700" />
                  )}
                  {item}
                </p>
              ) : (
                <p className="flex gap-2 items-center">
                  <MdOutlineError className="text-yellow-700" />
                  {item}
                </p>
              )}
            </List.Item>
          )}
        />
      ),
    }
  })

  return (
    <Collapse
      activeKey={items.map((el) => el.key)}
      style={{ width: 800, height: '100%' }}
      items={items}
    />
  )
}
