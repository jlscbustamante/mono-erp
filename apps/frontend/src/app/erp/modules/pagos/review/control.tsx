import { AdmRequirementSelect } from '@types'
import { Tabs, TabsProps } from 'antd'
import { Contrato } from './contrato'
import { CrearFactura } from './factura'

export const Control = ({
  requirement,
}: {
  requirement: AdmRequirementSelect
}) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: <p className="px-3">Factura</p>,
      className: 'px-3',
      children: <CrearFactura requirement={requirement} />,
    },
    {
      key: '4',
      label: <p className="px-3">Contrato</p>,
      className: 'px-3',
      children: <Contrato />,
    },
  ]

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
