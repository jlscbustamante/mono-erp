import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input } from 'antd'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { useParametersQuery } from '@/hooks/useParamters'

import { updateCourierPassword } from '../api'
import { useCouriers } from '../useCouriers'

const editPasswordDrawer = atom<{
  isOpen: boolean
  id: null | number
}>({
  key: 'editPasswordDrawerAtom',
  default: {
    isOpen: false,
    id: null,
  },
})

export const useEditPasswordDrawer = () => {
  const [value, setValue] = useRecoilState(editPasswordDrawer)

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

export const EditPasswordDrawer = () => {
  const { isOpen, close, id } = useEditPasswordDrawer()
  const [form] = Form.useForm()
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
    mutationFn: updateCourierPassword,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      form.resetFields()
      toast.success('Contraseña actualizada')
      close()
    },
  })

  return (
    <Drawer
      onClose={() => close()}
      open={isOpen}
      title="Editar contraseña"
      width={400}
    >
      {courier && (
        <Form
          labelCol={{ span: 8 }}
          labelWrap={true}
          wrapperCol={{ span: 17 }}
          form={form}
          onFinish={(val: { password: string }) => [
            mutation.mutate({ password: val.password, id: courier.id }),
          ]}
        >
          <Form.Item label="Nombre">
            <Input value={courier.name} readOnly />
          </Form.Item>
          <Form.Item
            label="Nueva contraseña"
            name={'password'}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password />
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
