import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

import { ISupplier } from '../type/Supplier'
export const getSupplier = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/suppliers/get-supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener el proveedor')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del proveedor:', error)
    throw error
  }
}

export const updateSupplier = async (
  supplierID: string,
  updatedData: ISupplier,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/suppliers/update-supplier?supplierId=${supplierID}`,
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

export const loadSupplierById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/suppliers/get-supplier-one?supplierId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del proveedor')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del proveedor:', error)
    throw error
  }
}

export const createSupplier = async (data: ISupplier) => {
  console.log(data)
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/suppliers/create-supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al crear el proveedor')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el proveedor:', error)
    throw error
  }
}
