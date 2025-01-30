import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Typography,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import { CashAccountTypeId } from '@/data/cashAccount/types/cashTypes'
import * as sdk from '@/data/requests/sdk'
import { setRequestChangeSt } from '@/data/requests/state'
import {
  IFilteredRequest,
  RequestStatus,
  RequestType,
  RequestTypeCategory,
  Retention,
} from '@/data/requests/types'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
  costCentersSt,
} from '@/data/resources/state'
import { cn, getNameRequestType } from '@/utils'
import { filterSelectForm } from '@/utils/filterOptions'

const { Link } = Typography

export const ReadOnlyForm: React.FC<{
  request: IFilteredRequest
  setRequest: Dispatch<SetStateAction<IFilteredRequest | null>>
  showUnsign?: boolean
}> = ({ request, setRequest, showUnsign = true }) => {
  const categories = useRecoilValue(categoriesRequestSt)
  const _cashAccounts = useRecoilValue(cashAccountRequestSt)
  const costCenters = useRecoilValue(costCentersSt)
  const [showCategoryCash] = useState(
    request.category_move === RequestTypeCategory.Cash,
  )
  const setReloadChanges = useSetRecoilState(setRequestChangeSt)
  const isTransfer = request.request_type == RequestType.Transfer
  const isLiquidation = request.request_type == RequestType.Liquidation
  const cashAccounts = isLiquidation
    ? _cashAccounts.filter(
        (el) => el.cash_account_type.type_id === CashAccountTypeId.Liquidator,
      )
    : _cashAccounts

  const unsignRequest = async () => {
    try {
      // await sdk.approveRequest(request.id)
      await sdk.removeApproval(request.id)
      toast.info('Requerimiento actualizado', NOTIFICATION.info)
      setReloadChanges(1)
      setRequest(null)
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  }

  return (
    <>
      <Form {...layout} style={{ maxWidth: 600 }} aria-readonly={true}>
        <Form.Item label="Tipo">
          <Input
            value={getNameRequestType(request.request_type)}
            readOnly={true}
          />
        </Form.Item>
        <Form.Item label="Fecha de registro">
          <DatePicker
            value={dayjs(request.created_at ?? undefined) ?? undefined}
            inputReadOnly={true}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item label="N° Doc" hidden={isTransfer}>
          <Input value={request.num_document ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item label="RUC" hidden={isTransfer}>
          <Input value={request.legal_number ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item label="R. social" hidden={isTransfer}>
          <Input value={request.legal_name ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item label="Detalle">
          <TextArea
            rows={4}
            cols={10}
            autoSize={true}
            value={request.description}
            readOnly={true}
          />
        </Form.Item>
        <Form.Item label="Monto">
          <div className="grid grid-cols-3">
            <InputNumber
              step={0.01}
              min={0.01}
              prefix="S/ "
              precision={2}
              value={request.amount}
              className="w-36 col-span-2"
              readOnly={true}
            />
            <Input value={request.currency} readOnly />
          </div>
        </Form.Item>
        <Form.Item label="Categoria" hidden={showCategoryCash || isTransfer}>
          <Select
            showSearch
            value={request.category_id}
            filterOption={filterSelectForm}
            aria-readonly={true}
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
            aria-readonly={true}
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
            aria-readonly={true}
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
            value={request.cost_center_id}
            filterOption={filterSelectForm}
            aria-readonly={true}
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
          <Input value={request.pay_method ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item
          label="Tiene rentencion"
          valuePropName="checked"
          hidden={true}
        >
          <Switch checked={request.retention == Retention.Yes} />
        </Form.Item>
        <Form.Item
          label="Monto neto"
          hidden={request.retention != Retention.Yes || isTransfer}
        >
          <InputNumber
            step={0.01}
            min={0.01}
            prefix="S/"
            precision={2}
            value={request.amount_net}
            className="w-36"
            readOnly={true}
          />
        </Form.Item>
        <Form.Item
          label="retencion"
          hidden={request.retention != Retention.Yes || isTransfer}
        >
          <InputNumber
            readOnly={true}
            step={0.01}
            min={0.01}
            prefix="S/"
            precision={2}
            value={request.amount_ret}
            className="w-36"
          />
        </Form.Item>
        <Form.Item label="Creado por">
          <Input value={request.created_by ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item
          label="Aprobado por"
          hidden={request.status != RequestStatus.Approved}
        >
          <Input value={request.approved_by ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item
          label="Rechazado por"
          hidden={request.status != RequestStatus.Rejected}
        >
          <Input value={request.rejected_by ?? ''} readOnly={true} />
        </Form.Item>
        <Form.Item label="Fecha de aprobación">
          <DatePicker
            value={dayjs(request.approved_at ?? undefined) ?? undefined}
            inputReadOnly={true}
            allowClear={false}
          />
        </Form.Item>
        <div className="mt-2 mb-4" hidden={!showUnsign}>
          {request.status == RequestStatus.Approved && (
            <Link
              className="cursor-pointer hover:underline"
              onClick={() => {
                Modal.confirm({
                  title: 'Deshacer aprobación',
                  centered: true,
                  content:
                    '¿Seguro que desea deshacer la aprobación de este requerimiento?',
                  onOk: () => {
                    unsignRequest()
                  },
                })
              }}
            >
              Quitar aprobación del requerimiento
            </Link>
          )}
        </div>
      </Form>
    </>
  )
}
