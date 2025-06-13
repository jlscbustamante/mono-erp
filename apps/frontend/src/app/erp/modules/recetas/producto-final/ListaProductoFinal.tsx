import { Table } from 'antd'
import { MdEdit } from 'react-icons/md'
import { useRecoilValue } from 'recoil'
import { InvRecipe } from '../shared-types'
import { filterIFilterInvRecipe } from '../state/recipe'

export const ListaProductoFinal = ({
  pHandleEditClick,
}: {
  pHandleEditClick: (record: InvRecipe) => void
}) => {
  const data = useRecoilValue(filterIFilterInvRecipe)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 25,
    },
    {
      title: 'Receta',
      dataIndex: 'recipe',
      key: 'name',
      width: 380,
    },
    {
      title: 'Producto venta',
      dataIndex: 'menu_item_id',
      key: 'menu_item_id',
      width: 380,
    },
    {
      title: 'Categoria',
      dataIndex: 'category_id',
      key: 'menu_item_id',
      width: 380,
    },
    {
      title: 'Etiqueta',
      dataIndex: 'save_tag',
      key: 'type_category_id',
      width: 120,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 40,
      render: (text: string) => (
        <span>{text == 'A' ? 'Activo' : 'Inactivo'}</span>
      ),
    },

    {
      title: '',
      dataIndex: 'id',
      key: 'editar',
      width: 15,
      render: (_text: any, record: any) => (
        <MdEdit
          onClick={() => pHandleEditClick(record)}
          style={{
            fontSize: '20px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
          className="icon"
        />
      ),
    },
  ]

  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={data}
      rowKey="id"
      size="small"
      style={{ marginTop: '-15px' }}
    />
  )
}
