import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
} from 'typeorm'

import { safeAny } from '../utils/someAny'

type ConfigPagination = {
  page: number
  lot: number
}

export interface IUserFilter3<T> {
  select?: FindOptionsSelect<T>
  filters: Filters3<T>
  pagination?: ConfigPagination
  order?: FindOptionsOrder<T>
  relations?: FindOptionsRelations<T>
}

export type Filter3Method<T> = (
  config: IUserFilter3<T>,
) => //  Promise<[T[], number, number | undefined]>
Promise<{
  data: T[]
  count: number
  totalPages: number | undefined
  page?: number
}>

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
  SinceTo = 'sinceto',
  Range = 'range',
  IsNull = 'isnull',
  IsNullish = 'isnullish',
  NotNull = 'notnull',
  lastWeek = 'lastweek',
  lasMonth = 'lastmonth',
  Select = 'select',
}
export type Filters3<T> = {
  [key in keyof T]?: [OpFilter, ...safeAny[]] | Filters3<T[key]>
}
