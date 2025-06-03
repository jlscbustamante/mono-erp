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
  gm('Nueva receta', PATHS.erp.modulos.recetas.nuevaReceta),
  separator(),
  gm('Recetas de producto final', PATHS.erp.modulos.recetas.productoFinal),
  separator(),
  gm(
    'Recetas de colecciones',
    PATHS.erp.modulos.recetas.nuevaRecetaColecciones,
  ),
  gm('Catálogo de producto', PATHS.erp.modulos.recetas.producto),
  separator(),
  gm('Sabores', PATHS.erp.modulos.recetas.sabores),
  separator(),
  gm('Presentación o tamaño', PATHS.erp.modulos.recetas.presentacionTamanio),
  separator(),
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
