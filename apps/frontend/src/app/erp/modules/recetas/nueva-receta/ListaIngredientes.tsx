import { IItem } from '@types'
import { Button, Input, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { umeds } from '../constants/constants'

export const ListaIngredientes = ({
  ingredientesR,
  quitarIngrediente,
  pOnInputChange,
}: {
  ingredientesR: IItem[]
  quitarIngrediente: (code: number) => void
  pOnInputChange: (key: string, index: number) => void
}) => {
  //columnas de la tabla de ingredientes de receta
  const columnsIngredientesR: ColumnsType = [
    {
      title: 'Id',
      dataIndex: 'id',
      className: '!p-1',
      hidden: true,
    },
    {
      title: 'Nro',
      className: '!p-1',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Ingrediente',
      dataIndex: 'item_name',
      className: '!p-1',
    },
    {
      title: 'Colección',
      dataIndex: 'coleccion',
      className: '!p-1',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      className: '!p-1',
      render: (text, _, index) => (
        <Input
          value={text}
          onChange={() => pOnInputChange('cantidad', index)}
        />
      ),
    },
    {
      title: 'UM',
      dataIndex: 'measure_id',
      className: '!p-1',
      render: (_, record) =>
        umeds.find((item) => item.id === record.measure_id)?.abr,
    },
    {
      className: '!p-1',
      render: (_, record) => (
        <Button onClick={() => quitarIngrediente(record.id)}>-</Button>
      ),
    },
  ]

  return (
    <Table
      className="w-104 relative z-10"
      rowKey={(el) => el.id}
      size="small"
      bordered={true}
      pagination={false}
      columns={columnsIngredientesR}
      dataSource={ingredientesR}
    ></Table>
  )
}
