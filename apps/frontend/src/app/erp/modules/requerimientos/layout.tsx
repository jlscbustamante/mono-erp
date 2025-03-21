import { EmptyModule } from '@/components/empty-module'
import Layout, {
  gm,
  MenuOption,
  MenuSeparator,
  separator,
} from '@/components/layout'
import { appConfig } from '@/const/config'
import { PATHS } from '@/const/paths'
import { useMemo } from 'react'
import { useOutlet } from 'react-router'
import { useSession } from '../../use-session'

// import * as sdk from '@/data/resources/sdk'

const menu: (MenuOption | MenuSeparator)[] = [
  {
    type: 'option',
    label: 'Requerimiento',
    path: PATHS.erp.modulos.requerimientos.reviewApproved,
    hide: true,
    icon: null,
  },
  {
    type: 'option',
    label: 'Requerimiento',
    path: PATHS.erp.modulos.requerimientos.reviewRejected,
    hide: true,
    icon: null,
  },
  {
    type: 'option',
    label: 'Requerimiento',
    path: PATHS.erp.modulos.requerimientos.review,
    hide: true,
    icon: null,
  },
  {
    type: 'option',
    label: 'Nuevo requerimiento',
    path: PATHS.erp.modulos.requerimientos.creation,
    icon: null,
    hide: true,
  },
  gm('Solicitados', PATHS.erp.modulos.requerimientos.solicitados),
  gm('Pagados', PATHS.erp.modulos.requerimientos.aprobados),
  gm('Rechazados', PATHS.erp.modulos.requerimientos.rechazados),
  separator(),
  gm(
    'Consulta de movimientos',
    PATHS.erp.modulos.requerimientos.reportes.main,
    [
      gm(
        'Cuenta corriente por proveedor',
        PATHS.erp.modulos.requerimientos.reportes.cuentaCorriente,
      ),
      gm(
        'Estado de cuenta caja y bancos',
        PATHS.erp.modulos.requerimientos.reportes.detallado,
      ),
      // gm(
      //   'Movimientos por centro de costo',
      //   PATHS.erp.modulos.requerimientos.reportes.porCentroCosto,
      // ),
      gm(
        'Resumen movimientos por fecha',
        PATHS.erp.modulos.requerimientos.reportes.resumido,
      ),
    ],
  ),
  gm('Mantenimiento', PATHS.erp.modulos.requerimientos.mantenimiento.main, [
    gm('Proveedor', PATHS.erp.modulos.requerimientos.mantenimiento.supplier),
    gm('Caja y banco', PATHS.erp.modulos.requerimientos.mantenimiento.cashbank),
    gm(
      'Centro de costo',
      PATHS.erp.modulos.requerimientos.mantenimiento.costCenter,
    ),
  ]),
]

export const RequerimientosLayout = () => {
  const views = useSession((st) => st.user.views)
  const outlet = useOutlet()

  const authorizedViews = useMemo(
    () =>
      menu
        .map((el) => {
          if (el.type == 'separator') return el
          else {
            if (views.includes(el.path)) {
              return el
            } else {
              if (el.children) {
                const childrens = el.children.filter((child) =>
                  views.includes(child.path),
                )
                if (childrens.length > 0) {
                  return {
                    ...el,
                    children: childrens,
                  }
                } else {
                  return null
                }
              } else {
                return null
              }
            }
          }
        })
        .filter((el) => el) as (MenuOption | MenuSeparator)[],
    [views],
  )

  return (
    <Layout className="">
      <Layout.Header
        defaultTitle="Requerimientos"
        classNameByPath={{
          [PATHS.erp.modulos.requerimientos.solicitados]:
            'bg-yellow-200 text-black',
          [PATHS.erp.modulos.requerimientos.aprobados]: 'bg-lime-500',
          [PATHS.erp.modulos.requerimientos.rechazados]: 'bg-red-500',
          [PATHS.erp.modulos.requerimientos.creation]:
            'bg-yellow-200 text-black',
          [PATHS.erp.modulos.requerimientos.review]: 'bg-yellow-200 text-black',
          [PATHS.erp.modulos.requerimientos.reviewApproved]:
            'bg-lime-500 text-white',
          [PATHS.erp.modulos.requerimientos.reviewRejected]:
            'bg-red-500 text-white',
        }}
      />
      <Layout.Sidebar
        options={appConfig.ui.fullAccess ? menu : authorizedViews}
      />
      <Layout.Content className="">
        {outlet ? outlet : <EmptyModule />}
      </Layout.Content>
    </Layout>
  )
}
