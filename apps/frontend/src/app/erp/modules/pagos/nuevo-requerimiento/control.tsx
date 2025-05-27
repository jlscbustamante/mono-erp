import { Tabs, TabsProps } from 'antd'
import { Anticipo } from './anticipo'
import { Contrato } from './contrato'
import { CrearFactura } from './factura'
import { Transferencia } from './transferencia'

const items: TabsProps['items'] = [
  {
    key: '1',
    label: <p className="px-3">Factura</p>,
    className: 'px-3',
    children: <CrearFactura />,
  },
  {
    key: '2',
    label: <p className="px-3">Transferencia</p>,
    className: 'px-3',
    children: <Transferencia />,
  },
  {
    key: '3',
    label: <p className="px-3">Anticipo</p>,
    className: 'px-3',
    children: <Anticipo />,
  },
  {
    key: '4',
    label: <p className="px-3">Contrato</p>,
    className: 'px-3',
    children: <Contrato />,
  },
]

export const Control = () => {
  return (
    <div>
      <Tabs
        items={items}
        defaultActiveKey="1"
        tabBarStyle={{
          background: 'white',
        }}
      />
    </div>
  )
}
