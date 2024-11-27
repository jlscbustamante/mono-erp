import { Stock } from '../entities'

export interface StockItemToCreateDto extends Omit<Stock, 'id'> {}
