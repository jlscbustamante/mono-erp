import { useEffect, useState } from 'react'
import { BiSolidUser } from 'react-icons/bi'
import { TbHierarchy3 } from 'react-icons/tb'
import { Outlet } from 'react-router-dom'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/router/paths'

import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'

const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

const moduleNameToFind = 'Seguridad'

const permissions = userPermission?.permissions
let functionNames: string | any[] = []

if (permissions) {
  const moduleData = permissions.find(
    (permission: { module_name: string }) =>
      permission.module_name === moduleNameToFind,
  )

  if (moduleData) {
    functionNames = moduleData.function_ids.map(
      (functionId: { menu: any }) => functionId.menu,
    )
  }
}

const menuOptions: MenuList = [
  {
    type: 'option',
    key: PATHS.security.getIamRole,
    label: 'Roles',
    icon: <TbHierarchy3 />,
    config: {
      title: 'Seguridad de Role',
    },
  },
  {
    type: 'option',
    key: PATHS.security.getIamUser,
    label: 'Usuario',
    icon: <BiSolidUser />,
    config: {
      title: 'Seguridad de Usuario',
    },
  },
  {
    type: 'divider',
  },
]

const filteredMenuOptions = config.allowViewAll
  ? menuOptions
  : menuOptions.filter(
      (option) =>
        option.type !== 'option' ||
        (typeof option.label === 'string' &&
          functionNames.includes(option.label)),
    )

export default function SecurityLayout() {
  const [showSelectItemMessage, setShowSelectItemMessage] = useState(true)
  const [configNavigation, setConfigNavigation] = useState<
    MenuConfig | undefined
  >({
    title: '',
    twBackground: undefined,
    twText: undefined,
  })
  useEffect(() => {
    if (configNavigation?.title) {
      setShowSelectItemMessage(false)
    }
  }, [configNavigation])

  return (
    <div className="h-screen requests-layout">
      <NavigationLayout config={configNavigation} defaultTitle="Seguridad" />
      <MenuLayout
        items={filteredMenuOptions}
        onChangeConfig={setConfigNavigation}
      />
      <div className="overflow-y-auto requestes-layout__content">
        <div>
          {showSelectItemMessage && (
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <p>Seleccione un item del menu</p>
            </div>
          )}
        </div>
        <Outlet />
      </div>
    </div>
  )
}
