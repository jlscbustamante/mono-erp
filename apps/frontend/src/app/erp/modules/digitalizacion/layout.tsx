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
  const outlet = useOutlet()
  return (
    <Layout>
      <Layout.Header
        defaultTitle="Digitalización"
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
