import { cn } from '@/utils'
import { REQUIERMENT_TYPE } from '@view'

const options: { label: string; value: REQUIERMENT_TYPE }[] = [
  {
    label: 'Proveedores',
    value: REQUIERMENT_TYPE.SUPPLIER,
  },
  {
    label: 'Simple',
    value: REQUIERMENT_TYPE.SIMPLE,
  },
  {
    label: 'Transferencia',
    value: REQUIERMENT_TYPE.TRANSFER,
  },
  {
    label: 'Liquidación',
    value: REQUIERMENT_TYPE.LIQUIDATION,
  },
]

export function SelectRequestType({
  className,
  value,
  onChange,
}: {
  className?: string
  value?: REQUIERMENT_TYPE
  onChange?: (value: REQUIERMENT_TYPE) => void
}) {
  return (
    <div className={cn('flex space-x-2', className)}>
      {options.map((option) => {
        return (
          <button
            onClick={() => onChange?.(option.value)}
            key={option.value}
            className={cn(
              'py-1 px-3 text-blue-500 border-blue-400 border-[0.5px] rounded-md font-sans hover:bg-blue-500 hover:text-white transition-colors ring-0 outline-none cursor-pointer bg-transparent',
              {
                'bg-blue-500 text-white': value === option.value,
              },
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
