import { baseUrl } from '@/data/api/baseUrl'
import { IProductFlavor, IRecipeBase } from '../../shared/types'

export const getRecipeBasesFromDB = async (): Promise<IRecipeBase[]> => {
  return baseUrl<IRecipeBase[]>(`api/view/recipe/catalog-maintenance/recipe-base`, {
    method: 'GET',
    useV2: true
  })
}

export const editRecipeBase = async (recipe: IRecipeBase): Promise<void> => {
  return baseUrl<void>(`api/view/recipe/catalog-maintenance/recipe-base/update`, {
    method: 'PUT',
    body: recipe,
    useV2: true
  })
}

export const deleteRecipeBase = async (id: number): Promise<void> => {
  return baseUrl<void>(`api/view/recipe/catalog-maintenance/recipe-base/delete`, {
    method: 'DELETE',
    body: { id },
    useV2: true
  })
}

export const getFlavorsFromDB = async (): Promise<IProductFlavor[]> => {
  return baseUrl<IProductFlavor[]>(`api/view/recipe/catalog-maintenance/flavor`, {
    method: 'GET',
    useV2: true
  })
}

export const editFlavor = async (flavor: IProductFlavor): Promise<void> => {
  return baseUrl<void>(`api/view/recipe/catalog-maintenance/flavor/update`, {
    method: 'PUT',
    body: flavor,
    useV2: true
  })
}

export const deleteFlavor = async (id: number): Promise<void> => {
  return baseUrl<void>(`api/view/recipe/catalog-maintenance/flavor/delete`, {
    method: 'DELETE',
    body: { id },
    useV2: true
  })
}
