import { EmptyModule } from '@/components/empty-module'
import Layout, { gm, MenuOption, MenuSeparator } from '@/components/layout'
import { PATHS } from '@/const/paths'
import { useOutlet } from 'react-router'
const menu: (MenuOption | MenuSeparator)[] = [
  gm('Roles', PATHS.erp.modulos.seguridad.roles),
  gm('Usuario', PATHS.erp.modulos.seguridad.usuarios),
]

export const SeguridadLayout = () => {
  const outlet = useOutlet()
  return (
    <Layout>
      <Layout.Header defaultTitle="Seguridad" />
      <Layout.Sidebar options={menu} />
      <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
    </Layout>
  )
}
