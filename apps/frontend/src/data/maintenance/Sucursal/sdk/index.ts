import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

import { ISucursal } from '../type/Sucursal'
export const getSucursal = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/sucursal/list-sucursal`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener los datos de la sucursal:', error)
    throw error
  }
}
export const updateSucursal = async (
  sucursalID: string,
  updatedData: ISucursal,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    await fetch(
      `${config.API}/sucursal/update-sucursal?sucursalId=${sucursalID}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      },
    )
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const loadSucursalById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    await fetch(`${config.API}/sucursal/update-sucursal-one?sucursalId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
  } catch (error) {
    console.error('Error al obtener los datos de la tienda:', error)
    throw error
  }
}

export const createSucursal = async (data: ISucursal) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/sucursal/create-sucursal`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorResponse = await response.json()
      const errorMessage = errorResponse.message || 'Error al crear la tienda'

      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error('Error al crear la tienda:', error)
    throw error
  }
}
