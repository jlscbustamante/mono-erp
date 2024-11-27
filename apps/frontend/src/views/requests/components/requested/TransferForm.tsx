import { Button, Form, Input, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/requests/sdk'
import {
  defaultTransferForm,
  setRequestChangeSt,
  transferFormSt,
} from '@/data/requests/state'
import { cashAccountRequestSt } from '@/data/resources/state'
import { AccountFlow } from '@/data/types/accountFlow'
import { filterSelectForm } from '@/utils/filterOptions'

export const TransferForm = () => {
  const cashAccounts = useRecoilValue(cashAccountRequestSt)
  const [transferForm, setTransferForm] = useRecoilState(transferFormSt)
  const setReloadChanges = useSetRecoilState(setRequestChangeSt)

  const handlerCreate = async () => {
    try {
      const idNot = toast.loading(
        'Creando requerimiento...',
        NOTIFICATION.loading,
      )
      await sdk.createRequest(transferForm)
      toast.update(idNot, {
        render: 'Requerimiento creado',
        ...NOTIFICATION.updateLoading,
      })
      setReloadChanges(1)
      setTransferForm(defaultTransferForm)
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const handlerChangeCashAccount = (e: number) => {
    const cash = cashAccounts.find((cc) => cc.id === e)!
    setTransferForm({
      ...transferForm,
      cash_id: cash.id,
      cash_account_id: cash.account_id,
    })
  }

  const handlerChangeCashOrigin = (e: number) => {
    const cash = cashAccounts.find((cc) => cc.id === e)!
    setTransferForm({
      ...transferForm,
      category_id: cash.id,
      category_account_id: cash.account_id,
      account_flow: AccountFlow.Input,
    })
  }

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  }

  useEffect(() => {
    setTransferForm(defaultTransferForm)
  }, [])
  return (
    <>
      <Form {...layout} style={{ maxWidth: 600 }}>
        <Form.Item label="Tipo">
          <Input placeholder="Transferencia" disabled />
        </Form.Item>
        <Form.Item label="Detalle">
          <TextArea
            rows={4}
            cols={10}
            autoSize={true}
            value={transferForm.description}
            onChange={(e) =>
              setTransferForm({ ...transferForm, description: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Monto">
          <InputNumber
            step={0.01}
            min={0.01}
            prefix="S/ "
            precision={2}
            value={transferForm.amount}
            onChange={(e) =>
              setTransferForm({ ...transferForm, amount: e ?? 0 })
            }
            className="w-36"
          />
        </Form.Item>
        <Form.Item label="Caja origen">
          <Select
            showSearch
            filterOption={filterSelectForm}
            value={transferForm.category_id}
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
        <Form.Item label="Caja destino">
          <Select
            showSearch
            filterOption={filterSelectForm}
            value={transferForm.cash_id}
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
        <div className="flex justify-end">
          <Button type="primary" onClick={handlerCreate}>
            Crear
          </Button>
        </div>
      </Form>
    </>
  )
}
