import { message } from 'antd'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { baseUrl } from '@/data/api/baseUrl'
import { Filters } from '@/data/types/Filters'

import { ICreateIamRole, IIamRole } from '../type/IamRole'

export const getIIamRole = async () => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(`${config.API}/security/iam-role/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Error al obtener los datos de los usuarios')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos de los usuarios:', error)
    throw error
  }
}

export const updateIIamRole = async (
  supplierID: number,
  updatedData: IIamRole,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/security/iam-role/updateStatus-iamrole?iamRoleId=${supplierID}`,
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
    } else {
      throw new Error('Error al actualizar')
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

export const loadIIamRoleById = async (id: number) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/security/iam-role/get-iamRole-one?iamRoleId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )

    if (!response.ok) {
      throw new Error('Error al obtener los datos del rol')
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('Los datos obtenidos no tienen el formato correcto')
    }

    return data
  } catch (error) {
    console.error('Error al obtener los datos del rol:', error)
    throw error
  }
}

export const createIIamRole = async (data: ICreateIamRole) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/security/iam-role/create-iamRole`,
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
      throw new Error('Error al crear el rol')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('Error al crear el rol:', error)
    throw error
  }
}

export const filterIamRole = async (filter: Filters<IIamRole>) => {
  return baseUrl<[]>('security/iam-role/filter', { query: filter })
}
export const getModule = async () => {
  return baseUrl<[]>('security/iam-module/get')
}
export const getFunction = async () => {
  return baseUrl<[]>('security/iam-function/get')
}
export const groupFunction = async (rol_id: string) => {
  return baseUrl<[]>('security/iam-role/groupFunctions?moduleId=' + rol_id)
}
export const getRolFunctions = async (rol_id: number) => {
  return baseUrl<[]>(
    'security/iam-permission/filter?rol_id[]=equal&rol_id[]=' + rol_id,
  )
}

export const nameIamRol = async (name: string) => {
  return baseUrl<[]>('security/iam-role/filter?name[]=equal&name[]=' + name)
}
export const filterPermisions = async (rolID: number) => {
  return baseUrl<[]>(
    'security/iam-permission/filter?rol_id[]=equal&rol_id[]=' + rolID,
  )
}

export const filterFunctions = async (rolID: number) => {
  return baseUrl<[]>('security/iam-function/filter?id[]=equal&id[]=' + rolID)
}
type Token = {
  statusCode: number
  userEmail: string
  message: string
  codeEnviado: string
  token: string
}

export const sendCode = async (email: string) => {
  try {
    const response = await baseUrl<Token>(
      'security/iam-User/resetPassword?email=' + email,
    )

    if (response) {
      return response.token
    } else {
      throw new Error('Error en el envio')
    }
  } catch (err: any) {
    console.error('Error en la solicitud HTTP:', err.message)
    throw err
  }
}

export const udpatePassword = async (
  token: string | null,
  password: string,
) => {
  try {
    const response = await baseUrl<[]>(
      'security/iam-User/firstLogin?token=' + token + '&password=' + password,
    )
    if (response) {
      return response
    } else {
      throw new Error('Error en el envio')
    }
  } catch (err: any) {
    console.error('Error en la solicitud HTTP:', err.message)
    throw err
  }
}

type Respuesta = {
  statusCode: number
  userEmail: string
  message: string
  succes: boolean
}
export const validateInfo = async (
  email: string,
  code: string,
  token: string,
  password: string,
) => {
  const response = await baseUrl<Respuesta>(
    'security/iam-User/validateInfo?email=' +
      email +
      '&code=' +
      code +
      '&token=' +
      token +
      '&password=' +
      password,
  )
  console.log(response)
  if (response.succes) {
    return response.succes
  } else {
    throw new Error('Error en la validación')
  }
}

export const validateEmail = async (email: string) => {
  try {
    return baseUrl<[]>('security/iam-User/validateEmail?email=' + email)
  } catch (err: any) {
    console.error('Error en la solicitud HTTP:', err)
  }
}
export const resetPassword = async (
  email: string,
  password: string,
  newPassword: string,
) => {
  const token = localStorage.getItem(ITEM.TOKEN)

  try {
    const change = await fetch(
      `${config.API}/security/iam-User/update-ConfirmPassword?email=${email}&password=${password}&newPassword=${newPassword}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (!change.ok) {
      throw new Error('Contraseña incorrecta')
    } else {
      const responseData = await change.json()
      console.log(responseData)
      return responseData
    }
  } catch (err: any) {
    console.error(err)
    throw new Error(err)
  }
}

type Permission = {
  rol_id: number
  module_id: number
  function_id: number
  granted: number
}
export const updateRol = async (permissions: Permission[]) => {
  const token = localStorage.getItem(ITEM.TOKEN)

  try {
    const response = await fetch(
      `${config.API}/security/iam-permission/create-iamPermission`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(permissions),
      },
    )

    if (response.status === 200) {
      console.log('Permisos enviados con éxito.')
    } else {
      console.error('Error al enviar permisos a la API.')
    }
  } catch (error) {
    console.error('Error en la solicitud HTTP:', error)
  }
}

export const getPermission = async () => {
  return baseUrl<[]>('security/iam-permission/get')
}
export const deletePermission = async (rol_id: string) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  try {
    const response = await fetch(
      `${config.API}/security/iam-permission/delete-iamRoles?rol_id=${rol_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      },
    )

    if (response.ok) {
      const responseData = await response.json()
      console.log('Datos eliminados:', responseData)
    } else {
      console.error('Error al eliminar los datos')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
