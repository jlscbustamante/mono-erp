import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Drawer, Modal, Table } from 'antd'
import { useMemo, useRef } from 'react'
import { FaTruck } from 'react-icons/fa6'
import { IoMdPrint } from 'react-icons/io'
import ReactToPrint from 'react-to-print'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'
import './style-items-print.css'
import './style-prin.css'

import { generateInvoice } from '@/data/hex/inventory'
import { Dispatch, DISPATCH_MOVE_TYPE, DISPATCH_STATUS } from '@/data/hex/types'
import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import config from '@/config'
import { DOC_STATUS, getLegalDocs } from '@/data/hex/pos'
import { FiInfo } from 'react-icons/fi'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { LuClock4 } from 'react-icons/lu'
import { useDispatchEditDrawer } from './dispatch-edit-drawer'
import {
  DispatchItemsDrawer,
  useDispatchItemDrawer,
} from './dispatch-items-drawer'
import {
  DivideDispatchDrawer,
  useDivideDispatchDrawer,
} from './divide-dispatch.drawer'
import { GenerateGuidePopup } from './generate-guide-popup'
import {
  ModifyDispatchedDrawer,
  useModifyDispatchDrawer,
} from './modify-dispatched-drawer'
import { StatusTag } from './status-tag'
import { useDispatchDetail } from './use-dispatch-detail'

const dispatchDetailAtom = atom<null | number>({
  key: 'dispatchDetailAtom',
  default: null,
})

export const useDispatchDetailDrawer = () => {
  const [dispatchDetail, setDispatchDetail] = useRecoilState(dispatchDetailAtom)

  return {
    isOpen: !!dispatchDetail,
    open: (dispatchDetail: number) => setDispatchDetail(dispatchDetail),
    close: () => setDispatchDetail(null),
    dispatchId: dispatchDetail,
  }
}

export const DispatchDetailDrawer = ({
  onUpdate,
}: {
  onUpdate?: () => void
}) => {
  const { isOpen, close, dispatchId } = useDispatchDetailDrawer()

  const { data, isLoading, error, refetch } = useDispatchDetail(dispatchId)
  const refList = useRef(null)

  const handleOnUpdate = () => {
    refetch()
    onUpdate?.()
  }

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={close}
        width={800}
        title="Información de despacho"
      >
        {isLoading && <div className="text-center my-4">Cargando...</div>}
        {error && (
          <div className="text-center text-red-600">{error.message}</div>
        )}
        {data && (
          <DispatchStructure
            dispatch={data}
            refList={refList}
            onUpdate={handleOnUpdate}
          />
        )}
      </Drawer>
      {data && data.status === DISPATCH_STATUS.DISPATCHED && (
        <ModifyDispatchedDrawer onUpdate={handleOnUpdate} />
      )}
      {data && <DispatchItemsDrawer dispatch={data} refList={refList} />}
      {data && (
        <DivideDispatchDrawer
          dispatch={data}
          onFinish={() => {
            onUpdate?.()
            close?.()
          }}
        />
      )}
    </>
  )
}

const DispatchStructure = ({
  dispatch,
  refList,
  onUpdate,
}: {
  dispatch: Dispatch
  refList: any
  onUpdate?: () => void
}) => {
  return (
    <div>
      <DispatchHeader
        dispatch={dispatch}
        onUpdate={onUpdate}
        refList={refList}
      />
      <DispatchInformation dispatch={dispatch} />
      <DispatchItems dispatch={dispatch} refList={refList} />
    </div>
  )
}

const DispatchHeader = ({
  dispatch,
  refList,
  onUpdate,
}: {
  dispatch: Dispatch
  refList: any
  onUpdate?: () => void
}) => {
  const { open } = useDispatchEditDrawer()
  const { open: openModifyDispatch } = useModifyDispatchDrawer()
  const { open: OpenDivide } = useDivideDispatchDrawer()

  const docs = useMemo(() => {
    return [dispatch.numInvoice, dispatch.numGuide].filter((el) => el)
  }, [dispatch.numInvoice, dispatch.numGuide])

  const querydocs = useQuery({
    queryKey: ['getlegalDocOne', docs],
    enabled: docs.length > 0,
    queryFn: () => getLegalDocs(docs),
    gcTime: 0,
  })
  const guideDoc = useMemo(() => {
    if (!dispatch.numGuide) return null
    return (
      querydocs.data?.find((el) => el.doc_operacion == dispatch.numGuide) ??
      null
    )
  }, [querydocs.data, dispatch.numGuide])

  const invoiceDoc = useMemo(() => {
    if (!dispatch.numInvoice) return null
    return (
      querydocs.data?.find((el) => el.doc_operacion == dispatch.numInvoice) ??
      null
    )
  }, [querydocs.data, dispatch.numInvoice])

  const generateInvoiceMt = useMutation({
    mutationFn: generateInvoice,
    onSuccess: () => {
      onUpdate?.()
      toast.success('Factura generada')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <p className="font-bold text-slate-700">ID DESPACHO : {dispatch.id}</p>
        <StatusTag status={dispatch.status} />
      </div>
      <div className="flex items-center gap-2">
        {guideDoc &&
          (guideDoc.status == DOC_STATUS.COMPLETED ? (
            <Button
              onClick={() => {
                if (guideDoc.doc_efact_id != null) {
                  window.open(
                    `${config.hostPos}/api/facturacion/externo/efact/pdf?order=${dispatch.numGuide}`,
                  )
                } else {
                  window.open(guideDoc.doc_url)
                }
              }}
              size="small"
              icon={
                <LiaFileInvoiceSolid className="w-4 h-auto cursor-pointer" />
              }
            >
              guia
            </Button>
          ) : guideDoc.status == DOC_STATUS.CREATED ||
            guideDoc.status == DOC_STATUS.SENT ? (
            <Button size="small" icon={<LuClock4 className="w-4 h-auto" />}>
              guia
            </Button>
          ) : guideDoc.status == DOC_STATUS.REJECTED ? (
            <Button
              size="small"
              icon={<FiInfo className="w-4 h-auto text-red-600" />}
            >
              guia rechazada
            </Button>
          ) : null)}

        {[DISPATCH_STATUS.NEW, DISPATCH_STATUS.DISPATCHED].includes(
          dispatch.status,
        ) && (
          <Button size="small" onClick={() => OpenDivide()}>
            Dividir por almacen
          </Button>
        )}

        {invoiceDoc &&
          (invoiceDoc.status == DOC_STATUS.COMPLETED ? (
            <Button
              onClick={() => {
                if (invoiceDoc.doc_efact_id != null) {
                  window.open(
                    `${config.hostPos}/api/facturacion/externo/efact/pdf?order=${dispatch.numInvoice}`,
                  )
                } else {
                  window.open(invoiceDoc.doc_url)
                }
              }}
              size="small"
              icon={
                <LiaFileInvoiceSolid className="w-4 h-auto cursor-pointer" />
              }
            >
              factura
            </Button>
          ) : invoiceDoc.status == DOC_STATUS.CREATED ||
            invoiceDoc.status == DOC_STATUS.SENT ? (
            <Button size="small" icon={<LuClock4 className="w-4 h-auto" />}>
              factura
            </Button>
          ) : invoiceDoc.status == DOC_STATUS.REJECTED ? (
            <Button
              size="small"
              icon={<FiInfo className="w-4 h-auto text-red-600" />}
            >
              factura rechazada
            </Button>
          ) : null)}
        {dispatch.status == DISPATCH_STATUS.DISPATCHED && (
          <Button
            size="small"
            onClick={() => openModifyDispatch(dispatch.id)}
            className=""
          >
            Modificar despacho
          </Button>
        )}

        <ReactToPrint
          trigger={() => {
            return (
              <Button size="small" icon={<IoMdPrint />}>
                Items
              </Button>
            )
          }}
          content={() => refList.current}
        />

        {[DISPATCH_STATUS.APPROVED, DISPATCH_STATUS.NEW].includes(
          dispatch.status,
        ) && (
          <Button
            size="small"
            icon={<FaTruck />}
            onClick={() => open(dispatch.id)}
          >
            Despachar
          </Button>
        )}
        {false && dispatch.status == DISPATCH_STATUS.DISPATCHED && (
          <Button
            onClick={() =>
              Modal.confirm({
                cancelText: 'Cancelar',
                okText: 'Facturar',
                title: '¿ Esta seguro que desea facturar esta despacho ?',
                content: 'Una vez facturado no se podra modificar',
                onOk: () => generateInvoiceMt.mutate(dispatch.id),
              })
            }
            size="small"
            loading={generateInvoiceMt.isPending}
          >
            Facturar
          </Button>
        )}
        {dispatch.status == DISPATCH_STATUS.INVOICED &&
          dispatch.numInvoice &&
          !dispatch.numGuide && (
            <GenerateGuidePopup
              dispatch={dispatch}
              onUpdate={onUpdate}
              onlyguide={true}
            />
          )}
        {dispatch.status == DISPATCH_STATUS.DISPATCHED &&
          dispatch.moveType == DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE && (
            <GenerateGuidePopup dispatch={dispatch} onUpdate={onUpdate} />
          )}
      </div>
    </div>
  )
}

const DispatchInformation = ({ dispatch }: { dispatch: Dispatch }) => {
  return (
    <ul className="w-80 space-y-1 my-2">
      <li className="grid grid-cols-2">
        <span>Fecha de despacho:</span>
        <span>{dispatch.dispatchAt}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Origen:</span>
        <span>{dispatch.wareFromName}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Destino:</span>
        <span>{dispatch.wareToName}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Número de guia:</span>
        <span>{dispatch.numGuide}</span>
      </li>

      <li className="grid grid-cols-2">
        <span>Número de factura:</span>
        <span>{dispatch.numInvoice}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Registrado por:</span>
        <span>{dispatch.requestBy}</span>
      </li>
      <li className="grid grid-cols-2">
        <span>Descripción:</span>
        <span>{dispatch.gloss}</span>
      </li>
    </ul>
  )
}

const DispatchItems = ({
  dispatch,
  refList,
}: {
  dispatch: Dispatch
  refList: any
}) => {
  const { open } = useDispatchItemDrawer()
  return (
    <>
      <Table
        className="mt-4"
        size="small"
        pagination={false}
        columns={[
          {
            title: 'Item de inventario',
            dataIndex: 'title',
          },
          {
            title: '',
            render: (_, record) => {
              if (record.isItems) {
                return (
                  <p
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => open()}
                  >
                    Ver lista
                  </p>
                )
              }
            },
          },
          {
            title: 'Valor',
            align: 'right',
            dataIndex: 'price',
          },
        ]}
        onRow={(record) => {
          if (record.isSeparator) {
            return {
              style: {
                height: '40px',
              },
            }
          }
          return {}
        }}
        dataSource={[
          {
            key: 1,
            title: `${dispatch.items.length} item(s)`,
            isItems: true,
            price: fCurrency(dispatch.netValue),
          },
          {
            key: 2,
            isSeparator: true,
          },
          {
            key: 3,
            title: 'IGV',
            price: fCurrency(dispatch.taxValue),
          },
        ]}
        footer={() => (
          <div className="text-right font-bold text-slate-800">
            Valor total del despacho {fCurrency(dispatch.totalValue)}
          </div>
        )}
      />
      <DispatchItemTablePrint dispatch={dispatch} refList={refList} />
    </>
  )
}

const DispatchItemTablePrint = ({
  dispatch,
  refList,
}: {
  dispatch: Dispatch
  refList: any
}) => {
  return (
    <div ref={refList} className="hidden print:block print:p-2">
      <div className="flex gap-1 justify-between my-2">
        <p className="font-semibold text-sm">PEDIDO {dispatch.wareToName}</p>
        <p>N° Pedido {dispatch.id}</p>
        <p>Fecha : {dispatch.dispatchAt}</p>
      </div>
      <Table
        bordered={true}
        rowKey={'itemId'}
        className="table-items-to-print"
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Item de inventario',
            dataIndex: 'itemName',
          },
          {
            title: 'U.M',
            dataIndex: 'measureCode',
          },
          {
            title: 'Cantidad',
            dataIndex: 'quantity',
            align: 'right',
            render: (val) => fNumber(val, 3),
          },
          {
            title: 'Precio',
            dataIndex: 'unitValue',
            align: 'right',
            render: (val) => fCurrency(val, false),
          },
          {
            title: 'Total',
            align: 'right',
            dataIndex: 'totalValue',
            render: (val) => fCurrency(val, false),
          },
        ]}
        dataSource={dispatch.items.sort((a, b) =>
          a.itemName.localeCompare(b.itemName),
        )}
      />
    </div>
  )
}
