export interface IIamRole {
  id: number
  name: number
  status: string
  created_at: string
  updated_at: string
}
export interface IFilterIamRole {
  id?: number
  name?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export interface ICreateIamRole extends IIamRole {
  id: any
}
