import { TemplateType } from '@/data/products/sdk'

export const getTemplateTypeName = (type: TemplateType) => {
  switch (type) {
    case TemplateType.Store:
      return 'Pedido y despacho'
    case TemplateType.Warehouse:
      return 'Almacen Huaca Palao'
  }
  return ''
}
