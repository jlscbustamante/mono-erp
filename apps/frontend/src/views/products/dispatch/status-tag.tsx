import { Tag } from 'antd'

import { DISPATCH_STATUS } from '@/data/hex/types'

export const StatusTag = ({ status }: { status: DISPATCH_STATUS }) => {
  if (status == DISPATCH_STATUS.NEW) return <Tag color="blue">Pedido nuevo</Tag>
  else if (status == DISPATCH_STATUS.APPROVED)
    return <Tag color="gold">Pedido aprobado</Tag>
  else if (status == DISPATCH_STATUS.DISPATCHED)
    return <Tag color="green">Pedido despachado</Tag>
  else if (status == DISPATCH_STATUS.CANCELLED)
    return <Tag color="red">Pedido anulado</Tag>
  else if (status == DISPATCH_STATUS.INVOICED)
    return <Tag color="#1AA533">Facturado</Tag>

  return <Tag>Estado desconocido {status}</Tag>
}
