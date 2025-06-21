import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import { cn } from '@/utils/cn'
import type { TabsProps } from 'antd'
import { Button, Card, DatePicker, Form, Input, Space, Tabs } from 'antd'
import { ChangeEvent, useEffect, useState } from 'react'
import { IngredienteProd, InsumoItem } from '../shared-types'
import { DetalleInsumo } from './DetalleInsumo'
import { ListaIngredientes } from './ListaIngredientes'
import { gridStyle } from './styles'
//import lista de insumos
import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { IListaInsumo } from '@types'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

//fin de import de lista de insumos

export const NuevaRecetaTabs = () => {
  const onChange = () => {
    //console.log('change :' + key)
  }

  const RecetaProdFinal = () => {
    //Para lista de ingredientes de receta
    const [ingredientesR, setIngredientesR] = useState<IngredienteProd[]>([])

    const [ingredientesM, setIngredientesM] = useState<IListaInsumo[]>([])
    //ingredientes filtrados por la busqueda
    const [ingredientesMFiltrados, setIngredientesMFiltrados] = useState<
      IListaInsumo[]
    >([])

    const [ingredienteMMostrado, setIngredienteMMostrado] = useState<
      InsumoItem[]
    >([])

    //los items que forman parte de un ingredienteM con receta o coleccion
    const [ingredientesMItems, setIngredientesMItems] = useState<InsumoItem[]>(
      [],
    )
    const [drawerOpen, setDrawerOpen] = useState(false)

    //Inicio de manejadores de Lista de insumos
    const ingredientesMSelected = (catSelected: number, needle: string) => {
      console.log('dato renovado')
      //setNeedle(needle)
      //setCatSelected(catSelected)

      const query: IListaInsumo[] = ingredientesM
      console.log('lucanas')
      console.table(query)
      const dataFiltered: IListaInsumo[] =
        query?.filter((el: IListaInsumo) => {
          //console.log('el.id : ' + el.id)
          // console.log('el.category_id : ' + el.category_id)
          console.log('el.item_name : ' + el.item_name)
          let out: IListaInsumo | undefined
          if (!catSelected) {
            if (el.item_name.toLowerCase().includes(needle.toLowerCase()))
              out = el
          } else {
            if (
              el.category_id === catSelected &&
              el.item_name.toLowerCase().includes(needle.toLowerCase())
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
      console.log('Items encontrados :' + id)
      //console.table(estaIngredienteM)
      console.log('drawerOpen:' + drawerOpen)
      if (estaIngredienteM.length >= 1) {
        setIngredienteMMostrado(estaIngredienteM)
        setDrawerOpen(true)
      }
    }
    //Fin de manejadores de Lista de insumos

    //Manejadores de DetalleInsumo
    const handleDrawerClose = () => {
      setIngredienteMMostrado([])
      setDrawerOpen(false)
    }
    //Fin de manejadores de DetalleInsumo

    //Manejadores de lista de receta
    //boton quitar elemento de lista de receta
    const handleQuitarIngrediente = (code: number) => {
      setIngredientesR(
        ingredientesR.filter((item: IngredienteProd) => item.id != code),
      )
    }
    //boton quitar elemento de lista de receta
    //Fin de manejadores de lista de receta

    //Inicio de Filtros insumos
    const [catSelected, setCatSelected] = useState(0)
    const [needle, setNeedle] = useState('')

    //.. childToParent es una funcion que es enviada porel padre para
    //.. que desde el hijo se envien datos

    //.. manejador de eventos de la caja de busqueda
    const handleNeedle = (event: ChangeEvent<HTMLInputElement>) => {
      const needle = event.target.value.trim()
      console.log('texto buscado' + needle)
      setNeedle(needle)
    }

    const handlePredefinedFilters = (customFilter: number) => {
      console.log('Clic en :' + customFilter)
      setCatSelected(customFilter)
    }
    //Fin de Filtros insumos

    //Inicio de lista de insumos
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
              handleTransferIngredientesM({
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

    //Fin de lista de insumos

    const respuesta = useQuery({
      queryKey: ['req:rs:recipe-list-insumos'],
      queryFn: async () => {
        const req = await viewClient.api.view.recipe.filter.insumos.$get()
        const body = await req.json()
        // {
        // message : 'ok',
        // dotr : [] true, {}
        //}
        return body.data as IListaInsumo[]
      },
    })

    setIngredientesM(respuesta.data[0])

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

      //const IListaInsumos[] = useQuery({
      /*
      

      */
      //fetchData()
      fetchDataItems()
    }, [])
    return (
      <div className="flex">
        <div className="flex-1 w-64 ...">
          {/* Inicio de lista de ingredientes de receta */}
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

                <Form.Item
                  className="col-span-12 mb-1"
                  label="Nombre de receta"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  className="col-span-12 mb-1"
                  label="Producto de venta"
                >
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
              quitarIngrediente={handleQuitarIngrediente}
            />
          </Card>

          {/* Fin de lista de ingredientes de receta  */}
        </div>
        <div className="flex-1 w-64 ...">
          {/*Inicio de filtros de insumos*/}
          {/* Caja de busqueda */}
          <h1>{respuesta.data?.[0].fecha}</h1>
          <Input.Search
            size="large"
            value={needle}
            allowClear
            onSearch={() => ingredientesMSelected(catSelected, needle)}
            placeholder="buscar colección, ingredientes"
            onChange={handleNeedle}
          />
          <Space>
            <Button
              className={cn(
                'bg-slate-200 px-2 py-0.5 text-sm text-slate-600 cursor-pointer select-none hover:bg-blue-300 hover:text-white w-20 text-center',
                {
                  'bg-blue-500 hover:bg-blue-500 text-white':
                    22 === catSelected,
                },
              )}
              onClick={() => handlePredefinedFilters(22)}
            >
              Colección
            </Button>
            <Button
              // color="default"
              // variant="solid"
              onClick={() => handlePredefinedFilters(9)}
            >
              Quesos
            </Button>
            <Button onClick={() => handlePredefinedFilters(3)}>Latas</Button>
            <Button onClick={() => handlePredefinedFilters(8)}>Verduras</Button>
          </Space>
          {/*Fin de filtros de insumos*/}

          {/* Lista de insumos */}
          <Card style={gridStyle}>
            <Table
              onRow={(record) => {
                return {
                  onClick: () => {
                    //console.log('Index : ' + rowIndex)
                    //console.log('Record:')
                    //console.table(record)
                    handleShowItems(record.id)
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
          {/* Fin de lista de insumos */}

          {/* Drawer con detalle de insumo con receta */}
          <DetalleInsumo
            data={ingredienteMMostrado}
            drawerOpen={drawerOpen}
            drawerClose={handleDrawerClose}
            oper={4}
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
