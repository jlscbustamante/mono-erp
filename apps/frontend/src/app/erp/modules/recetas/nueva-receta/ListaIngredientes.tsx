import { Button, Input, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ChangeEventHandler, Dispatch, SetStateAction } from 'react'
import { umeds } from '../constants/constants'
import { InvRecipeMix } from '../shared-types'

export const ListaIngredientes = ({
  pIngredientesR,
  pQuitarIngrediente,
  pOnInputChange,
  pSetIngredientesR,
}: {
  pIngredientesR: InvRecipeMix[]
  pQuitarIngrediente: (
    pcode: number,
    pIngredientesR: InvRecipeMix[],
    pSetIngredientesR: Dispatch<SetStateAction<InvRecipeMix[]>>,
  ) => void
  pOnInputChange: (
    key: string,
    index: number,
    pIngredientesR: InvRecipeMix[],
    pSetIngredientesR: Dispatch<SetStateAction<InvRecipeMix[]>>,
  ) => ChangeEventHandler<HTMLInputElement>
  pSetIngredientesR: Dispatch<SetStateAction<InvRecipeMix[]>>
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
      dataIndex: 'quantity',
      className: '!p-1',
      render: (_, record, index) => (
        <Input
          value={record.quantity}
          onChange={pOnInputChange(
            'quantity',
            index,
            pIngredientesR,
            pSetIngredientesR,
          )}
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
        <Button
          onClick={() =>
            pQuitarIngrediente(
              record.item_id,
              pIngredientesR,
              pSetIngredientesR,
            )
          }
        >
          -
        </Button>
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
      dataSource={pIngredientesR}
    ></Table>
  )
}
