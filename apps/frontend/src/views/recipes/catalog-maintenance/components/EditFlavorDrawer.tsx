import { EditDrawer } from './EditDrawer'
import { IProductFlavor } from '../../shared/types'

interface Props {
  open: boolean
  onClose: () => void
  flavor: IProductFlavor | null
  onSubmit: (updated: IProductFlavor) => void
  loading?: boolean
}

export const EditFlavorDrawer = ({ open, onClose, flavor, onSubmit, loading }: Props) => {
  const fields = [
    {
      name: 'flavor',
      label: 'Nombre del sabor',
      type: 'text' as const,
      required: true
    },
    {
      name: 'menuflav_id',
      label: 'MenuFlavor ID',
      type: 'number' as const,
      required: true
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select' as const,
      required: true,
      options: [
        { value: 1, label: 'Activo' },
        { value: 0, label: 'Inactivo' }
      ]
    }
  ]

  const handleSubmit = (values: Partial<IProductFlavor>) => {
    if (flavor) {
      onSubmit({ ...flavor, ...values })
    }
  }

  return (
    <EditDrawer<IProductFlavor>
      open={open}
      onClose={onClose}
      initialValues={flavor}
      fields={fields}
      onSubmit={handleSubmit}
      loading={loading}
      title="Editar sabor"
    />
  )
}
