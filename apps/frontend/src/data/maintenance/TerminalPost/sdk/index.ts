import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

import { ITerminalPost } from '../type/TerminalPost'
export const getTerminalPost = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/terminal-post/get-terminal-post`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del terminal pos')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del terminal pos:', error)
    throw error
  }
}

export const updateTerminalPost = async (
  supplierID: string,
  updatedData: ITerminalPost,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/terminal-post/update-terminal-post?terminalPostId=${supplierID}`,
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

export const loadTerminalPostById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/sucursal/update-sucursal-one?sucursalId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del terminal post')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del terminal pos:', error)
    throw error
  }
}

export const createTerminalPost = async (data: ITerminalPost) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/terminal-post/create-terminal-post`,
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
      throw new Error('Error al crear el terminal pos')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el terminal pos:', error)
    throw error
  }
}
