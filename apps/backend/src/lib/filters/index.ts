import { parseISO } from 'date-fns'
import { Fillime, WhereOption } from 'pizzadb'
import {
  Between,
  Equal,
  FindManyOptions,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  Raw,
} from 'typeorm'

export const transformWhere = <T>(
  initial: WhereOption<T>[],
): FindOptionsWhere<T> => {
  const filters: FindOptionsWhere<T> = {}

  for (const filter of initial) {
    let val: any
    if (filter.mods) {
      const value = filter.mods?.value
        ? filter.mods.value.replace('$x', filter.value as string)
        : filter.value
      val = Raw((alias) => {
        const definition = `${filter.mods?.field ? filter.mods.field.replace('$x', alias) : alias} ${operatorAndValue(filter.operator, value)}`

        return definition
      })
    } else if (filter.operator == 'equal') {
      val = Equal(filter.value)
    } else if (filter.operator == 'contain') {
      val = Raw(
        (alias) =>
          `LOWER(${alias}) LIKE '%${(filter.value as string).toLowerCase()}%'`,
      )
    } else if (filter.operator == 'in') {
      val = In(filter.value as string[])
    } else if (filter.operator == 'notEqual') {
      val = Not(Equal(filter.value))
    } else if (filter.operator == 'isNull') {
      val = IsNull()
    } else if (filter.operator == 'between') {
      const [start, end] = filter.value as string[]
      console.log('start : ', start, parseISO(start))
      val = Between(start, end)
    }

    if (val) filters[filter.field] = val
  }

  return filters
}

export const operatorAndValue = (operator: string, val?: unknown): string => {
  const isString = isNaN(Number(val))
  const value = Array.isArray(val) ? val : isString ? `'${val}'` : val
  if (operator == 'equal') return '= ' + value
  if (operator == 'notEqual') return '!= ' + value
  if (operator == 'isNull') return 'IS NULL'
  if (operator == 'contain') return 'LIKE ' + value
  if (operator == 'in')
    return `IN (${(value as string[]).map((v) => `'${v}'`).join(', ')})`
  if (operator == 'between')
    return `BETWEEN '${(value as string[])[0]}' AND '${(value as string[])[1]}'`
  return ''
}

export const findOptions = <T>(filters: Fillime<T>): FindManyOptions => {
  return {
    ...filters,
    where: filters.where ? transformWhere(filters.where) : undefined,
  }
}
