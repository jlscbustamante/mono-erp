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
  FaFileUpload,
  FaFilter,
} from 'react-icons/fa'
import {
  FaClipboardUser,
  FaLayerGroup,
  FaListCheck,
  FaUserTie,
} from 'react-icons/fa6'
import { FiBox } from 'react-icons/fi'
import { GiConfirmed, GiFullMotorcycleHelmet } from 'react-icons/gi'
import { IoIosCheckbox } from 'react-icons/io'
import { IoCalendarNumberOutline, IoStorefrontOutline } from 'react-icons/io5'
import {
  LiaNetworkWiredSolid,
  LiaShippingFastSolid,
  LiaWarehouseSolid,
} from 'react-icons/lia'
import { IconType } from 'react-icons/lib'
import { LuTruck } from 'react-icons/lu'
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
  TbReport,
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
  [PATHS.erp.modulos.mercaderia.kardex]: TbReport,

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
}

export const PATH_ICONS = new Proxy(listIcon, {
  get: (obj, prop: string) => {
    if (prop in obj) return obj[prop]
    return TfiControlStop
  },
})
