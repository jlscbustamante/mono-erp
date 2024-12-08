import { InvStock } from 'pizzadb'
import { StockItemToCreateDto } from '../../dto'
import { StockGeneral } from '../stock'

export interface StockRepository {
  getStockByDate(
    warehouseCode: string,
    date: string,
  ): Promise<{
    stock: StockGeneral[]
    lastClosed: string | null
    warehouseName: string
    isEmpty: boolean
  }>
  getRangeStock(
    warehouseCode: string,
    start: string,
    end: string,
  ): Promise<{
    stock: StockGeneral[]
    lastClosed: string | null
    warehouseName: string
  }>
  getLastClosedStock(warehouseCode: string): Promise<StockGeneral[] | null>

  getLastClosedDate(warehouseCode: string): Promise<string | null>
  getLastInfoWarehouse(warehouseCode: string): Promise<{
    lastClosed: string | null
    warehouseName: string
    isWarehouse: boolean
  }>

  getInvStockFromStockCreate(
    stock: StockItemToCreateDto[],
    date: string,
  ): InvStock[]

  saveStock(
    stock: StockItemToCreateDto[],
    date: string,
    warehouseCode: string,
  ): Promise<void>

  saveMultipleStock(
    stock: StockItemToCreateDto[],
    date: string,
    warehouses: string[],
  ): Promise<void>

  rangeStockByDate(props: {
    warehouseCode: string
    start: string
    end: string
  }): Promise<StockGeneral[][]>

  getFinalValueStock(warehouseId: string, date: string): Promise<number>
  hasBeforeStock(warehouseId: string, date: string): Promise<boolean>
}
