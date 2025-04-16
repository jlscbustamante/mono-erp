import { SearchOutlined } from '@ant-design/icons'
import { Button, Divider, Drawer, Input } from 'antd'
import { atom, useAtom } from 'jotai'

const drawerAtom = atom(false)

export const useAgregarRequerimiento = () => {
  const [open, setOpen] = useAtom(drawerAtom)
  return {
    isOpen: open,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((prev) => !prev),
  }
}

export const AgregarRequerimiento = () => {
  const { isOpen, close } = useAgregarRequerimiento()
  return (
    <Drawer
      onClose={close}
      open={isOpen}
      title="Agregar requerimiento para pago"
      width={450}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Ruc:</p>
          <Input placeholder="" />
          <Button
            className="rounded-full"
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Razón social:</p>
          <Input />
          <Button
            className="rounded-full"
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Factura N°:</p>
          <Input />
          <Button
            className="rounded-full"
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
          />
        </div>
      </div>
      <Divider />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Tipo documento:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">N° documento:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Detalle de pago:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Importe:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Ruc:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Razón social:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">Tipo cuenta:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">N° cuenta:</p>
          <Input />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-24 shrink-0">CCI:</p>
          <Input />
        </div>
        <div className="flex justify-end">
          <Button type="primary">Agregar</Button>
        </div>
      </div>
    </Drawer>
  )
}
