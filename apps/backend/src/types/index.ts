import { safeAny } from '../utils/someAny'
import { OpFilter } from './filter'

export enum Operator {
  EQUAL = 'equal',
  NOT_EQUAL = 'notequal',
  GREATER = 'greater',
  GREATER_OR_EQUAL = 'greaterorequal',
  LESS = 'less',
  LESS_OR_EQUAL = 'lessorequal',
  CONTAIN = 'contain',
  EQUAL_DATE = 'equaldate',
  IN = 'in',
  BETWEEN = 'between',
  SINCETO = 'sinceto',
}

export type Filters<T> = {
  field: (keyof T)[]
  value: safeAny[]
  operator: Operator[]
}

export type EnvFilters<T> = {
  [key in keyof T]?: [OpFilter, ...safeAny[]]
}

export interface IToken {
  id: number
  name: string
  mail: string
  granted: number
  status: 'A'
}

export enum StatusEntityNumber {
  Active = 1,
  Inactive = 0,
}

export interface ITransportista {
  transporte_nro_doc: string
  transporte_tipo_doc: string
  transporte_razon_social: string
  transporte_nro_placa: string
  conductor_tipo: string
  conductor_tipo_doc: string
  conductor_nro_doc: string
  conductor_nombres: string
  conductor_apellidos: string
  conductor_nro_licencia: string
}
