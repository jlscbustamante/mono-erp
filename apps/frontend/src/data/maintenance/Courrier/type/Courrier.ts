import { Shift } from '../shift/shift'
import { CourrierStatus } from '../status/status'
import { CourrierVehicule } from '../vehicle/vehicle'

export interface ICourrier {
  id: number
  name: string
  email: string
  password: string
  doc_type: string
  doc_number: string
  vehicle: CourrierVehicule
  plate: string
  phone: string
  shift_hired: Shift
  stores?: number
  status: CourrierStatus
  created_at?: string
  updated_at?: string
}

export interface ICreateCourrier extends ICourrier {
  id: any
}

export interface IUpdateCourrier {
  id: any
  password: string
}
