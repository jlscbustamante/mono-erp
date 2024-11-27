import Title from 'antd/es/typography/Title'
import { useEffect } from 'react'
import { BiExit } from 'react-icons/bi'
import { useNavigate } from 'react-router'

import { UserAvatar } from '@/components'
import { PATHS } from '@/router/paths'

import { MenuConfig } from './MenuLayout'

export const NavigationLayout: React.FC<{
  defaultTitle?: string
  config?: MenuConfig
}> = ({
  defaultTitle = '',
  config = { title: '', twBackground: 'bg-slate-900', twText: '!text-white' },
}) => {
  const navigate = useNavigate()
  const twBackgroundDefault = 'bg-slate-900'
  const twTextDefault = '!text-white'

  useEffect(() => {}, [config])
  return (
    <div
      className={`p-3 flex items-center border border-b-4 border-indigo-50  requests-layout__menu ${
        config.twBackground ?? twBackgroundDefault
      } ${config.twText ?? twTextDefault}`}
    >
      <div className="flex items-center justify-between w-full ml-4">
        <div className="flex items-center gap-4">
          <p>
            <button
              className="rounded-full bg-white p-1 flex items-center justify-center border-0 cursor-pointer hover:bg-slate-100 transition-colors ease-in-out hover:text-slate-800"
              onClick={() => navigate(PATHS.modules)}
              style={{ transform: 'scale(-1)' }}
            >
              <BiExit className="w-5 h-auto" />
            </button>
          </p>
          <Title
            level={5}
            className={config.twText ? config.twText : twTextDefault}
            style={{ marginBottom: 0 }}
          >
            {config.title ? config.title : defaultTitle}
          </Title>
        </div>
        <UserAvatar />
      </div>
    </div>
  )
}
