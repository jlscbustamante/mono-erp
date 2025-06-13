import { OpFilter } from '../Filters'

import { InvRecipeFilter } from '../shared-types'

export const mapKeyFilterInvRecipe = (
  key: keyof InvRecipeFilter,
): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'company_id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'recipe':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'category_id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'menu_item_id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'save_tag':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    default:
      return [OpFilter.Equal]
  }
}
export const validInvRecipe = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'company_id',
      label: 'Compañía',
    },
    {
      key: 'recipe',
      label: 'Receta',
    },
    {
      key: 'category_id',
      label: 'Categoría',
    },
    {
      key: 'menu_item_id',
      label: 'Producto',
    },
    {
      key: 'save_tag',
      label: 'Etiqueta',
    },
    {
      key: 'status',
      label: 'Estado',
    },
  ]
}
