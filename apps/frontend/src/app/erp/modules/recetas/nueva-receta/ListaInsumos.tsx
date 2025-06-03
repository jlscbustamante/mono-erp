import { Button, Card, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { gridStyle } from './styles'
import { IngredienteProd } from './types'

export const ListaInsumos = ({ ingredientesMFiltrados }) => {
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
            handleTransferIngredienteM({
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

  const handleTransferIngredienteM = (record: IngredienteProd) => {
    console.log('Código :')
    console.table(record)
    /*
    //validar que no este presente el ingrediente en la lista
    const estaIngrediente = ingredientesR.find((i) => i.id == record.id)

    if (estaIngrediente)
      console.log(
        'Ya esta presente en la receta el ingrediente ' + record.product,
      )
    else setIngredientesR([...ingredientesR, record])
    */
  }

  return (
    <>
      <span>Cantidad de insumos 2 : {ingredientesMFiltrados.length}</span>
      <Card style={gridStyle}>
        <Table
          className="w-97 relative z-10"
          rowKey={(el) => el.codigo}
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
