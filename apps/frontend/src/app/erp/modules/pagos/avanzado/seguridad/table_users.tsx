import { Modal, Table } from 'antd'
import { useSeguridadStore } from './state'

export const TableUsers = () => {
  const users = useSeguridadStore((st) => st.users)
  const set_users = useSeguridadStore((st) => st.set_users)

  const remove_user = (id: number) => {
    const new_users = users.filter((user) => user.id !== id)
    set_users(new_users)
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
    </div>
  )
}
