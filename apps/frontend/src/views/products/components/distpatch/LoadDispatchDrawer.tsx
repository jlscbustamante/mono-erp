import { Button, DatePicker, Drawer, Form, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { IDispatch } from '@/data/products/types'
import { filterSelectForm } from '@/utils'

import { useDispatch } from '../../state/useDispatch'
import { CreateWareHouseModal } from './CreateWareHouseModal'

export const LoadDispatchDrawer = () => {
  const { store, getSucursals } = useDispatch()
  const [loading, setLoading] = useState(false)
  const [sucursales, setSucursales] = useState<
    { label: string; value: string }[]
  >([])
  const [selectedInfo, setSelectedInfo] = useState({
    id: undefined,
    name: '',
    date: dayjs().format('YYYY-MM-DD'),
  })
  const [dispatchLoaded] = useState<undefined | IDispatch>(undefined)

  const loadDispatch = async () => {
    setLoading(true)
    // const dispatch = await loadDispatchPos()
    // setDispatchLoaded(dispatch)
    setLoading(false)
  }

  useEffect(() => {
    ;(async () => {
      const sucs = await getSucursals()
      setSucursales(sucs)
    })()
  }, [])

  return (
    <Drawer
      title="Cargar despacho"
      open={store.drawers.create}
      onClose={() => store.setDrawers({ create: false })}
      width={900}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="Almacen">
          <div className="flex gap-1">
            <Select
              placeholder="Selecciona una almacén"
              showSearch={true}
              filterOption={filterSelectForm}
              loading={store.loading.warehouses}
              value={selectedInfo.id}
              onChange={(id, option) => {
                // setNewDispatch({ ...newDispatch, wareFromId: id })
                setSelectedInfo({
                  ...selectedInfo,
                  id,
                  name: option?.children ?? '',
                })
              }}
            >
              {store.warehouses.map((w) => (
                <Select.Option key={w.id} value={w.id}>
                  {w.name}
                </Select.Option>
              ))}
            </Select>
            <CreateWareHouseModal sucursales={sucursales} />
          </div>
        </Form.Item>
        <Form.Item label="Fecha de Despacho">
          <DatePicker
            allowClear={false}
            value={dayjs(selectedInfo.date)}
            onChange={(date) =>
              setSelectedInfo({
                ...selectedInfo,
                date: date!.format('YYYY-MM-DD'),
              })
            }
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="default" onClick={loadDispatch} loading={loading}>
            Cargar
          </Button>
        </Form.Item>
      </Form>
      <div>
        {dispatchLoaded && (
          <div>
            <p className="font-bold">Información del despacho</p>
          </div>
        )}
      </div>
      <div className="text-right">
        <Button type="primary" disabled={!dispatchLoaded}>
          Guardar despacho
        </Button>
      </div>
    </Drawer>
  )
}
