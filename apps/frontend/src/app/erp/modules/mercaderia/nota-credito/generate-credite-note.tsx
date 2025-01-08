import { DispatchStatus } from '@/data/products/types'
import { inventoryApi } from '@/lib/api/inventory'
import { StatusTag } from '@/views/products/dispatch/status-tag'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Empty, InputNumber, Table } from 'antd'
import { atom, useAtom } from 'jotai'
import { Fillime, InvDispatch } from 'pizzadb'
import { useState } from 'react'
import { toast } from 'react-toastify'

const generateCreditNoteAtom = atom(false)

export const useGenerateCredito = () => {
  const [isOpen, setIsOpen] = useAtom(generateCreditNoteAtom)

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
  }
}

const getDispatch = async (id: number): Promise<InvDispatch | null> => {
  const query: Fillime<InvDispatch> = {
    where: [
      {
        field: 'id',
        operator: 'equal',
        value: id,
      },
      {
        field: 'status',
        operator: 'equal',
        value: DispatchStatus.INVOICED,
      },
    ],
    relations: {
      wareFrom: true,
      wareTo: true,
    },
    take: 1,
  }
  const dispatches = await inventoryApi.filterDispatch(query)
  return dispatches[0] ?? null
}

const generateCreditNote = async (numInvoice: string) => {
  const request = await fetch(
    'https://facturacion.pizzaraul.com/api/documentSendCreditNote',
    {
      body: JSON.stringify({
        doc_operacion: numInvoice,
        company_id: 'ERPRAUL',
      }),
    },
  )

  const data = await request.json()
  if (!request.ok)
    throw new Error(
      data.error ?? data.message ?? 'No se pudo generar la nota de credito',
    )
}

export const GenerateCreditNote = () => {
  const { isOpen, setIsOpen } = useGenerateCredito()
  const [dispatchId, setDispatchId] = useState<null | number>(null)
  const [dispatch, setDispatch] = useState<null | InvDispatch>(null)

  const getDispatchMt = useMutation({
    mutationFn: getDispatch,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: (data) => {
      setDispatch(data)
    },
  })
  return (
    <Drawer
      width={700}
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
    >
      <div className="flex gap-1">
        <InputNumber
          className="w-40"
          placeholder="ej:1111"
          value={dispatchId}
          onChange={(ev) => setDispatchId(ev)}
        />
        <Button
          type="primary"
          loading={getDispatchMt.isPending}
          onClick={() => {
            if (dispatchId) getDispatchMt.mutate(dispatchId)
          }}
        >
          Buscar
        </Button>
      </div>
      <div>
        {dispatch && (
          <CreateCreditNote
            dispatch={dispatch}
            onClear={() => setDispatch(null)}
          />
        )}
      </div>
      <div>
        {!dispatch && (
          <Empty description="No se encontro ningun despacho facturado con ese id" />
        )}
      </div>
    </Drawer>
  )
}

const CreateCreditNote = ({
  dispatch,
  onClear,
}: {
  dispatch: InvDispatch
  onClear: () => void
}) => {
  const { setIsOpen } = useGenerateCredito()
  const generateCreditNoteMt = useMutation({
    mutationFn: generateCreditNote,
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
    onSuccess: () => {
      toast.success('Nota de credito generada')
      setIsOpen(false)
    },
  })

  return (
    <div key={dispatch.id}>
      <Table
        dataSource={[dispatch]}
        title={() => 'Información del despacho'}
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Origen',
            dataIndex: ['wareFrom', 'name'],
          },
          {
            title: 'Destino',
            dataIndex: ['wareTo', 'name'],
          },
          {
            title: 'Monto',
            dataIndex: ['totalValue'],
          },
          {
            title: 'Factura',
            dataIndex: 'numInvoice',
          },
          {
            title: 'Fecha',
            dataIndex: 'moveAt',
            render: (val) => val.split(' ')[0],
          },
          {
            title: 'Estado',
            dataIndex: 'status',
            render: (val) => <StatusTag status={val} />,
          },
        ]}
      />
      <div className="mt-3 flex items-center gap-1">
        <Button
          type="primary"
          loading={generateCreditNoteMt.isPending}
          onClick={() => {
            if (dispatch.numInvoice)
              generateCreditNoteMt.mutate(dispatch.numInvoice)
          }}
        >
          Crear nota de credito para este pedido
        </Button>
        <Button onClick={onClear}>Cancelar</Button>
      </div>
    </div>
  )
}
