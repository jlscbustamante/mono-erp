import {
  DispatchCreateDto,
  DispatchUpdateDto,
  MoveBetweenStoresDto,
} from '../../dto'
import {
  Dispatch,
  DISPATCH_STATUS,
  DispatchLegal,
  DispatchRoute,
} from '../dispatch'

export interface DispatchRepository {
  getOne(id: number): Promise<Dispatch | null>
  getDispatchesRoute(date: string, route: string): Promise<DispatchRoute[]>
  getOneLegalDispatch(id: number): Promise<DispatchLegal | null>
  changeStatus(id: number, status: DISPATCH_STATUS): Promise<void>
  saveDispatch(dispatchUpdate: DispatchUpdateDto, user?: string): Promise<void>
  createDispatch(
    dispatchCreate: DispatchCreateDto,
    user?: string,
  ): Promise<number>

  createMovement(
    movement: MoveBetweenStoresDto,
    status: DISPATCH_STATUS,
    user?: string,
  ): Promise<number>

  countPendingDispatchBeforeAt(
    date: string,
    warehouseId: string,
  ): Promise<number>
}
