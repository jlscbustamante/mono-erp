/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
} from 'typeorm'

import { Filters, Operator } from '../types'
import { Filters3, OpFilter } from '../types/filter'
import { safeAny } from './someAny'

type OptionWhere<T> = FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined
export const filtersAdapter = <T>(filters: Filters<T>): OptionWhere<T> => {
  const objfinal: { [key in keyof T]?: safeAny } = {}
  for (let i = 0; i < filters.field.length; i++) {
    const field = filters.field[i]
    const operator = filters.operator[i]
    const value = filters.value[i]
    switch (operator) {
      case Operator.EQUAL:
        objfinal[field] = value
        break
      case Operator.CONTAIN:
        objfinal[field] = Like(`%${value}%`)
        break
      case Operator.GREATER:
        objfinal[field] = MoreThan(value)
        break
      case Operator.GREATER_OR_EQUAL:
        objfinal[field] = MoreThanOrEqual(value)
        break
      case Operator.LESS:
        objfinal[field] = LessThan(value)
        break
      case Operator.LESS_OR_EQUAL:
        objfinal[field] = LessThanOrEqual(value)
        break
      case Operator.NOT_EQUAL:
        objfinal[field] = Not(value)
        break
      case Operator.EQUAL_DATE:
        objfinal[field] = value
        break
      case Operator.IN:
        objfinal[field] = In(value as string[])
        break
      case Operator.BETWEEN:
        // wip
        break
      case Operator.SINCETO:
        // wip
        break
    }
  }

  return objfinal
}

export const filtersAdapterBuilder = <T>(
  filters: Filters<T>,
  alias = '',
): string[] => {
  const conditions: string[] = []
  for (let i = 0; i < filters.field.length; i++) {
    const field = filters.field[i] as string
    const operator = filters.operator[i]
    const value: string = filters.value[i]
    switch (operator) {
      case Operator.EQUAL:
        conditions.push(`${alias}${field} = '${value}'`)
        break
      case Operator.CONTAIN:
        conditions.push(
          `LOWER(${alias}${field}) LIKE '%${value.toLowerCase()}%'`,
        )
        break
      case Operator.GREATER:
        conditions.push(`${alias}${field} > '${value}'`)
        break
      case Operator.GREATER_OR_EQUAL:
        conditions.push(`${alias}${field} >= '${value}'`)
        break
      case Operator.LESS:
        conditions.push(`${alias}${field} < '${value}'`)
        break
      case Operator.LESS_OR_EQUAL:
        conditions.push(`${alias}${field} <= '${value}'`)
        break
      case Operator.NOT_EQUAL:
        conditions.push(`${alias}${field} <> '${value}'`)
        break
      case Operator.EQUAL_DATE:
        conditions.push(`DATE(${alias}${field}) ='${value}'`)
        break
      case Operator.BETWEEN:
        conditions.push(
          `DATE(${alias}${field}) BETWEEN '${value.split(',')[0]}' AND '${
            value.split(',')[1]
          }'`,
        )
        break
      case Operator.IN:
        conditions.push(
          `${alias}${field} IN (${value
            .split(',')
            .map((v) => `'${v}'`)
            .join(',')})`,
        )
        break
      case Operator.SINCETO:
        conditions.push(
          `${alias}${field} >= '${
            value.split(',')[0]
          }' AND ${alias}${field} < '${value.split(',')[1]}'`,
        )
        break
    }
  }

  return conditions
}

export const filtersAdapterNt = (
  filters: {
    [key: string]: [OpFilter, ...safeAny[]]
  },
  alias = '',
): string[] => {
  const conditions: string[] = []
  for (const key in filters) {
    const value = filters[key]
    const [operator, ...values] = value
    switch (operator) {
      case OpFilter.Equal:
        conditions.push(`${alias}${key}="${values[0]}"`)
        break
      case OpFilter.Contain:
        if (typeof values[0] === 'string')
          conditions.push(
            `LOWER(${alias}${key}) LIKE '%${
              typeof values[0] === 'string'
                ? values[0].toLowerCase()
                : values[0]
            }%'`,
          )

        break
      case OpFilter.Greater:
        conditions.push(`${alias}${key}>${values[0]}`)
        break
      case OpFilter.GreaterOrEqual:
        conditions.push(`${alias}${key}>=${values[0]}`)
        break
      case OpFilter.Less:
        conditions.push(`${alias}${key}<${values[0]}`)
        break
      case OpFilter.LessOrEqual:
        conditions.push(`${alias}${key}<=${values[0]}`)
        break
      case OpFilter.NotEqual:
        conditions.push(`${alias}${key}<>"${values[0]}"`)
        break
      case OpFilter.EqualDate:
        conditions.push(`DATE(${alias}${key}) =DATE('${values[0]}')`)
        break
      case OpFilter.In:
        conditions.push(
          `${alias}${key} IN (${values.map((v) => `'${v}'`).join(',')})`,
        )
        break
      case OpFilter.RangeDate:
        conditions.push(
          `DATE(${alias}${key}) BETWEEN DATE('${values[0]}') AND DATE('${values[1]}')`,
        )
        break
      case OpFilter.Range:
        conditions.push(
          `${alias}${key} BETWEEN '${values[0]}' AND '${values[1]}'`,
        )
        break
      case OpFilter.SinceTo:
        conditions.push(
          `DATE(${alias}${key}) >= '${values[0]}' AND DATE(${alias}${key}) < '${values[1]}'`,
        )
        break
      case OpFilter.IsNull:
        conditions.push(`${alias}${key} IS NULL`)
        break
      case OpFilter.IsNullish:
        conditions.push(`(${alias}${key} IS NULL OR ${alias}${key} = '')`)
        break
      case OpFilter.NotNull:
        conditions.push(`${alias}${key} IS NOT NULL`)
        break
      case OpFilter.lasMonth:
        conditions.push(
          `${alias}${key} >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`,
        )
        break
      case OpFilter.lastWeek:
        conditions.push(
          `${alias}${key} >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`,
        )
        break
    }
  }

  return conditions
}

export const filters3Adapter = <T>(filters: Filters3<T>): any => {
  const whereObject: { [key in keyof T]?: safeAny } = {}
  for (const key in filters) {
    if (!Array.isArray(filters[key as keyof T])) {
      const obj = filters3Adapter(filters[key as keyof T] as Filters3<T>)
      whereObject[key] = obj
      continue
    }
    const [operator, ...values] = filters[key as keyof T] as [
      OpFilter,
      ...safeAny[],
    ]

    switch (operator) {
      case OpFilter.Select:
      case OpFilter.Equal:
        whereObject[key] = values[0]
        break
      case OpFilter.Contain:
        whereObject[key] = Raw(
          (alias) => `LOWER(${alias}) LIKE '%${values[0].toLowerCase()}%'`,
        )
        break
      case OpFilter.Greater:
        whereObject[key] = MoreThan(values[0])
        break
      case OpFilter.GreaterOrEqual:
        whereObject[key] = MoreThanOrEqual(values[0])
        break
      case OpFilter.Less:
        whereObject[key] = LessThan(values[0])
        break
      case OpFilter.LessOrEqual:
        whereObject[key] = LessThanOrEqual(values[0])
        break
      case OpFilter.NotEqual:
        whereObject[key] = Not(values[0])
        break
      case OpFilter.EqualDate:
        whereObject[key] = Raw((alias) => `DATE(${alias}) ='${values[0]}'`)
        break
      case OpFilter.In:
        whereObject[key] = In(values)
        break
      case OpFilter.RangeDate:
        whereObject[key] = Raw(
          (alias) => `DATE(${alias}) BETWEEN '${values[0]}' AND '${values[1]}'`,
        )
        break
      case OpFilter.Range:
        whereObject[key] = Raw(
          (alias) => `${alias} BETWEEN '${values[0]}' AND '${values[1]}'`,
        )
        break
      case OpFilter.SinceTo:
        whereObject[key] = Raw(
          (alias) =>
            `DATE(${alias}) >= '${values[0]}' AND DATE(${alias}) < '${values[1]}'`,
        )
        break
      case OpFilter.IsNull:
        whereObject[key] = IsNull()
        break
      case OpFilter.NotNull:
        whereObject[key] = Not(IsNull())
        break
      case OpFilter.lastWeek:
        whereObject[key] = Raw(
          (alias) => `DATE(${alias}) >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`,
        )
        break
      case OpFilter.lasMonth:
        whereObject[key] = Raw(
          (alias) => `DATE(${alias}) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`,
        )
        break
    }
  }

  return whereObject
}
