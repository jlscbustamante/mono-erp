import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { baseUrl } from '@/data/api/baseUrl'
import { Filters } from '@/data/types/Filters'

import { ICourrier, ICreateCourrier, IUpdateCourrier } from '../type/Courrier'

export const getCourrier = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/courrier/getDriver`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener los datos de los courrier')
    }

    const { data } = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos de los courrier:', error)
    throw error
  }
}
export const updateCourrier = async (
  courrierId: number,
  updatedData: ICreateCourrier,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/courrier/updateCourrier?courrierId=${courrierId}`,
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

export const deleteCourrier = async (courrierId: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    await fetch(
      `${config.API}/courrier/deleteCourrier?courrierId=${courrierId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error:', error)
  }
}

export const createCourrier = async (courrier: ICreateCourrier) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/courrier/createCourrier`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courrier),
    })
    if (!response.ok) {
      const responseData = await response.json() // Obtener el cuerpo de la respuesta como objeto JSON
      const errorMessage = responseData.message // Extraer el mensaje de error del objeto JSON
      throw new Error(`${errorMessage}`)
    }
  } catch (error: any) {
    throw new Error(`${error.message}`)
  }
}

export const getCourrierStores = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const data = await fetch(`${config.API}/courrier/getStoresCourrier`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

export const updateCourrierPassword = async (
  courrierId: number,
  updatedData: IUpdateCourrier,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/courrier/updatePassword?courrierId=${courrierId}`,
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

export const updateCourrierStore = async (
  courrierId: number,
  tienda: number,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    await fetch(
      `${config.API}/courrier/updateCourrierStore?courrierId=${courrierId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tienda }),
      },
    )
  } catch (error: any) {
    throw new Error(`${error.message}`)
  }
}

export const filterCourrier = async (filter: Filters<ICourrier>) => {
  return baseUrl<[]>('courrier/filter', { query: filter })
}

export const generateExcel = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/courier/generateExcel`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(errorMessage)
    }

    // Obtener la respuesta como un blob (archivo binario)
    const blob = await response.blob()

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([blob]))

    // Crear un elemento de enlace y hacer clic en él para iniciar la descarga
    const a = document.createElement('a')
    a.href = url
    a.download = 'archivo.xlsx'
    document.body.appendChild(a)
    a.click()

    // Limpiar el enlace y el objeto URL
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const updateStores = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    await fetch(`${config.API}/courrier/updateStores`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    throw new Error(`${error.message}`)
  }
}
