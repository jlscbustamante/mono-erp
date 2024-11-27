import { Card, List } from 'antd'
import { useRecoilValue } from 'recoil'

import {
  netCashMovesSt,
  netEndingBalanceSt,
  netInitialBalanceSt,
} from '@/data/stores/state'
import { fNumber } from '@/utils/formatNumber'

export const EfisisMovements: React.FC<{ isError?: boolean }> = ({
  isError,
}) => {
  const cashMoves = useRecoilValue(netCashMovesSt)
  const initialBalance = useRecoilValue(netInitialBalanceSt)
  const netEndingBalance = useRecoilValue(netEndingBalanceSt)

  return (
    <Card className="max-w-md" style={{ minWidth: 400 }}>
      {!isError ? (
        <List
          header={
            <div className="flex justify-between font-bold">
              <span>SALDO INICIAL EFISIS</span>{' '}
              <span>
                {isNaN(initialBalance.balance)
                  ? '0.00'
                  : fNumber(initialBalance.balance)}
              </span>
            </div>
          }
          footer={
            <div className="flex justify-between font-bold">
              <span>SALDO FINAL</span>{' '}
              <span>
                {isNaN(netEndingBalance.balance)
                  ? '0.00'
                  : fNumber(netEndingBalance.balance)}
              </span>
            </div>
          }
          dataSource={cashMoves}
          renderItem={(item) => (
            <List.Item className="flex justify-between">
              <span>{item.nombreCat}</span>
              <span
                className={`${
                  item.tipo == 'F' || item.tipo == 'G' ? 'text-red-500' : ''
                }`}
              >
                {fNumber(item.valor)}
              </span>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-red-500 text-center">
          Ocurrio un error en la api .net
        </p>
      )}
    </Card>
  )
}
