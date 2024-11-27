export enum CourierVehicle {
  BIKE = 'B',
  CAR = 'A',
  MOTORCYCLE = 'M',
}

export enum CourierShift {
  FULLTIME = 'FT',
  PARTTIME = 'PT',
}

export enum DocType {
  DNI = 'DNI',
}

export interface ICourier {
  id: number
  name: string
  email: string
  doc_type: null | DocType
  doc_number: null | string
  vehicle: null | CourierVehicle
  plate: null | string
  phone: string
  shift_hired: CourierShift
  status: number
  store_name: string
  store_code: string
}

export interface ICreateCourier extends Omit<ICourier, 'id' | 'store_name'> {
  password: string
  store_id: string
}
export interface IUpdateCourier extends Omit<ICourier, 'store_name'> {
  store_id?: string
}

export const getDocTypeName = (type: DocType) => {
  switch (type) {
    case DocType.DNI:
      return 'DNI'
  }
}

export const getShiftName = (shift: CourierShift) => {
  switch (shift) {
    case CourierShift.FULLTIME:
      return 'Tiempo completo'
    case CourierShift.PARTTIME:
      return 'Medio tiempo'
  }
}
