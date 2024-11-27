import { useEffect, useState } from 'react'
import { IoIosCheckbox } from 'react-icons/io'
import { MdAccountBalance, MdCancelPresentation } from 'react-icons/md'
import { TbReportSearch } from 'react-icons/tb'
import { Outlet } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
// import * as sdk from '@/data/resources/sdk'
import * as sdk from '@/data/requests/sdk'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
  costCentersSt,
} from '@/data/resources/state'
import { PATHS } from '@/router/paths'

import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'

const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

const moduleNameToFind = 'Requerimientos'

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
    key: PATHS.requests.requested,
    label: 'Solicitados',
    icon: <IoIosCheckbox />,
    config: {
      twBackground: 'bg-yellow-200',
      twText: 'text-black',
      title: 'Solicitados',
    },
  },
  {
    type: 'option',
    key: PATHS.requests.approved,
    label: 'Aprobados',
    icon: <IoIosCheckbox />,
    config: {
      twBackground: 'bg-lime-500',
      title: 'Aprobados',
    },
  },
  {
    type: 'option',
    key: PATHS.requests.rejected,
    label: 'Rechazados',
    icon: <MdCancelPresentation />,
    config: {
      twBackground: 'bg-red-500',
      title: 'Rechazados',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'option',
    key: PATHS.requests._ + 'group',
    label: 'Consultas de caja',
    icon: <TbReportSearch />,
    children: [
      {
        type: 'option',
        key: PATHS.requests.balances.detailed,
        label: 'Detallado',
      },
      {
        type: 'option',
        key: PATHS.requests.balances.summarized,
        label: 'Resumido',
      },
      {
        type: 'option',
        key: PATHS.requests.balances.costcenter,
        label: 'Por centro de costo',
        config: {
          title: 'Resumen por centro de costos',
        },
      },
    ],
  },
  {
    type: 'option',
    key: PATHS.requests.balances.generateaccount,
    label: 'Generar asientos',
    icon: <MdAccountBalance />,
    config: {
      title: 'Generar asientos de requerimientos',
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
export default function RequestsLayout() {
  const setCategories = useSetRecoilState(categoriesRequestSt)
  const setCashAccounts = useSetRecoilState(cashAccountRequestSt)
  const setCostCenters = useSetRecoilState(costCentersSt)
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
      // const categories = await sdk.categories()
      // setCategories(categories)
      // const cashAccounts = await sdk.cashAccount()
      // setCashAccounts(cashAccounts)
      // const costCenters = await sdk.costCenters()
      // setCostCenters(costCenters)
      const [categories, cashAccounts, costCenters] = await Promise.all([
        sdk.categories(),
        sdk.cashAccount(),
        sdk.costCenters(),
      ])
      setCategories(categories)
      setCashAccounts(cashAccounts)
      setCostCenters(costCenters)
      if (configNavigation?.title) {
        setShowSelectItemMessage(false)
      }
    })()
  }, [configNavigation])

  return (
    <div className="h-screen requests-layout">
      <NavigationLayout
        config={configNavigation}
        defaultTitle="Requerimientos"
      />
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
