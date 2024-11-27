import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { ICreateTypeCashAccount } from '@/data/cashAccount/types/cashTypes'

import { ICategory, ICreateCategory, ICreateTypeCategory } from '../types'

export const getCategory = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/category/get-category`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener los datos de las categorias')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos de las categorias:', error)
    throw error
  }
}

export const createCategory = async (data: ICreateCategory) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/category/create-category`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al crear el tipo de cuenta de efectivo')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el tipo cuenta de efectivo:', error)
    throw error
  }
}
export const updateCategory = async (
  categoryId: number,
  updatedData: ICategory,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/category/update-category?categoryId=${categoryId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      },
    )

    if (response.ok) {
      const responseData = await response.json()

      console.log('Datos actualizados:', responseData)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
export const loadCategoryById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/category/get-category-one?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos de la cuenta de efectivo')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos de la cuenta de efectivo:', error)
    throw error
  }
}

// TYPE CATEGORY

export const getTypeCategory = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/category/get-categoryType`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener los datos de las categorias')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos de las categorias:', error)
    throw error
  }
}
export const createTypeCategory = async (data: ICreateTypeCashAccount) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/category/create-categoryType`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al crear el tipo de cuenta de efectivo')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el tipo cuenta de efectivo:', error)
    throw error
  }
}

export const updateTypeCategory = async (
  typeCategoryId: number,
  updatedData: ICreateTypeCategory,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/category/update-categoryType?categoryTypeId=${typeCategoryId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      },
    )

    if (response.ok) {
      const responseData = await response.json()

      console.log('Datos actualizados:', responseData)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const loadTypeCategoryById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/category/get-category-one?categoryTypeId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos de la cuenta de efectivo')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos de la cuenta de efectivo:', error)
    throw error
  }
}
