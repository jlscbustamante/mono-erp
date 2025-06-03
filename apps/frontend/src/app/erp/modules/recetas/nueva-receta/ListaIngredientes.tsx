import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { IngredienteProd } from './types'

export const ListaIngredientes = () => {
  const [ingredientesR, setIngredientesR] = useState<IngredienteProd[]>([])
  const onChange = (key: string) => {
    console.log('change :' + key)
  }

  //columnas de la tabla de ingredientes de receta
  const columnsIngredientesR: ColumnsType = [
    {
      title: 'Nro',
      className: '!p-1',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Ingrediente',
      dataIndex: 'product',
      className: '!p-1',
    },
    {
      title: 'Colección',
      dataIndex: 'coleccion',
      className: '!p-1',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      className: '!p-1',
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
        <Button onClick={() => handleQuitarIngrediente(record.id)}>-</Button>
      ),
    },
  ]

  const handleQuitarIngrediente = (code: number) => {
    setIngredientesR(ingredientesR.filter((item) => item.id != code))
  }
  return (
    <Table
      className="w-104 relative z-10"
      rowKey={(el) => el.code}
      size="small"
      bordered={true}
      pagination={false}
      columns={columnsIngredientesR}
      dataSource={ingredientesR}
    ></Table>
  )
}
