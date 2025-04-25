import { Select } from 'antd'

export const SelectCompanyPurchase = ({
  value,
  onChange,
}: {
  value?: string
  onChange?: (val: undefined | string) => void
}) => {
  return (
    <Select
      className="w-56"
      placeholder="Compañia"
      allowClear
      value={value}
      onChange={onChange}
    >
      <Select.Option value="PIERRESRAUL">
        PIERRE&apos;S PIZZA S.A.C
      </Select.Option>
      <Select.Option value="PIERRESSTAR">
        PIERRE&apos;S STAR S.A.C
      </Select.Option>
    </Select>
  )
}
