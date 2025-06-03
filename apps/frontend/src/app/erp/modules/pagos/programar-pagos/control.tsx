import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { AdmRequirementSelect, PAYMENT_STATUS, REQUIREMENT_TYPE } from '@types'
import { DatePicker, Select } from 'antd'
import { format, startOfISOWeek } from 'date-fns'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CompanySelectForm } from '../../requerimientos/components/company-select'
import { useProgramarPagosQuery, useProgramarPagosStore } from './state'

const RangePicker = DatePicker.RangePicker

const options: FilterOption<AdmRequirementSelect>[] = [
  {
    label: 'Id',
    operators: ['equal'],
    key: 'id',
    whereOption: {
      field: 'id',
    },
  },
  {
    label: 'Codigo',
    operators: ['equal'],
    key: 'code',
    whereOption: {
      field: 'request_code',
    },
  },
  {
    label: 'Descripción',
    operators: ['contain', 'equal'],
    key: 'description',
    whereOption: {
      field: 'description',
    },
  },
]

export default function Control() {
  const filters = useProgramarPagosStore((state) => state.filters)
  const set_filters = useProgramarPagosStore((state) => state.set_filters)
  const refresh = useProgramarPagosStore((state) => state.refresh)
  const { isLoading } = useProgramarPagosQuery()

  const handle_filter = () => {
    refresh()
  }

  // INICIA LOGICA PARA MENJAR SOLO UN ITEM DE FILTROS
  const param_1_option = 'range'

  const request_at: [string, string] = useMemo(() => {
    const data = filters.find((el) => el.field == 'requested_at')
    if (!data)
      return [
        format(startOfISOWeek(new Date()), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
      ]

    const [start, end] = data.value as [string, string]

    return [start, end]
  }, [filters])

  const change_request_at = (val: [string, string]) => {
    if (filters.some((el) => el.field == 'requested_at')) {
      set_filters(
        filters.map((el) => {
          if (el.field == 'requested_at') {
            return {
              ...el,
              value: val,
            }
          }
          return el
        }),
      )
    } else {
      set_filters([
        ...filters,
        {
          key: 'request_at',
          field: 'requested_at',
          operator: param_1_option,
          value: val,
        },
      ])
    }
  }

  // status
  const status: PAYMENT_STATUS = useMemo(() => {
    const data = filters.find((el) => el.field == 'status')
    if (!data) return PAYMENT_STATUS.APPROVED
    return data.value as PAYMENT_STATUS
  }, [filters])

  const change_status = (val: PAYMENT_STATUS) => {
    if (filters.some((el) => el.field == 'status')) {
      set_filters(
        filters.map((el) => {
          if (el.field == 'status') {
            return {
              ...el,
              value: val,
            }
          }
          return el
        }),
      )
    } else {
      set_filters([
        ...filters,
        {
          key: 'status',
          field: 'status',
          operator: 'equal',
          value: val,
        },
      ])
    }
  }

  return (
    <div className="flex gap-1 bg-white p-2 rounded-md my-1">
      <CompanySelectForm className="w-48" />
      <RangePicker
        className="w-72"
        allowClear={false}
        onChange={(val) => {
          if (val && val[0] && val[1]) {
            const start = val[0].format('YYYY-MM-DD')
            const end = val[1].format('YYYY-MM-DD')
            change_request_at([start, end])
          }
        }}
        value={[dayjs(request_at[0]), dayjs(request_at[1])]}
      />
      <Select
        className="w-48"
        placeholder="Tipo"
        allowClear={true}
        defaultValue={REQUIREMENT_TYPE.SUPPLIER}
      >
        <Select.Option value={REQUIREMENT_TYPE.SIMPLE}>Simple</Select.Option>
        <Select.Option value={REQUIREMENT_TYPE.SUPPLIER}>
          Proveedores
        </Select.Option>
      </Select>
      <Select
        className="w-48"
        placeholder="Estado"
        allowClear={false}
        defaultValue={PAYMENT_STATUS.APPROVED}
        value={status}
        onChange={(val) => {
          if (val) {
            change_status(val as PAYMENT_STATUS)
          }
        }}
      >
        <Select.Option value={PAYMENT_STATUS.SCHEDULED}>
          Programado
        </Select.Option>
        <Select.Option value={PAYMENT_STATUS.APPROVED}>Aprobados</Select.Option>
        <Select.Option value={PAYMENT_STATUS.REJECTED}>
          Rechazados
        </Select.Option>
      </Select>
      <FilterComponent
        options={options}
        onSearch={handle_filter}
        filters={filters}
        setFilters={set_filters}
        loading={isLoading}
      />
    </div>
  )
}
