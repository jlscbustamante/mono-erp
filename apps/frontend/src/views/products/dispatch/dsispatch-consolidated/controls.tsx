import { ExcelExportBtn } from '@/components/excel-btn'
import { DispatchSummary } from '@/data/hex/types'
import { filterSelectForm } from '@/utils'
import { Button, DatePicker, Select } from 'antd'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import dayjs from 'dayjs'
import { Printer } from 'lucide-react'
import ReactToPrint from 'react-to-print'
import * as XLSX from 'xlsx-js-style'
import { useCategories } from '../../hooks/use-categories'

const RangePicker = DatePicker.RangePicker

export const ConsolidatedControls = ({
  dates,
  setDates,
  reload,
  isLoading,
  tableRef,
  categorySelected,
  setCategorySelected,
  data,
}: {
  dates: string[]
  setDates: (dates: string[]) => void
  reload: () => void
  isLoading?: boolean
  tableRef: any
  categorySelected: string[]
  data?: { dispatches: DispatchSummary[]; dates: [string, string] }
  setCategorySelected: (categories: string[]) => void
}) => {
  const query = useCategories()

  const handle_export_excel = () => {
    //
    const info = data
    if (!info) {
      return
    }
    const start = parseISO(info.dates[0])
    const end = parseISO(info.dates[1])
    const _all_days = eachDayOfInterval({
      start,
      end,
    })
    const all_days = _all_days.map((el) => format(el, 'yyyy-MM-dd'))
    // console.log('data : ', info.dispatches)

    // Preparamos los datos para la hoja de Excel
    const rows: any[] = []

    // Encabezados de las columnas
    const headers = ['categoria', 'item', ...all_days, 'total']
    rows.push(headers)

    // Iteramos sobre cada elemento de DispatchSummary
    info.dispatches.forEach((summary) => {
      const row: any[] = []

      // Añadimos el categoryName y itemName
      row.push(summary.categoryName, summary.itemName)

      // Para cada fecha, buscamos el valor correspondiente en dates
      let total = 0
      all_days.forEach((date) => {
        const dateValue = summary.dates[date] || 0 // Si no hay valor para la fecha, dejamos vacío
        row.push(dateValue)
        total += dateValue || 0 // Sumamos los valores (en caso de ser vacío, consideramos 0)
      })

      // Añadimos el total al final de la fila
      row.push(total)

      // Añadimos la fila a los datos
      rows.push(row)
    })

    // Creamos una hoja de cálculo desde los datos
    const ws = XLSX.utils.aoa_to_sheet(rows)

    const borderStyle = {
      top: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
    }

    // Aplicar bordes a todas las celdas
    const range = XLSX.utils.decode_range(ws['!ref'] as string)
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })]
        if (cell) {
          cell.s = {
            border: borderStyle,
          }
        }
      }
    }

    // Creamos un libro de trabajo con la hoja de cálculo
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dispatch Summary')

    // Guardamos el archivo Excel
    XLSX.writeFile(wb, 'dispatch_summary2.xlsx')
  }
  return (
    <div className="flex gap-2 justify-between items-center">
      <div className="flex items-center gap-2">
        <RangePicker
          allowClear={false}
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(val) => {
            if (!val) return
            const newDates = val.map((el) => el?.format('YYYY-MM-DD') || '')
            setDates(newDates)
          }}
        />
        <Button type="primary" loading={isLoading} onClick={reload}>
          Cargar consolidado
        </Button>
        <Select
          placeholder="Categoría"
          mode="multiple"
          filterOption={filterSelectForm}
          showSearch
          allowClear={true}
          className="w-72"
          value={categorySelected}
          onChange={(val) => setCategorySelected(val)}
          loading={query.isLoading}
        >
          {query.data
            ?.sort((a, b) => a.category?.localeCompare(b.category ?? ''))
            ?.map((el) => (
              <Select.Option key={el.id} value={el.id}>
                {el.category}
              </Select.Option>
            ))}
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <ReactToPrint
          content={() => tableRef.current}
          trigger={() => (
            <Button type="primary">
              <Printer className="w-5 h-auto" />
            </Button>
          )}
        />
        <ExcelExportBtn onExport={handle_export_excel} />
      </div>
    </div>
  )
}
