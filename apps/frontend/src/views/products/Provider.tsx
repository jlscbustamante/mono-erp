import { Button, Card, Checkbox, Form, Input, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { BiPlus } from 'react-icons/bi'

export default function Provider() {
  const [openModal, setOpenModal] = useState(false)
  return (
    <div className="p-3 flex flex-col gap-3">
      <Filters setOpenModal={setOpenModal} />
      <TableProvider />
      <ModalNewProvider open={openModal} onClose={setOpenModal} />
    </div>
  )
}

const Filters: React.FC<{ setOpenModal: (open: boolean) => void }> = ({
  setOpenModal,
}) => {
  return (
    <div className="flex justify-between">
      <Input className="w-80" placeholder="Presiona Enter para buscar" />
      <Button
        className="flex items-center"
        type="primary"
        icon={<BiPlus />}
        onClick={() => setOpenModal(true)}
      >
        Nuevo
      </Button>
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

const TableProvider = () => {
  const columnsTable: ColumnsType<IProvider> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Razón Social',
      dataIndex: 'legal_name',
      key: 'legal_name',
      sorter: (a, b) => a.legal_name.localeCompare(b.legal_name),
    },
    {
      title: 'RUC',
      dataIndex: 'ruc',
      key: 'ruc',
      sorter: (a, b) => a.ruc.localeCompare(b.ruc),
    },
    {
      title: 'Dirección',
      dataIndex: 'direction',
      key: 'direction',
      sorter: (a, b) => a.direction.localeCompare(b.direction),
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'state',
      sorter: () => -1,
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
    <Card title="PROVEEDOR">
      <p className="text-red-600 mb-4">Total : 128</p>
      <Table
        rowKey={'id'}
        columns={columnsTable}
        dataSource={datasource}
        size="small"
      />
    </Card>
  )
}

const ModalNewProvider: React.FC<{
  open: boolean
  onClose: (close: false) => void
}> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      width={900}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={() => {
        onClose(false)
      }}
      cancelText="Cancelar"
      okText="Guardar"
      title="PROVEEDOR"
    >
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        <Form.Item
          label="CODIGO DE PROVEEDOR"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="PROVEEDOR"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="RAZÓN SOCIAL"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Input />
        </Form.Item>
        <Form.Item label="RUC" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          <Input />
        </Form.Item>
        <Form.Item
          label="DIRECCIÓN"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="ESTADO"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Checkbox />
        </Form.Item>
      </Form>
    </Modal>
  )
}
