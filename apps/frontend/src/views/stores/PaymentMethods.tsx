import {
  Button,
  Checkbox,
  DatePicker,
  Popover,
  Space,
  Table,
  Tooltip,
} from 'antd'
import dayjs from 'dayjs'
import { Suspense, useEffect, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

import { CashMoveStatus } from '@/data/stores/types'
import {
  IInfoPaymentMethod,
  IInfoPaymentMethodStore,
} from '@/data/stores/types/paymentMethods'
import { safeAny } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { InfoPosTerminalDrawer } from './components/paymentMethod/InfoPosTerminalDrawer'
import ProcessRunDrawer from './components/paymentMethod/ProcessRunDrawer'
import { TransactionsByMethodDrawer } from './components/paymentMethod/TransactionsByMethodDrawer'
import {
  usePaymentMethod,
  usePaymentMethodStore,
} from './state/usePaymentMethod'

export default function PaymentMethods() {
  const { excludeStatus, info } = usePaymentMethodStore()
  const { loadStatus, onSearch } = usePaymentMethod()

  useEffect(() => {
    loadStatus()
  }, [])

  useEffect(() => {
    if (info.length > 0) onSearch()
  }, [excludeStatus])

  return (
    <div className="p-3">
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 4px 1fr' }}>
        <MethodsReport />
        <div className="bg-blue-400"></div>
        <StoreReport />
      </div>
      <InfoPosTerminalDrawer />
      <TransactionsByMethodDrawer />
    </div>
  )
}

const Header = () => {
  const { date, setDate, loading, excludeStatus, steps } =
    usePaymentMethodStore()
  const { loadDataFromEfisis, onChangeExclude, onSearch } = usePaymentMethod()
  const [openProcessDrawer, setOpenProcessDrawer] = useState(false)

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center mb-4">
        Fecha :{' '}
        <DatePicker
          allowClear={false}
          value={dayjs(date)}
          onChange={(e: safeAny) => setDate(e.format('YYYY-MM-DD'))}
        />
        <Button type="primary" onClick={onSearch} loading={loading.getInfo}>
          Buscar
        </Button>
      </div>
      <div className="flex gap-1 items-center">
        <Button size="small" onClick={() => setOpenProcessDrawer(true)}>
          Correr procesos
        </Button>
        <Popover
          trigger={'click'}
          arrow={false}
          placement="bottomRight"
          content={
            <div className="w-56">
              <Checkbox.Group
                value={excludeStatus
                  .filter((el) => el.exclude)
                  .map((el) => el.title)}
                onChange={(es) => {
                  onChangeExclude(es as string[])
                }}
                className="flex flex-col gap-1"
                options={excludeStatus?.map((el) => ({
                  label: el.title,
                  value: el.title,
                }))}
              />
            </div>
          }
        >
          <Button size="small" loading={!steps.loadStatus}>
            Excluir estados : {excludeStatus.filter((el) => el.exclude).length}
          </Button>
        </Popover>
        <Button
          size="small"
          onClick={loadDataFromEfisis}
          loading={loading.loadEfis}
        >
          Cargar datos de efisis del {date}
        </Button>
        <Tooltip
          title={
            <span>
              Esta accion solo deberia ser realizada una vez por fecha.
              <br />
              Es recomendable cuando una fecha no tiene datos, puede tardar unos
              minutos
            </span>
          }
          placement="bottomRight"
        >
          <div>
            <FaInfoCircle />
          </div>
        </Tooltip>
      </div>
      <Suspense fallback={null}>
        <ProcessRunDrawer
          open={openProcessDrawer}
          onClose={() => {
            setOpenProcessDrawer(false)
          }}
        />
      </Suspense>
    </div>
  )
}

const MethodsReport = () => {
  const { loading, info, setInfoPosDrawer, setTransactionDrawer } =
    usePaymentMethodStore()
  const openInfoPos = (code: string, name: string) => {
    setInfoPosDrawer({
      open: true,
      sucursalcode: code,
      name,
    })
  }
  const openTransaction = (sucursalcode: string, method: string) => {
    setTransactionDrawer({
      open: true,
      sucursalcode,
      method,
    })
  }
  const columns = [
    {
      title: 'Tienda',
      dataIndex: ['store', 'name'],
      render: (name: string, record: IInfoPaymentMethod) => {
        return (
          <p
            className="link hover:underline hover:cursor-pointer text-blue-600"
            onClick={() =>
              openInfoPos(
                record.sucursalcode,
                record.store?.name ?? record.sucursalcode,
              )
            }
          >
            {name ? (
              name
            ) : (
              <span className="line-through">{record.sucursalcode}</span>
            )}
          </p>
        )
      },
    },
    {
      title: 'Izipay',
      dataIndex: 'izipay',
      render: (amount: number, record: IInfoPaymentMethod) => {
        return (
          <p
            className="link hover:underline hover:cursor-pointer text-blue-600"
            onClick={() => {
              openTransaction(record.sucursalcode, 'izipay')
            }}
          >
            {fNumber(amount)}
          </p>
        )
      },
    },
    {
      title: 'Culqi',
      dataIndex: 'culqi',
      render: (amount: number, record: IInfoPaymentMethod) => {
        return (
          <p
            className="link hover:underline hover:cursor-pointer text-blue-600"
            onClick={() => {
              openTransaction(record.sucursalcode, 'culqi')
            }}
          >
            {fNumber(amount)}
          </p>
        )
      },
    },
    {
      title: 'subtotal',
      render: (record: IInfoPaymentMethod) => {
        return fNumber(Number(record.izipay ?? 0) + Number(record.culqi ?? 0))
      },
    },
    {
      title: 'Online',
      dataIndex: 'online',
      render: (amount: number, record: IInfoPaymentMethod) => {
        return (
          <p
            className="link hover:underline hover:cursor-pointer text-blue-600"
            onClick={() => {
              openTransaction(record.sucursalcode, 'online')
            }}
          >
            {fNumber(amount)}
          </p>
        )
      },
    },
    {
      title: 'Total',
      render: (record: IInfoPaymentMethod) => {
        return (
          <span className={`${record.success ? '' : 'text-red-600'}`}>
            {fNumber(Number(record.izipay ?? 0) + Number(record.culqi ?? 0))}
          </span>
        )
      },
    },
  ]
  return (
    <>
      <Table
        rowKey={(el) => el.sucursalcode + '-method'}
        title={() => 'Reporte de los metodos de pago'}
        columns={columns}
        dataSource={info}
        size="small"
        pagination={false}
        loading={loading.getInfo}
      />
    </>
  )
}

const isAllowToSign = (store: IInfoPaymentMethodStore): boolean => {
  if (
    store.status_izipay == CashMoveStatus.Active ||
    store.status_online == CashMoveStatus.Active
  )
    return true
  return false
}

const StoreReport = () => {
  const { loading, info } = usePaymentMethodStore()
  const { signInfo, onSearch } = usePaymentMethod()
  const data = info.map((el) => el.store ?? { sucursalcode: el.sucursalcode })

  const onSign = async (
    cashId: number,
    sucursalcode: string,
    culqiAmount?: number,
    izipayAmount?: number,
  ) => {
    await signInfo(cashId, sucursalcode, culqiAmount, izipayAmount)
    await onSearch()
  }
  const columns = [
    { title: 'Tienda', dataIndex: 'name' },
    {
      title: 'Culqui',
      dataIndex: 'culqui',
    },
    {
      title: 'Izipay',
      dataIndex: 'izipay',
    },
    {
      title: 'Online',
      dataIndex: 'online',
    },
    {
      title: 'Total',
      render: (record: any) => {
        return (
          <span className={`${record.success ? '' : 'text-red-600'}`}>
            {fNumber(Number(record.izipay) + Number(record.online))}
          </span>
        )
      },
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (record: IInfoPaymentMethodStore) => (
        <Space size="middle">
          {isAllowToSign(record) ? (
            <a
              onClick={() => {
                const infoFounded = info.find(
                  (el) => el.sucursalcode == record.sucursalcode,
                )
                let amountIzipay: number | undefined
                let amountCulqi: number | undefined
                if (infoFounded) {
                  if (Number(infoFounded.culqi) != 0) {
                    amountCulqi = Number(infoFounded.culqi)
                    amountIzipay = Number(infoFounded.izipay)
                  }
                }
                onSign(
                  record.cash_id,
                  record.sucursalcode,
                  amountCulqi,
                  amountIzipay,
                )
              }}
            >
              Firmar
            </a>
          ) : (
            <p className="text-slate-500">Firmado</p>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Table
      title={() => 'Reporte de las tiendas'}
      size="small"
      columns={columns}
      dataSource={data}
      rowKey={'sucursalcode'}
      pagination={false}
      loading={loading.getInfo || loading.signing}
    />
  )
}
