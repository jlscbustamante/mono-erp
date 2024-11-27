import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { IReport } from '@/data/reports/types'
export const getMenuReport = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/menu-report/get-menu-report`, {
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

export const updateMenuReport = async (
  typeCategoryId: number,
  updatedData: IReport,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/menu-report/update-menu-report?menuReportId=${typeCategoryId}`,
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

export const loadMenuReportById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/menu-report/get-menu-report-one?menuReportId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del reporte de menú')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del reporte de menú:', error)
    throw error
  }
}

export const createMenuReport = async (data: IReport) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/menu-report/create-menu-report`,
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
      throw new Error('Error al crear el reporte de menú')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el reporte de menú:', error)
    throw error
  }
}
