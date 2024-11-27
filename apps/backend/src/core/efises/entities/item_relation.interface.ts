import { UnitMeasure } from './unit_measure.interface'

export interface ItemRelation {
  id: number
  name: string
  price: number
  itemId: number
  unitMeasureCode: string
  measure: UnitMeasure
}
