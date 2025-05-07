import { viewClient } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { ICreateMockAuthorizedUserDto } from '@types'
import { Button, Drawer, Form, Input } from 'antd'
import { atom, useAtom } from 'jotai'
import { toast } from 'react-toastify'

const add_user_atom = atom<boolean>(false)

export const useAddUser = () => {
  const [is_open, set_is_open] = useAtom(add_user_atom)
  const open = () => set_is_open(true)
  const close = () => set_is_open(false)

  return {
    is_open,
    open,
    close,
  }
}

export const AddUserDrawer = ({ refetch }: { refetch: () => void }) => {
  const { is_open, close } = useAddUser()
  const [form] = Form.useForm()

  const add_user_mt = useMutation({
    mutationFn: async (user: ICreateMockAuthorizedUserDto) => {
      const req = await viewClient.api.view.payment.order.authorized_user.$post(
        {
          json: user,
        },
      )
      if (!req.ok) {
        const data = await req.json()
        throw new Error(data.message)
      }
    },
    onSuccess: () => {
      refetch()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handle_submit = async (values: ICreateMockAuthorizedUserDto) => {
    await add_user_mt.mutateAsync(values)
    form.resetFields()
    close()
  }

  return (
    <Drawer
      title="Agregar usuario"
      placement="right"
      onClose={close}
      open={is_open}
      width={420}
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        layout="horizontal"
        onFinish={handle_submit}
      >
        <Form.Item
          name={'name'}
          label="Nombre"
          required={true}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={'email'} label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'phone'} label="Telefono" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={'password'}
          label="Contraseña"
          rules={[{ required: true }]}
          extra="Sera solicitada cuando se quiera aprobar una orden"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 6, span: 18 }}
          className="flex justify-end"
          rules={[{ required: true }]}
        >
          <Button type="primary" htmlType="submit">
            Agregar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
