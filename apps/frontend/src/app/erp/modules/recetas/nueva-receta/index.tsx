import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import type { TabsProps } from 'antd'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Table,
  Tabs,
  Typography,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { ListaInsumos } from './ListaInsumos'
import { gridStyle } from './styles'
import { IngredienteProd } from './types'
const { Text } = Typography

export const NuevaRecetaTabs = () => {
  const [ingredientesR, setIngredientesR] = useState<IngredienteProd[]>([])
  const onChange = (key: string) => {
    console.log('change :' + key)
  }

  //columnas de la tabla de ingredientes de receta
  const columnsIngredientesR: ColumnsType = [
    {
      title: 'Nro',
      className: '!p-1',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Ingrediente',
      dataIndex: 'product',
      className: '!p-1',
    },
    {
      title: 'Colección',
      dataIndex: 'coleccion',
      className: '!p-1',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      className: '!p-1',
    },
    {
      title: 'UM',
      dataIndex: 'measure_id',
      className: '!p-1',
      render: (_, record) =>
        umeds.find((item) => item.id === record.measure_id)?.abr,
    },
    {
      className: '!p-1',
      render: (_, record) => (
        <Button onClick={() => handleQuitarIngrediente(record.id)}>-</Button>
      ),
    },
  ]

  const handleQuitarIngrediente = (code: number) => {
    setIngredientesR(ingredientesR.filter((item) => item.id != code))
  }

  const PanelIzq = () => {
    return (
      <>
        <Card hoverable style={gridStyle}>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Compañía">
                  <CompanySelectForm />
                </Form.Item>
              </div>
              <div className="flex-1 w-48 ...">
                <Form.Item label="Fecha">
                  <DatePicker />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Nombre de receta">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Producto de venta">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Etiquetar como">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Text>Ingredientes</Text>
              </div>
            </div>
          </Form>
          <Table
            className="w-104 relative z-10"
            rowKey={(el) => el.code}
            size="small"
            bordered={true}
            pagination={false}
            columns={columnsIngredientesR}
            dataSource={ingredientesR}
          ></Table>
        </Card>
      </>
    )
  }
  const RecetaProdFinal = () => {
    return (
      <div className="flex">
        <div className="flex-1 w-64 ...">
          <PanelIzq />
        </div>
        <div className="flex-1 w-64 ...">
          <ListaInsumos />
        </div>
      </div>
    )
  }

  const ColeccionIngredientes = () => {
    return <></>
  }

  //Items que contiene el Tab
  const itemsTab: TabsProps['items'] = [
    {
      key: '1',
      label: 'Receta de producto final',
      children: <RecetaProdFinal />,
    },
    {
      key: '2',
      label: 'Colección de ingredientes',
      children: <ColeccionIngredientes />,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: '',
    },
  ]

  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      items={itemsTab}
      onChange={onChange}
    />
  )
}
