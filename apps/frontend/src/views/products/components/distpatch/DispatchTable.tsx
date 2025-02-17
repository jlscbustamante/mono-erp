import { Button, DatePicker, Input, Modal, Popover, Select } from 'antd'
import Table, { ColumnsType, TableProps } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FaRegCopy, FaTrash } from 'react-icons/fa6'
import { MdRemoveRedEye } from 'react-icons/md'
import { toast } from 'react-toastify'

import { DISPATCH_STATUS, WAREHOUSE_TYPE } from '@/data/hex/types'
import { rejectDispatch } from '@/data/products/sdk'
import { DispatchStatus, DispatchType, IDispatch } from '@/data/products/types'
import { cn, filterSelectForm } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { PATHS } from '@/const/paths'
import { resetAndDeleteDispatch, resetDispatch } from '@/data/hex/inventory'
import { DOC_STATUS, DocResponse } from '@/data/hex/pos'
import { useWarehousesRoute } from '@/hooks/data/iventory/use-warehouses-route'
import { inventoryApi } from '@/lib/api/inventory'
import { viewClient } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { useLocalStorage } from '@uidotdev/usehooks'
import { SquareSplitVertical } from 'lucide-react'
import { FiAlertTriangle, FiInfo } from 'react-icons/fi'
import { LuClock4 } from 'react-icons/lu'
import { RxReset } from 'react-icons/rx'
import { useNavigate } from 'react-router'
import { ProcessMultipleDispatch } from '../../dispatch/process-multiple-dispatch'
import { StatusTag } from '../../dispatch/status-tag'
import { useDocs } from '../../hooks/use-docs'
import { useDispatch, useDispatchQuery } from '../../state/useDispatch'
import { useSucursales } from '../stock/hooks/useSucursales'

export const DispatchTable = ({
  onUpdate,
  onlyQuery,
}: {
  onUpdate: () => void
  onlyQuery?: boolean
}) => {
  const navigate = useNavigate()
  const query = useDispatchQuery()
  const queryDocs = useDocs()
  // const today = format(new Date(), 'yyyy-MM-dd')
  const { store } = useDispatch()

  const [observadosItems] = useLocalStorage<number[]>(
    'dispatchItemSelector',
    [],
  )
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const sucursalesQuery = useSucursales()
  const [origin, setOrigin] = useState<string | undefined>(undefined)
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const queryRoute = useWarehousesRoute()
  const [deleteData, setDeleteData] = useState<{
    id: number
    motivo: string
  } | null>(null)
  const [idsProcess, setIdsProcess] = useState<{
    ids: number[]
    origin: string | undefined
  }>({
    ids: [],
    origin: undefined,
  })

  const handleMultipleApprove = () => {
    if (selectedRowKeys.length == 0) return
    setIdsProcess({
      ids: selectedRowKeys.map((el) => Number(el)).filter((el) => !isNaN(el)),
      origin,
    })
  }

  const rowSelection: TableProps<IDispatch>['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record: IDispatch) => ({
      disabled:
        (record.status != DispatchStatus.NEW &&
          record.status != DispatchStatus.APPROVED) ||
        idsProcess.ids.length > 0,
      name: record.id.toString(),
    }),
  }

  const docsData: Record<string, DocResponse> = useMemo(() => {
    if (!queryDocs.data) return {}
    return queryDocs.data.reduce(
      (acc, el) => {
        acc[el.doc_operacion] = el
        return acc
      },
      {} as Record<string, DocResponse>,
    )
  }, [queryDocs.data])

  const resetMt = useMutation({
    mutationFn: resetDispatch,
    onSuccess: () => {
      onUpdate()
    },
    onError: () => {
      toast.error('Error al resetear el movimiento')
    },
  })

  const duplicateDispatch = useMutation({
    mutationFn: (dispatchId: number) =>
      inventoryApi.duplicateDispatch(dispatchId),
    onSuccess: () => {
      onUpdate()
    },
    onError: () => {
      toast.error('Error al duplicar el movimiento')
    },
  })

  const resetAnDeleteMt = useMutation({
    mutationFn: resetAndDeleteDispatch,
    onSuccess: () => {
      onUpdate()
    },
    onError: () => {
      toast.error('Error al resetear el movimiento')
    },
  })

  const cancelInvoice = useMutation({
    mutationFn: async (data: { id: number; motivo: string }) => {
      await inventoryApi.cancelInvoice(data)
    },
    onSuccess: () => {
      onUpdate()
      setDeleteData(null)
    },
    onError: () => {
      toast.error('Error al cancelar la factura')
    },
  })

  const columns: ColumnsType<IDispatch> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'F. despacho',
      dataIndex: 'moveAt',
      key: 'moveAt',
      width: 105,
      render: (text: string) => {
        return text.split(' ')[0]
      },
      sorter: (a, b) => dayjs(a.moveAt).unix() - dayjs(b.moveAt).unix(),
    },

    {
      title: 'Origen',
      dataIndex: ['wareFrom', 'name'],
      key: 'wareFrom',
      sorter: (a, b) =>
        a.wareFrom?.name.localeCompare(b.wareFrom?.name ?? '') ?? -1,
    },
    {
      title: 'Destino',
      dataIndex: ['wareTo', 'name'],
      sorter: (a, b) =>
        a.wareTo?.name.localeCompare(b.wareTo?.name ?? '') ?? -1,
      key: 'wareTo',
      render: (text, record) => {
        const itemIds = record.items?.map((el) => el.itemId) ?? []
        const hasObservados = itemIds.some((el) => observadosItems.includes(el))
        return (
          <p className="flex gap-2 items-center">
            <span>{text}</span>
            {hasObservados && (
              <FiAlertTriangle className="text-orange-700 h-auto w-4" />
            )}
          </p>
        )
      },
    },
    {
      title: 'Descripcion',
      width: 300,
      dataIndex: 'gloss',
      key: 'gloss',
      sorter: (a, b) => a.gloss.localeCompare(b.gloss),
    },
    {
      title: 'Guia',
      align: 'center',
      sorter: () => -1,
      render: (_: unknown, record) => {
        const doc = record.numGuide ? docsData[record.numGuide] : undefined

        if (!doc) return null

        if (doc.status == DOC_STATUS.REJECTED) {
          return (
            <div className="flex items-center gap-1 justify-center text-red-600">
              <FiInfo className="w-5 h-auto text-red-600" />
              <Popover content={<p className="max-w-2xl">{doc.error}</p>}>
                <span>{record.numGuide}</span>
              </Popover>
            </div>
          )
        }
        if (doc.status == DOC_STATUS.SENT || doc.status == DOC_STATUS.CREATED) {
          return (
            <div className="flex items-center gap-1 justify-center">
              <LuClock4 className="w-5 h-auto" />
              <span>{record.numGuide}</span>
            </div>
          )
        }
        if (doc.status == DOC_STATUS.COMPLETED) {
          return (
            <a href={doc.doc_url} target="_blank" rel="noreferrer">
              {record.numGuide}
            </a>
            // <LiaFileInvoiceSolid
            //   className="w-5 h-auto cursor-pointer"
            //   onClick={() => {
            //     window.open(doc.doc_url)
            //   }}
            // />
          )
        }
      },
      key: 'numGuide',
    },
    {
      title: 'Factura',
      align: 'center',
      sorter: () => -1,
      render: (_: unknown, record) => {
        const doc = record.numInvoice ? docsData[record.numInvoice] : undefined

        if (!doc) return null

        if (doc.status == DOC_STATUS.REJECTED) {
          return (
            <div className="text-red-600 flex items-center gap-1 justify-center">
              <FiInfo className="w-5 h-auto text-red-600" />
              <Popover content={<p className="max-w-2xl">{doc.error}</p>}>
                <span>{record.numInvoice}</span>
              </Popover>
            </div>
          )
        }
        if (doc.status == DOC_STATUS.SENT || doc.status == DOC_STATUS.CREATED) {
          return (
            <div className="flex items-center gap-1 justify-center">
              <LuClock4 className="w-5 h-auto" />
              <span>{record.numInvoice}</span>
            </div>
          )
        }
        if (doc.status == DOC_STATUS.COMPLETED) {
          return (
            <a href={doc.doc_url} target="_blank" rel="noreferrer">
              {record.numInvoice}
            </a>
            // <LiaFileInvoiceSolid
            //   className="w-5 h-auto cursor-pointer"
            //   onClick={() => {
            //     window.open(doc.doc_url)
            //   }}
            // />
          )
        }
      },
    },
    {
      title: 'Total',
      dataIndex: 'totalValue',
      key: 'totalPrice',
      render: (text) => fNumber(text),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 110,
      key: 'status',
      render: (status: DISPATCH_STATUS) => <StatusTag status={status} />,
      sorter: () => -1,
    },
    {
      title: '',
      onCell: () => {
        return {
          width: '20px',
        }
      },
      render: (_value, record) => {
        // const date = record.moveAt.split(' ')[0]
        return (
          <div className="flex justify-around items-center gap-2">
            <Button
              loading={divideMt.variables == record.id && divideMt.isPending}
              type="text"
              size="small"
              className={cn('inline-flex items-center justify-center', {
                hidden:
                  (record.status !== (DISPATCH_STATUS.DISPATCHED as any) &&
                    record.status != (DISPATCH_STATUS.NEW as any)) ||
                  onlyQuery,
                // record.status !== (DISPATCH_STATUS.DISPATCHED as any) ||
                // date !== today ||
                // record.moveType == DispatchType.Exceptional,
              })}
              onClick={() =>
                Modal.confirm({
                  title: 'Dividir el despacho',
                  content: `¿Está seguro de dividir el despacho ${record.id} ?`,
                  onOk: () => {
                    divideMt.mutate(record.id)
                  },
                })
              }
            >
              <SquareSplitVertical className="text-black w-4 h-auto" />
            </Button>
            <Button
              type="text"
              size="small"
              className={cn('inline-flex items-center justify-center', {
                hidden:
                  record.status !== (DISPATCH_STATUS.DISPATCHED as any) ||
                  record.moveType == DispatchType.Exceptional ||
                  onlyQuery,
                // record.status !== (DISPATCH_STATUS.DISPATCHED as any) ||
                // date !== today ||
                // record.moveType == DispatchType.Exceptional,
              })}
              onClick={() =>
                Modal.confirm({
                  title: 'Deshacer despacho',
                  content: '¿Está seguro de deshacer este despacho?',
                  onOk: () => {
                    resetMt.mutate(record.id)
                  },
                })
              }
            >
              <RxReset className="text-black w-4 h-auto" />
            </Button>
            <Button
              type="text"
              size="small"
              onClick={() =>
                Modal.confirm({
                  title: '¿Duplicar despacho?',
                  content:
                    "El despacho se duplicara con estado 'Nuevo' y la misma fecha",
                  onOk: () => {
                    duplicateDispatch.mutate(record.id)
                  },
                })
              }
            >
              <FaRegCopy className="text-black w-4 h-auto" />
            </Button>
            <div
              className="cursor-pointer"
              onClick={() => {
                // store.openInfoDrawer(record.id)
                // open(record.id)
                navigate(
                  PATHS.erp.modulos.mercaderia.despachos.review +
                    '?dispatchId=' +
                    record.id,
                )
              }}
            >
              <MdRemoveRedEye className="w-4 h-auto" />
            </div>
            <div
              className={cn('cursor-pointer', {
                hidden: onlyQuery || record.status != DispatchStatus.NEW,
              })}
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de anular este despacho?',
                  onOk: () => {
                    rejectDispatch(record.id)
                      .then((message) => {
                        toast.success(message.message)
                        query.refetch()
                      })
                      .catch((err) => {
                        console.log('here')
                        toast.error(err.message)
                      })
                  },
                })
              }}
            >
              <FaTrash className="h-auto w-3.5" />
            </div>
            <div
              className={cn('cursor-pointer', {
                hidden: record.status != DispatchStatus.DISPATCHED || onlyQuery,
              })}
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de anular este despacho?',
                  onOk: () => {
                    resetAnDeleteMt.mutate(record.id)
                    // rejectDispatch(record.id)
                    //   .then((message) => {
                    //     toast.success(message.message)
                    //     query.refetch()
                    //   })
                    //   .catch((err) => {
                    //     console.log('here')
                    //     toast.error(err.message)
                    //   })
                  },
                })
              }}
            >
              <FaTrash className="h-auto w-3.5" />
            </div>
            <div
              className={cn('cursor-pointer', {
                hidden: record.status != DispatchStatus.INVOICED || onlyQuery,
              })}
              onClick={() => {
                if (record)
                  setDeleteData({
                    id: record.id,
                    motivo: '',
                  })
              }}
            >
              <FaTrash className="h-auto w-3.5" />
            </div>
          </div>
        )
      },
    },
  ]

  const dataFilteredRoute = useMemo(() => {
    if (!store.showValueForm) return query.data
    if (!queryRoute.data) return query.data
    const warehouseCodes = queryRoute.data
      .filter((el) => el.route == store.showValueForm)
      .map((el) => el.code)
    return query.data?.filter((el) => {
      return warehouseCodes.includes(el.wareToId)
    })
  }, [query.data, queryRoute.data, store.showValueForm])

  const divideMt = useMutation({
    mutationFn: async (id: number) => {
      const data = await viewClient.api.view.inventory.divideDispatch.$post({
        json: {
          ids: [id],
        },
      })
      if (!data.ok) throw new Error('No se pudo dividir el despacho')
    },
    onSuccess: () => {
      query.refetch()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return (
    <>
      <div className=" mb-2">{query.data?.length ?? 0} PEDIDOS</div>
      <div
        className={cn(
          'mb-3 bg-slate-100 p-2 rounded-sm flex items-center gap-2',
          {
            hidden: selectedRowKeys.length == 0 || idsProcess.ids.length > 0,
          },
        )}
      >
        <div className="flex gap-2 items-center">
          <span className="text-sm">
            {selectedRowKeys.length} seleccionado(s)
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-700 text-sm">Origen :</span>
          <Select
            value={origin}
            onChange={setOrigin}
            size="small"
            className="block w-52"
            filterOption={filterSelectForm}
            showSearch
          >
            {sucursalesQuery.data
              ?.filter((el) => el.type == WAREHOUSE_TYPE.WAREHOUSE)
              .map((el) => (
                <Select.Option key={el.code} value={el.code}>
                  {el.name}
                </Select.Option>
              ))}
          </Select>
          <DatePicker
            size="small"
            allowClear={false}
            className="w-44"
            value={dayjs(date)}
            onChange={(val) => {
              if (val) {
                setDate(val.format('YYYY-MM-DD'))
              }
            }}
          />
        </div>
        <Button size="small" onClick={handleMultipleApprove} type="primary">
          Despachar seleccionados
        </Button>
      </div>
      <ProcessMultipleDispatch
        onFinish={() => {
          query.refetch()
        }}
        date={date}
        origin={idsProcess.origin}
        ids={idsProcess.ids}
        clear={() => {
          setIdsProcess({ ids: [], origin: undefined })
          setSelectedRowKeys([])
          setOrigin(undefined)
        }}
      />
      <Modal
        open={!!deleteData}
        title="¿Eliminar despacho facturado?"
        confirmLoading={cancelInvoice.isPending}
        onCancel={() => {
          setDeleteData(null)
        }}
        okText="Eliminar"
        onOk={() => {
          if (deleteData) {
            cancelInvoice.mutate({
              id: deleteData.id,
              motivo: deleteData.motivo,
            })
          }
        }}
      >
        <div className="flex flex-col gap-1">
          <p>
            <span className="font-bold">Id : {deleteData?.id}</span>{' '}
            <span className="text-slate-500">(verifica el id)</span>
          </p>
          <p>Ingresa el motivo de la anulación : </p>
          <Input
            placeholder="Item equivocado, cantidad,etc"
            value={deleteData?.motivo}
            onChange={(e) => {
              if (deleteData) {
                setDeleteData({ ...deleteData, motivo: e.target.value })
              }
            }}
          />
        </div>
      </Modal>
      <Table
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        size="small"
        columns={columns}
        rowKey={'id'}
        // dataSource={query.data}
        dataSource={dataFilteredRoute}
        loading={query.isLoading}
        onRow={(record) => {
          if (record.moveType != DispatchType.Exceptional) {
            return {}
          }
          return {
            style: {
              background: 'rgb(241, 241, 241)',
            },
          }
        }}
        pagination={false}
      />
    </>
  )
}
