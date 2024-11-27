import { Filters, OpFilter } from '@/data/types/Filters'
import { optionsKeyFilter, safeAny } from '@/utils'

import { FilterComponent } from './FilterComponentv2'

interface IComponentProps<T> {
  userFilters: Filters<T>
  setFilters: (valorOrUpdater: Filters<T>) => void
  items: { label: string; key: string }[]
  getFilterTypesForKey: (key: keyof T) => OpFilter[]
  selections: { [key: string]: { label: string; value: safeAny }[] }
}

export const UserFilters = <T,>(props: IComponentProps<T>) => {
  const searchLabel = (key: keyof T) => {
    return props.items.find((el) => el.key === key)?.label ?? 'no definido'
  }
  const onChangeFilter = (value: [OpFilter, ...safeAny[]], key: keyof T) => {
    props.setFilters({
      ...props.userFilters,
      [key]: value,
    })
  }
  const onDelete = (key: keyof T) => {
    const newObj = Object.assign({}, props.userFilters)
    delete newObj[key]
    props.setFilters(newObj)
  }
  return (
    <>
      {Object.keys(props.userFilters).map((key) => {
        const filterTypes = props.getFilterTypesForKey(key as keyof T)
        let defaultValue: [OpFilter, ...safeAny[]]
        const elementFounded = props.userFilters[key as keyof T]
        if (elementFounded) {
          defaultValue = elementFounded as [OpFilter, ...safeAny[]]
        } else {
          defaultValue = [filterTypes[0]]
        }
        return (
          <FilterComponent
            title={searchLabel(key as keyof T)}
            key={key}
            value={defaultValue}
            selection={props.selections[key]}
            keyFilter={key as keyof T}
            filterOptions={optionsKeyFilter(filterTypes)}
            onChange={onChangeFilter}
            onDelete={onDelete}
          />
        )
      })}
    </>
  )
}
