import { cn } from '@/utils'
import { Button, Card, Input, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ChangeEvent, useEffect, useState } from 'react'
import { gridStyle } from './styles'
import { IngredienteProd } from './types'

export const ListaInsumos = () => {
  const [catSelected, setCatSelected] = useState(0)
  const [ingredienteM, setIngredienteM] = useState<IngredienteProd[]>([])
  //ingredientes filtrados por la busqueda
  const [ingredienteMFiltrado, setIngredienteMFiltrado] = useState<
    IngredienteProd[]
  >([])
  const [needle, setNeedle] = useState('')

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

  const ingredienteMSelected = function leeData() {
    console.log('dato renovado')
    console.log('catSel : ' + catSelected)
    console.log('Needle : ' + needle)
    const query: IngredienteProd[] = ingredienteM

    let dataFiltered: IngredienteProd[]
    dataFiltered =
      query?.filter((el: IngredienteProd) => {
        console.log('el.category_id : ' + el.category_id)
        console.log('el.product : ' + el.product)
        let out: IngredienteProd
        if (!catSelected) {
          if (el.product.toLowerCase().includes(needle.toLowerCase())) out = el
        } else {
          if (
            el.category_id === catSelected &&
            el.product.toLowerCase().includes(needle.toLowerCase())
          ) {
            out = el
          }
        }
        return out
      }) ?? []

    console.table(dataFiltered)

    setIngredienteMFiltrado(dataFiltered)

    return dataFiltered
  }

  //manejador de eventos de la caja de busqueda
  const handleNeedle = (event: ChangeEvent<HTMLInputElement>) => {
    const needle = event.target.value.trim()
    console.log('texto buscado' + needle)
    setNeedle(needle)
  }

  const handleCustomFilters = (customFilter: number) => {
    console.log('Clic en :' + customFilter)
    setCatSelected(customFilter)
  }

  useEffect(() => {
    console.log('componente renderizado')
    const fetchData = async () => {
      try {
        const response = await fetch('/inv_product.json')
        const jsonData = await response.json()
        setIngredienteM(jsonData) // Almacenamos los datos en el estado
        //setLoading(false) // Desactivamos el estado de carga
      } catch (err) {
        //setError('Error al cargar datos') // Capturamos cualquier error
        //setLoading(false) // Desactivamos el estado de carga en caso de error
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Card style={gridStyle}>
        {/* Caja de busqueda */}
        <Input.Search
          size="large"
          value={needle}
          onSearch={ingredienteMSelected}
          placeholder="buscar colección, ingredientes"
          onChange={handleNeedle}
        />
        <Button
          color="default"
          variant="solid"
          className={cn(
            'bg-slate-200 px-2 py-0.5 text-sm text-slate-600 cursor-pointer select-none hover:bg-blue-300 hover:text-white w-14 text-center',
            {
              'bg-blue-500 hover:bg-blue-500 text-white': 22 === catSelected,
            },
          )}
          onClick={() => handleCustomFilters(22)}
        >
          Colección
        </Button>
        <Button
          color="default"
          variant="solid"
          onClick={() => handleCustomFilters(9)}
        >
          Quesos
        </Button>
        <Button
          color="default"
          variant="solid"
          onClick={() => handleCustomFilters(3)}
        >
          Latas
        </Button>
        <Button
          color="default"
          variant="solid"
          onClick={() => handleCustomFilters(8)}
        >
          Verduras
        </Button>

        <Table
          className="w-97 relative z-10"
          rowKey={(el) => el.codigo}
          size="small"
          bordered={true}
          pagination={false}
          columns={columnsIngredientesM}
          dataSource={ingredienteMFiltrado}
        />
      </Card>
    </>
  )
}
