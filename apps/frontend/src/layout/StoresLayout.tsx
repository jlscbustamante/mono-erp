import { useEffect, useState } from 'react'
import { BsCreditCard2Back, BsFileEarmarkDiff } from 'react-icons/bs'
import { GiConfirmed } from 'react-icons/gi'
import { MdAccountBalance } from 'react-icons/md'
import { Outlet } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { cashAccountStoreSt, categoriesStoreSt } from '@/data/resources/state'
// import * as sdk from '@/data/resources/sdk'
import * as sdk from '@/data/stores/sdk'
import { PATHS } from '@/router/paths'

import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'
const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

const moduleNameToFind = 'Caja de Tiendas'

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
    key: PATHS.stores.signmovements,
    label: 'Conciliar Tiendas',
    icon: <GiConfirmed />,
    config: {
      title: 'Firmar movimientos',
    },
  },
  {
    type: 'option',
    key: PATHS.stores.paymentMethods,
    label: 'Conciliar medios de pago',
    icon: <BsCreditCard2Back />,
    config: {
      title: 'Conciliar metodos de pago',
    },
  },
  {
    type: 'option',
    key: PATHS.stores.states,
    label: 'Comprobar cajas',
    icon: <BsFileEarmarkDiff />,
    config: {
      title: 'Balances de caja',
    },
  },
  {
    type: 'option',
    key: PATHS.stores.generateaccount,
    label: 'Generar asientos',
    icon: <MdAccountBalance />,
    config: {
      title: 'Generar asientos de tiendas',
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

export default function StoresLayout() {
  const setCashAccounts = useSetRecoilState(cashAccountStoreSt)
  const setCategories = useSetRecoilState(categoriesStoreSt)
  const [showSelectItemMessage, setShowSelectItemMessage] = useState(true)
  const [configNavigation, setConfigNavigation] = useState<
    MenuConfig | undefined
  >({
    title: '',
    twBackground: undefined,
    twText: undefined,
  })

  useEffect(() => {
    ;(async () => {
      const [cashAccounts, categories] = await Promise.all([
        sdk.cashAccount(),
        sdk.categories(),
      ])
      setCashAccounts(cashAccounts)
      setCategories(categories)
      if (configNavigation?.title) {
        setShowSelectItemMessage(false)
      }
    })()
  }, [configNavigation])
  return (
    <div className="h-screen requests-layout">
      <NavigationLayout config={configNavigation} defaultTitle="Tiendas" />
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
