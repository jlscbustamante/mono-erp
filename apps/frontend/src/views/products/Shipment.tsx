import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

import classes from './styles.module.css'

const { RangePicker } = DatePicker

export default function Shipment() {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="p-3 flex flex-col gap-3">
      <Filters setOpenModal={setOpenModal} />
      <TableShipment />
      <ModalNewShipment open={openModal} setOpen={setOpenModal} />
    </div>
  )
}

const Filters: React.FC<{ setOpenModal: (open: boolean) => void }> = ({
  setOpenModal,
}) => {
  return (
    <div className="flex gap-1 justify-between">
      <div className="flex gap-2">
        <RangePicker />
        <Select placeholder="Selecciona" />
        <Button type="default">Buscar</Button>
      </div>
      <div>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Despacho
        </Button>
      </div>
    </div>
  )
}

interface IProvider {
  id: number
  name: string
  legal_name: string
  ruc: string
  direction: string
  date: string
  state: boolean
}

const TableShipment = () => {
  const columnsTable: ColumnsType<IProvider> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Razón Social',
      dataIndex: 'legal_name',
      key: 'legal_name',
    },
    {
      title: 'RUC',
      dataIndex: 'ruc',
      key: 'ruc',
    },
    {
      title: 'Dirección',
      dataIndex: 'direction',
      key: 'direction',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
    },
  ]
  const datasource: IProvider[] = [
    {
      date: '12/12/2021',
      id: 1,
      legal_name: 'Nombre empresa',
      name: 'Juan',
      ruc: '123456789',
      state: true,
      direction: 'Calle 123',
    },
    {
      date: '12/12/2021',
      id: 2,
      legal_name: 'Nombre empresa',
      name: 'Juan',
      ruc: '123456789',
      state: true,
      direction: 'Calle 123',
    },
  ]
  return (
    <Card title="DESPACHO">
      <p className="mb-2 text-red-600">Total: 0</p>
      <Table
        columns={columnsTable}
        dataSource={datasource}
        rowKey={'id'}
        size="small"
      />
    </Card>
  )
}

interface IShipmentItem {
  id: number
  product: string
  measurement: string
  amount: number
}

const ModalNewShipment: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
  const [items, setItems] = useState<IShipmentItem[]>([])

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        amount: 0,
        id: 1,
        measurement: 'KG',
        product: 'PRODUCTO',
      },
    ])
  }

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <Modal
      title="Despacho"
      open={open}
      onCancel={() => setOpen(false)}
      width={900}
      maskClosable={false}
      footer={[
        <Button key="1" className="float float-left" onClick={handleAddItem}>
          Nuevo item
        </Button>,
        <Button key="2" type="primary" onClick={() => setOpen(false)}>
          Guardar
        </Button>,
        <Button key="3" danger onClick={() => setOpen(false)}>
          Cancelar
        </Button>,
      ]}
    >
      <div>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          <Form.Item label="Fecha">
            <DatePicker />
          </Form.Item>
          <Form.Item label="NÚMERO DE DOCUMENTO">
            <Input />
          </Form.Item>
          <Form.Item label="SUCURSAL ORIGEN">
            <Select placeholder="Selecciona">
              <Select.Option value="1">Item 1</Select.Option>
              <Select.Option value="2">Item 1</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="SUCURSAL DESTINO">
            <Select placeholder="Selecciona">
              <Select.Option value="1">Item 1</Select.Option>
              <Select.Option value="2">Item 1</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className="mb-6 flex flex-col gap-2">
        <div className={classes.shipmentNewItem}>
          <span>#</span>
          <span>Producto</span>
          <span>Medida</span>
          <span>Cantidad</span>
        </div>
        {items.map((item, index) => {
          return (
            <div key={index} className={classes.shipmentNewItem}>
              <span>{index + 1}</span>
              <Select>
                <Select.Option value="1">Item 1</Select.Option>
                <Select.Option value="2">Item 1</Select.Option>
              </Select>
              <Input value={item.measurement} readOnly={true} />
              <InputNumber value={item.amount} />
              <Button danger onClick={() => handleDeleteItem(index)}>
                Eliminar
              </Button>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
