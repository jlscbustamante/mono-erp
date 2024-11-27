import { ObjectLiteral, Repository } from 'typeorm'

import { IUserFilter3 } from '../types/filter'
import { filters3Adapter } from '../utils/filtersAdapter'

export async function filter3Base<T extends ObjectLiteral>(
  this: Repository<T>,
  { select, filters, pagination, order, relations }: IUserFilter3<T>,
): //  Promise<[T[], count: number, totalPages: number | undefined]>
Promise<{
  data: T[]
  count: number
  totalPages: number | undefined
  page?: number
}> {
  const [data, count] = await this.findAndCount({
    select,
    take: pagination?.lot ?? undefined,
    skip: pagination ? (pagination.page - 1) * pagination.lot : undefined,
    where: filters3Adapter(filters),
    order,
    relations,
  })
  const totalPages = pagination ? Math.ceil(count / pagination.lot) : undefined
  if (pagination && pagination.page > totalPages!) {
    const [productsSec, countSec] = await this.findAndCount({
      select,
      take: pagination.lot,
      skip: 0,
      where: filters3Adapter(filters),
      order,
      relations,
    })
    return {
      data: productsSec,
      count: countSec,
      totalPages,
      page: 1,
    }
  }

  return {
    data,
    count,
    totalPages,
    page: pagination?.page,
  }
}

export async function filter3<T extends ObjectLiteral>(
  repo: Repository<T>,
  { select, filters, pagination, order, relations }: IUserFilter3<T>,
): //  Promise<[T[], count: number, totalPages: number | undefined]>
Promise<{
  data: T[]
  count: number
  totalPages: number | undefined
  page?: number
}> {
  const [data, count] = await repo.findAndCount({
    select,
    take: pagination?.lot ?? undefined,
    skip: pagination ? (pagination.page - 1) * pagination.lot : undefined,
    where: filters3Adapter(filters),
    order,
    relations,
  })
  const totalPages = pagination ? Math.ceil(count / pagination.lot) : undefined
  if (pagination && pagination.page > totalPages!) {
    const [productsSec, countSec] = await repo.findAndCount({
      select,
      take: pagination.lot,
      skip: 0,
      where: filters3Adapter(filters),
      order,
      relations,
    })
    return {
      data: productsSec,
      count: countSec,
      totalPages,
      page: 1,
    }
  }

  return {
    data,
    count,
    totalPages,
    page: pagination?.page,
  }
}
