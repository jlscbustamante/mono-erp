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

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Solicitados', PATHS.erp.modulos.requerimientos.solicitados),
  gm('Aprobados', PATHS.erp.modulos.requerimientos.aprobados),
  gm('Rechazados', PATHS.erp.modulos.requerimientos.rechazados),
  separator(),
  gm('Consultas de caja', PATHS.erp.modulos.requerimientos.reportes.main, [
    gm('Detallado', PATHS.erp.modulos.requerimientos.reportes.detallado),
    gm('Resumido', PATHS.erp.modulos.requerimientos.reportes.resumido),
    gm(
      'Por centro de costo',
      PATHS.erp.modulos.requerimientos.reportes.porCentroCosto,
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
    <Layout>
      <Layout.Header
        defaultTitle="Requerimientos"
        classNameByPath={{
          [PATHS.erp.modulos.requerimientos.solicitados]:
            'bg-yellow-200 text-black',
          [PATHS.erp.modulos.requerimientos.aprobados]: 'bg-lime-500',
          [PATHS.erp.modulos.requerimientos.rechazados]: 'bg-red-500',
        }}
      />
      <Layout.Sidebar
        options={appConfig.ui.fullAccess ? menu : authorizedViews}
      />
      <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
    </Layout>
  )
}
