import { Tabs } from 'antd'
import { Form, Input } from 'antd'
import { Empty } from 'antd'
import { Card } from 'antd'
import { DatePicker } from 'antd'

import type { TabsProps } from 'antd'
import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import Meta from 'antd/es/card/Meta'

export const NuevaRecetaTabs = () => {
  const onChange = (key: string) => {
    console.log('change :' + key)
  }

  const PanelIzq = () => {
    return (
      <Card hoverable style={{ width: 700 }} cover={<Empty />}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="Compañía">
            <CompanySelectForm />
          </Form.Item>

          <Form.Item label="Nombre de receta">
            <Input />
          </Form.Item>

          <Form.Item label="Fecha">
            <DatePicker />
          </Form.Item>
        </Form>
      </Card>
    )
  }

  const PanelDer = () => {
    return (
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Meta title="Europe Street beat" description="www.instagram.com" />
      </Card>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Receta de producto final',
      children: <PanelIzq />,
    },
    {
      key: '2',
      label: 'Colección de ingredientes',
      children: <PanelDer />,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]

  /*
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  */
  return (
    <Tabs defaultActiveKey="1" type="card" items={items} onChange={onChange} />
  )
}
