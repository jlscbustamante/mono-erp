import { EmptyModule } from '@/components/empty-module'
import Layout, { gm, MenuOption, MenuSeparator } from '@/components/layout'
import { appConfig } from '@/const/config'
import { PATHS } from '@/const/paths'
import { useMemo } from 'react'
import { useOutlet } from 'react-router'
import { useSession } from '../../use-session'

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Empleado', PATHS.erp.modulos.recursosHumanos.empleado),
  gm('Asistencia', PATHS.erp.modulos.recursosHumanos.asistencia),
  gm('Cargos', PATHS.erp.modulos.recursosHumanos.cargos),
]

export const RecursosHumanosLayout = () => {
  const outlet = useOutlet()
  const views = useSession((st) => st.user.views)

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
    <>
      <Layout>
        <Layout.Header defaultTitle="RR.HH" />
        <Layout.Sidebar
          options={appConfig.ui.fullAccess ? menu : authorizedViews}
        />
        <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
      </Layout>
    </>
  )
}
