import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Typography,
} from 'antd'
import Search from 'antd/es/input/Search'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import { CashAccountTypeId } from '@/data/cashAccount/types/cashTypes'
import * as sdk from '@/data/requests/sdk'
import { setRequestChangeSt } from '@/data/requests/state'
import {
  IFilteredRequest,
  RequestType,
  RequestTypeCategory,
  Retention,
} from '@/data/requests/types'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
  costCentersSt,
} from '@/data/resources/state'
import { AccountFlow } from '@/data/types/accountFlow'
import { cn, getNameRequestType } from '@/utils'
import { filterSelectForm } from '@/utils/filterOptions'
import { safeAny } from '@/utils/someAny'

const { Link } = Typography

export const UpdateForm: React.FC<{
  request: IFilteredRequest
  setRequest: Dispatch<SetStateAction<IFilteredRequest | null>>
}> = ({ request, setRequest }) => {
  const [formName, setFormName] = useState('')
  const categories = useRecoilValue(categoriesRequestSt)
  const _cashAccounts = useRecoilValue(cashAccountRequestSt)
  const costCenters = useRecoilValue(costCentersSt)
  const [showCategoryCash, setShowCategoryCash] = useState(
    request.category_move === RequestTypeCategory.Cash,
  )
  const [beforeCashIsLiquidator, setBeforeCashIsLiquidator] = useState(false)
  const setReloadChanges = useSetRecoilState(setRequestChangeSt)

  const [loading, setLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const isTransfer = request.request_type == RequestType.Transfer
  const isLiquidation = request.request_type == RequestType.Liquidation
  const cashAccounts = isLiquidation
    ? _cashAccounts.filter(
        (el) => el.cash_account_type.type_id === CashAccountTypeId.Liquidator,
      )
    : _cashAccounts

  const validateUpdate = () => {
    if (request.retention == Retention.Yes) {
      if (!request.amount_net || request.amount_net <= 0)
        throw new Error('monto invalido en monto neto')
      if (!request.amount_ret || request.amount_ret <= 0)
        throw new Error('monto invalido en retencion')
    }
  }

  const validateRequest = () => {
    validateUpdate()
    if (
      !request.pay_method &&
      [RequestType.Supplier].includes(request.request_type)
    )
      throw new Error('Selecciona una forma de pago')
    if (!request.category_id || !request.cash_id)
      throw new Error('categoria y/o caja invalida')
    if (
      request.category_move === RequestTypeCategory.Cash &&
      request.category_id == request.cash_id
    )
      throw new Error('Las cuentas no pueden ser iguales')
  }

  const handlerAction = async (type: 'reject' | 'approve') => {
    try {
      if (type == 'reject') {
        await sdk.rejectRequest(request.id)
        toast.info('Requerimiento rechazado', NOTIFICATION.success)
      } else {
        validateRequest()
        await sdk.approveRequest(request.id)
        toast.info('Requerimiento aprobado', NOTIFICATION.success)
      }
      setReloadChanges(1)
      setRequest(null)
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const manageUpdate = (obj: safeAny) => {
    setIsUpdating(true)
    setRequest(obj)
  }

  const handlerUpdate = async () => {
    try {
      validateUpdate()
      const idNot = toast.loading('Actualizando...', NOTIFICATION.loading)
      await sdk.updateRequest(request)
      setRequest(request)
      toast.update(idNot, {
        render: 'Actualizado correctamente',
        ...NOTIFICATION.updateLoading,
      })
      setReloadChanges(1)
      setIsUpdating(false)
    } catch (err: safeAny) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const handlerChangeCashAccount = (e: number) => {
    if (request.request_type === RequestType.Simple) changeCashInSimple(e)
    else {
      const cash = cashAccounts.find((cc) => cc.id === e)!
      const category_move =
        request.request_type === RequestType.Transfer
          ? RequestTypeCategory.Cash
          : RequestTypeCategory.Category
      setRequest({
        ...request,
        cash_id: cash.id,
        cash_account_id: cash.account_id,
        category_move,
      })
      setIsUpdating(true)
    }
  }
  const changeCashInSimple = (e: number) => {
    const cash = cashAccounts.find((cc) => cc.id === e)!
    const isLiquidator =
      cash.cash_account_type.type_id == CashAccountTypeId.Liquidator

    if (isLiquidator) {
      setRequest({
        ...request,
        cash_id: cash.id,
        cash_account_id: cash.account_id,
        category_id: null,
        category_move: RequestTypeCategory.Cash,
      })
      setIsUpdating(true)
      setShowCategoryCash(true)
      setBeforeCashIsLiquidator(true)
    } else {
      const newObj: safeAny = {
        ...request,
        cash_id: cash.id,
        cash_account_id: cash.account_id,
        category_move: RequestTypeCategory.Category,
      }
      if (beforeCashIsLiquidator) {
        newObj.category_id = null
      }
      setRequest(newObj)
      setIsUpdating(true)
      setShowCategoryCash(false)
      setBeforeCashIsLiquidator(false)
    }
  }

  const handlerChangeCategory = (e: number) => {
    const category = categories.find((cc) => cc.id === e)!
    setRequest({
      ...request,
      category_id: category.id,
      category_account_id: category.account_id,
      account_flow: category.account_flow,
    })
    setIsUpdating(true)
  }
  const handlerChangeCashOrigin = (e: number) => {
    const cash = cashAccounts.find((cc) => cc.id === e)!
    setRequest({
      ...request,
      category_id: cash.id,
      category_account_id: cash.account_id,
      account_flow: AccountFlow.Input,
    })
    setIsUpdating(true)
  }

  const handlerChangeRetention = (val: number | null, type: 'net' | 'ret') => {
    const amount = request.amount ?? 0
    let amount_net = request.amount_net ?? 0
    let amount_ret = request.amount_ret ?? 0
    if (type == 'net') {
      amount_net = val ?? 0
      amount_ret = amount - amount_net
      setRequest({
        ...request,
        amount_net: val,
        amount_ret: amount_ret,
      })
    } else {
      amount_ret = val ?? 0
      amount_net = amount - amount_ret
      setRequest({
        ...request,
        amount_net: amount_net,
        amount_ret: val,
      })
    }
    setIsUpdating(true)
  }

  const handleSearchRuc = async (ruc: string) => {
    try {
      setLoading(true)
      const { name } = await sdk.getNameByRuc(ruc)
      manageUpdate({ ...request, legal_name: name })
    } catch (err: any) {
      toast.error('Error al buscar ruc, ' + err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  useEffect(() => {
    setFormName(getNameRequestType(request.request_type))
  }, [])
  return (
    <>
      <Form {...layout} style={{ maxWidth: 600 }}>
        <Form.Item label="Tipo">
          <Input placeholder={formName} disabled />
        </Form.Item>
        <Form.Item label="Creado por">
          <Input value={request.created_by ?? ''} readOnly />
        </Form.Item>
        <Form.Item label="N° Doc" hidden={isTransfer}>
          <Input
            placeholder="0001-111"
            value={request.num_document ?? ''}
            onChange={(e) =>
              manageUpdate({ ...request, num_document: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="RUC" hidden={isTransfer}>
          <Search
            placeholder="000000000000"
            value={request.legal_number ?? ''}
            onChange={(e) => {
              manageUpdate({ ...request, legal_number: e.target.value })
            }}
            onSearch={(ruc) => {
              handleSearchRuc(ruc)
            }}
            loading={loading}
          />
        </Form.Item>
        <Form.Item label="R. social" hidden={isTransfer}>
          <Input
            placeholder="R. social"
            value={request.legal_name ?? ''}
            onChange={(e) => {
              manageUpdate({ ...request, legal_name: e.target.value })
            }}
          />
        </Form.Item>
        <Form.Item label="Detalle">
          <TextArea
            rows={4}
            cols={10}
            autoSize={true}
            value={request.description}
            onChange={(e) =>
              manageUpdate({ ...request, description: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Monto">
          <div className="grid grid-cols-3">
            <InputNumber
              step={0.01}
              min={0.01}
              prefix={request.currency == 'PEN' ? 'S/ ' : '$ '}
              precision={2}
              value={request.amount}
              onChange={(e) => manageUpdate({ ...request, amount: e ?? 0 })}
              className="w-36 col-span-2"
            />
            <Select
              className="w-20"
              value={request.currency}
              onChange={(val) => {
                manageUpdate({
                  ...request,
                  currency: val,
                })
              }}
            >
              <Select.Option value="PEN">PEN</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
            </Select>
          </div>
        </Form.Item>
        <Form.Item label="Categoria" hidden={showCategoryCash || isTransfer}>
          <Select
            showSearch
            onChange={handlerChangeCategory}
            value={request.category_id}
            filterOption={filterSelectForm}
          >
            {categories.map((cc) => {
              return (
                <Select.Option key={cc.id} value={cc.id}>
                  {cc.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Caja origen"
          hidden={!showCategoryCash && !isTransfer}
        >
          <Select
            showSearch
            filterOption={filterSelectForm}
            value={request.category_id}
            onChange={handlerChangeCashOrigin}
          >
            {cashAccounts.map((cc) => {
              return (
                <Select.Option key={cc.id} value={cc.id}>
                  {cc.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label={showCategoryCash || isTransfer ? 'Caja destino' : 'Caja'}
        >
          <Select
            showSearch
            filterOption={filterSelectForm}
            value={request.cash_id}
            onChange={handlerChangeCashAccount}
          >
            {cashAccounts.map((cc) => {
              return (
                <Select.Option key={cc.id} value={cc.id}>
                  {cc.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Centro de costo" hidden={isTransfer}>
          <Select
            showSearch
            onChange={(e) => {
              manageUpdate({ ...request, cost_center_id: e })
            }}
            value={request.cost_center_id}
            filterOption={filterSelectForm}
          >
            {costCenters.map((cc) => {
              return (
                <Select.Option key={cc.id} value={cc.id}>
                  {cc.origin}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Forma de pago"
          className={cn({
            hidden: ![RequestType.Supplier].includes(request.request_type),
          })}
        >
          <Select
            allowClear
            value={request.pay_method}
            onChange={(val) => {
              manageUpdate({ ...request, pay_method: val })
            }}
          >
            <Select.Option key={'CONTADO'} value={'CONTADO'}>
              CONTADO
            </Select.Option>
            <Select.Option key={'CREDITO'} value={'CREDITO'}>
              CREDITO
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Tiene rentencion"
          valuePropName="checked"
          hidden={isTransfer}
        >
          <Switch
            checked={request.retention == Retention.Yes}
            onChange={(val) => {
              if (val) {
                manageUpdate({ ...request, retention: Retention.Yes })
              } else {
                manageUpdate({ ...request, retention: Retention.No })
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Monto neto"
          hidden={request.retention != Retention.Yes || isTransfer}
        >
          <InputNumber
            step={0.01}
            min={0.01}
            prefix={request.currency == 'USD' ? '$ ' : 'S/ '}
            precision={2}
            value={request.amount_net}
            onChange={(e) => handlerChangeRetention(e, 'net')}
            className="w-36"
          />
        </Form.Item>
        <Form.Item
          label="retencion"
          hidden={request.retention != Retention.Yes || isTransfer}
        >
          <InputNumber
            step={0.01}
            min={0.01}
            prefix={request.currency == 'USD' ? '$ ' : 'S/ '}
            precision={2}
            value={request.amount_ret}
            onChange={(e) => handlerChangeRetention(e, 'ret')}
            className="w-36"
          />
        </Form.Item>
        <Form.Item label="Fecha de aprobación">
          <DatePicker
            value={request.approved_at ? dayjs(request.approved_at) : null}
            onChange={(e) => {
              manageUpdate({ ...request, approved_at: e!.format('YYYY-MM-DD') })
            }}
          />
        </Form.Item>
        <div className="mt-2 mb-4">
          <Link
            className="cursor-pointer hover:underline"
            onClick={handlerUpdate}
            hidden={!isUpdating}
          >
            Guardar cambios
          </Link>
        </div>
        <div className="flex flex-row justify-between w-full">
          <Button
            type="primary"
            danger
            disabled={isUpdating}
            onClick={() => {
              Modal.confirm({
                centered: true,
                title: 'Rechazar requerimiento',
                content: '¿Seguro que desea rechazar este requerimiento?',
                onOk: () => {
                  handlerAction('reject')
                },
              })
            }}
          >
            Rechazar
          </Button>

          <Button
            type="primary"
            disabled={isUpdating}
            onClick={() => {
              Modal.confirm({
                centered: true,
                title: 'Aprobar requerimiento',
                content: '¿Seguro que desea aprobar este requerimiento?',
                onOk: () => {
                  handlerAction('approve')
                },
              })
            }}
          >
            Aprobar
          </Button>
        </div>
      </Form>
    </>
  )
}
