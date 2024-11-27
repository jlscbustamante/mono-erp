import { Button, Checkbox, DatePicker, Modal, Spin, Table, Tag } from 'antd'
import { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/stores/sdk'
import {
  compareEfisSt,
  dateFilterCompareSt,
  filteredCompareEfisSt,
  filtersCompareSt,
} from '@/data/stores/state'
import { ICompareEfis, StatusCompare } from '@/data/stores/types'
import { fCurrency, safeAny } from '@/utils'

const { RangePicker } = DatePicker

export default function StoresStates() {
  const dateFilter = useRecoilValue(dateFilterCompareSt)
  const setDataCompare = useSetRecoilState(compareEfisSt)
  const [isLoading, setIsLoading] = useState(false)

  const handlerCompare = async () => {
    try {
      if (!dateFilter) return
      const filters: [string, string] = [
        dateFilter[0]!.format('YYYY-MM-DD'),
        dateFilter[1]!.format('YYYY-MM-DD'),
      ]
      setIsLoading(true)
      const data = await sdk.compareEfis(filters)
      setDataCompare(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-start items-center gap-2">
        <Filters />
        <div>
          <Button
            type="primary"
            onClick={handlerCompare}
            disabled={!dateFilter || isLoading}
          >
            Buscar
          </Button>
        </div>
      </div>
      <StatusFilters />
      {isLoading ? (
        <div className="flex justify-center flex-col items-center py-48 gap-6">
          <Spin />
          <p>Esto puede tomar unos segundos, cargando...</p>
        </div>
      ) : (
        <StatesTable />
      )}
    </div>
  )
}
const StatusFilters = () => {
  const [statusFilters, setStatusFilters] = useRecoilState(filtersCompareSt)

  return (
    <div className="flex gap-3">
      <label className="flex gap-1 items-center">
        <Checkbox
          checked={statusFilters.descuadre}
          onChange={(e) =>
            setStatusFilters({ ...statusFilters, descuadre: e.target.checked })
          }
        />
        <span>Descuadre</span>
      </label>
      <label className="flex gap-1 items-center">
        <Checkbox
          checked={statusFilters.pendiente}
          onChange={(e) =>
            setStatusFilters({ ...statusFilters, pendiente: e.target.checked })
          }
        />
        <span>Por firmar</span>
      </label>
      {/* <label className="flex gap-1 items-center">
        <Checkbox
          checked={statusFilters.cerrado}
          onChange={(e) =>
            setStatusFilters({ ...statusFilters, cerrado: e.target.checked })
          }
        />
        <span>Cerrados</span>
      </label> */}
    </div>
  )
}

const StatesTable = () => {
  const data = useRecoilValue(filteredCompareEfisSt)
  const [dataOrg, setData] = useRecoilState(compareEfisSt)
  const [isClosing, setIsClosing] = useState(false)
  const handlerClose = async (cashId: number, date: string) => {
    try {
      setIsClosing(true)
      const logs = await sdk.closeStoreCashAccounts([cashId], date)
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
      toast.info('Caja cerrada', NOTIFICATION.info)
      const index = dataOrg.findIndex(
        (el) => el.storeId == cashId && el.date == date,
      )
      if (index < 0) return
      // const newArr = [...dataOrg]
      // newArr[index].status = [...newArr[index].status, StatusCompare.Cerrado]
      const newElement = Object.assign({}, dataOrg[index])
      const newStatus = newElement.status
        .filter((el) => el != StatusCompare.Listo)
        .concat(StatusCompare.Cerrado)
      newElement.status = newStatus
      setData([
        ...dataOrg.slice(0, index),
        newElement,
        ...dataOrg.slice(index + 1),
      ])
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setIsClosing(false)
    }
  }
  const columns = [
    {
      key: 'tbs-1',
      dataIndex: 'date',
      title: 'Fecha',
    },
    {
      key: 'tbs-2',
      dataIndex: 'nameStore',
      title: 'Caja',
    },
    {
      key: 'tbs-3',
      dataIndex: 'pendingMovements',
      title: 'Pendientes',
    },
    {
      key: 'tbs-4',
      dataIndex: 'efis',
      title: 'Saldo efisis',
      render: (value: safeAny) => <p>{fCurrency(value, false)}</p>,
    },
    {
      key: 'tbs-5',
      dataIndex: 'admin',
      title: 'Saldo admin',
      render: (value: safeAny) => <p>{fCurrency(value.balance, false)}</p>,
    },
    {
      key: 'tbs-5-1',
      dataIndex: 'status',
      title: 'Estado',
      render: (value: StatusCompare[]) => {
        return (
          <div>
            {value.map((el) => {
              return (
                <Tag key={el} color={getColor(el)}>
                  {el}
                </Tag>
              )
            })}
          </div>
        )
      },
    },
    {
      key: 'tbs-6',
      dataIndex: 'success',
      title: 'Listo para contable',
      render: (value: safeAny) => (
        <p>
          {value ? (
            <BsCheckCircleFill className="text-lime-600 w-4 h-auto" />
          ) : (
            <BsCheckCircleFill className="text-gray-300 w-4 h-auto" />
          )}
        </p>
      ),
    },
    {
      key: 'tbs-7',
      dataIndex: 'status',
      title: 'Cerrar caja',
      render: (value: safeAny, record: ICompareEfis) => {
        const isDisabled =
          value?.includes(StatusCompare.Cerrado) ||
          value?.includes(StatusCompare.Contabilizado)
        return (
          <Button
            disabled={isDisabled}
            type="default"
            size="small"
            loading={isClosing}
            onClick={() =>
              Modal.confirm({
                centered: true,
                title: 'Cerrar caja',
                content: '¿Desea cerrar la caja?',
                onOk: () => handlerClose(record.storeId, record.date),
                okText: 'Cerrar',
                cancelText: 'Cancelar',
              })
            }
          >
            Cerrar
          </Button>
        )
      },
    },
  ]

  const getColor = (status: StatusCompare) => {
    switch (status) {
      case StatusCompare.Descuadre:
        return 'error'
      case StatusCompare.Pendiente:
        return 'warning'
      case StatusCompare.Listo:
        return 'success'

      default:
        return 'default'
    }
  }

  useEffect(() => {}, [dataOrg])
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey={(record) => record.storeId + record.date}
    />
  )
}

const Filters = () => {
  const [value, setValue] = useRecoilState(dateFilterCompareSt)
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') >= 3
    const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 3
    return !!tooEarly || !!tooLate
  }

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null])
    } else {
      setDates(null)
    }
  }
  return (
    <div className="flex gap-2 items-center my-4">
      <p>Rango de fechas</p>
      <RangePicker
        value={dates || value}
        disabledDate={disabledDate}
        onCalendarChange={(val) => {
          setDates(val)
        }}
        onChange={(val) => {
          setValue(val)
        }}
        onOpenChange={onOpenChange}
        changeOnBlur
      />
    </div>
  )
}
