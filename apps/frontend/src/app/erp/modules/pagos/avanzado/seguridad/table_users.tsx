import { viewClient } from '@/lib/rpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ISelectMockAuthorizedUserDto } from '@types'
import { Modal, Table } from 'antd'
import { AddUserDrawer } from './add_user_drawer'

export const TableUsers = () => {
  const { data: users, refetch } = useQuery({
    queryKey: ['req:sec:users'],
    queryFn: async () => {
      const req = await viewClient.api.view.payment.order.authorized_user.$get()
      const data = await req.json()
      if (!req.ok) {
        throw new Error(data.message)
      }
      return data.data as ISelectMockAuthorizedUserDto[]
    },
  })

  const remove_user_mt = useMutation({
    mutationFn: async (id: number) => {
      const req =
        await viewClient.api.view.payment.order.authorized_user.$delete({
          json: { id },
        })
      if (!req.ok) {
        const data = await req.json()
        throw new Error(data.message)
      }
    },
    onSuccess: () => {
      refetch()
    },
  })

  const remove_user = async (id: number) => {
    await remove_user_mt.mutateAsync(id)
  }

  return (
    <div>
      <Table
        dataSource={users}
        rowKey={'id'}
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Nombre',
            dataIndex: 'name',
          },
          {
            title: 'Email',
            dataIndex: 'email',
          },
          {
            title: 'Telefono',
            dataIndex: 'phone',
          },
          {
            width: 100,
            render: (_, record) => {
              return (
                <div>
                  <p
                    // onClick={() => remove_user(record.id)}
                    onClick={() =>
                      Modal.confirm({
                        title: 'Eliminar usuario',
                        content: `¿Estas seguro de eliminar el usuario ${record.name}?`,
                        onOk: () => remove_user(record.id),
                      })
                    }
                    className="hover:underline text-blue-500 cursor-pointer text-center"
                  >
                    Remover
                  </p>
                </div>
              )
            },
          },
        ]}
      />
      <AddUserDrawer refetch={() => refetch()} />
    </div>
  )
}
