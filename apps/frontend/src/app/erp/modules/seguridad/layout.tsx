import { EmptyModule } from '@/components/empty-module'
import Layout, { gm, MenuOption, MenuSeparator } from '@/components/layout'
import { PATHS } from '@/const/paths'
import { useMemo } from 'react'
import { useOutlet } from 'react-router'
import { useSession } from '../../use-session'
const menu: (MenuOption | MenuSeparator)[] = [
  gm('Roles', PATHS.erp.modulos.seguridad.roles),
  gm('Usuario', PATHS.erp.modulos.seguridad.usuarios),
]

export const SeguridadLayout = () => {
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
      <Layout.Header defaultTitle="Seguridad" />
      <Layout.Sidebar options={authorizedViews} />
      <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
    </Layout>
  )
}
