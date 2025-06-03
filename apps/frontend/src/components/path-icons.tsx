import { PATHS } from '@/const/paths'
import { LucideIcon } from 'lucide-react'
import {
  AiFillBank,
  AiFillDollarCircle,
  AiOutlineMenuUnfold,
} from 'react-icons/ai'
import {
  BiPurchaseTagAlt,
  BiSolidCategoryAlt,
  BiSolidPizza,
  BiSolidUser,
} from 'react-icons/bi'
import {
  BsCreditCard2Back,
  BsFileEarmarkDiff,
  BsTerminalFill,
} from 'react-icons/bs'
import {
  FaBalanceScale,
  FaCashRegister,
  FaFileInvoiceDollar,
  FaFileUpload,
  FaFilter,
  FaRegCalendarAlt,
} from 'react-icons/fa'
import {
  FaBoxesPacking,
  FaClipboardUser,
  FaLayerGroup,
  FaListCheck,
  FaUserTie,
} from 'react-icons/fa6'
import { FiBox } from 'react-icons/fi'
import { GiConfirmed, GiFullMotorcycleHelmet, GiTomato } from 'react-icons/gi'
import { IoIosCheckbox } from 'react-icons/io'
import {
  IoCalendarNumberOutline,
  IoCreateSharp,
  IoStorefrontOutline,
} from 'react-icons/io5'
import {
  LiaNetworkWiredSolid,
  LiaShippingFastSolid,
  LiaWarehouseSolid,
} from 'react-icons/lia'
import { IconType } from 'react-icons/lib'
import { LuCupSoda, LuSplitSquareVertical, LuTruck } from 'react-icons/lu'
import {
  MdAltRoute,
  MdCancelPresentation,
  MdDeliveryDining,
  MdOutlineCategory,
  MdOutlinePayment,
} from 'react-icons/md'
import { RiCoinLine } from 'react-icons/ri'
import {
  TbHierarchy3,
  TbPackages,
  TbReportAnalytics,
  TbReportSearch,
  TbRulerMeasure,
} from 'react-icons/tb'
import { TfiControlStop } from 'react-icons/tfi'
import {
  VscGroupByRefType,
  VscSettings,
  VscUngroupByRefType,
} from 'react-icons/vsc'

const listIcon: Record<string, IconType | LucideIcon | null> = {
  [PATHS.erp.modulos.mercaderia.despachos.main]: LiaShippingFastSolid,
  [PATHS.erp.modulos.mercaderia.despachos.deAlmacen]: LiaWarehouseSolid,
  [PATHS.erp.modulos.mercaderia.despachos.entreTiendas]: IoStorefrontOutline,
  [PATHS.erp.modulos.mercaderia.despachos.porRuta]: MdAltRoute,
  [PATHS.erp.modulos.mercaderia.despachos.consolidado]: FaLayerGroup,
  [PATHS.erp.modulos.mercaderia.compra]: BiPurchaseTagAlt,
  [PATHS.erp.modulos.mercaderia.reportes.main]: TbReportAnalytics,
  [PATHS.erp.modulos.mercaderia.reportes.porAlmacen]: null,
  [PATHS.erp.modulos.mercaderia.reportes.ratio]: null,
  [PATHS.erp.modulos.mercaderia.productos]: FiBox,
  [PATHS.erp.modulos.mercaderia.items]: TbPackages,
  [PATHS.erp.modulos.mercaderia.divider]: LuSplitSquareVertical,
  [PATHS.erp.modulos.mercaderia.precios]: RiCoinLine,
  [PATHS.erp.modulos.mercaderia.almacenes]: LiaWarehouseSolid,
  [PATHS.erp.modulos.mercaderia.proveedores]: FaUserTie,
  [PATHS.erp.modulos.mercaderia.rutasDespacho]: VscGroupByRefType,
  [PATHS.erp.modulos.mercaderia.transportistas]: LuTruck,
  [PATHS.erp.modulos.mercaderia.mantenimiento.main]: VscSettings,
  [PATHS.erp.modulos.mercaderia.mantenimiento.categorias]: MdOutlineCategory,
  [PATHS.erp.modulos.mercaderia.reportes.consultaDespachos]: null,
  [PATHS.erp.modulos.mercaderia.mantenimiento.unidades]: TbRulerMeasure,
  [PATHS.erp.modulos.mercaderia.mantenimiento.equivalencias]: FaBalanceScale,
  [PATHS.erp.modulos.mercaderia.mantenimiento.plantillas]: FaListCheck,
  [PATHS.erp.modulos.mercaderia.kardex]: FaBoxesPacking,
  [PATHS.erp.modulos.mercaderia.notaCredito]: FaFileInvoiceDollar,

  [PATHS.erp.modulos.tiendas.conciliar]: GiConfirmed,
  [PATHS.erp.modulos.tiendas.mediosPago]: BsCreditCard2Back,
  [PATHS.erp.modulos.tiendas.comprobarCajas]: BsFileEarmarkDiff,

  [PATHS.erp.modulos.requerimientos.solicitados]: IoIosCheckbox,
  [PATHS.erp.modulos.requerimientos.aprobados]: IoIosCheckbox,
  [PATHS.erp.modulos.requerimientos.rechazados]: MdCancelPresentation,
  [PATHS.erp.modulos.requerimientos.reportes.main]: TbReportSearch,
  [PATHS.erp.modulos.requerimientos.reportes.detallado]: null,
  [PATHS.erp.modulos.requerimientos.reportes.resumido]: null,
  [PATHS.erp.modulos.requerimientos.reportes.porCentroCosto]: null,
  [PATHS.erp.modulos.requerimientos.reportes.porFecha]: FaRegCalendarAlt,
  [PATHS.erp.modulos.requerimientos.reportes.cuentaCorriente]: null,
  [PATHS.erp.modulos.requerimientos.mantenimiento.main]: VscSettings,
  [PATHS.erp.modulos.requerimientos.mantenimiento.cashbank]: null,
  [PATHS.erp.modulos.requerimientos.mantenimiento.costCenter]: null,
  [PATHS.erp.modulos.requerimientos.mantenimiento.supplier]: null,
  [PATHS.erp.modulos.requerimientos.mantenimiento.category]: null,

  [PATHS.erp.modulos.digitalizacion.documentos]: GiConfirmed,
  [PATHS.erp.modulos.digitalizacion.escaneo]: FaFileUpload,
  [PATHS.erp.modulos.digitalizacion.metodosPagos.bancos]: MdOutlinePayment,
  [PATHS.erp.modulos.digitalizacion.metodosPagos.culqui]: MdOutlinePayment,
  [PATHS.erp.modulos.digitalizacion.metodosPagos.izipay]: MdOutlinePayment,

  [PATHS.erp.modulos.mantenimiento.categoria]: BiSolidCategoryAlt,
  [PATHS.erp.modulos.mantenimiento.cuentaCaja]: AiFillBank,
  [PATHS.erp.modulos.mantenimiento.centroCosto]: FaCashRegister,
  [PATHS.erp.modulos.mantenimiento.tipoCuenta]: AiFillDollarCircle,
  [PATHS.erp.modulos.mantenimiento.tipoCategoria]: VscUngroupByRefType,
  [PATHS.erp.modulos.mantenimiento.terminalPos]: BsTerminalFill,
  [PATHS.erp.modulos.mantenimiento.motorizados]: GiFullMotorcycleHelmet,
  [PATHS.erp.modulos.mantenimiento.menuReportes]: AiOutlineMenuUnfold,
  [PATHS.erp.modulos.mantenimiento.parametros]: FaFilter,

  [PATHS.erp.modulos.seguridad.roles]: TbHierarchy3,
  [PATHS.erp.modulos.seguridad.usuarios]: BiSolidUser,

  [PATHS.erp.modulos.recursosHumanos.empleado]: FaClipboardUser,
  [PATHS.erp.modulos.recursosHumanos.asistencia]: IoCalendarNumberOutline,
  [PATHS.erp.modulos.recursosHumanos.cargos]: LiaNetworkWiredSolid,
  [PATHS.erp.modulos.recursosHumanos.motorizados]: MdDeliveryDining,

  [PATHS.erp.modulos.recetas.main]: FaListCheck,
  [PATHS.erp.modulos.recetas.nuevaReceta]: IoCreateSharp,
  [PATHS.erp.modulos.recetas.productoFinal]: VscSettings,
  [PATHS.erp.modulos.recetas.nuevaRecetaColecciones]: BiSolidPizza,
  [PATHS.erp.modulos.recetas.producto]: GiTomato,
  [PATHS.erp.modulos.recetas.sabores]: LuCupSoda,
  [PATHS.erp.modulos.recetas.presentacionTamanio]: TbRulerMeasure,
}

export const PATH_ICONS = new Proxy(listIcon, {
  get: (obj, prop: string) => {
    if (prop in obj) return obj[prop]
    return TfiControlStop
  },
})
