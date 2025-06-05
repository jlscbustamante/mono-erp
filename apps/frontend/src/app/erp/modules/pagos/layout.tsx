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

// import * as sdk from '@/data/resources/sdk'

const menu: (MenuOption | MenuSeparator)[] = [
  gm('Nuevo requerimiento', PATHS.erp.modulos.pagos.nuevoRequerimiento),
  separator(),
  gm('Lista de espera', PATHS.erp.modulos.pagos.listaEspera),
  gm('Programar pagos', PATHS.erp.modulos.pagos.programarPagos.main),
  gm('Aprobar pagos', PATHS.erp.modulos.pagos.aprobarPagos.main),
  separator(),
  gm('Transferencia', PATHS.erp.modulos.pagos.transferencia),
  gm('Anticipo de gastos', PATHS.erp.modulos.pagos.anticipoGastos),
  separator(),
  gm(
    'Consulta de requerimiento',
    PATHS.erp.modulos.pagos.consultaRequerimiento,
  ),
  gm('Reportes de caja', PATHS.erp.modulos.pagos.reporteCaja),
  separator(),
  gm('Consulta de movimientos', PATHS.erp.modulos.pagos.reportes.main, [
    gm(
      'Cuenta corriente por proveedor',
      PATHS.erp.modulos.pagos.reportes.cuentaCorriente,
    ),
    gm(
      'Estado de cuenta caja y bancos',
      PATHS.erp.modulos.pagos.reportes.resumido,
    ),
    gm(
      'Movimientos por centro de costo',
      PATHS.erp.modulos.pagos.reportes.porCentroCosto,
    ),
    gm(
      'Resumen movimientos por fecha',
      PATHS.erp.modulos.pagos.reportes.porFecha,
    ),
  ]),
  gm('Mantenimiento', PATHS.erp.modulos.pagos.mantenimiento.main, [
    gm('Proveedores', PATHS.erp.modulos.pagos.mantenimiento.supplier),
    gm('Cajabanco', PATHS.erp.modulos.pagos.mantenimiento.cashbank),
    gm('Centro de costo', PATHS.erp.modulos.pagos.mantenimiento.costCenter),
    gm('Categoría', PATHS.erp.modulos.pagos.mantenimiento.category),
  ]),
  separator(),
  gm('Avanzado', PATHS.erp.modulos.pagos.avanzado.main, [
    // gm('Configuración', PATHS.erp.modulos.pagos.avanzado.config),
    gm('Seguridad', PATHS.erp.modulos.pagos.avanzado.seguridad),
  ]),
]

export const PagosLayout = () => {
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
    <Layout className="">
      <Layout.Header defaultTitle="Requerimientos" keepDefaultTitle={true} />
      <Layout.Sidebar
        options={appConfig.ui.fullAccess ? menu : authorizedViews}
      />
      <Layout.Content className="">
        {outlet ? outlet : <EmptyModule />}
      </Layout.Content>
    </Layout>
  )
}
