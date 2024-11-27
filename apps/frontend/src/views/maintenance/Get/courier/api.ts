import config from '@/config'

import { ICourier, ICreateCourier, IUpdateCourier } from './types'

export const getCouriers = async (ciaId: string): Promise<ICourier[]> => {
  const body = {
    cia_id: ciaId,
  }
  const response = await fetch(
    `${config.hostMoto}/api/v1/getCouriersExtFullApi`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const { data } = (await response.json()) as { data: ICourier[] }

  return data
}

export const createCourier = async (ciaId: string, courier: ICreateCourier) => {
  const response = await fetch(
    `${config.hostMoto}/api/v1/courrier/createCourrier`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...courier,
        cia_id: ciaId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const data = await response.json()

  if (data.success === false || response.status == 404) {
    throw new Error(data?.message ?? 'Hubo un problema al crear el motorizado')
  }

  return data
}

export const getListStores = async (
  ciaId: string,
): Promise<
  {
    store_name: string
    store_id: string
    store_code: string
  }[]
> => {
  const response = await fetch(
    `${config.hostMoto}/api/v1/storesExtFullApi/${ciaId}`,
  )
  const data: { data: { id: string; title: string; external_code: string }[] } =
    await response.json()

  return data.data.map((el) => ({
    store_name: el.title,
    store_id: el.id,
    store_code: el.external_code,
  }))
}

export const updateCourierStore = async (
  ciaId: string,
  body: {
    store_id: string
    id: number
  },
) => {
  const response = await fetch(
    `${config.hostMoto}/api/v1/courrier/editCourrierStore`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        cia_id: ciaId,
      }),
    },
  )
  const data = await response.json()

  if (data.success === false) {
    throw new Error(
      data?.message ?? 'Hubo un problema al editar la tienda del motorizado',
    )
  }

  return data
}

export const updateCourierPassword = async (body: {
  password: string
  id: number
}) => {
  const response = await fetch(
    `${config.hostMoto}/api/v1/courrier/editCourrierPassword`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
      }),
    },
  )
  const data = await response.json()

  if (data.success === false) {
    throw new Error(
      data?.message ??
        'Hubo un problema al editar la constraseña del motorizado',
    )
  }
}

export const updateCourier = async (ciaId: string, body: IUpdateCourier) => {
  const store_id = body.store_code
  const response = await fetch(
    `${config.hostMoto}/api/v1/courrier/editCourrier`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        store_id,
        store_code: undefined,
        cia_id: ciaId,
      }),
    },
  )

  const data = await response.json()

  if (data.success === false) {
    throw new Error(data?.message ?? 'Hubo un problema al editar el motorizado')
  }

  return data
}

export const deleteCourier = async (id: number) => {
  const response = await fetch(
    `${config.hostMoto}/api/v1/courrier/deleteCourrier`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id.toString(),
      }),
    },
  )
  const data = await response.json()
  if (data.success === false) {
    throw new Error(
      data?.message ?? 'Hubo un problema al eliminar el motorizado',
    )
  }
}
