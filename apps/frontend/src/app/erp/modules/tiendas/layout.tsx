import { EmptyModule } from '@/components/empty-module'
import Layout, { MenuOption, MenuSeparator, gm } from '@/components/layout'
import { PATHS } from '@/const/paths'
import { useOutlet } from 'react-router'

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Conciliar Tiendas', PATHS.erp.modulos.tiendas.conciliar),
  gm('Conciliar medios de pago', PATHS.erp.modulos.tiendas.mediosPago),
  gm('Comprobar cajas', PATHS.erp.modulos.tiendas.comprobarCajas),
]

export const TiendasLayout = () => {
  const outlet = useOutlet()
  return (
    <>
      <Layout>
        <Layout.Header defaultTitle="Tiendas" />
        <Layout.Sidebar options={menu} />
        <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
      </Layout>
    </>
  )
}
