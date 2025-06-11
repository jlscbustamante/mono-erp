import { safeAny } from './someAny'

export enum OpFilter {
  Equal = 'equal',
  NotEqual = 'notequal',
  Greater = 'greater',
  GreaterOrEqual = 'greaterorequal',
  Less = 'less',
  LessOrEqual = 'lessorequal',
  Contain = 'contain',
  In = 'in',
  EqualDate = 'equaldate',
  RangeDate = 'rangedate',
  Range = 'range',

  Select = 'select',
  SelectIn = 'selectin',
  IsNull = 'isnull',
  NotNull = 'notnull',
  Desc = 'desc',
  lastMonth = 'lastmonth',
  lastWeek = 'lastweek',
}
export type Filters<T> = {
  [key in keyof T]?: [OpFilter, ...safeAny[]]
}

export type Filters3<T> = {
  [key in keyof T]?: [OpFilter, ...safeAny[]] | Filters3<T[key]>
}

type ConfigPagination = {
  page: number
  lot: number
}

// type RelationInfoEntity<T> = {
//   [key in keyof T]?: boolean | RelationInfoEntity<T[key]>
// }

type RelationInfoEntity<T> = {
  [key in keyof T]?: NonNullable<T[key]> extends (infer U)[]
    ? RelationInfoEntity<U> | boolean // Se permite un array de PruebaInfer<U> o un booleano
    : boolean | RelationInfoEntity<T[key]>
}

type RelationOrderEntity<T> = {
  [key in keyof T]?: 'asc' | 'desc' | RelationOrderEntity<T[key]>
}

export interface IUserFilters3<T> {
  select?: RelationInfoEntity<T>
  filters?: Filters3<T>
  pagination?: ConfigPagination
  order?: RelationOrderEntity<T>
  relations?: RelationInfoEntity<T>
}

export interface IFilter3Response<T> {
  count: number
  data: T[]
  totalPages?: number
}
