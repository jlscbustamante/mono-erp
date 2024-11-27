import { Tag } from 'antd'

import { RequestStatus } from '@/data/requests/types'

export const RequestStatusTag: React.FC<{ status: RequestStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'C':
      return <Tag color="default">Cerrado</Tag>
    case 'T':
      return <Tag color="default">Contabilizado</Tag>
    default:
      return <Tag color="green">Approbado</Tag>
  }
}
