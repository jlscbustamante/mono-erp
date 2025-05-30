import { Button, Card, DatePicker, Form, Input, Table, Tabs } from 'antd'

import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import { cn } from '@/utils'
import type { TabsProps } from 'antd'
import { Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'

const { Text } = Typography
interface MockIngrediente {
  name: string
  codigo: string
  cat: string
  measure_id: number
}

//campos de tabla inv_product de BD de produccion
interface IngredienteProd {
  id: number
  product: string
  category_id: number
  measure_id: number
  unit_price: number
  status: number
}

//campos de tabla inv_product de BD de desarrollo
interface IngredienteDev {
  id: number
  company_id: string
  product: string
  flavor_id: number
  size_id: number
  menuprod_id: number
  status: number
}

//para ser usado en la tabla de ingredientes de receta
interface IItem {
  code: number
  name: string
  collection: string
  quantity: number
  measure_id: number
}
//para ser usado en la tabla de ingredientes de receta
//solo para obtener la abreviatura
interface UMed {
  id: number
  nombre: string
  abr: string
}

export const NuevaRecetaTabs = () => {
  const [catSelected, setCatSelected] = useState(0)
  const [ingredientesR, setIngredientesR] = useState<IngredienteProd[]>([])
  const [ingredienteM, setIngredienteM] = useState<IngredienteProd[]>([])
  const onChange = (key: string) => {
    console.log('change :' + key)
  }

  //datos de unidad de medida
  const umeds: UMed[] = [
    {
      id: 1,
      nombre: 'gramo',
      abr: 'gr',
    },
    {
      id: 2,
      nombre: 'mililitro',
      abr: 'ml',
    },
    {
      id: 3,
      nombre: 'Kilogramo',
      abr: 'Kg',
    },
    {
      id: 4,
      nombre: 'Litro',
      abr: 'L',
    },
  ]

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
        <Button onClick={() => handleQuitarIngrediente(record.code)}>-</Button>
      ),
    },
  ]

  const handleTransferIngredienteM = (record: IngredienteProd) => {
    console.log('Código :')
    console.table(record)

    //validar que no este presente el ingrediente en la lista
    const estaIngrediente = ingredientesR.find((i) => i.id == record.id)

    if (estaIngrediente)
      console.log(
        'Ya esta presente en la receta el ingrediente ' + record.product,
      )
    else setIngredientesR([...ingredientesR, record])
  }

  const handleQuitarIngrediente = (code: number) => {
    setIngredientesR(ingredientesR.filter((item) => item.id != code))
  }

  const ingredienteMSelected = function leeData() {
    console.log('dato renovado')

    //setCatSelected
    //const jsonStr =
    ;('[{"name": "Leche", "cat": "latas","codigo":"code1","measure_id":2}, {"name": "Crema", "cat": "quesos","codigo":"code2","measure_id":1}, {"name": "Lechuga", "cat": "verduras","codigo":"code3","measure_id":1},{"name": "Tomate", "cat": "verduras","codigo":"code4","measure_id":1}]')

    //const query: IngredienteProd[] = JSON.parse(jsonStr)
    const query: IngredienteProd[] = ingredienteM

    let dataFiltered: IngredienteProd[]
    if (!catSelected) {
      return query ?? []
    } else {
      dataFiltered =
        query?.filter(
          (el: { category_id: number }) => el.category_id === catSelected,
        ) ?? []

      console.table(dataFiltered)

      return dataFiltered
    }

    // Parse JSON string to array of objects
    //const users = JSON.parse(jsonStr) as MockIngrediente[]
    //return users
  }

  const handleCustomFilters = (customFilter: number) => {
    console.log('Clic en :' + customFilter)
    setCatSelected(customFilter)
  }

  useEffect(() => {
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

  const PanelIzq = () => {
    return (
      <>
        <Card hoverable style={{ width: 600 }}>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Compañía">
                  <CompanySelectForm />
                </Form.Item>
              </div>
              <div className="flex-1 w-48 ...">
                <Form.Item label="Fecha">
                  <DatePicker />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Nombre de receta">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Producto de venta">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Form.Item label="Etiquetar como">
                  <Input />
                </Form.Item>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 w-48 ...">
                <Text>Ingredientes</Text>
              </div>
            </div>
          </Form>
          <Table
            className="w-104 relative z-10"
            rowKey={(el) => el.code}
            size="small"
            bordered={true}
            pagination={false}
            columns={columnsIngredientesR}
            dataSource={ingredientesR}
          ></Table>
        </Card>
      </>
    )
  }

  const PanelDer = () => {
    return (
      <>
        <Card style={{ width: 600 }}>
          {/* Caja de busqueda */}
          <Input.Search
            size="large"
            placeholder="buscar colección, ingredientes"
          />
          <Button
            color="default"
            variant="solid"
            className={cn(
              'bg-slate-200 px-2 py-0.5 text-sm text-slate-600 cursor-pointer select-none hover:bg-blue-300 hover:text-white w-14 text-center',
              {
                'bg-blue-500 hover:bg-blue-500 text-white':
                  'coleccion' === catSelected,
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
            dataSource={ingredienteMSelected()}
          />
        </Card>
      </>
    )
  }

  const RecetaProdFinal = () => {
    return (
      <div className="flex">
        <div className="flex-1 w-64 ...">
          <PanelIzq />
        </div>
        <div className="flex-1 w-64 ...">
          <PanelDer />
        </div>
      </div>
    )
  }

  const ColeccionIngredientes = () => {
    return <></>
  }

  //Items que contiene el Tab
  const itemsTab: TabsProps['items'] = [
    {
      key: '1',
      label: 'Receta de producto final',
      children: <RecetaProdFinal />,
    },
    {
      key: '2',
      label: 'Colección de ingredientes',
      children: <ColeccionIngredientes />,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ]

  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      items={itemsTab}
      onChange={onChange}
    />
  )
}
