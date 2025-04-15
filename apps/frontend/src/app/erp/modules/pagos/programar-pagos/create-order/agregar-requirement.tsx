import { Drawer } from 'antd'
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
      title="Agregar requerimiento"
      width={720}
    >
      <div>Na</div>
    </Drawer>
  )
}
