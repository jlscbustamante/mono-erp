import { useMutation } from '@tanstack/react-query'
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { FormInstance } from 'antd/lib'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { approveDispatch, updateDispatch } from '@/data/hex/inventory'
import {
  Dispatch,
  DISPATCH_STATUS,
  DispatchUpdateDto,
  WAREHOUSE_TYPE,
} from '@/data/hex/types'
import { fCurrency } from '@/utils'

import { useSucursales } from '../components/stock/hooks/useSucursales'
import { DispatchEditItemsDrawer } from './dispatch-edit-items-drawer'
import { useDispatchDetail } from './use-dispatch-detail'

const dispatchEditAtom = atom<null | number>({
  key: 'dispatchEditAtom',
  default: null,
})

export const useDispatchEditDrawer = () => {
  const [dispatchEdit, setDispatchEdit] = useRecoilState(dispatchEditAtom)
  return {
    isOpen: !!dispatchEdit,
    open: (dispatchEdit: number) => setDispatchEdit(dispatchEdit),
    close: () => setDispatchEdit(null),
    dispatchId: dispatchEdit,
  }
}

export const DispatchEditDrawer = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close, dispatchId } = useDispatchEditDrawer()
  const { data, isLoading, error, refetch } = useDispatchDetail(dispatchId)
  return (
    <Drawer open={isOpen} onClose={close} width={800} title="Editar despacho">
      {isLoading && <div className="text-center my-4">Cargando...</div>}
      {error && <div className="text-center text-red-600">{error.message}</div>}
      {data && (
        <DispatchEditStructure
          dispatch={data}
          onUpdate={() => {
            close()
            refetch()
            onUpdate?.()
          }}
        />
      )}
    </Drawer>
  )
}

const DispatchEditStructure = ({
  dispatch: _dispatch,
  onUpdate,
}: {
  dispatch: DispatchUpdateDto
  onUpdate?: () => void
}) => {
  const [dispatch, setDispatch] = useState(_dispatch)
  const [form] = Form.useForm<Dispatch>()
  const [openEditItems, setOpenEditItems] = useState(false)

  const updateDispatchMt = useMutation({
    mutationFn: updateDispatch,
    onSuccess: () => {
      onUpdate?.()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const dispatchItemsMt = useMutation({
    mutationFn: approveDispatch,
    onSuccess: () => {
      onUpdate?.()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })

  const handleDispatch = () => {
    const valueForm = form.getFieldsValue()
    const date = (valueForm.dispatchAt as any).format('YYYY-MM-DD') as string
    const netValue =
      dispatch.items?.reduce((acc, el) => {
        return acc + el.totalValue
      }, 0) ?? 0
    dispatchItemsMt.mutate({
      ...dispatch,
      wareFromId: valueForm.wareFromId,
      dispatchAt: date,
      gloss: valueForm.gloss,
      netValue: netValue,
    })
  }

  const handleUpdate = () => {
    const valueForm = form.getFieldsValue()
    const date = (valueForm.dispatchAt as any).format('YYYY-MM-DD') as string
    const netValue =
      dispatch.items?.reduce((acc, el) => {
        return acc + el.totalValue
      }, 0) ?? 0
    updateDispatchMt.mutate({
      ...dispatch,
      wareFromId: valueForm.wareFromId,
      dispatchAt: date,
      gloss: valueForm.gloss,
      netValue: netValue,
    })
  }
  const valuesForm = Form.useWatch([], form)

  const enableApprove = useMemo(() => {
    const values = form.getFieldsValue()
    if (!values.wareFromId || !dispatch.wareToId) return false
    if (
      !dispatch.items ||
      dispatch.items.length === 0 ||
      dispatch.items.every((el) => el.quantity === 0)
    )
      return false
    if (
      dispatch.status != DISPATCH_STATUS.NEW &&
      dispatch.status != DISPATCH_STATUS.APPROVED
    )
      return false
    return true
  }, [form, valuesForm, dispatch])

  return (
    <div>
      <EditInformation form={form} dispatch={dispatch} />
      <EditItems dispatch={dispatch} openItems={setOpenEditItems} />
      <DispatchEditItemsDrawer
        setDispatch={setDispatch}
        dispatch={dispatch}
        onOpenChange={setOpenEditItems}
        open={openEditItems}
      />
      <SummaryDispatch dispatch={dispatch} setDispatch={setDispatch} />
      <div className="flex justify-end gap-1">
        <Button
          onClick={handleUpdate}
          loading={updateDispatchMt.isPending}
          disabled={dispatchItemsMt.isPending}
        >
          Guardar
        </Button>
        <Button
          type="primary"
          disabled={!enableApprove || updateDispatchMt.isPending}
          onClick={handleDispatch}
          loading={dispatchItemsMt.isPending}
        >
          Guardar y despachar
        </Button>
      </div>
    </div>
  )
}

const EditInformation = ({
  form,
  dispatch,
}: {
  form: FormInstance<Dispatch>
  dispatch: DispatchUpdateDto
}) => {
  const { data: sucursales } = useSucursales()
  // const date =
  //   dispatch.status == DISPATCH_STATUS.NEW ||
  //   dispatch.status == DISPATCH_STATUS.APPROVED
  //     ? dayjs()
  //     : dayjs(dispatch.dispatchAt)
  return (
    <Form
      initialValues={{
        wareToId: dispatch.wareToId,
        wareFromId: dispatch.wareFromId,
        dispatchAt: dayjs(dispatch.dispatchAt),
        numGuide: dispatch.numGuide,
        numInvoice: dispatch.numInvoice,
        wareToName: dispatch.wareToName,
        gloss: dispatch.gloss,
      }}
      form={form}
      name="validateOnly"
      autoComplete="off"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name={'wareFromId'} label="Origen">
        <Select>
          {sucursales
            ?.filter((suc) => suc.type == WAREHOUSE_TYPE.WAREHOUSE)
            .map((suc) => (
              <Select.Option key={suc.code} value={suc.code}>
                {suc.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item name={'wareToName'} label="Destino">
        <Input readOnly placeholder="Destino" />
      </Form.Item>
      <Form.Item name={'numInvoice'} label="N° de Factura">
        <Input readOnly placeholder="Número de Factura" />
      </Form.Item>
      <Form.Item name={'numGuide'} label="N° de guia">
        <Input readOnly placeholder="Número de guia" />
      </Form.Item>
      <Form.Item name="dispatchAt" label="Fecha de despacho">
        <DatePicker allowClear={false} />
      </Form.Item>
      <Form.Item name="gloss" label="Descripción">
        <Input.TextArea rows={3} placeholder="Descripción" />
      </Form.Item>
    </Form>
  )
}

const SummaryDispatch = ({
  dispatch,
  setDispatch,
}: {
  dispatch: DispatchUpdateDto
  setDispatch: (dispatch: DispatchUpdateDto) => void
}) => {
  const changeTax = (value: number) => {
    setDispatch({
      ...dispatch,
      taxValue: value,
      totalValue: value + dispatch.netValue,
    })
  }
  const netValue = useMemo(() => {
    return (
      dispatch.items?.reduce((acc, el) => {
        return acc + el.totalValue
      }, 0) ?? 0
    )
  }, [dispatch])
  const totalValue = useMemo(() => {
    const netValue =
      dispatch.items?.reduce((acc, el) => {
        return acc + el.totalValue
      }, 0) ?? 0
    return netValue + dispatch.taxValue
  }, [dispatch])
  return (
    <div>
      <ul className="w-80 space-y-2 ml-auto mt-4 mb-8">
        <li className="grid grid-cols-2 justify-items-end">
          <span>Neto:</span>
          <span>{fCurrency(netValue)}</span>
        </li>
        <li className="grid grid-cols-2 justify-items-end">
          <span>IGV:</span>
          <div>
            <InputNumber
              precision={2}
              min={0}
              value={dispatch.taxValue}
              onChange={(val) => {
                changeTax(val ?? 0)
              }}
              size="small"
            />
          </div>
        </li>
        <li className="grid grid-cols-2 justify-items-end">
          <span>Valor total:</span>
          <span>{fCurrency(totalValue)}</span>
        </li>
      </ul>
    </div>
  )
}

const EditItems = ({
  dispatch,
  openItems,
}: {
  dispatch: DispatchUpdateDto
  openItems: (open: boolean) => void
}) => {
  return (
    <div className="my-4">
      <Divider>
        <p>
          {dispatch.items.length} items en la lista.{' '}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => openItems(true)}
          >
            Editar items
          </span>
        </p>
      </Divider>
    </div>
  )
}
