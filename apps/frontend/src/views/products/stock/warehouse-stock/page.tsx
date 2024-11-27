import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, DatePicker } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  getEditTemplate,
  lastClosedDate,
  saveStock,
} from '@/data/hex/inventory'
import { StockItemToCreateDto } from '@/data/hex/types'

import { TableEditStock } from './table-edit'

export default function WarehouseStockPage() {
  const [searchParams] = useSearchParams()
  const warehouse = searchParams.get('warehouse') as string
  const lastQuery = useQuery({
    queryKey: ['last-stock'],
    enabled: !!warehouse,
    queryFn: async (): Promise<{ date: string | null }> => {
      return await lastClosedDate(warehouse)
    },
  })

  const [dataSource, setDataSource] = useState<StockItemToCreateDto[]>([])

  const [date, setDate] = useState<null | string>(null)

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    if (!current && !lastQuery.data?.date) return false
    if (lastQuery.data?.date == null)
      return current.format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD')
    const currentString = current.format('YYYY-MM-DD')
    const nextDate = dayjs(lastQuery.data.date)
      .add(1, 'day')
      .format('YYYY-MM-DD')
    return (
      currentString < lastQuery.data.date ||
      currentString > nextDate ||
      currentString > dayjs().format('YYYY-MM-DD')
    )
  }

  const saveStockMt = useMutation({
    mutationFn: saveStock,
    onSuccess: () => {
      lastQuery.refetch()
      toast.success('Stock guardado')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleSaveInventory = () => {
    if (!date) return
    saveStockMt.mutate({ stock: dataSource, date, warehouse: warehouse })
  }

  const copyTeoricalToPhysical = () => {
    const newDataSource = dataSource.map((el) => {
      return {
        ...el,
        stockPhysical: el.stockCurrent,
        totalValue: el.stockCurrent * el.unitValue,
      }
    })
    setDataSource(newDataSource)
  }

  const setEditTemplate = useMutation({
    mutationFn: async ({
      date,
      sucursalCode,
    }: {
      date: string
      sucursalCode: string
    }) => {
      return await getEditTemplate(sucursalCode, date)
    },
    onSuccess: (data) => {
      setDataSource(data)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleSearch = () => {
    if (date) {
      setEditTemplate.mutate({ date, sucursalCode: warehouse })
    }
  }

  if (!warehouse)
    return (
      <div className="p-3 ">
        <div className="p-2 text-center my-4">
          Revisa la url, no se encontro la sucursal
        </div>
      </div>
    )
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-end gap-1">
          <DatePicker
            disabledDate={disabledDate}
            disabled={lastQuery.isFetching}
            className="w-48"
            value={date ? dayjs(date) : null}
            onChange={(e: any) => setDate(e.format('YYYY-MM-DD'))}
            allowClear={false}
            showToday={false}
          />
          <Button
            type="primary"
            disabled={lastQuery.isFetching || !date || lastQuery.isPending}
            loading={lastQuery.isFetching || setEditTemplate.isPending}
            shape="circle"
            onClick={handleSearch}
            icon={<FiSearch />}
            className="flex items-center justify-center"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button onClick={copyTeoricalToPhysical}>
            Copiar teorico a fisico
          </Button>
          <Button
            type="primary"
            onClick={handleSaveInventory}
            disabled={
              !date || dataSource.length === 0 || setEditTemplate.isPending
            }
            loading={saveStockMt.isPending}
          >
            Guardar inventario
          </Button>
        </div>
      </div>
      <p className="text-slate-700 text-sm ml-1 mt-1">
        Ultimo inventario {warehouse ? `de ${warehouse}` : null} :{' '}
        {lastQuery?.data?.date}
      </p>
      <div>
        <TableEditStock dataSource={dataSource} setDataSource={setDataSource} />
      </div>
    </div>
  )
}
