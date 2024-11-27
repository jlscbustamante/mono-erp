export interface ItemDispatchToda {
  sucursalId: string
  sucursalName: string
  moveAt: string
  open: boolean
}

export interface IDispatchBase {
  id: string
  product_id: number
  item_id: number
  item_name: string
  measure_id: number
  presentation_id: number
  unit_value: string
  quantity: string
  total_value: string
}
