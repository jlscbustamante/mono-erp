import { cn } from '@/utils'
import { PAYMENT_STATUS } from '@types'
import { Tag } from 'antd'

export const payment_status_to_text = (status: PAYMENT_STATUS) => {
  if (status === PAYMENT_STATUS.REGISTERED) return 'Ingresado'
  if (status === PAYMENT_STATUS.SCHEDULED) return 'Programado'
  if (status === PAYMENT_STATUS.APPROVED) return 'Aprobado'
  if (status === PAYMENT_STATUS.SENT_TO_BANK) return 'Enviado a Banco'
  if (status === PAYMENT_STATUS.REJECTED) return 'Rechazado'
  if (status === PAYMENT_STATUS.PAID) return 'Pagado'
  if (status === PAYMENT_STATUS.CANCELED) return 'Anulado'
  return 'Desconocido'
}

export const PaymentStatusBadge = ({ status }: { status: PAYMENT_STATUS }) => {
  return (
    <Tag
      className={cn({
        'bg-green-100 text-green-800':
          status === PAYMENT_STATUS.PAID || status == PAYMENT_STATUS.APPROVED,
        'bg-red-100 text-red-800': status === PAYMENT_STATUS.REJECTED,
        'bg-blue-100 text-blue-800': status === PAYMENT_STATUS.REGISTERED,
        'bg-yellow-100 text-yellow-800': status === PAYMENT_STATUS.SCHEDULED,
        'bg-gray-100 text-gray-800': status === PAYMENT_STATUS.CANCELED,
      })}
    >
      {payment_status_to_text(status)}
    </Tag>
  )
}
