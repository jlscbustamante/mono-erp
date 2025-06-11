import { NotFound } from '@/app/404'
import { OtpLoginPage } from '@/app/erp/auth/otp-login'
import { ErpLayout } from '@/app/erp/layout'
import { DigitalizacionLayout } from '@/app/erp/modules/digitalizacion/layout'
import { MantenimientoLayout } from '@/app/erp/modules/mantenimiento/layout'
import DispatchDivider from '@/app/erp/modules/mercaderia/dispatch-divider'
import { KardexPage } from '@/app/erp/modules/mercaderia/kardex'
import { MercaderiaLayout } from '@/app/erp/modules/mercaderia/layout'
import { NotaCreditoPage } from '@/app/erp/modules/mercaderia/nota-credito'
import { AnticipoGastosPage } from '@/app/erp/modules/pagos/anticipo-gastos'
import { AprobarPagosPage } from '@/app/erp/modules/pagos/aprobar-pagos'
import { RevisarOrdenPage } from '@/app/erp/modules/pagos/aprobar-pagos/revisar-orden'
import { ConfigPage } from '@/app/erp/modules/pagos/avanzado/config'
import { AvanzadoSeguridad } from '@/app/erp/modules/pagos/avanzado/seguridad'
import { ConsultaRequerimientoPage } from '@/app/erp/modules/pagos/consulta-requerimiento'
import { PagosLayout } from '@/app/erp/modules/pagos/layout'
import { ListaEsperaPage } from '@/app/erp/modules/pagos/lista-espera'
import { NuevoRequerimientoPage } from '@/app/erp/modules/pagos/nuevo-requerimiento'
import { ProgramarPagosPage } from '@/app/erp/modules/pagos/programar-pagos'
import { CreateOrderPage } from '@/app/erp/modules/pagos/programar-pagos/create-order'
import { ReporteCajaPage } from '@/app/erp/modules/pagos/reportes-caja'
import { ReviewPage } from '@/app/erp/modules/pagos/review'
import { ReviewNonDocPage } from '@/app/erp/modules/pagos/review_nondoc'
import { TransferenciaPage } from '@/app/erp/modules/pagos/transferencia'
import { RecetasLayout } from '@/app/erp/modules/recetas/layout'
import { NuevaRecetaTabs } from '@/app/erp/modules/recetas/nueva-receta'
import { ProductoFinal } from '@/app/erp/modules/recetas/producto-final'
import { AsistenciaPage } from '@/app/erp/modules/recursosHumanos/asistencia'
import { EmpleadoPage } from '@/app/erp/modules/recursosHumanos/empleado'
import { JobsTitlePage } from '@/app/erp/modules/recursosHumanos/jobs-title'
import { RecursosHumanosLayout } from '@/app/erp/modules/recursosHumanos/layout'
import CashBankPage from '@/app/erp/modules/requerimientos/mantenimiento/cashbank/page'
import CategoryPage from '@/app/erp/modules/requerimientos/mantenimiento/category/page'
import CostCenterPage from '@/app/erp/modules/requerimientos/mantenimiento/costCenter/page'
import { SeguridadLayout } from '@/app/erp/modules/seguridad/layout'
import { TestPage } from '@/app/erp/modules/test_page'
import { TiendasLayout } from '@/app/erp/modules/tiendas/layout'
import { PATHS } from '@/const/paths'
import { Login } from '@/views/auth/Login'
import PaymentBank from '@/views/digitization/PaymentBank'
import PaymentCulqi from '@/views/digitization/PaymentCulqi'
import UploadFilePayments from '@/views/digitization/PaymentsIzipay'
import RequestsDigitization from '@/views/digitization/requests'
import UploadToRequest from '@/views/digitization/UploadToRequest'
import CourierPage from '@/views/maintenance/Get/courier'
import GetCashAccount from '@/views/maintenance/Get/GetCashAccount'
import GetCategory from '@/views/maintenance/Get/GetCategory'
import GetCostCenter from '@/views/maintenance/Get/GetCostCenter'
import GetMenuReport from '@/views/maintenance/Get/GetMenuReport'
import GetParameters from '@/views/maintenance/Get/GetParameters'
import GetTerminalPost from '@/views/maintenance/Get/GetTerminalPost'
import GetTypeCashAccountType from '@/views/maintenance/Get/GetTypeCashAccount'
import GetTypeCategory from '@/views/maintenance/Get/GetTypeCategory'
import { Modules } from '@/views/Modules'
import Dispatch from '@/views/products/Dispatch'
import DispatchConsulta from '@/views/products/Dispatch-consulta'
import DispatchStoresPage from '@/views/products/dispatch-stores/page'
import { DispatchRoute } from '@/views/products/dispatch/dispatch-route/dispatch-route'
import { Driver } from '@/views/products/dispatch/driver/driver'
import { DispatchConsolidated } from '@/views/products/dispatch/dsispatch-consolidated/dispatch-consolidated'
import { Ratio } from '@/views/products/dispatch/ratio/ratio'
import { Routes } from '@/views/products/dispatch/route/route'
import { Warehouse } from '@/views/products/dispatch/warehouse/warehouse'
import BrandMaintenance from '@/views/products/maintenance/Brand'
import CategoryMaintenance from '@/views/products/maintenance/Category'
import EquivalanceMaintenance from '@/views/products/maintenance/Equivalence'
import PresentationMaintenance from '@/views/products/maintenance/Presentation'
import UnitMaintenance from '@/views/products/maintenance/Unit'
import { PriceListPage } from '@/views/products/price-list/price-list-page'
import ProductItemView from '@/views/products/ProductItem'
import Products from '@/views/products/Products'
import Provider from '@/views/products/provider/page'
import Purchase from '@/views/products/Purchase'
import Stock from '@/views/products/Stock'
import WarehouseStockPage from '@/views/products/stock/warehouse-stock/page'
import EditTemplate from '@/views/products/templates/edit/edit-template.page'
import TemplatePage from '@/views/products/templates/page'
import Reports from '@/views/reports/Reports'
import GetIamRole from '@/views/security/Get/GetIamRole'
import GetIamUser from '@/views/security/Get/GetIamUser'
import PaymentMethods from '@/views/stores/PaymentMethods'
import SignMovements from '@/views/stores/SignMovements'
import StoresStates from '@/views/stores/States'
import { Empty } from 'antd'
import { createBrowserRouter } from 'react-router-dom'

export const routerv2 = createBrowserRouter([
  {
    path: '/',
    element: <ErpLayout />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: PATHS.erp.main,
    element: <ErpLayout />,
    children: [
      {
        path: PATHS.erp.auth.main,
        element: <Login />,
      },
      {
        path: PATHS.erp.auth.otpLogin,
        element: <OtpLoginPage />,
      },
      {
        path: PATHS.erp.modulos.main,
        children: [
          {
            path: PATHS.erp.modulos.home,
            element: <Modules />,
          },
          {
            path: PATHS.erp.modulos.tiendas.main,
            element: <TiendasLayout />,
            children: [
              {
                path: PATHS.erp.modulos.tiendas.conciliar,
                element: <SignMovements />,
              },
              {
                path: PATHS.erp.modulos.tiendas.mediosPago,
                element: <PaymentMethods />,
              },
              {
                path: PATHS.erp.modulos.tiendas.comprobarCajas,
                element: <StoresStates />,
              },
            ],
          },
          {
            path: PATHS.erp.modulos.pagos.main,
            element: <PagosLayout />,
            children: [
              {
                path: PATHS.erp.modulos.pagos.revisar,
                element: <ReviewPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.revisarNonDoc,
                element: <ReviewNonDocPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.nuevoRequerimiento,
                element: <NuevoRequerimientoPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.listaEspera,
                element: <ListaEsperaPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.programarPagos.main,
                element: <ProgramarPagosPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.aprobarPagos.main,
                element: <AprobarPagosPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.programarPagos.crearOrden,
                element: <CreateOrderPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.aprobarPagos.revisarOrden,
                element: <RevisarOrdenPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.transferencia,
                element: <TransferenciaPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.anticipoGastos,
                element: <AnticipoGastosPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.consultaRequerimiento,
                element: <ConsultaRequerimientoPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.reporteCaja,
                element: <ReporteCajaPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.avanzado.config,
                element: <ConfigPage />,
              },
              {
                path: PATHS.erp.modulos.pagos.avanzado.seguridad,
                element: <AvanzadoSeguridad />,
              },
              {
                path: PATHS.erp.modulos.pagos.mantenimiento.main,
                children: [
                  {
                    path: PATHS.erp.modulos.pagos.mantenimiento.supplier,
                    element: <Provider />,
                  },
                  {
                    path: PATHS.erp.modulos.pagos.mantenimiento.costCenter,
                    element: <CostCenterPage />,
                  },
                  {
                    path: PATHS.erp.modulos.pagos.mantenimiento.category,
                    element: <CategoryPage />,
                  },
                  {
                    path: PATHS.erp.modulos.pagos.mantenimiento.cashbank,
                    element: <CashBankPage />,
                  },
                ],
              },
            ],
          },
          {
            path: PATHS.erp.modulos.mercaderia.main,
            element: <MercaderiaLayout />,
            children: [
              {
                path: PATHS.erp.modulos.mercaderia.despachos.main,
                children: [
                  {
                    path: PATHS.erp.modulos.mercaderia.despachos.deAlmacen,
                    element: <Dispatch />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.despachos.entreTiendas,
                    element: <DispatchStoresPage />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.despachos.porRuta,
                    element: <DispatchRoute />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.despachos.consolidado,
                    element: <DispatchConsolidated />,
                  },
                ],
              },
              {
                path: PATHS.erp.modulos.mercaderia.divider,
                element: <DispatchDivider />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.notaCredito,
                element: <NotaCreditoPage />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.compra,
                element: <Purchase />,
              },

              {
                path: PATHS.erp.modulos.mercaderia.reportes.main,
                children: [
                  {
                    path: PATHS.erp.modulos.mercaderia.reportes
                      .consultaDespachos,
                    element: <DispatchConsulta />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.reportes.porAlmacen,
                    element: <Stock />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.reportes.ratio,
                    element: <Ratio />,
                  },
                ],
              },
              {
                path: PATHS.erp.modulos.mercaderia.kardex,
                element: <KardexPage />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.productos,
                element: <Products />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.items,
                element: <ProductItemView />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.precios,
                element: <PriceListPage />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.almacenes,
                element: <Warehouse />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.proveedores,
                element: <Provider />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.rutasDespacho,
                element: <Routes />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.transportistas,
                element: <Driver />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.stockAlmacen,
                element: <WarehouseStockPage />,
              },
              {
                path: PATHS.erp.modulos.mercaderia.mantenimiento.main,
                children: [
                  {
                    path: PATHS.erp.modulos.mercaderia.mantenimiento.marcas,
                    element: <BrandMaintenance />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.mantenimiento.categorias,
                    element: <CategoryMaintenance />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.mantenimiento
                      .presentacion,
                    element: <PresentationMaintenance />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.mantenimiento.unidades,
                    element: <UnitMaintenance />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.mantenimiento
                      .equivalencias,
                    element: <EquivalanceMaintenance />,
                  },
                  {
                    path: PATHS.erp.modulos.mercaderia.mantenimiento.plantillas,
                    element: <TemplatePage />,
                  },

                  {
                    path: `${PATHS.erp.modulos.mercaderia.mantenimiento.plantillas}/:id`,
                    element: <EditTemplate />,
                  },
                ],
              },
            ],
          },
          {
            path: PATHS.erp.modulos.digitalizacion.main,
            element: <DigitalizacionLayout />,
            children: [
              {
                path: PATHS.erp.modulos.digitalizacion.documentos,
                element: <RequestsDigitization />,
              },
              {
                path: PATHS.erp.modulos.digitalizacion.escaneo,
                element: <UploadToRequest />,
              },
              {
                path: PATHS.erp.modulos.digitalizacion.metodosPagos.main,
                children: [
                  {
                    path: PATHS.erp.modulos.digitalizacion.metodosPagos.izipay,
                    element: <UploadFilePayments />,
                  },
                  {
                    path: PATHS.erp.modulos.digitalizacion.metodosPagos.culqui,
                    element: <PaymentCulqi />,
                  },
                  {
                    path: PATHS.erp.modulos.digitalizacion.metodosPagos.bancos,
                    element: <PaymentBank />,
                  },
                ],
              },
            ],
          },
          {
            path: PATHS.erp.modulos.reportes.main,
            element: <Reports />,
          },
          {
            path: PATHS.erp.modulos.mantenimiento.main,
            element: <MantenimientoLayout />,
            children: [
              {
                path: PATHS.erp.modulos.mantenimiento.categoria,
                element: <GetCategory />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.cuentaCaja,
                element: <GetCashAccount />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.centroCosto,
                element: <GetCostCenter />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.tipoCuenta,
                element: <GetTypeCashAccountType />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.tipoCategoria,
                element: <GetTypeCategory />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.terminalPos,
                element: <GetTerminalPost />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.motorizados,
                element: <CourierPage />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.menuReportes,
                element: <GetMenuReport />,
              },
              {
                path: PATHS.erp.modulos.mantenimiento.parametros,
                element: <GetParameters />,
              },
            ],
          },
          {
            path: PATHS.erp.modulos.seguridad.main,
            element: <SeguridadLayout />,
            children: [
              {
                path: PATHS.erp.modulos.seguridad.roles,
                element: <GetIamRole />,
              },
              {
                path: PATHS.erp.modulos.seguridad.usuarios,
                element: <GetIamUser />,
              },
            ],
          },
          {
            path: PATHS.erp.modulos.recursosHumanos.main,
            element: <RecursosHumanosLayout />,
            children: [
              {
                path: PATHS.erp.modulos.recursosHumanos.empleado,
                element: <EmpleadoPage motorizadPage={false} key={'no-moto'} />,
              },
              {
                path: PATHS.erp.modulos.recursosHumanos.asistencia,
                element: <AsistenciaPage />,
              },
              {
                path: PATHS.erp.modulos.recursosHumanos.cargos,
                element: <JobsTitlePage />,
              },
              {
                path: PATHS.erp.modulos.recursosHumanos.motorizados,
                // element: <MotorizadosPage />,
                element: <EmpleadoPage motorizadPage={true} key={'moto'} />,
              },
            ],
          },
          {
            path: PATHS.erp.modulos.recetas.main,
            element: <RecetasLayout />,
            children: [
              {
                path: PATHS.erp.modulos.recetas.nuevaReceta,
                element: <NuevaRecetaTabs />,
              },
              {
                path: PATHS.erp.modulos.recetas.productoFinal,
                element: <ProductoFinal />,
              },
              {
                path: PATHS.erp.modulos.recetas.nuevaRecetaColecciones,
                element: <Empty />,
              },
              {
                path: PATHS.erp.modulos.recetas.producto,
                element: <Empty />,
              },
              {
                path: PATHS.erp.modulos.recetas.sabores,
                element: <Empty />,
              },
              {
                path: PATHS.erp.modulos.recetas.presentacionTamanio,
                element: <Empty />,
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   path: PATHS.erp.modulos.mercaderia.stockAlmacen,
  //   element: <WarehouseStockPage />,
  // },
  {
    path: '*',
    element: <NotFound />,
  },
])
