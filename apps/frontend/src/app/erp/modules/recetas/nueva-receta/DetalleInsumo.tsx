import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, List, Space } from 'antd'
import { useState } from 'react'
import { InsumoItem } from '../shared-types'

export const DetalleInsumo = ({
  data,
  drawerOpen,
  drawerClose,
  oper,
}: {
  data: InsumoItem[]
  drawerOpen: boolean
  drawerClose: () => void
  oper: number
}) => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true)
  const [drawerOpenInterno, setDrawerOpenInterno] =
    useState<boolean>(drawerOpen)
  const [operInterno, setOperInterno] = useState<number>(oper)
  let textoBotonOper: string = 'Cerrar'
  let modoEdicion: boolean = false

  if (oper == 1) {
    console.log('Oper 1')
  }
  if (oper == 3) {
    console.log('Oper 3')
    textoBotonOper = 'Editar'
    modoEdicion = true
    //setComponentDisabled(false)
  }

  const handleChangeCDisabled = () => {
    //setComponentDisabled(!componentDisabled)
    console.log('oper int : ' + operInterno)
    //setDrawerOpenInterno(false)
    if (oper == 2) setOperInterno(3)
  }

  const handleCancelar = () => {
    //setComponentDisabled(!componentDisabled)
    console.log('set drawer int : ' + drawerOpenInterno)
    //setDrawerOpenInterno(false)
    if (oper == 2) setOperInterno(2)
    if (oper == 4) setOperInterno(4)
  }

  const guardarItemsProducto = () => {
    console.log('Guardando items de producto')
  }
  return (
    <Drawer open={drawerOpen} onClose={drawerClose}>
      {operInterno == 1 ? (
        <div>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <Form.List name="users">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[
                          { required: true, message: 'Falta ingresar nombre' },
                        ]}
                      >
                        <Input placeholder="Nombre" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'flavor']}
                        rules={[
                          { required: true, message: 'Falta ingresar sabor' },
                        ]}
                      >
                        <Input placeholder="Sabor" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Agregar ingrediente
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Space>
              <Button onClick={guardarItemsProducto}>Guardar</Button>

              <Button onClick={handleCancelar}>Cancelar</Button>
            </Space>
          </Form>
        </div>
      ) : null}

      {operInterno == 2 || operInterno == 4 ? (
        <div>
          <List
            size="small"
            header={<div>Receta de : </div>}
            footer={<div></div>}
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item.product}</List.Item>}
          ></List>
        </div>
      ) : null}

      {operInterno == 3 ? (
        <div>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            {data.map((item2) => (
              <div key={item2.id}>
                <Form.Item label="Nombre">
                  <Input defaultValue={item2.product} />
                </Form.Item>
                <Form.Item label="Sabor">
                  <Input defaultValue={item2.flavor_id} />
                </Form.Item>
              </div>
            ))}
            <Space>
              <Button onClick={guardarItemsProducto}>Guardar</Button>

              <Button onClick={handleCancelar}>Cancelar</Button>
            </Space>
          </Form>
        </div>
      ) : null}

      {operInterno == 2 ? (
        <div>
          <Button onClick={handleChangeCDisabled}>Editar</Button>
        </div>
      ) : null}
    </Drawer>
  )
}
