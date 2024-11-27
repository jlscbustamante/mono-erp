import { Dispatch, DispatchItem } from '../entities/dispatch'

export interface DispatchItemAddDto
  extends Omit<DispatchItem, 'id' | 'measureCode'> {
  id?: number
}
export interface DispatchUpdateDto extends Omit<Dispatch, 'items'> {
  items: DispatchItemAddDto[]
}
