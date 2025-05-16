// catalog-maintenance/components/EditRecipeBaseDrawer.tsx
import { EditDrawer } from './EditDrawer'
import { IRecipeBase } from '../../shared/types'

interface Props {
  open: boolean
  onClose: () => void
  recipe: IRecipeBase | null
  onSubmit: (updated: IRecipeBase) => void
  loading?: boolean
}

export const EditRecipeBaseDrawer = ({ open, onClose, recipe, onSubmit, loading }: Props) => {
  const fields = [
    {
      name: 'title',
      label: 'Nombre de receta',
      type: 'text' as const,
      required: true
    },
    {
      name: 'product_size_id',
      label: 'Tamaño ID',
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

  const handleSubmit = (values: Partial<IRecipeBase>) => {
    if (recipe) {
      onSubmit({ ...recipe, ...values })
    }
  }

  return (
    <EditDrawer<IRecipeBase>
      open={open}
      onClose={onClose}
      initialValues={recipe}
      fields={fields}
      onSubmit={handleSubmit}
      loading={loading}
      title="Editar receta base"
    />
  )
}
