import { FilterComponent } from '@/components/fifi'
import { Button, DatePicker } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CompanySelectForm } from '../../components/company-select'
import { SupplierSelectForm } from '../../components/supplier-select'
import { useSupplierAccount } from './state'

const RangePicker = DatePicker.RangePicker

export const Control = ({ loading }: { loading: boolean }) => {
  const refetch = useSupplierAccount((st) => st.refetch)
  const filters = useSupplierAccount((st) => st.filters)
  const setFilters = useSupplierAccount((st) => st.setFilters)

  const company: string | undefined = useMemo(() => {
    const element = filters.find((el) => el.field === 'company_id')
    return (element?.value as string) ?? undefined
  }, [filters])

  const onChange = (companyId: string | undefined) => {
    if (!companyId) {
      return setFilters(filters.filter((el) => el.field !== 'company_id'))
    }
    const exist = filters.find((el) => el.field === 'company_id')
    if (exist) {
      setFilters(
        filters.map((el) =>
          el.field === 'company_id' ? { ...el, value: companyId } : el,
        ),
      )
    } else {
      setFilters([
        ...filters,
        {
          key: 'company_id',
          field: 'company_id',
          operator: 'equal',
          value: companyId,
        },
      ])
    }
  }

  const supplier: number | undefined = useMemo(() => {
    const element = filters.find((el) => el.field === 'supplier_id')
    return element?.value as number
  }, [filters])

  const onChangeSupplier = (supplierId: number | undefined) => {
    if (!supplierId) {
      return setFilters(filters.filter((el) => el.field !== 'supplier_id'))
    }
    const exist = filters.find((el) => el.field === 'supplier_id')
    if (exist) {
      setFilters(
        filters.map((el) =>
          el.field === 'supplier_id' ? { ...el, value: supplierId } : el,
        ),
      )
    } else {
      setFilters([
        ...filters,
        {
          key: 'supplier_id',
          field: 'supplier_id',
          operator: 'equal',
          value: supplierId,
        },
      ])
    }
  }

  const requestAt: [string, string] = useMemo(() => {
    const date = filters.find((el) => el.field === 'requested_at')

    if (!date || !date.value) {
      return [
        format(new Date(), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
      ]
    }

    return date.value as [string, string]
  }, [filters])

  const changeRequestAt = (date: [string, string]) => {
    setFilters(
      filters.map((el) =>
        el.field === 'requested_at' ? { ...el, value: date } : el,
      ),
    )
  }

  return (
    <div className="flex items-center gap-2">
      <CompanySelectForm
        value={company}
        onChange={(val) => {
          onChange(val)
        }}
      />
      <RangePicker
        allowClear={false}
        value={[dayjs(requestAt[0]), dayjs(requestAt[1])]}
        onChange={(val) => {
          if (val && val[0] && val[1]) {
            changeRequestAt([
              val[0].format('YYYY-MM-DD'),
              val[1].format('YYYY-MM-DD'),
            ])
          }
        }}
      />

      <SupplierSelectForm
        value={supplier}
        onChange={(val) => {
          onChangeSupplier(val)
        }}
      />
      <FilterComponent
        hideActions={true}
        filters={filters}
        setFilters={setFilters}
      />
      <Button type="primary" onClick={refetch} loading={loading}>
        Consultar
      </Button>
    </div>
  )
}
