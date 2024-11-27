import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

import { ICreateCostCenter } from '../type/CostCenter'
export const getCostCenter = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cost-centers/get-cost-centers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del menu report')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del menu report:', error)
    throw error
  }
}
export const updateCostCenter = async (
  costCenterId: number,
  updatedData: ICreateCostCenter,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cost-centers/update-cost-centers?costCenterId=${costCenterId}`,
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

export const loadCostCenterById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cost-centers-one?costCenterId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del centro de costo')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del centro de costo:', error)
    throw error
  }
}

export const createCostCenter = async (data: ICreateCostCenter) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cost-centers/create-cost-centers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      },
    )

    if (!response.ok) {
      throw new Error('Error al crear el centro de costo')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el centro de costo:', error)
    throw error
  }
}
