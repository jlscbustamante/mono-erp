import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { AdmPaymentOrderSelect, ORDER_PAYMENT_STATUS } from '@types'
import { DatePicker, Select } from 'antd'
import { format, startOfISOWeek } from 'date-fns'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CompanySelectForm } from '../../requerimientos/components/company-select'
import { useAprobarPagosQuery, useAprobarPagosStore } from './state'

const RangePicker = DatePicker.RangePicker
const options: FilterOption<AdmPaymentOrderSelect>[] = []

export default function Control() {
  const filters = useAprobarPagosStore((state) => state.filters)
  const set_filters = useAprobarPagosStore((state) => state.set_filters)
  const refresh = useAprobarPagosStore((state) => state.refresh)
  const { isLoading } = useAprobarPagosQuery()

  const handle_filter = () => {
    refresh()
  }

  // INICIA LOGICA PARA MENJAR SOLO UN ITEM DE FILTROS
  const param_1_option = 'range'

  const payment_at: [string, string] = useMemo(() => {
    const data = filters.find((el) => el.field == 'payment_at')
    if (!data)
      return [
        format(startOfISOWeek(new Date()), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
      ]

    const [start, end] = data.value as [string, string]

    return [start, end]
  }, [filters])

  const change_payment_at = (val: [string, string]) => {
    if (filters.some((el) => el.field == 'payment_at')) {
      set_filters(
        filters.map((el) => {
          if (el.field == 'payment_at') {
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
          key: 'payment_at',
          field: 'payment_at',
          operator: param_1_option,
          value: val,
        },
      ])
    }
  }

  // status
  const status: ORDER_PAYMENT_STATUS = useMemo(() => {
    const data = filters.find((el) => el.field == 'status')
    if (!data) return ORDER_PAYMENT_STATUS.REGISTERED
    return data.value as ORDER_PAYMENT_STATUS
  }, [filters])

  const change_status = (val: ORDER_PAYMENT_STATUS) => {
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
    <div className="flex gap-1 bg-white p-2 rounded-md">
      <CompanySelectForm className="w-48" />
      <RangePicker
        className="w-72"
        allowClear={false}
        onChange={(val) => {
          if (val && val[0] && val[1]) {
            const start = val[0].format('YYYY-MM-DD')
            const end = val[1].format('YYYY-MM-DD')

            change_payment_at([start, end])
          }
        }}
        value={[dayjs(payment_at[0]), dayjs(payment_at[1])]}
      />
      <Select
        className="w-48"
        placeholder="Tipo"
        allowClear={true}
        defaultValue={'T'}
      >
        <Select.Option value="S">Simple</Select.Option>
        <Select.Option value="T">Transferencia</Select.Option>
      </Select>
      <Select
        className="w-48"
        placeholder="Estado"
        allowClear={false}
        value={status}
        onChange={(val) => {
          if (val) {
            change_status(val as ORDER_PAYMENT_STATUS)
          }
        }}
      >
        <Select.Option value={ORDER_PAYMENT_STATUS.REGISTERED}>
          Registrados
        </Select.Option>
        <Select.Option value={ORDER_PAYMENT_STATUS.APPROVED}>
          Aprobados
        </Select.Option>
        <Select.Option value={ORDER_PAYMENT_STATUS.SENT_TO_BANK}>
          Enviados al banco
        </Select.Option>
        <Select.Option value={ORDER_PAYMENT_STATUS.REJECTED}>
          Rechazados
        </Select.Option>
        <Select.Option value={ORDER_PAYMENT_STATUS.PAYMENT_COMPLETED}>
          Pagados
        </Select.Option>
      </Select>
      <FilterComponent
        options={options}
        filters={filters}
        setFilters={set_filters}
        onSearch={handle_filter}
        loading={isLoading}
      />
    </div>
  )
}
