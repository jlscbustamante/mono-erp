import { AdmReqNondocsViewDto } from '@types'
import { Tabs, TabsProps } from 'antd'
import { NonDoc } from './nondoc'

export const Control = ({
  requirement,
}: {
  requirement: AdmReqNondocsViewDto
}) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <p className="px-3">
          {requirement.request_type == 'T' ? 'Tranferencia' : 'Anticipo'}
        </p>
      ),
      className: 'px-3',
      children: <NonDoc requirement={requirement} />,
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
