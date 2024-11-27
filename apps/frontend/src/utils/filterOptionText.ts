import { OpFilter } from '@/data/types/Filters'

export const optionsKeyFilter = (options: OpFilter[]) => {
  const optionsText = options.map((option) => {
    switch (option) {
      case OpFilter.Equal:
        return { value: option, label: 'Igual' }
      case OpFilter.NotEqual:
        return { value: option, label: 'No es igual a' }
      case OpFilter.Contain:
        return { value: option, label: 'Contiene' }
      case OpFilter.EqualDate:
        return { value: option, label: 'Igual' }
      case OpFilter.RangeDate:
        return { value: option, label: 'Entre' }
      case OpFilter.Range:
        return { value: option, label: 'Entre' }
      case OpFilter.In:
        return { value: option, label: 'En' }
      case OpFilter.Select:
        return { value: option, label: 'Selecciona' }
      case OpFilter.SelectIn:
        return { value: option, label: 'Multiple' }
      case OpFilter.IsNull:
        return { value: option, label: 'Es nulo' }
      case OpFilter.NotNull:
        return { value: option, label: 'No es nulo' }
      case OpFilter.lastMonth:
        return { value: option, label: 'Último mes' }
      case OpFilter.lastWeek:
        return { value: option, label: 'Última semana' }
      case OpFilter.Less:
        return { value: option, label: 'Menor que' }
      case OpFilter.Greater:
        return { value: option, label: 'Mayor que' }
      default:
        return { value: option, label: 'Contiene' }
    }
  })
  return optionsText
}
