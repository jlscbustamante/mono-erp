import { useQuery } from '@tanstack/react-query'
import { Button, DatePicker, Select, Skeleton, Table, Tag, Tooltip } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import dayjs from 'dayjs'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { ExcelExportBtn } from '@/components/excel-btn'
import { getStockByRange } from '@/data/hex/inventory'
import { getSalesPos } from '@/data/hex/pos'
import { StockGeneral, WAREHOUSE_TYPE } from '@/data/hex/types'
import { queryClient } from '@/main'

import { cn, filterOption } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { PATHS } from '@/const/paths'
import { useSucursales } from './hooks/useSucursales'
import { ReportRatioDrawer, useReportRatioDrawer } from './ReportRatioDrawer'

const sucursalCodeSt = atom<string | undefined>({
  key: 'sucural-code-stock',
  default: undefined,
})
const RangePicker = DatePicker.RangePicker

export const ControlStock = () => {
  const [reducer, forceUpdate] = useReducer((prev) => prev + 1, 0)
  const navigate = useNavigate()
  const [sucursalCode, setSucursalCode] = useRecoilState(sucursalCodeSt)
  // const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [dates, setDates] = useState<[string, string]>([
    dayjs().format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ])
  const [showWarehouseColumns, setShowWarehouseColumns] = useState(false)

  const querySucursales = useSucursales()
  const { open } = useReportRatioDrawer()
  const isWarehouseSelected = useMemo(() => {
    if (!querySucursales.data) return false
    const item = querySucursales.data.find((el) => el.code === sucursalCode)
    if (!item) return false
    return item.type == WAREHOUSE_TYPE.WAREHOUSE
  }, [querySucursales.data, sucursalCode])
  const queryData = useData({
    sucursalCode,
    start: dates[0],
    end: dates[1],
    reducer,
  })

  const querySales = useSales({
    end: dates[1],
    reducer,
    start: dates[0],
    warehouseId: sucursalCode,
  })

  useEffect(() => {
    queryClient.setQueryData(
      ['control-stock', reducer],
      (prev: { stock: StockGeneral[]; lastClosed: string | null }) => {
        const relation: Record<number, number> = {}
        for (const item of querySales.data ?? []) {
          relation[item.itemId] = item.quantity
        }
        console.log('relation  . ', relation)
        if (!prev) return prev
        return {
          ...prev,
          stock: prev.stock.map((el) => {
            const sale = relation[el.itemId] ?? 0
            return {
              ...el,
              quantityOutSale: sale,
              stockCurrent: el.stockCurrent - sale,
            }
          }),
        }
      },
    )
  }, [querySales.data, queryData.isFetched])

  const dateColumn = {
    title: 'Fecha',
    dataIndex: 'stockAt',
  }

  const categoryColumn = {
    title: 'Categoría',
    dataIndex: 'categoryName',
    sorter: (a: any, b: any) =>
      a?.categoryName.localeCompare(b?.categoryName ?? ''),
    defaultSortOrder: 'ascend',
  }

  const idColumn = {
    title: 'Id',
    dataIndex: 'itemId',
  }

  const itemNameColumn = {
    title: 'Item',
    dataIndex: 'itemName',
    sorter: (a: any, b: any) => a.itemName.localeCompare(b.itemName),
  }
  const inicialColumn = {
    // title: 'I. inicial',
    title: 'I. inicial',
    dataIndex: 'initialStock',
    sorter: (a: any, b: any) => a.initialStock - b.initialStock,
    render: (val: number) => fNumber(val, 3),
    align: 'right',
    __cellType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }

  const compraAlmacenColumn = {
    title: 'Compra',
    dataIndex: 'quantityInPurchase',
    sorter: (a: any, b: any) => a.quantityInPurchase - b.quantityInPurchase,
    render: (val: number) => fNumber(val, 3),
    align: 'right',
    __cellType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const despachoAlmacenColumn = {
    title: 'Despacho',
    dataIndex: 'quantityOutDispatch',
    sorter: (a: any, b: any) => a.quantityOutDispatch - b.quantityOutDispatch,
    render: (val: number) => fNumber(val, 3),
    align: 'right',
    __cellType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const ingresoDespachoColumn = {
    title: 'In. Despacho',
    dataIndex: 'quantityInDispatch',
    sorter: (a: any, b: any) => a.quantityInDispatch - b.quantityInDispatch,
    render: (val: number) => fNumber(val, 3),
    align: 'right',
    __cellType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const ingresoDeTiendaColumn = {
    // title: 'In. Tienda',
    title: (
      <Tooltip
        className="flex items-center gap-1 justify-end"
        title="Ingreso de Tienda"
      >
        <ArrowDown className="h-auto w-5" />
        Tienda
      </Tooltip>
    ),
    showSorterTooltip: false,
    dataIndex: 'quantityInMv',
    sorter: (a: any, b: any) => a.quantityInMv - b.quantityInMv,
    render: (val: number) => fNumber(val, 3),
    align: 'right',
    __cellType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const salidaDeTiendaColumn = {
    // title: 'Out Tienda',
    title: (
      <Tooltip
        className="flex items-center gap-1 justify-end"
        title="Salida de tienda"
      >
        <ArrowUp className="h-auto w-5" />
        Tienda
      </Tooltip>
    ),
    showSorterTooltip: false,
    dataIndex: 'quantityOutMv',
    sorter: (a: any, b: any) => a.quantityOutMv - b.quantityOutMv,
    render: (val: number) => fNumber(val, 3),
    align: 'right',
    __cellType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const teoricoColumn = {
    title: 'Teórico',
    dataIndex: 'stockCurrent',
    align: 'right',
    render: (val: number) => fNumber(val, 3),
    __renderType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const fisicoColumn = {
    title: 'Físico',
    dataIndex: 'stockPhysical',
    sorter: (a: any, b: any) => a.stockPhysical - b.stockPhysical,
    align: 'right',
    render: (val: number) => fNumber(val, 3),
    __renderType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const diferenciaColumn = {
    title: 'Diferencia',
    align: 'right',
    render: (record: StockGeneral) => {
      const diff = record.stockPhysical - record.stockCurrent
      return (
        <p
          className={cn({
            'text-red-600': diff < 0,
          })}
        >
          {fNumber(diff, 3)}
        </p>
      )
    },
    __excelRender__: (_: unknown, record: StockGeneral) => {
      const diff = record.stockPhysical - record.stockCurrent
      return Number(diff)
    },
    __renderType__: 'TypeNumeric',
    // excelRender: (val: number) => Number(val),
  }
  const unitValueColumn = {
    title: 'C.U',
    dataIndex: 'unitValue',
    align: 'right',
    render: (val: any) => fNumber(val),
    __renderType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const totalValueColum = {
    title: 'C.T',
    dataIndex: 'totalValue',
    sorter: (a: any, b: any) => a.totalValue - b.totalValue,
    align: 'right',
    render: (val: number) => fNumber(val),
    __renderType__: 'TypeNumeric',
    excelRender: (val: number) => Number(val),
  }
  const saleColumn = {
    title: 'Venta',
    align: 'right',
    dataIndex: 'quantityOutSale',
    render: (val: number) => {
      return fNumber(val)
    },
  }
  const consumptionColumn = {
    title: 'Consumo',
    align: 'right',
    render: (record: StockGeneral) => {
      // consumo = inicial + despacho - salida - fisico
      const consumo = calculateConsumption(isWarehouseSelected, record)
      return <p className="text-right">{fNumber(consumo)}</p>
    },
    excelRender: (_: unknown, record: StockGeneral) => {
      const consumo = calculateConsumption(isWarehouseSelected, record)
      return Number(consumo)
    },
    __excelRenderType__: 'TypeNumeric',
  }

  const columnsStore = [
    dateColumn,
    categoryColumn,
    idColumn,
    itemNameColumn,
    inicialColumn,
    ingresoDespachoColumn,
    ingresoDeTiendaColumn,
    salidaDeTiendaColumn,
    saleColumn,
    consumptionColumn,
    teoricoColumn,
    fisicoColumn,
    diferenciaColumn,
    unitValueColumn,
    totalValueColum,
  ]
  const columnsWarehouse = [
    dateColumn,
    categoryColumn,
    idColumn,
    itemNameColumn,
    inicialColumn,
    compraAlmacenColumn,
    despachoAlmacenColumn,
    consumptionColumn,
    teoricoColumn,
    fisicoColumn,
    diferenciaColumn,
    unitValueColumn,
    totalValueColum,
  ]

  const totalValue = useMemo(() => {
    if (!queryData.data) return ''
    const total = queryData.data?.stock.reduce((acc, el) => {
      return acc + el.totalValue
    }, 0)
    return fNumber(total)
  }, [queryData.data])

  const exportToExcel = () => {
    const stock = queryData.data
    if (!stock) {
      toast.warning('No hay datos para exportar')
      return
    }
    try {
      const excel = new Excel()
      const date = dates[0] === dates[1] ? dates[0] : `${dates[0]}-${dates[1]}`
      excel
        .addSheet('Stock')
        .addColumns(
          showWarehouseColumns
            ? (columnsWarehouse as any)
            : (columnsStore as any),
        )
        .addDataSource(stock.stock)
        .saveAs(`Reporte inventario ${date}.xlsx`)
    } catch (err: any) {
      toast.error(err?.message)
    }
  }

  useEffect(() => {
    setShowWarehouseColumns(isWarehouseSelected)
  }, [reducer])

  return (
    <div>
      <div className="flex justify-between items-end mb-5">
        <div className="flex gap-2 items-center">
          <Select
            placeholder="Sucursal"
            className="w-52"
            options={querySucursales.data?.map((el) => ({
              label: el.name,
              value: el.code,
            }))}
            loading={querySucursales.isLoading}
            value={sucursalCode}
            onChange={setSucursalCode}
            showSearch
            filterOption={filterOption as any}
            allowClear={false}
          />
          <RangePicker
            allowClear={false}
            value={[dayjs(dates[0]), dayjs(dates[1])]}
            onChange={(val: any) => {
              const start = val[0]?.format('YYYY-MM-DD')
              const end = val[1]?.format('YYYY-MM-DD')
              if (start && end) {
                setDates([start, end])
              }
            }}
          />
          {/* <DatePicker
            allowClear={false}
            value={dayjs(date)}
            onChange={(val: any) => setDate(val.format('YYYY-MM-DD'))}
          /> */}
          <Button
            type="primary"
            onClick={() => forceUpdate()}
            loading={queryData.isLoading}
            shape="circle"
            icon={<FiSearch />}
            className="flex items-center justify-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            className={isWarehouseSelected ? undefined : 'hidden'}
            onClick={() => {
              if (!sucursalCode) return
              navigate(
                `${PATHS.erp.modulos.mercaderia.stockAlmacen}?warehouse=${sucursalCode}`,
              )
            }}
          >
            Hacer inventario
          </Button>
          <Button
            // className={isWarehouseSelected ? 'hidden' : undefined}
            // className="hidden"
            onClick={() => {
              open(sucursalCode)
            }}
          >
            Reporte de ratio
          </Button>
          <ExcelExportBtn onExport={exportToExcel} />
        </div>
      </div>
      {totalValue && (
        <div className="flex mb-3 justify-between items-center">
          <p className="text-sm text-slate-800">
            {queryData.data?.lastClosed
              ? `Ultimo Cierre: ${queryData.data?.lastClosed}`
              : ''}
          </p>
          <Tag color="magenta" className="!text-base">
            Valor total S/. {totalValue}
          </Tag>
        </div>
      )}
      {!sucursalCode && (
        <div className="py-5 center bg-slate-100 text-center">
          Selecciona una tienda
        </div>
      )}
      {queryData.isError && (
        <div className="py-5 center bg-red-100 text-center">
          Ocurrio un error : {queryData.error.message}
        </div>
      )}
      {queryData.isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton.Input active className="block !w-full" />
          <Skeleton.Input active className="block !w-full" />
          <Skeleton.Input active className="block !w-full" />
          <Skeleton.Input active className="block !w-full" />
        </div>
      )}
      {!queryData.isLoading && queryData.data?.stock.length === 0 && (
        <div className="bg-slate-100 p-5 py-4 text-center">
          No se encontro inventario para la fecha seleccionada
        </div>
      )}
      {!queryData.isFetched && !queryData.isLoading && sucursalCode && (
        <div className="py-5 center bg-slate-100 text-center">
          Click en el boton para buscar el inventario
        </div>
      )}
      {!queryData.isLoading &&
        queryData.data &&
        queryData.data.stock.length > 0 && (
          <Table
            bordered={true}
            pagination={false}
            size="small"
            columns={
              showWarehouseColumns
                ? (columnsWarehouse as any)
                : (columnsStore as any)
            }
            dataSource={queryData.data.stock}
            rowKey={(el) => el.itemId}
          />
        )}
      <ReportRatioDrawer />
    </div>
  )
}

const useData = ({
  sucursalCode,
  start,
  end,
  reducer,
}: {
  sucursalCode?: string
  start: string
  end: string
  reducer: number
}) => {
  const query = useQuery({
    queryKey: ['control-stock', reducer],
    enabled: !!sucursalCode && reducer != 0,
    // queryFn: () => getStockByStore(sucursalCode!, date),
    // queryFn: () => getAnyStockByStore(sucursalCode!, date),
    queryFn: () =>
      getStockByRange(sucursalCode!, {
        end,
        start,
      }),
  })

  return query
}

const useSales = ({
  start,
  end,
  reducer,
  warehouseId,
}: {
  start: string
  end: string
  reducer: number
  warehouseId?: string
}) => {
  const query = useQuery({
    queryKey: ['control-stock-sales', reducer],
    enabled: !!warehouseId && reducer != 0,
    queryFn: () => getSalesPos(warehouseId!, start, end),
  })
  return query
}

const calculateConsumption = (
  isWarehouse: boolean,
  stock: StockGeneral,
): number => {
  if (isWarehouse) {
    return (
      stock.initialStock +
      stock.quantityInPurchase -
      stock.quantityOutDispatch -
      stock.stockPhysical
    )
  }
  // es tienda
  return (
    stock.initialStock +
    stock.quantityInMv +
    stock.quantityInDispatch -
    stock.quantityOutMv -
    stock.stockPhysical
  )
}
