export const calculateCurrent = (
  isWarehouse: boolean,
  props: {
    initialStock: number
    quantityInMv: number
    quantityOutMv: number
    quantityInDispatch: number
    quantityOutDispatch: number
    quantityInPurchase: number
  },
): number => {
  let current = 0
  if (isWarehouse) {
    current =
      props.initialStock + props.quantityInPurchase - props.quantityOutDispatch
  } else {
    current =
      props.initialStock +
      props.quantityInDispatch +
      props.quantityInMv -
      props.quantityOutMv
  }
  return current
}
