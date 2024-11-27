import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

import { ICreateParameter, IParameter } from '../type/Parameters'
export const getParameters = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/parameters/get-parameter`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

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
export const updateParameter = async (
  parameterId: number,
  updatedData: IParameter,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/parameters/update-parameter?parameterId=${parameterId}`,
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

export const loadParameterById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/parameters/get-parameter-one?parameterId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del parámetro')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del parámetro:', error)
    throw error
  }
}

export const createParameter = async (data: ICreateParameter) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/parameters/create-parameter`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al crear el parámetro')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el parámetro:', error)
    throw error
  }
}
