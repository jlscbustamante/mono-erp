import { EmptyModule } from '@/components/empty-module'
import Layout, {
  gm,
  MenuOption,
  MenuSeparator,
  separator,
} from '@/components/layout'
import { PATHS } from '@/const/paths'
import { useOutlet } from 'react-router'

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
  const outlet = useOutlet()
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
      <Layout.Sidebar options={menu} />
      <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
    </Layout>
  )
}
