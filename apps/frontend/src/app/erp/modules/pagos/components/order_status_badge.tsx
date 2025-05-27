import { cn } from '@/utils'
import { ORDER_PAYMENT_STATUS } from '@types'
import { Tag } from 'antd'

export const payment_order_status_to_text = (status: ORDER_PAYMENT_STATUS) => {
  if (status === ORDER_PAYMENT_STATUS.REGISTERED) return 'Ingresado'
  if (status == ORDER_PAYMENT_STATUS.SENT_TO_BANK) return 'Enviado a banco'
  if (status === ORDER_PAYMENT_STATUS.AUTHORIZED) return 'Autorizado'
  if (status === ORDER_PAYMENT_STATUS.CANCELED) return 'Anulado'
  return 'Desconocido'
}

export const PaymentOrderStatusBadge = ({
  status,
}: {
  status: ORDER_PAYMENT_STATUS
}) => {
  return (
    <Tag
      className={cn({
        'bg-blue-100 text-blue-800': status === ORDER_PAYMENT_STATUS.REGISTERED,
        'bg-yellow-300': status == ORDER_PAYMENT_STATUS.SENT_TO_BANK,
        'bg-green-100 text-green-800':
          status === ORDER_PAYMENT_STATUS.AUTHORIZED,
        'bg-red-100 text-red-800': status === ORDER_PAYMENT_STATUS.CANCELED,
      })}
    >
      {payment_order_status_to_text(status)}
    </Tag>
  )
}
