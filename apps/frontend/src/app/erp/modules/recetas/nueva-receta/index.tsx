import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import type { TabsProps } from 'antd'
import { Card, DatePicker, Form, Input, Tabs, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { FiltrosInsumos } from './FiltrosInsumos'
import { ListaIngredientes } from './ListaIngredientes'
import { ListaInsumos } from './ListaInsumos'
import { gridStyle } from './styles'
import { IngredienteProd } from './types'

const { Text } = Typography

export const NuevaRecetaTabs = () => {
  const onChange = (key: string) => {
    console.log('change :' + key)
  }

  const PanelIzq = () => {
    const [ingredientesR, setIngredientesR] = useState<IngredienteProd[]>([])

    return (
      <>
        <Card hoverable style={gridStyle}>
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
          <ListaIngredientes />
        </Card>
      </>
    )
  }

  const PanelDer = ({ listaInsumos, childToParent }) => {
    const data = 'This is data from Child Component to the Parent Component.'
    return (
      <>
        <div>
          <h2>titulo</h2>
          <FiltrosInsumos childToParent={childToParent} />
        </div>
        <span>Cantidad de insumos : {listaInsumos.length}</span>
        <ListaInsumos ingredientesMFiltrados={listaInsumos} />
      </>
    )
  }

  const RecetaProdFinal = () => {
    const [catSelected, setCatSelected] = useState(0)
    const [needle, setNeedle] = useState('')
    const [datax, setDatax] = useState('')
    /*const childToParent = (childdata) => {
      //setDatax(childdata)
      setNeedle(childdata)
      setCatSelected(3)
      
    }*/
    const [ingredienteM, setIngredienteM] = useState<IngredienteProd[]>([])
    //ingredientes filtrados por la busqueda
    const [ingredienteMFiltrado, setIngredienteMFiltrado] = useState<
      IngredienteProd[]
    >([])

    const ingredienteMSelected = function leeData(catSelected, needle) {
      console.log('dato renovado')
      setNeedle(needle)
      setCatSelected(catSelected)

      const query: IngredienteProd[] = ingredienteM

      const dataFiltered: IngredienteProd[] =
        query?.filter((el: IngredienteProd) => {
          console.log('el.category_id : ' + el.category_id)
          console.log('el.product : ' + el.product)
          let out: IngredienteProd
          if (!catSelected) {
            if (el.product.toLowerCase().includes(needle.toLowerCase()))
              out = el
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
      <div className="flex">
        {datax}
        <div className="flex-1 w-64 ...">
          <PanelIzq />
        </div>
        <div className="flex-1 w-64 ...">
          <PanelDer
            listaInsumos={ingredienteMFiltrado}
            childToParent={ingredienteMSelected}
          />
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
      children: '',
    },
  ]

  return (
    <>
      <div>
        <span>Qué receta desea crear hoy?</span>
      </div>
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={itemsTab}
        onChange={onChange}
      />
    </>
  )
}
