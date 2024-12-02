import { EmptyModule } from '@/components/empty-module'
import Layout, {
  gm,
  MenuOption,
  MenuSeparator,
  separator,
} from '@/components/layout'
import { PATHS } from '@/const/paths'
import { useMemo } from 'react'
import { useOutlet } from 'react-router'
import { useSession } from '../../use-session'

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Documentos escaneados', PATHS.erp.modulos.digitalizacion.documentos),
  gm('Escanear requerimientos', PATHS.erp.modulos.digitalizacion.escaneo),
  separator(),
  gm(
    'Metodos de pago Izipay',
    PATHS.erp.modulos.digitalizacion.metodosPagos.izipay,
  ),
  gm(
    'Metodos de pago Culqui',
    PATHS.erp.modulos.digitalizacion.metodosPagos.culqui,
  ),
  gm('Bancos', PATHS.erp.modulos.digitalizacion.metodosPagos.bancos),
]

export const DigitalizacionLayout = () => {
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
      <Layout.Header defaultTitle="Digitalización" />
      <Layout.Sidebar options={authorizedViews} />
      <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
    </Layout>
  )
}
