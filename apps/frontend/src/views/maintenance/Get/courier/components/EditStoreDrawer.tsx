import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { useMemo } from 'react'
import { atom, useRecoilState } from 'recoil'

import { useParametersQuery } from '@/hooks/useParamters'

import { updateCourierStore } from '../api'
import { useCouriers } from '../useCouriers'
import { useListStores } from '../useListStores'

const editStoreDrawerAtom = atom<{
  isOpen: boolean
  id: null | number
}>({
  key: 'editStoreDrawerAtom',
  default: {
    isOpen: false,
    id: null,
  },
})

export const useEditStoreDrawer = () => {
  const [value, setValue] = useRecoilState(editStoreDrawerAtom)

  const open = (code: number) =>
    setValue({
      isOpen: true,
      id: code,
    })
  const close = () =>
    setValue({
      isOpen: false,
      id: null,
    })

  return {
    isOpen: value.isOpen,
    open,
    close,
    id: value.id,
  }
}

export const EditStoreDrawer = () => {
  const { isOpen, close, id } = useEditStoreDrawer()
  const [form] = Form.useForm()
  const { data: stores } = useListStores()
  const { data: parameterData } = useParametersQuery()
  const { data } = useCouriers(parameterData?.ciaIdMoturider ?? null)
  const courier = useMemo(() => {
    const founded = data?.find((el) => el.id === id)
    if (founded) {
      form.setFieldsValue({ store_code: founded.store_code })
    }
    return founded
  }, [data, id])

  const mutation = useMutation({
    // mutationFn: updateCourierStore,
    mutationFn: async (body: { store_id: string; id: number }) => {
      if (!parameterData || !parameterData?.ciaIdMoturider)
        throw new Error('No se encontro cia_id de la empresa en parametros.')
      return await updateCourierStore(parameterData.ciaIdMoturider, body)
    },
  })

  return (
    <Drawer
      onClose={() => close()}
      open={isOpen}
      title="Editar Tienda"
      width={400}
    >
      {courier && (
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          onFinish={(val: { store_code: string }) => [
            mutation.mutate({ store_id: val.store_code, id: courier.id }),
          ]}
        >
          <Form.Item label="Nombre">
            <Input value={courier.name} readOnly />
          </Form.Item>
          <Form.Item
            label="Tienda"
            name={'store_code'}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select>
              {stores.map((el) => {
                return (
                  <Select.Option
                    key={el.store_code.toString()}
                    value={el.store_code}
                  >
                    {el.store_name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <div className="text-right mt-4">
            <Button
              htmlType="submit"
              type="primary"
              loading={mutation.isPending}
            >
              Guardar
            </Button>
          </div>
        </Form>
      )}
      {!courier && (
        <p className="text-center my-10">No se pudo obtener al motorizado</p>
      )}
    </Drawer>
  )
}
