import { Drawer, List } from 'antd'

export const DetalleInsumo = ({ data, drawerOpen, drawerClose }) => {
  return (
    <Drawer open={drawerOpen} onClose={drawerClose}>
      <List
        size="small"
        header={<div>Receta de : </div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item.product}</List.Item>}
      ></List>
    </Drawer>
  )
}
