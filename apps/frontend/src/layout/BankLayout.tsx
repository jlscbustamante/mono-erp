import { useEffect, useState } from 'react'
import { AiFillBank, AiOutlineTable } from 'react-icons/ai'
import { Outlet } from 'react-router-dom'

import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/router/paths'

import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'
const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

const moduleNameToFind = 'Banco'

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
    key: PATHS.bank.benchFixing._,
    label: 'Cuadre de banco',
    icon: <AiFillBank />,
    children: [
      {
        type: 'option',
        key: PATHS.bank.benchFixing.bcp,
        label: 'BCP',
        config: {
          title: 'Cuadre BCP',
        },
      },
    ],
  },
  {
    type: 'option',
    key: PATHS.bank.infoTable,
    label: 'Cierre ejercicio',
    icon: <AiOutlineTable />,
    config: {
      title: 'Cierre ejercicio',
    },
  },
  {
    type: 'divider',
  },
]
const filteredMenuOptions = menuOptions.filter(
  (option) =>
    option.type !== 'option' ||
    (typeof option.label === 'string' && functionNames.includes(option.label)),
)
export default function BankLayout() {
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
      <NavigationLayout config={configNavigation} defaultTitle="Banco" />
      <MenuLayout
        items={filteredMenuOptions}
        onChangeConfig={(config) => setConfigNavigation(config)}
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
