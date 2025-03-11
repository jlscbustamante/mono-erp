import { REQUIREMENT_STATUS } from '@view'
import { Tag } from 'antd'

export const StatusTag = ({ status }: { status: REQUIREMENT_STATUS }) => {
  return (
    <Tag color={'green'}>
      {status == REQUIREMENT_STATUS.PENDING
        ? 'Pendiente'
        : status == REQUIREMENT_STATUS.CANCELLED
          ? 'Cancelado'
          : status == REQUIREMENT_STATUS.PAID
            ? 'Pagados'
            : status == REQUIREMENT_STATUS.APPROVED
              ? 'Aprobado'
              : 'No definido'}
    </Tag>
  )
}
