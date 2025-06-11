import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import type { TabsProps } from 'antd'
import { Card, DatePicker, Form, Input, Tabs, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { IngredienteProd, InsumoItem } from '../shared-types'
import { DetalleInsumo } from './DetalleInsumo'
import { FiltrosInsumos } from './FiltrosInsumos'
import { ListaIngredientes } from './ListaIngredientes'
import { ListaInsumos } from './ListaInsumos'
import { gridStyle } from './styles'

const { Text } = Typography

export const NuevaRecetaTabs = () => {
  const onChange = () => {
    //console.log('change :' + key)
  }

  const PanelIzq = ({
    ingredientesR,
    quitarIngrediente,
  }: {
    ingredientesR: IngredienteProd[]
    quitarIngrediente: (code: number) => void
  }) => {
    return (
      <>
        <Card hoverable style={gridStyle}>
          <Form
            labelCol={{ span: 6 }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <div className="grid grid-cols-12 gap-2 items-start">
              <Form.Item className="col-span-8 mb-1" label="Compañía">
                <CompanySelectForm />
              </Form.Item>

              <Form.Item className="col-span-4 mb-1" label="Fecha">
                <DatePicker />
              </Form.Item>

              <Form.Item className="col-span-12 mb-1" label="Nombre de receta">
                <Input />
              </Form.Item>

              <Form.Item className="col-span-12 mb-1" label="Producto de venta">
                <Input />
              </Form.Item>

              <Form.Item className="col-span-12 mb-1" label="Etiquetar como">
                <Input />
              </Form.Item>
              <Form.Item
                className="col-span-12 mb-1"
                label="Ingredientes"
              ></Form.Item>
            </div>
          </Form>
          <ListaIngredientes
            ingredientesR={ingredientesR}
            quitarIngrediente={quitarIngrediente}
          />
        </Card>
      </>
    )
  }

  const PanelDer = ({
    listaInsumos,
    childToParent,
    childToParent2,
    childToParent3,
    ingredienteM,
    drawerOpen,
    drawerClose,
  }: {
    listaInsumos: IngredienteProd[]
    childToParent: (pCatSelected: number, pNeedle: string) => IngredienteProd[]
    childToParent2: (record: IngredienteProd) => void
    childToParent3: (id: number) => void
    ingredienteM: InsumoItem[]
    drawerOpen: boolean
    drawerClose: () => void
  }) => {
    return (
      <>
        <div>
          <FiltrosInsumos childToParent={childToParent} />
        </div>

        <ListaInsumos
          ingredientesMFiltrados={listaInsumos}
          transferIngredienteM={childToParent2}
          ingredienteMMostrado={childToParent3}
        />
        <DetalleInsumo
          data={ingredienteM}
          drawerOpen={drawerOpen}
          drawerClose={drawerClose}
          oper={1}
        />
      </>
    )
  }

  const RecetaProdFinal = () => {
    //const [catSelected, setCatSelected] = useState(0)
    //const [needle, setNeedle] = useState('')
    //const [datax, setDatax] = useState('')
    const [ingredientesR, setIngredientesR] = useState<IngredienteProd[]>([])

    /*const childToParent = (childdata) => {
      //setDatax(childdata)
      setNeedle(childdata)
      setCatSelected(3)
      
    }*/
    const [ingredientesM, setIngredientesM] = useState<IngredienteProd[]>([])
    //ingredientes filtrados por la busqueda
    const [ingredientesMFiltrados, setIngredientesMFiltrados] = useState<
      IngredienteProd[]
    >([])

    const [ingredienteMMostrado, setIngredienteMMostrado] = useState<
      InsumoItem[]
    >([])

    //los items que forman parte de un ingredienteM con receta o coleccion
    const [ingredientesMItems, setIngredientesMItems] = useState<InsumoItem[]>(
      [],
    )

    const [drawerOpen, setDrawerOpen] = useState(false)

    const ingredientesMSelected = (catSelected: number, needle: string) => {
      //console.log('dato renovado')
      //setNeedle(needle)
      //setCatSelected(catSelected)

      const query: IngredienteProd[] = ingredientesM

      const dataFiltered: IngredienteProd[] =
        query?.filter((el: IngredienteProd) => {
          // console.log('el.id : ' + el.id)
          // console.log('el.category_id : ' + el.category_id)
          // console.log('el.product : ' + el.product)
          let out: IngredienteProd | undefined
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
          if (out) {
            return true
          }
          return false
        }) ?? []

      //console.table(dataFiltered)

      setIngredientesMFiltrados(dataFiltered)

      return dataFiltered
    } //ingredientesMSelected

    const handleTransferIngredientesM = (record: IngredienteProd) => {
      //console.log('Código :')
      //console.table(record)

      //validar que no este presente el ingrediente en la lista
      /*const estaIngrediente = ingredientesR.find(
        (i: IngredienteProd) => i.id == record.id,
      )*/
      let estaIngrediente: boolean = false

      //validar si el item encontrado tiene receta
      //TODO : esto se reducira a la validacion de un solo campo
      const tempItems: InsumoItem[] = ingredientesMItems.filter(
        (i) => i.product_id == record.id,
      )

      const tempItems2: IngredienteProd[] = tempItems.map((i) => {
        const j: IngredienteProd = {
          category_id: record.category_id,
          product: i.product,
          id: i.id,
          measure_id: record.measure_id,
          unit_price: record.unit_price,
          status: i.status,
        }

        return j
      })

      //Fin TODO
      //validar el flag que indica que el item tiene receta
      if (tempItems2.length >= 1) {
        //agregar varios items

        for (let i = 0; i < ingredientesR.length; i++) {
          estaIngrediente = tempItems2.some(
            (i2: IngredienteProd) => i2.id === ingredientesR[i].id,
          )
          if (estaIngrediente) break
        }

        //Si en la lista de ingredientes (derecha) no esta ningun
        //item del item(con receta) por agregar
        //entonces se agrega a esa lista
        if (!estaIngrediente) {
          setIngredientesR([...ingredientesR, ...tempItems2])
        }
      } else {
        //validar que no este presente el ingrediente en la lista
        estaIngrediente = ingredientesR.some(
          (i: IngredienteProd) => i.id == record.id,
        )

        if (!estaIngrediente) {
          setIngredientesR([...ingredientesR, record])
        }
      }
    }

    const handleShowItems = (id: number) => {
      //console.log('Id mostrado :' + id)
      //console.table(ingredientesMItems)
      const estaIngredienteM = ingredientesMItems.filter(
        (i: InsumoItem) => i.product_id == id,
      )
      //console.log('Items encontrados :' + id)
      //console.table(estaIngredienteM)
      if (estaIngredienteM.length >= 1) {
        setIngredienteMMostrado(estaIngredienteM)
        setDrawerOpen(true)
      }
    }

    const handleDrawerClose = () => {
      setIngredienteMMostrado([])
      setDrawerOpen(false)
    }

    const handleQuitarIngrediente = (code: number) => {
      setIngredientesR(
        ingredientesR.filter((item: IngredienteProd) => item.id != code),
      )
    }

    useEffect(() => {
      console.log('componente renderizado')
      const fetchData = async () => {
        try {
          const response = await fetch('/inv_product.json')
          const jsonData = await response.json()
          setIngredientesM(jsonData) // Almacenamos los datos en el estado
          //setLoading(false) // Desactivamos el estado de carga
        } catch (err) {
          //setError('Error al cargar datos') // Capturamos cualquier error
          //setLoading(false) // Desactivamos el estado de carga en caso de error
        }
      }

      const fetchDataItems = async () => {
        try {
          const response = await fetch('/inv_menu_items.json')
          const jsonData = await response.json()
          setIngredientesMItems(jsonData) // Almacenamos los datos en el estado
          //setLoading(false) // Desactivamos el estado de carga
        } catch (err) {
          //setError('Error al cargar datos') // Capturamos cualquier error
          //setLoading(false) // Desactivamos el estado de carga en caso de error
        }
      }

      fetchData()
      fetchDataItems()
    }, [])
    return (
      <div className="flex">
        <div className="flex-1 w-64 ...">
          <PanelIzq
            ingredientesR={ingredientesR}
            quitarIngrediente={handleQuitarIngrediente}
          />
        </div>
        <div className="flex-1 w-64 ...">
          <PanelDer
            listaInsumos={ingredientesMFiltrados}
            childToParent={ingredientesMSelected}
            childToParent2={handleTransferIngredientesM}
            childToParent3={handleShowItems}
            ingredienteM={ingredienteMMostrado}
            drawerOpen={drawerOpen}
            drawerClose={handleDrawerClose}
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
      <div className="flex">
        <span className="p-5">Qué receta desea crear hoy?</span>
        <span>&nbsp;</span>
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
