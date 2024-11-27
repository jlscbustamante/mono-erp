import { useEffect, useState } from 'react'
import { BiPurchaseTagAlt } from 'react-icons/bi'
import { FaBalanceScale, FaUserTie } from 'react-icons/fa'
import { FaLayerGroup, FaListCheck } from 'react-icons/fa6'
import { FiBox } from 'react-icons/fi'
import { IoStorefrontOutline } from 'react-icons/io5'
import { LiaShippingFastSolid, LiaWarehouseSolid } from 'react-icons/lia'
import { MdAltRoute, MdOutlineCategory } from 'react-icons/md'
import { TbPackages, TbReportAnalytics, TbRulerMeasure } from 'react-icons/tb'
import { VscGroupByRefType, VscSettings } from 'react-icons/vsc'
import { useOutlet } from 'react-router-dom'

import { ITEM } from '@/const/localStorageItems'
import { PATHS } from '@/router/paths'

import { LuTruck } from 'react-icons/lu'
import { RiCoinsLine } from 'react-icons/ri'
import { ProductProvider } from './ContextProduct'
import { MenuConfig, MenuLayout, MenuList } from './MenuLayout'
import { NavigationLayout } from './NavigationLayout'
const userPermission = JSON.parse(
  localStorage.getItem(ITEM.USER_PERMISSION) || '{}',
)

// const moduleNameToFind = 'Mercadería'

const permissions = userPermission?.permissions

if (permissions) {
  // const moduleData = permissions.find(
  //   (permission: { module_name: string }) =>
  //     permission.module_name === moduleNameToFind,
  // )
  // if (moduleData) {
  //   functionNames = moduleData.function_ids.map(
  //     (functionId: { menu: any }) => functionId.menu,
  //   )
  // }
}

const menuOptions: MenuList = [
  {
    type: 'option',
    key: 'key-group-dispatch',
    label: 'Despacho tiendas',
    icon: <LiaShippingFastSolid />,
    children: [
      {
        type: 'option',
        key: PATHS.products.dispatchItem,
        label: 'Despacho de almacén',
        icon: <LiaWarehouseSolid />,
        config: {
          title: 'Despacho de almacén',
        },
      },
      {
        type: 'option',
        key: PATHS.products.dispatchBetweenStores,
        label: 'Despacho entre tiendas',
        icon: <IoStorefrontOutline />,
        config: {
          title: 'Despacho de almacén',
        },
      },
      {
        type: 'option',
        key: PATHS.products.dispatchByRoutes,
        label: 'Despacho por ruta',
        icon: <MdAltRoute />,
        config: {
          title: 'Despacho de almacén',
        },
      },
      {
        type: 'option',
        key: PATHS.products.dispatchConsolidated,
        label: 'Despacho consolidado',
        icon: <FaLayerGroup />,
        config: {
          title: 'Despacho de almacén',
        },
      },
    ],
  },
  {
    key: PATHS.products.pruchaseItem,
    type: 'option',
    label: 'Compra mercadería',
    icon: <BiPurchaseTagAlt />,
  },
  {
    type: 'option',
    key: 'key-group-invt',
    label: 'Reportes de inventario',
    icon: <TbReportAnalytics />,
    children: [
      {
        key: PATHS.products.report.inventoryByWarehouse,
        type: 'option',
        label: 'Inventario por almacén',
      },
      // {
      //   key: PATHS.products.report.byWeek,
      //   type: 'option',
      //   label: 'Consumo semanal',
      // },
      {
        key: PATHS.products.report.ratio,
        type: 'option',
        label: 'Ratio de inventario',
      },
    ],
  },

  {
    type: 'divider',
  },
  {
    type: 'option',
    key: PATHS.products.products,
    label: 'Productos',
    icon: <FiBox />,
    config: {
      title: 'Productos',
    },
  },
  {
    type: 'option',
    key: PATHS.products.productItem,
    label: 'Items de inventario',
    icon: <TbPackages />,
    config: {
      title: 'Items de inventario',
    },
  },

  {
    type: 'option',
    key: PATHS.products.priceList,
    label: 'Lista de precios',
    icon: <RiCoinsLine />,
    config: {
      title: 'Lista de precios',
    },
  },

  {
    type: 'divider',
  },
  {
    key: PATHS.products.warehouse,
    type: 'option',
    label: 'Almacén y tiendas',
    icon: <LiaWarehouseSolid />,
    config: {
      title: 'Almacén',
    },
  },
  {
    type: 'option',
    key: PATHS.products.providers,
    label: 'Proveedores',
    icon: <FaUserTie />,
    config: {
      title: 'Proveedores',
    },
  },

  {
    type: 'option',
    key: PATHS.products.routes,
    label: 'Rutas de despacho',
    icon: <VscGroupByRefType />,
    config: {
      title: 'Rutas de despacho',
    },
  },
  {
    type: 'option',
    key: PATHS.products.driver,
    label: 'Transportista',
    icon: <LuTruck />,
    config: {
      title: 'Transportista',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'option',
    key: 'key-group-man',
    label: 'Mantenimiento',
    icon: <VscSettings />,
    children: [
      {
        type: 'option',
        key: PATHS.products.maintenance.brand,
        label: 'Marca',
        icon: <span className="font-bold text-center">M</span>,
        config: {
          title: 'Marca',
        },
      },
      {
        type: 'option',
        key: PATHS.products.maintenance.category,
        label: 'Categoría',
        icon: <MdOutlineCategory />,
        config: {
          title: 'Categoría',
        },
      },
      {
        type: 'option',
        key: PATHS.products.maintenance.presentation,
        label: 'Presentación',
        icon: <span className="font-bold text-center">P</span>,
        config: {
          title: 'Presentación',
        },
      },
      {
        type: 'option',
        key: PATHS.products.maintenance.unit,
        label: 'Unidad de medida',
        icon: <TbRulerMeasure />,
        config: {
          title: 'Unidada de medida',
        },
      },
      {
        type: 'option',
        key: PATHS.products.maintenance.equivalence,
        label: 'Equivalencia',
        icon: <FaBalanceScale />,
        config: {
          title: 'Equivalencia',
        },
      },
      {
        key: PATHS.products.templates,
        type: 'option',
        label: 'Plantillas',
        icon: <FaListCheck />,
        config: {
          title: 'Plantillas',
        },
      },
    ],
  },
  {
    type: 'divider',
  },
]
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function ProductLayout() {
  const [, setShowSelectItemMessage] = useState(true)
  const outlet = useOutlet()
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
      <NavigationLayout config={configNavigation} defaultTitle="Mercadería" />
      <MenuLayout
        // items={filteredMenuOptions}
        items={menuOptions}
        onChangeConfig={(config) => setConfigNavigation(config)}
      />
      <div className="overflow-y-auto requestes-layout__content">
        <div>
          {!outlet && (
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
        {/* <Outlet /> */}
        {outlet && <ProductProvider>{outlet}</ProductProvider>}
      </div>
    </div>
  )
}
