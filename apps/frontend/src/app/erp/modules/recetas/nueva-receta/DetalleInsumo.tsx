import { Button, Checkbox, Drawer, Form, Input, List, Space } from 'antd'
import { useState } from 'react'
import { InsumoItem } from './types'

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
  const [componentDisabled, setComponentDisabled] = useState<boolean>(oper != 2)
  let textoBotonOper: string = 'Cerrar'
  let modoEdicion: boolean = false

  if (oper == 2) {
    console.log('Oper 2')
    textoBotonOper = 'Editar'
    modoEdicion = true
    //setComponentDisabled(false)
  }

  const handleChangeCDisabled = () => {
    setComponentDisabled(!componentDisabled)
  }

  const guardarItemsProducto = () => {
    console.log('Guardando items de producto')
  }
  return (
    <Drawer open={drawerOpen} onClose={drawerClose}>
      {componentDisabled ? (
        <div>
          <List
            size="small"
            header={<div>Receta de : </div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item.product}</List.Item>}
          ></List>
        </div>
      ) : null}

      {componentDisabled && oper == 2 ? (
        <Form.Item label="Button">
          <Button onClick={handleChangeCDisabled}>Editar</Button>
        </Form.Item>
      ) : null}

      {!componentDisabled && oper == 2 ? (
        <div>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            disabled={componentDisabled}
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
              <Checkbox>Checkbox</Checkbox>
            </Form.Item>
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

              <Button onClick={handleChangeCDisabled}>Cancelar</Button>
            </Space>
          </Form>
        </div>
      ) : null}
    </Drawer>
  )
}
