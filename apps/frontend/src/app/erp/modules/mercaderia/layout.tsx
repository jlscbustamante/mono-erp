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
  gm('Despacho tiendas', PATHS.erp.modulos.mercaderia.despachos.main, [
    gm('Despacho de almacén', PATHS.erp.modulos.mercaderia.despachos.deAlmacen),
    gm(
      'Despachos entre tiendas',
      PATHS.erp.modulos.mercaderia.despachos.entreTiendas,
    ),
    gm('Despachos por ruta', PATHS.erp.modulos.mercaderia.despachos.porRuta),
    gm(
      'Despachos consolidado',
      PATHS.erp.modulos.mercaderia.despachos.consolidado,
    ),
  ]),
  gm('Compra mercadería', PATHS.erp.modulos.mercaderia.compra),
  gm('Reportes de inventario', PATHS.erp.modulos.mercaderia.reportes.main, [
    gm(
      'Inventario por almacén',
      PATHS.erp.modulos.mercaderia.reportes.porAlmacen,
    ),
    gm('Ratio de inventario', PATHS.erp.modulos.mercaderia.reportes.ratio),
  ]),
  separator(),
  gm('Productos', PATHS.erp.modulos.mercaderia.productos),
  gm('Items', PATHS.erp.modulos.mercaderia.items),
  gm('Lista de precios', PATHS.erp.modulos.mercaderia.precios),
  separator(),
  gm('Almacén y tiendas', PATHS.erp.modulos.mercaderia.almacenes),
  gm('Proveedores', PATHS.erp.modulos.mercaderia.proveedores),
  gm('Rutas de despacho', PATHS.erp.modulos.mercaderia.rutasDespacho),
  gm('Transportistas', PATHS.erp.modulos.mercaderia.transportistas),
  separator(),
  gm('Mantenimiento', PATHS.erp.modulos.mercaderia.mantenimiento.main, [
    gm('Marca', PATHS.erp.modulos.mercaderia.mantenimiento.marcas),
    gm('Categoría', PATHS.erp.modulos.mercaderia.mantenimiento.categorias),
    gm('Presentación', PATHS.erp.modulos.mercaderia.mantenimiento.presentacion),
    gm('Unidad de medida', PATHS.erp.modulos.mercaderia.mantenimiento.unidades),
    gm(
      'Equivalencia',
      PATHS.erp.modulos.mercaderia.mantenimiento.equivalencias,
    ),
    gm('Plantillas', PATHS.erp.modulos.mercaderia.mantenimiento.plantillas),
  ]),
]

export const MercaderiaLayout = () => {
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
        <Layout.Header defaultTitle="Mercadería" />
        <Layout.Sidebar options={authorizedViews} />
        <Layout.Content>{outlet ? outlet : <EmptyModule />}</Layout.Content>
      </Layout>
    </>
  )
}
