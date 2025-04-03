import { InputNumber } from 'antd'

/**
 *
 * @description Muestra el numero como positivo pero lo guarda como negativo
 */
export const CustomInputPositive = ({
  value,
  onChange,
}: {
  value?: number
  onChange?: (value: number | null) => void
}) => {
  return (
    <InputNumber
      className="w-full"
      value={value ? Math.abs(value) : 0}
      onChange={(val) => {
        if (val) {
          onChange?.(-Math.abs(val))
        } else {
          onChange?.(0)
        }
      }}
    />
  )
}
