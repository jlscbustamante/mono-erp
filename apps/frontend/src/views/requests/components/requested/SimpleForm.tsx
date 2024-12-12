import { Button, Form, Input, InputNumber, Select, Switch } from 'antd'
import Search from 'antd/es/input/Search'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import { CashAccountTypeId } from '@/data/cashAccount/types/cashTypes'
import * as sdk from '@/data/requests/sdk'
import {
  defaultSimpleForm,
  setRequestChangeSt,
  simpleFormSt,
} from '@/data/requests/state'
import { RequestTypeCategory, Retention } from '@/data/requests/types'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
  costCentersSt,
} from '@/data/resources/state'
import { AccountFlow } from '@/data/types/accountFlow'
import { filterSelectForm } from '@/utils/filterOptions'
import { safeAny } from '@/utils/someAny'

export const SimpleForm = () => {
  const categories = useRecoilValue(categoriesRequestSt)
  const cashAccounts = useRecoilValue(cashAccountRequestSt)
  const costCenters = useRecoilValue(costCentersSt)
  const [simpleForm, setSimpleForm] = useRecoilState(simpleFormSt)
  const [showCategoryCash, setShowCategoryCash] = useState(false)
  const [beforeCashIsLiquidator, setBeforeCashIsLiquidator] = useState(false)
  const setReloadChanges = useSetRecoilState(setRequestChangeSt)
  const [loading, setLoading] = useState(false)

  const validateRequest = () => {
    if (simpleForm.retention == Retention.Yes) {
      if (!simpleForm.amount_net || simpleForm.amount_net <= 0)
        throw new Error('monto invalido en monto neto')
      if (!simpleForm.amount_ret || simpleForm.amount_ret <= 0)
        throw new Error('monto invalido en retencion')
    }
  }

  const handlerCreate = async () => {
    try {
      setLoading(true)
      validateRequest()
      const idNot = toast.loading(
        'Creando requerimiento...',
        NOTIFICATION.loading,
      )
      await sdk.createRequest(simpleForm)
      toast.update(idNot, {
        render: 'Requerimiento creado',
        ...NOTIFICATION.updateLoading,
      })
      setReloadChanges(1)
      setSimpleForm(defaultSimpleForm)
    } catch (err: safeAny) {
      toast.dismiss()
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  const handlerChangeCashAccount = (e: number) => {
    const cash = cashAccounts.find((cc) => cc.id === e)!
    const isLiquidator =
      cash.cash_account_type.type_id == CashAccountTypeId.Liquidator

    if (isLiquidator) {
      setSimpleForm({
        ...simpleForm,
        cash_id: cash.id,
        cash_account_id: cash.account_id,
        category_id: null,
        category_move: RequestTypeCategory.Cash,
      })
      setShowCategoryCash(true)
      setBeforeCashIsLiquidator(true)
    } else {
      const newObj: safeAny = {
        ...simpleForm,
        cash_id: cash.id,
        cash_account_id: cash.account_id,
        category_move: RequestTypeCategory.Category,
      }
      if (beforeCashIsLiquidator) {
        newObj.category_id = null
      }
      setSimpleForm(newObj)
      setShowCategoryCash(false)
      setBeforeCashIsLiquidator(false)
    }
  }

  const handlerChangeCategory = (e: number) => {
    const category = categories.find((cc) => cc.id === e)!
    setSimpleForm({
      ...simpleForm,
      category_id: category.id,
      category_account_id: category.account_id,
      account_flow: category.account_flow,
    })
  }
  const handlerChangeCashOrigin = (e: number) => {
    const cash = cashAccounts.find((cc) => cc.id === e)!
    setSimpleForm({
      ...simpleForm,
      category_id: cash.id,
      category_account_id: cash.account_id,
      account_flow: AccountFlow.Input,
    })
  }

  const handlerChangeRetention = (val: number | null, type: 'net' | 'ret') => {
    const amount = simpleForm.amount ?? 0
    let amount_net = simpleForm.amount_net ?? 0
    let amount_ret = simpleForm.amount_ret ?? 0
    if (type == 'net') {
      amount_net = val ?? 0
      amount_ret = amount - amount_net
      setSimpleForm({
        ...simpleForm,
        amount_net: val,
        amount_ret: amount_ret,
      })
    } else {
      amount_ret = val ?? 0
      amount_net = amount - amount_ret
      setSimpleForm({
        ...simpleForm,
        amount_net: amount_net,
        amount_ret: val,
      })
    }
  }

  const handleSearchRuc = async (ruc: string) => {
    try {
      setLoading(true)
      const { name } = await sdk.getNameByRuc(ruc)
      setSimpleForm({ ...simpleForm, legal_name: name })
    } catch (err: any) {
      toast.error('Error al buscar ruc, ' + err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  }

  useEffect(() => {
    setSimpleForm(defaultSimpleForm)
  }, [])
  return (
    <>
      <Form {...layout} className="">
        <Form.Item label="Tipo">
          <Input placeholder="Simple" disabled />
        </Form.Item>
        <Form.Item label="N° Doc">
          <Input
            placeholder="0001-111"
            value={simpleForm.num_document ?? ''}
            onChange={(e) =>
              setSimpleForm({ ...simpleForm, num_document: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="RUC">
          <Search
            placeholder="000000000000"
            value={simpleForm.legal_number ?? ''}
            onChange={(e) => {
              setSimpleForm({ ...simpleForm, legal_number: e.target.value })
            }}
            onSearch={(ruc) => {
              handleSearchRuc(ruc)
            }}
            loading={loading}
          />
        </Form.Item>
        <Form.Item label="R. social">
          <Input
            placeholder="R. social"
            value={simpleForm.legal_name ?? ''}
            onChange={(e) => {
              setSimpleForm({ ...simpleForm, legal_name: e.target.value })
            }}
          />
        </Form.Item>
        <Form.Item label="Detalle">
          <TextArea
            rows={4}
            cols={10}
            autoSize={true}
            value={simpleForm.description}
            onChange={(e) =>
              setSimpleForm({ ...simpleForm, description: e.target.value })
            }
          />
        </Form.Item>
        <Form.Item label="Monto">
          <InputNumber
            step={0.01}
            min={0.01}
            prefix="S/ "
            precision={2}
            value={simpleForm.amount}
            onChange={(e) => setSimpleForm({ ...simpleForm, amount: e ?? 0 })}
            className="w-36"
          />
        </Form.Item>
        <Form.Item label="Categoria" hidden={showCategoryCash}>
          <Select
            showSearch
            onChange={handlerChangeCategory}
            value={simpleForm.category_id}
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
        <Form.Item label="Caja origen" hidden={!showCategoryCash}>
          <Select
            showSearch
            filterOption={filterSelectForm}
            value={simpleForm.category_id}
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
        <Form.Item label={showCategoryCash ? 'Caja destino' : 'Caja'}>
          <Select
            showSearch
            filterOption={filterSelectForm}
            value={simpleForm.cash_id}
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
        <Form.Item label="Centro de costo">
          <Select
            showSearch
            onChange={(e) => {
              setSimpleForm({ ...simpleForm, cost_center_id: e })
            }}
            value={simpleForm.cost_center_id}
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
        {/* <Form.Item label="Forma de pago" name={'pay_method'}>
          <Select
            allowClear
            value={simpleForm.pay_method}
            onChange={(val) => {
              // console.log('val : ', val)
              setSimpleForm({ ...simpleForm, pay_method: val })
            }}
          >
            <Select.Option key={'CONTADO'}>CONTADO</Select.Option>
            <Select.Option key={'CREDITO'}>CREDITO</Select.Option>
          </Select>
        </Form.Item> */}
        <Form.Item label="Tiene rentencion" valuePropName="checked">
          <Switch
            checked={simpleForm.retention == Retention.Yes}
            onChange={(val) => {
              if (val) {
                setSimpleForm({ ...simpleForm, retention: Retention.Yes })
              } else {
                setSimpleForm({ ...simpleForm, retention: Retention.No })
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Monto neto"
          hidden={simpleForm.retention != Retention.Yes}
        >
          <InputNumber
            step={0.01}
            min={0.01}
            prefix="S/"
            precision={2}
            value={simpleForm.amount_net}
            onChange={(e) => handlerChangeRetention(e, 'net')}
            className="w-36"
          />
        </Form.Item>
        <Form.Item
          label="retencion"
          hidden={simpleForm.retention != Retention.Yes}
        >
          <InputNumber
            step={0.01}
            min={0.01}
            prefix="S/"
            precision={2}
            value={simpleForm.amount_ret}
            onChange={(e) => handlerChangeRetention(e, 'ret')}
            className="w-36"
          />
        </Form.Item>
        <div className="flex justify-end">
          <Button type="primary" onClick={handlerCreate} loading={loading}>
            Crear
          </Button>
        </div>
      </Form>
    </>
  )
}
