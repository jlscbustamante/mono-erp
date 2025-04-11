import { Tabs, TabsProps } from 'antd'
import { useState } from 'react'

const Children1 = () => {
  const [num, set_num] = useState(0)
  return (
    <div>
      Na val : {num}{' '}
      <button onClick={() => set_num((el) => el + 1)}>plus</button>
    </div>
  )
}

const Childen2 = () => {
  return <div>Chldren 2</div>
}

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Tab 1',
    children: <Children1 />,
  },
  {
    key: '2',
    label: 'Tab 2',
    children: <Childen2 />,
  },
]

export const Control = () => {
  return (
    <div>
      <Tabs items={items} defaultActiveKey="1" />
    </div>
  )
}
