import { Button } from 'antd'
import { useCreateWarehouse } from './create-drawer'

export const WarehouseHeader = () => {
  const { open } = useCreateWarehouse()
  return (
    <div className="flex justify-between items-center mb-3">
      <div></div>
      <Button type="primary" onClick={open}>
        Nuevo
      </Button>
    </div>
  )
}
