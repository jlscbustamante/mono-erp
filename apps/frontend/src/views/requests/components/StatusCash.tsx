import { Tag } from 'antd'

import { CashBalanceStatus } from '@/data/types'

export const ElementStatusCash: React.FC<{ status: CashBalanceStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'C':
      return <Tag color="green">Cerrado</Tag>
    case 'T':
      return <Tag color="green">Contabilizado</Tag>
    default:
      return <Tag color="blue">Abierto</Tag>
  }
}
