import { SaleItem } from '../domain/sale_item'

export interface SaleItemCreateDto
  extends Pick<
    SaleItem,
    'saleAt' | 'productId' | 'productName' | 'productQuantity' | 'productSize'
  > {}
