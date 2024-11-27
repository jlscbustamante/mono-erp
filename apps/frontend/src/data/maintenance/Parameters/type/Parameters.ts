import { ParameterRol } from './rol'
import { ParametersStatus } from './status'

export interface IParameter {
  id: number
  type: string
  name: string
  value: string
  role: ParameterRol
  status: ParametersStatus
  created_at: string
}
export interface ICreateParameter extends Omit<IParameter, 'id'> {
  id: any
}
export interface IFilterParameter {
  id?: number
  type?: string
  name?: string
  value?: string
  role?: ParameterRol
  status?: ParametersStatus
}
