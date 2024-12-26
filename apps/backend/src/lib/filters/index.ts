import { Sucursal } from 'pizzadb'
import { Equal, FindManyOptions, FindOptionsWhere, IsNull, Not } from 'typeorm'

interface WhereOption<T> {
  field: keyof T
  operator: string
  value?: unknown
  modField?:string
  }
}

interface Fillime<T>
  extends Pick<
    FindManyOptions<T>,
    'select' | 'relations' | 'order' | 'take' | 'skip'
  > {
  where?: WhereOption<T>[]
}

export const filters: Fillime<Sucursal> = {
  where: [
    {
      field: 'title',
      operator: 'notNull',
      value: 'Sucursal',
      modField: 'Date($x)'
    },
  ],
}

export const transformWhere = <T>(
  initial: WhereOption<T>[],
): FindOptionsWhere<T>[] => {
  const filters: FindOptionsWhere<T> = {}

  for (const filter of initial) {
    let val: any
    if (filter.operator == 'equal') {
      val = Equal(filter.value)
    } else if (filter.operator == 'notEqual') {
      val = Not(Equal(filter.value))
    } else if (filter.operator == 'isNull') {
      val = IsNull()
    }

    if(filter.modField) {
    } else {
      filters[filter.field] = val

    }

  }

  return []
}
