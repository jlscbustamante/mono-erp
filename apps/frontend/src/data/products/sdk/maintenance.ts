import { baseUrl } from '@/data/api/baseUrl'
import { ICategory } from '@/views/products/maintenance/types'
import {
  Equivalence,
  IBrand,
  IMeasure,
  IPresentation,
} from '@/views/products/maintenance/types'

export const getBrands = async () => {
  return await baseUrl<IBrand[]>('lt/inventory/brand/list')
}

export const deleteBrand = async (
  brandId: number,
): Promise<{ message: string }> => {
  return await baseUrl('lt/inventory/brand/delete', {
    body: { id: brandId },
    method: 'DELETE',
  })
}

export const createBrand = async (brand: IBrand) => {
  return await baseUrl('lt/inventory/brand/create', {
    body: brand,
    method: 'POST',
  })
}

export const updateBrand = async (brand: IBrand) => {
  return await baseUrl('lt/inventory/brand/update', {
    body: brand,
    method: 'PUT',
  })
}

//

export const getPresentation = async () => {
  return await baseUrl<IPresentation[]>('lt/inventory/presentation/list')
}

export const deletePresentation = async (
  presentationId: number,
): Promise<{ message: string }> => {
  return await baseUrl('lt/inventory/presentation/delete', {
    body: { id: presentationId },
    method: 'DELETE',
  })
}

export const createPresentation = async (brand: IPresentation) => {
  return await baseUrl('lt/inventory/presentation/create', {
    body: brand,
    method: 'POST',
  })
}

export const updatePresentation = async (brand: IPresentation) => {
  return await baseUrl('lt/inventory/presentation/update', {
    body: brand,
    method: 'PUT',
  })
}

export const getMeasures = async () => {
  return await baseUrl<IMeasure[]>('lt/inventory/measure/list')
}

export const deleteMeasure = async (
  measureId: number,
): Promise<{ message: string }> => {
  return await baseUrl('lt/inventory/measure/delete', {
    body: { id: measureId },
    method: 'DELETE',
  })
}

export const createMeasure = async (brand: IMeasure) => {
  return await baseUrl('lt/inventory/measure/create', {
    body: brand,
    method: 'POST',
  })
}

export const updateMeasure = async (brand: IMeasure) => {
  return await baseUrl('lt/inventory/measure/update', {
    body: brand,
    method: 'PUT',
  })
}

export const getEquivalances = async () => {
  return await baseUrl<Equivalence[]>('lt/inventory/eq/list', { method: 'GET' })
}

export const createEquivalence = async (equivalence: Equivalence) => {
  return await baseUrl('lt/inventory/eq/create', {
    body: equivalence,
    method: 'POST',
  })
}

export const updateEquivalence = async (equivalence: Equivalence) => {
  return await baseUrl('lt/inventory/eq/update', {
    body: equivalence,
    method: 'PUT',
  })
}

export const deleteEquivalence = async (
  id: number,
): Promise<{ message: string }> => {
  return await baseUrl('lt/inventory/eq/delete', {
    body: { id },
    method: 'DELETE',
  })
}

export const getCategories = async () => {
  return await baseUrl<ICategory[]>('lt/inventory/category/list', {
    method: 'GET',
  })
}

export const createCategory = async (equivalence: ICategory) => {
  return await baseUrl('lt/inventory/category/create', {
    body: equivalence,
    method: 'POST',
  })
}

export const updateCategory = async (equivalence: ICategory) => {
  return await baseUrl('lt/inventory/category/update', {
    body: equivalence,
    method: 'PUT',
  })
}

export const deleteCategory = async (
  id: number,
): Promise<{ message: string }> => {
  return await baseUrl('lt/inventory/category/delete', {
    body: { id },
    method: 'DELETE',
  })
}

export const deleteSupplier = async (
  id: number,
): Promise<{ message: string }> => {
  return await baseUrl('inventory/supplier/delete', {
    body: { id },
    method: 'DELETE',
  })
}
