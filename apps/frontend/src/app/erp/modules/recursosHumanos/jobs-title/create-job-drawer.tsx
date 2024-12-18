import { rhApi } from '@/lib/api/rh'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input } from 'antd'
import { atom, useAtom } from 'jotai'
import type { JobTitle } from 'pizzadb'
import { toast } from 'react-toastify'

const { TextArea } = Input

const createJobAtom = atom<boolean>(false)

export const useCreateJob = () => {
  const [open, setOpen] = useAtom(createJobAtom)

  const close = () => setOpen(false)
  const manageOpen = () => setOpen(true)

  return {
    isOpen: open,
    open: manageOpen,
    close,
  }
}

export const CreateJobDrawer = ({ onCreate }: { onCreate?: () => void }) => {
  const { isOpen, close } = useCreateJob()
  const [form] = Form.useForm<JobTitle>()

  const createJobMt = useMutation({
    mutationFn: (jobTitle: JobTitle) => rhApi.createJobTitle(jobTitle),
    onSuccess: () => {
      close()
      onCreate?.()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onFinish = (values: any) => {
    createJobMt.mutate({
      ...values,
      status: 1,
    })
  }

  return (
    <Drawer open={isOpen} onClose={close} width={450}>
      <Form
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        name="jobtitle"
        onFinish={onFinish}
        initialValues={{
          description: '',
        }}
      >
        <Form.Item name={'name'} label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'description'} label={'Descripcion'}>
          <TextArea className="resize-none" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={createJobMt.isPending}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
