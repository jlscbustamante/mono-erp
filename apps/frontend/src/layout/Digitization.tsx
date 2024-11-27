import { useEffect, useState } from 'react'
import { FaFileUpload } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { MdOutlinePayment } from 'react-icons/md'
import { Outlet } from 'react-router-dom'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/router/paths'

import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'
const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

const moduleNameToFind = 'Digitalización'

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
    key: PATHS.digitization.requests,
    label: 'Documentos',
    icon: <GiConfirmed />,
  },
  {
    type: 'option',
    key: PATHS.digitization.uploadToRequest,
    label: 'Subir documento a requerimientos',
    icon: <FaFileUpload />,
    config: {
      title: 'Subir documento a requerimientos',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'option',
    key: PATHS.digitization.payments,
    label: 'Metodos de pago Izipay',
    icon: <MdOutlinePayment />,
    config: {
      title: 'Documentos Izipay',
    },
  },
  {
    type: 'option',
    key: PATHS.digitization.paymentCulqi,
    label: 'Metodos de pago Culqi',
    icon: <MdOutlinePayment />,
    config: {
      title: 'Documentos Culqi',
    },
  },
  {
    type: 'option',
    key: PATHS.digitization.paymentBank,
    label: 'Bancos',
    icon: <MdOutlinePayment />,
    config: {
      title: 'Documentos de Banco',
    },
  },
  {
    type: 'divider',
  },
]
const modifyMenuOptions = (menuOptions: MenuList): MenuList => {
  return menuOptions.map((el) => {
    if (el.type == 'option') {
      if (el.label == 'Subir documento a requerimientos') {
        return { ...el, label: 'Escanear requerimientos' }
      }
      if (el.label == 'Documentos') {
        return { ...el, label: 'Documentos escaneados' }
      }
    }
    return el
  })
}

const filteredMenuOptions = config.allowViewAll
  ? modifyMenuOptions(menuOptions)
  : modifyMenuOptions(
      menuOptions.filter(
        (option) =>
          option.type !== 'option' ||
          (typeof option.label === 'string' &&
            functionNames.includes(option.label)),
      ),
    )

export default function DigitizationLayout() {
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
        defaultTitle="Digitalización"
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
