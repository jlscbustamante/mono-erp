import { CompanySelectForm } from '@/app/erp/modules/requerimientos/components/company-select'
import { cn } from '@/utils/cn'
import type { TabsProps } from 'antd'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Tabs,
} from 'antd'
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { DetalleInsumo } from './DetalleInsumo'
import { ListaIngredientes } from './ListaIngredientes'
import { gridStyle } from './styles'
//import lista de insumos
import config from '@/config'
import { IItem, IListaInsumo } from '@types'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ProductSelectForm } from '../components/menu-product-select'
import { InvRecipeMix, InvRecollection } from '../shared-types'
//fin de import de lista de insumos

export const NuevaRecetaTabs = () => {
  const onChange = () => {
    //console.log('change :' + key)
  }

  //Inicio de Filtros insumos

  //.. manejador de eventos de la caja de busqueda
  const handleNeedle = (
    event: ChangeEvent<HTMLInputElement>,
    pSetNeedle: Dispatch<SetStateAction<string>>,
  ): ChangeEventHandler<HTMLInputElement> => {
    const needle = event.target.value.trim()
    //console.log('texto buscado' + needle)
    pSetNeedle(needle)
  }

  const handlePredefinedFilters = (
    customFilter: number,
    pSetCatSelected: Dispatch<SetStateAction<number>>,
  ) => {
    //console.log('Clic en :' + customFilter)
    pSetCatSelected(customFilter)
  }
  //Fin de Filtros insumos

  const handleTransferIngredientesM = async (
    record: InvRecipeMix,
    urlApi: string = '/api/view/recipe/items',
    pListaDestino: InvRecipeMix[],
    pSetListaDestino: Dispatch<SetStateAction<InvRecipeMix[]>>,
  ) => {
    console.log('Código :')
    console.table('Api : ' + urlApi)
    console.table(record)

    //validar que no este presente el ingrediente en la lista
    /*const estaIngrediente = ingredientesR.find(
        (i: IItem) => i.id == record.id,
      )*/
    let estaIngrediente: boolean = false

    //validar si el item encontrado tiene receta
    //TODO : esto se reducira a la validacion de un solo campo

    //aqui va el fetch duplicado por mientras
    //campos devueltos :
    //ii.id, ii.item_name, imi.category_id,irm.measure_id
    let recipe_req: number = 0
    let product_id = undefined
    let recollection_id = undefined

    if (record.product_id === null || record.product_id === undefined) {
      product_id = null
      recipe_req = 0
    } else {
      product_id = record.product_id
      recipe_req = 1
    }

    if (record.recollection_id === null || record.recollection_id === undefined)
      recollection_id = null
    else recollection_id = record.recollection_id

    if (product_id === null && recollection_id === null) {
      product_id = -1
      recollection_id = -1
    }
    //console.log('OKss' + product_id + '|' + recollection_id + '|' + recipe_req )

    //urlApi: es la urls de donde se obtienen los items de un elemento con receta
    const response = await fetch(
      config.apiV2 +
        urlApi +
        '?product_id=' +
        product_id +
        '&recipe_req=' +
        recipe_req +
        '&recollection_id=' +
        recollection_id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
        },
      },
    )
    const respuesta = await response.json()
    //Lista de insumo de producto con receta
    const listaInsumos = respuesta.data
    const tempItems2: InvRecipeMix[] = listaInsumos.map((i: any) => {
      /*const j: IItem = {
          id: i.id,
          item_name: i.item_name,
          status: i.status,
        }*/
      /*
        console.table('conversion a InvREcipeMix')
        console.table('i any')
        console.table(i)
        */
      const j: InvRecipeMix = {
        id: undefined,
        product_id: i.product_id,
        product: i.product,
        category_id: i.category_id,
        category: (i as any).category,
        recipe_id: i.recipe_id,
        recipe_group: undefined,
        recipe_base: undefined,
        recollection_id: i.recollection_id,
        collection: i.collection,
        item_id: i.item_id,
        item_name: i.item_name,
        quantity: i.quantity,
        presentation_id: undefined,
        measure_id: i.measure_id,
        status: 1,
      }
      return j
    })

    //console.log('Lista insumos')
    //console.log(tempItems2.length)
    //console.table(tempItems2)
    //Fin TODO
    //validar el flag que indica que el item tiene receta
    if (tempItems2.length >= 1) {
      //agregar varios items

      for (let i = 0; i < pListaDestino.length; i++) {
        estaIngrediente = listaInsumos.some(
          (i2: InvRecipeMix) => i2.item_id === pListaDestino[i].item_id,
        )
        if (estaIngrediente) break
      }

      //Si en la lista de ingredientes (derecha) no esta ningun
      //item del item(con receta) por agregar
      //entonces se agrega a esa lista

      const ingredientesInsumos: InvRecipeMix[] = tempItems2.map(
        (insumo: InvRecipeMix) => {
          const tmp: InvRecipeMix = {
            id: undefined,
            product_id: insumo.product_id,
            product: insumo.product,
            category_id: insumo.category_id,
            category: insumo.category,
            recipe_id: insumo.recipe_id,
            recipe_group: undefined,
            recipe_base: undefined,
            recollection_id: insumo.recollection_id,
            collection: insumo.collection,
            item_id: insumo.item_id,
            item_name: insumo.item_name,
            quantity: insumo.quantity,
            presentation_id: undefined,
            measure_id: insumo.measure_id,
            status: 1,
          }
          return tmp
        },
      )
      if (!estaIngrediente) {
        //console.log('Ingrediente insumo')
        //console.table(ingredienteInsumo)

        //metodo reusable
        //setIngredientesR([...ingredientesR, ...ingredientesInsumos])
        pSetListaDestino([...pListaDestino, ...ingredientesInsumos])
      }
    } else {
      //validar que no este presente el ingrediente en la lista
      //console.log('item single')
      //console.table(record)
      estaIngrediente = pListaDestino.some(
        (i: InvRecipeMix) => i.item_id == record.item_id,
      )

      if (!estaIngrediente) {
        //llamada reusable
        pSetListaDestino([
          ...pListaDestino,
          {
            id: undefined,
            product_id: record.product_id,
            product: record.product,
            category_id: record.category_id,
            category: record.category,
            recipe_id: record.recipe_id,
            recipe_group: undefined,
            recipe_base: undefined,
            recollection_id: record.recollection_id,
            collection: record.collection,
            item_id: record.item_id,
            item_name: record.item_name,
            quantity: record.quantity,
            presentation_id: undefined,
            measure_id: record.measure_id,
            status: 1,
          },
        ])
        /*
          setIngredientesR([
            ...ingredientesR,
            {
              id: undefined,
              product_id: record.product_id,
              product: record.product,
              category_id: record.category_id,
              category: record.category,
              recipe_id: record.recipe_id,
              recipe_group: undefined,
              recipe_base: undefined,
              recollection_id: record.recollection_id,
              collection: record.collection,
              item_id: record.item_id,
              item_name: record.item_name,
              quantity: record.quantity,
              presentation_id: undefined,
              measure_id: record.measure_id,
              status: 1,
            },
          ])
            */
      }
    }
  }

  //Inicio de manejadores de Lista de insumos
  const handleShowItems = async (
    id: number,
    oper: number,
    urlApi: string = '/api/view/recipe/items',
    pSetIngredienteMMostrado: Dispatch<SetStateAction<IItem[]>>,
    pSetDrawerOpen: Dispatch<SetStateAction<boolean>>,
  ) => {
    //console.log('Id mostrado :' + id)
    //console.table(ingredientesMItems)
    ///items", async (c) => {
    //const param1 = c.req.query("item_id

    if (oper == 1) {
      const response = await fetch(config.apiV2 + urlApi + '?item_id=' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
        },
      })
      const respuesta = await response.json()

      if (respuesta.data.length >= 1) {
        //
        //setIngredienteMMostrado(estaIngredienteM)
        pSetIngredienteMMostrado(respuesta.data)
        pSetDrawerOpen(true)
      }
    }
  }
  //Fin de manejadores de Lista de insumos

  //Manejadores de DetalleInsumo
  const handleDrawerClose = (
    pSetIngredienteMMostrado: Dispatch<SetStateAction<IItem[]>>,
    pSetDrawerOpen: Dispatch<SetStateAction<boolean>>,
  ) => {
    pSetIngredienteMMostrado([])
    pSetDrawerOpen(false)
  }
  //Fin de manejadores de DetalleInsumo

  //Manejadores de lista de receta
  //..boton quitar elemento de lista de receta
  const handleQuitarIngrediente = (
    code: number,
    pIngredientesR: InvRecipeMix[],
    pSetIngredientesR: Dispatch<SetStateAction<InvRecipeMix[]>>,
  ) => {
    pSetIngredientesR(
      pIngredientesR.filter((item: InvRecipeMix) => item.item_id != code),
    )
  }
  //..boton quitar elemento de lista de receta

  const onInputChange =
    (
      key: string,
      index: number,
      pIngredientesR: InvRecipeMix[],
      pSetIngredientesR: Dispatch<SetStateAction<InvRecipeMix[]>>,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newData = [...pIngredientesR]
      ;(newData[index] as any)[key] = Number(e.target.value)

      console.log('cambio de cantidad key: ' + key + ' index : ' + index)
      console.table(pIngredientesR)
      pSetIngredientesR(pIngredientesR)
    }

  //Fin de manejadores de lista de receta

  //consulta el API urlApi para obtener los insumos y los asigna a pIngredientesMFiltrados
  const IngredientesMSelected = async (
    pCatSelected: number,
    pNeedle: string,
    urlApi: string = '/api/view/recipe/filter/insumos',
    pSetIngredientesMFiltrados: Dispatch<
      SetStateAction<IListaInsumo[] | undefined>
    >,
  ) => {
    //console.log('dato renovado')
    //setNeedle(needle)
    //setCatSelected(catSelected)

    const response = await fetch(
      config.apiV2 +
        urlApi +
        '?cat_selected=' +
        pCatSelected +
        '&needle=' +
        pNeedle,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
        },
      },
    )
    const respuesta = await response.json()

    //console.table(dataFiltered)

    //setIngredientesMFiltrados(respuesta.data)
    pSetIngredientesMFiltrados(respuesta.data)
  } //IngredientesMSelected

  const RecetaProdFinal = () => {
    //Para lista de ingredientes de receta
    const [ingredientesR, setIngredientesR] = useState<InvRecipeMix[]>([])

    //ingredientes filtrados por la busqueda
    const [ingredientesMFiltrados, setIngredientesMFiltrados] = useState<
      IListaInsumo[] | undefined
    >([])

    const [ingredienteMMostrado, setIngredienteMMostrado] = useState<IItem[]>(
      [],
    )

    //los items que forman parte de un ingredienteM con receta o coleccion
    const [, setIngredientesMItems] = useState<IItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)

    /*
    const handleShowItems = async (id: number, oper: number) => {
      //console.log('Id mostrado :' + id)
      //console.table(ingredientesMItems)
      ///items", async (c) => {
      //const param1 = c.req.query("item_id

      if (oper == 1) {
        const response = await fetch(
          config.apiV2 + '/api/view/recipe/items?item_id=' + id,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
            },
          },
        )
        const respuesta = await response.json()

        if (respuesta.data.length >= 1) {
          //
          //setIngredienteMMostrado(estaIngredienteM)
          setIngredienteMMostrado(respuesta.data)
          setDrawerOpen(true)
        }
      }
    }
    //Fin de manejadores de Lista de insumos

    */
    /*
    //Manejadores de DetalleInsumo
    const handleDrawerClose = () => {
      setIngredienteMMostrado([])
      setDrawerOpen(false)
    }
    //Fin de manejadores de DetalleInsumo
    */

    /*
    //Manejadores de lista de receta
    //..boton quitar elemento de lista de receta
    const handleQuitarIngrediente = (code: number) => {
      setIngredientesR(
        ingredientesR.filter((item: InvRecipeMix) => item.id != code),
      )
    }
    //..boton quitar elemento de lista de receta

    const onInputChange =
      (key: string, index: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = [...ingredientesR]
        ;(newData[index] as any)[key] = Number(e.target.value)

        console.log('cambio de cantidad key: ' + key + ' index : ' + index)
        console.table(ingredientesR)
      }

    //Fin de manejadores de lista de receta
    */

    //Inicio de Filtros insumos
    const [catSelected, setCatSelected] = useState(0)
    const [needleR, setNeedleR] = useState('')

    //Inicio de lista de insumos
    //columnas de la tabla de ingredientes disponibles
    const columnsIngredientesM: ColumnsType = [
      {
        title: 'Categoria',
        dataIndex: 'category',
        className: '!p-1',
      },
      {
        title: 'Nombre',
        dataIndex: 'item_name',
        className: '!p-1',
      },
      {
        title: 'Add',
        align: 'center',
        className: '!p-1',
        render: (_, record) => (
          <Button
            onClick={() =>
              handleTransferIngredientesM(
                {
                  id: undefined,
                  product_id: record.product_id,
                  product: record.product_name,
                  category_id: record.category_id,
                  category: record.category_name,
                  recipe_id: undefined,
                  recipe_group: undefined,
                  recipe_base: undefined,
                  recollection_id: record.recollect_id,
                  collection: record.collection_name,
                  item_id: record.item_id,
                  item_name: record.item_name,
                  quantity: undefined,
                  presentation_id: undefined,
                  measure_id: undefined,
                  status: 1,
                } as any,
                undefined,
                ingredientesR,
                setIngredientesR,
              )
            }
          >
            +
          </Button>
        ),
      },
      {
        title: 'Item Id',
        dataIndex: 'item_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Category Name',
        dataIndex: 'category_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Product Id',
        dataIndex: 'product_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Product name',
        dataIndex: 'product_name',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Requiere receta Id',
        dataIndex: 'recipe_req',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Collection Id',
        dataIndex: 'recollect_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Collection name',
        dataIndex: 'collection_name',
        className: '!p-1',
        hidden: true,
      },
    ]

    //Fin de lista de insumos
    /*
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
    
*/
    //constantes para el formulario
    const [form] = Form.useForm()

    const handleGrabarReceta = () => {
      const fecha = form.getFieldValue('fecha')
      const company_id = form.getFieldValue('company_id')
      const menu_item_id = form.getFieldValue('product_id')
      const recipe = form.getFieldValue('recipe_name')
      const save_tag = form.getFieldValue('save_tag')

      //company_id recipe_name product_id save_tag

      console.log('Guardando receta ...' + fecha)
      console.log('Guardando receta ...' + company_id)
      console.log('Guardando receta ...' + menu_item_id)
      console.log('ingredientesR')
      console.table(ingredientesR)
      const nuevaReceta = {
        company_id: company_id,
        menu_item_id: menu_item_id,
        recipe: recipe,
        save_tag: save_tag,
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
        },
        body: JSON.stringify(nuevaReceta),
      }

      fetch(config.apiV2 + '/api/view/recipe/nueva', options)
        .then((data) => {
          if (!data) {
            throw Error(data)
          }
          return data.json()
        })
        .then((nuevaReceta) => {
          console.log('creacion cabecera')
          console.log(nuevaReceta)
          //guardando detalle
          console.log('guardando detalle de receta')
          //detalle de receta con items con id de receta recien creada
          console.log('recipe_id : ' + nuevaReceta.data[0].id)

          const data2 = ingredientesR.map((ingrediente) => {
            return {
              id: undefined,
              item_name: ingrediente.item_name,
              recipe_id: nuevaReceta.data[0].id,
              recipe_group: undefined,
              recipe_base: undefined,
              item_id: ingrediente.item_id,
              quantity: ingrediente.quantity,
              presentation_id: undefined,
              measure_id: undefined,
              status: 1,
            }
          })

          const options_det = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
            },
            body: JSON.stringify(data2),
          }

          fetch(
            config.apiV2 + '/api/view/recipe/nueva-detalle',
            options_det,
          ).then((data2) => {
            if (!data2) {
              throw Error(data2)
            }
            return data2.json()
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
    useEffect(() => {
      //console.log('componente renderizado')
      /*
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
      */

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
              form={form}
              labelCol={{ span: 6 }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
            >
              <div className="grid grid-cols-12 gap-2 items-start">
                <Form.Item
                  className="col-span-8 mb-1"
                  label="Compañía"
                  name="company_id"
                >
                  <CompanySelectForm />
                </Form.Item>

                <Form.Item
                  className="col-span-4 mb-1"
                  label="Fecha"
                  name="fecha"
                >
                  <DatePicker />
                </Form.Item>

                <Form.Item
                  className="col-span-12 mb-1"
                  label="Nombre de receta"
                  name="recipe_name"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  className="col-span-12 mb-1"
                  label="Producto de venta"
                  name="product_id"
                >
                  <ProductSelectForm />
                </Form.Item>

                <Form.Item
                  className="col-span-12 mb-1"
                  label="Etiquetar como"
                  name="save_tag"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="col-span-12 mb-1"
                  label="Ingredientes"
                ></Form.Item>
              </div>
            </Form>
            <ListaIngredientes
              pIngredientesR={ingredientesR}
              pQuitarIngrediente={handleQuitarIngrediente}
              pOnInputChange={onInputChange}
              pSetIngredientesR={setIngredientesR}
            />
            <Button type="primary" onClick={handleGrabarReceta}>
              Guardar
            </Button>
          </Card>

          {/* Fin de lista de ingredientes de receta  */}
        </div>
        <div className="flex-1 w-64 ...">
          {/*Inicio de filtros de insumos*/}
          {/* Caja de busqueda */}
          <Input.Search
            size="large"
            value={needleR}
            allowClear
            onSearch={() =>
              IngredientesMSelected(
                catSelected,
                needleR,
                undefined,
                setIngredientesMFiltrados,
              )
            }
            placeholder="buscar colección, ingredientes"
            onChange={(e) => handleNeedle(e, setNeedleR)}
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
              onClick={() => handlePredefinedFilters(22, setCatSelected)}
            >
              Colección
            </Button>
            <Button
              // color="default"
              // variant="solid"
              onClick={() => handlePredefinedFilters(9, setCatSelected)}
            >
              Quesos
            </Button>
            <Button onClick={() => handlePredefinedFilters(2, setCatSelected)}>
              Pizzas
            </Button>
            <Button onClick={() => handlePredefinedFilters(4, setCatSelected)}>
              Complementos
            </Button>
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
                    if (record.product_id !== null && record.recipe_req == 1)
                      handleShowItems(
                        record.product_id,
                        1,
                        undefined,
                        setIngredienteMMostrado,
                        setDrawerOpen,
                      )
                    if (record.recollect_id !== null)
                      handleShowItems(
                        record.product_id,
                        2,
                        undefined,
                        setIngredienteMMostrado,
                        setDrawerOpen,
                      )
                    /*
                  if (record.product_id!==null && record.recipe_req==1)
                    handleShowItems(record.product_id,1)
                  */
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
            drawerClose={() =>
              handleDrawerClose(setIngredienteMMostrado, setDrawerOpen)
            }
            oper={4}
          />
        </div>
      </div>
    )
  }

  const ColeccionIngredientes = () => {
    //constantes para el formulario de Coleccion
    const [form2] = Form.useForm()

    const [ingredienteMMostradoC, setIngredienteMMostradoC] = useState<IItem[]>(
      [],
    )
    //los items que forman parte de un ingredienteM con receta o coleccion
    //const [, setIngredientesMItems2] = useState<IItem[]>([])
    const [drawerOpenC, setDrawerOpenC] = useState(false)

    //manejador de BasedOn
    const handleChangeBasedOn = (value: string) => {
      console.log('based on' + value)
    }

    //Para lista de ingredientes de receta
    const [ingredientesC, setIngredientesC] = useState<InvRecipeMix[]>([])

    //Manejadores de lista de receta
    //..boton quitar elemento de lista de receta
    const handleQuitarIngrediente2 = (code: number) => {
      setIngredientesR(
        ingredientesR.filter((item: InvRecipeMix) => item.id != code),
      )
    }
    //..boton quitar elemento de lista de receta de coleccion

    const onInputChange2 =
      (key: string, index: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = [...ingredientesR]
        ;(newData[index] as any)[key] = Number(e.target.value)

        console.log('cambio de cantidad key: ' + key + ' index : ' + index)
        console.table(ingredientesR)
      }

    //Fin de manejadores de lista de receta de coleccion

    //grabar coleccion
    const handleGrabarReceta2 = () => {
      /*
      SELECT `inv_recollection`.`id`,
    `inv_recollection`.`company_id`,
    `inv_recollection`.`collection`,
    `inv_recollection`.`based_on`,
    `inv_recollection`.`is_base`,
    `inv_recollection`.`factor`,
    `inv_recollection`.`status`,
    `inv_recollection`.`created_at`,
    `inv_recollection`.`updated_at`
FROM `db_erpraul_v1`.`inv_recollection`;

      */
      const fecha = form2.getFieldValue('fecha')
      const company_id = form2.getFieldValue('company_id')
      const collection = form2.getFieldValue('collection')
      const based_on = form2.getFieldValue('based_on')
      const is_base = 1
      const factor = form2.getFieldValue('factor')
      const status = 1

      //company_id recipe_name product_id save_tag

      console.log('Guardando receta ...' + fecha)
      console.log('Guardando receta ...' + company_id)
      console.log('Guardando receta ...' + based_on)
      console.log('ingredientesR')
      console.table(ingredientesR)
      const nuevaColeccion: InvRecollection = {
        company_id: company_id,
        collection: collection,
        based_on: based_on,
        is_base: is_base,
        factor: factor,
        status: status,
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
        },
        body: JSON.stringify(nuevaColeccion),
      }

      options + ''
      /*
      fetch(config.apiV2 + '/api/view/recipe/nueva-coleccion', options)
        .then((data) => {
          if (!data) {
            throw Error(data)
          }
          return data.json()
        })
        .then((nuevaColeccion) => {
          console.log('creacion cabecera')
          console.log(nuevaColeccion)
          //guardando detalle
          console.log('guardando detalle de receta')
          //detalle de receta con items con id de receta recien creada
          console.log('recipe_id : ' + nuevaColeccion.data[0].id)

          const data2 = ingredientesR.map((ingrediente) => {
            return {
              id: undefined,
              recollection_id: nuevaColeccion.data[0].id, //ingrediente.item_name,
              item_id: ingrediente.item_id,
              quantity: ingrediente.quantity,
              presentation_id: undefined,
              measure_id: undefined,
              status: 1,
            }
          })

          const options_det = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
            },
            body: JSON.stringify(data2),
          }

          fetch(
            config.apiV2 + '/api/view/recipe/nueva-coleccion-detalle',
            options_det,
          ).then((data2) => {
            if (!data2) {
              throw Error(data2)
            }
            return data2.json()
          })
        })
        .catch((e) => {
          console.log(e)
        })
        */
    }
    //fin de grabar coleccion

    //inicio de filtro de insumos - coleccion
    const [catSelected, setCatSelected] = useState(0)
    const [needle, setNeedle] = useState('')

    //ingredientes filtrados por la busqueda
    const [ingredientesMFiltradosC, setIngredientesMFiltradosC] = useState<
      IListaInsumo[] | undefined
    >([])

    //.. childToParent es una funcion que es enviada porel padre para
    //.. que desde el hijo se envien datos

    //.. manejador de eventos de la caja de busqueda

    //Fin de Filtros insumos - coleccion

    /*
    //Inicio de manejadores de Lista de insumos
    const IngredientesMSelected2 = async (
      pCatSelected: number,
      pNeedle: string,
    ) => {
      const response = await fetch(
        config.apiV2 +
          '/api/view/recipe/filter/insumos?cat_selected=' +
          pCatSelected +
          '&needle=' +
          pNeedle,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
          },
        },
      )
      const respuesta = await response.json()

      setIngredientesMFiltrados2(respuesta.data)
    }
    */
    /*
    const handleShowItems2 = async (id: number, oper: number) => {
      if (oper == 1) {
        const response = await fetch(
          config.apiV2 + '/api/view/recipe/items?item_id=' + id,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
            },
          },
        )
        const respuesta = await response.json()

        if (respuesta.data.length >= 1) {
          //
          //setIngredienteMMostrado(estaIngredienteM)
          setIngredienteMMostrado2(respuesta.data)
          setDrawerOpen2(true)
        }
      }
    }
    */

    /*
    const handleTransferIngredientesM2 = async (record: InvRecipeMix) => {
      //console.log('Código :')
      //console.table(record)

      //validar que no este presente el ingrediente en la lista
      
      let estaIngrediente: boolean = false

      //validar si el item encontrado tiene receta
      //TODO : esto se reducira a la validacion de un solo campo

      let recipe_req: number = 0
      let product_id = undefined
      let recollection_id = undefined

      if (record.product_id === null || record.product_id === undefined) {
        product_id = null
        recipe_req = 0
      } else {
        product_id = record.product_id
        recipe_req = 1
      }

      if (
        record.recollection_id === null ||
        record.recollection_id === undefined
      )
        recollection_id = null
      else recollection_id = record.recollection_id

      if (product_id === null && recollection_id === null) {
        product_id = -1
        recollection_id = -1
      }
      
      //aqui va el fetch duplicado por mientras
      const response = await fetch(
        config.apiV2 +
          '/api/view/recipe/items?product_id=' +
          product_id +
          '&recipe_req=' +
          recipe_req +
          '&recollection_id=' +
          recollection_id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('tk_admin')}`,
          },
        },
      )
      const respuesta = await response.json()
      //Lista de insumo de producto con receta
      const listaInsumos = respuesta.data
      const tempItems2: IItem[] = listaInsumos.map((i: any) => {
        const j: IItem = {
          id: i.id,
          item_name: i.item_name,
          status: i.status,
        }

        return j
      })

      //console.log('Lista insumos')
      //console.log(tempItems2.length)
      //console.table(tempItems2)
      //Fin TODO
      //validar el flag que indica que el item tiene receta
      if (tempItems2.length >= 1) {
        //agregar varios items

        for (let i = 0; i < ingredientesR.length; i++) {
          estaIngrediente = listaInsumos.some(
            (i2: IItem) => i2.id === ingredientesR[i].item_id,
          )
          if (estaIngrediente) break
        }

        //Si en la lista de ingredientes (derecha) no esta ningun
        //item del item(con receta) por agregar
        //entonces se agrega a esa lista

        const ingredienteInsumo: InvRecipeMix[] = tempItems2.map(
          (insumo: IItem) => {
            return {
              id: undefined,
              recipe_id: undefined,
              recipe_group: undefined,
              recipe_base: undefined,
              item_name: insumo.item_name,
              item_id: insumo.id,
              quantity: undefined,
              presentation_id: undefined,
              measure_id: undefined,
              status: 1,
            }
          },
        )
        if (!estaIngrediente) {
          setIngredientesR([...ingredientesR, ...ingredienteInsumo])
        }
      } else {
        //validar que no este presente el ingrediente en la lista
        //console.log('item single')
        //console.table(record)
        estaIngrediente = ingredientesR.some(
          (i: InvRecipeMix) => i.item_id == record.id,
        )

        if (!estaIngrediente) {
          setIngredientesR([
            ...ingredientesR,
            {
              id: undefined,
              recipe_id: undefined,
              recipe_group: undefined,
              recipe_base: undefined,
              item_name: (record as any).product,
              item_id: (record as any).id,
              quantity: undefined,
              presentation_id: undefined,
              measure_id: undefined,
              status: 1,
            },
          ])
        }
      }
    }
    */

    //fin de manejadores de Lista de insumos

    /*
    //Manejadores de DetalleInsumo
    const handleDrawerClose2 = () => {
      setIngredienteMMostrado2([])
      setDrawerOpen2(false)
    }
    //Fin de manejadores de DetalleInsumo
    */

    //columnas de la tabla de ingredientes disponibles
    const columnsIngredientesM2: ColumnsType = [
      {
        title: 'Id',
        dataIndex: 'id',
        className: '!p-1',
        hidden: true,
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Categoria',
        dataIndex: 'category',
        className: '!p-1',
      },
      {
        title: 'Nombre',
        dataIndex: 'item_name',
        className: '!p-1',
      },
      {
        title: 'Add',
        align: 'center',
        className: '!p-1',
        render: (_, record) => (
          <Button
            onClick={() =>
              handleTransferIngredientesM(
                {
                  id: undefined,
                  product_id: record.product_id,
                  product: record.product_name,
                  category_id: record.category_id,
                  category: record.category_name,
                  recipe_id: undefined,
                  recipe_group: undefined,
                  recipe_base: undefined,
                  recollection_id: record.recollect_id,
                  collection: record.collection_name,
                  item_id: record.item_id,
                  item_name: record.item_name,
                  quantity: undefined,
                  presentation_id: undefined,
                  measure_id: undefined,
                  status: 1,
                } as any,
                undefined,
                ingredientesC,
                setIngredientesC,
              )
            }
          >
            +
          </Button>
        ),
      },
      {
        title: 'Item Id',
        dataIndex: 'item_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Category Name',
        dataIndex: 'category_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Product Id',
        dataIndex: 'product_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Product name',
        dataIndex: 'product_name',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Requiere receta Id',
        dataIndex: 'recipe_req',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Collection Id',
        dataIndex: 'recollect_id',
        className: '!p-1',
        hidden: true,
      },
      {
        title: 'Collection name',
        dataIndex: 'collection_name',
        className: '!p-1',
        hidden: true,
      },
    ]

    return (
      <div className="flex">
        <div className="flex-1 w-64 ...">
          {/* Inicio de lista de ingredientes de receta */}
          <Card hoverable style={gridStyle}>
            <Form
              form={form2}
              labelCol={{ span: 6 }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
            >
              <div className="grid grid-cols-12 gap-2 items-start">
                <Form.Item
                  className="col-span-8 mb-1"
                  label="Compañía"
                  name="company_id"
                >
                  <CompanySelectForm />
                </Form.Item>

                <Form.Item
                  className="col-span-4 mb-1"
                  label="Fecha"
                  name="fecha"
                >
                  <DatePicker />
                </Form.Item>

                <Form.Item
                  className="col-span-12 mb-1"
                  label="Nombre de colección"
                  name="collection"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  className="col-span-8 mb-1"
                  label="Basado en"
                  name="based_on"
                >
                  <Select
                    defaultValue="NNN"
                    style={{ width: 120 }}
                    onChange={handleChangeBasedOn}
                    options={[
                      { value: 'FLV', label: 'Sabor' },
                      { value: 'SZE', label: 'Tamaño' },
                      { value: 'NNN', label: 'Ninguno' },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  className="col-span-12 mb-1"
                  label="Factor"
                  name="factor"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className="col-span-12 mb-1"
                  label="Ingredientes"
                ></Form.Item>
              </div>
            </Form>
            <ListaIngredientes
              pIngredientesR={ingredientesC}
              pQuitarIngrediente={handleQuitarIngrediente}
              pOnInputChange={onInputChange}
              pSetIngredientesR={setIngredientesC}
            />
            <Button type="primary" onClick={handleGrabarReceta2}>
              Guardar
            </Button>
          </Card>

          {/* Fin de lista de ingredientes de receta  */}
        </div>
        <div className="flex-1 w-64 ...">
          {/*Inicio de filtros de insumos*/}
          {/* Caja de busqueda */}
          <Input.Search
            size="large"
            value={needle}
            allowClear
            onSearch={() =>
              IngredientesMSelected(
                catSelected,
                needle,
                undefined,
                setIngredientesMFiltradosC,
              )
            }
            placeholder="buscar colección, ingredientes"
            onChange={(e) => handleNeedle(e, setNeedle)}
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
              onClick={() => handlePredefinedFilters(22, setCatSelected)}
            >
              Colección
            </Button>
            <Button
              // color="default"
              // variant="solid"
              onClick={() => handlePredefinedFilters(9, setCatSelected)}
            >
              Quesos
            </Button>
            <Button onClick={() => handlePredefinedFilters(2, setCatSelected)}>
              Pizzas
            </Button>
            <Button onClick={() => handlePredefinedFilters(4, setCatSelected)}>
              Complementos
            </Button>
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
                    if (record.product_id !== null && record.recipe_req == 1)
                      handleShowItems(
                        record.product_id,
                        1,
                        undefined,
                        setIngredienteMMostradoC,
                        setDrawerOpenC,
                      )
                    if (record.recollect_id !== null)
                      handleShowItems(
                        record.product_id,
                        2,
                        undefined,
                        setIngredienteMMostradoC,
                        setDrawerOpenC,
                      )
                    /*
                  if (record.product_id!==null && record.recipe_req==1)
                    handleShowItems(record.product_id,1)
                  */
                  }, // click row
                }
              }}
              className="w-97 relative z-10"
              rowKey={(el) => el.id}
              size="small"
              bordered={true}
              pagination={false}
              columns={columnsIngredientesM2}
              dataSource={ingredientesMFiltradosC}
            />
          </Card>
          {/* Fin de lista de insumos de petaña colección*/}

          {/* Drawer con detalle de insumo con receta */}
          <DetalleInsumo
            data={ingredienteMMostradoC}
            drawerOpen={drawerOpenC}
            drawerClose={() =>
              handleDrawerClose(setIngredienteMMostradoC, setDrawerOpenC)
            }
            oper={4}
          />
        </div>
      </div>
    )
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
