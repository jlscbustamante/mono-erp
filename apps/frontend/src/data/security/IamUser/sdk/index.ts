import { toast } from 'react-toastify'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { NOTIFICATION } from '@/const/notification'
import { baseUrl } from '@/data/api/baseUrl'
import { Filters } from '@/data/types/Filters'

import { ICreateIamUser, IIamUser } from '../type/IamUser'

export const getIIamUser = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/security/iam-User/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error)
    throw error
  }
}

export const updateIIamUser = async (
  supplierID: number,
  updatedData: IIamUser,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    await fetch(
      `${config.API}/security/iam-User/update-iamUser?iamUserId=${supplierID}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      },
    )
  } catch (err: any) {
    toast.error(err.message, NOTIFICATION.error)
  }
}

export const loadIIamUserById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/security/iam-User/get-iamUser-one?iamUserId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error)
    throw error
  }
}

export const createIIamUser = async (data: ICreateIamUser) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/security/iam-User/create-iamUser`,
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
      throw new Error('Error al crear el usurario')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el usuario:', error)
    throw error
  }
}

export const filterIamUser = async (filter: Filters<IIamUser>) => {
  return baseUrl<[]>('security/iam-User/filter', { query: filter })
}

export const resetPasswordUser = async (id: number, password: string) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  const url = `${config.API}/security/iam-User/reset-password?iamUserId=${id}&password=${password}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Error al resetear la contraseña del usuario')
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Error al resetear la contraseña del usuario')
  }
}
