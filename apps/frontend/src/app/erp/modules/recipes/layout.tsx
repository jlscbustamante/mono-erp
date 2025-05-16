import { MenuOption, MenuSeparator, separator } from '@/components/layout'
import Layout, { gm } from '@/components/layout'
import { PATHS } from '@/const/paths'
import { useOutlet } from 'react-router'
import { useSession } from '../../use-session'
import { useMemo } from 'react'
import { EmptyModule } from '@/components/empty-module'
import { appConfig } from '@/const/config'

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Consulta receta', PATHS.erp.modulos.recetas.consultarReceta),
  gm('Registrar receta', PATHS.erp.modulos.recetas.crearReceta),
  separator(),
  gm('Mantenimiento', PATHS.erp.modulos.recetas.mantenimiento.main, [
    gm(
      'Receta base insumos',
      PATHS.erp.modulos.recetas.mantenimiento.RecetasBase,
    ),
    gm(
      'Sabores insumos',
      PATHS.erp.modulos.recetas.mantenimiento.RecetasPorSabor,
    ),
    gm('Insumos', PATHS.erp.modulos.recetas.mantenimiento.Insumos),
  ]),
  separator(),
  gm('Catálogo venta', PATHS.erp.modulos.recetas.catalogoVenta),
]

export const RecetasLayout = () => {
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
        <Layout.Header defaultTitle="Recetas" />
        <Layout.Sidebar
          options={appConfig.ui.fullAccess ? menu : authorizedViews}
        />
        <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
      </Layout>
    </>
  )
}
