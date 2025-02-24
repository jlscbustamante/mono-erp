import { Input, Table } from 'antd'
import { useMemo, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { useEditPrice } from './edit-price'
import { usePrincipalItems } from './use-principal'

export const PrincipalListTable = () => {
  const { open } = useEditPrice()
  const [search, setSearch] = useState('')

  const query = usePrincipalItems()

  const data = useMemo(() => {
    return query.data?.filter((item) => {
      return item.itemName.toLowerCase().includes(search.toLowerCase())
    })
  }, [query.data, search])

  return (
    <>
      <div className="flex justify-start mb-3">
        <Input
          placeholder="Item"
          addonBefore="Nombre"
          className="w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        size="small"
        pagination={false}
        dataSource={data}
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
