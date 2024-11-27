import { Dispatch, DispatchItem } from '../entities/dispatch'

export interface DispatchItemCreateDto
  extends Omit<DispatchItem, 'id' | 'measureCode'> {
  id?: number
}

export interface DispatchCreateDto extends Omit<Dispatch, 'items' | 'id'> {
  items: DispatchItemCreateDto[]
}
