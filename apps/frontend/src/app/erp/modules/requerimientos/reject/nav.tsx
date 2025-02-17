import { Tabs, TabsProps } from 'antd'

export function NavRequest() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Simple',
    },
    {
      key: '2',
      label: 'Transferencia',
    },
  ]

  return <Tabs items={items} defaultActiveKey="1" />
}
