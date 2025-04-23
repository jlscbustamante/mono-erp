import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { AdmRequirementSelect, PAYMENT_STATUS, REQUIREMENT_TYPE } from '@types'
import { DatePicker, Select } from 'antd'
import { format, startOfWeek } from 'date-fns'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CompanySelectForm } from '../../requerimientos/components/company-select'
import { useListaEsperaStore, useRequirementsQuery } from './state'

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
    label: 'Fecha',
    operators: ['equal'],
    key: 'request_at',
    whereOption: {
      field: 'requested_at',
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
  const filters = useListaEsperaStore((state) => state.filters)
  const set_filters = useListaEsperaStore((state) => state.set_filters)
  const refresh = useListaEsperaStore((state) => state.refresh)
  const { isLoading } = useRequirementsQuery()

  const handle_filter = () => {
    refresh()
    // console.log('filterss.  ', filters)
  }

  //
  // const [value, set_value] = useSingleFilter(
  //   filters,
  //   set_filters,
  //   'request_at',
  //   [
  //     format(startOfWeek(new Date()), 'yyyy-MM-dd'),
  //     format(new Date(), 'yyyy-MM-dd'),
  //   ],
  //   'equal',
  // )

  // INICIA LOGICA PARA MENJAR SOLO UN ITEM DE FILTROS
  const param_1_option = 'equal'

  const request_at: [string, string] = useMemo(() => {
    const data = filters.find((el) => el.field == 'requested_at')
    if (!data)
      return [
        format(startOfWeek(new Date()), 'yyyy-MM-dd'),
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
  //

  return (
    <div className="flex gap-1 bg-white p-2 rounded-md my-1">
      <CompanySelectForm className="w-48" />
      <RangePicker
        className="w-72"
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
        defaultValue={'T'}
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
        defaultValue={PAYMENT_STATUS.REGISTERED}
      >
        <Select.Option value={PAYMENT_STATUS.REGISTERED}>Nuevos</Select.Option>
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
