import { Button, Drawer, Form, Input } from 'antd'
import { atom, useAtom } from 'jotai'
import { useSeguridadStore } from './state'
import { IMockAuthorizedUser } from './type_mock'

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

export const AddUserDrawer = () => {
  const { is_open, close } = useAddUser()
  const [form] = Form.useForm()
  const users = useSeguridadStore((st) => st.users)
  const add_user = useSeguridadStore((st) => st.add_user)

  const handle_submit = (values: IMockAuthorizedUser) => {
    add_user({
      ...values,
      id: users.length + 1,
    })
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
