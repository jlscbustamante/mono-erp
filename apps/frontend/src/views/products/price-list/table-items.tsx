import { Table } from 'antd'
import { MdEdit } from 'react-icons/md'
import { useEditPrice } from './edit-price'
import { usePrincipalItems } from './use-principal'

export const PrincipalListTable = () => {
  const { open } = useEditPrice()

  const query = usePrincipalItems()

  return (
    <>
      <Table
        size="small"
        pagination={false}
        dataSource={query.data}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
          },
          {
            title: 'Nombre',
            dataIndex: 'itemName',
            sorter: (a, b) => a.itemName.localeCompare(b.itemName),
          },
          {
            title: 'Costo',
            dataIndex: 'unitCost',
            sorter: (a, b) => a.unitCost - b.unitCost,
          },
          {
            title: 'Precio',
            dataIndex: 'unitPrice',
            sorter: (a, b) => a.unitPrice - b.unitPrice,
          },
          {
            title: 'Acciones',
            render: (_, record) => (
              <MdEdit
                onClick={() => open(record)}
                className="w-5 h-auto cursor-pointer"
              />
            ),
          },
        ]}
      />
    </>
  )
}
