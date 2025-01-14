import { ExcelExportBtn } from '@/components/excel-btn'
import { FiDatePicker } from '@/components/fillime/components/date'
import { FiRangePicker } from '@/components/fillime/components/range'
import { ActionFilters } from '@/components/fillime/filter-actions'
import { FillimeSelector } from '@/components/fillime/selector'
import { FilterOption } from '@/components/fillime/types'
import {
  SelectEmployee,
  SelectEmployeeShow,
} from '@/hooks/selects/employee-select'
import {
  SelectSucursal,
  SelectSucursalShow,
} from '@/hooks/selects/sucursal-select'
import { Select } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import dayjs from 'dayjs'
import { Attendance } from 'pizzadb'
import { useAsistenciaContext } from '.'
import { useAttendanceStore } from './state'

const options: FilterOption<Attendance>[] = [
  {
    title: 'Fecha',
    index: 'attendance_at',
    options: ['equal', 'range'],
    defaultByOp: {
      equal: dayjs().format('YYYY-MM-DD'),
      range: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    },
    type: 'date',
    render: (props) => {
      if (props.operator == 'equal')
        return <FiDatePicker {...props} allowClear={false} />
      else return <FiRangePicker {...props} allowClear={false} />
    },
    noAllowClear: true,
    hide: true,
  },
  {
    title: 'Tienda',
    index: 'sucursal_id',
    options: ['equal', 'in'],
    type: 'select',
    render: (props) => {
      return (
        <SelectSucursal
          extra={[
            {
              value: '$$isNull$$',
              label: 'SIN TIENDA',
            },
          ]}
          {...props}
          className="w-44"
          size="small"
          mode={props.operator == 'in' ? 'multiple' : undefined}
        />
      )
    },
    view: (val) => <SelectSucursalShow value={val.value} />,
    useMod: true,
  },
  {
    title: 'Empleado',
    index: 'employee_id',
    options: ['equal', 'in'],
    view: (val) => <SelectEmployeeShow value={val.value} />,
    render: (props) => {
      return (
        <SelectEmployee
          {...props}
          className="w-52"
          mode={props.operator == 'in' ? 'multiple' : undefined}
        />
      )
    },
  },
  {
    title: 'Evento',
    index: 'event',
    options: ['equal'],
    render: (props) => {
      return (
        <Select
          value={props.filValue}
          onChange={(val) => {
            props.onFilChange(val)
          }}
          size="small"
          className="w-full"
        >
          <Select.Option value={'ENTRADA'}>ENTRADA</Select.Option>
          <Select.Option value={'SALIDA'}>SALIDA</Select.Option>
        </Select>
      )
    },
  },
]

export const NavAsistencia = () => {
  const { data, addController, columns } = useAsistenciaContext()

  const filters = useAttendanceStore((st) => st.filters)
  const addFilter = useAttendanceStore((st) => st.addWhere)
  const removeFilter = useAttendanceStore((st) => st.removeWhere)
  const modFilter = useAttendanceStore((st) => st.modWhere)
  const clear = useAttendanceStore((st) => st.clear)

  const handleExport = () => {
    const dates = filters.where?.find(
      (el) => el.field == 'attendance_at',
    )?.value
    let str = ''
    if (Array.isArray(dates)) {
      const [start, end] = dates as [string, string]
      str = `${start.split(' ')[0]}-${end.split(' ')[0]}`
    } else {
      str = (dates as string).split(' ')[0]
    }

    const excel = new Excel()
    excel
      .addSheet('Asistencia')
      .addColumns([
        ...columns,
        {
          title: 'Cod. tienda',
          dataIndex: 'sucursal_id',
        },
        {
          title: 'Documento',
          dataIndex: ['employee', 'doc_number'],
        },
      ] as any)
      .addDataSource(data)
      .saveAs(`Asistencia-${str}.xlsx`)
  }

  const handleClear = () => {
    const keysAllowed = options
      .filter((el) => el.noAllowClear)
      .map((el) => el.index)
    clear(keysAllowed)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex item-center gap-2">
        <FillimeSelector
          options={options}
          filters={filters.where}
          addFilter={addFilter}
          removeFilter={removeFilter}
          modFilter={modFilter}
        />
        <ActionFilters
          clear={handleClear}
          search={() => {
            addController()
          }}
        />
      </div>
      <ExcelExportBtn onExport={handleExport} />
    </div>
  )
}
