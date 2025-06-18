import { AdmReqNondocsViewDto } from '@types'
import { Tabs, TabsProps } from 'antd'
import { ArrowLeft } from 'lucide-react'
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
        tabBarExtraContent={{
          left: (
            <div
              className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 hover:text-blue-500 border-0 border-r border-solid border-gray-300 mr-4 pl-2 pr-4"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-auto" /> Volver
            </div>
          ),
        }}
        tabBarStyle={{
          background: 'white',
        }}
      />
    </div>
  )
}
