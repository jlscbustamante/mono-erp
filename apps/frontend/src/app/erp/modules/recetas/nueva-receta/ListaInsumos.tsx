import { Button, Card, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IngredienteProd } from '../shared-types'
import { gridStyle } from './styles'

export const ListaInsumos = ({
  ingredientesMFiltrados,
  transferIngredienteM,
  ingredienteMMostrado,
}: {
  ingredientesMFiltrados: IngredienteProd[]
  transferIngredienteM: (record: IngredienteProd) => void
  ingredienteMMostrado: (id: number) => void
}) => {
  //ingredientes filtrados por la busqueda
  /*const [ingredientesMFiltrados, setIngredientesMFiltrados] = useState<
    IngredienteProd[]
  >([])
    */

  //columnas de la tabla de ingredientes disponibles
  const columnsIngredientesM: ColumnsType = [
    {
      title: 'Id',
      dataIndex: 'id',
      className: '!p-1',
      hidden: true,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      className: '!p-1',
    },
    {
      title: 'Nombre',
      dataIndex: 'product',
      className: '!p-1',
    },
    {
      title: 'Add',
      align: 'center',
      className: '!p-1',
      render: (_, record) => (
        <Button
          onClick={() =>
            transferIngredienteM({
              id: record.id,
              product: record.product,
              category_id: record.category_id,
              unit_price: 1.0,
              measure_id: record.measure_id,
              status: 1,
            })
          }
        >
          +
        </Button>
      ),
    },
    {
      title: 'Measure Id',
      dataIndex: 'measure_id',
      className: '!p-1',
      hidden: true,
    },
    {
      title: 'Measure Name',
      dataIndex: 'measure_name',
      className: '!p-1',
      hidden: true,
    },
    {
      title: 'Category Id',
      dataIndex: 'category_id',
      className: '!p-1',
      hidden: true,
    },
  ]

  return (
    <>
      <Card style={gridStyle}>
        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                //console.log('Index : ' + rowIndex)
                //console.log('Record:')
                //console.table(record)
                ingredienteMMostrado(record.id)
              }, // click row
            }
          }}
          className="w-97 relative z-10"
          rowKey={(el) => el.id}
          size="small"
          bordered={true}
          pagination={false}
          columns={columnsIngredientesM}
          dataSource={ingredientesMFiltrados}
        />
      </Card>
    </>
  )
}
