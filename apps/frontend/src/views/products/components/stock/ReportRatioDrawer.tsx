import { useMutation } from '@tanstack/react-query'
import { Button, DatePicker, Divider, Drawer, Select } from 'antd'
import { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import {
  CashRegisterReport,
  getCashReport,
  getInventoryReport,
  InventoryReport,
} from '@/data/hex/inventory/reports'
import { WAREHOUSE_TYPE } from '@/data/hex/types'
import { cn, fCurrency, filterSelectForm } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { useSucursales } from './hooks/useSucursales'

const RangePicker = DatePicker.RangePicker

const reportRatioAtom = atom<{
  open: boolean
  sucursalCode?: string
}>({
  key: 'reportRatioAtom',
  default: {
    open: false,
  },
})

export const useReportRatioDrawer = () => {
  const [reportRatio, setReportRatio] = useRecoilState(reportRatioAtom)

  const open = (sucursalCode?: string) =>
    setReportRatio({
      open: true,
      sucursalCode,
    })
  const close = () =>
    setReportRatio({
      open: false,
      sucursalCode: undefined,
    })

  return {
    isOpen: !!reportRatio.open,
    sucursalCode: reportRatio.sucursalCode,
    open,
    close,
  }
}

export const ReportRatioDrawer = () => {
  const { isOpen, close } = useReportRatioDrawer()
  const [date, setDate] = useState<[Dayjs | null, Dayjs | null]>([null, null])
  const [code, setCode] = useState<string | null>(null)
  const [cashReport, setCashReport] = useState<null | CashRegisterReport>(null)
  const [inventoryReport, setInventoryReport] =
    useState<null | InventoryReport>(null)

  const isDisabled = useMemo(() => {
    return !!date[0] && !!date[1] && code
  }, [date, code])

  const querySucursales = useSucursales()

  const loadInventoryReport = useMutation({
    mutationFn: getInventoryReport,
    onSuccess: (data) => {
      setInventoryReport(data)
    },
    onError: () => {
      toast.error('Error interno al cargar el reporte de inventario')
    },
  })
  const loadsCashReport = useMutation({
    mutationFn: getCashReport,
    onSuccess: (data) => {
      setCashReport(data)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const consumption = useMemo(() => {
    if (!inventoryReport || !cashReport) return '-'
    const con =
      inventoryReport.initialStockValue +
      inventoryReport.warehouseDispatch +
      inventoryReport.storeDispatch -
      inventoryReport.storeOutgoing -
      inventoryReport.saldoFinal
    return fCurrency(con, true) as string
  }, [inventoryReport, cashReport])
  const ratio = useMemo(() => {
    if (!inventoryReport || !cashReport) return '-'
    const con =
      inventoryReport.initialStockValue +
      inventoryReport.warehouseDispatch +
      inventoryReport.storeDispatch -
      inventoryReport.storeOutgoing -
      inventoryReport.saldoFinal
    if (cashReport.sales === 0) return '0'
    const ratio = con / cashReport.sales
    return fNumber(ratio * 100, 2).toString() as string
  }, [inventoryReport, cashReport])

  const handleSearch = () => {
    console.log('cargar : ', isDisabled)
    if (!isDisabled) return
    loadInventoryReport.mutate({
      code: code!,
      end: date[1]!.format('YYYY-MM-DD'),
      start: date[0]!.format('YYYY-MM-DD'),
    })
    loadsCashReport.mutate({
      code: code!,
      end: date[1]!.format('YYYY-MM-DD'),
      start: date[0]!.format('YYYY-MM-DD'),
    })
  }

  return (
    <Drawer open={isOpen} onClose={close} width={850} title="REPORTE DE RATIO">
      <div className="flex justify-end gap-2">
        <RangePicker
          allowClear={false}
          value={date}
          onChange={(val) => {
            if (!val) return
            setDate(val)
          }}
        />
        <Select
          loading={querySucursales.isLoading}
          showSearch
          allowClear={false}
          value={code}
          placeholder="Sucursal"
          onChange={(val) => setCode(val)}
          filterOption={filterSelectForm}
          className="flex-1 max-w-[260px]"
        >
          {querySucursales.data
            ?.filter((el) => el.type != WAREHOUSE_TYPE.WAREHOUSE)
            ?.map((el) => {
              return (
                <Select.Option key={el.code} value={el.code}>
                  {el.name}
                </Select.Option>
              )
            })}
        </Select>
        <Button
          type="primary"
          loading={loadInventoryReport.isPending || loadsCashReport.isPending}
          onClick={() => handleSearch()}
          disabled={!isDisabled}
          className="w-[140px]"
        >
          Mostrar
        </Button>
      </div>
      {!isDisabled && (
        <div className="h-[360px] font-sans flex items-center justify-center">
          <p className="text-center">Por favor seleccione un rango de fechas</p>
        </div>
      )}
      <ContentReport
        inventario={inventoryReport ?? undefined}
        cash={cashReport ?? undefined}
        consumption={consumption}
        ratio={ratio}
      />
    </Drawer>
  )
}

const ContentReport = ({
  inventario,
  cash,
  consumption,
  ratio,
}: {
  inventario?: InventoryReport
  cash?: CashRegisterReport
  consumption: string
  ratio: string
}) => {
  return (
    <>
      <div
        className="grid grid-cols-3 gap-3 mt-6"
        style={{
          gridTemplateColumns: '1fr auto 1fr',
        }}
      >
        {cash && <CashInfoBox report={cash} />}
        <div className="w-[1px] bg-slate-400/20 h-full"></div>
        {inventario && (
          <InventoryInfoBox report={inventario} consumption={consumption} />
        )}
      </div>
      {inventario && cash && (
        <div className="bg-indigo-500 text-white text-center px-3 py-2.5 rounded font-semibold font-sans mt-3">
          RATIO DE TIENDA : {ratio}%
        </div>
      )}
    </>
  )
}

const CashInfoBox = ({ report }: { report?: CashRegisterReport }) => {
  if (!report)
    return (
      <div className="flex justify-center items-center">
        <p>Sin información</p>
      </div>
    )
  return (
    <div>
      <Divider orientation="left">CAJA</Divider>
      <ul className="space-y-2.5">
        <ItemList name="SALDO INICIAL EN CAJA" value={report.initialBalance} />
        <ItemList name="VENTAS" value={report.sales} />
        <ItemList name="OTROS INGRESOS" value={report.otherIncome} />
        <ItemList
          name="DEPOSITO EFECTIVO"
          value={report.cashDeposit}
          isOutgoing={true}
        />
        <ItemList
          name="MEDIOS DE PAGO"
          value={report.paymentMethods}
          isOutgoing={true}
        />
        <ItemList
          name="OTROS EGRESOS"
          value={report.otherExpenses}
          isOutgoing={true}
        />
      </ul>
      <p className="flex justify-between font-semibold text-lg mt-3 text-slate-800">
        <span>SALDO EN CAJA</span>
        <span>{fCurrency(report.saldoCaja, true)}</span>
      </p>
    </div>
  )
}

const InventoryInfoBox = ({
  report,
  consumption,
}: {
  report?: InventoryReport
  consumption: string
}) => {
  if (!report)
    return (
      <div className="flex justify-center items-center">
        <p>Sin información</p>
      </div>
    )
  return (
    <div>
      <Divider orientation="left">INVENTARIO</Divider>
      <ul className="space-y-2.5">
        <ItemList
          name="SALDO INICIAL DE MERCADERIA"
          value={report.initialStockValue}
        />
        <ItemList name="DESPACHO ALMACEN" value={report.warehouseDispatch} />
        <ItemList name="DESPACHO TIENDA" value={report.storeDispatch} />
        <ItemList
          name="COMPRA DE MERCADERIA"
          value={report.merchandisePurchase}
          isOutgoing={false}
        />
        <ItemList
          name="SALIDA TIENDA"
          value={report.storeOutgoing}
          isOutgoing={true}
        />
        <li className="flex justify-between font-bold font-sans text-red-700">
          <span>CONSUMO</span>
          <span>{consumption}</span>
        </li>
      </ul>
      <p className="flex justify-between font-semibold text-lg mt-3 text-slate-800">
        <span>SALDO EN INVENTARIO</span>
        <span>{fCurrency(report.saldoFinal, true)}</span>
      </p>
    </div>
  )
}

const ItemList = ({
  name,
  value,
  isOutgoing,
}: {
  name: string
  value: number
  isOutgoing?: boolean
}) => {
  return (
    <li
      className={cn('flex justify-between font-bold font-sans', {
        'text-red-700': isOutgoing,
        'text-lime-700': !isOutgoing,
      })}
    >
      <span>{name}</span>
      <span>{fCurrency(value, true)}</span>
    </li>
  )
}
