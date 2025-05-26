import { viewClient } from '@/lib/rpc'
import { cn } from '@/utils'
import { WhereOption } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_TYPE } from '@view'
import { Input } from 'antd'
import { useMemo } from 'react'

const options: { label: string; value: REQUIREMENT_TYPE }[] = [
  {
    label: 'Proveedores',
    value: REQUIREMENT_TYPE.SUPPLIER,
  },
  {
    label: 'Simple',
    value: REQUIREMENT_TYPE.SIMPLE,
  },
  {
    label: 'Transferencia',
    value: REQUIREMENT_TYPE.TRANSFER,
  },
  {
    label: 'Liquidación',
    value: REQUIREMENT_TYPE.LIQUIDATION,
  },
]

export function SelectRequestType({
  className,
  value,
  onChange,
  filters,
  controlRefetch,
  month,
}: {
  className?: string
  value?: REQUIREMENT_TYPE
  onChange?: (value: REQUIREMENT_TYPE) => void
  filters?: WhereOption<any>[]
  controlRefetch?: number
  month?: number
}) {
  const query = useQuery({
    queryKey: ['rq:count-requirements', controlRefetch, value, month],
    enabled: !!filters,
    queryFn: async () => {
      const data = await viewClient.api.view.requirement.filterCount.$get({
        query: {
          filters: JSON.stringify(filters!),
          month: month?.toString(),
        },
      })
      const body = await data.json()
      return body.data as { type: REQUIREMENT_TYPE; count: number }[]
    },
  })
  const changeType = (type: REQUIREMENT_TYPE) => {
    onChange?.(type)
  }

  const countType: Record<REQUIREMENT_TYPE, number> = useMemo(() => {
    return (
      query.data?.reduce(
        (acc, el) => ({ ...acc, [el.type]: el.count }),
        {} as Record<REQUIREMENT_TYPE, number>,
      ) ?? ({} as Record<REQUIREMENT_TYPE, number>)
    )
  }, [query.data])

  return (
    <div className={cn('flex space-x-2', className)}>
      {options.map((option) => {
        return (
          <button
            onClick={() => changeType(option.value)}
            key={option.value}
            className={cn(
              'py-1 px-3 text-blue-500 border-blue-400 border-[0.5px] rounded-md font-sans hover:bg-blue-500 hover:text-white transition-colors ring-0 outline-none cursor-pointer bg-transparent',
              {
                'bg-blue-500 text-white': value === option.value,
              },
            )}
          >
            {option.label}{' '}
            {countType[option.value] ? `(${countType[option.value]})` : '(0)'}
          </button>
        )
      })}
    </div>
  )
}

export function InputRequestType({ value }: { value?: string }) {
  return (
    <Input
      readOnly
      value={
        value == REQUIREMENT_TYPE.SIMPLE
          ? 'Simple'
          : value == REQUIREMENT_TYPE.LIQUIDATION
            ? 'Liquidación'
            : value == REQUIREMENT_TYPE.SUPPLIER
              ? 'Proveedores'
              : value == REQUIREMENT_TYPE.TRANSFER
                ? 'Transferencia'
                : ''
      }
    />
  )
}
