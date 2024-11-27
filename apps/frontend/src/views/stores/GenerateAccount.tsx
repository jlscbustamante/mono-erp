import { Button, Collapse, DatePicker, List, Modal, Table } from 'antd'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { MdOutlineError } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as serviceAE from '@/data/ae/sdk'
import * as sdk from '@/data/stores/sdk'
import {
  AELogsSt,
  balancesReportSt,
  dateFilterAESt,
  selectedDaysAESt,
} from '@/data/stores/state'
import { CashBalanceStatus } from '@/data/types'
import { safeAny } from '@/utils'

import { ElementStatusCash } from '../requests/components/StatusCash'

const { RangePicker } = DatePicker
export default function GenerateAccountStore() {
  const [datesFilter, setDatesFilter] = useRecoilState(dateFilterAESt)
  const setBalances = useSetRecoilState(balancesReportSt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userLogs, setLogs] = useRecoilState(AELogsSt)
  const [selectedDates, setSelectedDates] = useRecoilState(selectedDaysAESt)
  const [executingDate, setExecutingDate] = useState<string[]>([])

  const onClick = async () => {
    try {
      const data = await sdk.balanceReportStore(datesFilter as [string, string])
      setSelectedDates(
        selectedDates.filter((el) => {
          return data[el] != 'T'
        }),
      )
      setSelectedDates(
        selectedDates.filter((el) => {
          return data[el] != 'T'
        }),
      )
      setBalances(data)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const handlerAccoutingEntries = () => {
    try {
      setIsGenerating(true)
      const initialDate = selectedDates[0]
      const lastDate = selectedDates[selectedDates.length - 1]
      const _dates = eachDayOfInterval({
        start: parseISO(initialDate),
        end: parseISO(lastDate),
      }).map((el) => format(el, 'yyyy-MM-dd'))
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
        const date = userLogs[nowDateIndex].date
        const logsResponse = await serviceAE.generateAEStore(date)
        setExecutingDate([date])
        await onClick()
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
                informe: logsResponse.informe,
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
    <div className="container mx-auto my-3 p-3">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div>Usuario</div>
          <p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Cupiditate totam commodi beatae eius nesciunt vel, deleniti
              pariatur ut ad nam ab voluptas quis amet inventore quas odio
              corporis quo autem!
            </p>
          </p>
          <RangePicker
            disabled={isGenerating}
            value={datesFilter.map((el) => dayjs(el)) as safeAny}
            onChange={(e: safeAny) => {
              setDatesFilter([
                e[0]?.format('YYYY-MM-DD'),
                e[1]?.format('YYYY-MM-DD'),
              ])
            }}
            allowClear={false}
          />
          <Button type="primary" onClick={onClick} disabled={isGenerating}>
            Buscar
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            disabled={selectedDates.length === 0}
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
      <div className="flex justify-center gap-6 mt-4">
        <TableCashs isGenerating={isGenerating} />
        <ListErros
          activeDate={executingDate}
          setActiveDate={setExecutingDate}
        />
      </div>
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

const ListErros: React.FC<{
  activeDate: string[]
  setActiveDate: (el: string[]) => void
}> = ({ activeDate, setActiveDate }) => {
  const logs = useRecoilValue(AELogsSt)
  const columns = [
    {
      title: 'Tienda',
      dataIndex: 'name',
    },
    {
      title: 'Balance caja',
      dataIndex: 'moves',
    },
    {
      title: 'Balance contable',
      dataIndex: 'contable',
    },
    {
      title: 'Resultado',
      render: (record: { contable: string; moves: string }) => {
        return Number(record.contable) - Number(record.moves)
      },
    },
  ]
  const items = logs.map((el) => {
    return {
      key: el.date,
      label: `Logs de la fecha : ${el.date}`,
      children: (
        <>
          <List
            dataSource={!el.noprocess ? (el.logs as any) : []}
            loading={el.loading}
            size="small"
            bordered={false}
            renderItem={(item) => {
              return (
                <List.Item>
                  {typeof item !== 'string' ? (
                    <Table columns={columns} dataSource={item as any} />
                  ) : (
                    <p className="flex gap-2 items-center">
                      {el.success ? (
                        <FaCircleCheck className="text-green-700" />
                      ) : (
                        <MdOutlineError className="text-red-700" />
                      )}
                      {item}
                    </p>
                  )}
                </List.Item>
              )
            }}
          />
          {el.informe && (
            <Table
              rowKey={'name'}
              onRow={(row) => {
                if (Number(row.moves) - Number(row.contable) != 0)
                  return {
                    style: {
                      backgroundColor: '#ff9999',
                    },
                  }
                return {}
              }}
              size="small"
              columns={columns}
              dataSource={el.informe}
              pagination={{ defaultPageSize: 20 }}
            />
          )}
        </>
      ),
    }
  })

  return (
    <Collapse
      activeKey={activeDate}
      onChange={(list) => {
        setActiveDate(list as string[])
      }}
      style={{ width: 800, height: '100%' }}
      items={items}
    />
  )
}
