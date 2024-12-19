import { NotFound } from '@/app/404'
import { OtpLoginPage } from '@/app/erp/auth/otp-login'
import { ErpLayout } from '@/app/erp/layout'
import { DigitalizacionLayout } from '@/app/erp/modules/digitalizacion/layout'
import { MantenimientoLayout } from '@/app/erp/modules/mantenimiento/layout'
import { MercaderiaLayout } from '@/app/erp/modules/mercaderia/layout'
import { AsistenciaPage } from '@/app/erp/modules/recursosHumanos/asistencia'
import { EmpleadoPage } from '@/app/erp/modules/recursosHumanos/empleado'
import { JobsTitlePage } from '@/app/erp/modules/recursosHumanos/jobs-title'
import { RecursosHumanosLayout } from '@/app/erp/modules/recursosHumanos/layout'
import { RequerimientosLayout } from '@/app/erp/modules/requerimientos/layout'
import { SeguridadLayout } from '@/app/erp/modules/seguridad/layout'
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
import Approved from '@/views/requests/Approved'
import BalanceCostCenter from '@/views/requests/balances/CostCenter'
import DetailedBalance from '@/views/requests/balances/Detailed'
import SummarizedBalance from '@/views/requests/balances/Summarized'
import Rejected from '@/views/requests/Rejected'
import Requested from '@/views/requests/Requested'
import GetIamRole from '@/views/security/Get/GetIamRole'
import GetIamUser from '@/views/security/Get/GetIamUser'
import PaymentMethods from '@/views/stores/PaymentMethods'
import SignMovements from '@/views/stores/SignMovements'
import StoresStates from '@/views/stores/States'
import { createBrowserRouter } from 'react-router-dom'

export const routerv2 = createBrowserRouter([
  {
    path: '/',
    element: <ErpLayout />,
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
            path: PATHS.erp.modulos.requerimientos.main,
            element: <RequerimientosLayout />,
            children: [
              {
                path: PATHS.erp.modulos.requerimientos.solicitados,
                element: <Requested />,
              },
              {
                path: PATHS.erp.modulos.requerimientos.aprobados,
                element: <Approved />,
              },
              {
                path: PATHS.erp.modulos.requerimientos.rechazados,
                element: <Rejected />,
              },
              {
                path: PATHS.erp.modulos.requerimientos.reportes.main,
                children: [
                  {
                    path: PATHS.erp.modulos.requerimientos.reportes.detallado,
                    element: <DetailedBalance />,
                  },
                  {
                    path: PATHS.erp.modulos.requerimientos.reportes.resumido,
                    element: <SummarizedBalance />,
                  },
                  {
                    path: PATHS.erp.modulos.requerimientos.reportes
                      .porCentroCosto,
                    element: <BalanceCostCenter />,
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
                path: PATHS.erp.modulos.mercaderia.compra,
                element: <Purchase />,
              },

              {
                path: PATHS.erp.modulos.mercaderia.reportes.main,
                children: [
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
