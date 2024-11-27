import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

export const generateAEStore = async (
  date: string,
): Promise<{
  success: boolean
  logs: string[]
  informe?: { name: string; contable: string; moves: string }[]
}> => {
  const token = localStorage.getItem(ITEM.TOKEN)
  const result = await fetch(`${config.apiAE}/store/generate?date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const data = await result.json()
  if (result.status == 200) {
    const info: {
      totalMovimientos: number
      totalInsertados: number
      totalItems: number
      informe: { name: string; contable: string; moves: string }[]
    } = data.data
    const logs = {
      success: true,
      logs: [
        'Total de movimientos de caja encontrados : ' + info.totalMovimientos,
        'Total de movimientos insertados(mov. contables) : ' +
          info.totalInsertados,
      ],
      informe: info.informe,
    }
    return logs
  } else if (result.status == 400) {
    const logs: string[] = data.data
    return {
      success: false,
      logs,
    }
  }
  console.log(data)
  return {
    success: false,
    logs: ['Ocurrio un error inesperado, por favor contacte con soporte'],
  }
}

export const generateAERequest = async (
  date: string,
): Promise<{ success: boolean; logs: string[] }> => {
  const token = localStorage.getItem(ITEM.TOKEN)
  const result = await fetch(`${config.apiAE}/request/generate?date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const data = await result.json()
  if (result.status == 200) {
    const info: {
      totalInsertados: number
      totalRequerimientos: number
      totalRetenciones: number
    } = data.data
    const logs = {
      success: true,
      logs: [
        'Total requerimientos encontrados : ' +
          (info.totalRequerimientos + info.totalRetenciones),
        `Total de movimientos insertados(mov. contables) : ${info.totalInsertados}`,
      ],
    }
    return logs
  } else if (result.status == 400) {
    const logs: string[] = data.data
    return {
      success: false,
      logs,
    }
  }
  console.log(data)
  return {
    success: false,
    logs: ['Ocurrio un error inesperado, por favor contacte con soporte'],
  }
}
