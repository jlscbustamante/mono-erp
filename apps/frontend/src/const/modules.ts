import { PATHS } from '@/router/paths'

export const modules = [
  {
    module: 'Caja de Tiendas',
    title: 'Caja de Tiendas',
    route: PATHS.stores._,
  },
  {
    module: 'Requerimientos',
    title: 'Requerimientos',
    route: PATHS.requests._,
  },
  {
    module: 'Mercadería',
    title: 'Mercadería',
    route: PATHS.products._,
  },
  {
    module: 'Digitalización',
    title: 'Digitalización',
    route: PATHS.digitization._,
  },
  {
    module: 'Banco',
    title: 'Banco',
    route: PATHS.bank._,
  },
  {
    module: 'Reportes',
    title: 'Reportes',
    route: PATHS.report._,
  },
  {
    module: 'Mantenimiento',
    title: 'Mantenimiento',
    route: PATHS.maintenance._,
  },
  {
    module: 'Seguridad',
    title: 'Seguridad',
    route: PATHS.security._,
  },
]
