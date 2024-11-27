import { useEffect, useState } from 'react'
import {
  AiFillBank,
  AiFillDollarCircle,
  AiOutlineMenuUnfold,
} from 'react-icons/ai'
import { BiSolidCategoryAlt } from 'react-icons/bi'
import { BsTerminalFill } from 'react-icons/bs'
import { FaCashRegister, FaFilter } from 'react-icons/fa'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import { VscUngroupByRefType } from 'react-icons/vsc'
import { Outlet } from 'react-router-dom'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/router/paths'

import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'

const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

const moduleNameToFind = 'Mantenimiento'

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
    key: PATHS.maintenance.getCategory,
    label: 'Categoría',
    icon: <BiSolidCategoryAlt />,
    config: {
      title: 'Mantenimiento de categoría',
    },
  },
  {
    type: 'option',
    key: PATHS.maintenance.getCashAccount,
    label: 'Cuenta de caja',
    icon: <AiFillBank />,
    config: {
      title: 'Mantenimiento de cuenta de caja',
    },
  },
  {
    type: 'option',
    key: PATHS.maintenance.getCostCenter,
    label: 'Centro de costos',
    icon: <FaCashRegister />,
    config: {
      title: 'Mantenimiento de centro de costos',
    },
  },
  {
    type: 'option',
    key: PATHS.maintenance.getTypeCashAccount,
    label: 'Tipo de cuenta de caja',
    icon: <AiFillDollarCircle />,
    config: {
      title: 'Mantenimiento de tipo de cuenta de caja',
    },
  },
  {
    type: 'option',
    key: PATHS.maintenance.getTypeCategory,
    label: 'Tipo de categoría',
    icon: <VscUngroupByRefType />,
    config: {
      title: 'Mantenimiento de tipo de categoria',
    },
  },
  {
    type: 'divider',
  },
  // {
  //   type: 'option',
  //   key: PATHS.maintenance.getSucursal,
  //   label: 'Tiendas',
  //   icon: <FaStore />,
  //   config: {
  //     title: 'Mantenimiento de tiendas',
  //   },
  // },
  {
    type: 'option',
    key: PATHS.maintenance.getTerminalPost,
    label: 'Terminal pos',
    icon: <BsTerminalFill />,
    config: {
      title: 'Mantenimiento de terminal',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'option',
    key: PATHS.maintenance.getDriver,
    label: 'Motorizados',
    icon: <GiFullMotorcycleHelmet />,
    config: {
      title: 'Mantenimiento de motorizados',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'option',
    key: PATHS.maintenance.getMenuReport,
    label: 'Menú de reportes',
    icon: <AiOutlineMenuUnfold />,
    config: {
      title: 'Mantenimiento de menú de reportes',
    },
  },

  {
    type: 'option',
    key: PATHS.maintenance.getParameters,
    label: 'Parámetros',
    icon: <FaFilter />,
    config: {
      title: 'Mantenimiento de parametros',
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

export default function MaintenanceLayout() {
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
      <NavigationLayout
        config={configNavigation}
        defaultTitle="Mantenimiento"
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
