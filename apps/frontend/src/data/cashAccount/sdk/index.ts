import { message } from 'antd'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { baseUrl } from '@/data/api/baseUrl'
import { ICategory, ITypeCategory } from '@/data/category/types'
import { ICostCenter } from '@/data/costCenter/types'
import { IParameter } from '@/data/maintenance/Parameters/type/Parameters'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import { ISupplier } from '@/data/maintenance/Supplier/type/Supplier'
import { IReport } from '@/data/reports/types'
import { Filters } from '@/data/types/Filters'

import { ICashAccount, ICashAccountType, ICreateCashAccount } from '../types'
import { ICreateTypeCashAccount } from '../types/cashTypes'

export const getCashAccount = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/get-cash-account`,
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
export const createBalance = async (
  data: string | number,
  monto: number,
  date: string | number,
  name: string,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)

  try {
    const response = await fetch(
      `${config.API}/cash-account/balance?accountId=${data}&date=${date}&monto=${monto}&name=${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({}),
      },
    )

    if (!response.ok) {
      throw new Error('Error al crear la cuenta de efectivo')
    }
  } catch (error) {
    console.error('Error al crear la cuenta de efectivo:', error)
    throw error
  }
}

export const nameIamCash = async (name: string) => {
  return baseUrl<[]>('cash-account/filters?nameCash=' + name)
}

export const createCashAccount = async (data: ICreateCashAccount) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/create-cash-account`,
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
      throw new Error('Error al crear la cuenta de efectivo')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear la cuenta de efectivo:', error)
    throw error
  }
}

export const loadCashAccountById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/get-cash-account-one?id=${id}`,
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

export const updateCashAccount = async (
  cashAccountId: number,
  updatedData: ICreateCashAccount,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/update-cash-account?cashAccountId=${cashAccountId}`,
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

export const getTypeCashAccount = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/get-typecash-account`,
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
export const createTypeCashAccount = async (data: ICreateTypeCashAccount) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/create-typecash-account`,
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
      throw new Error('Error al crear el tipo de cuenta de efectivo')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el tipo cuenta de efectivo:', error)
    throw error
  }
}

export const updateTypeCashAccount = async (
  cashTypeAccountId: number,
  updatedData: ICashAccountType,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/update-type-cash?cashTypeId=${cashTypeAccountId}`,
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

      message.success({
        content: 'Actualizado correctamente',
        key: 'loading',
        duration: 2,
      })
    } else {
      message.error({
        content: 'Error al actualizar',
        key: 'loading',
        duration: 2,
      })
    }
  } catch (error) {
    console.error('Error:', error)
    message.error({
      content: 'Error al actualizar',
      key: 'loading',
      duration: 2,
    })
  }
}
export const loadTypeCashAccountById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/cash-account/get-typecash-account-one?id=${id}`,
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

/// modificacion sdk respectivo

export const filterCashAccount = async (filter: Filters<ICashAccount>) => {
  return baseUrl<[]>('cash-account/filter', { body: filter, method: 'POST' })
}
export const filterCashAccountType = async (filter: Filters<ICashAccount>) => {
  return baseUrl<[]>('cash-account-type/filter', { query: filter })
}
export const filterCategory = async (filter: Filters<ICategory>) => {
  try {
    return await baseUrl<[]>('category/filter', {
      body: filter,
      method: 'POST',
    })
  } catch (error) {
    console.error('Error en la petición:', error)
    throw error
  }
}

export const filterTypeCategory = async (filter: Filters<ITypeCategory>) => {
  return baseUrl<[]>('category-type/filter', { query: filter })
}
export const filterReport = async (filter: Filters<IReport>) => {
  return baseUrl<[]>('menu-report/filter', { query: filter })
}
export const filterParameter = async (filter: Filters<IParameter>) => {
  return baseUrl<[]>('parameters/filter', { query: filter })
}
export const filterCostCenter = async (filter: Filters<ICostCenter>) => {
  return baseUrl<[]>('cost-center/filter', { body: filter, method: 'POST' })
}
export const filterSucursal = async (filter: Filters<ISucursal>) => {
  return baseUrl<[]>('sucursal/filter', { query: filter })
}
export const filterSupplier = async (filter: Filters<ISupplier>) => {
  return baseUrl<[]>('supplier/filter', { query: filter })
}
export const filterTerminalPost = async (filter: Filters<ISupplier>) => {
  return baseUrl<[]>('terminalPost/filter', { query: filter })
}

export const getAccount = async () => {
  return baseUrl<[]>('cost/center/getAccount')
}

export const getAccountFather = async () => {
  return baseUrl<[]>('category/accountFather')
}
