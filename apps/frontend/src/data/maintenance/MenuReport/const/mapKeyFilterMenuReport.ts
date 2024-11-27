import { IReport } from '@/data/reports/types'
import { OpFilter } from '@/data/types/Filters'

export const mapKeyFilterMenuReport = (key: keyof IReport): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'rpt_name':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'rpt_url':
      return [OpFilter.Equal]
    case 'rpt_token':
      return [OpFilter.Equal]
    case 'key_report':
      return [OpFilter.Equal]
    case 'key_workspc':
      return [OpFilter.Equal]
    case 'priority':
      return [OpFilter.Equal]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validMenuReport = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'rpt_name',
      label: 'Nombre del Reporte',
    },
    {
      key: 'rpt_url',
      label: 'URL',
    },
    {
      key: 'rpt_token',
      label: 'Token',
    },
    {
      key: 'key_report',
      label: 'Key Report',
    },
    {
      key: 'key_workspc',
      label: 'Key Workspace',
    },
    {
      key: 'priority',
      label: 'Prioridad',
    },
    {
      key: 'showIn',
      label: 'Mostrar',
    },
    {
      key: 'created_at',
      label: 'Fecha de creacion',
    },
  ]
}
